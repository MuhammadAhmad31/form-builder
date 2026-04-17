<script setup lang="ts">
import type { FormSection } from '@/composables/useFormStructure'
import { useFormStorage } from '@/composables/useFormStorage'
import type {
  RendererPreviewSectionPayload,
  RendererSubmitHandler,
  RendererSubmitPayload,
} from './types'
import { useFormRendererPanel } from './composables'
import RendererFormPanel from './parts/form-renderer/RendererFormPanel.vue'
import RendererPreviewPanel from './parts/form-renderer/RendererPreviewPanel.vue'

interface Props {
  submit?: RendererSubmitHandler
}

const props = defineProps<Props>()

const storage = useFormStorage()

const {
  selectedFormId,
  selectedForm,
  savedFormList,
  selectedSections,
  selectedFieldValues,
  handleFormSelect,
  handleFieldValueSelect,
  getCheckboxCount,
  isCheckboxChecked,
  toggleCheckbox,
  calculateFormula,
} = useFormRendererPanel(storage)

const buildFormulaDependencies = (formula: string) => {
  const dependencies: Array<{ code: string; notation: 'positive' | 'negative' }> = []
  const seen = new Set<string>()
  const signStack = [1]
  let pendingOperator = 1

  for (let index = 0; index < formula.length; index += 1) {
    const character = formula[index]

    if (character === ' ') continue

    if (character === '+') {
      pendingOperator = 1
      continue
    }

    if (character === '-') {
      pendingOperator = -1
      continue
    }

    if (character === '(') {
      signStack.push(signStack[signStack.length - 1] * pendingOperator)
      pendingOperator = 1
      continue
    }

    if (character === ')') {
      if (signStack.length > 1) {
        signStack.pop()
      }
      pendingOperator = 1
      continue
    }

    if (character === '[') {
      const endIndex = formula.indexOf(']', index + 1)
      if (endIndex === -1) continue

      const code = formula.slice(index + 1, endIndex).trim()
      if (code && !seen.has(code)) {
        seen.add(code)
        const effectiveSign = signStack[signStack.length - 1] * pendingOperator
        dependencies.push({
          code,
          notation: effectiveSign < 0 ? 'negative' : 'positive',
        })
      }

      index = endIndex
      pendingOperator = 1
    }
  }

  return dependencies
}

const buildPreviewJson = (sections: FormSection[]): RendererPreviewSectionPayload[] => {
  return sections.map((section) => ({
    id: section.id,
    name: section.name,
    fields: section.fields.map((field) => ({
      id: field.id,
      code: field.code,
      name: field.name,
      type: field.type,
      value: field.type === 'formula' ? calculateFormula(field.formula || '') : selectedFieldValues.value[field.id] || '',
      calculateOf: field.type === 'formula' ? buildFormulaDependencies(field.formula || '') : undefined,
    })),
  }))
}

const handleSubmit = async () => {
  const payload: RendererSubmitPayload = {
    formJson: selectedForm.value?.formStructure || null,
    previewJson: buildPreviewJson(selectedSections.value),
  }

  console.log('[FormRenderer] submit payload', payload)

  if (props.submit) {
    await props.submit(payload)
  }
}
</script>

<template>
  <div class="p-4">
    <h2 class="mb-4 text-2xl font-bold">Renderer Forms</h2>

    <div class="grid grid-cols-2 gap-5">
        <RendererFormPanel
          :saved-forms="savedFormList"
          :selected-form-id="selectedFormId"
          :selected-sections="selectedSections"
          :selected-field-values="selectedFieldValues"
          :get-checkbox-count="getCheckboxCount"
          :is-checkbox-checked="isCheckboxChecked"
          :toggle-checkbox="toggleCheckbox"
          @form-select="handleFormSelect"
          @field-select="handleFieldValueSelect"
        />
    
        <RendererPreviewPanel
          :selected-sections="selectedSections"
          :selected-field-values="selectedFieldValues"
          :calculate-formula="calculateFormula"
        />
    </div>

    <div class="mt-5 flex justify-end">
      <button
        class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        :disabled="!selectedFormId"
        @click="handleSubmit"
      >
        Submit JSON
      </button>
    </div>
  </div>
</template>
