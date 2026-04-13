<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormSection, FormField, AkunType, AkunSource, AkunCalc } from '@/composables/useFormStructure'

interface Props {
  selectedSection: FormSection | null
  selectedField: FormField | null
  addingFieldForSection: string | null
}
interface Emits {
  (e: 'add-field', sectionId: string, field: Omit<FormField, 'id'>): void
  (e: 'update-field', updates: Partial<FormField>): void
  (e: 'update-section', updates: Partial<FormSection>): void
  (e: 'delete-field'): void
  (e: 'cancel-add'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

type FieldType = FormField['type']

const AKUN_TYPE_OPTIONS: { value: AkunType; label: string }[] = [
  { value: 'pendapatan', label: 'Pendapatan' },
  { value: 'beban',      label: 'Beban' },
  { value: 'aset',       label: 'Aset' },
  { value: 'kewajiban',  label: 'Kewajiban' },
  { value: 'ekuitas',    label: 'Ekuitas' },
]

const AKUN_SOURCE_OPTIONS: { value: AkunSource; label: string }[] = [
  { value: 'semua_akun_tipe', label: 'Semua akun bertipe tertentu' },
  { value: 'akun_spesifik',   label: 'Akun spesifik' },
  { value: 'semua_akun',      label: 'Semua akun' },
]

const AKUN_CALC_OPTIONS: { value: AkunCalc; label: string }[] = [
  { value: 'mutasi_bersih',  label: 'Mutasi bersih selama periode' },
  { value: 'saldo_akhir',    label: 'Saldo akhir periode' },
  { value: 'mutasi_debit',   label: 'Mutasi debit' },
  { value: 'mutasi_kredit',  label: 'Mutasi kredit' },
]

const TYPE_OPTIONS: { value: FieldType; label: string; desc: string; icon: string }[] = [
  { value: 'akun',    label: 'Dari akun',             desc: 'Tarik saldo dari CoA',       icon: '◉' },
  { value: 'formula', label: 'Formula',               desc: 'Kalkulasi dari baris lain',  icon: 'ƒ' },
  { value: 'number',  label: 'Referensi laporan lain', desc: 'Ambil dari template lain',  icon: '↗' },
  { value: 'text',    label: 'Teks / pemisah',         desc: 'Label tanpa angka',         icon: 'T' },
]

const fieldForm = ref({
  name: '',
  code: '',
  type: 'akun' as FieldType,
  formula: '',
  description: '',
  akunSource: 'semua_akun_tipe' as AkunSource,
  akunTypes: ['pendapatan'] as AkunType[],
  akunCalc: 'mutasi_bersih' as AkunCalc,
})

const sectionForm = ref({ name: '' })

watch(() => props.selectedField, (field) => {
  if (field) {
    fieldForm.value = {
      name: field.name,
      code: field.code,
      type: field.type,
      formula: field.formula || '',
      description: field.description || '',
      akunSource: field.akunSource || 'semua_akun_tipe',
      akunTypes: field.akunTypes || ['pendapatan'],
      akunCalc: field.akunCalc || 'mutasi_bersih',
    }
  }
}, { immediate: true, deep: true })

watch(() => props.selectedSection, (s) => {
  if (s) sectionForm.value.name = s.name
}, { immediate: true })

watch(() => props.addingFieldForSection, (id) => {
  if (id) {
    fieldForm.value = {
      name: '', code: '', type: 'akun', formula: '', description: '',
      akunSource: 'semua_akun_tipe', akunTypes: ['pendapatan'], akunCalc: 'mutasi_bersih',
    }
  }
})

function handleAddField() {
  if (!props.addingFieldForSection || !fieldForm.value.name || !fieldForm.value.code) return
  emit('add-field', props.addingFieldForSection, { ...fieldForm.value })
}

function handleUpdateField(key: keyof typeof fieldForm.value) {
  emit('update-field', { [key]: fieldForm.value[key] })
}

function handleUpdateSection() {
  emit('update-section', sectionForm.value)
}

function toggleAkunType(type: AkunType) {
  const idx = fieldForm.value.akunTypes.indexOf(type)
  if (idx === -1) {
    fieldForm.value.akunTypes.push(type)
  } else if (fieldForm.value.akunTypes.length > 1) {
    fieldForm.value.akunTypes.splice(idx, 1)
  }
  if (props.selectedField) handleUpdateField('akunTypes')
}

function autoCode() {
  if (!fieldForm.value.code && fieldForm.value.name) {
    fieldForm.value.code = fieldForm.value.name
      .toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '_')
    if (props.selectedField) handleUpdateField('code')
  }
}

function typeIconClass(type: FieldType) {
  return {
    akun:    'bg-emerald-50 text-emerald-700',
    formula: 'bg-violet-50 text-violet-700',
    text:    'bg-blue-50 text-blue-700',
    number:  'bg-orange-50 text-orange-700',
  }[type] ?? 'bg-slate-100 text-slate-600'
}

function typeLabelText(type: FieldType) {
  return { akun: 'BARIS AKUN', formula: 'BARIS FORMULA', text: 'BARIS TEKS', number: 'BARIS ANGKA' }[type]
}

function onNameBlur() {
  if (props.selectedField) handleUpdateField('name')
  else autoCode()
}

function onCodeBlur() {
  if (props.selectedField) handleUpdateField('code')
}

function onTypeClick(val: FieldType) {
  fieldForm.value.type = val
  if (props.selectedField) handleUpdateField('type')
}

function onAkunSourceChange() {
  if (props.selectedField) handleUpdateField('akunSource')
}

function onAkunCalcChange() {
  if (props.selectedField) handleUpdateField('akunCalc')
}

function onFormulaBlur() {
  if (props.selectedField) handleUpdateField('formula')
}
</script>

<template>
  <!-- Empty -->
  <div v-if="!selectedSection && !selectedField && !addingFieldForSection"
    class="flex h-full flex-col items-center justify-center gap-3 text-center p-10">
    <div class="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-500">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </div>
    <p class="text-sm font-semibold text-slate-600">Pilih section atau baris</p>
    <span class="text-xs text-slate-500">Klik item di sebelah kiri untuk mengkonfigurasi</span>
  </div>

