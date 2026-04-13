<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FormRenderer } from '@unnovate-brains/form-builder'
import type { FormSection } from '@unnovate-brains/form-builder/dist/types/fields'
import { useCodeparlFormStorage } from '@/composables/useCodeparlFormStorage'

const route = useRoute()
const router = useRouter()
const { getForm, getForms } = useCodeparlFormStorage()

const formId = ref('')
const formSections = ref<FormSection[]>([])
const formData = ref<Record<string, any>>({})
const error = ref('')

const savedForms = computed(() => getForms())

function loadForm(id: string) {
  const trimmedId = id.trim()
  formId.value = trimmedId
  error.value = ''

  if (!trimmedId) {
    formSections.value = []
    return
  }

  const storedForm = getForm(trimmedId)
  if (!storedForm) {
    formSections.value = []
    error.value = `Form dengan ID "${trimmedId}" tidak ditemukan di localStorage.`
    return
  }

  formSections.value = storedForm.sections
  router.replace({
    name: 'codeparl-form-renderer',
    query: { id: trimmedId },
  })
}

function handleFormUpdate(data: Record<string, any>) {
  formData.value = data
}

onMounted(() => {
  const queryId = typeof route.query.id === 'string' ? route.query.id : ''
  const latestId = savedForms.value[0]?.id ?? ''
  const initialId = queryId || latestId

  if (initialId) {
    loadForm(initialId)
  }
})
</script>

<template>
  <main class="min-h-screen bg-background px-6 py-8 text-foreground">
    <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside class="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Codeparl Renderer
          </p>
          <h1 class="text-2xl font-semibold">Form Preview</h1>
        </div>

        <div class="space-y-2">
          <label for="form-id" class="text-sm font-medium">Form ID</label>
          <input
            id="form-id"
            v-model="formId"
            type="text"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="cpf-..."
            @keyup.enter="loadForm(formId)"
          />
          <div class="flex gap-2">
            <button
              class="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              @click="loadForm(formId)"
            >
              Load Form
            </button>
            <RouterLink
              class="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium"
              :to="{ name: 'codeparl-form' }"
            >
              Builder
            </RouterLink>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold">Saved Forms</h2>
            <span class="text-xs text-muted-foreground">{{ savedForms.length }} item</span>
          </div>

          <div v-if="savedForms.length === 0" class="rounded-xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
            Belum ada form tersimpan.
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="item in savedForms.slice(0, 5)"
              :key="item.id"
              class="rounded-xl border border-border bg-background p-3"
            >
              <p class="truncate text-sm font-medium">{{ item.name }}</p>
              <p class="mt-1 truncate font-mono text-xs text-muted-foreground">{{ item.id }}</p>
              <button
                class="mt-3 inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium"
                @click="loadForm(item.id)"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </aside>

      <section class="space-y-4">
        <div v-if="error" class="rounded-2xl border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {{ error }}
        </div>

        <div v-if="formSections.length > 0" class="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <FormRenderer :sections="formSections" @update="handleFormUpdate" />
        </div>

        <div v-else class="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground shadow-sm">
          Simpan form dulu dari builder, lalu buka di halaman renderer ini.
        </div>

        <div class="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold">Live Payload</h2>
            <span class="text-xs text-muted-foreground">Update dari FormRenderer</span>
          </div>
          <pre class="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-6">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </section>
    </div>
  </main>
</template>
