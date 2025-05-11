<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../axios'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const usernameError = ref(false)
const emailError = ref(false)
const emailErrorMsg = ref('')
const passwordError = ref(false)
const loading = ref(false)

async function handleSignup() {
  usernameError.value = !username.value.trim()
  passwordError.value = !password.value.trim()
  
  if (!email.value.trim()) {
    emailError.value = true
    emailErrorMsg.value = 'Required field'
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = true
    emailErrorMsg.value = 'Invalid email format'
  } else {
    emailError.value = false
    emailErrorMsg.value = ''
  }

  if (usernameError.value || passwordError.value || emailError.value) return

  loading.value = true
  try {
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
    let msg = 'Registration failed'
    if (err.response?.data?.errors?.body?.length) {
      msg = err.response.data.errors.body.join('، ')
    }
    if (window.toastRef && typeof window.toastRef.showToast === 'function') {
      window.toastRef.showToast(msg, 'error')
    } else {
      error.value = msg
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
          <label class="block text-gray-600 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            :class="{'border-red-400': usernameError}"
            placeholder="Enter your username"
          />
          <p v-if="usernameError" class="text-red-500 text-xs mt-1">Required field</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            :class="{'border-red-400': emailError}"
            placeholder="Enter your email"
          />
          <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailErrorMsg }}</p>
        </div>
        <div class="mb-6">
          <label class="block text-gray-600 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            :class="{'border-red-400': passwordError}"
            placeholder="Enter your password"
          />
          <p v-if="passwordError" class="text-red-500 text-xs mt-1">Required field</p>
        </div>
        <button
          class="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span v-if="loading" class="loader border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
          <span v-else>Sign up</span>
          <span v-if="loading">Signing up...</span>
        </button>
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