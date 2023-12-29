<template>
  <a-select :options="options" :loading="loading" placeholder="输入UID或用户名" allow-search :filter-option="false"
            allow-clear @change="update" @search="handle_search" @clear="uid = null">
  </a-select>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {client} from "@/assets/lib/request";

const uid = defineModel("uid")

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

const update = (value: any) => {
  for (const user of users.value) {
    if (value === user.current_name) {
      uid.value = user.uid
    }
  }
}
</script>

<style lang="less">
.arco-select-option {
  display: inline-block !important;
}
</style>
