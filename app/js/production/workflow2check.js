/** app/js/production/workflow2check.js —— 工序计划-工序绑定（弹窗子页）
 * 上下文：app.params.productionWorkplan.wpid
 * 列出已绑定工序（queryWorkflowPlanByWpid），可添加工序行（下拉选择），提交批量绑定（updateWorkflowPlan）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.productionWorkplan) || app.params.productionWorkplan || {};
    var wpid = ctx.wpid;
    var cache = { workflows: [], currentWfids: [], rows: [] };

    loadExisting();
    $('#btnAdd').on('click', addBlankRow);
    $('#btnSubmit').on('click', submitBind);
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') delRow(obj.data.__idx); });

    function loadExisting() {
        app.post(api.production.queryWorkflowPlanByWpid, { 'workflowPlan.workplan.wpid': wpid }, function (res) {
            cache.rows = [];
            (res.workflowPlans || []).forEach(function (it, i) {
                cache.currentWfids.push(it.workflow.wfid);
                cache.rows.push({ __idx: i, wfid: it.workflow.wfid, name: it.workflow.name, status: it.workflow.status == 0 ? '启用' : '禁用', bound: true });
            });
            loadWorkflows();
        });
    }
    function loadWorkflows(cb) {
        app.post(api.production.queryWorkflow, {}, function (res) {
            cache.workflows = res.workflows || [];
            renderTable();
            if (cb) cb();
        });
    }
    function availableWorkflows() {
        return cache.workflows.filter(function (w) { return cache.currentWfids.indexOf(w.wfid) === -1; });
    }
    function renderTable() {
        table.render({ elem: '#resultTable', data: cache.rows, page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '工序', minWidth: 180, templet: function (d) {
                    if (d.bound) return d.name || '';
                    var av = availableWorkflows(); var html = '<select lay-ignore class="layui-input" data-idx="' + d.__idx + '" style="width:90%;">';
                    html += '<option value="">请选择</option>';
                    av.forEach(function (w) { html += '<option value="' + w.wfid + '">' + w.name + '</option>'; });
                    html += '</select>'; return html;
                } },
                { field: 'status', title: '状态', width: 120 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]],
            done: function () { form.render(); }
        });
    }
    function addBlankRow() {
        cache.rows.push({ __idx: cache.rows.length, wfid: null, name: '', status: '', bound: false });
        renderTable();
    }
    function delRow(idx) {
        cache.rows = cache.rows.filter(function (r) { return r.__idx !== idx; });
        cache.rows.forEach(function (r, i) { r.__idx = i; });
        // 重建 currentWfids（已绑定的）
        cache.currentWfids = cache.rows.filter(function (r) { return r.bound && r.wfid; }).map(function (r) { return r.wfid; });
        renderTable();
    }
    function submitBind() {
        var opts = {};
        var flag = false, cnt = 0;
        cache.rows.forEach(function (r, i) {
            var val;
            if (r.bound) { val = r.wfid; }
            else { val = $('.app-page [data-idx="' + r.__idx + '"]').val(); }
            if (!val) { flag = true; return; }
            opts['wfids[' + cnt + ']'] = val; cnt++;
        });
        if (flag) { app.showAlert(app.warning, '存在未选择的工序行'); return; }
        opts['workflowPlan.workplan.wpid'] = wpid;
        app.post(api.production.updateWorkflowPlan, opts, function () {
            app.showAlert(app.success, '操作成功');
            try { var idx = window.parent.layer.getFrameIndex(window.name); window.parent.layer.close(idx); } catch (e) {}
        });
    }
});
}); // end app.ready
