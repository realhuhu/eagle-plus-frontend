<template>
  <v-chart class="h-[160px] shadow-around duration-500" :option="option" :theme="store.dark ? dark : light"
    :autoresize="true" :loading="props.loading" />
</template>

<script setup lang="ts">
import { use } from "echarts/core"
import { HeatmapChart } from "echarts/charts"
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CalendarComponent
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import { dark, light } from "@/assets/lib/echartThemes";
import VChart from "vue-echarts";
import { UseStore } from "@/store";
import { ref, watch } from "vue";
import type { EChartsOption, SeriesOption } from "echarts";

use([
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CalendarComponent,
  HeatmapChart,
  CanvasRenderer
])

const props = defineProps<{
  loading: boolean
  series: SeriesOption
}>()
const store = UseStore()
const option = ref<EChartsOption>({
  tooltip: {
    position: "top",
    formatter: (p) => {
      const v = p as Flat<typeof p>
      const w = props.series.data as [string, number][]
      return `${v.data[0]}</br>该日直播了${v.data[1]}小时</br>该月直播了${w.filter(x => x[0].slice(0, 7) === v.data[0].slice(0, 7)).reduce((acc, cur) => acc + cur[1], 0).toFixed(2)}小时`
    }
  },
  visualMap: {
    min: 0,
    max: 7,
    precision: 1,
    calculable: true,
    right: 5
  },
  calendar: {
    top: 30,
    left: 30,
    right: 60,
    cellSize: ["auto", 13],
    range: new Date().getFullYear(),
    yearLabel: { show: false }
  },
  series: undefined
})

watch(() => props.series, () => {
  option.value.series = props.series
})
</script>

<style scoped lang="less"></style>
