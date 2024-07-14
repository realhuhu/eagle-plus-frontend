<template>
  <div class="w-[968px] max-w-[90vw] mx-auto">
    <a-divider/>
    <div class="flex flex-col justify-start items-center">

      <div class="md:flex justify-between items-center w-full">
        <a-tabs type="capsule" size="large" hide-content v-model:active-key="active" @change="switch_data">
          <a-tab-pane key="all" title="全部" :disabled="table.loading"/>
          <a-tab-pane key="message" title="弹幕" :disabled="table.loading"/>
          <a-tab-pane key="guard" title="上舰" :disabled="table.loading"/>
          <a-tab-pane key="gift" title="礼物" :disabled="table.loading"/>
          <a-tab-pane key="entry" title="入场" :disabled="table.loading"/>
          <a-tab-pane key="chat" title="留言" :disabled="table.loading"/>
          <a-tab-pane key="award" title="抽奖" :disabled="table.loading"/>
        </a-tabs>

        <div class="md:flex justify-end items-center pt-4">
          <div class="px-2">
            <a-form-item label="开始">
              <a-date-picker class="w-full" show-time format="YYYY-MM-DD HH:mm"
                             v-model:model-value="interaction_params.start"
                             :shortcuts="[{ label: '今日开始', value: () => new Date(today) }]"/>
            </a-form-item>
          </div>

          <div class="px-2">
            <a-form-item label="结束">
              <a-date-picker class="w-full" show-time format="YYYY-MM-DD HH:mm"
                             v-model:model-value="interaction_params.end"
                             :shortcuts="[{ label: '今日结束', value: () => new Date(today + 24 * 60 * 60 * 1000 - 1) }]"/>
            </a-form-item>
          </div>
        </div>
      </div>

      <div class="w-full bg-[var(--theme-dark-2)] m-2 rounded px-4 py-6">
        <router-view/>
        <interaction-table
            :table="table" v-model:params="interaction_params" @refresh="refresh_data" @download="download"
            @change_page="get_data" @change_size="refresh_data" @user_click="pop_modal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {Notification} from "@arco-design/web-vue";

import {client} from "@/assets/lib/request";
import {UseStore} from "@/store";
import {showUserInteractionModal} from "@/components/modal/UserInteractionModal";
import {assertNotEmpty, build_params, flat_query, field_formatter, to_excel} from "@/assets/lib/utils";

const route = useRoute()
const router = useRouter()
const active = ref(route.meta.interaction_key || "all")
const {interaction_params, today} = storeToRefs(UseStore())

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
    if (active.value !== "award") {
      const res = await client.get<PaginatedResponse<Interaction, InteractionResponseExtra>>({
        url: assertNotEmpty(route.meta.interaction_url, "url为空"),
        params: build_params(interaction_params.value, assertNotEmpty(route.meta.interaction_param_fields, "fields为空"))
      })
      table.value.count = res.data.count
      table.value.extra = res.data.extra
      table.value.interactions = res.data.results
      table.value.award = []
    } else {
      const res = await client.get<PaginatedResponse<Award, InteractionResponseExtra>>({
        url: "/interaction/award/",
        params: build_params(interaction_params.value, assertNotEmpty(route.meta.interaction_param_fields, "fields为空"))
      })
      table.value.count = res.data.count
      table.value.extra = res.data.extra
      table.value.interactions = []
      table.value.award = res.data.results
    }
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    table.value.loading = false
  }
}

const refresh_data = async () => {
  interaction_params.value.page = 1
  await get_data()
}

const switch_data = async () => {
  await router.replace(`/interaction/${active.value}`)

  interaction_params.value = {
    page: 1,
    size: 20,
    start: interaction_params.value.start,
    end: interaction_params.value.end,
    uid: "",
    search: "",
    guard: active.value === "guard" ? [1, 2, 3] : [0, 1, 2, 3],
    ordering: "-timestamp",
    interaction: [0, 1, 2, 3, 4],
    admin_type: [0, 1, 2],
    medal: "",
    gift: "",
    gift_coin: [0, 1]
  }
  await refresh_data()
}

const pop_modal = (user: User) => {
  showUserInteractionModal(user, interaction_params.value)
}

const download = () => {
  type Base = { guard_type: string, timestamp: string } & User
  const data: {
    message: (Base & Message & { admin_type_text: string })[]
    guard: (Base & Guard & { price: number })[]
    gift: (Base & Gift & { gift_coin_text: string })[]
    entry: (Base & Entry)[]
    chat: (Base & Chat)[]
    award: { timestamp: string, title: string, user: string }[]
  } = {
    message: [],
    guard: [],
    gift: [],
    entry: [],
    chat: [],
    award: []
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

  data.award = table.value.award.map(x => ({
    timestamp: x.timestamp,
    title: x.title,
    user: JSON.stringify(x.users.map(x => ({
      "UID": x.uid,
      "用户名": x.current_name
    })))
  }))

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
    }),
    "抽奖": field_formatter(data.award, {
      timestamp: "时间",
      title: "标题",
      user: "中奖用户"
    })
  }, "互动数据")
}

onActivated(() => {
  if (active.value !== route.meta.interaction_key) router.replace(`/interaction/${active.value}`)

  if (active.value === "guard") {
    interaction_params.value.guard = [1, 2, 3]
  }

  let reload = false

  if (route.query.start || route.query.end) {
    const query_start = new Date(flat_query(route.query.start) || today.value)
    const query_end = new Date(flat_query(route.query.end) || today.value + 24 * 60 * 60 * 1000 - 1)

    if (query_start !== interaction_params.value.start) {
      reload = true
      interaction_params.value.start = query_start
    }
    if (query_end !== interaction_params.value.end) {
      reload = true
      interaction_params.value.end = query_end
    }
  }

  if (reload || table.value.interactions.length === 0 && table.value.award.length === 0) {
    if (route.query.force) {
      active.value = "all"
      router.replace("/interaction/all")
    }
    refresh_data()
  }
})
</script>

<style scoped lang="less"></style>
