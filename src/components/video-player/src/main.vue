<style lang="less" >
  @import "../../../assets/less/components/player";
</style>
<template>
  <div ref="playerView" class="player-view" :class="{'is-ios':isIos,'is-pc':!isMobile,'control-bar-show':controlBar=='show'}">
    <video id="videojs-flvjs-player"
         ref="videojsEle"
         class="video-js vjs-default-skin vjs-big-play-centered vjs-init-load"
         autoplay="autoplay"
         webkit-playsinline=""
         x-webkit-airplay=""
         x5-playsinline=""
         preload="preload"
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
import browser from "../../../assets/util/browser";
export default {
  name: 'video-player',
  props: {
    logo: {
      default: function() {
        return require("../../../assets/image/base/login/rlogo.png");
      }
    },
    logowidth: {
      default: function() {
        return 150;
      }
    },
    isLive: {
      default: function() {
        return true;
      }
    },
    controlBar: {
      default: function() {
        return 'show';
      }
    },
    locale: {
      default: function() {
        return "en";
      }
    },
    url: {
      default: function() {
        return "";
      }
    },
    overrideNative: {
      default: function() {
        return true;
      }
    }
  },
  components: {},
  data() {
    let me = this,
      data = {
        isMobile: false,
        initVolume: false,
        videoInit: false,
        isIos: false,
        support: 0,
        playerEvn: null,
        playerType: '',
        muted: false,
        originVolume: false,
        volume: parseFloat(window.localStorage.getItem('volume') || .5)
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
      me.isIos = browser.isIPhone || browser.isIPad || browser.isIPod;
      me.isMobile = browser.isMobile();
    } catch (e) {
      console.log(e)
    }
    setTimeout(function() {
      me.$nextTick(function() {
        me.videoLoad();
      });
    }, 200);
    window.winPlayer = me;
  },
  computed: {},
  destroyed () {
    let me = this;
    try {
      me.playerEvn.dispose();
    }catch (e) {
    }
  },
  methods: {
    reset() {
      let me = this;
      if (me.playerEvn) {
        if (me.playerEvn.isInPictureInPicture()) {
          me.playerEvn.exitPictureInPicture();
        }
        me.$refs.playerView.children[0].classList.add("vjs-waiting");
        setTimeout(function() {
          me.playerEvn.reset(); //重置 video
          me.playerEvn.src({
            src: me.url,
            type: me.playerType
          });
        }, 500);
      }
    },
    videoLoad() {
      let me = this;
      if (!me.playerEvn) {
        // 自动播放必须加此参数 muted="muted"
        let _lang = me.locale,
          controlBar = [
            { name: 'playToggle' }           // 播放按钮
          ].concat(
            me.isLive ? []:[
              { name: 'progressControl' }        // 进度条
            ]).concat([
            { name: 'volumePanel', show: true },    // 音量控制
            { name: "pictureInPictureToggle" },     // 画中画播放模式
            { name: 'FullscreenToggle' },       // 全屏
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
            { name: 'playToggle' }           // 播放按钮
          ].concat(
            me.isLive ?[]: [
              { name: 'progressControl' }        // 进度条
            ]).concat([
            { name: 'volumePanel', show: true },    // 音量控制
            { name: 'FullscreenToggle' },       // 全屏
            { name: 'Reset' }
          ]);
        }

        me.playerEvn = videojs('videojs-flvjs-player', {
          language: _lang,
          html5: {
            nativeAudioTracks: false,
            nativeVideoTracks: false,
            hls: {
              overrideNative: true,
            }
          },
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
          techOrder: ['html5', 'flvjs'],
          autoplay: true,
          controls: true,
          fluid: true, // 自适应宽高
          controlBar: {
            children: controlBar
          },
        }, onPlayerReady => {
          me.$nextTick(async() => {
            let _playControl = document.getElementsByClassName("vjs-play-control")[0],
              vjsVolumePanel = document.getElementsByClassName("vjs-volume-panel")[0],
              _replayon =document.createElement(`button`);
            _replayon.classList="vjs-control vjs-button replayon";
            _replayon.setAttribute("title",me.$t('Reload'));
            _replayon.innerHTML=`<span class="vjs-icon-placeholder icon-replayon"></span>`;
            _playControl.after(_replayon);
            if (me.isLive) {
              let _flexEle=document.createElement(`div`);
              _flexEle.style.flex="1";
              _replayon.after(_flexEle);
            }
            _replayon.onclick=()=> {
              me.reset();
            };
            if (me.isMobile) {
              vjsVolumePanel.style.width='auto';
              vjsVolumePanel.children[1].style.display="none";
            }
            me.$refs.playerView.children[0].classList.add("vjs-show-control-bar");
            me.playerEvn.on('play', function() {
              me.$refs.playerView.children[0].classList.remove("vjs-init-load");
            });
            await me.$refs.videojsEle.play().then(() => {
              console.log('可以自动播放');
              me.initVolume = true;
              me.initSetVolume();
            }).catch((err) => {
              console.log("不允许自动播放");
              me.playerEvn.volume(0);
              me.playerEvn.play();
              me.shoTipPrompt('muted-tip', document.getElementsByClassName("vjs-volume-panel")[0].children[0], me.$t('You are using mute playback'));
            });
            document.getElementsByTagName("html")[0].onclick=()=>{
              if(!me.originVolume) {
                me.initSetVolume();
              }
            };
          });
        });
        me.playerEvn.on('error', (err) => {
          me.playerEvn.errorDisplay.close();   //将错误信息不显示

          me.$nextTick(function() {
            console.error("适配播放错误")
            me.$refs.playerView.children[0].classList.remove("vjs-init-load");
            me.$refs.playerView.children[0].classList.remove("vjs-waiting");
          });
        });
        me.playerEvn.on('fullscreenchange', function() {
          if (me.playerEvn.isFullscreen_) {
            me.$refs.playerView.children[0].classList.remove("vjs-show-control-bar");
          } else {
            me.$refs.playerView.children[0].classList.add("vjs-show-control-bar");
          }
          if(document.getElementById("muted-tip")) {
            document.getElementById("muted-tip").remove()
          }
        });
        me.playerEvn.on('loadeddata', () => {
          me.$refs.playerView.children[0].classList.remove("vjs-waiting");
        });
        me.playerEvn.on("volumechange", function(val) {
          if (me.initVolume) {
            if(document.getElementById("muted-tip")) {
              document.getElementById("muted-tip").remove()
            }
            let volume = me.playerEvn.volume() || 0;
            window.localStorage.setItem('volume', volume);
          }
        });
      } else {
        me.reset();
      }
    },
    initSetVolume() {
      let me = this;
      try {
        me.originVolume = true;
        me.playerEvn.volume(me.volume || .5);
        me.playerEvn.play();
        me.closeTipPrompt();
      }catch (e) {
        ;
      }
    },
    /**
     * 显示新功能弹窗
     * me.shoTipPrompt('',$(".query-team > .tip"),'此功能已上线')
     * */
    shoTipPrompt(id, panel, text) {
      let me = this,
        tipPrompt = document.createElement(`div`),
        _closeTime=null;

      tipPrompt.setAttribute("id",id);
      tipPrompt.innerHTML=text;
      tipPrompt.classList.add("tip-prompt");

      panel.appendChild(tipPrompt);
      panel.classList.add("position-r");
      panel.classList.add("z-index-2");

      tipPrompt.onclick=(event) => {
        event.stopPropagation();
        clearTimeout(_closeTime);
        me.initSetVolume();
      };
      setTimeout(function() {
        me.initVolume = true;
        tipPrompt.classList.add('show');
        clearTimeout(_closeTime);
        _closeTime = setTimeout(function() {
          me.closeTipPrompt();
        }, 1000 * 5);
      }, 200);
    },
    closeTipPrompt(id, panel, text) {
      let tipPrompt=document.getElementsByClassName("tip-prompt")[0];
      if(tipPrompt) {
        tipPrompt.classList.add('hidden');
        tipPrompt.classList.remove('hide');
        setTimeout(function() {
          tipPrompt.remove();
        }, 600);
      }
    }
  }
}
</script>
