/** app/js/report/inventoryReport.js —— 仓储物流报表（echarts）
 * 出入库月度趋势(入库+出库 双线) + 出入库类型结构饼图。数据源 metric_inventory_monthly。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {} };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshInventoryMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
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
        app.post(api.report.queryInventoryInOutTrend, o, function (res) { renderInOutTrend(res.inOutTrend || []); });
        app.post(api.report.queryInventoryTypeDist, o, function (res) { renderTypePie(res.typeDist || []); });
    }

    function renderInOutTrend(data) {
        var dates = [], inD = [], outD = [];
        $.each(data, function (i, v) { dates.push(v.date); inD.push(v.value1); outD.push(v.value2); });
        echarts.init($('#inOutTrendChart')[0]).setOption({
            title: { text: '出入库月度趋势', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 单'; } },
            legend: { data: ['入库', '出库'], top: 30 },
            xAxis: { type: 'category', data: dates }, yAxis: { type: 'value', name: '单据量' },
            series: [{ name: '入库', type: 'line', data: inD, smooth: true }, { name: '出库', type: 'line', data: outD, smooth: true }]
        });
    }
    function renderTypePie(data) {
        var arr = []; $.each(data, function (i, v) { arr.push({ name: v.name, value: v.value }); });
        echarts.init($('#typePie')[0]).setOption({
            title: { text: '出入库类型结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 单 ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [{ type: 'pie', radius: '60%', center: ['55%', '55%'], label: { formatter: '{b}: {d}%' }, data: arr }]
        });
    }

    $('#btnSearch').click();
});
});
