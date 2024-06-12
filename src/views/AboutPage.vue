<template>
    <div class="w-[648px] max-w-[96vw] mx-auto flex flex-col justify-start items-center">
        <a-card title="数据说明" class="w-full">
            <div class="font-bold">2023.2.16日</div>
            <div class="indent-8">
                数据来源于
                <span @click="to('https://biligank.com/')" class="cursor-pointer text-[#4ebaee]">biligank</span>,
                统计了开播时期的弹幕、礼物、留言、上舰数据
            </div>
            
            <br>

            <div class="font-bold">2023.8.29前</div>
            <div class="indent-8">
                数据来源于
                <span @click="to('https://danmakus.com/')" class="cursor-pointer text-[#4ebaee]">danmakus</span>,
                缺失2023.2.16的数据, 统计了开播时期的弹幕、礼物、留言、上舰数据
            </div>

            <br>

            <div class="font-bold">2023.8.29后</div>
            <div class="indent-8">数据由本站收集, 统计全天数据。其中2024.6.12之前的数据由旧站收集。数据仍有部分缺失, 原因如下</div>
            <div class="indent-8">一是直播弹幕不一定全部推送。 比如入场数据每分钟最多推送120条, 弹幕数据每分钟最多推送1200条(存疑), 且入场推送的上限在战鹰直播间非常容易达到, 因此数据不全面</div>
            <div class="indent-8">二是由于bug导致部分数据未记录。 主要是2023.11到2024.4只记录了戴牌用户的入场数据，以及缺失2024.6.12前上舰盲盒数据</div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
const to = (url: string) => {
    window.open(url)
}

</script>

<style scoped lang="less"></style>
