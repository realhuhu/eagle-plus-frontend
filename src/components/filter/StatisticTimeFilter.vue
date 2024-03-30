<template>
  <div>
    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="开始" class="w-auto md:w-[50%]">
        <a-date-picker
            class="w-full"
            show-time
            format="YYYY-MM-DD HH:mm"
            v-model:model-value="params.start"
        />
      </a-form-item>

      <a-form-item label="结束" class="w-auto md:w-[50%]">
        <a-date-picker
            class="w-full"
            show-time
            format="YYYY-MM-DD HH:mm"
            v-model:model-value="params.end"
        />
      </a-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
const params = defineModel<StatisticTimeParams>("params", {required: true})
</script>

<style scoped lang="less">

</style>
