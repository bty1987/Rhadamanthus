/** app/js/balance/balanceSelection2print.js —— 结算选材单打印
 * 上下文：app.params.balance.{bsid,type}。type=1 时输出供应商对账单（含选材明细）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var ctx = app.params.balance || {};
    var bsid = ctx.bsid || '';
    var balanceSelection = {}, brand = {}, creater = {};
    var idx = 0;
    if (!bsid) { $('#report').html('<p style="text-align:center;">缺少结算单信息</p>'); return; }
    app.post(api.balance.queryBalanceSelectionByBsid, { 'balanceSelection.bsid': bsid }, function (res) {
        balanceSelection = res.balanceSelection || {}; brand = balanceSelection.brand || {}; creater = balanceSelection.creater || {};
        loadPage(1);
    });

    function loadPage(page) {
        app.post(api.balance.pageBalanceSelectionItem, { 'paging.page': page, 'paging.rows': 50, 'balanceSelection.bsid': bsid }, function (res) {
            var data = (res.paging && res.paging.data) || [];
            if (page == 1) renderHeader();
            $.each(data, function (i, v) { renderLine(v); });
            if (page < (res.paging && res.paging.totalPage || 1)) loadPage(page + 1);
            else renderFooter();
        });
    }

    function renderHeader() {
        var h = '<center><table style="width:90%;border-collapse:collapse;" border="1" cellpadding="0" cellspacing="0">'
            + '<caption style="line-height:50px;font-size:20px;font-weight:bold;">供应商对账单<\/caption>'
            + '<tr><td colspan="7" style="text-align:left;font-size:12px;">供应商名称: ' + (brand.name || '') + '<\/td><td colspan="7" style="text-align:left;font-size:12px;">负责对账员: ' + (creater.userName || '') + '<\/td><td colspan="7" style="text-align:left;font-size:12px;">单号: ' + (balanceSelection.name || '') + '<\/td><\/tr>'
            + '<tr style="text-align:center;font-weight:bold;font-size:11px;"><td>品牌<\/td><td>订单编号<\/td><td>地址<\/td><td>户型<\/td><td>功能区<\/td><td>品类<\/td><td>一级类别<\/td><td>二级类别<\/td><td>三级类别<\/td><td>型号<\/td><td>单位<\/td><td>数量<\/td><td>单价<\/td><td>结算值<\/td><td>合计金额<\/td><td>备注<\/td><td>面积<\/td><\/tr>';
        $('#report').html(h);
    }
    function renderLine(v) {
        var si = v.selectionItem || {}; var g = si.goods || {}; var d = si.decoration || {}; var h = d.house || {};
        idx++;
        var addr = (h.village ? h.village.name : '') + ' ' + (h.houseNumber || '');
        var num = parseFloat(si.num || 0), refnum = parseFloat(si.refnum || 0), postprice = parseFloat(si.postprice || 0);
        var utility = app.utils.changeThrDecimal(app.utils.accSub(num, refnum));
        var total = app.utils.changeThrDecimal(app.utils.accMul(utility, postprice));
        var row = '<tr style="text-align:center;font-size:10px;"><td>' + (g.brand || '') + '<\/td><td>' + (d.orderId || '') + '<\/td><td>' + addr + '<\/td><td>' + (h.houseType || '') + '<\/td><td>' + (si.areaName || '') + '<\/td><td>' + (g.category || '') + '<\/td><td>' + (g.onekind && g.onekind.name || '') + '<\/td><td>' + (g.twokind && g.twokind.name || '') + '<\/td><td>' + (g.thrkind && g.thrkind.name || '') + '<\/td><td>' + (g.name || '') + '<\/td><td>' + (g.measurementUnit || '') + '<\/td><td>' + utility + '<\/td><td>' + app.formatMoney(si.postprice) + '<\/td><td>' + app.formatMoney(si.postprice) + '<\/td><td>' + total + '<\/td><td>' + (si.comment || '') + '<\/td><td>' + (h.innerArea || '') + '<\/td><\/tr>';
        $('#report').append(row);
    }
    function renderFooter() { $('#report').append('<\/table><\/center>'); }

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
