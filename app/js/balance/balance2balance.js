/** app/js/balance/balance2balance.js —— 结算（弹窗子页）
 * 上下文：app.params.balance.{bid,uid,surplus}。按归属人查询账户，多选+填额→balanceBalance。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var ctx = app.params.balance || {};
    var bid = ctx.bid || '', uid = ctx.uid || '', surplus = parseFloat(ctx.surplus || 0);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { type: 'checkbox', width: 50 },
            { field: 'name', title: '账户名', width: 160 },
            { field: 'belonger', title: '归属人', width: 100, templet: function (d) { return (d.belonger && d.belonger.currentName) || '-'; } },
            { field: 'creater', title: '创建人', width: 100, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'referMoney', title: '应付额', width: 110, templet: function (d) { return app.formatMoney(d.referMoney); } },
            { field: 'realMoney', title: '实付额', width: 110, templet: function (d) { return app.formatMoney(d.realMoney); } },
            { field: 'surplus', title: '余额', width: 110, templet: function (d) { return app.formatMoney(d.surplus); } },
            { field: 'money', title: '操作额', width: 160, templet: function (d) { return '<input type="number" step="0.01" class="layui-input app-row-money" data-baid="' + d.baid + '" style="width:130px;">'; } } ]] });

    app.post(api.balance.queryBalanceAccount, { 'balanceAccount.belonger.uid': uid }, function (res) {
        table.reload('resultTable', { data: res.balanceAccountes || [] });
    });

    function doConfirm() {
        var checks = table.checkStatus('resultTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请选择账户'); return; }
        var opt = { 'balance.bid': bid }, total = 0, valid = true;
        $.each(checks, function (i, v) {
            var $inp = $('.app-row-money[data-baid="' + v.baid + '"]');
            var money = $.trim($inp.val());
            if (!money) { app.showAlert(app.warning, '请输入操作额'); $inp.focus(); valid = false; return false; }
            total = app.utils.accAdd(total, Number(money));
            opt['balanceAccountes[' + i + '].money'] = money;
            opt['balanceAccountes[' + i + '].baid'] = v.baid;
        });
        if (!valid) return;
        if (surplus > 0 && total > surplus) { app.showAlert(app.warning, '余额不足'); return; }
        if (surplus < 0 && total < surplus) { app.showAlert(app.warning, '余额不足'); return; }
        if (surplus == 0) { app.showAlert(app.warning, '余额不足'); return; }
        app.post(api.balance.balanceBalance, opt, function () { app.showAlert(app.success, '操作成功'); app.closePopup(); });
    }

    $('#btnConfirm').on('click', doConfirm);
    $('#btnCancel').on('click', function () { app.closePopup(); });
});
}); // end app.ready
