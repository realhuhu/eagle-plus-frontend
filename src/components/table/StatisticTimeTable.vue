<template>
  <div>
    <statistic-time-filter v-model:params="params"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {client} from "@/assets/lib/request";
import {build_params} from "@/assets/lib/utils";

const today = new Date(new Date().toLocaleDateString()).getTime()

const params = ref<StatisticTimeParams>({
  start: new Date(today),
  end: new Date(today + 24 * 60 * 60 * 1000 - 1)
})

const get_data = async () => {
  try {
    const res = await client.get({
      url: "/statistic/time/",
      params: build_params(params.value, ["start", "end"])
    })

    console.log(res.data);
  } finally {
  }
}

get_data()
</script>

<style scoped lang="less">

</style>
