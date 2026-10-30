/** app/js/balance/balanceSelectionItem.js —— 结算选材明细（弹窗子页）
 * 上下文：app.params.balance.{bsid,balance}。balance.status=0 初始时允许解绑/挂起。
 * selectionItem.type 中 2/4/14 表示退货/冲减类，需对 num/utility/cost 取负显示。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.balance || {};
    var bsid = ctx.bsid || '', balance = ctx.balance || {};
    var state = { page: 1, rows: 10, total: 0 };
    var STATUS_INIT = 0;
    var NEG_TYPES = [2, 4, 14];
    var SI_TYPE = { 0: '初始', 1: '预算', 2: '退货', 3: '结算', 4: '冲减', 14: '调整' };
    var SI_STATUS = { 0: '初始', 1: '已拆', 2: '已结', 3: '已退' };
    initTable(); query(1);

    function neg(v) { return NEG_TYPES.indexOf(v.selectionItem.type) != -1; }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'goods', title: '商品编号', width: 130, templet: function (d) { return (d.selectionItem && d.selectionItem.goods && d.selectionItem.goods.no) || '-'; } },
                { field: 'brand', title: '品牌', width: 110, templet: function (d) { return (d.selectionItem && d.selectionItem.goods && d.selectionItem.goods.brand) || '-'; } },
                { field: 'category', title: '品类', width: 100, templet: function (d) { return (d.selectionItem && d.selectionItem.goods && d.selectionItem.goods.category) || '-'; } },
                { field: 'areaName', title: '功能区', width: 100, templet: function (d) { return (d.selectionItem && d.selectionItem.areaName) || '-'; } },
                { field: 'type', title: '类型', width: 80, templet: function (d) { return SI_TYPE[(d.selectionItem && d.selectionItem.type) != null ? d.selectionItem.type : -1] || '-'; } },
                { field: 'status', title: '状态', width: 80, templet: function (d) { return SI_STATUS[(d.selectionItem && d.selectionItem.status) != null ? d.selectionItem.status : -1] || '-'; } },
                { field: 'postprice', title: '结算价', width: 100, templet: function (d) { return app.formatMoney(d.selectionItem && d.selectionItem.postprice); } },
                { field: 'preprice', title: '预算金额', width: 100, templet: function (d) { return app.formatMoney(d.selectionItem && d.selectionItem.preprice); } },
                { field: 'num', title: '拆单量', width: 90, templet: function (d) { var n = d.selectionItem.num; return neg(d) ? -n : n; } },
                { field: 'refnum', title: '退货量', width: 90, templet: function (d) { return d.selectionItem.refnum; } },
                { field: 'initNum', title: '预算量', width: 90, templet: function (d) { return d.selectionItem.initNum; } },
                { field: 'utility', title: '实用量', width: 90, templet: function (d) { var u = app.utils.changeThrDecimal(app.utils.accSub(parseFloat(d.selectionItem.num), parseFloat(d.selectionItem.refnum))); return neg(d) ? -u : u; } },
                { field: 'cost', title: '成本', width: 100, templet: function (d) { var c = app.utils.changeThrDecimal(app.utils.accMul(app.utils.accSub(parseFloat(d.selectionItem.num), parseFloat(d.selectionItem.refnum)), parseFloat(d.selectionItem.postprice))); return neg(d) ? -c : c; } },
                { field: 'orderId', title: '装修单号', width: 130, templet: function (d) { return (d.selectionItem && d.selectionItem.decoration && d.selectionItem.decoration.orderId) || '-'; } },
                { field: 'village', title: '楼盘', width: 130, templet: function (d) { return (d.selectionItem && d.selectionItem.decoration && d.selectionItem.decoration.house && d.selectionItem.decoration.decoration.house.village && d.selectionItem.decoration.house.village.name) || '-'; } },
                { field: 'balancer', title: '结算人', width: 100, templet: function (d) { return (d.selectionItem && d.selectionItem.balancer && d.selectionItem.balancer.currentName) || '-'; } },
                { field: 'createTime', title: '拆单时间', width: 170, templet: function (d) { return (d.selectionItem && d.selectionItem.createTime) || '-'; } },
                { field: 'balanceTime', title: '结算时间', width: 170, templet: function (d) { return (d.selectionItem && d.selectionItem.balanceTime) || '-'; } },
                { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'unbind') doUnbindRow(v);
            else if (ev === 'pending') doPendingRow(v);
        });
    }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.balance.pageBalanceSelectionItem, { 'balanceSelection.bsid': bsid, 'paging.page': state.page, 'paging.rows': state.rows }, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function doUnbindRow(v) {
        if (balance.status != STATUS_INIT) return;
        app.showConfirm('确定解除绑定？', function () {
            var num = parseFloat(v.selectionItem.num || 0), refnum = parseFloat(v.selectionItem.refnum || 0), postprice = parseFloat(v.selectionItem.postprice || 0);
            var cost = app.utils.accSub(balance.cost, app.utils.accMul(app.utils.accSub(num, refnum), postprice));
            var payment = app.utils.accSub(balance.payment, app.utils.accMul(app.utils.accSub(num, refnum), postprice));
            app.post(api.balance.unbindBalanceSelection, {
                'balanceSelection.bsid': bsid,
                'balanceSelection.income': balance.income,
                'balanceSelection.cost': cost,
                'balanceSelection.payment': payment,
                'balanceSelection.profit': balance.profit,
                'balanceSelectionItems[0].bsiid': v.bsiid
            }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
    function doPendingRow(v) {
        if (balance.status != STATUS_INIT) return;
        app.showConfirm('确定挂起？', function () {
            var num = parseFloat(v.selectionItem.num || 0), refnum = parseFloat(v.selectionItem.refnum || 0), postprice = parseFloat(v.selectionItem.postprice || 0);
            var cost = app.utils.accSub(balance.cost, app.utils.accMul(app.utils.accSub(num, refnum), postprice));
            var payment = app.utils.accSub(balance.payment, app.utils.accMul(app.utils.accSub(num, refnum), postprice));
            app.post(api.balance.pendingBalanceSelectionItem, {
                'balanceSelection.bsid': bsid,
                'balanceSelection.income': balance.income,
                'balanceSelection.cost': cost,
                'balanceSelection.payment': payment,
                'balanceSelection.profit': balance.profit,
                'balanceSelectionItem.bsiid': v.bsiid
            }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
    function doUnbindBatch() {
        if (balance.status != STATUS_INIT) { app.showAlert(app.warning, '当前状态不可解绑'); return; }
        var checks = table.checkStatus('resultTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请选择需要解绑数据'); return; }
        var opt = { 'balanceSelection.bsid': bsid, 'balanceSelection.income': balance.income, 'balanceSelection.cost': 0, 'balanceSelection.payment': 0, 'balanceSelection.profit': balance.profit };
        $.each(checks, function (i, v) { opt['balanceSelectionItems[' + i + '].bsiid'] = v.bsiid; });
        app.post(api.balance.unbindBalanceSelection, opt, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }
    function doCheckAll() { $('.layui-table-tool [lay-filter="layTableAllChoose"]').click(); }
    function doExport(mode) {
        if (state.total == 0) { app.showAlert(app.warning, '请通过条件进行查询'); return; }
        if (state.total > 2000) { app.showAlert(app.warning, '查询结果大于阀值，导出失败'); return; }
        app.post(api.balance.pageBalanceSelectionItem, { 'balanceSelection.bsid': bsid, 'paging.page': 1, 'paging.rows': 2000, 'paging.noPage': 1 }, function (res) {
            var rows = (res.paging && res.paging.data) || [];
            $.each(rows, function (i, v) {
                var si = v.selectionItem;
                v.num = neg(v) ? -si.num : si.num;
                var utility = app.utils.changeThrDecimal(app.utils.accSub(parseFloat(si.num), parseFloat(si.refnum)));
                v.utility = neg(v) ? -utility : utility;
                var cost = app.utils.changeThrDecimal(app.utils.accMul(app.utils.accSub(parseFloat(si.num), parseFloat(si.refnum)), parseFloat(si.postprice)));
                v.price = neg(v) ? -cost : cost;
            });
            app.exporter && app.exporter(rows, mode == 1 ? '结算选材明细-业务' : '结算选材明细-财务');
        });
    }

    $('#btnCheckAll').on('click', doCheckAll);
    $('#btnUnbind').on('click', doUnbindBatch);
    $('#btnExport').on('click', function () { doExport(0); });
    $('#btnExport1').on('click', function () { doExport(1); });
});
}); // end app.ready
