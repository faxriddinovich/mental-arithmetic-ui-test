import {
  defineComponent,
  ref,
  onMounted,
  watch,
  computed,
  Ref,
} from "@vue/composition-api";
import VueComponent from "vue";
import {SVG} from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import {AbacusBoard} from "./board";
import {Swiper, SwiperSlide} from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import {AbacusGameConfig} from "@/views/games/abacus/interfaces";
import TimerSoundEffect from "@@/sounds/timer.wav";
import WhistleSoundEffect from "@@/sounds/whistle.mp3";
import {SequenceItem} from "@/views/games/abacus/interfaces";

type TimerHandleKey = 'attention-text-timer-handle' | 'rows-timer-handle';
type SoundEffectKey = "timer-sound-effect" | "whistle-sound-effect";
type DisplayMode = "answer" | "swiper-cards" | "control-buttons" | "scores";

const TIMER_LESS_TIME_SECS = 30;

const parse = (str: string) => JSON.parse(str);

export default defineComponent({
  components: {Swiper, SwiperSlide},
  setup(_, context) {
    const abacusContainerRef = ref<HTMLElement>();
    const numbersContainerRef = ref<HTMLElement>();
    const abacusValue = ref<number>(0);
    const swiperRef = ref<VueComponent>();

    const sequence = ref<SequenceItem[]>([]);

    const config = context.root.$store.getters[
      "Abacus/config"
    ] as AbacusGameConfig;
    sequence.value.push(...config.sequence);

    const timerAbsolute = ref<number>(0);
    const timerMins = ref<string>("00");
    const timerSecs = ref<string>("00");

    const attentionTexts = ["Ready?", "Go!"];

    const displayMode = ref<DisplayMode>("swiper-cards");

    const sounds = new Map<SoundEffectKey, HTMLAudioElement>();
    const timerHandles = new Map<TimerHandleKey, NodeJS.Timer>();

    const currentSequenceItem = computed(() => {
      return v(sequence)[v(currentSequenceItemIndex)] || null;
    });

    const currentExample = computed(() => {
      if (!(v(currentSequenceItem))) return null;
      return v(currentSequenceItem).examples[v(currentExampleIndex)] || null;
    });

    const currentAnswerMap = computed(() => {
      if (!v(currentExample)) return null;
      return v(currentExample).answerMap[v(currentRowIndex)] || null;
    });

    const currentRow = computed(() => {
      if (!v(currentExample)) return null;
      return v(currentExample).numbers[v(currentRowIndex)];
    });

    const currentSlideIndex = ref<number>(0);
    const currentSequenceItemIndex = ref<number>(0);
    const currentExampleIndex = ref<number>(0);
    const currentRowIndex = ref<number>(0);

    const onSwiperTransitionEnd = () => {
      const activeIndex = (swiperRef.value as any).$swiper
        .activeIndex as number;
      const currentSlide = (
        (swiperRef.value as any).$swiper.slides as HTMLElement[]
      )[activeIndex];
      const dataset = currentSlide.dataset;

      if (dataset.at) {
        setTimeout(() => {
          slideNext();
        }, 1000);
      } else if (dataset.ri) {

        if (parse(dataset.ri) === 0)
          abacusBoard.reset();

        if (!config.waitForAnswer) {
          if ((parse(dataset.ri) + 1) === v(currentExample).numbers.length) {
            setTimeout(() => {
              displayControlButtons();
            }, 500);
          } else {
            setTimeout(() => {
              slideNext();
            }, v(currentSequenceItem).rowsTimeout * 1000);
          }
        }

        currentSequenceItemIndex.value = parse(dataset.si!);
        currentExampleIndex.value = parse(dataset.ei!);
        currentRowIndex.value = parse(dataset.ri!);
      }

      currentSlideIndex.value = activeIndex;
    };

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
      return v(timerAbsolute) < 30;
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

    const v = (ref: Ref) => ref.value;

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
      timerHandles.set(
        'rows-timer-handle',
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

    //timerCountDown(40);

    function slideNext(ms: number = 200) {
      (swiperRef.value as any).$swiper.slideNext(ms);
    }

    function onNextExample() {
      displaySwiperCards();

      if (config.waitForAnswer)
        return slideNext();
    }

    function startGame() {
      setTimeout(() => {
        slideNext();
      }, 1000);
    }

    const abacusBoard = new AbacusBoard(6);

    onMounted(() => {
      const abacusDraw = SVG()
        .addTo(abacusContainerRef.value!)
        .viewbox(0, -55, 670, 469)
        .addClass("is-abacus-board")
        .addClass("mx-2")
        .addClass("my-2");

      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();

      abacusBoard.on("update", (value) => {
        const abacusValue = BigInt((value as CustomEvent<number>).detail);
        if (config.waitForAnswer && abacusValue == v(currentAnswerMap)) {
          if ((v(currentRowIndex) + 1) === v(currentExample).numbers.length) {
            setTimeout(() => {
              slideNext();
            }, v(currentSequenceItem).examplesTimeout);
            return;
          }

          slideNext();
        }
      });

      startGame();
    });

    return {
      onSwiperTransitionEnd,
      numbersContainerRef,
      abacusContainerRef,
      abacusValue,
      swiperOptions,
      swiperRef,
      viewBoxWidthMap,
      attentionTexts,
      displayMode,

      onNextExample,

      sequence,

      timerClasses,
      timerMins,
      timerSecs,
    };
  },
});
