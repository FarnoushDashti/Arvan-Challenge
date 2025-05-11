<template>
  <div>
    <router-view />
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Toast from './components/Toast.vue'

const isLoggedIn = ref(false)
const router = useRouter()
const toastRef = ref(null)

function checkLoginStatus() {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
}

function logout() {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/login')
}

onMounted(() => {
  checkLoginStatus()
  window.toastRef = toastRef.value
})
</script>

<style>
</style>