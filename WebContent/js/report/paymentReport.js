/**
 * 财务收款报表（echarts 版）。
 *
 * ② 趋势折线：收款 / 退款 / 净收款 三条线（按月）
 * ② 饼图：款项结构（预付款/装修款/主材款/其他）
 */
$(function() {

    var paymentReport = {
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

        paymentReport.options = options;
        renderAll();
    });

    // 页面加载默认填充当前月份并自动查询
    var now = moment();
    com.focusPage("#dateRangeSearch").val(now.startOf('month').format('YYYY/MM/DD') + ' - ' + now.format('YYYY/MM/DD'));
    com.focusPage("#fl_btn_searchDiv").trigger("click");

    com.focusPage("#fl_btn_refresh").on("click", function() {
        com.post(api.report.refreshPaymentMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = paymentReport.options;

        com.post(api.report.queryPaymentTrend, options, function(res) {
            renderTrend(res.collectTrend, res.refundTrend, res.netTrend);
        });

        com.post(api.report.queryPaymentTypeDist, options, function(res) {
            renderPie(res.paymentTypeDist);
        });
    }

    // 趋势折线（三线：收款/退款/净收款）
    function renderTrend(collectTrend, refundTrend, netTrend) {

        var dates = [];
        var collectData = [];
        var refundData = [];
        var netData = [];

        $.each(collectTrend, function(i, v) {
            dates.push(v.date);
            collectData.push(v.amount / 100);
        });

        $.each(refundTrend, function(i, v) {
            refundData.push(v.amount / 100);
        });

        $.each(netTrend, function(i, v) {
            netData.push(v.amount / 100);
        });

        var chart = echarts.init(com.focusPage('#trendChart')[0]);
        chart.setOption({
            title: { text: '收退款月度趋势', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' 元'; } },
            legend: { data: ['收款', '退款', '净收款'], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: '金额(元)' },
            series: [
                { name: '收款', type: 'line', data: collectData, smooth: true },
                { name: '退款', type: 'line', data: refundData, smooth: true },
                { name: '净收款', type: 'line', data: netData, smooth: true }
            ]
        });
    }

    // 款项结构饼图
    function renderPie(paymentTypeDist) {

        var data = [];
        $.each(paymentTypeDist, function(i, v) {
            data.push({ name: v.name, value: v.value / 100 });
        });

        var chart = echarts.init(com.focusPage('#typePie')[0]);
        chart.setOption({
            title: { text: '收款款项结构', left: 'center' },
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
