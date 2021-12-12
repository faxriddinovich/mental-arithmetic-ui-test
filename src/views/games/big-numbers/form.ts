import {
  defineComponent,
  computed,
  ref,
  reactive,
  toRefs,
  watch,
  watchEffect
} from "@vue/composition-api";
import {themes} from "@mental-arithmetic/themes";
import {createNamespacedHelpers as createStoreHelper} from "vuex-composition-helpers";
import {Example, BigNumbersGameSettings} from "@/views/games/big-numbers/interfaces";

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

  // FIXME: fix the type error
  return examples;
};

export default defineComponent({
  setup(_, {root}) {
    const {useMutations} = createStoreHelper("GameModule");
    const filteredThemes = computed(() => {
      return themes
        .filter((_theme) => {
          // FIXME: this should be done using i18n
          return matches(_theme.loc, settings.theme);
        })
        .map((_theme) => ({
          name: _theme.loc,
          op: _theme.metadata.operation,
        }));
    });

    const currentTab = ref(0);

    const options = reactive({
      fontRotations: [0, 90, 180, 270],
      fontSizes: [1, 2, 3],
      fontColors: [
        "black",
        "green",
        "blue",
        "purple",
        "yellow",
        "orange",
        "red",
      ],
    });

    const settings = reactive({
      theme: "",
      digit: 1,
      examplesCount: 10,
      examplesTimeout: 1,
      rowsCount: 10,
      rowsTimeout: 1,
      answerAtEnd: false,
      displayNumbers: true,
      hasSound: false,
      fontRotation: options.fontRotations[0],
      fontColor: options.fontColors[0],
      fontSize: options.fontSizes[0],
    });

    const gameSettings = reactive<BigNumbersGameSettings>({
      answerAtEnd: false,
      multiplayerMode: false,
      sameExamples: false,
      queue: [],
    });

    const examplesCache: {theme: string, examples: Example[]}[] = [];

    function resetDefaults() {
      settings.fontRotation = options.fontRotations[0];
      settings.fontColor = options.fontColors[0];
      settings.fontSize = options.fontSizes[0];
      settings.displayNumbers = true;
      settings.hasSound = false;
    }

    watch(() => gameSettings.multiplayerMode, () => {
      resetDefaults();
    });

    /*
     * Add to the queue list
     */
    const addToQueueList = () => {

      let examples: Example[];

      if (gameSettings.sameExamples) {
        const cachedExamples = examplesCache.find((example) => example.theme === settings.theme);

        if (cachedExamples) {
          examples = cachedExamples.examples;
        } else {
          const _examples = generateExamples(
            settings.theme,
            settings.examplesCount,
            settings.rowsCount,
            Number(settings.digit)
          );
          examples = _examples
          examplesCache.push({theme: settings.theme, examples: _examples});
        }
      } else {
        examples = generateExamples(
          settings.theme,
          settings.examplesCount,
          settings.rowsCount,
          Number(settings.digit)
        );
      }

      gameSettings.queue.push({
        examples,
        theme: settings.theme,
        examplesTimeout: settings.examplesTimeout,
        rowsTimeout: settings.rowsTimeout,
        displayNumbers: settings.displayNumbers,
        hasSound: settings.hasSound,
        fontRotation: settings.fontRotation,
        fontColor: settings.fontColor,
        fontSize: settings.fontSize,
      });
    };

    /*
     * Remove item from the queue
     */
    const removeFromQueueList = (index: number) => {
      gameSettings.queue = gameSettings.queue.filter((_, idx) => idx !== index);
    };

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
      // FIXME add the first theme in the themes list when the theme input is empty ( or we can just disable the play button )
      setSettings(gameSettings);
      root.$router.push({name: "PlayBigNumbersGame"});
    };

    return {
      ...toRefs(options),
      ...toRefs(settings),
      ...toRefs(gameSettings),
      addToQueueList,
      removeFromQueueList,
      filteredThemes,
      currentTab,
      play,
    };
  },
});
