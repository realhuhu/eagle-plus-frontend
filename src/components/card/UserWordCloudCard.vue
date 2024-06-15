<template>
  <div class="bg-[var(--theme-dark-2)] rounded-xl p-2 w-full flex justify-center items-center">
    <a-spin v-if="loading" tip="加载词云中"/>
    <word-cloud v-else :words="words"/>
  </div>
</template>

<script setup lang="ts">
import {client} from "@/assets/lib/request";
import {Notification} from "@arco-design/web-vue";
import {ref} from "vue";

const props = defineProps<{ uid: number }>()
const words = ref<[string, number][]>([])
const loading = ref(true)

const get_data = async () => {
  loading.value = true
  try {
    const res = await client.get<Record<string, number>>({url: `user/${props.uid}/wordcloud`})
    words.value = Object.entries(res.data).sort((a, b) => b[1] - a[1]).slice(0, 100)
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
