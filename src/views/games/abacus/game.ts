import {
  defineComponent,
  ref,
  onMounted,
  computed,
  Ref,
} from "@vue/composition-api";
import {SVG} from "@svgdotjs/svg.js";
import {AbacusBoard} from "./board";
import {AbacusGameConfig} from "@/views/games/abacus/interfaces";
import TimerSoundEffect from "@@/sounds/timer.wav";
import WhistleSoundEffect from "@@/sounds/whistle.mp3";
import {SequenceItem} from "@/views/games/abacus/interfaces";
import confettiLib from 'canvas-confetti';

import ScalableText from '@/components/scalable-text.vue';
import "@egjs/vue-flicking/dist/flicking.css";
import { Flicking, FlickingOptions } from '@egjs/vue-flicking';

import ControlButtonsDisplay from './displays/control-buttons-display.vue';
import AnswerDisplay from './displays/answer-display.vue';
import ScoresDisplay from './displays/scores-display.vue';

type TimerHandleKey = 'rows-timer-handle';
type SoundEffectKey = "timer-sound-effect" | "whistle-sound-effect";
type DisplayMode = "answer" | "cards" | "control-buttons" | "scores";

const MIN_ROWS_PERCENT_TO_WIN = 50;
const TIMER_LESS_TIME_SECS = 30;

const parse = (str: string) => JSON.parse(str);

