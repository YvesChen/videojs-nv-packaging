<style lang="less" >
    @import "../../../assets/less/components/player";
</style>
<template>
    <div class="player-view" :class="{'is-ios':isIos,'is-pc':!isMobile,'control-bar-show':controlBar=='show'}">
        <video v-if="videoInit"
               id="videojs-flvjs-player"
               ref="videojsEle"
               class="video-js vjs-default-skin vjs-big-play-centered vjs-init-load"
               autoplay
               preload="auto"
               playsinline>
        </video>
        <img class="logo" v-if="logo" :src="logo" :style="{width:logowidth}">
    </div>
</template>

<script>
    /**
     * 加载方式
     * 1：直接加载视频连接方式
     * /player?url=http%3A%2F%2Ffed.dev.hzmantu.com%2Foa-project%2Fbce0c613e364122715270faef1874251.flv
     * 2：通过id获取视频地址
     * /player?id=j374oin3z91fgqo
     * */
    import "../../../assets/util/video-util/vue-video";
    import "../../../assets/util/jQuery.common";
    export default {
        name: 'video-player',
        props:{
            logo:{
                default: function () {
                    return require("../../../assets/image/base/login/rlogo.png");
                }
            },
            logowidth:{
                default: function () {
                    return 150;
                }
            },
            isLive:{
                default: function () {
                    return false;
                }
            },
            controlBar:{
                default: function () {
                    return 'show';
                }
            },
            locale:{
                default: function () {
                    return "en";
                }
            },
            url: {
                default: function () {
                    return "";
                }
            }
        },
        components: {},
        data() {
            let me = this,
                data = {
                    DEMO: {
                        playerPageEle: null,
                        videoEle: null
                    },
                    isMobile:false,
                    initVolume: false,
                    videoInit:false,
                    isIos:false,
                    support: 0,
                    playerEvn: null,
                    playerType: '',//decodeURIComponent(_query.playertype || ''),
                    muted: true
                };
            return data;
        },
        mounted() {
            let me = this;
            if (!me.playerType) {
                if (me.url) {
                    if (me.url.indexOf(".flv") > 0) {
                        me.playerType = "video/x-flv";
                    } else if (me.url.indexOf(".m3u8") > 0) {
                        me.playerType = "";
                    } else {
                        me.playerType = "video/mp4";
                    }
                }
            }
            try {
                me.isIos = $.browser.isIPhone || $.browser.isIPad || $.browser.isIPod;
                me.isMobile = $.browser.isMobile();
            } catch (e) {
                console.log(e)
            }
            setTimeout(function () {
                me.$nextTick(function () {
                    me.videoInit = true;
                    me.$nextTick(function () {
                        me.getElement();
                        me.videoLoad();
                    });
                });
            },200);
            window.winPlayer = me;
        },
        computed: {
        },
        methods: {
            getElement() {
                let me = this;
                me.DEMO.playerPageEle = $("#videojs-flvjs-player");
                me.DEMO.videoEle = me.DEMO.playerPageEle.find("video");
            },
            reset() {
                let me = this;
                me.getElement();
                if (me.playerEvn) {
                    if (me.playerEvn.isInPictureInPicture()) {
                        me.playerEvn.exitPictureInPicture();
                    }
                    me.DEMO.playerPageEle.addClass("vjs-waiting");
                    setTimeout(function () {
                        me.playerEvn.reset(); //重置 video
                        me.playerEvn.src({
                            src: me.url,
                            type: me.playerType
                        });
                    }, 500);
                }
            },
            videoLoad() {
                let me = this,
                    volume = parseFloat(me.$Util.getLStore('volume') || .5);

                if (!me.playerEvn) {
                    // 自动播放必须加此参数 muted="muted"
                    let _lang = me.locale,
                        controlBar = [
                            { name: 'playToggle' }                   // 播放按钮
                        ].concat(
                            me.isLive ? [
                                { name: 'progressControl' }              // 进度条
                            ] : []).concat([
                            { name: 'volumePanel', show: true },      // 音量控制
                            { name: "pictureInPictureToggle" },       // 画中画播放模式
                            { name: 'FullscreenToggle' },             // 全屏
                            { name: 'Reset' }
                        ]);
                    switch (_lang) {
                        case "zht":
                            _lang = "zh-TW";
                            break;
                        case "zh":
                            _lang = "zh-CN";
                            break;
                        case "pt":
                            _lang = "pt-BR";
                            break;
                    }
                    if (me.isMobile) {
                        controlBar = [
                            { name: 'playToggle' }                   // 播放按钮
                        ].concat(
                            me.isLive ? [
                                { name: 'progressControl' }              // 进度条
                            ] : []).concat([
                            { name: 'volumePanel', show: true },      // 音量控制
                            { name: 'FullscreenToggle' },             // 全屏
                            { name: 'Reset' }
                        ]);
                    }
                    me.playerEvn = videojs('videojs-flvjs-player', {
                        language: _lang,
                        techOrder: ['html5', 'flvjs'],
                        flvjs: {
                            mediaDataSource: {
                                isLive: false,
                                cors: true,
                                withCredentials: false,
                            },
                        },
                        sources: [{
                            src: me.url,
                            type: me.playerType
                        }],

                        autoplay: true,
                        muted: true,
                        preload: "auto",
                        controls: true,
                        fluid: true, // 自适应宽高
                        controlBar: {
                            children: controlBar
                        },
                    }, function onPlayerReady() {
                        // me.playerEvn.volume(0);
                        me.$nextTick(function() {
                            me.getElement();
                            me.playerEvn.play();
                            me.playerEvn.resetVolumeBar_();
                            let _playControl = $('.vjs-play-control'),
                                vjsVolumePanel = $(".vjs-volume-panel"),
                                _replayon = $(`<button class="vjs-control vjs-button replayon" title="${me.$t('Reload')}"><span class="vjs-icon-placeholder icon-replayon"></span></button>`);

                            _playControl.after(_replayon);
                            if (!me.isLive) {
                                _replayon.after(`<div style="flex: 1;"/>`);
                            }
                            _replayon.click(function() {
                                me.reset();
                            });
                            if (me.isMobile) {
                                vjsVolumePanel.css({ width: 'auto' }).find(".vjs-volume-control").hide();
                            }
                            me.DEMO.playerPageEle.addClass("vjs-show-control-bar");
                            me.playerEvn.volume(volume);
                            me.playerEvn.on('play', function() {
                                me.DEMO.playerPageEle.removeClass("vjs-init-load");
                            });
                            me.shoTipPrompt('muted-tip', me.DEMO.playerPageEle.find(".vjs-volume-panel button.vjs-control"), me.$t('You are using mute playback'));

                            $(".vjs-watermark-content.vjs-watermark-top-right img").width(me.logowidth);
                        });
                    });
                    me.playerEvn.on('error', (err) => {
                        me.playerEvn.errorDisplay.close();   //将错误信息不显示

                        me.$nextTick(function() {
                            me.getElement();
                            console.error("适配播放错误")
                            me.DEMO.playerPageEle.removeClass("vjs-init-load");
                            me.DEMO.playerPageEle.removeClass("vjs-waiting");
                        });
                    });
                    me.playerEvn.on('fullscreenchange', function() {
                        if (me.playerEvn.isFullscreen_) {
                            me.DEMO.playerPageEle.removeClass("vjs-show-control-bar");
                        } else {
                            me.DEMO.playerPageEle.addClass("vjs-show-control-bar");
                        }
                        $("#muted-tip").remove();
                    });
                    me.playerEvn.on('loadeddata', () => {
                        me.DEMO.playerPageEle.removeClass("vjs-waiting");
                    });
                    me.playerEvn.on("volumechange", function(val) {
                        volume = me.playerEvn.volume() || 0;
                        me.$Util.setLStore('volume', volume);
                        if (me.initVolume) {
                            $("#muted-tip").remove();
                        }
                    });
                } else {
                    me.reset();
                }
            },
            /**
             * 显示新功能弹窗
             * me.shoTipPrompt('',$(".query-team > .tip"),'此功能已上线')
             * */
            shoTipPrompt: function (id, panel, text) {
                let me = this,
                    tipPrompt = $(['<div id="' + id + '" class="tip-prompt">' + text + '</div>'].join(''));
                panel.append(tipPrompt).addClass("position-r z-index-2");
                setTimeout(function () {
                    me.initVolume = true;
                    tipPrompt.addClass('show');
                    setTimeout(function () {
                        tipPrompt.addClass('hidden').removeClass('hide');
                        setTimeout(function () {
                            tipPrompt.remove();
                        }, 600);
                    }, 1000 * 5);
                }, 200);
            },
        }
    }
</script>
