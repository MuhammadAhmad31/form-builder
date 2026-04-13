<script setup lang="ts">
import { ref } from 'vue'
import type { FormStructure, FormField } from '@/composables/useFormStructure'
import { useFormRenderer } from '@/composables/useFormRenderer'

interface Props {
  formStructure: FormStructure
}

interface Emits {
  (e: 'submit', data: Record<string, any>): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const renderer = useFormRenderer(props.formStructure)
const isSubmitting = ref(false)

function getFieldTypeLabel(type: FormField['type']): string {
  return {
    akun: 'Dari Akun',
    formula: 'Formula',
    text: 'Teks',
    number: 'Angka',
  }[type]
}

function getFieldIcon(type: FormField['type']): string {
  return {
    akun: '◉',
    formula: 'ƒ',
    text: 'T',
    number: '#',
  }[type]
}

function handleSubmit() {
  isSubmitting.value = true
  const data = renderer.submitForm()

  if (data) {
    emit('submit', data)
  }

  isSubmitting.value = false
}

function handleCancel() {
  if (confirm('Batalkan pengisian form?')) {
    emit('cancel')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mx-auto max-w-3xl">
      <!-- Header -->
      <div class="mb-8 space-y-2">
        <h1 class="text-3xl font-bold text-slate-900">{{ formStructure.title }}</h1>
        <p class="text-slate-600">Isi form di bawah ini dengan data yang diperlukan</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Sections -->
        <div v-for="section in formStructure.sections" :key="section.id" class="space-y-4">
          <!-- Section header -->
          <div class="border-b-2 border-slate-200 pb-3">
            <h2 class="text-lg font-bold text-slate-900">{{ section.name }}</h2>
            <p class="text-sm text-slate-600">{{ section.fields.length }} item</p>
          </div>

          <!-- Fields -->
          <div class="space-y-4 pl-4">
            <div v-for="field in section.fields" :key="field.id" class="space-y-2">
              <!-- Field label -->
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                  <label
                    :for="field.id"
                    class="flex items-center gap-2 text-sm font-medium text-slate-900"
                  >
                    <span
                      class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-xs font-semibold text-slate-600"
                    >
                      {{ getFieldIcon(field.type) }}
                    </span>
                    {{ field.name }}
                  </label>
                  <p v-if="field.description" class="mt-1 text-xs text-slate-500">
                    {{ field.description }}
                  </p>
                </div>
                <span
                  class="inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold"
                  :class="{
                    'bg-emerald-50 text-emerald-700': field.type === 'akun',
                    'bg-violet-50 text-violet-700': field.type === 'formula',
                    'bg-blue-50 text-blue-700': field.type === 'text',
                    'bg-orange-50 text-orange-700': field.type === 'number',
                  }"
                >
                  {{ getFieldTypeLabel(field.type) }}
                </span>
              </div>

              <!-- Field input -->
              <div v-if="field.type === 'akun'" class="mt-2">
                <input
                  :id="field.id"
                  :value="(renderer.formData as any)[field.code]"
                  type="number"
                  step="0.01"
                  placeholder="Masukkan nilai akun"
                  class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  @input="(e) => (renderer.formData as any)[field.code] = Number((e.target as HTMLInputElement).value)"
                />
                <p
                  v-if="(renderer.formErrors as any)[field.code]"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ (renderer.formErrors as any)[field.code] }}
                </p>
              </div>

              <!-- Formula field (read-only) -->
              <div v-else-if="field.type === 'formula'" class="mt-2">
                <div class="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 font-mono text-sm text-slate-900">
                  <span class="text-slate-600">{{ renderer.formatNumber(renderer.getFieldValue(field)) }}</span>
                </div>
                <p class="mt-1 text-xs text-slate-500">
                  Formula: <code class="font-mono">{{ field.formula }}</code>
                </p>
              </div>

              <!-- Number field -->
              <div v-else-if="field.type === 'number'" class="mt-2">
                <input
                  :id="field.id"
                  :value="(renderer.formData as any)[field.code]"
                  type="number"
                  step="0.01"
                  placeholder="Masukkan nilai"
                  class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  @input="(e) => (renderer.formData as any)[field.code] = Number((e.target as HTMLInputElement).value)"
                />
              </div>

              <!-- Text field -->
              <div v-else-if="field.type === 'text'" class="mt-2">
                <input
                  :id="field.id"
                  :value="(renderer.formData as any)[field.code]"
                  type="text"
                  placeholder="Masukkan teks"
                  class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  @input="(e) => (renderer.formData as any)[field.code] = (e.target as HTMLInputElement).value"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="mt-8 flex gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            class="flex-1 rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            @click="handleCancel"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Mengirim...' : 'Kirim Form' }}
          </button>
        </div>
      </form>

      <!-- Debug: Form data preview -->
      <div class="mt-8 rounded-lg border border-slate-300 bg-slate-50 p-4">
        <h3 class="text-sm font-semibold text-slate-900">Preview Data</h3>
        <pre class="mt-2 max-h-48 overflow-auto text-xs text-slate-700">{{ JSON.stringify(renderer.getFormDataWithFormulas, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>
