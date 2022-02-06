<template>
  <div>
    <!-- controls bar -->
    <section
      class="card is-bordered is-controls-bar"
      v-show="displayMode !== 'scores'"
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
    <div v-show="canDisplayAbacus">
      <div
        class="is-flex is-justify-content-center"
        ref="abacusContainerRef"
        v-show="canDisplayAbacus"
      />
    </div>

    <!-- confetti screen -->
    <canvas class="is-confetti" ref="confettiRef" />

    <!-- cards screen -->
    <Flicking
      :options="flickingOptions"
      ref="flickingRef"
      class="flicking"
      v-if="displayMode === 'cards'"
      style="padding-top: 120px"
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
        <div class="flicking-panel" :key="'s' + sequenceIndex">
          <div class="is-attention-text">
            <scalable-text
              :text="'Theme ' + sequenceItem.theme"
              class="is-full-size"
            />
          </div>
        </div>

        <template v-for="(example, exampleIndex) in sequenceItem.examples">
          <div class="flicking-panel" :key="'e' + exampleIndex">
            <div class="is-attention-text">
              <scalable-text
                :text="'Example ' + (exampleIndex + 1)"
                class="is-full-size"
              />
            </div>
          </div>

          <template v-for="(row, rowIndex) in example.numbers">
            <div class="flicking-panel" :key="exampleIndex + '-' + rowIndex">
              <div>
                <scalable-text :text="String(row)" class="is-full-size" />
              </div>
            </div>
          </template>
        </template>
      </template>
    </Flicking>
    <!-- end cards screen -->

    <control-buttons-display
      :onShowAgain="onShowAgain"
      :onShowAnswer="onShowAnswer"
      :onNextExample="onNextExample"
      v-else-if="displayMode === 'control-buttons'"
    />

    <answer-display
      :example="currentExample"
      :onShowAgain="onShowAgain"
      :onNextExample="onNextExample"
      v-else-if="displayMode === 'answer'"
    />

    <scores-display
      :wonTheGame="wonTheGame"
      :completedRowsPercent="completedRowsPercent"
      :completedRowsCount="completedRowsCount"
      :totalExamplesCount="totalExamplesCount"
      :totalRowsCount="totalRowsCount"
      :trophyClasses="trophyClasses"
      :gameScoresTextClasses="gameScoresTextClasses"
      :timerSecs="config.timerSecs"
      :timerAbsolute="timerAbsolute"
      :onRepeat="onRepeat"
      v-else-if="displayMode === 'scores'"
    />
  </div>
</template>
<script lang="ts" src="./game.ts"></script>
<style lang="scss">
@import "bulma/sass/utilities/mixins";

.flicking-camera {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: relative;
  width: 100%;
  z-index: 1;
}

.flicking-viewport {
  width: 100%;
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
    background: #6c5ce7;
    height: 100%;
    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
  }
}

.is-abacus-board {
  position: absolute;
  max-width: 650px;
  bottom: 0;
}

img.is-trophy {
  display: block;
  width: 200px;
  margin-top: -100px;
  margin-left: auto;
  margin-right: auto;
}

.is-trophy.is-lost {
  filter: grayscale(1);
}

.is-confetti {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
}

@include mobile {
  img.is-trophy {
    width: 160px;
    margin-top: -80px;
  }
}
</style>
