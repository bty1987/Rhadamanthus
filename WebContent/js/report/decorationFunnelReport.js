/**
 * 装修销售转化报表。
 *
 * 4 维度图表（均来自 report.metric_decoration_daily 汇总表）：
 *   ① 漏斗图：量尺→定金→预签→签约→决算→完工
 *   ② 饼图：订单状态分布
 *   ③ 折线图：签约额月度趋势
 *   ④ 柱状图：装修类型分布（半包/整装/大包）
 *
 * 数据每天凌晨由 MetricRefreshJob 全量重算，"刷新数据"按钮可即时手动重算。
 */
$(function() {

    var decorationFunnel = {
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

        decorationFunnel.options = options;

        renderAll();
    });

    // 刷新数据按钮：手动触发重算，完成后自动查询
    com.focusPage("#fl_btn_refresh").on("click", function() {

        com.post(api.report.refreshDecorationMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = decorationFunnel.options;

        // ① 漏斗图
        com.post(api.report.queryDecorationFunnel, options, function(res) {
            renderFunnel(res.funnel);
        });

        // ② 状态分布饼图
        com.post(api.report.queryDecorationStatusDist, options, function(res) {
            renderPie(res.statusDist);
        });

        // ③ 签约额趋势
        com.post(api.report.queryDecorationSignTrend, options, function(res) {
            renderTrend(res.signTrend);
        });

        // ④ 装修类型分布
        com.post(api.report.queryDecorationTypeDist, options, function(res) {
            renderType(res.typeDist);
        });
    }

    // 漏斗图
    function renderFunnel(funnel) {

        var data = [];
        $.each(funnel, function(i, v) {
            data.push([v.name, v.value]);
        });

        com.focusPage('#funnelChart').highcharts({
            chart: {
                type: 'funnel',
                marginRight: 100
            },
            title: {
                text: '装修销售转化漏斗'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y:,.0f}',
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    neckWidth: '30%',
                    neckHeight: '25%'
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: '订单数',
                data: data
            }]
        });
    }

    // 状态分布饼图
    function renderPie(statusDist) {

        var data = [];
        $.each(statusDist, function(i, v) {
            data.push([v.name, v.value]);
        });

        com.focusPage('#statusPie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '订单状态分布'
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
                name: '订单数',
                data: data
            }]
        });
    }

    // 签约额趋势折线
    function renderTrend(signTrend) {

        var categories = [];
        var amounts = [];

        $.each(signTrend, function(i, v) {
            categories.push(v.date);
            amounts.push(v.amount / 100); // 分→元
        });

        com.focusPage('#trendChart').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '签约额月度趋势'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: '签约额 (元)'
                }
            },
            tooltip: {
                valueSuffix: ' 元'
            },
            series: [{
                name: '签约额',
                data: amounts
            }]
        });
    }

    // 装修类型分布柱状
    function renderType(typeDist) {

        var categories = [];
        var counts = [];

        $.each(typeDist, function(i, v) {
            categories.push(v.name);
            counts.push(v.value);
        });

        com.focusPage('#typeChart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '装修类型分布'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: '订单数'
                }
            },
            tooltip: {
                valueSuffix: ' 单'
            },
            series: [{
                name: '订单数',
                data: counts
            }]
        });
    }

});
