<template>
  <div class="w-[1280px] max-w-[90vw] mx-auto flex flex-col justify-center items-center gap-3">
    <a-tabs type="capsule" size="large" hide-content :active-key="route.meta.statistic_key||'session'"
            @change="switch_data">
      <a-tab-pane key="session" title="按直播"/>
      <a-tab-pane key="period" title="按周期"/>
    </a-tabs>

    <a-divider margin="0"/>

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
