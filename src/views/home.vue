<template>
  <div class="container is-max-widescreen pt-4 px-3">
    <main-top-navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MainTopNavbar from "@/components/main-top-navbar.vue";

@Component({ components: { MainTopNavbar } })
export default class Home extends Vue {}
</script>
