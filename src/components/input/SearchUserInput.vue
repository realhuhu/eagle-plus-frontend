<template>
  <a-select v-model:model-value="search" v-model:popup-visible="visible" v-model:options="options"
            :filter-option="false" allow-clear allow-search show-footer-on-empty placeholder="输入UID或用户名"
            @clear="clear" @change="update" @search="handle_search" @dropdown-reach-bottom="handle_append">
    <template #footer>
      <div class="flex justify-between text-center text-[#5aaafb] p-2">
        <div v-if="params.value">
          <transition enter-active-class="animate__animated animate__fadeIn" appear>
            <span v-if="params.loading"><a-spin :size="14" class="mr-1"/>加载中</span>
            <div v-else-if="!params.next">没有更多了</div>
            <div v-else>下滑加载更多</div>
          </transition>
        </div>

        <div v-if="params.count">
          共{{ params.count }}人
        </div>
      </div>
    </template>
  </a-select>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {client} from "@/assets/lib/request";

const uid = defineModel<number>("uid", {required: true})
const search = defineModel<string>("search")
const visible = ref(false)
const options = ref<string[]>([])
const users = ref<SimpleUser[]>([])

const params = ref<{
  loading: boolean
  count: number
  next: string | null
  value: string
}>({
  loading: false,
  count: 0,
  next: null,
  value: ""
})

const handle_search = async (value: string) => {
  if (!value) return

  params.value.loading = true
  params.value.value = value
  try {
    const res = await client.get<PaginatedResponse<SimpleUser>>({
      url: "user",
      params: {
        search: params.value.value
      }
    })
    options.value = res.data.results.map(x => x.current_name)
    users.value = res.data.results
    params.value.count = res.data.count
    params.value.next = res.data.next
  } finally {
    params.value.loading = false
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any*/
const update = (value: any) => {
  for (const user of users.value) {
    if (value === user.current_name) {
      uid.value = user.uid
      search.value = user.current_name
    }
  }
}

const handle_append = async () => {
  if (!params.value.next) return

  params.value.loading = true
  try {
    const res = await client.get<PaginatedResponse<SimpleUser>>({
      url: params.value.next,
      params: {
        search: params.value.value
      }
    })
    options.value = [...options.value, ...res.data.results.map(x => x.current_name)]
    users.value = [...users.value, ...res.data.results]
    params.value.next = res.data.next
  } finally {
    params.value.loading = false
  }
}

const clear = () => {
  uid.value = 0
  search.value = ""
  users.value = []
  options.value = []
  visible.value = false
}
</script>

<style lang="less">
.arco-select-option {
  display: inline-block !important;
}
</style>
