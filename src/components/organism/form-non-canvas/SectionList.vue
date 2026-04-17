<!-- SectionList.vue -->
<script setup lang="ts">
import type { FormStructure, FormField } from '@/composables/useFormStructure'

interface Props {
  formStructure: FormStructure
  selectedSectionId: string | null
  selectedFieldId: string | null
}

interface Emits {
  (e: 'select-field', sectionId: string, fieldId: string): void
  (e: 'select-section', id: string | null): void
  (e: 'delete-section', id: string): void
  (e: 'delete-field', sectionId: string, fieldId: string): void
  (e: 'toggle-collapse', sectionId: string): void
  (e: 'add-field-click', sectionId: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function getTypeMeta(type: FormField['type']) {
  const map: Record<string, { label: string; dot: string; badge: string }> = {
    akun:    { label: 'akun',    dot: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-300' },
    formula: { label: 'formula', dot: 'bg-violet-600',  badge: 'bg-violet-50 text-violet-700 border border-violet-300' },
    text:    { label: 'teks',    dot: 'bg-blue-600',    badge: 'bg-blue-50 text-blue-700 border border-blue-300' },
    number:  { label: 'angka',   dot: 'bg-orange-600',  badge: 'bg-orange-50 text-orange-700 border border-orange-300' },
  }
  return map[type] ?? map.text
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- Empty state -->
    <div
      v-if="formStructure.sections.length === 0"
      class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-10 text-center"
    >
      <svg class="text-slate-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
      <p class="text-sm font-medium text-slate-600">Belum ada section</p>
      <span class="text-xs text-slate-500">Tambah section untuk memulai</span>
    </div>

    <!-- Section items -->
    <div
      v-for="section in formStructure.sections"
      :key="section.id"
      class="group/section overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
    >
      <!-- Header -->
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
            width="10" height="10" viewBox="0 0 12 12" fill="none"
            class="transition-transform duration-200"
            :style="{ transform: section.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <span class="flex-1 truncate text-sm font-semibold text-slate-900">{{ section.name }}</span>

        <span class="shrink0 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 border border-slate-300">
          {{ section.fields.length }} baris
        </span>

        <button
          class="group/del flex h-5 w-5 shrink-0 items-center justify-center rounded opacity-0 transition-all hover:bg-red-100 group-hover/section:opacity-100"
          @click.stop="emit('delete-section', section.id)"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"
            class="text-slate-600 group-hover/del:text-red-600 transition-colors">
            <path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Fields list -->
      <div v-if="!section.collapsed" class="border-t border-slate-200 p-1.5 flex flex-col gap-0.5">
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
            :class="selectedFieldId === field.id ? 'text-emerald-700 font-medium' : 'text-slate-700'"
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
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"
              class="text-slate-600 group-hover/delf:text-red-600 transition-colors">
              <path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Add field button -->
        <button
          class="mt-1 flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-2.5 py-2 text-xs text-slate-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
          @click.stop="emit('add-field-click', section.id)"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2v8M2 6h8" stroke-linecap="round"/>
          </svg>
          Tambah baris
        </button>
      </div>
    </div>
  </div>
</template>
