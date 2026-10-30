/** app/js/manifest/accessories2edit.js —— 编辑辅料单（按 aid 加载辅料项，逐行保存/删除/新增）
 *  对齐旧 WebContent/js/manifest/accessories2edit.js。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var aid = getQueryParam('aid');
    var type = getQueryParam('type');
    var orderId = getQueryParam('orderId');
    if (!aid) { app.showAlert(app.warning, '缺少 aid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '编辑辅料单' }]);

    function renderHead() {
        var html = '<table class="layui-table"><colgroup>' +
            '<col width="50"><col><col><col><col><col><col width="180"></colgroup>' +
            '<thead><tr><th>#</th><th>商品编号</th><th>商品gid</th><th>品类</th><th>品牌</th><th>数量</th><th>操作</th></tr></thead>' +
            '<tbody id="itemTableBody"></tbody></table>';
        $('#itemTableWrap').html(html);
    }
    function addRow(d) {
        d = d || {};
        var seq = $('#itemTableBody tr').length + 1;
        var html = '<tr class="item-line" data-aiid="' + (d.aiid || '') + '" data-gid="' + (d.goods ? d.goods.gid : '') + '">' +
            '<td>' + seq + '</td>' +
            '<td><input type="text" class="layui-input app-cell" name="no" value="' + (d.goods ? d.goods.no : '') + '" placeholder="商品编号" style="width:120px;" ' + (d.aiid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell" name="gid" value="' + (d.goods ? d.goods.gid : '') + '" placeholder="商品gid" style="width:110px;" ' + (d.aiid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell" name="category" value="' + (d.goods ? d.goods.category : '') + '" placeholder="品类" style="width:100px;" readonly></td>' +
            '<td><input type="text" class="layui-input app-cell" name="brand" value="' + (d.goods ? d.goods.brand : '') + '" placeholder="品牌" style="width:100px;" readonly></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="num" value="' + (d.surplus != null ? d.surplus : '') + '" placeholder="数量" style="width:90px;"></td>' +
            '<td><button type="button" class="layui-btn layui-btn-xs btn-save">保存</button><button type="button" class="layui-btn layui-btn-xs layui-btn-danger btn-del">删除</button></td>' +
            '</tr>';
        $('#itemTableBody').append(html);
    }
    renderHead();
    app.post(api.inventory.queryAccessoriesItemByAid, { 'accessoriesItem.aid': aid }, function (res) {
        var items = res.accessoriesItems || [];
        for (var i = 0; i < items.length; i++) { addRow(items[i]); }
        if (!items.length) { addRow(); }
    });

    $(document).on('click', '.btn-save', function () {
        var $line = $(this).closest('tr');
        var aiid = $line.attr('data-aiid');
        var gid = $line.attr('data-gid');
        var selling = $line.attr('data-selling');
        var num = $line.find('[name="num"]').val();
        var url = api.inventory.addAccessoriesItem;
        var opt = { 'accessories.aid': aid, 'accessories.type': type, 'accessoriesItem.goods.gid': $line.find('[name="gid"]').val() || gid, 'accessoriesItem.num': num, 'accessoriesItem.selling': selling, 'accessoriesItem.total': app.utils.accMul(parseFloat(num || 0), parseFloat(selling || 0)) };
        if (aiid) { url = api.inventory.updateAccessoriesItem; opt['accessoriesItem.aiid'] = aiid; }
        app.post(url, opt, function (res) {
            app.showAlert(app.success, '操作成功');
            if (res.accessoriesItem) { $line.attr('data-aiid', res.accessoriesItem.aiid); }
        });
    });
    $(document).on('click', '.btn-del', function () {
        var $line = $(this).closest('tr');
        var aiid = $line.attr('data-aiid');
        if (aiid) { app.post(api.inventory.deleteAccessoriesItem, { 'accessoriesItem.aiid': aiid }, function () { $line.remove(); }); }
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
