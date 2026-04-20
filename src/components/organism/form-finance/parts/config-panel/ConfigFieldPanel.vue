<script setup lang="ts">
import { computed } from 'vue'
import type { AkunType, FormField, FormPreviewRowType, FormSection } from '@/composables/useFormStructure'
import {
  AKUN_CALC_OPTIONS,
  AKUN_SOURCE_OPTIONS,
  AKUN_TYPE_OPTIONS,
  PREVIEW_ROW_TYPE_OPTIONS,
  TYPE_OPTIONS,
  fieldTypeDot,
  typeIconClass,
  typeLabelText,
  type FormulaToken,
} from '../../utils/configPanel'

interface Props {
  selectedField: FormField | null
  isAddingField: boolean
  fieldForm: {
    name: string
    code: string
    type: FormField['type']
    formula: string
    description: string
    previewRowType?: FormPreviewRowType
    akunSource: NonNullable<FormField['akunSource']>
    akunTypes: NonNullable<FormField['akunTypes']>
    akunCalc: NonNullable<FormField['akunCalc']>
  }
  formulaTokens: FormulaToken[]
  availableFieldsForFormula: Array<FormSection & { fields: FormField[] }>
  getTokenSign: (fieldId: string) => 'pos' | 'neg' | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-name': [name: string]
  'update-description': [description: string]
  'select-type': [type: FormField['type']]
  'update-preview-row-type': [rowType?: FormPreviewRowType]
  'update-source': [source: NonNullable<FormField['akunSource']>]
  'update-calc': [calc: NonNullable<FormField['akunCalc']>]
  'toggle-akun-type': [type: AkunType]
  'toggle-token': [field: FormField, sign: 'pos' | 'neg']
  'remove-token': [fieldId: string]
  'clear-tokens': []
  'add-field': []
  'save-field': []
  'delete-field': []
  'cancel-add': []
}>()

const getSelectedFieldIcon = (field: FormField | null) => {
  if (!field) return '+'
  return TYPE_OPTIONS.find(option => option.value === field.type)?.icon ?? '+'
}

const selectedFieldIcon = computed(() => {
  return getSelectedFieldIcon(props.selectedField)
})

const handleSourceChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as NonNullable<FormField['akunSource']>
  emit('update-source', value)
}

const handleCalcChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as NonNullable<FormField['akunCalc']>
  emit('update-calc', value)
}


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
  <div class="flex flex-col gap-5">
    <div class="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold"
          :class="selectedField ? typeIconClass(selectedField.type) : 'bg-emerald-50 text-emerald-700'"
        >
          {{ selectedFieldIcon }}
        </div>
        <div>
          <p class="text-[10px] font-bold tracking-widest text-emerald-600">
            {{ selectedField ? typeLabelText(selectedField.type) : 'TAMBAH BARIS BARU' }}
          </p>
          <h3 class="text-sm font-semibold text-slate-900">
            {{ selectedField ? selectedField.name : 'Konfigurasi baris' }}
          </h3>
        </div>
      </div>

      <button
        v-if="selectedField"
        class="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
        @click="emit('delete-field')"
      >
        Hapus baris
      </button>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        Label baris
        <span class="font-normal text-slate-500">tampil di laporan</span>
      </label>
      <input
        :value="fieldForm.name"
        type="text"
        placeholder="contoh: Pendapatan jasa"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[15px] font-medium text-slate-900 outline-none transition-colors focus:border-emerald-500 placeholder:text-slate-500"
        @input="emit('update-name', ($event.target as HTMLInputElement).value)"
      />
      <p class="text-[11px] text-slate-500">Nama ini akan muncul sebagai judul baris di laporan akhir</p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        Kode baris
        <span class="font-normal text-slate-500">auto dari label</span>
      </label>
      <input
        :value="fieldForm.code"
        type="text"
        readonly
        class="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-xs text-slate-500 outline-none"
      />
      <p class="text-[11px] text-slate-500">
        Kode otomatis dibuat dari label baris. Digunakan di formula baris lain, contoh: [total_pendapatan] - [total_beban]
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Tipe baris</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="option in TYPE_OPTIONS"
          :key="option.value"
          class="flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all"
          :class="fieldForm.type === option.value
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white'"
          @click="emit('select-type', option.value)"
        >
          <span class="text-sm" :class="fieldForm.type === option.value ? 'text-emerald-700' : 'text-slate-600'">
            {{ option.icon }}
          </span>
          <span class="text-[12px] font-semibold" :class="fieldForm.type === option.value ? 'text-emerald-700' : 'text-slate-700'">
            {{ option.label }}
          </span>
          <span class="text-[10px]" :class="fieldForm.type === option.value ? 'text-emerald-600' : 'text-slate-500'">
            {{ option.desc }}
          </span>
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Style baris di preview</label>
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
      <p class="text-[11px] text-slate-500">Auto: formula jadi biru, selain formula jadi detail biasa.</p>
    </div>

    <template v-if="fieldForm.type === 'account'">
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

      <div v-if="fieldForm.akunSource === 'semua_akun_tipe'" class="flex flex-col gap-1.5">
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

    <template v-if="fieldForm.type === 'formula'">
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold text-slate-600">Formula</label>
          <button
            v-if="formulaTokens.length > 0"
            class="text-[11px] text-slate-500 transition-colors hover:text-red-600"
            @click="emit('clear-tokens')"
          >
            Hapus semua
          </button>
        </div>

        <div
          class="min-h-10.5 flex w-full flex-wrap items-center gap-1.5 rounded-lg border bg-slate-50 px-3 py-2"
          :class="formulaTokens.length ? 'border-violet-200' : 'border-slate-200'"
        >
          <template v-if="formulaTokens.length === 0">
            <span class="text-xs text-slate-400">Pilih baris di bawah untuk membangun formula...</span>
          </template>
          <template v-else>
            <template v-for="(token, index) in formulaTokens" :key="token.fieldId">
              <span v-if="index > 0" class="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-600">
                {{ token.sign === 'pos' ? '+' : '−' }}
              </span>
              <span
                class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
                :class="token.sign === 'pos'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-red-300 bg-red-50 text-red-700'"
              >
                [{{ token.code }}]
                <button class="leading-none opacity-50 transition-opacity hover:opacity-100" @click="emit('remove-token', token.fieldId)">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M2 2l6 6M8 2l-6 6" stroke-linecap="round" />
                  </svg>
                </button>
              </span>
            </template>
          </template>
        </div>

        <p v-if="formulaTokens.length > 0" class="break-all font-mono text-[11px] text-slate-400">
          {{ fieldForm.formula }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600">Pilih baris</label>

        <div
          v-if="availableFieldsForFormula.length === 0"
          class="rounded-lg border border-dashed border-slate-300 py-6 text-center text-xs text-slate-500"
        >
          Belum ada baris lain yang bisa dipilih
        </div>

        <div v-else class="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <div v-for="section in availableFieldsForFormula" :key="section.id">
            <div class="mb-1 flex items-center gap-1.5 px-1">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-400">
                <rect x="1" y="1" width="10" height="10" rx="1.5" />
              </svg>
              <span class="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">{{ section.name }}</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <div
                v-for="field in section.fields"
                :key="field.id"
                class="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
                :class="{
                  'bg-emerald-50': getTokenSign(field.id) === 'pos',
                  'bg-red-50': getTokenSign(field.id) === 'neg',
                  'hover:bg-white': !getTokenSign(field.id),
                }"
              >
                <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="fieldTypeDot(field.type)" />
                <span
                  class="flex-1 truncate text-[12px]"
                  :class="{
                    'font-medium text-emerald-700': getTokenSign(field.id) === 'pos',
                    'font-medium text-red-700': getTokenSign(field.id) === 'neg',
                    'text-slate-700': !getTokenSign(field.id),
                  }"
                >
                  {{ field.name }}
                </span>
                <span class="shrink-0 font-mono text-[10px] text-slate-400">{{ field.code }}</span>

                <div v-if="getTokenSign(field.id) === null" class="flex shrink-0 overflow-hidden rounded-md border border-slate-300 text-[11px] font-semibold">
                  <button class="border-r border-slate-300 bg-white px-2.5 py-1 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700" @click="emit('toggle-token', field, 'pos')">+</button>
                  <button class="bg-white px-2.5 py-1 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700" @click="emit('toggle-token', field, 'neg')">−</button>
                </div>

                <div v-else class="flex shrink-0 overflow-hidden rounded-md border border-slate-200 text-[11px] font-semibold">
                  <button
                    disabled
                    class="px-2.5 py-1 transition-colors cursor-not-allowed"
                    :class="getTokenSign(field.id) === 'pos'
                      ? 'border-r border-emerald-100 bg-emerald-100 text-emerald-400'
                      : 'border-r border-slate-100 bg-slate-100 text-slate-300'"
                  >
                    +
                  </button>
                  <button
                    disabled
                    class="px-2.5 py-1 transition-colors cursor-not-allowed"
                    :class="getTokenSign(field.id) === 'neg'
                      ? 'bg-red-100 text-red-400'
                      : 'bg-slate-100 text-slate-300'"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-if="isAddingField && !selectedField" class="flex gap-2 pt-1">
      <button
        class="flex-1 rounded-lg border border-slate-300 py-2 text-sm text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900"
        @click="emit('cancel-add')"
      >
        Batal
      </button>
      <button
        class="flex-1 rounded-lg py-2 text-sm font-semibold transition-colors"
        :class="fieldForm.name && fieldForm.code
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'cursor-not-allowed bg-slate-200 text-slate-500'"
        :disabled="!fieldForm.name || !fieldForm.code"
        @click="emit('add-field')"
      >
        + Tambah baris
      </button>
    </div>

    <div v-else-if="selectedField" class="flex gap-2 pt-1">
      <button
        class="flex-1 rounded-lg border border-emerald-300 bg-emerald-50 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
        @click="emit('save-field')"
      >
        Simpan perubahan
      </button>
    </div>
  </div>
</template>
