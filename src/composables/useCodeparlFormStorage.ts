import type { FormSection } from '@unnovate-brains/form-builder/dist/types/fields'

const STORAGE_KEY = 'codeparl-form-builder:forms'

export interface StoredCodeparlForm {
  id: string
  name: string
  sections: FormSection[]
  createdAt: string
  updatedAt: string
}

type StoredCodeparlFormMap = Record<string, StoredCodeparlForm>

function isBrowser() {
  return typeof window !== 'undefined'
}

function readStorage(): StoredCodeparlFormMap {
  if (!isBrowser()) {
    return {}
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw) as StoredCodeparlFormMap
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch (error) {
    console.error('Failed to parse saved Codeparl forms from localStorage', error)
    return {}
  }
}

function writeStorage(value: StoredCodeparlFormMap) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

function createFormId() {
  return `cpf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function deriveFormName(sections: FormSection[]) {
  const firstTitledSection = sections.find((section) => section.title?.trim())
  if (firstTitledSection?.title) {
    return firstTitledSection.title.trim()
  }

  return `Untitled Form ${new Date().toLocaleString()}`
}

export function useCodeparlFormStorage() {
  function saveForm(sections: FormSection[], formId?: string) {
    const storage = readStorage()
    const id = formId ?? createFormId()
    const now = new Date().toISOString()
    const existing = storage[id]

    storage[id] = {
      id,
      name: deriveFormName(sections),
      sections,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }

    writeStorage(storage)
    return storage[id]
  }

  function getForm(formId: string) {
    return readStorage()[formId] ?? null
  }

  function getForms() {
    return Object.values(readStorage()).sort((left, right) =>
      right.updatedAt.localeCompare(left.updatedAt),
    )
  }

  function deleteForm(formId: string) {
    const storage = readStorage()
    if (!storage[formId]) {
      return false
    }

    delete storage[formId]
    writeStorage(storage)
    return true
  }

  return {
    saveForm,
    getForm,
    getForms,
    deleteForm,
  }
}
