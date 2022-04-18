<template>
  <svg ref="svgRef" />
  <!--<div ref="abacusContainerRef"></div> -->
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { SVG } from "@svgdotjs/svg.js";
import { AbacusBoard } from "@/views/games/abacus/board";
import {
  ABACUS_STONE_WIDTH,
  ABACUS_FRAME_WIDTH,
  ABACUS_FRAME_ABSOLUTE_X_PADDING,
} from "@/views/games/abacus/constants";

export default defineComponent({
  props: {
    columns: { type: Number, required: false, default: 1 },
  },
  setup(props) {
    const svgRef = ref<SVGSVGElement | null>(null);
    let abacusBoard: AbacusBoard;
    const svg = SVG();

    function draw(columns: number) {
      abacusBoard = new AbacusBoard(columns);
      abacusBoard.draw();
      svg.add(abacusBoard);
      abacusBoard.construct();
      const width =
        ABACUS_STONE_WIDTH * (columns || props.columns) +
        (ABACUS_FRAME_WIDTH + ABACUS_FRAME_ABSOLUTE_X_PADDING);
      const height = 469;
      svgRef.value!.setAttribute("viewBox", `0 -55 ${width} ${height}`);
    }

    onMounted(() => {
      svg.node = svgRef.value!;
      draw(props.columns);
    });

    function update(n: number): void {
      abacusBoard.update(n);
    }

    function updateColumns(columns: number) {
      svgRef.value!.children[0].remove();
      draw(columns);
    }

    return { svgRef, update, updateColumns };
  },
});
</script>

