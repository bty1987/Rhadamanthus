/** app/js/manifest/manifest4view.js —— 货单查看（只读，按 mid 查看明细）*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'format', title: '规格', width: 100, templet: function (d) { return d.format ? d.format.format : ''; } },
            { field: 'color', title: '颜色', width: 100, templet: function (d) { return d.color ? d.color.color : ''; } },
            { field: 'num', title: '数量', width: 90, align: 'right' },
            { field: 'instorehouse', title: '入库仓库', width: 120, templet: function (d) { return d.instorehouse ? d.instorehouse.name : ''; } },
            { field: 'outstorehouse', title: '出库仓库', width: 120, templet: function (d) { return d.outstorehouse ? d.outstorehouse.name : ''; } },
            { field: 'inprice', title: '入库价', width: 100, align: 'right', templet: function (d) { return '¥' + app.formatMoney(d.inprice); } },
            { field: 'outprice', title: '出库价', width: 100, align: 'right', templet: function (d) { return '¥' + app.formatMoney(d.outprice); } },
            { field: 'comment', title: '备注', minWidth: 140 }
            ]] });

    function query() {
        var mid = $('#searchMid').val();
        if (!mid) { app.showAlert(app.warning, '请输入货单ID'); return; }
        app.post(api.inventory.queryManifestItemByMid, { 'manifestItem.mid': mid }, function (res) {
            table.reload('resultTable', { data: res.manifestItems || [] });
        });
    }

    // 从 URL 参数读 mid（从其他页面跳转时带 mid）
    var urlMid = getQueryParam('mid');
    if (urlMid) { $('#searchMid').val(urlMid); query(); }

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }

    $('#btnSearch').on('click', query);
});
}); // end app.ready
