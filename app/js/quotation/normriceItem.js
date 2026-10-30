/** app/js/quotation/normriceItem.js —— 附加项管理（施工进度弹窗页）
 *  列表：queryQuotationByOrderId 取默认报价 → queryNormriceItemByType(type=3 定额附加)；
 *  新增：addNormriceItem（模板 normadd.sid + 数量）；确认 confirmNormriceItem；驳回 rejectNormriceItem；删除 deleteNormriceItem。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var qctx = qc.ctx('quotation') || {};
    var cctx = qc.ctx('construction') || {};
    var orderId = qctx.orderId;
    var cnid = cctx.constructionSchedule ? cctx.constructionSchedule.cnid : null;
    var currentQid = null;

    if (orderId) {
        $('#orderIdLabel').text('装修单号: ' + orderId);
    } else {
        $('#orderIdLabel').html('<span style="color:#c00;">缺少装修单号参数</span>');
    }

    // 附加项模板
    app.post(api.data.queryNormadd, cnid ? { 'normadd.constructionNode.cnid': cnid } : {}, function (res) {
        var html = '<option value="">请选择附加项</option>';
        $.each(res.normadds || [], function (i, v) {
            html += '<option value="' + v.naid + '">' + v.name + '<\/option>';
        });
        $('#niNormadd').html(html);
        form.render('select');
    }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '名称', width: 200 },
            { field: 'constructionNode', title: '施工节点', width: 120, templet: function (d) { return d.constructionNode ? d.constructionNode.name : ''; } },
            { field: 'num', title: '数量', width: 80, templet: function (d) { return qc.money(d.num); } },
            { field: 'trannum', title: '转换量', width: 80, templet: function (d) { return qc.money(d.trannum); } },
            { field: 'salary', title: '工费', width: 90, templet: function (d) { return qc.money(d.salary); } },
            { field: 'total', title: '总额', width: 100, templet: function (d) { return qc.money(app.utils.accMul(app.utils.accMul(d.num, d.salary), d.atttype == 0 ? 1 : -1)); } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return qc.badge({ 0: '待确认', 2: '已确认', 3: '已驳回' }, d.status); } },
            { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });

    function queryData() {
        if (!orderId) return;
        app.post(api.quotation.queryQuotationByOrderId, { 'quotation.orderId': orderId }, function (res) {
            var qs = res.quotations || [];
            var q = null;
            $.each(qs, function (i, v) { if (v.defaults == 1) q = v; });
            if (!q && qs.length) q = qs[0];
            if (!q) return;
            currentQid = q.qid;
            app.post(api.quotation.queryNormriceItemByType, { 'normriceItem.qid': currentQid, 'normriceItem.type': 3 }, function (r) {
                table.reload('resultTable', { data: r.normriceItems || [] });
            });
        });
    }
    queryData();

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'confirm') {
            app.showConfirm('确认要确认该附加项吗?', function () {
                app.post(api.quotation.confirmNormriceItem, { 'normriceItem.npiid': v.npiid }, function () {
                    app.showAlert(app.info, '操作成功'); queryData();
                });
            });
        } else if (obj.event === 'reject') {
            app.showConfirm('确认要驳回该附加项吗?', function () {
                app.post(api.quotation.rejectNormriceItem, { 'normriceItem.npiid': v.npiid }, function () {
                    app.showAlert(app.info, '操作成功'); queryData();
                });
            });
        } else if (obj.event === 'del') {
            app.showConfirm('确认要删除该附加项吗?删除后不可恢复。', function () {
                app.post(api.quotation.deleteNormriceItem, { 'normriceItem.npiid': v.npiid }, function () {
                    app.showAlert(app.info, '删除成功'); queryData();
                });
            });
        }
    });

    $('#btnAdd').on('click', function () {
        if (!currentQid) { app.showAlert(app.warning, '报价信息未加载，无法新增'); return; }
        $('#niNum').val(1);
        $('#niNormadd').val('');
        form.render('select');
        layer.open({ type: 1, title: '新增附加项', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$('#niNormadd').val()) { app.showAlert(app.warning, '请选择附加项'); return; }
                app.post(api.quotation.addNormriceItem, {
                    'normtion.qid': currentQid,
                    'normriceItem.sid': $('#niNormadd').val(),
                    'normriceItem.num': $('#niNum').val()
                }, function () {
                    app.showAlert(app.success, '新增成功');
                    layer.close(idx); queryData();
                });
            } });
    });
});
}); // end app.ready
