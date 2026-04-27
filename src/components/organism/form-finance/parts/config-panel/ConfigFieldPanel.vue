<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AkunType, FormField, FormPreviewRowType, FormSection } from '@/composables/useFormStructure'
import {
  typeIconClass,
  typeLabelText,
  type FormulaToken,
} from '../../utils/configPanel'
import GeneralFieldConfig from './tabs/GeneralFieldConfig.vue'
import DataSourceFieldConfig from './tabs/DataSourceFieldConfig.vue'
import DisplayFieldConfig from './tabs/DisplayFieldConfig.vue'

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

const activeTab = ref<'general' | 'source' | 'display'>('general')

const getSelectedFieldIcon = (field: FormField | null) => {
  if (!field) return '+'
  const icons: Record<string, string> = {
    normal: 'N',
    account: 'A',
    formula: 'Σ',
    category: '☰',
  }
  return icons[field.type] || '+'
}

const selectedFieldIcon = computed(() => {
  return getSelectedFieldIcon(props.selectedField)
})

const tabItems = [
  { id: 'general', label: 'General' },
  { id: 'source', label: 'Sumber Data' },
  { id: 'display', label: 'Tampilan' },
]

// Validation function untuk menentukan apakah field form valid untuk ditambahkan
const getFieldValidationErrors = () => {
  const errors: string[] = []

  if (!props.fieldForm.name?.trim()) {
    errors.push('label_baris')
  }

  if (!props.fieldForm.code?.trim()) {
    errors.push('kode_baris')
  }

  if (!props.fieldForm.type) {
    errors.push('tipe_sumber_data')
  }

  return errors
}

const isFieldFormValid = computed(() => {
  return getFieldValidationErrors().length === 0
})

const getValidationMessage = () => {
  const errors = getFieldValidationErrors()
  if (errors.length === 0) return ''

  const errorMessages: Record<string, string> = {
    label_baris: 'Isi label baris',
    kode_baris: 'Kode baris otomatis dari label',
    tipe_sumber_data: 'Pilih tipe sumber data di tab "Sumber Data"',
  }

  return errors.map(e => errorMessages[e]).join(' • ')
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Header -->
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

    <!-- Tabs Navigation -->
    <div class="flex gap-2 border-b border-slate-200">
      <button
        v-for="tab in tabItems"
        :key="tab.id"
        :class="[
          'px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]',
          activeTab === tab.id
            ? 'border-emerald-500 text-emerald-600'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
        @click="activeTab = tab.id as any"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="min-h-96">
      <!-- Tab: General -->
      <div v-show="activeTab === 'general'">
        <GeneralFieldConfig
          :field-form="fieldForm"
          @update-name="emit('update-name', $event)"
          @update-description="emit('update-description', $event)"
        />
      </div>

      <!-- Tab: Data Source -->
      <div v-show="activeTab === 'source'">
        <DataSourceFieldConfig
          :field-form="fieldForm"
          :formula-tokens="formulaTokens"
          :available-fields-for-formula="availableFieldsForFormula"
          :get-token-sign="getTokenSign"
          @select-type="emit('select-type', $event)"
          @update-source="emit('update-source', $event)"
          @update-calc="emit('update-calc', $event)"
          @toggle-akun-type="emit('toggle-akun-type', $event)"
          @toggle-token="(field, sign) => emit('toggle-token', field, sign)"
          @remove-token="emit('remove-token', $event)"
          @clear-tokens="emit('clear-tokens')"
        />
      </div>

      <!-- Tab: Display -->
      <div v-show="activeTab === 'display'">
        <DisplayFieldConfig
          :field-form="fieldForm"
          @update-preview-row-type="emit('update-preview-row-type', $event)"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="isAddingField && !selectedField" class="flex flex-col gap-3">
      <div v-if="!isFieldFormValid" class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div class="text-xs">
          <p class="font-medium text-amber-900">Form belum lengkap</p>
          <p class="mt-1 text-amber-800">{{ getValidationMessage() }}</p>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          class="flex-1 rounded-lg border border-slate-300 py-2 text-sm text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900"
          @click="emit('cancel-add')"
        >
          Batal
        </button>
        <button
          class="flex-1 rounded-lg py-2 text-sm font-semibold transition-colors"
          :class="isFieldFormValid
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'cursor-not-allowed bg-slate-200 text-slate-500'"
          :disabled="!isFieldFormValid"
          :title="!isFieldFormValid ? getValidationMessage() : 'Tambah baris baru'"
          @click="emit('add-field')"
        >
          + Tambah baris
        </button>
      </div>
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
