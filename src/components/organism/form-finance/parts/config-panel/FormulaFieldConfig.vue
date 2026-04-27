<script setup lang="ts">
import type { FormField, FormSection } from "@/composables/useFormStructure";
import { fieldTypeDot, type FormulaToken } from "../../utils/configPanel";

interface Props {
    fieldForm: {
        formula: string;
    };
    formulaTokens: FormulaToken[];
    availableFieldsForFormula: Array<FormSection & { fields: FormField[] }>;
    getTokenSign: (fieldId: string) => "pos" | "neg" | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    "toggle-token": [field: FormField, sign: "pos" | "neg"];
    "remove-token": [fieldId: string];
    "clear-tokens": [];
}>();
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-slate-600">Formula</label>
            <button
                v-if="formulaTokens.length > 0"
                class="text-[11px] text-slate-500 transition-colors hover:text-red-600"
                @click="emit('clear-tokens')"
            >
                Hapus semua
            </button>
        </div>

        <div
            class="min-h-10.5 flex w-full flex-wrap items-center gap-1.5 rounded-lg border bg-slate-50 px-3 py-2"
            :class="
                formulaTokens.length ? 'border-violet-200' : 'border-slate-200'
            "
        >
            <template v-if="formulaTokens.length === 0">
                <span class="text-xs text-slate-400"
                    >Pilih baris di bawah untuk membangun formula...</span
                >
            </template>
            <template v-else>
                <template
                    v-for="(token, index) in formulaTokens"
                    :key="token.fieldId"
                >
                    <span
                        v-if="index > 0"
                        class="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-600"
                    >
                        {{ token.sign === "pos" ? "+" : "−" }}
                    </span>
                    <span
                        class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
                        :class="
                            token.sign === 'pos'
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                : 'border-red-300 bg-red-50 text-red-700'
                        "
                    >
                        [{{ token.code }}]
                        <button
                            class="leading-none opacity-50 transition-opacity hover:opacity-100"
                            @click="emit('remove-token', token.fieldId)"
                        >
                            <svg
                                width="8"
                                height="8"
                                viewBox="0 0 10 10"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                            >
                                <path
                                    d="M2 2l6 6M8 2l-6 6"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
                    </span>
                </template>
            </template>
        </div>

        <p
            v-if="formulaTokens.length > 0"
            class="break-all font-mono text-[11px] text-slate-400"
        >
            {{ fieldForm.formula }}
        </p>
    </div>

    <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-slate-600">Pilih baris</label>

        <div
            v-if="availableFieldsForFormula.length === 0"
            class="rounded-lg border border-dashed border-slate-300 py-6 text-center text-xs text-slate-500"
        >
            Belum ada baris lain yang bisa dipilih
        </div>

        <div
            v-else
            class="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2"
        >
            <div v-for="section in availableFieldsForFormula" :key="section.id">
                <div class="mb-1 flex items-center gap-1.5 px-1">
                    <svg
                        width="9"
                        height="9"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        class="text-slate-400"
                    >
                        <rect x="1" y="1" width="10" height="10" rx="1.5" />
                    </svg>
                    <span
                        class="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500"
                        >{{ section.name }}</span
                    >
                </div>

                <div class="flex flex-col gap-0.5">
                    <div
                        v-for="field in section.fields"
                        :key="field.id"
                        class="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
                        :class="{
                            'bg-emerald-50': getTokenSign(field.id) === 'pos',
                            'bg-red-50': getTokenSign(field.id) === 'neg',
                            'hover:bg-white': !getTokenSign(field.id),
                        }"
                    >
                        <span
                            class="h-1.5 w-1.5 shrink-0 rounded-full"
                            :class="fieldTypeDot(field.type)"
                        />
                        <span
                            class="flex-1 truncate text-[12px]"
                            :class="{
                                'font-medium text-emerald-700':
                                    getTokenSign(field.id) === 'pos',
                                'font-medium text-red-700':
                                    getTokenSign(field.id) === 'neg',
                                'text-slate-700': !getTokenSign(field.id),
                            }"
                        >
                            {{ field.name }}
                        </span>
                        <span
                            class="shrink-0 font-mono text-[10px] text-slate-400"
                            >{{ field.code }}</span
                        >

                        <div
                            v-if="getTokenSign(field.id) === null"
                            class="flex shrink-0 overflow-hidden rounded-md border border-slate-300 text-[11px] font-semibold"
                        >
                            <button
                                class="border-r border-slate-300 bg-white px-2.5 py-1 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                @click="emit('toggle-token', field, 'pos')"
                            >
                                +
                            </button>
                            <button
                                class="bg-white px-2.5 py-1 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                @click="emit('toggle-token', field, 'neg')"
                            >
                                −
                            </button>
                        </div>

                        <div
                            v-else
                            class="flex shrink-0 overflow-hidden rounded-md border border-slate-200 text-[11px] font-semibold"
                        >
                            <button
                                disabled
                                class="px-2.5 py-1 transition-colors cursor-not-allowed"
                                :class="
                                    getTokenSign(field.id) === 'pos'
                                        ? 'border-r border-emerald-100 bg-emerald-100 text-emerald-400'
                                        : 'border-r border-slate-100 bg-slate-100 text-slate-300'
                                "
                            >
                                +
                            </button>
                            <button
                                disabled
                                class="px-2.5 py-1 transition-colors cursor-not-allowed"
                                :class="
                                    getTokenSign(field.id) === 'neg'
                                        ? 'bg-red-100 text-red-400'
                                        : 'bg-slate-100 text-slate-300'
                                "
                            >
                                −
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
