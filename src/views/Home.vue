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
    <div class="home">
        <video-player
                v-if="vds"
                :url="`http://cdn.chaofan.com/video/2020/06/03/ltyn4XZTdNUBuinFLcpYoZYhSXvJ`"
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
