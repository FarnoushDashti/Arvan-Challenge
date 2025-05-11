<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../axios'

const route = useRoute()
const router = useRouter()
const title = ref('')
const description = ref('')
const body = ref('')
const selectedTags = ref([])
const tags = ref([])
const titleError = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const newTag = ref('')
const tagError = ref('')
const disabledTags = ref([])

onMounted(async () => {
  try {
    // Fetch both tags and article data
    const [{ data: tagData }, { data: articleData }] = await Promise.all([
      axios.get('/tags'),
      axios.get(`/articles/${route.params.slug}`)
    ])
    
    // Set all available tags from server
    const serverTags = (tagData.tags || []).sort((a, b) => a.localeCompare(b))
    
    // Set article data
    title.value = articleData.article.title
    description.value = articleData.article.description
    body.value = articleData.article.body
    
    // Find tags that are only in the article (user-added tags)
    const articleOnlyTags = articleData.article.tagList.filter(tag => !serverTags.includes(tag))
    
    // Set selected tags and disabled tags
    selectedTags.value = [...articleData.article.tagList]
    disabledTags.value = [...articleOnlyTags]
    
    // Combine server tags and article-only tags for display
    tags.value = [...serverTags, ...articleOnlyTags].sort((a, b) => a.localeCompare(b))
  } catch (err) {
    errorMsg.value = 'Error loading article data'
    console.error('Error:', err)
  }
})

async function handleSubmit() {
  titleError.value = !title.value.trim()
  if (titleError.value) return
  loading.value = true
  errorMsg.value = ''
  
  try {
    const tagList = [...new Set(selectedTags.value)]
    
    const articleData = {
      article: {
        title: title.value.trim(),
        description: description.value,
        body: body.value,
        tagList
      }
    }
    
    const response = await axios.put(`/articles/${route.params.slug}`, articleData)
    if (window.toastRef && typeof window.toastRef.showToast === 'function') {
      window.toastRef.showToast('Article updated successfuly', 'success')
    }
    router.push('/')
  } catch (err) {
    errorMsg.value = err.response?.data?.errors?.body?.[0] || 'Error updating article.'
  } finally {
    loading.value = false
  }
}

function handleAddTag(e) {
  if (e.key !== 'Enter') return
  e.preventDefault()
  const tag = newTag.value.trim()
  
  if (!tag || selectedTags.value.includes(tag)) {
    tagError.value = 'Tag is empty or already exists.'
    return
  }
  
  // Add tag to selected tags and disabled tags
  selectedTags.value.push(tag)
  disabledTags.value.push(tag)
  
  // Add tag to the display list (but not to the server tags)
  if (!tags.value.includes(tag)) {
    tags.value.push(tag)
    tags.value.sort((a, b) => a.localeCompare(b))
  }
  
  newTag.value = ''
  tagError.value = ''
}
</script>
<template>
  <div class="flex flex-col md:flex-row gap-6 min-h-screen bg-[#F5F6FA] p-4">
    <div class="flex-1 bg-white rounded-xl shadow-lg p-8 px-0 md:w-3/5">
      <h2 class="text-2xl font-bold mb-6 p-6">Edit article</h2>
      <div class="border-b border-b-zinc-200"></div>
      <form @submit.prevent="handleSubmit" class="space-y-5 p-8">
        <div>
          <label class="block mb-1 font-medium">Title</label>
          <input v-model="title" class="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" :class="{'border-red-400': titleError}" placeholder="Title" />
          <p v-if="titleError" class="text-red-500 text-xs mt-1">Required field</p>
        </div>
        <div>
          <label class="block mb-1 font-medium">Description</label>
          <input v-model="description" class="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="Description" />
        </div>
        <div>
          <label class="block mb-1 font-medium">Body</label>
          <textarea v-model="body" class="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" rows="5" placeholder="Body"></textarea>
        </div>
        <button class="bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-teal-600 transition flex items-center justify-center gap-2" type="submit" :disabled="loading">
          <span v-if="loading" class="loader border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
          <span v-else>Update</span>
          <span v-if="loading">Updating...</span>
        </button>
      </form>
    </div>
   
    <div class="flex flex-col gap-4 md:w-2/5">
      
      <div class="bg-white rounded-xl shadow-lg p-6 mb-4">
        <label class="block mb-2 font-medium">Tags</label>
        <input v-model="newTag" @keydown="handleAddTag" class="w-full border border-zinc-300 rounded-lg px-2 py-1 pb-2 mb-2" placeholder="New tag" />
        <p v-if="tagError" class="text-red-500 text-xs mt-1">{{ tagError }}</p>
        <div class="bg-white border border-zinc-300 rounded-2xl p-2 px-5 pt-5 overflow-y-auto mb-10">
          <div v-for="tag in tags" :key="tag" class="flex items-center mb-2">
            <input type="checkbox" :id="tag" :value="tag" v-model="selectedTags" class="mr-2 custom-checkbox" :disabled="disabledTags.includes(tag)" />
            <label :for="tag">{{ tag }}</label>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-checkbox:checked {
  accent-color: #0d9488;
}
.custom-checkbox {
  width:15px;
  height:15px;
  border-radius:50%!important;
}
.loader {
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
}
</style>