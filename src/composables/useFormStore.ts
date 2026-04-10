import { reactive, ref, computed } from 'vue'
import type { FormSchema } from '@/services/formService'

interface StoredForm {
  id: string
  schema: FormSchema
  createdAt: string
  updatedAt: string
}

const state = reactive<{
  forms: Map<string, StoredForm>
  currentFormId: string | null
}>({
  forms: new Map(),
  currentFormId: null,
})

const formIdCounter = ref(0)

function generateFormId(): string {
  formIdCounter.value += 1
  return `form-${Date.now()}-${formIdCounter.value}`
}

export function useFormStore() {
  /**
   * Save form schema to store
   */
  function saveFormSchema(schema: FormSchema): string {
    const id = generateFormId()
    const now = new Date().toISOString()

    state.forms.set(id, {
      id,
      schema,
      createdAt: now,
      updatedAt: now,
    })

    state.currentFormId = id

    console.log(`Form saved to store with ID: ${id}`)
    return id
  }

  /**
   * Get form schema by ID
   */
  function getFormSchema(id: string): FormSchema | null {
    const form = state.forms.get(id)
    return form ? form.schema : null
  }

  /**
   * Update form schema
   */
  function updateFormSchema(id: string, schema: FormSchema): boolean {
    const form = state.forms.get(id)
    if (!form) {
      return false
    }

    form.schema = schema
    form.updatedAt = new Date().toISOString()
    console.log(`Form ${id} updated in store`)
    return true
  }

  /**
   * Delete form
   */
  function deleteForm(id: string): boolean {
    const deleted = state.forms.delete(id)
    if (deleted && state.currentFormId === id) {
      state.currentFormId = null
    }
    return deleted
  }

  /**
   * Get all forms
   */
  function getAllForms(): StoredForm[] {
    return Array.from(state.forms.values())
  }

  /**
   * Get current form
   */
  function getCurrentForm(): StoredForm | null {
    if (!state.currentFormId) {
      return null
    }
    return state.forms.get(state.currentFormId) || null
  }

  /**
   * Set current form
   */
  function setCurrentForm(id: string): boolean {
    if (!state.forms.has(id)) {
      return false
    }
    state.currentFormId = id
    return true
  }

  /**
   * Clear all forms
   */
  function clearAllForms(): void {
    state.forms.clear()
    state.currentFormId = null
  }

  // Computed properties
  const currentFormId = computed(() => state.currentFormId)
  const currentForm = computed(() => getCurrentForm())
  const allForms = computed(() => getAllForms())
  const formsCount = computed(() => state.forms.size)

  return {
    // State
    state,
    currentFormId,
    currentForm,
    allForms,
    formsCount,

    // Methods
    saveFormSchema,
    getFormSchema,
    updateFormSchema,
    deleteForm,
    getAllForms,
    getCurrentForm,
    setCurrentForm,
    clearAllForms,
  }
}
