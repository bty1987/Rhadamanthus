/** app/js/manifest/accessories2out.js —— 辅料出货（单辅料单，逐行选颜色/规格/仓库 → addManifestForAS）
 *  对齐旧 WebContent/js/manifest/accessories2out.js。
 *  注：旧版 item 自带 colors/formats 选项，新版用可编辑列填 cid/fid/shid（无动态 select）。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var aid = getQueryParam('aid');
    if (!aid) { app.showAlert(app.warning, '缺少 aid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '辅料出货' }]);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
            { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'goods', title: '单位', width: 80, templet: function (d) { return d.goods ? d.goods.measurementUnit : ''; } },
            { field: 'num', title: '数量', width: 90, align: 'right' },
            { field: 'selling', title: '售价', width: 100, align: 'right' },
            { field: 'colorCid', title: '颜色cid', width: 110, edit: 'text' },
            { field: 'formatFid', title: '规格fid', width: 110, edit: 'text' },
            { field: 'shid', title: '仓库shid', width: 110, edit: 'text' }
            ]] });

    app.post(api.inventory.queryAccessoriesItemByAid, { 'accessoriesItem.aid': aid }, function (res) {
        var items = res.accessoriesItems || [];
        for (var i = 0; i < items.length; i++) { items[i].colorCid = items[i].color ? items[i].color.cid : ''; items[i].formatFid = items[i].format ? items[i].format.fid : ''; items[i].shid = ''; }
        table.reload('resultTable', { data: items });
    });

    $('#btnOut').on('click', function () {
        var rows = table.cache.resultTable || [];
        if (!rows.length) { app.showAlert(app.warning, '辅料项不存在'); return; }
        var opt = { 'accessories[0].aid': aid };
        for (var i = 0; i < rows.length; i++) {
            opt['accessoriesItems[' + i + '].aiid'] = rows[i].aiid;
            opt['accessoriesItems[' + i + '].goods.gid'] = rows[i].goods ? rows[i].goods.gid : '';
            opt['accessoriesItems[' + i + '].color.cid'] = rows[i].colorCid;
            opt['accessoriesItems[' + i + '].format.fid'] = rows[i].formatFid;
            opt['accessoriesItems[' + i + '].storehouse.shid'] = rows[i].shid;
            opt['accessoriesItems[' + i + '].outprice'] = rows[i].selling;
            opt['accessoriesItems[' + i + '].num'] = rows[i].num;
        }
        app.post(api.inventory.addManifestForAS, opt, function () { app.showAlert(app.success, '操作成功'); app.switchPage('accessories.html'); });
    });
    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
