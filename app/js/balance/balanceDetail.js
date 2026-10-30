/** app/js/balance/balanceDetail.js —— 结算明细（弹窗子页）
 * 上下文：app.params.balance.bid */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var bid = (app.params.balance && app.params.balance.bid) || '';

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'account', title: '账户名', width: 160, templet: function (d) { return (d.account && d.account.name) || '-'; } },
            { field: 'belonger', title: '归属人', width: 110, templet: function (d) { return (d.account && d.account.belonger && d.account.belonger.currentName) || '-'; } },
            { field: 'creater', title: '创建人', width: 110, templet: function (d) { return (d.account && d.account.creater && d.account.creater.currentName) || '-'; } },
            { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return (d.account && d.account.createTime) || '-'; } },
            { field: 'operater', title: '操作人', width: 110, templet: function (d) { return (d.operater && d.operater.currentName) || '-'; } },
            { field: 'operateTime', title: '操作时间', width: 170 },
            { field: 'money', title: '金额', width: 120, templet: function (d) { return app.formatMoney(d.money); } } ]] });

    if (!bid) { app.showAlert(app.warning, '缺少结算单 ID'); return; }
    app.post(api.balance.queryBalanceDetailForBalance, { 'balanceDetail.balance.bid': bid }, function (res) {
        table.reload('resultTable', { data: res.balanceDetails || [] });
    });
});
}); // end app.ready
