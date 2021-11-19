<template>
  <div
    class="columns is-centered is-vcentered is-mobile m-0"
    style="height: 100vh"
  >
    <div class="column is-5-widescreen is-6-desktop is-12-mobile is-9-tablet">
      <div class="box">
        <template v-if="currentTab === 0">
          <form @submit.prevent="play">
            <b-field>
              <template #label> <b-icon icon="file" /> Theme </template>
              <p class="control">
                <b-dropdown>
                  <template #trigger>
                    <b-button label="Digits" icon-right="dialpad-alt" />
                  </template>

                  <b-dropdown-item custom>Select Digits</b-dropdown-item>
                  <b-dropdown-item separator></b-dropdown-item>
                  <b-dropdown-item value="1">1</b-dropdown-item>
                  <b-dropdown-item value="2">2</b-dropdown-item>
                  <b-dropdown-item value="3">3</b-dropdown-item>
                  <b-dropdown-item value="4">4</b-dropdown-item>
                  <b-dropdown-item value="5">5</b-dropdown-item>
                  <b-dropdown-item value="6">6</b-dropdown-item>
                </b-dropdown>
              </p>
              <b-autocomplete
                rounded
                placeholder="Search a theme"
                icon="search"
                clearable
                expanded
              >
                <template #empty>No results found</template>
              </b-autocomplete>
              <p class="control">
                <b-button type="is-success" label="Queue" icon-left="plus" />
              </p>
            </b-field>

            <b-field>
              <b-taglist>
                <b-tag type="is-primary" closable>Senior comrades</b-tag>
                <b-tag type="is-primary" closable>Junior comrades</b-tag>
              </b-taglist>
            </b-field>

            <b-field grouped>
              <b-field label="Examples:" expanded>
                <b-numberinput
                  v-model="examplesCount"
                  controls-position="compact"
                  expanded
                ></b-numberinput>
              </b-field>
              <b-field>
                <template #label>&nbsp;</template>
                <b-icon icon="align-center-h" size="is-medium" />
              </b-field>
              <b-field label="Interval:" expanded>
                <b-numberinput
                  v-model="examplesInterval"
                  controls-position="compact"
                  expanded
                ></b-numberinput>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Rows:" expanded>
                <b-numberinput
                  v-model="rowsCount"
                  controls-position="compact"
                  expanded
                ></b-numberinput>
              </b-field>
              <b-field>
                <template #label>&nbsp;</template>
                <b-icon icon="align-center-h" size="is-medium" />
              </b-field>
              <b-field label="Interval:" expanded>
                <b-numberinput
                  v-model="rowsInterval"
                  controls-position="compact"
                  expanded
                ></b-numberinput>
              </b-field>
            </b-field>
            <div class="is-flex mt-5">
              <b-button icon-left="setting" @click="currentTab = 1" />
              <b-button
                type="is-primary"
                native-type="submit"
                class="ml-2"
                icon-left="play"
                expanded
                >Play</b-button
              >
            </div>
          </form>
        </template>
        <template v-else>
          <b-field>
            <template #label>
              <b-icon icon="palette" /> Numbers Color:
            </template>
            <span
              :class="{ 'is-color': true, 'is-selected': color == hexColor }"
              :style="'background: ' + color"
              v-for="(color, index) of colors"
              :key="index"
              @click="hexColor = color"
            />
          </b-field>

          <b-field>
            <template #label>
              <b-icon icon="crop-alt-rotate-right" /> Numbers Transformation
            </template>

            <b-radio-button
              v-model="transformation"
              :native-value="0"
              type="is-primary"
            >
              <b-icon icon="rotate-360"></b-icon>
              <span style="-webkit-transform: rotate(0deg)">-123</span>
            </b-radio-button>

            <b-radio-button
              v-model="transformation"
              :native-value="90"
              type="is-primary"
            >
              <b-icon icon="rotate-360"></b-icon>
              <span style="-webkit-transform: rotate(90deg)">-123</span>
            </b-radio-button>

            <b-radio-button
              v-model="transformation"
              :native-value="180"
              type="is-primary"
            >
              <b-icon icon="rotate-360"></b-icon>
              <span style="-webkit-transform: rotate(180deg)">-123</span>
            </b-radio-button>

            <b-radio-button v-model="transformation" :native-value="270">
              <b-icon icon="rotate-360"></b-icon>
              <span style="-webkit-transform: rotate(270deg)">-123</span>
            </b-radio-button>
          </b-field>

          <b-field>
            <template #label>
              <b-icon icon="volume" /> Display & Sound
            </template>
            <b-checkbox v-model="displayNumbers">Display numbers</b-checkbox>
            <b-checkbox v-model="hasSound">Has sound</b-checkbox>
          </b-field>

          <b-button
            class="mt-5"
            icon-left="arrow-left"
            @click="currentTab = 0"
            expanded
            >Back</b-button
          >
        </template>
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
  public colors = [
    "#34495e",
    "#1abc9c",
    "#27ae60",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
  ];
  public currentTab = 0;

  public examplesCount = 10;
  public examplesInterval = 3.2;
  public rowsCount = 10;
  public rowsInterval = 0.3;

  public displayNumbers = true;
  public hasSound = true;
  public transformation = 0;
  public hexColor = this.colors[0];

  public play() {
    this.$router.push({ name: "PlayNumbersGame" });
  }

  public changeColor(hexColor: string) {
    this.hexColor = hexColor;
  }
}
</script>
<style lang="scss">
.is-color {
  display: inline-block;
  border-radius: 50%;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-right: 7px;
}

.is-color.is-selected {
  border: 2px solid black;
}
</style>
