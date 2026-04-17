<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FormBuilder } from '@/components/organism/form-v2/form-builder'
import { useFormStore } from '@/composables/useFormStore'
import {
  // formService,
  type FormSchema
} from '@/services/formService'

const router = useRouter()
const { saveFormSchema } = useFormStore()

const submittedFormId = ref<string | null>(null)

async function handleFormSubmit(schema: FormSchema) {
  try {
    // Save to store
    const formId = saveFormSchema(schema)
    submittedFormId.value = formId

    // submitted to api service
    // const result = formService.submitFormSchema(schema)

    // console.log('Form submitted to service:', result)
    console.log('Form saved to store:', formId)
  } catch (error) {
    console.error('Failed to save form:', error)
    throw error
  }
}

watch(submittedFormId, (formId) => {
  if (formId) {
    setTimeout(() => {
      router.push({ name: 'form-renderer', query: { id: formId } })
    }, 1500)
  }
})
</script>

<template>
  <div>
    <FormBuilder :on-submit="handleFormSubmit" />
    <div v-if="submittedFormId" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md text-center space-y-4">
        <h2 class="text-xl font-bold text-green-600">✓ Form Saved!</h2>
        <p class="text-gray-600">Form ID: <code class="bg-gray-100 px-2 py-1 rounded">{{ submittedFormId }}</code></p>
        <p class="text-sm text-gray-500">Redirecting to form renderer...</p>
      </div>
    </div>
  </div>
</template>
