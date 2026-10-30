/** app/js/manifest/manifest2xb.js —— 货单出返（勾选 + 填数量 → addManifestForXB）
 *  对齐旧 WebContent/js/manifest/manifest2xb.js。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var mid = getQueryParam('mid');
    if (!mid) { app.showAlert(app.warning, '缺少 mid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '出返' }]);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox' },
            { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
            { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'color', title: '颜色', width: 90, templet: function (d) { return d.color ? d.color.name : ''; } },
            { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.info : ''; } },
            { field: 'outstorehouse', title: '出货仓库', width: 110, templet: function (d) { return d.outstorehouse ? d.outstorehouse.name : ''; } },
            { field: 'surplus', title: '剩余数量', width: 100, align: 'right' },
            { field: 'crnum', title: '出返数量', width: 130, edit: 'text' }
            ]] });

    app.post(api.inventory.queryManifestItemByMid, { 'manifest.mid': mid }, function (res) {
        var items = res.manifestItems || [];
        for (var i = 0; i < items.length; i++) { items[i].crnum = ''; }
        table.reload('resultTable', { data: items });
    });

    $('#btnXb').on('click', function () {
        var rows = table.checkStatus('resultTable').data || [];
        if (!rows.length) { app.showAlert(app.warning, '请选择商品'); return; }
        var opt = { 'manifest.mid': mid };
        for (var i = 0; i < rows.length; i++) {
            var num = parseFloat(rows[i].surplus), crnum = parseFloat(rows[i].crnum);
            if (isNaN(crnum)) { app.showAlert(app.warning, '请填写出返数量'); return; }
            if (app.utils.accSub(num, crnum) < 0) { app.showAlert(app.warning, '货单项出返数不足'); return; }
            opt['manifestItems[' + i + '].miid'] = rows[i].miid;
            opt['manifestItems[' + i + '].num'] = crnum;
        }
        app.post(api.inventory.addManifestForXB, opt, function () { app.showAlert(app.success, '操作成功'); app.switchPage('manifest.html'); });
    });
    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
