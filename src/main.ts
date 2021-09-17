import Vue from "vue";

import Buefy from "buefy";

import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "./styles/styles.scss";

const buefyOptions = {
  defaultIconPack: "uil",
  customIconPacks: {
    uis: {
      iconPrefix: "uis-",
      internalIcons: {
        star: "star",
      },
    },
    uil: {
      sizes: {
        default: "is-size-5",
        "is-small": "",
        "is-medium": "is-size-3",
        "is-large": "is-size-1",
      },
      iconPrefix: "uil-",
      internalIcons: {
        check: "check",
        information: "information",
        "check-circle": "checkmark-circle",
        alert: "exclamation",
        "alert-circle": "exclamation-circle",
        "arrow-up": "arrow-up",
        "chevron-right": "angle-right",
        "chevron-left": "angle-left",
        "chevron-down": "arrow-down",
        eye: "eye",
        "eye-off": "eye-slash",
        "menu-down": "angle-down",
        "menu-up": "angle-up",
        "close-circle": "times-circle",
      },
    },
  },
};
Vue.use(Buefy, buefyOptions);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
