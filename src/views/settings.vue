<template>
  <div
    class="columns is-centered is-vcentered is-mobile m-0"
    style="height: 100vh"
  >
    <div class="column is-5-desktop is-12-mobile is-9-tablet">
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="box mx-2">
            <form @submit.prevent="saveChanges">
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
                  native-value="en"
                  type="is-primary"
                >
                  <img
                    :src="require('../../public/img/flags/united-states.svg')"
                    width="30"
                  />
                  <span class="ml-2 is-hidden-mobile">English</span>
                </b-radio-button>
                <b-radio-button
                  v-model="locale"
                  native-value="uz"
                  type="is-primary"
                >
                  <img
                    :src="require('../../public/img/flags/uzbekistan.svg')"
                    width="30"
                  />
                  <span class="ml-2 is-hidden-mobile">O'zbekcha</span>
                </b-radio-button>
                <b-radio-button
                  v-model="locale"
                  native-value="ru"
                  type="is-primary"
                >
                  <img
                    :src="require('../../public/img/flags/russia.svg')"
                    width="30"
                  />
                  <span class="ml-2 is-hidden-mobile">Русский</span>
                </b-radio-button>
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
            <div class="mx-2">
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
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { showToastMessage, ToastType } from "@/services/toast";
import { Setting, SettingsStorage } from "@/services/storages/settings";

@Component
export default class Settings extends Vue {
  public showLatestEvent = false;
  public locale = "en";

  mounted() {
    this.loadSettings();
  }

  public async loadSettings() {
    const settings = await SettingsStorage.getSettings();
    for (const setting of settings) {
      switch (setting.key) {
        case "show_latest_event":
          this.showLatestEvent = setting.value;
          break;
        case "locale":
          this.locale = setting.value;
          break;
      }
    }
  }

  public async saveChanges() {
    const settings: Setting[] = [];

    settings.push({ key: "show_latest_event", value: this.showLatestEvent });
    settings.push({ key: "locale", value: this.locale });

    if (this.$i18n.locale != this.locale) {
      this.$i18n.locale = this.locale;
    }

    await SettingsStorage.setSettings(settings);
    this.$router.push({ name: "Home" });
    showToastMessage(
      this.$i18n.t("changes-applied") as string,
      ToastType.Success
    );
  }
}
</script>
