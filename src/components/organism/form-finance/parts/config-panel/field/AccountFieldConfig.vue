<script setup lang="ts">
import type { AkunMode, AkunStrategy, FirstLevel } from '@/composables/useFormStructure'
import {
  AKUN_MODE_OPTIONS,
  AKUN_STRATEGY_OPTIONS,
  AKUN_FIRST_LEVEL_OPTIONS,
} from '../../../utils/configPanel'

interface Props {
  fieldForm: {
    akunMode?: AkunMode
    akunStrategy?: AkunStrategy
    firstLevelAkunType?: FirstLevel
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-mode': [mode: AkunMode]
  'update-strategy': [strategy: AkunStrategy]
  'update-first-level': [type: FirstLevel]
}>()

const handleModeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as AkunMode
  emit('update-mode', value)
}

const handleStrategyChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as AkunStrategy
  emit('update-strategy', value)
}

const handleFirstLevelChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as FirstLevel
  emit('update-first-level', value)
}
</script>

<template>

<div class="grid grid-cols-2 gap-2">
  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-semibold text-slate-600">Mode akun <span class="text-red-500">*</span></label>
    <div class="relative">
      <select
        :value="fieldForm.akunMode || 'single'"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleModeChange"
      >
        <option value="" disabled>Pilih mode</option>
        <option v-for="option in AKUN_MODE_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>

  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-semibold text-slate-600">Data strategy <span class="text-red-500">*</span></label>
    <div class="relative">
      <select
        :value="fieldForm.akunStrategy || 'period_net_change'"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleStrategyChange"
      >
        <option value="" disabled>Pilih strategi</option>
        <option v-for="option in AKUN_STRATEGY_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>

  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-semibold text-slate-600">First level akun  <span class="text-red-500">*</span></label>
    <div class="relative">
      <select
        :value="fieldForm.firstLevelAkunType || ''"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleFirstLevelChange"
      >
        <option value="" disabled>Pilih tipe akun</option>
        <option v-for="option in AKUN_FIRST_LEVEL_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</div>
</template>
