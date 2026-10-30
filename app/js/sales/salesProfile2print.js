/** app/js/sales/salesProfile2print.js —— 销售单品牌满意度表（打印）
 * 上下文：app.params.salesProfile = {orderId,...}, app.params.sid
 * type: 0=文本/1=评分/2=选项 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var sp = app.params.salesProfile || {};
    var sid = app.params.sid;
    var printSales = {}, decoration = {};
    function start() {
        if (!sp.orderId) { $('#receipt').html('<p style="text-align:center;">缺少订单信息</p>'); return; }
        app.post(api.sales.querySalesBySid, { 'sales.sid': sid }, function (res) { printSales = res.sales || {}; afterSales(); }, function () { afterSales(); });
    }
    function afterSales() {
        app.post(api.decoration.queryDecorationByOrderId, { 'decorationOrderId': sp.orderId }, function (res) { decoration = res.decoration || {}; afterDec(); }, function () { afterDec(); });
    }
    function afterDec() {
        app.post(api.sales.querySalesProfileByOrderId, { 'salesProfile.orderId': sp.orderId }, function (res) {
            renderHeader();
            renderLines(res.salesProfile && res.salesProfile.items ? res.salesProfile.items : []);
        });
    }
    function renderHeader() {
        var addr = (printSales.house && printSales.house.village ? printSales.house.village.name : '') + ' ' + (printSales.house ? printSales.house.houseNumber : '');
        var designer = decoration.designer ? (decoration.designer.currentName || '无') : '无';
        var signTime = decoration.contractTime || decoration.precontractTime || '';
        var h = '<center><table style="width:90%; border-collapse:collapse;" border="1" cellpadding="0" cellspacing="0">'
            + '<caption style="line-height:50px;font-size:20px;">销售单品牌满意度表<\/caption>'
            + '<tr><td style="text-align:center;height:25px;">订单编号<\/td><td style="text-align:center;">' + (sp.orderId || '') + '<\/td><td style="text-align:center;">楼盘<\/td><td style="text-align:center;">' + addr + '<\/td><\/tr>'
            + '<tr><td style="text-align:center;height:25px;">设计师<\/td><td style="text-align:center;">' + designer + '<\/td><td style="text-align:center;">签单日期<\/td><td style="text-align:center;">' + (signTime || '') + '<\/td><\/tr>'
            + '<tr><td style="text-align:center;height:25px;">创建时间<\/td><td style="text-align:center;">' + (decoration.createTime || '') + '<\/td><td colspan="2"><\/td><\/tr>'
            + '<tr><td style="text-align:center;height:25px;">品牌<\/td><td style="text-align:center;">评分<\/td><td colspan="2" style="text-align:center;">备注说明<\/td><\/tr>';
        $('#receipt').html(h);
    }
    function renderLines(items) {
        var contents = [];
        var rows = '';
        $.each(items, function (i, v) {
            if (v.spiid == null) return true;
            if (v.type === 0) { /* 文本，忽略 */ }
            else if (v.type === 2) {
                var opts = '';
                $.each(v.options || [], function (j, n) { if (n.checked === 0) opts += (opts ? ' / ' : '') + (n.title || ''); });
                rows += '<tr style="height:25px;"><td style="text-align:center;">' + (v.name || '') + '<\/td><td style="text-align:center;">' + opts + '<\/td><td colspan="2" style="text-align:center;" id="td' + i + '"><\/td><\/tr>';
            } else if (v.type === 1) {
                contents.push(v.content || '');
            }
        });
        var $tbl = $('#receipt table');
        $tbl.append(rows);
        // 评分内容回填
        $('td[id^="td"]').each(function (idx) { $(this).text(contents[idx] || ''); });
        $tbl.after('<\/center>');
    }
    start();
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
