<template>
  <div>
    <!-- bottom right timer -->
    <span
      class="
        card
        is-bordered-bottom-accent
        px-4
        py-1
        is-full-rounded is-bottom-right-screen is-abacus-game-timer
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
      <div class="hero-body p-0">
        <swiper class="swiper" ref="swiperRef" :options="swiperOptions">
          <swiper-slide>
            <svg width="100%" height="100%" viewBox="0 0 30 10">
              <text
                x="50%"
                y="50%"
                font-size="10"
                fill="#fff"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                +9
              </text>
              <!--<polygon fill="red" stroke-width="0" points="0,10 20,10 10,0" />-->
            </svg>
          </swiper-slide>
          <swiper-slide>
            <svg width="100%" height="100%" viewBox="0 0 30 10">
              <text
                x="50%"
                y="50%"
                font-size="10"
                fill="#fff"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                -3
              </text>
              <!--<polygon fill="red" stroke-width="0" points="0,10 20,10 10,0" />-->
            </svg>
          </swiper-slide>
          <swiper-slide>
            <svg width="100%" height="100%" viewBox="0 0 30 10">
              <text
                x="50%"
                y="50%"
                font-size="10"
                fill="#fff"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                -4
              </text>
              <!--<polygon fill="red" stroke-width="0" points="0,10 20,10 10,0" />-->
            </svg>
          </swiper-slide>
          <swiper-slide>
            <svg width="100%" height="100%" viewBox="0 0 30 10">
              <text
                x="50%"
                y="50%"
                font-size="10"
                fill="#fff"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                +1
              </text>
              <!--<polygon fill="red" stroke-width="0" points="0,10 20,10 10,0" />-->
            </svg>
          </swiper-slide>
        </swiper>
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
import { defineComponent, ref, onMounted, watch } from "@vue/composition-api";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { AbacusBoard } from "./board";
import { NumbersViewBox } from "./numbers-viewbox";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default defineComponent({
  components: { Swiper, SwiperSlide },
  directives: { swiper: directive },
  setup() {
    const abacusContainerRef = ref<HTMLElement>();
    const numbersContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(0);
    const swiperRef = ref<HTMLElement>();

    const swiperOptions = ref({
      //slidesPerView: 4,
      slidesPerView: "auto",
      spaceBetween: 30,
      grabCursor: true,
      centeredSlides: true,
      breakpoints: {
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        /*
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        */
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
    });

    onMounted(() => {
      const numbersDraw = SVG()
        //.viewbox(0, 0, 1000, 230)
        .addTo(numbersContainerRef.value!)
        .addClass("is-abacus-display-box");

      const numbers = ["+4", "+1", "-2", "+4"];
      const answerMap = [9, 6, 2, 3];

      const abacusDraw = SVG()
        .addTo(abacusContainerRef.value!)
        .viewbox(0, -55, 670, 469)
        .addClass("is-abacus-board")
        .addClass("mx-2")
        .addClass("my-2");

      const numberViewBox = new NumbersViewBox(numbers);
      numbersDraw.add(numberViewBox);
      numberViewBox.draw();

      const abacusBoard = new AbacusBoard(6).id("abacus-board");
      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();

      //numberViewBox.display(0);
      let currentIndex = 0;

      abacusBoard.on("update", (value) => {
        abacusValue.value = (value as CustomEvent<number>).detail;
      });

      watch(abacusValue, (curr) => {
        if (curr === answerMap[currentIndex]) {
          currentIndex++;
          console.log(swiperRef.value.$swiper.slideTo(currentIndex));
        }
      });
    });

    return {
      numbersContainerRef,
      abacusContainerRef,
      abacusValue,
      swiperOptions,
      swiperRef,
    };
  },
});
</script>
<style lang="scss">
@import "bulma/sass/utilities/mixins";

.swiper {
  width: 90%;
  height: 15em;
  margin-bottom: 18em;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    font-size: 9em;
    background-color: rgba(26, 188, 156, 0.2);
    border-radius: 20px;
    color: white;
  }

  .swiper-slide-active {
    background-color: #1abc9c;
    box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
      0 15px 40px rgba(166, 173, 201, 0.2);
  }
}
/*
   2-3: 12em
   4: 9em
   5: 7em
   6: 6em
   7: 5em
*/

$font-sizes-h: (
  1: 12em,
  2: 10em,
  3: 12em,
  4: 8em,
  5: 6em,
  6: 5em,
  7: 4em,
);

@each $char-len, $font-size in $font-sizes-h {
  .is-abacus-display-number-#{$char-len}-1 {
    @if $char-len < 5 {
      font-size: $font-size - 25;
    } @else {
      font-size: $font-size;
    }
  }

  .is-display-number-#{$char-len}-2 {
    @if $char-len < 5 {
      font-size: $font-size - 15;
    } @else {
      font-size: $font-size;
    }
  }

  .is-display-number-#{$char-len}-3 {
    font-size: $font-size;
  }
}

@include desktop {
  .is-abacus-display-box {
    width: 80%;
    margin-bottom: 18rem;
  }
}

@include touch {
  .is-abacus-display-box {
    width: 95%;
    margin-bottom: 10rem;
  }
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
