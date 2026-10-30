/** app/js/payment/activityPaymentCount.js —— 活动款统计
 *  countActivityPayment 返回 counts=[[name,amount],...]，按金额倒序展示，末行汇总。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var apiObj = api.payment.countActivityPayment;
    app.post(apiObj, {}, function (res) {
        var counts = (res.counts || []).slice().sort(function (a, b) { return (b[1] || 0) - (a[1] || 0); });
        var rows = []; var total = 0;
        counts.forEach(function (c, i) { rows.push({ rank: i + 1, name: c[0], amount: c[1] }); total = app.utils.accAdd(total, parseFloat(c[1]) || 0); });
        rows.push({ rank: '', name: '合计', amount: total });
        table.render({ elem: '#resultTable', data: rows, page: false, limit: 1000, even: true,
            cols: [[ { field: 'rank', title: '排名', width: 100 }, { field: 'name', title: '活动' }, { field: 'amount', title: '金额', width: 180, templet: function (d) { return app.formatMoney(d.amount); } } ]] });
    });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
