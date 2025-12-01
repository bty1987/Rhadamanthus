var utils = {
    accAdd: function(arg1, arg2) {

        var r1, r2, m;

        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }

        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }

        m = Math.pow(10, Math.max(r1, r2));

        return (arg1 * m + arg2 * m) / m;
    },
    accSub: function(arg1, arg2) {

        var r1, r2, m, n;

        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }

        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }

        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;

        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    accMul: function(arg1, arg2) {

        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();

        try {
            m += s1.split(".")[1].length;
        } catch (e) {
        }

        try {
            m += s2.split(".")[1].length;
        } catch (e) {
        }

        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    accDiv: function(arg1, arg2) {

        if (arg2 == 0) {
            return 0;
        }

        var t1 = 0, t2 = 0, r1, r2;

        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {
        }

        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {
        }

        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));

        return (r1 / r2) * Math.pow(10, t2 - t1);
    },
    accExtend: function(obj, options) {

        if ($.isPlainObject(obj) && $.isArray(options)) {
            $.each(options, function(i, v) {

                cal(obj, v.split('-'));
            });
        } else if ($.isPlainObject(obj) && typeof options == "string") {
            cal(obj, options.split('-'));
        } else if ($.isNumeric(obj)) {
            return parseInt(utils.accMul(obj, 1000));
        }

        function cal(o, props) {

            var prop = props.shift();

            if (props.length == 0 && $.isNumeric(o[prop])) {
                o[prop] = parseInt(utils.accMul(o[prop], 1000));
            } else if (o[prop]) {
                cal(o[prop], props);
            }
        }

    },
    accReduce: function(obj, options) {

        if ($.isPlainObject(obj) && $.isArray(options)) {
            $.each(options, function(i, v) {

                cal(obj, v.split('-'));
            });
        } else if ($.isPlainObject(obj) && typeof options == "string") {
            cal(obj, options.split('-'));
        } else if ($.isNumeric(obj)) {
            return utils.accDiv(obj, 1000);
        }

        function cal(o, props) {

            var prop = props.shift();

            if (props.length == 0 && $.isNumeric(o[prop])) {
                o[prop] = utils.accDiv(o[prop], 1000);
            } else if (o[prop]) {
                cal(o[prop], props);
            }
        }
    },
    changeTwoDecimal: function(floatvar) {

        var f_x = parseFloat(floatvar);
        if (isNaN(f_x)) {
            console.error('function:changeTwoDecimal->parameter error');
            throw 'function:changeTwoDecimal->parameter error';
            return false;
        }
        var f_x = Math.round(floatvar * 100) / 100;
        return f_x;
    },
    changeThrDecimal: function(floatvar) {

        var f_x = parseFloat(floatvar);
        if (isNaN(f_x)) {
            console.error('function:changeThrDecimal->parameter error');
            throw 'function:changeThrDecimal->parameter error';
            return false;
        }
        var f_x = Math.round(floatvar * 1000) / 1000;
        return f_x;
    },
    decimal: function(num, v) {

        var vv = Math.pow(10, v);
        return Math.round(num * vv) / vv;
    },
    getBigNumber: function(currencyDigits) {

        var MAXIMUM_NUMBER = 99999999999;
        var CN_ZERO = "零";
        var CN_ONE = "一";
        var CN_TWO = "二";
        var CN_THREE = "三";
        var CN_FOUR = "四";
        var CN_FIVE = "五";
        var CN_SIX = "六";
        var CN_SEVEN = "七";
        var CN_EIGHT = "八";
        var CN_NINE = "九";
        var CN_TEN = "十";
        var CN_HUNDRED = "百";
        var CN_THOUSAND = "千";
        var CN_TEN_THOUSAND = "万";
        var CN_HUNDRED_MILLION = "亿";
        var CN_SYMBOL = "";
        var CN_DOLLAR = "";
        var CN_TEN_CENT = "";
        var CN_CENT = "";
        var CN_INTEGER = "";

        var integral; // Represent integral part of digit number.
        var decimal; // Represent decimal part of digit number.
        var outputCharacters; // The output result.
        var parts;
        var digits, radices, bigRadices, decimals;
        var zeroCount;
        var i, p, d;
        var quotient, modulus;

        currencyDigits = currencyDigits.toString();
        if (currencyDigits == "") {
            return "O";
        }
        if (currencyDigits.match(/[^,.\d]/) != null) {
            alert("数字非法!");
            return "";
        }
        if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
            alert("数字非法");
            return "";
        }

        currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma
        currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the

        if (Number(currencyDigits) > MAXIMUM_NUMBER) {
            alert("数字超过99999999999!");
            return "";
        }

        parts = currencyDigits.split(".");
        if (parts.length > 1) {
            integral = parts[0];
            decimal = parts[1];
            decimal = decimal.substr(0, 2);
        } else {
            integral = parts[0];
            decimal = "";
        }

        digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
        radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
        bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
        decimals = new Array(CN_TEN_CENT, CN_CENT);

        outputCharacters = "";

        if (Number(integral) > 0) {
            zeroCount = 0;
            for (i = 0; i < integral.length; i++) {
                p = integral.length - i - 1;
                d = integral.substr(i, 1);
                quotient = p / 4;
                modulus = p % 4;
                if (d == "0") {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        outputCharacters += digits[0];
                    }
                    zeroCount = 0;
                    outputCharacters += digits[Number(d)] + radices[modulus];
                }
                if (modulus == 0 && zeroCount < 4) {
                    outputCharacters += bigRadices[quotient];
                }
            }
            outputCharacters += CN_DOLLAR;
        }

        if (decimal != "") {
            for (i = 0; i < decimal.length; i++) {
                d = decimal.substr(i, 1);
                if (d != "0") {
                    outputCharacters += digits[Number(d)] + decimals[i];
                }
            }
        }
        if (outputCharacters.substring(0, 2) == "一十") {
            outputCharacters = outputCharacters.substring(1);
        }

        if (outputCharacters == "") {
            outputCharacters = CN_ZERO + CN_DOLLAR;
        }

        if (decimal == "") {
            outputCharacters += CN_INTEGER;
        }

        outputCharacters = CN_SYMBOL + outputCharacters;

        return outputCharacters;
    },
    getCNMoney: function(currencyDigits) {

        var MAXIMUM_NUMBER = 99999999999.99;
        var CN_ZERO = "零";
        var CN_ONE = "壹";
        var CN_TWO = "贰";
        var CN_THREE = "叁";
        var CN_FOUR = "肆";
        var CN_FIVE = "伍";
        var CN_SIX = "陆";
        var CN_SEVEN = "柒";
        var CN_EIGHT = "捌";
        var CN_NINE = "玖";
        var CN_TEN = "拾";
        var CN_HUNDRED = "佰";
        var CN_THOUSAND = "仟";
        var CN_TEN_THOUSAND = "万";
        var CN_HUNDRED_MILLION = "亿";
        var CN_SYMBOL = "";
        var CN_DOLLAR = "元";
        var CN_TEN_CENT = "角";
        var CN_CENT = "分";
        var CN_INTEGER = "整";

        var integral; // Represent integral part of digit number.
        var decimal; // Represent decimal part of digit number.
        var outputCharacters; // The output result.
        var parts;
        var digits, radices, bigRadices, decimals;
        var zeroCount;
        var i, p, d;
        var quotient, modulus;
        var negative = "";

        if (currencyDigits < 0) {
            negative = "负";
            currencyDigits = Math.abs(currencyDigits);
        }

        currencyDigits = currencyDigits.toString();
        if (currencyDigits == "") {
            return "零";
        }
        if (currencyDigits.match(/[^,.\d]/) != null) {
            alert("钱数非法!");
            return "";
        }
        if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
            alert("钱数非法");
            return "";
        }

        currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma
        currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the

        if (Number(currencyDigits) > MAXIMUM_NUMBER) {
            alert("金额超过99999999999.99!");
            return "";
        }

        parts = currencyDigits.split(".");
        if (parts.length > 1) {
            integral = parts[0];
            decimal = parts[1];
            decimal = decimal.substr(0, 2);
        } else {
            integral = parts[0];
            decimal = "";
        }

        digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
        radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
        bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
        decimals = new Array(CN_TEN_CENT, CN_CENT);
        outputCharacters = "";

        if (Number(integral) > 0) {
            zeroCount = 0;
            for (i = 0; i < integral.length; i++) {
                p = integral.length - i - 1;
                d = integral.substr(i, 1);
                quotient = p / 4;
                modulus = p % 4;
                if (d == "0") {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        outputCharacters += digits[0];
                    }
                    zeroCount = 0;
                    outputCharacters += digits[Number(d)] + radices[modulus];
                }
                if (modulus == 0 && zeroCount < 4) {
                    outputCharacters += bigRadices[quotient];
                }
            }
            outputCharacters += CN_DOLLAR;
        }

        if (decimal != "") {
            for (i = 0; i < decimal.length; i++) {
                d = decimal.substr(i, 1);
                if (d != "0") {
                    outputCharacters += digits[Number(d)] + decimals[i];
                }
            }
        }

        if (outputCharacters == "") {
            outputCharacters = CN_ZERO + CN_DOLLAR;
        }

        if (decimal == "") {
            outputCharacters += CN_INTEGER;
        }

        outputCharacters = CN_SYMBOL + negative + outputCharacters;

        return outputCharacters;
    },
    getMapFromStr: function(str) {

        var arry = str.split(";");
        var opts = {};
        $.each(arry, function(i, v) {

            opts[v.split(':')[0]] = v.split(':')[1];
        });
        return opts;
    },
    getStrFromMap: function(opts) {

        var str = "";
        $.each(opts, function(i, v) {

            str += i + ":" + v + ";";
        });
        str.substring(0, str.length - 1);
        return str;
    },
    padLeft: function(str, lenght) {

        if (str == undefined || str == null) {
            return "";
        } else if (str.length >= lenght) {
            return str;
        } else {
            return utils.padLeft("0" + str, lenght);
        }
    },
    fillArray: function(length, defValue) {

        var _array = [];

        if (defValue == undefined || defValue == null) {
            defValue = 0;
        }

        for ( var i = 0; i < length; i++) {
            _array[i] = defValue;
        }

        return _array;
    },
    dateDiff: function(interval, date1, date2) {

        var objInterval = {
            'D': 1000 * 60 * 60 * 24,
            'H': 1000 * 60 * 60,
            'M': 1000 * 60,
            'S': 1000,
            'T': 1
        };
        interval = interval.toUpperCase();
        var dt1 = Date.parse(date1.replace(/-/g, '/'));
        var dt2 = Date.parse(date2.replace(/-/g, '/'));
        try {
            return Math.round((dt2 - dt1) / objInterval[interval]);
        } catch (e) {
            return e.message;
        }
    },
    md5: function(str, bit) {

        var sMessage = str;
        if (!bit)
            bit = 32;
        function RotateLeft(lValue, iShiftBits) {

            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        function AddUnsigned(lX, lY) {

            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4)
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000)
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else
                return (lResult ^ lX8 ^ lY8);
        }
        function F(x, y, z) {

            return (x & y) | ((~x) & z);
        }
        function G(x, y, z) {

            return (x & z) | (y & (~z));
        }
        function H(x, y, z) {

            return (x ^ y ^ z);
        }
        function I(x, y, z) {

            return (y ^ (x | (~z)));
        }
        function FF(a, b, c, d, x, s, ac) {

            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function GG(a, b, c, d, x, s, ac) {

            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function HH(a, b, c, d, x, s, ac) {

            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function II(a, b, c, d, x, s, ac) {

            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }
        function ConvertToWordArray(sMessage) {

            var lWordCount;
            var lMessageLength = sMessage.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }
        function WordToHex(lValue) {

            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        }
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        // Steps 1 and 2. Append padding bits and length and convert to words
        x = ConvertToWordArray(sMessage);
        // Step 3. Initialise
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        // Step 4. Process the message in 16-word blocks
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }
        if (bit == 32) {
            return WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        } else {
            return WordToHex(b) + WordToHex(c);
        }
    },
    isMobile: function() {

        var userAgentInfo = navigator.userAgent;

        var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

        var mobile_flag = false;

        // 根据userAgent判断是否是手机
        for ( var v = 0; v < mobileAgents.length; v++) {
            if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
                mobile_flag = true;
                break;
            }
        }
        var screen_width = window.screen.width;
        var screen_height = window.screen.height;

        // 根据屏幕分辨率判断是否是手机
        if (screen_width > 325 && screen_height < 750) {
            mobile_flag = true;
        }

        return mobile_flag;
    },

    workDays: function (startTime, days, atttype) {

        if (days <= 0) return startTime;

        var holidaySet = new Set();
        var url = api.data.queryHoliday;
        var options = {
            "holiday.startTime": startTime,
            "holiday.atttype": 0,
        };
        
        if(atttype){
            options["holiday.atttype"] = atttype;
        }

        com.post(url, options, function (res) {

            res.holidays.forEach(range => {
                var start = new Date(range.startTime);
                var end = new Date(range.endTime);

                for (var d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    holidaySet.add(d.toISOString().split('T')[0]);
                }
            });
        }, null, false);

        var date = new Date(startTime);
        var remainingDays = days;
        var maxIterations = 365 * 5; // 最大循环保护(5年)
        var iterations = 0;

        // 处理起始日
        if (!utils.isWeekend(date) && !utils.isHoliday(date, holidaySet)) {
            remainingDays--;
        }

        // 计算剩余工作日
        while (remainingDays > 0 && iterations++ < maxIterations) {
            date.setDate(date.getDate() + 1);

            if (utils.isWeekend(date) || utils.isHoliday(date, holidaySet)) {
                continue;
            }

            remainingDays--;
        }

        return com.dateFormat(date, 'yyyy-MM-dd');
    },

    isWeekend: function (date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    },

    isHoliday: function (date, holidaySet) {
        return holidaySet.has(date.toISOString().split('T')[0]);
    },
    
    getUrlParams: function() {
        var paramsObj = {};
        var paramsString = window.location.search.substring(1);
        if (paramsString) {
            var pairs = paramsString.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                var key = decodeURIComponent(pair[0]);
                var value = decodeURIComponent(pair[1] || '');
                paramsObj[key] = value;
            }
        }
        return paramsObj;
    }
};

var tools = {

};