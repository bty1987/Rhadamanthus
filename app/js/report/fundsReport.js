/** app/js/report/fundsReport.js —— 资金闭环报表（阶段四·跨模块联动，echarts）
 * ① 资金三段趋势：报价额 / 签约额 / 实收款 三线（+退款虚线）
 * ② 回款率趋势：实收 / 签约额（月度，双 Y 轴柱线）
 * 数据源 report.metric_funds_monthly 汇总表。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {}, fundsTrend: [] };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshFundsMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
    });
    // 导出Excel：资金闭环月度宽表（CSV）
    $('#btnExport').on('click', function () {
        if (!st.fundsTrend || st.fundsTrend.length == 0) { app.showAlert(app.warning, '请先查询数据'); return; }
        var rows = [['月份', '报价额(元)', '签约额(元)', '实收款(元)', '退款(元)'].join(',')];
        $.each(st.fundsTrend, function (i, v) {
            rows.push(['"' + v.date + '"', v.quotationTotal / 100, v.signTotal / 100, v.collectTotal / 100, v.refundTotal / 100].join(','));
        });
        var blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = '资金闭环报表.csv'; a.click();
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
        app.post(api.report.queryFundsTrend, st.options, function (res) {
            st.fundsTrend = res.fundsTrend || [];
            renderFundsTrend(st.fundsTrend);
            renderRate(st.fundsTrend);
        });
    }

    // 资金三段趋势（报价/签约/实收 + 退款）
    function renderFundsTrend(fundsTrend) {
        var dates = [], quotationData = [], signData = [], collectData = [], refundData = [];
        $.each(fundsTrend, function (i, v) {
            dates.push(v.date);
            quotationData.push(v.quotationTotal / 100);
            signData.push(v.signTotal / 100);
            collectData.push(v.collectTotal / 100);
            refundData.push(v.refundTotal / 100);
        });
        echarts.init($('#fundsTrendChart')[0]).setOption({
            title: { text: '资金闭环趋势（报价 → 签约 → 实收）', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 元'; } },
            legend: { data: ['报价额', '签约额', '实收款', '退款'], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: '金额(元)' },
            series: [
                { name: '报价额', type: 'line', data: quotationData, smooth: true },
                { name: '签约额', type: 'line', data: signData, smooth: true },
                { name: '实收款', type: 'line', data: collectData, smooth: true },
                { name: '退款', type: 'line', data: refundData, smooth: true, lineStyle: { type: 'dashed' } }
            ]
        });
    }

    // 回款率趋势（签约额柱 + 回款率曲线，双 Y 轴）
    function renderRate(fundsTrend) {
        var dates = [], signData = [], rateData = [];
        $.each(fundsTrend, function (i, v) {
            dates.push(v.date);
            signData.push(v.signTotal / 100);
            rateData.push(v.signTotal > 0 ? (v.collectTotal / v.signTotal * 100).toFixed(1) : null);
        });
        echarts.init($('#rateChart')[0]).setOption({
            title: { text: '回款率趋势（实收 / 签约额）', left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['签约额', '回款率'], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: [
                { type: 'value', name: '签约额(元)', position: 'left' },
                { type: 'value', name: '回款率(%)', position: 'right', axisLabel: { formatter: '{value}%' } }
            ],
            series: [
                { name: '签约额', type: 'bar', yAxisIndex: 0, data: signData },
                { name: '回款率', type: 'line', yAxisIndex: 1, data: rateData, smooth: true, connectNulls: true }
            ]
        });
    }

    $('#btnSearch').click();
});
});
