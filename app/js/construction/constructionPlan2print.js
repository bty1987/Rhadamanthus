/** app/js/construction/constructionPlan2print.js —— 工程施工进度计划表（打印）
 *  上下文：app.params.construction（工程单行数据，含 decoration/drawlineTime）。
 *  queryConstructionPlanByOrderId → 计划行（施工节点/项目/起止日期/天数/主材/周期/配套/内容/备注），
 *  日期基于 drawlineTime 顺序累加；phase 同名合并单元格。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var construction = app.params.construction || {};
    var dec = construction.decoration || {};
    var startTime = new Date(construction.drawlineTime);
    var totalDay = 0;

    function nvl(v) { return v == null ? '' : v; }
    function fmt(d) { return app.dateFormat(d, 'yyyy-MM-dd'); }

    var html = '<table class="print-table" id="planTable"><caption>工程施工进度计划表<\/caption>'
        + '<tr>'
        + '<td>订单编号<\/td><td>' + nvl(dec.orderId) + '<\/td>'
        + '<td colspan="2">施工地址: ' + nvl(dec.house && dec.house.village ? dec.house.village.name : '') + ' ' + nvl(dec.house ? dec.house.houseNumber : '') + '<\/td>'
        + '<td colspan="2">房屋面积: ' + nvl(dec.house ? dec.house.buildArea : '') + '<\/td>'
        + '<\/tr><tr>'
        + '<td>预计开工日期<\/td><td>' + nvl(construction.drawlineTime) + '<\/td>'
        + '<td colspan="2">交付监理: ' + nvl(dec.supervisor ? dec.supervisor.userName : '') + '<\/td>'
        + '<td colspan="2" class="total-day-cell">工程总天数: ' + totalDay + '<\/td>'
        + '<\/tr><tr>'
        + '<th>施工节点<\/th><th>施工项目<\/th><th>工程开始日期<\/th><th>工程结束日期<\/th><th>工程天数<\/th><th>主材天数<\/th><th>进场周期<\/th><th>配套主材<\/th><th>内容<\/th><th>备注<\/th>'
        + '<\/tr>';

    var footer = '<tr><td>施工周期<\/td><td colspan="9">合同决定施工周期: ①平层120m²以内为90天 ②平层120m²-150m²为120天 ③平层150m²-200m²为150天 ④平层200m²-350m²为180天 ⑤阁楼、地下室、别墅类为210天。以上工期均不包含休息日及法定假日。<\/td><\/tr>'
        + '<tr><td rowspan="4">无法开工原因<\/td><td colspan="9">客户原因: 客户没时间改日期,无法交底<\/td><\/tr>'
        + '<tr><td colspan="9">方案原因: 1.橱柜无图纸 2.现场方案改动大 3.燃气热水器无图纸 4.软水、中央净水无图纸<\/td><\/tr>'
        + '<tr><td colspan="9">现场原因: 1.土建、砌筑未完工 2.门窗未封 3.现场拆改未完工 4.老房原始墙面空鼓<\/td><\/tr>'
        + '<tr><td colspan="9">客观原因: 周末、节假日园区不让施工<\/td><\/tr>';

    app.post(api.construction.queryConstructionPlanByOrderId, { 'constructionPlan.orderId': dec.orderId }, function (res) {
        var rows = '';
        totalDay = 0;
        $.each(res.constructionPlans || [], function (i, v) {
            if (v.cpid == null) return;
            totalDay += (v.comnum || 0) + (v.connum || 0);

            var conStart = fmt(startTime);
            startTime.setDate(startTime.getDate() + v.connum);
            var conEnd = fmt(startTime);
            startTime.setDate(startTime.getDate() + v.comnum);

            rows += '<tr>'
                + '<td>' + nvl(v.phase) + '<\/td>'
                + '<td>' + nvl(v.name) + '<\/td>'
                + '<td>' + conStart + '<\/td>'
                + '<td>' + conEnd + '<\/td>'
                + '<td>' + nvl(v.connum) + '<\/td>'
                + '<td>' + nvl(v.comnum) + '<\/td>'
                + '<td>' + nvl(v.period) + '<\/td>'
                + '<td>' + nvl(v.material) + '<\/td>'
                + '<td>' + nvl(v.content) + '<\/td>'
                + '<td>' + nvl(v.comment) + '<\/td>'
                + '<\/tr>';
        });
        $('#reslist').html(html + rows + footer + '<\/table>');
        $('.total-day-cell').text('工程总天数: ' + totalDay);

        // phase 同名合并单元格
        var $rows = $('#planTable tr:has(td[data-merged!=1])');
        var tbodyRows = $('#planTable tr').slice(3);
        var prevPhase = null, $startCell = null, rowspan = 1;
        tbodyRows.each(function () {
            var $cell = $(this).find('td').eq(0);
            if (!$cell.length) return;
            var phase = $.trim($cell.text());
            if (phase === prevPhase && phase !== '' && phase !== '施工周期' && phase.indexOf('原因') == -1) {
                rowspan++;
                $startCell.attr('rowspan', rowspan);
                $cell.remove();
            } else {
                prevPhase = phase;
                $startCell = $cell;
                rowspan = 1;
            }
        });
    }, null, false);
});
}); // end app.ready
