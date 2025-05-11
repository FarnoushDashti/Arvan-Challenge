<template>
  <div class="w-full">
    <label v-if="label" class="block text-gray-600 mb-1">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-colors',
        error ? 'border-red-400 focus:ring-red-400' : 
        disabled ? 'border-gray-200 bg-gray-50 cursor-not-allowed' :
        'border-zinc-300 focus:ring-teal-600'
      ]"
    />
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: [String, Boolean],
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script> 