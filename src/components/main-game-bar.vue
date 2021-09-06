<template>
  <div class="columns is-variable is-2 is-mobile is-multiline">
    <div
      class="column is-6-mobile is-4-tablet is-2-desktop"
      v-for="item of items"
      :key="item.icon"
    >
      <router-link
      :to="item.link"
        class="
          card
          is-clickable is-flex is-flex-direction-column is-align-items-center
          py-4
        "
      >
        <b-icon :icon="item.icon" type="is-primary" size="is-large" />
        <span class="has-text-weight-semibold mt-1">{{ item.title }}</span>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class MainGameBar extends Vue {
  public items = [
    { title: "Abacus", icon: "abacus", link: "/" },
    { title: "Numbers", icon: "10-plus", link: "/" },
    { title: "Flash card", icon: "square-shape", link: "/" },
    { title: "Table", icon: "browser", link: "/"},
    { title: "Scores", icon: "chart-line", link: "/" },
    { title: "Settings", icon: "setting", link: "/settings" },
  ];
}
</script>
