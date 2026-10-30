/** app/js/manifest/manifestTemplateItem2add.js —— 添加商品到模板（多选确定）
 *  对齐旧 WebContent/js/manifest/manifestTemplateItem2add.js。 */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var mtid = getQueryParam('mtid');
    if (!mtid) { app.showAlert(app.warning, '缺少 mtid 参数'); return; }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox' },
            { field: 'no', title: '编号', width: 120 },
            { field: 'name', title: '商品名', minWidth: 160 },
            { field: 'barcode', title: '条形码', width: 130 },
            { field: 'category', title: '品类', width: 100 },
            { field: 'brand', title: '品牌', width: 100 },
            { field: 'measurementUnit', title: '单位', width: 80 },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return d.type == 0 ? '商品' : '套餐'; } },
            { field: 'pieceNum', title: '件数', width: 80, align: 'right' },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用<\/span>' : '<span class="layui-badge layui-bg-gray">禁用<\/span>'; } }
            ]] });
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageGoodsForAdvance, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    query(1);

    $('#btnConfirm').on('click', function () {
        var rows = table.checkStatus('resultTable').data || [];
        if (!rows.length) { app.showAlert(app.warning, '请选择商品'); return; }
        var opt = { 'manifestTemplate.mtid': mtid };
        for (var i = 0; i < rows.length; i++) { opt['miids[' + i + ']'] = rows[i].gid; }
        app.post(api.inventory.addManifestTemplateItem, opt, function () { app.showAlert(app.success, '操作成功'); app.switchPage('manifestTemplateItem.html?mtid=' + mtid); });
    });
    $('#btnCancel').on('click', function () { app.switchPage('manifestTemplateItem.html?mtid=' + mtid); });
    $('#btnSearch').on('click', function () { query(1); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
