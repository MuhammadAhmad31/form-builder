<script setup lang="ts">
import { GridItem, GridLayout} from 'grid-layout-plus'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useFormRenderer } from './useFormRenderer'
import type { FormRendererProps } from './useFormRenderer'
import FieldRenderer from './FieldRenderer.vue'

const props = defineProps<FormRendererProps>()

const {
  GRID_COLUMNS,
  GRID_ROW_HEIGHT,
  GRID_MARGIN,
  schemaSections,
  sectionDirection,
  sectionLayoutItems,
  canvasFieldStyle,
  getFieldById,
  labelClass,
  handleSubmit,
  fieldContentClass,
  inputWrapperClass,
  errors,
  isSubmitting,
  formData,
  resetForm
} = useFormRenderer(props)
</script>

<template>
  <main class="min-h-screen p-6">
    <div class="mx-auto max-w-5xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- container harus block + full width sebelum GridLayout mount -->
        <div class="flex w-full min-w-0 gap-4" :class="sectionDirection === 'row' ? 'flex-col xl:flex-row' : 'flex-col'">
          <div
            v-for="section in schemaSections"
            :key="section.id"
            class="min-w-0 flex-1 rounded-2xl bg-background/70 p-4"
          >
            <p v-if="section.showTitle" class="mb-3 text-sm font-semibold">{{ section.title }}</p>

            <GridLayout
              class="form-renderer-grid"
              :layout="sectionLayoutItems(section.id)"
              :col-num="GRID_COLUMNS"
              :row-height="GRID_ROW_HEIGHT"
              :margin="GRID_MARGIN"
              :is-draggable="false"
              :is-resizable="false"
              :vertical-compact="false"
              :use-css-transforms="true"
            >
              <GridItem
                v-for="item in sectionLayoutItems(section.id)"
                :key="String(item.i)"
                :i="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :min-w="item.minW"
                :min-h="item.minH"
              >

                <div v-if="getFieldById(String(item.i))" class="h-full w-full" :style="canvasFieldStyle(getFieldById(String(item.i))!)">
                  <div :class="cn('flex h-full flex-col gap-1.5', fieldContentClass(getFieldById(String(item.i))!))">
                    <!-- Label Top/Left -->
                    <template v-if="getFieldById(String(item.i))?.labelPlacement === 'top' || getFieldById(String(item.i))?.labelPlacement === 'left'">
                      <Label :class="cn('text-sm font-semibold', labelClass(getFieldById(String(item.i))!))">
                        {{ getFieldById(String(item.i))?.label }}
                        <span v-if="getFieldById(String(item.i))?.required" class="text-red-500">*</span>
                      </Label>
                    </template>

                  <!-- Input Wrapper -->
                  <div :class="inputWrapperClass(getFieldById(String(item.i))!)">
                    <FieldRenderer
                      v-if="getFieldById(String(item.i))"
                      :field="getFieldById(String(item.i))! as any"
                      :model-value="formData[getFieldById(String(item.i))!.name]"
                      :error="errors[getFieldById(String(item.i))!.name]"
                      @update:model-value="formData[getFieldById(String(item.i))!.name] = $event"
                    />
                  </div>

                    <!-- Label Bottom/Right -->
                    <template v-if="getFieldById(String(item.i))?.labelPlacement === 'bottom' || getFieldById(String(item.i))?.labelPlacement === 'right'">
                      <Label :class="cn('text-sm font-semibold', labelClass(getFieldById(String(item.i))!))">
                        {{ getFieldById(String(item.i))?.label }}
                        <span v-if="getFieldById(String(item.i))?.required" class="text-red-500">*</span>
                      </Label>
                    </template>

                    <!-- Error Message -->
                    <p v-if="errors[getFieldById(String(item.i))!.name]" class="text-xs text-red-500">
                      {{ errors[getFieldById(String(item.i))!.name] }}
                    </p>
                  </div>
                </div>
              </GridItem>
            </GridLayout>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-3">
          <Button type="button" variant="outline" :disabled="isSubmitting" @click="resetForm">
            Reset
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </Button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
/* Paksa GridLayout dan wrapper internalnya full width */
:deep(.form-renderer-grid),
:deep(.form-renderer-grid > .vgl-layout) {
  width: 100% !important;
  --vgl-resizer-size: 0px;
}

/* Hapus semua style bawaan vgl-item */
:deep(.vgl-item) {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
}

/* Fix SelectTrigger shadcn yang default w-fit, paksa full width */
:deep([data-slot="select-trigger"]) {
  width: 100% !important;
}
</style>
