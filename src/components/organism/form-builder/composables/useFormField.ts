import { ref, computed } from 'vue'
import type { BuilderField, FieldType, FieldSpacing, FieldOption } from '../types'

const GRID_COLUMNS = 12
const MIN_WIDTH = 3
const MIN_HEIGHT = 2

export function useFormField(initialFields: BuilderField[] = []) {
  const fieldCounter = ref(2)
  const optionCounter = ref(4)
  const fields = ref<BuilderField[]>(initialFields)
  const selectedFieldId = ref(fields.value[0]?.id ?? '')

  const selectedField = computed(() => {
    return fields.value.find((field) => field.id === selectedFieldId.value) ?? null
  })

  function nextFieldId() {
    fieldCounter.value += 1
    return `field-${fieldCounter.value}`
  }

  function nextOptionId() {
    optionCounter.value += 1
    return `option-${optionCounter.value}`
  }

  function nextFieldY() {
    return fields.value.reduce((max, field) => Math.max(max, field.y + field.h), 0)
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

  function createField(type: FieldType): BuilderField {
    const id = nextFieldId()
    const isTextarea = type === 'textarea'
    const isSelect = type === 'select'
    const isDate = type === 'date'
    const isCheckbox = type === 'checkbox'
    const isRadio = type === 'radio'
    const hasOptions = isSelect || isCheckbox || isRadio

    const field: BuilderField = {
      id,
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
            { id: nextOptionId(), label: 'Option 1', value: 'option-1' },
            { id: nextOptionId(), label: 'Option 2', value: 'option-2' },
          ]
        : [],
      x: 0,
      y: nextFieldY(),
      w: isTextarea || isCheckbox || isRadio ? 12 : 6,
      h: isTextarea ? 6 : isCheckbox || isRadio ? 5 : 4,
    }

    normalizeField(field)
    return field
  }

  function addField(type: FieldType) {
    const field = createField(type)
    fields.value.push(field)
    selectedFieldId.value = field.id
  }

  function selectField(fieldId: string) {
    selectedFieldId.value = fieldId
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
  }

  function updateField<K extends keyof BuilderField>(key: K, value: BuilderField[K]) {
    if (!selectedField.value) return
    selectedField.value[key] = value

    if (key === 'selectionMode' && selectedField.value.type === 'checkbox') {
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
    const order = selectedField.value.options.length + 1
    selectedField.value.options.push({
      id: nextOptionId(),
      label: `Option ${order}`,
      value: `option-${order}`,
    })
  }

  function updateOption(optionId: string, key: keyof FieldOption, value: string) {
    if (!selectedField.value || !['select', 'checkbox', 'radio'].includes(selectedField.value.type)) return
    const option = selectedField.value.options.find((item: FieldOption) => item.id === optionId)
    if (!option) return
    option[key] = value
  }

  function removeOption(optionId: string) {
    if (!selectedField.value || !['select', 'checkbox', 'radio'].includes(selectedField.value.type)) return
    selectedField.value.options = selectedField.value.options.filter((option: FieldOption) => option.id !== optionId)
  }

  function getFieldById(fieldId: string | number): BuilderField | null {
    return fields.value.find((field) => field.id === String(fieldId)) ?? null
  }

  return {
    // State
    fields,
    selectedFieldId,
    selectedField,
    fieldCounter,
    optionCounter,

    // Methods
    nextFieldId,
    nextOptionId,
    nextFieldY,
    normalizeField,
    fieldTypeLabel,
    createField,
    addField,
    selectField,
    removeSelectedField,
    updateField,
    updateSpacing,
    updateGridValue,
    addOption,
    updateOption,
    removeOption,
    getFieldById,
  }
}
