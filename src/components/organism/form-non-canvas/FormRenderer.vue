<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStorage } from "@/composables/useFormStorage";
import type { FormSection } from "@/composables/useFormStructure";
import type { SavedForm } from "@/composables/useFormStorage";
import type { AcceptableValue } from "reka-ui";
import { computed, ref } from "vue";
const selectedFormId = ref<string | null>(null);
const selectedForm = ref<SavedForm | null>(null);
const selectedFieldValues = ref<Record<string, string>>({});
const selectedFieldCheckboxes = ref<Record<string, boolean[]>>({});

const storage = useFormStorage();
const savedFormList = computed(() => storage.savedForms.value || []);
const selectedSections = computed<FormSection[]>(
  () => selectedForm.value?.formStructure.sections || [],
);

const handleFormSelect = (value: AcceptableValue) => {
  if (typeof value !== "string") return;

  const formId = value;
  const form = storage.getForm(formId);
  if (form) {
    selectedFormId.value = formId;
    selectedForm.value = form;
    selectedFieldValues.value = {};
    selectedFieldCheckboxes.value = {};
  }
};

const handleFieldValueSelect = (fieldId: string, value: AcceptableValue) => {
  if (typeof value !== "string") return;

  selectedFieldValues.value[fieldId] = value;

  const checkboxCount = Number.parseInt(value, 10);
  if (Number.isNaN(checkboxCount) || checkboxCount <= 0) {
    selectedFieldCheckboxes.value[fieldId] = [];
    return;
  }

  const previous = selectedFieldCheckboxes.value[fieldId] || [];
  selectedFieldCheckboxes.value[fieldId] = Array.from(
    { length: checkboxCount },
    (_, index) => previous[index] ?? false,
  );
};

const getCheckboxCount = (fieldId: string) => {
  const value = selectedFieldValues.value[fieldId];
  const count = Number.parseInt(value || "0", 10);
  return Number.isNaN(count) ? 0 : count;
};

const isCheckboxChecked = (fieldId: string, index: number) => {
  return selectedFieldCheckboxes.value[fieldId]?.[index] ?? false;
};

const toggleCheckbox = (fieldId: string, index: number, checked: boolean) => {
  if (!selectedFieldCheckboxes.value[fieldId]) {
    selectedFieldCheckboxes.value[fieldId] = [];
  }

  selectedFieldCheckboxes.value[fieldId][index] = checked;
};

const getCheckedCount = (fieldId: string) => {
  return (selectedFieldCheckboxes.value[fieldId] || []).filter(Boolean).length;
};

const calculateFormula = (formula: string): number | string => {
  if (!formula) return 'N/A';

  // Create mappings from formStructure
  const codeToFieldId: Record<string, string> = {};
  const codeToField: Record<string, any> = {};
  if (selectedForm.value) {
    for (const section of selectedForm.value.formStructure.sections) {
      for (const field of section.fields) {
        codeToFieldId[field.code] = field.id;
        codeToField[field.code] = field;
      }
    }
  }

  // Replace [code] with actual values
  let expression = formula;
  const codeMatches = expression.match(/\[([^\]]+)\]/g) || [];

  for (const match of codeMatches) {
    const code = match.slice(1, -1); // Remove [ and ]
    const field = codeToField[code];
    let value = '0';

    if (field) {
      if (field.type === 'formula') {
        // For formula fields, recursively calculate
        const calculatedValue = calculateFormula(field.formula || '');
        value = String(calculatedValue);
      } else {
        // For other fields, get from selectedFieldValues
        value = selectedFieldValues.value[field.id] || '0';
      }
    }

    const numValue = Number.isNaN(Number(value)) ? '0' : value;
    expression = expression.replace(match, numValue);
  }

  // Evaluate the expression
  try {
    const result = Function('"use strict"; return (' + expression + ')')();
    return Number.isNaN(result) ? 'N/A' : result;
  } catch {
    return 'N/A';
  }
};
</script>
<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Renderer Forms</h2>

    <Select
      :model-value="selectedFormId"
      @update:model-value="handleFormSelect"
    >
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a saved form" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Saved Forms</SelectLabel>
          <SelectItem
            v-for="form in savedFormList"
            :key="form.id"
            :value="form.id"
          >
            {{ form.name }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <div class="mt-6">
      <p class="text-sm text-muted-foreground">
        Select a form to load its schema and data for rendering.
      </p>

      <div class="grid grid-cols-2 gap-4">
          <div v-if="selectedSections.length > 0" class="mt-4 space-y-4">
            <div
              v-for="section in selectedSections.filter((s) =>
                s.fields.some((f) => f.type === 'akun')
              )"
              :key="section.id"
              class="space-y-2"
            >
              <p class="text-sm font-medium">{{ section.name }}</p>

              <div
                v-for="field in section.fields.filter((f) => f.type === 'akun')"
                :key="field.id"
                class="space-y-2 p-3"
              >
                <div class="grid grid-cols-3 items-center gap-3">
                  <p class="text-sm text-muted-foreground ml-4">
                    {{ field.name }}
                  </p>

                  <p class="text-xs">
                    {{ field.akunSource }}
                  </p>
                  <Select
                    :model-value="selectedFieldValues[field.id]"
                    @update:model-value="
                      (value) => handleFieldValueSelect(field.id, value)
                    "
                  >
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Value</SelectLabel>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div
                  v-if="getCheckboxCount(field.id) > 0"
                  class="ml-4 flex flex-wrap gap-3"
                >
                  <label
                    v-for="index in getCheckboxCount(field.id)"
                    :key="`${field.id}-checkbox-${index}`"
                    class="inline-flex items-center gap-2 px-2 py-1 text-xs"
                  >
                    <input
                      type="checkbox"
                      :checked="isCheckboxChecked(field.id, index - 1)"
                      @change="toggleCheckbox(field.id, index - 1, ($event.target as HTMLInputElement).checked)"
                    />
                    <span>Item {{ index }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="mt-4 text-sm text-muted-foreground">
            No sections or fields available in this form.
          </div>
          <div>
            <p>Preview</p>
            <div class="mt-2 rounded bg-muted p-2 text-sm">
                <div v-for="section in selectedSections" :key="section.id">
                  <p class="font-semibold">{{ section.name }}</p>
                  <div
                    class="ml-4"
                    v-for="field in section.fields"
                    :key="field.id"
                  >
                    <p v-if="field.type !== 'formula'">
                      {{ field.name }}: {{ selectedFieldValues[field.id] || 'N/A' }}
                    </p>
                    <p v-else class="font-semibold text-emerald-700">
                      {{ field.name }}: {{ calculateFormula(field.formula || '') }}
                    </p>
                  </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
