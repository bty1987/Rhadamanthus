/** app/js/production/puotation.js —— 生产报价单列表（创建/编辑/折让/状态切换/删除/子项）
 * 上下文：app.params.productionPuotation = {pid, status, address}
 * 列表 queryPuotationByPid；编辑 updatePuotation；折让 updatePuotationForAdvance；
 * 切换状态 updatePuotationForDefault；删除 deletePuotation。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.productionPuotation || {};
    var editIndex = null, discountIndex = null;
    var disOrig = { discount: 0, total: 0 };
    if (ctx.status != 0) $('#btnCreate').hide();
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '报价单名称', minWidth: 180 },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? d.creater.userName : ''; } },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'discount', title: '折让', width: 90 },
                { field: 'total', title: '总价', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'status', title: '状态', width: 100, templet: function (d) { var c = d.status == 0 ? 'layui-bg-gray' : 'layui-bg-green'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '未使用' : '正使用') + '<\/span>'; } },
                { field: 'comment', title: '说明', minWidth: 140 },
                { title: '操作', width: 480, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handleEvent(obj.event, obj.data); });
    }
    function query() {
        if (!ctx.pid) { app.showAlert(app.warning, '缺少生产单上下文'); return; }
        app.post(api.production.queryPuotationByPid, { 'puotation.pid': ctx.pid }, function (res) { table.reload('resultTable', { data: res.puotations || [] }); });
    }
    function handleEvent(ev, v) {
        if (ev === 'add') { app.params.puotationItemAdd = { qid: v.qid, discount: v.discount, total: v.total, name: v.name, comment: v.comment }; app.switchPage(api.index.addPuotationItemIndex.url); }
        else if (ev === 'item') { app.params.puotationItemList = { qid: v.qid, status: ctx.status, use: v.status }; app.popup('views/production/puotationItem.html', '子项-' + v.name, null, { area: ['900px', '600px'] }); }
        else if (ev === 'discount') openDiscount(v);
        else if (ev === 'delete') app.showConfirm('是否确认删除?', function () { app.post(api.production.deletePuotation, { 'puotation.qid': v.qid }, function () { ok('操作成功'); }); });
        else if (ev === 'status') app.showConfirm('确定更改状态为' + (v.status == 0 ? '正使用' : '未使用') + '?', function () { app.post(api.production.updatePuotationForDefault, { 'puotation.qid': v.qid }, function () { ok('操作成功'); }); });
        else if (ev === 'edit') openEdit(v);
    }
    function ok(msg) { app.showAlert(app.success, msg); query(); }
    function openEdit(v) {
        app.clearValidator(); $('#editForm')[0].reset();
        $('#editForm [name="qid"]').val(v.qid); $('#editForm [name="name"]').val(v.name); $('#editForm [name="comment"]').val(v.comment);
        editIndex = layer.open({ type: 1, title: '编辑报价单', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function saveEdit() {
        if (app.validate('editForm')) return;
        var qid = $('#editForm [name="qid"]').val();
        app.post(api.production.updatePuotation, { 'puotation.qid': qid, 'puotation.name': $('#editForm [name="name"]').val(), 'puotation.comment': $('#editForm [name="comment"]').val() }, function () { ok('操作成功'); layer.close(editIndex); editIndex = null; });
    }
    function openDiscount(v) {
        app.clearValidator(); $('#discountForm')[0].reset();
        $('#discountForm [name="qid"]').val(v.qid); $('#discountForm [name="discount"]').val(v.discount); $('#discountForm [name="total"]').val(v.total);
        disOrig.discount = v.discount; disOrig.total = v.total;
        discountIndex = layer.open({ type: 1, title: '折让信息', content: $('#discountBox'), area: ['480px', 'auto'] });
    }
    // 折让变化时按原折扣反算总价
    $('#discountForm [name="discount"]').on('change', function () {
        var d = parseFloat($(this).val()); if (!d || isNaN(d)) return;
        var origTotal = parseFloat(disOrig.total), origDis = parseFloat(disOrig.discount);
        if (!origDis) return;
        var newTotal = app.utils.accMul(app.utils.accDiv(origTotal, origDis), d);
        $('#discountForm [name="total"]').val(newTotal.toFixed(2));
    });
    function saveDis() {
        if (app.validate('discountForm')) return;
        var d = parseFloat($('#discountForm [name="discount"]').val());
        if (d > 1 || d < 0.01) { app.showAlert(app.warning, '请输入0到1之间的两位小数'); return; }
        app.post(api.production.updatePuotationForAdvance, { 'puotation.qid': $('#discountForm [name="qid"]').val(), 'puotation.discount': d, 'puotation.total': $('#discountForm [name="total"]').val() }, function () { ok('操作成功'); layer.close(discountIndex); discountIndex = null; });
    }
    $('#btnCreate').on('click', function () { app.params.productionPuotationCreate = { pid: ctx.pid, status: ctx.status, address: ctx.address }; app.switchPage(api.index.createPutationIndex.url); });
    $('#btnBack').on('click', function () { app.switchPage(api.index.productionIndex.url); });
    $('#btnSaveEdit').on('click', saveEdit);
    $('#btnCancelEdit').on('click', function () { layer.close(editIndex); editIndex = null; });
    $('#btnSaveDis').on('click', saveDis);
    $('#btnCancelDis').on('click', function () { layer.close(discountIndex); discountIndex = null; });
});
}); // end app.ready
