/** app/js/manifest/occessories2edit.js —— 编辑外辅单（按 oid 加载外辅项，逐行保存/删除/新增）
 *  对齐旧 WebContent/js/manifest/occessories2edit.js。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var oid = getQueryParam('oid');
    var orderId = getQueryParam('orderId');
    if (!oid) { app.showAlert(app.warning, '缺少 oid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '编辑外辅单' }]);

    function renderHead() {
        var html = '<table class="layui-table"><colgroup>' +
            '<col width="50"><col><col><col><col><col><col width="180"></colgroup>' +
            '<thead><tr><th>#</th><th>商品gid</th><th>数量</th><th>售价</th><th>材料额</th><th>费用额</th><th>操作</th></tr></thead>' +
            '<tbody id="itemTableBody"></tbody></table>';
        $('#itemTableWrap').html(html);
    }
    function addRow(d) {
        d = d || {};
        var seq = $('#itemTableBody tr').length + 1;
        var html = '<tr class="item-line" data-oiid="' + (d.oiid || '') + '" data-selling="' + (d.selling || '') + '">' +
            '<td>' + seq + '</td>' +
            '<td><input type="text" class="layui-input app-cell" name="gid" value="' + (d.goods ? d.goods.gid : '') + '" placeholder="商品gid" style="width:120px;" ' + (d.oiid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="num" value="' + (d.num != null ? d.num : '') + '" placeholder="数量" style="width:80px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="selling" value="' + (d.selling != null ? d.selling : '') + '" placeholder="售价" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="rbalance" value="' + (d.rbalance != null ? d.rbalance : '') + '" placeholder="材料额" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="charge" value="' + (d.charge != null ? d.charge : '') + '" placeholder="费用额" style="width:90px;"></td>' +
            '<td><button type="button" class="layui-btn layui-btn-xs btn-save">保存</button><button type="button" class="layui-btn layui-btn-xs layui-btn-danger btn-del">删除</button></td>' +
            '</tr>';
        $('#itemTableBody').append(html);
    }
    renderHead();
    app.post(api.inventory.queryOccessoriesItemByOid, { 'occessoriesItem.oid': oid }, function (res) {
        var items = res.occessoriesItems || [];
        for (var i = 0; i < items.length; i++) { addRow(items[i]); }
        if (!items.length) { addRow(); }
    });

    $(document).on('click', '.btn-save', function () {
        var $line = $(this).closest('tr');
        var oiid = $line.attr('data-oiid');
        var url = api.inventory.addOccessoriesItem;
        var opt = { 'occessories.oid': oid, 'occessoriesItem.goods.gid': $line.find('[name="gid"]').val(), 'occessoriesItem.num': $line.find('[name="num"]').val(), 'occessoriesItem.goods.selling': $line.find('[name="selling"]').val(), 'occessoriesItem.rbalance': $line.find('[name="rbalance"]').val(), 'occessoriesItem.charge': $line.find('[name="charge"]').val() };
        if (oiid) { url = api.inventory.updateOccessoriesItem; opt['occessoriesItem.oiid'] = oiid; }
        app.post(url, opt, function (res) { app.showAlert(app.success, '操作成功'); if (res.occessoriesItem) { $line.attr('data-oiid', res.occessoriesItem.oiid); } });
    });
    $(document).on('click', '.btn-del', function () {
        var $line = $(this).closest('tr');
        var oiid = $line.attr('data-oiid');
        if (oiid) { app.post(api.inventory.deleteOccessoriesItem, { 'occessoriesItem.oiid': oiid }, function () { $line.remove(); }); }
        else { $line.remove(); }
    });

    $('#btnAdd').on('click', function () { addRow(); });
    $('#btnCancel').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
