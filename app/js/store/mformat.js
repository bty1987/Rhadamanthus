/**
 * app/js/store/mformat.js —— 商品规格（CRUD + 启用/禁用）
 * 字段：format status gid
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.jquery;
    var state = { editIndex: null, editFid: null };

    initTable();
    query();

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'format', title: '规格', minWidth: 200 },
                {
                    field: 'status', title: '状态', width: 100,
                    templet: function (d) {
                        return d.status == 0
                            ? '<span class="layui-badge layui-bg-green">启用</span>'
                            : '<span class="layui-badge layui-bg-gray">禁用</span>';
                    }
                },
                { title: '操作', width: 240, toolbar: '#rowToolbar' }
                ]]
        });
        table.on('tool(resultTable)', function (obj) {
            var d = obj.data;
            if (obj.event === 'edit') openEdit(d);
            else if (obj.event === 'enable') updateStatus(d.fid, 0);
            else if (obj.event === 'disable') updateStatus(d.fid, 1);
        });
    }

    function query() {
        app.post(api.store.queryMformat, {}, function (res) {
            table.reload('resultTable', { data: res.mformats || [] });
        });
    }

    function openEdit(d) {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editFid = null;
        if (d) {
            state.editFid = d.fid;
            $('#editForm [name="fid"]').val(d.fid);
            $('#editForm [name="format"]').val(d.format);
            if (d.gid) $('#editForm [name="gid"]').val(d.gid);
        }
        state.editIndex = layer.open({
            type: 1, title: d ? '编辑规格' : '添加规格', content: $('#editBox'), area: ['480px', 'auto'],
            cancel: function () { app.clearValidator(); }
        });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'mformat.format': $('#editForm [name="format"]').val(),
            'mformat.gid': $('#editForm [name="gid"]').val()
        };
        if (state.editFid) opt['mformat.fid'] = state.editFid;
        // mformat 无独立 update 接口，旧版仅 add + updateForStatus；编辑时复用 add（后端按 fid 存在则更新）
        app.post(api.store.addMformat, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null;
            query();
        });
    }

    function updateStatus(fid, status) {
        app.post(api.store.updateMformatForStatus, { 'mformat.fid': fid, 'mformat.status': status }, function () {
            app.showAlert(app.success, status == 0 ? '已启用' : '已禁用');
            query();
        });
    }

    $('#btnSearch').on('click', query);
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
