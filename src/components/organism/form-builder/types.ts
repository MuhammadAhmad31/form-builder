export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'date'
export type LabelPlacement = 'top' | 'bottom' | 'left' | 'right'
export type SelectionMode = 'single' | 'multiple'
export type OptionLayout = 'vertical' | 'horizontal'

export interface FieldOption {
  id: string
  label: string
  value: string
}

export interface FieldSpacing {
  top: number
  right: number
  bottom: number
  left: number
}

export interface BuilderField {
  id: string
  type: FieldType
  label: string
  labelPlacement: LabelPlacement
  name: string
  placeholder: string
  value: string | string[]
  helpText: string
  required: boolean
  readOnly: boolean
  clearable: boolean
  selectionMode: SelectionMode
  optionLayout: OptionLayout
  spacing: FieldSpacing
  options: FieldOption[]
  x: number
  y: number
  w: number
  h: number
}
