/** app/js/store/mgoods.js —— 商城商品（CRUD + 图片 + 金额 + 品牌 + 状态）
 * price 为金额字段，pageMgoods/addMgoods/updateMgoods 已声明 tranargs */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    // 加载品牌下拉
    app.post(api.store.queryMbrand, {}, function (res) {
        var brands = res.mbrands || [];
        var html = '<option value="">请选择品牌</option>';
        $.each(brands, function (i, b) { html += '<option value="' + b.bid + '">' + b.name + '</option>'; });
        $('#brandSel').html(html); form.render('select');
    });

    // 图片上传
    app.uploadImage({ elem: '#imgUpload', done: function (res) { $('#editForm [name="defaultImg"]').val(res.resUrl); app.showImg($('#goodsImg'), res.resUrl, 100, 100, ''); } });

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'defaultImg', title: '图片', width: 70, align: 'center', templet: function (d) { return d.defaultImg ? '<img src="' + d.defaultImg + '" style="width:36px;height:36px;object-fit:cover;border-radius:4px;">' : ''; } },
                { field: 'name', title: '商品名', minWidth: 160 },
                { field: 'no', title: '编号', width: 120 },
                { field: 'price', title: '价格', width: 110, align: 'right', templet: function (d) { return '¥' + app.formatMoney(d.price); } },
                { field: 'mbrand', title: '品牌', width: 100, templet: function (d) { return d.mbrand ? d.mbrand.name : ''; } },
                { field: 'barcode', title: '条码', width: 130 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>'; } },
                { title: '操作', width: 240, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'enable') updateStatus(obj.data.gid, 0);
            else if (obj.event === 'disable') updateStatus(obj.data.gid, 1);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.store.pageMgoods, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; $('#goodsImg').hide();
        if (d) { state.editId = d.gid; ['gid','name','no','price','barcode','defaultImg'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); if (d.mbrand) $('#editForm [name="bid"]').val(d.mbrand.bid); if (d.defaultImg) app.showImg($('#goodsImg'), d.defaultImg, 100, 100, ''); }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑商品' : '添加商品', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'mgoods.name': $('#editForm [name="name"]').val(), 'mgoods.no': $('#editForm [name="no"]').val(), 'mgoods.price': $('#editForm [name="price"]').val(), 'mgoods.barcode': $('#editForm [name="barcode"]').val(), 'mgoods.defaultImg': $('#editForm [name="defaultImg"]').val(), 'mgoods.mbrand.bid': $('#editForm [name="bid"]').val() };
        var apiDef; if (state.editId) { opt['mgoods.gid'] = state.editId; apiDef = api.store.updateMgoods; } else { apiDef = api.store.addMgoods; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function updateStatus(gid, status) { app.post(api.store.updateMgoodsForStatus, { 'mgoods.gid': gid, 'mgoods.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
