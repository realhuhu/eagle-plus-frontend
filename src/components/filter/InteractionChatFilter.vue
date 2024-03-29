<template>
  <interaction-base-filter v-model:params="params" :orderings="orderings">
  </interaction-base-filter>
</template>

<script setup lang="ts">
import {ref} from "vue";

const params = defineModel<InteractionParams>("params", {required: true})
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
