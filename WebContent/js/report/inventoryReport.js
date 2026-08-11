/**
 * 仓储物流报表（D6 主题域）。
 *
 * 2 维度图表（均来自 report.metric_inventory_monthly 汇总表）：
 *   ① 出入库趋势：入库 + 出库单据量双线（反映仓储吞吐）
 *   ② 类型结构饼图：进货/进退/出货/辅料/采购/调拨... 占比
 *
 * 数据每天凌晨由 ReportMetricJob 全量重算。
 */
$(function() {

    var inventoryReport = {
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

        inventoryReport.options = options;
        renderAll();
    });

    // 刷新数据按钮
    com.focusPage("#fl_btn_refresh").on("click", function() {

        com.post(api.report.refreshInventoryMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = inventoryReport.options;

        // 出入库趋势（入库/出库双线）
        com.post(api.report.queryInventoryInOutTrend, options, function(res) {
            renderInOutTrend(res.inOutTrend);
        });

        // 类型结构饼图
        com.post(api.report.queryInventoryTypeDist, options, function(res) {
            renderTypePie(res.typeDist);
        });
    }

    // 出入库趋势（双线）
    function renderInOutTrend(inOutTrend) {

        var categories = [];
        var inData = [];
        var outData = [];

        $.each(inOutTrend, function(i, v) {
            categories.push(v.date);
            inData.push(v.value1); // 入库
            outData.push(v.value2); // 出库
        });

        com.focusPage('#inOutTrendChart').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '出入库月度趋势'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: '单据量'
                }
            },
            tooltip: {
                valueSuffix: ' 单'
            },
            series: [{
                name: '入库',
                data: inData
            }, {
                name: '出库',
                data: outData
            }]
        });
    }

    // 类型结构饼图
    function renderTypePie(typeDist) {

        var data = [];
        $.each(typeDist, function(i, v) {
            data.push([v.name, v.value]);
        });

        com.focusPage('#typePie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '出入库类型结构'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:,.0f} 单 ({point.percentage:.1f}%)</b>'
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
                name: '单据量',
                data: data
            }]
        });
    }

});
