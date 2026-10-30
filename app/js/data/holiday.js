/** app/js/data/holiday.js —— 假期管理（CRUD + 删除）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['hdid','startTime','endTime','atttype'];
    laydate.render({ elem: '#startTime', type: 'datetime' });
    laydate.render({ elem: '#endTime', type: 'datetime' });
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'period', title: '年份', width: 100 }, { field: 'startTime', title: '开始时间', width: 160, templet: function (d) { return app.dateFormat(d.startTime); } }, { field: 'endTime', title: '结束时间', width: 160, templet: function (d) { return app.dateFormat(d.endTime); } }, { field: 'daynum', title: '天数', width: 80 }, { field: 'atttype', title: '业务类型', width: 100 }, { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'del') doDel(obj.data.hdid); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageHoliday, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.hdid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } form.render('select'); state.editIndex = layer.open({ type: 1, title: d ? '编辑假期' : '添加假期', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'holiday.startTime': $('#editForm [name="startTime"]').val(), 'holiday.endTime': $('#editForm [name="endTime"]').val(), 'holiday.atttype': $('#editForm [name="atttype"]').val() }; var ad; if (state.editId) { o['holiday.hdid'] = state.editId; ad = api.data.updateHoliday; } else { ad = api.data.addHoliday; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteHoliday, { 'holiday.hdid': id }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); }); }
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
