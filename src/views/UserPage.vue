<template>
  <div>
    <search-user-input v-model:uid="uid" v-model:search="search"/>

    <a-divider/>
    <router-view v-slot="{ Component }">
      <transition enter-active-class="animate__animated animate__fadeIn" appear>
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useRouter} from "vue-router";

const uid = ref(0)
const search = ref("")
const router = useRouter()

watch(uid, (new_val: number) => {
  router.push(new_val ? `/user/${new_val}` : "/user")
})
</script>

<style scoped lang="less">

</style>
