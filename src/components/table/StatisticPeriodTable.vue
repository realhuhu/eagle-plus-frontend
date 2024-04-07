<template>
  <div>
    <statistic-period-filter v-model:params="params"/>

    <div class="flex flex-col justify-center items-center gap-6">
      <bar-chart title="打赏价值" :series="income" :loading="loading"/>

      <bar-chart title="上舰数量" :series="guard" :loading="loading" :y-axis="guard_y_axis"/>

      <bar-chart title="礼物数量" :series="gift" :loading="loading" :y-axis="gift_y_axis"/>

      <line-chart title="活跃" :series="activity" :loading="loading"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {client} from "@/assets/lib/request";
import type {LineSeriesOption, BarSeriesOption, YAXisComponentOption} from "echarts";

const params = ref<StatisticPeriodParams>({period_id: 2})
const loading = ref(false)

const income = ref<BarSeriesOption[]>([])

const guard = ref<BarSeriesOption[]>([])
const guard_y_axis = ref<YAXisComponentOption[]>([
  {
    type: "value",
    name: "舰长",
    axisLabel: {
      formatter: function (value: number) {
        if (value > 1e6) {
          return (value / 1e6).toFixed(1).toString() + "m"
        } else if (value > 1e3) {
          return (value / 1e3).toFixed(1).toString() + "k"
        }
        return value.toString()
      }
    }
  },
  {
    type: "value",
    name: "提/总督"
  }
])

const gift = ref<BarSeriesOption[]>([])
const gift_y_axis = ref<YAXisComponentOption[]>([
  {
    type: "value",
    name: "数量",
    axisLabel: {
      formatter: function (value: number) {
        if (value > 1e6) {
          return (value / 1e6).toFixed(1).toString() + "m"
        } else if (value > 1e3) {
          return (value / 1e3).toFixed(1).toString() + "k"
        }
        return value.toString()
      }
    }
  },
  {
    type: "value",
    name: "瓜子数",
    axisLabel: {
      formatter: function (value: number) {
        if (value > 1e6) {
          return (value / 1e6).toFixed(1).toString() + "m"
        } else if (value > 1e3) {
          return (value / 1e3).toFixed(1).toString() + "k"
        }
        return value.toString()
      }
    }
  }
])

const activity = ref<LineSeriesOption[]>([])


const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<StatisticPoint>({
      url: "/statistic/period",
      params: params.value
    })

    income.value = [
      {
        name: "留言",
        stack: "total",
        data: res.data.chat_price.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "礼物",
        stack: "total",
        data: res.data.gift1_price.map((value, index) => [res.data.period[index], (value || 0) / 1e3])
      },
      {
        name: "上舰",
        stack: "total",
        data: res.data.guard_price.map((value, index) => [res.data.period[index], value])
      }
    ]

    guard.value = [
      {
        name: "舰长",
        yAxisIndex: 0,
        data: res.data.guard3_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "总督",
        yAxisIndex: 1,
        stack: "sum",
        data: res.data.guard1_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "提督",
        yAxisIndex: 1,
        stack: "sum",
        data: res.data.guard2_num.map((value, index) => [res.data.period[index], value])
      }
    ]

    gift.value = [
      {
        name: "付费礼物数",
        stack: "num",
        yAxisIndex: 0,
        data: res.data.gift1_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "免费礼物数",
        stack: "num",
        yAxisIndex: 0,
        data: res.data.gift0_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "付费礼物瓜子数",
        stack: "price",
        yAxisIndex: 1,
        data: res.data.gift1_price.map((value, index) => [res.data.period[index], (value || 0) / 1e3])
      },
      {
        name: "免费礼物瓜子数",
        stack: "price",
        yAxisIndex: 1,
        data: res.data.gift0_price.map((value, index) => [res.data.period[index], (value || 0) / 1e3])
      }
    ]

    activity.value = [
      {
        name: "进场数",
        data: res.data.entry_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "留言数",
        data: res.data.chat_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "弹幕数",
        data: res.data.message_num.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "观看数",
        smooth: true,
        data: res.data.watch.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "在线数",
        smooth: true,
        data: res.data.rank.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "粉丝团",
        smooth: true,
        data: res.data.fans.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "点赞数",
        smooth: true,
        data: res.data.like.map((value, index) => [res.data.period[index], value])
      },
      {
        name: "人气排名",
        smooth: true,
        data: res.data.popular.map((value, index) => [res.data.period[index], value])
      }
    ]


  } finally {
    loading.value = false
  }
}

watch(params.value, () => get_data(), {deep: true})

get_data()
</script>

<style scoped lang="less">

</style>
