<template>
  <div class="bottom">
    <div
      class="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
    >
      <div>
        <b-button
          type="is-primary is-light is-large"
          icon-left="setting"
          class="mr-1"
        ></b-button>
        <b-tooltip :type="onlineStatusType">
          <b-button
            :type="{
              'is-light': true,
              'is-large': true,
              ...onlineStatusType
            }"
            icon-left="server"
          ></b-button>
          <template v-slot:content
            ><b-icon :icon="isOnline ? 'wifi' : 'wifi-slash'" size="is-small" />
            {{ isOnline ? "Connected" : "No connection" }}</template
          >
        </b-tooltip>
      </div>
      <b-tooltip>
        <b-button
          type="is-primary is-light is-medium"
          disabled
          icon-left="code-branch"
        >
          2.0.0</b-button
        >
        <template v-slot:content
          ><b-icon icon="heart" size="is-small" /> Developed by
          <b>mhw0</b></template
        >
      </b-tooltip>
      <b-button type="is-primary is-light is-large" icon-left="user"></b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class BottomBarComponent extends Vue {
  public isOnline = navigator.onLine;

  public get currentRouteName(): string | null | undefined {
    return this.$router.currentRoute.name;
  }

  public get onlineStatusType(): { [key: string]: boolean } {
    return this.isOnline ? { "is-success": true } : { "is-danger": true };
  }

  public mounted() {
    window.addEventListener("online", this.setOnlineStatus);
    window.addEventListener("offline", this.setOnlineStatus);
  }

  public beforeDestroy() {
    window.removeEventListener("online", this.setOnlineStatus);
    window.removeEventListener("offline", this.setOnlineStatus);
  }

  public setOnlineStatus(status: Event): void {
    this.isOnline = status.type === "online" ? true : false;
  }
}
</script>

<style lang="scss">
.bottom {
  width: 100%;
  position: fixed;
  bottom: 0%;
}
</style>
