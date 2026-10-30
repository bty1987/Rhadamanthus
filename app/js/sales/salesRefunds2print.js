/** app/js/sales/salesRefunds2print.js —— 销售退货单打印
 * 上下文：app.params.sales.sales = {sid,no,orderId,brand,supplier,house,type,grade,...}, app.params.sales.refunds = {rid,type,createTime,total,comment} */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var data = (app.params.sales && app.params.sales.sales) || {};
    var refunds = (app.params.sales && app.params.sales.refunds) || {};
    var flag = (app.params.sales && app.params.sales.flag) || 'refund';
    var company = app.params.company || {};
    var TYPE = { 0: '全部退', 1: '部分退' };
    function start() {
        if (!data.sid) { $('#receipt').html('<p style="text-align:center;">缺少销售单信息</p>'); return; }
        app.post(api.sales.querySalesRefundsItemBySid, { 'refunds.sales.sid': data.sid }, function (res) {
            render(res.refundsItems || []);
        });
    }
    function render(items) {
        var addr = (data.house && data.house.village ? data.house.village.name : '') + ' ' + (data.house ? data.house.houseNumber : '');
        var captionTitle = (data.type == 1 ? '补贴' : '') + (data.grade == 'A' ? '装修材料退货明细单' : '商品退货单');
        var title = (company.fullname || '') + '主材代购退货单';
        var total = refunds.total || 0;
        var h = '<center><table style="width:90%; border-collapse:collapse; table-layout:fixed;" border="1" cellpadding="0" cellspacing="0">'
            + '<caption style="line-height:50px;font-size:20px;font-weight:bold;">' + captionTitle + '<\/caption>'
            + '<tr><td colspan="7" style="text-align:center;font-size:16px;font-weight:bold;">' + title + '<\/td><\/tr>'
            + '<tr><td colspan="5" style="text-align:right;">销售单号: <\/td><td colspan="2" style="text-align:center;border-bottom:1px solid #333;">' + (data.no || '') + '<\/td><\/tr>'
            + '<tr><td colspan="5" style="text-align:right;">退货类型: <\/td><td colspan="2" style="text-align:center;border-bottom:1px solid #333;">' + (TYPE[refunds.type] != null ? TYPE[refunds.type] : '-') + '<\/td><\/tr>'
            + '<tr><td colspan="5" style="text-align:right;">退单日期: <\/td><td colspan="2" style="text-align:center;border-bottom:1px solid #333;">' + (refunds.createTime || '') + '<\/td><\/tr>'
            + '<tr><td>供货方:<\/td><td colspan="2" style="border-bottom:1px solid #333;">' + (data.supplier ? data.supplier.currentName : '') + '<\/td><td>装修单号:<\/td><td colspan="3" style="border-bottom:1px solid #333;">' + (data.orderId || '') + '<\/td><\/tr>'
            + '<tr><td>品牌:<\/td><td colspan="2" style="border-bottom:1px solid #333;">' + (data.brand ? data.brand.name : '') + '<\/td><td>客户确认时间:<\/td><td colspan="3" style="border-bottom:1px solid #333;">' + (data.affirmTime || '') + '<\/td><\/tr>'
            + '<tr><td>楼盘地址:<\/td><td colspan="6" style="border-bottom:1px solid #333;">' + addr + '<\/td><\/tr>'
            + '<\/table>';
        if (flag == 'refund') {
            h += '<table style="width:90%; border-collapse:collapse; table-layout:fixed;margin-top:4px;" border="1" cellpadding="0" cellspacing="0">'
                + '<tr><th colspan="2">商品名称<\/th><th colspan="2">规格<\/th><th>数量<\/th><th>售价<\/th><th>总价<\/th><\/tr>';
            $.each(items, function (i, v) {
                if (v.rid != refunds.rid) return true;
                if (v.salesItem.psiid) return true;
                h += '<tr><td colspan="2" style="text-align:center;">' + (v.salesItem.goods ? v.salesItem.goods.name : '') + '<\/td><td colspan="2" style="text-align:center;">' + (v.salesItem.format ? v.salesItem.format.info : '') + '<\/td><td style="text-align:center;">' + (v.num || '') + '<\/td><td style="text-align:center;">' + app.formatMoney(v.salesItem.price) + '<\/td><td style="text-align:center;">' + app.formatMoney(v.total) + '<\/td><\/tr>';
            });
        }
        h += '<tr><td>退款金额<\/td><td>大写: ' + (app.utils.getCNMoney ? app.utils.getCNMoney(Math.round(app.utils.changeThrDecimal(refunds.total))) : '') + '<\/td><td>退款金额<\/td><td colspan="4">' + app.formatMoney(refunds.total) + '<\/td><\/tr>';
        h += '<tr><td>备注:<\/td><td colspan="6" style="text-align:left;padding-left:8px;">' + (refunds.comment || '') + '<\/td><\/tr>';
        h += '<\/table><\/center>';
        $('#receipt').html(h);
    }
    start();
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
