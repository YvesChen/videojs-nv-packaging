// 暴露组件
import player from './src/main'
player.install = vue => {
    vue.component(player.name, player)
}
export default player
