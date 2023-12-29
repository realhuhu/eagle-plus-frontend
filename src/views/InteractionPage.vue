<template>
  <div>
    <a-divider/>

    <div class="flex flex-col justify-start items-center">
      <div class="md:flex justify-between items-center w-full">
        <a-tabs type="capsule" size="large" hide-content v-model:active-key="active">
          <a-tab-pane key="1" title="全部"/>
          <a-tab-pane key="2" title="弹幕"/>
          <a-tab-pane key="3" title="上舰"/>
          <a-tab-pane key="4" title="礼物"/>
          <a-tab-pane key="5" title="入场"/>
          <a-tab-pane key="6" title="留言"/>
          <a-tab-pane key="7" title="抽奖"/>
        </a-tabs>

        <div class="md:flex justify-end items-center pt-4">
          <div class="px-2">
            <a-form-item label="开始">
              <a-date-picker
                  class="w-full"
                  show-time
                  format="YYYY-MM-DD HH:mm"
                  v-model:model-value="params.start"
              />
            </a-form-item>
          </div>

          <div class="px-2">
            <a-form-item label="结束">
              <a-date-picker
                  class="w-full"
                  show-time
                  format="YYYY-MM-DD HH:mm"
                  v-model:model-value="params.end"
              />
            </a-form-item>
          </div>
        </div>
      </div>

      <div class="w-full bg-[var(--theme-dark-2)] m-2 rounded p-4">
        <interaction-all-filter v-if="active==='1'" v-model:params="params"/>
        <interaction-message-filter v-else-if="active==='2'" v-model:params="params"/>
        {{ params }}
        <interaction-table :table="table" :params="params" @change_page="get_data" @change_size="refresh_data"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {client} from "@/assets/lib/request";
import {build_params} from "@/assets/lib/utils";
import InteractionMessageFilter from "@/components/filter/InteractionMessageFilter.vue";

const today = new Date(new Date().toLocaleDateString()).getTime()
const active = ref<"1" | "2">("1")

const params = ref<InteractionParams>({
  page: 1,
  size: 20,
  start: new Date(today),
  end: new Date(today + 24 * 60 * 60 * 1000 - 1),
  uid: null,
  search: "",
  guard: [0, 1, 2, 3],
  ordering: "-timestamp",
  interaction: [0, 1, 2, 3, 4],
  admin_type: [0, 1, 2],
  medal: ""
})

const table = ref<InteractionTable>({
  count: 0,
  loading: false,
  interactions: []
})

const get_data = async () => {
  table.value.loading = true
  try {
    const res = await client.get<PaginatedResponse<Interaction>>({
      url: {
        "1": "interaction/all",
        "2": "interaction/message",
      }[active.value],
      params: build_params(
          params.value,
          {
            "1": ["page", "size", "start", "end", "uid", "search", "guard", "ordering", "interaction"],
            "2": ["page", "size", "start", "end", "uid", "search", "guard", "ordering", "admin_type", "medal"],
          }[active.value]
      )
    })
    table.value.count = res.data.count
    table.value.interactions = res.data.results
  } finally {
    table.value.loading = false
  }
}

const refresh_data = async () => {
  params.value.page = 1
  await get_data()
}

get_data()

watch(params, () => get_data(), {deep: true})
watch(active, () => {
  params.value = {
    page: 1,
    size: 20,
    start: new Date(today),
    end: new Date(today + 24 * 60 * 60 * 1000 - 1),
    uid: null,
    search: "",
    guard: [0, 1, 2, 3],
    ordering: "-timestamp",
    interaction: [0, 1, 2, 3, 4],
    admin_type: [0, 1, 2],
    medal: ""
  }
  refresh_data()
})
</script>

<style scoped lang="less">

</style>
