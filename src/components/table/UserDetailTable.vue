<template>
  <div>
    <a-button type="text" class="float-right" @click="safeBack('/user/all')">返回</a-button>

    <div class="flex flex-col justify-start items-center gap-4 w-full">
      <user-info-card :uid="uid" />
      <user-interaction-card :uid="uid" />
      <user-award-card :uid="uid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { flat_query } from "@/assets/lib/utils";
import { safeBack } from "@/router";
import { ref, watch } from "vue";

const route = useRoute()
const uid = ref(Number(flat_query(route.params.uid)))

watch(() => route.params.uid, () => {
  uid.value = Number(flat_query(route.params.uid))
})
</script>

<style scoped lang="less"></style>
