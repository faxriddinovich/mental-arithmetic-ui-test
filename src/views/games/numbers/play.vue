<template>
  <div>
    <div class="is-bottom-left-screen p-3">
      <b-button
        icon-left="expand-arrows"
        type="is-primary is-light"
        size="is-large"
      />
    </div>
    <div class="card is-controls-bar">
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
          <b-button type="is-primary is-light" icon-left="home" size="is-medium"
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
        <b-progress type="is-success" class="completed-progress" :value="40">
        </b-progress>
      </div>
    </div>

    <section class="hero is-fullheight">
      <div class="hero-body p-0">
        <div class="has-text-centered" style="width: 100%">
          <span class="is-big-number is-3">+842983</span>
        </div>
      </div>
    </section>
  </div>
</template>
<style lang="scss">
@import "bulma/sass/utilities/mixins";

.completed-progress > .progress {
  border-radius: 0px !important;
  @include mobile {
    height: 0.8rem;
  }
}

.is-bottom-left-screen {
  position: absolute;
  bottom: 0px;
}

.is-controls-bar {
  position: absolute !important;
  width: 100% !important;
}

.is-big-number.is-1 {
  font-size: 10vmin;
}

.is-big-number.is-2 {
  font-size: 15vmin;
}

.is-big-number.is-3 {
  font-size: 20vmin;
  @include tablet {
    font-size: 18vh;
  }
}

.is-big-number {
  display: inline-block;
  -webkit-transform: rotate(-90deg);
}
</style>
