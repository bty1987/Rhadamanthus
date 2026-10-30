/** app/js/payment/paymentFunction.js —— 款项功能配置
 *  列出功能组（queryPaymentFunction type=0），点"配置"弹窗勾选该组下的功能项（按 type 分类展示），
 *  提交 updatePaymentFunctionRight（name+group+pfids[]）。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    // 功能项 type 分类：1=api(单选) 2=条件 3=字段 4=函数 5=节点 6=状态 7=支付方式
    var GROUPS = ['接口(API,单选)', '条件', '字段', '函数', '节点', '状态', '支付方式'];
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '功能组', width: 200 }, { field: 'comment', title: '说明', minWidth: 200 }, { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'config') openConfig(obj.data); });
    app.post(api.payment.queryPaymentFunction, { 'paymentFunction.type': 0 }, function (res) {
        table.reload('resultTable', { data: res.paymentFunctions || [] });
    });
    function openConfig(group) {
        var name = group.key, gno = group.group, selected = {};
        app.post(api.right.queryPaymentFunctionRight, { 'paymentFunctionRight.name': name, 'paymentFunctionRight.type': gno }, function (res) {
            (res.paymentFunctionRights || []).forEach(function (v) { selected[v.paymentFunction.pfid] = true; });
            app.post(api.payment.queryPaymentFunction, { 'paymentFunction.type': '' }, function (res2) {
                var all = (res2.paymentFunctions || []).slice().sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
                var byType = {};
                all.forEach(function (v) { if ((v.group & gno) == 0) return; (byType[v.type] = byType[v.type] || []).push(v); });
                var html = '<div style="padding:16px;max-height:60vh;overflow:auto;">';
                for (var t = 1; t <= 7; t++) {
                    if (!byType[t] || !byType[t].length) continue;
                    html += '<h4 style="margin:8px 0;">' + (GROUPS[t - 1] || ('类型' + t)) + '<\/h4>';
                    byType[t].forEach(function (v) {
                        var inp = t == 1 ? 'radio' : 'checkbox';
                        var chk = selected[v.pfid] ? 'checked' : '';
                        var label = v.name + (v.type == 0 ? '' : (v.comment || ''));
                        html += '<label style="display:inline-block;width:30%;line-height:28px;"><input type="' + inp + '" name="pfids" value="' + v.pfid + '" ' + chk + '> ' + label + '<\/label>';
                    });
                }
                html += '<\/div>';
                layer.open({ type: 1, title: '配置 - ' + group.name, content: html, area: ['700px', '80%'], btn: ['保存', '取消'], yes: function (i) {
                    var opts = {}; var idx = 0;
                    $('input[name="pfids"]:checked').each(function () { opts['pfids[' + idx + ']'] = $(this).val(); idx++; });
                    opts['paymentFunctionRight.name'] = name; opts['paymentFunctionRight.type'] = gno;
                    app.post(api.right.updatePaymentFunctionRight, opts, function () { layer.close(i); app.showAlert(app.success, '配置成功'); });
                } });
            });
        });
    }
});
}); // end app.ready
