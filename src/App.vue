<template>
  <div class="is-unselectable">
    <section class="hero is-fullheight" v-if="isLoading">
      <div class="hero-body is-flex-direction-column is-justify-content-center">
        <b-progress
          type="is-success"
          :value="syncPercentage"
          style="width: 200px"
        ></b-progress>
        <div class="is-size-6">{{ loadingText }}</div>
      </div>
    </section>
    <div v-else>
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";

const TASKS_COUNT = 3;

export default defineComponent({
  setup(_, context) {
    const loadingText = ref<string>("");
    const syncPercentage = ref<number>(0);
    const isLoading = ref<boolean>(true);

    const sleep = async (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    function completeSyncTask() {
      syncPercentage.value += 100 / TASKS_COUNT;
    }

    onMounted(async () => {
      loadingText.value = "Syncing settings..";
      await context.root.$store.dispatch("Settings/sync");
      await sleep(500);
      completeSyncTask();

      loadingText.value = "Syncing sessions..";
      await context.root.$store.dispatch("Account/sync");
      await sleep(500);
      completeSyncTask();

      const locale = context.root.$store.getters["Settings/get"]("locale");
      context.root.$i18n.locale = locale;

      loadingText.value = "Initializing TTS service..";
      await context.root.$store.dispatch("TextToSpeech/update", locale);
      await sleep(500);
      completeSyncTask();

      isLoading.value = false;
      context.root.$store.state.synced = true;
    });

    return { isLoading, loadingText, syncPercentage };
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
