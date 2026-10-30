/** app/js/manifest/purchase2in.js —— 采购入库（单采购单，勾选 + 填数量/仓库 → addManifestForPU）
 *  对齐旧 WebContent/js/manifest/purchase2in.js。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var pid = getQueryParam('pid');
    if (!pid) { app.showAlert(app.warning, '缺少 pid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '采购入库' }]);

    var storehouses = [];
    app.post(api.inventory.queryStorehouseForSelf, {}, function (res) { storehouses = res.storehouses || []; }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox' },
            { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
            { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'color', title: '颜色', width: 90, templet: function (d) { return d.color ? d.color.name : ''; } },
            { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.info : ''; } },
            { field: 'inprice', title: '单价', width: 90, align: 'right' },
            { field: 'num', title: '数量', width: 90, align: 'right' },
            { field: 'surplus', title: '剩余', width: 90, align: 'right' },
            { field: 'rnum', title: '入库数量', width: 130, edit: 'text' },
            { field: 'shid', title: '仓库shid', width: 130, edit: 'text' }
            ]] });

    app.post(api.inventory.queryPurchaseItemByPid, { 'purchase.pid': pid }, function (res) {
        var items = res.purchaseItems || [];
        for (var i = 0; i < items.length; i++) { items[i].rnum = ''; items[i].shid = ''; }
        table.reload('resultTable', { data: items });
    });

    $('#btnIn').on('click', function () {
        var rows = table.checkStatus('resultTable').data || [];
        if (!rows.length) { app.showAlert(app.warning, '请选择入库商品'); return; }
        var opt = { 'purchases[0].pid': pid };
        for (var i = 0; i < rows.length; i++) {
            var surplus = parseFloat(rows[i].surplus), rnum = parseFloat(rows[i].rnum);
            if (isNaN(rnum)) { app.showAlert(app.warning, '请填写入库数量'); return; }
            if (!rows[i].shid) { app.showAlert(app.warning, '请填写仓库shid'); return; }
            if (app.utils.accSub(surplus, rnum) < 0) { app.showAlert(app.warning, '采购项剩余数量不足'); return; }
            opt['purchaseItems[' + i + '].piid'] = rows[i].piid;
            opt['purchaseItems[' + i + '].storehouse.shid'] = rows[i].shid;
            opt['purchaseItems[' + i + '].num'] = rnum;
        }
        app.post(api.inventory.addManifestForPU, opt, function () { app.showAlert(app.success, '操作成功'); app.switchPage('purchase.html'); });
    });
    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
