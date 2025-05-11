<script setup>
import { ref, onMounted } from 'vue'
import axios from '../axios'

const title = ref('')
const description = ref('')
const body = ref('')
const selectedTags = ref([])
const tags = ref([])
const titleError = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const newTag = ref('')
const tagLoading = ref(false)
const tagError = ref('')
const disabledTags = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('/tags')
    tags.value = (data.tags || []).sort((a, b) => a.localeCompare(b))
  } catch (err) {
    console.error('Error fetching tags:', err)
  }
})

async function handleSubmit() {
  titleError.value = !title.value.trim()
  if (titleError.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await axios.post('/articles', {
      article: {
        title: title.value,
        description: description.value,
        body: body.value,
        tagList: selectedTags.value
      }
    })
    if (window.toastRef && typeof window.toastRef.showToast === 'function') {
      window.toastRef.showToast('Article created successfuly', 'success')
    }
    window.location.href = '/'
  } catch (err) {
    errorMsg.value = err.response?.data?.errors?.body?.[0] || 'Error creating article.'
  } finally {
    loading.value = false
  }
}

async function handleAddTag(e) {
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
    <div class="flex-1 bg-white rounded-xl shadow-lg p-8 px-0 md:w-3/5 ">
      <h2 class="text-2xl font-bold mb-6 p-6">New article</h2>
      <div class="border-b border-b-zinc-200"></div>
      <form @submit.prevent="handleSubmit" class="space-y-5 p-8 ">
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
          <span v-else>Submit</span>
          <span v-if="loading">Submitting...</span>
        </button>
      </form>
    </div>
    <div class="flex flex-col gap-4 w-full md:w-2/5">

      <div class="bg-white rounded-xl shadow-lg p-6 mb-4">
        <label class="block mb-2 font-medium">Tags</label>
        <input v-model="newTag" @keydown="handleAddTag" class="w-full border border-zinc-300 rounded-lg px-2 py-1 pb-2 mb-2" placeholder="New tag" />
        <p v-if="tagError" class="text-red-500 text-xs mt-1">{{ tagError }}</p>
        <p v-if="tagLoading" class="text-teal-600 text-xs mt-1">Adding...</p>
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