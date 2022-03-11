import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  computed,
  Ref,
} from "@vue/composition-api";
import { SVG } from "@svgdotjs/svg.js";
import { AbacusBoard } from "./board";
import TimerSoundEffect from "@@/sounds/timer.wav";
import WhistleSoundEffect from "@@/sounds/whistle.mp3";
import VictorySoundEffect from "@@/sounds/victory.mp3";
import { SequenceItem } from "@/views/games/abacus/interfaces";
import { acquireGame, GAME_KIND } from "@/store/game";
import { acquireExample } from "@/store/example";
import { acquireSetting } from "@/store/setting";
import confettiLib from "canvas-confetti";
import { Operation } from '@mental-arithmetic/themes';

import ScalableText from "@/components/scalable-text.vue";
import "@egjs/vue-flicking/dist/flicking.css";
import { Flicking, FlickingOptions, ChangedEvent } from "@egjs/vue-flicking";
import { speak } from "@/services/tts";

import StackedCards from "@/components/stacked-cards.vue";

import {
  ABACUS_STONE_WIDTH,
  ABACUS_FRAME_WIDTH,
  ABACUS_FRAME_ABSOLUTE_X_PADDING,
} from "./constants";

type TimerHandleKey = "rows-timer-handle" | number;
type SoundEffectKey =
  | "timer-sound-effect"
  | "whistle-sound-effect"
  | "victory-sound-effect";
type DisplayMode = "answer" | "cards" | "wait" | "scores";

const MIN_ROWS_PERCENT_TO_WIN = 50;
const TIMER_LESS_TIME_SECS = 30;

const parse = (str: string) => JSON.parse(str);

