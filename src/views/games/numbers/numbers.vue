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
          <div class="columns is-mobile">
            <div class="column">
              <b-field>
                <template #label>
                  <b-icon icon="angle-right" /> Examples:
                </template>
                <b-numberinput
                  v-model="periodicity"
                  :controls="false"
                ></b-numberinput>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <template #label>
                  <b-icon icon="angle-right" /> Rows:
                </template>
                <b-numberinput
                  v-model="periodicity"
                  :controls="false"
                ></b-numberinput>
              </b-field>
            </div>
            <!--
            <div class="column">
            <b-field>
              <template #label>
                <b-icon icon="angle-right" /> Direction:
              </template>
            <b-radio-button v-model="direction"
                native-value="right"
                type="is-primary is-light is-outlined">
                <b-icon icon="arrow-right" class="m-0"></b-icon>
            </b-radio-button>

<b-radio-button v-model="direction"
                native-value="top"
                type="is-danger is-light is-outlined"> <b-icon icon="arrow-down" class="m-0"></b-icon> </b-radio-button>

            <b-radio-button v-model="transformation"
                native-value="Yep"
                type="is-success is-light is-outlined">
                <b-icon icon="arrow-up" class="m-0"></b-icon>
            </b-radio-button>


            </b-field>
            </div>
-->
          </div>

          <div class="columns is-mobile">
            <div class="column">
              <b-field>
                <template #label>
                  <b-icon icon="clock" /> Delay between examples:
                </template>
                <b-numberinput
                  v-model="periodicity"
                  :controls="false"
                ></b-numberinput>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <template #label>
                  <b-icon icon="clock" /> Delay between rows:
                </template>
                <b-numberinput
                  v-model="periodicity"
                  :controls="false"
                ></b-numberinput>
              </b-field>
            </div>
          </div>

          <b-collapse
            :open="false"
            position="is-bottom"
            aria-id="contentIdForA11y1"
          >
            <template #trigger="props">
              <a aria-controls="contentIdForA11y1">
                <span v-if="!props.open">
                  <b-icon icon="cog"></b-icon>
                  Advenced options
                </span>
              </a>
            </template>
            <b-field>
              <template #label>
                <b-icon icon="palette" /> Numbers Color:
              </template>
              <div class="is-flex">
                <span
                  class="is-color is-selected"
                  style="background: #34495e"
                />
                <span
                  class="ml-2 is-color is-large"
                  style="background: #1abc9c"
                />
                <span
                  class="ml-2 is-color is-large"
                  style="background: #27ae60"
                />
                <span
                  class="ml-2 is-color is-large"
                  style="background: #2ecc71"
                />
                <span
                  class="ml-2 is-color is-large"
                  style="background: #3498db"
                />
                <span
                  class="ml-2 is-color is-large"
                  style="background: #9b59b6"
                />
                <span
                  class="ml-2 is-color is-large"
                  style="background: #f1c40f"
                />
                <span
                  class="ml-2 is-color is-large"
                  style="background: #e67e22"
                />
                <span
                  class="ml-2 is-color is-large"
                  style="background: #e74c3c"
                />
              </div>
            </b-field>

            <b-field>
              <template #label>
                <b-icon icon="crop-alt-rotate-right" /> Numbers Transformation
              </template>

              <b-radio-button
                v-model="transformation"
                native-value="0"
                type="is-primary"
              >
                <b-icon icon="rotate-360"></b-icon>
                <span style="-webkit-transform: rotate(0deg)">-123</span>
              </b-radio-button>

              <b-radio-button
                v-model="transformation"
                native-value="90"
                type="is-primary"
              >
                <b-icon icon="rotate-360"></b-icon>
                <span style="-webkit-transform: rotate(90deg)">-123</span>
              </b-radio-button>

              <b-radio-button
                v-model="transformation"
                native-value="180"
                type="is-primary"
              >
                <b-icon icon="rotate-360"></b-icon>
                <span style="-webkit-transform: rotate(180deg)">-123</span>
              </b-radio-button>

              <b-radio-button v-model="transformation" native-value="270">
                <b-icon icon="rotate-360"></b-icon>
                <span style="-webkit-transform: rotate(270deg)">-123</span>
              </b-radio-button>
            </b-field>
            <b-field>
              <template #label>
                <b-icon icon="volume" /> Display & Sound
              </template>
              <b-checkbox>Display numbers</b-checkbox>
              <b-checkbox>Has Sound</b-checkbox>
            </b-field>
          </b-collapse>

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
  public transformation = "0";
  public theme = "1";
  public carousels = [
    { text: "Slide 1", color: "primary" },
    { text: "Slide 2", color: "info" },
    { text: "Slide 3", color: "success" },
    { text: "Slide 4", color: "warning" },
    { text: "Slide 5", color: "danger" },
  ];

  public play() {
    this.$router.push({ name: "PlayNumbersGame" });
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
}

.is-color.is-selected {
  box-shadow: 0px 0px 5px black;
}
</style>
