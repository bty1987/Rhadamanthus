/** app/js/production/outsource.js —— 外协单（分页列表 + 状态流转 + 编辑/外协项）
 * 列表 pageOutsource；审核 receiptOutsource；确认 confirmOutsource；废除 deleteOutsource；完结 finishOutsource。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, endIndex: null };
    var OS = { 0: '初始', 1: '审核', 2: '确认', 3: '完结', 4: '废除' };
    function stB(d) { var colors = { 0: 'layui-bg-gray', 1: 'layui-bg-orange', 2: 'layui-bg-cyan', 3: 'layui-bg-green', 4: 'layui-bg-red' }; return '<span class="layui-badge ' + (colors[d.status] || 'layui-bg-gray') + '">' + (OS[d.status] || '-') + '<\/span>'; }
    function pno(d) { return d.production ? d.production.pno : ''; }
    function supplier(d) { return d.supplier ? d.supplier.userName : ''; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: pno },
                { field: 'supplier', title: '厂商', width: 120, templet: supplier },
                { field: 'comment', title: '备注', minWidth: 160 }, { field: 'timeLimit', title: '工期', width: 80 },
                { field: 'createTime', title: '创建时间', width: 150 }, { field: 'finishTime', title: '结束时间', width: 150 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 480, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handle(obj.event, obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageOutsource, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function handle(ev, v) {
        if (ev === 'item') { app.params.outsourceItem = { oid: v.oid, outsourceStatus: v.status }; app.popup('views/production/outsourceItem.html', '外协项-' + v.no, null, { area: ['900px', '600px'] }); }
        else if (ev === 'receipt') { if (v.status != 0) return; app.showConfirm('是否接收?', function () { updateStatus(v.oid, '1', api.production.receiptOutsource); }); }
        else if (ev === 'confirm') { if (v.status != 1) return; app.showConfirm('是否确认?', function () { updateStatus(v.oid, '2', api.production.confirmOutsource); }); }
        else if (ev === 'abolition') { if ([0, 1, 2].indexOf(v.status) === -1) return; app.showConfirm('是否确认废除?', function () { updateStatus(v.oid, '4', api.production.deleteOutsource); }); }
        else if (ev === 'end') { if (v.status != 2) return; openEnd(v); }
        else if (ev === 'edit') openEdit(v);
    }
    function updateStatus(oid, status, apiDef) {
        app.post(apiDef, { 'outsource.oid': oid, 'outsource.status': status }, function () { ok('操作成功'); });
    }
    function ok(msg) { app.showAlert(app.success, msg); query(state.page); }
    function openEdit(v) {
        app.clearValidator(); $('#editForm')[0].reset();
        $('#editForm [name="oid"]').val(v.oid); $('#editForm [name="supplier"]').val(v.supplier ? v.supplier.userName : '');
        $('#editForm [name="timeLimit"]').val(v.timeLimit); $('#editForm [name="comment"]').val(v.comment);
        var dis = v.status != 0; $('#editForm [name="timeLimit"]').prop('disabled', dis);
        editIndex = layer.open({ type: 1, title: '编辑外协单', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function saveEdit() {
        if (app.validate('editForm')) return;
        app.post(api.production.updateOutsource, { 'outsource.oid': $('#editForm [name="oid"]').val(), 'outsource.timeLimit': $('#editForm [name="timeLimit"]').val(), 'outsource.comment': $('#editForm [name="comment"]').val() }, function () { ok('操作成功'); layer.close(editIndex); editIndex = null; });
    }
    function openEnd(v) {
        app.clearValidator(); $('#endForm')[0].reset(); $('#endForm [name="oid"]').val(v.oid);
        endIndex = layer.open({ type: 1, title: '完结外协单', content: $('#endBox'), area: ['440px', 'auto'] });
    }
    function saveEnd() {
        if (app.validate('endForm')) return;
        app.post(api.production.finishOutsource, { 'outsource.oid': $('#endForm [name="oid"]').val(), 'outsource.status': '3', 'outsource.num': $('#endForm [name="num"]').val() }, function () { ok('操作成功'); layer.close(endIndex); endIndex = null; });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', saveEdit);
    $('#btnCancel').on('click', function () { layer.close(editIndex); editIndex = null; });
    $('#btnEndOk').on('click', saveEnd);
    $('#btnEndCancel').on('click', function () { layer.close(endIndex); endIndex = null; });
});
}); // end app.ready
