<template>
  <div class="md:flex justify-start items-center my-2">
    <div class="text-[12px] md:text-[14px] flex-shrink-0 mr-2"> {{ time }}</div>

    <div class="flex justify-between items-center p-2 rounded w-[256px]" :style="background">
      <div class="flex justify-start items-center truncate">
        <privilege-avatar :avatar="interaction.user.current_avatar" :privilege_type="interaction.guard_type" :size="34"
                          class="mr-2"/>

        <div class="font-bold hover:text-[#4ebaee] cursor-pointer duration-100  truncate mr-1 text-yellow-400"
             @click="open_url(`https://space.bilibili.com/${interaction.user.uid}/`)">
          {{ interaction.user.current_name }}
        </div>

        <div class="mr-2 text-white">{{ guard.guard_name }}×{{ guard.guard_num }}</div>
      </div>

      <div class="flex-shrink-0 bg-yellow-200 text-yellow-600 rounded border border-amber-500 px-0.5">
        {{ guard.guard_total_price / 1000 }}元
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {DateParser, open_url} from "@/assets/lib/utils";

const props = defineProps<{ interaction: Interaction, guard: Guard }>()
const time = computed(() => (new DateParser(props.interaction.timestamp)).monthDayHoursMinutes())
const background = computed(() => {
  switch (props.interaction.guard_type) {
    case 3:
      return "background-color:rgba(81,122,199,0.8);filter:drop-shadow(2px 2px 1px #3d4f8d)"
    case 2:
      return "background-color:rgba(222,157,254,0.8);filter:drop-shadow(2px 2px 1px #6722a1)"
    case 1:
      return "background-color:rgba(226,80,66,0.8);filter: drop-shadow(2px 2px 1px #91212d)"
  }
  return ""
})

</script>

<style scoped lang="less">

</style>
