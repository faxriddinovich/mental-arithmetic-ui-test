<template>
  <div
    class="columns is-centered is-vcentered is-mobile m-0"
    style="height: 100vh"
  >
    <div class="column is-5-widescreen is-6-desktop is-12-mobile is-9-tablet">
      <div class="box">
        <form @submit.prevent="play">
          <b-field>
            <template #label> <b-icon icon="file" /> Theme </template>
            <b-autocomplete
              rounded
              placeholder="Search a theme"
              icon="search"
              clearable
              expanded
            >
              <template #empty>No results found</template>
            </b-autocomplete>
            <b-dropdown v-model="theme" aria-role="list" class="ml-4">
              <template #trigger>
                <b-button
                  label="Digits"
                  type="is-primary"
                  icon-left="angle-down"
                />
              </template>

              <b-dropdown-item value="1" aria-role="listitem">
                <div class="media">
                  <b-icon class="media-left" icon="angle-right"></b-icon>
                  <div class="media-content">1</div>
                </div>
              </b-dropdown-item>
              <b-dropdown-item value="2" aria-role="listitem">
                <div class="media">
                  <b-icon class="media-left" icon="angle-right"></b-icon>
                  <div class="media-content">2</div>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </b-field>
          <b-field>
            <template #label>
              <b-icon icon="angle-right" /> Examples count
            </template>
            <b-numberinput v-model="periodicity"></b-numberinput>
          </b-field>
          <b-field>
            <template #label>
              <b-icon icon="angle-right" /> Rows count
            </template>
            <b-numberinput v-model="periodicity"></b-numberinput>
          </b-field>
          <b-field>
            <template #label>
              <b-icon icon="clock" /> Interval betwen examples
            </template>
            <b-numberinput v-model="periodicity"></b-numberinput>
          </b-field>
          <b-field>
            <template #label>
              <b-icon icon="clock" /> Interval between rows
            </template>
            <b-numberinput v-model="periodicity"></b-numberinput>
          </b-field>
          <b-button
            native-type="submit"
            type="is-primary mt-5"
            icon-left="play"
            expanded
            >Play</b-button
          >
        </form>
      </div>
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
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class GameNumbers extends Vue {
  public digits = "1";
  public periodicity = 4;
  public theme = "1";

  public play() {
    this.$router.push({ name: "PlayNumbersGame" });
  }
}
</script>
