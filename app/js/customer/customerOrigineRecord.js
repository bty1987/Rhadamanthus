/** app/js/customer/customerOrigineRecord.js —— 客源记录（旧 customerOrigineRecord.js → layui）
 *  上下文：app.params.customer.csid（客源 ID）。
 *  列表：queryCustomerOriginRecord；添加：addCustomerOriginRecord。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var csid = customerCommon.ctx('customer').csid;
    var state = { editIndex: null };

    if (csid == null || csid === '') { app.showAlert(app.warning, '缺少客源上下文'); return; }

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'comment', title: '记录内容', minWidth: 260 },
            { field: 'operater', title: '操作人', width: 130, templet: function (d) { return d.operater ? (d.operater.userName || '') : ''; } },
            { field: 'operatTime', title: '记录时间', width: 170 }
        ]]
    });

    function initRecord() {
        app.post(api.customer.queryCustomerOriginRecord, {
            'customerOriginRecord.csid': csid,
            'paging.page': 1,
            'paging.rows': 10
        }, function (res) {
            table.reload('resultTable', { data: res.customerOriginRecords || [] });
        });
    }
    initRecord();

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加记录', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.addCustomerOriginRecord, {
            'customerOriginRecord.csid': csid,
            'customerOriginRecord.comment': $('#editForm [name="comment"]').val()
        }, function () {
            app.showAlert(app.success, '记录创建成功');
            $('#editForm [name="comment"]').val('');
            layer.close(state.editIndex);
            state.editIndex = null;
            initRecord();
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
