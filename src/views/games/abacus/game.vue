<template>
  <div>
    <!-- controls bar -->
    <section class="card is-bordered" v-if="displayMode !== 'scores'">
      <div class="p-2">
        <div
          class="is-flex is-align-items-center is-justify-content-space-between"
        >
          <b-button
            tag="router-link"
            :to="{ name: 'AbacusGameForm' }"
            size="is-medium"
            active
            ><b-icon icon="arrow-left" class="m-0" /><span
              class="is-hidden-mobile"
              >Back</span
            ></b-button
          >
          <div class="is-flex is-align-items-center">
            <span v-if="timerEnabled">
              <span :class="timerClasses">
                <b-icon icon="stopwatch" size="is-medium" />
                {{ timerAbsolute | timerFormat }}
              </span>
            </span>
            <span v-else>
              <b-icon icon="abacus" size="is-large" type="is-primary" />
            </span>
          </div>

          <b-dropdown aria-role="list" class="is-hidden-tablet">
            <template #trigger>
              <b-button size="is-medium" active
                ><b-icon icon="bars" class="m-0" /><span
                  class="is-hidden-mobile"
                  >Menu</span
                ></b-button
              >
            </template>

            <b-dropdown-item aria-role="listitem" @click="onReshowCurrentTheme"
              ><b-icon icon="redo" size="is-small" /> Reshow the current
              theme</b-dropdown-item
            >
            <b-dropdown-item
              aria-role="listitem"
              @click="onReshowCurrentExample"
              ><b-icon icon="redo" size="is-small" /> Reshow the current
              example</b-dropdown-item
            >
            <hr class="dropdown-divider" aria-role="menuitem" />
            <b-dropdown-item aria-role="listitem" @click="onRepeat"
              ><b-icon icon="sync-exclamation" size="is-small" />
              Repeat</b-dropdown-item
            >
          </b-dropdown>
          <b-button
            class="is-hidden-mobile"
            size="is-medium"
            active
            @click="onRepeat"
            ><b-icon icon="redo" class="m-0" /><span class="is-hidden-mobile"
              >Repeat</span
            ></b-button
          >
        </div>
      </div>
      <b-progress
        type="is-success"
        class="completed-progress"
        :value="completedExamplesPercent"
      />
    </section>
    <!-- end controls bar -->

    <!-- confetti screen -->
    <canvas class="is-confetti" ref="confettiRef" />

    <!-- abacus board -->
    <div v-show="canDisplayAbacus" class="is-abacus-board-container">
      <div ref="abacusContainerRef" />
    </div>

    <!-- cards display -->
    <Flicking
      :options="flickingOptions"
      ref="flickingRef"
      @changed="onCardChanged"
      v-show="displayMode === 'cards'"
    >
      <div
        class="flicking-panel"
        v-for="(text, index) of attentionTexts"
        :key="index"
      >
        <div class="is-attention-text">
          <scalable-text :text="text" class="is-full-size" />
        </div>
      </div>

      <template v-for="(sequenceItem, sequenceIndex) in sequence">
        <div class="flicking-panel" :key="'s-' + sequenceIndex">
          <div class="is-attention-text">
            <scalable-text
              :text="$t(sequenceItem.theme, { digit: sequenceItem.digit })"
              class="is-full-size"
            />
          </div>
        </div>

        <template v-for="(example, exampleIndex) in sequenceItem.examples">
          <div
            class="flicking-panel"
            :key="'e-' + sequenceIndex + '-' + exampleIndex"
          >
            <div class="is-attention-text">
              <scalable-text
                :text="'Example ' + (exampleIndex + 1)"
                class="is-full-size"
              />
            </div>
          </div>

          <div class="flicking-panel" :key="'rr' + sequenceIndex + exampleIndex"
              :data-si="sequenceIndex"
              :data-ei="exampleIndex"
              :data-ri="1"
              :data-rv="example.numbers[0]"

          >
            <div :class="`is-${config.fontColor}-bg-color`">
                <svg class="is-full-size" viewBox="0 0 484 230">
                  <text fill="#fff" x="0" y="115" dominant-baseline="middle" text-anchor="start" font-size="80px" opacity=".9">÷</text>
                  <text fill="#fff" x="484" y="20" font-size="90px" text-anchor="end" dominant-baseline="hanging">{{ example.numbers[0] }}</text>
                  <line x1="80" y1="115" x2="484" y2="115" stroke="white" stroke-width="6" stroke-opacity=".9" />
                  <text fill="#fff" x="484" y="200" font-size="90px" text-anchor="end" dominant-baseline="auto">{{ example.numbers[1] }}</text>
                </svg>
            </div>
          </div>

          <!--
          <template v-for="(row, rowIndex) in example.numbers">
            <div
              class="flicking-panel"
              :key="'r-' + sequenceIndex + '-' + exampleIndex + '-' + rowIndex"
              :data-si="sequenceIndex"
              :data-ei="exampleIndex"
              :data-ri="rowIndex"
              :data-rv="row"
            >
              <div :class="`is-${config.fontColor}-bg-color`">
                <svg class="is-full-size" viewBox="0 0 484 230">
                  <text fill="#fff" x="0" y="115" dominant-baseline="middle" text-anchor="start" font-size="80px" opacity=".9">÷</text>
                  <text fill="#fff" x="484" y="20" font-size="90px" text-anchor="end" dominant-baseline="hanging">{{ row }}</text>
                  <line x1="80" y1="115" x2="484" y2="115" stroke="white" stroke-width="6" stroke-opacity=".9" />
                  <text fill="#fff" x="484" y="200" font-size="90px" text-anchor="end" dominant-baseline="auto">{{ example.numbers[rowIndex+1] }}</text>
                </svg>
              </div>
            </div>
          </template>
          -->

        </template>
      </template>
    </Flicking>
    <!-- end cards display -->

    <div
      class="buttons is-centered is-hidden-mobile"
      v-if="displayMode === 'cards'"
    >
      <b-button icon-left="redo" @click="onReshowCurrentTheme"
        >Reshow the current theme</b-button
      >
      <b-button icon-left="redo" @click="onReshowCurrentExample"
        >Reshow the current example</b-button
      >
    </div>

    <!-- wait display -->
    <section style="padding-top: 160px" v-if="displayMode === 'wait'">
      <div
        class="
          has-text-centered
          is-size-4-touch is-size-2-desktop
          mb-5
          mx-4
          has-text-weight-semibold
        "
      >
        <span>Please solve the expressions sequentially</span>
      </div>
      <div class="buttons is-justify-content-center">
        <b-button icon-left="redo" @click="onShowAgain">Show again</b-button>
        <b-button icon-left="align-left-justify" @click="onShowAnswer"
          >Answer</b-button
        >
        <b-button type="is-link" icon-right="arrow-right" @click="onNextExample"
          >Next</b-button
        >
      </div>
    </section>
    <!-- end wait display -->

    <!-- answer display -->
    <section class="hero is-fullheight" v-else-if="displayMode === 'answer'">
      <div class="hero-body is-justify-content-center p-0">
        <div class="columns is-gapless is-centered" style="min-width: 100%">
          <div class="column is-5-fullhd is-three-quarters-desktop">
            <div class="box mx-2">
              <div class="is-size-3 has-text-weight-semibold has-text-centered">
                <span
                  v-for="(row, rowIndex) of currentExample.numbers"
                  :key="rowIndex"
                >
                  {{ row | normalizeSign }}&nbsp;
                </span>
                <div class="has-text-centered">
                  <span class="has-text-success has-text-weight-bold is-size-2"
                    >= {{ currentExample.answer }}</span
                  >
                </div>
              </div>

              <hr class="my-4" />
              <div class="field is-grouped is-grouped-multiline">
                <div
                  class="control"
                  v-for="(row, rowIndex) in currentExample.numbers.length - 1"
                  :key="rowIndex"
                >
                  <div class="tags has-addons">
                    <span class="tag is-medium"
                      ><span class="has-text-weight-bold"
                        >{{ currentExample.answerMap[rowIndex] }}&nbsp;</span
                      >
                      {{ currentExample.numbers[rowIndex + 1] | normalizeSign }}
                      =
                    </span>
                    <span class="tag is-primary is-medium">{{
                      currentExample.answerMap[rowIndex + 1]
                    }}</span>
                  </div>
                </div>
              </div>

              <hr class="mt-0 mb-2" />
              <div class="is-flex">
                <b-button icon-left="redo" @click="onShowAgain" expanded
                  >Show again</b-button
                >
                <b-button
                  icon-right="arrow-right"
                  class="ml-3"
                  @click="onNextExample"
                  expanded
                  >Next example</b-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end answer display -->

    <!-- scores display -->
    <section class="hero is-fullheight" v-else-if="displayMode === 'scores'">
      <div class="hero-body is-justify-content-center p-0">
        <div class="columns is-gapless is-centered" style="min-width: 100%">
          <div class="column is-10-tablet is-7-desktop is-6-fullhd">
            <div class="mx-2">
              <stacked-cards :count="2">
                <img
                  :class="trophyClasses"
                  :src="require('@@/img/trophy.png')"
                />
                <div class="p-4">
                  <div :class="gameScoresTextClasses">
                    You {{ wonTheGame ? "won" : "lost" }}!
                  </div>

                  <b-progress
                    size="is-medium"
                    :type="wonTheGame ? 'is-success' : 'is-danger'"
                    :value="completedExamplesPercent"
                    format="percent"
                    show-value
                  >
                  </b-progress>
                  <nav class="level is-mobile">
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Completed examples</p>
                        <p class="title">
                          {{ completedExamplesCount }}
                        </p>
                      </div>
                    </div>
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Spent time</p>
                        <p class="title">
                          {{ (config.timerSecs - timerAbsolute) | timerFormat }}
                        </p>
                      </div>
                    </div>
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Total time</p>
                        <p class="title">
                          {{ config.timerSecs | timerFormat }}
                        </p>
                      </div>
                    </div>
                  </nav>
                  <span class="is-dotted">
                    <span class="is-left is-size-5-tablet mr-3"
                      >Total examples:</span
                    >
                    <span class="is-dots"></span>
                    <span
                      class="
                        is-right is-size-5-mobile is-size-4-tablet
                        has-text-weight-bold
                        ml-2
                      "
                      >{{ totalExamplesCount }}</span
                    >
                  </span>

                  <span class="is-dotted">
                    <span class="is-left is-size-5-tablet mr-3"
                      >Total rows:</span
                    >
                    <span class="is-dots"></span>
                    <span
                      class="
                        is-right is-size-5-mobile is-size-4-tablet
                        has-text-weight-bold
                        ml-2
                      "
                      >{{ totalRowsCount }}</span
                    >
                  </span>

                  <hr />
                  <div class="is-flex">
                    <b-button
                      tag="router-link"
                      :to="{ name: 'AbacusGameForm' }"
                      icon-left="arrow-left"
                      expanded
                      active
                      >Back</b-button
                    >
                    <b-button
                      class="ml-2"
                      icon-left="refresh"
                      @click="onRepeat"
                      expanded
                      active
                      >Repeat</b-button
                    >
                  </div>
                </div>
              </stacked-cards>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end scores display -->
  </div>
