/** app/js/sales/sales4inventory.js —— 销售单库存详情（出库/采购/入库货单 + 明细）
 * 上下文：app.params.sales.sales = {sid}
 * 数据源 api.inventory.* （inventory 模块未迁移时调用会失败）。
 * manifest.type: 1=出库/2=入库/3=退货；manifest.status / purchaseStatus 来自 ds.manifest。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var sid = (app.params.sales && app.params.sales.sales && app.params.sales.sales.sid) || null;
    var pids = [];
    initTables(); loadExit(); loadPurchase();

    function initTables() {
        table.render({ elem: '#exitTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'code', title: '货单号', width: 160 }, { field: 'creater', title: '创建人', width: 120, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } }, { field: 'createTime', title: '创建时间', width: 170 }, { field: 'manifestTime', title: '货单时间', width: 170 }, { field: 'type', title: '类型', width: 90 }, { field: 'status', title: '状态', width: 90 }, { title: '操作', width: 140, toolbar: '#exitBar' } ]] });
        table.render({ elem: '#purchaseTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '采购单号', width: 160 }, { field: 'user', title: '创建人', width: 120, templet: function (d) { return (d.user && d.user.currentName) || '-'; } }, { field: 'createTime', title: '创建时间', width: 170 }, { field: 'balanceTime', title: '结算时间', width: 170 }, { field: 'deliveryTime', title: '交付时间', width: 170 }, { field: 'status', title: '状态', width: 90 }, { title: '操作', width: 140, toolbar: '#purchaseBar' } ]] });
        table.render({ elem: '#enterTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'code', title: '货单号', width: 160 }, { field: 'creater', title: '创建人', width: 120, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } }, { field: 'createTime', title: '创建时间', width: 170 }, { field: 'manifestTime', title: '货单时间', width: 170 }, { field: 'type', title: '类型', width: 90 }, { field: 'status', title: '状态', width: 90 }, { title: '操作', width: 140, toolbar: '#enterBar' } ]] });
        table.render({ elem: '#itemTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'goods', title: '商品', width: 200, templet: function (d) { return (d.goods && d.goods.name) ? (d.goods.name + ' ' + d.goods.no) : '-'; } }, { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } }, { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } }, { field: 'measurementUnit', title: '单位', width: 80, templet: function (d) { return (d.goods && d.goods.measurementUnit) || '-'; } }, { field: 'num', title: '数量', width: 80 }, { field: 'pieceNum', title: '件数', width: 80, templet: function (d) { return (d.goods && d.goods.pieceNum) || ''; } }, { field: 'outprice', title: '价格', width: 100, templet: function (d) { return app.formatMoney(d.outprice); } } ]] });
        table.on('tool(exitTable)', function (obj) { if (obj.event === 'item') loadItem('manifest', obj.data.mid); });
        table.on('tool(purchaseTable)', function (obj) { if (obj.event === 'item') loadItem('purchase', obj.data.pid); });
        table.on('tool(enterTable)', function (obj) { if (obj.event === 'item') loadItem('manifest', obj.data.mid); });
    }
    function loadExit() {
        if (!sid) return;
        app.post(api.inventory.queryManifestForXGBySid, { 'sales.sid': sid }, function (res) {
            table.reload('exitTable', { data: res.manifests || [] });
        });
    }
    function loadPurchase() {
        if (!sid) return;
        var opt = { 'sales.sid': sid }; var _opt = {};
        app.post(api.inventory.queryPurchaseBySid, opt, function (res) {
            var list = res.purchases || [];
            $.each(list, function (i, v) { _opt['pids[' + i + ']'] = v.pid; });
            table.reload('purchaseTable', { data: list });
            loadEnter(_opt);
        });
    }
    function loadEnter(_opt) {
        app.post(api.inventory.queryManifestForPUByPids, _opt, function (res) {
            table.reload('enterTable', { data: res.manifests || [] });
        });
    }
    function loadItem(kind, id) {
        if (kind == 'manifest') app.post(api.inventory.queryManifestItemByMid, { 'manifest.mid': id }, function (res) { table.reload('itemTable', { data: res.manifestItems || [] }); });
        else app.post(api.inventory.queryPurchaseItemByPid, { 'purchase.pid': id }, function (res) { table.reload('itemTable', { data: res.purchaseItems || [] }); });
    }
});
}); // end app.ready
