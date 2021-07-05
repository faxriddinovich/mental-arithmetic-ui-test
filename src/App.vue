<template>
  <router-view />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class AppComponent extends Vue { }
</script>

<style lang="scss">
// offline usage
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";

* {
  font-family: "Inter", sans-serif;
}

html, body {
  background: #eff8f3;
  height: 100%;
  user-select: none;
}
</style>
