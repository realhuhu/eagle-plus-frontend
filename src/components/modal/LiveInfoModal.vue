<template>
  <a-modal v-model:visible="visible" hide-title :footer="false" width="auto"
           :mask-style="{backdropFilter: 'blur(1px)'}">
    <div class="bg-[var(--theme-dark-2)] w-[720px] max-w-[96vw] max-h-[70vh] px-3 py-6 rounded-xl flex overflow-scroll
     justify-center items-start">
      <a-descriptions class="w-full h-full p-2" v-if="table.live" :data="to_descriptions(table.live)"
                      :title="table.live.title"
                      bordered :size="store.is_mobile?'mini':'medium'" :column="{xs:1,md:2}"/>
      <a-spin v-else tip="加载中..."/>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {Notification, type DescData} from "@arco-design/web-vue";

import {client} from "@/assets/lib/request";
import {DateParser} from "@/assets/lib/utils";
import {UseStore} from "@/store";

const visible = ref(true)
const store = UseStore()
const props = defineProps<{ live_id: number, unmount: () => void }>()


const table = ref<{
  loading: boolean
  live: Live | null
}>({
  loading: false,
  live: null
})


const to_descriptions = (data: Live): DescData[] => {
  const identical = (x: string | number): string => x.toString()
  const date = (x: string | number) => new DateParser(x.toString()).hoursMinutes()
  const map: { [K in keyof Live]: [string, (x: string | number) => string, number] } = {
    id: ["id", identical, 1],
    title: ["标题", identical, 1],
    cover: ["封面", identical, 1],
    timestamp_start: ["开始时间", date, 1],
    timestamp_end: ["结束时间", date, 1],
    message_num: ["弹幕数", identical, 1],
    message_user_num: ["弹幕人数", identical, 1],
    entry_num: ["入场数", identical, 1],
    entry_user_num: ["入场人数", identical, 1],
    gift0_num: ["免费礼物数", identical, 1],
    gift0_user_num: ["免费礼物人数", identical, 1],
    gift1_num: ["付费礼物数", identical, 1],
    gift1_user_num: ["付费礼物人数", identical, 1],
    gift0_price: ["银瓜子", identical, 1],
    gift1_price: ["金瓜子", identical, 1],
    chat_num: ["留言数", identical, 1],
    chat_user_num: ["留言人数", identical, 1],
    chat_price: ["留言价值", identical, 1],
    guard3_num: ["上舰长数", identical, 1],
    guard2_num: ["上提督数", identical, 1],
    guard1_num: ["上总督数", identical, 1],
    guard_user_num: ["上舰人数", identical, 1],
    guard_price: ["上舰价值", identical, 1],
    watch: ["观看数", identical, 1],
    rank: ["在线数", identical, 1],
    fans: ["粉丝团", identical, 1],
    like: ["点赞团", identical, 1],
    popular: ["热度排名", identical, 1]
  }

  const res: DescData[] = []

  for (const key of Object.keys(map)) {
    const _key = key as keyof Live
    if (["id", "title", "cover"].includes(key)) continue
    const [label, func, span] = map[_key]
    res.push({label, value: func(data[_key]), span})
  }
  return res
}


const get_data = async () => {
  table.value.loading = true
  try {
    const res = await client.get<Live>({url: `statistic/live/${props.live_id}/info`})
    table.value.live = res.data
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    table.value.loading = false
  }
}

watch(visible, (new_val: boolean) => {
  if (!new_val) props.unmount()
})

get_data()
</script>

<style lang="less">
.arco-modal-body {
  padding: 0;
}
</style>
