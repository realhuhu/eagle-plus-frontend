<template>
    <div>
        <div class="flex justify-between items-center">
            <div class="w-full flex-grow text-gray-400">搜索昵称与曾用名</div>
            <a-button type="text" class="flex justify-end" @click="safeBack('/user/top')">返回</a-button>
        </div>

        <div v-if="table.loading" class="flex justify-center items-center">
            <a-spin tip="加载中..." />
        </div>

        <div v-else>
            <div class="flex justify-start items-center flex-wrap">
                <div v-for="(user, k) in table.users" :key="k" @click="to_detail(user)"
                    class="w-[50%] md:w-[25%] pl-4 py-4 flex justify-start items-center cursor-pointer hover:bg-[var(--theme-dark-2)] duration-100">
                    <privilege-avatar :avatar="user.current_avatar" :size="50" class="mr-2" />
                    <div class="flex-1 flex flex-col justify-between items-start">
                        <div class="w-[70%] truncate">{{ user.current_name }}</div>
                        <a-tag bordered color="blue" size="small" class="mt-2">UID: {{ user.uid }}</a-tag>
                    </div>
                </div>
            </div>


            <div class="flex justify-end mt-10" v-if="table.count">
                <a-pagination :simple="store.is_mobile" :total="table.count" v-model:current="params.page"
                    v-model:page-size="params.size" show-page-size :page-size-options="[20, 40, 100]" show-jumper
                    @change="change" @pageSizeChange="refresh_data" />
            </div>
            <div v-else class="flex justify-center items-center h-[57px]">
                没有查询到结果
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { safeBack } from "@/router";
import { client } from "@/assets/lib/request";
import { assertNotEmpty, flat_query } from "@/assets/lib/utils";
import { UseStore } from "@/store";

const route = useRoute()
const router = useRouter()
const store = UseStore()
if (!route.query.name) safeBack("/user/top")

const name = ref<string>(assertNotEmpty(flat_query(route.query.name), "搜索内容为空"))
const params = ref({
    page: 1,
    size: 20
})
const table = ref<{
    count: number
    loading: boolean
    users: User[]
}>({
    count: 0,
    loading: false,
    users: []
})

const get_data = async () => {
    table.value.loading = true
    try {
        const res = await client.get<{
            count: number
            results: User[]
        }>({ url: "/user/search", params: { name: name.value, ...params.value } })
        table.value.count = res.data.count
        table.value.users = res.data.results
    } finally {
        table.value.loading = false
    }
}

const change = async (page: number) => {
    params.value.page = page
    await get_data()
}

const refresh_data = async () => {
    params.value.page = 1
    await get_data()
}

const to_detail = (user: User) => {
    router.push(`/user/${user.uid}`)
}

watch(() => route.query.name, async () => {
    if (!route.query.name) return
    const new_name = assertNotEmpty(flat_query(route.query.name), "搜索内容为空")
    if (name.value !== new_name) {
        name.value = new_name
        await get_data()
    }
})

get_data()
</script>

<style scoped lang="less"></style>
