<script setup lang="ts">
import type { FormField, FormSection, FormStructure } from '@/composables/useFormStructure'
import { useConfigPanel } from './composables'
import ConfigSectionPanel from './parts/config-panel/ConfigSectionPanel.vue'
import ConfigFieldPanel from './parts/config-panel/ConfigFieldPanel.vue'

interface Props {
  selectedSection: FormSection | null
  selectedField: FormField | null
  addingFieldForSection: string | null
  formStructure: FormStructure
}

interface Emits {
  (e: 'add-field', sectionId: string, field: Omit<FormField, 'id'>): void
  (e: 'update-field', updates: Partial<FormField>): void
  (e: 'update-section', updates: Partial<FormSection>): void
  (e: 'delete-field'): void
  (e: 'cancel-add'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  fieldForm,
  sectionForm,
  formulaTokens,
  availableFieldsForFormula,
  handleAddField,
  handleSaveField,
  handleDeleteField,
  handleCancelAdd,
  handleUpdateSection,
  onTypeClick,
  onPreviewRowTypeChange,
  getTokenSign,
  toggleToken,
  removeToken,
  clearTokens,
} = useConfigPanel(props, emit)

const updateSectionName = (name: string) => {
  sectionForm.value.name = name
  handleUpdateSection()
}

const handleHideLabel = (hideLabel: boolean) => {
  if (props.selectedSection) {
    emit('update-section', { hideLabel })
  }
}
</script>

<template>
  <div class="flex h-full flex-col gap-5 overflow-y-auto">
    <div
      v-if="!selectedSection && !selectedField && !addingFieldForSection"
      class="flex h-full flex-col items-center justify-center gap-3 p-10 text-center"
    >
      <div class="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-500">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
          <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-600">Pilih section atau baris</p>
      <span class="text-xs text-slate-500">Klik item di sebelah kiri untuk mengonfigurasi</span>
    </div>

    <ConfigSectionPanel
      v-else-if="selectedSection && !selectedField && !addingFieldForSection"
      :section="selectedSection"
      :section-name="sectionForm.name"
      @update-name="updateSectionName"
      @hide-label="handleHideLabel"
    />

    <ConfigFieldPanel
      v-else-if="selectedField || addingFieldForSection"
      :selected-field="selectedField"
      :is-adding-field="Boolean(addingFieldForSection && !selectedField)"
      :field-form="fieldForm"
      :formula-tokens="formulaTokens"
      :available-fields-for-formula="availableFieldsForFormula"
      :get-token-sign="getTokenSign"
      @update-name="(name) => (fieldForm.name = name)"
      @update-description="(description) => (fieldForm.description = description)"
      @select-type="onTypeClick"
      @update-preview-row-type="onPreviewRowTypeChange"
      @update-mode="(mode: string) => { fieldForm.akunMode = mode as any }"
      @update-strategy="(strategy: string) => { fieldForm.akunStrategy = strategy as any }"
      @update-depth-mode="(mode: string) => { fieldForm.depthMode = mode as any }"
      @update-coa-category="(category: string) => { fieldForm.coaCategory = category as any }"
      @update-category-strategy="(strategy: string) => { fieldForm.categoryStrategy = strategy as any }"
      @toggle-token="toggleToken"
      @remove-token="removeToken"
      @clear-tokens="clearTokens"
      @add-field="handleAddField"
      @save-field="handleSaveField"
      @delete-field="handleDeleteField"
      @cancel-add="handleCancelAdd"
    />
  </div>
</template>
