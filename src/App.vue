<template>
  <div class="is-unselectable">
    <div v-if="syncPercentage == 100">
      <router-view :key="$route.fullPath" />
    </div>
    <section class="hero is-fullheight" v-else>
      <div class="hero-body is-flex-direction-column is-justify-content-center">
        <b-progress
          type="is-success"
          :value="syncPercentage"
          style="width: 200px"
        ></b-progress>
        <div class="is-size-6">{{ loadingText }}</div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { showToastMessage, ToastType } from "@/services/toast";
import { acquireSetting } from '@/store/settings';

interface Task {
  text: string;
  run: () => Promise<void>;
}

export default defineComponent({
  setup(_, context) {
    const loadingText = ref<string>("");
    const syncPercentage = ref<number>(0);
    const isLoading = ref<boolean>(true);

    const sleep = async (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const tasks: Task[] = [
      {
        text: "Syncing settings..",
        run: () => acquireSetting().syncTheirs(),
      },
      {
        text: "Syncing sessions..",
        run: () => context.root.$store.dispatch("Account/sync"),
      },
      {
        text: "Initializing languages..",
        run: () => {
          const locale = context.root.$store.getters["Settings/get"]("locale");
          context.root.$i18n.locale = locale;
          return Promise.resolve();
        },
      },
      {
        text: "Initializing TTS service..",
        run: async () => {
          try {
            await context.root.$store.dispatch("TextToSpeech/sync");
          } catch {
            showToastMessage(
              "Unable to initialize tts service",
              ToastType.Warning
            );
          }
        },
      },
    ];

    function completeTask() {
      syncPercentage.value += 100 / tasks.length;
    }

    onMounted(async () => {
      for (const task of tasks) {
        loadingText.value = task.text;
        await task.run();
        await sleep(200); // a little bit delay
        completeTask();
      }

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

html::-webkit-scrollbar {
  width: 0;
}

.is-bottom-left {
  position: absolute;
  bottom: 6px;
  left: 6px;
}
</style>
