/**
 * 装修销售转化报表（echarts 版）。
 *
 * 4 维度图表（均来自 report.metric_decoration_daily 汇总表）：
 *   ① 漏斗图：量尺→定金→预签→签约→决算→完工
 *   ② 饼图：订单状态分布
 *   ③ 折线图：签约额月度趋势
 *   ④ 柱状图：装修类型分布（半包/整装/大包）
 *
 * echarts 全局已在 index.html 引入，无需页面加载。
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

        com.post(api.report.queryDecorationFunnel, options, function(res) {
            renderFunnel(res.funnel);
        });

        com.post(api.report.queryDecorationStatusDist, options, function(res) {
            renderPie(res.statusDist);
        });

        com.post(api.report.queryDecorationSignTrend, options, function(res) {
            renderTrend(res.signTrend);
        });

        com.post(api.report.queryDecorationTypeDist, options, function(res) {
            renderType(res.typeDist);
        });
    }

    // 漏斗图
    function renderFunnel(funnel) {

        var data = [];
        $.each(funnel, function(i, v) {
            data.push({ name: v.name, value: v.value });
        });

        var chart = echarts.init(com.focusPage('#funnelChart')[0]);
        chart.setOption({
            title: { text: '装修销售转化漏斗', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c}' },
            series: [{
                type: 'funnel',
                left: '10%',
                right: '10%',
                top: 60,
                bottom: 30,
                width: '80%',
                label: { show: true, position: 'inside', formatter: '{b}: {c}' },
                data: data
            }]
        });
    }

    // 状态分布饼图
    function renderPie(statusDist) {

        var data = [];
        $.each(statusDist, function(i, v) {
            data.push({ name: v.name, value: v.value });
        });

        var chart = echarts.init(com.focusPage('#statusPie')[0]);
        chart.setOption({
            title: { text: '订单状态分布', left: 'center' },
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

    // 签约额趋势折线
    function renderTrend(signTrend) {

        var dates = [];
        var amounts = [];

        $.each(signTrend, function(i, v) {
            dates.push(v.date);
            amounts.push(v.amount / 100); // 分→元
        });

        var chart = echarts.init(com.focusPage('#trendChart')[0]);
        chart.setOption({
            title: { text: '签约额月度趋势', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' 元'; } },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: '签约额(元)' },
            series: [{
                name: '签约额',
                type: 'line',
                data: amounts,
                smooth: true
            }]
        });
    }

    // 装修类型分布柱状
    function renderType(typeDist) {

        var names = [];
        var counts = [];

        $.each(typeDist, function(i, v) {
            names.push(v.name);
            counts.push(v.value);
        });

        var chart = echarts.init(com.focusPage('#typeChart')[0]);
        chart.setOption({
            title: { text: '装修类型分布', left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function(v) { return v + ' 单'; } },
            xAxis: { type: 'category', data: names },
            yAxis: { type: 'value', name: '订单数' },
            series: [{
                name: '订单数',
                type: 'bar',
                data: counts
            }]
        });
    }

});
