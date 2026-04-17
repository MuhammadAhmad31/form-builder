import type { FormStructure } from '@/composables/useFormStructure'

export interface RendererPreviewFieldPayload {
  id: string
  code: string
  name: string
  type: string
  value: string | number
  calculateOf?: Array<{
    code: string
    notation: 'positive' | 'negative'
  }>
}

export interface RendererPreviewSectionPayload {
  id: string
  name: string
  fields: RendererPreviewFieldPayload[]
}

export interface RendererSubmitPayload {
  formJson: FormStructure | null
  previewJson: RendererPreviewSectionPayload[]
}

export type RendererSubmitHandler = (
  payload: RendererSubmitPayload,
) => void | Promise<void>
