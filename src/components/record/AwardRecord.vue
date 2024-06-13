<template>
    <div class="md:flex justify-start items-start my-2 md:my-4">
        <div class="text-[12px] md:text-[14px] flex-shrink-0 mr-2"> {{ time }}</div>

        <div class="flex-col justify-center items-center">
            <div class="text-[14px] font-bold text-[#4ebaee] mb-1">{{ award.title }}</div>
            <div v-for="(user, k) in award.users" :key="k" class="flex justify-start items-center">
                <privilege-avatar :avatar="user.current_avatar" :size="34" class="mr-2" />

                <div @click="emit('user_click', user)"
                    class="font-bold hover:text-[#4ebaee] cursor-pointer duration-100 truncate mr-1">
                    {{ user.current_name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { DateParser } from "@/assets/lib/utils";
import { computed } from "vue";

const props = defineProps<{ award: Award }>()
const emit = defineEmits(["user_click"])
const time = computed(() => new DateParser(props.award.timestamp).smart())
</script>

<style scoped lang="less"></style>
