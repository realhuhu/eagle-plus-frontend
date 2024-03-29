<template>
  <div class="bg-[var(--theme-dark-2)] rounded-xl p-6 w-full">
    <user-interaction-filter v-model:params="params" :orderings="orderings"/>
    <div v-if="table.loading" class="flex justify-center items-center">
      <a-spin tip="加载中..."/>
    </div>
    <interaction-table v-else :table="table" v-model:params="params" @refresh="refresh_data" @change_page="get_data"
                       @change_size="refresh_data"/>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {client} from "@/assets/lib/request";
import {build_params} from "@/assets/lib/utils";

const today = new Date(new Date().toLocaleDateString()).getTime()

const props = defineProps<{ uid: number }>()
const params = ref<InteractionParams>({
  page: 1,
  size: 20,
  start: new Date(today),
  end: new Date(today + 24 * 60 * 60 * 1000 - 1),
  uid: 0,
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
  interactions: []
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
  } finally {
    table.value.loading = false
  }
}

const refresh_data = async () => {
  params.value.page = 1
  await get_data()
}

watch(params, () => get_data(), {deep: true})

get_data()
</script>

<style scoped lang="less">

</style>
