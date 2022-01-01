<template>
  <div>
    <!-- controls bar -->
    <section class="card is-bordered is-controls-bar" v-if="!multiplayerMode">
      <div class="p-2">
        <div
          class="is-flex is-align-items-center is-justify-content-space-between"
        >
          <b-button
            tag="router-link"
            :to="{ name: 'Home' }"
            type="is-primary is-light"
            icon-left="home"
            size="is-medium"
            >Home</b-button
          >
          <div class="is-flex is-align-items-center">
            <b-icon icon="10-plus" size="is-large" type="is-primary" />
          </div>
          <b-button
            type="is-primary is-light"
            icon-left="refresh"
            size="is-medium"
            @click="refresh"
            >Refresh</b-button
          >
        </div>
      </div>
      <b-progress
        type="is-success"
        class="completed-progress"
        :value="progressPercentage"
      />
    </section>
    <!-- end controls bar -->
    <!-- display screen -->
    <section
      :class="{ hero: true, 'is-fullheight': !multiplayerMode }"
      ref="displayParent"
    >
      <div class="hero-body p-1">
        <!-- pass -->
        <div v-if="displayMode === 'pass'"></div>
        <!-- attention | number display mode -->
        <div
          v-if="displayMode === 'attention' || displayMode === 'number'"
          class="has-text-centered"
          style="width: 100%"
        >
          <span :class="displayClasses">{{ display }}</span>
        </div>
        <!-- end attention | number display mode -->

        <!-- answer form display mode -->
        <!-- FIXME: this is  not ok -->
        <div
          v-else-if="displayMode === 'answer-form'"
          class="mx-auto is-flex is-justify-content-center"
        >
          <form @submit.prevent="enterAnswer">
            <b-field>
              <b-numberinput
                :controls="false"
                v-model="answerFormValue"
                style="width: inherit"
                class="is-answer-form-input"
                required
              />
            </b-field>
            <b-button
              native-type="submit"
              type="is-primary"
              class="is-answer-form-button"
              >Check the answer</b-button
            >
          </form>
        </div>
        <!-- end answer form display mode -->

        <!-- answer display mode -->
        <div v-else-if="displayMode === 'answer'" style="width: 100%">
          <div class="columns is-centered is-marginless">
            <div :class="{ column: true, 'is-6-desktop': !multiplayerMode }">
              <div class="card is-bordered p-2 is-word-break">
                <div class="has-text-centered">
                  <div class="is-size-4 has-text-weight-semibold">
                    {{ currentExample.numbers.join("") }}
                  </div>
                  <div class="is-size-3 has-text-weight-bold has-text-success">
                    = {{ currentExample.answer }}
                  </div>
                  <div>
                    Your answer is:
                    <span
                      class="is-size-4 has-text-weight-bold has-text-danger"
                      >{{ answerFormValue }}</span
                    >
                  </div>
                </div>

                <hr class="my-1" />
                <b-button
                  type="is-success"
                  icon-right="arrow-right"
                  @click="nextExample"
                  expanded
                  outlined
                  >Next</b-button
                >
              </div>
            </div>
          </div>
        </div>
        <!-- end answer display mode -->

        <!-- answer forms display mode -->
        <div v-else-if="displayMode === 'answer-forms'" style="width: 100%">
          <div class="columns is-multiline is-centered is-vcentered">
            <div
              :class="answerFormsColumnClasses"
              v-for="(sequenceItem, sequenceItemIndex) of sequence"
              :key="sequenceItemIndex"
            >
              <div class="card p-2 is-bordered">
                <div class="has-text-centered">
                  <div class="is-size-3">
                    {{ sequenceItem.theme }}
                  </div>
                  <div
                    :class="{
                      'is-color-indicator': true,
                      'is-bordered': true,
                      ['is-' + sequenceItem.fontColor + '-bg-color']: true,
                    }"
                  ></div>
                </div>
                <div
                  class="
                    columns
                    is-multiline is-mobile is-centered is-vcentered
                  "
                >
                  <div
                    class="column is-6-mobile is-4-desktop"
                    v-for="(example, exampleIndex) of sequenceItem.examples"
                    :key="exampleIndex"
                  >
                    <div class="has-text-centered has-text-weight-semibold">
                      {{ exampleIndex + 1 }}.
                    </div>
                    <form
                      @submit.prevent="
                        enterAnswer2($event, sequenceItemIndex, exampleIndex)
                      "
                    >
                      <b-field>
                        <b-numberinput
                          :controls="false"
                          placeholder="Your answer"
                        />
                      </b-field>
                      <b-button native-type="submit" type="is-primary" expanded
                        >Check</b-button
                      >
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end answer forms display mode -->

        <!-- scores display mode -->
        <div
          v-else-if="displayMode === 'scores'"
          class="mx-auto has-text-centered"
        >
          <div v-if="!multiplayerMode">
            <img
              v-for="(star, index) of finalStars"
              :key="index"
              :src="star.src"
              :class="star.classes"
            />
          </div>
          <div :class="resultScoreTextClasses">
            {{ correctAnswersPercent }}%
          </div>
          <div class="is-size-4">
            (Correct:
            <span class="has-text-weight-semibold has-text-success">{{
              correctAnswersCount
            }}</span>
            / Incorrect:
            <span class="has-text-weight-semibold has-text-danger">{{
              incorrectAnswersCount
            }}</span
            >)
          </div>
          <div class="mt-2" v-if="multiplayerMode">
            <div
              :class="{
                'is-color-indicator': true,
                'is-bordered': true,
                ['is-' + sequence[0].fontColor + '-bg-color']: true,
              }"
            ></div>
          </div>
        </div>
        <!-- result display mode -->
      </div>
    </section>
    <!-- end display screen -->
  </div>
