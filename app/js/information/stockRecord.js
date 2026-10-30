/** app/js/information/stockRecord.js —— 奖品记录（按库存ID查询分页记录）*/
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, asid: null };

    // 从父窗口读取 asid
    try {
        var p = (parent && parent.params && parent.params.infomation) ? parent.params.infomation : (window.params ? window.params.infomation : null);
        if (p) state.asid = p.asid;
    } catch (e) {}

    var TYPE_MAP = { 0: '入库', 1: '出库', 2: '盘点' };
    var SUBTYPE_MAP = { 1: '销售出库', 2: '采购入库', 3: '其他出库', 4: '其他入库' };

    initTable(); if (state.asid) query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'awardStock', title: '奖品', minWidth: 160, templet: function (d) { return d.awardStock ? d.awardStock.name : ''; } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'subtype', title: '子类', width: 110, templet: function (d) { return SUBTYPE_MAP[d.subtype] || '---'; } },
                { field: 'num', title: '数量', width: 90, align: 'right' },
                { field: 'totalPrice', title: '总价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.totalPrice); } },
                { field: 'unitPrice', title: '单价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.unitPrice); } },
                { field: 'creater', title: '提交人', width: 110, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
                { field: 'operateTime', title: '时间', width: 160 },
                { field: 'content', title: '说明', minWidth: 200 } ]] });
    }
    function query(page) {
        state.page = page || 1;
        app.post(api.information.pageAwardRecord, { 'awardRecord.awardStock.asId': state.asid, 'paging.page': state.page, 'paging.rows': state.rows }, function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
});
}); // end app.ready
