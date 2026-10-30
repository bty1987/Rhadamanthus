/** app/js/manifest/accessories2batchout.js —— 批量出货（多辅料单，逐行选颜色/规格/仓库 → addManifestForAS）
 *  对齐旧 WebContent/js/manifest/accessories2batchout.js。
 *  URL: ?aids=aid1,aid2,... → 调 queryAccessoriesItemByAids 传 aids[0]/aids[1]/... */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var aidsStr = getQueryParam('aids');
    if (!aidsStr) { app.showAlert(app.warning, '缺少 aids 参数'); return; }
    var aids = aidsStr.split(',');
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '批量出货' }]);

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

    var qopt = {};
    for (var i = 0; i < aids.length; i++) { qopt['aids[' + i + ']'] = aids[i]; }
    app.post(api.inventory.queryAccessoriesItemByAids, qopt, function (res) {
        var items = res.accessoriesItems || [];
        for (var j = 0; j < items.length; j++) { items[j].colorCid = items[j].color ? items[j].color.cid : ''; items[j].formatFid = items[j].format ? items[j].format.fid : ''; items[j].shid = ''; }
        table.reload('resultTable', { data: items });
    });

    $('#btnOut').on('click', function () {
        var rows = table.cache.resultTable || [];
        if (!rows.length) { app.showAlert(app.warning, '辅料项不存在'); return; }
        var opt = $.extend({}, qopt);
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
