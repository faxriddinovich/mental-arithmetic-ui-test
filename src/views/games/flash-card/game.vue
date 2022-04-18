<template>
  <div>
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
    <div class="hero is-fullheight">
      <div class="hero-body has-text-centered">
        <AbacusBoard style="width: 800px; display: block; margin: auto" :columns="6" />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script lang="ts" src="./game.ts"></script>
