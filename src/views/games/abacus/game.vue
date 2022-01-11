<template>
  <div ref="abacusContainerRef">
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { SVG, Text } from "@svgdotjs/svg.js";
import { AbacusBoard } from "./board";

export default defineComponent({
  setup() {
    const abacusContainerRef = ref<HTMLElement>();
    const numbersContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(0);

    onMounted(() => {
      const draw = SVG().addTo(abacusContainerRef.value!).size("100%", "100%").css('position', 'absolute');
      const foreignObject = draw.foreignObject(1000, 200);
      const numberDraw = SVG().addTo(foreignObject).viewbox(0, 0, 1000, 140);

      foreignObject.cx(window.innerWidth / 2);
      foreignObject.cy(200);

      const abacusBoard = new AbacusBoard(6);
      abacusBoard.draw();
      draw.add(abacusBoard);
      abacusBoard.construct();

      abacusBoard.on("update", (value) => {
        abacusValue.value = (value as CustomEvent<number>).detail;
      });

      abacusBoard.cx(window.innerWidth / 2);
      abacusBoard.cy(700);

      const numbers = ['+44', '+91', '-44', '+15', '+44', '+91', '-44', '+15', '+44', '+91', '-44', '+15', '+44', '+91', '-44', '+15'];

      const tt = numberDraw.text((text) => {
        for(const n of numbers)
          text.tspan(n);
      }).font({ size: '10em', weight: "bold" }).fill("rgba(0, 0, 0, .2)");
      tt.attr({ 'dominant-baseline': "hanging" });

      tt.x(1000);

      let currIndex = 0;
      const timerHandle = setInterval(() => {
        const childs = tt.children();
        if (childs[currIndex]) {
          if (childs[currIndex - 1])
            childs[currIndex - 1].fill("rgba(0, 0, 0, .2)");

          childs[currIndex].fill("rgba(0, 0, 0, .7)");
          //numberDraw.animate(100).viewbox(childs[currIndex].cx() - 500, 0, 1000, 200);
          tt.animate(200).dx(-childs[currIndex].cx() + (500 - childs[currIndex].width()));
          currIndex++;
          return;
        }

        clearInterval(timerHandle);
      }, 1000);
    });

    return { numbersContainerRef, abacusContainerRef, abacusValue };
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
