import {
  defineComponent,
  computed,
  onMounted,
  ref,
  reactive
} from "@vue/composition-api";
import {QueueItem} from "./interfaces";
import {createNamespacedHelpers as createStoreHelper} from "vuex-composition-helpers";
// FIXME: this is the worst idea to keep the interfaces in the views folder. So this must be fixed in the future
import {NumbersGameSettings} from '@/views/games/numbers/interfaces';
import {showToastMessage, ToastType} from '@/services/toast';

// FIXME: this should be done using i18n
const START_ATTENTION_TEXTS = ["Ready", "Set", "Go!"];

export default defineComponent({
  setup(_, {root}) {
    const {useState} =
      createStoreHelper<{settings: NumbersGameSettings}>("GameModule");
    const {settings} = useState(["settings"]);

    //these are not reactive
    const queue = settings.value.queue
    const currentQueueItemIndex = 0;
    let currentExampleIndex = 0;

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


    function showExamples() {
      let currentExampleRowIndex = 0;
      const currentQueueItem = queue[currentQueueItemIndex];

      const exampleRowInterval = setInterval(() => {
        const currentExample = currentQueueItem.examples[currentExampleIndex];

        // if there is a row
        if (currentExample.numbers[currentExampleRowIndex]) {
          centerText.value = currentExample.numbers[currentExampleRowIndex];
          currentExampleRowIndex++;
        } else {
          clearInterval(exampleRowInterval);
          centerText.value = null;
          // currentExampleIndex actually is the next 
          if (currentQueueItem.examples[currentExampleIndex]) {
            canEnterAnswer.value = true;
          }
        }
        // FIXME: fix the interval time
      }, 500);
    }

    function enterAnswer() {
      const currentQueueItem = queue[currentQueueItemIndex];
      const currentExample = currentQueueItem.examples[currentExampleIndex];

      if (currentExample.answer == answer.value) {
        showToastMessage('Correct!', ToastType.Success);
      } else {
        showToastMessage('Incorrect! The correct answer is: ' + currentExample.answer, ToastType.Danger);
      }

      canEnterAnswer.value = false;
      answer.value = null;

      if (currentQueueItem.examples[currentExampleIndex + 1]) {
        currentExampleIndex++;
        showExamples();
      } else {
        centerText.value = 'End!';
      }

    }

    /*
     * Immediately shows the "start texts"
     */
    function showStartAttentionTexts() {
      let currentStartAttention = 1;
      centerText.value = START_ATTENTION_TEXTS[0];

      const startAttentionInterval = setInterval(() => {
        if (START_ATTENTION_TEXTS[currentStartAttention]) {
          centerText.value = START_ATTENTION_TEXTS[currentStartAttention];
          currentStartAttention++;
          return;
        }

        clearInterval(startAttentionInterval);
        // after showing the start texts we can start the game
        showExamples();
      }, 1000);
    }

    onMounted(() => {
      // entry
      showStartAttentionTexts();
    });

    return {
      answer,
      enterAnswer,
      fontClasses,
      fontStyles,
      centerText,
      canEnterAnswer
    };
  },
});
