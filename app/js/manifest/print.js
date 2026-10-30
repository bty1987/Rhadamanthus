/** app/js/manifest/print.js —— 货单打印（LODOP 旧版的浏览器原生打印替代版）
 *  对齐旧 WebContent/js/manifest/print.js。旧版用 URL hash #id=xxx，新版兼容 query 参数 mid。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var mid = getQueryParam('mid') || getHashId();
    var mtypeList = ['', '进货', '进退', '出货', '出返', '调拨', '采购', '辅料', '辅退', '套合', '套拆', '盘盈', '盘亏'];
    if (!mid) { app.showAlert(app.warning, '缺少 mid 参数'); return; }

    var info = {};
    app.post(api.inventory.queryManifestByMid, { 'manifest.mid': mid }, function (res) {
        var m = res.manifest;
        info = { code: m.code, mtype: mtypeList[parseInt(m.type) - 1] || '---', manifestTime: m.manifestTime, total: m.total, creater: m.creater ? m.creater.currentName : '' };
    }, null, false);

    app.post(api.inventory.queryManifestItemByMid, { 'manifest.mid': mid }, function (res) {
        var html = '<div class="print_container"><h2 style="text-align:center;">货单信息</h2>' +
            '<div>货单编号：<span id="mcode">' + info.code + '</span></div>' +
            '<div>类型：<span id="mtype">' + info.mtype + '</span></div>' +
            '<div>货单时间：<span id="createDate">' + info.manifestTime + '</span></div>' +
            '<div>总价：<span id="total">' + info.total + '</span></div>' +
            '<div>创建人：<span id="creator">' + info.creater + '</span></div>' +
            '<table class="layui-table"><thead><tr><th>商品名</th><th>数量</th><th>采购价</th></tr></thead><tbody id="items"></tbody></table></div>';
        $('#print-wrap').html(html);
        var $items = $('#items');
        var items = res.manifestItems || [];
        for (var i = 0; i < items.length; i++) {
            var v = items[i];
            $items.append('<tr><td>' + (v.goodsName || (v.goods ? v.goods.name : '')) + '</td><td>' + (v.num != null ? v.num : '') + '</td><td>' + (v.purchasePrice || (v.inprice != null ? v.inprice : '')) + '</td></tr>');
        }
    });

    $('#btnPrint').on('click', function () { window.print(); });

    function getHashId() {
        var h = window.location.hash.substr(1);
        if (h && h.indexOf('=') != -1) return h.split('=')[1];
        return '';
    }
    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