export default defineComponent({
  components: {
    Flicking,
    ScalableText,
    StackedCards,
  },
  setup(_) {
    const abacusContainerRef = ref<HTMLElement>();
    const confettiRef = ref<HTMLCanvasElement>();
    const flickingRef = ref<Flicking>();
    const flickingOptions = ref<Partial<FlickingOptions>>({
      align: "center",
      renderOnlyVisible: true,
      disableOnInit: true,
      autoResize: true,
    });

    const config = acquireGame().get(GAME_KIND.ABACUS)!;
    const sequence = ref<SequenceItem[]>(config.sequence);
    const examplesGenerated = !!config.sequence[0].examples.length;
    if (!examplesGenerated) generateExamples();

    // TODO: since the length of examples may be very long,
    // it may block the main thread. We should consider using
    // worker threads.
    function generateExamples() {
      const example = acquireExample();
      for (const sequenceItem of config.sequence) {
        const examples = example.gen(
          sequenceItem.theme,
          sequenceItem.examplesCount,
          sequenceItem.rowsCount,
          sequenceItem.digit
        );

        sequenceItem.examples.push(...examples);
      }
    }

    const abacusValue = ref<number>(0);
    const abacusBoard = new AbacusBoard(config.abacusColumnsCount);

    const wonTheGame = computed<boolean>(() => {
      return v(completedExamplesPercent) >= MIN_ROWS_PERCENT_TO_WIN;
    });

    const timerEnabled = ref<boolean>(false);
    const timerAbsolute = ref<number>(config.timerSecs);

    const accumulatedSequenceScores = ref<number>(0);
    const completedExamplesCount = ref<number>(0);

    const completedExamplesPercent = computed<number>(() => {
      return (v(completedExamplesCount) / v(totalExamplesCount)) * 100;
    });

    // FIXME: transalte me
    const attentionTexts = ref(["Good luck!"]);

    const displayMode = ref<DisplayMode>("cards");

    const sounds = new Map<SoundEffectKey, HTMLAudioElement>();
    const timerHandles = new Map<TimerHandleKey, NodeJS.Timer>();

    const currentSequenceItem = computed(() => {
      return v(sequence)[v(currentSequenceItemIndex)] || null;
    });

    const currentExample = computed(() => {
      if (!v(currentSequenceItem)) return null;
      return v(currentSequenceItem).examples[v(currentExampleIndex)] || null;
    });

    const currentAnswer = computed(() => {
      if (!v(currentExample)) return null;
      return v(currentExample).answerMap[v(currentAnswerIndex)] || null;
    });

    const totalExamplesCount = computed<number>(() => {
      let i = 0;
      //prettier-ignore
      for (const sequenceItem of v(sequence))
        i += sequenceItem.examplesCount;
      return i;
    });

    function speechSpeak(text: string | number) {
      // FIXME: fix the speech rate
      const speechRate =
        config.rowsTimeout >= 1
          ? 1
          : 1 + config.rowsTimeout + String(text).length / 2;

      const voiceID = acquireSetting().one("text_to_speech_id");
      speak(text, speechRate, voiceID);
    }

    const completeExample = () => {
      accumulatedSequenceScores.value++;
      completedExamplesCount.value++;
    }

    const currentExampleHead = ref<number>(0);
    const currentSequenceItemHead = ref<number>(0);
    const currentSequenceItemIndex = ref<number>(0);
    const currentExampleIndex = ref<number>(0);
    const currentRowIndex = ref<number>(0);
    const currentAnswerIndex = ref<number>(0);

    const onCardChanged = (event: ChangedEvent) => {
      const { currentPanel } = event.currentTarget;
      const activeIndex = currentPanel.index;

      const currentSlide = currentPanel.element;
      const dataset = currentSlide.dataset;

      if(!dataset) return;

      // header cards
      if (!dataset.si) {
        if (config.waitForAnswer) abacusBoard.lock();
        // clear the answer index
        currentAnswerIndex.value = 0;
        // it doesn't make any sense to keep the old stones,
        // so we just reset the board
        abacusBoard.reset();

        return invokeAfter(() => slideNext(), 300);
      }

      if (parse(dataset.si!) !== v(currentSequenceItemIndex))
        accumulatedSequenceScores.value = 0;

      if(parse(dataset.ei!) !== v(currentExampleIndex))
        //accumulatedExampleScores.value = 0;

      if(parse(dataset.ei!) === 0 && parse(dataset.ri!) === 0) {
        currentSequenceItemHead.value = activeIndex;
      }

      // the abacus board was locked, now we can safely unlock it
      abacusBoard.unlock();

      // if the current card is the first one
      if (parse(dataset.ri!) === 0) {
        currentExampleHead.value = activeIndex;
        // if timer is not enabled, then we enable it
        if (!v(timerEnabled)) enableTimer();
      }

      // if speech sound is enabled
      if (config.speechSound) speechSpeak(String(dataset.rv));

      // if "wait for answer" mode is enabled
      if (!config.waitForAnswer) {
        const currentExamplesLength = v(currentExample).numbers.length;
        // is this card the last one?
        if (parse(dataset.ri!) === currentExamplesLength - 1) {
          //if (v(currentRowIndex) !== v(currentExample).numbers.length - 1) {
          displayWait();
          //}
        } else {
          // if this isn't not, then we just show the next card
          invokeAfter(() => toNextCard(), config.rowsTimeout * 1000);
        }
      }

      currentSequenceItemIndex.value = parse(dataset.si);
      currentExampleIndex.value = parse(dataset.ei!);
      currentRowIndex.value = parse(dataset.ri!);
      currentAnswerIndex.value = parse(dataset.ri!);
    };

    const trophyClasses = computed<string[]>(() => {
      const classes = ["is-block", "is-trophy"];
      if (!v(wonTheGame)) classes.push("is-lost");
      return classes;
    });

    const gameScoresTextClasses = computed<string[]>(() => {
      const classes = [
        " has-text-centered",
        "is-size-1",
        "has-text-weight-bold",
      ];

      if (v(wonTheGame)) classes.push("has-text-success");
      else classes.push("has-text-danger");

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

    const isFinalCard = computed(() => {
      const lastSequenceItem = !v(sequence)[v(currentSequenceItemIndex) + 1];
      const lastExampleItem =
        !v(currentSequenceItem).examples[v(currentExampleIndex) + 1];
      const lastRowItem = !v(currentExample).numbers[v(currentRowIndex) + 1];
      return lastSequenceItem && lastExampleItem && lastRowItem;
    });

    const playConfettiAnimation = () => {
      const confetti = confettiLib.create(confettiRef.value!, {
        resize: true,
        useWorker: true,
      });

      confetti({
        particleCount: 200,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 200,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    };

    const displayWait = () => (displayMode.value = "wait");
    const displayCards = () => (displayMode.value = "cards");
    const displayScores = () => (displayMode.value = "scores");
    const displayAnswer = () => (displayMode.value = "answer");

    const finishGame = () => {
      clearSoundEffects();
      clearTimerHandles();
      setTimeout(() => {
        if (v(wonTheGame)) playVictorySoundEffect();
        displayScores();
        if (v(wonTheGame)) playConfettiAnimation();
      }, 1000);
    };

    const canDisplayAbacus = computed(() => {
      return ["cards", "wait"].includes(v(displayMode));
    });

    const playTimerSoundEffect = (loop = true) => {
      const audio = new Audio(TimerSoundEffect);
      audio.loop = loop;
      sounds.set("timer-sound-effect", audio);
      return audio.play();
    };

    const playVictorySoundEffect = () => {
      const audio = new Audio(VictorySoundEffect);
      sounds.set("victory-sound-effect", audio);
      return audio.play();
    };

    const playWhistleSoundEffect = () => {
      const audio = new Audio(WhistleSoundEffect);
      audio.loop = false;
      sounds.set("whistle-sound-effect", audio);
      return audio.play();
    };

    const v = (ref: Ref) => ref.value;

    function invokeAfter(fn: Function, ms = 1000) {
      const uniq = Date.now();
      const timerHandle = setTimeout(() => {
        fn();
        timerHandles.delete(uniq);
      }, ms);
      timerHandles.set(uniq, timerHandle);
    }

    function enableTimer() {
      timerEnabled.value = true;
      timerHandles.set(
        "rows-timer-handle",
        setInterval(() => {
          if (v(timerAbsolute) > 0) {
            timerAbsolute.value -= 1;
          }

          if (v(lessTimeLeft) && !sounds.has("timer-sound-effect")) {
            playTimerSoundEffect();
          } else if (v(timerExpired)) {
            if (sounds.has("timer-sound-effect"))
              sounds.get("timer-sound-effect")!.pause();

            playWhistleSoundEffect();
            finishGame();
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

    function toNextCard() {
      const rowsCount = v(currentExample).numbers.length;
      const examplesCount = v(currentSequenceItem).examples.length;
      const sequenceItemsCount = config.sequence.length;

      abacusBoard.lock();
      if (v(currentRowIndex) === rowsCount - 1) {
        if (v(currentExampleIndex) === examplesCount - 1) {
          if (v(currentSequenceItemIndex) === sequenceItemsCount - 1) {
            return finishGame();
          }
          return invokeAfter(() => slideNext(), 500);
        }
        return invokeAfter(() => slideNext(), config.examplesTimeout * 1000);
      }

      invokeAfter(() => slideNext(), config.rowsTimeout * 1000);
    }

    function onNextExample() {
      // TODO better solution
      if (v(isFinalCard)) {
        finishGame();
        return;
      }

      displayCards();
      invokeAfter(() => slideNext(), 500);
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
    };

    const clearTimerHandles = () => {
      for (const [timerHandleKey, timerHandle] of timerHandles.entries()) {
        clearInterval(timerHandle);
        timerHandles.delete(timerHandleKey);
      }
    };

    const clearGameState = () => {
      currentRowIndex.value = 0;
      currentExampleIndex.value = 0;
      currentSequenceItemIndex.value = 0;
      completedExamplesCount.value = 0;
      currentExampleHead.value = 0;
      clearSoundEffects();
      clearTimerHandles();
      clearTimer();
    };

    const clearTimer = () => {
      timerEnabled.value = false;
      timerAbsolute.value = config.timerSecs;
    };

    const onRepeat = () => {
      clearGameState();
      displayCards();
      invokeAfter(() => slideTo(0), 500);
    };

    function onReshowCurrentTheme() {
      displayCards();
      completedExamplesCount.value -= accumulatedSequenceScores.value;
      accumulatedSequenceScores.value = 0;
      invokeAfter(() => slideTo(v(currentSequenceItemHead)), 500);
    }

    function onReshowCurrentExample() {
      displayCards();
      invokeAfter(() => slideTo(v(currentExampleHead)), 500);
    }

    function startGame() {
      setTimeout(() => {
        slideNext();
      }, 1000);
    }

    function drawAbacus() {
      const width =
        ABACUS_STONE_WIDTH * config.abacusColumnsCount +
        ABACUS_FRAME_WIDTH +
        ABACUS_FRAME_ABSOLUTE_X_PADDING;

      const abacusDraw = SVG()
        .addTo(abacusContainerRef.value!)
        .viewbox(0, -55, width, 469)
        .addClass("is-abacus-board");

      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();
      abacusBoard.lock();
    }

    abacusBoard.on("update", (value) => {
      const abacusValue = BigInt((value as CustomEvent<number>).detail);

      // if the answer is correct
      if (abacusValue == v(currentAnswer)) {
        const rowsCount = v(currentExample).numbers.length;
        const lastRowItem = v(currentRowIndex) === rowsCount - 1;

        if(lastRowItem)
          completeExample();

        if (config.waitForAnswer)
          return toNextCard();

        currentAnswerIndex.value++;
        if (lastRowItem) {
          if(!config.waitForAnswer) {
            if(v(displayMode) === 'wait') 
              displayCards();
          }
          return toNextCard();
        }
      }
    });

    onMounted(() => {
      drawAbacus();
      startGame();
    });

    onUnmounted(() => {
      clearGameState();
    });

    return {
      abacusContainerRef,
      confettiRef,
      flickingRef,
      flickingOptions,
      abacusValue,
      attentionTexts,
      displayMode,

      onNextExample,
      onShowAgain,
      onShowAnswer,
      onRepeat,
      onReshowCurrentTheme,
      onReshowCurrentExample,

      sequence,
      config,
      timerAbsolute,

      wonTheGame,

      onCardChanged,

      completedExamplesPercent,
      completedExamplesCount,

      totalExamplesCount,

      canDisplayAbacus,

      currentExample,

      timerEnabled,
      timerClasses,

      trophyClasses,
      gameScoresTextClasses,
    };
  },
});
