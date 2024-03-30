<template>
  <div>
    <a-divider/>

    <a-tabs type="capsule" size="large" hide-content :active-key="route.meta.statistic_key" @change="switch_data">
      <a-tab-pane key="live" title="按直播"/>
      <a-tab-pane key="period" title="按周期"/>
      <a-tab-pane key="time" title="按时间"/>
    </a-tabs>

    <div class="w-full bg-[var(--theme-dark-2)] my-4 rounded px-4 py-6">
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeIn" appear>
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>
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
