<template>
  <div class="game-background">
  <!--
    <div class="flash-card-stars">
      <img src="../../../../public/favourite.png" width="80" ref="starRef0" />
      <img
        src="../../../../public/favourite.png"
        class="ml-3"
        width="80"
        ref="starRef1"
      />
      <img
        src="../../../../public/favourite.png"
        class="ml-3"
        width="80"
        ref="starRef2"
      />
    </div>

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
      <text x="230" y="140" class="flash-card-game-title">Flash card</text>
    </svg>
    -->

    <section class="hero is-fullheight">
      <div class="hero-body">
        <div class="columns is-gapless is-centered" style="min-width: 100%">
          <div
            class="column is-12-mobile is-10-tablet is-9-desktop is-5-fullhd"
          >
            <div
              class="is-flex is-align-items-center"
              style="flex-direction: column"
            >
              <button class="flash-card-button" style="width: 250px">
                <span> <b-icon icon="play" />Play</span>
              </button>

              <button class="flash-card-button mt-2" style="width: 250px">
                <span>
                  <b-icon icon="setting" />

                  Settings</span
                >
              </button>
              <button class="flash-card-button mt-2" style="width: 250px">
                <span>
                  <b-icon icon="sign-out-alt" />

                  Exit</span
                >
              </button>
            </div>

              <!--
            <div class="flash-card-sketchy-card lined thick mt-7 is-size-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat ad
              odit, architecto facilis corporis mollitia minus impedit nesciunt
              recusandae asperiores officiis sapiente veritatis debitis
              necessitatibus aspernatur iure repudiandae modi? Omnis, dolor
              minus.j
              <button class="flash-card-button">
                <span> <b-icon icon="play" />Play</span>
              </button>
              <img
                src="https://pressstart.vip/images/uploads/assets/icons/starcolored.png"
              />
              <img
                src="https://pressstart.vip/images/uploads/assets/icons/heartcolored.png"
              />
            </div>
              -->

          </div>
        </div>
      </div>
    </section>

    <!--
    <AbacusBoard
      style="width: 800px; display: block; margin: auto"
      :columns="6"
    />
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
    <div class="hero is-fullheight">
      <div class="hero-body has-text-centered">
      </div>
    </div>
    -->
  </div>
</template>
<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Patrick+Hand+SC);

.flash-card-stars {
  position: absolute;
  right: 50%;
  transform: translate(50%, 0);
}

.game-background {
  font-family: "Patrick Hand SC", cursive;
  background-color: rgb(226, 221, 204);
  height: 100vh;

  -moz-box-shadow: inset 0 0 100px #000000;
  -webkit-box-shadow: inset 0 0 100px #000000;

  box-shadow: inset 0 0 10px #000000;
  background: rgb(245, 238, 219);
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

.flash-card-sketchy-card {
  //background: #fbfeff;
  padding: 10px;
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

.flash-card-button > span {
  background: #fff;
  display: block;
  padding: 5px 15px;
  border-radius: 5px;
  border: 2px solid #000;
}

.flash-card-button:active {
  top: 4px;
  padding-bottom: 0px;
  box-shadow: 0 1px 0 #000;
}

.flash-card-button {
  all: initial;
  display: inline-block;
  position: relative;
  font: normal 25px/25px "Patrick Hand SC", sans-serif;
  margin-right: 10px;
  text-transform: uppercase;
  color: #000;
  text-decoration: none;
  padding-bottom: 3px;
  border-radius: 5px;
  transition: padding 0.1s, box-shadow 0.1s, top 0.1s;
  box-shadow: 0 2px 0 #000, 0 2px 0px 0px black;
  background-image: url("data:image/gif;base64,R0lGODlhBAAEAIABAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NUY1OENCRDdDMDYxMUUyOTEzMEE1MEM5QzM0NDVBMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NUY1OENCRTdDMDYxMUUyOTEzMEE1MEM5QzM0NDVBMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk1RjU4Q0JCN0MwNjExRTI5MTMwQTUwQzlDMzQ0NUEzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk1RjU4Q0JDN0MwNjExRTI5MTMwQTUwQzlDMzQ0NUEzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAAQABAAAAgYEEpdoeQUAOw==");
}
.flash-card-button:hover {
  cursor: pointer;
}
</style>
<script lang="ts" src="./game.ts"></script>

