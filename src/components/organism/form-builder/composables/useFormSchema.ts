import { ref, type Ref } from 'vue'
import { formService, type FormSchema } from '@/services/formService'
import { useFormStore } from '@/composables/useFormStore'
import type { BuilderField } from '../types'

export function useFormSchema(fields: Ref<BuilderField[]>, onSubmitCallback?: (schema: FormSchema) => void | Promise<void>) {
  const isSubmitting = ref(false)
  const { saveFormSchema } = useFormStore()

  function exportSchema(): FormSchema {
    return {
      fields: fields.value.map((field) => ({
        id: field.id,
        type: field.type,
        label: field.label,
        labelPlacement: field.labelPlacement,
        name: field.name,
        placeholder: field.placeholder,
        value: field.value || undefined,
        helpText: field.helpText,
        required: field.required,
        readOnly: field.readOnly,
        clearable: field.clearable,
        selectionMode: field.selectionMode,
        optionLayout: field.optionLayout,
        spacing: field.spacing,
        options: field.options.length > 0 ? field.options.map((opt) => ({ label: opt.label, value: opt.value })) : undefined,
        x: field.x,
        y: field.y,
        w: field.w,
        h: field.h,
      })),
    }
  }

  function copySchemaToClipboard() {
    const schema = exportSchema()
    const json = formService.exportSchemaAsJSON(schema)
    navigator.clipboard.writeText(json).then(() => {
      alert('Schema copied to clipboard!')
    })
  }

  async function submitSchema() {
    isSubmitting.value = true
    try {
      const schema = exportSchema()
      const id = saveFormSchema(schema)
      console.log('Form schema submitted successfully to store:', id)

      // Call the onSubmit callback if provided
      if (onSubmitCallback) {
        await onSubmitCallback(schema)
      }

      return id
    } catch (error) {
      console.error('Failed to submit form schema:', error)
      alert('Failed to submit form schema. Check console for details.')
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    exportSchema,
    copySchemaToClipboard,
    submitSchema,
  }
}
