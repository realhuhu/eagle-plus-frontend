<template>
  <div class="relative">
    <a-avatar class="rounded bg-cover bg-center bg-no-repeat bg-transparent" :size="size" :image-url="proxy_url(avatar)"/>
    <div class="rounded bg-cover bg-center bg-no-repeat top-[-2px] left-[-2px] absolute" :style="avatar_outer"/>
  </div>
</template>

<script setup lang="ts">
import {proxy_url} from "@/assets/lib/utils";
import {computed} from "vue";

const props = withDefaults(
    defineProps<{ privilege_type?: 0 | 1 | 2 | 3, avatar: string, size?: number }>(),
    {size: 30}
)

const avatar_outer = computed(() => {
  let image = ""
  switch (props.privilege_type) {
    case 3:
      image = proxy_url("https://i0.hdslb.com/bfs/live/80f732943cc3367029df65e267960d56736a82ee.png")
      break
    case 2:
      image = proxy_url("https://i0.hdslb.com/bfs/live/3b46129e796df42ec7356fcba77c8a79d47db682.png")
      break
    case 1:
      image = proxy_url("https://i0.hdslb.com/bfs/live/a454275dea465ac15a03f121f0d7edaf96e30bcf.png")
      break
  }
  return `background-image:url(${image});width:${props.size + 4}px;height:${props.size + 4}px`
})
</script>

<style scoped lang="less">

</style>
