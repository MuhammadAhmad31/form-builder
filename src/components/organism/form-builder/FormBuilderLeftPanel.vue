<script setup lang="ts">
import type { BuilderField, BuilderSection, FieldType } from './types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  sections: BuilderSection[]
  selectedSectionId: string
  fields: BuilderField[]
  selectedFieldId: string
  fieldCatalog: Array<{ type: FieldType; title: string; description: string }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'add-field': [type: FieldType]
  'select-field': [id: string]
  'select-section': [id: string]
  'add-section': []
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

function sectionFields(sectionId: string) {
  return props.fields.filter((field) => field.sectionId === sectionId)
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
          <Button variant="outline" size="sm" @click="emit('add-section')">
            Tambah Section
          </Button>
        </div>

        <div class="space-y-2">
          <div
            v-for="section in sections"
            :key="section.id"
            class="rounded-2xl border border-border bg-card p-2"
          >
            <button
              type="button"
              :class="cn(
                'w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition',
                selectedSectionId === section.id
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-accent',
              )"
              @click="emit('select-section', section.id)"
            >
              <div class="flex items-center justify-between gap-2">
                <span>{{ section.title }}</span>
                <span
                  :class="cn(
                    'text-[10px] uppercase tracking-[0.18em]',
                    selectedSectionId === section.id ? 'text-background/80' : 'text-muted-foreground',
                  )"
                >
                  {{ sectionFields(section.id).length }} field
                </span>
              </div>
            </button>

            <div class="mt-2 space-y-2 px-1 pb-1">
              <button
                v-for="field in sectionFields(section.id)"
                :key="field.id"
                type="button"
                :class="cn(
                  'w-full rounded-xl border px-3 py-2 text-left transition',
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
        </div>
      </div>
    </CardContent>
  </Card>
</template>
