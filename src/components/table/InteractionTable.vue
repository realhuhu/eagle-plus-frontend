<template>
  <div>
    <transition enter-active-class="animate__animated animate__fadeIn" appear>
      <div>
        <div class="my-6">
          <a-divider orientation="left">
            <div class="flex gap-3">
              <a-button status="success" shape="circle" size="mini" @click="emit('refresh')">
                <icon-refresh/>
              </a-button>
              <a-tag color="blue">
                <template #icon>
                  <icon-message/>
                </template>
                {{ table.extra.total }}条
              </a-tag>

              <a-tag color="gold">
                <template #icon>
                  <icon-gift/>
                </template>
                {{ (Math.round(table.extra.price * 100) / 100).toFixed(2) }}元
              </a-tag>
            </div>
          </a-divider>
        </div>

        <div v-if="table.loading" class="flex justify-center items-center">
          <a-spin tip="加载中..."/>
        </div>

        <div v-else>
          <div v-for="(interaction,k) in table.interactions" :key="k">
            <message-record v-if="interaction.message" :interaction="interaction" :message="interaction.message"
                            @user_click="on_user_click"/>
            <guard-record v-if="interaction.guard" :interaction="interaction" :guard="interaction.guard"
                          @user_click="on_user_click"/>
            <gift-record v-else-if="interaction.gift" :interaction="interaction" :gift="interaction.gift"
                         @user_click="on_user_click"/>
            <entry-record v-else-if="interaction.entry" :interaction="interaction" :entry="interaction.entry"
                          @user_click="on_user_click"/>
            <chat-record v-else-if="interaction.chat" :interaction="interaction" :chat="interaction.chat"
                         @user_click="on_user_click"/>
          </div>

          <div class="flex justify-end" v-if="table.count">
            <a-pagination
                :simple="store.is_mobile"
                :total="table.count"
                v-model:current="params.page"
                v-model:page-size="params.size"
                show-page-size
                :page-size-options="[20,50,100]"
                show-jumper
                @change="emit('change_page')"
                @pageSizeChange="emit('change_size')"
            />
          </div>
          <div v-else class="flex justify-center items-center h-[57px]">
            没有查询到结果
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {UseStore} from "@/store";

defineProps<{ table: InteractionTable }>()
const params = defineModel<InteractionParams>("params", {required: true})
const emit = defineEmits(["change_page", "change_size", "refresh", "user_click"])
const store = UseStore()

const on_user_click = (user: User) => {
  emit("user_click", user)
}
</script>

<style scoped lang="less">

</style>
