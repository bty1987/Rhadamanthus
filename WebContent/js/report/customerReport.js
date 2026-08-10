/**
 * 客户获客报表（D1/D2 主题域）。
 *
 * 3 维度图表（均来自 report.metric_customer_monthly 汇总表）：
 *   ① 获客漏斗趋势：报备量 + 确认量双线（反映获客质量）
 *   ② 来源渠道结构饼图：各来源报备量占比
 *   ③ 转单趋势柱状：按月转单量（客源→装修单转化）
 *
 * 数据每天凌晨由 ReportMetricJob 全量重算。
 */
$(function() {

    var customerReport = {
        options: {}
    };

    // 日期范围选择器初始化
    $('input[name=date-range-picker]').daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function() {
        $(this).next().focus();
    });
    com.focusPage("#dateRangeSearch").attr("readonly", "readonly");

    // 查询按钮
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

        customerReport.options = options;
        renderAll();
    });

    // 刷新数据按钮
    com.focusPage("#fl_btn_refresh").on("click", function() {

        com.post(api.report.refreshCustomerMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = customerReport.options;

        // 获客漏斗趋势（报备/确认双线）
        com.post(api.report.queryCustomerFunnelTrend, options, function(res) {
            renderFunnelTrend(res.funnelTrend);
        });

        // 来源渠道结构饼图
        com.post(api.report.queryCustomerSourceDist, options, function(res) {
            renderSourcePie(res.sourceDist);
        });

        // 转单趋势柱状
        com.post(api.report.queryCustomerConvertTrend, options, function(res) {
            renderConvertChart(res.convertTrend);
        });
    }

    // 获客漏斗趋势（双线）
    function renderFunnelTrend(funnelTrend) {

        var categories = [];
        var totalData = [];
        var confirmData = [];

        $.each(funnelTrend, function(i, v) {
            categories.push(v.date);
            totalData.push(v.value1); // 报备量
            confirmData.push(v.value2); // 确认量
        });

        com.focusPage('#funnelTrendChart').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '获客漏斗趋势（报备 → 确认）'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: '客户数'
                }
            },
            tooltip: {
                valueSuffix: ' 个'
            },
            series: [{
                name: '报备量',
                data: totalData
            }, {
                name: '确认量',
                data: confirmData
            }]
        });
    }

    // 来源渠道结构饼图
    function renderSourcePie(sourceDist) {

        var data = [];
        $.each(sourceDist, function(i, v) {
            data.push([v.name, v.value]);
        });

        com.focusPage('#sourcePie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '客源来源渠道结构'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:,.0f} ({point.percentage:.1f}%)</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '报备量',
                data: data
            }]
        });
    }

    // 转单趋势柱状
    function renderConvertChart(convertTrend) {

        var categories = [];
        var values = [];

        $.each(convertTrend, function(i, v) {
            categories.push(v.name);
            values.push(v.value);
        });

        com.focusPage('#convertChart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '客源转单趋势'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: '转单量'
                }
            },
            tooltip: {
                valueSuffix: ' 单'
            },
            series: [{
                name: '转单量',
                data: values
            }]
        });
    }

});
