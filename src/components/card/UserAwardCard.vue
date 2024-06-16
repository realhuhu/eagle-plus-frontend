<template>
  <div class="bg-[var(--theme-dark-2)] rounded-xl p-6 w-full">
    <div v-for="( award, k) in awards" :key="k">
      <award-record :award="award"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Notification} from "@arco-design/web-vue";

import {client} from "@/assets/lib/request";

const props = defineProps<{ uid: number }>()
const awards = ref<Award[]>([])

const get_data = async () => {
  try {
    const res = await client.get<Award[]>({url: `user/${props.uid}/award`})
    awards.value = res.data
  } catch (e) {
    Notification.warning("获取失败")
    console.error(e)
  }
}

get_data()
</script>

<style scoped lang="less"></style>
