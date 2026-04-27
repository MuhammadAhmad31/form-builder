import { computed, ref } from 'vue'

/**
 * Validation rule types
 */
export type ValidationRule = 
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'custom'; validate: (value: any) => boolean | string; message?: string }
  | { type: 'custom-async'; validate: (value: any) => Promise<boolean | string>; message?: string }

/**
 * Form field validation configuration
 */
export interface FormFieldConfig {
  name?: string
  rules: ValidationRule[]
  label?: string
}

/**
 * Form validation result
 */
export interface FormValidationResult {
  field: string
  isValid: boolean
  error?: string
}

/**
 * Composable untuk form validation yang flexible dan reusable dengan strict typing
 * 
 * @template T - Form data type untuk strict field name checking
 * 
 * @example
 * // Define form data type
 * interface LoginForm {
 *   email: string
 *   password: string
 * }
 * 
 * // Setup validation dengan generic type - akan error jika field name tidak match
 * const { validateField, getFieldError, isFormValid } = useFormValidation<LoginForm>({
 *   email: {
 *     label: 'Email',
 *     rules: [
 *       { type: 'required' },
 *       { type: 'email', message: 'Email tidak valid' }
 *     ]
 *   },
 *   password: {
 *     label: 'Password',
 *     rules: [
 *       { type: 'required' },
 *       { type: 'minLength', value: 8 }
 *     ]
 *   }
 *   // names: { ... }  // ERROR: 'names' tidak ada di LoginForm
 * })
 * 
 * // Validasi dengan strict type checking
 * validateField('email', value)    // OK
 * validateField('emaill', value)   // ERROR: 'emaill' tidak ada di LoginForm
 */
export function useFormValidation<T extends Record<string, any> = Record<string, any>>(
  config: Partial<Record<keyof T, FormFieldConfig>>
) {
  // Simpan config field
  const fieldsConfig = config as Record<string, FormFieldConfig>

  // Simpan error state per field
  const fieldErrors = ref<Partial<Record<keyof T, string>>>({})

  // Simpan validated state per field
  const fieldValidated = ref<Partial<Record<keyof T, boolean>>>({})

  // Initialize semua field
  for (const fieldName of Object.keys(config)) {
    fieldErrors.value[fieldName as keyof T] = ''
    fieldValidated.value[fieldName as keyof T] = false
  }

  /**
   * Default error messages untuk validation types
   */
  const defaultMessages: Record<string, string> = {
    required: '{label} harus diisi',
    minLength: '{label} minimal {value} karakter',
    maxLength: '{label} maksimal {value} karakter',
    pattern: '{label} format tidak valid',
    email: '{label} harus email yang valid',
  }

  /**
   * Get label untuk error message
   */
  const getLabel = (fieldName: string) => {
    return fieldsConfig[fieldName]?.label || fieldName
  }

  /**
   * Format error message dengan placeholder
   */
  const formatMessage = (message: string, fieldName: string, data?: Record<string, any>) => {
    const label = getLabel(fieldName)
    let formatted = message.replace('{label}', label)
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        formatted = formatted.replace(`{${key}}`, String(value))
      })
    }
    return formatted
  }

  /**
   * Validate single rule untuk field value
   */
  const validateRule = async (value: any, rule: ValidationRule, fieldName: string): Promise<string | null> => {
    try {
      switch (rule.type) {
        case 'required': {
          const isEmpty = !value || (typeof value === 'string' && !value.trim())
          if (isEmpty) {
            const msg = rule.message || defaultMessages.required
            return formatMessage(msg, fieldName)
          }
          return null
        }

        case 'minLength': {
          if (value && String(value).length < rule.value) {
            const msg = rule.message || defaultMessages.minLength
            return formatMessage(msg, fieldName, { value: rule.value })
          }
          return null
        }

        case 'maxLength': {
          if (value && String(value).length > rule.value) {
            const msg = rule.message || defaultMessages.maxLength
            return formatMessage(msg, fieldName, { value: rule.value })
          }
          return null
        }

        case 'pattern': {
          if (value && !rule.value.test(String(value))) {
            const msg = rule.message || defaultMessages.pattern
            return formatMessage(msg, fieldName)
          }
          return null
        }

        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (value && !emailRegex.test(String(value))) {
            const msg = rule.message || defaultMessages.email
            return formatMessage(msg, fieldName)
          }
          return null
        }

        case 'custom': {
          const result = rule.validate(value)
          if (result === true) return null
          if (result === false) return formatMessage(rule.message || '{label} tidak valid', fieldName)
          return result
        }

        case 'custom-async': {
          const result = await rule.validate(value)
          if (result === true) return null
          if (result === false) return formatMessage(rule.message || '{label} tidak valid', fieldName)
          return result
        }

        default:
          return null
      }
    } catch (error) {
      console.error(`Validation error for ${fieldName}:`, error)
      return null
    }
  }

  /**
   * Validate field value dengan semua rules
   */
  const validateField = async (fieldName: keyof T, value: any): Promise<boolean> => {
    const config = fieldsConfig[fieldName as string]
    if (!config) {
      console.warn(`Field ${String(fieldName)} tidak ada di config`)
      return true
    }

    // Jalankan semua rules, stop di rule pertama yang error
    for (const rule of config.rules) {
      const error = await validateRule(value, rule, fieldName as string)
      if (error) {
        fieldErrors.value[fieldName] = error
        fieldValidated.value[fieldName] = true
        return false
      }
    }

    // Semua rules pass
    fieldErrors.value[fieldName] = ''
    fieldValidated.value[fieldName] = true
    return true
  }

  /**
   * Validate semua fields sekaligus
   */
  const validateAll = async (formData: Partial<T>): Promise<FormValidationResult[]> => {
    const results: FormValidationResult[] = []

    for (const [fieldName, value] of Object.entries(formData)) {
      const isValid = await validateField(fieldName as keyof T, value)
      results.push({
        field: fieldName,
        isValid,
        error: fieldErrors.value[fieldName as keyof T],
      })
    }

    return results
  }

  /**
   * Get error message untuk field
   */
  const getFieldError = (fieldName: keyof T): string => {
    return fieldErrors.value[fieldName] || ''
  }

  /**
   * Check apakah field valid
   */
  const isFieldValid = computed(() => (fieldName: keyof T): boolean => {
    return (fieldValidated.value[fieldName] ?? false) && !(fieldErrors.value[fieldName])
  })

  /**
   * Check apakah field sudah di-validate
   */
  const isFieldValidated = computed(() => (fieldName: keyof T): boolean => {
    return fieldValidated.value[fieldName] ?? false
  })

  /**
   * Check apakah semua field valid
   */
  const isFormValid = computed(() => {
    return Object.entries(fieldErrors.value).every(([fieldName, error]) => {
      return !error && fieldValidated.value[fieldName]
    })
  })

  /**
   * Reset semua validasi
   */
  const resetValidation = () => {
    Object.keys(fieldErrors.value).forEach(key => {
      fieldErrors.value[key] = ''
      fieldValidated.value[key] = false
    })
  }

  /**
   * Reset specific field validation
   */
  const resetFieldValidation = (fieldName: keyof T) => {
    fieldErrors.value[fieldName] = ''
    fieldValidated.value[fieldName] = false
  }

  return {
    // State
    fieldErrors,
    fieldValidated,

    // Validation functions
    validateField,
    validateAll,
    resetValidation,
    resetFieldValidation,

    // Helpers
    getFieldError,
    isFieldValid,
    isFieldValidated,
    isFormValid,
  }
}
