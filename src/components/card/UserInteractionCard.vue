<template>
  <div class="bg-[var(--theme-dark-2)] rounded-xl p-6 w-full">
    <user-interaction-filter v-model:params="params" :orderings="orderings"/>
    <div v-if="table.loading" class="flex justify-center items-center">
      <a-spin tip="加载中..."/>
    </div>
    <interaction-table v-else :table="table" v-model:params="params" @refresh="refresh_data" @change_page="get_data"
                       @change_size="refresh_data" @download="download"/>
  </div>
</template>

<script setup lang="ts">
import {Notification} from "@arco-design/web-vue";

import {client} from "@/assets/lib/request";
import {build_params, field_formatter, to_excel} from "@/assets/lib/utils";

const today = new Date(new Date().toLocaleDateString()).getTime()

const props = defineProps<{ uid: number }>()
const params = ref<InteractionParams>({
  page: 1,
  size: 20,
  start: new Date(today),
  end: new Date(today + 24 * 60 * 60 * 1000 - 1),
  uid: "",
  search: "",
  guard: [0, 1, 2, 3],
  ordering: "-timestamp",
  interaction: [0, 1, 2, 3, 4],
  admin_type: [0, 1, 2],
  medal: "",
  gift: "",
  gift_coin: [0, 1]
})
const orderings = ref<{ field: string, text: string }[]>([
  {field: "-timestamp", text: "最新"},
  {field: "timestamp", text: "最早"},
  {field: "-price", text: "价格降序"},
  {field: "price", text: "价格升序"}
])
const table = ref<InteractionTable>({
  count: 0,
  loading: false,
  extra: {price: 0, total: 0},
  interactions: [],
  award: []
})

const get_data = async () => {
  table.value.loading = true
  table.value.extra = {price: 0, total: 0}
  try {
    const res = await client.get<PaginatedResponse<Interaction, InteractionResponseExtra>>({
      url: `user/${props.uid}/interaction`,
      params: build_params(
          params.value, ["page", "size", "start", "end", "ordering", "search", "interaction"]
      )
    })
    table.value.count = res.data.count
    table.value.extra = res.data.extra
    table.value.interactions = res.data.results
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    table.value.loading = false
  }
}

const download = () => {
  type Base = { guard_type: string, timestamp: string } & User
  const data: {
    message: (Base & Message & { admin_type_text: string })[]
    guard: (Base & Guard & { price: number })[]
    gift: (Base & Gift & { gift_coin_text: string })[]
    entry: (Base & Entry)[]
    chat: (Base & Chat)[]
  } = {
    message: [],
    guard: [],
    gift: [],
    entry: [],
    chat: []
  }

  for (const interaction of table.value.interactions) {
    const base = {
      guard_type: ["未上舰", "总督", "提督", "舰长"][interaction.guard_type],
      timestamp: interaction.timestamp,
      ...interaction.user
    }
    if (interaction.message) {
      data.message.push({
        ...base,
        ...interaction.message,
        admin_type_text: ["观众", "房管", "主播"][interaction.message.admin_type]
      })
    } else if (interaction.guard) {
      data.guard.push({
        ...base,
        ...interaction.guard,
        price: interaction.guard.guard_total_price / 1000
      })
    } else if (interaction.gift) {
      data.gift.push({
        ...base,
        ...interaction.gift,
        gift_coin_text: interaction.gift.gift_coin ? "金瓜子" : "银瓜子"
      })
    } else if (interaction.entry) {
      data.entry.push({
        ...base,
        ...interaction.entry
      })
    } else if (interaction.chat) {
      data.chat.push({
        ...base,
        ...interaction.chat
      })
    }
  }


  to_excel({
    "弹幕": field_formatter(data.message, {
      timestamp: "时间",
      uid: "UID",
      current_name: "用户名",
      guard_type: "舰长类型",
      text: "内容",
      admin_type_text: "用户类型"
    }),
    "上舰": field_formatter(data.guard, {
      timestamp: "时间",
      uid: "UID",
      current_name: "用户名",
      guard_type: "舰长类型",
      guard_num: "数量",
      price: "总价"
    }),
    "礼物": field_formatter(data.gift, {
      timestamp: "时间",
      uid: "UID",
      current_name: "用户名",
      guard_type: "舰长类型",
      gift_name: "礼物名",
      gift_coin_text: "礼物类型",
      gift_num: "礼物数量",
      gift_price: "礼物单价(瓜子数)",
      gift_total_price: "礼物总价(瓜子数)"
    }),
    "入场": field_formatter(data.entry, {
      timestamp: "时间",
      uid: "UID",
      current_name: "用户名",
      guard_type: "舰长类型"
    }),
    "留言": field_formatter(data.chat, {
      timestamp: "时间",
      uid: "UID",
      current_name: "用户名",
      guard_type: "舰长类型",
      chat_price: "留言价格",
      chat_message: "留言内容"
    })
  }, `用户${props.uid}互动数据`)
}


const refresh_data = async () => {
  params.value.page = 1
  await get_data()
}

get_data()
</script>

<style scoped lang="less">

</style>
