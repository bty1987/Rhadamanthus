/** app/js/production/production2bind.js —— 生产单绑定销售单/主材单
 * 上下文：app.params.productionBind = {pid, status, orderId}
 * 列表 queryProductionSalesByPid（按 type 分别再查 sales/material 详情）；
 * 绑定：bindProductionSales（type=1 销售单 querySalesByNo；type=0 主材单 queryMaterialByNo）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.productionBind || {};
    var postData = {};
    var bindIndex = null;
    if (ctx.status != 0) $('#btnBind').hide();
    initTable(); createPage();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '单号', width: 180, templet: function (d) { return d.no || d.type == 1 ? '销售单' : '主材单'; } },
                { field: 'customer', title: '客户名', width: 120, templet: function (d) { return d.customer ? d.customer.name : ''; } },
                { field: 'category', title: '品类', width: 120 },
                { field: 'brand', title: '品牌', width: 140 },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'total', title: '总价', width: 120, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'statusText', title: '状态', width: 120 } ]] });
    }
    function createPage() {
        if (!ctx.pid) { app.showAlert(app.warning, '缺少生产单上下文'); return; }
        app.post(api.production.queryProductionSalesByPid, { 'productionSales.pid': ctx.pid }, function (res) {
            var list = res.productionSaless || [];
            var pending = list.length, rows = [];
            if (!pending) { table.reload('resultTable', { data: [] }); return; }
            list.forEach(function (v, i) {
                if (v.type == 1) {
                    app.post(api.sales.querySalesBySid, { 'sales.sid': v.sid }, function (r) {
                        var d = r.sales || {};
                        rows[i] = { no: '销售单  ' + d.no, customer: d.customer, category: d.category, brand: d.brand, createTime: d.createTime, total: d.total, statusText: '' };
                        if (--pending === 0) table.reload('resultTable', { data: rows });
                    }, function () { rows[i] = { no: '查询失败' }; if (--pending === 0) table.reload('resultTable', { data: rows }); });
                } else {
                    app.post(api.material.queryMaterialByMid, { 'material.mid': v.sid }, function (r) {
                        var d = r.material || {};
                        rows[i] = { no: '主材单  ' + d.no, customer: d.customer, category: d.category, brand: d.brand, createTime: d.createTime, total: d.total, statusText: '' };
                        if (--pending === 0) table.reload('resultTable', { data: rows });
                    }, function () { rows[i] = { no: '查询失败' }; if (--pending === 0) table.reload('resultTable', { data: rows }); });
                }
            });
        }, function () { app.showAlert(app.warning, '未查到此生产单下的生产销售单'); });
    }
    function openBind() {
        app.clearValidator(); $('#bindForm')[0].reset(); postData = {};
        bindIndex = layer.open({ type: 1, title: '绑定销售单/主材单', content: $('#bindBox'), area: ['560px', 'auto'] });
    }
    $('#btnLoadSale').on('click', function () {
        var _type = $('#selType').val(); var no = $.trim($('#bindForm [name="saleNo"]').val());
        if (!no) { app.showAlert(app.warning, '请输入单号'); return; }
        postData['productionSales.type'] = _type;
        if (_type == 1) {
            app.post(api.sales.querySalesByNo, { 'sales.no': no }, function (data) {
                if (ctx.orderId != data.sales.orderId) { app.showAlert(app.warning, '此销售单与生产单非同一装修订单,无法绑定'); return; }
                if (data.sales.fullpayStatus == -1 || data.sales.fullpayStatus == 0) { app.showAlert(app.warning, '此销售订单未提交补款,无法绑定'); return; }
                $('#bindForm [name="brand"]').val(data.sales.category + '-' + (data.sales.brand ? data.sales.brand.name : ''));
                postData['productionSales.sid'] = data.sales.sid; postData['productionSales.total'] = data.sales.total;
            }, function () { app.showAlert(app.warning, '未查询到此订单'); $('#bindForm [name="brand"]').val(''); });
        } else {
            app.post(api.material.queryMaterialByNo, { 'material.no': no }, function (data) {
                if (ctx.orderId != data.material.orderId) { app.showAlert(app.warning, '此主材单与生产单非同一装修订单,无法绑定'); return; }
                if (data.material.fullStatus == 0 || data.material.fullStatus == 1) { app.showAlert(app.warning, '此主材订单未提交补款,无法绑定'); return; }
                $('#bindForm [name="brand"]').val(data.material.category + '-' + data.material.brand);
                postData['productionSales.sid'] = data.material.mid; postData['productionSales.total'] = data.material.total;
            }, function () { app.showAlert(app.warning, '未查询到此订单'); $('#bindForm [name="brand"]').val(''); });
        }
    });
    function doSave() {
        if (app.validate('bindForm')) return;
        if (!postData['productionSales.sid']) { app.showAlert(app.warning, '请先读取并确认订单'); return; }
        postData['productionSales.pid'] = ctx.pid;
        app.post(api.production.bindProductionSales, postData, function () {
            app.showAlert(app.success, '操作成功'); createPage(); layer.close(bindIndex); bindIndex = null;
        });
    }
    $('#btnBind').on('click', openBind);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(bindIndex); bindIndex = null; });
    $('#btnBack').on('click', function () { app.switchPage(api.index.productionIndex.url); });
});
}); // end app.ready
