<template>
    <div class="home">
        <video-player
                :url="`https://v.namitiyu.com/live/sd-1-3394245.flv?auth_key=1592567243-7ec12228b20911eaa45500163e00d6d1-0-b1f752e8be7cd60d69493bad6a48f8f3`"
                :isLive="true"
        ></video-player>
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
        }
    },
};
</script>
