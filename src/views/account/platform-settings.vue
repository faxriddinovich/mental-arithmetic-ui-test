<template>
  <div class="card p-4 is-bordered">
    <form @submit.prevent="saveChanges" v-if="settings">
      <b-field
        v-for="(setting, index) of settings"
        :key="setting.key"
        :label="humanReadableLabel(setting.key)"
        required
      >
        <b-numberinput v-model="settings[index].value" :controls="false">
        </b-numberinput>
      </b-field>
      <div class="has-text-right">
        <b-button type="is-success" icon-left="save" native-type="submit"
          >Save changes</b-button
        >
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rpc } from "@/rpc/rpc";
import {
  RPC_GET_SETTINGS_METHOD,
  RPC_UPDATE_SETTINGS_METHOD,
} from "@/rpc/methods";

@Component
export default class PlatformSettings extends Vue {
  public settings = null;

  mounted() {
    rpc.call(RPC_GET_SETTINGS_METHOD).then((settings) => {
      this.settings = settings;
    });
  }

  public humanReadableLabel(key: string) {
    let humanReadable = "";
    switch (key) {
      case "sub_cost_per_day":
        humanReadable = "Subscription cost per day (soums):";
        break;
      case "purch_course_comission":
        humanReadable = "Purchase comission (% percent):";
        break;
      case "max_upload_size":
        humanReadable = "Max. upload size (in bytes):";
        break;
    }
    return humanReadable;
  }

  public saveChanges() {
    rpc.call(RPC_UPDATE_SETTINGS_METHOD, this.settings).then(() => {
      this.$buefy.toast.open({
        type: "is-success",
        message: "Successfully saved!",
      });
    });
  }
}
</script>
