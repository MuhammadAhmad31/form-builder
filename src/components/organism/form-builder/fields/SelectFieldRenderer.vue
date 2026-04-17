<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { BuilderField } from '../types'

interface Props {
  field: BuilderField
  modelValue?: string | string[]
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
})

const emit = defineEmits<{
  'update:value': [value: string]
  'update:modelValue': [value: string]
  focus: []
}>()

function getCurrentValue() {
  const val = props.modelValue !== undefined ? props.modelValue : props.field.value
  return Array.isArray(val) ? '' : String(val)
}

function handleValueChange(value: string) {
  emit('update:value', value)
  emit('update:modelValue', value)
}

function clearValue() {
  emit('update:value', '')
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Select
      :model-value="getCurrentValue()"
      @update:model-value="handleValueChange($event as string)"
    >
      <SelectTrigger
        :disabled="field.readOnly"
        :class="cn(
          'w-full',
          error ? 'border-red-500' : '',
          field.readOnly ? 'bg-gray-100 text-gray-500' : ''
        )"
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
      v-if="field.clearable && getCurrentValue()"
      type="button"
      class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-2 hover:bg-accent"
      @click="clearValue"
    >
      ✕
    </button>
  </div>
</template>
