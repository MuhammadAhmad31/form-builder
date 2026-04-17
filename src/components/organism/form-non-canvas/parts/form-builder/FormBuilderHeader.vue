<script setup lang="ts">
interface Props {
  totalFields: number
}

defineProps<Props>()

const emit = defineEmits<{
  save: []
  load: []
  schema: []
  new: []
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border-b border-slate-200 px-4 py-3.5">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-bold tracking-tight text-slate-900">Struktur laporan</h2>
      <span class="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
        {{ totalFields }} baris
      </span>
    </div>
    <div class="flex gap-1.5">
      <button class="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100" @click="emit('save')">
        Simpan
      </button>
      <button class="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100" @click="emit('load')">
        Buka
      </button>
      <button class="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100" @click="emit('schema')">
        Schema
      </button>
      <button class="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100" @click="emit('new')">
        Baru
      </button>
    </div>
  </div>
</template>
