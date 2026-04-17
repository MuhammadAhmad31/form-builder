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
    layout?: 'staffle' | 'skontro';
  }>(),
  {
    background: 'white',
    hideTitle: false,
    layout: 'staffle',
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

const isSkontroLayout = computed(() => {
  return props.type === 'financial-position' && props.layout === 'skontro';
});

const groupItemsByRow = (
  items: ReportItem[],
  startMarker: string,
  endMarker: string
) => {
  const getRowNumber = (marker: string) =>
    items.find((item) => item.rowText.toLowerCase() === marker)?.rowNumber;

  const startRow = getRowNumber(startMarker);
  const endRow = getRowNumber(endMarker);

  if (!startRow || !endRow) return [];

  const itemsInRange = items.filter(
    (item) => item.rowNumber >= startRow && item.rowNumber <= endRow
  );

  const grouped = itemsInRange.reduce(
    (acc, item) => {
      if (!acc[item.rowNumber]) acc[item.rowNumber] = [];
      acc[item.rowNumber].push(item);
      return acc;
    },
    {} as Record<number, ReportItem[]>
  );

  Object.values(grouped).forEach((group) =>
    group.sort((a, b) => a.columnNumber - b.columnNumber)
  );

  return Object.entries(grouped)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, group]) => group);
};

const skontroLeftItems = computed(() => {
  if (!isSkontroLayout.value) return [];
  return groupItemsByRow(props.report.items, 'aset', 'jumlah aset');
});

const skontroRightItems = computed(() => {
  if (!isSkontroLayout.value) return [];
  return groupItemsByRow(
    props.report.items,
    'liabilitas',
    'jumlah liabilitas dan ekuitas'
  );
});

const skontroGridColumns = computed(() => {
  return columns.value.length > 1
    ? `1fr repeat(${columns.value.length}, 0.5fr)`
    : '1fr 0.5fr';
});

const getRowAmount = (row: ReportItem[], columnNumber: number) => {
  const item = row.find((i) => i.columnNumber === columnNumber);
  return formatAmount(item?.amount || '', item?.notation || 'positive');
};

const getSpacerClass = (val: string): string | undefined => {
  const spacerGroups: Record<string, string[]> = {
    low: [
      'aset lancar',
      'aset tidak lancar',
      'jumlah aset',
      'liabilitas jangka pendek',
      'liabilitas jangka panjang',
      'jumlah liabilitas',
      'ARUS KAS DARI AKTIVITAS INVESTASI',
      'arus kas dari aktivitas investasi',
      'arus kas dari aktivitas pendanaan',
      'kenaikan (penurunan) kas dan setara kas',
    ],
    high: [
      'beban',
      'laba sebelum pajak penghasilan',
      props.layout === 'skontro' ? '' : 'liabilitas',
      'ekuitas',
      'jumlah liabilitas dan ekuitas',
    ],
  };

  const lower = val.toLowerCase();

  if (spacerGroups.low.includes(lower)) return 'mt-3';
  if (spacerGroups.high.includes(lower)) return 'mt-5';

  return undefined;
};
</script>

<template>
  <!-- Skontro Layout (2-column horizontal) -->
  <div
    v-bind="$attrs"
    v-if="isSkontroLayout"
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

    <div class="grid grid-cols-2 items-start gap-8">
      <template
        v-for="(items, side) in {
          left: skontroLeftItems,
          right: skontroRightItems,
        }"
        :key="side"
      >
        <div class="flex h-full flex-col justify-between">
          <!-- Regular items -->
          <div>
            <div
              v-for="row in items.slice(0, -1)"
              :key="`${side}-${row[0].rowNumber}`"
              class="grid items-center bg-white py-2 text-start"
              :class="[
                getRowClass(row[0].type),
                getSpacerClass(row[0].rowText),
              ]"
              :style="{ gridTemplateColumns: skontroGridColumns }"
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

          <!-- Last item (bottom aligned with yellow background) -->
          <div
            v-if="items.length > 0"
            :key="`${side}-last-${items[items.length - 1][0].rowNumber}`"
            class="grid items-center bg-yellow-100 py-2 text-start"
            :class="[
              getRowClass(items[items.length - 1][0].type),
              getSpacerClass(items[items.length - 1][0].rowText),
            ]"
            :style="{ gridTemplateColumns: skontroGridColumns }"
          >
            <span>{{ items[items.length - 1][0].rowText }}</span>
            <div
              v-for="col in columns"
              :key="col.columnNumber"
              class="pr-4 text-right tabular-nums"
            >
              {{ getRowAmount(items[items.length - 1], col.columnNumber) }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <div
    v-bind="$attrs"
    v-if="
      (props.type === 'profit-loss' ||
        props.type === 'financial-position' ||
        props.type === 'cashflow') &&
      !isSkontroLayout
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

    <div class="relative">
      <div
        class="absolute top-0 right-0 left-0 mx-auto grid"
        :style="{ gridTemplateColumns: `1fr repeat(${columns.length}, 0.5fr)` }"
      >
        <span></span>
        <div
          v-for="col in columns"
          :key="col.columnNumber"
          class="!text-right"
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
        :class="[getRowClass(row[0].type), getSpacerClass(row[0].rowText)]"
        :style="{ gridTemplateColumns: `1fr repeat(${columns.length}, 0.5fr)` }"
      >
        <span>{{ row[0].rowText }}</span>

        <div
          v-for="col in columns"
          :key="col.columnNumber"
          class="pr-4 text-right tabular-nums"
        >
          {{
            formatAmount(
              row.find((i) => i.columnNumber === col.columnNumber)?.amount ||
                '',
              row.find((i) => i.columnNumber === col.columnNumber)?.notation ||
                'positive'
            )
          }}
        </div>
      </div>
    </div>
  </div>

  <!-- Perubahan Ekuitas -->
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
                    row.find((i) => i.columnNumber === col.columnNumber)
                      ?.amount || '',
                    row.find((i) => i.columnNumber === col.columnNumber)
                      ?.notation || 'positive'
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
