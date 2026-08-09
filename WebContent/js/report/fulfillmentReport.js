/**
 * 装修履约报表（D3 主题域）。
 *
 * 4 维度图表：
 *   ① 开工/完工趋势（双线）
 *   ② 工期对比：实际 vs 计划（双线）
 *   ③ 超期数分布（柱状）
 *   ④ 报价 vs 签约额趋势（双线）
 *
 * 施工数据源 report.metric_construction_monthly，报价数据源 report.metric_quotation_monthly。
 */
$(function() {

    var fulfillment = {
        options: {}
    };

    // 日期范围选择器初始化
    $('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function() {
        $(this).next().focus();
    });
    com.focusPage("#dateRangeSearch").attr("readonly", "readonly");

    // 查询按钮
    com.focusPage("#fl_btn_searchDiv").on("click", function() {

        var options = buildOptions();
        fulfillment.options = options;
        renderAll();
    });

    // 刷新数据按钮：同时刷新施工和报价
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

        // ① 开工/完工趋势
        com.post(api.report.queryConstructionStartFinishTrend, options, function(res) {
            renderDualLine('startFinishChart', '开工/完工趋势', res.startFinishTrend, '开工量', '完工量', '单');
        });

        // ② 工期对比
        com.post(api.report.queryConstructionPeriodTrend, options, function(res) {
            renderDualLine('periodChart', '工期对比（实际 vs 计划）', res.periodTrend, '实际工期', '计划工期', '天');
        });

        // ③ 超期数分布
        com.post(api.report.queryConstructionOverdueDist, options, function(res) {
            renderColumn('overdueChart', '超期数分布', res.overdueDist, '超期数', '单');
        });

        // ④ 报价 vs 签约额
        com.post(api.report.queryQuotationSignTrend, options, function(res) {
            renderDualLine('quotationChart', '报价 vs 签约额', res.quotationSignTrend, '报价额', '签约额', '元', true);
        });
    }

    // 双线折线通用渲染（data: List<{date,value1,value2}>）
    function renderDualLine(chartId, title, data, name1, name2, unit, divide) {

        var categories = [];
        var data1 = [];
        var data2 = [];

        $.each(data, function(i, v) {
            categories.push(v.date);
            data1.push(divide ? v.value1 / 100 : v.value1);
            data2.push(divide ? v.value2 / 100 : v.value2);
        });

        com.focusPage('#' + chartId).highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: title
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: unit
                }
            },
            tooltip: {
                valueSuffix: ' ' + unit
            },
            series: [{
                name: name1,
                data: data1
            }, {
                name: name2,
                data: data2
            }]
        });
    }

    // 柱状图通用渲染（data: List<{name,value}>）
    function renderColumn(chartId, title, data, seriesName, unit) {

        var categories = [];
        var values = [];

        $.each(data, function(i, v) {
            categories.push(v.name);
            values.push(v.value);
        });

        com.focusPage('#' + chartId).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: title
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: unit
                }
            },
            tooltip: {
                valueSuffix: ' ' + unit
            },
            series: [{
                name: seriesName,
                data: values
            }]
        });
    }

});
