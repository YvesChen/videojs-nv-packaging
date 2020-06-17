// 暴露组件
import videoPlayer from './src/main'
videoPlayer.install = vue => {
    vue.component(videoPlayer.name, videoPlayer)
}
export default videoPlayer
