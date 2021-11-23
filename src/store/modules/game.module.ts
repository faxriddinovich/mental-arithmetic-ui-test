interface State {
  settings: any
}

export default {
  namespaced: true,
  state: {
    settings: null
  },
  mutations: {
    setSettings: (state: State, settings: any) => {
      state.settings = settings;
    }
  },
  getters: {
    getSettings: (state: State) => state.settings
  }
};
