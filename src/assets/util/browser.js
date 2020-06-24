const browser =()=> {
    // $.browser方法扩展
    let ua = navigator.userAgent.toLowerCase(),

        // 增加了IE11的判断
        _msie =(/msie/.test(ua) || /trident/.test(ua)) && !/opera/.test(ua),
        _browser = {
            version: (ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
            safari: /webkit/.test(ua),
            opera: /opera/.test(ua),
            mozilla: /mozilla/.test(ua) && !/(compatible|webkit)/.test(ua),
            msie:_msie,
            isIE6: (_msie  && _browser.version == 6) ? true : false,
            IEMode: (function() {
                if (_msie) {
                    if (document.documentMode) {
                        // >=IE8
                        return document.documentMode;
                    }
                    if (document.compatMode && document.compatMode == 'CSS1Compat') {
                        return 7;
                    }
                    // quirks mode
                    return 5;
                }
                return 0;
            })(),
            isIEMax8: function() {
                var me = this,
                    mode = me.IEMode;
                if (mode > 0 && mode < 9) {
                    return true;
                } else {
                    return false;
                }
            },
            isIPad: (/iPad/i).test(navigator.userAgent),
            isAndroid: (/Android/i).test(navigator.userAgent),
            isIPhone: (/iPhone/i).test(navigator.userAgent),
            isSymbian: (/SymbianOS/i).test(navigator.userAgent),
            isWP: (/Windows Phone/i).test(navigator.userAgent),
            isIPod: (/iPod/i).test(navigator.userAgent),
            isWin: (/Windows/i).test(navigator.userAgent),
            isMac: (/Mac OS X/i).test(navigator.userAgent),
            isLinux: (/Linux/i).test(navigator.userAgent),
            isWechat: (/micromessenger/i).test(navigator.userAgent.toLowerCase()),
            isQQ: (/\sQQ/i).test(navigator.userAgent.toLowerCase()),
            // u.match(/\sQQ/i) !== null
            isPC: function() {
                var userAgentInfo = navigator.userAgent;
                var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
                var flag = true;
                for (var i = 0; i < Agents.length; i++) {
                    if (userAgentInfo.indexOf(Agents[i]) > 0) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            },
            isMobile: function() {
                return (!this.isPC());
            },
            language: function() {
                var lang = {
                    code: AiScore.cookie.getFilter('lang') === undefined ? 0 : AiScore.cookie.getFilter('lang'),
                    name: ''
                };
                if (lang.code = 0) {
                    lang.name = 'zh-cn';
                } else if (lang.code == 1) {
                    lang.name = 'zh-tw';
                } else if (lang.code == 2) {
                    lang.name = 'us';
                }
                return lang;
            }
        };
    return _browser;
}

export default browser();
