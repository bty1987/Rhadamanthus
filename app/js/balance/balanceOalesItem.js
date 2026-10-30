/** app/js/balance/balanceOalesItem.js —— 结算外销明细（弹窗子页）
 * 上下文：app.params.balance.boid。列出此外销结算单下的所有外销单，可解绑。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var boid = (app.params.balance && app.params.balance.boid) || '';
    var state = { page: 1, rows: 10, total: 0 };
    var ATTTYPE = { 0: '奖励', 1: '扣款', 2: '其他' };
    var AWARDTYPE = { 0: '定额', 1: '比例' };
    var OALES_STATUS = { 0: '初始', 1: '推送', 2: '确认', 3: '复核', 4: '完成', 5: '完结', 6: '废单' };
    var OALES_TYPE = { 0: '销售', 1: '退货' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'orderId', title: '装修单号', width: 140, templet: function (d) { return (d.oales && d.oales.decoration && d.oales.decoration.orderId) || '-'; } },
                { field: 'village', title: '楼盘', width: 130, templet: function (d) { return (d.oales && d.oales.decoration && d.oales.decoration.house && d.oales.decoration.house.village && d.oales.decoration.house.village.name) || '-'; } },
                { field: 'houseNumber', title: '楼号', width: 100, templet: function (d) { return (d.oales && d.oales.decoration && d.oales.decoration.house && d.oales.decoration.house.houseNumber) || '-'; } },
                { field: 'supplier', title: '厂商', width: 110, templet: function (d) { return (d.oales && d.oales.supplier && d.oales.supplier.currentName) || '-'; } },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return (d.oales && d.oales.creater && d.oales.creater.currentName) || '-'; } },
                { field: 'brand', title: '品牌', width: 110, templet: function (d) { return (d.oales && d.oales.brand) || '-'; } },
                { field: 'category', title: '品类', width: 100, templet: function (d) { return (d.oales && d.oales.category) || '-'; } },
                { field: 'atttype', title: '类型', width: 90, templet: function (d) { return ATTTYPE[(d.oales && d.oales.atttype) != null ? d.oales.atttype : -1] || '-'; } },
                { field: 'awardType', title: '奖励类型', width: 100, templet: function (d) { return AWARDTYPE[(d.oales && d.oales.awardType) != null ? d.oales.awardType : -1] || '-'; } },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.oales && d.oales.total); } },
                { field: 'award', title: '奖励', width: 100, templet: function (d) { return app.formatMoney(d.oales && d.oales.award); } },
                { field: 'profit', title: '利润', width: 110, templet: function (d) { return app.formatMoney(d.oales && d.oales.profit); } },
                { field: 'cost', title: '成本', width: 100, templet: function (d) { return app.formatMoney(d.oales && d.oales.cost); } },
                { field: 'threshold', title: '系数', width: 90, templet: function (d) { return d.oales && d.oales.threshold; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return OALES_STATUS[(d.oales && d.oales.status) != null ? d.oales.status : -1] || '-'; } },
                { field: 'type', title: '类型', width: 80, templet: function (d) { return OALES_TYPE[(d.oales && d.oales.type) != null ? d.oales.type : -1] || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return (d.oales && d.oales.createTime) || '-'; } },
                { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'unbind') doUnbind(v);
        });
    }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.balance.pageBalanceOalesItem, { 'balanceOales.boid': boid, 'paging.page': state.page, 'paging.rows': state.rows }, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function doUnbind(v) {
        app.showConfirm('确定解除绑定？', function () {
            app.post(api.balance.unbindBalanceOales, { 'balanceOales.boid': boid, 'balanceOalesItems[0].boiid': v.boiid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
});
}); // end app.ready
