<script setup lang="ts">
interface Props {
  modelValue: string
  visible: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  add: []
  cancel: []
  show: []
}>()
</script>

<template>
  <div class="border-t border-slate-200 p-3">
    <div v-if="visible" class="flex flex-col gap-2">
      <input
        :value="modelValue"
        type="text"
        placeholder="Nama section..."
        autofocus
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-500"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keyup.enter="emit('add')"
        @keyup.esc="emit('cancel')"
      />
      <div class="flex gap-2">
        <button class="flex-1 rounded-lg border border-slate-300 py-1.5 text-xs text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900" @click="emit('cancel')">
          Batal
        </button>
        <button class="flex-2 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700" @click="emit('add')">
          Tambah
        </button>
      </div>
    </div>

    <button
      v-else
      class="flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
      @click="emit('show')"
    >
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M6 2v8M2 6h8" stroke-linecap="round" />
      </svg>
      Tambah section
    </button>
  </div>
</template>
