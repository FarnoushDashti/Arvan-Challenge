<template>
  <label class="inline-flex items-center cursor-pointer select-none">
    <span
      :class="[
        'flex items-center justify-center rounded-md transition-all duration-150',
        sizeClass,
        checked ? colorClass : 'bg-white border border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
    >
      <input
        type="checkbox"
        class="sr-only"
        :checked="checked"
        :value="value"
        :disabled="disabled"
        @change="toggle"
      />
      <svg v-if="checked" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" :fill="fillColor"/>
        <path d="M7 13l4 4 6-8" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span v-if="$slots.default" class="ml-2"><slot /></span>
  </label>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue: { type: [Boolean, Array], required: true },
  value: { type: [String, Number, Boolean], default: true },
  color: { type: String, default: 'primary' }, // primary, secondary, dark
  size: { type: String, default: 'sm' }, // sm, md, lg
  disabled: Boolean
})
const emit = defineEmits(['update:modelValue'])
const checked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return !!props.modelValue
})
function toggle() {
  if (props.disabled) return
  if (Array.isArray(props.modelValue)) {
    const arr = [...props.modelValue]
    const idx = arr.indexOf(props.value)
    if (idx > -1) {
      arr.splice(idx, 1)
    } else {
      arr.push(props.value)
    }
    emit('update:modelValue', arr)
  } else {
    emit('update:modelValue', !props.modelValue)
  }
}
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-6 h-6';
    case 'lg': return 'w-9 h-9';
    default: return 'w-8 h-8';
  }
})
const colorClass = computed(() => {
  switch (props.color) {
    case 'primary': return 'bg-teal-600';
    case 'secondary': return 'bg-cyan-800';
    case 'dark': return 'bg-cyan-900';
    default: return 'bg-teal-600';
  }
})
const fillColor = computed(() => {
  switch (props.color) {
    case 'primary': return '#08979c';
    case 'secondary': return '#0e7490';
    case 'dark': return '#134e4a';
    default: return '#08979c';
  }
})
</script>