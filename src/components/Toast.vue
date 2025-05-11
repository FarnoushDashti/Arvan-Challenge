<template>
  <transition name="fade">
    <div
      v-if="visible"
      :class="[
        'fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center min-w-[400px] max-w-md px-8 py-5 rounded-2xl shadow-lg',
        type === 'success'
          ? 'bg-green-50'
          : 'bg-red-50',
        'border border-gray-100'
      ]"
      style="box-shadow: 0 8px 32px 0 rgba(0,0,0,0.10);"
    >

      <div class="flex gap-4">
        <span :class="type === 'success' ? 'text-green-600' : 'text-red-600'" class="font-bold text-lg">{{ title }}</span>
        <span :class="type === 'success' ? 'text-green-500' : 'text-red-500'" class="text-base mt-1">{{ description }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('')
const description = ref('')
const type = ref('success')
let timer = null

function showToast(t, d, toastType = 'success', duration = 3000) {
  title.value = t
  description.value = d
  type.value = toastType
  visible.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({ showToast })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>