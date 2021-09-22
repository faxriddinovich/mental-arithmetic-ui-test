<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { Line } from "vue-chartjs";

@Component
export default class LineChart extends Mixins(Line) {
  @Prop(Object) public chartdata!;
  @Prop(Object) public options!;

  mounted() {
    this.renderChart(this.chartdata, this.options);
	}
}
</script>
