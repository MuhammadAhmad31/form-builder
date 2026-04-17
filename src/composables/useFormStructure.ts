import { ref, computed } from 'vue'

export type FieldType = 'akun' | 'formula' | 'text' | 'number'
export type FormPreviewRowType = 'item' | 'subsection' | 'section'
export type AkunType = 'pendapatan' | 'beban' | 'aset' | 'kewajiban' | 'ekuitas'
export type AkunSource = 'semua_akun_tipe' | 'akun_spesifik' | 'semua_akun'
export type AkunCalc = 'mutasi_bersih' | 'saldo_akhir' | 'mutasi_debit' | 'mutasi_kredit'

export interface FormField {
  id: string
  name: string
  code: string
  type: FieldType
  formula?: string
  description?: string
  previewRowType?: FormPreviewRowType
  akunSource?: AkunSource
  akunTypes?: AkunType[]
  akunCalc?: AkunCalc
}

export interface FormSection {
  id: string
  name: string
  fields: FormField[]
  collapsed?: boolean
}

export interface FormStructure {
  id: string
  title: string
  sections: FormSection[]
}

export function useFormStructure() {
  const formStructure = ref<FormStructure>({
    id: 'form-1',
    title: 'Struktur Laporan',
    sections: [],
  })

  const selectedSectionId = ref<string | null>(null)
  const selectedFieldId = ref<string | null>(null)

  const selectedSection = computed(() =>
    formStructure.value.sections.find((s) => s.id === selectedSectionId.value) ?? null
  )

  const selectedField = computed(() => {
    if (!selectedFieldId.value || !selectedSection.value) return null
    return selectedSection.value.fields.find((f) => f.id === selectedFieldId.value) ?? null
  })

  const totalFields = computed(() =>
    formStructure.value.sections.reduce((sum, s) => sum + s.fields.length, 0)
  )

  function addSection(name: string) {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      name,
      fields: [],
      collapsed: false,
    }
    formStructure.value.sections.push(newSection)
    return newSection
  }

  function updateSection(sectionId: string, updates: Partial<FormSection>) {
    const section = formStructure.value.sections.find((s) => s.id === sectionId)
    if (section) Object.assign(section, updates)
  }

  function toggleSectionCollapse(sectionId: string) {
    const section = formStructure.value.sections.find((s) => s.id === sectionId)
    if (section) section.collapsed = !section.collapsed
  }

  function deleteSection(sectionId: string) {
    const index = formStructure.value.sections.findIndex((s) => s.id === sectionId)
    if (index !== -1) {
      formStructure.value.sections.splice(index, 1)
      if (selectedSectionId.value === sectionId) {
        selectedSectionId.value = null
        selectedFieldId.value = null
      }
    }
  }

  function addField(sectionId: string, field: Omit<FormField, 'id'>) {
    const section = formStructure.value.sections.find((s) => s.id === sectionId)
    if (section) {
      const newField: FormField = { ...field, id: `field-${Date.now()}` }
      section.fields.push(newField)
      return newField
    }
  }

  function updateField(sectionId: string, fieldId: string, updates: Partial<FormField>) {
    const section = formStructure.value.sections.find((s) => s.id === sectionId)
    if (section) {
      const field = section.fields.find((f) => f.id === fieldId)
      if (field) Object.assign(field, updates)
    }
  }

  function deleteField(sectionId: string, fieldId: string) {
    const section = formStructure.value.sections.find((s) => s.id === sectionId)
    if (section) {
      const index = section.fields.findIndex((f) => f.id === fieldId)
      if (index !== -1) {
        section.fields.splice(index, 1)
        if (selectedFieldId.value === fieldId) selectedFieldId.value = null
      }
    }
  }

  function selectSection(sectionId: string | null) {
    selectedSectionId.value = sectionId
    selectedFieldId.value = null
  }

  function selectField(sectionId: string, fieldId: string | null) {
    selectedSectionId.value = sectionId
    selectedFieldId.value = fieldId
  }

  return {
    formStructure,
    selectedSectionId,
    selectedFieldId,
    selectedSection,
    selectedField,
    totalFields,
    addSection,
    updateSection,
    toggleSectionCollapse,
    deleteSection,
    addField,
    updateField,
    deleteField,
    selectSection,
    selectField,
  }
}
