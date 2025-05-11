<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="modal-overlay"></div>
    <div class="relative bg-white rounded-xl shadow-[0_4px_32px_0_rgba(0,0,0,0.10)]  pt-4 w-full max-w-md" style="z-index:1">
              <h3 class="text-lg font-bold mb-4 mt-1 px-7" style="font-size:1.15rem;">Delete Article</h3>
             <div class="border-b border-b-zinc-200"></div>
      <div class="flex flex-col items-center px-7 pt-5">
        <div class="flex items-center justify-center mb-4" style="width:56px;height:56px;background:#FEECEC;border-radius:50%;">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="18" fill="#FEECEC"/>
            <g>
              <polygon points="18,9 29,27 7,27" fill="none" stroke="#EF4444" stroke-width="2"/>
              <rect x="17" y="15" width="2" height="6" rx="1" fill="#EF4444"/>
              <rect x="17" y="23" width="2" height="2" rx="1" fill="#EF4444"/>
            </g>
          </svg>
        </div>
        <p class="text-gray-700 mb-7 mt-1" style="font-size:1rem;">Are you sure you want to delete this article?</p>

      </div>
      <div class="border-b border-b-zinc-200"></div>
              <div class="flex gap-3 pb-5 pt-3 pr-5 justify-end mt-1">
          <button @click="$emit('confirm')" class="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600 transition shadow-sm" style="min-width:90px;">Delete</button>
          <button @click="$emit('cancel')" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition shadow-sm" style="min-width:90px;">Cancel</button>
        </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  show: Boolean
})
defineEmits(['confirm', 'cancel'])
</script>
<style scoped>
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30,41,59,0.45);
  z-index: 0;
}
</style> 