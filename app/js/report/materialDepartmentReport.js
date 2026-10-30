/** app/js/report/materialDepartmentReport.js —— 主材部门业绩统计（echarts 折线）
 * 旧 Highcharts 版改写为 echarts。先查主材部门列表(api.communion.queryDepartment)，
 * 再按日期范围查每日业绩(api.report.materialDepartmentReport)，按部门拼成多条折线。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;
    var st = { deptIds: [], deptNames: [] };
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });

    // 先加载主材部门清单
    app.post(api.communion.queryDepartment, { 'dept.type.name': '主材部' }, function (res) {
        var list = res.deptList || [];
        st.deptIds = []; st.deptNames = [];
        for (var i = 0; i < list.length; i++) { st.deptIds.push(list[i].deptId); st.deptNames.push(list[i].deptName); }
    }, null, false);

    function dateDiff(d1, d2) {
        var a = new Date(d1.replace(/-/g, '/')), b = new Date(d2.replace(/-/g, '/'));
        return Math.round((b - a) / 86400000);
    }
    function addDays(d, n) { var a = new Date(d.replace(/-/g, '/')); a.setDate(a.getDate() + n); var m = a.getMonth() + 1, day = a.getDate(); return a.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day); }

    $('#btnSearch').on('click', function () {
        var dr = $.trim($('#dateRange').val());
        if (!dr) { app.showAlert(app.warning, '请输入需要查询的时期范围'); return; }
        var arr = dr.split(' - '), start = arr[0], end = arr[1];
        var days = dateDiff(start, end) + 1;
        var xData = []; for (var i = 0; i < days; i++) xData.push(addDays(start, i));
        var opts = {
            'filters[0].field': 'startTime', 'filters[0].data': start, 'filters[0].op': 'eq',
            'filters[1].field': 'endTime', 'filters[1].data': end, 'filters[1].op': 'eq'
        };
        // 每个 department 初始化为 0 数组
        var series = {};
        $.each(st.deptIds, function (i, did) { series[did] = new Array(days).fill(0); });
        app.post(api.report.materialDepartmentReport, opts, function (res) {
            var rows = res.materialDepartmentCounts || [];
            $.each(rows, function (i, row) {
                var did = row.materialDeptId, idx = dateDiff(start, row.createTime);
                if (series[did] && idx >= 0 && idx < days) series[did][idx] = row.total;
            });
            draw(xData, series);
        });
    });

    function draw(xData, series) {
        var sList = [];
        $.each(st.deptIds, function (i, did) {
            sList.push({ name: st.deptNames[i] || did, type: 'line', data: series[did], smooth: true });
        });
        echarts.init($('#materialDepartmentReport')[0]).setOption({
            title: { text: '主材部门业绩统计图标', left: 'center' },
            tooltip: { trigger: 'axis' }, legend: { top: 30, type: 'scroll' },
            dataZoom: [{ type: 'inside' }, { type: 'slider' }],
            xAxis: { type: 'category', data: xData }, yAxis: { type: 'value', name: '业绩信息' },
            series: sList
        });
    }
});
});
