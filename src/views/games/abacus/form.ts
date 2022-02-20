import { defineComponent, computed, ref } from "@vue/composition-api";
import {
  AbacusGameConfig,
  SequenceItem,
} from "@/views/games/abacus/interfaces";
import ColorPalette from "@/components/games/color-palette.vue";
import ThemesInputField from "@/components/games/themes-input-field.vue";
import AbacusTipsContent from "@/views/contents/abacus-tips.vue";

const MAX_ALLOWED_SEQUENCE_ITEMS_COUNT = 20;

export default defineComponent({
  components: { ColorPalette, ThemesInputField, AbacusTipsContent },
  setup(_, context) {
    const fontRotations = ref<number[]>([0, 90, 180, 270]);
    const fontSizes = ref<number[]>([1, 2, 3]);

    const theme = ref<string>("");
    const digit = ref<number>(1);
    const examplesCount = ref<number>(10);
    const examplesTimeout = ref<number>(1);
    const rowsCount = ref<number>(10);
    const rowsTimeout = ref<number>(1);
    const displayNumbers = ref<boolean>(true);
    const speechSound = ref<boolean>(false);
    const fontRotation = ref<number>(fontRotations.value[0]);
    const fontSize = ref<number>(fontSizes.value[0]);
    const fontColor = ref<string>("black");
    const waitForAnswer = ref<boolean>(true);
    const timerMins = ref<number>(1);
    const timerSecs = ref<number>(0);

    const sequence = ref<SequenceItem[]>([]);

    const canAddSequenceItem = computed(() => {
      return sequence.value.length < MAX_ALLOWED_SEQUENCE_ITEMS_COUNT;
    });

    const canPressPlayButton = computed<boolean>(() => {
      return theme.value.length >= 1;
    });

    const config = context.root.$store.getters[
      "Abacus/config"
    ] as AbacusGameConfig;

    if (config) {
      sequence.value.push(...config.sequence);
    }

    const pickTheme = (pickedDigit: number, pickedTheme: string) => {
      theme.value = pickedTheme;
      digit.value = pickedDigit;
    };

    // FIXME: currently `vue-i18n` library doesn't support passing variables into
    // modifiers. So we have to do this dirty thing.
    const i18nArguments = () => {
      const plusn = new Intl.NumberFormat("en-US").format(
        Number("1" + "0".repeat(digit.value))
      );
      return {
        digit: digit.value,
        plusn,
      };
    };

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

    const play = () => {
      if (!sequence.value.length) {
        addSequenceItem();
      }

      const gameConfig: AbacusGameConfig = {
        sequence: sequence.value,
        timerSecs: 60 * timerMins.value + timerSecs.value,
        waitForAnswer: waitForAnswer.value,
      };

      const { commit } = context.root.$store;
      commit("Abacus/setConfig", gameConfig);
      commit("Abacus/generateExamples");
      context.root.$router.push({ name: "PlayAbacusGame" });
    };

    return {
      theme,
      digit,
      examplesCount,
      examplesTimeout,
      rowsCount,
      rowsTimeout,
      displayNumbers,
      speechSound,
      fontRotation,
      fontSize,
      fontColor,

      fontRotations,
      fontSizes,
      canAddSequenceItem,
      canPressPlayButton,
      pickTheme,

      timerMins,
      timerSecs,
      waitForAnswer,

      sequence,
      i18nArguments,

      addSequenceItem,
      removeSequenceItem,
      play,
    };
  },
});
