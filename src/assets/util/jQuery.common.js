// ==================================================
// ==== AiScore v0.0.0.1 ====
// 基于jQuery v1.3.2，在旧版AiScore基础上扩展，包括以下方法集合：
// - JS原型方法扩展： String/Number/Array/Date
// - jQuery方法扩展: $.browser/$.fn
// - AiScore方法库： core/json/base/page
// ==================================================
/* String 原型方法扩展 */
window.jQuery=$;
(function($) {
    if (!$) return;
    $.extend(String.prototype, {
        _toBoolean: function () {
            return (this.toString() === 'false' || this.toString() === '' || this.toString() === '0') ? false : true;
        },
        _toNumber: function () {
            return (!isNaN(this)) ? Number(this) : this.toString();
        },
        _toRealValue: function () {
            return (this.toString() === 'true' || this.toString() === 'false') ? this._toBoolean() : this._toNumber();
        },
        trim: function () {
            return this.replace(/(^\s*)|(\s*$)/g, '');
        },
        ltrim: function () {
            return this.replace(/(^\s*)/g, '');
        },
        rtrim: function () {
            return this.replace(/(\s*$)/g, '');
        },
        trimAll: function () {
            return this.replace(/\s/g, '');
        },
        trimNoteChar: function () {
            return this.replace(/^[^\{]*\{\s*\/\*!?|\*\/[;|\s]*\}$/g, '').trim();
        },
        trimSpaceMany: function () {
            return this.replace(/\s{2,}/g, ' ').trim();
        },
        left: function (len) {
            return this.substring(0, len);
        },
        right: function (len) {
            return (this.length <= len) ? this.toString() : this.substring(this.length - len, this.length);
        },
        reverse: function () {
            return this.split('').reverse().join('');
        },
        startWith: function (start, noCase) {
            return !(noCase ? this.toLowerCase().indexOf(start.toLowerCase()) : this.indexOf(start));
        },
        endWith: function (end, noCase) {
            return noCase ? (new RegExp(end.toLowerCase() + '$').test(this.toLowerCase().trim())) : (new RegExp(end + '$').test(this.trim()));
        },
        sliceInclude: function (str) {
            return this.indexOf(str) > -1;
        },
        sliceAfter: function (str) {
            return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : '';
        },
        sliceBefore: function (str) {
            return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : '';
        },
        getByteLength: function () {
            return this.replace(/[^\x00-\xff]/ig, 'xx').length;
        },
        subByte: function (len, s) {
            if (len < 0 || this.getByteLength() <= len) {
                return this.toString();
            }
            var str = this;
            str = str.substr(0, len).replace(/([^\x00-\xff])/g, '\x241 ').substr(0, len).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241');
            return str + (s || '');
        },
        encodeURI: function (type) {
            var etype = type || 'utf',
                efn = (etype == 'uni') ? escape : encodeURIComponent;
            return efn(this);
        },
        decodeURI: function (type) {
            var dtype = type || 'utf',
                dfn = (dtype == 'uni') ? unescape : decodeURIComponent;
            try {
                var os = this.toString(),
                    ns = dfn(os);
                while (os != ns) {
                    os = ns;
                    ns = dfn(os);
                }
                return os;
            } catch (e) {
                // 备注： uni加密，再用utf解密的时候，会报错
                return this.toString();
            }
        },
        textToHtml: function () {
            return this.replace(/</ig, '&lt;').replace(/>/ig, '&gt;').replace(/\r\n/ig, '<br>').replace(/\n/ig, '<br>');
        },
        htmlToText: function () {
            return this.replace(/<br>/ig, '\r\n');
        },
        htmlEncode: function () {
            var text = this,
                re = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;',
                    '"': '&quot;'
                };
            for (var i in re) {
                text = text.replace(new RegExp(i, 'g'), re[i]);
            }
            return text;
        },
        htmlDecode: function () {
            var text = this,
                re = {
                    '&lt;': '<',
                    '&gt;': '>',
                    '&amp;': '&',
                    '&quot;': '"'
                };
            for (var i in re) {
                text = text.replace(new RegExp(i, 'g'), re[i]);
            }
            return text;
        },
        stripHtml: function () {
            return this.replace(/(<\/?[^>\/]*)\/?>/ig, '');
        },
        stripScript: function () {
            return this.replace(/<script(.|\n)*\/script>\s*/ig, '').replace(/on[a-z]*?\s*?=".*?"/ig, '');
        },
        replaceAll: function (os, ns) {
            return this.replace(new RegExp(os, 'gm'), ns);
        },
        escapeReg: function () {
            return this.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
        },
        addQueryValue: function (name, value) {
            var url = this.getPathName();
            var param = this.getQueryJson();
            var params = this.getQueryParams(name, value);
            for (var val in params) {
                if (!param[val]) param[val] = params[val];
            }
            return url + '?' + $.param(param);
        },
        addReQueryValue: function (name, value) {
            var url = this.getPathName();
            var param = this.getQueryJson();
            var params = this.getQueryParams(name, value);
            for (var val in params) {
                param[val] = params[val];
            }
            return url + '?' + $.param(param);
        },
        editQueryValue: function (name, value) {
            var url = this.getPathName();
            var param = this.getQueryJson();
            var params = this.getQueryParams(name, value);
            for (var val in params) {
                if (param[val]) param[val] = params[val] || param[val];
            }
            return url + '?' + $.param(param);
        },
        refQueryValue: function (name, value) {
            var url = this.getPathName();
            var param = this.getQueryJson();
            var params = this.getQueryParams(name, value);
            for (var val in params) {
                param[val] = params[val];
            }
            return url + '?' + $.param(param);
        },
        removeQueryValue: function (name, _window) {
            var url = this.getPathName();
            var param = this.getQueryJson();
            var params = {};
            for (var val in param) {
                if (Object.prototype.toString.apply(name) === '[object Array]') {
                    var start = false;
                    for (var i in name) {
                        if (val == name[i]) {
                            start = true;
                            break;
                        }
                    }
                    if (!start) {
                        params[val] = param[val];
                    }
                } else {
                    if (name != val) {
                        params[val] = param[val];
                    }
                }
            }
            if (_window == undefined) {
                _window = window;
            }
            _window.history.pushState("", "", url + '?' + $.param(params));
        },
        getQueryValue: function (name) {
            var reg = new RegExp("(^|&|\\?|#)" + name.escapeReg() + "=([^&]*)(&|\x24)", "");
            var match = this.match(reg);
            return (match) ? match[2] : '';
        },
        getQueryJson: function () {
            if (this.indexOf('?') < 0) return {};
            var query = this.substr(this.indexOf('?') + 1);
            if (!query) return {};
            var params = query.split('&'),
                len = params.length,
                result = {},
                key,
                value,
                item,
                param;
            for (var i = 0; i < len; i++) {
                param = params[i].split('=');
                key = param[0];
                value = param[1];
                item = result[key];
                if ('undefined' == typeof item) {
                    result[key] = value || '';
                } else if (Object.prototype.toString.call(item) == '[object Array]') {
                    item.push(value);
                } else {
                    result[key] = [item, value];
                }
            }
            return result;
        },
        getQueryParams: function (name, value) {
            var params = {};
            if (typeof(name) == 'object') {
                params = name;
            } else {
                params[name] = value;
            }
            return params;
        },
        getDomain: function () {
            if (this.startWith('http://')) return this.split('/')[2];
            return '';
        },
        getPathName: function () {
            return (this.lastIndexOf('?') == -1) ? this.toString() : this.substring(0, this.lastIndexOf('?'));
        },
        getFilePath: function () {
            return this.substring(0, this.lastIndexOf('/') + 1);
        },
        getFileName: function () {
            return this.substring(this.lastIndexOf('/') + 1);
        },
        getFileExt: function () {
            return this.substring(this.lastIndexOf('.') + 1);
        },
        parseDate: function () {
            return (new Date()).parse(this.toString());
        },
        parseJSON: function () {
            return (new Function("return " + this.toString()))();
        },
        parseAttrJSON: function () {
            var d = {},
                a = this.toString().split(';');
            for (var i = 0; i < a.length; i++) {
                if (a[i].trim() === '' || a[i].indexOf(':') < 1) continue;
                var item = a[i].sliceBefore(':').trim(),
                    val = a[i].sliceAfter(':').trim();
                if (item !== '' && val !== '') d[item.toCamelCase()] = val._toRealValue();
            }
            return d;
        },
        _pad: function (width, ch, side) {
            var str = [side ? '' : this, side ? this : ''];
            while (str[side].length < (width ? width : 0) && (str[side] = str[1] + (ch || ' ') + str[0]));
            return str[side];
        },
        padLeft: function (width, ch) {
            if (this.length >= width) return this.toString();
            return this._pad(width, ch, 0);
        },
        padRight: function (width, ch) {
            if (this.length >= width) return this.toString();
            return this._pad(width, ch, 1);
        },
        toHalfWidth: function () {
            return this.replace(/[\uFF01-\uFF5E]/g, function (c) {
                return String.fromCharCode(c.charCodeAt(0) - 65248);
            }).replace(/\u3000/g, " ");
        },
        toCamelCase: function () {
            if (this.indexOf('-') < 0 && this.indexOf('_') < 0) {
                return this.toString();
            }
            return this.replace(/[-_][^-_]/g, function (match) {
                return match.charAt(1).toUpperCase();
            });
        },
        format: function () {
            var result = this;
            if (arguments.length > 0) {
                var parameters = (arguments.length == 1 && $.isArray(arguments[0])) ? arguments[0] : $.makeArray(arguments);
                $.each(parameters, function (i, n) {
                    result = result.replace(new RegExp("\\{" + i + "\\}", "g"), n);
                });
            }
            return result;
        },
        substitute: function (data) {
            return data && typeof(data) == 'object' ? this.replace(/\{([^{}]+)\}/g, function (match, key) {
                var key = key.split('.'), value = data;
                var len = key.length;
                for (var i = 0; i < len; i++) {
                    value = value[key[i]];
                    if (!value) break;
                }
                return void 0 !== value ? '' + value : '';
            }) : this.toString();
        },
        // 将ID串转化为EAN-13
        toEAN13: function (pre) {
            var len = 12 - pre.length;
            var str = pre + ((this.length >= len) ? this.left(len) : this.padLeft(len, '0'));
            var a = 0,
                b = 0,
                c = 0,
                d = str.reverse();
            for (var i = 0; i < d.length; i++) {
                if (i % 2) {
                    b += parseInt(d.charAt(i), 10);
                } else {
                    a += parseInt(d.charAt(i), 10);
                }
            }
            if ((a * 3 + b) % 10) {
                c = 10 - (a * 3 + b) % 10;
            }
            return str + c;
        },
        toMapObject: function (sep) {
            sep = sep || '/';
            var s = this.split(sep);
            var d = {};
            var o = function (a, b, c) {
                if (c < b.length) {
                    if (!a[b[c]]) {
                        a[b[c]] = {};
                    }
                    d = a[b[c]];
                    o(a[b[c]], b, c + 1);
                }
            };
            o(window, s, 1);
            return d;
        },
        /**
         * base64编码
         */
        base64encode: function () {
            var str = this;
            if (!str) return '';
            str += '';
            if (str.length === 0) return str;
            str = escape(str);
            var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var i, b, x = [],
                padchar = map[64];
            var len = str.length - str.length % 3;
            for (i = 0; i < len; i += 3) {
                b = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
                x.push(map.charAt(b >> 18));
                x.push(map.charAt((b >> 12) & 0x3f));
                x.push(map.charAt((b >> 6) & 0x3f));
                x.push(map.charAt(b & 0x3f));
            }
            switch (str.length - len) {
                case 1:
                    b = str.charCodeAt(i) << 16;
                    x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + padchar + padchar);
                    break;
                case 2:
                    b = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8);
                    x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + map.charAt((b >> 6) & 0x3f) + padchar);
                    break;
            }
            return x.join('');
        },
        /**
         * base64解码
         */
        base64decode: function () {
            var str = this;
            if (!str) return '';
            str += '';
            var len = str.length;
            var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            if ((len === 0) || (len % 4 !== 0)) return str;
            var pads = 0;
            if (str.charAt(len - 1) === map[64]) {
                pads++;
                if (str.charAt(len - 2) === map[64]) {
                    pads++;
                }
                len -= 4;
            }
            var i, b, x = [];
            for (i = 0; i < len; i += 4) {
                b = (map.indexOf(str.charAt(i)) << 18) | (map.indexOf(str.charAt(i + 1)) << 12) | (map.indexOf(str.charAt(i + 2)) << 6) | map.indexOf(str.charAt(i + 3));
                x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff, b & 0xff));
            }
            switch (pads) {
                case 1:
                    b = (map.indexOf(str.charAt(i)) << 18) | (map.indexOf(str.charAt(i)) << 12) | (map.indexOf(str.charAt(i)) << 6);
                    x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff));
                    break;
                case 2:
                    b = (map.indexOf(str.charAt(i)) << 18) | (map.indexOf(str.charAt(i)) << 12);
                    x.push(String.fromCharCode(b >> 16));
                    break;
            }
            return unescape(x.join(''));
        },
        /**
         * utf16转utf8
         */
        utf16to8: function () {
            var str = this;
            var out = '';
            var len = str.length;
            var c;

            for (var i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        },
        /**
         * utf8转utf16
         */
        utf8to16: function () {
            var str = this;
            var out = '';
            var i = 0;
            var len = str.length;
            var c;
            var char2, char3;
            while (i < len) {
                c = str.charCodeAt(i++);
                switch (c >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        // 0xxxxxxx
                        out += str.charAt(i - 1);
                        break;
                    case 12:
                    case 13:
                        // 110x xxxx 10xx xxxx
                        char2 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                        break;
                    case 14:
                        // 1110 xxxx10xx xxxx10xx xxxx
                        char2 = str.charCodeAt(i++);
                        char3 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                        break;
                }
            }
            return out;
        },
        /**
         * 字符串转日期
         */
        strforDate: function () {
            var str = this;
            if (str.length != 8) {
                console.error('格式不正确：如19900101');
                return new Date();
            } else {
                return new Date(str.slice(0, 4) + "/" + str.slice(4, 6) + "/" + str.slice(6, 8));
            }
        },
        /**
         * 截取小数点后 N 位,长度不够自动补0
         */
        repairFixed: function (leng) {
            var val = this,
                str = 0;
            if (val.toString()) {
                if (!isNaN(val) && parseFloat(val) !== 0) {
                    var v = val.toString().split('.'),
                        decimal = (v[1] ? v[1] : ''),
                        l = leng - decimal.length;
                    for (var i = 0; i < l; i++) {
                        decimal += '0';
                    }
                    // @ts-ignore
                    str = v[0] + "." + decimal;
                }
                return str;
            } else {
                return '';
            }
        },
        /**
         * 赛选篮球比赛状态--严格
         * */
        querBktGameState: function () {
            var val = this;
            if (val == 1 || val == 10 || val == 12 || val == 11 || val == 13 || val == 14 || val == 15 || val == 16) {
                return false;
            } else {
                return true;
            }
        },
        /**
         * 赛选篮球比赛状态
         * */
        querBktGameStateStrict: function () {
            var val = this;
            if (val == 2 || val == 4 || val == 6 || val == 8 || val == 9) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 赛选篮球当前节数是否显示空
         * key循环下标，state当前比赛状态
         * */
        querBktGameStateIsNull: function (state) {
            var key = this,
                status = false;
            if (key == 0 && state == 2) {
                status = true;
            } else if (key == 1 && state == 4) {
                status = true;
            }
            if (key == 2 && state == 6) {
                status = true;
            }
            if (key == 3 && state == 8) {
                status = true;
            }
            if (key >= 4 && state == 9) {
                status = true;
            }
            return status;
        },
        /**
         * 赛选足球比赛状态--严格
         * */
        querFtbRaceTrim: function () {
            var val = this;
            if (val == 1 || val == 8 || val == 9 || val == 10 || val == 11 || val == 12) {
                return false;
            } else {
                return true;
            }
        },
        /**
         *  足球未开始模糊状态
         * */
        querFtbNoStart: function () {
            var val = parseFloat(this);
            if (val == 1 || val == 9 || val == 12 || val == 13) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 赛选足球比赛状态
         * */
        querFtbRaceTrimStrict: function () {
            var val = this;
            if (val == 2 || val == 3 || val == 4 || val == 5 || val == 6 || val == 7) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 二进制开关
         *
         'SUMMARY'  : 1 << 1,  # 概况
         'CHAT'     : 1 << 2,  # 聊天
         'STATS'    : 1 << 3,  # 比赛技术统计
         'LINEUPS'  : 1 << 4,  # 阵容
         'ODDS'     : 1 << 5,  # 赔率
         'H2H'      : 1 << 6,  # 对阵历史
         'STANDINGS': 1 << 7,  # 积分榜
         'MLIVE'    : 1 << 8,  # 动画
         'VIDEO'    : 1 << 9  # 视频
         判断n&(1<<i)是否大于0 ,其中n表示数值,i表示第几位
         * */
        transFtb:function (i) {
            var n=this;
            return n&(1<<i);
        },
        /**
         * 数字盘口转汉字型
         * */
        goal2GoalCn: function () {
            var goal=this,
                GoalCn = "平手,平/半,半球,半/一,一球,一/球半,球半,球半/两,两球,两/两球半,两球半,两球半/三,三球,三/三球半,三球半,三球半/四球,四球,四/四球半,四球半,四球半/五,五球,五/五球半,五球半,五球半/六,六球,六/六球半,六球半,六球半/七,七球,七/七球半,七球半,七球半/八,八球,八/八球半,八球半,八球半/九,九球,九/九球半,九球半,九球半/十,十球".split(",");
            if (!goal)
                return "";
            else {
                if (goal > 10 || goal < -10) return goal + "球";
                if (goal >= 0)  return GoalCn[parseInt(goal * 4)];
                else {
                    var gol=GoalCn[Math.abs(parseInt(goal * 4))];
                    if(gol) {
                        return "受" + gol;
                    }else{
                        return "";
                    }
                }
            }
        },
        /**
         * 数字盘口转数字型
         * */
        goal2GoalNum: function () {
            var goal=this,
                GoalCn2 = ["0", "0/0.5", "0.5", "0.5/1", "1", "1/1.5", "1.5", "1.5/2", "2", "2/2.5", "2.5", "2.5/3", "3", "3/3.5", "3.5", "3.5/4", "4", "4/4.5", "4.5", "4.5/5", "5", "5/5.5", "5.5", "5.5/6", "6", "6/6.5", "6.5", "6.5/7", "7", "7/7.5", "7.5", "7.5/8", "8", "8/8.5", "8.5", "8.5/9", "9", "9/9.5", "9.5", "9.5/10", "10", "10/10.5", "10.5", "10.5/11", "11", "11/11.5", "11.5", "11.5/12", "12", "12/12.5", "12.5", "12.5/13", "13", "13/13.5", "13.5", "13.5/14", "14"];
            if (!goal)
                return "";
            else {
                if (goal > 14) return goal;
                var fu=goal<0?true:false;
                goal=GoalCn2[parseInt(Math.abs(goal) * 4)];
                goal=fu?"-"+goal:goal;
                return goal;
            }
        },
        /**
         * 赛选网球比赛状态--严格
         * */
        querTennisRaceTrim: function () {
            var val=this;
            if (val == 0 || val == 1 || val>= 12) {
                return false;
            } else {
                return true;
            }
        },
        /**
         *  网球未开始模糊状态
         * */
        querTennisNoStart: function () {
            var val=parseFloat(this);
            if (val == 0 || val == 1 || val == 13 || val == 16 || val == 17) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 赛选网球比赛状态
         * */
        querTennisRaceTrimStrict: function () {
            var val=this;
            if (val == 2 || val == 3 || val == 4 || val == 5 || val == 6 || val == 7 || val == 8 || val == 9 || val == 10 || val == 11) {
                return true;
            } else {
                return false;
            }
        },
        /**
         *
         * */
        escape_str: function () {
            return this.replace(/<([\s\S]*?)>/gi, "");
        },
        /**
         * 千分位分隔符
         * */
        thousands: function () {
            var num = this.toString();   //将输入的数字转换为字符串
            if (/^-?\d+\.?\d+$/.test(num)) {  //判断输入内容是否为整数或小数
                if (/^-?\d+$/.test(num)) {    //判断输入内容是否为整数
                    num = num + ",00";   //将整数转为精度为2的小数，并将小数点换成逗号
                } else {
                    num = num.replace(/\./, ',');    //将小数的小数点换成逗号
                }

                while (/\d{4}/.test(num)) { //
                    /***
                     *判断是否有4个相连的数字，如果有则需要继续拆分，否则结束循环；
                     *将4个相连以上的数字分成两组，第一组$1是前面所有的数字（负数则有符号），
                     *第二组第一个逗号及其前面3个相连的数字；
                     * 将第二组内容替换为“,3个相连的数字，”
                     ***/
                    num = num.replace(/(\d+)(\d{3}\,)/, '$1,$2');
                }
                num = num.replace(/\,(\d*)$/, '.$1');   //将最后一个逗号换成小数点
            }
            return num;
        },
        /**
         * JSON数组排序
         * now:当前时间 old: 过去时间  od: max, min
         */
        dateComparison:function (old,od) {
            var now=this;
            old = new Date(old * 1000);
            now = new Date(now * 1000);
            old = new Date(old.setHours(0,0,0,0));
            now = new Date(now.setHours(0,0,0,0));

            var rtData = {
                stat: false,
                date: now
            }
            if(!od || od=='max') {
                if (now.getTime() > old.getTime()) {
                    rtData.stat = true;
                }
            }else if(od=='min'){
                if (now.getTime() < old.getTime()) {
                    rtData.stat = true;
                }
            }
            return rtData;
        }
    });
    $.extend(Array.prototype, (function () {
        var res = {};
        if (!Array.prototype.find) {
            Array.prototype.find = function (predicate) {
                if (this == null) {
                    throw new TypeError('Array.prototype.find called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;

                for (var i = 0; i < length; i++) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return value;
                    }
                }
                return undefined;
            };
        }
        return {find: Array.prototype.find};
    })())
})(jQuery);

/* String 数据校验相关 */
(function($) {
    if (!$) return;
    $.extend(String.prototype, {
        isIP: function () {
            var re = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
            return re.test(this.trim());
        },
        isUrl: function () {
            return (new RegExp(/^(ftp|https?):\/\/([^\s\.]+\.[^\s]{2,}|localhost)$/i).test(this.trim()));
        },
        isURL: function () {
            return this.isUrl();
        },
        isDate: function () {
            var result = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (result === null) return false;
            var d = new Date(result[1], result[3] - 1, result[4]);
            return (d.getFullYear() == result[1] && d.getMonth() + 1 == result[3] && d.getDate() == result[4]);
        },
        isTime: function () {
            var result = this.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
            if (result === null) return false;
            if (result[1] > 24 || result[3] > 60 || result[4] > 60) return false;
            return true;
        },
        // 需要测试一下
        isDateTime: function () {
            var result = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
            if (result === null) return false;
            var d = new Date(result[1], result[3] - 1, result[4], result[5], result[6], result[7]);
            return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4] && d.getHours() == result[5] && d.getMinutes() == result[6] && d.getSeconds() == result[7]);
        },
        // 整数
        isInteger: function () {
            return (new RegExp(/^(-|\+)?\d+$/).test(this.trim()));
        },
        // 正整数
        isPositiveInteger: function () {
            return (new RegExp(/^\d+$/).test(this.trim())) && parseInt(this, 10) > 0;
        },
        // 负整数
        isNegativeInteger: function () {
            return (new RegExp(/^-\d+$/).test(this.trim()));
        },
        isNumber: function () {
            return !isNaN(this);
        },
        isRealName: function () {
            return (new RegExp(/^[A-Za-z \u4E00-\u9FA5]+$/).test(this));
        },
        isLogName: function () {
            return (this.isEmail() || this.isMobile());
        },
        isEmail: function () {
            return (new RegExp(/^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/).test(this.trim()));
        },
        isMobile: function () {
            return (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.trim()));
            // return (new RegExp(/^(13|14|15|17|18)\d{9}$/).test(this.trim()));
        },
        isPhone: function () {
            return (new RegExp(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/).test(this.trim()));
        },
        isAreacode: function () {
            return (new RegExp(/^0\d{2,3}$/).test(this.trim()));
        },
        isPostcode: function () {
            return (new RegExp(/^\d{6}$/).test(this.trim()));
        },
        isLetters: function () {
            return (new RegExp(/^[A-Za-z]+$/).test(this.trim()));
        },
        isDigits: function () {
            return (new RegExp(/^[1-9][0-9]+$/).test(this.trim()));
        },
        isAlphanumeric: function () {
            return (new RegExp(/^[a-zA-Z0-9]+$/).test(this.trim()));
        },
        isValidString: function () {
            return (new RegExp(/^[a-zA-Z0-9\s.\-_]+$/).test(this.trim()));
        },
        isLowerCase: function () {
            return (new RegExp(/^[a-z]+$/).test(this.trim()));
        },
        isUpperCase: function () {
            return (new RegExp(/^[A-Z]+$/).test(this.trim()));
        },
        isChinese: function () {
            return (new RegExp(/^[\u4e00-\u9fa5]+$/).test(this.trim()));
        },
        isIDCard: function () {
            //这里没有验证有效性，只验证了格式
            var r15 = new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/);
            var r18 = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/);
            return (r15.test(this.trim()) || r18.test(this.trim()));
        },
        // 卡号校验 模10检查
        isCardNo: function (cardType) {
            var cards = {
                'UleCard': {
                    lengths: '16',
                    prefixes: '',
                    checkdigit: true
                },
                'Visa': {
                    lengths: '13,16',
                    prefixes: '4',
                    checkdigit: true
                },
                'MasterCard': {
                    lengths: '16',
                    prefixes: '51,52,53,54,55',
                    checkdigit: true
                },
                'BankCard': {
                    lengths: '16,17,19',
                    prefixes: '3,4,5,6,9',
                    checkdigit: false
                }
            };
            if (!cards[cardType]) return false;
            // remove spaces and dashes
            var cardNo = this.replace(/[\s-]/g, '');
            var cardexp = /^[0-9]{13,19}$/;
            if (cardNo.length === 0 || !cardexp.exec(cardNo)) {
                return false;
            } else {
                // strip down to digits
                cardNo = cardNo.replace(/\D/g, '');
                var modTenValid = true;
                var prefixValid = false;
                var lengthValid = false;
                // 模10检查
                if (cards[cardType].checkdigit) {
                    var checksum = 0,
                        j = 1,
                        calc;
                    for (i = cardNo.length - 1; i >= 0; i--) {
                        calc = Number(cardNo.charAt(i)) * j;
                        if (calc > 9) {
                            checksum = checksum + 1;
                            calc = calc - 10;
                        }
                        checksum = checksum + calc;
                        if (j == 1) {
                            j = 2;
                        } else {
                            j = 1;
                        }
                    }
                    if (checksum % 10 !== 0) modTenValid = false;
                }
                if (cards[cardType].prefixes === '') {
                    prefixValid = true;
                } else {
                    // 前缀字符检查
                    var prefix = cards[cardType].prefixes.split(',');
                    for (i = 0; i < prefix.length; i++) {
                        var exp = new RegExp("^" + prefix[i]);
                        if (exp.test(cardNo)) prefixValid = true;
                    }
                }
                // 卡号长度检查
                var lengths = cards[cardType].lengths.split(",");
                for (var i = 0; i < lengths.length; i++) {
                    if (cardNo.length == lengths[i]) lengthValid = true;
                }
                if (!modTenValid || !prefixValid || !lengthValid) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        isUleCard: function () {
            return this.isCardNo('UleCard');
        },
        isVisa: function () {
            return this.isCardNo('Visa');
        },
        isMasterCard: function () {
            return this.isCardNo('MasterCard');
        },
        // 判断是否为符合EAN规则的条形码串
        isValidEAN: function () {
            var code = this.trim();
            var a = 0,
                b = 0,
                c = parseInt(code.right(1), 10),
                d = code.left(code.length - 1).reverse();
            for (var i = 0; i < d.length; i++) {
                if (i % 2) {
                    b += parseInt(d.charAt(i), 10);
                } else {
                    a += parseInt(d.charAt(i), 10);
                }
            }
            return ((a * 3 + b + c) % 10) ? false : true;
        },
        // 判断是否为符合EAN-8规则的条形码串
        isEAN8: function () {
            var code = this.trim();
            return (new RegExp(/^\d{8}$/).test(code)) && code.isValidEAN();
        },
        // 判断是否为符合EAN-12规则的条形码串
        isEAN12: function () {
            var code = this.trim();
            return (new RegExp(/^\d{12}$/).test(code)) && code.isValidEAN();
        },
        // 判断是否为符合EAN-13规则的条形码串
        isEAN13: function () {
            var code = this.trim();
            return (new RegExp(/^\d{13}$/).test(code)) && code.isValidEAN();
        },
        // 判断是否为符合ISBN-10规则的条形码串
        isISBN10: function () {
            var code = this.trim();
            if (!new RegExp(/^\d{9}([0-9]|X|x)$/).test(code)) return false;
            var a = 0,
                b = code.right(1),
                c = code.reverse();
            for (var i = 1; i < c.length; i++) {
                a += parseInt(c.charAt(i), 10) * (i + 1);
            }
            if (b == 'X' || b == 'x') b = 10;
            return ((a + parseInt(b, 10)) % 11) ? false : true;
        },
        isISBN: function () {
            return this.isEAN13();
        },
        isEANCode: function () {
            return this.isEAN8() || this.isEAN12() || this.isEAN13() || this.isISBN10();
        }
    });
})(jQuery);

