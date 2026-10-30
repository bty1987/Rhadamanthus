/** app/js/manifest/goods2ms.js —— 商品拆分/合并
 *  对齐旧 WebContent/js/manifest/goods2ms.js。
 *  URL: ?action=split|merge&gss=<json>（gss 由 goodsStorehouseStock 页传入，含 goods/color/format/storehouse/num）。
 *  套餐子项列表来自 api.data.queryPackage（套餐数据 API，未迁入时仅显示当前商品行）。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var action = getQueryParam('action') || 'split';
    var gssStr = getQueryParam('gss');
    var gss = gssStr ? JSON.parse(decodeURIComponent(gssStr)) : null;
    if (!gss || !gss.goods) { app.showAlert(app.warning, '缺少库存参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: action == 'split' ? '拆分' : '合并' }]);

    var title = action == 'split' ? '拆分' : '合并';
    function renderTable(data) {
        table.render({ elem: '#resultTable', data: data, page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'goods', title: '商品名称', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : (d.name || ''); } },
                { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : (d.no || ''); } },
                { field: 'goods', title: '条形码', width: 120, templet: function (d) { return d.goods ? d.goods.barcode : (d.barcode || ''); } },
                { field: 'color', title: '颜色', width: 90, templet: function (d) { return d.color ? d.color.name : ''; } },
                { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.info : ''; } },
                { field: 'goods', title: '单位', width: 80, templet: function (d) { return d.goods ? d.goods.measurementUnit : ''; } },
                { field: 'num', title: '数量', width: 90, align: 'right', templet: function (d) { return d.num != null ? d.num : ''; } },
                { field: 'storehouse', title: '所在仓库', width: 110, templet: function (d) { return d.storehouse ? d.storehouse.name : ''; } }
                ]] });
    }
    renderTable([gss]);

    // 若是套餐，加载子项（依赖 api.data.queryPackage，未迁入时跳过）
    if (api.data && api.data.queryPackage) {
        app.post(api.data.queryPackage, { 'goodsPackage.pid': gss.goods.gid }, function (res) {
            var list = res.goodsPackages || [];
            if (list.length) { renderTable(list); }
        });
    }

    $('#btnConfirm').on('click', function () {
        var num = $('#inputNum').val();
        if (!$.trim(num)) { app.showAlert(app.warning, '请填写数量'); return; }
        var opt = { 'goodsStorehouseStock.goods.gid': gss.goods.gid, 'goodsStorehouseStock.color.cid': gss.color.cid, 'goodsStorehouseStock.format.fid': gss.format.fid, 'goodsStorehouseStock.storehouse.shid': gss.storehouse.shid, 'goodsStorehouseStock.num': num };
        var def = action == 'split' ? api.inventory.splitPackage : api.inventory.mergePackage;
        app.post(def, opt, function () { app.showAlert(app.success, '操作成功'); history.back(); });
    });
    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
