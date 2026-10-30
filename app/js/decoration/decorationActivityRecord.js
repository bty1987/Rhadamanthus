/** app/js/decoration/decorationActivityRecord.js —— 活动物品操作记录
 *  上下文：app.params.decoration.decorationActivityItem = { daiId }。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var item = (app.params.decoration && app.params.decoration.decorationActivityItem) || {};
    var STATUS = decorationCommon.ENUM.activityItemStatus;

    if (!item.daiId) { app.showAlert(app.warning, '缺少活动物品上下文'); }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'operate', title: '操作人', width: 140, templet: function (d) { return (d.operate && d.operate.userName) || (d.operate && d.operate.currentName) || '-'; } },
            { field: 'operateTime', title: '操作时间', width: 180 },
            { field: 'type', title: '类型', width: 110, templet: function (d) { return decorationCommon.badge(STATUS, d.type, function () { return 'layui-bg-blue'; }); } },
            { field: 'comment', title: '说明', minWidth: 300 } ]] });

    app.post(api.decoration.queryDecorationActivityRecord, { 'decorationActivityRecord.decorationActivityItem.daiId': item.daiId }, function (res) {
        table.reload('resultTable', { data: res.decorationActivityRecords || [] });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationIndex.url); });
});
}); // end app.ready
