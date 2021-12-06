import {
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  ref
} from "@vue/composition-api";
import {createNamespacedHelpers as createStoreHelper} from "vuex-composition-helpers";
import {NumbersGameSettings} from "@/views/games/numbers/interfaces";
/*
import {NotificationProgrammatic as Notification} from "buefy";
import {Example, QueueItem} from '@/views/games/numbers/interfaces';
import {showToastMessage, ToastType} from "@/services/toast";
*/
import CorrectAnswerSoundSrc from '../../../../public/sounds/correct-answer.mp3'
import IncorrectAnswerSoundSrc from '../../../../public/sounds/incorrect-answer.mp3'
import FinishSoundSrc from '../../../../public/sounds/finish.mp3'

/*
 * FIXME: this is the worst idea to keep the interfaces in the
 * views folder. So this must be fixed in the future
 */

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
  setup(_, {root}) {
    const {useState} =
      createStoreHelper<{settings: NumbersGameSettings}>("GameModule");
    const {settings} = useState(["settings"]);

    const queue = settings.value.queue;
    let currentQueueItemIndex = 0;
    let currentExampleIndex = 0;
    const progressPercentage = ref(0);

    const answerAtEnd = ref<boolean>(settings.value.answerAtEnd);
    const answerFormValue = ref<number | null>();

    const incorrectAnswersCount = ref<number>(0);
    const correctAnswersCount = ref<number>(0);
    const correctAnswersPercent = computed(() => {
      return correctAnswersCount.value / (correctAnswersCount.value + incorrectAnswersCount.value) * 100
    });

    const displayParent = ref();
    const displayMode = ref<'attention' | 'number' | 'answer' | 'answer-form' | 'result'>('attention');
    const display = ref<string | number | null>(null);

    const displayClasses = computed(() => {
      const currentQueueItem = queue[currentQueueItemIndex];
      const classes: string[] = [];
      if (displayMode.value === 'number') {
        const {fontSize, fontRotation, fontColor} = currentQueueItem;
        classes.push('is-big-number');
        classes.push(`is-${fontSize}`);
        classes.push(`is-rotated-${fontRotation}`);
        classes.push(`is-${fontColor}-color`);
      } else if (displayMode.value === 'attention') {
        classes.push('is-big-number');
        classes.push('is-2');
      }

      return classes;
    });

    const currentExample = computed(() => {
      const currentQueueItem = queue[currentQueueItemIndex];
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

        star.src = require(`../../../../public/img/${filled ? 'filled' : 'empty'
          }-star.svg`);
        console.log(i, value, filled);

        star.classes.push('is-star');

        if (filled)
          star.classes.push('has-shadow');

        if (i === 1)
          star.classes.push('is-1', 'mb-4');
        else
          star.classes.push('is-2');

        stars.push(star);
      }

      console.log(stars);

      return stars;
    });

    const calcExamplesCount = () => {
      let i = 0;
      /* FIXME: can we optimize this? */
      for (const queueItem of queue) {
        i += queueItem.examples.length;
      }
      return i;
    }

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

    const displayAnswer = () => {
      displayMode.value = 'answer';
    }

    const displayResult = () => {
      displayMode.value = 'result';
    }

    const completeExample = () => {
      progressPercentage.value += 1 / calcExamplesCount() * 100;
    }

    const timerHandles: Set<NodeJS.Timer> = new Set();

    /*
     * Resolves the promise after showing all the rows
     */
    function renderArrayItems(
      arr: (string | number)[],
      interval: number,
      isAttention?: boolean
    ): Promise<void> {
      let currentArrayIndex = 0;
      return new Promise((resolve) => {
        const timerHandle = setInterval(() => {
          if (arr[currentArrayIndex]) {
            if (isAttention)
              displayAttentionText(arr[currentArrayIndex]);
            else
              displayNumber(arr[currentArrayIndex]);
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
      const currentQueueItem = queue[currentQueueItemIndex];
      const currentExample = currentQueueItem.examples[currentExampleIndex];

      /* if the current example exists */
      if (currentExample) {
        /* show all the rows of the current example */
        renderArrayItems(
          currentExample.numbers,
          currentQueueItem.rowsTimeout * 1000
        ).then(() => {
          /* clear after showing all the rows */
          //clearCenterText(); // FIXME
          currentExampleIndex++;
          /* if `answerAtEnd` is true, then we should show the answer form */
          if (!settings.value.answerAtEnd) {
            displayAnswerForm();
          } else {
            /* otherwise after n seconds we show the rows of the next example */
            setTimeout(() => {
              showExamples();
            }, currentQueueItem.examplesTimeout * 1000);
          }
        });
      } else if (queue[currentQueueItemIndex + 1]) {/* if there are items in the queue */
        /* go to the next queue item */
        currentQueueItemIndex++;
        /* clear the index */
        currentExampleIndex = 0;
        /* show the name of the next item in the queue */
        displayAttentionText(queue[currentQueueItemIndex].theme);
        /* after 2 seconds show the examples of the next item in the queue */
        const timerHandle = setTimeout(() => {
          root.$forceUpdate();
          showExamples();
        }, 2000);
        timerHandles.add(timerHandle);
      } else {
        /* there are no queue items left */
        if (settings.value.answerAtEnd) displayAnswerForm();
        const timerHandle = setTimeout(() => {
          displayResult();
          playFinishSound();
        }, 1000);
        timerHandles.add(timerHandle);
      }
    }


    function enterAnswer() {
      const currentQueueItem = queue[currentQueueItemIndex];
      const prevExample = currentQueueItem.examples[currentExampleIndex - 1];
      completeExample();

      if (prevExample.answer == answerFormValue.value) {
        correctAnswersCount.value++;
        displayCorrectAnswerFade();
        playCorrectAnswerSound();
        /*
        if (currentExampleIndex % 2 === 0) {
          Notification.open({
            type: "is-success",
            position: "is-bottom",
            message: "Keep going!",
          });
        }
        */
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
      answerAtEnd,
      answerFormValue,
      currentExample,
      display,
      displayClasses,
      displayMode,
      enterAnswer,
      nextExample,
      finalStars,
      displayParent,
      progressPercentage,
      correctAnswersCount,
      incorrectAnswersCount,
      correctAnswersPercent
    };
  },
});
