import { ref, reactive, computed } from "vue";
import type { FormSchema, FormField } from "@/services/formService";
import { formService } from "@/services/formService";
import type { Layout } from "grid-layout-plus";

export interface FormRendererProps {
  schema: FormSchema;
  formId?: string;
  onSubmit?: (data: Record<string, any>) => void;
}

export const useFormRenderer = (props: FormRendererProps) => {
  const GRID_COLUMNS = 12;
  const GRID_ROW_HEIGHT = 18;
  const GRID_MARGIN: [number, number] = [12, 12];
  const MIN_WIDTH = 3;
  const MIN_HEIGHT = 2;

  const formData = reactive<Record<string, any>>({});
  const errors = reactive<Record<string, string>>({});
  const isSubmitting = ref(false);

  // Initialize form data and layout
  props.schema.fields.forEach((field) => {
    formData[field.name] = field.value ?? (field.type === "checkbox" && field.selectionMode === "multiple" ? [] : "");
  });

  // Build grid layout from schema
  const canvasLayoutItems = computed(() => {
    return props.schema.fields.map(
      (field) =>
        ({
          i: field.id,
          x: field.x,
          y: field.y,
          w: field.w,
          h: field.h,
          minW: MIN_WIDTH,
          minH: field.type === "textarea" ? 6 : MIN_HEIGHT,
        }) as Layout[number],
    );
  });

  function getFieldById(fieldId: string): FormField | null {
    return props.schema.fields.find((field) => field.id === fieldId) ?? null;
  }

  function validateForm(): boolean {
    Object.keys(errors).forEach((key) => delete errors[key]);

    let isValid = true;
    props.schema.fields.forEach((field) => {
      const value = formData[field.name];
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      if (field.required && (isEmptyArray || !value)) {
        errors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    return isValid;
  }

  function fieldContentClass(field: FormField) {
    if (field.labelPlacement === "left" || field.labelPlacement === "right") {
      return "flex-row items-start gap-3";
    }
    return "flex-col";
  }

  function labelClass(field: FormField) {
    if (field.labelPlacement === "left" || field.labelPlacement === "right") {
      return "w-32 shrink-0 pt-2";
    }
    return "";
  }

  function inputWrapperClass(field: FormField) {
    if (field.labelPlacement === "left" || field.labelPlacement === "right") {
      return "min-w-0 flex-1";
    }
    return "min-w-0";
  }

  function canvasFieldStyle(field: FormField) {
    return {
      paddingTop: `${field.spacing.top}px`,
      paddingRight: `${field.spacing.right}px`,
      paddingBottom: `${field.spacing.bottom}px`,
      paddingLeft: `${field.spacing.left}px`,
    };
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    isSubmitting.value = true;
    try {
      if (props.onSubmit) {
        props.onSubmit(formData);
      } else if (props.formId) {
        const result = await formService.submitFormData(props.formId, formData);
        console.log("Form data submitted successfully:", result);
        alert("Form submitted successfully!");
        Object.keys(formData).forEach((key) => {
          const field = props.schema.fields.find((f) => f.name === key);
          formData[key] = field?.value ?? (field?.type === "checkbox" && field.selectionMode === "multiple" ? [] : "");
        });
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form. Check console for details.");
    } finally {
      isSubmitting.value = false;
    }
  }

  function resetForm() {
    Object.keys(formData).forEach((key) => {
      const field = props.schema.fields.find((f) => f.name === key);
      formData[key] = field?.value ?? (field?.type === "checkbox" && field.selectionMode === "multiple" ? [] : "");
    });
    Object.keys(errors).forEach((key) => delete errors[key]);
  }

  return {
    GRID_COLUMNS,
    GRID_ROW_HEIGHT,
    GRID_MARGIN,
    MIN_HEIGHT,
    MIN_WIDTH,
    canvasLayoutItems,
    canvasFieldStyle,
    getFieldById,
    labelClass,
    handleSubmit,
    fieldContentClass,
    inputWrapperClass,
    resetForm,
    errors,
    isSubmitting,
    formData
  };
};
