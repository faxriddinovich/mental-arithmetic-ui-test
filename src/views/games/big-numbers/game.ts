/*
 * Note: There may be performance issues in this game, but this approach keeps the source code compact and clean.
 */
import {
  defineComponent,
  computed,
  onMounted,
  ref,
  PropType,
} from "@vue/composition-api";
import {SequenceItem} from "@/views/games/big-numbers/interfaces";
import CorrectAnswerSoundSrc from '@@/sounds/correct-answer.mp3'
import IncorrectAnswerSoundSrc from '@@/sounds/incorrect-answer.mp3'
import FinishSoundSrc from '@@/sounds/finish.mp3'
import BubbleSoundSrc from '@@/sounds/bubble.mp3';
import {SettingsStorage} from '@/services/storages/settings';
import {generateExamples, Example} from '@/services/generator';

import {speak} from '@/services/tts';

// FIXME: this should be done using i18n
const START_ATTENTION_TEXTS = ["Ready", "Set", "Go!"];

function playCorrectAnswerSound() {
  return new Audio(CorrectAnswerSoundSrc).play();
}

function playIncorrectAnswerSound() {
  return new Audio(IncorrectAnswerSoundSrc).play();
}

function playBubbleSound() {
  return new Audio(BubbleSoundSrc).play();
}

function playFinishSound() {
  return new Audio(FinishSoundSrc).play();
}

interface Star {
  src: string,
  classes: string[]
}

