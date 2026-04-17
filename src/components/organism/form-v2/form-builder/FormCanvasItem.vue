<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import FieldRenderer from './FieldRenderer.vue'
import { useFormFieldHelpers } from './composables'
import type { BuilderField } from './types'

const props = defineProps<{
  field: BuilderField
  selected: boolean
}>()

const emit = defineEmits<{
  select: []
  'update:value': [value: BuilderField['value']]
}>()

const { canvasFieldStyle, fieldContentClass, inputWrapperClass, labelClass } = useFormFieldHelpers()
</script>

<template>
  <div
    :class="
      cn(
        'builder-field-shell group relative flex h-full flex-col transition',
        selected ? 'rounded-sm outline-2 outline-offset-2 outline-foreground/40' : '',
      )
    "
    :draggable="true"
    :data-field-id="field.id"
    :data-section-id="field.sectionId"
    @click.stop="emit('select')"
    @dragstart="$event.dataTransfer!.effectAllowed = 'move'; $event.dataTransfer!.setData('fieldId', field.id); $event.dataTransfer!.setData('sectionId', field.sectionId)"
  >
    <button
      type="button"
      class="builder-drag-handle absolute -top-3 right-0 z-20 inline-flex h-6 w-6 cursor-move items-center justify-center rounded-md bg-foreground text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
      :class="selected ? 'opacity-100' : ''"
    >
      <span class="grid grid-cols-2 gap-0.5">
        <span class="h-0.75 w-0.75 rounded-full bg-current" />
        <span class="h-0.75 w-0.75 rounded-full bg-current" />
        <span class="h-0.75 w-0.75 rounded-full bg-current" />
        <span class="h-0.75 w-0.75 rounded-full bg-current" />
      </span>
    </button>

    <div :style="canvasFieldStyle(field)" class="flex min-h-0 flex-1 flex-col">
      <div
        :class="
          cn(
            'builder-content flex min-h-0 flex-1 gap-1.5',
            field.readOnly ? 'pointer-events-none select-none' : '',
            fieldContentClass(field),
          )
        "
      >
        <template v-if="field.labelPlacement === 'top' || field.labelPlacement === 'left'">
          <Label :class="cn('text-sm font-semibold', labelClass(field))">
            {{ field.label }}
            <span v-if="field.required" class="text-destructive">*</span>
          </Label>
        </template>

        <div :class="inputWrapperClass(field)">
          <FieldRenderer
            :field="field"
            @focus="emit('select')"
            @update:value="emit('update:value', $event)"
          />
        </div>

        <template v-if="field.labelPlacement === 'bottom' || field.labelPlacement === 'right'">
          <Label :class="cn('text-sm font-semibold', labelClass(field))">
            {{ field.label }}
            <span v-if="field.required" class="text-destructive">*</span>
          </Label>
        </template>
      </div>
    </div>
  </div>
</template>
