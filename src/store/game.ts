import { defineStore } from "pinia";
import { AbacusGameConfig } from '@/views/games/abacus/interfaces';
import { BigNumbersGameConfig } from '@/views/games/big-numbers/interfaces';

export enum GAME_KIND {
  BIG_NUMBERS = 'big_numbers',
  ABACUS = 'abacus'
}

export const acquireGame = defineStore({
  id: "Game",
  state: () => ({
    big_numbers: null as BigNumbersGameConfig | null,
    abacus: null as AbacusGameConfig | null
  }),
  getters: {
    get(state) {
      return (kind: GAME_KIND) => state[kind];
    }
  },
  actions: {
    set(kind: GAME_KIND, config: any) {
      this.$state[kind] = config;
    }
  }
});