/* Number 原型方法扩展 */
(function($) {
    if (!$) return;
    $.extend(Number.prototype, {
        // 添加逗号分隔，返回为字符串
        comma: function (length) {
            if (!length || length < 1) length = 3;
            var source = ('' + this).split('.');
            source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{' + length + '})+$)', 'ig'), '$1,');
            return source.join('.');
        },
        // 生成随机数
        randomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        // 左侧补齐，返回为字符串
        padLeft: function (width, ch) {
            return ('' + this).padLeft(width, ch);
        },
        // 右侧补齐，返回字符串
        padRight: function (width, ch) {
            return ('' + this).padRight(width, ch);
        },
        /**
         * 日期自动补位
         */
        dateSeats: function () {
            var str = this;
            if (str >= 0 && str < 10) {
                str = "0" + str;
            }
            return str.toString();
        },
        counter: function (options) {
            var that = this;
            that.options = {
                endNumber: 0,
                startNumber: 0,
                derationTime: 0,
                fixed: 0,
                bonusInterval: null,
                callback: null,
                end: null
            }
            for (var i in options) {
                that.options[i] = options[i]
            }
            that.options.endNumber = that;
            that.options.startNumber = (!that.options.startNumber ? 0 : parseFloat(that.options.startNumber.toString().split(',').join('')));
            if (parseFloat(that.options.endNumber) == that.options.startNumber) {
                if (that.options.callback) that.options.callback(that.options.startNumber);
            } else {
                var progressTime = 0;
                that.options.bonusInterval = setInterval(function () {
                    progressTime += 1;
                    var jg = that.options.startNumber += ((progressTime / that.options.derationTime) * (that.options.endNumber - that.options.startNumber));
                    jg = parseFloat(jg).toFixed(that.options.fixed);
                    if (that.options.callback) that.options.callback(jg);
                    if (jg >= that) {
                        if (typeof that.options.end == "function") {
                            that.options.end(that.options.endNumber);
                        }
                        clearInterval(that.options.bonusInterval);
                    }
                }, 1);
            }
            return that;
        },
        toFixeds: function (How) {
            var Dight = this;
            Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
            return Dight;
        }
    });
})(jQuery);

