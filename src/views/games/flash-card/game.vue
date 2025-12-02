<template>
  <div class="flash-card-background">
    <div
      ref="correctOverlayRef"
      style="
        position: absolute;
        width: 100vw;
        height: 100vh;
        background: rgba(63, 195, 128, 0.6);
        border: 10px solid #16a085;
        z-index: 999;
        display: none;
        opacity: 0;
      "
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/148/148767.png"
        width="100"
        ref="correctOverlayIconRef"
        style="
          filter: drop-shadow(0 0 50px rgba(0, 0, 0, 0.3));
          position: absolute;
          left: 50%;
          bottom: 50%;
          transform: translateX(-50%);
        "
      />
    </div>

    <!--<div class="container is-mobile">-->
    <div
      class="is-absolute px-2 mt-2"
      style="width: 100%"
      v-if="canDisplayResourcesBar"
    >
      <div class="container">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center"
        >
          <health-bar ref="healthBarRef" />
          <img
            src="https://cdn-icons-png.flaticon.com/512/867/867454.png"
            width="60"
            class="is-hidden-mobile"
            ref="cardRef"
          />
          <scores-bar ref="scoresBarRef" />
        </div>
      </div>
    </div>
    <!--</div>-->

    <!-- attention text section -->
    <section
      class="columns is-flex is-centered is-vcentered is-gapless mx-2"
      style="height: 100vh"
      v-if="displayKind == 'attention-text'"
    >
      <div class="column is-12">
        <div
          class="stitched"
          style="
            background: rgba(230, 126, 34, 0.2);
            color: rgba(230, 126, 34, 0.8);
          "
          ref="textRef"
        >
          <div class="has-text-centered">
            <div style="font-size: 100px; font-family: 'Pudelinka', arial">
              {{ text }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end attention text section -->
    <!-- abacus board section -->
    <section
      class="columns is-flex is-centered is-vcentered is-gapless mx-2"
      v-else-if="displayKind == 'abacus'"
      style="min-height: 100vh"
      ref="abacusDisplayRef"
    >
      <div class="column is-12-mobile is-10-tablet is-9-desktop is-7-fullhd">
        <div>
          <div
            class="flash-card sketchy-card-timeline success"
            ref="timelineRef"
          />
          <div class="flash-card sketchy-card p-3">
            <div
              class="has-text-centered"
              style="font-size: 200px; font-family: 'Patrick Hand SC', cursive"
            >
            <!--
              <svg viewBox="0 0 900 150">
                <text
                  text-anchor="middle"
                  dominant-baseline="central"
                  x="50%"
                  y="50%"
                >
                  +1
                </text>
              </svg>
              -->
            </div>
            <abacus-board
              :valueBox="false"
              :columns="1"
              style="max-height: 600px;"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      class="columns is-flex is-centered is-vcentered is-gapless mx-2"
      style="height: 100vh"
      v-else-if="displayKind == 'enter-answer-form'"
      ref="enterAnswerFormDisplayRef"
    >
      <div class="column is-12-mobile is-10-tablet is-9-desktop is-4-fullhd">
        <div class="flash-card sketchy-card mb-4 p-4">
          <form action="/">
            <input class="flash-card input mb-4 is-size-1 px-3" type="number" />
            <button
              type="button"
              class="flash-card sketched-button"
              style="width: 100%; text-align: center"
              @click="playCorrectOverlayAnimation"
            >
              <span> <b-icon icon="check" />Check answer</span>
            </button>
          </form>
        </div>
        <div class="has-text-centered">
          <button class="flash-card sketched-button" @click="modal = true">
            <span> <b-icon icon="bars" /> Show answer</span>
          </button>
          <button class="flash-card sketched-button ml-3">
            <span> <b-icon icon="skip-forward" /> Skip row</span>
          </button>
        </div>
      </div>
    </section>
    <section
      class="hero is-fullheight"
      v-else-if="displayKind == 'enter-answers-form'"
      ref="enterAnswersFormDisplayRef"
    >
      <div class="hero-body">
        <div
          class="columns is-gapless is-centered is-marginless"
          style="min-width: 100%"
        >
          <div
            class="column is-12-mobile is-10-tablet is-9-desktop is-7-fullhd"
          >
            <div class="flash-card sketchy-card mx-2 p-4">
              <div class="columns is-multiline is-mobile">
                <div
                  class="column is-6-mobile is-3-desktop"
                  v-for="tet in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                  :key="tet"
                >
                  <div class="has-text-centered has-text-weight-semibold mb-1">
                    Example {{ tet }}:
                  </div>
                  <div class="field">
                    <div class="control">
                      <input
                        class="input flash-card-input"
                        type="number"
                        placeholder="Enter answer"
                      />
                    </div>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button
                        class="button is-primary flash-card-button is-fullwidth"
                      >
                        <span>Check answer</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
              <hr class="m-2" />

              <button class="flash-card sketched-button">
                <span> <b-icon icon="play" />Skip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end abacus board section -->
    <!--

    <button class="flash-card-3d-button">
      <span> <b-icon icon="home" /></span>
    </button>
    -->

    <!--
    <section
      class="hero is-fullheight"
      v-else-if="displayKind == 'scores'"
      ref="enterAnswerFormDisplayRef"
    >
      <div class="hero-body">
        <div class="columns is-gapless is-centered" style="min-width: 100%">
          <div
            class="column is-12-mobile is-10-tablet is-9-desktop is-4-fullhd"
          >
            <center style="margin-bottom: -30px; z-index: 0">
              <img
                src="../../../../public/favourite.png"
                width="100"
                ref="starRef0"
              />
              <img
                src="../../../../public/favourite.png"
                class="ml-3 mb-4"
                width="100"
                ref="starRef1"
              />
              <img
                src="../../../../public/favourite.png"
                class="ml-3"
                width="100"
                ref="starRef2"
              />
            </center>

            <div class="flash-card-sketchy-card mx-6">
              <div class="ribbon-4">
                <div class="ribbon-content">
                  <div
                    class="is-size-2 has-text-white has-text-centered py-1"
                    style="font-family: arial"
                  >
                    YOU WON
                  </div>
                </div>
              </div>

              <div
                class="mb-4"
                style="
                  border-radius: 3px;
                  padding: 10px;
                  border: 1px solid black;
                  background: #f7f7ed;
                  -webkit-box-shadow: 0px 0px 26px -9px rgba(34, 60, 80, 0.23) inset;
                  -moz-box-shadow: 0px 0px 26px -9px rgba(34, 60, 80, 0.23) inset;
                  box-shadow: 0px 0px 26px -9px rgba(34, 60, 80, 0.23) inset;
                "
              >
                <div class="is-flex is-justify-content-space-around">
                  <div ref="scoresTimerRef">
                    <img
                      src="../../../../public/heart.png"
                      width="45"
                      style="vertical-align: middle"
                    />
                    <span style="vertical-align: middle" class="is-size-3 ml-2"
                      >22:21</span
                    >
                  </div>
                  <div ref="scoresCoinRef">
                    <img
                      src="../../../../public/star.png"
                      width="45"
                      style="vertical-align: middle"
                    />
                    <span style="vertical-align: middle" class="is-size-3 ml-2"
                      >322</span
                    >
                  </div>
                </div>
              </div>
              <div>
                <div class="is-flex is-justify-content-space-between">
                  <span class="is-size-4">Themes</span>
                  <span class="is-size-4">3</span>
                </div>
                <div class="is-flex is-justify-content-space-between">
                  <span class="is-size-4">Examples</span>
                  <span class="is-size-4">3</span>
                </div>
                <div class="is-flex is-justify-content-space-between">
                  <span class="is-size-4">Rows</span>
                  <span class="is-size-4">115</span>
                </div>
              </div>
              <hr class="m-3" />
              <div class="is-flex is-justify-content-space-between">
                <button class="flash-card sketched-button" @click="modal = true">
                  <span> <b-icon icon="home" /> </span>
                </button>
                <button class="flash-card sketched-buttonn ml-3">
                  <span> <b-icon icon="redo" /> Restart</span>
                </button>
                <button class="flash-card sketched-button ml-3" @click="modal = true">
                  <span> <b-icon icon="bars" /> </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <b-modal
      v-model="modal"
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Example Modal"
      close-button-aria-label="Close"
      animation="zoom-in"
      :can-cancel="['outside']"
      aria-modal
    >
      <template>
        <div
          class="flash-card-sketchy-card lined thick mt-7 is-size-5 mb-2 mx-5"
          style="z-index: 999"
        >
          <div class="is-size-2 has-text-centered has-text-weight-semibold">
            How to play?
          </div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate
          ipsum incidunt suscipit, sit consequatur ipsa quasi quam quis adipisci
          ex corrupti numquam distinctio perspiciatis harum eos non quo.
          Inventore explicabo facere sint.
          <button class="flash-card-3d-button">
            <span> <b-icon icon="play" />Play</span>
          </button>
          <img
            src="https://pressstart.vip/images/uploads/assets/icons/starcolored.png"
          />
          <img
            src="https://pressstart.vip/images/uploads/assets/icons/heartcolored.png"
          />
        </div>
      </template>
    </b-modal>

    -->

    <!--
    <svg
      viewBox="-90 -30 780 410"
      width="500"
      style="position: absolute"
      ref="cards"
    >
      <rect
        width="90"
        height="140"
        rx="20"
        ry="20"
        style="
          fill: rgb(238, 200, 72);
          stroke-width: 6;
          stroke: #262626;
          transform-origin: 20% 20%;
        "
        ref="yellowCardRef"
      />

      <rect
        width="90"
        height="140"
        rx="20"
        ry="20"
        x="55"
        style="
          fill: rgb(204, 62, 62);
          stroke-width: 6;
          stroke: #262626;
          transform-origin: 20% 20%;
        "
        ref="redCardRef"
      />
    </svg>

    -->

    <!--
  <img src="../../../../public/foggy.png" />
    <div class="is-flex is-justify-content-space-between">
      <div>1</div>
      <div
        class="is-bordered pt-2"
        style="
          width: 80%;
          border-radius: 10px;
          overflow: hidden;
          margin-top: -8px;
        "
      >
        <div class="card px-2 py-2">
          <div class="is-flex is-align-items-center is-justify-content-center">
            <b-icon icon="square-shape" type="is-primary" size="is-medium" />
            <span class="is-size-5 ml-2">Flash card</span>
          </div>
        </div>
        <b-progress
          :value="80"
          :rounded="false"
          class="mb-0"
          type="is-primary"
        ></b-progress>
      </div>
      <div>1</div>
    </div>

    <div class="container">
      <div class="card p-4 is-bordered">
        <div class="is-flex">
          <div style="width: 150px">
            <div class="has-text-centered has-text-weight-semibold mb-1">
              Example 1:
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input has-text-centered"
                  type="number"
                  placeholder="Please enter answer"
                />
              </div>
            </div>
            <div class="field">
              <p class="control">
                <b-button class="is-primary is-fullwidth" icon-left="check"
                  >Check answer</b-button
                >
              </p>
            </div>
          </div>

          <div style="width: 200px; margin-left: 20px">
            <div class="has-text-centered has-text-weight-semibold mb-1">
              Example 2:
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input has-text-centered"
                  type="number"
                  placeholder="Please enter answer"
                  disabled
                />
              </div>
            </div>
            <div class="field">
              <p class="control">
                <b-button
                  class="is-success is-fullwidth"
                  icon-left="check"
                  disabled
                  >Correct</b-button
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    -->
  </div>
</template>
<style lang="scss">
@import "bulma/sass/utilities/mixins";
@import url(https://fonts.googleapis.com/css?family=Patrick+Hand+SC);
@import url("https://fonts.googleapis.com/css2?family=Cabin+Sketch&display=swap");

.stitched {
  padding: 10px;
  background: #e67e22;
  color: #fff;
  //font-size: 21px;
  //font-weight: bold;
  //line-height: 1.3em;
  border: 2px dashed rgba(230, 126, 34, 0.2);
  //font-weight: normal;
  overflow: hidden !important;
}

.flash-card-background {
  font-family: "Patrick Hand SC", cursive;
  //font-family: "Pedulinka";
  background-color: rgb(226, 221, 204);
  //position: relative;
  min-height: 100vh;

  -moz-box-shadow: inset 0 0 100px #000000;
  -webkit-box-shadow: inset 0 0 100px #000000;

  box-shadow: inset 0 0 10px #000000;
  background: rgb(245, 238, 219);
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );

  /*
  background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 15px,
      rgba(0, 0, 0, 0.2) 15px,
      rgba(0, 0, 0, 0.2) 19px
    ),
    url(http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/old_map_@2X.png);
    */
}

.flash-card-game-title {
  font-size: 130px;
  fill: rgba(0, 0, 0, 0.8);
}

.flash-card.sketchy-card {
  background: white;
  border-radius: 5px;
  border: 2px solid #000;
  box-shadow: 0 4px 0 #000;
}

/*
.flash-card-sketchy-card {
  //background: #fbfeff;
  padding: 20px;
  font-size: 22px !important;
  background: #f4f7fc;
  font-family: "Patrick Hand SC", cursive;
  cursor: pointer;
  margin: 0 1rem;
  transition: all 0.5s ease;
  color: #41403e;
  letter-spacing: 1px;
  outline: none;
  box-shadow: 20px 38px 34px -26px hsla(0, 0%, 0%, 0.2);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px !important;

  &:hover {
    box-shadow: 2px 8px 4px -6px hsla(0, 0%, 0%, 0.3);
  }
  &.lined.thick {
    border: solid 7px #41403e;
  }
  &.dotted.thick {
    border: dotted 5px #41403e;
  }
  &.dashed.thick {
    border: dashed 5px #41403e;
  }
  &.lined.thin {
    border: solid 2px #41403e;
  }
  &.dotted.thin {
    border: dotted 2px #41403e;
  }
  &.dashed.thin {
    border: dashed 2px #41403e;
  }
}
*/

.flash-card.sketched-button > span {
  background: #fff;
  display: block;
  padding: 5px 15px;
  border-radius: 5px;
  border: 2px solid #000;
}

.flash-card.sketched-button:active {
  top: 4px;
  padding-bottom: 0px;
  box-shadow: 0 1px 0 #000;
}

.flash-card.sketched-button {
  all: initial;
  display: inline-block;
  position: relative;
  font: normal 25px/25px "Patrick Hand SC", sans-serif;
  @include mobile {
    font: normal 18px/18px "Patrick Hand SC", sans-serif;
    padding-bottom: 2px;
  }
  text-transform: uppercase;
  color: #000;
  text-decoration: none;
  padding-bottom: 3px;
  border-radius: 5px;
  transition: padding 0.1s, box-shadow 0.1s, top 0.1s;
  box-shadow: 0 2px 0 #000, 0 2px 0px 0px black;
  background-image: url("data:image/gif;base64,R0lGODlhBAAEAIABAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NUY1OENCRDdDMDYxMUUyOTEzMEE1MEM5QzM0NDVBMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NUY1OENCRTdDMDYxMUUyOTEzMEE1MEM5QzM0NDVBMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk1RjU4Q0JCN0MwNjExRTI5MTMwQTUwQzlDMzQ0NUEzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk1RjU4Q0JDN0MwNjExRTI5MTMwQTUwQzlDMzQ0NUEzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAAQABAAAAgYEEpdoeQUAOw==");
}

.flash-card.sketched-button:hover {
  cursor: pointer;
}

.meter > span:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background-size: 50px 50px;
  animation: move 2s linear infinite;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
}
div.modal-background {
  background: rgba(0, 0, 0, 0.3);
}

