<template>
  <div class="w-[968px] max-w-[90vw] mx-auto">
    <a-input-search v-model:model-value="uid" @search="search"/>

    <a-divider class="my-10"/>

    <router-view v-slot="{ Component }">
      <transition enter-active-class="animate__animated animate__fadeIn" appear>
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const uid = ref("")
const router = useRouter()

const search = (new_val: string) => {
  router.push(new_val ? `/user/${new_val}` : "/user")
}
</script>

<style scoped lang="less">

</style>
