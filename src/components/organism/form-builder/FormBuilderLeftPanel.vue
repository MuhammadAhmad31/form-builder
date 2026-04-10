<script setup lang="ts">
import type { BuilderField, FieldType } from './types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Props {
  fields: BuilderField[]
  selectedFieldId: string
  fieldCatalog: Array<{ type: FieldType; title: string; description: string }>
}

defineProps<Props>()

const emit = defineEmits<{
  'add-field': [type: FieldType]
  'select-field': [id: string]
}>()

function fieldTypeLabel(type: FieldType) {
  const labels: Record<FieldType, string> = {
    text: 'Text',
    textarea: 'Textarea',
    date: 'Date',
    checkbox: 'Checkbox',
    radio: 'Radio',
    number: 'Number',
    select: 'Select',
  }
  return labels[type]
}
</script>

<template>
  <Card class="min-h-0 border-border/70 bg-background/85 shadow-sm backdrop-blur">
    <CardHeader class="space-y-2">
      <CardTitle>Komponen</CardTitle>
      <CardDescription>
        Tambahkan field ke canvas.
      </CardDescription>
    </CardHeader>
    <CardContent class="min-h-0 space-y-6 overflow-y-auto">
      <!-- Field Catalog -->
      <div class="grid gap-3">
        <button
          v-for="item in fieldCatalog"
          :key="item.type"
          type="button"
          class="rounded-2xl border border-border bg-card px-4 py-4 text-left transition hover:border-foreground/30 hover:bg-accent"
          @click="emit('add-field', item.type)"
        >
          <p class="text-sm font-semibold">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-6 text-muted-foreground">{{ item.description }}</p>
        </button>
      </div>

      <!-- Form Structure -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold">Struktur Form</h2>
          <span class="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {{ fields.length }} field
          </span>
        </div>

        <div class="space-y-2">
          <button
            v-for="field in fields"
            :key="field.id"
            type="button"
            :class="cn(
              'w-full rounded-2xl border px-4 py-3 text-left transition',
              selectedFieldId === field.id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card hover:border-foreground/30 hover:bg-accent',
            )"
            @click="emit('select-field', field.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold">{{ field.label }}</p>
                <p
                  :class="cn(
                    'mt-1 text-xs uppercase tracking-[0.18em]',
                    selectedFieldId === field.id ? 'text-background/70' : 'text-muted-foreground',
                  )"
                >
                  {{ fieldTypeLabel(field.type) }} • x{{ field.x }} y{{ field.y }} • {{ field.w }}/12
                </p>
              </div>
              <span
                :class="cn(
                  'rounded-full px-2 py-1 text-[10px] font-medium',
                  selectedFieldId === field.id ? 'bg-background/12 text-background' : 'bg-secondary text-secondary-foreground',
                )"
              >
                {{ field.name }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
