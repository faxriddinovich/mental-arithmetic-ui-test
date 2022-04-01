import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
  computed,
  Ref,
} from "@vue/composition-api";
import { SVG } from "@svgdotjs/svg.js";
import { AbacusBoard } from "./board";
import TimerSoundEffect from "@@/sounds/timer.wav";
import VictorySoundEffect from "@@/sounds/victory.mp3";
import LostSoundEffect from "@@/sounds/lost.wav";
import { SequenceItem } from "@/views/games/abacus/interfaces";
import { acquireGame, GAME_KIND } from "@/store/game";
import { acquireExample } from "@/store/example";
import { acquireSetting } from "@/store/setting";
import confettiLib from "canvas-confetti";
import { Operation } from "@mental-arithmetic/themes";
import { speak } from "@/services/tts";

import StackedCards from "@/components/stacked-cards.vue";

import {
  ABACUS_STONE_WIDTH,
  ABACUS_FRAME_WIDTH,
  ABACUS_FRAME_ABSOLUTE_X_PADDING,
} from "./constants";

type TimerHandleKey = number;
type SoundEffectKey =
  | "timer-sound-effect"
  | "victory-sound-effect"
  | "lost-sound-effect";

type DisplayMode =
  | "answer"
  | "enter-answer"
  | "attention-card"
  | "row-card"
  | "scores";

const MIN_ROWS_PERCENT_TO_WIN = 50;
const TIMER_LESS_TIME_SECS = 30;
const ATTENTION_CARD_TIMEOUT = 1000;

