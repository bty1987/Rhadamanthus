/** app/js/manifest/goodsStorehouseStock.js —— 商品库存（列表 + 盘盈/盘亏/拆分/合并 + 添加）
 *  对齐旧 WebContent/js/manifest/goodsStorehouseStock.js。
 *  拆分/合并跳转 goods2ms.html?action=split|merge。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, cur: null, stockIdx: null, addIdx: null, stockType: null };

    initTable(); query(1);
    // 加载仓库下拉
    app.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var list = res.storehouses || [];
        var html = '';
        for (var i = 0; i < list.length; i++) { if (list[i].status == 0) { html += '<option value="' + list[i].shid + '">' + list[i].name + '</option>'; } }
        $('#addShid').html(html);
        form.render('select');
    });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'storehouse', title: '仓库', width: 120, templet: function (d) { return d.storehouse ? d.storehouse.name : ''; } },
                { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
                { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
                { field: 'goods', title: '条形码', width: 120, templet: function (d) { return d.goods ? d.goods.barcode : ''; } },
                { field: 'color', title: '颜色', width: 90, templet: function (d) { return d.color ? d.color.name : ''; } },
                { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.info : ''; } },
                { field: 'goods', title: '类型', width: 80, templet: function (d) { return d.goods ? (d.goods.type == 0 ? '商品' : '套餐') : ''; } },
                { field: 'num', title: '数量', width: 100, align: 'right' },
                { title: '操作', width: 340, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'plus' || e === 'lose') openStock(d, e == 'plus' ? 0 : 1);
            else if (e === 'split') app.switchPage('goods2ms.html?action=split&gss=' + gssEncode(d));
            else if (e === 'merge') app.switchPage('goods2ms.html?action=merge&gss=' + gssEncode(d));
        });
    }
    function gssEncode(d) {
        return encodeURIComponent(JSON.stringify({ goods: d.goods, color: d.color, format: d.format, storehouse: d.storehouse, num: d.num }));
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.inventory.pageGoodsStorehouseStock, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openStock(d, type) {
        app.clearValidator(); $('#stockForm')[0].reset();
        state.cur = d; state.stockType = type;
        $('#stockForm [name="newNum"]').val(d.num);
        stockIdx = layer.open({ type: 1, title: type == 0 ? '盘盈' : '盘亏', content: $('#stockBox'), area: ['440px', 'auto'] });
    }
    $('#btnStockSave').on('click', function () {
        if (app.validate('stockForm')) return;
        var d = state.cur;
        var newNum = Math.abs(parseFloat($('#stockForm [name="newNum"]').val()));
        var opt = { 'goodsStorehouseStock.goods.gid': d.goods.gid, 'goodsStorehouseStock.storehouse.shid': d.storehouse.shid, 'goodsStorehouseStock.color.cid': d.color.cid, 'goodsStorehouseStock.format.fid': d.format.fid, 'goodsStorehouseStock.num': newNum };
        var def = state.stockType == 0 ? api.inventory.plusGoodsStorehouseStock : api.inventory.loseGoodsStorehouseStock;
        app.post(def, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(stockIdx); stockIdx = null; query(state.page); });
    });
    $('#btnStockCancel').on('click', function () { layer.close(stockIdx); stockIdx = null; });

    $('#btnAdd').on('click', function () {
        app.clearValidator(); $('#addStockForm')[0].reset(); form.render('select');
        addIdx = layer.open({ type: 1, title: '添加', content: $('#addStockBox'), area: ['480px', 'auto'] });
    });
    $('#btnAddStockSave').on('click', function () {
        if (app.validate('addStockForm')) return;
        app.post(api.inventory.makeGoodsStorehouseStock, { 'goodsStorehouseStock.goods.gid': $('#addStockForm [name="gid"]').val(), 'goodsStorehouseStock.color.cid': $('#addStockForm [name="cid"]').val(), 'goodsStorehouseStock.format.fid': $('#addStockForm [name="fid"]').val(), 'goodsStorehouseStock.storehouse.shid': $('#addStockForm [name="shid"]').val() }, function () { app.showAlert(app.success, '操作成功'); layer.close(addIdx); addIdx = null; query(state.page); });
    });
    $('#btnAddStockCancel').on('click', function () { layer.close(addIdx); addIdx = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    form.render();
});
}); // end app.ready
