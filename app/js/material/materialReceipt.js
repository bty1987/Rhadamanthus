/** app/js/material/materialReceipt.js —— 主材收据（渲染明细表格，可打印）
 * 上下文：app.params.materialReceipt = { type: 1|2, msoId, idents? }。
 * 1=销售收据（items 来自 queryMaterialItemByMid），2=退款收据（items 来自 queryMaterialRefundByMid）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var r = app.params.materialReceipt || {};
    if (!r.msoId) { $('#receipt').html('<p style="text-align:center;">缺少订单信息</p>'); return; }
    var url = api.material.queryMaterialByMid;
    var itemUrl = r.type == 2 ? api.material.queryMaterialRefundByMid : api.material.queryMaterialItemByMid;
    var m = {};
    app.post(url, { 'material.mid': r.msoId }, function (res) {
        m = res.material || {};
        var param = {}; param[r.type == 2 ? 'materialRefund.mid' : 'materialItem.mid'] = r.msoId;
        app.post(itemUrl, param, function (ir) {
            var list = r.type == 2 ? (ir.materialRefunds || []) : (ir.materialItems || []);
            renderReceipt(m, list, r.type);
        });
    });
    function renderReceipt(m, list, type) {
        var addr = (m.house && m.house.village ? m.house.village.name : '') + ' ' + (m.house ? m.house.houseNumber : '');
        var h = '<center><table style="width:80%; border-collapse:collapse;" border="1" cellpadding="0" cellspacing="0">'
            + '<tr style="background:#fff; border:1px solid #fff; border-bottom-color:#000;"><td colspan="8" style="text-align:center;"><h2>' + (type == 2 ? '主材退款明细' : '主材型号明细') + '<\/h2><\/td><\/tr>'
            + '<tr><td colspan="3">主材单号: ' + (m.no || '') + '<\/td><td colspan="5">客户地址: ' + addr + '<\/td><\/tr>'
            + '<tr><td colspan="2">客户: ' + (m.customer ? m.customer.name : '') + '<\/td><td colspan="3">业务员: ' + (m.salesman ? m.salesman.currentName : '') + '<\/td><td colspan="3">主材导购: ' + (m.materialer ? m.materialer.currentName : '') + '<\/td><\/tr>'
            + '<tr><th>套餐<\/th><th>型号名称<\/th><th>品类<\/th><th>品牌<\/th><th>单位<\/th><th>售价<\/th><th>数量<\/th><th>总价<\/th><\/tr>';
        var total = 0;
        list.forEach(function (it) {
            h += '<tr><td style="text-align:center;">' + (it.packageName || '-') + '<\/td><td style="text-align:center;">' + (it.name || '') + '<\/td><td style="text-align:center;">' + (it.category || '') + '<\/td><td style="text-align:center;">' + (it.brand || '') + '<\/td><td style="text-align:center;">' + (it.measurementUnit || '') + '<\/td><td style="text-align:center;">-<\/td><td style="text-align:center;">' + (it.num || '') + '<\/td><td style="text-align:center;">-<\/td><\/tr>';
            total = app.utils.accAdd(total, parseFloat(it.total || 0));
        });
        if (type != 2) {
            h += '<tr><td>定金<\/td><td colspan="2">大写:' + (app.utils.getCNMoney ? app.utils.getCNMoney(m.depositPayment) : '') + '<\/td><td>¥' + app.formatMoney(m.depositPayment) + '<\/td><td colspan="4"><\/td><\/tr>';
            h += '<tr><td>补款<\/td><td colspan="2">大写:' + (app.utils.getCNMoney ? app.utils.getCNMoney(m.fullPayment) : '') + '<\/td><td>¥' + app.formatMoney(m.fullPayment) + '<\/td><td colspan="4"><\/td><\/tr>';
            h += '<tr><td>抹零<\/td><td colspan="2">大写:' + (app.utils.getCNMoney ? app.utils.getCNMoney(app.utils.accAdd(m.maling, m.venderMaling)) : '') + '<\/td><td>¥' + app.formatMoney(app.utils.accAdd(m.maling, m.venderMaling)) + '<\/td><td colspan="4"><\/td><\/tr>';
            total = m.total;
        }
        h += '<tr><td>总价<\/td><td colspan="2">大写:' + (app.utils.getCNMoney ? app.utils.getCNMoney(total) : '') + '<\/td><td>¥' + app.formatMoney(total) + '<\/td><td colspan="4"><\/td><\/tr>';
        h += '<\/table><\/center>';
        $('#receipt').html(h);
    }
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
