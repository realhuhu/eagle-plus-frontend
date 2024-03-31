<template>
  <div class="md:flex justify-end items-center">
    <div class="px-2">
      <a-form-item label="开始">
        <a-date-picker
            class="w-full"
            show-time
            format="YYYY-MM-DD HH:mm"
            v-model:model-value="params.start"
        />
      </a-form-item>
    </div>

    <div class="px-2">
      <a-form-item label="结束">
        <a-date-picker
            class="w-full"
            show-time
            format="YYYY-MM-DD HH:mm"
            v-model:model-value="params.end"
        />
      </a-form-item>
    </div>
  </div>

  <div class="flex justify-start items-start flex-wrap">
    <a-form-item label="类型">
      <a-select v-model="params.interaction" placeholder="请选择..." multiple>
        <a-option :value="0" :tag-props="{color:'blue'}">弹幕</a-option>
        <a-option :value="1" :tag-props="{color:'blue'}">上舰</a-option>
        <a-option :value="2" :tag-props="{color:'blue'}">礼物</a-option>
        <a-option :value="3" :tag-props="{color:'blue'}">入场</a-option>
        <a-option :value="4" :tag-props="{color:'blue'}">留言</a-option>
      </a-select>
    </a-form-item>

    <div class="md:flex justify-between items-start gap-6 w-full">
      <a-form-item label="搜索" class="w-auto md:w-[50%]">
        <a-input placeholder="请输入搜索内容" v-model:model-value="params.search" allow-clear/>
      </a-form-item>

      <a-form-item label="排序" class="w-auto md:w-[50%]">
        <a-select placeholder="请选择" v-model="params.ordering">
          <a-option v-for="(ordering,k) in orderings" :key="k" :value="ordering.field">{{ ordering.text }}</a-option>
        </a-select>
      </a-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
const params = defineModel<InteractionParams>("params", {required: true})
defineProps<{ orderings: { field: string, text: string }[] }>()
</script>

<style scoped lang="less">

</style>
