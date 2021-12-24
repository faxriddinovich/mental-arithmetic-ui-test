import {
  defineComponent,
  computed,
  ref,
} from "@vue/composition-api";
import {themes} from "@mental-arithmetic/themes";
import {createNamespacedHelpers as createStoreHelper} from "vuex-composition-helpers";
import {Example, SequenceItem} from "@/views/games/big-numbers/interfaces";

interface ThemeCache {
  theme: string,
  examplesCount: number,
  rowsCount: number,
  examples: Example[];
}

const lowerCase = (str: string) => str.toLowerCase();
const matches = (str0: string, str1: string) => {
  return lowerCase(str0).indexOf(lowerCase(str1)) >= 0;
};

const generateExamples = (
  loc: string,
  examplesCount: number,
  rowsCount: number,
  digit: number
): Example[] => {
  const theme = themes.find((theme) => theme.loc == loc);
  if (!theme) return [];

  const examples: Example[] = [];
  for (let i = 0; i < examplesCount; i++) {
    examples[i] = theme.generate(rowsCount, digit) as any as Example; // FIXME
  }

  return examples;
};

export default defineComponent({
  setup(_, {root}) {
    const {useMutations} = createStoreHelper("GameModule");
    const filteredThemes = computed(() => {
      return themes
        .filter((_theme) => {
          // FIXME: this should be done using i18n
          return matches(_theme.loc, theme.value);
        })
        .map((_theme) => ({
          name: _theme.loc,
          op: _theme.metadata.operation,
        }));
    });

    const currentTab = ref<number>(0); // TODO: rename me
    const fontRotations = ref<number[]>([0, 90, 180, 270]);
    const fontSizes = ref<number[]>([1, 2, 3]);
    const fontColors = ref<string[]>([
      "black",
      "green",
      "blue",
      "purple",
      "yellow",
      "orange",
      "red",
      "teal",
      "brown"
    ]);

    const theme = ref<string>('');
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
    const fontColor = ref<string>(fontColors.value[0]);

    const multiplayerMode = ref<boolean>(false);
    const sameExamples = ref<boolean>(false);

    const instances = ref<SequenceItem[][]>([]);
    const sequence = ref<SequenceItem[]>([]);

    const MAX_ALLOWED_SEQUENCE_ITEMS_COUNT = 10;
    const MAX_ALLOWED_INSTANCES_COUNT = 9;

    const canAddSequenceItem = computed(() => {
      return sequence.value.length < MAX_ALLOWED_SEQUENCE_ITEMS_COUNT && instances.value.length < MAX_ALLOWED_INSTANCES_COUNT;
    });

    const canAddInstanceItem = computed(() => {
      return instances.value.length < MAX_ALLOWED_INSTANCES_COUNT && sequence.value.length;
    });


    const themeCaches: ThemeCache[] = [];

    function resetForm() {
      fontRotation.value = fontRotations.value[0];
      fontColor.value = fontColors.value[0];
      fontSize.value = fontSizes.value[0];
      displayNumbers.value = true;
      speechSound.value = false;
    }

    /*
    watch(() => , () => {
      resetForm();
    });
    */

    function addInstanceItem() {
      console.log(instances.value);
      if (sequence.value.length) {
        instances.value.push(sequence.value);
        sequence.value = [];
      }
    }

    function addSequenceItem() {
      if (filteredThemes.value.length === 0)
        theme.value = themes[0].loc;
      else
        theme.value = filteredThemes.value[0].name;

      const cachedTheme = themeCaches.find((cache) => {
        const sameExamplesCount = cache.examplesCount === examplesCount.value;
        const sameRowsCount = cache.rowsCount === rowsCount.value;
        const sameThemeName = cache.theme === theme.value;
        return sameThemeName && sameExamplesCount && sameRowsCount;
      });

      let examples: Example[] = [];

      examples = generateExamples(
        theme.value,
        examplesCount.value,
        rowsCount.value,
        digit.value
      );

      if (sameExamples.value) {
        if (cachedTheme) {
          examples = cachedTheme.examples;
        } else {
          themeCaches.push({
            theme: theme.value,
            examplesCount: examplesCount.value,
            rowsCount: rowsCount.value,
            examples
          });
        }
      }

      sequence.value.push({
        examples,
        theme: theme.value,
        examplesTimeout: examplesTimeout.value,
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
    }

    /*
     * This must not be called outside of `setup()`. Because `vuex-composition-helpers`
     * uses `getCurrentInstance` to get the current instance of the component,
     * which returns `null` when it is not called during setup.
     *
     * From the documentation:
     *    "`getCurrentInstance` only works during setup or Lifecycle Hooks"
     */
    const {setSettings} = useMutations(["setSettings"]);

    const play = () => {
      setSettings(instances);
      root.$router.push({name: "PlayBigNumbersGame"});
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

      currentTab,
      fontRotations,
      fontSizes,
      fontColors,
      canAddSequenceItem,
      canAddInstanceItem,

      sequence,
      instances,

      addInstanceItem,
      addSequenceItem,
      removeSequenceItem,
      removeInstanceItem,
      filteredThemes,
      play,
    };
  },
});
