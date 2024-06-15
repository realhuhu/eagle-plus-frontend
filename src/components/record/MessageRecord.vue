<template>
  <div class="md:flex justify-start items-center my-2 md:my-4">
    <div class="text-[12px] md:text-[14px] flex-shrink-0 mr-2"> {{ time }}</div>

    <div class="inline-flex justify-start items-center">
      <privilege-avatar :avatar="interaction.user.current_avatar" :privilege_type="interaction.guard_type" :size="34"
                        class="mr-2"/>

      <div v-if="message.admin_type == 1"
           class="p-0.5 rounded-md text-[#FFB027] border border-[#FFB027] flex-shrink-0 mr-1">房
      </div>

      <div :style="{ color: `${message.name_color}` }" @click="emit('user_click', interaction.user)"
           class="font-bold hover:text-[#4ebaee] cursor-pointer duration-100 truncate mr-1">
        {{ interaction.user.current_name }}
      </div>

      <a-tooltip :content="`全站排名${message.level_rank}`" mini>
        <div :style="{ backgroundColor: number_to_color(message.level_color) }"
             class="rounded-[4px] text-center flex-shrink-0 text-[10px] md:text-[12px] px-1  mr-1">
          Lv.{{ message.level }}
        </div>
      </a-tooltip>

      <medal-chip v-if="message.medal_name" :medal="message" class="mr-1"/>

      <div class="mr-2 font-bold">:</div>
    </div>

    <span>
      <span v-if="!message.text_emoticon.url" :style="{ color: number_to_color(message.text_color, true) }">
        {{ message.text }}
      </span>

      <span v-else>
        <a-image :width="message.text_emoticon.width / 3" :height="message.text_emoticon.height / 3"
                 :src="proxy_url(message.text_emoticon.url)"/>
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import {DateParser, number_to_color, proxy_url} from "@/assets/lib/utils";
import {computed} from "vue";

const props = defineProps<{ interaction: Interaction, message: Message }>()
const emit = defineEmits(["user_click"])
const time = computed(() => new DateParser(props.interaction.timestamp).smart())
</script>

<style scoped lang="less"></style>