</template>
<script lang="ts" src="./game.ts"></script>
<style lang="scss">
@import "bulma/sass/utilities/mixins";
@import "./node_modules/@egjs/vue-flicking/dist/flicking";

$small: 376px;
$extra-small: 321px;

.flicking-camera {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: relative;
  width: 100%;
}

.flicking-viewport {
  width: 100%;
  margin-top: 20px;
  pointer-events: none;

  @include until($small) {
    margin: 0px;
  }
}

@include mobile {
  .flicking-panel {
    width: 100% !important;
  }
}

@include tablet {
  .flicking-panel {
    width: 50% !important;
  }
}

@include desktop {
  .flicking-panel {
    width: 30% !important;
  }
}

.flicking-camera {
  margin-bottom: 10px;
}

/* unused, but looks cool */
.flicking-panel.active {
  box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.05),
    inset -5px -5px 5px rgba(255, 255, 255, 0.5),
    5px 5px 5px rgba(0, 0, 0, 0.05), -5px -5px 5px rgba(255, 255, 255, 0.5);
}

.ma-divident {
  text-align: right;
  font-size: 90px;
  line-height: 1;
  margin-bottom:10px;
  span {
    border-bottom: 6px solid rgba(255, 255, 255, .5);
  }
}

.ma-divisor {
  text-align: right;
  font-size: 90px;
  line-height: 1;
}

