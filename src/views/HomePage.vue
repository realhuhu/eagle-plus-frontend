<template>
  <div class="w-[968px] max-w-[96vw] mx-auto flex flex-col justify-start items-center">
    <div>新版测试中，旧版本：<a class="text-[#4ebaee] cursor-pointer" @click="old">iying.love</a></div>
    <div>5月28日后数据不全，请以旧版本为准</div>
    <div class="text-[24px] sm:text-[48px] md:text-[64px] text-[#4ebaee] drop-shadow-2xl">
      IYING.LOVE
    </div>

    <div class="w-full md:my-6 my-2">
      <common-chart title="" class="!h-[200px]" :series="series" :loading="loading" :y-hide="true" :zoom-hide="true" />
      <heat-map v-if="!store.is_mobile" :series="map" :loading="loading" />
    </div>


    <a-list class="w-full bg-[var(--color-bg-2)]" size="small" :loading="loading">
      <template #header>
        <div class="flex justify-between items-center">
          <div>全部直播</div>
          <a-button type="outline" status="success" size="small" @click="router.push('statistic')">详细数据</a-button>
        </div>
      </template>
      <a-list-item v-for="(live, k) in lives" :key="k">
        <transition enter-active-class="animate__animated animate__fadeIn" appear>
          <live-info-card :live="live" />
        </transition>
      </a-list-item>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { SeriesOption } from "echarts";
import { client } from "@/assets/lib/request";
import { time_delta } from "@/assets/lib/utils";
import { UseStore } from "@/store";
import { useRouter } from "vue-router";

const old = () => {
  window.open("https://iying.love")
}

const store = UseStore()
const router = useRouter()
const loading = ref(false)
const lives = ref<Live[]>([]);
const map = ref<SeriesOption>({})
const series = ref<SeriesOption[]>([])

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<Live[]>({ url: "/statistic/live" })
    lives.value = res.data

    const pairs = res.data.filter(
      x => x.timestamp_start > new Date().getFullYear().toString()
    ).map(
      x => [x.timestamp_start.slice(0, 10), Number(time_delta(x.timestamp_start, x.timestamp_end).toFixed(2))]
    ) as [string, number][]
    map.value = {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: pairs.reduce((acc: [string, number][], cur) => {
        const [time, value] = cur
        const index = acc.findIndex(x => x[0] === time)
        if (index === -1) {
          acc.push(cur)
        } else {
          acc[index][1] += value
        }
        return acc
      }, [])
    }

    series.value = [
      {
        type: "line",
        name: "弹幕",
        yAxisIndex: 1,
        showSymbol: false,
        smooth: false,
        lineStyle: { width: 1 },
        data: res.data.map((x, index) => [x.timestamp_start, res.data[index].message_num])
      },
      {
        type: "line",
        name: "在线",
        yAxisIndex: 2,
        showSymbol: false,
        smooth: false,
        lineStyle: { width: 1 },
        data: res.data.map((x, index) => [x.timestamp_start, res.data[index].rank])
      },
      {
        type: "bar",
        name: "上舰",
        stack: "price",
        yAxisIndex: 0,
        barWidth: 2,
        data: res.data.map((x, index) => [x.timestamp_start, res.data[index].guard_price])
      },
      {
        type: "bar",
        name: "留言",
        stack: "price",
        yAxisIndex: 0,
        barWidth: 2,
        data: res.data.map((x, index) => [x.timestamp_start, res.data[index].chat_price])
      },
      {
        type: "bar",
        name: "礼物",
        stack: "price",
        yAxisIndex: 0,
        barWidth: 2,
        data: res.data.map((x, index) => [x.timestamp_start, Number((res.data[index].gift1_price / 1000).toFixed(2))])
      }
    ]
  } finally {
    loading.value = false
  }
}

get_data()
</script>

<style scoped lang="less"></style>
