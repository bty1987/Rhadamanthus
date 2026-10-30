/** app/js/report/paymentReport.js —— 财务收款报表（echarts）
 * 收退款月度趋势(收款/退款/净收款 三线) + 收款款项结构饼图。数据源 metric_payment_daily。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {} };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshPaymentMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
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
        app.post(api.report.queryPaymentTrend, o, function (res) {
            renderTrend(res.collectTrend || [], res.refundTrend || [], res.netTrend || []);
        });
        app.post(api.report.queryPaymentTypeDist, o, function (res) { renderPie(res.paymentTypeDist || []); });
    }

    function renderTrend(collect, refund, net) {
        var dates = [], c = [], r = [], n = [];
        $.each(collect, function (i, v) { dates.push(v.date); c.push(v.amount / 100); });
        $.each(refund, function (i, v) { r.push(v.amount / 100); });
        $.each(net, function (i, v) { n.push(v.amount / 100); });
        echarts.init($('#trendChart')[0]).setOption({
            title: { text: '收退款月度趋势', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 元'; } },
            legend: { data: ['收款', '退款', '净收款'], top: 30 },
            xAxis: { type: 'category', data: dates }, yAxis: { type: 'value', name: '金额(元)' },
            series: [
                { name: '收款', type: 'line', data: c, smooth: true },
                { name: '退款', type: 'line', data: r, smooth: true },
                { name: '净收款', type: 'line', data: n, smooth: true }
            ]
        });
    }
    function renderPie(data) {
        var arr = []; $.each(data, function (i, v) { arr.push({ name: v.name, value: v.value / 100 }); });
        echarts.init($('#typePie')[0]).setOption({
            title: { text: '收款款项结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 元 ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [{ type: 'pie', radius: '60%', center: ['55%', '55%'], label: { formatter: '{b}: {d}%' }, data: arr }]
        });
    }

    $('#btnSearch').click();
});
});
