<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type {
  FormField,
  FormPreviewRowType,
  FormSection,
  SpacerType,
} from "@/composables/useFormStructure";
import {
  typeIconClass,
  typeLabelText,
  type FormulaToken,
} from "../../utils/configPanel";
import { useFormValidation } from "../../composables/useFormValidation";
import GeneralFieldConfig from "./tabs/GeneralFieldConfig.vue";
import DataSourceFieldConfig from "./tabs/DataSourceFieldConfig.vue";
import DisplayFieldConfig from "./tabs/DisplayFieldConfig.vue";
import { createFieldValidationRules } from "./validateFormConfig";

interface Props {
  selectedField: FormField | null;
  isAddingField: boolean;
  fieldForm: {
    name: string;
    code: string;
    type: FormField["type"] | "";
    formula: string;
    description: string;
    previewRowType?: FormPreviewRowType;
    spacerType?: SpacerType;
    akunMode?: FormField["akunMode"];
    akunStrategy?: FormField["akunStrategy"];
    depthMode?: FormField["depthMode"];
    coaCategory?: FormField["coaCategory"];
    categoryStrategy?: FormField["categoryStrategy"];
    reportTypeSource?: FormField["reportTypeSource"];
    rowTypeFromSelectedReportTypeSource?: FormField["rowTypeFromSelectedReportTypeSource"];
    firstLevel?: FormField["firstLevel"];
  };
  formulaTokens: FormulaToken[];
  availableFieldsForFormula: Array<FormSection & { fields: FormField[] }>;
  getTokenSign: (fieldId: string) => "pos" | "neg" | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update-name": [name: string];
  "update-description": [description: string];
  "select-type": [type: FormField["type"]];
  "update-preview-row-type": [rowType?: FormPreviewRowType];
  "update-spacer-type": [spacerType?: SpacerType];
  "update-mode": [mode: string];
  "update-strategy": [strategy: string];
  "update-depth-mode": [mode: string];
  "update-coa-category": [category: string];
  "update-category-strategy": [strategy: string];
  "toggle-token": [field: FormField, sign: "pos" | "neg"];
  "remove-token": [fieldId: string];
  "clear-tokens": [];
  "add-field": [];
  "save-field": [];
  "delete-field": [];
  "cancel-add": [];
  "update-report-type-source": [reportType: FormField["reportTypeSource"]];
  "update-row-type-from-selected-report-type-source": [rowType: FormField["rowTypeFromSelectedReportTypeSource"]];
  "update-first-level": [type: FormField["firstLevel"]];
}>();

const activeTab = ref<"general" | "source" | "display">("general");

const getSelectedFieldIcon = (field: FormField | null) => {
  if (!field) return "+";
  const icons: Record<string, string> = {
    normal: "N",
    account: "A",
    formula: "Σ",
    category: "☰",
    reference: "R",
  };
  return icons[field.type] || "+";
};

const selectedFieldIcon = computed(() => {
  return getSelectedFieldIcon(props.selectedField);
});

const tabItems = [
  { id: "general", label: "General" },
  { id: "source", label: "Sumber Data" },
  { id: "display", label: "Tampilan" },
];

const { validateField, getFieldError, isFormValid } =
  useFormValidation<FieldValidationForm>(
    createFieldValidationRules(props.fieldForm)
  );
  
interface FieldValidationForm {
  name: string;
  code: string;
  type: string;
  akunMode?: string;
  akunStrategy?: string;
  depthMode?: string;
  coaCategory?: string;
  categoryStrategy?: string;
  firstLevel?: string;
  reportTypeSource?: string;
  rowTypeFromSelectedReportTypeSource?: string;
}

