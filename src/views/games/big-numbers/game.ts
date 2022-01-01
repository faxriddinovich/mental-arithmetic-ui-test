import {
  defineComponent,
  computed,
  onMounted,
  ref,
  PropType,
  Ref,
  onUnmounted
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
      type: Function as PropType<() => void>,
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

    const v = <T extends Ref<infer K>, K>(ref: Ref<K>): K => ref.value

    // these refs holds the current state of the game, so that we can use it
    const currentSequenceItemIndex = ref<number>(0);
    const currentSequenceItem = computed(() => {
      return props.sequence[v(currentSequenceItemIndex)];
    });

    const currentExampleIndex = ref<number>(0);
    const currentExample = computed(() => {
      return v(currentSequenceItem).examples[v(currentExampleIndex)];
    });

    const incorrectAnswersCount = ref<number>(0);
    const correctAnswersCount = ref<number>(0);
    const correctAnswersPercent = computed<number>(() => {
      return (v(correctAnswersCount) / (v(correctAnswersCount) + v(incorrectAnswersCount)) * 100); // FIXME: tofixed
    });
    const totalExamplesCount = computed<number>(() => {
      let total = 0;
      for (const sequenceItem of props.sequence) {
        total += sequenceItem.examplesCount;
      }
      return total;
    });

    const displayParent = ref<HTMLElement>();
    const displayMode = ref<'attention' | 'number' | 'answer' | 'answer-form' | 'answer-forms' | 'scores'>('attention');
    const display = ref<string | number | null>(null);

    const displayClasses = computed(() => {
      const classes: string[] = ['is-display-text'];
      if (displayMode.value === 'number') {
        const {fontSize, fontRotation, fontColor} = v(currentSequenceItem);

        const displayCharsCount= String(v(display)).length;
        classes.push(`is-display-number-${displayCharsCount}-${fontSize}`);
        classes.push(`is-rotated-${fontRotation}`);
        classes.push(`is-${fontColor}-color`);

      } else if (displayMode.value === 'attention') {
        classes.push('is-display-text');
        classes.push('is-2');
      }

      return classes;
    });

    const answerFormsColumnClasses = computed<string[]>(() => {
      const classes: string[] = ['column']
      if(props.multiplayerMode) {
        classes.push('is-12');
      } else {
        classes.push('is-12-mobile is-8-desktop');
      }

      return classes;
    });

    const resultScoreTextClasses = computed<string[]>(() => {
      const classes: string[] = [];
      const percent = v(correctAnswersPercent);

      classes.push('is-result-score-text');
      classes.push('has-text-weight-semibold');

      if (percent >= 60 && percent <= 100)
        classes.push('has-text-success');
      else if (percent < 60 && percent >= 30)
        classes.push('has-text-warning');
      else if (percent < 30 && percent >= 0)
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

    const language = ref<string>('en');
    SettingsStorage.getSetting('locale').then((loc) => {
      language.value = loc;
    });

    const displayCorrectAnswerFade = () => {
      v(displayParent)!.classList.add('is-correct-answer');
      setTimeout(() => {
        displayParent.value!.classList.remove('is-correct-answer');
      }, 1000);
    }

    const displayIncorrectAnswerFade = () => {
      displayParent.value!.classList.add('is-incorrect-answer');
      setTimeout(() => {
        displayParent.value!.classList.remove('is-incorrect-answer');
      }, 1000);
    }

    const displayAttentionText = (text: string | number) => {
      displayMode.value = 'attention';
      display.value = text;
    }

    const soundEffects = true;

    const displayNumber = (value: string | number | null) => {
      displayMode.value = 'number';
      display.value = null;
      if (soundEffects && value && !props.multiplayerMode)
        playBubbleSound();
      if (v(currentSequenceItem).speechSound && value)
        speechSpeak(value!);

      if(!v(currentSequenceItem).displayNumbers && !props.multiplayerMode)
        return;

      setTimeout(() => {
        display.value = value;
      }, 40);
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

    const displayScores = () => {
      playFinishSound();
      displayMode.value = 'scores';
    }

    // FIXME: do not use the global instance
    context.root.$once('display-answer-forms', () => {
      displayAnswerForms();
    });

    function speechSpeak(text: string | number) {
      const speechRate = currentSequenceItem.value.rowsTimeout >= 1
        ? 1 : 1 + currentSequenceItem.value.rowsTimeout + (String(text).length / 2);
      speak(text, language.value, speechRate);
    }

    const timerHandles = new Set<NodeJS.Timeout>();

    function displayAttentionTexts() {
      let currentAttentionTextIndex = 0;
      const timerHandle = setInterval(() => {
        if (START_ATTENTION_TEXTS[currentAttentionTextIndex]) {
          displayAttentionText(START_ATTENTION_TEXTS[currentAttentionTextIndex]);
          currentAttentionTextIndex++;
        } else {
          timerHandles.add(setTimeout(() => {
            displayExamples();
          }, 1000));
          clearInterval(timerHandle);
          timerHandles.delete(timerHandle);
        }
      }, 800);
      timerHandles.add(timerHandle);
    }

    function displayExamples() {
      /* if there are no examples left */
      if ((v(currentExampleIndex) + 1) > v(currentSequenceItem).examples.length) {
        /* if there are no sequence items left */
        if ((v(currentSequenceItemIndex) + 1) >= props.sequence.length) {
          if(props.onFinish)
            props.onFinish();

          if (props.answerAtEnd) {
            if(!props.multiplayerMode)
              /* display the answer forms */
              displayAnswerForms();
          } else {
            /* otherwise display the scores */
            displayScores();
          }
        } else {
          /* go to the next sequence item */
          currentSequenceItemIndex.value++;
          displayExamples();
        }

        return;
      }

      let currentRowIndex = 0;
      const timerHandle = setInterval(function callback() {
        /* if there are not displayed row items */
        if (v(currentExample).numbers[currentRowIndex]) {
          /* we just display the row item */
          displayNumber(v(currentExample).numbers[currentRowIndex]);
          currentRowIndex++;
        } else { /* there are no row items left */

          if (props.answerAtEnd) {
            displayNumber(null);
            /* after n seconds we display the next examples */
            timerHandles.add(setTimeout(() => {
              /* go to the next example */
              currentExampleIndex.value++;
              displayExamples();
            }, v(currentSequenceItem).examplesTimeout * 1000))
          } else {
            /* otherwwise we just display the answer form */
            displayAnswerForm();
          }

          if (timerHandle!) { /* TODO: not safe */
            clearInterval(timerHandle);
          }
        }

        return callback;
      }(), v(currentSequenceItem).rowsTimeout * 1000);

      timerHandles.add(timerHandle);
    }

    /* it does some common things */
    function completeExample(correct: boolean) {
      progressPercentage.value += 1 / v(totalExamplesCount) * 100;

      if (correct) {
        correctAnswersCount.value++;
        displayCorrectAnswerFade();
        if (soundEffects)
          playCorrectAnswerSound();

      } else {
        incorrectAnswersCount.value++;
        displayIncorrectAnswerFade();
        if (soundEffects)
          playIncorrectAnswerSound();
      }
    }

    function compareAnswer(userAnswer: any, answer: any) {
      return userAnswer.toString() === answer.toString();
    }

    function enterAnswer() {
      /* if the answer is correct */
      if (compareAnswer(v(answerFormValue), v(currentExample).answer)) {
        completeExample(true);
        /* clear the screen ( this is not the best way to achieve that ) */
        displayNumber(null);
        /* after 1 second we display the next examples */
        timerHandles.add(setTimeout(() => {
          /* go to the next example */
          currentExampleIndex.value++;
          displayExamples();
        }, 1000));
      } else {
        completeExample(false);
        /* display the answer of the current example */
        displayAnswer();
      }
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

      if (compareAnswer(targetExample.answer, answerInput.value)) {
        answerInput.classList.add('is-success', 'is-disabled');
        answerButton.innerText = '';
        answerButton.classList.add('is-success', 'is-disabled');

        completeExample(true);
      } else {
        answerInput.classList.add('is-danger');
        answerButton.innerText = '';
        answerButton.classList.add('is-danger');

        completeExample(false);
      }

      /* if this is the last example */
      if (v(correctAnswersCount) + v(incorrectAnswersCount) === v(totalExamplesCount)) {
        /* after 1 second we display the result of the game */
        timerHandles.add(setTimeout(() => {
          displayScores();
        }, 1000));
      }
    }

    function nextExample() {
      displayNumber(null); // dirty way to clean the scsreen

      currentExampleIndex.value++;
      displayExamples();
    }

    function refresh() {
      displayNumber(null); // dirty way to clean the scsreen

      resetGameStaet();
      startGame();
    }

    function startGame() {
      displayAttentionTexts();
    }

    function resetGameStaet() {
      progressPercentage.value = 0;
      currentSequenceItemIndex.value = 0;
      currentExampleIndex.value = 0;
      correctAnswersCount.value = 0;
      incorrectAnswersCount.value = 0;
      for (const handle of timerHandles.keys())
        clearInterval(handle);
    }

    onMounted(() => {
      startGame();
    });

    onUnmounted(() => {
      resetGameStaet();
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
      answerFormsColumnClasses,
      resultScoreTextClasses
    };
  },
});;
