import { ref, reactive, computed } from "vue";
import type { FormSchema, FormField } from "@/services/formService";
import { formService } from "@/services/formService";
import type { Layout } from "grid-layout-plus";
import type { SectionDirection } from "@/components/organism/form-v2/form-builder/types";

export interface FormRendererProps {
  schema: FormSchema;
  formId?: string;
  onSubmit?: (data: Record<string, any>) => void;
}

interface RenderSection {
  id: string;
  title: string;
  showTitle?: boolean;
  fields: FormField[];
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

  const schemaSections = computed<RenderSection[]>(() => {
    if (props.schema.sections && props.schema.sections.length > 0) {
      return props.schema.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) => ({
          ...field,
          sectionId: field.sectionId ?? section.id,
        })),
      }));
    }

    return [
      {
        id: "section-1",
        title: "Section 1",
        showTitle: false,
        fields: props.schema.fields.map((field) => ({
          ...field,
          sectionId: field.sectionId ?? "section-1",
        })),
      },
    ];
  });

  const allFields = computed(() => {
    return schemaSections.value.flatMap((section) => section.fields);
  });

  const sectionDirection = computed<SectionDirection>(() => {
    return props.schema.sectionDirection ?? "column";
  });

  // Initialize form data and layout
  allFields.value.forEach((field) => {
    formData[field.name] = field.value ?? (field.type === "checkbox" && field.selectionMode === "multiple" ? [] : "");
  });

  function sectionLayoutItems(sectionId: string): Layout {
    const section = schemaSections.value.find((item) => item.id === sectionId);
    if (!section) {
      return [];
    }

    return section.fields.map(
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
  }

  function getFieldById(fieldId: string): FormField | null {
    return allFields.value.find((field) => field.id === fieldId) ?? null;
  }

  function validateForm(): boolean {
    Object.keys(errors).forEach((key) => delete errors[key]);

    let isValid = true;
    allFields.value.forEach((field) => {
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
          const field = allFields.value.find((f) => f.name === key);
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
      const field = allFields.value.find((f) => f.name === key);
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
    schemaSections,
    sectionDirection,
    sectionLayoutItems,
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
