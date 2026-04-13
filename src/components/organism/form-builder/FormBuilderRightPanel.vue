<script setup lang="ts">
import type { BuilderField, FieldOption, FieldSpacing, LabelPlacement, OptionLayout, SelectionMode } from './types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Props {
  selectedField: BuilderField | null
  labelPlacementItems: Array<{ label: string; value: LabelPlacement }>
}

defineProps<Props>()

const choiceLayoutItems: Array<{ label: string; value: OptionLayout }> = [
  { label: 'Ke Bawah', value: 'vertical' },
  { label: 'Ke Samping', value: 'horizontal' },
]

const checkboxModeItems: Array<{ label: string; value: SelectionMode }> = [
  { label: 'Single', value: 'single' },
  { label: 'Multiple', value: 'multiple' },
]

const emit = defineEmits<{
  'update-field': [key: keyof BuilderField, value: any]
  'update-spacing': [side: keyof FieldSpacing, value: string | number]
  'update-grid-value': [key: 'x' | 'y' | 'w' | 'h', value: string | number]
  'add-option': []
  'update-option': [optionId: string, key: keyof FieldOption, value: string]
  'remove-option': [optionId: string]
  'remove-selected': []
}>()
</script>

<template>
  <Card class="min-h-0 border-border/70 bg-background/85 shadow-sm backdrop-blur">
    <CardHeader class="space-y-2">
      <CardTitle>Inspector</CardTitle>
      <CardDescription>
        {{ selectedField ? 'Ubah properti field yang dipilih' : 'Pilih field untuk edit' }}
      </CardDescription>
    </CardHeader>

    <CardContent v-if="selectedField" class="min-h-0 overflow-y-auto space-y-6">
      <!-- Basic Properties -->
      <div class="grid gap-4 rounded-2xl border border-border bg-card p-4">
        <div class="grid gap-2">
          <Label for="field-label">Label</Label>
          <Input
            id="field-label"
            :model-value="selectedField.label"
            @update:model-value="emit('update-field', 'label', $event)"
          />
        </div>

        <div class="grid gap-2">
          <Label for="field-name">Field Name</Label>
          <Input
            id="field-name"
            :model-value="selectedField.name"
            @update:model-value="emit('update-field', 'name', $event)"
          />
        </div>

        <div class="grid gap-2">
          <Label for="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            :model-value="selectedField.placeholder"
            @update:model-value="emit('update-field', 'placeholder', $event)"
          />
        </div>

        <div class="grid gap-2">
          <Label for="label-placement">Label Placement</Label>
          <Select :model-value="selectedField.labelPlacement" @update:model-value="emit('update-field', 'labelPlacement', $event)">
            <SelectTrigger id="label-placement">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in labelPlacementItems" :key="item.value" :value="item.value">
                {{ item.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Toggles -->
      <div class="grid gap-2 rounded-2xl border border-border bg-card p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Required</span>
          <button
            type="button"
            :class="cn(
              'rounded-lg border px-3 py-2 text-sm transition',
              selectedField.required ? 'border-foreground bg-foreground text-background' : 'border-border bg-background',
            )"
            @click="emit('update-field', 'required', !selectedField.required)"
          >
            {{ selectedField.required ? 'Yes' : 'No' }}
          </button>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Read Only</span>
          <button
            type="button"
            :class="cn(
              'rounded-lg border px-3 py-2 text-sm transition',
              selectedField.readOnly ? 'border-foreground bg-foreground text-background' : 'border-border bg-background',
            )"
            @click="emit('update-field', 'readOnly', !selectedField.readOnly)"
          >
            {{ selectedField.readOnly ? 'Yes' : 'No' }}
          </button>
        </div>
      </div>

      <!-- Grid Position -->
      <div class="grid gap-4 rounded-2xl border border-border bg-card p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Grid Position</h3>
          <span class="text-xs text-muted-foreground">{{ selectedField.w }}/12 columns</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <Label>X</Label>
            <Input
              type="number"
              :model-value="selectedField.x"
              @update:model-value="emit('update-grid-value', 'x', $event)"
            />
          </div>
          <div>
            <Label>Y</Label>
            <Input
              type="number"
              :model-value="selectedField.y"
              @update:model-value="emit('update-grid-value', 'y', $event)"
            />
          </div>
          <div>
            <Label>Width</Label>
            <Input
              type="number"
              :model-value="selectedField.w"
              @update:model-value="emit('update-grid-value', 'w', $event)"
            />
          </div>
          <div>
            <Label>Height</Label>
            <Input
              type="number"
              :model-value="selectedField.h"
              @update:model-value="emit('update-grid-value', 'h', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Spacing -->
      <div class="grid gap-4 rounded-2xl border border-border bg-card p-4">
        <h3 class="text-sm font-semibold">Spacing (px)</h3>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <Label>Top</Label>
            <Input
              type="number"
              :model-value="selectedField.spacing.top"
              @update:model-value="emit('update-spacing', 'top', $event)"
            />
          </div>
          <div>
            <Label>Right</Label>
            <Input
              type="number"
              :model-value="selectedField.spacing.right"
              @update:model-value="emit('update-spacing', 'right', $event)"
            />
          </div>
          <div>
            <Label>Bottom</Label>
            <Input
              type="number"
              :model-value="selectedField.spacing.bottom"
              @update:model-value="emit('update-spacing', 'bottom', $event)"
            />
          </div>
          <div>
            <Label>Left</Label>
            <Input
              type="number"
              :model-value="selectedField.spacing.left"
              @update:model-value="emit('update-spacing', 'left', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Choice Options -->
      <div v-if="['select', 'checkbox', 'radio'].includes(selectedField.type)" class="grid gap-4 rounded-2xl border border-border bg-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold">Field Options</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              {{
                selectedField.type === 'checkbox' && selectedField.selectionMode === 'single'
                  ? 'Mode single memakai satu checkbox saja. Ubah label dan value checkbox di bawah.'
                  : 'Kelola label, value, dan susunan opsi pilihan.'
              }}
            </p>
          </div>
          <Button
            v-if="selectedField.type !== 'checkbox' || selectedField.selectionMode === 'multiple'"
            type="button"
            variant="outline"
            size="sm"
            @click="emit('add-option')"
          >
            Tambah Opsi
          </Button>
        </div>

        <div v-if="selectedField.type === 'checkbox'" class="grid gap-2">
          <Label for="checkbox-mode">Checkbox Mode</Label>
          <Select :model-value="selectedField.selectionMode" @update:model-value="emit('update-field', 'selectionMode', $event)">
            <SelectTrigger id="checkbox-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in checkboxModeItems" :key="item.value" :value="item.value">
                {{ item.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-if="selectedField.type === 'checkbox' || selectedField.type === 'radio'" class="grid gap-2">
          <Label for="choice-layout">Arah Opsi</Label>
          <Select :model-value="selectedField.optionLayout" @update:model-value="emit('update-field', 'optionLayout', $event)">
            <SelectTrigger id="choice-layout">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in choiceLayoutItems" :key="item.value" :value="item.value">
                {{ item.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          v-if="selectedField.type === 'select'"
          type="button"
          :class="cn(
            'rounded-xl border px-3 py-3 text-sm font-medium transition',
            selectedField.clearable
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-background text-foreground',
          )"
          @click="emit('update-field', 'clearable', !selectedField.clearable)"
        >
          {{ selectedField.clearable ? 'Clearable' : 'Non-Clearable' }}
        </button>

        <div class="space-y-3">
          <div
            v-for="option in selectedField.options"
            :key="option.id"
            class="rounded-xl border border-border bg-background p-3"
          >
            <div class="grid gap-3">
              <div class="grid gap-2">
                <Label :for="`option-label-${option.id}`">Label</Label>
                <Input
                  :id="`option-label-${option.id}`"
                  :model-value="option.label"
                  @update:model-value="emit('update-option', option.id, 'label', String($event))"
                />
              </div>

              <div class="grid gap-2">
                <Label :for="`option-value-${option.id}`">Value</Label>
                <Input
                  :id="`option-value-${option.id}`"
                  :model-value="option.value"
                  @update:model-value="emit('update-option', option.id, 'value', String($event))"
                />
              </div>

              <Button
                v-if="selectedField.type !== 'checkbox' || selectedField.selectionMode === 'multiple'"
                type="button"
                variant="outline"
                size="sm"
                @click="emit('remove-option', option.id)"
              >
                Hapus Opsi
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Button -->
      <Button type="button" variant="destructive" class="w-full" @click="emit('remove-selected')">
        Delete Field
      </Button>
    </CardContent>

    <CardContent v-else class="min-h-0 overflow-y-auto">
      <div class="rounded-2xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        Pilih field dari panel kiri untuk edit properti.
      </div>
    </CardContent>
  </Card>
</template>
