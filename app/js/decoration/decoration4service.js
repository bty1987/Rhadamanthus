/** app/js/decoration/decoration4service.js —— 装修单服务（queryDecorationServiceByOrderId + 完成服务弹窗） */
app.ready(function () {
layui.use(['table', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var ctx = app.params.decoration || {};
    var orderId = ctx.orderId;
    var editIndex = null, curDsid = null;

    laydate.render({ elem: '#planTime', type: 'datetime' });

    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单号', width: 130 },
            { field: 'detail', title: '详述', minWidth: 180 },
            { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
            { field: 'operater', title: '操作人', width: 100, templet: function (d) { return (d.operater && d.operater.currentName) || ''; } },
            { field: 'operateTime', title: '操作时间', width: 170, templet: function (d) { return app.dateFormat(d.operateTime); } },
            { field: 'planTime', title: '计划时间', width: 170, templet: function (d) { return app.dateFormat(d.planTime); } },
            { field: 'finishTime', title: '完成时间', width: 170, templet: function (d) { return app.dateFormat(d.finishTime); } },
            { field: 'finisher', title: '完成人', width: 100, templet: function (d) { return (d.finisher && d.finisher.currentName) || ''; } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.serviceStatus, d.status, function (k) { return k == 1 ? 'layui-bg-green' : 'layui-bg-gray'; }); } },
            { field: 'overdueDays', title: '超期天数', width: 90, templet: function (d) { return d.overdueDays ? d.overdueDays + '天' : ''; } },
            { field: 'comment', title: '备注', width: 140 },
            { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'done') openDone(obj.data);
    });

    function query() {
        app.post(api.decoration.queryDecorationServiceByOrderId, { 'decorationService.orderId': orderId }, function (res) {
            table.reload('resultTable', { data: res.decorationServices || [] });
        });
    }
    query();

    // 完成人下拉（queryUserForOption）
    app.post(api.personel.queryUserForOption, {}, function (res) {
        var html = '<option value="">请选择完成人</option>';
        $.each(res.users || [], function (i, u) { html += '<option value="' + u.uid + '">' + u.currentName + '<\/option>'; });
        $('#finisher').html(html);
        form.render('select');
    });

    function openDone(v) {
        curDsid = v.dsid;
        $('#editForm')[0].reset();
        editIndex = layer.open({ type: 1, title: '完成装修服务', content: $('#editBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function () {
                var comment = $.trim($('#comment').val());
                if (!comment) { app.showAlert(app.warning, '请输入备注信息'); return; }
                if (!$('#planTime').val()) { app.showAlert(app.warning, '请选择计划时间'); return; }
                if (!$('#finisher').val()) { app.showAlert(app.warning, '请选择完成人'); return; }
                app.post(api.decoration.completeDecorationService, {
                    'decorationService.dsid': curDsid,
                    'decorationService.comment': comment,
                    'decorationService.planTime': $('#planTime').val(),
                    'decorationService.finisher.uid': $('#finisher').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(editIndex); editIndex = null; query();
                });
            } });
    }

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationIndex.url); });
});
}); // end app.ready
