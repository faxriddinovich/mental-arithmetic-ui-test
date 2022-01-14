<template>
  <div>
    <!-- bottom right timer -->
    <span
      class="
        card
        is-bordered-bottom-accent
        px-4
        py-1
        is-full-rounded is-bottom-right-screen
        is-abacus-game-timer
        mx-3
        my-3
      "
    >
      <b-icon icon="stopwatch" size="is-medium" />
      <span class="is-size-3 ml-1">28:42</span>
    </span>
    <!-- end timer -->

    <!-- controls bar -->
    <section class="card is-bordered is-controls-bar">
      <div class="p-2">
        <div
          class="is-flex is-align-items-center is-justify-content-space-between"
        >
          <b-button
            tag="router-link"
            :to="{ name: 'BigNumbersGameForm' }"
            type="is-primary is-light"
            icon-left="arrow-left"
            size="is-medium"
            >Back</b-button
          >
          <div class="is-flex is-align-items-center">
            <b-icon icon="abacus" size="is-large" type="is-primary" />
          </div>
          <b-button
            type="is-primary is-light"
            icon-left="refresh"
            size="is-medium"
            @click="refresh"
            >Refresh</b-button
          >
        </div>
      </div>
      <b-progress type="is-success" class="completed-progress" :value="80" />
    </section>
    <!-- end controls bar -->

    <div ref="abacusContainerRef" style="display: relative"></div>

    <!-- display screen -->
    <section class="hero is-fullheight">
      <div class="hero-body is-justify-content-center is-align-items-center is-align-content-center" ref="numbersContainerRef">
        <!--
        <div class="has-text-centered" style="width: 100%">
          <span class="is-display-number-1-1">2</span>
        </div>
        <div ref="numbersContainerRef" class="is-flex is-justify-content-center is-align-items-center"></div>
        -->
      </div>
    </section>

    <!-- end display screen -->
    <!--<div ref="numbersContainerRef"></div>

    <div
      ref="abacusContainerRef"
      class="is-flex is-justify-content-center"
    ></div> -->
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
        .addClass("is-display-number");

      const abacusDraw = SVG()
        //.size(500, 400)
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
      //numberViewBox.cx(window.innerWidth / 2);
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

.is-display-number {
width: 100%;
}

.is-abacus-board {
  position: absolute;
  max-width: 650px;
  bottom: 0;
}

.is-abacus-game-timer {
  position: absolute;
}

@include tablet {
}
</style>