</template>
<script lang="ts" src="./game.ts" />
<style lang="scss">
@import "bulma/sass/utilities/mixins";

.completed-progress > .progress {
  border-radius: 0px !important;
  @include mobile {
    height: 0.8rem;
  }
}

.is-controls-bar {
  position: absolute !important;
  width: 100% !important;
}

.is-color-indicator {
  display: inline-block;
  padding: 8px;
  width: 80px;
}

.is-display-text.is-1 {
  font-size: 15vmin;
}

.is-display-text.is-2 {
  font-size: 20vmin;
}

.is-display-text.is-3 {
  font-size: 26vmin;
}

.is-display-text {
  display: inline-block;
}

.is-rotated-90 {
  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
}

.is-rotated-180 {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}

.is-rotated-270 {
  transform: rotate(270deg);
  -webkit-transform: rotate(270deg);
}

$font-sizes-h: (
  1: 60vmin,
  2: 60vmin,
  3: 45vmin,
  4: 40vmin,
  5: 32vmin,
  6: 26vmin,
  7: 22vmin,
);

@each $char-len, $font-size in $font-sizes-h {
  .is-display-number-#{$char-len}-1 {
    @if $char-len < 5 {
      font-size: $font-size - 25;
    } @else {
      font-size: $font-size;
    }
  }

  .is-display-number-#{$char-len}-2 {
    @if $char-len < 5 {
      font-size: $font-size - 15;
    } @else {
      font-size: $font-size;
    }
  }

  .is-display-number-#{$char-len}-3 {
    font-size: $font-size;
  }
}

.is-display-number-small {
  font-size: 8vmax;
}

.is-answer-form-input > .control > input[type="number"] {
  padding-left: 10px !important;
  padding-right: 10px !important;

  @include touch {
    width: 200px;
    height: 100px;
    font-size: 3.4rem;
  }

  @include desktop {
    width: 300px;
    height: 150px;
    font-size: 5.4rem;
  }
}

.is-answer-form-button {
  width: 100% !important;

  @include touch {
    width: 200px !important;
  }

  @include desktop {
    width: 300px !important;
  }
}

.hero.is-correct-answer {
  animation: correct-answer-fade 1s;
}

.hero.is-incorrect-answer {
  animation: incorrect-answer-fade 1s;
}

@keyframes correct-answer-fade {
  0% {
    background: rgba(72, 199, 116, 0.8);
  }
  100% {
    background: rgba(72, 199, 116, 0);
  }
}

@keyframes incorrect-answer-fade {
  0% {
    background: rgba(255, 56, 96, 0.8);
  }
  100% {
    background: rgba(255, 56, 96, 0);
  }
}

.is-result-score-text {
  font-size: 80px;
}

.is-star {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.is-star.has-shadow {
  filter: drop-shadow(0px 0px 25px hsl(48, 100%, 67%));
}

.is-star.is-1 {
  width: 200px;

  @include tablet-only {
    width: 150px;
  }

  @include mobile {
    width: 100px;
  }
}

.is-star.is-2 {
  width: 150px;

  @include tablet-only {
    width: 120px;
  }

  @include mobile {
    width: 80px;
  }
}

.is-word-break {
  word-break: break-all;
}
</style>
