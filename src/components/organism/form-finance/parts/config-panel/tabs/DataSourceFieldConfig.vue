<script setup lang="ts">
import type { AkunMode, AkunStrategy, CategoryStrategy, CoaCategory, DepthMode, FormField, FormSection } from '@/composables/useFormStructure'
import {
  TYPE_OPTIONS,
  type FormulaToken,
} from '../../../utils/configPanel'
import AccountFieldConfig from '../field/AccountFieldConfig.vue'
import CategoryAccountFieldConfig from '../field/CategoryAccountFieldConfig.vue'
import FormulaFieldConfig from '../field/FormulaFieldConfig.vue'
import ReferenceFieldConfig from '../field/ReferenceFieldConfig.vue'

interface Props {
  fieldForm: {
    type: FormField['type'] | ''
    formula: string
    akunMode?: AkunMode
    akunStrategy?: AkunStrategy
    depthMode?: DepthMode
    coaCategory?: CoaCategory
    categoryStrategy?: CategoryStrategy
    reportTypeSource?: FormField['reportTypeSource']
    rowTypeFromSelectedReportTypeSource?: FormField['rowTypeFromSelectedReportTypeSource']
  }
  formulaTokens: FormulaToken[]
  availableFieldsForFormula: Array<FormSection & { fields: FormField[] }>
  getTokenSign: (fieldId: string) => 'pos' | 'neg' | null
}

defineProps<Props>()

const emit = defineEmits<{
  'select-type': [type: FormField['type']]
  'update-mode': [mode: AkunMode]
  'update-strategy': [strategy: AkunStrategy]
  'update-depth-mode': [mode: DepthMode]
  'update-coa-category': [category: CoaCategory]
  'update-category-strategy': [strategy: CategoryStrategy]
  'toggle-token': [field: FormField, sign: 'pos' | 'neg']
  'remove-token': [fieldId: string]
  'clear-tokens': []
  'update-report-type-source': [reportType: string]
  'update-row-type-from-selected-report-type-source': [rowType: string]
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
        @update-mode="emit('update-mode', $event)"
        @update-strategy="emit('update-strategy', $event)"
      />

      <CategoryAccountFieldConfig
        v-if="fieldForm.type === 'category_account'"
        :field-form="fieldForm"
        @update-depth-mode="emit('update-depth-mode', $event)"
        @update-coa-category="emit('update-coa-category', $event)"
        @update-category-strategy="emit('update-category-strategy', $event)"
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

      <ReferenceFieldConfig
        v-if="fieldForm.type === 'reference'"
        :field-form="fieldForm"
        @update-report-type-source="emit('update-report-type-source', $event)"
        @update-row-type-from-selected-report-type-source="emit('update-row-type-from-selected-report-type-source', $event)"
      />

      <div v-if="(fieldForm.type as string) === 'normal'" class="text-sm text-slate-500">
        <p class="text-[11px]">
          {{ 'Baris detail biasa - tidak ada konfigurasi data khusus' }}
        </p>
      </div>
    </div>
  </div>
</template>
