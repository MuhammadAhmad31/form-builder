<script setup lang="ts">
import { computed } from 'vue';
import type { NBadgeProps, BadgeColor, BadgeType } from './NBadge.type';
import NIcon from '../NIcon';

const props = defineProps<NBadgeProps>();

const base =
  'w-fit p-[8px] rounded-[4px] flex justify-center items-center gap-2';

const colors = {
  gray: {
    prominent: 'bg-gray-600 text-gray-50',
    standard: 'text-gray-800 bg-gray-50',
  },
  yellow: {
    prominent: 'bg-yellow-800 text-gray-100',
    standard: 'text-yellow-800 bg-yellow-100',
  },
  orange: {
    prominent: 'bg-orange-700 text-gray-100',
    standard: 'text-orange-700 bg-orange-100',
  },
  blue: {
    prominent: 'bg-blue-700 text-gray-100',
    standard: 'text-blue-700 bg-blue-100',
  },
  purple: {
    prominent: 'bg-purple-700 text-gray-100',
    standard: 'text-purple-700 bg-purple-100',
  },
  green: {
    prominent: 'bg-green-700 text-gray-100',
    standard: 'text-green-700 bg-green-100',
  },
  red: {
    prominent: 'bg-red-700 text-gray-100',
    standard: 'text-red-700 bg-red-100',
  },
} as const;

const normalizedColor = computed(() => (props.color ?? 'blue') as BadgeColor);
const normalizedType = computed(() => (props.type ?? 'standard') as BadgeType);

const classes = computed(() => {
  const colorClass =
    colors[normalizedColor.value]?.[normalizedType.value] ??
    colors.blue.standard;
  return [base, props.class, colorClass].filter(Boolean).join(' ');
});
</script>

<template>
  <div v-if="!props.isNumberOnly">
    <div :class="classes">
      <NIcon
        v-if="typeof props.prependIcon === 'string'"
        :name="props.prependIcon"
        size="15"
      />
      <span class="text-body-small">
        <slot />
      </span>
      <NIcon
        v-if="typeof props.appendIcon === 'string'"
        :name="props.appendIcon"
        size="15"
      />
    </div>
  </div>
  <div v-else>
    <div
      :class="classes"
      class="flex aspect-square h-6 w-6 items-center justify-center rounded-full"
    >
      <span class="text-body-small-prominent">
        <slot />
      </span>
    </div>
  </div>
</template>
