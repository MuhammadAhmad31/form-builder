<script setup lang="ts">
import type { DateValue } from "reka-ui";
import { GridItem, GridLayout} from 'grid-layout-plus'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon } from "lucide-vue-next";
import {
  defaultDatePlaceholder,
  formatStoredDate,
  parseStoredDate,
  toStoredDate,
} from '@/lib/date-field'
import { cn } from '@/lib/utils'
import { useFormRenderer } from './useFormRenderer'
import type { FormRendererProps } from './useFormRenderer'

const props = defineProps<FormRendererProps>()

const {
  GRID_COLUMNS,
  GRID_ROW_HEIGHT,
  GRID_MARGIN,
  canvasLayoutItems,
  canvasFieldStyle,
  getFieldById,
  labelClass,
  handleSubmit,
  fieldContentClass,
  inputWrapperClass,
  errors,
  isSubmitting,
  formData,
  resetForm
} = useFormRenderer(props)

function getChoiceStackClass(fieldId: string) {
  const field = getFieldById(fieldId)
  return field?.optionLayout === 'horizontal' ? 'flex-row flex-wrap items-center gap-x-4 gap-y-2' : 'flex-col gap-2'
}

function isCheckboxChecked(fieldId: string, optionValue: string) {
  const field = getFieldById(fieldId)
  const value = field ? formData[field.name] : ''
  return Array.isArray(value) ? value.includes(optionValue) : value === optionValue
}

function toggleCheckboxValue(fieldId: string, optionValue: string, checked: boolean) {
  const field = getFieldById(fieldId)
  if (!field) {
    return
  }

  if (field.selectionMode === 'single') {
    formData[field.name] = checked ? optionValue : ''
    return
  }

  const current = Array.isArray(formData[field.name]) ? [...formData[field.name]] : []
  formData[field.name] = checked
    ? current.includes(optionValue) ? current : [...current, optionValue]
    : current.filter((value: string) => value !== optionValue)
}

function setRadioValue(fieldId: string, optionValue: string) {
  const field = getFieldById(fieldId)
  if (!field) {
    return
  }

  formData[field.name] = optionValue
}

function getDateValue(fieldId: string) {
  const field = getFieldById(fieldId)
  return field ? parseStoredDate(String(formData[field.name] || "")) : undefined
}

function getDateLabel(fieldId: string) {
  const field = getFieldById(fieldId)
  return field ? formatStoredDate(String(formData[field.name] || "")) : "Pick a date"
}

function updateDateValue(fieldId: string, value: DateValue | undefined) {
  const field = getFieldById(fieldId)
  if (!field) {
    return
  }

  formData[field.name] = toStoredDate(value)
}
</script>

