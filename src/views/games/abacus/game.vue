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

    <!-- display screen -->
    <div v-if="displayMode === 'swiper-cards'" style="padding-top: 150px">
    <flicking-display :sequence="sequence" />
    </div>

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

.swiper-container {
  margin-bottom: 22em;
  padding-bottom: 10px;
}

.swiper {
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 15px;
    font-weight: bold;
  }

  .swiper-slide-active {
    width: 100%;
    padding: 10px;
    box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.05),
      inset -5px -5px 5px rgba(255, 255, 255, 0.5),
      5px 5px 5px rgba(0, 0, 0, 0.05), -5px -5px 5px rgba(255, 255, 255, 0.5);

    svg {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      border-radius: 15px;
      background: #6c5ce7;
      //background: #e84393;
    }
  }
}

/*
.swiper {
  width: 90%;
  height: 16em;
  margin-bottom: 20em;
  padding: 5px;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    border-radius: 15px;
    color: white;
  }

  .swiper-slide-active {
    box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.05),
      inset -5px -5px 5px rgba(255, 255, 255, 0.5),
      5px 5px 5px rgba(0, 0, 0, 0.05), -5px -5px 5px rgba(255, 255, 255, 0.5);
  }

  .swiper-slide-active > svg {
    margin: 10px;
    background-color: rgba(26, 188, 156, 0.1);
  }

  .is-attention-text {
    background-color: rgba(230, 126, 34, 0.1);
    font-size: 5em;
  }

  .swiper-slide-active.is-attention-text {
    background-color: rgb(230, 126, 34);
  }
}
*/

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
