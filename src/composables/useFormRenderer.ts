import { ref, computed } from 'vue'
import type { FormStructure, FormField } from './useFormStructure'

export function useFormRenderer(formStructure: FormStructure) {
  const formData = ref<Record<string, any>>({})
  const formErrors = ref<Record<string, string>>({})

  // Initialize form data
  const initializeFormData = () => {
    const data: Record<string, any> = {}
    formStructure.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === 'akun') {
          data[field.code] = ''
        } else if (field.type === 'formula') {
          data[field.code] = 0
        } else if (field.type === 'number') {
          data[field.code] = 0
        } else if (field.type === 'text') {
          data[field.code] = ''
        }
      })
    })
    formData.value = data
  }

  // Calculate formula field value
  const calculateFormula = (formula: string): number => {
    try {
      let expression = formula
      // Replace [field_code] with actual values
      const fieldCodes = formula.match(/\[([^\]]+)\]/g) || []

      fieldCodes.forEach((match) => {
        const code = match.slice(1, -1) // Remove [ and ]
        const value = formData.value[code] ?? 0
        expression = expression.replace(match, value)
      })

      // Safely evaluate the expression
      // eslint-disable-next-line no-eval
      const result = Function('"use strict"; return (' + expression + ')')()
      return typeof result === 'number' ? result : 0
    } catch (e) {
      return 0
    }
  }

  // Get computed value for a field
  const getFieldValue = (field: FormField): any => {
    if (field.type === 'formula' && field.formula) {
      return calculateFormula(field.formula)
    }
    return formData.value[field.code] ?? ''
  }

  // Get all fields with their computed values
  const getFormDataWithFormulas = computed(() => {
    const data: Record<string, any> = { ...formData.value }

    formStructure.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === 'formula' && field.formula) {
          data[field.code] = calculateFormula(field.formula)
        }
      })
    })

    return data
  })

  // Validate form
  const validateForm = (): boolean => {
    formErrors.value = {}
    let isValid = true

    formStructure.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === 'akun' && !formData.value[field.code]) {
          formErrors.value[field.code] = `${field.name} harus diisi`
          isValid = false
        }
      })
    })

    return isValid
  }

  // Format number for display
  const formatNumber = (value: any): string => {
    const num = Number(value)
    if (isNaN(num)) return '0'
    return num.toLocaleString('id-ID')
  }

  // Parse number from input
  const parseNumber = (value: string): number => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned ? parseInt(cleaned, 10) : 0
  }

  // Reset form
  const resetForm = () => {
    initializeFormData()
    formErrors.value = {}
  }

  // Submit form
  const submitForm = () => {
    if (validateForm()) {
      return getFormDataWithFormulas.value
    }
    return null
  }

  initializeFormData()

  return {
    formData,
    formErrors,
    getFieldValue,
    getFormDataWithFormulas,
    validateForm,
    formatNumber,
    parseNumber,
    resetForm,
    submitForm,
  }
}
