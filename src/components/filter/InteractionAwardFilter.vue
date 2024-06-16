<template>
  <div>
    <div class="md:flex justify-between items-start gap-6">
      <slot name="head"/>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="搜索" class="w-auto md:w-[50%]">
        <a-input placeholder="请输入搜索内容" v-model:model-value="interaction_params.search" allow-clear/>
      </a-form-item>

      <a-form-item label="排序" class="w-auto md:w-[50%]">
        <a-select placeholder="请选择" v-model="interaction_params.ordering">
          <a-option v-for="(ordering, k) in orderings" :key="k" :value="ordering.field">
            {{ ordering.text }}
          </a-option>
        </a-select>
      </a-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

import {UseStore} from "@/store";

const {interaction_params} = storeToRefs(UseStore())

const orderings = ref([
  {field: "-timestamp", text: "最新"},
  {field: "timestamp", text: "最早"}
])
</script>

<style scoped lang="less"></style>
