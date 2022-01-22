<template>
  <div>
    <!-- controls bar -->
    <section
      class="card is-bordered is-controls-bar"
      v-if="displayMode !== 'scores'"
    >
      <div class="p-2">
        <div
          class="is-flex is-align-items-center is-justify-content-space-between"
        >
          <b-button
            tag="router-link"
            :to="{ name: 'AbacusGameForm' }"
            type="is-primary is-light"
            icon-left="arrow-left"
            size="is-medium"
            >Back</b-button
          >
          <div class="is-flex is-align-items-center">
            <span v-if="displayingAttentionTexts">
              <b-icon icon="abacus" size="is-large" type="is-primary" />
            </span>
            <span v-else>
              <span :class="timerClasses">
                <b-icon icon="stopwatch" size="is-medium" />

                {{ timerMins }}:{{ timerSecs }}</span
              >
            </span>
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
    <div ref="abacusContainerRef" v-if="displayMode !== 'scores'"></div>

    <!-- display screen -->
    <section class="hero is-fullheight">
      <div class="hero-body is-justify-content-center p-0">
        <div
          v-if="displayMode === 'control-buttons'"
          style="margin-bottom: 19em"
        >
          <div
            class="
              has-text-centered
              is-size-4-touch is-size-2-desktop
              mb-5
              mx-4
              has-text-weight-semibold
            "
          >
            <span>Please solve the expressions sequentially</span>
          </div>
          <div class="buttons is-justify-content-center">
            <b-button icon-left="redo">Show again</b-button>
            <b-button icon-left="align-left-justify">Answer</b-button>
            <b-button type="is-link" icon-right="arrow-right">Next</b-button>
          </div>
        </div>
        <!-- scores display -->
        <div
          class="columns is-gapless is-centered"
          style="min-width: 100%"
          v-else-if="displayMode === 'scores'"
        >
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
                  <b-button icon-left="arrow-left" expanded>Back</b-button>
                  <b-button class="ml-2" icon-left="refresh" expanded
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
          v-else-if="displayMode === 'swiper-cards'"
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
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  computed,
} from "@vue/composition-api";
import VueComponent from "vue";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { AbacusBoard } from "./board";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import TimerSoundEffect from "@@/sounds/timer.wav";
import WhistleSoundEffect from "@@/sounds/whistle.mp3";

type SoundEffectKey = "timer-sound-effect" | "whistle-sound-effect";
type DisplayMode = "answer" | "swiper-cards" | "control-buttons" | "scores";

const TIMER_LESS_TIME_SECS = 30;

export default defineComponent({
  components: { Swiper, SwiperSlide },
  setup() {
    const abacusContainerRef = ref<HTMLElement>();
    const numbersContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(0);
    const swiperRef = ref<VueComponent>();

    const timerAbsolute = ref<number>(0);
    const timerMins = ref<string>("2");
    const timerSecs = ref<string>("1");

    const attentionTexts = ["Ready?", "Go!"];

    const displayMode = ref<DisplayMode>("swiper-cards");
    const displayingAttentionTexts = ref<boolean>(true); // NOTE: can we avoid using this?

    const sounds = new Map<SoundEffectKey, HTMLAudioElement>();
    const timerHandles = new Set();

    /* STATIC VALUES */
    const numbers = ref(["+99999", "-3", "-4", "+1"]);
    const answerMap = [9, 6, 2, 3];
    const currentAnswerMapIndex = ref<number>(0);
    const currentSwiperIndex = ref<number>(0);
    const waitForAnswer = false;
    const rowsTimeout = 300;

    const timerClasses = computed<string[]>(() => {
      const classes: string[] = [
        "ml-1",
        "is-size-3",
        "has-text-weight-semibold",
      ];

      if (lessTimeLeft.value) {
        classes.push(...["has-text-danger", "is-shaking-text"]);
      }

      return classes;
    });

    const timerExpired = computed(() => {
      return parseInt(timerMins.value) === 0 && parseInt(timerSecs.value) === 0;
    });

    const lessTimeLeft = computed(() => {
      return (
        parseInt(timerMins.value) === 0 &&
        parseInt(timerSecs.value) < TIMER_LESS_TIME_SECS
      );
    });

    const displayControlButtons = () => (displayMode.value = "control-buttons");
    const displaySwiperCards = () => (displayMode.value = "swiper-cards");
    const displayScores = () => (displayMode.value = "scores");
    const displayAnswer = () => (displayMode.value = "answer");

    const playTimerSoundEffect = (loop = true) => {
      const audio = new Audio(TimerSoundEffect);
      audio.loop = loop;
      sounds.set("timer-sound-effect", audio);
      return audio.play();
    };
    
    const attentionTextDisplay = computed(() => {
      return true;
    });

    const playWhistleSoundEffect = (loop = true) => {
      const audio = new Audio(WhistleSoundEffect);
      audio.loop = true;
      sounds.set("whistle-sound-effect", audio);
      return audio.play();
    };

    const stopTimerSecsWatch = watch(timerSecs, () => {
      const mins = parseInt(timerMins.value);
      const secs = parseInt(timerSecs.value);

      if (lessTimeLeft.value && !sounds.has("timer-sound-effect")) {
        playTimerSoundEffect();
      }
    });

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

    function timerCountDown(duration: number) {
      timerAbsolute.value = duration;
      timerHandles.add(
        setInterval(() => {
          const mins = parseInt((timerAbsolute.value / 60).toString(), 10);
          const secs = parseInt((timerAbsolute.value % 60).toString(), 10);

          timerMins.value = mins < 10 ? "0" + mins : mins.toString();
          timerSecs.value = secs < 10 ? "0" + secs : secs.toString();

          if (--timerAbsolute.value < 0) {
            timerAbsolute.value = duration;
          }
        }, 1000)
      );
    }

    timerCountDown(40);

    function displayAttentionTexts() {
      const timerHandle = setInterval(() => {
        if (currentSwiperIndex.value !== attentionTexts.length) {
          (swiperRef.value as any).$swiper.slideTo(currentSwiperIndex.value); // FIXME: fix ts errors
          currentSwiperIndex.value++;
        } else {
          clearInterval(timerHandle);

          timerHandles.add(
            setTimeout(() => {
              displayingAttentionTexts.value = false;
              displayRows();
            }, 500)
          );
        }
      }, 800);

      timerHandles.add(timerHandle);
    }

    function displayRows() {
      const timerHandle = setInterval(
        (function callback() {
          const totalLength = numbers.value.length + attentionTexts.length;
          if (currentSwiperIndex.value !== totalLength) {
            (swiperRef.value as any).$swiper.slideTo(currentSwiperIndex.value); // FIXME: fix ts errors
            currentSwiperIndex.value++;
          } else {
            clearInterval(timerHandle!);
          }
          return callback;
        })(),
        1000
      );
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
      displayMode,
      displayingAttentionTexts,

      timerClasses,
      timerMins,
      timerSecs,
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
