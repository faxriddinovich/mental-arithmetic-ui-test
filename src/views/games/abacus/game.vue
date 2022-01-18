<template>
  <div>
    <!-- bottom right timer -->
    <!--
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
      <span class="is-size-3 ml-1">1:00</span>
    </span>
    -->
    <!-- end timer -->

    <!-- controls bar -->
    <section class="card is-bordered is-controls-bar" v-if="displayMode === 'swiper-cards'">
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

    <!-- abacus board -->
    <div ref="abacusContainerRef" v-if="displayMode === 'swiper-cards'"></div>

    <!-- display screen -->
    <section class="hero is-fullheight">
      <div class="hero-body p-0">
        <!-- scores display -->

        <div class="columns is-gapless is-centered" style="min-width: 100%" v-if="displayMode === 'scores'">
          <div class="column is-5-fullhd is-three-quarters-desktop">
            <div class="box mx-2">
              <img
                class="is-block is-victory-trophy"
                :src="require('@@/img/trophy.svg')"
              />
              <div class="p-4">
                <div
                  class="
                    has-text-centered
                    is-size-2
                    has-text-weight-semibold has-text-success
                  "
                >
                  Victory!
                </div>

                <b-progress size="is-large" type="is-success" show-value>
                  <template #bar>
                    <b-progress-bar :value="60"></b-progress-bar>
                    <b-progress-bar
                      :value="20"
                      type="is-danger"
                    ></b-progress-bar>
                    <b-progress-bar :value="20" type="is-dark"></b-progress-bar>
                  </template>
                </b-progress>
                <nav class="level is-mobile">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Correct</p>
                      <p class="title has-text-success">60</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Incorrect</p>
                      <p class="title has-text-danger">20</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Spent time</p>
                      <p class="title">00:32</p>
                    </div>
                  </div>
                </nav>
                <hr class="mb-5" />
                <div class="is-flex">
                  <b-button icon-left="arrow-left" expanded
                    >Back</b-button
                  >
                  <b-button
                    class="ml-2"
                    icon-left="refresh"
                    expanded
                    >Repeat</b-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end scores display -->

        <swiper
          class="swiper"
          ref="swiperRef"
          :options="swiperOptions"
          :auto-destroy="true"
          :delete-instance-on-destroy="true"
          :cleanup-styles-on-destroy="true"
          v-else
        >
          <swiper-slide
            class="is-attention-text"
            v-for="(text, index) of attentionTexts"
            :key="'a' + index"
            >{{ text }}</swiper-slide
          >

          <swiper-slide v-for="(number, index) of numbers" :key="index">
            <svg
              width="100%"
              height="100%"
              :viewBox="`0 0 ${viewBoxWidthMap[number.length]} 10`"
            >
              <text
                x="50%"
                y="50%"
                font-size="10"
                fill="#fff"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                {{ number }}
              </text>
            </svg>
          </swiper-slide>
        </swiper>
      </div>
    </section>
    <!-- end display screen -->
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "@vue/composition-api";
import VueComponent from "vue";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { AbacusBoard } from "./board";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

type DisplayMode = 'swiper-cards' | 'scores';

export default defineComponent({
  components: { Swiper, SwiperSlide },
  setup() {
    const abacusContainerRef = ref<HTMLElement>();
    const numbersContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(0);
    const swiperRef = ref<VueComponent>();

    const attentionTexts = ["Ready?", "Go!"];

    const displayMode = ref<DisplayMode>('swiper-cards');

    /* STATIC VALUES */
    const numbers = ref(["+99999", "-3", "-4", "+1"]);
    const answerMap = [9, 6, 2, 3];
    const currentAnswerMapIndex = ref<number>(0);
    const currentSwiperIndex = ref<number>(0);
    const waitForAnswer = false;
    const rowsTimeout = 300;

    const viewBoxWidthMap = ref({
      2: 25,
      3: 25,
      4: 28,
      5: 33,
      6: 40,
      7: 46,
    });

    const swiperOptions = ref({
      //slidesPerView: 4,
      allowTouchMove: false,
      slidesPerView: "auto",
      spaceBetween: 30,
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
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
    });

    const timerHandles = new Set();
    function displayAttentionTexts() {
      const timerHandle = setInterval(() => {
        if (currentSwiperIndex.value !== attentionTexts.length) {
          (swiperRef.value as any).$swiper.slideTo(currentSwiperIndex.value); // FIXME: fix ts errors
          currentSwiperIndex.value++;
        } else {
          displayRows();
          clearInterval(timerHandle);
        }
      }, 800);

      timerHandles.add(timerHandle);
    }

    function displayRows() {
      const timerHandle = setInterval(() => {
        const totalLength = numbers.value.length + attentionTexts.length;
        if (currentSwiperIndex.value !== totalLength) {
          (swiperRef.value as any).$swiper.slideTo(currentSwiperIndex.value); // FIXME: fix ts errors
          currentSwiperIndex.value++;
        } else {
          clearInterval(timerHandle);
        }
      }, 1000);
      timerHandles.add(timerHandle);
    }

    function startGame() {
      displayAttentionTexts();
    }

    onMounted(() => {
      const abacusDraw = SVG()
        .addTo(abacusContainerRef.value!)
        .viewbox(0, -55, 670, 469)
        .addClass("is-abacus-board")
        .addClass("mx-2")
        .addClass("my-2");

      const abacusBoard = new AbacusBoard(6);
      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();

      let currentIndex = 0;
      abacusBoard.on("update", (value) => {
        abacusValue.value = (value as CustomEvent<number>).detail;
      });

      watch(abacusValue, (curr) => {
        if (curr === answerMap[currentIndex]) {
          currentIndex++;
        }
      });

      startGame();
    });

    return {
      numbersContainerRef,
      abacusContainerRef,
      abacusValue,
      swiperOptions,
      swiperRef,
      numbers,
      viewBoxWidthMap,
      attentionTexts,
      displayMode
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
    background-color: rgba(26, 188, 156, 0.1);
    border-radius: 20px;
    color: white;
  }

  .swiper-slide-active {
    background-color: #1abc9c;
    box-shadow: 0px 0px 100px -13px rgba(0, 0, 0, 0.14) inset;
    -webkit-box-shadow: 0px -1px 100px -13px rgba(0, 0, 0, 0.14) inset;
    -moz-box-shadow: 0px -1px 100px -13px rgba(0, 0, 0, 0.14) inset;
  }

  .is-attention-text {
    background-color: rgba(230, 126, 34, 0.1);
    font-size: 5em;
  }

  .swiper-slide-active.is-attention-text {
    background-color: rgb(230, 126, 34);
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

img.is-victory-trophy {
  width: 200px;
  margin-top: -100px;
  margin-left: auto;
  margin-right: auto;
}

@include mobile {
  img.is-victory-trophy {
    width: 150px;
    margin-top: -75px;
  }
}
</style>
