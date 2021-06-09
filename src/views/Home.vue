<template>
  <div
    class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
    style="height: 100vh"
  >
    <div class="columns is-multiline is-centered">
      <div class="column is-one-fifth">
        <div class="box">
          <center>
            <b-icon type="is-primary" icon="abacus" size="is-large" /><br />
            Abacus
            <br />
            <b-tag type="is-primary is-light"
              ><b-icon icon="award" size="is-small" /> 10</b-tag
            >
            <b-tag type="is-danger is-light"
              ><b-icon icon="exclamation-circle" size="is-small" /> 10</b-tag
            >
          </center>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="box">
          <center>
            <b-icon type="is-primary" icon="10-plus" size="is-large" /><br />
            Numbers
            <br />
            <b-tag>14+</b-tag> <b-tag>14+</b-tag>
          </center>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="box">
          <center>
            <b-icon
              type="is-primary"
              icon="square-shape"
              size="is-large"
            /><br />
            Flash card
            <br />
            <b-tag>14+</b-tag> <b-tag>14+</b-tag>
          </center>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="box">
          <center>
            <b-icon type="is-primary" icon="table" size="is-large" /><br />
            Table
            <br />
            <b-tag>14+</b-tag> <b-tag>14+</b-tag>
          </center>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="box">
          <center>
            <b-icon
              type="is-primary"
              icon="presentation"
              size="is-large"
            /><br />
            Tutorials
            <br />
            <b-tag type="is-warning"><b>0%</b> done</b-tag>
          </center>
        </div>
      </div>

      <div class="column is-one-fifth">
        <div class="box">
          <center>
            <b-icon type="is-primary" icon="chart-bar" size="is-large" /><br />
            Statistics
            <br />
            <b-tag>14+</b-tag> <b-tag>14+</b-tag>
          </center>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="box">
          <center>
            <b-icon type="is-primary" icon="setting" size="is-large" /><br />
            Settings
            <br />
            <b-tag>Update settings</b-tag>
          </center>
        </div>
      </div>
    </div>
    <div>
      <connection-status />
      <b-button
        type="is-info is-light ml-4"
        size="is-small"
        icon-left="info-circle"
        active
        focused
        >About the application</b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ConnectionStatus from "@/components/ConnectionStatus.vue";

@Component({
  components: { ConnectionStatus }
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped></style>
