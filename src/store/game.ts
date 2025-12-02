import {defineStore} from "pinia";
import {AbacusGameConfig} from "@/views/games/abacus/interfaces";
import {BigNumbersGameConfig} from "@/views/games/big-numbers/interfaces";
import {FlashCardGameConfig} from "@/views/games/flash-card/interfaces";

export enum GAME_KIND {
    BIG_NUMBERS = "big_numbers",
    ABACUS = "abacus",
    FLASH_CARD = "flash_card",
}

const acquireGame = defineStore("Game", {
    state: () => ({
        big_numbers: null as BigNumbersGameConfig | null,
        abacus: null as AbacusGameConfig | null,
        flash_card: null as FlashCardGameConfig | null
    }),
    getters: {
        get(state) {
            function getter(kind: GAME_KIND.ABACUS): AbacusGameConfig | null;
            function getter(kind: GAME_KIND.BIG_NUMBERS): BigNumbersGameConfig | null;
            function getter(kind: GAME_KIND.FLASH_CARD): FlashCardGameConfig;
            function getter(kind: GAME_KIND): any {
                return state[kind];
            }

            return getter;
        }
    },
    actions: {
        set(kind: GAME_KIND, config: any) {
            this.$state[kind] = config;
        },
    },
});

export default acquireGame;