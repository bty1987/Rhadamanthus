/**
 * 人力薪酬报表（D8 主题域）。
 *
 * 2 维度图表（均来自 report.metric_salary_monthly 汇总表）：
 *   ① 工费趋势：单量(柱) + 实发总额(曲线) 双 Y 轴
 *   ② 工种结构饼图：工费/增项/油工奖励/维修款/预支... 占比
 */
$(function() {

    var salaryReport = {
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

        salaryReport.options = options;
        renderAll();
    });

    com.focusPage("#fl_btn_refresh").on("click", function() {
        com.post(api.report.refreshSalaryMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = salaryReport.options;

        com.post(api.report.querySalaryMetricTrend, options, function(res) {
            renderTrend(res.salaryTrend);
        });

        com.post(api.report.querySalaryWorkerTypeDist, options, function(res) {
            renderPie(res.workerTypeDist);
        });
    }

    // 工费趋势（双Y轴：单量柱+金额曲线）
    function renderTrend(salaryTrend) {

        var dates = [];
        var counts = [];
        var amounts = [];

        $.each(salaryTrend, function(i, v) {
            dates.push(v.date);
            counts.push(v.value1); // 单量
            amounts.push(v.value2 / 100); // 实发总额 分→元
        });

        var chart = echarts.init(com.focusPage('#trendChart')[0]);
        chart.setOption({
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
        $.each(workerTypeDist, function(i, v) {
            data.push({ name: v.name, value: v.value / 100 });
        });

        var chart = echarts.init(com.focusPage('#typePie')[0]);
        chart.setOption({
            title: { text: '工种薪酬结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 元 ({d}%)' },
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
