/**
 * 主材经营报表（D4 主题域）。
 *
 * 2 维度图表（均来自 report.metric_sales_monthly 汇总表）：
 *   ① 销售趋势：单量 + 总额双线（双 Y 轴，单量/金额量级不同）
 *   ② 品类结构饼图：橱柜/全屋定制/电器/瓷砖/卫浴... 占比
 *
 * 数据每天凌晨由 ReportMetricJob 全量重算，"刷新数据"按钮可即时手动重算。
 */
$(function() {

    var materialSales = {
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

        materialSales.options = options;
        renderAll();
    });

    // 刷新数据按钮
    com.focusPage("#fl_btn_refresh").on("click", function() {

        com.post(api.report.refreshSalesMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = materialSales.options;

        // 销售趋势（单量+总额双线，双Y轴）
        com.post(api.report.querySalesTrend, options, function(res) {
            renderTrend(res.salesTrend);
        });

        // 品类结构饼图
        com.post(api.report.querySalesCategoryDist, options, function(res) {
            renderPie(res.categoryDist);
        });
    }

    // 销售趋势（双Y轴：单量/金额）
    function renderTrend(salesTrend) {

        var categories = [];
        var counts = [];
        var amounts = [];

        $.each(salesTrend, function(i, v) {
            categories.push(v.date);
            counts.push(v.value1); // 单量
            amounts.push(v.value2 / 100); // 总额 分→元
        });

        com.focusPage('#salesTrendChart').highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: '主材销售月度趋势'
            },
            credits: {
                enabled: false
            },
            xAxis: [{
                categories: categories,
                crosshair: true
            }],
            yAxis: [{
                labels: {
                    format: '{value} 单',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                title: {
                    text: '销售单量',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }
            }, {
                title: {
                    text: '销售总额 (元)',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                labels: {
                    format: '{value} 元',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            series: [{
                name: '销售单量',
                type: 'column',
                yAxis: 0,
                data: counts
            }, {
                name: '销售总额',
                type: 'spline',
                yAxis: 1,
                data: amounts,
                tooltip: {
                    valueSuffix: ' 元'
                }
            }]
        });
    }

    // 品类结构饼图
    function renderPie(categoryDist) {

        var data = [];
        $.each(categoryDist, function(i, v) {
            data.push([v.name, v.value / 100]); // 分→元
        });

        com.focusPage('#categoryPie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '品类销售额结构'
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
                name: '销售额',
                data: data
            }]
        });
    }

});
