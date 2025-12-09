import {defineComponent, computed, watch, ref} from "@vue/composition-api";
import {Theme} from "@mental-arithmetic/themes";
import ThemesInputField from "@/components/games/themes-input-field.vue";
import ColorPalette from "@/components/games/color-palette.vue";
import acquireGame, {GAME_KIND} from "@/store/game";

import {FlashCardThemeConfig} from "./interfaces";
import {FlashCardGameMode} from "./interfaces";

export default defineComponent({
    components: {ColorPalette, ThemesInputField},
    setup(_, context) {
        const canDisplayGameForm = ref<boolean>(true);
        const canPressPlayButton = computed<boolean>(() => {
            return !!themeConfigs.value.length
        });

        const canAddTheme = computed<boolean>(() => {
            return !!theme.value
        });

        const themeConfigs = ref<FlashCardThemeConfig[]>([]);

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
        const abacusColumnsCount = ref<number>(2);

        const gameMode = ref<number>(FlashCardGameMode.abacus);

        const gameConfig = acquireGame();

        function addTheme() {
            themeConfigs.value.push({
                theme: theme.value!,
                digits: digit.value,
                examplesCount: examplesCount.value,
                rowsCount: rowsCount.value,
                examplesTimeout: examplesTimeout.value,
                rowsTimeout: rowsTimeout.value,
                fontColor: fontColor.value,
                mode: gameMode.value,
                speechSound: speechSound.value
            });
        }

        function play() {
            gameConfig.set(GAME_KIND.FLASH_CARD, {
                themes: themeConfigs.value,
                timerMins: timerMins.value,
                timerSecs: timerSecs.value,
            });

            context.root.$router.push({name: 'PlayFlashCardGame'});
        }

        return {
            canDisplayGameForm,
            canPressPlayButton,
            canAddTheme,

            addTheme,
            play,

            themeConfigs,

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
            gameMode,

            fontRotations,
            fontSizes,

            timerMins,
            timerSecs,
            abacusColumnsCount,
            waitForAnswer,
            FlashCardGameMode,
        };
    },
});