export default defineComponent({
  props: {
    answerAtEnd: {
      type: Boolean,
      default: false,
      required: false
    },
    sequence: {
      type: Array as PropType<SequenceItem[]>,
      required: true
    },
    onFinish: {
      type: Function as PropType<(sequenceIndex: number) => void>,
      required: false
    },
    multiplayerMode: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  setup(props, context) {
    const progressPercentage = ref<number>(0);
    const answerFormValue = ref<number | null>();

    // these refs holds the current state of the game, so that we can use it
    const currentSequenceItem = ref<SequenceItem>(props.sequence[0]);
    const currentExample = ref<Example>(props.sequence[0].examples[0]);

    const incorrectAnswersCount = ref<number>(0);
    const correctAnswersCount = ref<number>(0);
    const correctAnswersPercent = computed(() => {
      return correctAnswersCount.value / (correctAnswersCount.value + incorrectAnswersCount.value) * 100
    });

    const displayParent = ref();
    const displayMode = ref<'attention' | 'number' | 'answer' | 'answer-form' | 'answer-forms' | 'result' | 'wait'>('attention');
    const display = ref<string | number | null>(null);

    const displayClasses = computed(() => {
      const classes: string[] = [];
      if (displayMode.value === 'number') {
        const {fontSize, fontRotation, fontColor} = currentSequenceItem.value;
        classes.push('is-display-text');
        classes.push(`is-${fontSize}`);
        classes.push(`is-rotated-${fontRotation}`);
        classes.push(`is-${fontColor}-color`);
      } else if (displayMode.value === 'attention') {
        classes.push('is-display-text');
        classes.push('is-2');
      }

      return classes;
    });

    const resultScoreTextClasses = computed(() => {
      const classes: string[] = [];
      const {value} = correctAnswersPercent;

      classes.push('is-result-score-text');
      classes.push('has-text-weight-semibold');

      if (value >= 60 && value <= 100)
        classes.push('has-text-success');
      else if (value < 60 && value >= 30)
        classes.push('has-text-warning');
      else if (value < 30 && value >= 0)
        classes.push('has-text-danger');

      return classes;
    });

    const finalStars = computed(() => {
      const {value} = correctAnswersPercent;
      const stars: Star[] = [];
      for (let i = 0; i < 3; i++) { // FIXME: static stars count
        const star: Star = {src: '', classes: []};
        let filled = false;

        /* FIXME: fix this chaos */
        if (i === 0)
          if (value >= 20)
            filled = true;
          else
            filled = false;
        else if (i === 1)
          if (value >= 40)
            filled = true;
          else
            filled = false
        else if (i === 2)
          if (value >= 80)
            filled = true;
          else
            filled = false;

        // FIXME: use path aliases
        star.src = require(`../../../../public/img/${filled ? 'filled' : 'empty'
          }-star.svg`);

        star.classes.push('is-star');

        if (filled)
          star.classes.push('has-shadow');

        if (i === 1)
          star.classes.push('is-1', 'mb-4');
        else
          star.classes.push('is-2');

        stars.push(star);
      }

      return stars;
    });

    function calculateTotalExamplesCount(): number {
      let i = 0;
      for (const sequenceItem of props.sequence) {
        i += sequenceItem.examples.length;
      }

      return i;
    }

    const totalExamplesCount = calculateTotalExamplesCount();

    const language = ref<string>('en');

    SettingsStorage.getSetting('locale').then((loc) => {
      language.value = loc;
    });

    const displayCorrectAnswerFade = () => {
      displayParent.value.classList.add('is-correct-answer');
      setTimeout(() => {
        displayParent.value.classList.remove('is-correct-answer');
      }, 1000);
    }

    const displayIncorrectAnswerFade = () => {
      displayParent.value.classList.add('is-incorrect-answer');
      setTimeout(() => {
        displayParent.value.classList.remove('is-incorrect-answer');
      }, 1000);
    }

    const displayAttentionText = (text: string | number) => {
      displayMode.value = 'attention';
      display.value = text;
    }

    const displayNumber = (value: string | number | null) => {
      displayMode.value = 'number';
      display.value = value;
    }

    const displayAnswerForm = () => {
      answerFormValue.value = null; // clear
      displayMode.value = 'answer-form';
    }

    const displayAnswerForms = () => {
      displayMode.value = 'answer-forms';
    }

    const displayAnswer = () => {
      displayMode.value = 'answer';
    }

    const displayResult = () => {
      displayMode.value = 'result';
    }

    const displayWait = () => {
      displayMode.value = 'wait';
    }

    // FIXME: do not use the global instance
    context.root.$once('display-answer-form', () => {
      if (displayMode.value === 'wait')
        displayAnswerForms();
    });

    function speechSpeak(text: string | number) {
      const speechRate = currentSequenceItem.value.rowsTimeout >= 1 ? 1 : 1 + currentSequenceItem.value.rowsTimeout + (String(text).length / 2);
      speak(text, language.value, speechRate);
    }

    function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    let answerResolveCallback: ((answer: number) => void) | null = null;
    let answersResolveCallback: (() => void) | null = null;
    let nextExampleResolveCallback: (() => void) | null = null;

    function waitForNextExampleSubmit() {
      return new Promise<void>((resolve) => {
        nextExampleResolveCallback = resolve;
      })
    }

    function waitForAnswerSubmit() {
      return new Promise<number>((resolve) => {
        answerResolveCallback = resolve;
      });
    }

    function waitForAnswerForms() {
      return new Promise<void>((resolve) => {
        answersResolveCallback = resolve;
      });
    }

    async function displayAttentionTexts(texts: string[]) {
      for (const [index, text] of texts.entries()) {
        if (index === 0) await sleep(1000);
        displayAttentionText(text);
        await sleep(800);
      }
    }

    async function displaySpecificExample(
      example: Example,
      interval: number,
      speechSound: boolean,
      bubbleSound: boolean
    ): Promise<void> {
      for (const row of example.numbers) {
        await sleep(interval);
        displayNumber(null);
        await sleep(40); // fade effect
        if (!speechSound && bubbleSound)
          playBubbleSound();
        if (!bubbleSound && speechSound)
          speechSpeak(row);

        displayNumber(row);
      }
    }

    function completeExample(correct: boolean, soundEffect: boolean) {
      progressPercentage.value += 1 / totalExamplesCount * 100;
      if (correct) {
        correctAnswersCount.value++;
        displayCorrectAnswerFade();
        if (soundEffect)
          playCorrectAnswerSound();

      } else {
        incorrectAnswersCount.value++;
        displayIncorrectAnswerFade();
        if (soundEffect)
          playIncorrectAnswerSound();
      }
    }

    async function displaySpecificSequenceItem(
      sequenceItem: SequenceItem,
      skipAnswerForm: boolean,
      soundEffects = true
    ): Promise<void> {
      for (const example of sequenceItem.examples) {
        currentExample.value = example;
        await displaySpecificExample(
          example,
          sequenceItem.rowsTimeout * 1000,
          sequenceItem.speechSound,
          soundEffects
        );
        if (!skipAnswerForm) {
          await sleep(1000);
          displayAnswerForm();
          const answer = await waitForAnswerSubmit();
          if (answer.toString() === example.answer.toString()) {
            completeExample(true, soundEffects);
          } else {
            completeExample(false, soundEffects);
            displayAnswer();
            await waitForNextExampleSubmit();
          }
        } else {
          await sleep(sequenceItem.examplesTimeout * 1000);
        }
      }
    }

    async function displaySequenceItems(
      sequence: SequenceItem[],
      answerAtEnd: boolean
    ) {
      for (const sequenceItem of sequence) {
        currentSequenceItem.value = sequenceItem;
        await displaySpecificSequenceItem(
          sequenceItem,
          props.answerAtEnd, true
        );
      }

      if (answerAtEnd) {
        displayAnswerForms();
        await waitForAnswerForms();
      }

      await sleep(500);
      playFinishSound();
      displayResult();
    }

    function enterAnswer() {
      if (answerResolveCallback)
        answerResolveCallback(answerFormValue.value!); // FIXME: not type safe
    }

    // TODO: this name does not make any sense
    function enterAnswer2(
      event: any,
      sequenceItemIndex: number,
      exampleIndex: number
    ) {
      const targetExample = props.sequence[sequenceItemIndex].examples[exampleIndex];

      // TODO: some dirty things
      const answerInput = <HTMLInputElement>(event.target[0])
      const answerButton = <HTMLButtonElement>(event.target[1]);

      answerInput.setAttribute('disabled', '');
      answerButton.setAttribute('disabled', '');

      if (targetExample.answer.toString() === answerInput.value.toString()) {
        answerInput.classList.add('is-success', 'is-disabled');
        answerButton.innerText = '';
        answerButton.classList.add('is-success', 'is-disabled');

        completeExample(true, true);
      } else {
        answerInput.classList.add('is-danger');
        answerButton.innerText = '';
        answerButton.classList.add('is-danger');

        completeExample(false, true);
      }

      const allExamplesCompleted =correctAnswersCount.value + incorrectAnswersCount.value === totalExamplesCount;

      if (allExamplesCompleted && answersResolveCallback) {
        answersResolveCallback();
      }
    }

    function nextExample() {
      if (nextExampleResolveCallback)
        nextExampleResolveCallback();
    }

    function refresh() {
      console.log('not implemented yet');
    }

    function startGame() {
      displayAttentionTexts(START_ATTENTION_TEXTS).then(() => {
        displaySequenceItems(props.sequence, props.answerAtEnd).then(() => {
          // finished! do something
        });
      });
    }

    onMounted(() => {
      startGame();
    });

    return {
      refresh,
      display,
      finalStars,
      enterAnswer,
      displayMode,
      enterAnswer2,
      nextExample,
      displayParent,
      displayClasses,
      currentExample,
      answerFormValue,
      progressPercentage,
      correctAnswersCount,
      incorrectAnswersCount,
      correctAnswersPercent,
      resultScoreTextClasses
    };
  },
});;
