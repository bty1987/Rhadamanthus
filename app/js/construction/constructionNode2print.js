/** app/js/construction/constructionNode2print.js —— 工程节点表（打印）
 *  上下文：app.params.construction（工程单行数据，含 decoration）。
 *  queryConstructionScheduleByOrderId → 节点行（节点名/预计开工/预计完工/开工/完工/状态）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var construction = app.params.construction || {};
    var dec = construction.decoration || {};

    function nvl(v) { return v == null ? '' : v; }

    var html = '<table class="print-table"><caption>工程节点表<\/caption>'
        + '<tr>'
        + '<td style="width:120px;">订单编号<\/td><td>' + nvl(dec.orderId) + '<\/td>'
        + '<td style="width:120px;">施工地址<\/td><td>' + nvl(dec.house && dec.house.village ? dec.house.village.name : '') + ' ' + nvl(dec.house ? dec.house.houseNumber : '') + '<\/td>'
        + '<\/tr><tr>'
        + '<td>交付监理<\/td><td>' + nvl(dec.supervisor ? dec.supervisor.userName : '') + '<\/td>'
        + '<td>房屋面积<\/td><td>' + nvl(dec.house ? dec.house.buildArea : '') + '<\/td>'
        + '<\/tr><tr>'
        + '<th>节点名<\/th><th>预计开工时间<\/th><th>预计完工时间<\/th><th>开工时间<\/th><th>完工时间<\/th><th>状态<\/th>'
        + '<\/tr>';

    var rows = '';
    app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': dec.orderId }, function (res) {
        $.each(res.constructionSchedules || [], function (i, v) {
            if (v.csid == null) return;
            rows += '<tr>'
                + '<td>' + nvl(v.node ? v.node.name : '') + '<\/td>'
                + '<td>' + nvl(v.preStartTime) + '<\/td>'
                + '<td>' + nvl(v.preEndTime) + '<\/td>'
                + '<td>' + nvl(v.startTime) + '<\/td>'
                + '<td>' + nvl(v.endTimee != null ? v.endTimee : v.endTime) + '<\/td>'
                + '<td>' + (E.scheduleStatus[v.status] != null ? E.scheduleStatus[v.status] : nvl(v.status)) + '<\/td>'
                + '<\/tr>';
        });
        $('#reslist').html(html + rows + '<\/table>');
    }, null, false);
});
}); // end app.ready
