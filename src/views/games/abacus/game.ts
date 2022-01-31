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
import {AbacusBoard} from "./board";
import {Swiper, SwiperSlide} from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import {AbacusGameConfig} from "@/views/games/abacus/interfaces";
import TimerSoundEffect from "@@/sounds/timer.wav";
import WhistleSoundEffect from "@@/sounds/whistle.mp3";
import {SequenceItem} from "@/views/games/abacus/interfaces";

type TimerHandleKey = 'rows-timer-handle';
type SoundEffectKey = "timer-sound-effect" | "whistle-sound-effect";
type DisplayMode = "answer" | "swiper-cards" | "control-buttons" | "scores";

const TIMER_LESS_TIME_SECS = 30;

const parse = (str: string) => JSON.parse(str);

export default defineComponent({
  components: {Swiper, SwiperSlide},
  setup(_, context) {
    const abacusContainerRef = ref<HTMLElement>();
    const swiperRef = ref<VueComponent>();

    const abacusValue = ref<number>(0);
    const abacusBoard = new AbacusBoard(6);

    const config = context.root.$store.getters[
      "Abacus/config"
    ] as AbacusGameConfig;

    const sequence = ref<SequenceItem[]>(config.sequence);

    const timerEnabled = ref<boolean>(false);
    const timerAbsolute = ref<number>(config.timerSecs);
    const timerMins = ref<string>("00");
    const timerSecs = ref<string>("00");

    const completedRowsCount = ref<number>(0);
    const completedRowsPercent = ref<number>(0);

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

    const totalRowsCount = computed<number>(() => {
      let i = 0;
      for (const sequenceItem of v(sequence)) {
        i += sequenceItem.examplesCount * sequenceItem.rowsCount;
      }
      return i;
    });

    const completeExample = () => {
      completedRowsCount.value++;
      completedRowsPercent.value = v(completedRowsCount) / v(totalRowsCount) * 100;
    }

    const currentExampleHead = ref<number>(0);
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

        if(parse(dataset.ri) === 0)
          currentExampleHead.value = activeIndex;

        if (parse(dataset.ri) === 0 && !v(timerEnabled))
          enableTimer();

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

      if (v(lessTimeLeft)) {
        classes.push(...["has-text-danger", "is-shaking-text"]);
      }

      return classes;
    });

    const timerExpired = computed(() => {
      return v(timerAbsolute) === 0;
    });

    const lessTimeLeft = computed(() => {
      return v(timerAbsolute) < TIMER_LESS_TIME_SECS;
    });

    const displayControlButtons = () => (displayMode.value = "control-buttons");
    const displaySwiperCards = () => (displayMode.value = "swiper-cards");
    const displayScores = () => (displayMode.value = "scores");
    const displayAnswer = () => (displayMode.value = "answer");

    const canDisplayAbacus = computed(() => {
      return ['swiper-cards', 'control-buttons'].includes(v(displayMode));
    });

    const playTimerSoundEffect = (loop = true) => {
      const audio = new Audio(TimerSoundEffect);
      audio.loop = loop;
      sounds.set("timer-sound-effect", audio);
      return audio.play();
    };

    const v = (ref: Ref) => ref.value;

    const playWhistleSoundEffect = () => {
      const audio = new Audio(WhistleSoundEffect);
      audio.loop = false;
      sounds.set("whistle-sound-effect", audio);
      return audio.play();
    };

    const stopTimerSecsWatch = watch(timerAbsolute, () => {
      if(v(timerExpired)) {
        console.log(v(timerAbsolute));
      }

      if (v(timerAbsolute) === 0 && v(displayMode) !== 'scores') {

        if (sounds.has('timer-sound-effect'))
          sounds.get('timer-sound-effect')!.pause();

        playWhistleSoundEffect();
        displayScores();
        stopTimerSecsWatch();
      }

      if (v(lessTimeLeft) && !sounds.has("timer-sound-effect")) {
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

    function enableTimer() {
      timerEnabled.value = true;
      timerHandles.set(
        'rows-timer-handle',
        setInterval(function callback () {
          const mins = parseInt((timerAbsolute.value / 60).toString(), 10);
          const secs = parseInt((timerAbsolute.value % 60).toString(), 10);

          timerMins.value = mins < 10 ? "0" + mins : mins.toString();
          timerSecs.value = secs < 10 ? "0" + secs : secs.toString();

          if (--timerAbsolute.value < 0) {
            timerAbsolute.value = v(timerAbsolute);
          }
return callback;
        }(), 1000)
      );
    }


    function slideNext(ms = 200) {
      (swiperRef.value as any).$swiper.slideNext(ms);
    }

    function slideTo(index: number, ms = 200) {
      (swiperRef.value as any).$swiper.slideTo(index, ms);
    }

    function executeAfter(n: number, cb: () => void) {
      setTimeout(cb, n);
    }

    function onNextExample() {
      displaySwiperCards();
      executeAfter(500, slideNext);
    }

    function onShowAgain() {
      displaySwiperCards();

      executeAfter(500, () => {
        slideTo(v(currentExampleHead));
      });
    }

    function onShowAnswer() {
      displayAnswer();
    }

    // TODO: we should not use this function
    const normalizeSign = (n: BigInt)  => n > 0 ? '+ ' + n : n;

    function startGame() {
      setTimeout(() => {
        slideNext();
      }, 1000);
    }

    function drawAbacus() {
      const abacusDraw = SVG()
        .addTo(abacusContainerRef.value!)
        .viewbox(0, -55, 670, 469)
        .addClass("is-abacus-board")
        .addClass("mx-2")
        .addClass("my-2");

      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();
    }

    abacusBoard.on("update", (value) => {
      const abacusValue = BigInt((value as CustomEvent<number>).detail);
      if (config.waitForAnswer && abacusValue == v(currentAnswerMap)) {
        completeExample();

        if ((v(currentRowIndex) + 1) === v(currentExample).numbers.length) {
          setTimeout(() => {
            slideNext();
          }, v(currentSequenceItem).examplesTimeout);
          return;
        }

        slideNext();
      }
    });


    onMounted(() => {
      drawAbacus();
      startGame();
    });

    return {
      onSwiperTransitionEnd,
      abacusContainerRef,
      abacusValue,
      swiperOptions,
      swiperRef,
      viewBoxWidthMap,
      attentionTexts,
      displayMode,

      onNextExample,
      onShowAgain,
      onShowAnswer,

      sequence,

      completedRowsPercent,
      completedRowsCount,

      normalizeSign,

      canDisplayAbacus,

      currentExample,

      timerEnabled,
      timerClasses,
      timerMins,
      timerSecs,
    };
  },
});
