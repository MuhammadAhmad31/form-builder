<script setup lang="ts">
import { computed } from 'vue'
import type { DateValue } from 'reka-ui'
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  defaultDatePlaceholder,
  formatStoredDate,
  parseStoredDate,
  toStoredDate,
} from '@/lib/date-field'
import { cn } from '@/lib/utils'
import type { BuilderField } from '../types'

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

const fieldValue = computed(() => {
  const val = props.modelValue !== undefined ? props.modelValue : props.field.value
  return Array.isArray(val) ? '' : String(val)
})
const dateValue = computed(() => parseStoredDate(fieldValue.value))
const dateLabel = computed(() => formatStoredDate(fieldValue.value))

function handleDateChange(value: DateValue | undefined) {
  const newValue = toStoredDate(value)
  emit('focus')
  emit('update:value', newValue)
  emit('update:modelValue', newValue)
}

function clearValue() {
  emit('update:value', '')
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          type="button"
          variant="outline"
          :disabled="field.readOnly"
          :class="
            cn(
              'w-full justify-start text-left font-normal',
              !fieldValue && 'text-muted-foreground',
              error ? 'border-red-500' : '',
              field.readOnly ? 'bg-gray-100 text-gray-500' : '',
            )
          "
          @click="emit('focus')"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ dateLabel }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar
          :model-value="dateValue"
          :initial-focus="true"
          :default-placeholder="defaultDatePlaceholder"
          layout="month-and-year"
          @update:model-value="handleDateChange($event as DateValue | undefined)"
        />
      </PopoverContent>
    </Popover>
    <button
      v-if="field.clearable && fieldValue"
      type="button"
      class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-2 hover:bg-accent"
      @click="clearValue"
    >
      ✕
    </button>
  </div>
</template>
