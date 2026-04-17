<script setup lang="ts">
import { computed } from 'vue'
import type { BuilderField } from '../form-builder/types'
import CheckboxFieldRenderer from '../form-builder/fields/CheckboxFieldRenderer.vue'
import DateFieldRenderer from '../form-builder/fields/DateFieldRenderer.vue'
import NumberFieldRenderer from '../form-builder/fields/NumberFieldRenderer.vue'
import RadioFieldRenderer from '../form-builder/fields/RadioFieldRenderer.vue'
import SelectFieldRenderer from '../form-builder/fields/SelectFieldRenderer.vue'
import TextFieldRenderer from '../form-builder/fields/TextFieldRenderer.vue'
import TextareaFieldRenderer from '../form-builder/fields/TextareaFieldRenderer.vue'

const props = defineProps<{
  field: BuilderField
  modelValue: string | string[]
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const componentMap = {
  text: TextFieldRenderer,
  number: NumberFieldRenderer,
  textarea: TextareaFieldRenderer,
  date: DateFieldRenderer,
  checkbox: CheckboxFieldRenderer,
  radio: RadioFieldRenderer,
  select: SelectFieldRenderer,
}

const rendererComponent = computed(() => componentMap[props.field.type] ?? TextFieldRenderer)
</script>

<template>
  <component
    :is="rendererComponent"
    :field="field"
    :model-value="modelValue"
    :error="error"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

