<template>
  <div class="md:flex justify-start items-start my-2 w-full">
    <div class="text-[12px] md:text-[14px] flex-shrink-0 mr-2 text-bold"> {{ time }}</div>

    <div class="card-detail" ref="chatRef">
      <div class="card-head" :style="`background-color:${chat.chat_color};border-color: ${chat.chat_bottom_color}`">
        <privilege-avatar :avatar="interaction.user.current_avatar" :privilege_type="interaction.guard_type"/>

        <div class="card-info">
          <div class="card-name" @click="emit('user_click',interaction.user)">
            {{ interaction.user.current_name }}
          </div>
          <div class="card-price">
            <div class="card-price-inner">{{ chat.chat_price * 10 }}电池</div>
          </div>
        </div>

        <div class="paste cursor-pointer" @click="paste" v-if="!store.is_mobile">
          <a-tooltip content="截图该留言并复制到剪贴板">
            <i-clarity-paste-line class="text-green-600"/>
          </a-tooltip>
        </div>
      </div>

      <div class="card-body" :style="`background-color:${chat.chat_bottom_color}`">
        <div class="card-content" v-html="highlightKeyword(chat.chat_message,highlight)"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UseStore} from "@/store";
import {DateParser, div2img, highlightKeyword} from "@/assets/lib/utils";

const chatRef = ref()
const props = defineProps<{ interaction: Interaction, chat: Chat, highlight?: string }>()
const emit = defineEmits(["user_click"])
const store = UseStore()
const time = computed(() => new DateParser(props.interaction.timestamp).smart())
const paste = () => {
  div2img(chatRef.value)
}
</script>

<style scoped lang="less">
.card-detail {
  margin: 2px;
  width: 270px;
  max-width: 100%;
  position: relative;
  z-index: 2;
  min-height: 88px;
}

.card-head {
  border: 1px solid;
  border-radius: 6px 6px 0 0;
  height: 50px;
  background-position: 100% center;
  background-size: contain;
  background-repeat: no-repeat;
  padding: 8px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.card-body {
  position: relative;
  padding: 8px 10px;
  box-sizing: border-box;
  border-radius: 2px 2px 6px 6px;
  min-height: 38px;
}

.card-content {
  position: relative;
  min-height: 12px;
  word-wrap: break-word;
  font-size: 12px;
  color: #fff;
  text-align: left;
  line-height: 20px;
}

.card-info {
  margin: 2px 0 0 6px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card-name {
  opacity: .78;
  font-size: 12px;
  cursor: pointer;
  color: #f9708e;
}

.card-price {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.card-price-inner {
  margin: 2px;
  font-size: 13px;
  line-height: 16px;
  color: #333;
}
</style>
