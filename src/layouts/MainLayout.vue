<template>
  <div class="text-neutral-800">
    <!-- Desktop Header -->
    <header class="hidden lg:flex items-center justify-between bg-white px-8 py-4 border-b border-b-zinc-200">
      <div v-if="currentUser" class="text-gray-600" >Welcome {{ currentUser.username }}</div>
      <div v-else class="text-gray-600" >Welcome </div>
      <div class="font-bold text-lg tracking-tight bg-neutral-200 rounded p-1 px-4" >Arvancloud Challenge</div>
      <div class="flex items-center gap-4">
        <button @click="signOut" class="border border-zinc-200 px-4 p-1 pb-2 rounded-lg hover:bg-gray-300">Log out</button>
      </div>
    </header>

    <!-- Topbar for mobile/tablet -->
    <header class="w-full flex items-center justify-between bg-white px-4 py-3 border-b lg:hidden">
      <div class="font-bold text-lg tracking-tight">Arvancloud Challenge</div>
      <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden flex items-center justify-center w-10 h-10">
        <!-- Hamburger Icon -->
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-r-zinc-200 transform transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        ]"
        @click.self="sidebarOpen = false"
      >
        <!-- Close button for mobile -->
        <button
          v-if="sidebarOpen"
          @click="sidebarOpen = false"
          class="absolute top-3 right-3 lg:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Close sidebar"
        >
          <!-- Close Icon -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav class="p-4 pt-12 md:pt-4">
          <ul>
            <li class="mb-2">
              <router-link
                to="/"
                class="block py-2 px-4 rounded font-semibold transition"
                :class="{
                  'bg-cyan-100 text-teal-600': $route.path === '/',
                  'hover:bg-cyan-100 hover:text-white-600': $route.path !== '/'
                }"
                @click.native="handleMenuClick"
              >All Articles</router-link>
            </li>
            <li>
              <router-link
                to="/new-article"
                class="block py-2 px-4 rounded font-semibold transition"
                :class="{
                  'bg-cyan-100 text-teal-600': $route.path === '/new-article',
                  'hover:bg-cyan-100 hover:text-white-600': $route.path !== '/new-article'
                }"
                @click.native="handleMenuClick"
              >New Article</router-link>
            </li>
          </ul>
        </nav>
      </aside>
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

const router = useRouter()

const currentUser = ref(null)
const sidebarOpen = ref(false)

function handleMenuClick() {
  // فقط در موبایل/تبلت منو را ببند (تا 1024px)
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
  // پاک کردن توکن و ریدایرکت به login
  localStorage.removeItem('token')
  router.push('/login')
}
</script>