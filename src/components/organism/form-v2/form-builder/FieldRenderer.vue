<script setup lang="ts">
import { computed } from 'vue'
import type { BuilderField } from './types'
import CheckboxFieldRenderer from './fields/CheckboxFieldRenderer.vue'
import DateFieldRenderer from './fields/DateFieldRenderer.vue'
import NumberFieldRenderer from './fields/NumberFieldRenderer.vue'
import RadioFieldRenderer from './fields/RadioFieldRenderer.vue'
import SelectFieldRenderer from './fields/SelectFieldRenderer.vue'
import TextFieldRenderer from './fields/TextFieldRenderer.vue'
import TextareaFieldRenderer from './fields/TextareaFieldRenderer.vue'

const props = defineProps<{
  field: BuilderField
}>()

const emit = defineEmits<{
  'update:value': [value: BuilderField['value']]
  focus: []
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
    @update:value="emit('update:value', $event)"
    @focus="emit('focus')"
  />
</template>
