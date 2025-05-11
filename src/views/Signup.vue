<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../axios'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import * as yup from 'yup'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const errors = ref({
  username: '',
  email: '',
  password: ''
})

const schema = yup.object({
  username: yup.string().required('Required field'),
  email: yup.string().email('Invalid email format').required('Required field'),
  password: yup.string().required('Required field'),
})

async function validateField(field, value) {
  try {
    await schema.validateAt(field, { [field]: value })
    errors.value[field] = ''
  } catch (err) {
    errors.value[field] = err.message
  }
}

watch(username, val => validateField('username', val))
watch(email, val => validateField('email', val))
watch(password, val => validateField('password', val))

async function handleSignup() {
  loading.value = true
  try {
    await schema.validate({ username: username.value, email: email.value, password: password.value }, { abortEarly: false })
    errors.value = { username: '', email: '', password: '' }
    const response = await axios.post('/users', {
      user: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    })
    const token = response.data.user.token
    localStorage.setItem('token', token)
    router.push('/login')
  } catch (err) {
    if (err.name === 'ValidationError' && err.inner) {
      errors.value = { username: '', email: '', password: '' }
      err.inner.forEach(e => {
        errors.value[e.path] = e.message
      })
    } else if (window.toastRef && typeof window.toastRef.showToast === 'function') {
      let msg = 'Registration failed'
      if (err.response?.data?.errors?.body?.length) {
        msg = err.response.data.errors.body.join('، ')
      }
      window.toastRef.showToast('Sign-up Failed!', msg, 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="flex items-center justify-center min-h-screen bg-[#F5F6FA] px-2">
    <div
      class="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm sm:max-w-md md:max-w-lg"
    >
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Sign up</h2>
      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <BaseInput
            v-model="username"
            label="Username"
            placeholder="Enter your username"
            :error="errors.username"
          />
        </div>
        <div class="mb-4">
          <BaseInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            :error="errors.email"
          />
        </div>
        <div class="mb-6">
          <BaseInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            :error="errors.password"
          />
        </div>
        <BaseButton
          class="w-full"
          :loading="loading"
          :disabled="loading"
          variant="primary"
          type="submit"
        >
          Sign up
        </BaseButton>
      </form>

      <div class="mt-4 text-center text-gray-500 text-sm">
        Already have an account?
        <router-link to="/login" class="text-teal-600 font-semibold"
          >Sign in</router-link
        >
      </div>
    </div>
  </div>
</template>


<style scoped>
.loader {
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
}
</style>