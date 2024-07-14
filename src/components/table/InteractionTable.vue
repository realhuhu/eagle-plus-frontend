<template>
  <div>
    <transition enter-active-class="animate__animated animate__fadeIn" appear>
      <div>
        <div class="my-10">
          <div role="separator" class="my-5 relative border-b-solid border-b-[var(--color-border-2)] border-b-[1px]">
            <div class="absolute md:left-[24px] left-[8px] md:px-[16px] px-[8px] top-[50%] bg-[var(--color-bg-2)]"
                 style="transform: translateY(-50%)">
              <div class="flex gap-3">
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
            </div>

            <div
                class="absolute md:right-[24px] right-[8px] md:px-[16px] px-[8px] top-[50%] bg-[var(--color-bg-2)] flex gap-3"
                style="transform: translateY(-50%)">
              <a-button v-if="!store.is_mobile" type="outline" size="small" @click="emit('download')"
                        :disabled="table.loading">导出
              </a-button>
              <a-button status="success" size="small" @click="emit('refresh')">更新</a-button>
            </div>
          </div>
        </div>

        <div v-if="table.loading" class="flex justify-center items-center">
          <a-spin tip="加载中..."/>
        </div>

        <div v-else>
          <div v-for="(interaction, k) in table.interactions" :key="k">
            <transition enter-active-class="animate__animated animate__fadeIn" appear>
              <message-record v-if="interaction.message" :interaction="interaction" :message="interaction.message"
                              @user_click="on_user_click"/>
              <guard-record v-else-if="interaction.guard" :interaction="interaction" :guard="interaction.guard"
                            @user_click="on_user_click"/>
              <gift-record v-else-if="interaction.gift" :interaction="interaction" :gift="interaction.gift"
                           @user_click="on_user_click"/>
              <entry-record v-else-if="interaction.entry" :interaction="interaction" :entry="interaction.entry"
                            @user_click="on_user_click"/>
              <chat-record v-else-if="interaction.chat" :interaction="interaction" :chat="interaction.chat"
                           @user_click="on_user_click"/>
            </transition>
          </div>

          <div v-for="(award, k) in table.award" :key="k">
            <transition enter-active-class="animate__animated animate__fadeIn" appear>
              <award-record :award="award" @user_click="on_user_click"/>
            </transition>
          </div>

          <div class="flex justify-end" v-if="table.count">
            <a-pagination :simple="store.is_mobile" :total="table.count" v-model:current="params.page"
                          v-model:page-size="params.size" show-page-size :page-size-options="[20, 50, 100]" show-jumper
                          @change="emit('change_page')" @pageSizeChange="emit('change_size')"/>
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
const emit = defineEmits(["change_page", "change_size", "refresh", "user_click", "download"])
const store = UseStore()

const on_user_click = (user: User) => {
  emit("user_click", user)
}
</script>

<style scoped lang="less"></style>
