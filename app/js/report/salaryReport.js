/** app/js/report/salaryReport.js —— 人力薪酬报表（D8 主题域，echarts）
 * ① 工费趋势：单量(柱) + 实发总额(曲线) 双 Y 轴
 * ② 工种结构饼图：工费/增项/油工奖励/维修款/预支... 占比
 * 数据源 report.metric_salary_monthly 汇总表。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {}, salaryTrend: [] };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshSalaryMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
    });
    // 导出Excel：工费月度宽表（CSV）
    $('#btnExport').on('click', function () {
        if (!st.salaryTrend || st.salaryTrend.length == 0) { app.showAlert(app.warning, '请先查询数据'); return; }
        var rows = [['月份', '工费单量', '实发总额(元)'].join(',')];
        $.each(st.salaryTrend, function (i, v) {
            rows.push(['"' + v.date + '"', v.value1, v.value2 / 100].join(','));
        });
        var blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = '人力薪酬报表.csv'; a.click();
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
        app.post(api.report.querySalaryMetricTrend, o, function (res) {
            st.salaryTrend = res.salaryTrend || [];
            renderTrend(st.salaryTrend);
        });
        app.post(api.report.querySalaryWorkerTypeDist, o, function (res) { renderPie(res.workerTypeDist || []); });
    }

    // 工费趋势（双Y轴：单量柱+金额曲线）
    function renderTrend(salaryTrend) {
        var dates = [], counts = [], amounts = [];
        $.each(salaryTrend, function (i, v) {
            dates.push(v.date);
            counts.push(v.value1); // 单量
            amounts.push(v.value2 / 100); // 实发总额 分→元
        });
        echarts.init($('#trendChart')[0]).setOption({
            title: { text: '工人工费月度趋势', left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['工费单量', '实发总额'], top: 30 },
            xAxis: [{ type: 'category', data: dates }],
            yAxis: [
                { type: 'value', name: '工费单量', position: 'left' },
                { type: 'value', name: '实发总额(元)', position: 'right' }
            ],
            series: [
                { name: '工费单量', type: 'bar', yAxisIndex: 0, data: counts },
                { name: '实发总额', type: 'line', yAxisIndex: 1, data: amounts, smooth: true }
            ]
        });
    }

    // 工种结构饼图
    function renderPie(workerTypeDist) {
        var data = [];
        $.each(workerTypeDist, function (i, v) { data.push({ name: v.name, value: v.value / 100 }); });
        echarts.init($('#typePie')[0]).setOption({
            title: { text: '工种薪酬结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 元 ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [{
                type: 'pie', radius: '60%', center: ['55%', '55%'],
                label: { formatter: '{b}: {d}%' },
                data: data
            }]
        });
    }

    $('#btnSearch').click();
});
});
