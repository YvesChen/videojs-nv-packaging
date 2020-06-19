import language from "../../const/language";
import videojs from 'video.js';
import flvjs from 'flv.js';
for (let i in language.languageMaps) {
    try {
        let _lang = i || 'en';
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

        let _data = require(`video.js/dist/lang/${_lang}.json`),
            i18nMessages = require(`../../locales/${i}.json`);
        _data['Picture-in-Picture'] = i18nMessages['Picture-in-Picture'];
        _data['Exit Picture-in-Picture'] = i18nMessages['Exit Picture-in-Picture'];
        videojs.addLanguage(_lang, _data);
    } catch (err) {
        // console.error("播放器暂无语言包:", i);
    }
}
window.videojs=videojs;
window.flvjs = flvjs;
require("videojs-flvjs/dist/videojs-flvjs");
