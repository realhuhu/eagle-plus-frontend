<template>
  <div class="w-full md:h-[400px] h-[60vw] py-2">
    <v-chart class="chart h-full shadow-around duration-500" :option="option" :loading="props.loading"
             :theme="store.dark ? dark : light" :autoresize="true" @zr:click="on_click"/>
    <div class="text-center font-bold">{{ props.title }}</div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import {ref, watch} from "vue";
import {use} from "echarts/core";
import {LineChart, BarChart, ScatterChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
import type {
  EChartsOption,
  SeriesOption,
  XAXisComponentOption,
  YAXisComponentOption,
  TooltipComponentOption,
  ElementEvent
} from "echarts";
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

const emit = defineEmits(["click"])

const store = UseStore()
const props = defineProps<{
  loading: boolean
  title?: string
  series: SeriesOption[]
  xAxis?: XAXisComponentOption
  yAxis?: YAXisComponentOption[]
  tooltip?: TooltipComponentOption
  yHide?: boolean
  zoomHide?: boolean
}>()

const option = ref<EChartsOption>({
  legend: {
    left: "center",
    top: "10px"
  },
  tooltip: props.tooltip || {
    trigger: "axis",
    axisPointer: {animation: true}
  },
  xAxis: props.xAxis || {
    type: "time",
    splitLine: {
      show: false
    }
  },
  yAxis: props.yAxis || [
    {type: "value", show: false},
    {type: "value", show: false},
    {type: "value", show: false},
    {type: "value", show: false},
    {type: "value", show: false},
    {type: "value", show: false},
    {type: "value", show: false},
    {type: "value", show: false}
  ],
  series: []
});

watch(() => props.series, () => {
  option.value.legend = {
    ...option.value.legend,
    data: props.series.map(x => x.name) as string[]
  }
  option.value.series = props.series

  const grid: {
    left?: number
    right?: number
    bottom?: number
  } = {}


  if (!props.zoomHide) {
    option.value.dataZoom = [
      {
        type: "inside",
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ]
  } else {
    grid.bottom = 30
  }

  if (props.yHide) {
    if (props.yAxis) {
      option.value.yAxis = props.yAxis.map(x => ({...x, show: false}))
    }
    grid.left = grid.right = 10
  }

  option.value.grid = grid
})

const on_click = (params: ElementEvent) => {
  emit("click", params)
}
</script>

<style scoped lang="less"></style>
