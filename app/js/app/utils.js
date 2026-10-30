/**
 * app/js/app/utils.js —— 工具函数（精确算术 + 属性遍历）
 *
 * 对齐旧 com/utils.js 的关键能力，纯 JS，无依赖。
 * post.js 在金额精度转换（×1000/÷1000）时会调用 app.utils.accExtend / reduceProp。
 */
window.app = window.app || {};

// —— 全局参数缓存（等价旧 params，存放用户信息/缓存数据/单页 handoff 槽位） ——
app.params = {
    userInfo: null,            // queryUserForSelfByUserId 结果
    condition: {}              // 弹窗↔父页 handoff 槽位（popup 选值回填用）
};

app.utils = (function () {
    "use strict";

    /** 加法（避免浮点误差） */
    function accAdd(arg1, arg2) {
        var r1, r2, m;
        try { r1 = arg1.toString().split('.')[1].length; } catch (e) { r1 = 0; }
        try { r2 = arg2.toString().split('.')[1].length; } catch (e) { r2 = 0; }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    }

    /** 减法 */
    function accSub(arg1, arg2) { return accAdd(arg1, -arg2); }

    /** 乘法 */
    function accMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split('.')[1].length; } catch (e) {}
        try { m += s2.split('.')[1].length; } catch (e) {}
        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
    }

    /** 除法（guard /0 → 0） */
    function accDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split('.')[1].length; } catch (e) {}
        try { t2 = arg2.toString().split('.')[1].length; } catch (e) {}
        r1 = Number(arg1.toString().replace('.', ''));
        r2 = Number(arg2.toString().replace('.', ''));
        if (r2 === 0) return 0;
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }

    /** 四舍五入保留两位 */
    function changeTwoDecimal(x) {
        var f = parseFloat(x);
        if (isNaN(f)) return 0;
        f = Math.round(x * 100) / 100;
        return f;
    }

    /** 四舍五入保留三位（对齐旧 utils.changeThrDecimal） */
    function changeThrDecimal(x) {
        var f = parseFloat(x);
        if (isNaN(f)) return 0;
        f = Math.round(x * 1000) / 1000;
        return f;
    }

    /**
     * 金额字段 ×1000（前端元→后端毫）。
     * 对齐旧 utils.accExtend：按点号路径把指定字段值乘以 1000。
     * @param {Object} opts 参数对象
     * @param {String} key 字段路径，如 "region.price" 或 "items[0].money"
     */
    function accExtend(opts, key) {
        var path = key.replace(/\[\d+\]/g, ''); // 去掉数组下标，得 "region.price"
        var parts = path.split('.');
        var last = parts[parts.length - 1];
        var parent = opts;
        for (var i = 0; i < parts.length - 1; i++) {
            if (parent[parts[i]] == null) return;
            parent = parent[parts[i]];
        }
        if (parent[last] != null && parent[last] !== '') {
            parent[last] = accMul(parent[last], 1000);
        }
    }

    /**
     * 响应结果里把指定 args 字段 ÷1000（后端毫→前端元）。
     * 对齐旧 utils.accReduce：在 res[resultKey]（数组或对象）里逐项把 args 列表字段除以 1000。
     * @param {Object} res 响应
     * @param {String} resultKey 结果集路径，如 "regions" 或 "paging.data"
     * @param {Array} args 字段名列表，如 ["price","money"]
     */
    function reduceProp(res, resultKey, args) {
        var obj = getProp(res, resultKey);
        if (obj == null) return;
        var list = $.isArray(obj) ? obj : [obj];
        var each = (window.layui && layui.jquery) ? layui.jquery.each : function (arr, fn) { for (var i=0;i<arr.length;i++) fn(i, arr[i]); };
        each(list, function (i, item) {
            for (var a = 0; a < args.length; a++) {
                if (item[args[a]] != null && item[args[a]] !== '') {
                    item[args[a]] = accDiv(item[args[a]], 1000);
                }
            }
        });
    }

    /** 按点号路径取属性（不存在返回 null） */
    function getProp(obj, path) {
        if (obj == null || !path) return null;
        var parts = path.split('.');
        var cur = obj;
        for (var i = 0; i < parts.length; i++) {
            if (cur == null) return null;
            cur = cur[parts[i]];
        }
        return cur == null ? null : cur;
    }

    /** 深拷贝 */
    function deepClone(obj) {
        if (obj == null) return obj;
        return JSON.parse(JSON.stringify(obj));
    }

    /** 数组去重 */
    function unique(arr) {
        var n = {}, r = [];
        for (var i = 0; i < arr.length; i++) {
            if (!n[arr[i]]) { n[arr[i]] = true; r.push(arr[i]); }
        }
        return r;
    }

    /** 是否移动端 */
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    return {
        accAdd: accAdd, accSub: accSub, accMul: accMul, accDiv: accDiv,
        changeTwoDecimal: changeTwoDecimal, changeThrDecimal: changeThrDecimal,
        accExtend: accExtend, reduceProp: reduceProp,
        getProp: getProp, deepClone: deepClone, unique: unique,
        isMobile: isMobile
    };
})();
