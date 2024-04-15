<template>
  <div>
    123
  </div>
</template>

<script setup lang="ts">
import { client } from '@/assets/lib/request';
import { ref } from 'vue';
import { Notification } from "@arco-design/web-vue";

const loading = ref(false)

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<StaticSessionPoint[]>({
      url: "/statistic/session"
    })

    console.log(res.data)
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  } finally {
    loading.value = false
  }
}

get_data()
</script>

<style scoped lang="less"></style>
