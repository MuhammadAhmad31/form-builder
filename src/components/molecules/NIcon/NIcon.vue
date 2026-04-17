<script setup lang="ts">
import type { NIconProps } from './NIcon.type';
import { icons } from './NIcon.data';

const props = withDefaults(defineProps<NIconProps>(), {
  name: undefined,
  class: '',
  size: 18,
});
</script>

<template>
  <svg
    v-if="props.name"
    :width="props.size"
    :height="props.size"
    :viewBox="icons[props.name].viewBox"
    xmlns="http://www.w3.org/2000/svg"
    :class="props.class"
  >
    <path
      :d="icons[props.name].d"
      :fill="icons[props.name].stroke ? 'none' : 'currentColor'"
      :stroke="icons[props.name].stroke ? 'currentColor' : 'none'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  </svg>
</template>
