/** app/js/report/customerReport.js —— 客户获客报表（echarts）
 * ① 获客漏斗趋势：报备量+确认量双线 ② 来源渠道结构饼图 ③ 转单趋势柱状。数据源 metric_customer_monthly。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {} };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshCustomerMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
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
        app.post(api.report.queryCustomerFunnelTrend, o, function (res) { renderFunnelTrend(res.funnelTrend || []); });
        app.post(api.report.queryCustomerSourceDist, o, function (res) { renderSourcePie(res.sourceDist || []); });
        app.post(api.report.queryCustomerConvertTrend, o, function (res) { renderConvertChart(res.convertTrend || []); });
    }

    function renderFunnelTrend(data) {
        var dates = [], total = [], confirm = [];
        $.each(data, function (i, v) { dates.push(v.date); total.push(v.value1); confirm.push(v.value2); });
        echarts.init($('#funnelTrendChart')[0]).setOption({
            title: { text: '获客漏斗趋势（报备 → 确认）', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 个'; } },
            legend: { data: ['报备量', '确认量'], top: 30 },
            xAxis: { type: 'category', data: dates }, yAxis: { type: 'value', name: '客户数' },
            series: [{ name: '报备量', type: 'line', data: total, smooth: true }, { name: '确认量', type: 'line', data: confirm, smooth: true }]
        });
    }
    function renderSourcePie(data) {
        var arr = []; $.each(data, function (i, v) { arr.push({ name: v.name, value: v.value }); });
        echarts.init($('#sourcePie')[0]).setOption({
            title: { text: '客源来源渠道结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [{ type: 'pie', radius: '60%', center: ['55%', '55%'], label: { formatter: '{b}: {d}%' }, data: arr }]
        });
    }
    function renderConvertChart(data) {
        var names = [], values = []; $.each(data, function (i, v) { names.push(v.name); values.push(v.value); });
        echarts.init($('#convertChart')[0]).setOption({
            title: { text: '客源转单趋势', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 单'; } },
            xAxis: { type: 'category', data: names }, yAxis: { type: 'value', name: '转单量' },
            series: [{ name: '转单量', type: 'bar', data: values }]
        });
    }

    $('#btnSearch').click();
});
});
