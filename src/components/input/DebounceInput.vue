<template>
  <a-input :placeholder="placeholder" v-model="_value" allow-clear/>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {debounce} from "lodash";

defineProps<{ placeholder: string }>()
const value = defineModel<string>("value", {required: true})
const _value = ref("")

watch(_value, debounce(() => {
      value.value = _value.value
    }, 500)
)
</script>

<style scoped lang="less">

</style>
