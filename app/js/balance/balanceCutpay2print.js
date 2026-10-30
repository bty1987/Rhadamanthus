/** app/js/balance/balanceCutpay2print.js —— 扣款明细确认表打印
 * 上下文：app.params.balance.{bid,surplus} */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var balance = app.params.balance || {};
    var bid = balance.bid || '';
    var total = 0;
    if (!bid) { $('#report').html('<p style="text-align:center;">缺少结算单信息</p>'); return; }
    app.post(api.balance.queryBalanceCutpay, { 'balanceCutpay.balance.bid': bid }, function (res) {
        render(res.balanceCutpays || []);
    });

    function render(rows) {
        var h = '<center><table style="width:90%;border-collapse:collapse;" border="1" cellpadding="0" cellspacing="0">'
            + '<caption style="line-height:50px;font-size:20px;font-weight:bold;">供应商费用扣款明细确认表<\/caption>'
            + '<tr><td colspan="5" style="text-align:left;font-size:12px;">结算单金额：' + app.formatMoney(balance.surplus) + '<\/td><\/tr>'
            + '<tr style="text-align:center;font-weight:bold;"><td>名称<\/td><td>金额<\/td><td>已扣<\/td><td>余额<\/td><td>本期扣款额<\/td><\/tr>';
        $.each(rows, function (i, v) {
            if (!(v.dccount && v.dccount.bdid)) return;
            var cut = parseFloat(v.dccount.cutpay || 0), sur = parseFloat(v.dccount.surplus || 0), money = parseFloat(v.money || 0);
            var paid = app.utils.accSub(cut, sur);
            total = app.utils.accAdd(total, money);
            h += '<tr style="text-align:center;"><td>' + (v.dccount.name || '') + '<\/td>'
                + '<td>' + app.formatMoney(cut) + '<\/td>'
                + '<td>' + app.formatMoney(paid) + '<\/td>'
                + '<td>' + app.formatMoney(sur) + '<\/td>'
                + '<td>' + app.formatMoney(money) + '<\/td><\/tr>';
        });
        h += '<tr style="text-align:center;font-weight:bold;"><td colspan="4">合计扣款：<\/td><td>' + app.formatMoney(total) + '<\/td><\/tr>';
        h += '<tr><td colspan="5" style="text-align:right;font-size:12px;">厂商数据核对无误盖章(签字)<\/td><\/tr>';
        h += '<tr><td colspan="5" style="text-align:center;">______年______月______日<\/td><\/tr>';
        h += '<\/table><\/center>';
        $('#report').html(h);
    }

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
