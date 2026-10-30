/** app/js/quotation/quotationFormat.js —— 报价规格
 *  列表：queryQuotationFormatByQcid（qcid 取自 app.params.data.quotationCtem.qcid，价格 tranargs ÷1000）；
 *  编辑：add/updateQuotationFormat（name 编辑时锁定）；删除 deleteQuotationFormat；状态 updateQuotationFormatForStatus。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var dctx = quotationCommon.ctx('data') || {};
    var qcid = dctx.quotationCtem ? dctx.quotationCtem.qcid : '';
    var qfid = null;

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'format', title: '规格', minWidth: 200 },
            { field: 'name', title: '名字', width: 160 },
            { field: 'price', title: '单价', width: 110, templet: function (d) { return quotationCommon.money(d.price); } },
            { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });

    function query() {
        app.post(api.quotation.queryQuotationFormatByQcid, { 'quotationFormat.quotationCtem.qcid': qcid }, function (res) {
            table.reload('resultTable', { data: res.quotationFormats || [] });
        });
    }
    query();

    function openEdit(v) {
        qfid = v ? v.qfid : null;
        $('#name').val(v ? v.name : '').prop('disabled', !!v);
        $('#format').val(v ? v.format : '');
        layer.open({ type: 1, title: qfid ? '编辑规格' : '添加规格', content: $('#editBox'), area: ['460px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var url = api.quotation.addQuotationFormat;
                var options = {
                    'quotationFormat.quotationCtem.qcid': qcid,
                    'quotationFormat.name': $('#name').val(),
                    'quotationFormat.format': $('#format').val()
                };
                if (qfid != null) { url = api.quotation.updateQuotationFormat; options['quotationFormat.qfid'] = qfid; }
                app.post(url, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query();
                });
            } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'del') {
            app.post(api.quotation.deleteQuotationFormat, { 'quotationFormat.qfid': v.qfid }, function () {
                app.showAlert(app.info, '操作成功'); query();
            });
        } else if (obj.event === 'status') {
            app.post(api.quotation.updateQuotationFormatForStatus, { 'quotationFormat.qfid': v.qfid, 'quotationFormat.status': v.status == 0 ? 1 : 0 }, function () { query(); });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnBack').on('click', function () { app.closePopup(); });
});
}); // end app.ready
