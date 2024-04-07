<template>
  <div class="w-full">
    <div class="text-center font-bold mb-1">{{props.title}}</div>
    <v-chart class="chart md:h-[400px] h-[60vw] shadow-around duration-500" :option="option"
             :loading="props.loading" :theme="store.dark?dark:light" :autoresize="true"/>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import {ref, watch} from "vue";
import {use} from "echarts/core";
import {LineChart, BarChart, ScatterChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
import type {EChartsOption, SeriesOption, YAXisComponentOption} from "echarts";
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
  BarChart,
  LineChart,
  ScatterChart,
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent
])

const store = UseStore()
const props = defineProps<{
  loading: boolean
  title: string,
  series: SeriesOption[]
  yAxis: YAXisComponentOption[]
}>()

const option = ref<EChartsOption>({
  legend: {
    left: "center",
    top: "10px",
    data: []
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {animation: false}
  },
  xAxis: {
    type: "time"
  },
  yAxis: props.yAxis,
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
  option.value.legend = {
    ...option.value.legend,
    data: props.series.map(x => x.name) as string[]
  }
  option.value.series = props.series
})
</script>

<style scoped lang="less">

</style>
