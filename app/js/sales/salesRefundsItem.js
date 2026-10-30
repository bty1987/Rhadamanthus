/** app/js/sales/salesRefundsItem.js —— 销售退货明细
 * 上下文：app.params.sales.sales = {sid,...}, app.params.flag = "refunds"|"sales",
 * refunds 模式额外带 app.params.rid。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var ctxSales = app.params.sales || {};
    var sales = ctxSales.sales || {};
    var flag = app.params.flag || 'sales';
    var rid = app.params.rid;
    var TYPE = { 0: '全部退', 1: '部分退' };
    initTables(); loadRefunds(); loadItems();

    function initTables() {
        table.render({ elem: '#refundsTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'rid', title: '退货单号', width: 100 },
                { field: 'no', title: '销售单号', width: 140, templet: function () { return sales.no || '-'; } },
                { field: 'category', title: '品类', width: 100, templet: function () { return sales.category || '-'; } },
                { field: 'brand', title: '品牌', width: 140, templet: function (d) { return (d.sales && d.sales.brand && d.sales.brand.name) || (sales.brand && sales.brand.name) || '-'; } },
                { field: 'total', title: '退款总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 160, toolbar: '#refundsToolbar' } ]] });
        table.on('tool(refundsTable)', function (obj) {
            if (obj.event === 'print') doPrint(obj.data);
            else if (obj.event === 'send') doSend(obj.data);
        });
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'goods', title: '商品', width: 200, templet: function (d) { return (d.salesItem && d.salesItem.goods) ? (d.salesItem.goods.name + ' ' + d.salesItem.goods.no) : '-'; } },
                { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } },
                { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } },
                { field: 'selling', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.salesItem && d.salesItem.selling); } },
                { field: 'disPrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.salesItem && d.salesItem.disPrice); } },
                { field: 'price', title: '折让价', width: 100, templet: function (d) { return app.formatMoney(d.salesItem && d.salesItem.price); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'rawCtype', title: '原结算方式', width: 110, templet: function (d) { return d.salesItem && d.salesItem.rawCtype == 0 ? '底价' : '点位'; } },
                { field: 'rawCvalue', title: '原结算值', width: 100, templet: function (d) { return app.formatMoney(d.salesItem && d.salesItem.rawCvalue); } },
                { field: 'ctype', title: '结算方式', width: 100, templet: function (d) { return d.salesItem && d.salesItem.ctype == 0 ? '底价' : '点位'; } },
                { field: 'cvalue', title: '结算值', width: 100, templet: function (d) { return app.formatMoney(d.salesItem && d.salesItem.cvalue); } } ]] });
    }
    function loadRefunds() {
        if (!sales.sid) return;
        app.post(api.sales.querySalesRefundsBySid, { 'refunds.sales.sid': sales.sid }, function (res) {
            table.reload('refundsTable', { data: res.refundses || [] });
        });
    }
    function loadItems() {
        var api, opt;
        if (flag == 'refunds' && rid) { api = api.sales.querySalesRefundsItemByRid; opt = { 'refunds.rid': rid }; }
        else { api = api.sales.querySalesRefundsItemBySid; opt = { 'refunds.sales.sid': sales.sid }; }
        app.post(api, opt, function (res) {
            var list = res.refundsItems || [];
            // 组织父子层级（套餐明细缩进）
            var map = {}, roots = [];
            $.each(list, function (i, v) { if (v.salesItem) { map[v.salesItem.siid] = v; v.children = []; } });
            $.each(list, function (i, v) {
                if (v.salesItem && v.salesItem.psiid && map[v.salesItem.psiid]) map[v.salesItem.psiid].children.push(v);
                else roots.push(v);
            });
            // 扁平化（父子紧挨）便于表格显示
            var flat = [];
            function walk(arr, lv) { $.each(arr, function (i, v) { v._lv = lv || 0; flat.push(v); if (v.children && v.children.length) walk(v.children, (lv || 0) + 1); }); }
            walk(roots, 0);
            table.reload('resultTable', { data: flat });
        });
    }
    function doPrint(v) {
        app.params.sales.sales = sales; app.params.sales.refunds = v; app.params.sales.flag = 'refund';
        app.popup(api.index.salesRefundsPrintIndex.url, '销售退货单:' + sales.orderId, null, { area: ['900px', '600px'] });
    }
    function doSend(v) {
        app.showConfirm('确认推送退货单 ' + v.rid + ' ?', function () {
            app.post(api.sales.sendSalesRefunds, { 'refunds.rid': v.rid }, function () { app.showAlert(app.success, '推送成功'); });
        });
    }
});
}); // end app.ready
