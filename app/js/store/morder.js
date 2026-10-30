/** app/js/store/morder.js —— 商城订单（列表 + 状态切换 + 查看明细）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var STATUS_MAP = { 0: '待确认', 1: '已确认', 2: '已取消', 3: '已完成' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'oid', title: '订单号', width: 140 },
                { field: 'address', title: '收货地址', minWidth: 200 },
                { field: 'status', title: '状态', width: 100, templet: function (d) { return '<span class="layui-badge layui-bg-' + (d.status == 0 ? 'orange' : d.status == 1 ? 'green' : d.status == 3 ? 'blue' : 'gray') + '">' + (STATUS_MAP[d.status] || '') + '</span>'; } },
                { title: '操作', width: 230, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var d = obj.data;
            if (obj.event === 'items') showItems(d.oid);
            else if (obj.event === 'confirm') updateStatus(d.oid, 1);
            else if (obj.event === 'cancel') updateStatus(d.oid, 2);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'eq'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.store.pageMorder, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function updateStatus(oid, status) { app.showConfirm('确认操作？', function () { app.post(api.store.updateMorderForStatus, { 'morder.oid': oid, 'morder.status': status }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }

    // 订单明细弹窗
    function showItems(oid) {
        app.post(api.store.queryMorderItemByOid, { 'morderItem.oid': oid }, function (res) {
            var items = res.morderItems || [];
            var html = '<div style="padding:16px;"><table class="layui-table"><thead><tr><th>商品</th><th>规格/颜色</th><th>数量</th><th>单价</th><th>小计</th></tr></thead><tbody>';
            if (!items.length) html += '<tr><td colspan="5" style="text-align:center;color:#999;">无明细</td></tr>';
            $.each(items, function (i, it) {
                var mp = it.mprice || {}, mg = mp.mgoods || {};
                html += '<tr><td>' + (mg.name || '') + '</td><td>' + (mp.name || '') + '</td><td>' + (it.num || 0) + '</td><td>¥' + app.formatMoney(mp.price) + '</td><td>¥' + app.formatMoney(app.utils.accMul(mp.price, it.num)) + '</td></tr>';
            });
            html += '</tbody></table></div>';
            layer.open({ type: 1, title: '订单明细 #' + oid, content: html, area: ['640px', '480px'] });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
});
}); // end app.ready
