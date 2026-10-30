/** app/js/report/approvalReport.js —— 审批运营报表（D9 主题域，echarts）
 * ① 审批趋势：审批总量 + 拒绝量双线
 * ② 类型结构饼图：客源/销售退款/装修活动/装修归属... 占比
 * 数据源 report.metric_approval_monthly 汇总表。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { options: {}, approvalTrend: [] };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { st.options = buildOptions(); renderAll(); });
    $('#btnRefresh').on('click', function () {
        app.post(api.report.refreshApprovalMetric, {}, function () { app.showAlert(app.info, '数据刷新成功'); renderAll(); });
    });
    // 导出Excel：审批月度宽表（CSV）
    $('#btnExport').on('click', function () {
        if (!st.approvalTrend || st.approvalTrend.length == 0) { app.showAlert(app.warning, '请先查询数据'); return; }
        var rows = [['月份', '审批总量', '拒绝量'].join(',')];
        $.each(st.approvalTrend, function (i, v) {
            rows.push(['"' + v.date + '"', v.value1, v.value2].join(','));
        });
        downloadCsv(rows, '审批运营报表.csv');
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
        app.post(api.report.queryApprovalTrend, o, function (res) {
            st.approvalTrend = res.approvalTrend || [];
            renderTrend(st.approvalTrend);
        });
        app.post(api.report.queryApprovalTypeDist, o, function (res) { renderPie(res.typeDist || []); });
    }

    // 审批趋势（总量/拒绝双线）
    function renderTrend(approvalTrend) {
        var dates = [], totalData = [], rejectData = [];
        $.each(approvalTrend, function (i, v) {
            dates.push(v.date);
            totalData.push(v.value1); // 审批总量
            rejectData.push(v.value2); // 拒绝量
        });
        echarts.init($('#trendChart')[0]).setOption({
            title: { text: '审批趋势（总量 / 拒绝）', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 单'; } },
            legend: { data: ['审批总量', '拒绝量'], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: '审批单数' },
            series: [
                { name: '审批总量', type: 'line', data: totalData, smooth: true },
                { name: '拒绝量', type: 'line', data: rejectData, smooth: true }
            ]
        });
    }

    // 类型结构饼图
    function renderPie(typeDist) {
        var data = [];
        $.each(typeDist, function (i, v) { data.push({ name: v.name, value: v.value }); });
        echarts.init($('#typePie')[0]).setOption({
            title: { text: '审批类型结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 单 ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [{
                type: 'pie', radius: '60%', center: ['55%', '55%'],
                label: { formatter: '{b}: {d}%' },
                data: data
            }]
        });
    }

    function downloadCsv(rows, filename) {
        var blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    }

    $('#btnSearch').click();
});
});
