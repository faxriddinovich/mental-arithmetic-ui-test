import { defineComponent, computed, ref } from "@vue/composition-api";
import {
  InstanceItem,
  SequenceItem,
} from "@/views/games/big-numbers/interfaces";
import ColorPalette from "@/components/games/color-palette.vue";
import ThemesInputField from "@/components/games/themes-input-field.vue";
import { acquireGame, GAME_KIND } from "@/store/game";

const MAX_ALLOWED_SEQUENCE_ITEMS_COUNT = 10;
const MAX_ALLOWED_INSTANCES_COUNT = 9;

export default defineComponent({
  components: { ColorPalette, ThemesInputField },
  setup(_, context) {
    const fontRotations = ref<number[]>([0, 90, 180, 270]);
    const fontSizes = ref<number[]>([1, 2, 3]);

    const theme = ref<string>("");
    const digit = ref<number>(1);
    const examplesCount = ref<number>(10);
    const examplesTimeout = ref<number>(1);
    const rowsCount = ref<number>(10);
    const rowsTimeout = ref<number>(1);
    const answerAtEnd = ref<boolean>(false);
    const displayNumbers = ref<boolean>(true);
    const speechSound = ref<boolean>(false);
    const fontRotation = ref<number>(fontRotations.value[0]);
    const fontSize = ref<number>(fontSizes.value[0]);
    const fontColor = ref<string>("black");

    const multiplayerMode = ref<boolean>(false);
    const sameExamples = ref<boolean>(false);

    const instances = ref<InstanceItem[]>([]);
    const sequence = ref<SequenceItem[]>([]);

    const canAddSequenceItem = computed(() => {
      return (
        sequence.value.length < MAX_ALLOWED_SEQUENCE_ITEMS_COUNT &&
        instances.value.length < MAX_ALLOWED_INSTANCES_COUNT &&
        theme.value.length
      );
    });

    const canAddInstanceItem = computed(() => {
      return (
        instances.value.length < MAX_ALLOWED_INSTANCES_COUNT &&
        sequence.value.length
      );
    });

    const canPressPlayButton = computed<boolean>(() => {
      return theme.value.length > 0 || sequence.value.length > 0;
    });

    const game = acquireGame()
    const gameConfig = game.get(GAME_KIND.BIG_NUMBERS)!;

    if (gameConfig) {
      const bigNumbersConfig = gameConfig;
      if (bigNumbersConfig.instances.length === 1) {
        const instance = bigNumbersConfig.instances[0];
        sequence.value.push(...instance.sequence!);
      } else {
        for (const instance of bigNumbersConfig.instances) {
          instances.value.push(instance);
        }
      }

      const lastInstance =
        bigNumbersConfig.instances[bigNumbersConfig.instances.length - 1];
      const lastSequenceItem =
        lastInstance.sequence[lastInstance.sequence.length - 1];

      digit.value = lastSequenceItem.digit;
      examplesCount.value = lastSequenceItem.examplesCount;
      examplesTimeout.value = lastSequenceItem.examplesTimeout;
      rowsCount.value = lastSequenceItem.rowsCount;
      rowsTimeout.value = lastSequenceItem.rowsTimeout;
      answerAtEnd.value = bigNumbersConfig.answerAtEnd;
      sameExamples.value = bigNumbersConfig.sameExamples;
      multiplayerMode.value = bigNumbersConfig.multiplayerMode;

      multiplayerMode.value = bigNumbersConfig.multiplayerMode;
      answerAtEnd.value = bigNumbersConfig.answerAtEnd;
      sameExamples.value = bigNumbersConfig.sameExamples;
      fontColor.value = lastSequenceItem.fontColor;
      fontRotation.value = lastSequenceItem.fontRotation;
      fontSize.value = lastSequenceItem.fontSize;
      displayNumbers.value = lastSequenceItem.displayNumbers;
      speechSound.value = lastSequenceItem.speechSound;
    }

    function addInstanceItem() {
      if (sequence.value.length) {
        instances.value.push({
          answerAtEnd: answerAtEnd.value,
          sequence: sequence.value,
        });
        sequence.value = [];
      }
    }

    function addSequenceItem() {
      sequence.value.push({
        examples: [],
        theme: theme.value,
        digit: Number(digit.value),
        examplesCount: examplesCount.value,
        examplesTimeout: examplesTimeout.value,
        rowsCount: rowsCount.value,
        rowsTimeout: rowsTimeout.value,
        displayNumbers: displayNumbers.value,
        fontRotation: fontRotation.value,
        fontColor: fontColor.value,
        fontSize: fontSize.value,
        speechSound: speechSound.value,
      });
    }

    const removeSequenceItem = (index: number) => {
      sequence.value = sequence.value.filter((_, idx) => idx !== index);
    };

    const removeInstanceItem = (index: number) => {
      instances.value = instances.value.filter((_, idx) => idx !== index);
    };

    const play = () => {
      if (!sequence.value.length) addSequenceItem();
      if (!instances.value.length) addInstanceItem();

      game.set(GAME_KIND.BIG_NUMBERS, {
        answerAtEnd: answerAtEnd.value,
        multiplayerMode: multiplayerMode.value,
        sameExamples: sameExamples.value,
        instances: instances.value,
      });
      context.root.$router.push({ name: "PlayBigNumbersGame" });
    };

    return {
      theme,
      digit,
      examplesCount,
      examplesTimeout,
      rowsCount,
      rowsTimeout,
      answerAtEnd,
      displayNumbers,
      speechSound,
      fontRotation,
      fontSize,
      fontColor,
      sameExamples,
      multiplayerMode,

      fontRotations,
      fontSizes,
      canAddSequenceItem,
      canAddInstanceItem,
      canPressPlayButton,

      sequence,
      instances,

      addInstanceItem,
      addSequenceItem,
      removeSequenceItem,
      removeInstanceItem,
      play,
    };
  },
});
