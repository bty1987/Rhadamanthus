/** app/js/manifest/occessories2print.js —— 外辅单打印
 *  对齐旧 WebContent/js/manifest/occessories2print.js（旧版 iframe 内 parent 取数据，新版按 oid 查询）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var oid = getQueryParam('oid');
    if (!oid) { app.showAlert(app.warning, '缺少 oid 参数'); return; }

    app.post(api.inventory.queryOccessoriesItemByOid, { 'occessoriesItem.oid': oid }, function (res) {
        var items = res.occessoriesItems || [];
        var html = '<h2 style="text-align:center;">外辅单信息</h2>' +
            '<table class="layui-table"><thead><tr style="background:#f2f2f2;"><th>商品编号</th><th>商品名</th><th>单位</th><th>数量</th><th>送货数</th><th>材料额</th><th>费用额</th></tr></thead><tbody>';
        for (var i = 0; i < items.length; i++) {
            var v = items[i];
            html += '<tr><td>' + (v.goods ? v.goods.no : '') + '</td><td>' + (v.goods ? v.goods.name : '') + '</td><td>' + (v.goods ? v.goods.measurementUnit : '') + '</td><td>' + (v.num != null ? v.num : '') + '</td><td>' + (v.sennum != null ? v.sennum : '') + '</td><td>' + (v.rbalance != null ? v.rbalance : '') + '</td><td>' + (v.charge != null ? v.charge : '') + '</td></tr>';
        }
        html += '</tbody></table>';
        $('#occessoriesPrint').html(html);
    });

    $('#btnPrint').on('click', function () { window.print(); });
    $('#btnBack').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
