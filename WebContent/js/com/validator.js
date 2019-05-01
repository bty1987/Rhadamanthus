
var validator = {
    required: {
        type: "v_required",
        errorMsg: "内容不能为空",
        func: function (obj) {
            if (obj.val() == null || obj.val() == undefined)
                return true;
            if (toString.apply(obj.val()) === '[object Array]')
                return obj.val().toString().trim().length == 0 ? true : false;
            return obj.val().trim().length == 0 ? true : false;
        }
    },
    typeahead: {
        type: "v_typeahead",
        errorMsg: "请使用匹配数据",
        func: function (obj) {
            if (obj.attr('data-typeahead-key') == null || obj.attr('data-typeahead-key') == undefined)
                return true;
            if (toString.apply(obj.attr('data-typeahead-key')) === '[object Array]')
                return obj.attr('data-typeahead-key').toString().trim().length == 0 ? true : false;
            return obj.attr('data-typeahead-key').trim().length == 0 ? true : false;
        }
    },
    number: {
        type: "v_number",
        regex: /^[0-9]*$/,
        errorMsg: "请输入数字."
    },
    float: {
        type: "v_float",
        regex: /^(((\d)+(\.)?(\d)*)|(\d)*)$/,
        errorMsg: "请输入浮点数."
    },
    name: {
        type: "v_name",
        regex: /^[\w\u4e00-\u9fa5-.@&!, \/()%\[\]（）*，;。；！、：:?？><]*$/,
        errorMsg: "内容可以由汉字, 字母, 数字,基本标点符号,'-','>','<','_', '.', '@'组成."
    },
    nameen: {
        type: "v_name_en",
        regex: /^[\w-_]*$/,
        errorMsg: "内容可以由字母, 数字, '-', '_'组成."
    },
    email: {
        type: "v_email",
        regex: /^(([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)|(\s)*)$/,
        errorMsg: "内容可以由字母, 数字, '-', '_', '.', '@'组成.(如:muzh@163.com)"
    },
    dateTime: {
        type: "v_dateTime",
        regex: /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(20|21|22|23|[0-1]?\d):[0-5]?\d(:[0-5]?\d)?)?$/,
        errorMsg: "请输入正确格式的日期.(YYYY-MM-DD hh:mm:ss)"
    },
    date: {
        type: "v_date",
        regex: /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(20|21|22|23|[0-1]?\d):[0-5]?\d(:[0-5]?\d)?)?$/,
        errorMsg: "请输入正确格式的日期.(YYYY-MM-DD)"
    },
    time: {
        type: "v_time",
        regex: /^(([01][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$/,
        errorMsg: "请输入正确格式的时间.(hh:mm:ss)"
    },
    phone: {
        type: "v_phone",
        regex: /^((1[0-9]{10})*)$/,
        errorMsg: "请输入正确的手机格式 (如:13619181918)."
    },
    phones: {
        type: "v_phones",
        regex: /^(1[0-9]{10})((#1[0-9]{10})){0,4}$/,
        errorMsg: "请输入正确的手机格式 (如:13619181918).如果为多条电话请用#号分隔"
    },
    phones2: {
        type: "v_phones2",
        regex: /^((1[0-9]{10})|(0[0-9]{10}))((#(([0-9]{11})))){0,4}$/,
        errorMsg: "请输入正确的手机号或固定电话 (如:13619181918#02425601918).如果为多条号码请用#号分隔"
    },
    identity: {
        type: "v_identity",
        regex: /^\s*$|(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
        errorMsg: "请输入正确的身份证号码."
    },
    price: {
        type: "v_price",
        regex: /^[0-9]+(\.[0-9]{1,2})?$/,
        errorMsg: "请输入正确的金额格式."
    },
    discount: {                     // 折扣 0到1之间两位小数
        type: "v_discount",
        regex: /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/,
        errorMsg: "请输入0到1之间的两位小数."
    },
    numberAll: {                   // 正数或负数 小数两位
        type: "v_numberAll",
        regex: /^(\d{0,8}|\d{0,8}\.[0-9]{1,2})$|^-(\d{0,8}|\d{0,8}\.[0-9]{1,2})$/,
        errorMsg: "请输入正数或负数."
    },
    officer: {
        type: "v_officer",
        regex: /^\s*$|^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/,
        errorMsg: "请输入正确的军官证号."
    },
    amount: {   // 小数点前最多8位,小数点后最多两位
        type: "v_amount",
        regex: /^\s*$|^\d{1,8}(\.\d{1,2})?$/,   // ^\s*$表示验证可以为空，可以是空格和制表符
        errorMsg: "请输入正确的金额格式."
    }
}