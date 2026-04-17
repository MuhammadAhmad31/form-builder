<script setup lang="ts">
import type { FormStructure } from '@/composables/useFormStructure'
import SectionListEmptyState from './parts/section-list/SectionListEmptyState.vue'
import SectionListItem from './parts/section-list/SectionListItem.vue'

interface Props {
  formStructure: FormStructure
  selectedSectionId: string | null
  selectedFieldId: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'select-field', sectionId: string, fieldId: string): void
  (e: 'select-section', id: string | null): void
  (e: 'delete-section', id: string): void
  (e: 'delete-field', sectionId: string, fieldId: string): void
  (e: 'toggle-collapse', sectionId: string): void
  (e: 'add-field-click', sectionId: string): void
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <SectionListEmptyState v-if="formStructure.sections.length === 0" />

    <SectionListItem
      v-for="section in formStructure.sections"
      v-else
      :key="section.id"
      :section="section"
      :selected-section-id="selectedSectionId"
      :selected-field-id="selectedFieldId"
      @select-section="emit('select-section', $event)"
      @select-field="(sectionId, fieldId) => emit('select-field', sectionId, fieldId)"
      @delete-section="(id) => emit('delete-section', id)"
      @delete-field="(sectionId, fieldId) => emit('delete-field', sectionId, fieldId)"
      @toggle-collapse="(sectionId) => emit('toggle-collapse', sectionId)"
      @add-field-click="(sectionId) => emit('add-field-click', sectionId)"
    />
  </div>
</template>
