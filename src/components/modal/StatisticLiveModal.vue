<template>
  <a-modal v-model:visible="visible" hide-title :footer="false" width="auto"
           :mask-style="{ backdropFilter: 'blur(1px)' }">
    <div class="bg-[var(--theme-dark-2)] w-[968px] max-w-[96vw] max-h-[70vh] px-3 py-6 rounded-xl flex flex-col
     justify-center items-center">
      <div>{{ title }}</div>

      <common-chart :series="summary.series" :loading="loading" :y-axis="summary.y_axis"/>

      <common-chart :series="activity.series" :loading="loading" :y-axis="activity.y_axis"/>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {client} from "@/assets/lib/request";
import {axis_formatter} from "@/assets/lib/utils";
import {Notification} from "@arco-design/web-vue";
import type {SeriesOption, YAXisComponentOption} from "echarts";

const visible = ref(true)
const props = defineProps<{ live_id: number, title: string }>()


const loading = ref(false)

const summary = ref<{
  y_axis: YAXisComponentOption[]
  series: SeriesOption[]
}>({
  y_axis: [
    {
      type: "value",
      name: "数量",
      axisLabel: {formatter: axis_formatter}
    },
    {
      type: "value",
      name: "价值",
      axisLabel: {formatter: axis_formatter}
    }
  ],
  series: []
})

const activity = ref<{
  y_axis: YAXisComponentOption[]
  series: SeriesOption[]
}>({
  y_axis: [
    {
      type: "log",
      name: "平均数量",
      axisLabel: {formatter: axis_formatter}
    },
    {
      type: "value",
      name: "最高排名",
      min: 1,
      inverse: true,
      nameLocation: "start"
    }
  ],
  series: []
})

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<StatisticLiveData>({url: `statistic/live/?id=${props.live_id}`})
    summary.value.series = [
      {
        name: "弹幕",
        type: "line",
        yAxisIndex: 0,
        lineStyle: {width: 2},
        data: res.data.message_num.map((value, index) => [res.data.timestamp[index], value])
      },
      {
        name: "进场",
        type: "line",
        yAxisIndex: 0,
        lineStyle: {width: 2},
        data: res.data.entry_num.map((value, index) => [res.data.timestamp[index], value])
      },
      {
        name: "留言",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.chat_price.map((value, index) => [res.data.timestamp[index], value])
      },
      {
        name: "礼物",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.gift1_price.map((value, index) => [res.data.timestamp[index], (value || 0) / 1e3])
      },
      {
        name: "上舰",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.guard_price.map((value, index) => [res.data.timestamp[index], value])
      }
    ]

    activity.value.series = [
      {
        name: "观看数",
        type: "line",
        yAxisIndex: 0,
        lineStyle: {width: 2},
        data: res.data.watch.map((value, index) => [res.data.timestamp[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      },
      {
        name: "在线数",
        type: "line",
        yAxisIndex: 0,
        lineStyle: {width: 2},
        data: res.data.rank.map((value, index) => [res.data.timestamp[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      },
      {
        name: "粉丝团",
        type: "line",
        yAxisIndex: 0,
        lineStyle: {width: 2},
        data: res.data.fans.map((value, index) => [res.data.timestamp[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      },
      {
        name: "点赞数",
        type: "line",
        yAxisIndex: 0,
        lineStyle: {width: 2},
        data: res.data.like.map((value, index) => [res.data.timestamp[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      },
      {
        name: "人气排名",
        yAxisIndex: 1,
        type: "scatter",
        data: res.data.popular.map((value, index) => [res.data.timestamp[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      }
    ]
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    loading.value = false
  }
}

get_data()
</script>

<style lang="less">
.arco-modal-body {
  padding: 0;
}
</style>
