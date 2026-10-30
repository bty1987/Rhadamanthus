/** app/js/report/orderCount.js —— 大屏订单计数报表（echarts）
 * 旧 Highcharts 版改写为 echarts。reportCityCount 返回 cityCounts，按城市过滤后：
 *   ① 状态汇总饼图（最新日各状态订单数）② 签单总额/订单总数 ③ 各状态订单数趋势折线。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var STATUS = { amount: '量尺', consult: '咨询', quotation: '报价', deposit: '定金', signed: '签约', resigned: '重签', waste: '废单', completed: '完工', termination: '终止' };
    var SKIP = ['createDate', 'contractPrice', 'city', 'ccdId'];

    function defaultRange() {
        var end = new Date(), begin = new Date(Date.now() - 86400000 * 20);
        var f = function (d) { var m = d.getMonth() + 1, day = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day); };
        return f(begin) + ' - ' + f(end);
    }
    $('#dateRange').val(defaultRange());
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    $('#btnSearch').on('click', function () { query(); });

    function query() {
        var cityName = $.trim($('#cityName').val()) || '沈阳';
        var dr = $.trim($('#dateRange').val());
        var opts = {};
        if (dr) { var arr = dr.split(' - '); opts['filters[0].field'] = 'createDateRange'; opts['filters[0].data'] = arr[0] + '-' + arr[1]; opts['filters[0].op'] = 'between'; }
        app.post(api.report.reportCityCount, opts, function (res) {
            var rows = res.cityCounts || [];
            var dates = [], lines = {}, totalPies = [], contractPrice = 0, orderTotal = 0;
            var endStr = dr ? dr.split(' - ')[1] : '';

            $.each(rows, function (i, v) {
                if (!v.city || v.city.cityName != cityName) return;
                if (dates.indexOf(v.createDate) == -1) dates.push(v.createDate);
                if (!lines[v.city.cityName]) lines[v.city.cityName] = {};
                var L = lines[v.city.cityName];
                $.each(v, function (n, k) {
                    if (SKIP.indexOf(n) != -1) return;
                    if (!L[n]) L[n] = [];
                    L[n].push(k);
                });
                if (v.createDate == endStr) {
                    contractPrice = v.contractPrice;
                    $.each(v, function (n, k) { if (SKIP.indexOf(n) != -1) return; totalPies.push({ name: STATUS[n], value: k }); orderTotal += k; });
                }
            });

            $('#charts').html('');
            renderPie('charts_pie', '汇总', totalPies);
            renderSummary(contractPrice, orderTotal);
            renderLines('charts_line', '各状态订单数趋势', dates, lines[cityName] || {});
        });
    }

    function renderPie(id, title, data) {
        $('#charts').append('<div class="layui-col-md4"><div id="' + id + '" style="height:360px;"></div></div>');
        echarts.init($('#' + id)[0]).setOption({
            title: { text: title, left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c}' },
            series: [{ type: 'pie', radius: '55%', data: data, label: { formatter: '{b}: {c}' } }]
        });
    }
    function renderSummary(cp, ot) {
        $('#charts').append('<div class="layui-col-md4"><div class="layui-card"><div class="layui-card-body" style="text-align:center;padding-top:60px;">'
            + '<div style="margin-bottom:30px;"><div style="font-size:42px;color:#01AAED;font-weight:bold;">' + app.formatMoney(cp) + '</div><h5>签单总额</h5></div>'
            + '<div><div style="font-size:42px;color:#01AAED;font-weight:bold;">' + ot + '</div><h5>订单总数</h5></div>'
            + '</div></div></div>');
    }
    function renderLines(id, title, dates, cityLines) {
        $('#charts').append('<div class="layui-col-md12"><div id="' + id + '" style="height:380px;"></div></div>');
        var series = [];
        $.each(cityLines, function (n, arr) {
            series.push({ name: STATUS[n] || n, type: 'line', data: arr, smooth: true });
        });
        echarts.init($('#' + id)[0]).setOption({
            title: { text: title, left: 'center' },
            tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 单'; } },
            legend: { top: 30, type: 'scroll' },
            xAxis: { type: 'category', data: dates }, yAxis: { type: 'value', name: '订单数量' },
            series: series
        });
    }

    query();
});
});
