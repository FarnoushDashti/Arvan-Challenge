<template>
  <nav class="flex items-center gap-1 rounded-lg border border-zinc-300 px-2 py-1 bg-white">
    <button
      class="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 pb-1"
      :class="page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'"
      :disabled="page === 1"
      @click="$emit('update:page', page - 1)"
    >
      &lt;
    </button>
    <template v-for="p in pagination" :key="p + '-' + page">
      <span
        v-if="p === '...'"
        class="w-8 h-8 flex items-center justify-center text-gray-400 select-none"
        >...</span
      >
      <button
        v-else
        class="w-8 h-8 flex items-center justify-center rounded-lg"
        :class="page === p ? 'bg-teal-600 text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'"
        @click="$emit('update:page', p)"
      >
        {{ p }}
      </button>
    </template>
    <button
      class="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 pb-1"
      :class="page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'"
      :disabled="page === totalPages"
      @click="$emit('update:page', page + 1)"
    >
      &gt;
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})
const pagination = computed(() => {
  const pages = []
  if (props.totalPages <= 7) {
    for (let i = 1; i <= props.totalPages; i++) pages.push(i)
  } else {
    if (props.page > 3) pages.push(1)
    if (props.page > 4) pages.push('...')
    for (
      let i = Math.max(1, props.page - 1);
      i <= Math.min(props.totalPages, props.page + 1);
      i++
    ) {
      pages.push(i)
    }
    if (props.page < props.totalPages - 3) pages.push('...')
    if (props.page < props.totalPages - 2) pages.push(props.totalPages)
  }
  return pages
})
</script> 