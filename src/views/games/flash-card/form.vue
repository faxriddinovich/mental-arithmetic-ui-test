<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="columns is-gapless is-centered" style="min-width: 100%">
        <div class="column is-12-mobile is-10-tablet is-9-desktop is-7-fullhd">
          <b-tabs
            type="is-toggle"
            class="is-nav-tabs"
            :animated="false"
            expanded
          >
            <b-tab-item value="form">
              <template #header>
                <b-icon class="m-0" icon="notes" /><span
                  class="is-hidden-mobile"
                  >&nbsp;{{ $t("form") }}</span
                ></template
              >
              <div class="box">
                <form @submit.prevent="play">
                  <themes-input-field
                    ref="themesInputRef"
                    v-model="theme"
                    :digit="digit"
                  />
                  <b-field>
                    <template #label>
                      <b-icon icon="draggabledots" /> {{ $t("digits") }}
                    </template>
                    <b-radio-button
                      :native-value="1"
                      v-model="digit"
                      type="is-primary"
                    >
                      <span>1</span>
                    </b-radio-button>
                    <b-radio-button
                      :native-value="2"
                      v-model="digit"
                      type="is-primary"
                    >
                      <span>2</span>
                    </b-radio-button>
                    <b-radio-button
                      :native-value="3"
                      v-model="digit"
                      type="is-primary"
                    >
                      <span>3</span>
                    </b-radio-button>
                    <b-radio-button
                      :native-value="4"
                      v-model="digit"
                      type="is-primary"
                    >
                      <span>4</span>
                    </b-radio-button>
                    <b-radio-button
                      :native-value="5"
                      v-model="digit"
                      type="is-primary"
                    >
                      <span>5</span>
                    </b-radio-button>
                    <b-radio-button
                      :native-value="6"
                      v-model="digit"
                      type="is-primary"
                    >
                      <span>6</span>
                    </b-radio-button>
                  </b-field>
                  <div class="columns is-fullhd is-multiline is-gaples">
                    <div class="column is-6-fullhd pb-0">
                      <b-field :label="$t('examples')" expanded>
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
                      <b-field :label="$t('time_between')" expanded>
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
                      <b-field :label="$t('rows')" expanded>
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
                      <b-field :label="$t('time_between')" expanded>
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
                  <b-field grouped>
                    <b-field :label="$t('minutes')">
                      <b-numberinput
                        v-model="timerMins"
                        :controls="false"
                        min="0"
                        max="999"
                      />
                    </b-field>
                    <b-field :label="$t('seconds')">
                      <b-numberinput
                        v-model="timerSecs"
                        :controls="false"
                        min="0"
                        max="60"
                      />
                    </b-field>
                  </b-field>

                  <b-field :label="$t('game_mode')">
                    <b-radio-button
                      v-model="gameMode"
                      :native-value="FlashCardGameMode.abacus"
                      type="is-primary"
                    >
                      <b-icon icon="abacus" class="mx-0"></b-icon>
                    </b-radio-button>

                    <b-radio-button
                      v-model="gameMode"
                      :native-value="FlashCardGameMode.numbers"
                      type="is-primary"
                    >
                      <b-icon icon="10-plus" class="mx-0"></b-icon>
                    </b-radio-button>
                  </b-field>

                  <b-field>
                    <b-checkbox v-model="waitForAnswer">{{
                      $t("wait_for_answer")
                    }}</b-checkbox>
                  </b-field>
                  <b-field v-if="themeConfigs.length">
                    <template #label>
                      <b-icon icon="file" /> {{ $t("themes") }}
                    </template>
                    <b-taglist>
                      <b-tag
                        v-for="(themeConfig, themeConfigIndex) of themeConfigs"
                        :key="themeConfigIndex"
                        @close="removeThemeConfig(themeConfigIndex)"
                        type="is-link"
                        closable
                        >{{
                          $t(themeConfig.theme.loc, {
                            digit: themeConfig.digit,
                          })
                        }}</b-tag
                      >
                    </b-taglist>
                  </b-field>
                  <div class="is-flex mt-2">
                    <div class="field has-addons">
                      <p class="control">
                        <b-button
                          icon-left="plus"
                          :disabled="!canAddTheme"
                          @click="addTheme"
                          >{{ $t("add_theme") }}</b-button
                        >
                      </p>
                    </div>

                    <b-button
                      type="is-primary"
                      native-type="submit"
                      class="ml-2"
                      icon-left="play"
                      :disabled="!canPressPlayButton"
                      expanded
                      >{{ $t("play") }}</b-button
                    >
                  </div>
                </form>
              </div>
            </b-tab-item>
            <b-tab-item value="settings">
              <template #header>
                <b-icon class="m-0" icon="setting" /><span
                  class="is-hidden-mobile"
                  >&nbsp;{{ $t("settings") }}</span
                ></template
              >
              <div class="box">
                <b-field>
                  <template #label>
                    <b-icon icon="palette" /> {{ $t("color") }}:
                  </template>
                  <color-palette v-model="fontColor" />
                </b-field>
                <b-field>
                  <template #label>
                    <b-icon icon="setting" /> {{ $t("other_settings") }}
                  </template>
                  <b-checkbox v-model="speechSound">{{
                    $t("speech_sound")
                  }}</b-checkbox>
                </b-field>
              </div>
            </b-tab-item>
          </b-tabs>
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
<script lang="ts" src="./form.ts" />
