<template>
  <div class="flex flex-col justify-start items-center gap-4">
    <user-info-card :uid="uid"/>
    <user-interaction-card :uid="uid"/>
  </div>
</template>

<script setup lang="ts">
defineProps<{ uid: number }>()
</script>

<style scoped lang="less">

</style>
