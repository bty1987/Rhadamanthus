/** app/js/production/production4view.js —— 生产单总览（弹窗子页，只读三表）
 * 上下文：app.params.productionView.pid */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.productionView) || app.params.productionView || {};
    var pid = ctx.pid;
    var OS = { 0: '初始', 1: '审核', 2: '确认', 3: '完结', 4: '废除' };
    var HS = { 0: '初始', 1: '采购', 2: '入库', 3: '完结', 4: '废单' };
    var PS = { 0: '初始', 1: '完结' };
    initTables(); loadAll();
    function addr(d) { return d.production && d.production.house && d.production.house.village ? (d.production.house.village.name + ' ' + d.production.house.houseNumber) : ''; }
    function initTables() {
        table.render({ elem: '#outsourceTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: function (d) { return d.production ? d.production.pno : ''; } },
                { field: 'addr', title: '楼盘地址', minWidth: 200, templet: addr },
                { field: 'supplier', title: '厂商', width: 120, templet: function (d) { return d.supplier ? d.supplier.userName : ''; } },
                { field: 'createTime', title: '创建时间', width: 150 }, { field: 'timeLimit', title: '工期', width: 80 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return '<span class="layui-badge layui-bg-blue">' + (OS[d.status] || '-') + '<\/span>'; } } ]] });
        table.render({ elem: '#hardwareTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: function (d) { return d.production ? d.production.pno : ''; } },
                { field: 'addr', title: '楼盘地址', minWidth: 200, templet: addr },
                { field: 'createTime', title: '创建时间', width: 150 }, { field: 'timeLimit', title: '工期', width: 80 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return '<span class="layui-badge layui-bg-blue">' + (HS[d.status] || '-') + '<\/span>'; } } ]] });
        table.render({ elem: '#planTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: function (d) { return d.production ? d.production.pno : ''; } },
                { field: 'addr', title: '楼盘地址', minWidth: 200, templet: addr },
                { field: 'createTime', title: '创建时间', width: 150 }, { field: 'finishTime', title: '完结时间', width: 150, templet: function (d) { return d.finishTime || '订单未完结'; } },
                { field: 'timeLimit', title: '工期', width: 80 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return '<span class="layui-badge layui-bg-blue">' + (PS[d.status] || '-') + '<\/span>'; } } ]] });
    }
    function loadAll() {
        if (!pid) { app.showAlert(app.warning, '缺少生产单上下文'); return; }
        app.post(api.production.queryOutsourceByPid, { 'outsource.production.pid': pid }, function (res) { table.reload('outsourceTable', { data: res.outsources || [] }); });
        app.post(api.production.queryHardwareByPid, { 'hardware.production.pid': pid }, function (res) { table.reload('hardwareTable', { data: res.hardwares || [] }); });
        app.post(api.production.queryProductionPlanByPid, { 'productionPlan.production.pid': pid }, function (res) { table.reload('planTable', { data: res.productionPlans || [] }); });
    }
});
}); // end app.ready
