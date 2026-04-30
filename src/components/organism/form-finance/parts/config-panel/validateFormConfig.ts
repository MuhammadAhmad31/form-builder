import type { FormField } from "@/composables/useFormStructure";

type FieldForm = { type: FormField["type"] | "" };

export const createFieldValidationRules = (fieldForm: FieldForm) => ({
  name: {
    label: "Label Baris",
    rules: [
      { type: "required" as const, message: "Label baris harus diisi" },
      { type: "minLength" as const, value: 1 },
    ],
  },
  code: {
    label: "Kode Baris",
    rules: [
      { type: "required" as const, message: "Kode baris harus diisi" },
      { type: "minLength" as const, value: 1 },
    ],
  },
  type: {
    label: "Tipe Sumber Data",
    rules: [
      {
        type: "required" as const,
        message: 'Pilih tipe sumber data di tab "Sumber Data"',
      },
    ],
  },
  akunMode: {
    label: "Mode Akun",
    rules: [
      {
        type: "custom" as const,
        validate: (value: string) => {
          if (fieldForm.type === "account" && !value) return "Mode akun harus dipilih";
          return true;
        },
      },
    ],
  },
  akunStrategy: {
    label: "Data Strategy",
    rules: [
      {
        type: "custom" as const,
        validate: (value: string) => {
          if (fieldForm.type === "account" && !value) return "Data strategy harus dipilih";
          return true;
        },
      },
    ],
  },
  depthMode: {
    label: "Depth Mode",
    rules: [
      {
        type: "custom" as const,
        validate: (value: string) => {
          if (fieldForm.type === "category_account" && !value) return "Depth mode harus dipilih";
          return true;
        },
      },
    ],
  },
  coaCategory: {
    label: "COA Category",
    rules: [
      {
        type: "custom" as const,
        validate: (value: string) => {
          if (fieldForm.type === "category_account" && !value) return "COA category harus dipilih";
          return true;
        },
      },
    ],
  },
  categoryStrategy: {
    label: "Category Strategy",
    rules: [
      {
        type: "custom" as const,
        validate: (value: string) => {
          if (fieldForm.type === "category_account" && !value) return "Category strategy harus dipilih";
          return true;
        },
      },
    ],
  },
  firstLevel: {
    label: "First Level Akun",
    rules: [
      {
        type: "custom" as const,
        validate: (value: string) => {
          if (fieldForm.type === "account" && !value) return "First level akun harus dipilih";
          return true;
        },
      },
    ],
  },
  reportTypeSource: {
    label: "Report Type Source",
    rules: [
      {
        type: "custom" as const,
        validate: (value: string) => {
          if (fieldForm.type === "reference" && !value) return "Report type source harus dipilih";
          return true;
        },
      },
    ],
  },
  rowTypeFromSelectedReportTypeSource: {
    label: "Row Type from Selected Report Type Source",
    rules: [
      {
        type: "custom" as const,
        validate: (value: string) => {
          if (fieldForm.type === "reference" && !value) return "Row type from selected report type source harus dipilih";
          return true;
        },
      },
    ],
  },
});