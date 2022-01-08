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
import { G, Image, Line, Rect, Svg, SVG } from "@svgdotjs/svg.js";
import { AbacusFrame } from "./frame";

import stone from "@@/img/abacus/stone_yellow.svg";

const ABACUS_FRAME_WIDTH = 800;
const ABACUS_FRAME_HEIGHT = 465;

const ABACUS_FRAME_COLOR = "rgb(104, 93, 75)";
const ABACUS_FRAME_STROKE_WIDTH = 20;
const ABACUS_FRAME_HORIZONTAL_LINE_COLOR = "#4D4D4D";

const ABACUS_STONE_WIDTH = 100;
const ABACUS_STONE_HEIGHT = 50;

const ABACUS_FRAME_TOP_BAR_WIDTH = 200;
const ABACUS_FRAME_TOP_BAR_HEIGHT = 60;
const ABACUS_FRAME_TOP_BAR_RIGHT_SPACE = 20;

class AbacusColumn extends G {
  private stones: Image[] = [];
  private bitset = 0b00000;
  private verticalLine = new Line();

  constructor() {
    super();
  }

  private drawVerticalLine() {
    const lineX = 15 + ABACUS_STONE_WIDTH / 2;
    this.verticalLine
      .attr({ x1: lineX, y1: 0, x2: lineX, y2: ABACUS_FRAME_HEIGHT })
      .stroke({ width: 20, color: ABACUS_FRAME_HORIZONTAL_LINE_COLOR });
    this.add(this.verticalLine);
  }

  private createStones(drawing: Svg) {
    for(let i = 0; i < 8; i++) {
      if(i == 2 || i == 1 || i == 3) continue;
    const stoneImage = new Image()
      .load(stone)
      .addTo(drawing)
      .size(ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT).id('test');

    stoneImage.cx(this.verticalLine.x());

    const startX = (ABACUS_FRAME_STROKE_WIDTH / 2 + 5);
    stoneImage.y(startX + (ABACUS_STONE_HEIGHT + 5) * i);

    this.stones.push(stoneImage);
    this.add(stoneImage);
    }
  }

  public draw(drawing: Svg) {
    this.drawVerticalLine();
    this.createStones(drawing);
  }
}

export default defineComponent({
  setup() {
    const abacusContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(0);

    const abacusFrameGroup = new G();
    const abacusValueBarGroup = new G();

    function drawAbacus(draw: Svg) {
      const abacusFrame = draw
        .rect(ABACUS_FRAME_WIDTH, ABACUS_FRAME_HEIGHT)
        .attr({
          stroke: ABACUS_FRAME_COLOR,
          fill: "rgba(0, 0, 0, 0)",
          "stroke-width": ABACUS_FRAME_STROKE_WIDTH,
          rx: "5",
          ry: "5",
        });

      const abacusFrameHorizontalLine = draw
        .line(
          0,
          ABACUS_FRAME_HEIGHT - 315,
          ABACUS_FRAME_WIDTH,
          ABACUS_FRAME_HEIGHT - 315
        )
        .stroke({
          color: ABACUS_FRAME_HORIZONTAL_LINE_COLOR,
          width: 20,
          linecap: "round",
        });

      const column = new AbacusColumn();
      column.draw(draw);

      abacusFrameGroup.add(column);

      const abacusValueBar = draw
        .rect(ABACUS_FRAME_TOP_BAR_WIDTH, ABACUS_FRAME_TOP_BAR_HEIGHT)
        .attr({
          fill: "rgb(104, 93, 75)",
          rx: "10",
          ry: "10",
        });

      const abacusValueText = draw
        .plain(String(abacusValue.value))
        .attr({
          fill: "rgb(255, 255, 255)",
        })
        .font({ size: "3em" });

      abacusValueText.center(abacusValueBar.cx(), abacusValueBar.cy());

      abacusValueBarGroup.add(abacusValueBar);
      abacusValueBarGroup.add(abacusValueText);

      abacusValueBarGroup.move(
        ABACUS_FRAME_WIDTH -
          (ABACUS_FRAME_TOP_BAR_WIDTH + ABACUS_FRAME_TOP_BAR_RIGHT_SPACE),
        -ABACUS_FRAME_TOP_BAR_HEIGHT
      );

      abacusFrameGroup.add(abacusFrameHorizontalLine);
      abacusFrameGroup.add(abacusFrame);
      abacusFrameGroup.add(abacusValueBarGroup);

      draw.add(abacusFrameGroup);

      watch(abacusValue, () => {
        abacusValueText.text(String(abacusValue.value));
        abacusValueText.center(abacusValueBar.cx(), abacusValueBar.cy());
      });
    }

    onMounted(() => {
      const draw = SVG().addTo(abacusContainerRef.value!).size("100%", "100%");
      drawAbacus(draw);
      abacusFrameGroup.move(200, 300);
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
#test {
  paint-order: stroke;
}
</style>
