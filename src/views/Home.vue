<style lang="less">
    .link {
        background-color: #fff;
        position: fixed;
        padding: 8px 15px;
        z-index: 2;
        color: #333;
        font-size: 12px;
        right: 10px;
        top: 10px;
        cursor: pointer;

        &:hover {
            background-color: #f5f2f0;
        }
    }
</style>
<template>
    <!--http://cdn.chaofan.com/video/2020/06/03/ltyn4XZTdNUBuinFLcpYoZYhSXvJ-->
    <div class="home">
        <video-player
                v-if="vds"
                :url="`https://v.wyljc.com/live/sd-102-65020-debug/playlist.m3u8?wsSecret=562fad1981cfb3f4d3bf63af464f2ed7&wsABSTime=5f3bb93e`"
                :isLive="true"
        ></video-player>
        <a class="link" @click="vds=!vds">重置</a>
    </div>
</template>

<script>
export default {
    name: "Home",
    components: {
    },
    data(){
        let me=this;
        return {
            vds:true
        }
    },
};
</script>
