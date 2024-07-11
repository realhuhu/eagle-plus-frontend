<template>
  <a-modal v-model:visible="visible" hide-title :footer="false" width="auto"
           :mask-style="{ backdropFilter: 'blur(1px)' }">
    <div class="bg-[var(--theme-dark-2)] w-[968px] max-w-[96vw] max-h-[70vh] px-3 py-6 rounded-xl flex flex-col
     justify-center items-center">
      <div>{{ title }}</div>

      <common-chart :series="summary.series" :loading="loading" :y-axis="summary.y_axis" :y-hide="store.is_mobile"/>

      <common-chart :series="activity.series" :loading="loading" :y-axis="activity.y_axis" :y-hide="store.is_mobile"/>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {UseStore} from "@/store";
import {Notification} from "@arco-design/web-vue";
import type {SeriesOption, YAXisComponentOption} from "echarts";

import {client} from "@/assets/lib/request";
import {axis_formatter, unpack} from "@/assets/lib/utils";

const props = defineProps<{ live_id: number, title: string }>()
const store = UseStore()
const visible = ref(true)
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
        data: unpack(res.data.message_num, res.data.timestamp)
      },
      {
        name: "进场",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.entry_num, res.data.timestamp)
      },
      {
        name: "留言",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: unpack(res.data.chat_price, res.data.timestamp)
      },
      {
        name: "礼物",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: unpack(res.data.gift1_price, res.data.timestamp, x => x / 1e3)
      },
      {
        name: "上舰",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: unpack(res.data.guard_price, res.data.timestamp)
      }
    ]

    activity.value.series = [
      {
        name: "观看数",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.watch, res.data.timestamp).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      },
      {
        name: "在线数",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.rank, res.data.timestamp).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      },
      {
        name: "粉丝团",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.fans, res.data.timestamp).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      },
      {
        name: "点赞数",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.like, res.data.timestamp).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      },
      {
        name: "人气排名",
        yAxisIndex: 1,
        type: "scatter",
        data: unpack(res.data.popular, res.data.timestamp).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
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
  overflow: visible;
}
</style>
