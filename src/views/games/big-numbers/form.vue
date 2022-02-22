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
              <template #header> <b-icon icon="notes" /> Form </template>
              <div class="box">
                <form @submit.prevent="play">
                  <b-field>
                    <template #label> <b-icon icon="file" /> Theme </template>
                    <themes-input-field @pick="pickTheme" />
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
                    <b-switch
                      v-model="answerAtEnd"
                      @disabled="instances.length > 1"
                      >Answer at the end</b-switch
                    >
                  </b-field>

                  <b-field>
                    <b-switch v-model="multiplayerMode"
                      >Multiplayer mode</b-switch
                    >
                  </b-field>

                  <b-field v-if="multiplayerMode">
                    <b-switch v-model="sameExamples"
                      >Same examples for all players</b-switch
                    >
                  </b-field>

                  <b-field v-if="sequence.length">
                    <template #label> <b-icon icon="file" /> Themes </template>
                    <b-taglist>
                      <b-tag
                        v-for="(sequenceItem, sequenceItemIndex) of sequence"
                        :key="sequenceItemIndex"
                        @close="removeSequenceItem(sequenceItemIndex)"
                        type="is-link"
                        closable
                        >{{ sequenceItem.theme }}</b-tag
                      >
                    </b-taglist>
                  </b-field>

                  <div v-if="multiplayerMode && instances.length">
                    <b-field
                      v-for="(instanceItem, instanceItemIndex) of instances"
                      :key="instanceItemIndex"
                      class="m-0"
                    >
                      <template #label>
                        <span
                          :class="{
                            ['is-' +
                            instanceItem.sequence[0].fontColor +
                            '-color']: true,
                          }"
                          >{{ instanceItemIndex + 1 }}. Player</span
                        >
                        <b-icon
                          icon="trash"
                          class="is-clickable"
                          @click.native="removeInstanceItem(instanceItemIndex)"
                        />
                      </template>

                      <b-taglist class="mb-1">
                        <b-tag
                          v-for="(
                            sequenceItem, sequenceItemIndex
                          ) of instanceItem.sequence"
                          :key="sequenceItemIndex"
                          ><span class="has-text-weight-semibold">{{
                            sequenceItemIndex + 1
                          }}</span
                          >. {{ sequenceItem.theme }}</b-tag
                        >
                      </b-taglist>
                    </b-field>
                    <hr class="m-1" />
                  </div>

                  <div class="is-flex mt-2">
                    <div class="field has-addons">
                      <p class="control">
                        <b-button
                          icon-left="plus"
                          :disabled="!canAddSequenceItem"
                          @click="addSequenceItem"
                          >Add theme</b-button
                        >
                      </p>
                      <p class="control" v-if="multiplayerMode">
                        <b-button
                          icon-left="user-plus"
                          :disabled="!canAddInstanceItem"
                          @click="addInstanceItem"
                          >Add player</b-button
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
                      >Play</b-button
                    >
                  </div>
                </form>
              </div>
            </b-tab-item>
            <b-tab-item value="settings">
              <template #header> <b-icon icon="setting" /> Settings </template>
              <div class="box">
                <b-field>
                  <template #label> <b-icon icon="palette" /> Color: </template>
                  <color-palette v-model="fontColor" />
                </b-field>

                <b-field>
                  <template #label>
                    <b-icon icon="crop-alt-rotate-right" /> Rotation
                  </template>

                  <b-radio-button
                    v-model="fontRotation"
                    :native-value="0"
                    type="is-primary"
                    :disabled="multiplayerMode"
                  >
                    <span style="-webkit-transform: rotate(0deg)">-123</span>
                  </b-radio-button>

                  <b-radio-button
                    v-model="fontRotation"
                    :native-value="90"
                    type="is-primary"
                    :disabled="multiplayerMode"
                  >
                    <span style="-webkit-transform: rotate(90deg)">-123</span>
                  </b-radio-button>

                  <b-radio-button
                    v-model="fontRotation"
                    :native-value="180"
                    type="is-primary"
                    :disabled="multiplayerMode"
                  >
                    <span style="-webkit-transform: rotate(180deg)">-123</span>
                  </b-radio-button>

                  <b-radio-button
                    v-model="fontRotation"
                    :native-value="270"
                    type="is-primary"
                    :disabled="multiplayerMode"
                  >
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
                  <b-checkbox
                    v-model="displayNumbers"
                    :disabled="multiplayerMode"
                    >Display numbers</b-checkbox
                  >
                  <b-checkbox v-model="speechSound" :disabled="multiplayerMode"
                    >Speech sound</b-checkbox
                  >
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
<style lang="scss">
a.dropdown-item {
  padding-right: 16px !important;
}
</style>
