/** app/js/data/house.js —— 房屋管理（列表 + 编辑）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['hid','houseNumber','houseType','buildArea','innerArea','floor','door','built','heatingType','feature'];
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'houseNumber', title: '房号', width: 120 }, { field: 'houseType', title: '户型', width: 80 }, { field: 'buildArea', title: '建筑面积', width: 90, templet: function (d) { return d.buildArea ? d.buildArea + '㎡' : ''; } }, { field: 'innerArea', title: '套内', width: 80, templet: function (d) { return d.innerArea ? d.innerArea + '㎡' : ''; } }, { field: 'floor', title: '楼层', width: 70 }, { field: 'door', title: '门牌', width: 80 }, { field: 'built', title: '建成', width: 70 }, { field: 'heatingType', title: '采暖', width: 80 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageHouse, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.hid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } state.editIndex = layer.open({ type: 1, title: d ? '编辑房屋' : '添加房屋', content: $('#editBox'), area: ['520px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = {}; F.forEach(function (k) { o['house.' + k] = $('#editForm [name="' + k + '"]').val(); }); var ad; if (state.editId) { o['house.hid'] = state.editId; ad = api.data.updateHouse; } else { ad = api.data.addHouse; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
