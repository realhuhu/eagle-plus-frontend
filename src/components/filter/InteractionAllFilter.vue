<template>
  <interaction-base-filter>
    <template #foot>
      <a-form-item label="类型">
        <a-select v-model="interaction_params.interaction" placeholder="请选择..." multiple>
          <a-option :value="0" :tag-props="{ color: 'blue' }">弹幕</a-option>
          <a-option :value="1" :tag-props="{ color: 'blue' }">上舰</a-option>
          <a-option :value="2" :tag-props="{ color: 'blue' }">礼物</a-option>
          <a-option :value="3" :tag-props="{ color: 'blue' }">入场</a-option>
          <a-option :value="4" :tag-props="{ color: 'blue' }">留言</a-option>
        </a-select>
      </a-form-item>
    </template>
  </interaction-base-filter>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

import {UseStore} from "@/store";

const {interaction_params} = storeToRefs(UseStore())
</script>

<style scoped lang="less"></style>
