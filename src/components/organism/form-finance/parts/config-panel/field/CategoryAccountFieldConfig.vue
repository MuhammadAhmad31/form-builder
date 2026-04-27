<script setup lang="ts">
import type { CategoryStrategy, CoaCategory, DepthMode } from '@/composables/useFormStructure'
import {
  CATEGORY_STRATEGY_OPTIONS,
  COA_CATEGORY_OPTIONS,
  DEPTH_MODE_OPTIONS,
} from '../../../utils/configPanel'

interface Props {
  fieldForm: {
    depthMode?: DepthMode
    coaCategory?: CoaCategory
    categoryStrategy?: CategoryStrategy
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-depth-mode': [mode: DepthMode]
  'update-coa-category': [category: CoaCategory]
  'update-category-strategy': [strategy: CategoryStrategy]
}>()

const handleDepthModeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as DepthMode
  emit('update-depth-mode', value)
}

const handleCoaCategoryChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as CoaCategory
  emit('update-coa-category', value)
}

const handleCategoryStrategyChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as CategoryStrategy
  emit('update-category-strategy', value)
}
</script>

<template>
<div class="flex flex-col gap-3">
  <!-- COA Category -->
  <div class="flex flex-col gap-1.5">

    <label class="text-xs font-semibold text-slate-600">COA Category <span class="text-red-500">*</span></label>
    <div class="relative">
      <select
        :value="fieldForm.coaCategory || 'pendapatan_usaha'"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleCoaCategoryChange"
      >
        <option value="" disabled>Pilih kategori</option>
        <option v-for="option in COA_CATEGORY_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <p class="text-[11px] text-slate-500">Satu category tidak boleh diikuti ke dua row berbeda</p>
  </div>

  <!-- Data Strategy -->
  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-semibold text-slate-600">Data strategy <span class="text-red-500">*</span></label>
    <div class="relative">
      <select
        :value="fieldForm.categoryStrategy || 'period_net_change'"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleCategoryStrategyChange"
      >
        <option value="" disabled>Pilih strategi</option>
        <option v-for="option in CATEGORY_STRATEGY_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>

  <!-- Depth Mode -->
  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-semibold text-slate-600">
      <span class="text-slate-500">depth_mode</span>
      <span class="ml-1 text-[10px] font-normal text-slate-400">optional · default dari report_type</span>
      <span class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :value="fieldForm.depthMode || 'one_level_below'"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleDepthModeChange"
      >
        <option value="" disabled>Pilih depth mode</option>
        <option v-for="option in DEPTH_MODE_OPTIONS" :key="option.value" :value="option.value">
          – ikuti {{ option.label }} –
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <p class="text-[11px] text-slate-500">Default Laba Rugi: one_level_below. Bisa di-override per row.</p>
  </div>
</div>
</template>
