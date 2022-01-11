<template>
  <div ref="abacusContainerRef" style="height: 100vh"></div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { SVG } from "@svgdotjs/svg.js";
import {
  AbacusBoard,
} from "./board";

export default defineComponent({
  setup() {
    const abacusContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(0);

    onMounted(() => {
      const draw = SVG().addTo(abacusContainerRef.value!).size("100%", "100%");
      const abacusBoard = new AbacusBoard(3);
      abacusBoard.draw();
      draw.add(abacusBoard);
      abacusBoard.construct();

      abacusBoard.on('update', (value) => {
        abacusValue.value = (value as CustomEvent<number>).detail;
      });

      abacusBoard.cx(window.innerWidth / 2);
      abacusBoard.cy(window.innerHeight / 2);
    });

    return { abacusContainerRef, abacusValue };
  },
});
</script>
<style lang="scss">
.is-abacus-frame {
  border: 20px solid rgb(104, 93, 75);
  border-radius: 10px;
}
#wtf {
  outline-width: 10px;
  outline-offset: -10px;
}
</style>
