import {
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  ref,
  PropType
} from "@vue/composition-api";
import {QueueItem} from "@/views/games/big-numbers/interfaces";
import CorrectAnswerSoundSrc from '@@/sounds/correct-answer.mp3'
import IncorrectAnswerSoundSrc from '@@/sounds/incorrect-answer.mp3'
import FinishSoundSrc from '@@/sounds/finish.mp3'
import {SettingsStorage} from '@/services/storages/settings';

import {TextToSpeech} from '@capacitor-community/text-to-speech';
import {speak} from '@/services/tts';

// FIXME: this should be done using i18n
const START_ATTENTION_TEXTS = ["Ready", "Set", "Go!"];

function playCorrectAnswerSound() {
  return new Audio(CorrectAnswerSoundSrc).play();
}

function playIncorrectAnswerSound() {
  return new Audio(IncorrectAnswerSoundSrc).play();
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
    queue: {
      type: Array as PropType<QueueItem[]>,
      required: true
    },
    onQueueFinish: {
      type: Function as PropType<(queueIndex: number) => void>,
      required: false
    },
    multiplayerMode: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  setup(props, context) {
    let currentQueueItemIndex = 0;
    let currentExampleIndex = 0;
    const progressPercentage = ref(0);

    context.root.$on('test', () => {
      alert('emitted');
    });

    const queue = ref(props.queue as QueueItem[]); //reactive

    const answerFormValue = ref<number | null>();

    const incorrectAnswersCount = ref<number>(0);
    const correctAnswersCount = ref<number>(0);
    const correctAnswersPercent = computed(() => {
      return correctAnswersCount.value / (correctAnswersCount.value + incorrectAnswersCount.value) * 100
    });

    const displayParent = ref();
    const displayMode = ref<'attention' | 'number' | 'answer' | 'answer-form' | 'answer-forms' | 'result' | 'wait'>('attention');
    const display = ref<string | number | null>(null);

    const displayClasses = computed(() => {
      const currentQueueItem = queue.value[currentQueueItemIndex];
      const classes: string[] = [];
      if (displayMode.value === 'number') {
        const {fontSize, fontRotation, fontColor} = currentQueueItem;
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

    const currentExample = computed(() => {
      const currentQueueItem = queue.value[currentQueueItemIndex];
      /*
       * Every time when `display.value` is changed, `currentExample`
       * is recomputed
       */
      if (display.value)
        return currentQueueItem.examples[currentExampleIndex - 1];
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

    const calcExamplesCount = () => {
      let i = 0;
      /* FIXME: can we optimize this? */
      for (const queueItem of queue.value) {
        i += queueItem.examples.length;
      }
      return i;
    }

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

    const displayNumber = (number: string | number) => {
      displayMode.value = 'number';
      display.value = number;
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

    const completeExample = () => {
      progressPercentage.value += 1 / calcExamplesCount() * 100;
    }

    // FIXME: do not use the global instance
    context.root.$once('numbers-game:show-answers-form', () => {
      if (displayMode.value === 'wait')
        displayAnswerForms();
    });

    const timerHandles: Set<NodeJS.Timer> = new Set();

    /*
     * Resolves the promise after showing all the rows
     */
    function renderArrayItems(
      arr: (string | number)[],
      interval: number,
      isAttention?: boolean,
      speechSound?: boolean
    ): Promise<void> {
      let currentArrayIndex = 0;
      return new Promise((resolve) => {
        const timerHandle = setInterval(() => {
          if (arr[currentArrayIndex]) {

            if (isAttention) {
              displayAttentionText(arr[currentArrayIndex]);
            } else {
              if(speechSound)
                speak(arr[currentArrayIndex] as string, language.value, 1);
              displayNumber(arr[currentArrayIndex]);
            }
            currentArrayIndex++;
          } else {
            clearInterval(timerHandle); // remove the handle
            currentArrayIndex = 0;
            resolve();
          }
        }, interval);
        timerHandles.add(timerHandle);
      });
    }


    function showExamples() {
      const currentQueueItem = queue.value[currentQueueItemIndex];
      const currentExample = currentQueueItem.examples[currentExampleIndex];

      /* if the current example exists */
      if (currentExample) {
        /* show all the rows of the current example */
        renderArrayItems(
          currentExample.numbers,
          currentQueueItem.rowsTimeout * 1000,
          false, currentQueueItem.speechSound
        ).then(() => {
          /* clear after showing all the rows */
          //clearCenterText(); // FIXME
          currentExampleIndex++;
          /* if `answerAtEnd` is true, then we should show the answer form */
          if (!props.answerAtEnd) {
            displayAnswerForm();
          } else {
            /* otherwise after n seconds we show the rows of the next example */
            setTimeout(() => {
              showExamples();
            }, currentQueueItem.examplesTimeout * 1000);
          }
        });
      } else if (queue.value[currentQueueItemIndex + 1]) {/* if there are items in the queue */
        /* go to the next queue item */
        currentQueueItemIndex++;
        /* clear the index */
        currentExampleIndex = 0;
        /* show the name of the next item in the queue */
        displayAttentionText(queue.value[currentQueueItemIndex].theme);
        /* after 2 seconds show the examples of the next item in the queue */
        const timerHandle = setTimeout(() => {
          showExamples();
        }, 2000);
        timerHandles.add(timerHandle);
      } else { /* there are no queue items left */
        if (props.onQueueFinish)
          props.onQueueFinish(currentQueueItemIndex);

        if (props.multiplayerMode && props.answerAtEnd) {
          displayWait();
          return;
        }

        if (props.answerAtEnd) {
          displayAnswerForms();
          return;
        }

        const timerHandle = setTimeout(() => {
          displayResult();
          playFinishSound();
        }, 1000);
        timerHandles.add(timerHandle);
      }
    }

    function enterAnswer2(event: any /* FIXME */, queueItemIndex: number, exampleIndex: number) {
      if (queue.value[queueItemIndex]?.examples[exampleIndex]) {
        const example = queue.value[queueItemIndex].examples[exampleIndex];
        const input = event.target[0];
        const button = event.target[1];
        input.setAttribute('disabled', true);
        button.setAttribute('disabled', true);

        if (input.value.toString() === example.answer.toString()) {
          button.innerText = 'Correct!';
          button.classList.add('is-success');
          input.classList.add('is-success');
          correctAnswersCount.value++;
          displayCorrectAnswerFade();
          playCorrectAnswerSound();
        } else {
          button.innerText = 'Incorrect!';
          button.classList.add('is-danger');
          input.classList.add('is-danger');
          incorrectAnswersCount.value++;
          displayIncorrectAnswerFade();
          playIncorrectAnswerSound();
        }

        if (correctAnswersCount.value + incorrectAnswersCount.value === calcExamplesCount()) {
          const timerHandle = setTimeout(() => {
            displayResult();
            playFinishSound();
          }, 1000);
          timerHandles.add(timerHandle);
        }
      }
    }

    function enterAnswer() {
      const currentQueueItem = queue.value[currentQueueItemIndex];
      // FIXME
      const prevExample = currentQueueItem.examples[currentExampleIndex - 1];

      completeExample();

      if (prevExample.answer == answerFormValue.value) {
        correctAnswersCount.value++;
        displayCorrectAnswerFade();
        playCorrectAnswerSound();
        showExamples();
      } else {
        incorrectAnswersCount.value++;
        displayIncorrectAnswerFade();
        playIncorrectAnswerSound();
        displayAnswer();
      }
    }

    function nextExample() {
      showExamples();
    }

    onMounted(() => {
      renderArrayItems(START_ATTENTION_TEXTS, 800, true).then(() => showExamples());
    });

    onUnmounted(() => {
      timerHandles.forEach((handle) => {
        clearInterval(handle);
      });
    });

    return {
      answerFormValue,
      currentExample,
      display,
      displayClasses,
      displayMode,
      enterAnswer,
      enterAnswer2,
      nextExample,
      finalStars,
      displayParent,
      progressPercentage,
      correctAnswersCount,
      incorrectAnswersCount,
      correctAnswersPercent,
      resultScoreTextClasses
    };
  },
});
