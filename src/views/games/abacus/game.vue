<template>
  <div>
    <div ref="numbersContainerRef"></div>
    <div
      ref="abacusContainerRef"
      class="is-flex is-justify-content-center"
    ></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { AbacusBoard } from "./board";
import { NumbersViewBox } from "./numbers-viewbox";

export default defineComponent({
  setup() {
    const abacusContainerRef = ref<HTMLElement>();
    const numbersContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(0);

    onMounted(() => {
      const numbersDraw = SVG()
        .addTo(numbersContainerRef.value!)
        .width(window.innerWidth);
      const abacusDraw = SVG()
        .addTo(abacusContainerRef.value!)
        .viewbox(0, -55, 670, 469)
        .addClass("is-abacus-board")
        .addClass("mx-2")
        .addClass("my-2");

      const numberViewBox = new NumbersViewBox(window.innerWidth, 140, [
        "+342",
        "-143",
        "+111",
        "+342",
        "-143",
        "+111",
        "+342",
        "-143",
        "+111",
      ]);
      numberViewBox.draw();
      numberViewBox.cx(window.innerWidth / 2);
      numbersDraw.add(numberViewBox);

      let i = 0;
      setInterval(() => {
        numberViewBox.display(i);
        i++;
      }, 1000);

      const abacusBoard = new AbacusBoard(6).id("abacus-board");
      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();

      abacusBoard.on("update", (value) => {
        abacusValue.value = (value as CustomEvent<number>).detail;
      });
    });

    return { numbersContainerRef, abacusContainerRef, abacusValue };
  },
});
</script>
<style lang="scss">
@import "bulma/sass/utilities/mixins";

.is-abacus-board {
  position: absolute;
  max-width: 850px;
  bottom: 0;
}
</style>
