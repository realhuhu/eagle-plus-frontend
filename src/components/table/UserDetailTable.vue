<template>
  <div>
    <a-button type="text" class="float-right" @click="safeBack('/user/all')">返回</a-button>
    <div class="w-full">
      <div v-if="!loading" class="flex flex-col justify-start items-center gap-4 w-full">
        <user-info-card :uid="uid"/>
        <user-word-cloud-card :uid="uid"/>
        <user-interaction-card :uid="uid"/>
        <user-award-card :uid="uid"/>
      </div>

      <a-spin class="w-full" v-else tip="加载中"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import {Notification} from "@arco-design/web-vue";
import {safeBack} from "@/router";
import {flat_query} from "@/assets/lib/utils";
import {client} from "@/assets/lib/request";

const route = useRoute()
const uid = ref(Number(flat_query(route.params.uid)))
const loading = ref(true)

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<User>({url: `/user/${uid.value}`})
    if (res.msg === "error") {
      Notification.warning("用户不存在")
      safeBack("/user/top")
    }
  } finally {
    loading.value = false
  }
}


watch(() => route.params.uid, () => {
  uid.value = Number(flat_query(route.params.uid))
})

get_data()
</script>

<style scoped lang="less"></style>
