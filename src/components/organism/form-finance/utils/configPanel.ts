import type {
  AkunCalc,
  AkunSource,
  AkunType,
  FormField,
  FormPreviewRowType,
  FormSection,
} from '@/composables/useFormStructure'

export type FieldType = FormField['type']

export interface FormulaToken {
  fieldId: string
  code: string
  name: string
  sign: 'pos' | 'neg'
}

export interface TypeOption {
  value: FieldType
  label: string
  desc: string
  icon: string
}

export interface ConfigFieldForm {
  name: string
  code: string
  type: FieldType
  formula: string
  description: string
  previewRowType?: FormPreviewRowType
  akunSource: AkunSource
  akunTypes: AkunType[]
  akunCalc: AkunCalc
}

export const PREVIEW_ROW_TYPE_OPTIONS: Array<{ value: FormPreviewRowType; label: string; desc: string }> = [
  { value: 'item', label: 'Detail', desc: 'Baris detail biasa' },
  { value: 'subsection', label: 'Subtotal', desc: 'Baris biru (subsection)' },
  { value: 'section', label: 'Highlight', desc: 'Baris kuning (section)' },
]

export const TYPE_OPTIONS: TypeOption[] = [
  { value: 'akun', label: 'Akun', desc: 'Tarik saldo dari akun', icon: '◉' },
  { value: 'formula', label: 'Formula', desc: 'Hitung dari baris lain', icon: 'ƒ' },
  { value: 'number', label: 'Angka', desc: 'Nilai manual / referensi', icon: '↗' },
  { value: 'text', label: 'Teks', desc: 'Label atau pemisah', icon: 'T' },
]

export const AKUN_TYPE_OPTIONS: { value: AkunType; label: string }[] = [
  { value: 'pendapatan', label: 'Pendapatan' },
  { value: 'beban', label: 'Beban' },
  { value: 'aset', label: 'Aset' },
  { value: 'kewajiban', label: 'Kewajiban' },
  { value: 'ekuitas', label: 'Ekuitas' },
]

export const AKUN_SOURCE_OPTIONS: { value: AkunSource; label: string }[] = [
  { value: 'semua_akun_tipe', label: 'Semua akun bertipe tertentu' },
  { value: 'akun_spesifik', label: 'Akun spesifik' },
  { value: 'semua_akun', label: 'Semua akun' },
]

export const AKUN_CALC_OPTIONS: { value: AkunCalc; label: string }[] = [
  { value: 'mutasi_bersih', label: 'Mutasi bersih' },
  { value: 'saldo_akhir', label: 'Saldo akhir' },
  { value: 'mutasi_debit', label: 'Mutasi debit' },
  { value: 'mutasi_kredit', label: 'Mutasi kredit' },
]

export function generateCodeFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
}

export function parseFormulaToTokens(formula: string, formStructure: { sections: FormSection[] }): FormulaToken[] {
  if (!formula) return []

  const tokens: FormulaToken[] = []
  const regex = /([+-])?\s*\[([^\]]+)\]/g
  let match: RegExpExecArray | null
  let isFirst = true

  while ((match = regex.exec(formula)) !== null) {
    const sign = isFirst ? 'pos' : match[1] === '-' ? 'neg' : 'pos'
    const code = match[2]

    let name = code
    for (const section of formStructure.sections) {
      const field = section.fields.find(item => item.code === code)
      if (field) {
        name = field.name
        break
      }
    }

    tokens.push({ fieldId: code, code, name, sign })
    isFirst = false
  }

  return tokens
}

export function tokensToFormula(tokens: FormulaToken[]): string {
  if (!tokens.length) return ''

  return tokens
    .map((token, index) => {
      if (index === 0) return `[${token.code}]`
      return `${token.sign === 'pos' ? ' + ' : ' - '}[${token.code}]`
    })
    .join('')
}

export function typeIconClass(type: FieldType): string {
  return {
    akun: 'bg-emerald-50 text-emerald-700',
    formula: 'bg-violet-50 text-violet-700',
    number: 'bg-orange-50 text-orange-700',
    text: 'bg-slate-100 text-slate-600',
  }[type] ?? 'bg-slate-100 text-slate-600'
}

export function typeLabelText(type: FieldType): string {
  return {
    akun: 'BARIS AKUN',
    formula: 'BARIS FORMULA',
    number: 'BARIS ANGKA',
    text: 'BARIS TEKS',
  }[type]
}

export function fieldTypeDot(type: FieldType): string {
  return {
    akun: 'bg-emerald-500',
    formula: 'bg-violet-500',
    number: 'bg-orange-500',
    text: 'bg-slate-400',
  }[type] ?? 'bg-slate-400'
}

export function defaultFieldForm(): ConfigFieldForm {
  return {
    name: '',
    code: '',
    type: 'akun' as FieldType,
    formula: '',
    description: '',
    previewRowType: undefined,
    akunSource: 'semua_akun_tipe' as AkunSource,
    akunTypes: ['pendapatan'] as AkunType[],
    akunCalc: 'mutasi_bersih' as AkunCalc,
  }
}
