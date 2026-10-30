/** app/js/decoration/decorationMeasure4setup.js —— 量尺设置（排期编辑/重置）
 *  pageDecorationMeasure（status=0 排队）；
 *  编辑 → construction.resetDrawLine（日期+起止时间）；重置 → failureDecorationMeasure。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0, edIdx: null };
    decorationCommon.dateRange('#applayTime');
    laydate.render({ elem: '#actualDate', type: 'date', format: 'yyyy-MM-dd' });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单', width: 130, templet: function (d) { return d.decoration.orderId; } },
            { field: 'village', title: '楼盘', width: 120, templet: function (d) { return d.decoration.house.village.name; } },
            { field: 'houseNumber', title: '楼号', width: 90, templet: function (d) { return d.decoration.house.houseNumber; } },
            { field: 'customer', title: '客户', width: 90, templet: function (d) { return (d.decoration.customer && d.decoration.customer.name) || ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return (d.decoration.designer && d.decoration.designer.currentName) || ''; } },
            { field: 'supervisor', title: '监理', width: 90, templet: function (d) { return d.decoration.supervisor ? d.decoration.supervisor.currentName : ''; } },
            { field: 'buildArea', title: '面积', width: 90, templet: function (d) { return d.decoration.house.buildArea; } },
            { field: 'typeness', title: '装修业务', width: 90, templet: function (d) { return E.typeness[d.decoration.typeness] || ''; } },
            { field: 'status', title: '装修状态', width: 90, templet: function (d) { return decorationCommon.badge(E.status, d.decoration.status); } },
            { field: 'orderTotalPrice', title: '合同额', width: 100, templet: function (d) { return app.formatMoney(d.decoration.orderTotalPrice); } },
            { field: 'version', title: '报价版本', width: 100, templet: function (d) { return (d.decoration.version && d.decoration.version.name) || ''; } },
            { field: 'appler', title: '申请人', width: 90, templet: function (d) { return (d.appler && d.appler.currentName) || ''; } },
            { field: 'actualTime', title: '量尺时间', width: 170, templet: function (d) { return app.dateFormat(d.actualTime); } },
            { field: 'startTime', title: '开始时间', width: 170, templet: function (d) { return app.dateFormat(d.startTime); } },
            { field: 'endTime', title: '结束时间', width: 170, templet: function (d) { return app.dateFormat(d.endTime); } },
            { field: 'measureStatus', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.measureStatus, d.status); } },
            { field: 'content', title: '描述', minWidth: 140 },
            { title: '操作', width: 170, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'draw') openEdit(v);
        else if (ev === 'reset') doReset(v);
    });

    // 编辑排期（construction.resetDrawLine）
    function openEdit(v) {
        $('#editForm')[0].reset();
        $('#actualDate').val((v.applayTime || '').substring(0, 10));
        state.edIdx = layer.open({ type: 1, title: '编辑排期 - ' + v.decoration.orderId, content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var date = $.trim($('#actualDate').val());
                var st = $.trim($('#startTime').val()), et = $.trim($('#endTime').val());
                if (!date || !st || !et) { app.showAlert(app.warning, '请完整填写量尺日期与起止时间'); return; }
                var s = Date.parse(date.replace(/-/g, '/') + ' ' + st), e = Date.parse(date.replace(/-/g, '/') + ' ' + et);
                if (isNaN(s) || isNaN(e) || s >= e) { app.showAlert(app.warning, '起始时间和结束时间非法'); return; }
                app.post(api.construction.resetDrawLine, {
                    'drawLine.dlid': v.dlid,
                    'drawLine.startTime': date + ' ' + st,
                    'drawLine.endTime': date + ' ' + et
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    function doReset(v) {
        app.showConfirm('确认重置申请吗?', function () {
            app.post(api.decoration.failureDecorationMeasure, { 'decorationMeasure.dmid': v.dmid }, function () {
                app.showAlert(app.success, '操作成功'); query(state.page);
            });
        });
    }

    function query(pg) {
        state.page = pg || 1;
        var filters = decorationCommon.buildFilters($('#searchForm'));
        app.post(api.decoration.pageDecorationMeasure, $.extend({}, filters, { 'decorationMeasure.status': 0, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
    query(1);
});
}); // end app.ready
