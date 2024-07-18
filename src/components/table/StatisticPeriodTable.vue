<template>
  <div class="w-full flex flex-col justify-start items-end">
    <div class="mb-3 flex justify-between items-center gap-6 w-full">
      <a-checkbox v-model="chart_connect" class="flex-shrink-0">多图联动</a-checkbox>

      <a-select class="max-w-[256px]" placeholder="请选择" v-model="period_id">
        <a-option :value="0">每日</a-option>
        <a-option :value="1">每周</a-option>
        <a-option :value="2">每月</a-option>
      </a-select>
    </div>


    <div class="flex flex-col justify-center items-center gap-6 w-full">
      <common-chart title="总览" :series="summary.series" :loading="loading" :y-axis="summary.y_axis"
                    :y-hide="store.is_mobile" group="period"/>

      <common-chart title="留言" :series="chat.series" :loading="loading" :y-axis="chat.y_axis"
                    :y-hide="store.is_mobile" group="period"/>

      <common-chart title="礼物" :series="gift.series" :loading="loading" :y-axis="gift.y_axis"
                    :y-hide="store.is_mobile" group="period"/>

      <common-chart title="上舰" :series="guard.series" :loading="loading" :y-axis="guard.y_axis"
                    :y-hide="store.is_mobile" group="period"/>

      <common-chart title="活跃" :series="activity.series" :loading="loading" :y-axis="activity.y_axis"
                    :y-hide="store.is_mobile"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Notification} from "@arco-design/web-vue";
import {connect, disconnect} from "echarts/core"
import type {SeriesOption, YAXisComponentOption} from "echarts";

import {client} from "@/assets/lib/request";
import {UseStore} from "@/store";
import {axis_formatter, unpack} from "@/assets/lib/utils";
import CommonChart from "@/components/chart/CommonChart.vue";

const chart_connect = ref(false)
const period_id = ref(1)
const loading = ref(false)
const store = UseStore()

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

const chat = ref<{
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

const gift = ref<{
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
      name: "瓜子数",
      axisLabel: {formatter: axis_formatter}
    }
  ],
  series: []
})

const guard = ref<{
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
      name: "人数",
      axisLabel: {formatter: axis_formatter}
    },
    {
      name: "人数",
      axisLabel: {formatter: axis_formatter}
    },
    {
      type: "value",
      name: "最高排名",
      min: 1,
      inverse: true,
      nameLocation: "start",
      show: false
    }
  ],
  series: []
})

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<StatisticPeriodData>({
      url: "/statistic/period",
      params: {period_id: period_id.value}
    })

    summary.value.series = [
      {
        name: "弹幕",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.message_num, res.data.period)
      },
      {
        name: "进场",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.entry_num, res.data.period)
      },
      {
        name: "留言",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: unpack(res.data.chat_price, res.data.period)
      },
      {
        name: "礼物",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: unpack(res.data.gift1_price, res.data.period, x => x / 1e3)
      },
      {
        name: "上舰",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: unpack(res.data.guard_price, res.data.period)
      }
    ]

    chat.value.series = [
      {
        name: "数量",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.chat_num, res.data.period)
      },
      {
        name: "价值",
        type: "bar",
        yAxisIndex: 1,
        color: "rgba(255,215,0,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
        data: unpack(res.data.chat_price, res.data.period)
      }
    ]

    gift.value.series = [
      {
        name: "付费礼物",
        yAxisIndex: 0,
        type: "line",
        data: unpack(res.data.gift1_num, res.data.period)
      },
      {
        name: "免费礼物",
        yAxisIndex: 0,
        type: "line",
        data: unpack(res.data.gift0_num, res.data.period)
      },
      {
        name: "金瓜子",
        stack: "price",
        yAxisIndex: 1,
        type: "bar",
        color: "rgba(255,215,0,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
        data: unpack(res.data.gift1_price, res.data.period)
      },
      {
        name: "银瓜子",
        stack: "price",
        yAxisIndex: 1,
        type: "bar",
        color: "rgba(192,192,192,1)",
        itemStyle: {
          borderRadius: [10]
        },
        data: unpack(res.data.gift0_price, res.data.period)
      }
    ]

    guard.value.series = [
      {
        name: "舰长",
        yAxisIndex: 0,
        type: "line",
        color: "#7ac8ed",
        data: unpack(res.data.guard3_num, res.data.period).filter(x => x[1] > 0)
      },
      {
        name: "提督",
        yAxisIndex: 0,
        type: "line",
        color: "#d664f6",
        data: unpack(res.data.guard2_num, res.data.period).filter(x => x[1] > 0)
      },
      {
        name: "总督",
        yAxisIndex: 0,
        type: "line",
        color: "#ab3131",
        data: unpack(res.data.guard1_num, res.data.period).filter(x => x[1] > 0)
      },
      {
        name: "价值",
        type: "bar",
        yAxisIndex: 1,
        color: "rgba(255,215,0,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
        data: unpack(res.data.guard_price, res.data.period)
      }
    ]

    activity.value.series = [
      {
        name: "观看数",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.watch, res.data.period).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      },
      {
        name: "点赞数",
        type: "line",
        yAxisIndex: 0,
        data: unpack(res.data.like, res.data.period).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      },
      {
        name: "在线数",
        type: "line",
        yAxisIndex: 1,
        data: unpack(res.data.rank, res.data.period).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      },
      {
        name: "粉丝团",
        type: "line",
        yAxisIndex: 1,
        data: unpack(res.data.fans, res.data.period).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      },
      {
        name: "人气排名",
        yAxisIndex: 2,
        type: "scatter",
        data: unpack(res.data.popular, res.data.period).filter(x => x[0] > "2023-08-25" && x[1] && x[1] > 0)
      }
    ]
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(chart_connect, (newVal) => {
  if (newVal) {
    connect("period")
  } else {
    disconnect("period")
  }
})

watch(period_id, () => get_data(), {deep: true})

get_data()
</script>

<style scoped lang="less"></style>
