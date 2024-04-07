<template>
  <v-chart class="chart h-[400px] rounded-2xl shadow-around duration-500" :option="option"
           :loading="props.loading" :theme="store.dark?dark:light" :autoresize="true"/>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import {ref, watch} from "vue";
import {use} from "echarts/core";
import {LineChart} from "echarts/charts";
import type {LineSeriesOption} from "echarts";
import {CanvasRenderer} from "echarts/renderers";
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent
} from "echarts/components";
import {UseStore} from "@/store";
import {light, dark} from "@/assets/lib/echartThemes";

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent
]);

const store = UseStore()
const props = defineProps<{
  loading: boolean
  title: string,
  series: LineSeriesOption[]
}>()

const option = ref({
  title: {
    text: props.title,
    left: "center"
  },
  legend: {
    left: "center",
    top: "6%",
    data: []
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {animation: false}
  },
  xAxis: {
    type: "time",
    boundaryGap: false
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: function (value: number) {
        if (value > 1e6) {
          return (value / 1e6).toFixed(1).toString() + "m"
        } else if (value > 1e3) {
          return (value / 1e3).toFixed(1).toString() + "k"
        }
        return value.toString()
      }
    }
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100
    },
    {
      start: 0,
      end: 100
    }
  ],
  series: []
});

watch(() => props.series, () => {
  option.value.legend.data = props.series.map(x => x.name)
  option.value.series = props.series.map(x => ({...x, type: "line"}))
})
</script>

<style scoped>
</style>
