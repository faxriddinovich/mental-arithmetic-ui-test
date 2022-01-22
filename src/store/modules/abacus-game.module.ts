import {AbacusGameConfig} from '@/views/games/abacus/interfaces';
import {generateExamples} from '@/services/generator';

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
    generateExamples: (state: StateProps) => {
      if (!state.config) return;

      for (const sequenceItem of state.config.sequence) {
        const {theme, examplesCount, rowsCount, digit} = sequenceItem;
        sequenceItem.examples = generateExamples(theme, examplesCount, rowsCount, digit);
      }
    }
  },
  getters: {
    config: (state: StateProps) => state.config,
  },
};
