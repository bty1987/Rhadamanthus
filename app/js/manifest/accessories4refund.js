/** app/js/manifest/accessories4refund.js —— 辅料退货（勾选 + 填退货数 → addManifestForAR）
 *  对齐旧 WebContent/js/manifest/accessories4refund.js。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var aid = getQueryParam('aid');
    if (!aid) { app.showAlert(app.warning, '缺少 aid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '辅料退货' }]);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox' },
            { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
            { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'color', title: '颜色', width: 90, templet: function (d) { return d.color ? d.color.name : ''; } },
            { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.info : ''; } },
            { field: 'outstorehouse', title: '出货仓库', width: 110, templet: function (d) { return d.outstorehouse ? d.outstorehouse.name : ''; } },
            { field: 'outprice', title: '出库价', width: 100, align: 'right' },
            { field: 'surplus', title: '剩余', width: 90, align: 'right' },
            { field: 'num', title: '退货数量', width: 130, edit: 'text' }
            ]] });

    // 查询该辅料的出库货单（type=7）明细
    app.post(api.inventory.queryManifestByAid, { 'accessoriesManifest.accessories.aid': aid, 'accessoriesManifest.manifest.type': 7 }, function (res) {
        var manifests = res.manifests || [];
        var all = [];
        var done = 0;
        if (!manifests.length) { table.reload('resultTable', { data: [] }); return; }
        for (var i = 0; i < manifests.length; i++) {
            (function (m) {
                app.post(api.inventory.queryManifestItemByMid, { 'manifest.mid': m.mid }, function (r) {
                    all = all.concat(r.manifestItems || []);
                    done++;
                    if (done == manifests.length) { table.reload('resultTable', { data: all }); }
                });
            })(manifests[i]);
        }
    });

    $('#btnRefund').on('click', function () {
        var rows = table.checkStatus('resultTable').data || [];
        if (!rows.length) { app.showAlert(app.warning, '请选择商品'); return; }
        var opt = { 'accessories[0].aid': aid };
        for (var i = 0; i < rows.length; i++) {
            var num = parseFloat(rows[i].surplus), crnum = parseFloat(rows[i].num);
            if (isNaN(crnum)) { app.showAlert(app.warning, '请填写退货数量'); return; }
            if (app.utils.accSub(num, crnum) < 0) { app.showAlert(app.warning, '辅料项退货数不足'); return; }
            opt['accessoriesItems[' + i + '].miid'] = rows[i].miid;
            opt['accessoriesItems[' + i + '].aiid'] = rows[i].aiid;
            opt['accessoriesItems[' + i + '].goods.gid'] = rows[i].goods ? rows[i].goods.gid : '';
            opt['accessoriesItems[' + i + '].color.cid'] = rows[i].color ? rows[i].color.cid : '';
            opt['accessoriesItems[' + i + '].format.fid'] = rows[i].format ? rows[i].format.fid : '';
            opt['accessoriesItems[' + i + '].storehouse.shid'] = rows[i].outstorehouse ? rows[i].outstorehouse.shid : '';
            opt['accessoriesItems[' + i + '].outprice'] = rows[i].outprice;
            opt['accessoriesItems[' + i + '].num'] = crnum;
        }
        app.post(api.inventory.addManifestForAR, opt, function () { app.showAlert(app.success, '操作成功'); app.switchPage('accessories.html'); });
    });
    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
