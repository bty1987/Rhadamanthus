/** app/js/report/materialSalesReport.js —— 主材经营报表（echarts）
 * 销售趋势(单量柱+总额曲线 双Y轴) + 品类销售额结构饼图。数据源 metric_sales_monthly。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {} };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshSalesMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
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
        app.post(api.report.querySalesTrend, o, function (res) { renderTrend(res.salesTrend || []); });
        app.post(api.report.querySalesCategoryDist, o, function (res) { renderPie(res.categoryDist || []); });
    }

    function renderTrend(data) {
        var dates = [], counts = [], amounts = [];
        $.each(data, function (i, v) { dates.push(v.date); counts.push(v.value1); amounts.push(v.value2 / 100); });
        echarts.init($('#salesTrendChart')[0]).setOption({
            title: { text: '主材销售月度趋势', left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['销售单量', '销售总额'], top: 30 },
            xAxis: [{ type: 'category', data: dates }],
            yAxis: [{ type: 'value', name: '销售单量', position: 'left' }, { type: 'value', name: '销售总额(元)', position: 'right' }],
            series: [
                { name: '销售单量', type: 'bar', yAxisIndex: 0, data: counts },
                { name: '销售总额', type: 'line', yAxisIndex: 1, data: amounts, smooth: true }
            ]
        });
    }
    function renderPie(data) {
        var arr = []; $.each(data, function (i, v) { arr.push({ name: v.name, value: v.value / 100 }); });
        echarts.init($('#categoryPie')[0]).setOption({
            title: { text: '品类销售额结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 元 ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [{ type: 'pie', radius: '60%', center: ['55%', '55%'], label: { formatter: '{b}: {d}%' }, data: arr }]
        });
    }

    $('#btnSearch').click();
});
});
