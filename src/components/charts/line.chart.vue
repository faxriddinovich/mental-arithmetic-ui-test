<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { Line } from "vue-chartjs";

@Component
export default class LineChart extends Mixins(Line) {
  @Prop(Object) public chartdata!: any;
  @Prop(Object) public options!: any;

  mounted() {
    this.renderChart(this.chartdata, this.options);
  }
}
</script>
