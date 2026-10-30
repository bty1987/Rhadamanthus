/** app/js/manifest/manifest2print.js —— 货单打印（只读明细 + 浏览器打印）
 *  对齐旧 WebContent/js/manifest/manifest2print.js（旧版用 LODOP 插件，新版改为 window.print 浏览器原生打印）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var mid = getQueryParam('mid');
    if (!mid) { app.showAlert(app.warning, '缺少 mid 参数'); return; }

    var mtypeList = ['', '进货', '进退', '出货', '出返', '调拨', '采购', '辅料', '辅退', '套合', '套拆', '盘盈', '盘亏'];
    var commonInfo = {};

    app.post(api.inventory.queryManifestByMid, { 'manifest.mid': mid }, function (res) {
        var m = res.manifest;
        commonInfo = { mid: m.mid, code: m.code, createTime: m.createTime, creater: m.creater ? m.creater.userName : '', manifestTime: m.manifestTime, total: m.total, status: m.status, type: m.type };
    }, null, false);

    app.post(api.inventory.queryManifestItemByMid, { 'manifest.mid': mid }, function (res) {
        createReceipt(commonInfo, res.manifestItems || []);
    }, null, false);

    function createReceipt(info, items) {
        var typeTxt = mtypeList[parseInt(info.type)] || '---';
        var status = info.status == 0 ? '初始' : (info.status == 1 ? '已确认' : '---');
        var html = '<table class="layui-table" style="width:90%;margin:0 auto;">' +
            '<tr><td colspan="11" style="text-align:center;font-size:18px;font-weight:bold;">货单明细信息</td></tr>' +
            '<tr><td colspan="5">货单编号: ' + (info.code || '') + '</td><td colspan="2">创建时间: ' + (info.createTime || '') + '</td><td colspan="4">货单时间: ' + (info.manifestTime || '') + '</td></tr>' +
            '<tr><td colspan="5">创建人: ' + (info.creater || '') + '</td><td colspan="2">货单类型: ' + typeTxt + '</td><td colspan="4">状态: ' + status + '</td></tr>' +
            '<tr style="background:#f2f2f2;font-weight:bold;text-align:center;"><td>商品编号</td><td>商品名</td><td>单位</td><td>颜色</td><td>规格</td><td>进货仓库</td><td>出货仓库</td><td>件数</td><td>入库价</td><td>出库价</td><td>数量</td></tr>';
        for (var i = 0; i < items.length; i++) {
            var v = items[i];
            html += '<tr style="text-align:center;">' +
                '<td>' + (v.goods ? v.goods.no : '') + '</td>' +
                '<td>' + (v.goods ? v.goods.name : '') + '</td>' +
                '<td>' + (v.goods ? v.goods.measurementUnit : '') + '</td>' +
                '<td>' + (v.color ? v.color.name : '') + '</td>' +
                '<td>' + (v.format ? v.format.info : '') + '</td>' +
                '<td>' + (v.instorehouse ? v.instorehouse.name : '---') + '</td>' +
                '<td>' + (v.outstorehouse ? v.outstorehouse.name : '---') + '</td>' +
                '<td>' + (v.goods ? v.goods.pieceNum : '') + '</td>' +
                '<td>' + (v.inprice != null ? v.inprice : '') + '</td>' +
                '<td>' + (v.outprice != null ? v.outprice : '') + '</td>' +
                '<td>' + (v.surplus != null ? v.surplus : '') + '</td></tr>';
        }
        html += '</table>';
        $('#manifestPrint').html(html);
    }

    $('#btnPrint').on('click', function () { window.print(); });
    $('#btnBack').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
