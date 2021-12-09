<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="columns is-gapless is-centered" style="min-width: 100%">
        <div class="column is-half-fullhd is-three-quarters-desktop">
          <div class="box">
            <template v-if="currentTab === 0">
              <form @submit.prevent="play">
                <b-field>
                  <template #label> <b-icon icon="file" /> Theme </template>
                  <p class="control">
                    <b-dropdown v-model="digit">
                      <template #trigger>
                        <b-button>
                          <b-icon
                            icon="dialpad-alt"
                            size="is-small"
                            class="m-0"
                          />
                          <span class="is-hidden-mobile ml-1">Digits</span>
                        </b-button>
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
                    placeholder="Search a theme"
                    icon="search"
                    :data="filteredThemes"
                    field="name"
                    v-model="theme"
                    keep-first
                    open-on-focus
                    expanded
                    required
                  >
                    <template #header>
                      <span
                        >Found:
                        <span class="has-text-weight-semibold">{{
                          filteredThemes.length
                        }}</span>
                        theme(s)</span
                      >
                    </template>

                    <template slot-scope="props">
                      <div class="is-flex is-justify-content-space-between">
                        <div>
                          <b-icon icon="file" /> {{ props.option.name }}
                        </div>
                        <div class="has-text-weight-semibold">
                          {{ props.option.op }}
                        </div>
                      </div>
                    </template>

                    <template #empty>No results found</template>
                  </b-autocomplete>
                </b-field>
                <div class="columns is-fullhd is-multiline is-gaples">
                  <div class="column is-6-fullhd pb-0">
                    <b-field label="Examples:" expanded>
                      <b-numberinput
                        v-model="examplesCount"
                        controls-position="compact"
                        min="1"
                        max="100"
                        expanded
                      ></b-numberinput>
                    </b-field>
                  </div>
                  <div class="column is-6-fullhd pb-0">
                    <b-field label="Timeout:" expanded>
                      <b-numberinput
                        v-model="examplesTimeout"
                        controls-position="compact"
                        min="0.1"
                        max="100"
                        step="0.1"
                        expanded
                      ></b-numberinput>
                    </b-field>
                  </div>
                </div>

                <!-- FIXME: mb-4 is a stupid idea -->
                <div class="columns is-fullhd is-multiline mb-4">
                  <div class="column is-6-fullhd pb-0">
                    <b-field label="Rows:" expanded>
                      <b-numberinput
                        v-model="rowsCount"
                        controls-position="compact"
                        min="1"
                        max="100"
                        expanded
                      ></b-numberinput>
                    </b-field>
                  </div>
                  <div class="column is-6-fullhd pb-0">
                    <b-field label="Timeout:" expanded>
                      <b-numberinput
                        v-model="rowsTimeout"
                        controls-position="compact"
                        min="0.1"
                        max="100"
                        step="0.1"
                        expanded
                      ></b-numberinput>
                    </b-field>
                  </div>
                </div>

                <b-field>
                  <b-switch v-model="answerAtEnd">Answer at the end</b-switch>
                </b-field>

                <b-field>
                  <b-switch v-model="multiplayerMode"
                    >Multiplayer mode</b-switch
                  >
                </b-field>

                <b-field
                  :label="multiplayerMode ? 'Players' : 'Queue'"
                  v-if="queue.length"
                >
                  <b-taglist>
                    <b-tag
                      type="is-link"
                      v-for="(settings, index) of queue"
                      :key="index"
                      @close="removeFromQueueList(index)"
                      closable
                      >{{ settings.theme }}</b-tag
                    >
                  </b-taglist>
                </b-field>

                <div class="is-flex mt-5">
                  <b-button icon-left="setting" @click="currentTab = 1" />
                  <b-button
                    type="is-success"
                    :icon-left="multiplayerMode ? 'user-plus' : 'plus'"
                    @click="addToQueueList"
                    class="ml-2"
                    :disabled="
                      multiplayerMode ? queue.length === 9 : queue.length === 10
                    "
                    >{{
                      multiplayerMode ? "Add to players list" : "Add to queue"
                    }}</b-button
                  >
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
                <template #label> <b-icon icon="palette" /> Color: </template>
                <span
                  :class="{
                    'is-circled-color': true,
                    'is-selected': color == fontColor,
                    ['is-' + color + '-bg-color']: true,
                  }"
                  v-for="(color, index) of fontColors"
                  :key="index"
                  @click="fontColor = color"
                />
              </b-field>

              <b-field>
                <template #label>
                  <b-icon icon="crop-alt-rotate-right" /> Rotation
                </template>

                <b-radio-button
                  v-model="fontRotation"
                  :native-value="0"
                  type="is-primary"
                >
                  <span style="-webkit-transform: rotate(0deg)">-123</span>
                </b-radio-button>

                <b-radio-button
                  v-model="fontRotation"
                  :native-value="90"
                  type="is-primary"
                >
                  <span style="-webkit-transform: rotate(90deg)">-123</span>
                </b-radio-button>

                <b-radio-button
                  v-model="fontRotation"
                  :native-value="180"
                  type="is-primary"
                >
                  <span style="-webkit-transform: rotate(180deg)">-123</span>
                </b-radio-button>

                <b-radio-button v-model="fontRotation" :native-value="270">
                  <span style="-webkit-transform: rotate(270deg)">-123</span>
                </b-radio-button>
              </b-field>

              <b-field>
                <template #label> <b-icon icon="font" /> Font size </template>
                <b-radio-button
                  v-model="fontSize"
                  type="is-primary"
                  :native-value="font"
                  v-for="(font, index) of fontSizes"
                  :key="index"
                  :disabled="multiplayerMode"
                >
                  <span :style="`font-size: ${16 + index * 4}px`">123</span>
                </b-radio-button>
              </b-field>

              <b-field>
                <template #label>
                  <b-icon icon="setting" /> Other settings
                </template>
                <b-checkbox v-model="displayNumbers" :disabled="multiplayerMode"
                  >Display numbers</b-checkbox
                >
                <b-checkbox v-model="hasSound" :disabled="multiplayerMode"
                  >Has sound</b-checkbox
                >
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
    </div>
  </section>
</template>
<script lang="ts" src="./numbers.ts" />
<style lang="scss">
.is-circled-color {
  display: inline-block;
  border-radius: 50%;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-right: 7px;
}

.is-circled-color.is-selected {
  border: 2px solid black;
}
a.dropdown-item {
  padding-right: 16px !important;
}
</style>