  <!-- Section config -->
  <div v-else-if="selectedSection && !selectedField && !addingFieldForSection" class="flex flex-col gap-5">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-slate-200 pb-4">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base font-bold text-slate-600">§</div>
      <div>
        <p class="text-[10px] font-bold tracking-widest text-emerald-600">SECTION</p>
        <h3 class="text-sm font-semibold text-slate-900">{{ selectedSection.name }}</h3>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Nama section</label>
      <input
        v-model="sectionForm.name"
        type="text"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 placeholder:text-slate-500"
        @blur="handleUpdateSection"
        @keyup.enter="handleUpdateSection"
      />
    </div>

    <div class="flex items-start gap-2 rounded-lg border border-blue-300 bg-blue-50 p-3 text-xs text-blue-700">
      <svg class="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
      <span>Klik <strong class="text-blue-800">+ Tambah baris</strong> di dalam section untuk menambah baris baru.</span>
    </div>
  </div>

  <!-- Add field / Edit field — shared form layout -->
  <div v-else-if="addingFieldForSection || selectedField" class="flex flex-col gap-5">
    <!-- Header -->
    <div class="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold"
          :class="selectedField ? typeIconClass(selectedField.type) : 'bg-emerald-50 text-emerald-700'"
        >
          {{ selectedField
            ? TYPE_OPTIONS.find(t => t.value === selectedField?.type)?.icon
            : '+' }}
        </div>
        <div>
          <p class="text-[10px] font-bold tracking-widest text-emerald-600">
            {{ selectedField ? typeLabelText(selectedField.type) : 'TAMBAH BARIS BARU' }}
          </p>
          <h3 class="text-sm font-semibold text-slate-900">
            {{ selectedField ? selectedField.name : 'Konfigurasi baris' }}
          </h3>
        </div>
      </div>
      <button
        v-if="selectedField"
        class="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
        @click="emit('delete-field')"
      >
        Hapus baris
      </button>
    </div>

