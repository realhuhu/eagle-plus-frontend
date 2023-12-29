<template>
  <div>
    <transition enter-active-class="animate__animated animate__fadeIn" appear>
      <div v-if="table.loading" class="flex justify-center items-center">
        <a-spin tip="加载中..."/>
      </div>

      <div v-else>
        <div v-for="(interaction,k) in table.interactions" :key="k">
          <message-record v-if="interaction.message" :interaction="interaction" :message="interaction.message"/>
          <guard-record v-if="interaction.guard" :interaction="interaction" :guard="interaction.guard"/>
          <gift-record v-else-if="interaction.gift" :interaction="interaction" :gift="interaction.gift"/>
          <entry-record v-else-if="interaction.entry" :interaction="interaction" :entry="interaction.entry"/>
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
        <div v-else class="text-center">
          没有查询到结果
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {UseStore} from "@/store";

defineProps<{ table: InteractionTable }>()
const params = defineModel<InteractionParams>("params", {required: true})
const emit = defineEmits(["change_page", "change_size"])
const store = UseStore()
</script>

<style scoped lang="less">

</style>
