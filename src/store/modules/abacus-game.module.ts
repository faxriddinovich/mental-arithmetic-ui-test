import { AbacusGameConfig } from '@/views/games/abacus/interfaces';

interface StateProps {
  config: AbacusGameConfig | null;
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
