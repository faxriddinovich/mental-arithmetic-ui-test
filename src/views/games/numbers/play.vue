<template>
  <div>
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
          <b-button tag="router-link" :to="{ name: 'Home' }" type="is-primary is-light" icon-left="home" size="is-medium"
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

    <section class="hero is-fullheight" v-if="settings.displayNumbers">
      <div class="hero-body p-0">
        <div class="has-text-centered" style="width: 100%">
          <span :class="fontClasses" :style="fontStyles">+999999</span>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref } from "@vue/composition-api";
import { NumbersGameSettings } from "./interfaces";
import { createNamespacedHelpers as createStoreHelper } from "vuex-composition-helpers";
import { themes } from '@mental-arithmetic/themes';

const getTheme = (loc: string) => themes.find((theme) => theme.loc === loc);

export default defineComponent({
  setup(_, { root }) {
    const { useState } =
      createStoreHelper<{ settings: NumbersGameSettings }>("GameModule");
    const { settings } = useState(["settings"]);

    const fontClasses = computed(() => {
      const classes: any = { "is-big-number": true };
      classes[`is-${settings.value.fontSize}`] = true;
      classes[`is-rotated-${settings.value.fontRotation}`] = true;
      return classes;
    });
    const fontStyles = computed(() => {
      return { color: settings.value.fontColor };
    });

    const canEnterAnswer = ref<boolean>(false);
    const showText = ref<string>('');

    onMounted(() => {
        //
    });

    return { settings, fontClasses, fontStyles, canEnterAnswer, showText };
  },
});
</script>
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
</style>
