<script setup lang="ts">
import type { ReportTypeSource, RowTypeFromSelectedReportTypeSource } from '@/composables/useFormStructure';
import {
  REPORT_TYPE_SOURCE_OPTIONS,
  ROW_TYPE_FROM_SELECTED_REPORT_TYPE_SOURCE_OPTIONS
} from '../../../utils/configPanel'

interface Props {
  fieldForm: {
    reportTypeSource?: ReportTypeSource
    rowTypeFromSelectedReportTypeSource?: RowTypeFromSelectedReportTypeSource
  }
}

defineProps<Props>()

const emit = defineEmits<{
  'update-report-type-source': [reportType: ReportTypeSource]
  'update-row-type-from-selected-report-type-source': [rowType: RowTypeFromSelectedReportTypeSource]
}>()

const handleRowTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as RowTypeFromSelectedReportTypeSource
  emit('update-row-type-from-selected-report-type-source', value)
}

const handleReportTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as ReportTypeSource
  emit('update-report-type-source', value)
}

</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Report type source</label>
     <select
        :value="fieldForm.reportTypeSource || ''"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleReportTypeChange"
      >
        <option value="" disabled>Pilih report type</option>
        <option v-for="option in REPORT_TYPE_SOURCE_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Row type from selected report type source</label>
      <select
        :value="fieldForm.rowTypeFromSelectedReportTypeSource || ''"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleRowTypeChange"
      >
        <option value="" disabled>Pilih row type</option>
        <option v-for="option in ROW_TYPE_FROM_SELECTED_REPORT_TYPE_SOURCE_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</template>