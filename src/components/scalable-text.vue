<template>
  <!-- FIXME: VIEWPORT CALCULATIONS MUST BE FIXED IN THE FUTURE -->
  <svg :viewBox="`0 0 250 60`">
    <text
      dominant-baseline="middle"
      text-anchor="middle"
      font-size="65px"
      x="50%"
      y="50%"
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
});
</script>

