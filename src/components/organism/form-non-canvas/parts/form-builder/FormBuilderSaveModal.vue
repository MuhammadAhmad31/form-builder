<script setup lang="ts">
interface Props {
  modelValue: boolean
  name: string
  description: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:description': [value: string]
  save: []
  close: []
}>()
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 class="text-lg font-bold text-slate-900">Simpan Form</h2>

      <div class="mt-4 space-y-3">
        <div>
          <label class="block text-sm font-medium text-slate-700">Nama Form</label>
          <input
            :value="name"
            type="text"
            placeholder="Nama form..."
            class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-emerald-500"
            @input="emit('update:name', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Deskripsi (opsional)</label>
          <textarea
            :value="description"
            placeholder="Deskripsi form..."
            rows="3"
            class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-emerald-500"
            @input="emit('update:description', ($event.target as HTMLTextAreaElement).value)"
          />
        </div>
      </div>

      <div class="mt-6 flex gap-2">
        <button class="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100" @click="emit('close')">
          Batal
        </button>
        <button class="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700" @click="emit('save')">
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>
