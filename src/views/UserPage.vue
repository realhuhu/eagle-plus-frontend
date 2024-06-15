<template>
  <div class="w-[968px] max-w-[90vw] mx-auto">
    <a-input-search v-model:model-value="uid" @search="search" search-button/>

    <a-divider class="my-10"/>

    <router-view v-slot="{ Component }">
      <transition enter-active-class="animate__animated animate__fadeIn" appear>
        <keep-alive include="UserTopTable,UserSearchTable">
          <component :is="Component"/>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {Notification} from "@arco-design/web-vue";

const uid = ref("")
const router = useRouter()

const search = () => {
  if (!uid.value) {
    Notification.warning("请输入后再搜索")
  }
  router.replace(`/user/search/?name=${uid.value}`)
}
</script>

<style scoped lang="less"></style>
