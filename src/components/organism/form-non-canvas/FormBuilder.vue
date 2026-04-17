<!-- FormBuilder.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormStructure } from '@/composables/useFormStructure'
import { useFormStorage } from '@/composables/useFormStorage'
import SectionList from './SectionList.vue'
import ConfigPanel from './ConfigPanel.vue'

const fb = useFormStructure()
const storage = useFormStorage()

const newSectionName = ref('')
const showAddSection = ref(false)
const addingFieldForSection = ref<string | null>(null)
const showSaveModal = ref(false)
const showLoadModal = ref(false)
const showSchemaModal = ref(false)
const saveName = ref('')
const saveDescription = ref('')
const editingFormId = ref<string | null>(null)

const formStructure  = computed(() => fb.formStructure.value)
const selectedSectionId = computed(() => fb.selectedSectionId.value)
const selectedFieldId   = computed(() => fb.selectedFieldId.value)
const selectedSection   = computed(() => fb.selectedSection.value)
const selectedField     = computed(() => fb.selectedField.value)
const totalFields       = computed(() => fb.totalFields.value)
const savedFormsList = computed(() => storage.savedForms.value || [])

function handleAddSection() {
  if (newSectionName.value.trim()) {
    fb.addSection(newSectionName.value.trim())
    newSectionName.value = ''
    showAddSection.value = false
  }
}

function handleAddFieldClick(sectionId: string) {
  fb.selectSection(sectionId)
  addingFieldForSection.value = sectionId
}

function handleAddField(sectionId: string, field: any) {
  fb.addField(sectionId, field)
  addingFieldForSection.value = null
}

function handleUpdateField(updates: any) {
  if (selectedSectionId.value && selectedFieldId.value)
    fb.updateField(selectedSectionId.value, selectedFieldId.value, updates)
}

function handleUpdateSection(updates: any) {
  if (selectedSectionId.value) fb.updateSection(selectedSectionId.value, updates)
}

function handleDeleteField() {
  if (selectedSectionId.value && selectedFieldId.value)
    fb.deleteField(selectedSectionId.value, selectedFieldId.value)
}

function handleSelectField(sectionId: string, fieldId: string) {
  addingFieldForSection.value = null
  fb.selectField(sectionId, fieldId)
}

function handleSelectSection(id: string | null) {
  addingFieldForSection.value = null
  fb.selectSection(id)
}

function openSaveModal() {
  editingFormId.value = null
  saveName.value = formStructure.value.title || ''
  saveDescription.value = ''
  showSaveModal.value = true
}

function handleSaveForm() {
  if (!saveName.value.trim()) {
    alert('Nama form tidak boleh kosong')
    return
  }

  const updated = { ...formStructure.value, title: saveName.value }

  console.log(' Form Schema:', JSON.stringify(updated, null, 2))
  console.log(' Form Summary:', {
    name: saveName.value,
    description: saveDescription.value,
    sections: updated.sections.length,
    totalFields: updated.sections.reduce((sum, s) => sum + s.fields.length, 0),
  })

  storage.saveForm(updated, saveName.value, saveDescription.value, editingFormId.value || undefined)
  showSaveModal.value = false
  saveName.value = ''
  saveDescription.value = ''
  alert('Form berhasil disimpan!')
}

function handleLoadForm(savedForm: any) {
  // Load form structure
  fb.formStructure.value = { ...savedForm.formStructure }
  fb.selectedSectionId.value = null
  fb.selectedFieldId.value = null
  editingFormId.value = savedForm.id
  showLoadModal.value = false
}

function handleDeleteForm(id: string) {
  if (confirm('Hapus form ini?')) {
    storage.deleteForm(id)
  }
}

function handleNewForm() {
  if (confirm('Buat form baru? Data form saat ini akan direset.')) {
    fb.formStructure.value = {
      id: 'form-1',
      title: 'Struktur Laporan',
      sections: [],
    }
    fb.selectedSectionId.value = null
    fb.selectedFieldId.value = null
    editingFormId.value = null
  }
}

