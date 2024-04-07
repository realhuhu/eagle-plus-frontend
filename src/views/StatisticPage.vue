<template>
  <div class="w-[1280px] max-w-[90vw] mx-auto">
    <a-tabs type="capsule" size="large" hide-content :active-key="route.meta.statistic_key" @change="switch_data">
      <a-tab-pane key="live" title="按直播"/>
      <a-tab-pane key="period" title="按周期"/>
      <a-tab-pane key="time" title="按时间"/>
    </a-tabs>

    <router-view v-slot="{ Component }">
      <transition enter-active-class="animate__animated animate__fadeIn" appear>
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

const switch_data = async (key: string | number) => {
  await router.replace(key.toString())
}

</script>

<style scoped lang="less">

</style>
