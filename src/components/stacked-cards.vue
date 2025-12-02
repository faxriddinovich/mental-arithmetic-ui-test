<template>
  <div>
    <div v-for="card of count" :key="card">
      <div
        class="box m-0 is-bordered"
        :style="`
          width: ${97 - (count - card) * 3}%;
          margin: 0 auto -30px !important;
          `"
      ></div>
    </div>
    <div class="card p-1 is-bordered">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    count: { type: Number, default: 2 },
  },
});
</script>

