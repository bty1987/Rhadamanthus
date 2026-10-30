/**
 * app/js/app/exporter.js —— 数据导出组件（替代旧 $.exceler）
 *
 * 契约（balance/sales/material/log 等页面已按此调用）：
 *   app.exporter(rows, fileName [, columns])
 *     rows     对象数组（页面已做枚举翻译/空值兜底/嵌套展开）
 *     fileName 导出文件名（不含扩展名）
 *     columns  可选，[['列名','字段名'],...]；缺省时自动取所有行键的并集
 *
 * 实现：CSV 下载（UTF-8 BOM，Excel 直接打开不乱码），与 report 页内联
 * 导出同一形态。嵌套对象/数组序列化为 JSON，不丢数据。
 *
 * 引入方式（与 upload.js 同模式）：
 *   在业务页 bootstrap.js 之前 <script src=".../exporter.js"></script>，
 *   layui.define 在脚本执行时自动注册并挂 app.exporter。
 *   ★ 不加入 bootstrap 的 use 列表——避免未引入本文件的页面 bootstrap 被阻塞
 *     （uploadApp 踩过的坑）。未引入时页面里的 app.exporter && 守卫自然跳过。
 */
layui.define(['layer'], function (exports) {

    "use strict";

    var layer = layui.layer;

    /** CSV 单元格转义：含逗号/引号/换行时加引号包裹 */
    function esc(v) {
        if (v == null) return '';
        if (typeof v === 'object') {
            try { v = JSON.stringify(v); } catch (e) { v = String(v); }
        }
        var s = String(v);
        if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
        return s;
    }

    /**
     * 导出 CSV
     * @param {Array} rows 对象数组
     * @param {String} fileName 文件名（不含扩展名）
     * @param {Array} [columns] 可选 [['列名','字段名'],...]，缺省自动取键并集
     */
    function exporter(rows, fileName, columns) {
        rows = rows || [];
        if (!rows.length) {
            if (app.showAlert) app.showAlert(app.warning, '没有可导出的数据');
            return;
        }

        // 列：显式指定 or 自动取所有行键的并集（保持首行键序）
        var keys, labels;
        if (columns && columns.length) {
            labels = columns.map(function (c) { return c[0]; });
            keys = columns.map(function (c) { return c[1]; });
        } else {
            keys = [];
            var seen = {};
            rows.forEach(function (r) {
                Object.keys(r).forEach(function (k) {
                    if (!seen[k]) { seen[k] = true; keys.push(k); }
                });
            });
            labels = keys;
        }

        // 组装 CSV（\r\n 行分隔 + BOM）
        var lines = [labels.map(esc).join(',')];
        rows.forEach(function (r) {
            lines.push(keys.map(function (k) { return esc(r[k]); }).join(','));
        });
        var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });

        // 触发下载
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (fileName || '导出') + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);

        if (app.showAlert) app.showAlert(app.success, '导出成功');
    }

    app.exporter = exporter;

    exports('exporterApp', { exporter: exporter });
});
