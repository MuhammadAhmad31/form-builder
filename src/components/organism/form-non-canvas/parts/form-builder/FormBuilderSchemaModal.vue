<script setup lang="ts">
import type { FormStructure } from '@/composables/useFormStructure'

interface Props {
  modelValue: boolean
  formStructure: FormStructure
}

defineProps<Props>()

const emit = defineEmits<{
  copy: []
  close: []
}>()
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white p-6 shadow-lg">
      <h2 class="text-lg font-bold text-slate-900">JSON Schema</h2>

      <div class="mt-4 flex-1 overflow-y-auto">
        <pre class="wrap-break-word rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 whitespace-pre-wrap">{{ JSON.stringify(formStructure, null, 2) }}</pre>
      </div>

      <div class="mt-6 flex gap-2">
        <button class="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100" @click="emit('close')">
          Tutup
        </button>
        <button class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" @click="emit('copy')">
          Salin
        </button>
      </div>
    </div>
  </div>
</template>
