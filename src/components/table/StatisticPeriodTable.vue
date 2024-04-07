<template>
  <div>
    <a-select placeholder="请选择" v-model="period_id">
      <a-option :value="0">每日</a-option>
      <a-option :value="1">每周</a-option>
      <a-option :value="2">每月</a-option>
    </a-select>

    <div class="flex flex-col justify-center items-center gap-6">
      <common-chart title="总览" :series="summary" :loading="loading" :y-axis="summary_y_axis"/>

      <common-chart title="留言" :series="chat" :loading="loading" :y-axis="chat_y_axis"/>

      <common-chart title="礼物" :series="gift" :loading="loading" :y-axis="gift_y_axis"/>

      <common-chart title="上舰" :series="guard" :loading="loading" :y-axis="guard_y_axis"/>

      <common-chart title="活跃" :series="activity" :loading="loading" :y-axis="activity_y_axis"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {client} from "@/assets/lib/request";
import type {SeriesOption, YAXisComponentOption} from "echarts";
import {axis_formatter} from "@/assets/lib/utils";

const period_id = ref(2)
const loading = ref(false)

const summary = ref<SeriesOption[]>([])
const summary_y_axis = ref<YAXisComponentOption[]>([
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
])

const chat = ref<SeriesOption[]>([])
const chat_y_axis = ref<YAXisComponentOption[]>([
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
])

const gift = ref<SeriesOption[]>([])
const gift_y_axis = ref<YAXisComponentOption[]>([
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
])

const guard = ref<SeriesOption[]>([])
const guard_y_axis = ref<YAXisComponentOption[]>([
  {
    type: "value",
    name: "舰长",
    axisLabel: {formatter: axis_formatter}
  },
  {
    type: "value",
    name: "提/总督"
  }
])

const activity = ref<SeriesOption[]>([])
const activity_y_axis = ref<YAXisComponentOption[]>([
  {
    type: "log",
    name: "数量",
    axisLabel: {formatter: axis_formatter}
  },
  {
    type: "value",
    name: "排名",
    min: 1,
    inverse: true,
    nameLocation: "start"
  }
])

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<StatisticPoint>({
      url: "/statistic/period",
      params: {period_id: period_id.value}
    })

    summary.value = [
      {
        name: "弹幕",
        type: "line",
        yAxisIndex: 0,
        data: res.data.message_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "进场",
        type: "line",
        yAxisIndex: 0,
        data: res.data.entry_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "留言",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.chat_price.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "礼物",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.gift1_price.map((value, index) => [res.data.period[index], (value || 0) / 1e3])
      },
      {
        name: "上舰",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.guard_price.map((value, index) => [res.data.period[index], value])
      }
    ]

    chat.value = [
      {
        name: "数量",
        type: "line",
        yAxisIndex: 0,
        data: res.data.chat_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "价值",
        type: "bar",
        yAxisIndex: 1,
        data: res.data.chat_price.map((value, index) => [res.data.period[index], value])
      }
    ]

    gift.value = [
      {
        name: "付费礼物",
        yAxisIndex: 0,
        type: "line",
        data: res.data.gift1_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "免费礼物",
        yAxisIndex: 0,
        type: "line",
        data: res.data.gift0_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "银瓜子",
        stack: "price",
        yAxisIndex: 1,
        type: "bar",
        data: res.data.gift0_price.map((value, index) => [res.data.period[index], (value || 0) / 1e3])
      },
      {
        name: "金瓜子",
        stack: "price",
        yAxisIndex: 1,
        type: "bar",
        data: res.data.gift1_price.map((value, index) => [res.data.period[index], (value || 0) / 1e3])
      }
    ]

    guard.value = [
      {
        name: "舰长",
        yAxisIndex: 0,
        type: "line",
        color: "#7ac8ed",
        data: res.data.guard3_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "总督",
        yAxisIndex: 1,
        type: "line",
        color: "#ab3131",
        data: res.data.guard1_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "提督",
        yAxisIndex: 1,
        type: "line",
        color: "#d664f6",
        data: res.data.guard2_num.map((value, index) => [res.data.period[index], value])
      }
    ]

    activity.value = [
      {
        name: "观看数",
        type: "line",
        yAxisIndex: 0,
        data: res.data.watch.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25")
      },
      {
        name: "在线数",
        type: "line",
        yAxisIndex: 0,
        data: res.data.rank.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25")
      },
      {
        name: "粉丝团",
        type: "line",
        yAxisIndex: 0,
        data: res.data.fans.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25")
      },
      {
        name: "点赞数",
        type: "line",
        yAxisIndex: 0,
        data: res.data.like.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25")
      },
      {
        name: "人气排名",
        yAxisIndex: 1,
        type: "scatter",
        data: res.data.popular.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25")
      }
    ]
  } finally {
    loading.value = false
  }
}

watch(period_id, () => get_data(), {deep: true})

get_data()
</script>

<style scoped lang="less">

</style>
