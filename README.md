# videojs-nv-packaging

## 初始化安装
```
npm install videojs-nv-packaging
```

### 引用
```
基于vue开发的组件

import Vue from 'vue';
import playerPublic from "videojs-nv-packaging";
import "videojs-nv-packaging/lib/videojs-nv-packaging.css";

Vue.use(playerPublic);
```

### 组件调用
```
<video-player url="视频地址" logo="水印地址" logowidth="水印宽度" locale="语言" controlBar="是否强制显示控制栏" isLive="是否是直播"></video-player>

参数

```
* `options`-`参数配置`
  * `url`:          `string`            视频地址
  * `logo`:         `string`            水印地址
  * `logowidth`:    `number:150`        水印宽度(默认150px)
  * `locale`:       `string:en`         语言('en')
  * `controlBar`:   `Boole:true`        是否显示控制条(true)
  * `isLive`:       `Boole:true`        是否是直播类型(false)

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
