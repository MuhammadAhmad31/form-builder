<script setup lang="ts">

interface Props {
  fieldForm: {
    name: string
    code: string
    description: string
  }
}

defineProps<Props>()

const emit = defineEmits<{
  'update-name': [name: string]
  'update-description': [description: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        Label baris
        <span class="font-normal text-slate-500">tampil di laporan</span>
      </label>
      <input
        :value="fieldForm.name"
        type="text"
        placeholder="contoh: Pendapatan jasa"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[15px] font-medium text-slate-900 outline-none transition-colors focus:border-emerald-500 placeholder:text-slate-500"
        @input="emit('update-name', ($event.target as HTMLInputElement).value)"
      />
      <p class="text-[11px] text-slate-500">Nama ini akan muncul sebagai judul baris di laporan akhir</p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        Kode baris
        <span class="font-normal text-slate-500">auto dari label</span>
      </label>
      <input
        :value="fieldForm.code"
        type="text"
        readonly
        class="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-xs text-slate-500 outline-none"
      />
      <p class="text-[11px] text-slate-500">
        Kode otomatis dibuat dari label baris. Digunakan di formula baris lain, contoh: [total_pendapatan] - [total_beban]
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-slate-600">Deskripsi (opsional)</label>
      <textarea
        :value="fieldForm.description"
        placeholder="Penjelasan untuk field ini..."
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 placeholder:text-slate-500"
        rows="3"
        @input="emit('update-description', ($event.target as HTMLTextAreaElement).value)"
      />
      <p class="text-[11px] text-slate-500">Catatan pribadi, tidak akan ditampilkan di laporan</p>
    </div>
  </div>
</template>
