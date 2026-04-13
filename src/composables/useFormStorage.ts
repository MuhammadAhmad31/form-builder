import { ref, computed } from 'vue'
import type { FormStructure } from './useFormStructure'

const STORAGE_KEY = 'form_builder_forms'

export interface SavedForm {
  id: string
  name: string
  description?: string
  formStructure: FormStructure
  createdAt: number
  updatedAt: number
}

export function useFormStorage() {
  const savedForms = ref<SavedForm[]>([])

  // Load all saved forms from localStorage
  const loadForms = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        savedForms.value = JSON.parse(data)
      }
    } catch (e) {
      console.error('Failed to load forms:', e)
    }
  }

  // Save a new form or update existing
  const saveForm = (
    formStructure: FormStructure,
    name: string,
    description?: string,
    id?: string
  ): SavedForm => {
    const now = Date.now()
    const formId = id || `form-${now}`

    const existingIndex = savedForms.value.findIndex((f) => f.id === formId)

    const savedForm: SavedForm = {
      id: formId,
      name,
      description,
      formStructure: { ...formStructure },
      createdAt: existingIndex !== -1 ? savedForms.value[existingIndex].createdAt : now,
      updatedAt: now,
    }

    if (existingIndex !== -1) {
      savedForms.value[existingIndex] = savedForm
    } else {
      savedForms.value.unshift(savedForm)
    }

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedForms.value))

    return savedForm
  }

  // Delete a form
  const deleteForm = (id: string) => {
    const index = savedForms.value.findIndex((f) => f.id === id)
    if (index !== -1) {
      savedForms.value.splice(index, 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedForms.value))
    }
  }

  // Get a form by id
  const getForm = (id: string): SavedForm | null => {
    return savedForms.value.find((f) => f.id === id) || null
  }

  // Get total forms
  const totalForms = computed(() => savedForms.value.length)

  // Initialize
  loadForms()

  return {
    savedForms,
    saveForm,
    deleteForm,
    getForm,
    loadForms,
    totalForms,
  }
}
