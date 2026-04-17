import { computed, ref } from 'vue'
import type { FormSection } from '@/composables/useFormStructure'
import { useFormStorage, type SavedForm } from '@/composables/useFormStorage'

type StorageApi = ReturnType<typeof useFormStorage>

export function useFormRendererPanel(storage: StorageApi) {
  const selectedFormId = ref<string | null>(null)
  const selectedForm = ref<SavedForm | null>(null)
  const selectedFieldValues = ref<Record<string, string>>({})
  const selectedFieldCheckboxes = ref<Record<string, boolean[]>>({})

  const savedFormList = computed(() => storage.savedForms.value || [])
  const selectedSections = computed<FormSection[]>(() => selectedForm.value?.formStructure.sections || [])

  const resetFieldState = () => {
    selectedFieldValues.value = {}
    selectedFieldCheckboxes.value = {}
  }

  const handleFormSelect = (value: unknown) => {
    if (typeof value !== 'string') return

    const form = storage.getForm(value)
    if (!form) return

    selectedFormId.value = value
    selectedForm.value = form
    resetFieldState()
  }

  const handleFieldValueSelect = (fieldId: string, value: unknown) => {
    if (typeof value !== 'string') return

    selectedFieldValues.value[fieldId] = value

    const checkboxCount = Number.parseInt(value, 10)
    if (Number.isNaN(checkboxCount) || checkboxCount <= 0) {
      selectedFieldCheckboxes.value[fieldId] = []
      return
    }

    const previous = selectedFieldCheckboxes.value[fieldId] || []
    selectedFieldCheckboxes.value[fieldId] = Array.from(
      { length: checkboxCount },
      (_, index) => previous[index] ?? false,
    )
  }

  const getCheckboxCount = (fieldId: string) => {
    const value = selectedFieldValues.value[fieldId]
    const count = Number.parseInt(value || '0', 10)
    return Number.isNaN(count) ? 0 : count
  }

  const isCheckboxChecked = (fieldId: string, index: number) => {
    return selectedFieldCheckboxes.value[fieldId]?.[index] ?? false
  }

  const toggleCheckbox = (fieldId: string, index: number, checked: boolean) => {
    if (!selectedFieldCheckboxes.value[fieldId]) {
      selectedFieldCheckboxes.value[fieldId] = []
    }

    selectedFieldCheckboxes.value[fieldId][index] = checked
  }

  const calculateFormula = (formula: string): number | string => {
    if (!formula) return 'N/A'

    const fieldByCode = new Map<string, any>()
    for (const section of selectedForm.value?.formStructure.sections || []) {
      for (const field of section.fields) {
        fieldByCode.set(field.code, field)
      }
    }

    let expression = formula
    const codeMatches = expression.match(/\[([^\]]+)\]/g) || []

    for (const match of codeMatches) {
      const code = match.slice(1, -1)
      const field = fieldByCode.get(code)
      let value = '0'

      if (field) {
        if (field.type === 'formula') {
          value = String(calculateFormula(field.formula || ''))
        } else {
          value = selectedFieldValues.value[field.id] || '0'
        }
      }

      const normalizedValue = Number.isNaN(Number(value)) ? '0' : value
      expression = expression.replace(match, normalizedValue)
    }

    try {
      const result = Function('"use strict"; return (' + expression + ')')()
      return Number.isNaN(result) ? 'N/A' : result
    } catch {
      return 'N/A'
    }
  }

  return {
    selectedFormId,
    selectedForm,
    selectedFieldValues,
    selectedFieldCheckboxes,
    savedFormList,
    selectedSections,
    handleFormSelect,
    handleFieldValueSelect,
    getCheckboxCount,
    isCheckboxChecked,
    toggleCheckbox,
    calculateFormula,
  }
}
