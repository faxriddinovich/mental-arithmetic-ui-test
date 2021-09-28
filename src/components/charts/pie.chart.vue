<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { Pie } from "vue-chartjs";

@Component
export default class PieChart extends Mixins(Pie) {
  @Prop(Object) public chartdata!: any;
  @Prop(Object) public options!: any;

  mounted() {
    this.renderChart(this.chartdata, this.options);
  }
}
</script>
