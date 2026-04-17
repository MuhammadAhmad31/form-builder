<script setup lang="ts">
import type { FormSection } from '@/composables/useFormStructure'

interface Props {
  selectedSections: FormSection[]
  selectedFieldValues: Record<string, string>
  calculateFormula: (formula: string) => number | string
}

defineProps<Props>()
</script>

<template>
  <div>
    <p>Preview</p>
    <div class="mt-2 rounded bg-muted p-2 text-sm">
      <div v-for="section in selectedSections" :key="section.id">
        <p class="font-semibold">{{ section.name }}</p>
        <div v-for="field in section.fields" :key="field.id" class="ml-4 p-2">
          <p v-if="field.type !== 'formula'">
            {{ field.name }}: {{ selectedFieldValues[field.id] || '' }}
          </p>
          <p v-else class="font-semibold text-emerald-700">
            {{ field.name }}: {{ calculateFormula(field.formula || '') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
