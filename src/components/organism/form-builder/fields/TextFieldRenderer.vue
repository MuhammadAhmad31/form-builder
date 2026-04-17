<script setup lang="ts">
import { Input } from '@/components/ui/input'
import type { BuilderField } from '../types'
import { cn } from '@/lib/utils'

interface Props {
  field: BuilderField
  modelValue?: string | number | string[]
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

const currentValue = () => {
  const val = props.modelValue !== undefined ? props.modelValue : props.field.value
  return Array.isArray(val) ? '' : val
}
</script>

<template>
  <Input
    :model-value="currentValue()"
    type="text"
    :placeholder="field.placeholder"
    :class="cn(
      error ? 'border-red-500' : '',
      field.readOnly ? 'bg-gray-100 text-gray-500' : ''
    )"
    :readonly="field.readOnly"
    @update:model-value="emit('update:value', String($event)); emit('update:modelValue', String($event))"
    @focus="emit('focus')"
  />
</template>

