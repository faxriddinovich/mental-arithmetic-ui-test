<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="columns is-gapless is-centered" style="min-width: 100%">
        <div class="column is-half-fullhd is-three-quarters-desktop">
          <div class="box">
            <form @submit.prevent="changeSettings">
              <b-field>
                <template #label>
                  <b-icon icon="mailbox" /> {{ $t("latest-event") }}
                </template>
                <b-checkbox v-model="showLatestEvent">
                  {{ $t(showLatestEvent ? "will-be-shown" : "will-be-hidden") }}
                </b-checkbox>
              </b-field>
              <b-field>
                <template #label>
                  <b-icon icon="language" /> {{ $t("language") }}
                </template>
                <b-radio-button
                  v-model="locale"
                  native-value="en-US"
                  type="is-primary"
                >
                  <img
                    :src="require('@@/img/flags/united-states.svg')"
                    width="30"
                  />
                  <span class="ml-2 is-hidden-mobile">English</span>
                </b-radio-button>
                <b-radio-button
                  v-model="locale"
                  native-value="uz-UZ"
                  type="is-primary"
                >
                  <img
                    :src="require('@@/img/flags/uzbekistan.svg')"
                    width="30"
                  />
                  <span class="ml-2 is-hidden-mobile">O'zbekcha</span>
                </b-radio-button>
                <b-radio-button
                  v-model="locale"
                  native-value="ru-RU"
                  type="is-primary"
                >
                  <img :src="require('@@/img/flags/russia.svg')" width="30" />
                  <span class="ml-2 is-hidden-mobile">Русский</span>
                </b-radio-button>
              </b-field>
              <b-field>
                <template #label>
                  <b-icon icon="volume" /> {{ $t("voice") }}
                </template>
                <b-select placeholder="Select a name" v-model="textToSpeechID">
                  <option
                    v-for="(voice, index) in supportedVoices"
                    :value="voice.identity"
                    :key="index"
                  >
                    {{ voice.name }}
                  </option>
                </b-select>
                <p class="control">
                  <b-button
                    icon-left="volume"
                    @click="saySomething"
                    :disabled="!textToSpeechID"
                    >test</b-button
                  >
                </p>
              </b-field>

              <b-button
                class="mt-5"
                native-type="submit"
                type="is-primary"
                icon-left="save"
                expanded
                >{{ $t("save-changes") }}</b-button
              >
            </form>
          </div>
          <div>
            <div class="mx-2 mt-4">
              <b-button
                tag="router-link"
                :to="{ name: 'Home' }"
                icon-left="home"
                expanded
                >{{ $t("home") }}</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "@vue/composition-api";
import { showToastMessage, ToastType } from "@/services/toast";
import { IdentifiedVoice } from "@/store/modules/text-to-speech.module";
import { speak } from "@/services/tts";
import { acquireSetting, Locales } from "@/store/setting";

export default defineComponent({
  setup(_, context) {
    const locale = ref<Locales>("en-US");
    const showLatestEvent = ref<boolean>(false);
    const textToSpeechID = ref<string | null>(null);
    const supportedVoices = ref<IdentifiedVoice[]>([]);
    const settings = acquireSetting();

    function applySettings() {
      locale.value = settings.locale as Locales;
      showLatestEvent.value = settings.show_latest_event;
    }

    async function getSupportedVoices() {
      const voices = await context.root.$store.dispatch(
        "TextToSpeech/getSupportedVoicesByLocale",
        locale.value
      );
      supportedVoices.value = voices;
    }

    watch(locale, () => {
      textToSpeechID.value = null;
      getSupportedVoices();
    });

    async function changeSettings() {
      if (context.root.$i18n.locale != locale.value) {
        context.root.$i18n.locale = locale.value;
      }

      await settings.change({
        show_latest_event: showLatestEvent.value,
        locale: locale.value,
      });

      showToastMessage(
        context.root.$i18n.t("changes-applied") as string,
        ToastType.Success
      );
      context.root.$router.push({ name: "Home" });
    }

    function saySomething() {
      speak("-123", 1, textToSpeechID.value!);
    }

    onMounted(() => {
      applySettings();
      getSupportedVoices();
    });

    return {
      locale,
      showLatestEvent,
      changeSettings,
      supportedVoices,
      textToSpeechID,
      saySomething,
    };
  },
});
</script>
