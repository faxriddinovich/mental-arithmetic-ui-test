<template>
  <div class="top-level">
    <router-view />
    <bottom-bar-component v-if="canRenderBottomBar" />
  </div>
</template>

<script lang="ts">
import BottomBarComponent from "@/components/BottomBar.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: { BottomBarComponent }
})
export default class AppComponent extends Vue {
  public canRenderBottomBar = !!!["Activation"].includes(
    this.$router.currentRoute.name || ""
  );
}
</script>

<style lang="scss">
// offline usage
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";

* {
  font-family: "Inter", sans-serif;
}

.top-level {
  background: #ecf0f1;
  height: 100vh;
  user-select: none;
}
</style>
