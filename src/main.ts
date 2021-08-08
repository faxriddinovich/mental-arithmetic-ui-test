import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
// buefy
import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.config.productionTip = false;

const buefyOptions = {
  defaultIconPack: "uil",
  customIconPacks: {
    uil: {
      sizes: {
        default: "is-size-5",
        "is-small": "",
        "is-medium": "is-size-3",
        "is-large": "is-size-1",
        test: "is-size-4",
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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
