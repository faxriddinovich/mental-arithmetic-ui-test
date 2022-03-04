import Vue from "vue";
import Buefy from "buefy";
import { isMobile } from "@/services/platform";
import { SplashScreen } from "@capacitor/splash-screen";
import VueCompositionAPI from "@vue/composition-api";
import { Operation } from "@mental-arithmetic/themes";
import { createPinia, PiniaVuePlugin } from "pinia";

Vue.use(VueCompositionAPI);
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import i18n from "./i18n";
import store from "./store";

import "./styles/styles.scss";

const buefyOptions = {
  defaultIconPack: "uil",
  customIconPacks: {
    uis: {
      sizes: {
        default: "is-size-6",
        "is-small": "is-size-3",
        "is-medium": "is-size-5",
      },
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

// FIXME: move me
Vue.filter("timerFormat", (timerAbsolute: number) => {
  const mins = parseInt((timerAbsolute / 60).toString(), 10);
  const secs = parseInt((timerAbsolute % 60).toString(), 10);
  const minsStr = mins < 10 ? "0" + mins : mins.toString();
  const secsStr = secs < 10 ? "0" + secs : secs.toString();

  return `${minsStr}:${secsStr}`;
});

Vue.filter("toOperation", (ops: number) => {
  let str = "";

  if (ops & Operation.add) str += "+ ";

  if (ops & Operation.sub) str += "- ";

  if (ops & Operation.div) str += "÷ ";

  if (ops & Operation.mult) str += "×";

  return str;
});

Vue.filter("formatCurrency", (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  })
    .formatToParts(amount)
    .map((p) => (p.type != "literal" && p.type != "currency" ? p.value : ""))
    .join("");
});

Vue.filter("normalizeSign", (n: BigInt | number) => {
  return n > 0 ? "+ " + n : n;
});

new Vue({
  router,
  store,
  i18n,
  pinia,
  render: (h) => h(App),
  mounted() {
    if (isMobile()) SplashScreen.hide();
  },
}).$mount("#app");
