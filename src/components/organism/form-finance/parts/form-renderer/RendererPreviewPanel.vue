<script setup lang="ts">
import type { Report } from "@/components/molecules/NReportTable";
import NReportTable from "@/components/molecules/NReportTable";
import type { FormPreviewRowType, FormSection } from "@/composables/useFormStructure";
import { computed } from "vue";

interface Props {
  selectedSections: FormSection[];
  selectedFieldValues: Record<string, string>;
  calculateFormula: (formula: string) => number | string;
}

type PreviewRowType = Report["items"][number]["type"];

const props = defineProps<Props>();

const toAmountString = (value: number | string): string => {
  const normalized = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (Number.isFinite(normalized)) return String(normalized);
  return "0";
};

const buildFieldValue = (fieldId: string, fieldType: string, formula?: string) => {
  if (fieldType === "formula") {
    return props.calculateFormula(formula || "");
  }

  return props.selectedFieldValues[fieldId] || "";
};

const inferRowType = (
  fieldType: string,
  previewRowType?: FormPreviewRowType,
): PreviewRowType => {
  if (previewRowType) {
    return previewRowType;
  }

  if (fieldType === "formula") {
    return "subsection";
  }

  return "item";
};

const orderFieldsForPreview = (section: FormSection) => {
  const regularFields = section.fields.filter((field) => field.type !== "formula");
  const formulaFields = section.fields.filter((field) => field.type === "formula");
  return [...regularFields, ...formulaFields];
};

const reportTableData = computed<Report>(() => {
  let rowNumber = 1;
  const items: Report["items"] = [];

  props.selectedSections.forEach((section) => {
    items.push({
      rowNumber,
      rowText: section.name,
      columnNumber: 1,
      columnText: null,
      type: "section",
      amount: "",
      notation: null,
      categoryId: section.id,
      categoryName: section.name,
    });
    rowNumber += 1;

    orderFieldsForPreview(section).forEach((field) => {
      const rawValue = buildFieldValue(field.id, field.type, field.formula);
      const amount = toAmountString(rawValue);
      const numericValue = Number(amount);
      const rowType = inferRowType(field.type, field.previewRowType);

      items.push({
        rowNumber,
        rowText: field.name,
        columnNumber: 1,
        columnText: "Nilai",
        type: rowType,
        amount,
        notation: Number.isFinite(numericValue) && numericValue < 0 ? "negative" : "positive",
        categoryId: section.id,
        categoryName: section.name,
      });
      rowNumber += 1;
    });
  });

  return {
    meta: {
      title: "Accounting Preview",
      subtitle: "Generated from selected sections",
      columnCount: items.length ? 1 : 0,
      rowCount: items.length,
    },
    items,
  };
});
</script>

<template>
  <div>
    <p>Preview</p>
    <!-- <div class="mt-2 rounded bg-muted p-2 text-sm">
      <div v-for="section in selectedSections" :key="section.id">
        <p class="font-semibold">{{ section.name }}</p>
        <div v-for="field in section.fields" :key="field.id" class="ml-4 p-2">
          <p v-if="field.type !== 'formula'">
            {{ field.name }}: {{ selectedFieldValues[field.id] || '' }}
          </p>
          <p v-else class="font-semibold text-emerald-700">
            {{ field.name }}: {{ calculateFormula(field.formula || '') }}
          </p>
        </div>
      </div>
    </div> -->

    <NReportTable
      type="profit-loss"
      :report="reportTableData"
      class="w-full"
      background="gray"
    />
  </div>
</template>
