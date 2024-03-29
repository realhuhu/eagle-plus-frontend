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
import {ref} from "vue";

const uid = ref(0)
const search = ref("")
</script>

<style scoped lang="less">

</style>
