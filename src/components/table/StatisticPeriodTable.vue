<template>
  <div class="w-full flex flex-col justify-start items-end">
    <a-select class="mb-3 w-[468px] max-w-full" placeholder="请选择" v-model="period_id">
      <a-option :value="0">每日</a-option>
      <a-option :value="1">每周</a-option>
      <a-option :value="2">每月</a-option>
    </a-select>

    <div class="flex flex-col justify-center items-center gap-6 w-full">
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
import {Notification} from "@arco-design/web-vue";

const period_id = ref(1)
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
    name: "数量",
    axisLabel: {formatter: axis_formatter}
  },
  {
    type: "value",
    name: "价值",
    axisLabel: {formatter: axis_formatter}
  }
])

const activity = ref<SeriesOption[]>([])
const activity_y_axis = ref<YAXisComponentOption[]>([
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
])

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<StatisticPeriodPoint>({
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
        color: "rgba(247,244,148,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
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
        name: "金瓜子",
        stack: "price",
        yAxisIndex: 1,
        type: "bar",
        color: "rgba(247,244,148,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
        data: res.data.gift1_price.map((value, index) => [res.data.period[index], (value || 0) / 1e3])
      },
      {
        name: "银瓜子",
        stack: "price",
        yAxisIndex: 1,
        type: "bar",
        color: "rgba(192,192,192,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
        data: res.data.gift0_price.map((value, index) => [res.data.period[index], (value || 0) / 1e3])
      }
    ]

    guard.value = [
      {
        name: "舰长",
        yAxisIndex: 0,
        type: "line",
        color: "#7ac8ed",
        data: res.data.guard3_num.map((value, index) => [res.data.period[index], value]).filter(x => x[1] > 0)
      },
      {
        name: "提督",
        yAxisIndex: 0,
        type: "line",
        color: "#d664f6",
        data: res.data.guard2_num.map((value, index) => [res.data.period[index], value]).filter(x => x[1] > 0)
      },
      {
        name: "总督",
        yAxisIndex: 0,
        type: "line",
        color: "#ab3131",
        data: res.data.guard1_num.map((value, index) => [res.data.period[index], value]).filter(x => x[1] > 0)
      },
      {
        name: "价值",
        type: "bar",
        yAxisIndex: 1,
        color: "rgba(247,244,148,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
        data: res.data.guard_price.map((value, index) => [res.data.period[index], value])
      }
    ]

    activity.value = [
      {
        name: "观看数",
        type: "line",
        yAxisIndex: 0,
        data: res.data.watch.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      },
      {
        name: "在线数",
        type: "line",
        yAxisIndex: 0,
        data: res.data.rank.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      },
      {
        name: "粉丝团",
        type: "line",
        yAxisIndex: 0,
        data: res.data.fans.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      },
      {
        name: "点赞数",
        type: "line",
        yAxisIndex: 0,
        data: res.data.like.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      },
      {
        name: "人气排名",
        yAxisIndex: 1,
        type: "scatter",
        data: res.data.popular.map((value, index) => [res.data.period[index], value]).filter(x => x[0] > "2023-08-25" && x[1] > 0)
      }
    ]
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(period_id, () => get_data(), {deep: true})

get_data()
</script>

<style scoped lang="less">

</style>