/* Array 原型方法扩展 */
(function($) {
    if (!$) return;
    $.extend(Array.prototype, {
        // 删除指定内容项
        remove: function (item, it) {
            this.removeAt(this.indexOf(item, it));
        },
        // 删除指定内容项
        removeAt: function (idx) {
            if (idx >= 0 && idx < this.length) {
                for (var i = idx; i < this.length - 1; i++) {
                    this[i] = this[i + 1];
                }
                this.length--;
            }
        },
        // 清除空字符串内容
        removeEmpty: function () {
            var arr = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i].trim() !== '') {
                    arr.push(this[i].trim());
                }
            }
            return arr;
        },
        // 添加内容，比push多一个检查相同内容部分
        add: function (item) {
            if (this.indexOf(item) > -1) {
                return false;
            } else {
                this.push(item);
                return true;
            }
        },
        // 数组数据交换
        swap: function (i, j) {
            if (i < this.length && j < this.length && i != j) {
                var item = this[i];
                this[i] = this[j];
                this[j] = item;
            }
        },
        // 过滤重复数据
        unique: function () {
            var a = [],
                o = {},
                i,
                v,
                len = this.length;
            if (len < 2) return this;
            for (i = 0; i < len; i++) {
                v = this[i];
                if (o[v] !== 1) {
                    a.push(v);
                    o[v] = 1;
                }
            }
            return a;
        },
        // 判断数组是否为空
        qunull: function () {
            var len = this.length,
                v,
                stat = false;
            for (i = 0; i < len; i++) {
                v = this[i];
                if (v != '' && v != undefined && v != null) {
                    stat = true;
                }
            }
            return stat;
        },
        // JSON数组排序
        // it: item name  dt: int, char  od: asc, desc
        sortbyTow: function (it, dt, od) {
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
            for (var i = 0; i < this.length; i++) {
                newdata[newdata.length] = this[i];
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
        // 数组求和
        sum: function () {
            var sum = 0;
            if ($.isArray(this)) {
                for (var i = 0; i < this.length; i++) {
                    sum += this[i];
                }
            }
            return sum;
        },
        // 统计转百分比
        statisticalToBar: function () {
            var me = this;
            if (me.length < 2) {
                console.error('数组格式错误');
                return [];
            }
            var bs = 100 / (parseFloat(me[0]) + parseFloat(me[1]));
            bs = (bs == 'Infinity' ? 0 : bs );
            var bsStar = bs == 0 ? 50 : bs * me[0],
                bsEnd = bs == 0 ? 50 : bs * me[1];
            return [bsStar, bsEnd, bs];
        },
        // 字符串转数值型
        strToFloat: function () {
            var me = this;
            var arr = [];
            for (var i = 0; i < me.length; i++) {
                arr.push(me[i]?parseFloat(me[i]):"");
            }
            return arr;
        },
        /**
         * 返还率
         * data:[主，盘口，客]
         * A*B*C / (A*B+B*C+A*C)
         * */
        footBallreturnRates: function () {
            var data=this,
                val = parseFloat(data[0] * data[1] * data[2] / (data[0] * data[1] + data[1] * data[2] + data[0] * data[2]));
            return val;
        },
        /**
         * 指数率
         * data:[主，盘口，客]
         * $ABC=$A*$B*$C;
         * $AB=$A*$B;
         * $AC=$A*$C;
         * $BC=$B*$C;
         * $ABC/($A*($AB+$AC+$BC))
         * */
        footBalloddsRate: function (num) {
            var data=this,
                $ABC=data[0]*data[1]*data[2],
                $AB=data[0]*data[1],
                $AC=data[0]*data[2],
                $BC=data[1]*data[2],
                val=parseFloat($ABC/(num*($AB+$AC+$BC)));
            return val;
        },
        /**
         * 盘路
         * data:[主，客，亚盘值]
         * A-B-C
         * */
        footBallPanlu: function () {
            var data=this;
            return data[0]-data[1]-(data[2]);
        },
        /**
         * 大小
         * data:[主，客，亚盘值]
         * A-B-C
         * */
        footBallSize: function () {
            var data=this;
            return data[0]+data[1]-(data[2]);
        },
    });
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
                from += len;
            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
})(jQuery);

