/** app/js/construction/inspection4record.js —— 巡检记录（订单维度 CRUD）
 *  上下文：app.params.construction = { orderId, orderAddr }。
 *  add/update/deleteInspectionRecord；开始时间必须小于结束时间。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var pageConfig = constructionCommon.getPageConfig('inspection4record');
    var ctx = app.params.construction || {};
    var state = { page: 1, rows: 10, total: 0, editFlag: false, irId: null };

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    ['startDate', 'endDate'].forEach(function (id) { laydate.render({ elem: '#' + id, format: 'yyyy-MM-dd' }); });
    ['startTime', 'endTime'].forEach(function (id) { laydate.render({ elem: '#' + id, type: 'time', format: 'HH:mm:ss' }); });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderAddr', title: '楼盘地址', width: 220 },
            { field: 'operaterName', title: '操作人', width: 120 },
            { field: 'startTime', title: '开始时间', width: 170 },
            { field: 'endTime', title: '结束时间', width: 170 },
            { field: 'recordDes', title: '备注', minWidth: 200 },
            { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') {
            if (!btnVisible('edit')) return;
            state.editFlag = true;
            state.irId = v.irId;
            $('#orderId').val(v.orderId);
            $('#orderAddr').val(v.orderAddr);
            $('#startDate').val((v.startTime || '').split(' ')[0]);
            $('#startTime').val((v.startTime || '').split(' ')[1] || '');
            $('#endDate').val((v.endTime || '').split(' ')[0]);
            $('#endTime').val((v.endTime || '').split(' ')[1] || '');
            $('#recordDes').val(v.recordDes);
            openBox('编辑巡检记录');
        } else if (obj.event === 'del') {
            if (!btnVisible('del')) return;
            app.showConfirm('确认删除吗?', function () {
                app.post(api.construction.deleteInspectionRecord, { 'irIds[0]': v.irId }, function () { query(state.page); });
            });
        }
    });

    $('#btnAdd').on('click', function () {
        state.editFlag = false;
        state.irId = null;
        $('#recordForm')[0].reset();
        $('#orderId').val(ctx.orderId).prop('disabled', true);
        $('#orderAddr').val(ctx.orderAddr).prop('disabled', true);
        openBox('添加巡检记录');
    });

    function openBox(title) {
        layer.open({ type: 1, title: title, content: $('#recordBox'), area: ['560px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) { saveData(idx); } });
    }

    function saveData(idx) {
        var options = {
            'inspectionRecord.orderId': $('#orderId').val(),
            'inspectionRecord.orderAddr': $('#orderAddr').val(),
            'inspectionRecord.startTime': $('#startDate').val() + ' ' + $('#startTime').val(),
            'inspectionRecord.endTime': $('#endDate').val() + ' ' + $('#endTime').val(),
            'inspectionRecord.recordDes': $('#recordDes').val()
        };
        if (!options['inspectionRecord.startTime'] || !options['inspectionRecord.endTime']) {
            app.showAlert(app.warning, '请填写开始与结束时间'); return;
        }
        if (options['inspectionRecord.startTime'] > options['inspectionRecord.endTime']) {
            app.showAlert(app.warning, '开始时间需要小于结束时间'); return;
        }
        if (state.editFlag) {
            options['inspectionRecord.irId'] = state.irId;
            app.post(api.construction.updateInspectionRecord, options, function () { layer.close(idx); query(state.page); });
        } else {
            app.post(api.construction.addInspectionRecord, options, function () { layer.close(idx); query(state.page); });
        }
    }

    $('#btnBack').on('click', function () { app.switchPage(api.index.inspectionIndex.url); });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.construction.pageInspectionRecordByOrderId, $.extend({ 'inspectionRecord.orderId': ctx.orderId, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
