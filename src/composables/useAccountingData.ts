import { ref } from 'vue'

export type COACategory = 'aset' | 'kewajiban' | 'ekuitas' | 'pendapatan' | 'beban'

export interface Account {
  code: string
  name: string
  category: COACategory
  balance: number
  type: 'debit' | 'kredit'
}

export interface ReportType {
  id: string
  name: string
  description: string
  categories: COACategory[]
}

// Sample COA data
const SAMPLE_ACCOUNTS: Account[] = [
  // Aset
  { code: '1101', name: 'Kas', category: 'aset', balance: 50000000, type: 'debit' },
  { code: '1102', name: 'Bank', category: 'aset', balance: 150000000, type: 'debit' },
  { code: '1201', name: 'Piutang Usaha', category: 'aset', balance: 75000000, type: 'debit' },
  { code: '1301', name: 'Persediaan', category: 'aset', balance: 100000000, type: 'debit' },
  // Kewajiban
  { code: '2101', name: 'Hutang Usaha', category: 'kewajiban', balance: 50000000, type: 'kredit' },
  { code: '2201', name: 'Hutang Bank', category: 'kewajiban', balance: 200000000, type: 'kredit' },
  // Ekuitas
  { code: '3101', name: 'Modal Awal', category: 'ekuitas', balance: 500000000, type: 'kredit' },
  { code: '3201', name: 'Laba Ditahan', category: 'ekuitas', balance: 100000000, type: 'kredit' },
  // Pendapatan
  { code: '4101', name: 'Pendapatan Jasa', category: 'pendapatan', balance: 150000000, type: 'kredit' },
  { code: '4102', name: 'Pendapatan Penjualan', category: 'pendapatan', balance: 200000000, type: 'kredit' },
  // Beban
  { code: '5101', name: 'Beban Gaji', category: 'beban', balance: 80000000, type: 'debit' },
  { code: '5102', name: 'Beban Operasional', category: 'beban', balance: 30000000, type: 'debit' },
]

const REPORT_TYPES: ReportType[] = [
  {
    id: 'income-statement',
    name: 'Laporan Laba Rugi',
    description: 'Menampilkan pendapatan, beban, dan laba/rugi bersih',
    categories: ['pendapatan', 'beban'],
  },
  {
    id: 'balance-sheet',
    name: 'Neraca',
    description: 'Menampilkan aset, kewajiban, dan ekuitas',
    categories: ['aset', 'kewajiban', 'ekuitas'],
  },
  {
    id: 'all-accounts',
    name: 'Semua Akun',
    description: 'Menampilkan semua akun dari chart of accounts',
    categories: ['aset', 'kewajiban', 'ekuitas', 'pendapatan', 'beban'],
  },
]

export function useAccountingData() {
  const accounts = ref<Account[]>([...SAMPLE_ACCOUNTS])
  const reportTypes = ref<ReportType[]>([...REPORT_TYPES])
  const selectedReportType = ref<string>('income-statement')

  // Get accounts by category
  const getAccountsByCategory = (category: COACategory): Account[] => {
    return accounts.value.filter((acc) => acc.category === category)
  }

  // Get report type by id
  const getReportType = (id: string): ReportType | undefined => {
    return reportTypes.value.find((rt) => rt.id === id)
  }

  // Get relevant accounts for selected report type
  const getRelevantAccounts = (): Account[] => {
    const report = getReportType(selectedReportType.value)
    if (!report) return []
    return accounts.value.filter((acc) => report.categories.includes(acc.category))
  }

  // Get accounts for specific category
  const getCategoryAccounts = (category: COACategory): Account[] => {
    return getAccountsByCategory(category)
  }

  // Add or update account
  const addAccount = (account: Account) => {
    const index = accounts.value.findIndex((a) => a.code === account.code)
    if (index !== -1) {
      accounts.value[index] = account
    } else {
      accounts.value.push(account)
    }
  }

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return {
    accounts,
    reportTypes,
    selectedReportType,
    getAccountsByCategory,
    getReportType,
    getRelevantAccounts,
    getCategoryAccounts,
    addAccount,
    formatCurrency,
  }
}
