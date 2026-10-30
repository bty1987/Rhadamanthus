/** app/js/store/mbrand.js —— 商城品牌（CRUD + 图片上传 + 状态切换）
 * 字段：name icon(图片URL) status；图片上传用 app.uploadImage */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    initTable(); query(1);

    // 图片上传（编辑弹窗内的 #pictureUpload）
    app.uploadImage({
        elem: '#pictureUpload',
        done: function (res) {
            $('#editForm [name="icon"]').val(res.resUrl);
            app.showImg($('#brandImg'), res.resUrl, 100, 100, '');
        }
    });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'icon', title: '图标', width: 80, templet: function (d) { return d.icon ? '<img src="' + d.icon + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">' : ''; } },
                { field: 'name', title: '品牌名', minWidth: 160 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>'; } },
                { title: '操作', width: 240, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'enable') updateStatus(obj.data.bid, 0);
            else if (obj.event === 'disable') updateStatus(obj.data.bid, 1);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.store.pageMbrand, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        $('#brandImg').hide();
        if (d) { state.editId = d.bid; $('#editForm [name="bid"]').val(d.bid); $('#editForm [name="name"]').val(d.name); $('#editForm [name="icon"]').val(d.icon || ''); if (d.icon) app.showImg($('#brandImg'), d.icon, 100, 100, ''); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑品牌' : '添加品牌', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'mbrand.name': $('#editForm [name="name"]').val(), 'mbrand.icon': $('#editForm [name="icon"]').val() };
        var apiDef; if (state.editId) { opt['mbrand.bid'] = state.editId; apiDef = api.store.updateMbrand; } else { apiDef = api.store.addMbrand; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function updateStatus(bid, status) { app.post(api.store.updateMbrandForStatus, { 'mbrand.bid': bid, 'mbrand.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
