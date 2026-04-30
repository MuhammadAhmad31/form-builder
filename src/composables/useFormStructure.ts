import { ref, computed } from 'vue'

export type FieldType = 'account' | 'formula' | 'category_account' | 'reference'
export type FormPreviewRowType = 'item' | 'subsection' | 'section'
export type AkunMode = 'single' | 'multiple'
export type AkunStrategy = 'period_net_change' | 'ending_balance' | 'beginning_balance'
export type DepthMode = 'one_level' | 'one_level_below' | 'all_level'
export type CoaCategory = 'pendapatan_usaha' | 'pendapatan_non_usaha' | 'beban_pokok' | 'beban_operasional' | 'beban_lainnya'
export type CategoryStrategy = 'period_net_change' | 'ending_balance' | 'beginning_balance' | 'balance_change'
export type ReportTypeSource = 'cash_flow' | 'profit_loss' | 'financial_position' | 'equity'
export type RowTypeFromSelectedReportTypeSource = 'operating_activities' | 'investing_activities' | 'financing_activities' | 'non_operating_income_expense' | 'income' | 'cost_of_revenue' | 'expense' | 'current_assets' | 'non_current_assets' | 'current_liabilities' | 'non_current_liabilities' | 'equity'
export type FirstLevel = 'asset' | 'liability' | 'equity' | 'income' | 'expense'

export interface FormField {
  id: string
  name: string
  code: string
  type: FieldType
  formula?: string
  description?: string
  previewRowType?: FormPreviewRowType
  akunMode?: AkunMode
  akunStrategy?: AkunStrategy
  depthMode?: DepthMode
  coaCategory?: CoaCategory
  categoryStrategy?: CategoryStrategy
  reportTypeSource?: ReportTypeSource
  rowTypeFromSelectedReportTypeSource?: RowTypeFromSelectedReportTypeSource
  firstLevel?: FirstLevel
}

export interface FormSection {
  id: string
  name: string
  fields: FormField[]
  collapsed?: boolean
  hideLabel?: boolean
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
