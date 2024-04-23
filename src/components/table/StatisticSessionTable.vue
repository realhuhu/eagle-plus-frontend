<template>
  <div class="w-full flex flex-col justify-start items-end">
    <div class="mb-3 flex justify-end items-center gap-6">
      <a-checkbox v-model="average.user">平均每人</a-checkbox>
      <a-checkbox v-model="average.hour">平均每小时</a-checkbox>
    </div>

    <div class="flex flex-col justify-center items-center gap-6 w-full">
      <common-chart title="总览" :series="summary.series" :loading="loading" :x-axis="summary.x_axis"
        :y-axis="summary.y_axis" :tooltip="tooltip" @click="pop" />

      <common-chart title="人数" :series="user.series" :loading="loading" :x-axis="user.x_axis" :y-axis="user.y_axis"
        :tooltip="tooltip" @click="pop" />

      <common-chart title="留言" :series="chat.series" :loading="loading" :x-axis="chat.x_axis" :y-axis="chat.y_axis"
        :tooltip="tooltip" @click="pop" />

      <common-chart title="礼物" :series="gift.series" :loading="loading" :x-axis="gift.x_axis" :y-axis="gift.y_axis"
        :tooltip="tooltip" @click="pop" />

      <common-chart title="上舰" :series="guard.series" :loading="loading" :x-axis="guard.x_axis" :y-axis="guard.y_axis"
        :tooltip="tooltip" @click="pop" />

      <common-chart title="活跃" :series="activity.series" :loading="loading" :x-axis="activity.x_axis"
        :y-axis="activity.y_axis" :tooltip="tooltip" @click="pop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { client } from "@/assets/lib/request";
import { assertNotEmpty, axis_formatter, proxy_url, time_delta } from "@/assets/lib/utils";
import { Notification } from "@arco-design/web-vue";
import type { SeriesOption, XAXisComponentOption, YAXisComponentOption, TooltipComponentOption, ElementEvent } from "echarts";
import { showStatisticLiveModal } from "../modal/StatisticLiveModal";
import { UseStore } from "@/store";

const loading = ref(false)
const current = ref<{
  id: number
  title: string
}>({
  id: 0,
  title: ""
})
const average = ref({
  hour: false,
  user: false
})
const data = ref<StaticSessionData>()
const store = UseStore()

