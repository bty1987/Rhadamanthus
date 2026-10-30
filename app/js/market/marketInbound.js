/** app/js/market/marketInbound.js —— 营销入客（查询 + 重试）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '客户名', minWidth: 140 },
                { field: 'campaignId', title: '活动ID', width: 90 },
                { field: 'channelId', title: '渠道ID', width: 90 },
                { field: 'csid', title: '归属', width: 90 },
                { field: 'createTime', title: '进入时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
                { field: 'status', title: '状态', width: 100, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">成功</span>' : '<span class="layui-badge">失败</span>'; } },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'retry') doRetry(obj.data.miid); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.market.pageMarketInbound, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function doRetry(miid) { app.showConfirm('确认重试该入客记录？', function () { app.post(api.market.retryMarketInbound, { 'marketInbound.miid': miid }, function () { app.showAlert(app.success, '已重试'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
});
}); // end app.ready
