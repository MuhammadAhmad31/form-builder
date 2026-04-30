<script setup lang="ts">
import { computed } from 'vue'
import type { FormSection, SpacerType } from '@/composables/useFormStructure'
import { ToggleSwitch } from '@/components/ui/toggle-switch'

interface Props {
  section: FormSection
  sectionName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-name': [name: string]
  'hide-label': [hideLabel: boolean]
  'update-position': [position: 'left' | 'right']
  'update-spacer-type': [spacerType?: SpacerType]
}>()

const hideLabel = computed({
  get: () => props.section.hideLabel ?? false,
  set: (value: boolean) => emit('hide-label', value),
})

const handleSpacerTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  console.log('handleSpacerTypeChange triggered with value:', value)
  if (!value) {
    console.log('emitting undefined')
    emit('update-spacer-type', undefined)
    return
  }
  console.log('emitting:', value)
  emit('update-spacer-type', value as SpacerType)
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center gap-3 border-b border-slate-200 pb-4">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base font-bold text-slate-600">
        §
      </div>
      <div>
        <p class="text-[10px] font-bold tracking-widest text-emerald-600">SECTION</p>
        <h3 class="text-sm font-semibold text-slate-900">{{ section.name }}</h3>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Nama section</label>
      <input
        :value="sectionName"
        type="text"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 placeholder:text-slate-500"
        @input="emit('update-name', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <ToggleSwitch
      v-model="hideLabel"
      label="Sembunyikan label section"
    />

    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600">Posisi section</label>
        <div class="relative">
          <select
            :value="section.position || 'left'"
            class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
            @change="emit('update-position', ($event.target as HTMLSelectElement).value as 'left' | 'right')"
          >
            <option value="left">Kiri</option>
            <option value="right">Kanan</option>
          </select>
          <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600">Spasi di atas</label>
        <div class="relative">
          <select
            :value="section.spacerType || ''"
            class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
            @change="handleSpacerTypeChange"
          >
            <option value="">Tidak ada</option>
            <option value="low">Kecil</option>
            <option value="high">Besar</option>
          </select>
          <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex items-start gap-2 rounded-lg border border-blue-300 bg-blue-50 p-3 text-xs text-blue-700">
      <svg class="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <span>Klik <strong class="text-blue-800">+ Tambah baris</strong> di dalam section untuk menambah baris baru.</span>
    </div>
  </div>
</template>
