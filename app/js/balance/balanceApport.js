/** app/js/balance/balanceApport.js —— 分摊明细（弹窗子页）
 * 上下文：app.params.balance.bid */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var bid = (app.params.balance && app.params.balance.bid) || '';
    var state = { editIndex: null };
    initTable(); load();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'creater', title: '创建人', width: 130, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'money', title: '金额', width: 120, templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'comment', title: '说明', minWidth: 200 } ]] });
    }
    function load() {
        if (!bid) { app.showAlert(app.warning, '缺少结算单 ID'); return; }
        app.post(api.balance.queryBalanceApportForBalance, { 'balanceApport.bid': bid }, function (res) {
            table.reload('resultTable', { data: res.balanceApports || [] });
        });
    }
    function openAdd() {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加分摊', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.balance.addBalanceApport, {
            'balanceApport.bid': bid,
            'balanceApport.money': $('#editForm [name="money"]').val(),
            'balanceApport.comment': $('#editForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; load(); });
    }

    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
