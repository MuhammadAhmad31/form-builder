<script setup lang="ts">
import type { FormPreviewRowType, SpacerType } from '@/composables/useFormStructure'
import { PREVIEW_ROW_TYPE_OPTIONS } from '../../../utils/configPanel'

interface Props {
  fieldForm: {
    previewRowType?: FormPreviewRowType
    spacerType?: SpacerType
  }
}

defineProps<Props>()

const emit = defineEmits<{
  'update-preview-row-type': [rowType?: FormPreviewRowType]
  'update-spacer-type': [spacerType?: SpacerType]
}>()

const handlePreviewRowTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  if (!value) {
    emit('update-preview-row-type', undefined)
    return
  }
  emit('update-preview-row-type', value as FormPreviewRowType)
}

const handleSpacerTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  if (!value) {
    emit('update-spacer-type', undefined)
    return
  }
  emit('update-spacer-type', value as SpacerType)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Gaya tampilan di preview</label>
      <div class="relative">
        <select
          :value="fieldForm.previewRowType || ''"
          class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
          @change="handlePreviewRowTypeChange"
        >
          <option value="">Auto (default)</option>
          <option v-for="option in PREVIEW_ROW_TYPE_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }} - {{ option.desc }}
          </option>
        </select>
        <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <p class="text-[11px] text-slate-500">
        <strong>Auto:</strong> Formula baris ditampilkan biru, baris lain normal.
        <br />
        <strong>Judul:</strong> Besar & tebal untuk header section
        <br />
        <strong>Sub-total:</strong> Garis atas untuk break
        <br />
        <strong>Total:</strong> Garis ganda untuk total akhir
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Spasi di atas baris</label>
      <div class="relative">
        <select
          :value="fieldForm.spacerType || ''"
          class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
          @change="handleSpacerTypeChange"
        >
          <option value="">Tanpa spasi (default)</option>
          <option value="low">Spasi kecil (mt-3)</option>
          <option value="high">Spasi besar (mt-5)</option>
        </select>
        <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <p class="text-[11px] text-slate-500">
        Tambahkan spasi di atas baris untuk memisahkan section atau highlight baris penting.
      </p>
    </div>
  </div>
</template>
