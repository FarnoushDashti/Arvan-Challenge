<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="modal-overlay"></div>
    <div class="relative bg-white rounded-xl shadow-lg pt-4 w-full max-w-md" style="z-index:1">
      <h3 class="text-lg font-bold mb-4 mt-1 px-7">{{ title }}</h3>
      <div class="border-b border-b-zinc-200"></div>
      <div class="flex flex-col items-center px-7 pt-5">
        <div
          class="flex items-center justify-center mb-4"
          :style="{
            width: '80px',
            height: '80px',
            background: type === 'success' ? '#EAFBF3' : '#FEECEC',
            borderRadius: '50%',
          }"
        >
          <svg v-if="type === 'success'" width="40" height="40" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" fill="#EAFBF3"/>
            <circle cx="32" cy="32" r="24" stroke="#10B981" stroke-width="4" fill="white"/>
            <path d="M22 34L30 42L44 26" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="18" fill="#FEECEC"/>
            <g>
              <polygon points="18,9 29,27 7,27" fill="none" stroke="#EF4444" stroke-width="2"/>
              <rect x="17" y="15" width="2" height="6" rx="1" fill="#EF4444"/>
              <rect x="17" y="23" width="2" height="2" rx="1" fill="#EF4444"/>
            </g>
          </svg>
        </div>
        <p class="text-gray-700 mb-7 mt-1" style="font-size:1rem;">{{ message }}</p>
      </div>
      <div class="border-b border-b-zinc-200"></div>
      <div class="flex gap-3 pb-5 pt-3 pr-5 justify-end mt-1">
        <BaseButton
          v-for="(btn, idx) in buttons"
          :key="idx"
          :variant="btn.type === 'danger' ? 'danger' : btn.type === 'success' ? 'primary' : 'ghost'"
          :outline="btn.type === 'default'"
          class="px-6 py-2 font-semibold"
          @click="$emit(btn.action)"
        >
          {{ btn.label }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  show: Boolean,
  type: { type: String, default: 'success' }, // 'success' | 'error'
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  buttons: { // [{ label: 'Confirm', action: 'confirm', type: 'success' }, ...]
    type: Array,
    default: () => [
      { label: 'Confirm', action: 'confirm', type: 'success' },
      { label: 'Cancle', action: 'cancel', type: 'default' }
    ]
  }
})
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30,41,59,0.45);
  z-index: 0;
}
</style>