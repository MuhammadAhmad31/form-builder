<script setup lang="ts">
import type { FormPreviewRowType } from '@/composables/useFormStructure'
import { PREVIEW_ROW_TYPE_OPTIONS } from '../../../utils/configPanel'

interface Props {
  fieldForm: {
    previewRowType?: FormPreviewRowType
  }
}

defineProps<Props>()

const emit = defineEmits<{
  'update-preview-row-type': [rowType?: FormPreviewRowType]
}>()

const handlePreviewRowTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  if (!value) {
    emit('update-preview-row-type', undefined)
    return
  }
  emit('update-preview-row-type', value as FormPreviewRowType)
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
      <label class="text-xs font-semibold text-slate-600">Penampilan visual</label>
      <div class="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div class="flex items-start gap-2">
          <input type="checkbox" id="bold" class="mt-0.5" disabled checked />
          <label for="bold" class="text-[13px]">
            <span class="font-semibold text-slate-700">Teks tebal untuk kategori</span>
            <p class="text-[11px] text-slate-500">Otomatis untuk kategori & total</p>
          </label>
        </div>
        <div class="flex items-start gap-2">
          <input type="checkbox" id="indent" class="mt-0.5" disabled />
          <label for="indent" class="text-[13px]">
            <span class="font-semibold text-slate-700">Indent untuk sub-items</span>
            <p class="text-[11px] text-slate-500">Coming soon</p>
          </label>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Visibilitas di sections</label>
      <p class="text-[11px] text-slate-500 rounded-lg border border-slate-200 bg-slate-50 p-3">
        Baris ini akan muncul di preview dan laporan final. Gunakan section untuk mengorganisir baris-baris terkait.
      </p>
    </div>
  </div>
</template>
