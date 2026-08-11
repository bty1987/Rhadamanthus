/**
 * 仓储物流报表（echarts 版）。
 *
 * ① 出入库趋势：入库 + 出库单据量双线
 * ② 类型结构饼图
 */
$(function() {

    var inventoryReport = {
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

        inventoryReport.options = options;
        renderAll();
    });

    com.focusPage("#fl_btn_searchDiv").trigger("click");

    com.focusPage("#fl_btn_refresh").on("click", function() {
        com.post(api.report.refreshInventoryMetric, {}, function() {
            com.showAlert(com.info, "数据刷新成功");
            renderAll();
        });
    });

    function renderAll() {

        var options = inventoryReport.options;

        com.post(api.report.queryInventoryInOutTrend, options, function(res) {
            renderInOutTrend(res.inOutTrend);
        });

        com.post(api.report.queryInventoryTypeDist, options, function(res) {
            renderTypePie(res.typeDist);
        });
    }

    // 出入库趋势（双线）
    function renderInOutTrend(inOutTrend) {

        var dates = [];
        var inData = [];
        var outData = [];

        $.each(inOutTrend, function(i, v) {
            dates.push(v.date);
            inData.push(v.value1); // 入库
            outData.push(v.value2); // 出库
        });

        var chart = echarts.init(com.focusPage('#inOutTrendChart')[0]);
        chart.setOption({
            title: { text: '出入库月度趋势', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' 单'; } },
            legend: { data: ['入库', '出库'], top: 30 },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: '单据量' },
            series: [
                { name: '入库', type: 'line', data: inData, smooth: true },
                { name: '出库', type: 'line', data: outData, smooth: true }
            ]
        });
    }

    // 类型结构饼图
    function renderTypePie(typeDist) {

        var data = [];
        $.each(typeDist, function(i, v) {
            data.push({ name: v.name, value: v.value });
        });

        var chart = echarts.init(com.focusPage('#typePie')[0]);
        chart.setOption({
            title: { text: '出入库类型结构', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 单 ({d}%)' },
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
