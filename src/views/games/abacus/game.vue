<template>
  <div>
    <!-- controls bar -->
    <section
      class="card is-bordered is-controls-bar"
      v-if="displayMode !== 'scores'"
    >
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
          <b-button size="is-medium" active @click="onRepeat"
            ><b-icon icon="refresh" class="m-0" /><span class="is-hidden-mobile"
              >Repeat</span
            ></b-button
          >
        </div>
      </div>
      <b-progress
        type="is-success"
        class="completed-progress"
        :value="completedRowsPercent"
      />
    </section>
    <!-- end controls bar -->

    <!-- abacus board -->
    <div v-show="canDisplayAbacus" class="is-abacus-board-container">
      <div ref="abacusContainerRef" v-show="canDisplayAbacus" />
    </div>

    <!-- confetti screen -->
    <canvas class="is-confetti" ref="confettiRef" />

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
        :data-at="true"
      >
        <div class="is-attention-text">
          <scalable-text :text="text" class="is-full-size" />
        </div>
      </div>

      <template v-for="(sequenceItem, sequenceIndex) in sequence">
        <div
          class="flicking-panel"
          :key="'s-' + sequenceIndex"
          :data-at="true"
          :data-si="sequenceIndex"
        >
          <div class="is-attention-text">
            <scalable-text :text="$t(sequenceItem.theme, { digit: sequenceItem.digit })" class="is-full-size" />
          </div>
        </div>

        <template v-for="(example, exampleIndex) in sequenceItem.examples">
          <div
            class="flicking-panel"
            :key="'e-' + sequenceIndex + '-' + exampleIndex"
            :data-at="true"
          >
            <div class="is-attention-text">
              <scalable-text
                :text="'Example ' + (exampleIndex + 1)"
                class="is-full-size"
              />
            </div>
          </div>

          <template v-for="(row, rowIndex) in example.numbers">
            <div
              class="flicking-panel"
              :key="'r-' + sequenceIndex + '-' + exampleIndex + '-' + rowIndex"
              :data-si="sequenceIndex"
              :data-ei="exampleIndex"
              :data-ri="rowIndex"
              :data-rv="row"
            >
              <div :class="`is-${sequenceItem.fontColor}-bg-color`">
                <b-icon
                  icon="volume"
                  size="is-large"
                  v-if="sequenceItem.speechSound"
                />
                <scalable-text
                  :text="String(row)"
                  class="is-full-size"
                  v-else
                />
              </div>
            </div>
          </template>
        </template>
      </template>
    </Flicking>
    <!-- end cards display -->

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
                    :value="completedRowsPercent"
                    format="percent"
                    show-value
                  >
                  </b-progress>
                  <nav class="level is-mobile">
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Completed rows</p>
                        <p class="title">
                          {{ completedRowsCount }}
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

.flicking-camera {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: relative;
  width: 100%;
}

.flicking-viewport {
  padding-top: 120px;
  width: 100%;
         pointer-events: none;
}

@include mobile {
  .flicking-viewport {
    padding-left: 8px;
    padding-right: 8px;
  }

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

.flicking-panel {
  color: white;
  width: 30%;
  height: 250px;
  border-radius: 5px;
  margin-right: 15px;
  position: relative;
  padding: 10px;
  margin-top: 10px;

  .is-attention-text {
    background: #fdcb6e;
  }

  div {
    //background: #6c5ce7;
    height: 100%;
    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
  }
}

.is-abacus-board-container {
	width: 100%;
  position: absolute;
	overflow-x: scroll;
	overflow-y: hidden;
  bottom: 0;
}

svg.is-abacus-board {
  width: 100%;
}

@include mobile {
	svg.is-abacus-board {
    width: 1200px;
	}
}

@include tablet {
	svg.is-abacus-board {
    width: 1200px;
	}
}

@include desktop {
	svg.is-abacus-board {
    width: 100%;
	}
}

img.is-trophy {
  display: block;
  width: 170px;
  margin-top: -100px;
  margin-left: auto;
  margin-right: auto;
	overflow-y: scroll;
}

.is-trophy.is-lost {
  filter: grayscale(1);
}

@include mobile {
  img.is-trophy {
    width: 160px;
    margin-top: -80px;
  }
}

.is-confetti {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
}
</style>