.ma-operation {
  font-size: 90px;
  position: absolute !important;
  bottom: 51% !important;
  line-height: 0;
}

.flicking-panel {
  position: relative;
  color: white;
  width: 30%;
  height: 250px;
  border-radius: 5px;
  margin-right: 15px;
  padding: 10px;

  @include until($small) {
    height: 220px !important;
  }

  .is-attention-text {
    background: #fdcb6e;
  }
}

.flicking-panel > div {
  display: flex;
  position: relative;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  padding: 8px !important;
  font-weight: bold;
}

.is-abacus-board-container {
  width: 100%;
  position: absolute;
  overflow-x: scroll;
  overflow-y: hidden;
  bottom: 0;
}

svg.is-abacus-board {
  display: block;
  margin: auto;
  height: 569px !important;

  @include mobile {
    height: 350px !important;
  }

  @include until($extra-small) {
    height: 250px !important;
  }

  @include tablet {
    height: 390px !important;
  }

  @include desktop {
    height: 390px !important;
  }

  @include widescreen {
    height: 500px !important;
  }
}

img.is-trophy {
  display: block;
  width: 170px;
  margin-top: -100px;
  margin-left: auto;
  margin-right: auto;

  @include mobile {
    width: 160px;
    margin-top: -80px;
  }
}

.is-trophy.is-lost {
  filter: grayscale(1);
}

canvas.is-confetti {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999999;
}
</style>
