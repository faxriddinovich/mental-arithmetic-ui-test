<template>
  <svg ref="svgRef"/>
</template>
<script lang="ts">
import {defineComponent, ref, onMounted, watch} from "@vue/composition-api";
import {SVG} from "@svgdotjs/svg.js";
import {AbacusBoard} from "@/views/games/abacus/board";
import {
  ABACUS_STONE_WIDTH,
  ABACUS_FRAME_WIDTH,
  ABACUS_FRAME_ABSOLUTE_X_PADDING,
} from "@/views/games/abacus/constants";

export default defineComponent({
  props: {
    columns: {type: Number, required: false, default: 1},
    valueBox: {type: Boolean, required: false, default: true},
  },
  emits: ["on-update"],
  setup(props, context) {
    const svgRef = ref<SVGSVGElement | null>(null);
    let abacusBoard: AbacusBoard;
    const svg = SVG();

    function draw(columns: number) {
      abacusBoard = new AbacusBoard(columns, props.valueBox);
      abacusBoard.draw();
      svg.add(abacusBoard);
      abacusBoard.construct();
      const width =
          ABACUS_STONE_WIDTH * (columns || props.columns) +
          (ABACUS_FRAME_WIDTH + ABACUS_FRAME_ABSOLUTE_X_PADDING);

      const height = props.valueBox ? 469 : 418;
      const viewBoxX = 0;
      const viewBoxY = props.valueBox ? -55 : 0;
      svgRef.value!.setAttribute(
          "viewBox",
          `${viewBoxX} ${viewBoxY} ${width} ${height}`
      );
      //svgRef.value!.setAttribute('width', width);
      //svgRef.value!.setAttribute('height', height);
    }

    onMounted(() => {
      svg.node = svgRef.value!;
      draw(props.columns);
      listenAbacusBoardEvents();
    });

    watch(() => props.columns, (columns) => {
      updateColumns(columns);
    });

    function listenAbacusBoardEvents() {
      abacusBoard!.on("update", (event) => {
        context.emit("on-update", (event as CustomEvent<number>).detail);
      });
    }

    function update(n: number): void {
      abacusBoard.update(n);
    }

    function updateColumns(columns: number) {
      svgRef.value!.children[0].remove();
      draw(columns);
      listenAbacusBoardEvents();
    }

    function lock() {
      abacusBoard.lock();
    }

    function unlock() {
      abacusBoard.unlock();
    }

    function reset() {
      abacusBoard.reset();
    }

    return {svgRef, update, updateColumns, lock, unlock, reset};
  },
});
</script>

