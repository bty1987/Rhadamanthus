/** app/js/information/plan2create.js —— 计划创建（任务参数选择 + 字段条件 + 提交）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { tid: null, referIndex: null, args: {}, cTime: null };

    laydate.render({ elem: '#dataTime' });
    laydate.render({ elem: '#time', type: 'time' });

    loadTask();
    function loadTask() {
        app.post(api.communion.queryTask, { 'task.level': 1 }, function (res) {
            var html = '<option value="">请选择任务</option>';
            $.each(res.tasks || [], function (i, v) { html += '<option value="' + v.keyWord + '" data-tid="' + v.tid + '">' + v.name + '</option>'; });
            $('#taskPlan').html(html); form.render('select');
        }, null, false);
    }

    // 任务参数表格（按任务选择动态加载）
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'name', title: '参数名称', width: 160 },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return d.type == 0 ? '字段' : '条件'; } },
            { field: 'module', title: '模块', width: 110 },
            { field: 'field', title: '字段', width: 130 },
            { field: 'comment', title: '备注', minWidth: 160 },
            { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });

    form.on('select(taskPlan)', function (data) {
        var $opt = $('#taskPlan option[value="' + data.value + '"]');
        state.tid = $opt.attr('data-tid');
        loadTaskParams();
    });

    function loadTaskParams() {
        if (!state.tid) return;
        app.post(api.communion.queryTaskParam, { 'taskParam.tid': state.tid }, function (res) {
            table.reload('resultTable', { data: res.taskParams || [] });
        });
    }

    function doCreate() {
        if (!state.tid) { app.showAlert(app.warning, '请先选择任务'); return; }
        var date = $('#dataTime').val(); var time = $('#time').val();
        if (!date || !time) { app.showAlert(app.warning, '请填写日期和时间'); return; }
        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);
        app.post(api.information.createPlan, {
            'plan.task.keyWord': $('#taskPlan').val(),
            'plan.task.tid': state.tid,
            'plan.args': $('#editForm [name="cuTime"]').val() || $('#editForm [name="orderId"]').val(),
            'plan.executeTime': executeTime
        }, function () {
            app.showAlert(app.success, '计划创建成功');
            try { if (parent && parent.layer) { var idx = parent.layer.getFrameIndex(window.name); parent.layer.close(idx); } } catch (e) {}
        });
    }
    $('#btnCreate').on('click', doCreate);
});
}); // end app.ready