export default defineComponent({
  components: {
    Flicking,
    ScalableText,

    ControlButtonsDisplay,
    AnswerDisplay, ScoresDisplay
  },
  setup(_, context) {
    const abacusContainerRef = ref<HTMLElement>();
    const confettiRef = ref<HTMLCanvasElement>();
    const flickingRef = ref<Flicking>();
    const flickingOptions = ref<Partial<FlickingOptions>>({
      align: 'center',
      renderOnlyVisible: true
    });

    const abacusValue = ref<number>(0);
    const abacusBoard = new AbacusBoard(6);

    const config = context.root.$store.getters[
      "Abacus/config"
    ] as AbacusGameConfig;

    const sequence = ref<SequenceItem[]>(config.sequence);

    const wonTheGame = computed<boolean>(() => {
      return (v(completedRowsCount) / v(totalRowsCount) * 100) >= MIN_ROWS_PERCENT_TO_WIN;
    });

    const timerEnabled = ref<boolean>(false);
    const timerAbsolute = ref<number>(config.timerSecs);

    const completedRowsCount = ref<number>(0);
    const completedRowsPercent = computed<number>(() => {
      return v(completedRowsCount) / v(totalRowsCount) * 100;
    });

    const attentionTexts = ref(["Good luck!"]);

    const displayMode = ref<DisplayMode>("cards");

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

    const totalExamplesCount = computed<number>(() => {
      let i = 0;
      for (const sequenceItem of v(sequence))
        i += sequenceItem.examplesCount;

      return i;
    });

    const totalRowsCount = computed<number>(() => {
      let i = 0;

      for (const sequenceItem of v(sequence))
        i += sequenceItem.examplesCount * sequenceItem.rowsCount;

      return i;
    });

    const completeRow = () => {
      completedRowsCount.value++;
    }

    const currentExampleHead = ref<number>(0);
    const currentSequenceItemIndex = ref<number>(0);
    const currentExampleIndex = ref<number>(0);
    const currentRowIndex = ref<number>(0);

    /*
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
        }, 200);
      } else if (dataset.ri) {
        if (parse(dataset.ri) === 0)
          abacusBoard.reset();

        if (parse(dataset.ri) === 0)
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

        if (config.waitForAnswer)
          currentRowIndex.value = parse(dataset.ri!);
      }
    };
    */

    const trophyClasses = computed<string[]>(() => {
      const classes = ['is-block', 'is-trophy'];

      if (!v(wonTheGame))
        classes.push('is-lost');

      return classes;
    });

    const gameScoresTextClasses = computed<string[]>(() => {
      const classes = [' has-text-centered', 'is-size-1', 'has-text-weight-bold'];

      if (v(wonTheGame))
        classes.push('has-text-success');
      else
        classes.push('has-text-danger');

      return classes;
    });

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

    // TODO: some weird things happen here
    const lastSequenceItem = computed(() => {
      return !v(sequence)[v(currentSequenceItemIndex) + 1];
    });

    const lastExampleItem = computed(() => {
      return !v(currentSequenceItem).examples[v(currentExampleIndex) + 1];
    });

    const lastRowItem = computed(() => {
      return !v(currentExample).numbers[v(currentRowIndex) + 1];
    });

    const playConfettiAnimation = () => {
      const confetti = confettiLib.create(confettiRef.value!, {
        resize: true,
        useWorker: true
      });

      confetti({
        particleCount: 200,
        angle: 60,
        spread: 55,
        origin: {x: 0},
      });
      confetti({
        particleCount: 200,
        angle: 120,
        spread: 55,
        origin: {x: 1},
      });
    }


    const displayControlButtons = () => (displayMode.value = "control-buttons");
    const displaySwiperCards = () => (displayMode.value = "cards");
    const displayScores = () => (displayMode.value = "scores");
    const displayAnswer = () => (displayMode.value = "answer");

    const finishGame = () => {
      clearInterval(timerHandles.get('rows-timer-handle')!);
      setTimeout(() => {
        displayScores();
        if (v(wonTheGame))
          playConfettiAnimation();
      }, 1000);
    }

    const canDisplayAbacus = computed(() => {
      return ['cards', 'control-buttons'].includes(v(displayMode));
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

    const viewBoxWidthMap = ref({
      2: 25,
      3: 25,
      4: 28,
      5: 33,
      6: 40,
      7: 46,
    });

    function enableTimer() {
      timerEnabled.value = true;
      timerHandles.set(
        'rows-timer-handle',
        setInterval(() => {
          if (v(timerAbsolute) > 0) {
            timerAbsolute.value -= 1;
          }

          if (v(lessTimeLeft) && !sounds.has('timer-sound-effect')) {
            playTimerSoundEffect();
          } else if (v(timerExpired)) {
            if (sounds.has('timer-sound-effect'))
              sounds.get('timer-sound-effect')!.pause();

            playWhistleSoundEffect();
            finishGame();
            clearInterval(timerHandles.get('rows-timer-handle')!);
          }

        }, 1000)
      );
    }

    function slideNext(ms = 200) {
      flickingRef.value!.next(ms);
    }

    function slideTo(index: number, ms = 200) {
      flickingRef.value!.moveTo(index, ms);
    }

    function onNextExample() {
      // TODO better solution
      if (v(lastSequenceItem) && v(lastExampleItem) && v(lastRowItem)) {
        finishGame();
        return;
      }

      displayCards();
      setTimeout(() => {
        slideNext();
      }, 500);
    }

    function onShowAgain() {
      displayCards();

      setTimeout(() => {
        slideTo(v(currentExampleHead));
      }, 500);
    }

    function onShowAnswer() {
      displayAnswer();
    }

    const clearSoundEffects = () => {
      for (const [soundEffectKey, soundEffect] of sounds.entries()) {
        soundEffect.pause();
        sounds.delete(soundEffectKey);
      }
    }

    const clearTimerHandles = () => {
      for (const [timerHandleKey, timerHandle] of timerHandles.entries()) {
        clearInterval(timerHandle);
        timerHandles.delete(timerHandleKey);
      }
    }

    const clearGameState = () => {
      currentRowIndex.value = 0;
      currentExampleIndex.value = 0;
      currentSequenceItemIndex.value = 0;
      completedRowsCount.value = 0;
      currentExampleHead.value = 0;
    }

    const clearTimer = () => {
      timerEnabled.value = false;
      timerAbsolute.value = config.timerSecs;
    }

    const onRepeat = () => {
      clearGameState();
      displayCards();
      clearSoundEffects();
      clearTimerHandles();
      clearTimer();

      setTimeout(() => {
        slideTo(0);
      }, 500);
    }


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
        .addClass("my-1")

      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();
    }

    abacusBoard.on("update", (value) => {
      const abacusValue = BigInt((value as CustomEvent<number>).detail);

      if (abacusValue == v(currentAnswerMap)) {
        completeRow();

        // TODO better solution
        if (v(lastSequenceItem) && v(lastExampleItem) && v(lastRowItem)) {
          finishGame();
          return;
        }

        if (!config.waitForAnswer) {
          currentRowIndex.value++;

          if (lastRowItem) {
            currentRowIndex.value = 0;
            displayCards();
            setTimeout(() => {
              slideNext();
            }, 500);
          }
          return;
        }

        setTimeout(() => {
          slideNext();
        }, 200);
      }
    });

    onMounted(() => {
      drawAbacus();
      //startGame();
    });


    return {
      abacusContainerRef,
      confettiRef,
      flickingRef,
      flickingOptions,
      abacusValue,
      viewBoxWidthMap,
      attentionTexts,
      displayMode,

      onNextExample,
      onShowAgain,
      onShowAnswer,
      onRepeat,

      sequence,
      config,
      timerAbsolute,

      wonTheGame,

      completedRowsPercent,
      completedRowsCount,

      totalExamplesCount,
      totalRowsCount,

      canDisplayAbacus,

      currentExample,

      timerEnabled,
      timerClasses,

      trophyClasses,
      gameScoresTextClasses,
    };
  },
});
