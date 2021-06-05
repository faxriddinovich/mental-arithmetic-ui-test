<template>
  <div class="is-flex is-justify-content-center" style="height: 100vh">
    <div
      class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
    >
      <b-upload drag-drop expanded>
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"> </b-icon>
            </p>
            <p>Drop your certificate file here or click to upload</p>
          </div>
        </section>
      </b-upload>
      <b-button
        type="is-primary"
        tag="router-link"
        to="/"
        class="mt-5"
        outlined
        expanded
        ><b-icon icon="angle-left-b" /> Go back</b-button
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Activation extends Vue {}
</script>

<style></style>
