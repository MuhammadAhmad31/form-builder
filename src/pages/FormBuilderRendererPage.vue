<script setup lang="ts">
import { ref } from 'vue'
import { useFormStructure } from '@/composables/useFormStructure'
import FormBuilder from '@/components/organism/form-non-canvas/FormBuilder.vue'
import FormRenderer from '@/components/organism/form-non-canvas/FormRenderer.vue'

const fb = useFormStructure()
const currentView = ref<'builder' | 'renderer'>('builder')
const submittedData = ref<Record<string, any> | null>(null)

function handleFormSubmit(data: Record<string, any>) {
  submittedData.value = data
  currentView.value = 'builder'
}

function switchToRenderer() {
  if (fb.formStructure.value.sections.length === 0) {
    alert('Buat minimal satu section terlebih dahulu')
    return
  }
  currentView.value = 'renderer'
  submittedData.value = null
}
</script>

<template>
  <!-- Header with tabs -->
  <div class="sticky top-0 z-10 border-b border-slate-200 bg-white">
    <div class="flex items-center gap-4 px-6 py-4">
      <h1 class="text-xl font-bold text-slate-900">Form Builder & Renderer</h1>
      <div class="ml-auto flex gap-2">
        <button
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="
            currentView === 'builder'
              ? 'bg-emerald-100 text-emerald-700'
              : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
          "
          @click="currentView = 'builder'"
        >
          Builder
        </button>
        <button
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="
            currentView === 'renderer'
              ? 'bg-emerald-100 text-emerald-700'
              : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
          "
          @click="switchToRenderer"
        >
          Preview Form
        </button>
      </div>
    </div>

    <!-- Info bar -->
    <div v-if="submittedData" class="border-t border-slate-200 bg-emerald-50 px-6 py-3">
      <p class="text-sm text-emerald-700">
        ✓ Form berhasil disubmit!
        <button
          class="ml-2 font-medium underline hover:no-underline"
          @click="submittedData = null"
        >
          Lihat data
        </button>
      </p>
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-auto">
    <!-- Builder view -->
    <div v-if="currentView === 'builder'">
      <FormBuilder />
    </div>

    <!-- Renderer view -->
    <div v-else>
      <FormRenderer
        :form-structure="(fb.formStructure as any)"
        @submit="handleFormSubmit"
        @cancel="currentView = 'builder'"
      />
    </div>
  </div>

  <!-- Submitted data modal -->
  <div
    v-if="submittedData && currentView === 'builder'"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  >
    <div class="max-h-96 w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
      <h2 class="text-lg font-bold text-slate-900">Data Form yang Disubmit</h2>
      <pre class="mt-4 overflow-auto bg-slate-50 p-4 text-xs text-slate-700">{{ JSON.stringify(submittedData, null, 2) }}</pre>
      <div class="mt-4 flex gap-2">
        <button
          class="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
          @click="submittedData = null"
        >
          Tutup
        </button>
        <button
          class="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          @click="currentView = 'renderer'"
        >
          Isi Form Lagi
        </button>
      </div>
    </div>
  </div>
</template>
