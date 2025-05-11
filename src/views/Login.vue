<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../axios'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import * as yup from 'yup'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const errors = ref({
  email: '',
  password: ''
})

const schema = yup.object({
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

watch(email, val => validateField('email', val))
watch(password, val => validateField('password', val))

async function handleLogin() {
  loading.value = true
  try {
    await schema.validate({ email: email.value, password: password.value }, { abortEarly: false })
    errors.value = { email: '', password: '' }
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
    if (err.name === 'ValidationError' && err.inner) {
      errors.value = { email: '', password: '' }
      err.inner.forEach(e => {
        errors.value[e.path] = e.message
      })
    } else if (window.toastRef && typeof window.toastRef.showToast === 'function') {
      let msg = 'Login failed'
      if (err.response?.data?.errors?.body?.length) {
        msg = err.response.data.errors.body.join('، ')
      }
      window.toastRef.showToast('Login Failed!', msg, 'error')
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
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Sign in</h2>
      <form @submit.prevent="handleLogin">
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
          Sign in
        </BaseButton>
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
