/**
 * 主材经营报表（echarts 版）。
 *
 * ① 销售趋势：单量(柱) + 总额(曲线) 双 Y 轴
 * ② 品类结构饼图
 */
$(function() {

    var materialSales = {
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

        materialSales.options = options;
        renderAll();
    });

    // 页面加载默认填充当前月份并自动查询
    var now = moment();
    com.focusPage("#dateRangeSearch").val(now.startOf('month').format('YYYY/MM/DD') + ' - ' + now.format('YYYY/MM/DD'));
    com.focusPage("#fl_btn_searchDiv").trigger("click");

    com.focusPage("#fl_btn_refresh").on("click", function() {
        com.post(api.report.refreshSalesMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = materialSales.options;

        com.post(api.report.querySalesTrend, options, function(res) {
            renderTrend(res.salesTrend);
        });

        com.post(api.report.querySalesCategoryDist, options, function(res) {
            renderPie(res.categoryDist);
        });
    }

    // 销售趋势（双Y轴：单量柱+金额曲线）
    function renderTrend(salesTrend) {

        var dates = [];
        var counts = [];
        var amounts = [];

        $.each(salesTrend, function(i, v) {
            dates.push(v.date);
            counts.push(v.value1); // 单量
            amounts.push(v.value2 / 100); // 总额 分→元
        });

        var chart = echarts.init(com.focusPage('#salesTrendChart')[0]);
        chart.setOption({
            title: { text: '主材销售月度趋势', left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['销售单量', '销售总额'], top: 30 },
            xAxis: [{ type: 'category', data: dates }],
            yAxis: [
                { type: 'value', name: '销售单量', position: 'left' },
                { type: 'value', name: '销售总额(元)', position: 'right' }
            ],
            series: [
                { name: '销售单量', type: 'bar', yAxisIndex: 0, data: counts },
                { name: '销售总额', type: 'line', yAxisIndex: 1, data: amounts, smooth: true }
            ]
        });
    }

    // 品类结构饼图
    function renderPie(categoryDist) {

        var data = [];
        $.each(categoryDist, function(i, v) {
            data.push({ name: v.name, value: v.value / 100 });
        });

        var chart = echarts.init(com.focusPage('#categoryPie')[0]);
        chart.setOption({
            title: { text: '品类销售额结构', left: 'center' },
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
