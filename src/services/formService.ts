import type {
  FieldType,
  LabelPlacement,
  OptionLayout,
  SelectionMode,
  SectionDirection,
} from "@/components/organism/form-builder/types";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FormField {
  id: string;
  sectionId?: string;
  type: FieldType;
  label: string;
  labelPlacement: LabelPlacement;
  name: string;
  placeholder: string;
  value?: string | string[];
  helpText: string;
  required: boolean;
  readOnly: boolean;
  clearable: boolean;
  selectionMode: SelectionMode;
  optionLayout: OptionLayout;
  spacing: FieldSpacing;
  options?: FieldOption[];
  // Layout info (grid position)
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FormSection {
  id: string;
  title: string;
  showTitle?: boolean;
  fields: FormField[];
}

export interface FormSchema {
  fields: FormField[];
  sections?: FormSection[];
  sectionDirection?: SectionDirection;
}

// API Service
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const formService = {
  /**
   * Submit form schema to backend
   */
  async submitFormSchema(
    schema: FormSchema,
  ): Promise<{ id: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schema),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit form schema: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get form schema by ID
   */
  async getFormSchema(formId: string): Promise<FormSchema> {
    const response = await fetch(`${API_BASE_URL}/forms/${formId}`);

    if (!response.ok) {
      throw new Error(`Failed to get form schema: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Submit form submission (filled data)
   */
  async submitFormData(
    formId: string,
    data: Record<string, any>,
  ): Promise<{ id: string; message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/forms/${formId}/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to submit form data: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Export schema as JSON (for local use)
   */
  exportSchemaAsJSON(schema: FormSchema): string {
    return JSON.stringify(schema, null, 2);
  },
};
