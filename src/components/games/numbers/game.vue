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
            <b-icon icon="10-plus" size="is-medium" type="is-primary" />
            <span
              class="is-size-5 ml-2 has-text-weight-semibold is-hidden-mobile"
              >Numbers</span
            >
          </div>
          <b-button
            type="is-primary is-light"
            icon-left="refresh"
            size="is-medium"
            >Repeat</b-button
          >
        </div>
      </div>
      <div v-if="progressIndicator">
        <b-progress
          type="is-success"
          class="completed-progress"
          :value="progressPercentage"
        />
      </div>
    </section>
    <!-- end controls bar -->
    <!-- display screen -->
    <section
      :class="{ hero: true, 'is-fullheight': !multiplayerMode }"
      ref="displayParent"
    >
      <div class="hero-body p-1">
        <!-- attention | number display mode -->
        <div
          v-if="displayMode === 'attention' || displayMode === 'number'"
          class="has-text-centered"
        >
          {{ display }}
        </div>
        <!-- end attention | number display mode -->

        <!-- answer form display mode -->
        <div v-else-if="displayMode === 'answer-form'" class="mx-auto">
          <form @submit.prevent="enterAnswer">
            <b-field>
              <b-numberinput :controls="false" v-model="answerFormValue" />
            </b-field>
            <b-button native-type="submit" type="is-primary" expanded
              >Enter</b-button
            >
          </form>
        </div>
        <!-- end answer form display mode -->

        <!-- answer display mode -->
        <div v-else-if="displayMode === 'answer'" style="width: 100%">
          <div class="columns is-centered is-marginless">
            <div :class="{ column: true, 'is-6-desktop': !multiplayerMode }">
              <div class="card is-bordered p-2">
                <div class="has-text-centered">
                  <div
                    class="is-size-4 has-text-weight-semibold"
                    style="word-break: break-all"
                  >
                    {{ currentExample.numbers.join("") }}
                  </div>
                  <div class="is-size-3 has-text-weight-bold has-text-success">
                    = {{ currentExample.answer }}
                  </div>
                  <div>
                    Your answer is:
                    <span class="has-text-weight-bold has-text-danger">{{
                      answerFormValue
                    }}</span>
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
        <div v-else-if="displayMode === 'answer-forms'">answer forms</div>
        <!-- end answer forms display mode -->

        <!-- result display mode -->
        <div
          v-else-if="displayMode === 'result'"
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
                ['is-' + queue[0].fontColor + '-bg-color']: true,
              }"
            ></div>
          </div>
        </div>
        <!-- result display mode -->
        <!-- wait display mode -->
        <div v-else-if="displayMode === 'wait'">
          <b-icon icon="hourglass" size="is-large" /> <br />
          Waiting other players..
        </div>
        <!-- end wait display mode -->
      </div>
    </section>
    <!-- end display screen -->
  </div>
  <!--
  <div>
    <section
      :class="{ hero: true, 'is-fullheight': !multiplayerMode }"
      ref="displayParent"
    >
      <div class="hero-body p-0">
        <div style="width: 100%">
          <div
            class="container is-max-widescreen"
            v-if="displayMode === 'answer-forms'"
          >
            <div
              class="box is-bordered m-4"
              v-for="(queueItem, queueIndex) of queue"
              :key="queueIndex"
            >
              <div
                class="
                  has-text-weight-semibold has-text-centered
                  is-size-3
                  mb-5
                "
              >
                {{ queueIndex + 1 }}. {{ queueItem.theme }}
              </div>

              <div class="columns is-multiline is-centered is-mobile">
                <div
                  class="column is-2-desktop is-4-mobile"
                  v-for="(example, index) of queueItem.examples"
                  :key="index"
                >
                  <div class="has-text-centered has-text-weight-semibold">
                    - {{ index + 1 }} -
                  </div>
                  <form
                    @submit.prevent="enterAnswer2($event, queueIndex, index)"
                  >
                    <b-field>
                      <b-numberinput :controls="false" expanded />
                    </b-field>
                    <div class="buttons">
                      <b-button
                        icon-left="arrow-right"
                        type="is-primary"
                        expanded
                        >Answer</b-button
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div
            class="is-flex is-flex-direction-column is-align-items-center m-2"
            v-if="displayMode === 'answer-form'"
          >
            <form @submit.prevent="enterAnswer">
              <b-field>
                <b-numberinput
                  v-model="answerFormValue"
                  class="is-answer-input"
                  :controls="false"
                  :autofocus="true"
                ></b-numberinput>
              </b-field>
              <b-button
                native-type="submit"
                type="is-primary"
                class="mt-4 is-medium"
                expanded
                >Answer</b-button
              >
            </form>
          </div>
          <div
            class="has-text-centered"
            v-else-if="displayMode === 'number' || displayMode === 'attention'"
          >
            <span :class="displayClasses">{{ display }} </span>
          </div>
          <div
            class="is-flex is-flex-direction-column is-align-items-center"
            v-else-if="displayMode === 'result'"
          >
            <div v-if="!multiplayerMode">
              <img
                v-for="(star, index) of finalStars"
                :key="index"
                :src="star.src"
                :class="star.classes"
              />
            </div>

            <div
              :class="{
                'is-result-score-text': true,
                'has-text-success':
                  correctAnswersPercent >= 60 && correctAnswersPercent <= 100,
                'has-text-warning':
                  correctAnswersPercent < 60 && correctAnswersPercent >= 30,
                'has-text-danger':
                  correctAnswersPercent < 30 && correctAnswersPercent >= 0,
                'has-text-weight-semibold': true,
              }"
            >
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
                style="padding: 10px; width: 100px"
                :class="{
                  ['is-' + queue[0].fontColor + '-bg-color']: true,
                  'is-bordered': true,
                }"
              ></div>
            </div>

            <div class="buttons mt-4" v-if="!multiplayerMode">
              <b-button size="is-medium" icon-left="refresh">Repeat</b-button>
              <b-button
                size="is-medium"
                icon-left="home"
                tag="router-link"
                :to="{ name: 'Home' }"
                >Home</b-button
              >
            </div>
          </div>
          <div v-else-if="displayMode === 'answer'">
            <div class="has-text-centered">
              <div class="container is-max-widescreen">
                <div class="card px-2 py-4 m-2 is-bordered">
                  <div>
                    <div
                      style="font-size: 30px; word-break: break-all"
                      v-if="!multiplayerMode"
                    >
                      {{ currentExample.numbers.join("") }} <br />
                    </div>
                    <div
                      class="is-size-3 has-text-weight-bold has-text-success"
                    >
                      = {{ currentExample.answer.toString() }}
                    </div>
                    <span class="is-size-4"
                      >Your answer is:
                      <span class="has-text-danger has-text-weight-semibold">{{
                        answerFormValue
                      }}</span></span
                    >
                    <hr />
                    <b-button
                      type="is-primary"
                      size="is-medium"
                      icon-left="arrow-right"
                      @click="nextExample"
                      >Next example</b-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  -->
