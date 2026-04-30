import { computed, ref, watch } from 'vue'
import type { FormField, FormPreviewRowType, FormSection, FormStructure } from '@/composables/useFormStructure'
import {
  type ConfigFieldForm,
  defaultFieldForm,
  generateCodeFromName,
  parseFormulaToTokens,
  tokensToFormula,
  type FormulaToken,
} from '../utils/configPanel'

interface Props {
  selectedSection: FormSection | null
  selectedField: FormField | null
  addingFieldForSection: string | null
  formStructure: FormStructure
}

interface Emits {
  (e: 'add-field', sectionId: string, field: Omit<FormField, 'id'>): void
  (e: 'update-field', updates: Partial<FormField>): void
  (e: 'update-section', updates: Partial<FormSection>): void
  (e: 'delete-field'): void
  (e: 'cancel-add'): void
}

export function useConfigPanel(props: Props, emit: Emits) {
  const fieldForm = ref<ConfigFieldForm>(defaultFieldForm())
  const sectionForm = ref({ name: '' })
  const formulaTokens = ref<FormulaToken[]>([])

  const availableFieldsForFormula = computed(() => {
    const currentFieldId = props.selectedField?.id
    return props.formStructure.sections
      .map(section => ({
        ...section,
        fields: section.fields.filter(field => field.id !== currentFieldId),
      }))
      .filter(section => section.fields.length > 0)
  })

  const syncFormula = () => {
    fieldForm.value.formula = tokensToFormula(formulaTokens.value)
    if (props.selectedField) {
      emit('update-field', { formula: fieldForm.value.formula })
    }
  }

  const resetFieldForm = () => {
    fieldForm.value = defaultFieldForm()
    formulaTokens.value = []
  }

  const loadFieldForm = (field: FormField) => {
    fieldForm.value = {
      name: field.name,
      code: generateCodeFromName(field.name),
      type: field.type,
      formula: field.formula || '',
      description: field.description || '',
      previewRowType: field.previewRowType,
      spacerType: field.spacerType,
      akunMode: field.akunMode,
      akunStrategy: field.akunStrategy,
      depthMode: field.depthMode,
      coaCategory: field.coaCategory,
      categoryStrategy: field.categoryStrategy,
      reportTypeSource: field.reportTypeSource,
      rowTypeFromSelectedReportTypeSource: field.rowTypeFromSelectedReportTypeSource,
    }

    formulaTokens.value = field.type === 'formula'
      ? parseFormulaToTokens(field.formula || '', props.formStructure)
      : []
  }

  watch(
    () => props.selectedField,
    (field) => {
      if (field) {
        loadFieldForm(field)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.selectedSection,
    (section) => {
      if (section) {
        sectionForm.value.name = section.name
      }
    },
    { immediate: true }
  )

  watch(
    () => props.addingFieldForSection,
    (sectionId) => {
      if (sectionId) {
        resetFieldForm()
      }
    }
  )

  watch(
    () => fieldForm.value.name,
    (name) => {
      fieldForm.value.code = name ? generateCodeFromName(name) : ''
    }
  )

  watch(
    formulaTokens,
    () => {
      syncFormula()
    },
    { deep: true }
  )

  const handleAddField = () => {
    if (!props.addingFieldForSection || !fieldForm.value.name || !fieldForm.value.code || !fieldForm.value.type) return

    emit('add-field', props.addingFieldForSection, {
      ...fieldForm.value,
      type: fieldForm.value.type as Exclude<ConfigFieldForm['type'], ''>,
    })

    resetFieldForm()
  }

  const handleSaveField = () => {
    if (!props.selectedField || !fieldForm.value.type) return

    emit('update-field', {
      ...fieldForm.value,
      type: fieldForm.value.type as Exclude<ConfigFieldForm['type'], ''>,
    })
  }

  const handleDeleteField = () => {
    emit('delete-field')
  }

  const handleCancelAdd = () => {
    emit('cancel-add')
    resetFieldForm()
  }

  const handleUpdateField = (key: keyof ConfigFieldForm) => {
    emit('update-field', { [key]: fieldForm.value[key] } as Partial<FormField>)
  }

  const handleUpdateSection = () => {
    emit('update-section', sectionForm.value)
  }

  const onTypeClick = (type: FormField['type']) => {
    fieldForm.value.type = type
    if (type === 'formula' && formulaTokens.value.length === 0 && fieldForm.value.formula) {
      formulaTokens.value = parseFormulaToTokens(fieldForm.value.formula, props.formStructure)
    }
    if (props.selectedField) {
      handleUpdateField('type')
    }
  }

  const onNameBlur = () => {
    if (props.selectedField) {
      handleUpdateField('name')
    }
  }

  const onPreviewRowTypeChange = (rowType?: FormPreviewRowType) => {
    fieldForm.value.previewRowType = rowType
    if (props.selectedField) {
      emit('update-field', { previewRowType: rowType })
    }
  }

  const getTokenSign = (fieldId: string): 'pos' | 'neg' | null => {
    return formulaTokens.value.find(token => token.fieldId === fieldId)?.sign ?? null
  }

  const toggleToken = (field: FormField, sign: 'pos' | 'neg') => {
    const existingIndex = formulaTokens.value.findIndex(token => token.fieldId === field.id)

    if (existingIndex >= 0) {
      if (formulaTokens.value[existingIndex].sign === sign) {
        formulaTokens.value.splice(existingIndex, 1)
      } else {
        formulaTokens.value[existingIndex].sign = sign
      }
      return
    }

    formulaTokens.value.push({
      fieldId: field.id,
      code: field.code,
      name: field.name,
      sign,
    })
  }

  const removeToken = (fieldId: string) => {
    formulaTokens.value = formulaTokens.value.filter(token => token.fieldId !== fieldId)
  }

  const clearTokens = () => {
    formulaTokens.value = []
  }

  return {
    fieldForm,
    sectionForm,
    formulaTokens,
    availableFieldsForFormula,
    handleAddField,
    handleSaveField,
    handleDeleteField,
    handleCancelAdd,
    handleUpdateField,
    handleUpdateSection,
    onTypeClick,
    onNameBlur,
    onPreviewRowTypeChange,
    getTokenSign,
    toggleToken,
    removeToken,
    clearTokens,
  }
}
