/** app/js/quotation/presignCost.js —— 预签成本（queryPresignCost / addPresignCost / deletePresignCost）
 *  上下文：app.params.data.presignProduce。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var dctx = qc.ctx('data') || {};
    var presignProduce = dctx.presignProduce || {};

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'toplimit', title: '上限面积', width: 140, templet: function (d) { return qc.money(d.toplimit); } },
            { field: 'lowlimit', title: '下限面积', width: 140, templet: function (d) { return qc.money(d.lowlimit); } },
            { field: 'costPrice', title: '成本单价', width: 140, templet: function (d) { return qc.money(d.costPrice); } },
            { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });

    function query() {
        app.post(api.quotation.queryPresignCost, { 'presignCost.ppid': presignProduce.ppid }, function (res) {
            table.reload('resultTable', { data: res.presignCosts || [] });
        });
    }
    query();

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.showConfirm('确认要删除预签成本吗?', function () {
                app.post(api.quotation.deletePresignCost, { 'presignCost.pcid': obj.data.pcid }, function () {
                    app.showAlert(app.info, '删除成功'); query();
                });
            });
        }
    });

    $('#btnAdd').on('click', function () {
        $('#editBox form')[0].reset();
        layer.open({ type: 1, title: '添加预签成本', content: $('#editBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.quotation.addPresignCost, {
                    'presignCost.ppid': presignProduce.ppid,
                    'presignCost.toplimit': $('#toplimit').val(),
                    'presignCost.lowlimit': $('#lowlimit').val(),
                    'presignCost.costPrice': $('#costPrice').val()
                }, function () {
                    app.showAlert(app.info, '添加成功');
                    layer.close(idx); query();
                });
            } });
    });
});
}); // end app.ready
