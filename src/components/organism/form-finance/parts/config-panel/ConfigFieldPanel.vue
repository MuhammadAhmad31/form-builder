<script setup lang="ts">
import { computed } from 'vue'
import type { AkunType, FormField, FormPreviewRowType, FormSection } from '@/composables/useFormStructure'
import {
  TYPE_OPTIONS,
  typeIconClass,
  typeLabelText,
  type FormulaToken,
} from '../../utils/configPanel'
import AccountFieldConfig from './AccountFieldConfig.vue'
import FormulaFieldConfig from './FormulaFieldConfig.vue'
import NormalFieldConfig from './NormalFieldConfig.vue'

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

    <NormalFieldConfig
      :field-form="fieldForm"
      @update-preview-row-type="emit('update-preview-row-type', $event)"
    />

    <AccountFieldConfig
      v-if="fieldForm.type === 'account'"
      :field-form="fieldForm"
      @update-source="emit('update-source', $event)"
      @update-calc="emit('update-calc', $event)"
      @toggle-akun-type="emit('toggle-akun-type', $event as AkunType)"
    />

    <FormulaFieldConfig
      v-if="fieldForm.type === 'formula'"
      :field-form="fieldForm"
      :formula-tokens="formulaTokens"
      :available-fields-for-formula="availableFieldsForFormula"
      :get-token-sign="getTokenSign"
      @toggle-token="(field, sign) => emit('toggle-token', field, sign)"
      @remove-token="emit('remove-token', $event)"
      @clear-tokens="emit('clear-tokens')"
    />

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
