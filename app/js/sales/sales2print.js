/** app/js/sales/sales2print.js —— 销售单打印（定金/补款确认单）
 * 上下文：app.params.sales.sales = {sid,no,orderId,depositpay,fullpay,coupon,...}, app.params.sales.flag = 'depositPay'|'fullPay'
 * flag=fullPay 时显示商品明细行。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var data = (app.params.sales && app.params.sales.sales) || {};
    var flag = (app.params.sales && app.params.sales.flag) || 'depositPay';
    var company = app.params.company || {};
    var decoration = {};
    function start() {
        if (!data.sid) { $('#receipt').html('<p style="text-align:center;">缺少销售单信息</p>'); return; }
        app.post(api.decoration.queryDecorationByOrderId, { 'decorationOrderId': data.orderId }, function (res) { decoration = res.decoration || {}; loadItems(); }, function () { loadItems(); });
    }
    function loadItems() {
        app.post(api.sales.querySalesItemBySid, { 'sales.sid': data.sid }, function (res) {
            render(res.salesItems || []);
        });
    }
    function render(items) {
        var addr = (data.house && data.house.village ? data.house.village.name : '') + ' ' + (data.house ? data.house.houseNumber : '');
        var designer = decoration.designer ? (decoration.designer.currentName || '') : '';
        var supervisor = decoration.supervisor ? (decoration.supervisor.currentName || '') : '';
        var title = (company.fullname || '') + (flag == 'fullPay' ? '主材代购确认单' : '主材代购确认单-定金');
        var captionTitle = (data.type == 1 ? '补贴' : '') + (data.grade == 'A' ? '装修材料明细单' : '商品销售单');
        var isFull = flag == 'fullPay';
        var moneyName = isFull ? '实收金额' : '实收定金';
        var net = isFull ? app.utils.changeThrDecimal(app.utils.accSub(data.fullpay, data.coupon)) : app.utils.changeThrDecimal(data.depositpay);
        var h = '<center><table style="width:90%; border-collapse:collapse; table-layout:fixed;" border="1" cellpadding="0" cellspacing="0">'
            + '<caption style="line-height:50px;font-size:20px;font-weight:bold;">' + captionTitle + '<\/caption>'
            + '<tr><td colspan="7" style="text-align:center;font-size:16px;font-weight:bold;">' + title + '<\/td><\/tr>'
            + '<tr><td colspan="3" style="text-align:right;">销售单号: <\/td><td colspan="4" style="text-align:center;border-bottom:1px solid #333;">' + (data.no || '') + '<\/td><\/tr>'
            + '<tr><td colspan="3" style="text-align:right;">开单日期: <\/td><td colspan="4" style="border-bottom:1px solid #333;"><\/td><\/tr>'
            + '<tr><td>供货方:<\/td><td colspan="2" style="border-bottom:1px solid #333;">' + (data.supplier ? data.supplier.currentName : '') + '<\/td><td>装修单号:<\/td><td colspan="3" style="border-bottom:1px solid #333;">' + (data.orderId || '') + '<\/td><\/tr>'
            + '<tr><td>品牌:<\/td><td colspan="2" style="border-bottom:1px solid #333;">' + (data.brand ? data.brand.name : '') + '<\/td><td>客户确认时间:<\/td><td colspan="3" style="border-bottom:1px solid #333;">' + (data.affirmTime || '') + '<\/td><\/tr>'
            + '<tr><td>楼盘地址:<\/td><td colspan="6" style="border-bottom:1px solid #333;">' + addr + '<\/td><\/tr>';
        if (isFull) {
            h += '<tr><th colspan="3">商品名称<\/th><th>规格<\/th><th>数量<\/th><th>单价<\/th><th>总价<\/th><\/tr>';
            $.each(items, function (i, v) {
                if (v.psiid) return true;
                h += '<tr><td colspan="3" style="text-align:center;">' + (v.goods ? v.goods.name : '') + '<\/td><td style="text-align:center;">' + (v.format ? v.format.info : '') + '<\/td><td style="text-align:center;">' + (v.num || '') + '<\/td><td style="text-align:center;">' + app.formatMoney(v.price) + '<\/td><td style="text-align:center;">' + app.formatMoney(v.total) + '<\/td><\/tr>';
            });
        }
        h += '<tr><td>' + moneyName + '<\/td><td>大写:<\/td><td colspan="2">' + (app.utils.getCNMoney ? app.utils.getCNMoney(net) : '') + '<\/td><td>小写:<\/td><td colspan="2">' + app.formatMoney(net) + '<\/td><\/tr>';
        h += '<tr><td>温馨提示<\/td><td colspan="6">' + (data.comment || '') + '<\/td><\/tr>';
        h += '<tr><td colspan="7" style="text-align:center;font-weight:bold;">购货方须知<\/td><\/tr>';
        h += '<tr><td colspan="7" id="talkingsBox" style="text-align:left;"><\/td><\/tr>';
        h += '<tr><td colspan="3">设计师:<\/td><td colspan="4">' + designer + '<\/td><\/tr>';
        h += '<tr><td colspan="3">监理:<\/td><td colspan="4">' + supervisor + '<\/td><\/tr>';
        h += '<\/table><\/center>';
        $('#receipt').html(h);
        // 加载须知
        app.post(api.data.queryTalking, { 'types[0]': data.type == 1 ? 8 : 6 }, function (v) {
            var html = '';
            $.each(v.talkings || [], function (i, t) { if (t.content) html += '<div style="font-size:10px;">' + t.content + '<\/div>'; });
            $('#talkingsBox').html(html || '&nbsp;');
        }, function () {});
    }
    start();
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
