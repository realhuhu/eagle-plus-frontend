<template>
  <div>
    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="类型">
        <a-select v-model="params.interaction" placeholder="请选择..." multiple>
          <a-option :value="0" :tag-props="{color:'blue'}">弹幕</a-option>
          <a-option :value="1" :tag-props="{color:'blue'}">上舰</a-option>
          <a-option :value="2" :tag-props="{color:'blue'}">礼物</a-option>
          <a-option :value="3" :tag-props="{color:'blue'}">入场</a-option>
          <a-option :value="4" :tag-props="{color:'blue'}">留言</a-option>
        </a-select>
      </a-form-item>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="舰长" class="w-auto md:w-[50%]">
        <a-select v-model="params.guard" placeholder="请选择..." multiple>
          <a-option :value="0">未上舰</a-option>
          <a-option :value="3" :tag-props="{color:'blue'}">舰长</a-option>
          <a-option :value="2" :tag-props="{color:'orange'}">提督</a-option>
          <a-option :value="1" :tag-props="{color:'red'}">总督</a-option>
        </a-select>
      </a-form-item>

      <a-form-item label="排序" class="w-auto md:w-[50%]">
        <a-select placeholder="请选择" v-model="params.ordering">
          <a-option value="-timestamp">最新</a-option>
          <a-option value="timestamp">最早</a-option>
        </a-select>
      </a-form-item>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="用户" class="w-auto md:w-[50%]">
        <search-user-input v-model:uid="params.uid"/>
      </a-form-item>

      <a-form-item label="搜索" class="w-auto md:w-[50%]">
        <a-input-search placeholder="请输入..." allow-clear search-button @search="search" @clear="clear"/>
      </a-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
const params = defineModel<InteractionParams>("params", {required: true})

const search = (value: string) => params.value.search = value
const clear = () => params.value.search = ""
</script>

<style scoped lang="less">

</style>
