/** app/js/sales/salesItem4balance.js —— 销售结算项明细（只读列表）
 * 上下文：app.params.sales.salesBalance = {sbid}, app.params.sales.sales = {sid}
 * 合并送货状态：querySalesDeliveryItem 按 sid 取状态，挂到 salesItem.deliveryStatus。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var ctxSales = app.params.sales || {};
    var sbid = ctxSales.salesBalance && ctxSales.salesBalance.sbid;
    var sid = ctxSales.sales && ctxSales.sales.sid;
    // salesDeliveryItem.status: 0未送/1部分/2已送/3已确认/4已完成
    var DELIVERY = { 0: '未送', 1: '部分', 2: '已送', 3: '已确认', 4: '已完成' };
    initTable();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'salesItem', title: '商品', width: 180, templet: function (d) { return (d.salesItem && d.salesItem.goods) ? d.salesItem.goods.name : '-'; } },
                { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } },
                { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } },
                { field: 'selling', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.salesItem && d.salesItem.selling); } },
                { field: 'disPrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.salesItem && d.salesItem.disPrice); } },
                { field: 'price', title: '折让价', width: 100, templet: function (d) { return app.formatMoney(d.salesItem && d.salesItem.price); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'deliveryStatus', title: '配送状态', width: 100, templet: function (d) { var s = d.salesItem && d.salesItem.deliveryStatus; return s != null && DELIVERY[s] ? DELIVERY[s] : '-'; } },
                { field: 'ctype', title: '结算方式', width: 100, templet: function (d) { return d.ctype == 0 ? '底价' : '点位'; } },
                { field: 'cvalue', title: '结算值', width: 100, templet: function (d) { return app.formatMoney(d.cvalue); } },
                { field: 'comment', title: '备注', minWidth: 140, templet: function (d) { return (d.salesItem && d.salesItem.comment) || ''; } } ]] });
    }

    function loadList() {
        if (!sbid) { app.showAlert(app.warning, '缺少结算单参数'); return; }
        var items = [];
        app.post(api.sales.querySalesBalanceItemBySbid, { 'salesBalance.sbid': sbid }, function (res) {
            items = res.salesBalanceItems || [];
            // 合并送货状态
            if (sid && items.length) {
                app.post(api.sales.querySalesDeliveryItem, { 'salesDeliveryItem.sales.sid': sid }, function (r) {
                    var dm = {};
                    $.each(r.salesDeliveryItems || [], function (i, v) { if (v.salesItem) dm[v.salesItem.siid] = v.status; });
                    $.each(items, function (i, v) { if (v.salesItem && dm.hasOwnProperty(v.salesItem.siid)) v.salesItem.deliveryStatus = dm[v.salesItem.siid]; });
                    table.reload('resultTable', { data: items });
                });
            } else {
                table.reload('resultTable', { data: items });
            }
        });
    }
    loadList();
});
}); // end app.ready
