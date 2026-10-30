/** app/js/production/outsource4view.js —— 生产单下的外协单列表（创建/编辑/状态流转/外协项）
 * 上下文：app.params.productionOutsource = {pid, status}
 * 列表 queryOutsourceByPid；创建 addHardware（厂商 typeahead querySupplierByPinyin）；状态流转；完结 finishOutsource。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.productionOutsource || {};
    var editIndex = null, endIndex = null, editFlg = true;
    var OS = { 0: '初始', 1: '审核', 2: '确认', 3: '完结', 4: '废除' };
    function stB(d) { var colors = { 0: 'layui-bg-gray', 1: 'layui-bg-orange', 2: 'layui-bg-cyan', 3: 'layui-bg-green', 4: 'layui-bg-red' }; return '<span class="layui-badge ' + (colors[d.status] || 'layui-bg-gray') + '">' + (OS[d.status] || '-') + '<\/span>'; }
    function pno(d) { return d.production ? d.production.pno : ''; }
    function supplier(d) { return d.supplier ? d.supplier.userName : ''; }
    if (ctx.status != 2) $('#btnAdd').hide();
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: pno },
                { field: 'supplier', title: '厂商', width: 120, templet: supplier },
                { field: 'comment', title: '备注', minWidth: 150 }, { field: 'timeLimit', title: '工期', width: 80 },
                { field: 'createTime', title: '创建时间', width: 150 }, { field: 'finishTime', title: '结束时间', width: 150 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 480, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handle(obj.event, obj.data); });
    }
    function query() {
        if (!ctx.pid) { app.showAlert(app.warning, '缺少生产单上下文'); return; }
        app.post(api.production.queryOutsourceByPid, { 'outsource.production.pid': ctx.pid }, function (res) { table.reload('resultTable', { data: res.outsources || [] }); });
    }
    function ok(msg) { app.showAlert(app.success, msg); query(); }
    function handle(ev, v) {
        if (ev === 'item') { app.params.outsourceItem = { oid: v.oid, outsourceStatus: v.status, productionStatus: ctx.status }; app.popup('views/production/outsourceItem.html', '外协项-' + v.no, null, { area: ['900px', '600px'] }); }
        else if (ev === 'receipt') { if (v.status != 0) return; app.showConfirm('是否接收?', function () { updateStatus(v.oid, '1', api.production.receiptOutsource); }); }
        else if (ev === 'confirm') { if (v.status != 1) return; app.showConfirm('是否确认?', function () { updateStatus(v.oid, '2', api.production.confirmOutsource); }); }
        else if (ev === 'abolition') { if ([0, 1, 2].indexOf(v.status) === -1) return; app.showConfirm('是否确认废除?', function () { updateStatus(v.oid, '4', api.production.deleteOutsource); }); }
        else if (ev === 'end') { if (v.status != 2) return; openEnd(v); }
        else if (ev === 'edit') openEdit(v);
    }
    function updateStatus(oid, status, apiDef) {
        app.post(apiDef, { 'outsource.oid': oid, 'outsource.status': status }, function () { ok('操作成功'); });
    }
    function openEdit(v) {
        app.clearValidator(); $('#editForm')[0].reset(); editFlg = !v;
        if (v) {
            $('#editForm [name="oid"]').val(v.oid);
            $('#editForm [name="supplier"]').val(v.supplier ? v.supplier.userName : '').attr('data-uid', v.supplier ? v.supplier.userId : 0).prop('disabled', true);
            $('#editForm [name="timeLimit"]').val(v.timeLimit).prop('disabled', v.status != 0);
            $('#editForm [name="comment"]').val(v.comment);
        } else {
            $('#editForm [name="supplier"]').removeAttr('data-uid').prop('disabled', false).val('');
            $('#editForm [name="timeLimit"]').prop('disabled', false);
        }
        editIndex = layer.open({ type: 1, title: v ? '编辑外协单' : '创建外协单', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    // 厂商 typeahead
    $('#editForm [name="supplier"]').on('blur', function () {
        if ($(this).prop('disabled')) return;
        var pinyin = $.trim($(this).val()); if (!pinyin) { $(this).attr('data-uid', 0); return; }
        app.post(api.personel.querySupplierByPinyin, { 'supplier.pinYin': pinyin, 'user.status': 0 }, function (res) {
            var list = res.suppliers || []; var v = list[0];
            if (v) { $('#editForm [name="supplier"]').val(v.userName).attr('data-uid', v.userId); }
            else { $('#editForm [name="supplier"]').attr('data-uid', 0); }
        });
    });
    function save() {
        if (app.validate('editForm')) return;
        var url, o = {
            'outsource.production.pid': ctx.pid,
            'outsource.supplier.userId': $('#editForm [name="supplier"]').attr('data-uid') || 0,
            'outsource.path': '',
            'outsource.timeLimit': $('#editForm [name="timeLimit"]').val(),
            'outsource.comment': $('#editForm [name="comment"]').val()
        };
        if (editFlg) { url = api.production.addOutsource; } else { url = api.production.updateOutsource; o['outsource.oid'] = $('#editForm [name="oid"]').val(); }
        app.post(url, o, function () { ok('操作成功'); layer.close(editIndex); editIndex = null; });
    }
    function openEnd(v) {
        app.clearValidator(); $('#endForm')[0].reset(); $('#endForm [name="oid"]').val(v.oid);
        endIndex = layer.open({ type: 1, title: '完结外协单', content: $('#endBox'), area: ['440px', 'auto'] });
    }
    function saveEnd() {
        if (app.validate('endForm')) return;
        app.post(api.production.finishOutsource, { 'outsource.production.pid': ctx.pid, 'outsource.oid': $('#endForm [name="oid"]').val(), 'outsource.status': '3', 'outsource.num': $('#endForm [name="num"]').val() }, function () { ok('操作成功'); layer.close(endIndex); endIndex = null; });
    }
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', save);
    $('#btnCancel').on('click', function () { layer.close(editIndex); editIndex = null; });
    $('#btnEndOk').on('click', saveEnd);
    $('#btnEndCancel').on('click', function () { layer.close(endIndex); endIndex = null; });
    $('#btnBack').on('click', function () { app.switchPage(api.index.productionIndex.url); });
});
}); // end app.ready
