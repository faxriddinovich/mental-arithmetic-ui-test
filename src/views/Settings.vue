<template>
  <div
    class="is-flex is-justify-content-center is-align-items-center"
    style="height: 100vh"
  >
    <div class="box">
      <b-icon icon="setting" /><span class="is-size-5 has-text-weight-medium"
        >Settings</span
      >
      <hr />

      <b-field label="Your name">
        <b-input value="Kevin Garvey"></b-input>
      </b-field>
      <b-field label="Select mode">
        <b-switch>Offline mode</b-switch>
      </b-field>
      <b-field label="Select your language">
        <b-radio-button v-model="lang" native-value="uz" type="is-primary"
          ><img src="https://www.countryflags.io/ru/flat/16.png" />
          <span>Russian</span></b-radio-button
        >
        <b-radio-button v-model="lang" native-value="ru" type="is-primary"
          ><img src="https://www.countryflags.io/uz/flat/16.png" />
          Uzbek</b-radio-button
        >
        <b-radio-button v-model="lang" native-value="en" type="is-primary"
          ><img src="https://www.countryflags.io/us/flat/16.png" />
          English</b-radio-button
        >
      </b-field>

      <b-button type="is-primary" expanded
        ><b-icon icon="save" /> <span>Save changes</span></b-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class SettingsComponent extends Vue {
  public lang: string = "en";
}
</script>
<style lang="scss" scoped></style>
