<template>
  <header-bar/>

  <router-view v-slot="{ Component }" class="my-20 md:my-32 text-[var(--color-text-1)]">
    <keep-alive include="HomePage,InteractionPage,UserPage,StatisticPage">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import {Notification} from "@arco-design/web-vue";
import {UseStore} from "@/store";

const store = UseStore()
if (store.is_mobile) {
  Notification.warning("建议使用电脑体验完整功能")
}
</script>

<style lang="less"></style>
