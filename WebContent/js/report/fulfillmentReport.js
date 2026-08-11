/**
 * 装修履约报表（echarts 版）。
 *
 * 4 维度图表：
 *   ① 开工/完工趋势（双线）
 *   ② 工期对比：实际 vs 计划（双线）
 *   ③ 超期数分布（柱状）
 *   ④ 报价 vs 签约额趋势（双线）
 */
$(function() {

    var fulfillment = {
        options: {}
    };

    $('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function() {
        $(this).next().focus();
    });
    com.focusPage("#dateRangeSearch").attr("readonly", "readonly");

    com.focusPage("#fl_btn_searchDiv").on("click", function() {
        fulfillment.options = buildOptions();
        renderAll();
    });

    // 页面加载默认填充当前月份并自动查询
    var now = moment();
    com.focusPage("#dateRangeSearch").val(now.startOf('month').format('YYYY/MM/DD') + ' - ' + now.format('YYYY/MM/DD'));
    com.focusPage("#fl_btn_searchDiv").trigger("click");

    com.focusPage("#fl_btn_refresh").on("click", function() {
        com.post(api.report.refreshConstructionMetric, {}, function() {
            com.post(api.report.refreshQuotationMetric, {}, function() {
                com.showAlert(com.info, "数据刷新成功");
                renderAll();
            });
        });
    });

    function buildOptions() {

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

        return options;
    }

    function renderAll() {

        var options = fulfillment.options;

        com.post(api.report.queryConstructionStartFinishTrend, options, function(res) {
            renderDualLine('startFinishChart', '开工/完工趋势', res.startFinishTrend, '开工量', '完工量', '单');
        });

        com.post(api.report.queryConstructionPeriodTrend, options, function(res) {
            renderDualLine('periodChart', '工期对比（实际 vs 计划）', res.periodTrend, '实际工期', '计划工期', '天');
        });

        com.post(api.report.queryConstructionOverdueDist, options, function(res) {
            renderColumn('overdueChart', '超期数分布', res.overdueDist, '超期数', '单');
        });

        com.post(api.report.queryQuotationSignTrend, options, function(res) {
            renderDualLine('quotationChart', '报价 vs 签约额', res.quotationSignTrend, '报价额', '签约额', '元', true);
        });
    }

    // 双线折线通用渲染（data: List<{date,value1,value2}>）
    function renderDualLine(chartId, title, data, name1, name2, unit, divide) {

        var dates = [];
        var data1 = [];
        var data2 = [];

        $.each(data, function(i, v) {
            dates.push(v.date);
            data1.push(divide ? v.value1 / 100 : v.value1);
            data2.push(divide ? v.value2 / 100 : v.value2);
        });

        var chart = echarts.init(com.focusPage('#' + chartId)[0]);
        chart.setOption({
            title: { text: title, left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' ' + unit; } },
            legend: { data: [name1, name2], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: unit },
            series: [
                { name: name1, type: 'line', data: data1, smooth: true },
                { name: name2, type: 'line', data: data2, smooth: true }
            ]
        });
    }

    // 柱状图通用渲染（data: List<{name,value}>）
    function renderColumn(chartId, title, data, seriesName, unit) {

        var names = [];
        var values = [];

        $.each(data, function(i, v) {
            names.push(v.name);
            values.push(v.value);
        });

        var chart = echarts.init(com.focusPage('#' + chartId)[0]);
        chart.setOption({
            title: { text: title, left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' ' + unit; } },
            xAxis: { type: 'category', data: names },
            yAxis: { type: 'value', name: unit },
            series: [{
                name: seriesName,
                type: 'bar',
                data: values
            }]
        });
    }

});
