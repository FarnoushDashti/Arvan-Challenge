<template>
  
    <!-- Desktop Header -->
    <header class="hidden lg:flex items-center justify-between bg-white px-8 py-4 border-b border-b-zinc-200">
      <div v-if="currentUser" class="text-gray-600">Welcome {{ currentUser.username }}</div>
      <div v-else class="text-gray-600">Welcome</div>
      <div class="font-bold text-lg tracking-tight bg-neutral-200 rounded p-1 px-4">Arvancloud Challenge</div>
      <div class="flex items-center gap-4">
        <BaseButton
          variant="ghost"
          outline
          @click="signOut"
        >
          Log out
        </BaseButton>
      </div>
    </header>
    <!-- Topbar for mobile/tablet -->
    <header class="w-full flex items-center justify-between bg-white px-4 py-3 border-b lg:hidden">
      <div class="font-bold text-lg tracking-tight">Arvancloud Challenge</div>
      <button @click="toggleSidebar" class="lg:hidden flex items-center justify-center w-10 h-10">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>

</template>

<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  currentUser: Object,
  signOut: Function,
  sidebarOpen: Boolean,
  toggleSidebar: Function
})
</script> 