/* Date 原型方法扩展 */
(function($) {
    if (!$) return;
    $.extend(Date.prototype, {
        // 时间读取
        parse: function (time) {
            if (typeof(time) == 'string') {
                if (time.indexOf('GMT') > 0 || time.indexOf('gmt') > 0 || !isNaN(Date.parse(time))) {
                    return this._parseGMT(time);
                } else if (time.indexOf('UTC') > 0 || time.indexOf('utc') > 0 || time.indexOf(',') > 0) {
                    return this._parseUTC(time);
                } else {
                    return this._parseCommon(time);
                }
            }
            return new Date();
        },
        _parseGMT: function (time) {
            this.setTime(Date.parse(time));
            return this;
        },
        _parseUTC: function (time) {
            return (new Date(time));
        },
        _parseCommon: function (time) {
            var d = time.split(/ |T/),
                d1 = d.length > 1 ? d[1].split(/[^\d]/) : [0, 0, 0],
                d0 = d[0].split(/[^\d]/);
            return new Date(d0[0] - 0, d0[1] - 1, d0[2] - 0, (d1[0] || 0) - 0, (d1[1] || 0) - 0, (d1[2] || 0) - 0);
        },
        // 复制时间对象
        clone: function () {
            return new Date().setTime(this.getTime());
        },
        // 时间相加
        dateAdd: function (type, val) {
            var _y = this.getFullYear();
            var _m = this.getMonth();
            var _d = this.getDate();
            var _h = this.getHours();
            var _n = this.getMinutes();
            var _s = this.getSeconds();
            switch (type) {
                case 'y':
                    this.setFullYear(_y + val);
                    break;
                case 'm':
                    this.setMonth(_m + val);
                    break;
                case 'd':
                    this.setDate(_d + val);
                    break;
                case 'h':
                    this.setHours(_h + val);
                    break;
                case 'n':
                    this.setMinutes(_n + val);
                    break;
                case 's':
                    this.setSeconds(_s + val);
                    break;
            }
            return this;
        },
        // 时间相减
        dateDiff: function (date) {
            var diff = date - this,
                week= parseInt(diff / 1000 / 3600 / 24 / 7),
                days = parseInt(diff / 1000 / 60 / 60 / 24, 10), //计算剩余的天数
                hours = parseInt(diff / 1000 / 60 / 60 % 24, 10), //计算剩余的小时
                minutes = parseInt(diff / 1000 / 60 % 60, 10),//计算剩余的分钟
                seconds = parseInt(diff / 1000 % 60, 10);//计算剩余的秒数
            return {
                week: Math.abs(week),
                day: Math.abs(days),
                hours: Math.abs(hours),
                minutes: Math.abs(minutes),
                seconds: Math.abs(seconds)
            }


            // switch (type) {
            //     case 'w':
            //         return diff / 1000 / 3600 / 24 / 7;
            //     case 'd':
            //         return diff / 1000 / 3600 / 24;
            //     case 'h':
            //         return diff / 1000 / 3600;
            //     case 'n':
            //         return diff / 1000 / 60;
            //     case 's':
            //         return diff / 1000;
            // }
        },
        /**
         * 输出8位日期
         */
        outputDate: function () {
            var date = new Date(this);
            if (date == NaN) {
                console.error('传参格式不正确，必须是日期格式');
                date = new Date();
            }
            var month = date.getMonth() + 1,
                day = date.getDate();
            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            return date.getFullYear() + "" + month + "" + day;
        },
        /**
         * 字符串转日期
         */
        toDate: function () {
            var date = new Date(this);
            return {
                date: date,
                year: date.getFullYear(),
                month: (date.getMonth() + 1).dateSeats(),
                day: date.getDate().dateSeats(),
                hours: date.getHours().dateSeats(),
                minutes: date.getMinutes().dateSeats(),
                zoomDate: new Date(date).setHours(0, 0, 0, 0)
            }
        },
        getDates:function () {
            var date = new Date(this).toDate();
            return new Date(date.year+"/"+date.month+"/"+date.day);
        }
    });
})(jQuery);

