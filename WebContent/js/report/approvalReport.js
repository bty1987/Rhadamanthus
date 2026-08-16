/**
 * 审批运营报表（D9 主题域）。
 *
 * 2 维度图表（均来自 report.metric_approval_monthly 汇总表）：
 *   ① 审批趋势：审批总量 + 拒绝量双线
 *   ② 类型结构饼图：客源/销售退款/装修活动/装修归属... 占比
 */
$(function() {

    var approvalReport = {
        options: {}
    };

    $('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function() {
        $(this).next().focus();
    });
    com.focusPage("#dateRangeSearch").attr("readonly", "readonly");

    com.focusPage("#fl_btn_searchDiv").on("click", function() {

        var dateRange = com.focusPage("#dateRangeSearch").val();

        var options = {};
        options["company"] = params.company.cid;

        if (dateRange != "") {
            var startTime = dateRange.split("-")[0].replace(/\//g, "-");
            var endTime = dateRange.split("-")[1].replace(/\//g, "-");

            options["filters[0].field"] = "startTime";
            options["filters[0].data"] = startTime;
            options["filters[0].op"] = "eq";
            options["filters[1].field"] = "endTime";
            options["filters[1].data"] = endTime;
            options["filters[1].op"] = "eq";
        }

        approvalReport.options = options;
        renderAll();
    });

    com.focusPage("#fl_btn_refresh").on("click", function() {
        com.post(api.report.refreshApprovalMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    // 导出Excel：审批月度宽表
    com.focusPage("#fl_btn_export").on("click", function() {

        if (!approvalReport.approvalTrend || approvalReport.approvalTrend.length == 0) {
            com.showAlert(com.warning, "请先查询数据");
            return false;
        }

        var list = [];
        $.each(approvalReport.approvalTrend, function(i, v) {
            list.push({ date: v.date, total: v.value1, reject: v.value2 });
        });

        $.exceler({
            column: [["月份", "date"], ["审批总量", "total"], ["拒绝量", "reject"]],
            list: list
        });
    });

    function renderAll() {

        var options = approvalReport.options;

        com.post(api.report.queryApprovalTrend, options, function(res) {
            approvalReport.approvalTrend = res.approvalTrend;
            renderTrend(res.approvalTrend);
        });

        com.post(api.report.queryApprovalTypeDist, options, function(res) {
            renderPie(res.typeDist);
        });
    }

    // 审批趋势（总量/拒绝双线）
    function renderTrend(approvalTrend) {

        var dates = [];
        var totalData = [];
        var rejectData = [];

        $.each(approvalTrend, function(i, v) {
            dates.push(v.date);
            totalData.push(v.value1); // 审批总量
            rejectData.push(v.value2); // 拒绝量
        });

        var chart = echarts.init(com.focusPage('#trendChart')[0]);
        chart.setOption({
            title: { text: '审批趋势（总量 / 拒绝）', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' 单'; } },
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
        $.each(typeDist, function(i, v) {
            data.push({ name: v.name, value: v.value });
        });

        var chart = echarts.init(com.focusPage('#typePie')[0]);
        chart.setOption({
            title: { text: '审批类型结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 单 ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [{
                type: 'pie',
                radius: '60%',
                center: ['55%', '55%'],
                label: { formatter: '{b}: {d}%' },
                data: data
            }]
        });
    }

});
