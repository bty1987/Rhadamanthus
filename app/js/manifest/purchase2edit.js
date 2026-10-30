/** app/js/manifest/purchase2edit.js —— 编辑采购单（header 修改 + 逐行明细保存/删除/新增）
 *  对齐旧 WebContent/js/manifest/purchase2edit.js。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var pid = getQueryParam('pid');
    if (!pid) { app.showAlert(app.warning, '缺少 pid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '修改采购单' }]);

    app.post(api.inventory.queryPurchaseByPid, { 'purchase.pid': pid }, function (res) {
        $('#headForm [name="comment"]').val(res.purchase.comment);
    });

    function renderHead() {
        var html = '<table class="layui-table"><colgroup>' +
            '<col width="50"><col><col><col><col><col><col><col width="180"></colgroup>' +
            '<thead><tr><th>#</th><th>商品gid</th><th>颜色cid</th><th>规格fid</th><th>件数</th><th>单价</th><th>数量</th><th>操作</th></tr></thead>' +
            '<tbody id="itemTableBody"></tbody></table>';
        $('#itemTableWrap').html(html);
    }
    function addRow(d) {
        d = d || {};
        var seq = $('#itemTableBody tr').length + 1;
        var html = '<tr class="item-line" data-piid="' + (d.piid || '') + '" data-gid="' + (d.goods ? d.goods.gid : '') + '">' +
            '<td>' + seq + '</td>' +
            '<td><input type="text" class="layui-input app-cell" name="gid" value="' + (d.goods ? d.goods.gid : '') + '" placeholder="商品gid" style="width:110px;" ' + (d.piid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell" name="color" value="' + (d.color ? d.color.cid : '') + '" placeholder="颜色cid" style="width:90px;" ' + (d.piid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell" name="format" value="' + (d.format ? d.format.fid : '') + '" placeholder="规格fid" style="width:90px;" ' + (d.piid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell" name="pieceNum" value="' + (d.goods ? d.goods.pieceNum : '') + '" placeholder="件数" style="width:70px;" readonly></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="inprice" value="' + (d.inprice != null ? d.inprice : '') + '" placeholder="单价" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="num" value="' + (d.num != null ? d.num : '') + '" placeholder="数量" style="width:80px;"></td>' +
            '<td><button type="button" class="layui-btn layui-btn-xs btn-save">保存</button><button type="button" class="layui-btn layui-btn-xs layui-btn-danger btn-del">删除</button></td>' +
            '</tr>';
        $('#itemTableBody').append(html);
    }
    renderHead();
    app.post(api.inventory.queryPurchaseItemByPid, { 'purchase.pid': pid }, function (res) {
        var items = res.purchaseItems || [];
        for (var i = 0; i < items.length; i++) { addRow(items[i]); }
        if (!items.length) { addRow(); }
    });

    $(document).on('click', '.btn-save', function () {
        var $line = $(this).closest('tr');
        var piid = $line.attr('data-piid');
        var url = api.inventory.updatePurchaseItem;
        var opt = { 'purchase.pid': pid, 'purchaseItem.piid': piid, 'purchaseItem.num': $line.find('[name="num"]').val(), 'purchaseItem.inprice': $line.find('[name="inprice"]').val() };
        if (!piid) {
            url = api.inventory.addPurchaseItem;
            opt['purchaseItem.goods.gid'] = $line.find('[name="gid"]').val();
            opt['purchaseItem.color.cid'] = $line.find('[name="color"]').val();
            opt['purchaseItem.format.fid'] = $line.find('[name="format"]').val();
        }
        app.post(url, opt, function (res) {
            app.showAlert(app.success, '操作成功');
            if (res.purchaseItem) { $line.attr('data-piid', res.purchaseItem.piid); }
        });
    });
    $(document).on('click', '.btn-del', function () {
        var $line = $(this).closest('tr');
        var piid = $line.attr('data-piid');
        if (piid) { app.post(api.inventory.deletePurchaseItem, { 'purchase.pid': pid, 'purchaseItem.piid': piid }, function () { $line.remove(); }); }
        else { $line.remove(); }
    });

    $('#btnAdd').on('click', function () { addRow(); });
    $('#btnSubmit').on('click', function () {
        app.post(api.inventory.updatePurchase, { 'purchase.pid': pid, 'purchase.comment': $('#headForm [name="comment"]').val() }, function () { app.showAlert(app.success, '保存成功'); history.back(); });
    });
    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
