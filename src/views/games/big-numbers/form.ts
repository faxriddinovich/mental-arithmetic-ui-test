import {
  defineComponent,
  computed,
  ref,
} from "@vue/composition-api";
import {BigNumbersGameConfig, InstanceItem, SequenceItem} from "@/views/games/big-numbers/interfaces";
import {getThemes} from '@/services/generator';
import ColorPalette from '@/components/games/color-palette.vue';

const lowerCase = (str: string) => str.toLowerCase();
const matches = (str0: string, str1: string) => {
  return lowerCase(str0).indexOf(lowerCase(str1)) >= 0;
};

export default defineComponent({
  components: { ColorPalette },
  setup(_, context) {
    const filteredThemes = computed(() => {
      return getThemes()
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
    const fontColor = ref<string>("black");

    const multiplayerMode = ref<boolean>(false);
    const sameExamples = ref<boolean>(false);

    const instances = ref<InstanceItem[]>([]);
    const sequence = ref<SequenceItem[]>([]);

    const MAX_ALLOWED_SEQUENCE_ITEMS_COUNT = 10;
    const MAX_ALLOWED_INSTANCES_COUNT = 9;

    const canAddSequenceItem = computed(() => {
      return sequence.value.length < MAX_ALLOWED_SEQUENCE_ITEMS_COUNT && instances.value.length < MAX_ALLOWED_INSTANCES_COUNT;
    });

    const canAddInstanceItem = computed(() => {
      return instances.value.length < MAX_ALLOWED_INSTANCES_COUNT && sequence.value.length;
    });

    const config = context.root.$store.getters['BigNumbers/config'] as BigNumbersGameConfig;

    if(config) {
      if(config.instances.length === 1) {
        const instance = config.instances[0];
        sequence.value.push(...instance.sequence!);
      } else {
        for(const instance of config.instances) {
          instances.value.push(instance);
        }
      }

      multiplayerMode.value = config.multiplayerMode;
      answerAtEnd.value = config.answerAtEnd;
      sameExamples.value = config.sameExamples;
    }

    function resetForm() {
      fontRotation.value = fontRotations.value[0];
      fontColor.value = "black";
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
      if (sequence.value.length) {
        instances.value.push({
          answerAtEnd: answerAtEnd.value,
          sequence: sequence.value
        });
        sequence.value = [];
      }
    }

    function addSequenceItem() {
      if (filteredThemes.value.length === 0)
        theme.value = getThemes()[0].loc;
      else
        theme.value = filteredThemes.value[0].name;

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
    }

    const play = () => {
      if (!sequence.value.length)
        addSequenceItem();

      if (!instances.value.length)
        addInstanceItem();


      const gameConfig: BigNumbersGameConfig  ={
        answerAtEnd: answerAtEnd.value,
        multiplayerMode: multiplayerMode.value,
        sameExamples: sameExamples.value,
        instances: instances.value
      };

      context.root.$store.commit('BigNumbers/setConfig', gameConfig);
      context.root.$router.push({name: "PlayBigNumbersGame"});
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
