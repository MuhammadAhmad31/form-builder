<script setup lang="ts">
import type { FormField } from '@/composables/useFormStructure'
import {
  AKUN_CALC_OPTIONS,
  AKUN_SOURCE_OPTIONS,
  AKUN_TYPE_OPTIONS,
} from '../../utils/configPanel'

interface Props {
  fieldForm: {
    akunSource: NonNullable<FormField['akunSource']>
    akunTypes: NonNullable<FormField['akunTypes']>
    akunCalc: NonNullable<FormField['akunCalc']>
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-source': [source: NonNullable<FormField['akunSource']>]
  'update-calc': [calc: NonNullable<FormField['akunCalc']>]
  'toggle-akun-type': [type: string]
}>()

const handleSourceChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as NonNullable<FormField['akunSource']>
  emit('update-source', value)
}

const handleCalcChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as NonNullable<FormField['akunCalc']>
  emit('update-calc', value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-semibold text-slate-600">Cara mengambil akun</label>
    <div class="relative">
      <select
        :value="fieldForm.akunSource"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleSourceChange"
      >
        <option v-for="option in AKUN_SOURCE_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>

  <template v-if="fieldForm.akunSource === 'semua_akun_tipe'">
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Tipe akun yang diambil</label>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="option in AKUN_TYPE_OPTIONS"
          :key="option.value"
          class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
          :class="fieldForm.akunTypes.includes(option.value)
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'"
          @click="emit('toggle-akun-type', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </template>

  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-semibold text-slate-600">Cara menghitung nilai</label>
    <div class="relative">
      <select
        :value="fieldForm.akunCalc"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
        @change="handleCalcChange"
      >
        <option v-for="option in AKUN_CALC_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</template>
