/** app/js/report/materialMerchantReport.js —— 主材品类/品牌业绩报表（echarts 柱状 + 明细表）
 * 旧 Highcharts 版改写为 echarts。countMaterialType / countMaterialBrand。 */
app.ready(function () {
layui.use(['laydate', 'form', 'jquery'], function () {
    var laydate = layui.laydate, form = layui.form, $ = layui.jquery;
    var st = { options: {} };
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
        $('#materialTypeReport,#materialBrandReport,#materialTypeTable,#materialBrandTable').html('');
        initTypeReport(); initBrandReport();
    });

    function renderColumn(id, title, items, nameKey, valKey) {
        if (!items.length) { app.showAlert(app.warning, '当前查询数据为空!'); return; }
        var names = [], vals = [];
        $.each(items, function (i, v) { names.push(v[nameKey]); vals.push(v[valKey]); });
        echarts.init($('#' + id)[0]).setOption({
            title: { text: title, left: 'center' }, tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: names, axisLabel: { interval: 0, rotate: names.length > 6 ? 30 : 0 } },
            yAxis: { type: 'value', name: '业绩' }, series: [{ type: 'bar', data: vals }]
        });
    }
    function renderTable(id, items, label, nameKey, valKey) {
        var html = '<thead><tr><th>' + label + '</th><th>业绩</th></tr></thead><tbody>';
        $.each(items, function (i, v) { html += '<tr><td>' + v[nameKey] + '</td><td>' + v[valKey] + '</td></tr>'; });
        html += '</tbody>';
        $('#' + id).html(html);
    }

    function initTypeReport() {
        app.post(api.report.countMaterialType, st.options, function (res) {
            var list = res.materialTypeCounts || [];
            renderColumn('materialTypeReport', '品类业绩', list, 'materialType', 'total');
            renderTable('materialTypeTable', list, '品类', 'materialType', 'total');
        });
    }
    function initBrandReport() {
        app.post(api.report.countMaterialBrand, st.options, function (res) {
            var list = res.materialBrandCounts || [];
            renderColumn('materialBrandReport', '品牌业绩', list, 'materialBrand', 'total');
            renderTable('materialBrandTable', list, '品牌', 'materialBrand', 'total');
        });
    }
});
});
