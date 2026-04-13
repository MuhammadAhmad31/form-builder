<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { GridItem, GridLayout } from "grid-layout-plus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FormSchema } from "@/services/formService";
import FormCanvasItem from "./FormCanvasItem.vue";
import FormBuilderLeftPanel from "./FormBuilderLeftPanel.vue";
import FormBuilderRightPanel from "./FormBuilderRightPanel.vue";
import type { BuilderField } from "./types";
import {
  useFormField,
  useGridLayout,
  useFormSchema,
  useFormFieldHelpers,
  GRID_COLUMNS,
  GRID_ROW_HEIGHT,
  GRID_MARGIN,
} from "./composables";
import { fieldCatalog } from "./constant/fieldCatalog";
import { labelPlacementItems } from "./constant/labelPlacement";

interface Props {
  onSubmit?: (schema: FormSchema) => void | Promise<void>;
}

const props = defineProps<Props>();

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

const { isEditableTarget } = useFormFieldHelpers();

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

function updateCanvasFieldValue(
  fieldId: string | number,
  value: BuilderField["value"],
) {
  const field = getFieldById(fieldId);
  if (!field) {
    return;
  }

  selectField(String(fieldId));
  field.value = value;
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
                  <FormCanvasItem
                    v-if="getFieldById(item.i)"
                    :field="getFieldById(item.i)!"
                    :selected="selectedFieldId === getFieldById(item.i)?.id"
                    @select="selectField(String(item.i))"
                    @update:value="updateCanvasFieldValue(item.i, $event)"
                  />
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
