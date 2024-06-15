<template>
  <interaction-base-filter :orderings="orderings" search_disable>
    <template #foot>
      <a-form-item label="礼物" class="w-auto md:w-[50%]">
        <a-input placeholder="请输入礼物名称" v-model:model-value="interaction_params.gift" allow-clear/>
      </a-form-item>

      <a-form-item label="类别" class="w-auto md:w-[50%]">
        <a-select v-model="interaction_params.gift_coin" placeholder="请选择..." multiple>
          <a-option :value="0" :tag-props="{color:'blue'}">银瓜子</a-option>
          <a-option :value="1" :tag-props="{color:'orange'}">金瓜子</a-option>
        </a-select>
      </a-form-item>
    </template>
  </interaction-base-filter>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {UseStore} from "@/store";

const {interaction_params} = storeToRefs(UseStore())
const orderings = ref([
  {field: "-timestamp", text: "最新"},
  {field: "timestamp", text: "最早"},
  {field: "-gift__gift_total_price", text: "价格降序"},
  {field: "gift__gift_total_price", text: "价格升序"}
])
</script>

<style scoped lang="less">

</style>
