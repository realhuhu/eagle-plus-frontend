<template>
  <div>
    <div class="flex justify-start items-center flex-wrap cursor-pointer hover:bg-[var(--theme-dark-3)] duration-200"
         @click="to_detail">
      <div class="flex justify-start items-start gap-2 flex-nowrap">
        <a-image :src="proxy_url(live.cover)" class="w-[120px] md:w-[140px] flex-shrink-0"/>

        <div class="md:text-[16px] text-[15px]">
          <div class="break-all align-top">{{ live.title }}</div>
          <div class="text-gray-500 text-[12px] md:text-[14px]">
            <span>{{ time_string(live.timestamp_start) }}</span>
            <a-divider direction="vertical" :margin="6"/>
            <span v-if="live.timestamp_end">
              {{ time_delta(live.timestamp_start, live.timestamp_end).toFixed(2) }}小时
            </span>
            <span v-else class="text-red-500">直播中</span>
          </div>
        </div>
      </div>

      <div class="flex-grow flex justify-around md:justify-end items-center gap-6 w-full md:w-auto ">
        <div class="flex flex-col justify-start items-end gap-3">
          <div class="text-gray-500">弹幕数</div>
          <div>{{ live.message_num === null ? "--": live.message_num }}</div>
        </div>

        <div class="flex flex-col justify-start items-end gap-3">
          <div class="text-gray-500">礼物价值</div>
          <div>{{ live.gift1_price === null ? "--" : live.gift1_price / 1000 }}</div>
        </div>

        <div class="flex flex-col justify-start items-end gap-3">
          <div class="text-gray-500">留言价值</div>
          <div>{{ live.chat_price === null ? "--" : live.chat_price }}</div>
        </div>

        <div class="flex flex-col justify-start items-end gap-3">
          <div class="text-gray-500">上舰价值</div>
          <div>{{ live.guard_price === null ? "--" : live.guard_price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DateParser, proxy_url, time_delta} from "@/assets/lib/utils";

const props = defineProps<{ live: Live }>()

const router = useRouter()
const time_string = (timestamp: string) => new DateParser(timestamp).all()

const to_detail = () => {
  const query: {
    force: string
    start?: string
    end?: string
  } = {force: "true"}
  if (props.live.timestamp_start) {
    query.start = props.live.timestamp_start
  }
  if (props.live.timestamp_end) {
    query.end = props.live.timestamp_end
  }
  router.push({
    path: "/interaction",
    query
  })
}
</script>

<style lang="less">
.arco-list-item {
  padding: 8px 10px !important;
}
</style>