/* jQuery方法扩展: $.browser/$.fn */
(function($) {
    if (!$) return;
    // $.browser方法扩展
    var ua = navigator.userAgent.toLowerCase();
    if (!$.browser) {
        $.browser = {
            version: (ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
            safari: /webkit/.test(ua),
            opera: /opera/.test(ua),
            mozilla: /mozilla/.test(ua) && !/(compatible|webkit)/.test(ua)
        };
    }
    // 增加了IE11的判断
    $.browser.msie = (/msie/.test(ua)||/trident/.test(ua)) && !/opera/.test(ua);
    $.extend($.browser, {
        isIE6: ($.browser.msie && $.browser.version == 6) ? true: false,
        IEMode: (function() {
            if ($.browser.msie) {
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
        isIEMax8:function () {
            var me = this,
                mode = me.IEMode;
            if(mode>0 && mode<9){
                return true;
            }else{
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
        isPC: function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
            var flag = true;
            for (var i = 0; i < Agents.length; i++) {
                if (userAgentInfo.indexOf(Agents[i]) > 0) { flag = false; break; }
            }
            return flag;
        },
        isMobile: function () {
            return (!this.isPC());
        },
        language: function() {
            var lang={
                code:AiScore.cookie.getFilter('lang')===undefined?0:AiScore.cookie.getFilter('lang'),
                name:''
            };
            if(lang.code=0){
                lang.name='zh-cn';
            }else if(lang.code==1){
                lang.name='zh-tw';
            }else if(lang.code==2){
                lang.name='us';
            }
            return lang;
        }
    });

    // 获取tagName
    $.fn.tagName = function() {
        if (this.length === 0) return '';
        if (this.length > 1) {
            var tagNames = [];
            this.each(function(i, el) {
                tagNames.push(el.tagName.toLowerCase());
            });
            return tagNames;
        } else {
            return this[0].tagName.toLowerCase();
        }
    };
    // 获取select的文本
    $.fn.optionText = function() {
        if (this.length === 0) return '';
        var sel = this[0];
        if (sel.selectedIndex === -1) return '';
        return sel.options[sel.selectedIndex].text;
    };
    // 获取element属性的JSON值
    $.fn.attrJSON = function(attr) {
        return (this.attr(attr || 'rel') || '').parseAttrJSON();
    };
    // 只能输入数字
    $.fn.inputNumber = function () {
        if (this.length === 0 || !AiScore) return this;
        var elm = this;
        $('body').delegate(elm, 'keypress', function (e) {
            var e = e || window.event;
            var c = e.keyCode || e.which;
            if ((c < 48 || c > 57) && c != 8) {
                return false;
            }
        });
    };
    // 下拉框事件
    $.fn.selectbox = function (value, callback) {
        if (this.length === 0 || !AiScore) return this;
        if (typeof value == 'function') {
            callback = value;
        }
        $(this).each(function () {
            var that = $(this),
                name = that.find(".tip .name"),
                downlist = that.find('.down ul li');
            downlist.each(function () {
                var et=$(this),
                    val=et.attr('data-value');
                if(val==value){
                    name.html(et.html());
                    that.attr('data-value',val);
                    et.addClass('active').siblings('li').removeClass('active');
                }
                et.unbind().click(function () {
                    var ct = $(this);
                    name.html(ct.html());
                    ct.addClass('active').siblings('li').removeClass('active');
                    if (callback) callback(ct);
                });
            })
        });
    };
    $.fn.setCheck = function () {
        var that=$(this);
        if(that.hasClass('active')){
            that.removeClass('active');
        }else{
            that.addClass('active');
        }
    }
    // 判断是否为空
    $.fn.nulls = function () {
        if(this.val()==""){
            return true;
        };
        return false;
    };
})(jQuery);

// 初始化命名空间
(function($) {
    if (!$) return;
    if (!window.AiScore) window.AiScore = {};

    // AiScore.namespace 命名空间
    AiScore.namespace = function (name, sep) {
        var s = name.split(sep || '.'),
            d = {},
            o = function (a, b, c) {
                if (c < b.length) {
                    if (!a[b[c]]) {
                        a[b[c]] = {};
                    }
                    d = a[b[c]];
                    o(a[b[c]], b, c + 1);
                }
            };
        o(window, s, 0);
        return d;
    };

    // 模块方法定义，其中callback为定义后需要附加执行的处理
    AiScore.define = function (name, value, callback) {
        var obj = this,
            item = name;
        if (name.indexOf('.') > 0) {
            var a = name.split('.');
            item = a.pop();
            var source = a.join('.');
            obj = AiScore.namespace(source);
        }
        if (obj[item]) return;
        obj[item] = value;
        if (callback) callback();
        AiScore.debug('AiScore.define', name, 'info');
    };

    // 类似domready的处理，用以延迟部分方法的执行
    AiScore.ready = function (callback) {
        AiScore.ready.addEvent(callback);
    };
    $.extend(AiScore.ready, {
        events: [],
        addEvent: function (callback) {
            if (!this.events) {
                callback();
                return;
            }
            this.events.push(callback);
        },
        exeEvents: function () {
            if (!this.events) return;
            for (var i = 0; i < this.events.length; i++) {
                this.events[i]();
            }
            this.events = null;
        }
    });

    // AiScore.debug 过程调试
    AiScore.debug = function (a, b, type) {
        if (!this.debugMode) return;
        type = type || 'log';
        if (window.console && console[type]) {
            console[type](new Date().format('hh:nn:ss.S') + ', ' + a, ' = ', b);
        } else {
            AiScore.debug.log(new Date().format('hh:nn:ss.S') + ', ' + a + ' = ' + b);
        }
    };
    $.extend(AiScore.debug, {
        log: function () {
            this.createDOM();
            var p = [],
                v = $('#_jend_debuglog textarea').val();
            for (var i = 0; i < arguments.length; i++) {
                p.push(arguments[i]);
            }
            v += (v === '' ? '' : '\n') + p.join(' ');
            $('#_jend_debuglog textarea').val(v);
        },
        clear: function () {
            $('#_jend_debuglog textarea').val('');
        },
        createDOM: function () {
            if ($('#_jend_debuglog').length === 0) {
                var _html = '<div id="_jend_debuglog" style="position:fixed;bottom:0;left:0;right:0;_position:absolute;_bottom:auto;_top:0;padding:5px 0 5px 5px;border:solid 5px #666;background:#eee;z-index:1000;"><textarea style="font-size:12px;line-height:16px;display:block;background:#eee;border:none;width:100%;height:80px;"></textarea><a style="text-decoration:none;display:block;height:80px;width:20px;text-align:center;line-height:16px;padding:5px 0;_padding:6px 0;background:#666;color:#fff;position:absolute;right:-5px;bottom:0;" href="#">关闭调试器</a></div>';
                $('body').append(_html);
                $('#_jend_debuglog a').click(function () {
                    $(this).parent().remove();
                    return false;
                });
                $('#_jend_debuglog textarea').focus(function () {
                    this.select();
                });
            }
        }
    });
    // 判断对象是否为数组
    AiScore.isEmptyValue = function (value) {
        var type;
        if (value == null) { // 等同于 value === undefined || value === null
            return true;
        }
        type = Object.prototype.toString.call(value).slice(8, -1);
        switch (type) {
            case 'String':
                return !$.trim(value);
            case 'Array':
                return !value.length;
            case 'Object':
                return $.isEmptyObject(value); // 普通对象使用 for...in 判断，有 key 即为 false
            default:
                return false; // 其他对象均视作非空
        }
    }

    // AiScore.load/AiScore.loader 加载管理
    AiScore.load = function (service, action, params) {
        if ($.isArray(service)) {
            var url = service.join(',');
            var urlsize = service.length;
            var status = AiScore.loader.checkFileLoader(url);
            if (status == urlsize + 1) {
                if (typeof(action) == 'function') action();
            } else if (status > 0) {
                AiScore.loader.addExecute(url, action);
            } else if (status === 0) {
                AiScore.loader.addExecute(url, action);
                AiScore.debug('开始加载JS', url);
                AiScore.loader.fileLoader[url] = 1;
                for (var i = 0; i < urlsize; i++) {
                    AiScore.load(service[i], function () {
                        AiScore.loader.fileLoader[url]++;
                        if (AiScore.loader.fileLoader[url] == urlsize + 1) {
                            AiScore.debug('完成加载JS', url);
                            AiScore.loader.execute(url);
                        }
                    });
                }
            }
        } else if (AiScore.loader.serviceLibs[service] && AiScore.loader.serviceLibs[service].requires) {
            AiScore.load(AiScore.loader.serviceLibs[service].requires, function () {
                AiScore.load.run(service, action, params);
            });
        } else {
            AiScore.load.run(service, action, params);
        }
    };
    $.extend(AiScore.load, {
        setPath: function (path) {
            AiScore.loader.serviceBase = path;
        },
        add: function (key, data) {
            var that=this;
            if (AiScore.loader.serviceLibs[key]) return;
            function eachJs(js) {
                if (js && (!js.startWith('http')) && that.version) {
                    js = js.addQueryValue('v', this.version);
                }
                return js;
            }
            if(data.js instanceof Array) {
                $.each(data.js,function (i,item) {
                    data.js[i]=eachJs(item);
                });
            }else{
                data.js=eachJs(data.js);
            }
            if (data.css) {
                if(data.css instanceof Array){
                    $.each(data.css,function (i,item) {
                        if((!item.startWith('http')) && that.version) {
                            item = item.addQueryValue('v', that.version);
                        }
                    });
                }else{
                    if((!data.css.startWith('http')) && this.version) {
                        data.css = data.css.addQueryValue('v', this.version);
                    }
                }
            }
            AiScore.loader.serviceLibs[key] = data;
        },
        run: function (service, act, params) {
            var action = (typeof(act) == 'string') ? (function () {
                try {
                    var o = eval('AiScore.' + service);
                    if (o && o[act]) o[act](params);
                } catch (e) {
                }
            }) : (act || function () {
            });
            if (AiScore.loader.checkService(service)) {
                action();
                return;
            }
            var url = AiScore.loader.getServiceUrl(service);
            var status = AiScore.loader.checkFileLoader(url);
            // status:-1异常, 0未加载, 1开始加载, 2完成加载
            if (status === 2) {
                action();
                if (params != undefined && typeof params.callback == "function") {
                    params.callback();
                }
            } else if (status === 1) {
                AiScore.loader.addExecute(url, action);
            } else if (status === 0) {
                if ($('script[src="' + url + '"]').length > 0) {
                    AiScore.loader.fileLoader[url] = 2;
                    action();
                } else {
                    AiScore.loader.addExecute(url, action);
                    AiScore.loader.addScript(service);
                }
            } else {
                AiScore.debug('加载异常', service);
            }
        },
        loadeHtml: function (url, callback, error) {
            AiScore.load(['xdomainrequest'], function () {
                jQuery.support.cors = true;
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    success: function (data) {
                        if (callback) callback(data);
                    },
                    error: function (err) {
                        console.error(err);
                        if (error) error(err);
                    }
                });
            });
        }
    });
    AiScore.define('AiScore.loader', {
        fileLoader: {},
        executeLoader: {},
        serviceBase: (function () {
            return '';
        })(),
        serviceLibs: {},
        checkFullUrl: function (url) {
            return (url.indexOf('/') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0);
        },
        checkService: function (service) {
            if (this.checkFullUrl(service)) return false;
            try {
                if (service.indexOf('.') > 0) {
                    var o = eval('AiScore.' + service);
                    return (typeof(o) != 'undefined');
                }
                return false;
            } catch (e) {
                return false;
            }
        },
        checkFileLoader: function (url) {
            return (url !== '') ? (this.fileLoader[url] || 0) : -1;
        },
        getServiceUrl: function (service) {
            var url = '';
            if (this.checkFullUrl(service)) {
                url = service;
            } else if (this.serviceLibs[service]) {
                if (!this.serviceLibs[service].js) {
                    url = (this.checkFullUrl(this.serviceLibs[service].css)) ? this.serviceLibs[service].css : (this.serviceBase + this.serviceLibs[service].css);
                } else {
                    url = (this.checkFullUrl(this.serviceLibs[service].js)) ? this.serviceLibs[service].js : (this.serviceBase + this.serviceLibs[service].js);
                }
            }
            return url;
        },
        execute: function (url) {
            if (this.executeLoader[url]) {
                for (var i = 0; i < this.executeLoader[url].length; i++) {
                    this.executeLoader[url][i]();
                }
                this.executeLoader[url] = null;
            }
        },
        addExecute: function (url, action) {
            if (typeof(action) != 'function') return;
            if (!this.executeLoader[url]) this.executeLoader[url] = [];
            this.executeLoader[url].push(action);
        },
        addScript: function (service) {
            var me = this,
                url;
            if (me.checkFullUrl(service)) {
                url = service;
                this.getScript(url, function () {
                    AiScore.debug('完成加载JS', url);
                    me.fileLoader[url] = 2;
                    AiScore.loader.execute(url);
                });
            } else if (me.serviceLibs[service]) {
                if (me.serviceLibs[service].css) {
                    if(me.serviceLibs[service].css instanceof Array) {
                        $.each(me.serviceLibs[service].css,function (i,item) {
                            me.setCss(item);
                        });
                    }else{
                        me.setCss(me.serviceLibs[service].css);
                    }
                }
                if (me.serviceLibs[service].js) {
                    if(me.serviceLibs[service].js instanceof Array) {
                        $.each(me.serviceLibs[service].js,function (i,item) {
                            me.setJs(item);
                        });
                    }else{
                        me.setJs(me.serviceLibs[service].js);
                    }
                }
            }

        },
        setJs:function (url) {
            var me=this;
            url = (this.checkFullUrl(url)) ? url : (this.serviceBase + url);
            me.getScript(url, function () {
                AiScore.debug('完成加载JS', url);
                me.fileLoader[url] = 2;
                AiScore.loader.execute(url);
            });
        },
        setCss:function (url) {
            var me=this;
            url = (me.checkFullUrl(url)) ? url : (me.serviceBase + url.css);
            if (!me.fileLoader[url]) {
                AiScore.debug('开始加载CSS', url);
                me.fileLoader[url] = 1;
                $('head').append('<link rel="stylesheet" type="text\/css"  href="' + url + '" \/>');
                AiScore.debug('完成加载CSS', url);
                me.fileLoader[url] = 2;
                AiScore.loader.execute(url);
            }
        },
        getScript: function (url, onSuccess, onError) {
            AiScore.debug('开始加载JS', url);
            this.fileLoader[url] = 1;
            this.getRemoteScript(url, onSuccess, onError);
        },
        getRemoteScript: function (url, param, onSuccess, onError) {
            if ($.isFunction(param)) {
                onError = onSuccess;
                onSuccess = param;
                param = {};
            }
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.src = url;
            for (var item in param) {
                if (item == 'keepScriptTag') {
                    script.keepScriptTag = true;
                } else {
                    script.setAttribute(item, param[item]);
                }
            }
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    if (onSuccess) onSuccess();
                    script.onload = script.onreadystatechange = null;
                    if (!script.keepScriptTag) head.removeChild(script);
                }
            };
            script.onerror = function () {
                if (onError) onError();
            };
            head.appendChild(script);
        },
        scriptPath:function(name) {
            var scripts = $('script');
            var path = '';
            if (scripts && scripts.length > 0) {
                scripts.each(function () {
                    var that=$(this);
                    if (that.attr('src') && that.attr('src').indexOf(name)>=0) {
                        path = that.attr('src').split(name);
                    }
                });
            }
            return path;
        }
    });

    // AiScore.timestat 时间分析
    AiScore.define('AiScore.timestat', {
        libs: {},
        loadTime: (typeof(_AiScore_page_loadtime) == 'number') ? _AiScore_page_loadtime : new Date().getTime(),
        add: function (name) {
            this.libs[name] = new Date().getTime() - this.loadTime;
        },
        get: function (name) {
            return this.libs[name] || 0;
        }
    });
})(jQuery);

/* AiScore.track */
(function($) {
    if (!$ || !window.AiScore) return;
    AiScore.namespace('AiScore.track');
    $.extend(AiScore.track, {
        // 自动设置相应js的访问源
        //scriptPath: (document.location.protocol=='https:') ? '//lo' : '//lo',
        scriptPath: AiScore.loader.scriptPath('/js')[0],
        // 统计初始化，默认加载baidu/google
        init: function(options) {
            this.options = {
                baiduUid:'b378317576aa380c368a0a4a90072dc5',
                baidu: false,
                googleUid:'',
                google: false
            }
            for(var i in options){
                this.options[i]=options[i];
            }
            if (this.options.baidu) {
                this.baidu.uid=this.options.baiduUid;
                this.baidu.init();
            }
            if (this.options.google) {
                this.google.uid=this.options.googleUid;
            	this.google.init();
            }
        },
        // 页面JS文件加载
        loadJS: function(url, isAsync) {
            if (isAsync) {
                AiScore.loader.getRemoteScript(url, { async:true, keepScriptTag:true });
            } else {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement("script");
                script.type = 'text/javascript';
                script.charset = 'utf-8';
                if (url.indexOf('baidu' > -1)) script.charset = 'gbk';
                script.src = unescape(url);
                head.appendChild(script);
            }
        },
        timestat: {
            loadTime: window._AiScore_page_loadtime || 0,
            initTime: new Date().getTime(),
            datas: {},
            add: function(name) {
                this.datas[name] = new Date().getTime() - (this.loadTime || this.initTime);
            },
            get: function(name) {
                return this.datas[name] || 0;
            }
        },
        baidu: {
            // 百度uid key值
            uid: '',
            setUid: function(uid) {
                this.uid = uid;
            },
            // 百度统计初始化, 异步加载时有问题不提交数据
            init: function(uid) {
                window._hmt = window._hmt || [];
                AiScore.track.loadJS('//hm.baidu.com/hm.js%3F'+ (uid||this.uid));
            }
        },
        google: {
            uid: '',
            setUid: function(uid) {
                this.uid = uid;
            },
            // google统计初始化
            init: function(uid) {
                AiScore.track.loadJS('//www.googletagmanager.com/gtag/js?id='+ (uid||this.uid),true);
            },
            gtag:function(){
                if(!window.dataLayer){
                    window.dataLayer=[];
                }
                if(arguments[2]){
                    arguments[2]['non_interaction']=true;
                }
                window.dataLayer.push(arguments);
            },
            initEvent: function(uid) {
                var me=this;
                uid=uid||me.uid;
                me.gtag('js', new Date());
                me.gtag('config', uid);
                me.gtag('event', 'URL', {
                    value: location.href
                });
            },
            initAw: function(uid) {
                var me=this;
                me.gtag('js', new Date());
                me.gtag('config', uid||me.uid);
            },
        }
    });
})(jQuery);
/* AiScore.cookie */
(function($) {
    if (!$ || !window.AiScore) return;

    AiScore.namespace('AiScore.cookie');
    $.extend(AiScore.cookie, {
        getRootDomain: function() {
            var d = document.domain;
            if (d.indexOf('.') > 0 && !d.isIP()) {
                var arr = d.split('.'),
                    len = arr.length,
                    d1 = arr[len - 1],
                    d2 = arr[len - 2],
                    d3 = arr[len - 3];
                d = (d2 == 'com' || d2 == 'net') ? (d3 + '.' + d2 + '.' + d1) : (d2 + '.' + d1);
            }
            return d;
        },
        load: function() {
            var tC = document.cookie.split('; ');
            var tO = {};
            var a = null;
            for (var i = 0; i < tC.length; i++) {
                a = tC[i].split('=');
                tO[a[0]] = a[1];
            }
            return tO;
        },
        get: function(name) {
            var value = this.load()[name];
            if (value) {
                try {
                    return decodeURI(value);
                } catch(e) {
                    return unescape(value);
                }
            } else {
                return false;
            }
        },
        getFilter: function (name) {
            return this.get(name)? this.filter(this.get(name)): false;
        },
        set: function(name, value, options) {
            options = (typeof(options) == 'object') ? options: {
                minute: options
            };
            var arg_len = arguments.length;
            var path = (arg_len > 3) ? arguments[3] : (options.path || '/');
            var domain = (arg_len > 4) ? arguments[4] : (options.domain || (options.root ? this.getRootDomain() : ''));
            var exptime = 0;
            if (options.day) {
                exptime = 1000 * 60 * 60 * 24 * options.day;
            } else if (options.hour) {
                exptime = 1000 * 60 * 60 * options.hour;
            } else if (options.minute) {
                exptime = 1000 * 60 * options.minute;
            } else if (options.second) {
                exptime = 1000 * options.second;
            }
            var exp = new Date(),
                expires = '';
            if (exptime > 0) {
                exp.setTime(exp.getTime() + exptime);
                expires = '; expires=' + exp.toGMTString();
            }
            domain = (domain) ? ('; domain=' + domain) : '';
            document.cookie = name + '=' + escape(value || '') + '; path=' + path + domain + expires;
        },
        del: function(name, options) {
            options = options || {};
            var path = '; path=' + (options.path || '/');
            var domain = (options.domain) ? ('; domain=' + options.domain) : '';
            if (options.root) domain = '; domain=' + this.getRootDomain();
            document.cookie = name + '=' + path + domain + '; expires=Thu,01-Jan-70 00:00:01 GMT';
        },
        filter: function (text) {
            return text.replace(/(^["])|(["]$)/g, '');
        }
    });
})(jQuery);


(function($) {
    if (!$ || !window.AiScore) return
    AiScore.server = {
        language: $.browser.language(),
        name: ''
    }
    AiScore.debug('AiScore.js','加载完成')
})(jQuery);
