/** app/js/production/productionPlan4detail.js —— 生产计划生产进度（工序组列表 + 嵌套工序流程）
 * 上下文：app.params.productionPlanDetail = {ppid, status, differentiate}
 * 列表 queryProductionWorkPlanByPpid；嵌套工序 queryProductionWorkFlowByPwpid；
 * 完结 finishProductionWorkPlan；废弃 deleteProductionWorkPlan；执行工序 operateProductionWorkFlow；
 * 添加工序组弹窗 workplan2add.html。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.productionPlanDetail || {};
    var STATUS = { 0: '初始', 1: '执行', 2: '完结', 3: '废除' };
    var WFSTATUS = { 0: '初始', 1: '执行', 2: '完结', 3: '废除' };
    query();
    function query() {
        if (!ctx.ppid) { app.showAlert(app.warning, '缺少生产计划上下文'); return; }
        app.post(api.production.queryProductionWorkPlanByPpid, { 'productionWorkPlan.ppid': ctx.ppid }, function (res) {
            render(res.productionWorkPlans || []);
        });
    }
    function render(list) {
        var $box = $('#planList').empty();
        if (!list.length) { $box.append('<div style="text-align:center;padding:40px;color:#999;">无可用数据提供</div>'); return; }
        list.forEach(function (wp) {
            var $card = $('<div class="layui-card" style="margin-bottom:10px;"></div>');
            var $header = $('<div class="layui-card-header"></div>');
            $header.append('<b>' + wp.sort + '. ' + (wp.workplan ? wp.workplan.name : '') + '</b>');
            $header.append('<span class="layui-badge layui-bg-gray" style="margin-left:10px;">状态: ' + (STATUS[wp.status] || '-') + '<\/span>');
            $header.append('<span style="margin-left:10px;color:#5FB878;">创建时间: ' + (wp.createTime || '') + '<\/span>');
            if (wp.finishTime) $header.append('<span style="margin-left:10px;color:#5FB878;">完成时间: ' + wp.finishTime + '<\/span>');
            // 按钮：完结/废弃（status 0/1 时可）
            if (wp.status == 0 || wp.status == 1) {
                var $btnEnd = $('<button class="layui-btn layui-btn-xs" style="margin-left:10px;">完结</button>');
                $btnEnd.on('click', function () {
                    app.post(api.production.finishProductionWorkPlan, { 'productionWorkPlan.ppid': ctx.ppid, 'productionWorkPlan.pwpid': wp.pwpid }, function () { app.showAlert(app.success, '操作成功'); query(); });
                });
                var $btnDel = $('<button class="layui-btn layui-btn-xs layui-btn-danger" style="margin-left:6px;">废弃</button>');
                $btnDel.on('click', function () {
                    if (ctx.status == 0) {
                        app.post(api.production.deleteProductionWorkPlan, { 'productionWorkPlan.ppid': ctx.ppid, 'productionWorkPlan.pwpid': wp.pwpid }, function () { app.showAlert(app.success, '操作成功'); query(); });
                    } else { app.showAlert(app.warning, '该生产计划单已经进行生产,不允许更改工序组'); }
                });
                $header.append($btnEnd).append($btnDel);
            }
            $card.append($header);
            var $body = $('<div class="layui-card-body"></div>');
            $card.append($body);
            $box.append($card);
            // 嵌套工序流程
            app.post(api.production.queryProductionWorkFlowByPwpid, { 'productionWorkFlow.pwpid': wp.pwpid }, function (res) {
                renderWorkflows($body, res.productionWorkFlows || [], wp);
            });
        });
    }
    function renderWorkflows($body, list, wp) {
        $body.empty();
        if (!list.length) { $body.append('<div style="color:#999;padding:8px;">暂无工序</div>'); return; }
        var $row = $('<div class="layui-row layui-col-space10"></div>');
        list.forEach(function (wf) {
            var $col = $('<div class="layui-col-md6"></div>');
            var statusText = WFSTATUS[wf.status] || '-';
            var operator = wf.operator && wf.operator.currentName ? wf.operator.currentName : '';
            $col.append('<div style="padding:8px;border:1px solid #e6e6e6;border-radius:2px;">' +
                '<div><b>工序: </b>' + (wf.workflow ? wf.workflow.name : '') + '</div>' +
                '<div style="margin-top:4px;"><span class="layui-badge layui-bg-gray">操作状态: ' + statusText + '<\/span></div>' +
                '<div style="margin-top:4px;color:#999;">车间: ' + (wp.workplan && wp.workplan.workshop ? wp.workplan.workshop.name : '') + '</div>' +
                (operator ? '<div style="margin-top:4px;color:#999;">操作人: ' + operator + '</div>' : '') +
                '</div>');
            if (wf.status == 0) {
                var $btnRun = $('<button class="layui-btn layui-btn-xs layui-btn-warm" style="margin-top:6px;">执行</button>');
                $btnRun.on('click', function () {
                    app.post(api.production.operateProductionWorkFlow, { 'productionWorkFlow.pwfid': wf.pwfid }, function () { app.showAlert(app.success, '操作成功'); query(); });
                });
                $col.find('div:first').append($btnRun);
            }
            $row.append($col);
        });
        $body.append($row);
    }
    $('#btnAddPlan').on('click', function () {
        if (ctx.status != 0) { app.showAlert(app.warning, '该生产计划单已经进行生产,不允许更改工序组'); return; }
        app.params.productionPlanAdd = { ppid: ctx.ppid };
        app.popup('views/production/workplan2add.html', '查看工序', null, { area: ['700px', '500px'] });
    });
    $('#btnBack').on('click', function () {
        if (ctx.differentiate) app.switchPage(api.index.productionPlanIndex.url);
        else app.switchPage(api.index.productionPlanCreateIndex.url);
    });
    // 弹窗关闭后可刷新（监听 iframe 关闭较复杂，简化为按钮可手动刷新）
    var $refresh = $('<button class="layui-btn layui-btn-primary" style="margin-left:6px;">刷新</button>');
    $refresh.on('click', query); $('#btnAddPlan').after($refresh);
});
}); // end app.ready
