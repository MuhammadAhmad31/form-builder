<script setup lang="ts">
import { useFormStructure } from '@/composables/useFormStructure'
import { useFormStorage } from '@/composables/useFormStorage'
import { useFormBuilder } from './composables'
import SectionList from './SectionList.vue'
import ConfigPanel from './ConfigPanel.vue'
import FormBuilderHeader from './parts/form-builder/FormBuilderHeader.vue'
import AddSectionForm from './parts/form-builder/AddSectionForm.vue'
import FormBuilderSaveModal from './parts/form-builder/FormBuilderSaveModal.vue'
import FormBuilderLoadModal from './parts/form-builder/FormBuilderLoadModal.vue'
import FormBuilderSchemaModal from './parts/form-builder/FormBuilderSchemaModal.vue'

const fb = useFormStructure()
const storage = useFormStorage()

const {
  newSectionName,
  showAddSection,
  addingFieldForSection,
  showSaveModal,
  showLoadModal,
  showSchemaModal,
  saveName,
  saveDescription,
  formStructure,
  selectedSectionId,
  selectedFieldId,
  selectedSection,
  selectedField,
  totalFields,
  savedFormsList,
  handleAddSection,
  handleAddFieldClick,
  handleAddField,
  handleUpdateField,
  handleUpdateSection,
  handleDeleteField,
  handleSelectField,
  handleSelectSection,
  openSaveModal,
  openLoadModal,
  openSchemaModal,
  closeSaveModal,
  closeLoadModal,
  closeSchemaModal,
  handleSaveForm,
  handleLoadForm,
  handleDeleteForm,
  handleNewForm,
  copySchemaToClipboard,
} = useFormBuilder({ fb, storage })
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
    <div class="flex w-90 shrink-0 flex-col border-r border-slate-200 bg-white">
      <FormBuilderHeader
        :total-fields="totalFields"
        @save="openSaveModal"
        @load="openLoadModal"
        @schema="openSchemaModal"
        @new="handleNewForm"
      />

      <div class="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300">
        <SectionList
          :form-structure="formStructure"
          :selected-section-id="selectedSectionId"
          :selected-field-id="selectedFieldId"
          @select-section="handleSelectSection"
          @select-field="handleSelectField"
          @delete-section="fb.deleteSection"
          @delete-field="fb.deleteField"
          @toggle-collapse="fb.toggleSectionCollapse"
          @add-field-click="handleAddFieldClick"
        />
      </div>

      <AddSectionForm
        v-model="newSectionName"
        :visible="showAddSection"
        @show="showAddSection = true"
        @add="handleAddSection"
        @cancel="showAddSection = false; newSectionName = ''"
      />
    </div>

    <div class="flex flex-1 flex-col bg-white">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-3.5">
        <h2 class="text-sm font-bold tracking-tight text-slate-900">
          {{
            selectedField ? `Konfigurasi: ${selectedField.name}`
            : addingFieldForSection ? 'Tambah baris baru'
            : selectedSection ? `Konfigurasi: ${selectedSection.name}`
            : 'Konfigurasi'
          }}
        </h2>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <ConfigPanel
          :selected-section="selectedSection"
          :selected-field="selectedField"
          :adding-field-for-section="addingFieldForSection"
          :form-structure="formStructure"
          @add-field="handleAddField"
          @update-field="handleUpdateField"
          @update-section="handleUpdateSection"
          @delete-field="handleDeleteField"
          @cancel-add="addingFieldForSection = null"
        />
      </div>
    </div>

    <FormBuilderSaveModal
      :model-value="showSaveModal"
      :name="saveName"
      :description="saveDescription"
      @update:name="saveName = $event"
      @update:description="saveDescription = $event"
      @save="handleSaveForm"
      @close="closeSaveModal"
    />

    <FormBuilderLoadModal
      :model-value="showLoadModal"
      :saved-forms="savedFormsList"
      @load="handleLoadForm"
      @delete="handleDeleteForm"
      @close="closeLoadModal"
    />

    <FormBuilderSchemaModal
      :model-value="showSchemaModal"
      :form-structure="formStructure"
      @copy="copySchemaToClipboard"
      @close="closeSchemaModal"
    />
  </div>
</template>
