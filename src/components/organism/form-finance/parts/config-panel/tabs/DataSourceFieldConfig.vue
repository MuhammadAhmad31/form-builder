<script setup lang="ts">
import type { AkunType, FormField, FormSection } from '@/composables/useFormStructure'
import {
  TYPE_OPTIONS,
  type FormulaToken,
} from '../../../utils/configPanel'
import AccountFieldConfig from '../field/AccountFieldConfig.vue'
import FormulaFieldConfig from '../field/FormulaFieldConfig.vue'

interface Props {
  fieldForm: {
    type: FormField['type']
    formula: string
    akunSource: NonNullable<FormField['akunSource']>
    akunTypes: NonNullable<FormField['akunTypes']>
    akunCalc: NonNullable<FormField['akunCalc']>
  }
  formulaTokens: FormulaToken[]
  availableFieldsForFormula: Array<FormSection & { fields: FormField[] }>
  getTokenSign: (fieldId: string) => 'pos' | 'neg' | null
}

defineProps<Props>()

const emit = defineEmits<{
  'select-type': [type: FormField['type']]
  'update-source': [source: NonNullable<FormField['akunSource']>]
  'update-calc': [calc: NonNullable<FormField['akunCalc']>]
  'toggle-akun-type': [type: AkunType]
  'toggle-token': [field: FormField, sign: 'pos' | 'neg']
  'remove-token': [fieldId: string]
  'clear-tokens': []
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Type Selector -->
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Tipe sumber data</label>
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

    <!-- Type-specific config -->
    <div class="border-t border-slate-200 pt-4">
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

      <div v-if="(fieldForm.type as string) === 'normal' || (fieldForm.type as string) === 'category'" class="text-sm text-slate-500">
        <p class="text-[11px]">
          {{ (fieldForm.type as string) === 'normal' ? 'Baris detail biasa - tidak ada konfigurasi data khusus' : 'Header kategori - tidak ada konfigurasi data khusus' }}
        </p>
      </div>
    </div>
  </div>
</template>
