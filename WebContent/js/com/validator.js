var Validator = function() {

    var _validator = {
        required: {
            type: "v_required",
            errorMsg: "内容不能为空",
            func: function(obj) {

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
            func: function(obj) {

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
            errorMsg: "输入内容格式错误(整数)"
        },
        anumber: {
            type: "v_anumber",
            regex: /^\-{0,1}[0-9]*$/,
            errorMsg: "输入内容格式错误(整数)"
        },
        float: {
            type: "v_float",
            regex: /^(((\d)+(\.)?(\d)*)|(\d)*)$/,
            errorMsg: "输入内容格式错误(小数)"
        },
        float3: {
            type: "v_float_3",
            regex: /^(\d*|\d+\.[0-9]{1,3})$/, // /^(?!0+(\.0*)?$)\d+(\.\d{1,3})?$/
            errorMsg: "输入内容格式错误(小数)"
        },
        afloat3: {
            type: "v_afloat_3",
            regex: /^\-{0,1}(\d+|\d+\.[0-9]{1,3})$/,
            errorMsg: "输入内容格式错误(小数)"
        },
        name: {
            type: "v_name",
            regex: /^[\w\u4e00-\u9fa5-.@&!, \/()%\[\]（）*，;。；！、：:?？><]*$/,
            errorMsg: "内容可以由汉字, 字母, 数字,基本标点符号,'-','>','<','_', '.', '@'组成."
        },
        namecn: {
            type: "v_name_cn",
            regex: /^[\u4e00-\u9fa5]*$/,
            errorMsg: "内容可以由汉字组成."
        },
        nameen: {
            type: "v_name_en",
            regex: /^[\w-_]*$/,
            errorMsg: "内容可以由字母, 数字, '-', '_'组成."
        },
        email: {
            type: "v_email",
            regex: /^(([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)|(\s)*)$/,
            errorMsg: "内容可以由字母, 数字, '-', '_', '.', '@'组成.(如:fanglin@fanglin.com)"
        },
        phone: {
            type: "v_phone",
            regex: /^((1[0-9]{10})*)$/,
            errorMsg: "请输入正确的手机格式 (如:13619181918)."
        },
        phones: {
            type: "v_phones",
            regex: /^((1[0-9]{10})((#1[0-9]{10})){0,4})*$/,
            errorMsg: "请输入正确的手机格式 (如:13619181918)."
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
        discount: { // 折扣 0到1之间两位小数
            type: "v_discount",
            regex: /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/,
            errorMsg: "请输入0到1之间的两位小数."
        },
        officer: {
            type: "v_officer",
            regex: /^\s*$|^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/,
            errorMsg: "请输入正确的军官证号."
        },
        passhkm: {
            type: "v_passhkm",
            regex: /^\s*$|^[HMhm]\d{8}$/,
            errorMsg: "请输入正确的港澳通行证号."
        }
    };

    return {
        init: function() {

            var dtd = $.Deferred();

            com.validator = _validator;

            return dtd.promise();
        }
    };
};
