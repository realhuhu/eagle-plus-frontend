<template>
  <div>
    <search-user-input v-model:uid="uid" v-model:search="search"/>

    <a-divider/>

    <transition enter-active-class="animate__animated animate__fadeIn" appear>
      <div v-if="uid">
        <user-table :uid="uid"/>
      </div>

      <div v-else>
        <div class="flex flex-col">
          <div class="flex justify-end">
            <a-tabs type="capsule" size="large" hide-content v-model:active-key="active" @change="refresh_data">
              <a-tab-pane :key="0" title="近一日"/>
              <a-tab-pane :key="1" title="近一周"/>
              <a-tab-pane :key="2" title="近一月"/>
            </a-tabs>
          </div>

          <transition enter-active-class="animate__animated animate__fadeIn" appear>
            <div v-if="!loading" class="flex justify-between items-center pt-6">
              <top-table :items="result.message" class="md:w-[30%] w-[33%]" title="最多弹幕" @select="select"/>
              <top-table :items="result.entry" class="md:w-[30%] w-[33%]" title="最多入场" @select="select"/>
              <top-table :items="result.chat" class="md:w-[30%] w-[33%]" title="最多留言" @select="select"/>
            </div>
            <div v-else class="flex justify-center items-center">
              <a-spin tip="加载中..."/>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {client} from "@/assets/lib/request";
import UserTable from "@/components/table/UserTable.vue";
import {useRoute} from "vue-router";
import {flat_query} from "@/assets/lib/utils";

const query = flat_query(useRoute().query.uid)

const uid = ref(Number.parseInt(query || "0"))
const search = ref(query || "")
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
      url: "statistic/top",
      params: {span_id: active.value}
    })).data
  } finally {
    loading.value = false
  }
}

const refresh_data = async () => {
  result.value = {
    chat: [],
    entry: [],
    message: []
  }
  await get_data()
}

const select = (item: TopItem) => {
  uid.value = item.user__uid
  search.value = item.user__current_name
}

get_data()
</script>

<style scoped lang="less">

</style>
