/** app/js/payment/walletran.js —— 钱包交易记录（弹窗子页）
 *  上下文：app.params.payment = { wid }。列出该钱包所有交易流水。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var ctx = app.params.payment || {};
    var TYPE = { 0: '充值', 1: '提现', 2: '消费', 3: '转账', 4: '退款' };
    var STATUS = { 0: '初始', 1: '成功', 2: '失败', 3: '审批中' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 1 ? 'layui-bg-green' : d.status == 2 ? 'layui-bg-red' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '编号', width: 160 }, { field: 'type', title: '类型', width: 90, templet: tpB }, { field: 'amount', title: '金额', width: 120, templet: function (d) { return app.formatMoney(d.amount); } }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'wallet.belonger.currentName', title: '操作钱包', width: 120, templet: function (d) { return d.wallet && d.wallet.belonger ? d.wallet.belonger.currentName : ''; } }, { field: 'tallet.belonger.currentName', title: '关联钱包', width: 120, templet: function (d) { return d.tallet && d.tallet.belonger ? d.tallet.belonger.currentName : '无'; } }, { field: 'comment', title: '备注', minWidth: 160 } ]] });
    if (!ctx.wid) { return; }
    app.post(api.payment.queryWalletran, { 'walletran.wallet.wid': ctx.wid }, function (res) { table.reload('resultTable', { data: res.walletrans || [] }); });
});
}); // end app.ready
