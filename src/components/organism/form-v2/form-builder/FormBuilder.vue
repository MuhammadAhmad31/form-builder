<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { GridItem, GridLayout } from "grid-layout-plus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FormSchema } from "@/services/formService";
import FormCanvasItem from "./FormCanvasItem.vue";
import FormBuilderLeftPanel from "./FormBuilderLeftPanel.vue";
import FormBuilderRightPanel from "./FormBuilderRightPanel.vue";
import type { BuilderField, SectionDirection } from "./types";
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
  sections,
  selectedSectionId,
  selectedSection,
  selectedFieldId,
  selectedField,
  addField,
  addSection,
  selectField,
  selectSection,
  removeSelectedField,
  removeSelectedSection,
  moveFieldToSection,
  updateField,
  updateSpacing,
  updateGridValue,
  addOption,
  updateOption,
  removeOption,
  getFieldsBySection,
  getFieldById,
  updateSectionTitle,
  updateSectionVisibility,
} = useFormField(initialFields);

const { builderLayout, handleLayoutChange } = useGridLayout(fields);
const sectionDirection = ref<SectionDirection>("column");

const sectionLayoutItems = computed(() => {
  return sections.value.map((section) => ({
    section,
    layout: builderLayout.value.filter((item) => {
      const field = getFieldById(item.i);
      return field?.sectionId === section.id;
    }),
  }));
});

const { isSubmitting, submitSchema, copySchemaToClipboard } = useFormSchema(
  fields,
  sections,
  sectionDirection,
  props.onSubmit,
);

const { isEditableTarget } = useFormFieldHelpers();

function handleGlobalKeydown(event: KeyboardEvent) {
  if (isEditableTarget(event.target)) {
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();

    if (selectedFieldId.value) {
      removeSelectedField();
    } else if (selectedSectionId.value) {
      removeSelectedSection();
    }
  }
}

function handleFieldMove(fieldId: string | number) {
  selectField(String(fieldId));
}

function handleFieldResize(fieldId: string | number) {
  selectField(String(fieldId));
}

function handleSectionLayoutChange(
  sectionId: string,
  layout: Parameters<typeof handleLayoutChange>[0],
) {
  handleLayoutChange(layout);
  selectSection(sectionId);
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

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  event.dataTransfer!.dropEffect = "move";
}

function handleDropOnSection(sectionId: string, event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();

  const fieldId = event.dataTransfer?.getData("fieldId");
  const sourceSectionId = event.dataTransfer?.getData("sectionId");

  if (fieldId && sourceSectionId && sourceSectionId !== sectionId) {
    moveFieldToSection(fieldId, sectionId);
  }
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
          :sections="sections"
          :selected-section-id="selectedSectionId"
          :fields="fields"
          :selected-field-id="selectedFieldId"
          :field-catalog="fieldCatalog"
          @add-field="addField"
          @add-section="addSection"
          @select-section="selectSection"
          @select-field="selectField"
        />

        <!-- Center Panel: Canvas -->
        <Card
          class="min-h-0 border-border/70 bg-background/85 shadow-sm backdrop-blur flex flex-col"
        >
          <div class="sticky top-0 z-10 bg-background/85 backdrop-blur border-b border-border/70">
            <div class="mb-5 mt-6 flex items-center justify-between gap-4 px-6">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground"
                >
                  Canvas
                </p>
              </div>
              <div
                class="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground"
              >
                <span class="px-1">12 Column Grid</span>
                <button
                  type="button"
                  class="rounded-full px-2 py-1 transition hover:bg-accent"
                  :class="sectionDirection === 'column' ? 'bg-foreground text-background' : ''"
                  @click="sectionDirection = 'column'"
                >
                  Atas-Bawah
                </button>
                <button
                  type="button"
                  class="rounded-full px-2 py-1 transition hover:bg-accent"
                  :class="sectionDirection === 'row' ? 'bg-foreground text-background' : ''"
                  @click="sectionDirection = 'row'"
                >
                  Kiri-Kanan
                </button>
              </div>
            </div>
          </div>

          <CardContent class="min-h-0 overflow-y-auto overflow-x-auto flex-1">
            <div class="w-full min-w-max">
              <div
                class="flex gap-4 px-1"
                :class="sectionDirection === 'row' ? 'flex-row' : 'flex-col'"
              >
                <div
                  v-for="sectionLayout in sectionLayoutItems"
                  :key="sectionLayout.section.id"
                  class="rounded-2xl bg-background/60 p-3 cursor-pointer transition hover:bg-background/80 shrink-0"
                  :class="[
                    sectionDirection === 'row' ? 'w-96' : 'flex-1 min-w-0',
                    selectedSectionId === sectionLayout.section.id ? 'ring-2 ring-foreground' : 'ring-1 ring-foreground/10'
                  ]"
                  @click="selectSection(sectionLayout.section.id)"
                  @dragover="handleDragOver"
                  @drop="handleDropOnSection(sectionLayout.section.id, $event)"
                >
                  <button
                    v-if="sectionLayout.section.showTitle"
                    type="button"
                    class="mb-3 flex w-full items-center justify-between rounded-xl px-2 py-1 text-left transition hover:bg-accent"
                    @click="selectSection(sectionLayout.section.id)"
                  >
                    <p class="text-sm font-semibold">{{ sectionLayout.section.title }}</p>
                    <span class="text-xs text-muted-foreground">
                      {{ getFieldsBySection(sectionLayout.section.id).length }} field
                    </span>
                  </button>

                  <GridLayout
                    class="builder-grid min-h-160 w-full"
                    :layout="sectionLayout.layout"
                    :col-num="GRID_COLUMNS"
                    :row-height="GRID_ROW_HEIGHT"
                    :margin="GRID_MARGIN"
                    :is-draggable="true"
                    :is-resizable="true"
                    :vertical-compact="false"
                    :use-css-transforms="true"
                    :prevent-collision="false"
                    @layout-updated="handleSectionLayoutChange(sectionLayout.section.id, $event)"
                  >
                    <GridItem
                      v-for="item in sectionLayout.layout"
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
              </div>
            </div>
          </CardContent>
        </Card>

        <FormBuilderRightPanel
          :selected-section="selectedSection"
          :selected-field="selectedField"
          :label-placement-items="labelPlacementItems"
          @update-section-title="updateSectionTitle"
          @update-section-visibility="updateSectionVisibility"
          @update-field="updateField"
          @update-spacing="updateSpacing"
          @update-grid-value="updateGridValue"
          @add-option="addOption"
          @update-option="updateOption"
          @remove-option="removeOption"
          @remove-selected="removeSelectedField"
          @remove-section="removeSelectedSection"
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
