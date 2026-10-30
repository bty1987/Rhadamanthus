/** app/js/production/productionPlan.js —— 生产计划（分页列表 + 子项/进度/完结）
 * 列表 pageProductionPlan；完结 finishProductionPlan；子项/进度跳转。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, finishIndex: null };
    function stB(d) { return '<span class="layui-badge ' + (d.status == 0 ? 'layui-bg-gray' : 'layui-bg-green') + '">' + (d.status == 0 ? '初始' : '完结') + '<\/span>'; }
    function pno(d) { return d.production ? d.production.pno : ''; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: pno },
                { field: 'createTime', title: '创建时间', width: 160 }, { field: 'finishTime', title: '完结时间', width: 160, templet: function (d) { return d.finishTime || ''; } },
                { field: 'timeLimit', title: '工期', width: 80 }, { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 300, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handle(obj.event, obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageProductionPlan, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function handle(ev, v) {
        if (ev === 'item') { app.params.productionPlanItem = { ppid: v.ppid, status: v.status }; app.popup('views/production/productionPlanItem.html', '计划项-' + v.no, null, { area: ['900px', '600px'] }); }
        else if (ev === 'progress') { app.params.productionPlanDetail = { ppid: v.ppid, status: v.status, differentiate: true }; app.switchPage(api.index.productionPlanDetailIndex.url); }
        else if (ev === 'finish') { if (v.status != 0) return; openFinish(v); }
    }
    function openFinish(v) {
        app.clearValidator(); $('#finishForm')[0].reset(); $('#finishForm [name="ppid"]').val(v.ppid);
        state.finishIndex = layer.open({ type: 1, title: '完结生产计划', content: $('#finishBox'), area: ['440px', 'auto'] });
    }
    function saveFinish() {
        if (app.validate('finishForm')) return;
        app.post(api.production.finishProductionPlan, { 'productionPlan.ppid': $('#finishForm [name="ppid"]').val(), 'productionPlan.num': $('#finishForm [name="num"]').val() }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.finishIndex); state.finishIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnFinishOk').on('click', saveFinish);
    $('#btnFinishCancel').on('click', function () { layer.close(state.finishIndex); state.finishIndex = null; });
});
}); // end app.ready