function copySchemaToClipboard() {
  navigator.clipboard.writeText(JSON.stringify(formStructure.value, null, 2))
  alert('Schema disalin ke clipboard!')
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
    <!-- Left panel: Structure -->
    <div class="flex w-90 shrink-0 flex-col border-r border-slate-200 bg-white">
      <!-- Header -->
      <div class="flex flex-col gap-2 border-b border-slate-200 px-4 py-3.5">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900 tracking-tight">Struktur laporan</h2>
          <span class="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
            {{ totalFields }} baris
          </span>
        </div>
        <div class="flex gap-1.5">
          <button
            class="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
            @click="openSaveModal"
          >
             Simpan
          </button>
          <button
            class="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
            @click="showLoadModal = true"
          >
            Buka
          </button>
          <button
            class="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
            @click="showSchemaModal = true"
          >
            Schema
          </button>
          <button
            class="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
            @click="handleNewForm"
          >
            Baru
          </button>
        </div>
      </div>

      <!-- Sections list -->
      <div class="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300">
        <SectionList
          :form-structure="formStructure"
          :selected-section-id="selectedSectionId"
          :selected-field-id="selectedFieldId"
          @select-section="handleSelectSection"
          @select-field="handleSelectField"
          @delete-section="fb.deleteSection"
          @delete-field="fb.deleteField"
          @toggle-collapse="fb.toggleSectionCollapse"
          @add-field-click="handleAddFieldClick"
        />
      </div>

      <!-- Add section -->
      <div class="border-t border-slate-200 p-3">
        <div v-if="showAddSection" class="flex flex-col gap-2">
          <input
            v-model="newSectionName"
            type="text"
            placeholder="Nama section..."
            autofocus
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 placeholder:text-slate-500"
            @keyup.enter="handleAddSection"
            @keyup.esc="showAddSection = false; newSectionName = ''"
          />
          <div class="flex gap-2">
            <button
              class="flex-1 rounded-lg border border-slate-300 py-1.5 text-xs text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              @click="showAddSection = false; newSectionName = ''"
            >
              Batal
            </button>
            <button
              class="flex-2 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              @click="handleAddSection"
            >
              Tambah
            </button>
          </div>
        </div>

        <button
          v-else
          class="flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
          @click="showAddSection = true"
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2v8M2 6h8" stroke-linecap="round"/>
          </svg>
          Tambah section
        </button>
      </div>
    </div>

    <!-- Right panel: Config -->
    <div class="flex flex-1 flex-col bg-white">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-3.5">
        <h2 class="text-sm font-bold text-slate-900 tracking-tight">
          {{
            selectedField ? `Konfigurasi: ${selectedField.name}`
            : addingFieldForSection ? 'Tambah baris baru'
            : selectedSection ? `Konfigurasi: ${selectedSection.name}`
            : 'Konfigurasi'
          }}
        </h2>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <ConfigPanel
          :selected-section="selectedSection"
          :selected-field="selectedField"
          :adding-field-for-section="addingFieldForSection"
          :form-structure="formStructure"
          @add-field="handleAddField"
          @update-field="handleUpdateField"
          @update-section="handleUpdateSection"
          @delete-field="handleDeleteField"
          @cancel-add="addingFieldForSection = null"
        />
      </div>
    </div>

    <!-- Save Modal -->
    <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 class="text-lg font-bold text-slate-900">Simpan Form</h2>

        <div class="mt-4 space-y-3">
          <div>
            <label class="block text-sm font-medium text-slate-700">Nama Form</label>
            <input
              v-model="saveName"
              type="text"
              placeholder="Nama form..."
              class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">Deskripsi (opsional)</label>
            <textarea
              v-model="saveDescription"
              placeholder="Deskripsi form..."
              rows="3"
              class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="mt-6 flex gap-2">
          <button
            class="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            @click="showSaveModal = false"
          >
            Batal
          </button>
          <button
            class="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
            @click="handleSaveForm"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- Load Modal -->
    <div v-if="showLoadModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 class="text-lg font-bold text-slate-900">Buka Form Tersimpan</h2>

        <div class="mt-4 max-h-96 space-y-2 overflow-y-auto">
          <div v-if="savedFormsList.length === 0" class="rounded-lg border border-dashed border-slate-300 py-8 text-center">
            <p class="text-sm text-slate-500">Belum ada form tersimpan</p>
          </div>

          <button
            v-for="form in (savedFormsList as any[])"
            :key="form.id"
            class="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-left hover:bg-slate-100 transition-colors"
            @click="handleLoadForm(form)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-slate-900">{{ form.name }}</p>
                <p v-if="form.description" class="mt-0.5 text-xs text-slate-600">{{ form.description }}</p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ form.formStructure.sections.length }} section, {{ form.formStructure.sections.reduce((s: number, sec: any) => s + sec.fields.length, 0) }} baris
                </p>
              </div>
              <button
                class="shrink-0 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                @click.stop="handleDeleteForm(form.id)"
              >
                Hapus
              </button>
            </div>
          </button>
        </div>

        <div class="mt-6">
          <button
            class="w-full rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            @click="showLoadModal = false"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Schema Modal -->
    <div v-if="showSchemaModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg max-h-[80vh] flex flex-col">
        <h2 class="text-lg font-bold text-slate-900">JSON Schema</h2>

        <div class="mt-4 flex-1 overflow-y-auto">
          <pre class="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 whitespace-pre-wrap wrap-break-word">{{ JSON.stringify(formStructure, null, 2) }}</pre>
        </div>

        <div class="mt-6 flex gap-2">
          <button
            class="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            @click="showSchemaModal = false"
          >
            Tutup
          </button>
          <button
            class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            @click="copySchemaToClipboard"
          >
            Salin
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
