<template>
  <div class="bg-[var(--theme-dark-2)] rounded-xl md:py-9 p-6 w-full">
    <transition enter-active-class="animate__animated animate__fadeIn" appear>
      <div v-if="loading" class="flex justify-center items-center">
        <a-spin tip="加载中..."/>
      </div>

      <div v-else>
        <div class="flex flex-col justify-center items-center gap-3">
          <privilege-avatar :avatar="info.current_avatar" :size="100"/>

          <div class="flex justify-center items-center gap-2">
            <div class="text-lg">{{ info.current_name }}</div>
            <i-tdesign-jump class="inline cursor-pointer hover:text-[#4ebaee] duration-100"
                            @click="open_url(`https://space.bilibili.com/${info.uid}/`)"/>
          </div>

          <div class="bg-[var(--theme-dark-1)] ">
            <a-tag bordered color="blue">UID: {{ info.uid }}</a-tag>
          </div>
        </div>

        <div class="flex justify-around items-start mt-5 flex-wrap">
          <div class="md:w-[45%] w-full">
            <a-divider>历史昵称</a-divider>
            <div v-for="(name,k) in info.history_names" :key="k"
                 class="flex justify-between items-center h-6 px-2">
              <div class="text-[var(--color-text-3)]">{{ time(name.timestamp) }}</div>
              <div class="ml-3">{{ name.name }}</div>
            </div>
          </div>

          <div class="md:w-[45%] w-full">
            <a-divider>历史头像</a-divider>
            <div v-for="(avatar,k) in info.history_avatars" :key="k"
                 class="flex justify-between items-center h-6 px-2">
              <div class="text-[var(--color-text-3)]">{{ time(avatar.timestamp) }}</div>
              <privilege-avatar class="ml-3" :avatar="avatar.avatar" :size="30"/>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {DateParser, open_url} from "@/assets/lib/utils";
import {ref, watch} from "vue";
import {client} from "@/assets/lib/request";

const props = defineProps<{ uid: number }>()
const loading = ref(true)

const info = ref<UserInfo>({
  uid: 0,
  current_name: "",
  current_avatar: "",
  history_names: [],
  history_avatars: []
})

const get_info = async () => {
  try {
    loading.value = true

    const res = await client.get<UserInfo>({
      url: `user/${props.uid}/info`
    })
    info.value = res.data
  } finally {
    loading.value = false
  }
}

watch(() => props.uid, async () => {
  info.value = {
    uid: 0,
    current_name: "",
    current_avatar: "",
    history_names: [],
    history_avatars: []
  }
  await get_info()
})

get_info()
const time = (timestamp: string) => new DateParser(timestamp).monthDayHoursMinutes()
</script>

<style scoped lang="less">

</style>
