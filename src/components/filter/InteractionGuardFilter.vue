<template>
  <interaction-base-filter :params="params" :orderings="orderings" search_disable only_guard>
  </interaction-base-filter>
</template>

<script setup lang="ts">
import {ref} from "vue";

const params = defineModel<InteractionParams>("params", {required: true})
const orderings = ref([
  {field: "-timestamp", text: "最新"},
  {field: "timestamp", text: "最早"},
  {field: "-guard__guard_total_price", text: "总价降序"},
  {field: "guard__guard_total_price", text: "总价升序"}
])
</script>

<style scoped lang="less">

</style>
