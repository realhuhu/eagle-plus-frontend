<template>
  <interaction-base-filter :orderings="orderings">
    <template #foot>
      <a-form-item label="房管" class="w-auto md:w-[50%]">
        <a-select v-model="interaction_params.admin_type" placeholder="请选择..." multiple>
          <a-option :value="0">非房管</a-option>
          <a-option :value="1" :tag-props="{ color: 'orange' }">房管</a-option>
          <a-option :value="2" :tag-props="{ color: 'red' }">主播</a-option>
        </a-select>
      </a-form-item>

      <a-form-item label="勋章" class="w-auto md:w-[50%]">
        <a-input placeholder="请输入粉丝勋章名称" v-model:model-value="interaction_params.medal" allow-clear />
      </a-form-item>
    </template>
  </interaction-base-filter>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UseStore } from "@/store";
import { storeToRefs } from "pinia";

const { interaction_params } = storeToRefs(UseStore())
const orderings = ref([
  { field: "-timestamp", text: "最新" },
  { field: "timestamp", text: "最早" },
  { field: "-message__level", text: "等级降序" },
  { field: "message__level", text: "等级升序" },
  { field: "-message__medal_level", text: "粉丝牌降序" },
  { field: "message__medal_level", text: "粉丝牌升序" }
])
</script>

<style scoped lang="less"></style>
