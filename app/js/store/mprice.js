/** app/js/store/mprice.js —— 商品价格（CRUD + 图片 + 金额 + 状态）
 * price 为金额字段，addMprice 已声明 tranargs（×1000）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    initTable(); query();

    app.uploadImage({ elem: '#pictureUpload', done: function (res) { $('#editForm [name="img"]').val(res.resUrl); app.showImg($('#priceImg'), res.resUrl, 100, 100, ''); } });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'img', title: '图片', width: 80, templet: function (d) { return d.img ? '<img src="' + d.img + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">' : ''; } },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'price', title: '价格', width: 110, align: 'right', templet: function (d) { return '¥' + app.formatMoney(d.price); } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>'; } },
                { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'enable') updateStatus(obj.data.pid, 0);
            else if (obj.event === 'disable') updateStatus(obj.data.pid, 1);
        });
    }
    function query() { app.post(api.store.queryMpriceByGid, {}, function (res) { table.reload('resultTable', { data: res.mprices || [] }); }); }
    function openAdd() {
        $('#editForm')[0].reset(); $('#priceImg').hide();
        state.editIndex = layer.open({ type: 1, title: '添加价格', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.store.addMprice, { 'mprice.name': $('#editForm [name="name"]').val(), 'mprice.price': $('#editForm [name="price"]').val(), 'mprice.img': $('#editForm [name="img"]').val() }, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(); });
    }
    function updateStatus(pid, status) { app.post(api.store.updateMpriceForStatus, { 'mprice.pid': pid, 'mprice.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(); }); }
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
