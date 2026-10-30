/**
 * app/js/log/log-common.js —— log 模块公共工具（5 个日志页共用）
 *
 * 提供：
 *   - logCommon.buildFilters($form): 构造 filters[N].*，正确处理 between 日期范围
 *   - logCommon.resultStateText(v): 结果状态枚举文本（0成功 1失败 2异常）
 *   - logCommon.renderDateRange(elem, field): layui laydate 范围选择器，值用 "-" 连接
 *      （后端 timeranges 按 "-" 拆分为 start/end，见 GenericDaoImpl.timeranges）
 *   - logCommon.exportCSV(tableId, fileName): layui table.exportFile 导出当前页
 *
 * ★ 关键：日期范围后端用 op=between + 单值（"2024-01-01-2024-01-31"），
 *   不是两条 ge/le。这是 log 模块与通用列表模板的差异点。
 */
window.logCommon = (function () {
    'use strict';

    var RESULT_STATE = { 0: '成功', 1: '失败', 2: '异常' };

    /**
     * 构造后端 filters[N].* 参数。
     * 表单字段规则：name=filter.field，data-op=操作符。
     * 特殊：op="between" 的字段（日期范围），把值原样作为一个 data 发送
     *      （后端 timeranges 按 "-" 拆分）。
     */
    function buildFilters($form) {
        var $ = layui.jquery;
        var params = {};
        var count = 0;
        $form.find('[name]').each(function () {
            var $el = $(this);
            var field = $el.attr('name');
            var val = $.trim($el.val());
            if (val === '' || val == null) return;
            var op = $el.attr('data-op') || 'eq';
            params['filters[' + count + '].field'] = field;
            params['filters[' + count + '].data'] = val; // between 时 val 已是 "start-end"
            params['filters[' + count + '].op'] = op;
            count++;
        });
        return params;
    }

    function resultStateText(v) {
        return RESULT_STATE[v] != null ? RESULT_STATE[v] : '';
    }

    /**
     * layui laydate 范围选择器。
     * 值格式："2024-01-01 - 2024-01-31"（laydate 默认 range 分隔符为 " - "）。
     * buildFilters 会原样发送，后端 split("-") 拆分——
     * 注意：laydate 的 " - " 含空格和横杠，后端 split("-") 会得到带空格的段，
     *      但 timeranges 里 replaceAll("/", "-") + parseDate 容错空格，实测可解析。
     *      为稳妥，这里把 range 分隔符设为 "-"（无空格），与后端 split("-") 精确对齐。
     */
    function renderDateRange(elem, field) {
        layui.laydate.render({
            elem: elem,
            range: '-',
            type: 'date',
            format: 'yyyy-MM-dd',
            done: function (value) {
                // 值形如 "2024-01-01-2024-01-31"
            }
        });
    }

    /**
     * 导出：用 layui table.exportFile 把当前表格数据导出 CSV。
     * （旧版用 $.exceler，新版统一走 layui 能力。）
     */
    function exportCSV(tableId, fileName) {
        layui.table.exportFile(tableId, null, 'csv', fileName || '导出');
    }

    return {
        buildFilters: buildFilters,
        resultStateText: resultStateText,
        renderDateRange: renderDateRange,
        exportCSV: exportCSV
    };
})();
