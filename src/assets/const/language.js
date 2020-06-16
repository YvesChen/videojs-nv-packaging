export default {
    motionType:[],
    languageMaps: {
        'en': {
            code: 'en',
            id:2,
            sortBy: 1,
            name: 'English'
        },
        'aze': {
            code: 'aze',
            id:37,
            sortBy: 2,
            name: 'Azərbaycan dili'
        },
        'id': {
            code: 'id',
            id:34,
            sortBy: 3,
            name: 'Bahasa'
        },
        'bs': {
            code: 'bs',
            id:30,
            sortBy: 4,
            name: 'Bosanski'
        },
        'cs': {
            code: 'cs',
            id:18,
            sortBy: 5,
            name: 'Česky'
        },
        'sr': {
            code: 'sr',
            id:31,
            sortBy: 6,
            name: 'Cрпски'
        },
        'da': {
            code: 'da',
            id:11,
            sortBy: 7,
            name: 'Dansk'
        },
        'de': {
            code: 'de',
            id:7,
            sortBy: 8,
            name: 'Deutsch'
        },
        'et': {
            code: 'et',
            id:22,
            sortBy: 9,
            name: 'Eesti'
        },
        'es': {
            code: 'es',
            id:4,
            sortBy: 10,
            name: 'Español'
        },
        'fr': {
            code: 'fr',
            id:6,
            sortBy: 11,
            name: 'Français'
        },
        'hr': {
            code: 'hr',
            id:25,
            sortBy: 12,
            name: 'Hrvatski'
        },
        'it': {
            code: 'it',
            id:8,
            sortBy: 13,
            name: 'Italiano'
        },
        'lv': {
            code: 'lv',
            id:27,
            sortBy: 14,
            name: 'Latviešu'
        },
        'lt': {
            code: 'lt',
            id:33,
            sortBy: 15,
            name: 'Lietuvių'
        },
        'hu': {
            code: 'hu',
            id:19,
            sortBy: 16,
            name: 'Magyar'
        },
        'nl': {
            code: 'nl',
            id:21,
            sortBy: 17,
            name: 'Nederlands'
        },
        'nn': {
            code: 'nn',
            id:13,
            sortBy: 18,
            name: 'Norsk'
        },
        'pl': {
            code: 'pl',
            id:16,
            sortBy: 19,
            name: 'Polski'
        },
        'pt': {
            code: 'pt',
            id:5,
            sortBy: 20,
            name: 'Português'
        },
        'br': {
            code: 'br',
            id:43,
            sortBy: 21,
            name: 'Português do Brasil'
        },
        'ro': {
            code: 'ro',
            id:17,
            sortBy: 22,
            name: 'Română'
        },
        'ch': {
            code: 'ch',
            id:42,
            sortBy: 23,
            name: 'Schweizerdeutsch'
        },
        'sqi': {
            code: 'sqi',
            id:39,
            sortBy: 24,
            name: 'Shqip'
        },
        'sk': {
            code: 'sk',
            id:20,
            sortBy: 25,
            name: 'Slovenčina'
        },
        'sl': {
            code: 'sl',
            id:26,
            sortBy: 26,
            name: 'Slovenščina'
        },
        'srl': {
            code: 'srl',
            id:44,
            sortBy: 27,
            name: 'Srpski'
        },
        'fi': {
            code: 'fi',
            id:28,
            sortBy: 28,
            name: 'Suomeksi'
        },
        'sv': {
            code: 'sv',
            id:12,
            sortBy: 29,
            name: 'Svenska'
        },
        'vi': {
            code: 'vi',
            id:35,
            sortBy: 30,
            name: 'Tiếng Việt'
        },
        'tr': {
            code: 'tr',
            id:24,
            sortBy: 31,
            name: 'Türkçe'
        },

        'el': {
            code: 'el',
            id:15,
            sortBy: 32,
            name: 'Ελληνικά'
        },
        'bg': {
            code: 'bg',
            id:14,
            sortBy: 33,
            name: 'Български'
        },
        'mk': {
            code: 'mk',
            id:32,
            sortBy: 34,
            name: 'русский'
        },
        'ru': {
            code: 'ru',
            id:9,
            sortBy: 35,
            name: 'русский'
        },
        'ukr': {
            code: 'ukr',
            id:40,
            sortBy: 36,
            name: 'Українська'
        },
        'ka': {
            code: 'ka',
            id:38,
            sortBy: 37,
            name: 'ქართული'
        },
        'aa': {
            code: 'aa',
            id:36,
            sortBy: 38,
            name: 'العربية'
        },
        'th': {
            code: 'th',
            id:29,
            sortBy: 39,
            name: 'ไทย'
        },
        'mm': {
            code: 'mm',
            id:41,
            sortBy: 40,
            name: 'ဗမာ'
        },
        'km': {
            code: 'km',
            id:45,
            sortBy: 41,
            name: 'ភាសាខ្មែរ'
        },
        'ja': {
            code: 'ja',
            id:10,
            sortBy: 42,
            name: '日本語'
        },
        'zht': {
            code: 'zht',
            id: 3,
            sortBy: 43,
            name: '中文繁體'
        },
        'zh': {
            code: 'zh',
            id: 3,
            sortBy: 43,
            name: '中文简体'
        },
        'ko': {
            code: 'ko',
            id:23,
            sortBy: 44,
            name: '한국어'
        },
    },
    def: function () {
        let me = this,
            data = {};
        Object.keys(me.languageMaps).forEach((i) => {
            let item = me.languageMaps[i];
            data[i] = item.id;
        });
        return data;
    },
    langStr: function () {
        let me = this,
            str = [];
        Object.keys(me.languageMaps).forEach((i) => {
            str.push(i);
        });
        return str;
    },
    WORDS: 'ABCDEFGHIJKLMNOPQRESUVWXYZ'
}
