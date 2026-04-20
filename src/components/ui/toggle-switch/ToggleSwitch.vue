<script setup lang="ts">
interface Props {
  modelValue: boolean
  disabled?: boolean
  label?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="flex items-center gap-3">
    <button
      type="button"
      :disabled="disabled"
      class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
      :class="[
        modelValue
          ? 'bg-emerald-500'
          : 'bg-slate-300',
        disabled ? 'cursor-not-allowed opacity-50' : '',
      ]"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>
    <label
      v-if="label"
      class="text-sm font-medium text-slate-700 cursor-pointer"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      {{ label }}
    </label>
  </div>
</template>
