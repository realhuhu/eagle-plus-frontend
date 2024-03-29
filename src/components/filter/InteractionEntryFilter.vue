<template>
  <interaction-base-filter v-model:params="params" :orderings="orderings" search_disable>
    <template #foot>
      <a-form-item label="勋章" class="w-auto md:w-[50%]">
        <debounce-input placeholder="请输入粉丝勋章名称" v-model:value="params.medal"/>
      </a-form-item>

      <div class="w-auto md:w-[50%]"/>
    </template>
  </interaction-base-filter>
</template>

<script setup lang="ts">
import {ref} from "vue";

const params = defineModel<InteractionParams>("params", {required: true})
const orderings = ref([
  {field: "-timestamp", text: "最新"},
  {field: "timestamp", text: "最早"},
  {field: "-entry__medal_level", text: "粉丝牌降序"},
  {field: "entry__medal_level", text: "粉丝牌升序"}
])
</script>

<style scoped lang="less">

</style>
