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
            type="is-primary is-light"
            icon-left="arrow-left"
            size="is-medium"
            >Back</b-button
          >
          <div class="is-flex is-align-items-center">
            <span v-if="displayingAttentionTexts">
              <b-icon icon="abacus" size="is-large" type="is-primary" />
            </span>
            <span v-else>
              <span :class="timerClasses">
                <b-icon icon="stopwatch" size="is-medium" />

                {{ timerMins }}:{{ timerSecs }}</span
              >
            </span>
          </div>
          <b-button
            type="is-primary is-light"
            icon-left="refresh"
            size="is-medium"
            >Refresh</b-button
          >
        </div>
      </div>
      <b-progress type="is-success" class="completed-progress" :value="80" />
    </section>
    <!-- end controls bar -->

    <!-- abacus board -->
    <div ref="abacusContainerRef" v-if="displayMode !== 'scores'"></div>

    <!-- display screen -->
    <section class="hero is-fullheight">
      <div class="hero-body is-justify-content-center p-0">
        <div
          v-show="displayMode === 'control-buttons'"
          style="margin-bottom: 19em"
        >
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
            <b-button icon-left="redo">Show again</b-button>
            <b-button icon-left="align-left-justify">Answer</b-button>
            <b-button
              type="is-link"
              icon-right="arrow-right"
              @click="onNextExample"
              >Next</b-button
            >
          </div>
        </div>
        <!-- scores display -->
        <div
          class="columns is-gapless is-centered"
          style="min-width: 100%"
          v-show="displayMode === 'scores'"
        >
          <div class="column is-5-fullhd is-three-quarters-desktop">
            <div class="box mx-2">
              <img
                class="is-block is-victory-trophy"
                :src="require('@@/img/trophy.svg')"
              />
              <div class="p-4">
                <div
                  class="
                    has-text-centered
                    is-size-2
                    has-text-weight-semibold has-text-success
                  "
                >
                  Victory!
                </div>

                <b-progress size="is-large" type="is-success" show-value>
                  <template #bar>
                    <b-progress-bar :value="60"></b-progress-bar>
                    <b-progress-bar
                      :value="20"
                      type="is-danger"
                    ></b-progress-bar>
                    <b-progress-bar :value="20" type="is-dark"></b-progress-bar>
                  </template>
                </b-progress>
                <nav class="level is-mobile">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Correct</p>
                      <p class="title has-text-success">60</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Incorrect</p>
                      <p class="title has-text-danger">20</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Spent time</p>
                      <p class="title">00:32</p>
                    </div>
                  </div>
                </nav>
                <hr class="mb-5" />
                <div class="is-flex">
                  <b-button icon-left="arrow-left" expanded>Back</b-button>
                  <b-button class="ml-2" icon-left="refresh" expanded
                    >Repeat</b-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end scores display -->

        <swiper
          class="swiper"
          ref="swiperRef"
          :options="swiperOptions"
          :auto-destroy="true"
          :delete-instance-on-destroy="true"
          :cleanup-styles-on-destroy="true"
          @slideChangeTransitionEnd="onSwiperTransitionEnd"
          v-show="displayMode === 'swiper-cards'"
        >
          <swiper-slide
            data-at="true"
            class="is-attention-text"
            v-for="(text, index) of attentionTexts"
            :key="'a' + index"
            >{{ text }}</swiper-slide
          >

          <template v-for="(sequenceItem, sequenceIndex) in sequence">
            <swiper-slide
              :data-sh="true"
              :data-si="sequenceIndex"
              class="is-attention-text"
              :key="sequenceIndex + '-sequence-item'"
              >{{ sequenceItem.theme }}</swiper-slide
            >
            <template v-for="(example, exampleIndex) in sequenceItem.examples">
              <template v-for="(row, rowIndex) in example.numbers">
                <swiper-slide
                  :key="exampleIndex + '-' + rowIndex"
                  :data-rw="true"
                  :data-si="sequenceIndex"
                  :data-ei="exampleIndex"
                  :data-ri="rowIndex"
                >
                  <svg
                    width="100%"
                    height="100%"
                    :viewBox="`0 0 ${viewBoxWidthMap[4]} 10`"
                  >
                    <text
                      x="50%"
                      y="50%"
                      font-size="10"
                      fill="#fff"
                      text-anchor="middle"
                      dominant-baseline="middle"
                    >
                      {{ row }}
                    </text>
                  </svg>
                </swiper-slide>
              </template>
            </template>
          </template>
        </swiper>
      </div>
    </section>
    <!-- end display screen -->
  </div>
</template>
<script lang="ts" src="./game.ts"></script>
<style lang="scss">
@import "bulma/sass/utilities/mixins";

.swiper {
  width: 90%;
  height: 15em;
  margin-bottom: 18em;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    background-color: rgba(26, 188, 156, 0.1);
    border-radius: 20px;
    color: white;
  }

  .swiper-slide-active {
    background-color: #1abc9c;
    box-shadow: 0px 0px 100px -13px rgba(0, 0, 0, 0.14) inset;
    -webkit-box-shadow: 0px -1px 100px -13px rgba(0, 0, 0, 0.14) inset;
    -moz-box-shadow: 0px -1px 100px -13px rgba(0, 0, 0, 0.14) inset;
  }

  .is-attention-text {
    background-color: rgba(230, 126, 34, 0.1);
    font-size: 5em;
  }

  .swiper-slide-active.is-attention-text {
    background-color: rgb(230, 126, 34);
  }
}

.is-abacus-board {
  position: absolute;
  max-width: 650px;
  bottom: 0;
}

.is-abacus-game-timer {
  position: absolute;
}

img.is-victory-trophy {
  width: 200px;
  margin-top: -100px;
  margin-left: auto;
  margin-right: auto;
}

@include mobile {
  img.is-victory-trophy {
    width: 150px;
    margin-top: -75px;
  }
}
</style>
