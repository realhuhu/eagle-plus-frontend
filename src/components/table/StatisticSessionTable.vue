<template>
  <div class="flex flex-col justify-center items-center gap-6 w-full">
    <common-chart title="总览" :series="summary.series" :loading="loading" :x-axis="summary.x_axis" :y-axis="summary.y_axis"
      :tooltip="tooltip" />

    <common-chart title="人数" :series="user.series" :loading="loading" :x-axis="user.x_axis" :y-axis="user.y_axis"
      :tooltip="tooltip" />

    <common-chart title="留言" :series="chat.series" :loading="loading" :x-axis="chat.x_axis" :y-axis="chat.y_axis"
      :tooltip="tooltip" />

    <common-chart title="礼物" :series="gift.series" :loading="loading" :x-axis="gift.x_axis" :y-axis="gift.y_axis"
      :tooltip="tooltip" />

    <common-chart title="上舰" :series="guard.series" :loading="loading" :x-axis="guard.x_axis" :y-axis="guard.y_axis"
      :tooltip="tooltip" />

    <common-chart title="活跃" :series="activity.series" :loading="loading" :x-axis="activity.x_axis"
      :y-axis="activity.y_axis" :tooltip="tooltip" />

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { client } from "@/assets/lib/request";
import { assertNotEmpty, axis_formatter, proxy_url } from "@/assets/lib/utils";
import { Notification } from "@arco-design/web-vue";
import type { SeriesOption, XAXisComponentOption, YAXisComponentOption, TooltipComponentOption } from "echarts";

const loading = ref(false)
const data = ref<StaticSessionData>()

const tooltip = ref<TooltipComponentOption>({
  trigger: "axis",
  axisPointer: { animation: true },
  formatter: (p) => {
    const v = p as Tile<typeof p>
    const live_data = assertNotEmpty(data.value, "数据缺失")
    const index = v[0].data[0]
    const cover = `<img src='${proxy_url(live_data.cover[index])}'></img>`
    const title = `<div>${live_data.title[index].length > 9 ? live_data.title[index].slice(0, 9) + "..." : live_data.title[index]}</div>`
    const time = `<div style="font-size:12px;text-align: center;">${live_data.timestamp_start[index].replace("T", " ")}</div><div style="font-size:12px;text-align: center;">${live_data.timestamp_end[index].replace("T", " ")}</div>`
    const statistic = v.map(x => `<div style="display: flex;justify-content: space-between;gap: 4px;"><div>${x.marker}${x.seriesName}:</div><div style="font-weight: bolder;">${x.data[1] === null ? "-" : x.data[1]}</div></div>`).join("")
    return `<div style="width: 144px;">${title}${cover}${time}${statistic}</div>`
  }
})

const summary = ref<{
  x_axis: XAXisComponentOption
  y_axis: YAXisComponentOption[]
  series: SeriesOption[]
}>({
  x_axis: {
    type: "category",
    show: false
  },
  y_axis: [
    {
      type: "value",
      name: "数量"
    },
    {
      type: "value",
      name: "价值"
    }
  ],
  series: []
})

const user = ref<{
  x_axis: XAXisComponentOption
  y_axis: YAXisComponentOption[]
  series: SeriesOption[]
}>({
  x_axis: {
    type: "category",
    show: false
  },
  y_axis: [
    {
      type: "value",
      name: "数量"
    }
  ],
  series: []
})

const chat = ref<{
  x_axis: XAXisComponentOption
  y_axis: YAXisComponentOption[]
  series: SeriesOption[]
}>({
  x_axis: {
    type: "category",
    show: false
  },
  y_axis: [
    {
      type: "value",
      name: "数量"
    },
    {
      type: "value",
      name: "价值"
    }
  ],
  series: []
})

const gift = ref<{
  x_axis: XAXisComponentOption
  y_axis: YAXisComponentOption[]
  series: SeriesOption[]
}>({
  x_axis: {
    type: "category",
    show: false
  },
  y_axis: [
    {
      type: "value",
      name: "数量"
    },
    {
      type: "value",
      name: "瓜子数"
    }
  ],
  series: []
})

