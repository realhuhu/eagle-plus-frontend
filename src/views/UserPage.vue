<template>
  <div class="w-[968px] max-w-[90vw] mx-auto">
    <a-input-search v-model:model-value="name" @search="search" placeholder="搜索完整uid，或模糊搜索昵称" search-button/>

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
import {Notification} from "@arco-design/web-vue";

const name = ref("")
const router = useRouter()

const search = () => {
  if (!name.value) {
    Notification.warning("请输入后再搜索")
    return
  }
  router.replace(`/user/search/?name=${name.value}`)
}
</script>

<style scoped lang="less"></style>
