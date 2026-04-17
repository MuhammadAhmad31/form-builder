<script setup lang="ts">
import { computed } from 'vue'
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
  'update:value': [value: string | string[]]
  'update:modelValue': [value: string | string[]]
  focus: []
}>()

const currentValue = () => props.modelValue !== undefined ? props.modelValue : props.field.value

const stackClass = computed(() =>
  props.field.optionLayout === 'horizontal'
    ? 'flex-row flex-wrap items-center gap-x-4 gap-y-2'
    : 'flex-col gap-2',
)

const singleOption = computed(() => props.field.options[0] ?? null)

function isChecked(optionValue: string) {
  const value = currentValue()
  return Array.isArray(value) ? value.includes(optionValue) : value === optionValue
}

function toggleValue(optionValue: string, checked: boolean) {
  emit('focus')

  if (props.field.selectionMode === 'single') {
    const newValue = checked ? optionValue : ''
    emit('update:value', newValue)
    emit('update:modelValue', newValue)
    return
  }

  const current = Array.isArray(currentValue()) ? [...currentValue() as string[]] : []
  const newValue = checked
    ? current.includes(optionValue)
      ? current
      : [...current, optionValue]
    : current.filter((value) => value !== optionValue)

  emit('update:value', newValue)
  emit('update:modelValue', newValue)
}
</script>

<template>
  <label
    v-if="field.selectionMode === 'single' && singleOption"
    class="flex items-center gap-2 text-sm"
  >
    <input
      type="checkbox"
      class="h-4 w-4 rounded border-input"
      :checked="isChecked(singleOption.value)"
      :disabled="field.readOnly"
      @change="toggleValue(singleOption.value, ($event.target as HTMLInputElement).checked)"
    />
    <span>{{ singleOption.label }}</span>
  </label>

  <div v-else :class="cn('flex', stackClass)">
    <label
      v-for="option in field.options"
      :key="option.id"
      class="flex items-center gap-2 text-sm"
    >
      <input
        type="checkbox"
        class="h-4 w-4 rounded border-input"
        :checked="isChecked(option.value)"
        :disabled="field.readOnly"
        @change="toggleValue(option.value, ($event.target as HTMLInputElement).checked)"
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>
