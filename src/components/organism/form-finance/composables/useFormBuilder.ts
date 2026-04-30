import { computed, ref } from 'vue'
import { useFormStructure, type FormField, type FormSection } from '@/composables/useFormStructure'
import { useFormStorage, type SavedForm } from '@/composables/useFormStorage'

interface UseFormBuilderOptions {
  fb: ReturnType<typeof useFormStructure>
  storage: ReturnType<typeof useFormStorage>
}

export function useFormBuilder({ fb, storage }: UseFormBuilderOptions) {
  const newSectionName = ref('')
  const showAddSection = ref(false)
  const addingFieldForSection = ref<string | null>(null)
  const showSaveModal = ref(false)
  const showLoadModal = ref(false)
  const showSchemaModal = ref(false)
  const saveName = ref('')
  const saveDescription = ref('')
  const editingFormId = ref<string | null>(null)

  const formStructure = computed(() => fb.formStructure.value)
  const selectedSectionId = computed(() => fb.selectedSectionId.value)
  const selectedFieldId = computed(() => fb.selectedFieldId.value)
  const selectedSection = computed(() => fb.selectedSection.value)
  const selectedField = computed(() => fb.selectedField.value)
  const totalFields = computed(() => fb.totalFields.value)
  const savedFormsList = computed(() => storage.savedForms.value || [])

  const handleAddSection = () => {
    if (!newSectionName.value.trim()) return

    fb.addSection(newSectionName.value.trim())
    newSectionName.value = ''
    showAddSection.value = false
  }

  const handleAddFieldClick = (sectionId: string) => {
    fb.selectSection(sectionId)
    addingFieldForSection.value = sectionId
  }

  const handleAddField = (sectionId: string, field: Omit<FormField, 'id'>) => {
    fb.addField(sectionId, field)
    addingFieldForSection.value = null
  }

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (!selectedSectionId.value || !selectedFieldId.value) return
    fb.updateField(selectedSectionId.value, selectedFieldId.value, updates)
  }

  const handleUpdateSection = (updates: Partial<FormSection>) => {
    console.log('handleUpdateSection called with:', updates)
    if (!selectedSectionId.value) {
      console.log('No selectedSectionId')
      return
    }
    console.log('Calling fb.updateSection with:', selectedSectionId.value, updates)
    fb.updateSection(selectedSectionId.value, updates)
  }

  const handleDeleteField = () => {
    if (!selectedSectionId.value || !selectedFieldId.value) return
    fb.deleteField(selectedSectionId.value, selectedFieldId.value)
  }

  const handleSelectField = (sectionId: string, fieldId: string) => {
    addingFieldForSection.value = null
    fb.selectField(sectionId, fieldId)
  }

  const handleSelectSection = (sectionId: string | null) => {
    addingFieldForSection.value = null
    fb.selectSection(sectionId)
  }

  const openSaveModal = () => {
    editingFormId.value = null
    saveName.value = formStructure.value.title || ''
    saveDescription.value = ''
    showSaveModal.value = true
  }

  const openLoadModal = () => { 
    showLoadModal.value = true
  }

  const openSchemaModal = () => {
    showSchemaModal.value = true
  }

  const closeSaveModal = () => {
    showSaveModal.value = false
  }

  const closeLoadModal = () => {
    showLoadModal.value = false
  }

  const closeSchemaModal = () => {
    showSchemaModal.value = false
  }

  const handleSaveForm = () => {
    if (!saveName.value.trim()) {
      alert('Nama form tidak boleh kosong')
      return
    }

    const updated = { ...formStructure.value, title: saveName.value }
    storage.saveForm(updated, saveName.value, saveDescription.value, editingFormId.value || undefined)
    showSaveModal.value = false
    saveName.value = ''
    saveDescription.value = ''
    alert('Form berhasil disimpan!')
  }

  const handleLoadForm = (savedForm: SavedForm) => {
    fb.formStructure.value = { ...savedForm.formStructure }
    fb.selectedSectionId.value = null
    fb.selectedFieldId.value = null
    editingFormId.value = savedForm.id
    showLoadModal.value = false
  }

  const handleDeleteForm = (id: string) => {
    if (confirm('Hapus form ini?')) {
      storage.deleteForm(id)
    }
  }

  const handleNewForm = () => {
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

  const copySchemaToClipboard = async () => {
    await navigator.clipboard.writeText(JSON.stringify(formStructure.value, null, 2))
    alert('Schema disalin ke clipboard!')
  }

  return {
    newSectionName,
    showAddSection,
    addingFieldForSection,
    showSaveModal,
    showLoadModal,
    showSchemaModal,
    saveName,
    saveDescription,
    formStructure,
    selectedSectionId,
    selectedFieldId,
    selectedSection,
    selectedField,
    totalFields,
    savedFormsList,
    handleAddSection,
    handleAddFieldClick,
    handleAddField,
    handleUpdateField,
    handleUpdateSection,
    handleDeleteField,
    handleSelectField,
    handleSelectSection,
    openSaveModal,
    openLoadModal,
    openSchemaModal,
    closeSaveModal,
    closeLoadModal,
    closeSchemaModal,
    handleSaveForm,
    handleLoadForm,
    handleDeleteForm,
    handleNewForm,
    copySchemaToClipboard,
  }
}
