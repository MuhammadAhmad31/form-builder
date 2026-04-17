import { ref, computed } from 'vue'
import type { BuilderField, BuilderSection, FieldType, FieldSpacing, FieldOption } from '../types'

const GRID_COLUMNS = 12
const MIN_WIDTH = 3
const MIN_HEIGHT = 2

export function useFormField(initialFields: BuilderField[] = []) {
  const fieldCounter = ref(2)
  const optionCounter = ref(4)
  const sectionCounter = ref(1)
  const fields = ref<BuilderField[]>(initialFields)
  const sections = ref<BuilderSection[]>([
    {
      id: 'section-1',
      title: 'Section 1',
      showTitle: false,
    },
  ])
  const selectedSectionId = ref(sections.value[0].id)
  const selectedFieldId = ref(fields.value[0]?.id ?? '')

  const selectedField = computed(() => {
    return fields.value.find((field) => field.id === selectedFieldId.value) ?? null
  })

  const selectedSection = computed(() => {
    return sections.value.find((section) => section.id === selectedSectionId.value) ?? null
  })

  function nextFieldId() {
    fieldCounter.value += 1
    return `field-${fieldCounter.value}`
  }

  function nextOptionId() {
    optionCounter.value += 1
    return `option-${optionCounter.value}`
  }

  function nextSectionId() {
    sectionCounter.value += 1
    return `section-${sectionCounter.value}`
  }

  function nextFieldY(sectionId: string) {
    return fields.value
      .filter((field) => field.sectionId === sectionId)
      .reduce((max, field) => Math.max(max, field.y + field.h), 0)
  }

  function createDefaultOption(order = 1): FieldOption {
    return {
      id: nextOptionId(),
      label: `Option ${order}`,
      value: `option-${order}`,
    }
  }

  function normalizeField(field: BuilderField) {
    field.w = Math.max(MIN_WIDTH, Math.min(GRID_COLUMNS, field.w))
    field.h = Math.max(field.type === 'textarea' ? 6 : field.type === 'checkbox' || field.type === 'radio' ? 5 : MIN_HEIGHT, field.h)
    field.x = Math.max(0, Math.min(GRID_COLUMNS - field.w, field.x))
    field.y = Math.max(0, field.y)
  }

  function fieldTypeLabel(type: FieldType) {
    const labelMap: Record<FieldType, string> = {
      text: 'Text',
      textarea: 'Textarea',
      number: 'Number',
      select: 'Select',
      checkbox: 'Checkbox',
      radio: 'Radio',
      date: 'Date',
    }
    return labelMap[type]
  }

  function createField(type: FieldType, sectionId: string): BuilderField {
    const id = nextFieldId()
    const isTextarea = type === 'textarea'
    const isSelect = type === 'select'
    const isDate = type === 'date'
    const isCheckbox = type === 'checkbox'
    const isRadio = type === 'radio'
    const hasOptions = isSelect || isCheckbox || isRadio

    const field: BuilderField = {
      id,
      sectionId,
      type,
      label: `${fieldTypeLabel(type)} Field`,
      labelPlacement: 'top',
      name: `${type}_${fieldCounter.value}`,
      placeholder: hasOptions ? '' : isDate ? '' : `Masukkan ${fieldTypeLabel(type).toLowerCase()}`,
      value: isCheckbox ? [] : '',
      helpText: '',
      required: false,
      readOnly: false,
      clearable: isSelect || isDate,
      selectionMode: isCheckbox ? 'multiple' : 'single',
      optionLayout: 'vertical',
      spacing: { top: 0, right: 0, bottom: 16, left: 0 },
      options: hasOptions
        ? [
            createDefaultOption(1),
            createDefaultOption(2),
          ]
        : [],
      x: 0,
      y: nextFieldY(sectionId),
      w: isTextarea || isCheckbox || isRadio ? 12 : 6,
      h: isTextarea ? 6 : isCheckbox || isRadio ? 5 : 4,
    }

    normalizeField(field)
    return field
  }

  function addField(type: FieldType) {
    const field = createField(type, selectedSectionId.value)
    fields.value.push(field)
    selectedFieldId.value = field.id
  }

  function selectField(fieldId: string) {
    selectedFieldId.value = fieldId
    const field = fields.value.find((item) => item.id === fieldId)
    if (field) {
      selectedSectionId.value = field.sectionId
    }
  }

  function selectSection(sectionId: string) {
    if (!sections.value.some((section) => section.id === sectionId)) {
      return
    }

    selectedSectionId.value = sectionId
    selectedFieldId.value = ''
  }

  function addSection() {
    const id = nextSectionId()
    const section: BuilderSection = {
      id,
      title: `Section ${sectionCounter.value}`,
      showTitle: false,
    }

    sections.value.push(section)
    selectedSectionId.value = id
  }

  function updateSectionTitle(sectionId: string, title: string) {
    const section = sections.value.find((item) => item.id === sectionId)
    if (!section) {
      return
    }

    const normalized = title.trim()
    section.title = normalized.length > 0 ? normalized : section.title
  }

  function updateSectionVisibility(sectionId: string, showTitle: boolean) {
    const section = sections.value.find((item) => item.id === sectionId)
    if (!section) {
      return
    }

    section.showTitle = showTitle
  }

  function removeSelectedField() {
    if (!selectedField.value) return

    const currentIndex = fields.value.findIndex((field) => field.id === selectedField.value?.id)
    fields.value = fields.value.filter((field) => field.id !== selectedField.value?.id)

    if (fields.value.length === 0) {
      selectedFieldId.value = ''
      return
    }

    const nextField = fields.value[Math.max(0, currentIndex - 1)]
    selectedFieldId.value = nextField.id
    selectedSectionId.value = nextField.sectionId
  }

  function removeSelectedSection() {
    if (!selectedSection.value) return
    
    fields.value = fields.value.filter((field) => field.sectionId !== selectedSection.value?.id)

    const currentIndex = sections.value.findIndex((section) => section.id === selectedSection.value?.id)

    sections.value = sections.value.filter((section) => section.id !== selectedSection.value?.id)

    if (sections.value.length === 0) {
      selectedSectionId.value = ''
      selectedFieldId.value = ''
      return
    }

    const nextSectionIndex = Math.min(currentIndex, sections.value.length - 1)
    const nextSection = sections.value[nextSectionIndex]
    selectedSectionId.value = nextSection.id

    const nextSectionFirstField = fields.value.find((field) => field.sectionId === nextSection.id)
    selectedFieldId.value = nextSectionFirstField?.id ?? ''
  }

  function moveFieldToSection(fieldId: string, targetSectionId: string) {
    const field = fields.value.find((f) => f.id === fieldId)
    const targetSection = sections.value.find((s) => s.id === targetSectionId)

    if (!field || !targetSection) return

    if (field.sectionId === targetSectionId) return

    field.sectionId = targetSectionId

    field.x = 0
    field.y = nextFieldY(targetSectionId)

    normalizeField(field)

    selectedFieldId.value = fieldId
    selectedSectionId.value = targetSectionId
  }

  function getFieldsBySection(sectionId: string): BuilderField[] {
    return fields.value.filter((field) => field.sectionId === sectionId)
  }

  function updateField<K extends keyof BuilderField>(key: K, value: BuilderField[K]) {
    if (!selectedField.value) return
    selectedField.value[key] = value

    if (key === 'selectionMode' && selectedField.value.type === 'checkbox') {
      if (selectedField.value.options.length === 0) {
        selectedField.value.options = [createDefaultOption(1)]
      }

      if (value === 'single') {
        selectedField.value.options = [selectedField.value.options[0]]
      }

      selectedField.value.value = value === 'multiple'
        ? Array.isArray(selectedField.value.value)
          ? selectedField.value.value
          : selectedField.value.value ? [selectedField.value.value] : []
        : Array.isArray(selectedField.value.value)
          ? selectedField.value.value[0] || ''
          : selectedField.value.value
    }

    normalizeField(selectedField.value)
  }

  function updateSpacing(side: keyof FieldSpacing, value: string | number) {
    if (!selectedField.value) return
    const parsed = Number(value)
    selectedField.value.spacing[side] = Number.isFinite(parsed) ? Math.max(0, parsed) : 0
  }

  function updateGridValue(key: 'x' | 'y' | 'w' | 'h', value: string | number) {
    if (!selectedField.value) return
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return
    selectedField.value[key] = Math.trunc(parsed)
    normalizeField(selectedField.value)
  }

  function addOption() {
    if (!selectedField.value || !['select', 'checkbox', 'radio'].includes(selectedField.value.type)) return
    if (selectedField.value.type === 'checkbox' && selectedField.value.selectionMode === 'single') return
    const order = selectedField.value.options.length + 1
    selectedField.value.options.push(createDefaultOption(order))
  }

  function updateOption(optionId: string, key: keyof FieldOption, value: string) {
    if (!selectedField.value || !['select', 'checkbox', 'radio'].includes(selectedField.value.type)) return
    const option = selectedField.value.options.find((item: FieldOption) => item.id === optionId)
    if (!option) return
    option[key] = value
  }

  function removeOption(optionId: string) {
    if (!selectedField.value || !['select', 'checkbox', 'radio'].includes(selectedField.value.type)) return
    if (selectedField.value.type === 'checkbox' && selectedField.value.selectionMode === 'single') return
    selectedField.value.options = selectedField.value.options.filter((option: FieldOption) => option.id !== optionId)
  }

  function getFieldById(fieldId: string | number): BuilderField | null {
    return fields.value.find((field) => field.id === String(fieldId)) ?? null
  }

  return {
    // State
    fields,
    sections,
    selectedSection,
    selectedSectionId,
    selectedFieldId,
    selectedField,
    fieldCounter,
    optionCounter,
    sectionCounter,

    // Methods
    nextFieldId,
    nextOptionId,
    nextSectionId,
    nextFieldY,
    normalizeField,
    fieldTypeLabel,
    createField,
    addField,
    addSection,
    selectField,
    selectSection,
    updateSectionTitle,
    updateSectionVisibility,
    removeSelectedField,
    removeSelectedSection,
    moveFieldToSection,
    updateField,
    updateSpacing,
    updateGridValue,
    addOption,
    updateOption,
    removeOption,
    getFieldsBySection,
    getFieldById,
  }
}
