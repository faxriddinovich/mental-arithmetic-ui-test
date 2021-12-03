import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from "@vue/composition-api";
import {createNamespacedHelpers as createStoreHelper} from "vuex-composition-helpers";
import {NotificationProgrammatic as Notification} from 'buefy'

/*
 * FIXME: this is the worst idea to keep the interfaces in the
 * views folder. So this must be fixed in the future
 */
import {NumbersGameSettings} from '@/views/games/numbers/interfaces';
import {showToastMessage, ToastType} from '@/services/toast';

// FIXME: this should be done using i18n
const START_ATTENTION_TEXTS = ["Ready", "Set", "Go!"];

export default defineComponent({
  setup(_, {root}) {
    const {useState} =
      createStoreHelper<{settings: NumbersGameSettings}>("GameModule");
    const {settings} = useState(["settings"]);

    const queue = settings.value.queue
    let currentQueueItemIndex = 0;
    let currentExampleIndex = 0;

    const answerAtEnd = ref<boolean>(settings.value.answerAtEnd);
    const canEnterAnswer = ref<boolean>(false);
    const centerText = ref<string | null>();
    const answer = ref<number | null>();

    const fontClasses = computed(() => {
      const currentQueueItem = ref(queue[currentQueueItemIndex]);
      const classes: any = {"is-big-number": true};
      classes[`is-${currentQueueItem.value.fontSize}`] = true;
      classes[`is-rotated-${currentQueueItem.value.fontSize}`] = true;
      return classes;
    });

    const fontStyles = computed(() => {
      // FIXME: not reactive
      const currentQueueItem = queue[currentQueueItemIndex];
      return {color: currentQueueItem.fontColor};
    });

    const clearCenterText = () => centerText.value = null;
    const setCenterText = (text: any) => centerText.value = text;
    const showAnswerForm = () => {answer.value = null; canEnterAnswer.value = true};
    const hideAnswerForm = () => canEnterAnswer.value = false;

    /*
     * Resolves the promise after showing all the rows
     */
    function renderExampleRows(rows: (string | number)[], interval: number): Promise<void> {
      let currentRowIndex = 0;
      return new Promise((resolve) => {
        const rowsInterval = setInterval(() => {
          if (rows[currentRowIndex]) {
            setCenterText(rows[currentRowIndex]);
            currentRowIndex++;
          } else {
            clearInterval(rowsInterval); // remove the handle
            currentRowIndex = 0; // free
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
        renderExampleRows(currentExample.numbers, 500 /* FIXME */).then(() => {
          /* clear after showing all the rows */
          clearCenterText();
          currentExampleIndex++;
          /* if `answerAtEnd` is true, then we should show the answer form */
          if (!settings.value.answerAtEnd) {
            showAnswerForm();
          } else { /* otherwise after 2 seconds we show the rows of the next example */
            setTimeout(() => {showExamples()}, 2000);
          }
        });
      } else if (queue[currentQueueItemIndex + 1]) { /* if there are items in the queue */
        /* go to the next queue item */
        currentQueueItemIndex++;
        /* clear the index */
        currentExampleIndex = 0;
        /* show the name of the next item in the queue */
        setCenterText(queue[currentQueueItemIndex].theme);
        /* after 2 seconds show the examples of the next item in the queue */
        setTimeout(() => {
          showExamples();
        }, 2000);
      } else { /* there are no queue items left */
        if (settings.value.answerAtEnd)
          showAnswerForm();
      }
    }

    function enterAnswer() {
      const currentQueueItem = queue[currentQueueItemIndex];
      const prevExample = currentQueueItem.examples[currentExampleIndex - 1];
      if (prevExample.answer == answer.value) {
        if (currentExampleIndex % 3 === 0) {
          Notification.open({type: 'is-success', message: 'Keep going!', hasIcon: true, position: 'is-bottom'});
        }

        showToastMessage("Correct!", ToastType.Success);
      } else {
        showToastMessage("Incorrect! The correct answer was: <b>" + prevExample.answer + "</b>", ToastType.Danger);
      }

      hideAnswerForm();
      showExamples();
    }

    onMounted(() => {
      /* FIXME: renderExampleRows is not funny */
      renderExampleRows(START_ATTENTION_TEXTS, 800).then(() => showExamples());
    });

    return {
      answer,
      enterAnswer,
      fontClasses,
      fontStyles,
      centerText,
      canEnterAnswer,
      answerAtEnd
    };
  },
});
