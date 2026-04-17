import { computed, ref, watch } from 'vue'
import type { AkunType, FormField, FormSection, FormStructure } from '@/composables/useFormStructure'
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
      akunSource: field.akunSource || 'semua_akun_tipe',
      akunTypes: field.akunTypes || ['pendapatan'],
      akunCalc: field.akunCalc || 'mutasi_bersih',
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
    if (!props.addingFieldForSection || !fieldForm.value.name || !fieldForm.value.code) return

    emit('add-field', props.addingFieldForSection, {
      ...fieldForm.value,
    })

    resetFieldForm()
  }

  const handleSaveField = () => {
    if (!props.selectedField) return

    emit('update-field', {
      ...fieldForm.value,
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

  const toggleAkunType = (type: AkunType) => {
    const types = fieldForm.value.akunTypes
    const index = types.indexOf(type)

    if (index === -1) {
      types.push(type)
    } else if (types.length > 1) {
      types.splice(index, 1)
    }

    if (props.selectedField) {
      handleUpdateField('akunTypes')
    }
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

  const onAkunSourceChange = () => {
    if (props.selectedField) {
      handleUpdateField('akunSource')
    }
  }

  const onAkunCalcChange = () => {
    if (props.selectedField) {
      handleUpdateField('akunCalc')
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
    toggleAkunType,
    onTypeClick,
    onNameBlur,
    onAkunSourceChange,
    onAkunCalcChange,
    getTokenSign,
    toggleToken,
    removeToken,
    clearTokens,
  }
}
