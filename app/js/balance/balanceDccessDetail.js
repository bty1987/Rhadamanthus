/** app/js/balance/balanceDccessDetail.js —— 扣款账户明细（弹窗子页）
 * 上下文：app.params.balance.bdid
 * 列出当前扣款账户下的所有扣款记录，可添加新扣款。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var bdid = (app.params.balance && app.params.balance.bdid) || '';
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    var TYPE_CUTPAY = 0;
    var TYPE = { 0: '扣款', 1: '抵扣' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', width: 160 },
                { field: 'operater', title: '操作人', width: 110, templet: function (d) { return (d.operater && d.operater.currentName) || '-'; } },
                { field: 'operateTime', title: '操作时间', width: 170 },
                { field: 'money', title: '金额', width: 120, templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
                { field: 'comment', title: '说明', minWidth: 140 } ]] });
    }
    function query(pg) {
        state.page = pg || 1;
        var param = { 'paging.page': state.page, 'paging.rows': state.rows, 'filters[0].field': 'dccessId', 'filters[0].data': bdid, 'filters[0].op': 'eq' };
        app.post(api.balance.pageBalanceCutpay, param, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openAdd() {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加扣款', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.balance.addBalanceCutpay, {
            'balanceCutpay.dccess.bdid': bdid,
            'balanceCutpay.name': $('#editForm [name="name"]').val(),
            'balanceCutpay.type': TYPE_CUTPAY,
            'balanceCutpay.money': $('#editForm [name="money"]').val(),
            'balanceCutpay.comment': $('#editForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }

    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
