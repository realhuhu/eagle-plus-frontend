<template>
  <div>
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
          <a-option value="-message__level">等级降序</a-option>
          <a-option value="message__level">等级升序</a-option>
        </a-select>
      </a-form-item>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="房管" class="w-auto md:w-[50%]">
        <a-select v-model="params.admin_type" placeholder="请选择..." multiple>
          <a-option :value="0">非房管</a-option>
          <a-option :value="1" :tag-props="{color:'orange'}">房管</a-option>
          <a-option :value="2" :tag-props="{color:'red'}">主播</a-option>
        </a-select>
      </a-form-item>

      <a-form-item label="勋章" class="w-auto md:w-[50%]">
        <a-input-search placeholder="请输入粉丝勋章名称" allow-clear  v-model="params.medal"/>
      </a-form-item>
    </div>

    <div class="md:flex justify-between items-start gap-6">
      <a-form-item label="用户" class="w-auto md:w-[50%]">
        <search-user-input v-model:uid="params.uid"/>
      </a-form-item>

      <a-form-item label="搜索" class="w-auto md:w-[50%]">
        <a-input-search placeholder="请输入搜索内容" allow-clear search-button @search="search" @clear="clear"/>
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
