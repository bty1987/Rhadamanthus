/** app/js/production/productionPlan2Create.js —— 生产单下的生产计划（创建/子项/进度/完结）
 * 上下文：app.params.productionPlanCreate = {pid, status}
 * 列表 queryProductionPlanByPid；创建 addProductionPlan；完结 finishProductionPlan。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.productionPlanCreate || {};
    var createIndex = null, finishIndex = null;
    function stB(d) { return '<span class="layui-badge ' + (d.status == 0 ? 'layui-bg-gray' : 'layui-bg-green') + '">' + (d.status == 0 ? '初始' : '完结') + '<\/span>'; }
    function pno(d) { return d.production ? d.production.pno : ''; }
    if (ctx.status != 2) $('#btnAdd').hide();
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: pno },
                { field: 'createTime', title: '创建时间', width: 150 }, { field: 'finishTime', title: '完结时间', width: 150, templet: function (d) { return d.finishTime || '订单未完结'; } },
                { field: 'timeLimit', title: '工期', width: 80 }, { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 300, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handle(obj.event, obj.data); });
    }
    function query() {
        if (!ctx.pid) { app.showAlert(app.warning, '缺少生产单上下文'); return; }
        app.post(api.production.queryProductionPlanByPid, { 'productionPlan.production.pid': ctx.pid }, function (res) { table.reload('resultTable', { data: res.productionPlans || [] }); });
    }
    function ok(msg) { app.showAlert(app.success, msg); query(); }
    function handle(ev, v) {
        if (ev === 'item') { app.params.productionPlanItem = { ppid: v.ppid, status: v.status, productionStatus: ctx.status }; app.popup('views/production/productionPlanItem.html', '计划子项-' + v.no, null, { area: ['900px', '600px'] }); }
        else if (ev === 'progress') { app.params.productionPlanDetail = { ppid: v.ppid, status: v.status, differentiate: false }; app.switchPage(api.index.productionPlanDetailIndex.url); }
        else if (ev === 'finish') { if (v.status != 0) return; openFinish(v); }
    }
    function openCreate() {
        app.clearValidator(); $('#createForm')[0].reset();
        createIndex = layer.open({ type: 1, title: '创建生产计划', content: $('#createBox'), area: ['440px', 'auto'] });
    }
    function saveCreate() {
        if (app.validate('createForm')) return;
        app.post(api.production.addProductionPlan, { 'productionPlan.production.pid': ctx.pid, 'productionPlan.timeLimit': $('#createForm [name="timeLimit"]').val() }, function () { ok('操作成功'); layer.close(createIndex); createIndex = null; });
    }
    function openFinish(v) {
        app.clearValidator(); $('#finishForm')[0].reset(); $('#finishForm [name="ppid"]').val(v.ppid);
        finishIndex = layer.open({ type: 1, title: '完结生产计划', content: $('#finishBox'), area: ['440px', 'auto'] });
    }
    function saveFinish() {
        if (app.validate('finishForm')) return;
        app.post(api.production.finishProductionPlan, { 'productionPlan.ppid': $('#finishForm [name="ppid"]').val(), 'productionPlan.num': $('#finishForm [name="num"]').val() }, function () { ok('操作成功'); layer.close(finishIndex); finishIndex = null; });
    }
    $('#btnAdd').on('click', openCreate);
    $('#btnCreateOk').on('click', saveCreate);
    $('#btnCreateCancel').on('click', function () { layer.close(createIndex); createIndex = null; });
    $('#btnFinishOk').on('click', saveFinish);
    $('#btnFinishCancel').on('click', function () { layer.close(finishIndex); finishIndex = null; });
    $('#btnBack').on('click', function () { app.switchPage(api.index.productionIndex.url); });
});
}); // end app.ready
