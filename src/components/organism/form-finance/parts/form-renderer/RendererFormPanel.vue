<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FormSection } from '@/composables/useFormStructure'
import type { SavedForm } from '@/composables/useFormStorage'

interface Props {
  savedForms: SavedForm[]
  selectedFormId: string | null
  selectedSections: FormSection[]
  selectedFieldValues: Record<string, string>
  getCheckboxCount: (fieldId: string) => number
  isCheckboxChecked: (fieldId: string, index: number) => boolean
  toggleCheckbox: (fieldId: string, index: number, checked: boolean) => void
}

defineProps<Props>()

const emit = defineEmits<{
  formSelect: [value: AcceptableValue]
  fieldSelect: [fieldId: string, value: AcceptableValue]
}>()
</script>

<template>
  <div class="mt-6">
    <p class="text-sm text-muted-foreground">
      Select a form to load its schema and data for rendering.
    </p>

    <Select :model-value="selectedFormId" @update:model-value="(value) => emit('formSelect', value)">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a saved form" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Saved Forms</SelectLabel>
          <SelectItem v-for="form in savedForms" :key="form.id" :value="form.id">
            {{ form.name }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <div class="mt-6 grid grid-cols-2 gap-4">
      <div v-if="selectedSections.length > 0" class="mt-4 space-y-4">
        <div
          v-for="section in selectedSections.filter((section) => section.fields.some((field) => field.type === 'akun'))"
          :key="section.id"
          class="space-y-2"
        >
          <p class="text-sm font-medium">{{ section.name }}</p>

          <div
            v-for="field in section.fields.filter((field) => field.type === 'akun')"
            :key="field.id"
            class="space-y-2 p-2"
          >
            <div class="grid grid-cols-3 items-center gap-3">
              <p class="ml-4 text-sm text-muted-foreground">{{ field.name }}</p>
              <p class="text-xs">{{ field.akunSource }}</p>

              <Select
                :model-value="selectedFieldValues[field.id]"
                @update:model-value="(value) => emit('fieldSelect', field.id, value)"
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Value</SelectLabel>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div v-if="getCheckboxCount(field.id) > 0" class="ml-4 flex flex-wrap gap-3">
              <label
                v-for="index in getCheckboxCount(field.id)"
                :key="`${field.id}-checkbox-${index}`"
                class="inline-flex items-center gap-2 px-2 py-1 text-xs"
              >
                <input
                  type="checkbox"
                  :checked="isCheckboxChecked(field.id, index - 1)"
                  @change="toggleCheckbox(field.id, index - 1, ($event.target as HTMLInputElement).checked)"
                />
                <span>Item {{ index }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="mt-4 text-sm text-muted-foreground">
        No sections or fields available in this form.
      </div>
    </div>
  </div>
</template>
