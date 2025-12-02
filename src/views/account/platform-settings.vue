<template>
  <div class="card p-4 is-bordered">
    <form @submit.prevent="saveChanges" v-if="settings">
      <b-field
        v-for="(setting, index) of localSettings"
        :key="setting.key"
        :label="humanReadableLabel(setting.key)"
        required
      >
        <b-numberinput v-model="localSettings[index].value" :controls="false">
        </b-numberinput>
      </b-field>
      <div class="has-text-right">
        <b-button
          type="is-success"
          icon-left="save"
          native-type="submit"
          :disabled="!fieldDiff"
          >Save changes</b-button
        >
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { diff } from "deep-diff";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_SETTINGS_METHOD,
  RPC_UPDATE_SETTINGS_METHOD,
} from "@/services/rpc/methods";

@Component
export default class PlatformSettings extends Vue {
  public localSettings = null;
  public settings = null;

  mounted() {
    rpc.call(RPC_GET_SETTINGS_METHOD).then((settings) => {
      this.settings = settings;
      this.localSettings = settings.map((setting) =>
        Object.assign({}, setting)
      );
    });
  }

  public get fieldDiff() {
    return diff(this.settings, this.localSettings);
  }

  public humanReadableLabel(key: string) {
    let humanReadable = "";
    switch (key) {
      case "subscription_cost_per_day":
        humanReadable = "Subscription cost per day (in sums):";
        break;
      case "purchase_course_comission":
        humanReadable = "Purchase comission (in percent):";
        break;
      case "max_upload_file_size":
        humanReadable = "Max. upload size (in bytes):";
        break;
    }
    return humanReadable;
  }

  // FIXME: typescript types
  public saveChanges() {
    const params = [];

    for (const field of this.fieldDiff) {
      params.push(this.localSettings[field.path[0]]);
    }

    rpc.call(RPC_UPDATE_SETTINGS_METHOD, params).then(() => {
      showToastMessage("Successfully saved!", ToastType.Success);
    });
  }
}
</script>
