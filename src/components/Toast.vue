<template>
  <transition name="fade">
    <div
      v-if="visible"
      :class="[
        'fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-center min-w-[400px] max-w-xs flex items-center',
        type === 'success'
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-red-100 text-red-700 border border-red-200'
      ]"
    >
      <span v-if="type === 'error'">
        <template v-if="message === 'Invalid email or password' || message === 'Username and/or Password is invalid'">
          <b class="text-red-700">Sign-in Failed!</b>
          <span class="ml-2">{{ message }}</span>
        </template>
        <template v-else>
          <span class="ml-2">{{ message }}</span>
        </template>
      </span>
      <span v-else>
        <b class="text-green-700">Well done!</b>
        <span class="ml-2">{{ message }}</span>
      </span>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('success')
const persistent = ref(false)
let timer = null

function showToast(msg, toastType = 'success', duration = 3000, opts = {}) {
  message.value = msg
  type.value = toastType
  persistent.value = !!opts.persistent
  visible.value = true
  if (timer) clearTimeout(timer)
  if (!persistent.value) {
    timer = setTimeout(() => {
      visible.value = false
    }, duration)
  }
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