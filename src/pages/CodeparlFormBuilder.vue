<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FormBuilder } from '@unnovate-brains/form-builder'
import type { FormSection } from '@unnovate-brains/form-builder/dist/types/fields'
import { useCodeparlFormStorage } from '@/composables/useCodeparlFormStorage'

const router = useRouter()
const { getForms, saveForm } = useCodeparlFormStorage()

const formBuilderOptions = {
  language: 'en',
  allowExport: true,
  allowImport: true,
}

const initialSections = [
  {
    id: 'section-1',
    title: 'Personal Information',
    editable: true,
    fields: [
      {
        id: 'name',
        type: 'text',
        name: 'name',
        label: 'Full Name',
        required: true,
        value: '',
        editable: true,
        placeholder: 'Enter your full name',
      },
    ],
  },
] satisfies FormSection[]

const activeSavedFormId = ref('')
const latestSavedId = ref('')
const latestSavedName = ref('')

const recentForms = computed(() => getForms().slice(0, 5))

function handleSave(sections: FormSection[]) {
  const storedForm = saveForm(sections, activeSavedFormId.value || undefined)
  activeSavedFormId.value = storedForm.id
  latestSavedId.value = storedForm.id
  latestSavedName.value = storedForm.name
}

function saveAsNew() {
  activeSavedFormId.value = ''
}

function openRenderer(formId: string) {
  router.push({
    name: 'codeparl-form-renderer',
    query: { id: formId },
  })
}
</script>

<template>
  <main class="min-h-screen bg-background px-6 py-8 text-foreground">
    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section class="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <FormBuilder
          :options="formBuilderOptions"
          :sections="initialSections"
          @autosave="handleSave"
        />
      </section>

      <aside class="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Codeparl Builder
          </p>
          <h1 class="text-2xl font-semibold">Saved To Local Storage</h1>
          <p class="text-sm leading-6 text-muted-foreground">
            Form builder ini menyimpan sections ke `localStorage` setiap save dari toolbar library.
          </p>
        </div>

        <div class="rounded-xl border border-border bg-background p-4 text-sm">
          <p class="font-medium">Active Save Target</p>
          <p class="mt-1 font-mono text-xs text-muted-foreground">
            {{ activeSavedFormId || 'new record on next save' }}
          </p>
          <button
            class="mt-4 inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium"
            @click="saveAsNew"
          >
            Save As New On Next Save
          </button>
        </div>

        <div v-if="latestSavedId" class="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm">
          <p class="font-medium text-green-700">Last saved form</p>
          <p class="mt-1">{{ latestSavedName }}</p>
          <p class="mt-1 font-mono text-xs text-muted-foreground">{{ latestSavedId }}</p>
          <button
            class="mt-4 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            @click="openRenderer(latestSavedId)"
          >
            Open Renderer
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold">Recent Forms</h2>
            <span class="text-xs text-muted-foreground">{{ recentForms.length }} item</span>
          </div>

          <div v-if="recentForms.length === 0" class="rounded-xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
            Belum ada form tersimpan.
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="item in recentForms"
              :key="item.id"
              class="rounded-xl border border-border bg-background p-3"
            >
              <p class="truncate text-sm font-medium">{{ item.name }}</p>
              <p class="mt-1 truncate font-mono text-xs text-muted-foreground">{{ item.id }}</p>
              <button
                class="mt-3 inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium"
                @click="openRenderer(item.id)"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>
