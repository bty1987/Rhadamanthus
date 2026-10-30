/** app/js/data/brand.js —— 品牌管理（CRUD + 状态 + 品类关联）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    // 加载品类下拉
    app.post(api.data.pageCategory, { 'paging.page': 1, 'paging.rows': 200 }, function (res) {
        var cats = (res.paging && res.paging.data) || [];
        var html = '<option value="">请选择品类</option>';
        cats.forEach(function (c) { html += '<option value="' + c.cid + '">' + c.name + '</option>'; });
        $('#categorySel').html(html); form.render('select');
    });

    function stBadge(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '品牌名', minWidth: 140 }, { field: 'category', title: '品类', width: 100, templet: function (d) { return d.category ? d.category.name : ''; } }, { field: 'agentName', title: '代理商', width: 100 }, { field: 'agentPhone', title: '代理电话', width: 120 }, { field: 'comment', title: '备注', minWidth: 120 }, { field: 'status', title: '状态', width: 80, templet: stBadge }, { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.bid, 0); else if (obj.event === 'disable') updSt(obj.data.bid, 1); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageBrand, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.bid; ['bid','name','agentName','agentPhone','comment'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); if (d.category) $('#editForm [name="cid"]').val(d.category.cid); } form.render('select'); state.editIndex = layer.open({ type: 1, title: d ? '编辑品牌' : '添加品牌', content: $('#editBox'), area: ['520px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'brand.name': $('#editForm [name="name"]').val(), 'brand.category.cid': $('#editForm [name="cid"]').val(), 'brand.agentName': $('#editForm [name="agentName"]').val(), 'brand.agentPhone': $('#editForm [name="agentPhone"]').val(), 'brand.comment': $('#editForm [name="comment"]').val() }; var ad; if (state.editId) { o['brand.bid'] = state.editId; ad = api.data.updateBrand; } else { ad = api.data.addBrand; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function updSt(id, s) { app.post(api.data.updateBrandForStatus, { 'brand.bid': id, 'brand.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
