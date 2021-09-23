<template>
  <div class="container is-max-desktop py-2 px-2">
    <div class="card p-4 is-stat-bordered">
      <nav class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Abacus</p>
            <p class="title">300</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Numbers</p>
            <p class="title">445</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Flash card</p>
            <p class="title">100</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Table</p>
            <p class="title">789</p>
          </div>
        </div>
      </nav>
    </div>
    <div class="card p-4 mt-4 is-bordered">
      <div class="is-size-5 mb-3 has-text-weight-bold">
        <b-icon icon="chart" /> Weekly scores
      </div>
      <line-chart :chartdata="lineChartData" :options="lineChartOptions" />
    </div>
    <div class="card p-4 mt-4 is-bordered">
      <div class="is-size-5 mb-3 has-text-weight-bold">
        <b-icon icon="chart" /> Weekly exercises
      </div>
      <pie-chart :chartdata="pieChartData" :options="pieChartOptions" />
    </div>
    <div class="mt-2">
      <b-button tag="router-link" to="/" icon-left="home" expanded
        >Home</b-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LineChart from "@/components/charts/line.chart.vue";
import PieChart from "@/components/charts/pie.chart.vue";

@Component({ components: { LineChart, PieChart } })
export default class Scores extends Vue {
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public lineChartData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Abacus",
        fill: false,
        borderColor: "#f87979",
        data: [0, 10],
      },
      {
        label: "Numbers",
        fill: false,
        borderColor: "#19b5fe",
        data: [0, 20, 30],
      },
    ],
  };

  public pieChartOptions = { responsive: true, maintainAspectRatio: false };
  public pieChartData = {
    labels: ["Abacus", "Numbers", "Flash card", "Table"],
    datasets: [
      {
        data: [2, 3, 5, 5],
        backgroundColor: ["#f87979", "#19b5fe", "#9b59b6", "#f7ca18"],
      },
    ],
  };
}
</script>
<style lang="scss">
.is-bordered {
  border: 1px solid rgb(152, 164, 166);
}
.is-stat-bordered {
  border: 1px solid rgb(152, 164, 166);
  border-bottom: 3px solid rgb(152, 164, 166);
}
</style>
