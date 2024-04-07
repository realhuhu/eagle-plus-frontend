<template>
  <header-bar/>

  <router-view v-slot="{ Component }" class="my-20 md:my-32 text-[var(--color-text-1)]">
    <keep-alive include="HomePage">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
</script>

<style lang="less">
</style>