.flash-card.sketchy-card-timeline {
  width: 100%;
  position: relative;
  height: 10px;
  margin-bottom: -4px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  z-index: -1;
}

.sketchy-card-timeline.success {
  background: rgb(63, 195, 128);
  box-shadow: 0px 0px 30px 4px rgba(63, 195, 128, 0.4);
}

.sketchy-card-timeline.warning {
  background: rgb(230, 126, 34);
  box-shadow: 0px 0px 30px 4px rgba(230, 126, 34, 0.4);
}

/*
.flash-card.sketchy-card-timeline::after {
  display: inline-block;
  content: "";
  width: 25px;
  height: 25px;
  background: #019875;
  border-radius: 50%;
  float: right;
  border: 4px solid #3fc380;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-25%) translateX(100%);
}
*/
.ribbon-4:before {
  height: 0;
  width: 0;
  border-width: 40px 20px;
  border-style: solid;
  border-color: #16a085 #16a085 #16a085 transparent;
  top: 10px;
  left: -30px;
}
.ribbon-4:after {
  height: 0;
  width: 0;
  border-width: 40px 20px;
  border-style: solid;
  border-color: #16a085 transparent #16a085 #16a085;
  top: 10px;
  right: -30px;
}

.ribbon-content {
  border: 1px solid black;
  height: inherit;
  margin-bottom: 0;
  background: #1abc9c;
  z-index: 4;
}
.ribbon-content:before {
  height: 0;
  width: 0;
  border-top: 10px solid #26808b;
  border-left: 10px solid transparent;
  bottom: -10px;
}
.ribbon-content:after {
  height: 0;
  width: 0;
  border-top: 10px solid #26808b;
  border-right: 10px solid transparent;
  right: 0;
  bottom: -10px;
}
[class^="ribbon-"] {
  position: relative;
}
[class^="ribbon-"]:before,
[class^="ribbon-"]:after {
  content: "";
  position: absolute;
}
.ribbon-4 {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  //height: 80px;
  margin-left: -27px;
  margin-right: -27px;
  background: #efb23b;
  margin-top: 10px;
  margin-bottom: 20px;
}

input.flash-card.input {
  font-family: "Patrick Hand SC", cursive;
  border: 2px solid black;
  height: 100px;
  @include mobile {
    height: 80px;
  }

  -webkit-appearance: none;
  text-align: center;
  margin: 0;
}
</style>
<script lang="ts" src="./game.ts"></script>
