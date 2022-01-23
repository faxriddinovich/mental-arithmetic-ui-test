<template>
  <svg
    width="100%"
    height="100%"
    :viewBox="`0 0 ${viewBoxWidthMap[number.length]} 10`"
  >
    <text
      x="50%"
      y="50%"
      font-size="10"
      fill="#fff"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      {{ number }}
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
    width: {
      type: Number,
      required: true,
    },
  },
  setup() {},
});
</script>

