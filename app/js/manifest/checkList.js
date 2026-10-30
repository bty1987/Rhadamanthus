/** app/js/manifest/checkList.js —— 盘点记录（只读列表）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'createTime', title: '时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
                { field: 'creater', title: '操作人', width: 100 },
                { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
                { field: 'storehouse', title: '仓库', width: 120, templet: function (d) { return d.storehouse ? d.storehouse.name : ''; } },
                { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.format : ''; } },
                { field: 'color', title: '颜色', width: 100, templet: function (d) { return d.color ? d.color.color : ''; } },
                { field: 'num', title: '数量', width: 90, align: 'right' },
                { field: 'type', title: '类型', width: 80, templet: function (d) { return d.type == 0 ? '<span class="layui-badge layui-bg-green">盘盈</span>' : '<span class="layui-badge layui-bg-red">盘亏</span>'; } }
                ]] });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.inventory.pageCheckList, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
});
}); // end app.ready
