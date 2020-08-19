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
                :url="`https://v.wyljc.com/live/sd-2-3555578-stream/playlist.m3u8?wsSecret=b6dcda6508bd80b46c85901b0f2c2dea&wsABSTime=5f3ca00d`"
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
