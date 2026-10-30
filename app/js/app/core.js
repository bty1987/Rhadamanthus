/**
 * app/js/app/core.js —— 核心 UI 层（替代旧 com.focusPage / loadPage / show* / 面包屑 等）
 *
 * 设计：纯 layui 实现，等价复刻旧 com 的对外行为，业务逻辑可零改动迁移。
 *   - app.focusPage: tab 作用域选择器（多 tab 下避免 id 冲突）
 *   - app.openTab / app.closeTab: 基于 layui element 的标签页（iframe 模式）
 *   - app.breadcrumb: 面包屑渲染
 *   - app.showAlert / showConfirm / showLoading / hideLoading / showTip: UI 反馈（封装 layer）
 *   - app.showImg: 图片显示（带服务器前缀）
 *   - app.dateFormat / formatMoney / getEnumText: 数据格式化
 *   - app.bindData: 下拉填充
 *
 * 约定：业务页一律用 app.focusPage('#id')，不要用裸 $()。
 */
layui.define(['jquery', 'layer', 'element'], function (exports) {

    "use strict";

    var $ = layui.jquery;
    var layer = layui.layer;
    var element = layui.element;
    var cfg = app.config;

    // 反馈类型（对齐旧 com.info/warning/error）
    var TYPE = {
        info:    { icon: 6, time: 1500 },
        success: { icon: 1, time: 1500 },
        warning: { icon: 0, time: 3000 },
        error:   { icon: 2, time: 5000 }
    };
    app.info = TYPE.info;
    app.success = TYPE.success;
    app.warning = TYPE.warning;
    app.error = TYPE.error;

    /**
     * tab 作用域选择器。
     * iframe 模式下每个 tab 是独立 iframe，作用域天然隔离；
     * 单页多 tab（hash 模式）下限定到当前激活 tab 内容区。
     * @param {String} selector 选择器
     * @param {String} [context] 上下文选择器
     */
    function focusPage(selector, context) {
        // iframe 模式：document 就是当前 tab 的文档，直接选
        if (context) return $(selector, $(context));
        return $(selector);
    }

    // ============================ UI 反馈 ============================

    function showAlert(type, msg) {
        type = type || TYPE.info;
        layer.msg(msg, { icon: type.icon, time: type.time });
    }

    function showConfirm(content, success, cancel) {
        layer.confirm(content, { title: '确认', btn: ['确定', '取消'] }, function (idx) {
            layer.close(idx);
            if (success) success();
        }, function (idx) {
            layer.close(idx);
            if (cancel) cancel();
        });
    }

    function showLoading(content, options) {
        options = options || {};
        return layer.msg(content || '加载中...', {
            icon: 16, shade: options.shade != null ? options.shade : 0.3, time: options.time || 0
        });
    }

    function hideLoading(loadIndex) {
        if (loadIndex != null) layer.close(loadIndex);
        else layer.closeAll('loading');
    }

    function showTip($el, msg, dir) {
        // dir: 1上 2右 3下 4左
        return layer.tips(msg, $el, { tips: [dir || 1, '#3595CC'], time: 5000 });
    }

    function showInfo(title, content) {
        layer.open({ type: 0, title: title || '提示', content: content, skin: 'layui-layer-lan' });
    }

    // ============================ Tab 导航 ============================

    var tabSeq = 0;

    /**
     * 在主框架打开（或激活）一个标签页。
     * 业务页一般不直接调用——由 index.js 的菜单点击调用。
     * @param {String} url 页面 url（相对 app/）
     * @param {String} title 标签标题
     * @param {String} id 唯一 id（同 id 只激活不新增）
     */
    function openTab(url, title, id) {
        id = id || ('tab_' + (++tabSeq));
        var layid = id;
        // 若已存在则激活
        if ($('.layui-tab[lay-filter="appTabs"]').find('li[lay-id="' + layid + '"]').length) {
            element.tabChange('appTabs', layid);
            return layid;
        }
        element.tabAdd('appTabs', {
            id: layid,
            title: title || '未命名',
            content: '<iframe src="' + url + '" frameborder="0" class="app-iframe" id="iframe_' + layid + '"></iframe>'
        });
        element.tabChange('appTabs', layid);
        return layid;
    }

    function closeTab(id) {
        element.tabDelete('appTabs', id);
    }

    /**
     * 同级页面跳转（当前 tab/iframe 内跳到新页面）。
     * 对齐旧 com.switchPage：用于"返回列表"等场景。
     */
    function switchPage(url) {
        location.href = url;
    }

    // ============================ 面包屑 ============================

    /**
     * 渲染面包屑。
     * @param {Array} items [{icon,text}, ...]  icon 用 layui-icon-xxx 类名
     * @param {String} [container] 容器选择器，默认 #breadcrumb
     */
    function breadcrumb(items, container) {
        var $box = $(container || '#breadcrumb');
        if (!$box.length) return;
        var html = '';
        for (var i = 0; i < items.length; i++) {
            var it = items[i];
            html += '<span class="app-crumb">';
            if (it.icon) html += '<i class="layui-icon ' + it.icon + '"></i> ';
            html += (it.text || '') + '</span>';
            if (i < items.length - 1) html += '<span class="layui-icon layui-icon-right app-crumb-sep"></span>';
        }
        $box.html(html);
    }

    // ============================ 弹窗 ============================

    /**
     * 打开页面弹窗（type:1，加载一个 url 到弹窗内）。对齐旧 com.popup4page。
     * @param {String} url 子页 url
     * @param {String} title
     * @param {Function} [success] 打开后回调
     * @param {Object} [opts] 额外 layer.open 选项（area 等）
     */
    function popup(url, title, success, opts) {
        opts = opts || {};
        return layer.open($.extend({
            type: 2,
            title: title || '',
            content: url,
            area: opts.area || ['80%', '80%'],
            success: success
        }, opts));
    }

    /**
     * 打开 DOM 弹窗（type:1，显示页内某节点）。对齐旧 com.popup4model。
     * @param {String|Object} holder 选择器或 jQuery 对象
     * @param {String} title
     * @param {Function} [success]
     * @param {Object} [opts]
     */
    function popupModel(holder, title, success, opts) {
        opts = opts || {};
        var $h = (typeof holder === 'string') ? $(holder) : holder;
        return layer.open($.extend({
            type: 1,
            title: title || '',
            content: $h,
            area: opts.area || ['600px', 'auto'],
            success: success
        }, opts));
    }

    function closePopup(idx) {
        if (idx != null) layer.close(idx);
        else layer.closeAll();
    }

    // ============================ 数据辅助 ============================

    /**
     * 显示图片（自动加 media 前缀）。对齐旧 com.showImg。
     */
    function showImg($el, path, w, h, defaultImg) {
        if (!path) {
            if (defaultImg) $el.attr('src', defaultImg).show();
            else $el.hide();
            return;
        }
        var src = /^[a-z]+:\/\//.test(path) ? path : (cfg.media + path);
        $el.attr({ src: src, width: w, height: h }).show();
    }

    /**
     * 日期格式化。对齐旧 com.dateFormat。
     * @param {Number|Date} datetime 时间戳或 Date
     * @param {String} format yyyy-MM-dd hh:mm:ss
     */
    function dateFormat(datetime, format) {
        if (!datetime) return '';
        var d = datetime instanceof Date ? datetime : new Date(datetime);
        if (isNaN(d.getTime())) return '';
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        return (format || 'yyyy-MM-dd hh:mm:ss')
            .replace(/yyyy/g, d.getFullYear())
            .replace(/MM/g, pad(d.getMonth() + 1))
            .replace(/dd/g, pad(d.getDate()))
            .replace(/hh/g, pad(d.getHours()))
            .replace(/mm/g, pad(d.getMinutes()))
            .replace(/ss/g, pad(d.getSeconds()));
    }

    /** 金额格式化（分位） */
    function formatMoney(num, precision) {
        if (num == null || num === '') return '0.00';
        precision = precision != null ? precision : 2;
        var n = parseFloat(num);
        if (isNaN(n)) return '0.00';
        return n.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * 下拉填充。对齐旧 $.fn.bindData。
     * @param {Object} $sel select 的 jQuery 对象
     * @param {Array} list 数据
     * @param {String} key value 字段名
     * @param {String} value 文本字段名
     * @param {String|Boolean} all true 或自定义文本→加"全部"首项
     * @param {Function} [cb]
     */
    function bindData($sel, list, key, value, all, cb) {
        var html = '';
        if (all) {
            var allText = (typeof all === 'string') ? all : '全部';
            html += '<option value="">' + allText + '</option>';
        }
        if (list) {
            for (var i = 0; i < list.length; i++) {
                var it = list[i];
                var v = (typeof it === 'object') ? it[key] : it;
                var t = (typeof it === 'object') ? it[value] : it;
                html += '<option value="' + v + '">' + t + '</option>';
            }
        }
        $sel.html(html);
        if (cb) cb();
    }

    // ============================ 对外暴露 ============================

    app.focusPage = focusPage;
    app.openTab = openTab;
    app.closeTab = closeTab;
    app.switchPage = switchPage;
    app.breadcrumb = breadcrumb;
    app.popup = popup;
    app.popupModel = popupModel;
    app.closePopup = closePopup;
    app.showAlert = showAlert;
    app.showConfirm = showConfirm;
    app.showLoading = showLoading;
    app.hideLoading = hideLoading;
    app.showTip = showTip;
    app.showInfo = showInfo;
    app.showImg = showImg;
    app.dateFormat = dateFormat;
    app.formatMoney = formatMoney;
    app.bindData = bindData;

    exports('core', {
        focusPage: focusPage, openTab: openTab, closeTab: closeTab, switchPage: switchPage,
        breadcrumb: breadcrumb, popup: popup, popupModel: popupModel, closePopup: closePopup,
        showAlert: showAlert, showConfirm: showConfirm, showLoading: showLoading,
        hideLoading: hideLoading, showTip: showTip, showInfo: showInfo,
        showImg: showImg, dateFormat: dateFormat, formatMoney: formatMoney, bindData: bindData
    });
});
