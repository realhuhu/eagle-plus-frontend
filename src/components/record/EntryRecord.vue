<template>
  <div class="flex justify-center items-center my-2 text-[var(--color-text-3)] text-[10px] md:text-[14px]">
    <div class="flex-shrink-0 mr-2"> {{ time }}</div>

    <a-image width="20" v-if="interaction.guard_type" :src="privilege_image(interaction.guard_type)"/>

    <div @click="emit('user_click',interaction.user)"
         class="font-bold hover:text-[#4ebaee] cursor-pointer duration-100  truncate">
      {{ interaction.user.current_name }}
    </div>

    <medal-chip v-if="entry.medal_name" :medal="entry" class="mx-1"/>

    <div class="truncate">进入直播间</div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {DateParser, privilege_image} from "@/assets/lib/utils";

const props = defineProps<{ interaction: Interaction, entry: Entry }>()
const emit = defineEmits(["user_click"])
const time = computed(() => new DateParser(props.interaction.timestamp).monthDayHoursMinutes())
</script>

<style scoped lang="less">

</style>
