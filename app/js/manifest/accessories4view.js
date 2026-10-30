/** app/js/manifest/accessories4view.js —— 辅料单查看（出/退货单明细）
 *  对齐旧 WebContent/js/manifest/accessories4view.js。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var aid = getQueryParam('aid');
    if (!aid) { app.showAlert(app.warning, '缺少 aid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '辅料单查看' }]);

    var COLS = [[ { type: 'numbers', title: '#', width: 60 },
        { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
        { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
        { field: 'goods', title: '品类', width: 100, templet: function (d) { return d.goods ? d.goods.category : ''; } },
        { field: 'goods', title: '品牌', width: 100, templet: function (d) { return d.goods ? d.goods.brand : ''; } },
        { field: 'goods', title: '单位', width: 80, templet: function (d) { return d.goods ? d.goods.measurementUnit : ''; } },
        { field: 'color', title: '颜色', width: 90, templet: function (d) { return d.color ? d.color.name : ''; } },
        { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.info : ''; } },
        { field: 'instorehouse', title: '进货仓库', width: 110, templet: function (d) { return d.instorehouse ? d.instorehouse.name : ''; } },
        { field: 'outstorehouse', title: '出货仓库', width: 110, templet: function (d) { return d.outstorehouse ? d.outstorehouse.name : ''; } },
        { field: 'goods', title: '件数', width: 80, align: 'right', templet: function (d) { return d.goods ? d.goods.pieceNum : ''; } },
        { field: 'inprice', title: '入库价', width: 100, align: 'right' },
        { field: 'outprice', title: '出库价', width: 100, align: 'right' },
        { field: 'num', title: '数量', width: 90, align: 'right' }
    ]];
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true, cols: COLS });
    table.render({ elem: '#refundTable', data: [], page: false, limit: 1000, even: true, cols: COLS });

    app.post(api.inventory.queryManifestByAid, { 'accessoriesManifest.accessories.aid': aid, 'accessoriesManifest.manifest.type': null }, function (res) {
        var manifests = res.manifests || [];
        for (var i = 0; i < manifests.length; i++) {
            (function (m) {
                app.post(api.inventory.queryManifestItemByMid, { 'manifest.mid': m.mid }, function (r) {
                    if (m.type == 7) { $('#outTitle').text('单号：' + m.code + ' 辅料单'); table.reload('resultTable', { data: r.manifestItems || [] }); }
                    else { $('#refundTitle').text('单号：' + m.code + ' 辅退单'); table.reload('refundTable', { data: r.manifestItems || [] }); }
                });
            })(manifests[i]);
        }
    });

    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
