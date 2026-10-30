/**
 * app/js/store/mcolor.js —— 商品颜色（CRUD + 启用/禁用）
 * 字段：color status gid
 * 注：mcolor 旧版用 queryMcolor（不分页）+ 手动渲染；这里改用 layui table 本地渲染。
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.jquery;
    var state = { editIndex: null, editCid: null };

    initTable();
    query();

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'color', title: '颜色', minWidth: 200 },
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
            else if (obj.event === 'enable') updateStatus(d.cid, 0);
            else if (obj.event === 'disable') updateStatus(d.cid, 1);
        });
    }

    function query() {
        // mcolor 无分页接口，用 queryMcolor 拉全量本地渲染
        app.post(api.store.queryMcolor, {}, function (res) {
            table.reload('resultTable', { data: res.mcolors || [] });
        });
    }

    function openEdit(d) {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editCid = null;
        if (d) {
            state.editCid = d.cid;
            $('#editForm [name="cid"]').val(d.cid);
            $('#editForm [name="color"]').val(d.color);
            if (d.gid) $('#editForm [name="gid"]').val(d.gid);
        }
        state.editIndex = layer.open({
            type: 1, title: d ? '编辑颜色' : '添加颜色', content: $('#editBox'), area: ['480px', 'auto'],
            cancel: function () { app.clearValidator(); }
        });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'mcolor.color': $('#editForm [name="color"]').val(),
            'mcolor.gid': $('#editForm [name="gid"]').val()
        };
        app.post(state.editCid ? api.store.addMcolor : api.store.addMcolor, state.editCid ? $.extend(opt, { 'mcolor.cid': state.editCid }) : opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null;
            query();
        });
    }

    function updateStatus(cid, status) {
        app.post(api.store.updateMcolorForStatus, { 'mcolor.cid': cid, 'mcolor.status': status }, function () {
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