const guard = ref<{
  x_axis: XAXisComponentOption
  y_axis: YAXisComponentOption[]
  series: SeriesOption[]
}>({
  x_axis: {
    type: "category",
    show: false
  },
  y_axis: [
    {
      type: "value",
      name: "数量",
      axisLabel: { formatter: axis_formatter }
    },
    {
      type: "value",
      name: "价值",
      axisLabel: { formatter: axis_formatter }
    }
  ],
  series: []
})

const activity = ref<{
  x_axis: XAXisComponentOption
  y_axis: YAXisComponentOption[]
  series: SeriesOption[]
}>({
  x_axis: {
    type: "category",
    show: false
  },
  y_axis: [
    {
      type: "log",
      name: "平均数量",
      axisLabel: { formatter: axis_formatter }
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
    const res = await client.get<StaticSessionData>({
      url: "/statistic/session"
    })

    data.value = res.data

    summary.value.series = [
      {
        name: "弹幕",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.message_num.map((x, k) => [k, x])
      },
      {
        name: "进场",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.entry_num.map((x, k) => [k, x])
      },
      {
        name: "留言",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.chat_price.map((x, k) => [k, x])
      },
      {
        name: "礼物",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.gift1_price.map((x, k) => [k, x / 1000])
      },
      {
        name: "上舰",
        type: "bar",
        stack: "total",
        yAxisIndex: 1,
        data: res.data.guard_price.map((x, k) => [k, x])
      }
    ]

    user.value.series = [
      {
        name: "弹幕",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.message_user_num.map((x, k) => [k, x])
      },
      {
        name: "入场",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.entry_user_num.map((x, k) => [k, x])
      },
      {
        name: "免费礼物",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.gift0_user_num.map((x, k) => [k, x])
      },
      {
        name: "付费礼物",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.gift1_user_num.map((x, k) => [k, x])
      },
    ]

    chat.value.series = [
      {
        name: "数量",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.chat_num.map((x, k) => [k, x])
      },
      {
        name: "价值",
        type: "bar",
        yAxisIndex: 1,
        color: "rgba(247,244,148,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
        data: res.data.chat_price.map((x, k) => [k, x])
      }
    ]

    gift.value.series = [
      {
        name: "付费礼物",
        yAxisIndex: 0,
        type: "line",
        lineStyle: { width: 2 },
        data: res.data.gift1_num.map((x, k) => [k, x])
      },
      {
        name: "免费礼物",
        yAxisIndex: 0,
        type: "line",
        lineStyle: { width: 2 },
        data: res.data.gift0_num.map((x, k) => [k, x])
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
        data: res.data.gift1_price.map((x, k) => [k, x])
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
        data: res.data.gift0_price.map((x, k) => [k, x])
      }
    ]


    guard.value.series = [
      {
        name: "舰长",
        yAxisIndex: 0,
        type: "line",
        color: "#7ac8ed",
        lineStyle: { width: 2 },
        data: res.data.guard3_num.map((x, k) => [k, x])
      },
      {
        name: "提督",
        yAxisIndex: 0,
        type: "line",
        color: "#d664f6",
        lineStyle: { width: 2 },
        data: res.data.guard2_num.map((x, k) => [k, x])
      },
      {
        name: "总督",
        yAxisIndex: 0,
        type: "line",
        color: "#ab3131",
        lineStyle: { width: 2 },
        data: res.data.guard1_num.map((x, k) => [k, x])
      },
      {
        name: "价值",
        type: "bar",
        yAxisIndex: 1,
        color: "rgba(247,244,148,0.5)",
        itemStyle: {
          borderRadius: [10]
        },
        data: res.data.guard_price.map((x, k) => [k, x])
      }
    ]



    activity.value.series = [
      {
        name: "观看数",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.watch.map((x, k) => [k, x]).filter(x => x[1])
      },
      {
        name: "在线数",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.rank.map((x, k) => [k, x]).filter(x => x[1])
      },
      {
        name: "粉丝团",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.fans.map((x, k) => [k, x]).filter(x => x[1])
      },
      {
        name: "点赞数",
        type: "line",
        yAxisIndex: 0,
        lineStyle: { width: 2 },
        data: res.data.like.map((x, k) => [k, x]).filter(x => x[1])
      },
      {
        name: "人气排名",
        yAxisIndex: 1,
        type: "scatter",
        data: res.data.popular.map((x, k) => [k, x]).filter(x => x[1])
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

<style scoped lang="less"></style>
