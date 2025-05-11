<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../axios'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const emailError = ref(false)
const emailErrorMsg = ref('')
const passwordError = ref(false)
const loading = ref(false)

async function handleLogin() {
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

  if (passwordError.value || emailError.value) return

  loading.value = true
  try {
    const response = await axios.post('/users/login', {
      user: {
        email: email.value,
        password: password.value,
      },
    })
    const token = response.data.user.token
    localStorage.setItem('token', token)
    router.push('/')
  } catch (err) {
    error.value = 'Invalid email or password'
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
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Sign in</h2>
      <form @submit.prevent="handleLogin">
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
          <span v-else>Sign in</span>
          <span v-if="loading">Signing in...</span>
        </button>
      </form>

      <div class="mt-4 text-center text-gray-500 text-sm">
        Don't have an account?
        <router-link to="/signup" class="text-teal-600 font-semibold"
          >Sign up</router-link
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
