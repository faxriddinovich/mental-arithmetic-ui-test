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

                {{ timerMins }}:{{ timerSecs }}</span
              >
            </span>
            <span v-else>
              <b-icon icon="abacus" size="is-large" type="is-primary" />
            </span>
          </div>
          <b-button size="is-medium" active
            ><b-icon icon="refresh" class="m-0" /><span class="is-hidden-mobile"
              >Refresh</span
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
    <div ref="abacusContainerRef" v-show="canDisplayAbacus"></div>

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
            <b-button icon-left="redo" @click="onShowAgain"
              >Show again</b-button
            >
            <b-button icon-left="align-left-justify" @click="onShowAnswer"
              >Answer</b-button
            >
            <b-button
              type="is-link"
              icon-right="arrow-right"
              @click="onNextExample"
              >Next</b-button
            >
          </div>
        </div>

        <!-- answer display -->
        <div
          class="columns is-gapless is-centered"
          style="min-width: 100%"
          v-if="displayMode === 'answer'"
        >
          <div class="column is-5-fullhd is-three-quarters-desktop">
            <div class="box mx-2">
              <div class="is-size-3 has-text-weight-semibold has-text-centered">
                <span
                  v-for="(row, rowIndex) of currentExample.numbers"
                  :key="rowIndex"
                >
                  {{ normalizeSign(row) }}&nbsp;
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
                      {{ normalizeSign(currentExample.numbers[rowIndex + 1]) }}
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
        <!-- end answer display -->

        <!-- scores display -->
        <div
          class="columns is-gapless is-centered"
          style="min-width: 100%"
          v-else-if="displayMode === 'scores'"
        >
          <div class="column is-10-tablet is-7-desktop is-6-fullhd">
            <div class="mx-2">
              <div
                class="box m-0 is-bordered"
                style="
                  width: 94%;
                  margin: 0 auto -30px !important;
                  background: rgb(241, 241, 241);
                "
              ></div>

              <div
                class="box m-0 is-bordered"
                style="
                  width: 97%;
                  margin: 0 auto -30px !important;
                  background: rgb(247, 247, 247);
                "
              ></div>

              <div class="card p-1 is-bordered">
                <img
                  class="is-block is-trophy"
                  :src="require('@@/img/trophy.png')"
                />
                <div class="p-4">
                  <div
                    class="
                      has-text-centered
                      is-size-1
                      has-text-weight-bold has-text-success
                    "
                  >
                    You won!
                  </div>

                  <b-progress
                    size="is-medium"
                    type="is-success"
                    :value="60"
                    format="percent"
                    show-value
                  >
                  </b-progress>
                  <nav class="level is-mobile">
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Completed rows</p>
                        <p class="title has-text-success">
                          {{ completedRowsCount }}
                        </p>
                      </div>
                    </div>
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Rows</p>
                        <p class="title">4421</p>
                      </div>
                    </div>

                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Spent time</p>
                        <p class="title">00:32</p>
                      </div>
                    </div>
                  </nav>
                  <span class="is-dotted">
                    <span class="is-left is-size-5-tablet"
                      ><b-icon icon="clock" /> Average time (examples)</span
                    >
                    <span class="is-dots"></span>
                    <span
                      class="
                        is-right is-size-5-mobile is-size-4-tablet
                        has-text-weight-bold
                      "
                      >00:01</span
                    >
                  </span>

                  <span class="is-dotted">
                    <span class="is-left is-size-5-tablet"
                      ><b-icon icon="clock" /> Average time (rows)</span
                    >
                    <span class="is-dots"></span>
                    <span
                      class="
                        is-right is-size-5-mobile is-size-4-tablet
                        has-text-weight-bold
                      "
                      >00:01</span
                    >
                  </span>

                  <hr class="mb-5" />
                  <div class="is-flex">
                    <b-button
                      tag="router-link"
                      :to="{ name: 'AbacusGameForm' }"
                      icon-left="arrow-left"
                      expanded
                      active
                      >Back</b-button
                    >
                    <b-button class="ml-2" icon-left="refresh" expanded active
                      >Repeat</b-button
                    >
                  </div>
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
          :auto-update="false"
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
              :data-at="true"
              :data-si="sequenceIndex"
              class="is-attention-text"
              :key="sequenceIndex + '-sequence-item'"
              >{{ sequenceItem.theme }}</swiper-slide
            >
            <template v-for="(example, exampleIndex) in sequenceItem.examples">
              <swiper-slide
                data-at="true"
                :key="exampleIndex + '-header'"
                class="is-attention-text"
              >
                Example {{ exampleIndex + 1 }}
              </swiper-slide>
              <template v-for="(row, rowIndex) in example.numbers">
                <swiper-slide
                  :key="exampleIndex + '-' + rowIndex"
                  :data-si="sequenceIndex"
                  :data-ei="exampleIndex"
                  :data-ri="rowIndex"
                >
                  <svg
                    width="100%"
                    height="100%"
                    :viewBox="`0 0 ${viewBoxWidthMap[4]} 10`"
                    v-if="sequenceItem.displayNumbers"
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
                  <b-icon icon="volume" size="is-large" v-else />
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

img.is-trophy {
  width: 200px;
  margin-top: -100px;
  margin-left: auto;
  margin-right: auto;
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
</style>
