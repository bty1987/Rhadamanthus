/** app/js/store/showMaterial.js —— 材料展示（分类筛选 + 商品网格）
 * 网格布局展示商品，按品类筛选 */
app.ready(function () {
layui.use(['laypage', 'form', 'jquery'], function () {
    var laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 20, total: 0 };

    // 加载品类下拉
    app.post(api.store.pageMcategory, { 'paging.page': 1, 'paging.rows': 100 }, function (res) {
        var cats = (res.paging && res.paging.data) || [];
        var html = '<option value="">全部品类</option>';
        $.each(cats, function (i, c) { html += '<option value="' + c.cid + '">' + c.name + '</option>'; });
        $('#categorySel').html(html);
        form.render('select');
    });

    query(1);

    function buildFilters() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; });
        return p;
    }
    function query(page) {
        state.page = page || 1;
        app.post(api.store.pageMgoods, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            renderGrid(pg.data || []);
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }
    function renderGrid(list) {
        if (!list.length) { $('#goodsGrid').html('<div style="width:100%;text-align:center;color:#999;padding:40px;">暂无商品</div>'); return; }
        var html = '';
        $.each(list, function (i, g) {
            var img = g.defaultImg || g.img || '';
            var brand = g.mbrand ? g.mbrand.name : '';
            html += '<div class="app-goods-card">';
            html += '  <img src="' + (img || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg" width="180" height="140"><rect fill="%23f5f5f5" width="180" height="140"/></svg>') + '" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg" width="180" height="140"><rect fill="%23f5f5f5" width="180" height="140"/></svg>\'">';
            html += '  <div class="info">';
            html += '    <div class="name">' + (g.name || '') + '</div>';
            html += '    <div class="brand">' + brand + '</div>';
            html += '    <div class="price">¥' + app.formatMoney(g.price) + '</div>';
            html += '  </div>';
            html += '</div>';
        });
        $('#goodsGrid').html(html);
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, layout: ['count', 'prev', 'page', 'next', 'skip'], jump: function (obj, first) { if (!first) query(obj.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
});
}); // end app.ready
