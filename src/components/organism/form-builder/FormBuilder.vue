<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import type { DateValue } from "reka-ui";
import { GridItem, GridLayout } from "grid-layout-plus";
import { CalendarIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultDatePlaceholder,
  formatStoredDate,
  parseStoredDate,
  toStoredDate,
} from "@/lib/date-field";
import { cn } from "@/lib/utils";
import type { FormSchema } from "@/services/formService";
import FormBuilderLeftPanel from "./FormBuilderLeftPanel.vue";
import FormBuilderRightPanel from "./FormBuilderRightPanel.vue";
import type { BuilderField, FieldType, LabelPlacement } from "./types";
import {
  useFormField,
  useGridLayout,
  useFormSchema,
  useFormFieldHelpers,
  GRID_COLUMNS,
  GRID_ROW_HEIGHT,
  GRID_MARGIN,
} from "./composables";

interface Props {
  onSubmit?: (schema: FormSchema) => void | Promise<void>;
}

const props = defineProps<Props>();

const fieldCatalog: Array<{
  type: FieldType;
  title: string;
  description: string;
}> = [
  {
    type: "text",
    title: "Text Input",
    description: "Single line input untuk nama, email, atau kode.",
  },
  {
    type: "textarea",
    title: "Textarea",
    description: "Area input multi baris untuk deskripsi panjang.",
  },
  {
    type: "number",
    title: "Number",
    description: "Input numerik untuk qty, umur, atau harga.",
  },
  {
    type: "select",
    title: "Select",
    description: "Dropdown dengan opsi yang bisa diatur di inspector.",
  },
  {
    type: "checkbox",
    title: "Checkbox",
    description: "Kotak centang untuk pilihan boolean.",
  },
  {
    type: "radio",
    title: "Radio Group",
    description: "Sekelompok opsi dengan pilihan tunggal.",
  },
  {
    type: "date",
    title: "Date",
    description: "Input tanggal untuk memilih tanggal.",
  },
];

const labelPlacementItems: Array<{ label: string; value: LabelPlacement }> = [
  { label: "Atas", value: "top" },
  { label: "Bawah", value: "bottom" },
  { label: "Kiri", value: "left" },
  { label: "Kanan", value: "right" },
];

const initialFields: BuilderField[] = [];

const {
  fields,
  selectedFieldId,
  selectedField,
  addField,
  selectField,
  removeSelectedField,
  updateField,
  updateSpacing,
  updateGridValue,
  addOption,
  updateOption,
  removeOption,
  getFieldById,
} = useFormField(initialFields);

const { builderLayout, handleLayoutChange } = useGridLayout(fields);

const canvasLayoutItems = computed(() => builderLayout.value);

const { isSubmitting, submitSchema, copySchemaToClipboard } = useFormSchema(
  fields,
  props.onSubmit,
);

const {
  canvasFieldStyle,
  fieldContentClass,
  labelClass,
  inputWrapperClass,
  isEditableTarget,
} = useFormFieldHelpers();

function handleGlobalKeydown(event: KeyboardEvent) {
  if (!selectedFieldId.value || isEditableTarget(event.target)) {
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    removeSelectedField();
  }
}

function handleFieldMove(fieldId: string | number) {
  selectField(String(fieldId));
}

function handleFieldResize(fieldId: string | number) {
  selectField(String(fieldId));
}

function handleSelectTriggerClick(fieldId: string | number, event: Event) {
  const id = String(fieldId);
  if (selectedFieldId.value !== id) {
    selectField(id);
    event.preventDefault();
  }
}

function handleDateChange(
  fieldId: string | number,
  value: DateValue | undefined,
) {
  const field = getFieldById(fieldId);
  if (!field) {
    return;
  }

  selectField(String(fieldId));
  field.value = toStoredDate(value);
}

function getDateValue(fieldId: string | number) {
  const field = getFieldById(fieldId);
  return parseStoredDate(
    field && !Array.isArray(field.value) ? field.value : "",
  );
}

function getDateLabel(fieldId: string | number) {
  const field = getFieldById(fieldId);
  return formatStoredDate(
    field && !Array.isArray(field.value) ? field.value : "",
  );
}

function getChoiceStackClass(fieldId: string | number) {
  const field = getFieldById(fieldId);
  return field?.optionLayout === "horizontal"
    ? "flex-row flex-wrap items-center gap-x-4 gap-y-2"
    : "flex-col gap-2";
}

