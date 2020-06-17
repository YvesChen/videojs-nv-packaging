import language from "../../assets/const/language";

export const Util = {
    accAdd(num1, num2) {
        var r1, r2, m;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return Math.round(num1 * m + num2 * m) / m;
    },
    setLStore: (name, content) => {
        if (!name) return;
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        window.localStorage.setItem(name, content);
    },
    getLStore: name => {
        if (!name) return;
        return window.localStorage.getItem(name);
    },
    removeLStore: name => {
        if (!name) return;
        window.localStorage.removeItem(name);
    },
    // Set the cookie
    setCookie(name, value, time, path, domain) {
        let strsec = this.getsec(time);
        let exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + path + ";domain=" + domain;
    },
    // Read cookies
    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) return unescape(arr[2]);
        else return null;
    },
    // Remove cookies
    delCookie() {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.getCookie(name);
        if (cval !== null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    formatNum: (num, len = 2) => {
        var n = len;
        var num = (num || 0) + '';
        var _flag = num < 0 ? false : true;
        var _arr = num.split('.')
        if (!_arr[1]) {
            _arr[1] = '';
            for (var i = 0; i < n; i++) {
                _arr[1] += '0';
            }
        }
        if (!!_arr[1] && _arr[1].length > n) {
            _arr[1] = _arr[1].slice(0, n)
        }
        if (!!_arr[1] && _arr[1].length < n) {
            var minus = n - _arr[1].length;
            for (var i = 0; i < minus; i++) {
                _arr[1] += '0';
            }
        }
        var result = '', counter = 0;

        _arr[0] = Math.abs(_arr[0]) + '';
        for (var i = _arr[0].length - 1; i >= 0; i--) {
            counter++;
            result = _arr[0].charAt(i) + result;
            if (!(counter % 3) && i != 0) {
                result = ',' + result;
            }
        }
        if (!_flag) {
            result = '-' + result
        }
        _arr[0] = result;
        num = (n == 0) ? _arr[0] : _arr.join('.');
        return num
    },
    swapJSON: (obj) => {
        let o = {};
        Object.keys(obj).forEach(item => {
            let key = obj[item];
            o[key] = item;
        });
        return o;
    },
    getLangVal: (url, lang = 2) => {
        let reqUrl = url.split('/').filter(item => {
            return !!item;
        })
        if (reqUrl[0] && language.languageMaps[reqUrl[0]]) {
            lang = language.languageMaps[reqUrl[0]];
        }
        return lang;
    },
    ab2str: (buf) => {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    },
    b64_to_utf8: (str) => {
        return decodeURIComponent(escape(window.atob(str)))
    },
    calculate1X2(num) {
        if (num >= 2) {
            return '+' + Math.floor((num - 1) * 100)
        } else {
            return '-' + Math.ceil(100 / Math.abs(num - 1))
        }
    },
    calculateOV_UN(num) {
        if (num >= 2) {
            return '+' + Math.floor(num * 100)
        } else {
            return '-' + Math.ceil(100 / Math.abs(num))
        }
    },
    ConverOdd(result, oddItems) {
        let me = this;
        result.oneXtwoDe = ['', '', ''];
        result.oneXtwoAm = ['', '', ''];
        result.overUnderDe = ['', '', ''];
        result.overUnderAm = ['', '', ''];
        if (oddItems && oddItems.length) {
            // 欧赔
            if (oddItems[1].odd && oddItems[1].odd.length) {
                result.oneXtwoAm = oddItems[1]['odd'].map(num => {
                    return me.calculate1X2(num);
                });
                result.oneXtwoDe = oddItems[1]['odd'].map(num => {
                    return me.formatNum(num);
                });
            }
            // 大小球
            if (oddItems[2].odd && oddItems[2].odd.length) {
                result.overUnderAm = oddItems[2]['odd'].map((num, key) => {
                    if (key == 1) {
                        return me.calculateOV_UN(num);
                    } else {
                        // 美式赔率不需要加1
                        // num = +num + 1;
                        return me.calculateOV_UN(num);
                    }
                })
                result.overUnderDe = oddItems[2]['odd'].map((num, key) => {
                    if (key == 1) {
                        return parseFloat(me.formatNum(num));
                    } else {
                        num = +num + 1;
                        return me.formatNum(num);
                    }
                });
            }
        }
        return result;
    },
    /**
     * JSON数组排序
     * it: item name  dt: int, char  od: asc, desc
     */
    sortby: function (it, dt, od) {
        var compareValues = function (v1, v2, dt, od) {
            if (dt == 'int') {
                v1 = parseInt(v1, 10);
                v2 = parseInt(v2, 10);
            } else if (dt == 'float') {
                v1 = parseFloat(v1);
                v2 = parseFloat(v2);
            }
            var ret = 0;
            if (v1 < v2) ret = 1;
            if (v1 > v2) ret = -1;
            if (od == 'desc') {
                ret = 0 - ret;
            }
            return ret;
        };
        var newdata = [];
        for (var i = 0; i < it.length; i++) {
            newdata[newdata.length] = it[i];
        }
        for (i = 0; i < newdata.length; i++) {
            var minIdx = i;
            var minData = (it !== '') ? newdata[i][it] : newdata[i];
            for (var j = i + 1; j < newdata.length; j++) {
                var tmpData = (it !== '') ? newdata[j][it] : newdata[j];
                var cmp = compareValues(minData, tmpData, dt, od);
                if (cmp < 0) {
                    minIdx = j;
                    minData = tmpData;
                }
            }
            if (minIdx > i) {
                var _child = newdata[minIdx];
                newdata[minIdx] = newdata[i];
                newdata[i] = _child;
            }
        }
        return newdata;
    },


    sortByName(list, competitionsObj, matchObj, teamObj) {
        list.sort((a, b) => {
            if (typeof a == 'string') {
                a = matchObj[a]
            }
            if (typeof b == 'string') {
                b = matchObj[b]
            }
            if (!a || !b) {
                return 0;
            }
            let compIdA = a.competition.id;
            let countryA = competitionsObj[compIdA] ? (competitionsObj[compIdA].country || {}) : {},
                weightA = competitionsObj[compIdA] ? competitionsObj[compIdA].weight : 0,
                nameA = countryA.name;
            if (!nameA) {
                return 1
            }
            let compIdB = b.competition.id;
            let countryB = competitionsObj[compIdB] ? (competitionsObj[compIdB].country || {}) : {},
                weightB = competitionsObj[compIdB] ? (competitionsObj[compIdB].weight) : 0,
                nameB = countryB.name;
            if (!nameB) {
                return -1
            }
            if (compIdA == compIdB) {
                if (a.matchTime == b.matchTime) {
                    try {
                        let nameA = a.homeName || teamObj[a.homeTeam.id].name,
                            nameB = b.homeName || teamObj[b.homeTeam.id].name
                        if (nameA > nameB) {
                            return 1
                        } else {
                            return -1
                        }
                    } catch (e) {

                    }
                } else {
                    return a.matchTime - b.matchTime;
                }
            }
            if (nameA > nameB) {
                return 1
            } else if (nameA < nameB) {
                return -1
            } else {
                return weightA - weightB
            }
        })
        return list
    },

    sortByTime(list, competitionsObj, matchObj) {
        list.sort((a, b) => {
            if (typeof a == 'string') {
                a = matchObj[a]
            }
            if (typeof b == 'string') {
                b = matchObj[b]
            }
            if (!a || !b) {
                return 0;
            }
            if (a.matchTime == b.matchTime) {
                return (competitionsObj[a.competition.id] ? competitionsObj[a.competition.id].weight : 0) -
                    (competitionsObj[b.competition.id] ? competitionsObj[b.competition.id].weight : 0)
            }
            return a.matchTime - b.matchTime
        })
        return list
    },




    sortByName_football(list, competitionsObj, matchObj, teamObj) {
        list.sort((a, b) => {
            if (typeof a == 'string') {
                a = matchObj[a]
            }
            if (typeof b == 'string') {
                b = matchObj[b]
            }
            if (!a || !b) {
                return 0;
            }
            let compIdA = a.competition.id,
                compA = competitionsObj[compIdA],
                countryA = compA ? (compA.country || {}) : {},
                weightA = compA ? (compA.weight || 0) : 0,
                nameA = countryA.name,
                isHotA = compA.isHot || false;

            if (!nameA) {
                return 1;
            }
            let compIdB = b.competition.id,
                compB = competitionsObj[compIdB],
                countryB = compB ? (compB.country || {}) : {},
                weightB = compB ? (compB.weight || 0) : 0,
                nameB = countryB.name,
                isHotB = compB.isHot || false;
            if (!nameB) {
                return -1;
            }

            function _sort(num) {
                if (nameA > nameB) {
                    return 1;
                } else if (nameA < nameB) {
                    return -1;
                } else {
                    if (weightA > weightB) {
                        return -1;
                    } else if (weightA < weightB) {
                        return 1;
                    } else {
                        if (a.matchTime == b.matchTime) {
                            try {
                                let nameA = a.homeName || teamObj[a.homeTeam.id].name,
                                    nameB = b.homeName || teamObj[b.homeTeam.id].name
                                if (nameA > nameB) {
                                    return 1
                                } else {
                                    return -1
                                }
                            } catch (e) {

                            }
                        } else {
                            return a.matchTime - b.matchTime;
                        }
                    }
                }
            }

            return _sort();
        });
        return list
    },

    sortByName_bk(arr) {
        if (arr.length == 0) return []
        let f = arr.sort((a, b) => {
            let countryA = a.competition.country || {},
                weightA = a.competition.weight || 0,
                nameA = countryA.name,
                isHotA = a.competition.isHot || false;
            if (!nameA) {
                return 1
            }
            let countryB = b.competition.country || {},
                weightB = b.competition.weight || 0,
                nameB = countryB.name,
                isHotB = b.competition.isHot || false;
            if (!nameB) {
                return -1
            }
            if ((isHotA == true && isHotB == true) || (isHotA == false && isHotB == false)) {
                if (nameA > nameB) {
                    return 1
                } else if (nameA < nameB) {
                    return -1
                } else {
                    return weightA - weightB
                }
            } else if (isHotA == true && isHotB == false) {
                return -1
            } else if (isHotA == false && isHotB == true) {
                return 1
            }
        })
        return f;
    },
    sortByTime_bk(arr) {
        if (arr.length == 0) return []
        return arr.sort((a, b) => {
            let isHotA = a.competition.isHot || false;
            let isHotB = b.competition.isHot || false;
            if ((isHotA == true && isHotB == true) || (isHotA == false && isHotB == false)) {
                if (a.list[0].matchTime != b.list[0].matchTime) {
                    return a.list[0].matchTime - b.list[0].matchTime
                } else {
                    let countryA = a.competition.country || {},
                        weightA = a.competition.weight || 0,
                        nameA = countryA.name;
                    let countryB = b.competition.country || {},
                        weightB = b.competition.weight || 0,
                        nameB = countryB.name;
                    if (weightA != weightB) {
                        return weightB - weightA
                    } else {
                        return nameA - nameB
                    }
                }
            } else if (isHotA == true && isHotB == false) {
                return -1
            } else if (isHotA == false && isHotB == true) {
                return 1
            }
        })
    },
    time_to_sec(time) {
        time = time || '';
        var s = '',
            hour = Number(time.split(':')[0]),
            min = Number(time.split(':')[1]);

        s = hour < 0 ? hour * 3600 - min * 60 : hour * 3600 + min * 60
        return -s;
    },
    date_list() {
        let now = Date.now(),
            oneDay = 86400000,
            date_list = [];
        for (let i = 1; i < 15; i++) {
            if (i < 8) {
                date_list.push(now - oneDay * (8 - i));
            } else {
                date_list.push(now + oneDay * (i - 7));
            }
        }
        date_list.splice(7, 0, now)
        return date_list;
    },
    calculateTimezone(timezone, time) {
        let t = this.time_to_sec(timezone),
            l = new Date().getTimezoneOffset() * 60,
            _date = (l - t) + (time || 0);
        return _date;
    },
    DateZoneTrnf(timezone, date) {
        let me = this,
            _date = new Date((me.calculateTimezone(timezone) + (new Date(date).getTime() / 1000)) * 1000);
        return _date;
    },
    formatTime(matchTime) {
        let date = typeof matchTime == 'object' ? matchTime : (matchTime || '').toString().length <= 10 ? new Date(matchTime * 1000) : new Date(matchTime),
            time = date.format('hh:mm'),
            day = date.format('dd'),
            month = '0' + date.getMonth();
        return `${day} ${this.$t(month)} ${time}`
    },
    formatTimeDMY(matchTime, lang) {
        let me = this,
            date = typeof matchTime == 'object' ? matchTime : (matchTime || '').toString().length <= 10 ? new Date(matchTime * 1000) : new Date(matchTime),
            day = date.format('dd'),
            month = '0' + date.getMonth(),
            year = date.getFullYear(),
            monthText = lang ? me.$i18n.messages[lang][month] || '' : me.$t(month) || '';

        return `${day} ${monthText} ${year}`
    },
    formatTimeDMYEn(matchTime) {
        let date = typeof matchTime == 'object' ? matchTime : (matchTime || '').toString().length <= 10 ? new Date(matchTime * 1000) : new Date(matchTime),
            day = date.format('dd'),
            month = '0' + date.getMonth(),
            year = date.getFullYear();
        return `${day} ${this.$t(month)} ${year}`
    },
    getLastMonthAndDay(time) {
        let nowDate = new Date(time);
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth();
        if (month == 0) {
            month = 12;
            year = year - 1;
        }
        let lastDay = new Date(year, month, 0).getTime();
        return lastDay
    },
    strForDate(val) {
        let pattern = /(\d{4})(\d{2})(\d{2})/,
            formatedDate = (val || "").toString().replace(pattern, '$1-$2-$3');
        return formatedDate;
    },
    getCurrentMonthFirstAndLastDay(date) {
        let nowDate = new Date(date);
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth();
        let firstDay = new Date(year, month, 1).getTime();
        let lastDay = new Date(year, month + 1, 1).getTime();
        return {
            firstDay,
            lastDay
        };
    },
    getNextMonthAndDay(time) {
        let nowDate = new Date(time);
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 2;
        if (month == 13) {
            month = 1;
            year = year + 1;
        }
        let lastDay = new Date(year, month, 0).getTime();
        return lastDay
    },
    array_to_object(arr, key = 'id') {
        let result = {};
        (arr || []).forEach(element => {
            result[element[key]] = element
        });
        return result;
    },
    isToday(time, timezone) {
        let me = this,
            d = new Date(time),
            todaysDate = timezone ? me.DateZoneTrnf(timezone, new Date()) : new Date();
        if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
            return true;
        } else {
            return false;
        }
    },
    isDef(v) {
        return v !== undefined && v !== null
    },
    resolvePath(lang) {
        let path = '/';
        if (lang) {
            path = '/' + lang + '/';
        }
        for (let i = 1; i < arguments.length; i++) {
            path += arguments[i].replace(/\//g, '');
        }
        return path
    },
    // generateTime: function ({countdown, tmr_ticking, tmr_secs = 0, tmr_mins = 0, tmr_updated, diffe}) {
    //     diffe = Math.round(diffe ? diffe * 1000 : 0);
    //     let dateArr = {
    //         mins: '',
    //         secs: ''
    //     };
    //     let now = new Date().getTime() - diffe,
    //         delta_time = (tmr_updated ? now - tmr_updated : 0),
    //         pass_time = tmr_mins * 60 * 1000 + tmr_secs * 1000;
    //
    //     if (pass_time < 0) {
    //         pass_time = -1;
    //     }
    //     let n = (!tmr_ticking ? pass_time : (countdown ? pass_time - delta_time : pass_time + delta_time));
    //
    //     dateArr.mins = n / 60000 >> 0;
    //     dateArr.secs = (n - dateArr.mins * 60000) / 1000 >> 0;
    //
    //     dateArr.mins = dateArr.mins < 10 && dateArr.mins >= 0 ? '0' + dateArr.mins : dateArr.mins;
    //     dateArr.secs = dateArr.secs < 10 && dateArr.secs >= 0 ? '0' + dateArr.secs : dateArr.secs;
    //     return dateArr;
    // },

    /**
     * 转换比赛时间
     */
    generateTime: function (date, diffe) {
        diffe = Math.round(diffe ? diffe * 1000 : 0);
        var dateArr = {
            mins: '',
            secs: ''
        };
        if (date == undefined) {
            return dateArr;
        }
        var tmr_ticking = parseInt(date[0]),
            countdown = parseInt(date[1]),
            tmr_updated = parseInt(date[2]) * 1000,
            tmr_mins = parseInt(date[3]),
            tmr_secs = parseInt(date[4]),
            now = new Date().getTime() - diffe,
            delta_time = (tmr_updated ? now - tmr_updated : 0),
            pass_time = tmr_mins * 60 * 1000 + tmr_secs * 1000;

        if (pass_time < 0) {
            pass_time = -1;
        }
        var n = (!tmr_ticking ? pass_time : (countdown ? pass_time - delta_time : pass_time + delta_time));

        dateArr.mins = n / 60000 >> 0;
        dateArr.secs = (n - dateArr.mins * 60000) / 1000 >> 0;

        dateArr.mins = dateArr.mins < 10 && dateArr.mins >= 0 ? '0' + dateArr.mins : dateArr.mins;
        dateArr.secs = dateArr.secs < 10 && dateArr.secs >= 0 ? '0' + dateArr.secs : dateArr.secs;
        return dateArr;
    },
    localstorage_set: (data, key, value) => {
        let obj = {};
        obj[key] = value;
        if (localStorage[data]) {
            localStorage[data] = JSON.stringify({...JSON.parse(localStorage[data]), ...obj})
        } else {
            localStorage[data] = JSON.stringify(obj)
        }
    },
    colorRgba: (sHex, alpha = 1) => {
        sHex=sHex||"";
        // 十六进制颜色值的正则表达式
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        /* 16进制颜色转为RGB格式 */
        let sColor = (sHex||"").toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                let sColorNew = '#';
                for (let i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //  处理六位的颜色值
            let sColorChange = [];
            for (let i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
            }
            // return sColorChange.join(',')
            // 或
            return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
        } else {
            let _hex=Util.rgbToHex(sColor);
            return Util.colorRgba(_hex.hex,alpha);
        }
    },
    rgbToHex: (val) => {  //RGB(A)颜色转换为HEX十六进制的颜色值
        let r, g, b, a,
            regRgba = /rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([.\d]+))?\)/,    //判断rgb颜色值格式的正则表达式，如rgba(255,20,10,.54)
            rsa = val.replace(/\s+/g, '').match(regRgba);
        if (!!rsa) {
            r = parseInt(rsa[1]).toString(16);
            r = r.length == 1 ? '0' + r : r;
            g = (+rsa[2]).toString(16);
            g = g.length == 1 ? '0' + g : g;
            b = (+rsa[3]).toString(16);
            b = b.length == 1 ? '0' + b : b;
            a = (+(rsa[5] ? rsa[5] : 1)) * 100;
            return {hex: '#' + r + g + b, alpha: Math.ceil(a)};
        } else {
            return {hex: val, alpha: 100};
        }
    },
    /**
     * 如果target(也就是FirstOBJ[key])存在，
     * 且是对象的话再去调用deepObjectMerge，
     * 否则就是FirstOBJ[key]里面没这个对象，需要与SecondOBJ[key]合并
     */
    deepObjectMerge(obj1,obj2){
        if(Object.prototype.toString.call(obj1) === '[object Object]' && Object.prototype.toString.call(obj2) === '[object Object]'){
            for(let prop2 in obj2){//obj1无值,都有取obj2
                if(!obj1[prop2]){
                    obj1[prop2] =obj2[prop2];
                }else{//递归赋值
                    obj1[prop2]=Util.deepObjectMerge(obj1[prop2],obj2[prop2]);
                }
            }
        }else if(Object.prototype.toString.call(obj1) === '[object Array]' && Object.prototype.toString.call(obj2) === '[object Array]'){
            // 两个都是数组，进行合并
            obj1=obj1.concat(obj2);
        }else{//其他情况，取obj2的值
            obj1 = obj2;
        }
        return obj1;
    },
    // 对象驼峰转换
    kebaseCase(obj,_symbol,_reverse) {
        let n_o = null;
        if (typeof obj === 'object') {
            if (!obj) return;
            n_o = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase().indexOf('array') > -1 ? [] : {};
            for (let x in obj) {
                let key = Util.strReplace(x,_symbol,_reverse);
                if (typeof obj[x] === 'object') {
                    n_o[key] = Util.kebaseCase(obj[x],_symbol,_reverse);
                } else {
                    n_o[key] = obj[x];
                }
            }
        }
        return n_o;
    },
    // 驼峰转换
    strReplace(str,_symbol,_reverse) {
        let regx = /[A-Z]/g;
        if(_reverse) {
            regx=eval("/"+(_symbol||'_')+"(\\w)/g");
            return (str||"").toString().replace(regx,function(word, key){
                let _isNaN=isNaN(parseFloat(key));
                if(!_isNaN){
                    return word;
                }else {
                    return key.toUpperCase();
                }
            });
        }else{
            return (str||"").toString().replace(regx, function (word, key) {
                return (key == 0 ? '' : '_') + (word||"").toLowerCase();
            });
        }
    },
    // 首字母转大写
    fistToUpperCase:function(str=''){
        // 只需要一行代码即可
        str = str.replace(str[0],str[0].toUpperCase());
        return str;
        // 输出：Test string
    },
    // 首字母转小写
    fistToLowerCase:function(str=''){
        // 只需要一行代码即可
        str = str.replace(str[0],str[0].toLowerCase());
        return str;
        // 输出：Test string
    },
    /**
     * 获取当前浏览器类型
     * */
    brows: function (req) {//移动终端浏览器版本信息
        let $agent = req && req.headers?req.headers['user-agent']||"":"";
        return {
            isPC: function () {
                let userAgentInfo = $agent,
                    Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'],
                    flag = true;
                for (let i = 0; i < Agents.length; i++) {
                    if (userAgentInfo.indexOf(Agents[i]) > 0) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            },
            isMobile: function () {
                return (!this.isPC());
            },
            ios: !!$agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: $agent.indexOf('Android') > -1 || $agent.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: $agent.indexOf('iPhone') > -1 || $agent.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: $agent.indexOf('iPad') > -1, //是否iPad
        }
    },
}
