/** app/js/report/fulfillmentReport.js —— 装修履约报表（echarts）
 * 开工/完工趋势 / 工期对比(实际vs计划) / 超期数分布 / 报价vs签约额。
 * 数据源 metric_construction_monthly + metric_quotation_monthly。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {} };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshConstructionMetric, {}, function () {
            app.post(api.report.refreshQuotationMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
        });
    });

    function buildOptions() {
        var dr = $.trim($('#dateRange').val()), o = {};
        if (app.params.company && app.params.company.cid) o.company = app.params.company.cid;
        if (dr) {
            var arr = dr.split(' - ');
            o['filters[0].field'] = 'startTime'; o['filters[0].data'] = arr[0]; o['filters[0].op'] = 'eq';
            o['filters[1].field'] = 'endTime'; o['filters[1].data'] = arr[1]; o['filters[1].op'] = 'eq';
        }
        return o;
    }
    function renderAll() {
        var o = st.options;
        app.post(api.report.queryConstructionStartFinishTrend, o, function (res) { dualLine('startFinishChart', '开工/完工趋势', res.startFinishTrend || [], '开工量', '完工量', '单'); });
        app.post(api.report.queryConstructionPeriodTrend, o, function (res) { dualLine('periodChart', '工期对比（实际 vs 计划）', res.periodTrend || [], '实际工期', '计划工期', '天'); });
        app.post(api.report.queryConstructionOverdueDist, o, function (res) { column('overdueChart', '超期数分布', res.overdueDist || [], '超期数', '单'); });
        app.post(api.report.queryQuotationSignTrend, o, function (res) { dualLine('quotationChart', '报价 vs 签约额', res.quotationSignTrend || [], '报价额', '签约额', '元', true); });
    }

    function dualLine(id, title, data, n1, n2, unit, divide) {
        var dates = [], d1 = [], d2 = [];
        $.each(data, function (i, v) { dates.push(v.date); d1.push(divide ? v.value1 / 100 : v.value1); d2.push(divide ? v.value2 / 100 : v.value2); });
        echarts.init($('#' + id)[0]).setOption({
            title: { text: title, left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' ' + unit; } },
            legend: { data: [n1, n2], top: 30 },
            xAxis: { type: 'category', data: dates }, yAxis: { type: 'value', name: unit },
            series: [{ name: n1, type: 'line', data: d1, smooth: true }, { name: n2, type: 'line', data: d2, smooth: true }]
        });
    }
    function column(id, title, data, seriesName, unit) {
        var names = [], values = [];
        $.each(data, function (i, v) { names.push(v.name); values.push(v.value); });
        echarts.init($('#' + id)[0]).setOption({
            title: { text: title, left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' ' + unit; } },
            xAxis: { type: 'category', data: names }, yAxis: { type: 'value', name: unit },
            series: [{ name: seriesName, type: 'bar', data: values }]
        });
    }

    $('#btnSearch').click();
});
});