const tooltip = ref<TooltipComponentOption>({
  trigger: "axis",
  axisPointer: { animation: true },
  formatter: (p) => {
    const v = p as Tile<typeof p>
    const live_data = assertNotEmpty(data.value, "数据缺失")
    const index = v[0].data[0]
    current.value.id = live_data.id[index]
    current.value.title = live_data.title[index]
    const cover = `<img src='${proxy_url(live_data.cover[index])}'></img>`
    const title = `<div>${live_data.title[index].length > 9 ? live_data.title[index].slice(0, 9) + "..." : live_data.title[index]}</div>`
    const time = `<div style="font-size:12px;text-align: center;">${live_data.timestamp_start[index].replace("T", " ")}</div><div style="font-size:12px;text-align: center;">${live_data.timestamp_end[index].replace("T", " ")}</div>`
    const statistic = v.map(x => `<div style="display: flex;justify-content: space-between;gap: 4px;"><div>${x.marker}${x.seriesName}:</div><div style="font-weight: bolder;">${x.data[1] === null ? "-" : x.data[1].toFixed(2)}</div></div>`).join("")
    const tips = store.is_mobile ? "" : "<div style='font-size:12px;color:#888;float:right'>点击查看直播详细数据</div>"
    return `<div style="width: 144px;">${title}${cover}${time}${statistic}${tips}</div>`
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
      name: "人数"
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

const compute_data = () => {
  const live_data = assertNotEmpty(data.value, "数据缺失")

  const factors: number[] = []

  for (const i in live_data.title) {
    factors.push(average.value.hour ? time_delta(live_data.timestamp_start[i], live_data.timestamp_end[i]) : 1)
  }

  summary.value.series = [
    {
      name: "弹幕",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.message_num.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.message_user_num[k] : 1)])
    },
    {
      name: "进场",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.entry_num.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.entry_user_num[k] : 1)])
    },
    {
      name: "留言",
      type: "bar",
      stack: "total",
      yAxisIndex: 1,
      data: live_data.chat_price.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.chat_user_num[k] : 1)])
    },
    {
      name: "礼物",
      type: "bar",
      stack: "total",
      yAxisIndex: 1,
      data: live_data.gift1_price.map((x, k) => [k, x / 1000 / factors[k] / (average.value.user ? live_data.gift1_user_num[k] : 1)])
    },
    {
      name: "上舰",
      type: "bar",
      stack: "total",
      yAxisIndex: 1,
      data: live_data.guard_price.map((x, k) => [k, x / factors[k]])
    }
  ]

  user.value.series = [
    {
      name: "弹幕",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.message_user_num.map((x, k) => [k, x / factors[k]])
    },
    {
      name: "入场",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.entry_user_num.map((x, k) => [k, x / factors[k]])
    },
    {
      name: "免费礼物",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.gift0_user_num.map((x, k) => [k, x / factors[k]])
    },
    {
      name: "付费礼物",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.gift1_user_num.map((x, k) => [k, x / factors[k]])
    }
  ]

  chat.value.series = [
    {
      name: "数量",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.chat_num.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.chat_user_num[k] : 1)])
    },
    {
      name: "价值",
      type: "bar",
      yAxisIndex: 1,
      color: "rgba(247,244,148,0.5)",
      itemStyle: {
        borderRadius: [10]
      },
      data: live_data.chat_price.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.chat_user_num[k] : 1)])
    }
  ]

  gift.value.series = [
    {
      name: "付费礼物",
      yAxisIndex: 0,
      type: "line",
      lineStyle: { width: 2 },
      data: live_data.gift1_num.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.gift1_user_num[k] : 1)])
    },
    {
      name: "免费礼物",
      yAxisIndex: 0,
      type: "line",
      lineStyle: { width: 2 },
      data: live_data.gift0_num.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.gift0_user_num[k] : 1)])
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
      data: live_data.gift1_price.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.gift1_user_num[k] : 1)])
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
      data: live_data.gift0_price.map((x, k) => [k, x / factors[k] / (average.value.user ? live_data.gift0_user_num[k] : 1)])
    }
  ]


  guard.value.series = [
    {
      name: "舰长",
      yAxisIndex: 0,
      type: "line",
      color: "#7ac8ed",
      lineStyle: { width: 2 },
      data: live_data.guard3_num.map((x, k) => [k, x / factors[k]])
    },
    {
      name: "提督",
      yAxisIndex: 0,
      type: "line",
      color: "#d664f6",
      lineStyle: { width: 2 },
      data: live_data.guard2_num.map((x, k) => [k, x / factors[k]])
    },
    {
      name: "总督",
      yAxisIndex: 0,
      type: "line",
      color: "#ab3131",
      lineStyle: { width: 2 },
      data: live_data.guard1_num.map((x, k) => [k, x / factors[k]])
    },
    {
      name: "价值",
      type: "bar",
      yAxisIndex: 1,
      color: "rgba(247,244,148,0.5)",
      itemStyle: {
        borderRadius: [10]
      },
      data: live_data.guard_price.map((x, k) => [k, x / factors[k]])
    }
  ]



  activity.value.series = [
    {
      name: "观看数",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.watch.map((x, k) => [k, x]).filter(x => x[1])
    },
    {
      name: "在线数",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.rank.map((x, k) => [k, x]).filter(x => x[1])
    },
    {
      name: "粉丝团",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.fans.map((x, k) => [k, x]).filter(x => x[1])
    },
    {
      name: "点赞数",
      type: "line",
      yAxisIndex: 0,
      lineStyle: { width: 2 },
      data: live_data.like.map((x, k) => [k, x]).filter(x => x[1])
    },
    {
      name: "人气排名",
      yAxisIndex: 1,
      type: "scatter",
      data: live_data.popular.map((x, k) => [k, x]).filter(x => x[1])
    }
  ]
}

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<StaticSessionData>({
      url: "/statistic/session"
    })
    data.value = res.data
    compute_data()
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    loading.value = false
  }
}


const pop = (params: ElementEvent) => {
  if (!params.topTarget) return
  if (Object.getPrototypeOf(params.topTarget).type === "rect") return
  if (Object.getPrototypeOf(params.topTarget).type === "tspan") return
  if (store.is_mobile) return
  if (current.value.id) showStatisticLiveModal(current.value.id, current.value.title)
}

watch(average, () => {
  compute_data()
}, { deep: true })

get_data()
</script>

<style scoped lang="less"></style>
