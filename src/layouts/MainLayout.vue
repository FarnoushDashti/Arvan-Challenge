<template>
  <div class="text-neutral-800">
    <Header
      :currentUser="currentUser"
      :signOut="signOut"
      :sidebarOpen="sidebarOpen"
      :toggleSidebar="() => sidebarOpen = !sidebarOpen"
    />
    <div class="flex min-h-screen">
      <Sidebar
        :sidebarOpen="sidebarOpen"
        @close="sidebarOpen = false"
        @menu-click="handleMenuClick"
      />
      <!-- Overlay for mobile (white fade) -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-200"
        @click="sidebarOpen = false"
      ></div>
      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-8 bg-[#F5F6FA]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from '../axios'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'

const router = useRouter()

const currentUser = ref(null)
const sidebarOpen = ref(false)

function handleMenuClick() {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

onMounted(async () => {
  try {
    const { data } = await axios.get('/user')
    currentUser.value = data.user
  } catch (e) {
    currentUser.value = null
  }
})

function signOut() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>