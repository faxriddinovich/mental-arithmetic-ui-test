<template>
  <div>
    <div class="card is-controls-bar" v-if="displayMode !== 'result'">
      <div
        class="
          is-flex is-justify-content-space-between is-align-items-center
          p-3
        "
      >
        <div class="is-flex is-align-items-center">
          <b-icon icon="10-plus" size="is-large" type="is-primary" />
          <span class="is-size-4 ml-2 has-text-weight-semibold is-hidden-mobile"
            >Numbers</span
          >
        </div>
        <div class="buttons">
          <b-button
            tag="router-link"
            :to="{ name: 'Home' }"
            type="is-primary is-light"
            icon-left="home"
            size="is-medium"
            >Home</b-button
          >
          <b-button
            type="is-primary is-light"
            icon-left="refresh"
            size="is-medium"
            >Repeat</b-button
          >
        </div>
      </div>
      <div>
        <b-progress
          type="is-success"
          class="completed-progress"
          :value="progressPercentage"
        >
        </b-progress>
      </div>
    </div>

    <section class="hero is-fullheight" ref="displayParent">
      <div class="hero-body p-0">
        <div style="width: 100%">
          <!--
          <div class="container is-max-widescreen">
            <div class="box is-bordered">
              <div class="has-text-centered is-size-3 mb-5">
                Senior comrades
              </div>

              <div class="columns is-multiline is-centered is-mobile">
                <div
                  class="column is-2-desktop is-4-mobile"
                  v-for="ans of [1, 2, 3, 4, 5, 6, 7, 8]"
                  :key="ans"
                >
                  <div>
                    <b-field>
                      <b-numberinput :controls="false" expanded />
                    </b-field>
                    <b-field>
                      <b-button type="is-primary" expanded>Answer</b-button>
                    </b-field>
                  </div>
                </div>
              </div>

            </div>
          </div>
          -->
          <div
            class="is-flex is-flex-direction-column is-align-items-center"
            v-if="displayMode === 'answer-form'"
          >
            <!--
            -->
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
                class="mt-4 is-answer-button"
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
            <div>
              <img
                :src="require('../../../../public/img/star-full.svg')"
                class="is-star is-2 has-shadow"
              />
              <img
                :src="require('../../../../public/img/star-full.svg')"
                class="is-star is-1 has-shadow mb-4"
              />
              <img
                :src="require('../../../../public/img/empty-star.svg')"
                class="is-star is-2"
              />
            </div>

            <div
              :class="{
                'is-result-text': true,
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

            <div class="buttons mt-4">
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
                  <div style="font-size: 30px; word-break: break-all">
                    {{ currentExample.numbers.join("") }} <br />
                    <strong class="has-text-success"
                      >= {{ currentExample.answer.toString() }}</strong
                    >
                    <br />
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
</template>
<script lang="ts" src="./play.ts" />
<style lang="scss">
@import "bulma/sass/utilities/mixins";

$answer-input-desktop-font-size: 5rem;
$answer-input-desktop-width: 16rem;
$answer-input-desktop-height: 10rem;
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

.is-big-number.is-1 {
  font-size: 6vw;
}

.is-big-number.is-2 {
  font-size: 13vw;
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

.is-answer-button {
  width: 250px;

  @include touch {
    font-size: $answer-button-touch-font-size !important;
    width: $answer-button-touch-width !important;
  }

  @include desktop {
    font-size: $answer-button-desktop-font-size !important;
    width: $answer-button-desktop-width !important;
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

.is-result-text {
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
