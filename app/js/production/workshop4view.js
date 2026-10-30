/** app/js/production/workshop4view.js —— 工序组下的工序计划（只读，弹窗子页）
 * 上下文：app.params.productionWorkshop.wsid */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.productionWorkshop) || app.params.productionWorkshop || {};
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '工序组名称', minWidth: 200 }, { field: 'comment', title: '备注', minWidth: 200 } ]] });
    }
    function query() {
        if (!ctx.wsid) { app.showAlert(app.warning, '缺少工序组上下文'); return; }
        app.post(api.production.queryWorkplanByWsid, { 'workplan.workshop.wsid': ctx.wsid }, function (res) { table.reload('resultTable', { data: res.workplans || [] }); });
    }
});
}); // end app.ready
