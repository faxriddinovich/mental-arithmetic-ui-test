<template>
    <svg viewBox="0 0 1000 1000" width="100%" height="100%" ref="svgParent">
    </svg>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { SVG } from "@svgdotjs/svg.js";

export default defineComponent({
  setup() {
    const svgParent = ref<HTMLElement>();
    onMounted(() => {
      const draw = SVG().addTo(svgParent.value!).size('100%', '100%');
      draw.rect(100, 100).attr({ fill: '#f06' }).move(20, 200);
    });

    return { svgParent };
  },
});
</script>

