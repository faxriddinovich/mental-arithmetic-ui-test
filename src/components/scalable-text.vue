<template>
  <svg :viewBox="`0 0 ${text.length * 33} 60`">
    <text
      dominant-baseline="middle"
      text-anchor="middle"
      x="50%"
      y="50%"
      dy="5px"
      font-size="50"
      fill="#fff"
    >
      {{ text }}
    </text>
  </svg>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup() {
  //
  },
});
</script>

