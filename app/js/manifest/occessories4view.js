/** app/js/manifest/occessories4view.js —— 外辅单查看（按 oid 查看明细，只读）
 *  对齐旧 WebContent/js/manifest/occessories4view.js。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var oid = getQueryParam('oid');
    if (!oid) { app.showAlert(app.warning, '缺少 oid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '外辅单查看' }]);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
            { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'goods', title: '品类', width: 100, templet: function (d) { return d.goods ? d.goods.category : ''; } },
            { field: 'goods', title: '品牌', width: 100, templet: function (d) { return d.goods ? d.goods.brand : ''; } },
            { field: 'goods', title: '单位', width: 80, templet: function (d) { return d.goods ? d.goods.measurementUnit : ''; } },
            { field: 'num', title: '数量', width: 90, align: 'right' },
            { field: 'goods', title: '件数', width: 80, align: 'right', templet: function (d) { return d.goods ? d.goods.pieceNum : ''; } },
            { field: 'sennum', title: '送货数', width: 90, align: 'right' },
            { field: 'rbalance', title: '材料额', width: 100, align: 'right' },
            { field: 'vbalance', title: '结算材料额', width: 110, align: 'right' },
            { field: 'charge', title: '费用额', width: 100, align: 'right' }
            ]] });

    app.post(api.inventory.queryOccessoriesItemByOid, { 'occessoriesItem.oid': oid }, function (res) {
        table.reload('resultTable', { data: res.occessoriesItems || [] });
    });

    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
