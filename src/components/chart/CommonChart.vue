<template>
  <div class="w-full md:h-[400px] h-[60vw] py-2">
    <v-chart class="chart h-full shadow-around duration-500" :option="option" :loading="props.loading"
             :theme="store.dark ? dark : light" :autoresize="true" @zr:click="on_click"/>
    <div class="text-center font-bold">{{ props.title }}</div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LineChart, BarChart, ScatterChart} from "echarts/charts";
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
  ToolboxComponent,
  TooltipComponent,
  DataZoomComponent
} from "echarts/components";

import {UseStore} from "@/store";
import {light, dark} from "@/assets/lib/echartThemes";
import {to_excel} from "@/assets/lib/utils";

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  ScatterChart,
  GridComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
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
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        show: true,
        title: {
          zoom: "框选",
          back: "还原"
        },
        filterMode: "filter"
      },
      saveAsImage: {
        show: true,
        title: "保存图片",
        type: "png",
        name: "img",
        backgroundColor: "auto",
        excludeComponents: ["toolbox"]
      },
      myTool1: {
        show: true,
        title: "导出excel",
        icon: "path://M200 28H72a12 12 0 0 0-12 12v28H40a12 12 0 0 0-12 12v96a12 12 0 0 0 12 12h20v28a12 12 0 0 0 12 12h128a12 12 0 0 0 12-12V40a12 12 0 0 0-12-12m-44 72h48v56h-48Zm48-60v52h-48V80a12 12 0 0 0-12-12h-4V36h60a4 4 0 0 1 4 4M68 40a4 4 0 0 1 4-4h60v32H68ZM36 176V80a4 4 0 0 1 4-4h104a4 4 0 0 1 4 4v96a4 4 0 0 1-4 4H40a4 4 0 0 1-4-4m32 40v-28h64v32H72a4 4 0 0 1-4-4m132 4h-60v-32h4a12 12 0 0 0 12-12v-12h48v52a4 4 0 0 1-4 4M68.93 149.44L86.79 128l-17.86-21.44a4 4 0 0 1 6.14-5.12L92 121.75l16.93-20.31a4 4 0 1 1 6.14 5.12L97.21 128l17.86 21.44a4 4 0 1 1-6.14 5.12L92 134.25l-16.93 20.31A4 4 0 0 1 72 156a3.94 3.94 0 0 1-2.56-.93a4 4 0 0 1-.51-5.63",
        onclick: function () {
          // eslint-disable-next-line
          // @ts-ignore
          const length = props.series[0].data.length
          const res = []
          for (let i = 0; i < length; i++) {
            const data: Record<string, string | number | boolean | null> = {}
            for (let j = 0; j < props.series.length; j++) {
              const point = props.series[j].data as ([number | string, number] | undefined)[];
              const item = point[i]
              if (!data[""] && item) {
                data[""] = item[0]
              }
              data[props.series[j].name ?? `未知列名${j}`] = item ? Number.isNaN(item[1]) ? "--" : item[1] : null
            }
            res.push(data)
          }
          to_excel({[props.title || "图表"]: res}, props.title)
        }
      }
    }
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
