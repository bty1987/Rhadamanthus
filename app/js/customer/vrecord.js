/** app/js/customer/vrecord.js —— 客户记录（旧 vrecord.js → layui）
 *  上下文：app.params.customer.vid（装修客户 ID）。
 *  列表：queryVrecordByVid（vrecord.vid）→ comment/操作人/创建时间；添加：addVrecord。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var vid = customerCommon.ctx('customer').vid;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    if (vid == null) { app.showAlert(app.warning, '缺少客户上下文'); return; }

    initTable();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'comment', title: '记录内容', minWidth: 240 },
                { field: 'creater', title: '操作人', width: 130, templet: function (d) { return d.creater ? (d.creater.userName || '') : ''; } },
                { field: 'createTime', title: '创建时间', width: 170 }
            ]]
        });
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.queryVrecordByVid, {
            'vrecord.vid': vid,
            'paging.page': state.page,
            'paging.rows': state.rows
        }, function (res) {
            table.reload('resultTable', { data: res.vrecords || [] });
        });
    }

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加记录', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.addVrecord, {
            'vrecord.vid': vid,
            'vrecord.comment': $('#editForm [name="comment"]').val()
        }, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
