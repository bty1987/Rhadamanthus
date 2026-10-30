/** app/js/building/buildingHouse4query.js —— 房源查询（只读列表）*/
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    // 状态徽章（提取为函数，避免内联 HTML 字符串中 </ 导致解析器歧义）
    function statusBadge(d) {
        var cls = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray';
        var txt = d.status == 0 ? '在售' : '已停';
        return '<span class="layui-badge ' + cls + '">' + txt + '<\/span>';
    }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '编号', width: 120 },
                { field: 'house', title: '楼盘', minWidth: 140, templet: function (d) { return d.house ? d.house.name : ''; } },
                { field: 'type', title: '类型', width: 90 },
                { field: 'discussType', title: '议价', width: 90 },
                { field: 'decorateDegree', title: '装修', width: 90 },
                { field: 'rentType', title: '租赁', width: 90 },
                { field: 'totalPrice', title: '总价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.totalPrice); } },
                { field: 'status', title: '状态', width: 90, templet: statusBadge }
                ]] });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.building.pageBuildingHouse, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
});
}); // end app.ready