</template>
<script lang="ts" src="./game.ts" />
<style lang="scss">
@import "bulma/sass/utilities/mixins";

$answer-input-desktop-font-size: 5rem;
$answer-input-desktop-width: 15rem;
$answer-input-desktop-height: 8rem;
$answer-button-desktop-font-size: 2rem;
$answer-button-desktop-width: 16rem;

$answer-input-touch-font-size: 3rem;
$answer-input-touch-width: 14rem;
$answer-input-touch-height: 7rem;
$answer-button-touch-font-size: 1rem;
$answer-button-touch-width: 14rem;

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
  padding: 10px;
  width: 100px;
}

.is-big-number.is-1 {
  font-size: 6vw;
}

.is-big-number.is-2 {
  font-size: 10vw;
}

.is-big-number.is-3 {
  font-size: 20vw;
}

.is-rotated-90 {
  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  @include tablet {
    font-size: 18vh !important;
  }
}

.is-rotated-180 {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}

.is-rotated-270 {
  transform: rotate(270deg);
  -webkit-transform: rotate(270deg);
  @include tablet {
    font-size: 18vh !important;
  }
}

.is-big-number {
  display: inline-block;
}

.is-answer-input > .control > input[type="number"] {
  padding-left: 10px !important;
  padding-right: 10px !important;

  @include touch {
    font-size: $answer-input-touch-font-size !important;
    width: $answer-input-touch-width !important;
    height: $answer-input-touch-height !important;
  }

  @include desktop {
    font-size: $answer-input-desktop-font-size !important;
    width: $answer-input-desktop-width !important;
    height: $answer-input-desktop-height !important;
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
</style>
