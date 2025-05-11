<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClass,
      variantClass,
      outline ? outlineClass : '',
      loading ? 'cursor-wait opacity-70' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loader mr-2"></span>
    <span v-else-if="icon && iconPosition === 'left'" class="mr-2">
      <slot name="icon">
        <svg v-if="icon === 'check'" width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="none"/><path d="M5 9.5l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <svg v-else-if="icon === 'circle'" width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="2"/></svg>
      </slot>
    </span>
    <span><slot /></span>
    <span v-if="!loading && icon && iconPosition === 'right'" class="ml-2">
      <slot name="icon">
        <svg v-if="icon === 'check'" width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="none"/><path d="M5 9.5l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <svg v-else-if="icon === 'circle'" width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="2"/></svg>
      </slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, ghost, etc
  outline: Boolean,
  loading: Boolean,
  icon: String, // 'check', 'circle', ...
  iconPosition: { type: String, default: 'right' },
  disabled: Boolean,
  size: { type: String, default: 'md' } // sm, md, lg
})
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-4 py-1 text-sm';
    case 'lg': return 'px-7 py-3 text-lg';
    default: return 'px-6 py-3 text-base';
  }
})
const variantClass = computed(() => {
  if (props.outline) return '';
  switch (props.variant) {
    case 'primary': return 'bg-teal-600 text-white hover:bg-teal-700';
    case 'secondary': return 'bg-white text-teal-600 border border-teal-600 hover:bg-teal-50';
    case 'danger': return 'bg-red-600 text-white hover:bg-red-700';
    case 'danger-light': return 'bg-red-100 text-red-600';
    case 'ghost': return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100';
    default: return 'bg-gray-200 text-gray-700';
  }
})
const outlineClass = computed(() => {
  switch (props.variant) {
    case 'primary': return 'border border-teal-600 text-teal-600 bg-white hover:bg-teal-50';
    case 'danger': return 'border border-red-600 text-red-600 bg-white hover:bg-red-50';
    default: return 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-100';
  }
})
</script>

<style scoped>
.loader {
  border: 2.5px solid #fff;
  border-top: 2.5px solid #08979c;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 