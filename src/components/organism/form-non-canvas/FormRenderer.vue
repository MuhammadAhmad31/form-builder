<script setup lang="ts">
import { useFormStorage } from '@/composables/useFormStorage'
import { useFormRendererPanel } from './composables'
import RendererFormPanel from './parts/form-renderer/RendererFormPanel.vue'
import RendererPreviewPanel from './parts/form-renderer/RendererPreviewPanel.vue'

const storage = useFormStorage()

const {
  selectedFormId,
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
  </div>
</template>
