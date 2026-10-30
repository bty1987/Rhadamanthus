/** app/js/report/materialDesignReport.js —— 设计师业绩报表（echarts 柱状，分区→部门→设计师 下钻）
 * 旧 Highcharts 版改写为 echarts。countDesignerRegion / countDesignerDepartment / countDesigner。
 * 点击分区柱→加载该分区部门；点击部门柱→加载该部门设计师。 */
app.ready(function () {
layui.use(['laydate', 'form', 'jquery'], function () {
    var laydate = layui.laydate, form = layui.form, $ = layui.jquery;
    var st = { options: {} };
    var charts = {};
    laydate.render({ elem: '#dateRange', range: true, format: 'yyyy-MM-dd' });
    form.render('select');

    $('#btnSearch').on('click', function () {
        var dr = $.trim($('#dateRange').val()), rt = $('#reportType').val();
        if (!dr) { app.showAlert(app.error, '请输入需要查询的时期范围'); return; }
        if (!rt) { app.showAlert(app.error, '请选择查询类型'); return; }
        var arr = dr.split(' - ');
        st.options = {
            'filters[0].field': 'startTime', 'filters[0].data': arr[0], 'filters[0].op': 'eq',
            'filters[1].field': 'endTime', 'filters[1].data': arr[1], 'filters[1].op': 'eq',
            reportType: rt
        };
        $('#designerRegionReport,#designerDepartmentReport,#designerReport,#designerRegionTable,#designerDepartmentTable,#designerTable').html('');
        initRegionReport();
    });

    function renderBar(id, title, items, idKey, nameKey, valKey, onClick) {
        if (!items.length) { app.showAlert(app.warning, '当前查询数据为空!'); return; }
        var names = [], vals = [], map = {};
        $.each(items, function (i, v) { names.push(v[nameKey]); vals.push(v[valKey]); map[v[nameKey]] = v[idKey]; });
        if (charts[id]) charts[id].dispose();
        var c = echarts.init($('#' + id)[0]);
        charts[id] = c;
        c.setOption({
            title: { text: title, left: 'center' }, tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: names, axisLabel: { interval: 0, rotate: names.length > 4 ? 30 : 0 } },
            yAxis: { type: 'value', name: '业绩' }, series: [{ type: 'bar', data: vals, cursor: onClick ? 'pointer' : 'auto' }]
        });
        if (onClick) c.on('click', function (p) { var kid = map[p.name]; if (kid != null) onClick(kid); });
    }
    function renderTable(id, items, label, nameKey, valKey) {
        var html = '<thead><tr><th>' + label + '</th><th>业绩</th></tr></thead><tbody>';
        $.each(items, function (i, v) { html += '<tr><td>' + v[nameKey] + '</td><td>' + v[valKey] + '</td></tr>'; });
        html += '</tbody>'; $('#' + id).html(html);
    }

    function initRegionReport() {
        app.post(api.report.countDesignerRegion, st.options, function (res) {
            var list = res.designerRegions || [];
            renderBar('designerRegionReport', '分区业绩', list, 'designerRegionId', 'designerRegionName', 'total', function (rid) {
                $('#designerReport,#designerTable').html('');
                initDepartmentReport(rid);
            });
            renderTable('designerRegionTable', list, '分区', 'designerRegionName', 'total');
        });
    }
    function initDepartmentReport(regionId) {
        var opt = $.extend({}, st.options);
        opt['filters[2].field'] = 'designerRegionId'; opt['filters[2].data'] = regionId; opt['filters[2].op'] = 'eq';
        app.post(api.report.countDesignerDepartment, opt, function (res) {
            var list = res.designerDepartments || [];
            renderBar('designerDepartmentReport', '部门业绩', list, 'designerDeptId', 'designerDeptName', 'total', function (did) {
                initDesignerReport(did);
            });
            renderTable('designerDepartmentTable', list, '部门', 'designerDeptName', 'total');
        });
    }
    function initDesignerReport(departmentId) {
        var opt = $.extend({}, st.options);
        opt['filters[2].field'] = 'designerDepartmentId'; opt['filters[2].data'] = departmentId; opt['filters[2].op'] = 'eq';
        app.post(api.report.countDesigner, opt, function (res) {
            var list = res.designers || [];
            renderBar('designerReport', '设计师业绩', list, 'designerId', 'designerName', 'total');
            renderTable('designerTable', list, '设计师', 'designerName', 'total');
        });
    }
});
});
