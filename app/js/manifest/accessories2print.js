/** app/js/manifest/accessories2print.js —— 辅料单打印
 *  对齐旧 WebContent/js/manifest/accessories2print.js（旧版是 iframe 内 parent 取数据，新版直接按 aid 查询）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var aid = getQueryParam('aid');
    if (!aid) { app.showAlert(app.warning, '缺少 aid 参数'); return; }

    var info = {};
    app.post(api.inventory.queryManifestByAid, { 'accessoriesManifest.accessories.aid': aid, 'accessoriesManifest.manifest.type': 7 }, function (res) {
        var manifests = res.manifests || [];
        if (!manifests.length) { renderEmpty(); return; }
        var m = manifests[0];
        info.mno = m.code;
        app.post(api.inventory.queryManifestItemByMid, { 'manifest.mid': m.mid }, function (r) {
            createReceipt(info, r.manifestItems || []);
        });
    });

    function createReceipt(info, items) {
        var html = '<h2 style="text-align:center;">辅料单信息</h2>' +
            '<div>货单号: ' + (info.mno || '') + '</div>' +
            '<table class="layui-table"><thead><tr style="background:#f2f2f2;"><th>商品编号</th><th>出货仓库</th><th>商品名</th><th>单位</th><th>数量</th></tr></thead><tbody>';
        for (var i = 0; i < items.length; i++) {
            var v = items[i];
            var outName = (v.outstorehouse && v.outstorehouse.name) ? v.outstorehouse.name : '---';
            html += '<tr><td>' + (v.goods ? v.goods.no : '') + '</td><td>' + outName + '</td><td>' + (v.goods ? v.goods.name : '') + '</td><td>' + (v.goods ? v.goods.measurementUnit : '') + '</td><td>' + (v.surplus != null ? v.surplus : '') + '</td></tr>';
        }
        html += '</tbody></table>';
        $('#accessoriesPrint').html(html);
    }
    function renderEmpty() { $('#accessoriesPrint').html('<div>暂无辅料单明细</div>'); }

    $('#btnPrint').on('click', function () { window.print(); });
    $('#btnBack').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
