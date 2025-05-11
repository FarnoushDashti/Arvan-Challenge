<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '../axios'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseCheckbox from '../components/BaseCheckbox.vue'
import { useRouter, useRoute } from 'vue-router'
import * as yup from 'yup'

const router = useRouter()
const route = useRoute()
const title = ref('')
const description = ref('')
const body = ref('')
const selectedTags = ref([])
const availableTags = ref([])
const loading = ref(false)
const newTag = ref('')
const tagLoading = ref(false)
const tagError = ref('')
const disabledTags = ref([])

const errors = ref({
  title: '',
  description: '',
  body: ''
})

const schema = yup.object({
  title: yup.string().required('Required field'),
  description: yup.string().required('Required field'),
  body: yup.string().required('Required field'),
})

async function validateField(field, value) {
  try {
    await schema.validateAt(field, { [field]: value })
    errors.value[field] = ''
  } catch (err) {
    errors.value[field] = err.message
  }
}

watch(title, val => validateField('title', val))
watch(description, val => validateField('description', val))
watch(body, val => validateField('body', val))

onMounted(async () => {
  try {
    const response = await axios.get(`/articles/${route.params.slug}`)
    const article = response.data.article
    title.value = article.title
    description.value = article.description
    body.value = article.body
    selectedTags.value = article.tagList || []
  } catch (error) {
    if (window.toastRef && typeof window.toastRef.showToast === 'function') {
      window.toastRef.showToast('Error!', 'Failed to load article data', 'error')
    }
    router.push('/')
  }
  try {
    const response = await axios.get('/tags')
    const articleTags = selectedTags.value || []
    const serverTags = response.data.tags || []
    availableTags.value = [...new Set([...articleTags, ...serverTags])].sort((a, b) => a.localeCompare(b))
  } catch (error) {
    // silent fail
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    await schema.validate({ title: title.value, description: description.value, body: body.value }, { abortEarly: false })
    errors.value = { title: '', description: '', body: '' }
    await axios.put(`/articles/${route.params.slug}`, {
      article: {
        title: title.value,
        description: description.value,
        body: body.value,
        tagList: selectedTags.value,
      },
    })
    if (window.toastRef && typeof window.toastRef.showToast === 'function') {
      window.toastRef.showToast('Well done!', 'Article updated successfully', 'success')
    }
    setTimeout(() => {
      router.push('/')
    }, 700)
  } catch (err) {
    if (err.name === 'ValidationError' && err.inner) {
      errors.value = { title: '', description: '', body: '' }
      err.inner.forEach(e => {
        errors.value[e.path] = e.message
      })
    } else if (window.toastRef && typeof window.toastRef.showToast === 'function') {
      let msg = 'Failed to update article'
      if (err.response?.data?.errors?.body?.length) {
        msg = err.response.data.errors.body.join('، ')
      }
      window.toastRef.showToast('Error!', msg, 'error')
    }
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
  
  selectedTags.value.push(tag)
  disabledTags.value.push(tag)
  
  if (!availableTags.value.includes(tag)) {
    availableTags.value.push(tag)
    availableTags.value.sort((a, b) => a.localeCompare(b))
  }
  
  newTag.value = ''
  tagError.value = ''
}
</script>
<template>
  <div class="flex flex-col md:flex-row gap-6 min-h-screen bg-[#F5F6FA] p-4">
    <div class="flex-1 bg-white rounded-xl shadow-lg p-8 px-0 md:w-3/5 ">
      <h2 class="text-2xl font-bold mb-6 p-6">Edit article</h2>
      <div class="border-b border-b-zinc-200"></div>
      <form @submit.prevent="handleSubmit" class="space-y-5 p-8 ">
        <div>
          <BaseInput
            v-model="title"
            label="Title"
            placeholder="Article title"
            :error="errors.title"
          />
        </div>
        <div>
          <BaseInput
            v-model="description"
            label="Description"
            placeholder="What's this article about?"
            :error="errors.description"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">Body</label>
          <textarea v-model="body" class="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" rows="5" placeholder="Body"></textarea>
          <p v-if="errors.body" class="text-red-500 text-xs mt-1">{{ errors.body }}</p>
        </div>
        <BaseButton
          class="w-1/7"
          :loading="loading"
          :disabled="loading"
          variant="primary"
          type="submit"
        >
          Update
        </BaseButton>
      </form>
    </div>
    <div class="flex flex-col gap-4 w-full md:w-2/5">

      <div class="bg-white rounded-xl shadow-lg p-6 mb-4">
        <label class="block mb-2 font-medium">Tags</label>
        <input v-model="newTag" @keydown="handleAddTag" class="w-full border border-zinc-300 rounded-lg px-2 py-1 pb-2 mb-2" placeholder="New tag" />
        <p v-if="tagError" class="text-red-500 text-xs mt-1">{{ tagError }}</p>
        <p v-if="tagLoading" class="text-teal-600 text-xs mt-1">Adding...</p>
        <div class="bg-white border border-zinc-300 rounded-2xl p-2 px-5 pt-5 overflow-y-auto mb-10">
          <div v-for="tag in availableTags" :key="tag" class="flex items-center mb-2">
            <BaseCheckbox
              v-model="selectedTags"
              :value="tag"
              :id="'tag-' + tag"
              :disabled="disabledTags.includes(tag)"
              color="primary"
              size="sm"
              class="mr-2"
            />
            <label :for="'tag-' + tag">{{ tag }}</label>
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