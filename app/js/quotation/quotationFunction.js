/** app/js/quotation/quotationFunction.js —— 报价功能配置
 *  列表：queryQuotationFunction(type=0 页面级功能)；
 *  配置：queryQuotationFunctionRight 取已选 qfid → queryQuotationFunction 全量按 type 分组（1api/2条件/3字段/4功能）
 *  → updateQuotationFunctionRight 保存。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var cfgName = null, cfgGroup = null, qfids = [];

    var GROUPS = { 1: 'apiData', 2: 'condArrData', 3: 'fieldData', 4: 'functionData', 5: 'typeData', 6: 'statusData' };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '页面标识', width: 180 },
            { field: 'key', title: '配置名', width: 180 },
            { field: 'comment', title: '说明', minWidth: 220 },
            { field: 'group', title: '分组', width: 80 },
            { field: 'sort', title: '排序', width: 80 },
            { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'config') apiConfig(obj.data);
    });

    function load() {
        app.post(api.quotation.queryQuotationFunction, { 'quotationFunction.type': 0 }, function (res) {
            table.reload('resultTable', { data: res.quotationFunctions || [] });
        });
    }
    load();

    // —— 配置弹窗 ——
    function apiConfig(v) {
        cfgName = v.key; cfgGroup = v.group; qfids = [];
        app.post(api.right.queryQuotationFunctionRight, { 'quotationFunctionRight.name': cfgName, 'quotationFunctionRight.type': cfgGroup }, function (res) {
            $.each(res.quotationFunctionRights || [], function (i, va) { qfids.push(va.quotationFunction.qfid); });
        }, null, false);

        app.post(api.quotation.queryQuotationFunction, { 'quotationFunction.type': '' }, function (res) {
            $.each(GROUPS, function (t, id) { $('#' + id).html('<span style="color:#999;">无<\/span>'); });
            var list = (res.quotationFunctions || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
            $.each(list, function (i, f) {
                if (f.group != v.group && f.group != 0) return;
                var box = $('#' + GROUPS[f.type]);
                if (!box.length) return;
                if (box.find('input').length === 0) box.html('');
                var isRadio = f.type == 1;
                var checked = qfids.indexOf(f.qfid) != -1 ? ' checked' : '';
                box.append('<span style="display:inline-block;margin:2px 10px 2px 0;">'
                    + '<input type="' + (isRadio ? 'radio' : 'checkbox') + '" name="qfids" value="' + f.qfid + '" title="' + (f.name || '') + (f.type == 0 ? '' : quotationCommon.checkNull(f.comment, '')) + '"' + checked + '>'
                    + '<\/span>');
            });
            form.render(null, 'configForm');
            layer.open({ type: 1, title: '功能配置 - ' + v.name, content: $('#configBox'), area: ['720px', '80%'],
                btn: ['确定', '取消'], yes: function (idx) {
                    var options = { 'quotationFunctionRight.name': cfgName, 'quotationFunctionRight.type': cfgGroup };
                    var $inputs = $('input[name="qfids"]:checked');
                    $.each($inputs, function (i, input) { options['qfids[' + i + ']'] = $(input).val(); });
                    app.post(api.right.updateQuotationFunctionRight, options, function () {
                        app.showAlert(app.info, '配置成功');
                        layer.close(idx);
                    });
                } });
        });
    }
});
}); // end app.ready
