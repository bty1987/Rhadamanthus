/** app/js/store/slide.js —— 商城轮播图（CRUD + 图片上传 + 状态）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null, editId: null };
    initTable(); query();

    app.uploadImage({ elem: '#pictureUpload', done: function (res) { $('#editForm [name="img"]').val(res.resUrl); app.showImg($('#slideImg'), res.resUrl, 200, 100, ''); } });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'img', title: '图片', width: 160, templet: function (d) { return d.img ? '<img src="' + d.img + '" style="width:120px;height:60px;object-fit:cover;border-radius:4px;">' : ''; } },
                { field: 'gid', title: '商品ID', width: 100 },
                { field: 'url', title: '跳转链接', minWidth: 200 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>'; } },
                { title: '操作', width: 240, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'enable') updateStatus(obj.data.sid, 0);
            else if (obj.event === 'disable') updateStatus(obj.data.sid, 1);
        });
    }
    function query() { app.post(api.store.querySlide, {}, function (res) { table.reload('resultTable', { data: res.slides || [] }); }); }
    function openEdit(d) {
        $('#editForm')[0].reset(); state.editId = null; $('#slideImg').hide();
        if (d) { state.editId = d.sid; ['sid','img','gid','url'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); if (d.img) app.showImg($('#slideImg'), d.img, 200, 100, ''); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑轮播图' : '添加轮播图', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        var opt = { 'slide.img': $('#editForm [name="img"]').val(), 'slide.gid': $('#editForm [name="gid"]').val(), 'slide.url': $('#editForm [name="url"]').val() };
        var apiDef; if (state.editId) { opt['slide.sid'] = state.editId; apiDef = api.store.updateSlide; } else { apiDef = api.store.addSlide; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(); });
    }
    function updateStatus(sid, status) { app.post(api.store.updateSlideForStatus, { 'slide.sid': sid, 'slide.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(); }); }
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
