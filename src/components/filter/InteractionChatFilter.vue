<template>
  <div>
    <interaction-base-filter :orderings="orderings"/>
    <div v-if="!store.is_mobile" class="text-end text-gray-500">*点击留言右上角图标复制留言截图</div>
  </div>
</template>

<script setup lang="ts">
import {UseStore} from "@/store";

const store = UseStore()
const orderings = ref([
  {field: "-timestamp", text: "最新"},
  {field: "timestamp", text: "最早"},
  {field: "-chat__chat_price", text: "总价降序"},
  {field: "chat__chat_price", text: "总价升序"},
  {field: "-chat__user_level", text: "等级降序"},
  {field: "chat__user_level", text: "等级升序"}
])
</script>

<style scoped lang="less">

</style>
