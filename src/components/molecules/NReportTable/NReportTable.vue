<script setup lang="ts">
import NBadge from '../NBadge';
import NIcon from '../NIcon';
import type { Report, ReportItem } from './NReportTable.type';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    report: Report;
    type: 'equity-changes' | 'profit-loss' | 'financial-position' | 'cashflow';
    background?: 'white' | 'gray';
    hideTitle?: boolean;
  }>(),
  {
    background: 'white',
    hideTitle: false,
  }
);

const hoveredRow = ref();

const formatAmount = (amount: string, notation: 'positive' | 'negative') => {
  if (!amount) return '';
  const numValue = Number(amount);
  const isNegative = numValue < 0;
  const num = Math.abs(numValue);

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  if (isNegative || notation === 'negative') {
    return `(${formatted})`;
  }

  return formatted;
};

const getRowClass = (type: ReportItem['type']) => {
  switch (type) {
    case 'section':
      return '!bg-yellow-100 uppercase pl-4 text-body-small-prominent';
    case 'subsection':
      if (props.type === 'equity-changes' || props.type === 'cashflow') {
        return '!bg-blue-100 pl-4 text-body-small-prominent';
      } else {
        return '!bg-blue-100 pl-8 text-body-small-prominent';
      }
    case 'item':
      return 'pl-8 text-body-small hover:bg-gray-50 cursor-pointer';
    default:
      return '';
  }
};

const columns = computed(() => {
  const map = new Map<number, string>();
  props.report.items.forEach((i) => {
    if (!map.has(i.columnNumber)) {
      map.set(i.columnNumber, i.columnText || '');
    }
  });
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([columnNumber, columnText]) => ({
      columnNumber,
      columnText,
    }));
});

const groupedRows = computed(() => {
  const groups: Record<number, ReportItem[]> = {};
  props.report.items.forEach((item) => {
    if (!groups[item.rowNumber]) groups[item.rowNumber] = [];
    groups[item.rowNumber].push(item);
  });
  return Object.entries(groups)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([, items]) => items);
});

const shouldCenterEquityTable = computed(() => {
  return props.type === 'equity-changes' && columns.value.length <= 4;
});


const hasMixedPosition = computed(() => {
  if (props.type === 'equity-changes') return false;
  const positions = new Set<string>();
  groupedRows.value.forEach((row) => {
    const pos = row.find((i) => i.position)?.position;
    if (pos) positions.add(pos);
  });
  return positions.has('left') && positions.has('right');
});

const rowsByPosition = computed(() => {
  const left: ReportItem[][] = [];
  const right: ReportItem[][] = [];

  let currentPosition: 'left' | 'right' = 'left';

  groupedRows.value.forEach((row) => {
    const pos = row.find((i) => i.position)?.position;
    if (pos) currentPosition = pos;

    if (currentPosition === 'right') {
      right.push(row);
    } else {
      left.push(row);
    }
  });

  return { left, right };
});

const getRowAmount = (row: ReportItem[], columnNumber: number) => {
  const item = row.find((i) => i.columnNumber === columnNumber);
  return formatAmount(item?.amount || '', item?.notation || 'positive');
};

const getSpacerClass = (spacerType?: string): string | undefined => {
  if (spacerType === 'low') return 'mt-3';
  if (spacerType === 'high') return 'mt-5';
  return undefined;
};

const gridTemplateColumns = computed(() =>
  `1fr repeat(${columns.value.length}, 0.5fr)`
);
</script>

