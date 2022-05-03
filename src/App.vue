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
import { acquireSetting } from "@/store/setting";
import { acquireAccount } from "@/store/account";
import { getVoices } from "@/services/tts";

import n29 from "@@/sounds/tts/20.mp3";
import n9 from "@@/sounds/tts/9.mp3";
import Crunker from "crunker";

interface Task {
  text: string;
  run: () => Promise<void>;
}

const load = (k: any) => require("@@/sounds/tts/" + k + ".mp3");

function speak(n: number): void {
  let str = n.toString();
  const len = str.length;
  const mod = len % 3;
  str = str.padStart(mod % 3 != 0 ? len + (3 - mod) : len, '0');

  const chunks = str.split('').reduce((acc, curr, cind, src) => {
    return acc.push(parseInt(src.splice(0, 3).join(''))) && acc
  }, []).reduce((acc, curr, cind, src) => {
    const spl = curr.toString().split('');
    for(const [i, el] of spl.entries()) {
      acc.push(parseInt(el) * (10 ** (spl.length - i - 1)));
    }
    if (src[cind + 1]) acc.push(1000 ** (src.length - cind - 1));
    return acc.filter((k) => k != 0);
  }, []).map((n) => load(n));
  console.log(chunks);

  const crunker = new Crunker();
  crunker
    .fetchAudio(...chunks)
    .then((k) => {
      return crunker.concatAudio(k);
    })
    .then((merged) => {
      return crunker.export(merged, "audio/mp3");
    })
    .then((out) => {
      const audio = new Audio(out.url);
      audio.webkitPreservesPitch = false;
      audio.playbackRate = 3.0;
      audio.play();
    });
}

export default defineComponent({
  setup(_, context) {
    const loadingText = ref<string>("");
    const syncPercentage = ref<number>(0);
    const isLoading = ref<boolean>(true);

    speak(119);

    const tasks: Task[] = [
      {
        text: "Syncing settings..",
        run: () => acquireSetting().syncTheirs(),
      },
      {
        text: "Syncing sessions..",
        run: () => acquireAccount().syncTheirs(),
      },
      {
        text: "Initializing languages..",
        run: () => {
          const locale = acquireSetting()["one"]("locale");
          context.root.$i18n.locale = locale as string;
          return Promise.resolve();
        },
      },
      {
        text: "Initializing TTS service..",
        run: async () => {
          const setting = acquireSetting();
          if (!setting.one("text_to_speech_id")) {
            try {
              const voices = await getVoices(
                setting.one("locale") || undefined
              );
              if (voices.length)
                acquireSetting().change({ text_to_speech_id: voices[0] });
            } catch {}
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
        completeTask();
      }
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
  position: relative;
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
