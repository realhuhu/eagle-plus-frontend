<template>
  <interaction-base-filter :orderings="orderings" search_disable only_guard/>
</template>

<script setup lang="ts">
const orderings = ref([
  {field: "-timestamp", text: "最新"},
  {field: "timestamp", text: "最早"},
  {field: "-guard__guard_total_price", text: "总价降序"},
  {field: "guard__guard_total_price", text: "总价升序"}
])
</script>

<style scoped lang="less">

</style>