watch(
  () => props.fieldForm,
  async (newForm) => {
    await validateField("name", newForm.name);
    await validateField("code", newForm.code);
    await validateField("type", newForm.type);
    await validateField("akunMode", newForm.akunMode || "");
    await validateField("akunStrategy", newForm.akunStrategy || "");
    await validateField("depthMode", newForm.depthMode || "");
    await validateField("coaCategory", newForm.coaCategory || "");
    await validateField("categoryStrategy", newForm.categoryStrategy || "");
    await validateField("firstLevel", newForm.firstLevel || "");
    await validateField("reportTypeSource", newForm.reportTypeSource || "");
    await validateField("rowTypeFromSelectedReportTypeSource", newForm.rowTypeFromSelectedReportTypeSource || "");
  },
  { deep: true },
);
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Header -->
    <div
      class="flex items-start justify-between gap-3 border-b border-slate-200 pb-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold"
          :class="
            selectedField
              ? typeIconClass(selectedField.type)
              : 'bg-emerald-50 text-emerald-700'
          "
        >
          {{ selectedFieldIcon }}
        </div>
        <div>
          <p class="text-[10px] font-bold tracking-widest text-emerald-600">
            {{
              selectedField
                ? typeLabelText(selectedField.type)
                : "TAMBAH BARIS BARU"
            }}
          </p>
          <h3 class="text-sm font-semibold text-slate-900">
            {{ selectedField ? selectedField.name : "Konfigurasi baris" }}
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

    <!-- Tabs Navigation -->
    <div class="flex gap-2 border-b border-slate-200">
      <button
        v-for="tab in tabItems"
        :key="tab.id"
        :class="[
          'px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-0.5',
          activeTab === tab.id
            ? 'border-emerald-500 text-emerald-600'
            : 'border-transparent text-slate-600 hover:text-slate-900',
        ]"
        @click="activeTab = tab.id as any"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="min-h-96">
      <!-- Tab: General -->
      <div v-show="activeTab === 'general'">
        <GeneralFieldConfig
          :field-form="fieldForm"
          @update-name="emit('update-name', $event)"
          @update-description="emit('update-description', $event)"
        />
      </div>

      <!-- Tab: Data Source -->
      <div v-show="activeTab === 'source'">
        <DataSourceFieldConfig
          :field-form="fieldForm"
          :formula-tokens="formulaTokens"
          :available-fields-for-formula="availableFieldsForFormula"
          :get-token-sign="getTokenSign"
          @select-type="emit('select-type', $event)"
          @update-mode="emit('update-mode', $event)"
          @update-strategy="emit('update-strategy', $event)"
          @toggle-token="(field, sign) => emit('toggle-token', field, sign)"
          @remove-token="emit('remove-token', $event)"
          @clear-tokens="emit('clear-tokens')"
          @update-report-type-source="emit('update-report-type-source', $event)"
          @update-row-type-from-selected-report-type-source="emit('update-row-type-from-selected-report-type-source', $event)"
          @update-first-level="emit('update-first-level', $event)"
        />
      </div>

      <!-- Tab: Display -->
      <div v-show="activeTab === 'display'">
        <DisplayFieldConfig
          :field-form="fieldForm"
          @update-preview-row-type="emit('update-preview-row-type', $event)"
          @update-spacer-type="emit('update-spacer-type', $event)"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="isAddingField && !selectedField" class="flex flex-col gap-3">
      <div
        v-if="!isFormValid"
        class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3"
      >
        <svg
          class="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="text-xs">
          <p class="font-medium text-amber-900">Form belum lengkap</p>
          <ul class="mt-2 space-y-1 text-amber-800">
            <li v-if="getFieldError('name')" class="flex items-center gap-1">
              <span class="text-lg">•</span>
              {{ getFieldError("name") }}
            </li>
            <li v-if="getFieldError('code')" class="flex items-center gap-1">
              <span class="text-lg">•</span>
              {{ getFieldError("code") }}
            </li>
            <li v-if="getFieldError('type')" class="flex items-center gap-1">
              <span class="text-lg">•</span>
              {{ getFieldError("type") }}
            </li>
          </ul>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          class="flex-1 rounded-lg border border-slate-300 py-2 text-sm text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900"
          @click="emit('cancel-add')"
        >
          Batal
        </button>
        <button
          class="flex-1 rounded-lg py-2 text-sm font-semibold transition-colors"
          :class="
            isFormValid
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'cursor-not-allowed bg-slate-200 text-slate-500'
          "
          :disabled="!isFormValid"
          :title="
            !isFormValid
              ? 'Lengkapi semua field yang diperlukan'
              : 'Tambah baris baru'
          "
          @click="emit('add-field')"
        >
          + Tambah baris
        </button>
      </div>
    </div>

    <div v-else-if="selectedField" class="flex gap-2 pt-1">
      <button
        class="flex-1 rounded-lg border border-emerald-300 bg-emerald-50 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
        @click="emit('save-field')"
      >
        Simpan perubahan
      </button>
    </div>
  </div>
</template>
