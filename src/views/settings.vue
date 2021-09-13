<template>
  <div class="is-flex is-centered is-vcentered columns" style="height: 100vh">
    <div class="column is-4-desktop is-12-mobile is-9-tablet">
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="box mx-2">
            <form @submit.prevent="saveChanges">
              <div v-for="setting of settings" :key="setting.key">
                <b-field
                  v-if="setting.key === 'show_latest_event'"
                  label="Show the latest event"
                >
                  <b-checkbox v-model="setting.value">
                    Will be {{ setting.value ? "shown" : "hidden" }}
                  </b-checkbox>
                </b-field>
              </div>
              <b-button
                class="mt-4"
                native-type="submit"
                type="is-primary"
                icon-left="save"
                expanded
                >Save changes</b-button
              >
            </form>
          </div>
        </div>
        <div class="column is-12-desktop">
          <div class="mx-2">
            <b-button tag="router-link" to="/" icon-left="home" expanded
              >Home</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Database } from "@/services/indexeddb/database";
import { Setting } from "@/services/indexeddb/interfaces";

@Component
export default class Settings extends Vue {
  public showLatestEvent = false;

  public settings: Setting[] = [];

  async mounted() {
    this.settings = await Database.getSettings();
  }

  public saveChanges() {
    Database.applySettings(this.settings).then(() => {
      this.$buefy.toast.open({
        type: "is-success",
        message: "Changes applied!",
      });
    });
  }
}
</script>
