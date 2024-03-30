<template>
  <div>
    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="周期" class="w-auto md:w-[50%]">
        <a-select placeholder="请选择" v-model="params.period">
          <a-option v-for="(period,k) in periods" :key="k" :value="period.field">{{ period.text }}</a-option>
        </a-select>
      </a-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";

const periods = ref([
  {field: 1, text: "每日"},
  {field: 2, text: "每周"},
  {field: 3, text: "每月"}
])
const params = ref({
  period: 1
})

</script>

<style scoped lang="less">

</style>
