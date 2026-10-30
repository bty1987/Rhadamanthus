/** app/js/customer/pointRecord.js —— 积分记录（旧 pointRecord.js → layui）
 *  上下文：app.params.customer.accountId（积分账户 ID）。
 *  列表：queryPointRecord（pointAccount.accountId）→ 操作人/类型/操作类型/积分/剩余积分/操作时间。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var accountId = customerCommon.ctx('customer').accountId;

    if (accountId == null || accountId === '') { app.showAlert(app.warning, '缺少积分账户上下文'); return; }

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'operater', title: '操作人', width: 130, templet: function (d) { return d.operater ? (d.operater.userName || '') : ''; } },
            { field: 'pointType', title: '类型', width: 100, templet: function (d) { return E.cppointType[d.pointType] != null ? E.cppointType[d.pointType] : (d.pointType != null ? d.pointType : ''); } },
            { field: 'type', title: '操作类型', width: 100, templet: function (d) { return E.cppointOperateType[d.type] != null ? E.cppointOperateType[d.type] : (d.type != null ? d.type : ''); } },
            { field: 'point', title: '积分', width: 110, align: 'right' },
            { field: 'balance', title: '剩余积分', width: 110, align: 'right' },
            { field: 'operateTime', title: '操作时间', width: 170 }
        ]]
    });

    app.post(api.customer.queryPointRecord, {
        'pointAccount.accountId': accountId,
        'paging.page': 1,
        'paging.rows': 10
    }, function (res) {
        table.reload('resultTable', { data: res.pointRecords || [] });
    });
});
}); // end app.ready
