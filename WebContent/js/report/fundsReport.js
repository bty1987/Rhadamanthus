/**
 * 资金闭环报表（阶段四·跨模块联动）。
 *
 * 2 维度图表（均来自 report.metric_funds_monthly 汇总表）：
 *   ① 资金三段趋势：报价额 / 签约额 / 实收款 三线（+退款）
 *   ② 回款率趋势：实收 / 签约额（月度，双 Y 轴柱线）
 */
$(function() {

    var fundsReport = {
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

        fundsReport.options = options;
        renderAll();
    });

    com.focusPage("#fl_btn_refresh").on("click", function() {
        com.post(api.report.refreshFundsMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    // 导出Excel：资金闭环月度宽表
    com.focusPage("#fl_btn_export").on("click", function() {

        if (!fundsReport.fundsTrend || fundsReport.fundsTrend.length == 0) {
            com.showAlert(com.warning, "请先查询数据");
            return false;
        }

        var list = [];
        $.each(fundsReport.fundsTrend, function(i, v) {
            list.push({
                date: v.date,
                quotation: v.quotationTotal / 100,
                sign: v.signTotal / 100,
                collect: v.collectTotal / 100,
                refund: v.refundTotal / 100
            });
        });

        $.exceler({
            column: [["月份", "date"], ["报价额(元)", "quotation"], ["签约额(元)", "sign"], ["实收款(元)", "collect"], ["退款(元)", "refund"]],
            list: list
        });
    });

    function renderAll() {

        var options = fundsReport.options;

        com.post(api.report.queryFundsTrend, options, function(res) {
            fundsReport.fundsTrend = res.fundsTrend;
            renderFundsTrend(res.fundsTrend);
            renderRate(res.fundsTrend);
        });
    }

    // 资金三段趋势（报价/签约/实收 + 退款）
    function renderFundsTrend(fundsTrend) {

        var dates = [];
        var quotationData = [];
        var signData = [];
        var collectData = [];
        var refundData = [];

        $.each(fundsTrend, function(i, v) {
            dates.push(v.date);
            quotationData.push(v.quotationTotal / 100);
            signData.push(v.signTotal / 100);
            collectData.push(v.collectTotal / 100);
            refundData.push(v.refundTotal / 100);
        });

        var chart = echarts.init(com.focusPage('#fundsTrendChart')[0]);
        chart.setOption({
            title: { text: '资金闭环趋势（报价 → 签约 → 实收）', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' 元'; } },
            legend: { data: ['报价额', '签约额', '实收款', '退款'], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: '金额(元)' },
            series: [
                { name: '报价额', type: 'line', data: quotationData, smooth: true },
                { name: '签约额', type: 'line', data: signData, smooth: true },
                { name: '实收款', type: 'line', data: collectData, smooth: true },
                { name: '退款', type: 'line', data: refundData, smooth: true, lineStyle: { type: 'dashed' } }
            ]
        });
    }

    // 回款率趋势（签约额柱 + 回款率曲线，双 Y 轴）
    function renderRate(fundsTrend) {

        var dates = [];
        var signData = [];
        var rateData = [];

        $.each(fundsTrend, function(i, v) {
            dates.push(v.date);
            signData.push(v.signTotal / 100);
            rateData.push(v.signTotal > 0 ? (v.collectTotal / v.signTotal * 100).toFixed(1) : null);
        });

        var chart = echarts.init(com.focusPage('#rateChart')[0]);
        chart.setOption({
            title: { text: '回款率趋势（实收 / 签约额）', left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['签约额', '回款率'], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: [
                { type: 'value', name: '签约额(元)', position: 'left' },
                { type: 'value', name: '回款率(%)', position: 'right', axisLabel: { formatter: '{value}%' } }
            ],
            series: [
                { name: '签约额', type: 'bar', yAxisIndex: 0, data: signData },
                { name: '回款率', type: 'line', yAxisIndex: 1, data: rateData, smooth: true, connectNulls: true }
            ]
        });
    }

});
