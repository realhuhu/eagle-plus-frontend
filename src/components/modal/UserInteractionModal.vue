<template>
  <a-modal v-model:visible="visible" hide-title :footer="false" width="auto"
           :mask-style="{backdropFilter: 'blur(1px)'}">
    <div class="bg-[var(--theme-dark-2)] w-[720px] max-w-[96vw] max-h-[70vh] px-3 py-6 rounded-xl flex flex-col
     justify-start items-start">
      <div class="flex justify-between items-center gap-6 w-full px-3">
        <div class="flex justify-start items-center gap-2 ">
          <privilege-avatar :avatar="user.current_avatar"/>
          <div class="truncate">{{ user.current_name }}</div>
          <i-tdesign-jump class="inline cursor-pointer hover:text-[#4ebaee] duration-100"
                          @click="open_url(`https://space.bilibili.com/${user.uid}/`)"/>
        </div>

        <div class="flex justify-end items-center gap-2 flex-shrink-0">
          <a-button type="primary" status="normal" size="mini" @click="to_detail">
            更多信息
          </a-button>
        </div>
      </div>

      <a-divider orientation="left">
        <div class="flex gap-3">
          <a-button status="success" shape="circle" size="mini" @click="refresh_data">
            <icon-refresh/>
          </a-button>

          <a-tag color="blue">
            <template #icon>
              <icon-message/>
            </template>
            {{ table.extra.total }}条
          </a-tag>

          <a-tag color="gold">
            <template #icon>
              <icon-gift/>
            </template>
            {{ (Math.round(table.extra.price * 100) / 100).toFixed(2) }}元
          </a-tag>
        </div>
      </a-divider>

      <div class="my-2 px-4 pb-4 w-full flex-1 overflow-scroll">
        <div v-if="table.loading" class="flex justify-center items-center">
          <a-spin tip="加载中..."/>
        </div>
        <div v-else class="overflow-clip">
          <div v-for="(interaction,k) in table.interactions" :key="k">
            <message-record v-if="interaction.message" :interaction="interaction" :message="interaction.message"/>
            <guard-record v-if="interaction.guard" :interaction="interaction" :guard="interaction.guard"/>
            <gift-record v-else-if="interaction.gift" :interaction="interaction" :gift="interaction.gift"/>
            <entry-record v-else-if="interaction.entry" :interaction="interaction" :entry="interaction.entry"/>
            <chat-record v-else-if="interaction.chat" :interaction="interaction" :chat="interaction.chat"/>
          </div>
        </div>
      </div>

      <div class="w-full">
        <a-pagination
            class="justify-end"
            v-if="table.count"
            :simple="store.is_mobile"
            :total="table.count"
            v-model:current="params.page"
            v-model:page-size="params.size"
            @change="change"
            show-jumper
        />
        <div v-else-if="!table.loading" class="flex justify-center items-center h-[57px]">
          没有查询到结果
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {Notification} from "@arco-design/web-vue";

import {client} from "@/assets/lib/request";
import {UseStore} from "@/store";
import {build_params, open_url} from "@/assets/lib/utils";

const store = UseStore()
const router = useRouter()
const visible = ref(true)
const props = defineProps<{ user: User, params: InteractionParams, unmount: () => void }>()


const table = ref<InteractionTable>({
  count: 0,
  loading: false,
  extra: {price: 0, total: 0},
  interactions: [],
  award: []
})

const params = ref({
  page: 1,
  size: 20,
  start: props.params.start,
  end: props.params.end,
  uid: props.user.uid
})

const get_data = async () => {
  table.value.loading = true
  table.value.extra = {price: 0, total: 0}
  try {
    const res = await client.get<PaginatedResponse<Interaction, InteractionResponseExtra>>({
      url: "interaction/all",
      params: build_params(params.value, ["page", "size", "start", "end", "uid"])
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
  params.value = {
    page: 1,
    size: 20,
    start: props.params.start,
    end: props.params.end,
    uid: props.user.uid
  }
  await get_data()
}

const change = async (current: number) => {
  params.value.page = current
  await get_data()
}

const to_detail = () => {
  router.push(`/user/${props.user.uid}`)
  visible.value = false
  props.unmount()
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
