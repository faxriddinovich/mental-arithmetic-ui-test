import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from "@vue/composition-api";
import {QueueItem} from "./interfaces";
import {createNamespacedHelpers as createStoreHelper} from "vuex-composition-helpers";
// FIXME: this is the worst idea to keep the interfaces in the views folder. So this must be fixed in the future
import { NumbersGameSettings } from '@/views/games/numbers/interfaces';

// FIXME: this should be done using i18n
const START_ATTENTION_TEXTS = ["text1", "text2", "text3"];

export default defineComponent({
  setup(_, {root}) {
    const {useState} =
      createStoreHelper<{settings: NumbersGameSettings}>("GameModule");
    const {settings} = useState(["settings"]);
    console.log(settings.value);

    const canEnterAnswer = ref<boolean>(false);
    const currentQueueItem = ref<QueueItem>(settings.value.queue[0]);
    const centerText = ref<string | null>();

    const fontClasses = computed(() => {
      const classes: any = {"is-big-number": true};
      classes[`is-${currentQueueItem.value.fontSize}`] = true;
      classes[`is-rotated-${currentQueueItem.value.fontSize}`] = true;
      return classes;
    });

    const fontStyles = computed(() => {
      return {color: currentQueueItem.value.fontColor};
    });

    const currentQueueItemIndex = 0;

    function showExamples() {
      const currentExampleIndex = 0;
      let currentExampleRowIndex = 0;
      const currentQueueItem = settings.value[currentQueueItemIndex];

      // [ { [] }, { [] } ]
      const exampleRowInterval = setInterval(() => {
        const currentExample = currentQueueItem.examples[currentExampleIndex];
        if(currentExampleRowIndex <= currentExample.numbers.length) {
          centerText.value = currentExample.numbers[currentExampleRowIndex] as string;
          currentExampleRowIndex++;
          return;
        } else if (!currentQueueItem.answerAtEnd) {
          clearInterval(exampleRowInterval);
          alert('show the answer box');
        }
      }, 1000); // FIXME
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
      fontClasses,
      fontStyles,
      centerText,
      canEnterAnswer
    };
  },
});