export default defineComponent({
  components: { StackedCards },
  setup(_, context) {
    const config = acquireGame().get(GAME_KIND.ABACUS)!;

    const abacusContainerRef = ref<HTMLElement>();
    const confettiRef = ref<HTMLCanvasElement>();

    const isAnswerModalActive = ref<boolean>(false);

    const sequence = ref<SequenceItem[]>(config.sequence);

    const v = <T extends Ref>(ref: T): T extends Ref<infer K> ? K : unknown =>
      ref.value;

    generateExamples();

    // TODO: since the length of examples may be very long,
    // it may block the main thread. We should consider using
    // worker threads.
    function generateExamples() {
      const example = acquireExample();
      for (const sequenceItem of config.sequence) {
        const examples = example.gen(
          sequenceItem.theme.loc,
          sequenceItem.examplesCount,
          sequenceItem.rowsCount,
          sequenceItem.digit
        );

        sequenceItem.examples = examples;
      }
    }

    const wonTheGame = computed<boolean>(() => {
      return v(completedExamplesPercent) >= MIN_ROWS_PERCENT_TO_WIN;
    });

    const trophyClasses = computed<string[]>(() => {
      const classes = ["is-block", "abacus-game-trophy"];
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

    const completedExamplesCount = ref<number>(0);

    const completedExamplesPercent = computed<number>(() => {
      return (v(completedExamplesCount) / v(totalExamplesCount)) * 100;
    });

    const timerExpired = computed(() => {
      return v(timerAbsolute) === 0;
    });

    const lessTimeLeft = computed(() => {
      return v(timerAbsolute) < TIMER_LESS_TIME_SECS;
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

    const playLostSoundEffect = () => {
      const audio = new Audio(LostSoundEffect);
      audio.loop = false;
      sounds.set("lost-sound-effect", audio);
      return audio.play();
    };

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

    const displayRowCard = () => (displayMode.value = "row-card");
    const displayScores = () => (displayMode.value = "scores");
    const displayAnswer = () => (displayMode.value = "answer");
    const displayAttentionCard = () => (displayMode.value = "attention-card");

    function enableTimer() {
      timerEnabled.value = true;
      timerHandles.set(
        timerHandles.size,
        setInterval(() => {
          if (v(timerAbsolute) > 0) {
            timerAbsolute.value -= 1;
          }

          if (v(lessTimeLeft) && !sounds.has("timer-sound-effect")) {
            playTimerSoundEffect();
          } else if (v(timerExpired)) {
            if (sounds.has("timer-sound-effect"))
              sounds.get("timer-sound-effect")!.pause();

            finishGame();
          }
        }, 1000)
      );
    }

    /* game state */
    const displayMode = ref<DisplayMode>("attention-card");
    const sounds = new Map<SoundEffectKey, HTMLAudioElement>();
    const timerHandles = new Map<TimerHandleKey, NodeJS.Timer>();
    const timerEnabled = ref<boolean>(false);
    const timerAbsolute = ref<number>(config.timerSecs);
    const canEnterAnswer = ref<boolean>(false);

    const currentSequenceItemIndex = ref<number>(0);
    const currentRowIndex = ref<number>(0);
    const currentExampleIndex = ref<number>(0);
    const currentAnswerIndex = ref<number>(0);

    const computedCards = ref<(RowCard | AttentionCard)[]>([]);
    const currentCardIndex = ref<number>(0);

    const currentSequenceItem = computed(() => {
      return v(sequence)[v(currentSequenceItemIndex)] || null;
    });

    const currentThemeOperation = computed(() => {
      return v(currentSequenceItem).theme.metadata.operation || 0;
    });

    const currentExample = computed(() => {
      if (!v(currentSequenceItem)) return null;
      return v(currentSequenceItem).examples[v(currentExampleIndex)] || null;
    });

    const canDisplayAbacus = computed(() => {
      return ["attention-card", "row-card", "wait"].includes(v(displayMode));
    });

    const canDisplayCards = computed(() => {
      return ["attention-card", "row-card"].includes(v(displayMode));
    });

    let abacusBoard = new AbacusBoard(
      v(currentSequenceItem).abacusColumnsCount
    ); // FIXME

    const canDisplayButtons = computed(() => {
      if (v(currentCard) instanceof AttentionCard || v(currentCard) == null)
        return false;
      if (v(canDisplayAnswer)) return false;
      if (v(canDisplayScores)) return false;
      return (v(currentCard) as AttentionCard).kind != AttentionKind.Sequence;
    });

    const canDisplayScores = computed(() => {
      return v(displayMode) == "scores";
    });

    const canDisplayAnswer = computed(() => {
      return v(displayMode) == "answer";
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

    const cardClasses = computed<string[]>(() => {
      const classes: string[] = ["abacus-game-card"];
      if (v(displayMode) === "attention-card") {
        classes.push("is-yellow-bg-color");
      } else {
        const color = v(currentSequenceItem).fontColor;
        classes.push(`is-${color}-bg-color`);
      }
      return classes;
    });

    const currentRow = computed<RowType | RowType[]>(() => {
      const operation = v(currentSequenceItem).theme.metadata.operation || 0;

      if (v(currentExample) == null) return 0;

      if (operation & Operation.add || operation & Operation.sub)
        return v(currentExample)!.numbers[v(currentRowIndex)];

      return v(currentExample)!.numbers;
    });

    const currentAnswer = computed(() => {
      const operation = v(currentSequenceItem).theme.metadata.operation || 0;
      if (!v(currentExample)) return null;

      if (operation & Operation.div || operation & Operation.mult)
        return v(currentExample)!.answerMap[1];

      return v(currentExample)!.answerMap[v(currentAnswerIndex)];
    });

    const totalExamplesCount = computed<number>(() => {
      let i = 0;
      //prettier-ignore
      for (const sequenceItem of v(sequence))
        i += sequenceItem.examplesCount;
      return i;
    });

    type RowType = string | number | BigInt;
    type AnswerType = number | BigInt;

    const speechId = acquireSetting().one("text_to_speech_id");

    class RowCard {
      constructor(
        public row: RowType | RowType[],
        public operation: number,
        public answer: AnswerType,
        public displayRow: boolean,
        public speechSound: boolean
      ) {}

      public speech() {
        //const str = this.row[0] + ' multiplied by ' + this.row[1];
        return speak(String(this.row), 400, speechId);
      }
    }

    enum AttentionKind {
      Sequence,
      Example,
      EnterAnswer,
    }

    class AttentionCard {
      constructor(
        public kind: AttentionKind,
        public index: number,
        public text: string
      ) {}
    }

    const currentCard = computed(() => {
      const current = v(computedCards)[v(currentCardIndex)];

      if (current instanceof AttentionCard || v(canEnterAnswer))
        displayAttentionCard();
      else displayRowCard();

      return current;
    });

    const completeExample = () => {
      completedExamplesCount.value++;
    };

    function computeCards() {
      for (const [sequenceIndex, sequenceItem] of config.sequence.entries()) {
        v(computedCards).push(
          new AttentionCard(
            AttentionKind.Sequence,
            sequenceIndex,
            context.root.$i18n.t(sequenceItem.theme.loc, {
              digit: sequenceItem.digit,
            }) as string
          )
        );

        for (const [exampleIndex, example] of sequenceItem.examples.entries()) {
          v(computedCards).push(
            new AttentionCard(
              AttentionKind.Example,
              exampleIndex,
              context.root.$i18n.t("example_n", {
                example: exampleIndex + 1,
              }) as string
            )
          );

          const operation = sequenceItem.theme.metadata.operation || 0;
          if (operation & Operation.div || operation & Operation.mult) {
            const rows = example.numbers;
            v(computedCards).push(
              new RowCard(
                [rows[0], rows[1]],
                operation,
                example.answer,
                sequenceItem.displayNumbers,
                sequenceItem.speechSound
              )
            );
          } else {
            for (const [rowIndex, row] of example.numbers.entries()) {
              v(computedCards).push(
                new RowCard(
                  row,
                  operation,
                  example.answerMap[rowIndex],
                  sequenceItem.displayNumbers,
                  sequenceItem.speechSound
                )
              );
            }
          }
          if (!config.waitForAnswer) {
            v(computedCards).push(
              new AttentionCard(
                AttentionKind.EnterAnswer,
                0,
                context.root.$i18n.t("enter_answer") as string
              )
            );
          }
        }
      }
    }

    computeCards();

    function listenAbacus() {
      abacusBoard.on("update", (event) => {
        const answer = (event as CustomEvent<number>).detail;

        if (answer == v(currentAnswer)) {
          if (v(currentCard) instanceof AttentionCard) {
            if (
              (v(currentCard) as AttentionCard).kind ==
              AttentionKind.EnterAnswer
            ) {
              if (
                v(currentAnswerIndex) ==
                v(currentExample)!.numbers.length - 1
              ) {
                completeExample();
                toNextCard();
              }
            }
          }

          if (v(currentCard) instanceof RowCard) {
            // FIXME: duplicate code
            if (
              v(currentAnswerIndex) ==
              v(currentExample)!.numbers.length - 1
            ) {
              completeExample();
            }
            toNextCard();
          }

          incAnswerIndex();
        }
      });
    }

    function drawAbacus(columns: number) {
      const width =
        ABACUS_STONE_WIDTH * columns + // FIXME
        ABACUS_FRAME_WIDTH +
        ABACUS_FRAME_ABSOLUTE_X_PADDING;

      if (v(abacusContainerRef)!.children.length)
        v(abacusContainerRef)!.children[0].remove();

      abacusBoard = new AbacusBoard(columns);

      const abacusDraw = SVG()
        .addTo(abacusContainerRef.value!)
        .viewbox(0, -55, width, 469)
        .addClass("is-abacus-board");

      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();
      listenAbacus();
    }

    function incCardIndex() {
      currentCardIndex.value++;
    }

    function incAnswerIndex() {
      currentAnswerIndex.value++;
    }

    watch(currentCard, (card) => {
      const isMultiplication = v(currentThemeOperation) & Operation.mult;
      const isDivision = v(currentThemeOperation) & Operation.div;

      if (v(timerEnabled) == false) enableTimer();
      if (card == null) return finishGame();
      if (card instanceof AttentionCard) {
        if (card.kind == AttentionKind.Sequence) {
          currentSequenceItemIndex.value = card.index;
          drawAbacus(v(currentSequenceItem).abacusColumnsCount);
        } else if (card.kind == AttentionKind.Example) {
          abacusBoard.reset();
          currentExampleIndex.value = card.index;
          currentAnswerIndex.value = isMultiplication || isDivision ? 1 : 0;
          currentRowIndex.value = 0;
        } else if (card.kind == AttentionKind.EnterAnswer) {
        }
      } else if (card instanceof RowCard) {
        if (v(currentSequenceItem).speechSound) card.speech();
      }
    });

    function executeAfter(cb: () => void, ms = 1000) {
      const timerHandle = setTimeout(cb, ms);
      timerHandles.set(timerHandles.size, timerHandle);
    }

    function toNextCard() {
      abacusBoard.lock();
      const currentIsAttention = v(currentCard) instanceof AttentionCard;
      const currentIsExample =
        currentIsAttention &&
        (v(currentCard) as AttentionCard).kind == AttentionKind.Example;

      const executeTimeout = currentIsAttention
        ? ATTENTION_CARD_TIMEOUT
        : currentIsExample
        ? v(currentSequenceItem).examplesTimeout * 1000
        : v(currentSequenceItem).rowsTimeout * 1000;

      executeAfter(() => {
        incCardIndex();
        abacusBoard.unlock();

        if (v(currentCard) instanceof AttentionCard) {
          if (
            (v(currentCard) as AttentionCard).kind == AttentionKind.EnterAnswer
          ) {
            return;
          }

          return toNextCard();
        }

        if (!config.waitForAnswer && v(currentCard) instanceof RowCard)
          toNextCard();
      }, executeTimeout);
    }

    function startGame() {
      drawAbacus(v(currentSequenceItem).abacusColumnsCount);
      toNextCard();
    }

    function finishGame() {
      clearSoundEffects();
      clearTimerHandles();
      displayScores();
      if (v(wonTheGame)) {
        playVictorySoundEffect();
        playConfettiAnimation();
      } else {
        playLostSoundEffect();
      }
    }

    function onReshowCurrentTheme() {
      let index = v(currentCardIndex);

      while (1 * 1 == 1) {
        const card = v(computedCards)[index];
        if (!card) break;

        if (card instanceof AttentionCard) {
          if (card.kind == AttentionKind.Sequence) {
            currentCardIndex.value = index;
            toNextCard();
            return;
          }
        }

        index--;
      }
    }

    function onReshowCurrentExample() {
      let index = v(currentCardIndex);

      while (1 * 1 == 1) {
        const card = v(computedCards)[index];
        if (!card) break;

        if (card instanceof AttentionCard) {
          if (card.kind == AttentionKind.Example) {
            currentCardIndex.value = index;
            toNextCard();
            return;
          }
        }

        index--;
      }
    }

    function onShowNextTheme() {
      let index = v(currentCardIndex);

      while (1 * 1 == 1) {
        const card = v(computedCards)[index];
        if (!card) break;

        if (card instanceof AttentionCard) {
          if (card.kind == AttentionKind.Sequence) {
            currentCardIndex.value = index;
            toNextCard();
            return;
          }
        }

        index++;
      }
    }

    function onShowNextExample() {
      let index = v(currentCardIndex);

      while (1 * 1 == 1) {
        const card = v(computedCards)[index];
        if (!card) break;

        if (card instanceof AttentionCard) {
          if (card.kind == AttentionKind.Example) {
            currentCardIndex.value = index;
            toNextCard();
            return;
          }
        }

        index++;
      }
    }

    function onRestart() {
      clearGameState();
      toNextCard();
    }

    function onShowAnswer() {
      isAnswerModalActive.value = true;
      //displayAnswer();
    }

    function clearGameState() {
      clearTimerHandles();
      clearSoundEffects();
      currentCardIndex.value = 0;
      abacusBoard.reset();
      toNextCard();
    }

    onMounted(() => {
      startGame();
    });

    onUnmounted(() => {
      clearGameState();
    });

    return {
      completedExamplesPercent,
      totalExamplesCount,
      completedExamplesCount,

      onShowNextExample,
      onReshowCurrentTheme,
      onReshowCurrentExample,
      onShowNextTheme,
      onShowAnswer,
      onRestart,

      Operation,

      currentThemeOperation,

      isAnswerModalActive,

      currentCard,

      wonTheGame,

      abacusContainerRef,

      canDisplayAbacus,
      canDisplayCards,
      canEnterAnswer,
      canDisplayButtons,
      config,
      canDisplayAnswer,
      canDisplayScores,

      trophyClasses,
      gameScoresTextClasses,
      cardClasses,
      timerClasses,

      currentExample,
      currentRow,

      displayMode,
      timerEnabled,
      timerAbsolute,
    };
  },
});
