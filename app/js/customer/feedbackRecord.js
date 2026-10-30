/** app/js/customer/feedbackRecord.js —— 反馈记录（旧 feedbackRecord.js → layui）
 *  上下文：app.params.customer.vid（反馈 fid）。
 *  列表：queryFeedbackRecord（feedbackRecord.feedback.fid）；添加：addFeedbackRecord。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var fid = customerCommon.ctx('customer').vid;
    var state = { editIndex: null };

    if (fid == null || fid === '') { app.showAlert(app.warning, '缺少反馈上下文'); return; }

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'feedback', title: '装修单号', width: 130, templet: function (d) { return d.feedback ? (d.feedback.orderId || '') : ''; } },
            { field: 'handler', title: '处理人', width: 120, templet: function (d) { return d.handler ? (d.handler.userName || '') : ''; } },
            { field: 'status', title: '状态', width: 90, templet: function (d) {
                var s = d.feedback ? d.feedback.status : d.status;
                return customerCommon.badge(E.feedbackStatus, s);
            } },
            { field: 'operateTime', title: '处理时间', width: 170 },
            { field: 'comment', title: '备注', minWidth: 200 }
        ]]
    });

    function query() {
        app.post(api.customer.queryFeedbackRecord, {
            'feedbackRecord.feedback.fid': fid,
            'paging.page': 1,
            'paging.rows': 10
        }, function (res) {
            table.reload('resultTable', { data: res.feedbackRecords || [] });
        });
    }
    query();

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加记录', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.addFeedbackRecord, {
            'feedbackRecord.feedback.fid': fid,
            'feedbackRecord.comment': $('#editForm [name="comment"]').val()
        }, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query();
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
