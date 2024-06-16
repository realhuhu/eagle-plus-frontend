<template>
  <div class="flex flex-col">
    <div class="flex justify-end">
      <a-tabs type="capsule" size="large" hide-content v-model:active-key="active" @change="refresh_data">
        <a-tab-pane :key="0" title="近一日"/>
        <a-tab-pane :key="1" title="近一周"/>
        <a-tab-pane :key="2" title="近一月"/>
      </a-tabs>
    </div>

    <transition enter-active-class="animate__animated animate__fadeIn" appear>
      <div v-if="!loading" class="md:flex justify-between items-center pt-6">
        <user-top-card :items="result.message" class="md:w-[32%] md:m-0 m-2" title="最多弹幕" @select="select"/>
        <user-top-card :items="result.entry" class="md:w-[32%] md:m-0 m-2" title="最多入场" @select="select"/>
        <user-top-card :items="result.chat" class="md:w-[32%] md:m-0 m-2" title="最多留言" @select="select"/>
      </div>
      <div v-else class="flex justify-center items-center">
        <a-spin class="mt-2" tip="加载中..."/>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {Notification} from "@arco-design/web-vue";

import {ref} from "vue";
import {client} from "@/assets/lib/request";
import {useRouter} from "vue-router";

const router = useRouter()
const active = ref(0)
const loading = ref(true)
const result = ref<{
  chat: TopItem[],
  entry: TopItem[],
  message: TopItem[]
}>({
  chat: [],
  entry: [],
  message: []
})

const get_data = async () => {
  loading.value = true
  try {
    result.value = (await client.get<{ chat: TopItem[], entry: TopItem[], message: TopItem[] }>({
      url: "user/top",
      params: {span_id: active.value}
    })).data
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    loading.value = false
  }
}
const select = (item: TopItem) => {
  router.push(`/user/${item.user__uid}`)
}

const refresh_data = async () => {
  result.value = {
    chat: [],
    entry: [],
    message: []
  }
  await get_data()
}

get_data()
</script>

<style scoped lang="less">

</style>