<template>
  <main class="min-h-screen p-6">
    <div class="mx-auto max-w-5xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- container harus block + full width sebelum GridLayout mount -->
        <div class="w-full min-w-0">
          <GridLayout
            class="form-renderer-grid"
            :layout="canvasLayoutItems"
            :col-num="GRID_COLUMNS"
            :row-height="GRID_ROW_HEIGHT"
            :margin="GRID_MARGIN"
            :is-draggable="false"
            :is-resizable="false"
            :vertical-compact="false"
            :use-css-transforms="true"
          >
            <GridItem
              v-for="item in canvasLayoutItems"
              :key="String(item.i)"
              :i="item.i"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :min-w="item.minW"
              :min-h="item.minH"
            >

              <div v-if="getFieldById(String(item.i))" class="h-full w-full" :style="canvasFieldStyle(getFieldById(String(item.i))!)">
                <div :class="cn('flex h-full flex-col gap-1.5', fieldContentClass(getFieldById(String(item.i))!))">
                  <!-- Label Top/Left -->
                  <template v-if="getFieldById(String(item.i))?.labelPlacement === 'top' || getFieldById(String(item.i))?.labelPlacement === 'left'">
                    <Label :class="cn('text-sm font-semibold', labelClass(getFieldById(String(item.i))!))">
                      {{ getFieldById(String(item.i))?.label }}
                      <span v-if="getFieldById(String(item.i))?.required" class="text-red-500">*</span>
                    </Label>
                  </template>

                  <!-- Input Wrapper -->
                  <div :class="inputWrapperClass(getFieldById(String(item.i))!)">
                    <!-- Text Input -->
                    <Input
                      v-if="getFieldById(String(item.i))?.type === 'text'"
                      v-model="formData[getFieldById(String(item.i))!.name]"
                      type="text"
                      :placeholder="getFieldById(String(item.i))?.placeholder"
                      :readonly="getFieldById(String(item.i))?.readOnly"
                      :class="errors[getFieldById(String(item.i))!.name] ? 'border-red-500' : ''"
                    />

                    <!-- Number Input -->
                    <Input
                      v-else-if="getFieldById(String(item.i))?.type === 'number'"
                      v-model="formData[getFieldById(String(item.i))!.name]"
                      type="number"
                      :placeholder="getFieldById(String(item.i))?.placeholder"
                      :readonly="getFieldById(String(item.i))?.readOnly"
                      :class="errors[getFieldById(String(item.i))!.name] ? 'border-red-500' : ''"
                    />

                    <!-- Textarea -->
                    <Textarea
                      v-else-if="getFieldById(String(item.i))?.type === 'textarea'"
                      v-model="formData[getFieldById(String(item.i))!.name]"
                      :placeholder="getFieldById(String(item.i))?.placeholder"
                      :readonly="getFieldById(String(item.i))?.readOnly"
                      :class="cn('min-h-full flex-1', errors[getFieldById(String(item.i))!.name] ? 'border-red-500' : '')"
                    />

                    <div
                      v-else-if="getFieldById(String(item.i))?.type === 'date'"
                      class="flex items-center gap-2"
                    >
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button
                            type="button"
                            variant="outline"
                            :disabled="getFieldById(String(item.i))?.readOnly"
                            :class="cn(
                              'w-full justify-start text-left font-normal',
                              !formData[getFieldById(String(item.i))!.name] && 'text-muted-foreground',
                              errors[getFieldById(String(item.i))!.name] ? 'border-red-500' : '',
                            )"
                          >
                            <CalendarIcon class="mr-2 h-4 w-4" />
                            {{ getDateLabel(String(item.i)) }}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0" align="start">
                          <Calendar
                            :model-value="getDateValue(String(item.i))"
                            :initial-focus="true"
                            :default-placeholder="defaultDatePlaceholder"
                            layout="month-and-year"
                            @update:model-value="updateDateValue(String(item.i), $event as DateValue | undefined)"
                          />
                        </PopoverContent>
                      </Popover>
                      <button
                        v-if="
                          getFieldById(String(item.i))?.clearable &&
                          formData[getFieldById(String(item.i))!.name]
                        "
                        type="button"
                        class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-2 hover:bg-accent"
                        @click="
                          formData[getFieldById(String(item.i))!.name] = ''
                        "
                      >
                        ✕
                      </button>
                    </div>

                    <div
                      v-else-if="getFieldById(String(item.i))?.type === 'checkbox'"
                      :class="cn('flex', getChoiceStackClass(String(item.i)))"
                    >
                      <label
                        v-for="option in getFieldById(String(item.i))?.options"
                        :key="option.value"
                        class="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          class="h-4 w-4 rounded border-input"
                          :checked="isCheckboxChecked(String(item.i), option.value)"
                          :disabled="getFieldById(String(item.i))?.readOnly"
                          @change="
                            toggleCheckboxValue(
                              String(item.i),
                              option.value,
                              ($event.target as HTMLInputElement).checked,
                            )
                          "
                        />
                        <span>{{ option.label }}</span>
                      </label>
                    </div>

                    <div
                      v-else-if="getFieldById(String(item.i))?.type === 'radio'"
                      :class="cn('flex', getChoiceStackClass(String(item.i)))"
                    >
                      <label
                        v-for="option in getFieldById(String(item.i))?.options"
                        :key="option.value"
                        class="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          :name="getFieldById(String(item.i))?.name"
                          class="h-4 w-4 border-input"
                          :checked="formData[getFieldById(String(item.i))!.name] === option.value"
                          :disabled="getFieldById(String(item.i))?.readOnly"
                          @change="setRadioValue(String(item.i), option.value)"
                        />
                        <span>{{ option.label }}</span>
                      </label>
                    </div>

                    <!-- Select -->
                    <Select
                      v-else-if="getFieldById(String(item.i))?.type === 'select'"
                      v-model="formData[getFieldById(String(item.i))!.name]"
                    >
                      <SelectTrigger :class="errors[getFieldById(String(item.i))!.name] ? 'border-red-500' : ''">
                        <SelectValue :placeholder="getFieldById(String(item.i))?.placeholder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="option in getFieldById(String(item.i))?.options"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Label Bottom/Right -->
                  <template v-if="getFieldById(String(item.i))?.labelPlacement === 'bottom' || getFieldById(String(item.i))?.labelPlacement === 'right'">
                    <Label :class="cn('text-sm font-semibold', labelClass(getFieldById(String(item.i))!))">
                      {{ getFieldById(String(item.i))?.label }}
                      <span v-if="getFieldById(String(item.i))?.required" class="text-red-500">*</span>
                    </Label>
                  </template>

                  <!-- Error Message -->
                  <p v-if="errors[getFieldById(String(item.i))!.name]" class="text-xs text-red-500">
                    {{ errors[getFieldById(String(item.i))!.name] }}
                  </p>
                </div>
              </div>
            </GridItem>
          </GridLayout>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-3">
          <Button type="button" variant="outline" :disabled="isSubmitting" @click="resetForm">
            Reset
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </Button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
/* Paksa GridLayout dan wrapper internalnya full width */
:deep(.form-renderer-grid),
:deep(.form-renderer-grid > .vgl-layout) {
  width: 100% !important;
  --vgl-resizer-size: 0px;
}

/* Hapus semua style bawaan vgl-item */
:deep(.vgl-item) {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
}

/* Fix SelectTrigger shadcn yang default w-fit, paksa full width */
:deep([data-slot="select-trigger"]) {
  width: 100% !important;
}
</style>
