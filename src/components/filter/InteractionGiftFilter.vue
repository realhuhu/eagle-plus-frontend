<template>
  <interaction-base-filter v-model:params="params" :orderings="orderings" search_disable>
    <template #foot>
      <a-form-item label="礼物" class="w-auto md:w-[50%]">
        <debounce-input placeholder="请输入礼物名称" v-model:value="params.gift"/>
      </a-form-item>

      <a-form-item label="类别" class="w-auto md:w-[50%]">
        <a-select v-model="params.gift_coin" placeholder="请选择..." multiple>
          <a-option :value="0" :tag-props="{color:'blue'}">银瓜子</a-option>
          <a-option :value="1" :tag-props="{color:'orange'}">金瓜子</a-option>
        </a-select>
      </a-form-item>
    </template>
  </interaction-base-filter>
</template>

<script setup lang="ts">
import {ref} from "vue";

const params = defineModel<InteractionParams>("params", {required: true})
const orderings = ref([
  {field: "-timestamp", text: "最新"},
  {field: "timestamp", text: "最早"},
  {field: "-gift__gift_total_price", text: "价格降序"},
  {field: "gift__gift_total_price", text: "价格升序"},
])
</script>

<style scoped lang="less">

</style>
