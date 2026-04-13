<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { BuilderField } from '../types'

const props = defineProps<{
  field: BuilderField
}>()

const emit = defineEmits<{
  'update:value': [value: string]
  focus: []
}>()

const stackClass = computed(() =>
  props.field.optionLayout === 'horizontal'
    ? 'flex-row flex-wrap items-center gap-x-4 gap-y-2'
    : 'flex-col gap-2',
)

function setValue(optionValue: string) {
  emit('focus')
  emit('update:value', optionValue)
}
</script>

<template>
  <div :class="cn('flex', stackClass)">
    <label
      v-for="option in field.options"
      :key="option.id"
      class="flex items-center gap-2 text-sm"
    >
      <input
        type="radio"
        :name="field.name"
        class="h-4 w-4 border-input"
        :checked="field.value === option.value"
        :disabled="field.readOnly"
        @change="setValue(option.value)"
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>
