/**
 * 财务收款报表。
 *
 * 2 维度图表（均来自 report.metric_payment_daily 汇总表）：
 *   ① 趋势折线：收款 / 退款 / 净收款 三条线（按月）
 *   ② 饼图：款项结构（预付款/装修款/主材款/其他）
 *
 * 数据每天凌晨由 ReportMetricJob 全量重算，"刷新数据"按钮可即时手动重算。
 */
$(function() {

    var paymentReport = {
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

        paymentReport.options = options;

        renderAll();
    });

    // 刷新数据按钮
    com.focusPage("#fl_btn_refresh").on("click", function() {

        com.post(api.report.refreshPaymentMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = paymentReport.options;

        // 趋势（收款/退款/净收款三线一次返回）
        com.post(api.report.queryPaymentTrend, options, function(res) {
            renderTrend(res.collectTrend, res.refundTrend, res.netTrend);
        });

        // 款项结构饼图
        com.post(api.report.queryPaymentTypeDist, options, function(res) {
            renderPie(res.paymentTypeDist);
        });
    }

    // 趋势折线（三线）
    function renderTrend(collectTrend, refundTrend, netTrend) {

        var categories = [];
        var collectData = [];
        var refundData = [];
        var netData = [];

        // 以收款趋势的月份为 x 轴基准（收款/退款/净收款月份一致）
        $.each(collectTrend, function(i, v) {
            categories.push(v.date);
            collectData.push(v.amount / 100); // 分→元
        });

        $.each(refundTrend, function(i, v) {
            refundData.push(v.amount / 100);
        });

        $.each(netTrend, function(i, v) {
            netData.push(v.amount / 100);
        });

        com.focusPage('#trendChart').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '收退款月度趋势'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: '金额 (元)'
                }
            },
            tooltip: {
                valueSuffix: ' 元'
            },
            series: [{
                name: '收款',
                data: collectData
            }, {
                name: '退款',
                data: refundData
            }, {
                name: '净收款',
                data: netData
            }]
        });
    }

    // 款项结构饼图
    function renderPie(paymentTypeDist) {

        var data = [];
        $.each(paymentTypeDist, function(i, v) {
            data.push([v.name, v.value / 100]); // 分→元
        });

        com.focusPage('#typePie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '收款款项结构'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:,.0f} 元 ({point.percentage:.1f}%)</b>'
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
                name: '收款额',
                data: data
            }]
        });
    }

});
