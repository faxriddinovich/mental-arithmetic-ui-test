<template>
  <div class="is-unselectable">
    <section class="hero is-fullheight" v-if="isLoading">
      <div class="hero-body is-flex-direction-column is-justify-content-center">
        <img :src="require('@@/img/dual-rings-loading.svg')" width="100px" />
        <div class="is-size-4">{{ loadingText }}</div>
      </div>
    </section>
    <div v-else>
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
  setup(_, context) {
    const loadingText = ref<string>("");
    const isLoading = ref<boolean>(true);
    context.root.$store.dispatch("TextToSpeech/updateLanguage", "ru");

    // some magic
    const sleep = async (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    onMounted(async () => {
      loadingText.value = "Syncing settings..";
      await context.root.$store.dispatch("Settings/sync");
      await sleep(500);

      const locale = context.root.$store.getters["Settings/get"]("locale");

      loadingText.value = "Initializing locale..";
      await sleep(500);
      context.root.$i18n.locale = locale;

      loadingText.value = "Initializing TTS service..";
      await sleep(500);
      await context.root.$store.dispatch("TextToSpeech/updateLanguage", locale);


      isLoading.value = false;
    });

    return { isLoading, loadingText };
  },
});
</script>

<style lang="scss">
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";
@import "https://unicons.iconscout.com/release/v4.0.0/css/solid.css";
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100&display=swap");

html,
body {
  background-color: #ecf3f4;
  font-family: "Inter", sans-serif;
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 0;
}

.is-bottom-left {
  position: absolute;
  bottom: 6px;
  left: 6px;
}
</style>
