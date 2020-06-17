import Vue from 'vue';
import VueI18n from 'vue-i18n';
import language from "../const/language";
const languageJsonMap={};

for (let i in language.languageMaps) {
    try {
        let _data = require(`../locales/${i}`);
        if (!languageJsonMap[i]) {
            languageJsonMap[i] = {};
        }
        languageJsonMap[i] = _data;
    } catch (err) {
        // console.error("暂无语言包");
    }
}

Vue.use(VueI18n);
Vue.prototype.$WORDS = language.WORDS;
Vue.prototype.$languageMaps = language.languageMaps;
Vue.prototype.$languageMap = language.def();

let $i18n=new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: languageJsonMap
});
$i18n.path = (link) => {
    if ($i18n.locale === $i18n.fallbackLocale) {
        return `/${link}`;
    }
    return `/${$i18n.locale}/${link}`;
}
export default $i18n;
