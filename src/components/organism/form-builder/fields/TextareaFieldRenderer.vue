<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
import type { BuilderField } from '../types'

defineProps<{
  field: BuilderField
}>()

const emit = defineEmits<{
  'update:value': [value: string]
  focus: []
}>()
</script>

<template>
  <Textarea
    class="min-h-28 flex-1"
    :model-value="field.value as string | number | undefined"
    :placeholder="field.placeholder"
    :class="field.readOnly ? 'bg-gray-100 text-gray-500' : ''"
    :readonly="field.readOnly"
    @update:model-value="emit('update:value', String($event))"
    @focus="emit('focus')"
  />
</template>
