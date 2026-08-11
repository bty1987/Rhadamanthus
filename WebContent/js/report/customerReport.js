/**
 * 客户获客报表（echarts 版）。
 *
 * ① 获客漏斗趋势：报备量 + 确认量双线
 * ② 来源渠道结构饼图
 * ③ 转单趋势柱状
 */
$(function() {

    var customerReport = {
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

        customerReport.options = options;
        renderAll();
    });

    com.focusPage("#fl_btn_searchDiv").trigger("click");

    com.focusPage("#fl_btn_refresh").on("click", function() {
        com.post(api.report.refreshCustomerMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = customerReport.options;

        com.post(api.report.queryCustomerFunnelTrend, options, function(res) {
            renderFunnelTrend(res.funnelTrend);
        });

        com.post(api.report.queryCustomerSourceDist, options, function(res) {
            renderSourcePie(res.sourceDist);
        });

        com.post(api.report.queryCustomerConvertTrend, options, function(res) {
            renderConvertChart(res.convertTrend);
        });
    }

    // 获客漏斗趋势（双线）
    function renderFunnelTrend(funnelTrend) {

        var dates = [];
        var totalData = [];
        var confirmData = [];

        $.each(funnelTrend, function(i, v) {
            dates.push(v.date);
            totalData.push(v.value1); // 报备量
            confirmData.push(v.value2); // 确认量
        });

        var chart = echarts.init(com.focusPage('#funnelTrendChart')[0]);
        chart.setOption({
            title: { text: '获客漏斗趋势（报备 → 确认）', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' 个'; } },
            legend: { data: ['报备量', '确认量'], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: '客户数' },
            series: [
                { name: '报备量', type: 'line', data: totalData, smooth: true },
                { name: '确认量', type: 'line', data: confirmData, smooth: true }
            ]
        });
    }

    // 来源渠道结构饼图
    function renderSourcePie(sourceDist) {

        var data = [];
        $.each(sourceDist, function(i, v) {
            data.push({ name: v.name, value: v.value });
        });

        var chart = echarts.init(com.focusPage('#sourcePie')[0]);
        chart.setOption({
            title: { text: '客源来源渠道结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
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

    // 转单趋势柱状
    function renderConvertChart(convertTrend) {

        var names = [];
        var values = [];

        $.each(convertTrend, function(i, v) {
            names.push(v.name);
            values.push(v.value);
        });

        var chart = echarts.init(com.focusPage('#convertChart')[0]);
        chart.setOption({
            title: { text: '客源转单趋势', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' 单'; } },
            xAxis: { type: 'category', data: names },
            yAxis: { type: 'value', name: '转单量' },
            series: [{
                name: '转单量',
                type: 'bar',
                data: values
            }]
        });
    }

});
