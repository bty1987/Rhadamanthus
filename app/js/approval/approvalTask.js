/** app/js/approval/approvalTask.js —— 我的待办任务（P2-P3 新引擎）
  待办 queryApprovalTodoTask；操作 agreeApprovalTask/refuseApprovalTask/transferApprovalTask；
  轨迹 queryApprovalTaskTrace；通用审批发起 startGeneralApproval（选流程→加载表单 queryApprovalFormByFlowId + queryApprovalFormField）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var task = { currentTaskId: null, taskIdx: null, traceIdx: null, startIdx: null, transferMode: false };
    var statusMap = { 0: ['layui-bg-orange', '待办'], 1: ['layui-bg-green', '通过'], 2: ['layui-bg-red', '拒绝'], 3: ['layui-bg-cyan', '转交'], 4: ['layui-bg-gray', '已失效'], 5: ['layui-bg-gray', '超时'] };
    var nodeTypeMap = { 1: '串行', 2: '并签', 3: '或签', 4: '会签' };
    var generalFields = [];

    initTable(); loadTodoList();

    function initTable() {
        table.render({ elem: '#taskTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'taskId', title: '任务ID', width: 90, templet: function (d) { return '<b>#' + d.taskId + '</b>'; } },
                { field: 'aid', title: '审批单', width: 100 },
                { field: 'nodeSeq', title: '节点', width: 80 },
                { field: 'nodeType', title: '节点类型', width: 110, templet: function (d) { return '<span class="layui-badge layui-bg-blue">' + (nodeTypeMap[d.nodeType] || d.nodeType) + '<\/span>'; } },
                { field: 'assignTime', title: '分配时间', minWidth: 150 },
                { title: '操作', width: 180, toolbar: '#rowToolbar' } ]] });
        $('body').append('<script type="text/html" id="rowToolbar"><button class="layui-btn layui-btn-xs" lay-event="approve">审批</button><button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="trace">轨迹</button><\/script>');
        table.on('tool(taskTable)', function (obj) {
            if (obj.event === 'approve') openTaskModal(obj.data);
            else if (obj.event === 'trace') openTrace(obj.data.aid);
        });
    }
    function loadTodoList() {
        app.post(api.approval.queryApprovalTodoTask, {}, function (res) {
            var tasks = res.tasks || [];
            $('#notTask').toggle(tasks.length === 0);
            table.reload('taskTable', { data: tasks });
        });
    }

    function openTaskModal(t) {
        task.currentTaskId = t.taskId; task.transferMode = false;
        $('#taskBox [name="comment"]').val(''); $('#taskBox [name="transferTo"]').val('');
        $('#transferGroup').hide();
        task.taskIdx = layer.open({ type: 1, title: '审批 任务#' + t.taskId, content: $('#taskBox'), area: ['520px', 'auto'] });
    }
    $('#agreeBtn').on('click', function () { doAction('agree'); });
    $('#refuseBtn').on('click', function () { doAction('refuse'); });
    $('#transferBtn').on('click', function () {
        if (!task.transferMode) { $('#transferGroup').show(); task.transferMode = true; return; }
        doAction('transfer');
    });
    function doAction(action) {
        if (!task.currentTaskId) return;
        var o = { taskId: task.currentTaskId, comment: $('#taskBox [name="comment"]').val() };
        if (action === 'agree') {
            app.post(api.approval.agreeApprovalTask, o, function () { app.showAlert(app.success, '审批通过'); layer.close(task.taskIdx); loadTodoList(); });
        } else if (action === 'refuse') {
            app.post(api.approval.refuseApprovalTask, o, function () { app.showAlert(app.success, '已拒绝'); layer.close(task.taskIdx); loadTodoList(); });
        } else if (action === 'transfer') {
            var to = $('#taskBox [name="transferTo"]').val();
            if (!to) { app.showAlert(app.warning, '请填写转交目标'); return; }
            o.transferTo = to;
            app.post(api.approval.transferApprovalTask, o, function () { app.showAlert(app.success, '已转交'); layer.close(task.taskIdx); loadTodoList(); });
        }
    }

    function openTrace(aid) {
        app.post(api.approval.queryApprovalTaskTrace, { 'task.aid': aid }, function (res) {
            var $tb = $('#traceBox tbody').empty();
            var tasks = res.tasks || [];
            $.each(tasks, function (i, t) {
                var s = statusMap[t.status] || ['layui-bg-gray', t.status];
                $tb.append('<tr><td>' + t.nodeSeq + '</td><td><span class="layui-badge ' + s[0] + '">' + s[1] + '<\/span></td><td>' + (t.assigneeId || '-') + '</td><td>' + (t.transferTo || '-') + '</td><td>' + esc(t.comment || '-') + '</td><td>' + (t.actionTime || '-') + '</td></tr>');
            });
            if (tasks.length === 0) $tb.append('<tr><td colspan="6" style="text-align:center;color:#999;">暂无轨迹</td></tr>');
            task.traceIdx = layer.open({ type: 1, title: '审批轨迹', content: $('#traceBox'), area: ['80%', '60%'] });
        });
    }

    // 通用审批发起
    $('#startApprovalBtn').on('click', function () {
        var $sel = $('#generalFlowSelect').empty().append('<option value="">请选择</option>');
        $('#generalFormArea').empty(); generalFields = [];
        app.post(api.approval.pageApprovalFlow, { 'paging.page': 1, 'paging.rows': 999 }, function (res) {
            var flows = (res.paging && res.paging.data) || [];
            $.each(flows, function (i, f) {
                if (f.status == 0 && f.businessType == 100) $sel.append('<option value="' + f.code + '" data-flowId="' + f.flowId + '">' + esc(f.name) + '</option>');
            });
            form.render('select');
        });
        task.startIdx = layer.open({ type: 1, title: '发起审批', content: $('#startBox'), area: ['640px', '80%'] });
    });
    form.on('select(code)', function (d) {
        var flowId = $('#generalFlowSelect option:selected').attr('data-flowId');
        var $area = $('#generalFormArea').empty(); generalFields = [];
        if (!flowId) return;
        app.post(api.approval.queryApprovalFormByFlowId, { flowId: flowId }, function (res) {
            if (!res.form || !res.form.formId) { $area.append('<div class="layui-bg-gray" style="padding:14px;text-align:center;">该流程未配置表单，可直接提交</div>'); return; }
            app.post(api.approval.queryApprovalFormField, { 'form.formId': res.form.formId }, function (fr) {
                generalFields = fr.formFields || [];
                var $f = $('<form class="layui-form"></form>');
                $.each(generalFields, function (i, field) {
                    var req = field.required == 1 ? '<span class="app-req">*</span>' : '';
                    var ph = field.defaultValue || '';
                    var $grp = $('<div class="layui-form-item"><label class="layui-form-label">' + req + esc(field.fieldLabel || field.fieldKey) + '</label><div class="layui-input-block"></div></div>');
                    var $c = $grp.find('.layui-input-block');
                    var name = 'gf_' + field.fieldKey;
                    if (field.controlType == 2) $c.append('<textarea name="' + name + '" data-key="' + field.fieldKey + '" class="layui-textarea"></textarea>');
                    else if (field.controlType == 3) $c.append('<input type="number" name="' + name + '" data-key="' + field.fieldKey + '" placeholder="' + esc(ph) + '" class="layui-input">');
                    else if (field.controlType == 4) {
                        var $s = $('<select name="' + name + '" data-key="' + field.fieldKey + '"></select>');
                        $s.append('<option value="">请选择</option>');
                        if (field.dataSource) $.each(field.dataSource.split(','), function (j, op) { op = $.trim(op); $s.append('<option value="' + esc(op) + '">' + esc(op) + '</option>'); });
                        $c.append($s);
                    } else if (field.controlType == 5) $c.append('<input type="text" name="' + name + '" data-key="' + field.fieldKey + '" placeholder="YYYY-MM-DD" class="layui-input">');
                    else if (field.controlType == 8) $c.append('<input type="text" name="' + name + '" data-key="' + field.fieldKey + '" placeholder="附件链接" class="layui-input">');
                    else $c.append('<input type="text" name="' + name + '" data-key="' + field.fieldKey + '" placeholder="' + esc(ph) + '" class="layui-input">');
                    $f.append($grp);
                });
                $area.append($f); form.render();
            });
        });
    });
    $('#submitGeneralBtn').on('click', function () {
        var code = $('#generalFlowSelect').val();
        if (!code) { app.showAlert(app.warning, '请选择审批流程'); return; }
        var fd = {}, hasEmpty = false;
        $('#generalFormArea [data-key]').each(function () {
            var k = $(this).attr('data-key'), v = $(this).val();
            $.each(generalFields, function (i, f) { if (f.fieldKey == k && f.required == 1 && !v) hasEmpty = true; });
            fd[k] = v;
        });
        if (hasEmpty) { app.showAlert(app.warning, '请填写所有必填字段'); return; }
        app.post(api.approval.startGeneralApproval, { code: code, forms: JSON.stringify(fd) }, function (res) {
            app.showAlert(app.success, '审批已提交(aid=' + res.aid + ')'); layer.close(task.startIdx); loadTodoList();
        });
    });

    function esc(s) { return $('<div/>').text(s == null ? '' : s).html(); }
});
}); // end app.ready
