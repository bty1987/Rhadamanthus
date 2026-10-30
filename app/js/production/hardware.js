/** app/js/production/hardware.js —— 五金单（分页列表 + 编辑/图表/五金项/入库/完结）
 * 列表 pageHardware；编辑 updateHardware；入库 instoreHardware；完结 finishHardware。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, uploadIndex: null, curHid: null };
    var HS = { 0: '初始', 1: '采购', 2: '入库', 3: '完结', 4: '废单' };
    function stB(d) { var colors = { 0: 'layui-bg-gray', 1: 'layui-bg-orange', 2: 'layui-bg-cyan', 3: 'layui-bg-green', 4: 'layui-bg-red' }; return '<span class="layui-badge ' + (colors[d.status] || 'layui-bg-gray') + '">' + (HS[d.status] || '-') + '<\/span>'; }
    function pno(d) { return d.production ? d.production.pno : ''; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: pno },
                { field: 'comment', title: '说明', minWidth: 180 }, { field: 'timeLimit', title: '工期', width: 80 },
                { field: 'createTime', title: '创建时间', width: 160 }, { field: 'finishTime', title: '结束时间', width: 160 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 320, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handle(obj.event, obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageHardware, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function handle(ev, v) {
        if (ev === 'edit') openEdit(v);
        else if (ev === 'item') { app.params.hardwareItem = { hid: v.hid, hardwareStatus: v.status }; app.popup('views/production/hardwareItem.html', '五金项-' + v.no, null, { area: ['900px', '600px'] }); }
        else if (ev === 'instore') { if (v.status != 1) return; app.showConfirm('是否确认入库?', function () { app.post(api.production.instoreHardware, { 'hardware.hid': v.hid, 'hardware.status': '2' }, function () { ok('操作成功'); }); }); }
        else if (ev === 'finish') { if (v.status != 2) return; app.showConfirm('是否确认完结?', function () { app.post(api.production.finishHardware, { 'hardware.hid': v.hid, 'hardware.num': 0 }, function () { ok('操作成功'); }); }); }
    }
    function ok(msg) { app.showAlert(app.success, msg); query(state.page); }
    function openEdit(v) {
        app.clearValidator(); $('#editForm')[0].reset();
        $('#editForm [name="hid"]').val(v.hid); $('#editForm [name="comment"]').val(v.comment);
        state.editIndex = layer.open({ type: 1, title: '编辑五金单', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function saveEdit() {
        if (app.validate('editForm')) return;
        app.post(api.production.updateHardware, { 'hardware.hid': $('#editForm [name="hid"]').val(), 'hardware.comment': $('#editForm [name="comment"]').val() }, function () { ok('操作成功'); layer.close(state.editIndex); state.editIndex = null; });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', saveEdit);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
