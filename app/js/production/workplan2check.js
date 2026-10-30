/** app/js/production/workplan2check.js —— 工序下的工序计划（只读，弹窗子页）
 * 上下文：app.params.productionWorkplan2check.wfid */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.productionWorkplan2check) || app.params.productionWorkplan2check || {};
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'workplan', title: '名称', minWidth: 160, templet: function (d) { return d.workplan ? d.workplan.name : ''; } },
                { field: 'workplan', title: '状态', width: 100, templet: function (d) { return d.workplan && d.workplan.status == 0 ? '启用' : '禁用'; } },
                { field: 'workshop', title: '车间名', width: 140, templet: function (d) { return d.workplan && d.workplan.workshop ? d.workplan.workshop.name : ''; } },
                { field: 'comment', title: '备注信息', minWidth: 180, templet: function (d) { return d.workplan ? (d.workplan.comment || '') : ''; } } ]] });
    }
    function query() {
        if (!ctx.wfid) { app.showAlert(app.warning, '缺少工序上下文'); return; }
        app.post(api.production.queryWorkflowPlanByWfid, { 'workflowPlan.workflow.wfid': ctx.wfid }, function (res) { table.reload('resultTable', { data: res.workflowPlans || [] }); });
    }
});
}); // end app.ready
