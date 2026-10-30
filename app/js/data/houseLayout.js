/** app/js/data/houseLayout.js —— 户型图（增删查 + 分页）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    var F = ['name','area'];
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 200 }, { field: 'area', title: '面积', width: 100, templet: function (d) { return d.area ? d.area + '㎡' : ''; } }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.hlid); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageHouseLayout, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加户型', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = {}; F.forEach(function (k) { o['houseLayout.' + k] = $('#editForm [name="' + k + '"]').val(); }); app.post(api.data.addHouseLayout, o, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteHouseLayout, { 'houseLayout.hlid': id }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
