<template>
  <div class="is-flex card p-3">
    <b-dropdown
      v-model="selectedOptions"
      :mobile-modal="false"
      multiple
      aria-role="list"
    >
      <template #trigger>
        <b-button icon-right="filter"> Apply filter </b-button>
      </template>

      <b-dropdown-item value="option1" aria-role="listitem">
        <span>Only free courses</span>
      </b-dropdown-item>

      <b-dropdown-item value="option2" aria-role="listitem">
        <span>Last added</span>
      </b-dropdown-item>

      <b-dropdown-item value="option3" aria-role="listitem">
        <span>Popular</span>
      </b-dropdown-item>
    </b-dropdown>
    <b-input
      class="is-flex-grow-1 ml-3"
      placeholder="Course name, author name"
      type="search"
      icon="search"
    >
    </b-input>
    <b-button type="is-primary" class="ml-3" icon-left="search"
      >Search</b-button
    >
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class MainSearchBar extends Vue {
  public selectedOptions = [];
}
</script>
