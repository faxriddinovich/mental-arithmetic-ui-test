import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from "@vue/composition-api";
import {createNamespacedHelpers as createStoreHelper} from "vuex-composition-helpers";
import {NotificationProgrammatic as Notification} from "buefy";

/*
 * FIXME: this is the worst idea to keep the interfaces in the
 * views folder. So this must be fixed in the future
 */
import {NumbersGameSettings} from "@/views/games/numbers/interfaces";
import {showToastMessage, ToastType} from "@/services/toast";

// FIXME: this should be done using i18n
const START_ATTENTION_TEXTS = ["Ready", "Set", "Go!"];

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

    const attentionText = ref<string | null>(null);
    const numberText = ref<number | string | null>();

    const canShowAttentionText = ref<boolean>(true);
    const canShowNumber = ref<boolean>(false);
    const canShowAnswerForm = ref<boolean>(false);

    const pass = ref(0); // trick

    const fontClasses = computed(() => {
      pass.value; // trick
      const currentQueueItem = ref(queue[currentQueueItemIndex]);
      const classes: any = {"is-big-number": true};
      classes[`is-${currentQueueItem.value.fontSize}`] = true;
      classes[`is-rotated-${currentQueueItem.value.fontRotation}`] = true;
      return classes;
    });

    const fontStyles = computed(() => {
      pass.value; // trick
      const currentQueueItem = ref(queue[currentQueueItemIndex]);
      return {color: currentQueueItem.value.fontColor};
    });

    const calcExamplesCount = () => {
      let i = 0;
      /* FIXME: can we optimize this? */
      for (const queueItem of queue) {
        i += queueItem.examples.length;
      }
      return i;
    }

    const showAttentionText = (text: string) => {
      canShowAttentionText.value = true;
      attentionText.value = text;
      /* hide other things */
      canShowNumber.value = false;
      canShowAnswerForm.value = false;
    }

    const showNumber = (number: string | number) => {
      canShowNumber.value = true;
      numberText.value = number;
      /* hide other things */
      canShowAttentionText.value = false;
      canShowAnswerForm.value = false;
    }

    const showAnswerForm = () => {
      canShowAnswerForm.value = true;
      /* hide other things */
      canShowAttentionText.value = false;
      canShowNumber.value = false;
    }

    const increaseProgress = () => {
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
            if(isAttention)
              showAttentionText(arr[currentArrayIndex]);
            else
              showNumber(arr[currentArrayIndex]);
            currentArrayIndex++;
          } else {
            clearInterval(intervalHandle); // remove the handle
            currentArrayIndex = 0; // free
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
            showAnswerForm();
          } else {
            /* otherwise after n seconds we show the rows of the next example */
            setTimeout(() => {
              showExamples();
            }, currentQueueItem.examplesTimeout * 1000);
          }
        });
      } else if (queue[currentQueueItemIndex + 1]) {/* if there are items in the queue */
        pass.value++; // trick
        /* go to the next queue item */
        currentQueueItemIndex++;
        /* clear the index */
        currentExampleIndex = 0;
        /* show the name of the next item in the queue */
        showAttentionText(queue[currentQueueItemIndex].theme);
        /* after 2 seconds show the examples of the next item in the queue */
        setTimeout(() => {
          root.$forceUpdate();
          showExamples();
        }, 2000);
      } else {
        /* there are no queue items left */
        if (settings.value.answerAtEnd) showAnswerForm();
      }
    }

    function enterAnswer() {
      const currentQueueItem = queue[currentQueueItemIndex];
      const prevExample = currentQueueItem.examples[currentExampleIndex - 1];
      if (prevExample.answer == answerFormValue.value) {
        if (currentExampleIndex % 2 === 0) {
          Notification.open({
            type: "is-success",
            position: "is-bottom",
            message: "Keep going!",
          });
        }

        showToastMessage("Correct!", ToastType.Success);
      } else {
        showToastMessage(
          `Incorrect! The correct answer was: <b>
          ${prevExample.answer}</b>`,
          ToastType.Danger
        );
      }

      increaseProgress();
      showExamples();
    }

    onMounted(() => {
      renderArrayItems(START_ATTENTION_TEXTS, 800, true).then(() => showExamples());
    });

    return {
      answerFormValue,
      attentionText,
      canShowAnswerForm,
      canShowNumber,
      canShowAttentionText,
      numberText,
      enterAnswer,
      fontClasses,
      fontStyles,
      answerAtEnd,
      progressPercentage
    };
  },
});