function isCheckboxChecked(fieldId: string | number, optionValue: string) {
  const value = getFieldById(fieldId)?.value;
  return Array.isArray(value)
    ? value.includes(optionValue)
    : value === optionValue;
}

function toggleCheckboxValue(
  fieldId: string | number,
  optionValue: string,
  checked: boolean,
) {
  const field = getFieldById(fieldId);
  if (!field) {
    return;
  }

  selectField(String(fieldId));

  if (field.selectionMode === "single") {
    field.value = checked ? optionValue : "";
    return;
  }

  const current = Array.isArray(field.value) ? [...field.value] : [];
  field.value = checked
    ? current.includes(optionValue)
      ? current
      : [...current, optionValue]
    : current.filter((value) => value !== optionValue);
}

function setRadioValue(fieldId: string | number, optionValue: string) {
  const field = getFieldById(fieldId);
  if (!field) {
    return;
  }

  selectField(String(fieldId));
  field.value = optionValue;
}

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});
</script>

<template>
  <main
    class="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-4 text-foreground sm:px-6"
  >
    <div class="flex h-full w-full flex-col gap-4">
      <div
        class="grid h-full min-h-0 gap-4 xl:grid-cols-[280px_minmax(0,1.5fr)_340px]"
      >
        <FormBuilderLeftPanel
          :fields="fields"
          :selected-field-id="selectedFieldId"
          :field-catalog="fieldCatalog"
          @add-field="addField"
          @select-field="selectField"
        />

        <!-- Center Panel: Canvas -->
        <Card
          class="min-h-0 border-border/70 bg-background/85 shadow-sm backdrop-blur"
        >
          <CardContent class="min-h-0 overflow-y-auto overflow-x-hidden">
            <div class="w-full min-w-0">
              <div class="mb-5 flex items-center justify-between gap-4 px-1">
                <div>
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground"
                  >
                    Canvas
                  </p>
                </div>
                <div
                  class="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  12 Column Grid
                </div>
              </div>

              <GridLayout
                class="builder-grid min-h-160 w-full"
                :layout="builderLayout"
                :col-num="GRID_COLUMNS"
                :row-height="GRID_ROW_HEIGHT"
                :margin="GRID_MARGIN"
                :is-draggable="true"
                :is-resizable="true"
                :vertical-compact="false"
                :use-css-transforms="true"
                :prevent-collision="false"
                @layout-updated="handleLayoutChange"
              >
                <GridItem
                  v-for="item in canvasLayoutItems"
                  :key="String(item.i)"
                  :i="item.i"
                  :x="item.x"
                  :y="item.y"
                  :w="item.w"
                  :h="item.h"
                  :min-w="item.minW"
                  :min-h="item.minH"
                  drag-allow-from=".builder-drag-handle"
                  drag-ignore-from=".builder-content"
                  resize-ignore-from=".builder-drag-handle"
                  @move="handleFieldMove(item.i)"
                  @moved="handleFieldMove(item.i)"
                  @resize="handleFieldResize(item.i)"
                  @resized="handleFieldResize(item.i)"
                >
                  <div
                    v-if="getFieldById(item.i)"
                    :class="
                      cn(
                        'builder-field-shell group relative flex h-full flex-col transition',
                        selectedFieldId === getFieldById(item.i)?.id
                          ? 'outline-2 outline-offset-2 outline-foreground/40 rounded-sm'
                          : '',
                      )
                    "
                    @click.stop="selectField(String(item.i))"
                  >
                    <!-- Drag handle — only visible on hover/selected -->
                    <button
                      type="button"
                      class="builder-drag-handle absolute -top-3 right-0 z-20 inline-flex h-6 w-6 cursor-move items-center justify-center rounded-md bg-foreground text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                      :class="
                        selectedFieldId === getFieldById(item.i)?.id
                          ? 'opacity-100'
                          : ''
                      "
                    >
                      <span class="grid grid-cols-2 gap-0.5">
                        <span class="h-0.75 w-0.75 rounded-full bg-current" />
                        <span class="h-0.75 w-0.75 rounded-full bg-current" />
                        <span class="h-0.75 w-0.75 rounded-full bg-current" />
                        <span class="h-0.75 w-0.75 rounded-full bg-current" />
                      </span>
                    </button>

                    <!-- Field preview — pointer-events-none so it doesn't block resize -->
                    <div
                      :style="canvasFieldStyle(getFieldById(item.i)!)"
                      class="flex min-h-0 flex-1 flex-col"
                    >
                      <div
                        :class="
                          cn(
                            'builder-content flex min-h-0 flex-1 gap-1.5',
                            getFieldById(item.i)?.readOnly
                              ? 'pointer-events-none select-none'
                              : '',
                            fieldContentClass(getFieldById(item.i)!),
                          )
                        "
                      >
                        <template
                          v-if="
                            getFieldById(item.i)?.labelPlacement === 'top' ||
                            getFieldById(item.i)?.labelPlacement === 'left'
                          "
                        >
                          <Label
                            :class="
                              cn(
                                'text-sm font-semibold',
                                labelClass(getFieldById(item.i)!),
                              )
                            "
                          >
                            {{ getFieldById(item.i)?.label }}
                            <span
                              v-if="getFieldById(item.i)?.required"
                              class="text-destructive"
                              >*</span
                            >
                          </Label>
                        </template>

                        <div :class="inputWrapperClass(getFieldById(item.i)!)">
                          <Input
                            v-if="getFieldById(item.i)?.type === 'text'"
                            :model-value="getFieldById(item.i)?.value as string | number | undefined"
                            :placeholder="getFieldById(item.i)?.placeholder"
                            :class="
                              getFieldById(item.i)?.readOnly
                                ? 'bg-gray-100 text-gray-500'
                                : ''
                            "
                            :readonly="getFieldById(item.i)?.readOnly"
                            @update:model-value="
                              updateField('value', String($event))
                            "
                            @focus="selectField(String(item.i))"
                          />

                          <Input
                            v-else-if="getFieldById(item.i)?.type === 'number'"
                            type="number"
                            :model-value="getFieldById(item.i)?.value as string | number | undefined"
                            :placeholder="getFieldById(item.i)?.placeholder"
                            :class="
                              getFieldById(item.i)?.readOnly
                                ? 'bg-gray-100 text-gray-500'
                                : ''
                            "
                            :readonly="getFieldById(item.i)?.readOnly"
                            @update:model-value="
                              updateField('value', String($event))
                            "
                            @focus="selectField(String(item.i))"
                          />

                          <Textarea
                            v-else-if="
                              getFieldById(item.i)?.type === 'textarea'
                            "
                            class="min-h-28 flex-1"
                            :model-value="getFieldById(item.i)?.value as string | number | undefined"
                            :placeholder="getFieldById(item.i)?.placeholder"
                            :class="
                              getFieldById(item.i)?.readOnly
                                ? 'bg-gray-100 text-gray-500'
                                : ''
                            "
                            :readonly="getFieldById(item.i)?.readOnly"
                            @update:model-value="
                              updateField('value', String($event))
                            "
                            @focus="selectField(String(item.i))"
                          />

                          <div
                            v-else-if="getFieldById(item.i)?.type === 'date'"
                            class="flex items-center gap-2"
                          >
                            <Popover>
                              <PopoverTrigger as-child>
                                <Button
                                  type="button"
                                  variant="outline"
                                  :class="
                                    cn(
                                      'w-full justify-start text-left font-normal',
                                      !getFieldById(item.i)?.value &&
                                        'text-muted-foreground',
                                      getFieldById(item.i)?.readOnly
                                        ? 'bg-gray-100 text-gray-500'
                                        : '',
                                    )
                                  "
                                  @click="
                                    selectedFieldId !== String(item.i) &&
                                    selectField(String(item.i))
                                  "
                                >
                                  <CalendarIcon class="mr-2 h-4 w-4" />
                                  {{ getDateLabel(item.i) }}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent class="w-auto p-0" align="start">
                                <Calendar
                                  :model-value="getDateValue(item.i)"
                                  :initial-focus="true"
                                  :default-placeholder="defaultDatePlaceholder"
                                  layout="month-and-year"
                                  @update:model-value="
                                    handleDateChange(
                                      item.i,
                                      $event as DateValue | undefined,
                                    )
                                  "
                                />
                              </PopoverContent>
                            </Popover>
                            <button
                              v-if="
                                getFieldById(item.i)?.clearable &&
                                getFieldById(item.i)?.value
                              "
                              type="button"
                              class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-2 hover:bg-accent"
                              @click="updateField('value', '')"
                            >
                              ✕
                            </button>
                          </div>

                          <div
                            v-else-if="
                              getFieldById(item.i)?.type === 'checkbox'
                            "
                            :class="cn('flex', getChoiceStackClass(item.i))"
                          >
                            <label
                              v-for="option in getFieldById(item.i)?.options"
                              :key="option.id"
                              class="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                class="h-4 w-4 rounded border-input"
                                :checked="
                                  isCheckboxChecked(item.i, option.value)
                                "
                                :disabled="getFieldById(item.i)?.readOnly"
                                @change="
                                  toggleCheckboxValue(
                                    item.i,
                                    option.value,
                                    ($event.target as HTMLInputElement).checked,
                                  )
                                "
                              />
                              <span>{{ option.label }}</span>
                            </label>
                          </div>

                          <div
                            v-else-if="getFieldById(item.i)?.type === 'radio'"
                            :class="cn('flex', getChoiceStackClass(item.i))"
                          >
                            <label
                              v-for="option in getFieldById(item.i)?.options"
                              :key="option.id"
                              class="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="radio"
                                :name="getFieldById(item.i)?.name"
                                class="h-4 w-4 border-input"
                                :checked="
                                  getFieldById(item.i)?.value === option.value
                                "
                                :disabled="getFieldById(item.i)?.readOnly"
                                @change="setRadioValue(item.i, option.value)"
                              />
                              <span>{{ option.label }}</span>
                            </label>
                          </div>

                          <div v-else class="flex items-center gap-2">
                            <Select
                              :model-value="getFieldById(item.i)?.value"
                              @update:model-value="
                                updateField('value', $event as string)
                              "
                            >
                              <SelectTrigger
                                :class="
                                  cn(
                                    'w-full',
                                    getFieldById(item.i)?.readOnly
                                      ? 'bg-gray-100 text-gray-500'
                                      : '',
                                  )
                                "
                                @click="
                                  handleSelectTriggerClick(item.i, $event)
                                "
                              >
                                <SelectValue
                                  :placeholder="
                                    getFieldById(item.i)?.placeholder ||
                                    'Pilih opsi'
                                  "
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  v-for="option in getFieldById(item.i)
                                    ?.options"
                                  :key="option.id"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <button
                              v-if="
                                getFieldById(item.i)?.clearable &&
                                getFieldById(item.i)?.value
                              "
                              type="button"
                              class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-2 hover:bg-accent"
                              @click="updateField('value', '')"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <template
                          v-if="
                            getFieldById(item.i)?.labelPlacement === 'bottom' ||
                            getFieldById(item.i)?.labelPlacement === 'right'
                          "
                        >
                          <Label
                            :class="
                              cn(
                                'text-sm font-semibold',
                                labelClass(getFieldById(item.i)!),
                              )
                            "
                          >
                            {{ getFieldById(item.i)?.label }}
                            <span
                              v-if="getFieldById(item.i)?.required"
                              class="text-destructive"
                              >*</span
                            >
                          </Label>
                        </template>
                      </div>
                    </div>
                  </div>
                </GridItem>
              </GridLayout>
            </div>
          </CardContent>
        </Card>

        <FormBuilderRightPanel
          :selected-field="selectedField"
          :label-placement-items="labelPlacementItems"
          @update-field="updateField"
          @update-spacing="updateSpacing"
          @update-grid-value="updateGridValue"
          @add-option="addOption"
          @update-option="updateOption"
          @remove-option="removeOption"
          @remove-selected="removeSelectedField"
        />
      </div>

      <!-- Action Footer -->
      <div class="flex gap-3">
        <Button variant="outline" @click="copySchemaToClipboard">
          Copy Schema
        </Button>
        <Button
          :disabled="isSubmitting || fields.length === 0"
          @click="submitSchema"
        >
          {{ isSubmitting ? "Submitting..." : "Submit Form" }}
        </Button>
      </div>
    </div>
  </main>
</template>

<style scoped>
:deep(.builder-grid) {
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
  background-size: calc((100% - 11 * 12px) / 12 + 12px) 30px;
  border-radius: 20px;
  --vgl-resizer-size: 20px;
  --vgl-resizer-border-color: hsl(var(--foreground) / 0.35);
  --vgl-resizer-border-width: 2px;
}

/* Hide placeholder ghost */
:deep(.builder-grid .vgl-item--placeholder) {
  opacity: 0 !important;
  border: 0 !important;
  background: transparent !important;
  pointer-events: none !important;
}

:deep(.builder-grid .vgl-item--resizing) {
  opacity: 0.85;
}

/* Resize handle — only show on hover of the vgl-item */
:deep(.vgl-item__resizer) {
  z-index: 30 !important;
  cursor: se-resize !important;
  opacity: 0;
  transition: opacity 0.15s ease;
}

:deep(.vgl-item:hover .vgl-item__resizer),
:deep(.vgl-item--resizing .vgl-item__resizer) {
  opacity: 1;
}
</style>
