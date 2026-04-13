<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FormRenderer } from '@/components/organism/form-renderer'
import { useFormStore } from '@/composables/useFormStore'
import type { FormSchema } from '@/services/formService'

const route = useRoute()
const router = useRouter()
const { getFormSchema } = useFormStore()

const formId = ref<string | null>(null)
const schema = ref<FormSchema | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

function loadFormSchema(id: string) {
  loading.value = true
  error.value = null

  try {
    const loadedSchema = getFormSchema(id)

    if (loadedSchema) {
      schema.value = loadedSchema
      console.log('Form loaded from store:', id)
    } else {
      error.value = `Form with ID "${id}" not found in store`
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load form schema'
  } finally {
    loading.value = false
  }
}

function handleFormSubmit(data: Record<string, any>) {
  console.log('Form submitted with data:', data)
}

onMounted(() => {
  const queryId = route.query.id as string
  if (queryId) {
    formId.value = queryId
    loadFormSchema(queryId)
  }
})
</script>

<template>
  <div>
    <div v-if="!formId" class="fixed right-6 top-6 z-50 flex gap-2">
      <input
        v-model="formId"
        type="text"
        placeholder="Enter Form ID"
        class="px-3 py-2 border border-gray-300 rounded"
        @keyup.enter="formId && loadFormSchema(formId)"
      />
      <button
        @click="formId && loadFormSchema(formId)"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Load
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-screen bg-gray-100">
      <p class="text-lg text-gray-600">Loading form...</p>
    </div>

    <div v-else-if="error" class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md space-y-4">
        <h2 class="text-xl font-bold text-red-600">Error</h2>
        <p class="text-gray-600">{{ error }}</p>
        <div class="flex gap-2">
          <button
            @click="formId && loadFormSchema(formId)"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
          <button
            @click="router.push({ name: 'form-builder' })"
            class="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Builder
          </button>
        </div>
      </div>
    </div>

    <FormRenderer v-else-if="schema" :schema="schema" :form-id="formId || ''" :on-submit="handleFormSubmit" />
  </div>
</template>
