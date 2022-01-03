import { BigNumbersGameConfig } from '@/views/games/big-numbers/interfaces';

interface StateProps {
  config: BigNumbersGameConfig | null;
}

export default {
  namespaced: true,
  state: {
    config: null,
  },
  mutations: {
    setConfig: (state: StateProps, config: any) => {
      state.config = config;
    },
  },
  getters: {
    config: (state: StateProps) => state.config,
  },
};
