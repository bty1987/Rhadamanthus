/** app/js/material/materialRefund.js —— 主材退款明细（按 mid 列出退款项）
 * 上下文：app.params.materialSubOrder.msoId。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var sub = app.params.materialSubOrder || {};
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'checkbox', width: 50 },
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
                { field: 'comment', title: '说明', minWidth: 140 }
            ]]
        });
    }
    function query() {
        if (!sub.msoId) { app.showAlert(app.warning, '缺少订单上下文'); return; }
        app.post(api.material.queryMaterialRefundByMid, { 'materialRefund.mid': sub.msoId }, function (res) { table.reload('resultTable', { data: res.materialRefunds || [] }); });
    }
    $('#btnPrint').on('click', function () {
        var ck = table.checkStatus('resultTable').data;
        if (!ck.length) { app.showAlert(app.warning, '请勾选要打印的记录'); return; }
        var idents = ck.map(function (v, i) { return 'idents[' + i + ']=' + v.ident; }).join('&');
        app.params.materialReceipt = { type: 2, msoId: sub.msoId, idents: idents };
        app.popup(api.index.materialReceipt.url, '主材退款项收据', null, { area: ['900px', '600px'] });
    });
    $('#btnExport').on('click', function () {
        app.post(api.material.queryMaterialRefundByMid, { 'materialRefund.mid': sub.msoId }, function (res) { app.exporter && app.exporter(res.materialRefunds || [], '主材退款'); });
    });
    $('#btnBack').on('click', function () { app.switchPage(api.index.materialIndex.url); });
});
}); // end app.ready
