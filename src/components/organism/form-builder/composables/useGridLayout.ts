import { computed, type Ref } from 'vue'
import type { Layout } from 'grid-layout-plus'
import type { BuilderField } from '../types'

export const GRID_COLUMNS = 12
export const GRID_ROW_HEIGHT = 18
export const GRID_MARGIN: [number, number] = [12, 12]
export const MIN_WIDTH = 3
export const MIN_HEIGHT = 2

export function useGridLayout(fields: Ref<BuilderField[]>) {
  const builderLayout = computed(() => {
    return fields.value.map((field) => ({
      i: field.id,
      x: field.x,
      y: field.y,
      w: field.w,
      h: field.h,
      minW: MIN_WIDTH,
      minH: field.type === 'textarea' ? 6 : MIN_HEIGHT,
    } as Layout[number]))
  })

  function handleLayoutChange(layout: Layout) {
    for (const item of layout) {
      const field = fields.value.find((entry) => entry.id === String(item.i))
      if (field) {
        field.x = item.x
        field.y = item.y
        field.w = item.w
        field.h = item.h
      }
    }
  }


  return {
    builderLayout,
    handleLayoutChange,
  }
}
