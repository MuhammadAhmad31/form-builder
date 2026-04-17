<script setup lang="ts">
import type { SavedForm } from '@/composables/useFormStorage'

interface Props {
  modelValue: boolean
  savedForms: SavedForm[]
}

defineProps<Props>()

const emit = defineEmits<{
  load: [form: SavedForm]
  delete: [id: string]
  close: []
}>()
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 class="text-lg font-bold text-slate-900">Buka Form Tersimpan</h2>

      <div class="mt-4 max-h-96 space-y-2 overflow-y-auto">
        <div v-if="savedForms.length === 0" class="rounded-lg border border-dashed border-slate-300 py-8 text-center">
          <p class="text-sm text-slate-500">Belum ada form tersimpan</p>
        </div>

        <div
          v-for="form in savedForms"
          :key="form.id"
          class="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-left transition-colors hover:bg-slate-100"
          role="button"
          tabindex="0"
          @click="emit('load', form)"
          @keyup.enter="emit('load', form)"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <p class="font-medium text-slate-900">{{ form.name }}</p>
              <p v-if="form.description" class="mt-0.5 text-xs text-slate-600">{{ form.description }}</p>
              <p class="mt-1 text-xs text-slate-500">
                {{ form.formStructure.sections.length }} section, {{ form.formStructure.sections.reduce((sum, section) => sum + section.fields.length, 0) }} baris
              </p>
            </div>
            <button class="shrink-0 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50" @click.stop="emit('delete', form.id)">
              Hapus
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <button class="w-full rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100" @click="emit('close')">
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>
