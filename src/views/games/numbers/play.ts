import {
  defineComponent,
  computed,
  onMounted,
  ref
} from "@vue/composition-api";
import {createNamespacedHelpers as createStoreHelper} from "vuex-composition-helpers";
import {NotificationProgrammatic as Notification} from "buefy";
import {Example, QueueItem} from '@/views/games/numbers/interfaces';
import CorrectAnswerSoundSrc from '../../../../public/sounds/correct-answer.mp3'
import IncorrectAnswerSoundSrc from '../../../../public/sounds/incorrect-answer.mp3'

/*
 * FIXME: this is the worst idea to keep the interfaces in the
 * views folder. So this must be fixed in the future
 */
import {NumbersGameSettings} from "@/views/games/numbers/interfaces";
import {showToastMessage, ToastType} from "@/services/toast";

// FIXME: this should be done using i18n
const START_ATTENTION_TEXTS = ["Ready", "Set", "Go!"];

function playCorrectAnswerSound() {
  return new Audio(CorrectAnswerSoundSrc).play();
}

function playIncorrectAnswerSound() {
  return new Audio(IncorrectAnswerSoundSrc).play();
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

    const completeExample = () => {
      progressPercentage.value += 1 / calcExamplesCount() * 100;
    }

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
        const intervalHandle = setInterval(() => {
          if (arr[currentArrayIndex]) {
            if (isAttention)
              displayAttentionText(arr[currentArrayIndex]);
            else
              displayNumber(arr[currentArrayIndex]);
            currentArrayIndex++;
          } else {
            clearInterval(intervalHandle); // remove the handle
            currentArrayIndex = 0;
            resolve();
          }
        }, interval);
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
        setTimeout(() => {
          root.$forceUpdate();
          showExamples();
        }, 2000);
      } else {
        /* there are no queue items left */
        if (settings.value.answerAtEnd) displayAnswerForm();
      }
    }


    function enterAnswer() {
      const currentQueueItem = queue[currentQueueItemIndex];
      const prevExample = currentQueueItem.examples[currentExampleIndex - 1];
      completeExample();

      if (prevExample.answer == answerFormValue.value) {
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

        showToastMessage("Correct!", ToastType.Success);
        showExamples();
      } else {
        displayIncorrectAnswerFade();
        playIncorrectAnswerSound();
        displayAnswer();
        showToastMessage(
          `Incorrect! The correct answer was: <b>
          ${prevExample.answer}</b>`,
          ToastType.Danger
        );
      }

    }

    function nextExample() {
      showExamples();
    }

    onMounted(() => {
      renderArrayItems(START_ATTENTION_TEXTS, 800, true).then(() => showExamples());
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
      displayParent,
      progressPercentage,
    };
  },
});
