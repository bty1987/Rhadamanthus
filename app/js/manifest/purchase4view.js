/** app/js/manifest/purchase4view.js —— 采购单查看（按 pid 查看明细，只读）
 *  对齐旧 WebContent/js/manifest/purchase4view.js。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var pid = getQueryParam('pid');
    if (!pid) { app.showAlert(app.warning, '缺少 pid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '采购单查看' }]);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'goods', title: '编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
            { field: 'goods', title: '名称', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'goods', title: '类别', width: 100, templet: function (d) { return d.goods ? d.goods.category : ''; } },
            { field: 'goods', title: '品牌', width: 100, templet: function (d) { return d.goods ? d.goods.brand : ''; } },
            { field: 'goods', title: '单位', width: 80, templet: function (d) { return d.goods ? d.goods.measurementUnit : ''; } },
            { field: 'color', title: '颜色', width: 90, templet: function (d) { return d.color ? d.color.name : ''; } },
            { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.info : ''; } },
            { field: 'goods', title: '件数', width: 80, align: 'right', templet: function (d) { return d.goods ? d.goods.pieceNum : ''; } },
            { field: 'inprice', title: '采购单价', width: 100, align: 'right' },
            { field: 'num', title: '数量', width: 90, align: 'right' },
            { field: 'surplus', title: '剩余数量', width: 100, align: 'right' }
            ]] });

    app.post(api.inventory.queryPurchaseItemByPid, { 'purchase.pid': pid }, function (res) {
        table.reload('resultTable', { data: res.purchaseItems || [] });
    });

    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