    <!-- Label -->
    <div class="flex flex-col gap-1.5">
      <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        Label baris
        <span class="font-normal text-slate-500">tampil di laporan</span>
      </label>
      <input
        v-model="fieldForm.name"
        type="text"
        placeholder="contoh: Pendapatan jasa"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[15px] font-medium text-slate-900 outline-none transition-colors focus:border-emerald-500 placeholder:text-slate-500"
        @blur="onNameBlur"
      />
      <p class="text-[11px] text-slate-500">Nama ini akan muncul sebagai judul baris di laporan akhir</p>
    </div>

    <!-- Code -->
    <div class="flex flex-col gap-1.5">
      <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        Kode baris
        <span class="font-normal text-slate-500">untuk referensi formula</span>
      </label>
      <input
        v-model="fieldForm.code"
        type="text"
        placeholder="contoh: pendapatan_jasa"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-emerald-700 outline-none transition-colors focus:border-emerald-500 placeholder:text-slate-500 placeholder:font-sans"
        @blur="onCodeBlur"
      />
      <p class="text-[11px] text-slate-500">Digunakan di formula baris lain, contoh: [total_pendapatan] - [total_beban]</p>
    </div>

    <!-- Type grid -->
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Tipe baris</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="opt in TYPE_OPTIONS"
          :key="opt.value"
          class="flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all"
          :class="fieldForm.type === opt.value
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white'"
          @click="onTypeClick(opt.value)"
        >
          <span class="text-sm" :class="fieldForm.type === opt.value ? 'text-emerald-700' : 'text-slate-600'">{{ opt.icon }}</span>
          <span class="text-[12px] font-semibold" :class="fieldForm.type === opt.value ? 'text-emerald-700' : 'text-slate-700'">{{ opt.label }}</span>
          <span class="text-[10px]" :class="fieldForm.type === opt.value ? 'text-emerald-600' : 'text-slate-500'">{{ opt.desc }}</span>
        </button>
      </div>
    </div>

    <!-- Akun options -->
    <template v-if="fieldForm.type === 'akun'">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600">Cara mengambil akun</label>
        <div class="relative">
          <select
            v-model="fieldForm.akunSource"
            class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
            @change="onAkunSourceChange"
          >
            <option v-for="opt in AKUN_SOURCE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div v-if="fieldForm.akunSource === 'semua_akun_tipe'" class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600">Tipe akun yang diambil</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="opt in AKUN_TYPE_OPTIONS"
            :key="opt.value"
            class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
            :class="fieldForm.akunTypes.includes(opt.value)
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'"
            @click="toggleAkunType(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600">Cara menghitung nilai</label>
        <div class="relative">
          <select
            v-model="fieldForm.akunCalc"
            class="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
            @change="onAkunCalcChange"
          >
            <option v-for="opt in AKUN_CALC_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 4l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </template>

    <!-- Formula -->
    <div v-if="fieldForm.type === 'formula'" class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Formula</label>
      <input
        v-model="fieldForm.formula"
        type="text"
        placeholder="contoh: [total_pendapatan] - [total_beban]"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-violet-700 outline-none transition-colors focus:border-violet-500 placeholder:text-slate-500 placeholder:font-sans"
        @blur="onFormulaBlur"
      />
      <p class="text-[11px] text-slate-500">Gunakan [kode_baris] untuk referensi baris lain</p>
    </div>

    <!-- Action buttons for add mode -->
    <div v-if="addingFieldForSection && !selectedField" class="flex gap-2 pt-1">
      <button
        class="flex-1 rounded-lg border border-slate-300 py-2 text-sm text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900"
        @click="emit('cancel-add')"
      >
        Batal
      </button>
      <button
        class="flex-2 rounded-lg py-2 text-sm font-semibold transition-colors"
        :class="fieldForm.name && fieldForm.code
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'cursor-not-allowed bg-slate-200 text-slate-500'"
        :disabled="!fieldForm.name || !fieldForm.code"
        @click="handleAddField"
      >
        + Tambah baris
      </button>
    </div>
  </div>
</template>
