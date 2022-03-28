import { defineComponent, computed, watch, ref } from "@vue/composition-api";
import { SequenceItem } from "@/views/games/abacus/interfaces";
import ColorPalette from "@/components/games/color-palette.vue";
import ThemesInputField from "@/components/games/themes-input-field.vue";
import AbacusTipsContent from "@/views/contents/abacus-tips.vue";
import { Theme } from "@mental-arithmetic/themes";
import { acquireGame, GAME_KIND } from "@/store/game";

const MAX_ALLOWED_SEQUENCE_ITEMS_COUNT = 20;

export default defineComponent({
  components: { ColorPalette, ThemesInputField, AbacusTipsContent },
  setup(_, context) {
    const fontRotations = ref<number[]>([0, 90, 180, 270]);
    const fontSizes = ref<number[]>([1, 2, 3]);

    const theme = ref<Theme | null>(null);
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
    const abacusColumnsCount = ref<number>(digit.value + 1);

    watch(digit, (val) => {
      abacusColumnsCount.value = val + 1;
    });

    const sequence = ref<SequenceItem[]>([]);

    const canAddSequenceItem = computed(() => {
      return (
        theme.value && sequence.value.length < MAX_ALLOWED_SEQUENCE_ITEMS_COUNT
      );
    });

    const canPressPlayButton = computed<boolean>(() => {
      return sequence.value.length > 0 || !!theme.value;
    });

    const gameConfig = acquireGame();

    if (gameConfig.abacus) {
      const abacusConfig = gameConfig.abacus;
      if (abacusConfig.sequence) {
        sequence.value.push(...abacusConfig.sequence);
      }

      const lastSequenceItem =
        abacusConfig.sequence[abacusConfig.sequence.length - 1];

      digit.value = lastSequenceItem.digit;
      examplesCount.value = lastSequenceItem.examplesCount;

      examplesTimeout.value = lastSequenceItem.examplesTimeout;

      rowsCount.value = lastSequenceItem.rowsCount;
      rowsTimeout.value = lastSequenceItem.rowsTimeout;
      abacusColumnsCount.value = lastSequenceItem.abacusColumnsCount;
      timerMins.value = Math.floor(abacusConfig.timerSecs / 60);
      timerSecs.value = abacusConfig.timerSecs % 60;
      waitForAnswer.value = abacusConfig.waitForAnswer;

      fontColor.value =lastSequenceItem.fontColor;
      fontRotation.value =lastSequenceItem.fontRotation;
      fontSize.value =lastSequenceItem.fontSize;
      displayNumbers.value =lastSequenceItem.displayNumbers;
      speechSound.value =lastSequenceItem.speechSound;
    }

    function addSequenceItem() {
      sequence.value.push({
        theme: theme.value!,
        examples: [],
        digit: Number(digit.value),
        examplesCount: examplesCount.value,
        rowsCount: rowsCount.value,
        abacusColumnsCount: abacusColumnsCount.value,
        examplesTimeout: examplesTimeout.value,
        rowsTimeout: rowsTimeout.value,
        displayNumbers: displayNumbers.value,
        fontRotation: fontRotation.value,
        fontColor: fontColor.value,
        fontSize: fontSize.value,
        speechSound: speechSound.value
      });
    }

    const removeSequenceItem = (index: number) => {
      sequence.value = sequence.value.filter((_, idx) => idx !== index);
    };

    const play = () => {
      if (!sequence.value.length) {
        addSequenceItem();
      }

      gameConfig.set(GAME_KIND.ABACUS, {
        sequence: sequence.value,
        timerSecs: 60 * timerMins.value + timerSecs.value,
        waitForAnswer: waitForAnswer.value,
        abacusColumnsCount: abacusColumnsCount.value,
        examplesTimeout: examplesTimeout.value,
        rowsTimeout: rowsTimeout.value,
        displayNumbers: displayNumbers.value,
        fontRotation: fontRotation.value,
        fontColor: fontColor.value,
        fontSize: fontSize.value,
        speechSound: speechSound.value,
      });
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

      timerMins,
      timerSecs,
      abacusColumnsCount,
      waitForAnswer,

      sequence,

      addSequenceItem,
      removeSequenceItem,
      play,
    };
  },
});
