<template>
  <div class="w-[968px] max-w-[90vw] mx-auto">
    <a-divider />
    <div class="flex flex-col justify-start items-center">

      <div class="md:flex justify-between items-center w-full">
        <a-tabs type="capsule" size="large" hide-content :active-key="route.meta.interaction_key || 'all'"
          @change="switch_data">
          <a-tab-pane key="all" title="全部" />
          <a-tab-pane key="message" title="弹幕" />
          <a-tab-pane key="guard" title="上舰" />
          <a-tab-pane key="gift" title="礼物" />
          <a-tab-pane key="entry" title="入场" />
          <a-tab-pane key="chat" title="留言" />
        </a-tabs>

        <div class="md:flex justify-end items-center pt-4">
          <div class="px-2">
            <a-form-item label="开始">
              <a-date-picker class="w-full" show-time format="YYYY-MM-DD HH:mm" v-model:model-value="params.start"
                :shortcuts="[{ label: '今日开始', value: () => new Date(today) }]" />
            </a-form-item>
          </div>

          <div class="px-2">
            <a-form-item label="结束">
              <a-date-picker class="w-full" show-time format="YYYY-MM-DD HH:mm" v-model:model-value="params.end"
                :shortcuts="[{ label: '今日结束', value: () => new Date(today + 24 * 60 * 60 * 1000 - 1) }]" />
            </a-form-item>
          </div>
        </div>
      </div>

      <div class="w-full bg-[var(--theme-dark-2)] m-2 rounded px-4 py-6">
        <router-view v-model:params="params" />
        <interaction-table :table="table" v-model:params="params" @refresh="refresh_data" @change_page="get_data"
          @change_size="refresh_data" @user_click="pop_modal" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onActivated } from "vue";
import { Notification } from "@arco-design/web-vue";
import { client } from "@/assets/lib/request";
import { assertNotEmpty, build_params, flat_query } from "@/assets/lib/utils";
import { useRoute, useRouter } from "vue-router";
import { showUserInteractionModal } from "@/components/modal/UserInteractionModal";

const route = useRoute()

const router = useRouter()

const today = new Date(new Date().toLocaleDateString()).getTime()

const params = ref<InteractionParams>({
  page: 1,
  size: 20,
  start: new Date(today),
  end: new Date(today + 24 * 60 * 60 * 1000 - 1),
  uid: "",
  search: "",
  guard: route.meta.interaction_key === "guard" ? [1, 2, 3] : [0, 1, 2, 3],
  ordering: "-timestamp",
  interaction: [0, 1, 2, 3, 4],
  admin_type: [0, 1, 2],
  medal: "",
  gift: "",
  gift_coin: [0, 1]
})

const table = ref<InteractionTable>({
  count: 0,
  loading: false,
  extra: { price: 0, total: 0 },
  interactions: []
})

const get_data = async () => {
  table.value.loading = true
  table.value.extra = { price: 0, total: 0 }
  try {
    const res = await client.get<PaginatedResponse<Interaction, InteractionResponseExtra>>({
      url: assertNotEmpty(route.meta.interaction_url, "url为空"),
      params: build_params(params.value, assertNotEmpty(route.meta.interaction_param_fields, "fields为空"))
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

const refresh_data = async () => {
  params.value.page = 1
  await get_data()
}


const switch_data = async (key: string | number) => {
  await router.replace(key.toString())
  params.value = {
    page: 1,
    size: 20,
    start: params.value.start,
    end: params.value.end,
    uid: "",
    search: "",
    guard: route.meta.interaction_key === "guard" ? [1, 2, 3] : [0, 1, 2, 3],
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
  showUserInteractionModal(user, params.value)
}

onActivated(() => {
  const query_start = flat_query(route.query.start)
  const query_end = flat_query(route.query.end)
  let reload = false
  if (query_start) {
    reload = true
    params.value.start = new Date(query_start)
  }
  if (query_end) {
    reload = true
    params.value.end = new Date(query_end)
  }

  if (reload || table.value.interactions.length === 0) {
    router.replace("/interaction")
    refresh_data()
  }
})
</script>

<style scoped lang="less"></style>
