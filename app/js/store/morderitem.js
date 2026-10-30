/** app/js/store/morderitem.js —— 订单明细（只读，按 oid 查看订单项）
 *  对齐旧 WebContent/js/store/morderitem.js（旧版读 params.morder.oid，新版改读 URL 参数 oid）。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'mprice', title: '商品', minWidth: 160, templet: function (d) { return d.mprice && d.mprice.mgoods ? d.mprice.mgoods.title : ''; } },
            { field: 'mprice', title: '颜色', width: 100, templet: function (d) { return d.mprice && d.mprice.mcolor ? d.mprice.mcolor.color : ''; } },
            { field: 'mprice', title: '规格', width: 120, templet: function (d) { return d.mprice && d.mprice.mformat ? d.mprice.mformat.format : ''; } },
            { field: 'num', title: '数量', width: 90, align: 'right' },
            { field: 'mprice', title: '单价', width: 110, align: 'right', templet: function (d) { return d.mprice ? '¥' + app.formatMoney(d.mprice.price) : ''; } }
            ]] });

    function query() {
        var oid = $('#searchOid').val();
        if (!oid) { app.showAlert(app.warning, '请输入订单ID'); return; }
        app.post(api.store.queryMorderItemByOid, { 'morder.oid': oid }, function (res) {
            table.reload('resultTable', { data: res.morderItems || [] });
        });
    }

    var urlOid = getQueryParam('oid');
    if (urlOid) { $('#searchOid').val(urlOid); query(); }

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }

    $('#btnSearch').on('click', query);
});
}); // end app.ready
