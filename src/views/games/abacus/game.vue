<template>
  <div ref="abacusContainerRef" style="height: 100vh">
    <!--
    <div class="is-abacus-frame">
      <img :src="require('@@/img/abacus/stone_yellow.svg')" />
      <img :src="require('@@/img/abacus/stone_yellow.svg')" />
      <img :src="require('@@/img/abacus/stone_yellow.svg')" />
      <img :src="require('@@/img/abacus/stone_yellow.svg')" />
      <img :src="require('@@/img/abacus/stone_yellow.svg')" />
      <img :src="require('@@/img/abacus/stone_yellow.svg')" />
    </div>
    -->
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "@vue/composition-api";
import { G, Image, Line, Rect, Svg, SVG, Circle } from "@svgdotjs/svg.js";
import {
  AbacusBoard,
  AbacusOuterBox,
  AbacusInnerBox,
  AbacusValueBox,
  AbacusColumns,
} from "./frame";

export default defineComponent({
  setup() {
    const abacusContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(948217);

    onMounted(() => {
      const draw = SVG().addTo(abacusContainerRef.value!).size("100%", "100%");
      //const abacusBoard = new AbacusBoard(draw, 6);
      const abacusValueBox = new AbacusValueBox();
      const abacusOuterBox = new AbacusOuterBox(2);
      const abacusInnerBox = new AbacusInnerBox(2);
      const abacusColumns = new AbacusColumns(2);

      const numbers = [0];

      abacusColumns.on('update', (event) => {
        numbers[event.detail.index] = event.detail.value;
        if(numbers.every((n) => n === 0))
          abacusValueBox.setText(0);
        else
          abacusValueBox.setText(+numbers.join(''));

          console.log(event.detail);
        console.log(+numbers.join(''));
      });

      abacusValueBox.draw();
      abacusOuterBox.draw();
      abacusInnerBox.draw();
      abacusColumns.draw();

      abacusOuterBox.add(abacusInnerBox);
      abacusOuterBox.add(abacusValueBox);
      abacusInnerBox.add(abacusColumns);

      draw.add(abacusOuterBox);

      abacusInnerBox.cy(abacusOuterBox.cy());
      abacusInnerBox.cx(abacusOuterBox.cx());
      abacusColumns.cx(abacusInnerBox.cx());

      abacusOuterBox.move(500, 300);
      abacusValueBox.cx(abacusOuterBox.cx());
      abacusValueBox.dy(-abacusValueBox.height() + 5);
    });

    return { abacusContainerRef };
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
