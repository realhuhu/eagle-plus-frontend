<template>
  <a-select v-model:model-value="search" v-model:popup-visible="visible" v-model:options="options" :loading="loading"
            allow-clear
            allow-search :filter-option="false" @change="update" @search="handle_search" placeholder="输入UID或用户名"
            @clear="clear">
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
const loading = ref(false)

const handle_search = async (value: string) => {
  if (!value) {
    return
  }

  loading.value = true
  try {
    const res = await client.get<PaginatedResponse<SimpleUser>>({
      url: "user",
      params: {
        search: value
      }
    })
    options.value = res.data.results.map(x => x.current_name)
    users.value = res.data.results
  } finally {
    loading.value = false
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
