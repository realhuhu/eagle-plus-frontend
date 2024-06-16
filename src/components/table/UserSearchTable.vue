<template>
  <div>
    <div v-if="bar.user" class="mb-6">
      <div class="flex justify-between items-center">
        <div class="w-full flex-grow text-gray-400">搜索UID</div>
        <a-button type="text" class="flex justify-end" @click="safeBack('/user/top')">返回</a-button>
      </div>

      <div @click="to_detail(bar.user)"
           class="w-[50%] md:w-[25%] md:px-4 px-2 py-4 flex justify-start items-center cursor-pointer hover:bg-[var(--theme-dark-2)] duration-100">
        <privilege-avatar :avatar="bar.user.current_avatar" :size="36" class="mr-2 flex-shrink-0"/>
        <div class="flex flex-col justify-between items-start flex-grow overflow-hidden">
          <div class="line-clamp-1 pr-3">{{ bar.user.current_name }}</div>
          <div
              class="line-clamp-1 break-all text-[10px] bg-[var(--color-primary-light-1)] border-[#4ebaee] border px-1 rounded">
            UID:{{ bar.user.uid }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <div class="w-full flex-grow text-gray-400">搜索昵称与曾用名</div>
      <a-button v-if="!bar.user" type="text" class="flex justify-end" @click="safeBack('/user/top')">返回</a-button>
    </div>

    <div v-if="table.loading" class="flex justify-center items-center">
      <a-spin tip="加载中..."/>
    </div>

    <div v-else>
      <div class="flex justify-start items-center flex-wrap">
        <div v-for="(user, k) in table.users" :key="k" @click="to_detail(user)"
             class="w-[50%] md:w-[25%] md:px-4 px-2 py-4 flex justify-start items-center cursor-pointer hover:bg-[var(--theme-dark-2)] duration-100">
          <privilege-avatar :avatar="user.current_avatar" :size="36" class="mr-2 flex-shrink-0"/>
          <div class="flex flex-col justify-between items-start flex-grow overflow-hidden">
            <div class="line-clamp-1 pr-3">{{ user.current_name }}</div>
            <div
                class="line-clamp-1 break-all text-[10px] bg-[var(--color-primary-light-1)] border-[#4ebaee] border px-1 rounded">
              UID:{{ user.uid }}
            </div>
          </div>
        </div>
      </div>


      <div class="flex justify-end mt-10" v-if="table.count">
        <a-pagination :simple="store.is_mobile" :total="table.count" v-model:current="params.page"
                      v-model:page-size="params.size" show-page-size :page-size-options="[20, 40, 100]" show-jumper
                      @change="change_table" @pageSizeChange="refresh_table"/>
      </div>
      <div v-else class="flex justify-center items-center h-[57px]">
        没有查询到结果
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {client} from "@/assets/lib/request";
import {UseStore} from "@/store";
import {safeBack} from "@/router";
import {assertNotEmpty, flat_query} from "@/assets/lib/utils";

const route = useRoute()
const router = useRouter()
const store = UseStore()
if (!route.query.name) safeBack("/user/top")

const name = ref<string>(assertNotEmpty(flat_query(route.query.name), "搜索内容为空"))
const params = ref({
  page: 1,
  size: 20
})
const bar = ref<{
  loading: boolean
  user: User | null
}>({
  loading: false,
  user: null
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

const get_bar_data = async () => {
  bar.value.loading = true
  try {
    const res = await client.get<User>({url: `/user/${name.value}`})
    if (res.msg !== "error") {
      bar.value.user = res.data
    } else {
      bar.value.user = null
    }
  } finally {
    bar.value.loading = false
  }
}

const get_table_data = async () => {
  table.value.loading = true
  try {
    const res = await client.get<{
      count: number
      results: User[]
    }>({url: "/user/search", params: {name: name.value, ...params.value}})
    table.value.count = res.data.count
    table.value.users = res.data.results
  } finally {
    table.value.loading = false
  }
}

const change_table = async (page: number) => {
  params.value.page = page
  await get_table_data()
}

const refresh_table = async () => {
  params.value.page = 1
  await get_table_data()
}

const to_detail = (user: User) => {
  router.push(`/user/${user.uid}`)
}

watch(() => route.query.name, async () => {
  if (!route.query.name) return
  const new_name = assertNotEmpty(flat_query(route.query.name), "搜索内容为空")
  if (name.value !== new_name) {
    name.value = new_name
    await Promise.all([
      get_bar_data(),
      get_table_data()
    ])
  }
})

Promise.all([
  get_bar_data(),
  get_table_data()
])
</script>

<style scoped lang="less"></style>
