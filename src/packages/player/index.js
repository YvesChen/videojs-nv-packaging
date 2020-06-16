/*
 * @Author: kuangxj
 * @Email: frankxjkuang@gmail.com
 * @Date: 2018-07-10 11:35:39
 * @Last Modified by: kaungxj
 * @Last Modified time: 2018-07-10 11:36:40
 * @Description: File desctiption
 */
import player from './player';

player.install = Vue => Vue.component(player.name, player);

export default player;
