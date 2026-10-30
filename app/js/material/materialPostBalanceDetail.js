/** app/js/material/materialPostBalanceDetail.js —— 主材结算明细（item + refund 聚合列表，只读）
 * 上下文：app.params.materialPostBalance = { msoId, type, ident? }。
 * type=0 显示 item+refund 聚合，type=1/2 显示指定 ident 的 refund 列表。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var ctx = app.params.materialPostBalance || {};
    initTable();
    load();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'no', title: '型号', width: 140 },
                { field: 'category', title: '品类', width: 100 },
                { field: 'brand', title: '品牌', width: 120 },
                { field: 'measurementUnit', title: '单位', width: 80 },
                { field: 'salePrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.salePrice); } },
                { field: 'price', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'prePoint', title: '结算值', width: 100 },
                { field: 'comment', title: '说明', minWidth: 140 }
            ]]
        });
    }
    function load() {
        if (!ctx.msoId) { app.showAlert(app.warning, '缺少订单上下文'); return; }
        if (ctx.type == 1 || ctx.type == 2) {
            // 退货明细
            var o = { 'materialRefund.mid': ctx.msoId };
            if (ctx.ident) o['idents[0]'] = ctx.ident;
            app.post(api.material.queryMaterialRefundByMid, o, function (res) { table.reload('resultTable', { data: res.materialRefunds || [] }); });
        } else {
            // 购货明细：item 列表
            app.post(api.material.queryMaterialItemByMid, { 'materialItem.mid': ctx.msoId }, function (res) { table.reload('resultTable', { data: res.materialItems || [] }); });
        }
    }
    $('#btnBack').on('click', function () { app.switchPage(api.index.materialPostBalanceIndex.url); });
});
}); // end app.ready
