<template>
  <div class="overflow-hidden w-full flex justify-center items-center">
    <div v-if="words.length>20" class="w-full h-[320px]">
      <a-spin tip="生成词云中" :loading="loading" class="w-full h-full duration-100">
        <vue-word-cloud :words="words" font-family="Roboto" class="w-full"
                        :font-size-ratio="4" :spacing="0.1" v-model:progress="progress"
                        :color="color" :rotation="rotation"/>
      </a-spin>
    </div>
    <div class="py-10" v-else>说话太少了，生成不了词云</div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line
// @ts-ignore
import VueWordCloud from "vuewordcloud";
import {ref, watch} from "vue";

const props = defineProps<{ words: [string, number][] }>()
const nums = props.words.map(x => x[1])
const colors = ["#3bc4c7", "#3a9eea", "#ff4e69", "#461e47"]
const progress = ref()
const loading = ref(true)
watch(progress, (oldValue, newVal) => {
  if (newVal && newVal.completedWords === newVal.totalWords) {
    loading.value = false
  }
})

function calculateQuartileIndexes(numbers: number[]): [number, number, number] {
  const sortedNumbers = [...numbers].sort((a, b) => a - b);

  const quartileCount = Math.ceil(sortedNumbers.length / 4);

  const Q1Index = quartileCount - 1; // 因为索引从0开始
  const Q2Index = 2 * quartileCount - 1;
  const Q3Index = 3 * quartileCount - 1;

  const adjustedQ1Index = Math.min(Q1Index, sortedNumbers.length - 1);
  const adjustedQ2Index = Math.min(Q2Index, sortedNumbers.length - 1);
  const adjustedQ3Index = Math.min(Q3Index, sortedNumbers.length - 1);

  return [adjustedQ1Index, adjustedQ2Index, adjustedQ3Index];
}

const color = (_: string, num: number) => {
  const quartileIndexes = calculateQuartileIndexes(nums);
  if (num < quartileIndexes[0]) {
    return colors[0]; // 低于第一个分位点  
  } else if (num >= quartileIndexes[0] && num < quartileIndexes[1]) {
    return colors[1]; // 在第一个和第二个分位点之间  
  } else if (num >= quartileIndexes[1] && num < quartileIndexes[2]) {
    return colors[2]; // 在第二个和第三个分位点之间  
  }

  return colors[3]; // 高于第三个分位点
}

const rotation = () => {
  const rand = Math.random()
  if (rand < 0.333) {
    return -0.125
  } else if (rand > 0.666) {
    return 0.125
  }

  return 0
}


</script>

<style scoped lang="less"></style>
