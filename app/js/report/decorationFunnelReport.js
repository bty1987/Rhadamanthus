/** app/js/report/decorationFunnelReport.js —— 装修销售转化报表（echarts）
 * 漏斗 / 状态分布 / 签约额趋势 / 装修类型分布。数据源 metric_decoration_daily。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {} };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshDecorationMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
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
        app.post(api.report.queryDecorationFunnel, o, function (res) { renderFunnel(res.funnel || []); });
        app.post(api.report.queryDecorationStatusDist, o, function (res) { renderPie(res.statusDist || []); });
        app.post(api.report.queryDecorationSignTrend, o, function (res) { renderTrend(res.signTrend || []); });
        app.post(api.report.queryDecorationTypeDist, o, function (res) { renderType(res.typeDist || []); });
    }

    function renderFunnel(data) {
        var arr = []; $.each(data, function (i, v) { arr.push({ name: v.name, value: v.value }); });
        echarts.init($('#funnelChart')[0]).setOption({
            title: { text: '装修销售转化漏斗', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c}' },
            series: [{ type: 'funnel', left: '10%', right: '10%', top: 60, bottom: 30, width: '80%', label: { show: true, position: 'inside', formatter: '{b}: {c}' }, data: arr }]
        });
    }
    function renderPie(data) {
        var arr = []; $.each(data, function (i, v) { arr.push({ name: v.name, value: v.value }); });
        echarts.init($('#statusPie')[0]).setOption({
            title: { text: '订单状态分布', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [{ type: 'pie', radius: '60%', center: ['55%', '55%'], label: { formatter: '{b}: {d}%' }, data: arr }]
        });
    }
    function renderTrend(data) {
        var dates = [], amounts = [];
        $.each(data, function (i, v) { dates.push(v.date); amounts.push(v.amount / 100); });
        echarts.init($('#trendChart')[0]).setOption({
            title: { text: '签约额月度趋势', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 元'; } },
            xAxis: { type: 'category', data: dates }, yAxis: { type: 'value', name: '签约额(元)' },
            series: [{ name: '签约额', type: 'line', data: amounts, smooth: true }]
        });
    }
    function renderType(data) {
        var names = [], counts = [];
        $.each(data, function (i, v) { names.push(v.name); counts.push(v.value); });
        echarts.init($('#typeChart')[0]).setOption({
            title: { text: '装修类型分布', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 单'; } },
            xAxis: { type: 'category', data: names }, yAxis: { type: 'value', name: '订单数' },
            series: [{ name: '订单数', type: 'bar', data: counts }]
        });
    }

    $('#btnSearch').click();
});
});