<template>
  <div
    v-bind="$attrs"
    v-if="props.type === 'equity-changes'"
    class="mx-auto w-full rounded-lg p-4"
    :class="props.background === 'white' ? 'bg-white' : 'bg-gray-50'"
  >
    <div class="mb-6 text-center" v-if="!props.hideTitle">
      <h1
        class="text-subtitle-medium whitespace-pre-line"
        v-html="props.report.meta.title"
      />
      <p class="text-body-medium text-gray-800">
        {{ props.report.meta.subtitle }}
      </p>
    </div>

    <div class="relative flex">
      <div
        v-if="!shouldCenterEquityTable"
        class="z-10 mr-4 flex-none bg-white text-start"
        style="width: 21rem"
      >
        <div
          v-for="row in groupedRows"
          :key="row[0].rowNumber"
          class="py-2"
          @mouseenter="hoveredRow = row[0].rowNumber"
          @mouseleave="hoveredRow = null"
          :class="[
            row[0].rowNumber === 0 && row[0].columnNumber === 0
              ? 'text-body-small-prominent bg-yellow-100 pl-4 uppercase'
              : getRowClass(row[0].type),
            hoveredRow === row[0].rowNumber ? 'bg-gray-50' : 'bg-white',
          ]"
        >
          {{ row[0].rowText }}
        </div>
      </div>

      <div
        class="flex-1"
        :class="
          shouldCenterEquityTable
            ? 'flex justify-center overflow-x-visible'
            : 'overflow-x-auto'
        "
      >
        <div :class="shouldCenterEquityTable ? 'inline-block' : 'min-w-full'">
          <div
            v-for="row in groupedRows"
            :key="row[0].rowNumber"
            class="grid items-center space-x-4 text-start"
            :style="{
              gridTemplateColumns: shouldCenterEquityTable
                ? `21rem repeat(${columns.length - 1}, minmax(16rem, auto))`
                : `repeat(${columns.length - 1}, 16rem)`,
              alignItems: 'stretch',
              gap: shouldCenterEquityTable ? '0.5rem' : '0',
            }"
          >
            <span
              v-if="shouldCenterEquityTable"
              :class="[
                row[0].rowNumber === 0 && row[0].columnNumber === 0
                  ? 'text-body-small-prominent bg-yellow-100 pl-4 uppercase'
                  : getRowClass(row[0].type),
                hoveredRow === row[0].rowNumber ? 'bg-gray-50' : 'bg-white',
              ]"
              class="sticky left-0 z-20 bg-white py-2"
            >
              {{ row[0].rowText }}
            </span>

            <div
              v-for="col in columns.slice(1)"
              :key="col.columnNumber"
              :class="[
                getRowClass(row[0].type),
                hoveredRow === row[0].rowNumber ? 'bg-gray-50' : 'bg-white',
                'py-2 pr-2 tabular-nums',
              ]"
              @mouseenter="hoveredRow = row[0].rowNumber"
              @mouseleave="hoveredRow = null"
            >
              <div
                v-if="row[0].rowNumber === 1 && row[0].type === 'section'"
                class="text-center"
              >
                {{ col.columnText }}
              </div>
              <div v-else class="text-right">
                {{
                  formatAmount(
                    row.find((i) => i.columnNumber === col.columnNumber)?.amount || '',
                    row.find((i) => i.columnNumber === col.columnNumber)?.notation || 'positive'
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-bind="$attrs"
    v-if="
      props.type === 'profit-loss' ||
      props.type === 'financial-position' ||
      props.type === 'cashflow'
    "
    class="mx-auto w-full rounded-lg p-4"
    :class="props.background === 'white' ? 'bg-white' : 'bg-gray-50'"
  >
    <div class="mb-6 text-center">
      <h1
        class="text-subtitle-medium whitespace-pre-line"
        v-html="props.report.meta.title"
      />
      <p class="text-body-medium text-gray-800">
        {{ props.report.meta.subtitle }}
      </p>
    </div>

    <div v-if="hasMixedPosition" class="grid grid-cols-2 items-start gap-8">
      <template
        v-for="(rows, side) in { left: rowsByPosition.left, right: rowsByPosition.right }"
        :key="side"
      >
        <div>
          <div
            v-for="row in rows"
            :key="row[0].rowNumber"
            class="grid items-center py-2 text-start"
            :class="[getRowClass(row[0].type), getSpacerClass(row[0].spacerType)]"
            :style="{ gridTemplateColumns }"
          >
            <span>{{ row[0].rowText }}</span>
            <div
              v-for="col in columns"
              :key="col.columnNumber"
              class="pr-4 text-right tabular-nums"
            >
              {{ getRowAmount(row, col.columnNumber) }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-else class="relative">
      <div
        class="absolute top-0 right-0 left-0 mx-auto grid"
        :style="{ gridTemplateColumns }"
      >
        <span></span>
        <div
          v-for="col in columns"
          :key="col.columnNumber"
          class="text-right!"
          :class="Number(col.columnNumber) % 2 ? 'mr-2' : 'pr-4'"
        >
          <NBadge
            v-if="col.columnText"
            class="ml-auto"
            type="standard"
            color="red"
          >
            <div class="flex items-center gap-1">
              {{ col.columnText }}
              <NIcon name="close" size="14" />
            </div>
          </NBadge>
        </div>
      </div>

      <div
        v-for="row in groupedRows"
        :key="row[0].rowNumber"
        class="grid items-center bg-white py-2 text-start"
        :class="[getRowClass(row[0].type), getSpacerClass(row[0].spacerType)]"
        :style="{ gridTemplateColumns }"
      >
        <span>{{ row[0].rowText }}</span>
        <div
          v-for="col in columns"
          :key="col.columnNumber"
          class="pr-4 text-right tabular-nums"
        >
          {{
            formatAmount(
              row.find((i) => i.columnNumber === col.columnNumber)?.amount || '',
              row.find((i) => i.columnNumber === col.columnNumber)?.notation || 'positive'
            )
          }}
        </div>
      </div>
    </div>
  </div>
</template>