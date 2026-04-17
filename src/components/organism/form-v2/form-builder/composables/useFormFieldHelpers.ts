import type { BuilderField } from '../types'

export function useFormFieldHelpers() {
  function fieldContentClass(field: BuilderField) {
    if (field.labelPlacement === 'left' || field.labelPlacement === 'right') {
      return 'flex-row items-start gap-3'
    }
    return 'flex-col'
  }

  function labelClass(field: BuilderField) {
    if (field.labelPlacement === 'left' || field.labelPlacement === 'right') {
      return 'w-32 shrink-0 pt-2'
    }
    return ''
  }

  function inputWrapperClass(field: BuilderField) {
    if (field.labelPlacement === 'left' || field.labelPlacement === 'right') {
      return 'min-w-0 flex-1'
    }
    return 'min-w-0'
  }

  function canvasFieldStyle(field: BuilderField) {
    return {
      paddingTop: `${field.spacing.top}px`,
      paddingRight: `${field.spacing.right}px`,
      paddingBottom: `${field.spacing.bottom}px`,
      paddingLeft: `${field.spacing.left}px`,
    }
  }

  function isEditableTarget(target: EventTarget | null): boolean {
    const element = target as HTMLElement | null
    if (!element) return false
    const tagName = element.tagName.toLowerCase()
    return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || element.isContentEditable
  }

  return {
    fieldContentClass,
    labelClass,
    inputWrapperClass,
    canvasFieldStyle,
    isEditableTarget,
  }
}
