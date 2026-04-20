<script setup lang="ts">
import type { FormField, FormSection } from '@/composables/useFormStructure'
import type { FieldType } from '../../utils/configPanel';

interface Props {
  section: FormSection
  selectedSectionId: string | null
  selectedFieldId: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  'select-section': [id: string]
  'select-field': [sectionId: string, fieldId: string]
  'delete-section': [id: string]
  'delete-field': [sectionId: string, fieldId: string]
  'toggle-collapse': [sectionId: string]
  'add-field-click': [sectionId: string]
}>()

function getTypeMeta(type: FormField['type']) {
  const map: Record<FieldType, { label: string; dot: string; badge: string }> = {
    account: { label: 'Akun', dot: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-300' },
    formula: { label: 'Formula', dot: 'bg-violet-600', badge: 'bg-violet-50 text-violet-700 border border-violet-300' },
    category_account: { label: 'Kategori Akun', dot: 'bg-blue-600', badge: 'bg-blue-50 text-blue-700 border border-blue-300' },
    reference: { label: 'Referensi', dot: 'bg-orange-600', badge: 'bg-orange-50 text-orange-700 border border-orange-300' },
  }

  return map[type]
}
</script>

<template>
  <div class="group/section overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
    <div
      class="flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors"
      :class="selectedSectionId === section.id && !selectedFieldId ? 'bg-slate-200' : 'hover:bg-slate-150'"
      @click="emit('select-section', section.id)"
    >
      <button
        class="flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-900"
        @click.stop="emit('toggle-collapse', section.id)"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          class="transition-transform duration-200"
          :style="{ transform: section.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <span class="flex-1 truncate text-sm font-semibold text-slate-900">{{ section.name }}</span>

      <span class="shrink-0 rounded-full border border-slate-300 bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600">
        {{ section.fields.length }} baris
      </span>

      <button
        class="group/del flex h-5 w-5 shrink-0 items-center justify-center rounded opacity-0 transition-all hover:bg-red-100 group-hover/section:opacity-100"
        @click.stop="emit('delete-section', section.id)"
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-600 transition-colors group-hover/del:text-red-600">
          <path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div v-if="!section.collapsed" class="flex flex-col gap-0.5 border-t border-slate-200 p-1.5">
      <div
        v-for="field in section.fields"
        :key="field.id"
        class="group/field flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 transition-colors"
        :class="selectedFieldId === field.id ? 'bg-emerald-100' : 'hover:bg-slate-100'"
        @click="emit('select-field', section.id, field.id)"
      >
        <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="getTypeMeta(field.type).dot" />

        <span
          class="flex-1 truncate text-[12.5px] transition-colors"
          :class="selectedFieldId === field.id ? 'font-medium text-emerald-700' : 'text-slate-700'"
        >
          {{ field.name }}
        </span>

        <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', getTypeMeta(field.type).badge]">
          {{ getTypeMeta(field.type).label }}
        </span>

        <button
          class="group/delf flex h-4 w-4 shrink-0 items-center justify-center rounded opacity-0 transition-all hover:bg-red-100 group-hover/field:opacity-100"
          @click.stop="emit('delete-field', section.id, field.id)"
        >
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-600 transition-colors group-hover/delf:text-red-600">
            <path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <button
        class="mt-1 flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-2.5 py-2 text-xs text-slate-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
        @click.stop="emit('add-field-click', section.id)"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2v8M2 6h8" stroke-linecap="round" />
        </svg>
        Tambah baris
      </button>
    </div>
  </div>
</template>
