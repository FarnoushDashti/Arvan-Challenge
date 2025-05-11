<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-r-zinc-200 transform transition-transform duration-200 lg:static lg:translate-x-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]"
    @click.self="$emit('close')"
  >
    <!-- Close button for mobile -->
    <button
      v-if="sidebarOpen"
      @click="$emit('close')"
      class="absolute top-3 right-3 lg:hidden p-2 rounded hover:bg-gray-100"
      aria-label="Close sidebar"
    >
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
              'hover:bg-gray-200': $route.path !== '/'
            }"
            @click.native="$emit('menu-click')"
          >All Articles</router-link>
        </li>
        <li>
          <router-link
            to="/new-article"
            class="block py-2 px-4 rounded font-semibold transition"
            :class="{
              'bg-cyan-100 text-teal-600': $route.path === '/new-article',
              'hover:bg-gray-200': $route.path !== '/new-article'
            }"
            @click.native="$emit('menu-click')"
          >New Article</router-link>
        </li>
        <li v-if="sidebarOpen" class="mt-4 lg:hidden">
          <button
            @click="handleLogout"
            class="w-full text-left py-2 px-4 rounded-md font-semibold text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'

const router = useRouter()

defineProps({
  sidebarOpen: Boolean
})

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script> 