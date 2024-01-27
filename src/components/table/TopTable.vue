<template>
  <div class="border-[var(--theme-gray-3)] border p-3 rounded-xl flex flex-col gap-3 bg-[var(--theme-dark-2)]">
    <div class="text-center font-bold text-lg">{{ title }}</div>
    <div v-for="(item,k) in items" :key="k" @click="emits('select',item)"
         class="flex justify-start items-center cursor-pointer hover:text-[#4ebaee] duration-100">
      <privilege-avatar :avatar="item.user__current_avatar" class="mr-2"/>
      <div class="truncate flex-grow">{{ item.user__current_name }}</div>
      <div class="place-self-end">{{ item.num }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: TopItem[], title: string }>()
const emits = defineEmits(["select"])
</script>

<style scoped lang="less">

</style>
