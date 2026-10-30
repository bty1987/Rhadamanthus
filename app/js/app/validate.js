/**
 * app/js/app/validate.js —— 表单校验（替代旧 com.validate）
 *
 * 设计：保留旧框架基于 CSS 类的校验约定（v_required / v_number / v_float_3 / v_phone ...），
 * 业务页 HTML 直接复用同样的 class 名，迁移成本最小。但错误提示改用 layui layer.tips，
 * 不再依赖 Bootstrap popover（去 ace/bootstrap 依赖）。
 *
 * 关键约定（与旧 com.validate 行为一致）：
 *   - 返回 true 表示"有错误"（反直觉，但保持兼容），用法：if (app.validate("formId")) return;
 *   - container 可传 jQuery 对象、ID 字符串（自动加 #）、或选择器。
 *   - 校验类加在 input/select/textarea 上，可直接组合：class="v_required v_float_3"
 *   - input 建议加 placeholder，错误 tips 会指向该元素。
 */
layui.define(['jquery', 'layer'], function (exports) {

    "use strict";

    var $ = layui.jquery;
    var layer = layui.layer;

    // —— 校验规则表（对齐旧 validator.js）——
    // 每条：{ regex?:正则, func?:obj=>true表示非法, errorMsg:提示 }
    var validators = {
        v_required:   { func: function (v) { return v == null || $.trim(String(v)) === ''; }, errorMsg: '内容不能为空' },
        v_typeahead:  { func: function ($el) { return !$el.attr('data-typeahead-key'); }, errorMsg: '请使用匹配数据' },
        v_radio:      { func: function () { return false; }, errorMsg: '请选择' },
        v_checkbox:   { func: function () { return false; }, errorMsg: '请选择' },
        v_number:     { regex: /^[0-9]*$/, errorMsg: '请输入整数' },
        v_anumber:    { regex: /^\-?[0-9]*$/, errorMsg: '请输入整数' },
        v_float:      { regex: /^(\d+\.?\d*|\.\d+)$/, errorMsg: '请输入数字' },
        v_float_3:    { regex: /^\d*\.?\d{0,3}$/, errorMsg: '最多3位小数' },
        v_afloat_3:   { regex: /^\-?\d*\.?\d{0,3}$/, errorMsg: '最多3位小数' },
        v_name:       { regex: /^[\u4e00-\u9fa5A-Za-z0-9_\-\s·]+$/, errorMsg: '含有非法字符' },
        v_name_cn:    { regex: /^[\u4e00-\u9fa5]*$/, errorMsg: '请输入汉字' },
        v_name_en:    { regex: /^[A-Za-z0-9_\-]*$/, errorMsg: '仅限字母/数字/_/-' },
        v_email:      { regex: /^[\w._\-]+@[\w.\-]+\.[A-Za-z]{2,}$/, errorMsg: '邮箱格式错误' },
        v_phone:      { regex: /^(1[0-9]{10})?$/, errorMsg: '请输入11位手机号' },
        v_phones:     { regex: /^(1[0-9]{10}(#1[0-9]{10})*)?$/, errorMsg: '手机号格式错误' },
        v_identity:   { regex: /^(\d{15}|\d{17}[0-9Xx])?$/, errorMsg: '身份证号格式错误' },
        v_price:      { regex: /^[0-9]+(\.[0-9]{1,2})?$/, errorMsg: '金额最多2位小数' },
        v_discount:   { regex: /^(1(\.0{1,2})?|0\.[0-9]{1,2})$/, errorMsg: '折扣0-1' }
    };

    // 持久 tips 索引，便于清除
    var tipIndexs = [];

    /**
     * 校验容器内所有带 v_* 类的字段
     * @param {String|Object} container id（自动加#）/ 选择器 / jQuery 对象
     * @returns {Boolean} true=有错误（早返回用），false=全部通过
     */
    function validate(container) {
        clearTips();
        var $box;
        if (typeof container === 'string') {
            $box = container.charAt(0) === '#' || container.charAt(0) === '.'
                ? $(container) : $('#' + container);
        } else {
            $box = $(container);
        }
        if (!$box.length) return false;

        var hasError = false;
        $box.find('input,select,textarea').each(function () {
            var $el = $(this);
            if ($el.is(':hidden') && $el.attr('type') !== 'hidden' && !$el.closest('.layui-hide').length) {
                // 跳过 display:none 的（除非 type=hidden）
                if (!$el.is(':visible')) return;
            }
            var classes = ($el.attr('class') || '').split(/\s+/);
            for (var i = 0; i < classes.length; i++) {
                var cls = classes[i];
                var rule = validators[cls];
                if (!rule) continue;
                var invalid = false;
                if (rule.func) {
                    invalid = rule.func($el.attr('type') === 'radio' || $el.attr('type') === 'checkbox' ? $el : $el.val());
                } else if (rule.regex) {
                    var val = $el.val() || '';
                    invalid = !rule.regex.test(val);
                }
                if (invalid) {
                    hasError = true;
                    showTip($el, rule.errorMsg);
                    break; // 同一字段只报第一个错误
                }
            }
        });
        return hasError;
    }

    function showTip($el, msg) {
        var idx = layer.tips(msg, $el, { tips: [1, '#fd6b6b'], time: 5000 });
        tipIndexs.push(idx);
        $el.addClass('layui-border-red').off('input.validate').on('input.validate', function () {
            $(this).removeClass('layui-border-red');
        });
    }

    function clearTips() {
        for (var i = 0; i < tipIndexs.length; i++) {
            try { layer.close(tipIndexs[i]); } catch (e) {}
        }
        tipIndexs = [];
        $('.layui-border-red').removeClass('layui-border-red');
    }

    /**
     * 扩展自定义校验规则
     * @param {String} cls class 名（如 "v_region"）
     * @param {Object} rule { regex?, func?, errorMsg }
     */
    function addRule(cls, rule) {
        validators[cls] = rule;
    }

    app.validate = validate;
    app.clearValidator = clearTips;
    app.addValidator = addRule;
    app.validators = validators;

    exports('validate', { validate: validate, clear: clearTips, addRule: addRule });
});
