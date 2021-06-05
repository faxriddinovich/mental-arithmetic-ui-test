<template>
  <div class="top-level"></div>
</template>

<script>
const config = {
  customIconPacks: {
    uil: {
      sizes: {
        default: "is-size-5",
        "is-small": "",
        "is-medium": "is-size-3",
        "is-large": "is-size-1"
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
        "close-circle": "times-circle"
      }
    }
  }
};

export default {
  created() {
    this.$buefy.config.setOptions(config);
  }
};
</script>

<style lang="scss">
// offline usage
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";

.top-level {
  font-family: "Inter", sans-serif;
  background: #ecf0f1;
  height: 100vh;
  user-select: none;
}
</style>
