<template>
  <div>
    <div class="md:flex justify-between items-start gap-6">
      <slot name="head"/>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="用户" class="w-auto md:w-[50%]">
        <a-input v-model:model-value="params.uid" placeholder="请输入完整uid" allow-clear/>
      </a-form-item>

      <a-form-item label="搜索" class="w-auto md:w-[50%]">
        <a-input placeholder="请输入搜索内容" v-model:model-value="params.search" :disabled="search_disable"
                 allow-clear/>
      </a-form-item>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <slot name="body"/>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="舰长" class="w-auto md:w-[50%]">
        <a-select v-model="params.guard" placeholder="请选择..." multiple>
          <a-option :value="0" v-if="!only_guard">未上舰</a-option>
          <a-option :value="3" :tag-props="{color:'blue'}">舰长</a-option>
          <a-option :value="2" :tag-props="{color:'orange'}">提督</a-option>
          <a-option :value="1" :tag-props="{color:'red'}">总督</a-option>
        </a-select>
      </a-form-item>

      <a-form-item label="排序" class="w-auto md:w-[50%]">
        <a-select placeholder="请选择" v-model="params.ordering">
          <a-option v-for="(ordering,k) in orderings" :key="k" :value="ordering.field">{{ ordering.text }}</a-option>
        </a-select>
      </a-form-item>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <slot name="foot"/>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{ orderings?: { field: string, text: string }[], only_guard?: boolean, search_disable?: boolean }>(),
    {
      orderings: () => [
        {field: "-timestamp", text: "最新"},
        {field: "timestamp", text: "最早"}
      ],
      only_guard: false,
      search_disable: false
    }
)

const params = defineModel<InteractionParams>("params", {required: true})
</script>

<style scoped lang="less">

</style>
