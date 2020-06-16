import Video from 'video.js';
import watermark from 'videojs-watermark';
import 'video.js/dist/video-js.css';
import 'videojs-watermark/dist/videojs-watermark.css';
// import '../assets/iconfont/iconfont.css';
// require('../assets/iconfont/iconfont');

Video.registerPlugin('watermark', watermark);

import language from "../assets/const/language";
window.videojs=Video;


// for (let i in language.languageMaps) {
//     try {
//         let _lang = i || 'en';
//         switch (_lang) {
//             case "zht":
//                 _lang = "zh-TW";
//                 break;
//             case "zh":
//                 _lang = "zh-CN";
//                 break;
//             case "pt":
//                 _lang = "pt-BR";
//                 break;
//         }
//         let _data = require(`video.js/dist/lang/${_lang}.json`),
//             i18nMessages=require(`../assets/locales/${i}`);
//         _data['Picture-in-Picture'] = i18nMessages['Picture-in-Picture'];
//         _data['Exit Picture-in-Picture'] = i18nMessages['Exit Picture-in-Picture'];
//         videojs.addLanguage(_lang, _data);
//     } catch (err) {
//         // console.error("播放器暂无语言包:",i);
//     }
// }

import Flvjs from 'flv.js';
window.flvjs = Flvjs;
require('../util/video-util/videojs-flvjs.min');

export default ({ app, store }) => {
}
