<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { BuilderField } from '../types'

defineProps<{
  field: BuilderField
}>()

const emit = defineEmits<{
  'update:value': [value: string]
  focus: []
}>()

function clearValue() {
  emit('update:value', '')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Select
      :model-value="field.value"
      @update:model-value="emit('update:value', $event as string)"
    >
      <SelectTrigger
        :class="cn('w-full', field.readOnly ? 'bg-gray-100 text-gray-500' : '')"
        @click="emit('focus')"
      >
        <SelectValue :placeholder="field.placeholder || 'Pilih opsi'" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in field.options"
          :key="option.id"
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <button
      v-if="field.clearable && field.value"
      type="button"
      class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-2 hover:bg-accent"
      @click="clearValue"
    >
      ✕
    </button>
  </div>
</template>
