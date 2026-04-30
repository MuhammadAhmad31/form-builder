import type {
  AkunMode,
  AkunStrategy,
  CategoryStrategy,
  CoaCategory,
  DepthMode,
  FormField,
  FormPreviewRowType,
  FormSection,
  ReportTypeSource,
  RowTypeFromSelectedReportTypeSource,
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
  type: FieldType | ''
  formula: string
  description: string
  previewRowType?: FormPreviewRowType
  akunMode?: AkunMode
  akunStrategy?: AkunStrategy
  depthMode?: DepthMode
  coaCategory?: CoaCategory
  categoryStrategy?: CategoryStrategy
  reportTypeSource?: ReportTypeSource
  rowTypeFromSelectedReportTypeSource?: RowTypeFromSelectedReportTypeSource
}

export const PREVIEW_ROW_TYPE_OPTIONS: Array<{ value: FormPreviewRowType; label: string; desc: string }> = [
  { value: 'item', label: 'Detail', desc: 'Baris detail biasa' },
  { value: 'subsection', label: 'Subtotal', desc: 'Baris biru (subsection)' },
  { value: 'section', label: 'Highlight', desc: 'Baris kuning (section)' },
]

export const TYPE_OPTIONS: TypeOption[] = [
  { value: 'account', label: 'Akun', desc: 'Tarik saldo dari akun', icon: '◉' },
  { value: 'category_account', label: 'Kategori Akun', desc: 'Kelompokkan akun berdasarkan kategori', icon: 'K' },
  { value: 'formula', label: 'Formula', desc: 'Hitung dari baris lain', icon: 'ƒ' },
  { value: 'reference', label: 'Referensi', desc: 'Nilai manual / referensi', icon: '↗' }
]

export const AKUN_MODE_OPTIONS: { value: AkunMode; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'multiple', label: 'Multiple' },
]

export const AKUN_STRATEGY_OPTIONS: { value: AkunStrategy; label: string }[] = [
  { value: 'period_net_change', label: 'Period Net Change' },
  { value: 'ending_balance', label: 'Ending Balance' },
  { value: 'beginning_balance', label: 'Beginning Balance' },
]

export const DEPTH_MODE_OPTIONS: { value: DepthMode; label: string; desc: string }[] = [
  { value: 'one_level', label: 'One Level', desc: 'Hanya level pertama' },
  { value: 'one_level_below', label: 'One Level Below', desc: 'Satu level di bawah' },
  { value: 'all_level', label: 'All Level', desc: 'Semua level' },
]

export const COA_CATEGORY_OPTIONS: { value: CoaCategory; label: string }[] = [
  { value: 'pendapatan_usaha', label: 'Pendapatan Usaha (4-100)' },
  { value: 'pendapatan_non_usaha', label: 'Pendapatan Non Usaha (4-200)' },
  { value: 'beban_pokok', label: 'Beban Pokok (5-100)' },
  { value: 'beban_operasional', label: 'Beban Operasional (5-200)' },
  { value: 'beban_lainnya', label: 'Beban Lainnya (5-300)' },
]

export const CATEGORY_STRATEGY_OPTIONS: { value: CategoryStrategy; label: string }[] = [
  { value: 'period_net_change', label: 'Period Net Change (Mutasi Bersih)' },
  { value: 'ending_balance', label: 'Ending Balance (Saldo Akhir)' },
  { value: 'beginning_balance', label: 'Beginning Balance (Saldo Awal)' },
  { value: 'balance_change', label: 'Balance Change (Selisih)' },
]

export const REPORT_TYPE_SOURCE_OPTIONS: { value: ReportTypeSource; label: string }[] = [
  { value: 'cash_flow', label: 'Laporan Arus Kas' },
  { value: 'profit_loss', label: 'Laporan Laba Rugi' },
  { value: 'financial_position', label: 'Laporan Posisi Keuangan' },
  { value: 'equity', label: 'Laporan Perubahan Ekuitas' },
]

export const ROW_TYPE_FROM_SELECTED_REPORT_TYPE_SOURCE_OPTIONS: { value: RowTypeFromSelectedReportTypeSource; label: string }[] = [
  { value: 'operating_activities', label: 'Aktivitas Operasi' },
  { value: 'investing_activities', label: 'Aktivitas Investasi' },
  { value: 'financing_activities', label: 'Aktivitas Pendanaan' },
  { value: 'non_operating_income_expense', label: 'Pendapatan/Beban Non Operasi' },
  { value: 'income', label: 'Pendapatan' },
  { value: 'cost_of_revenue', label: 'Harga Pokok Pendapatan' },
  { value: 'expense', label: 'Beban' },
  { value: 'current_assets', label: 'Aset Lancar' },
  { value: 'non_current_assets', label: 'Aset Tidak Lancar' },
  { value: 'current_liabilities', label: 'Kewajiban Lancar' },
  { value: 'non_current_liabilities', label: 'Kewajiban Tidak Lancar' },
  { value: 'equity', label: 'Ekuitas' },
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
    account: 'bg-emerald-50 text-emerald-700',
    formula: 'bg-violet-50 text-violet-700',
    category_account: 'bg-blue-50 text-blue-700',
    reference: 'bg-orange-50 text-orange-700',
  }[type] ?? 'bg-slate-100 text-slate-600'
}

export function typeLabelText(type: FieldType): string {
  return {
    account: 'BARIS AKUN',
    formula: 'BARIS FORMULA',
    category_account: 'BARIS KATEGORI AKUN',
    reference: 'BARIS REFERENSI',
  }[type]
}

export function fieldTypeDot(type: FieldType): string {
  return {
    account: 'bg-emerald-500',
    formula: 'bg-violet-500',
    category_account: 'bg-blue-500',
    reference: 'bg-orange-500',
  }[type] ?? 'bg-slate-400'
}

export function defaultFieldForm(): ConfigFieldForm {
  return {
    name: '',
    code: '',
    type: '' as FieldType,
    formula: '',
    description: '',
    previewRowType: undefined,
    akunMode: 'single' as AkunMode,
    akunStrategy: 'period_net_change' as AkunStrategy,
    depthMode: 'one_level_below' as DepthMode,
    coaCategory: 'pendapatan_usaha' as CoaCategory,
    categoryStrategy: 'period_net_change' as CategoryStrategy,
    reportTypeSource: '' as ReportTypeSource,
    rowTypeFromSelectedReportTypeSource: '' as RowTypeFromSelectedReportTypeSource,
  }
}
