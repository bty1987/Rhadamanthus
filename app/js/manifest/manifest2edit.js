/** app/js/manifest/manifest2edit.js —— 编辑货单明细（按 mid/type 加载，逐行保存/删除/新增）
 *  对齐旧 WebContent/js/manifest/manifest2edit.js。
 *  注：新前端无 typeahead，新增行需手动填 gid/color/format/storehouse；已有行只改 num/inprice/outprice。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var mid = getQueryParam('mid');
    var manifestType = getQueryParam('type');
    var storehouse = manifestType == 1 ? 'instorehouse' : (manifestType == 3 ? 'outstorehouse' : '');

    if (!mid) { app.showAlert(app.warning, '缺少 mid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '编辑货单' }]);

    function renderHead() {
        var html = '<table class="layui-table"><colgroup>' +
            '<col width="50"><col><col><col><col><col><col><col><col width="180"></colgroup>' +
            '<thead><tr><th>#</th><th>商品gid</th><th>颜色cid</th><th>规格fid</th><th>仓库shid</th><th>入库价</th><th>出库价</th><th>数量</th><th>操作</th></tr></thead>' +
            '<tbody id="itemTableBody"></tbody></table>';
        $('#itemTableWrap').html(html);
    }
    function addRow(d) {
        d = d || {};
        var seq = $('#itemTableBody tr').length + 1;
        var html = '<tr class="item-line" data-miid="' + (d.miid || '') + '" data-gid="' + (d.goods ? d.goods.gid : '') + '">' +
            '<td>' + seq + '</td>' +
            '<td><input type="text" class="layui-input app-cell" name="gid" value="' + (d.goods ? d.goods.gid : '') + '" placeholder="商品gid" style="width:110px;" ' + (d.miid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell" name="color" value="' + (d.color ? d.color.cid : '') + '" placeholder="颜色cid" style="width:90px;" ' + (d.miid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell" name="format" value="' + (d.format ? d.format.fid : '') + '" placeholder="规格fid" style="width:90px;" ' + (d.miid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell" name="storehouse" value="' + (d.instorehouse ? d.instorehouse.shid : (d.outstorehouse ? d.outstorehouse.shid : '')) + '" placeholder="仓库shid" style="width:100px;" ' + (d.miid ? 'readonly' : '') + '></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="inprice" value="' + (d.inprice != null ? d.inprice : '') + '" placeholder="入库价" style="width:80px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="outprice" value="' + (d.outprice != null ? d.outprice : '') + '" placeholder="出库价" style="width:80px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="num" value="' + (d.surplus != null ? d.surplus : '') + '" placeholder="数量" style="width:80px;"></td>' +
            '<td><button type="button" class="layui-btn layui-btn-xs btn-save">保存</button><button type="button" class="layui-btn layui-btn-xs layui-btn-danger btn-del">删除</button></td>' +
            '</tr>';
        $('#itemTableBody').append(html);
    }

    renderHead();
    app.post(api.inventory.queryManifestItemByMid, { 'manifest.mid': mid }, function (res) {
        var items = res.manifestItems || [];
        for (var i = 0; i < items.length; i++) { addRow(items[i]); }
        if (!items.length) { addRow(); }
    });

    // 保存单行
    $(document).on('click', '.btn-save', function () {
        var $line = $(this).closest('tr');
        var miid = $line.attr('data-miid');
        var opt = {
            'manifest.mid': mid,
            'manifestItem.miid': miid
        };
        var url = api.inventory.updateManifestItem;
        if (!miid) {
            url = api.inventory.addManifestItem;
            opt['manifestItem.goods.gid'] = $line.find('[name="gid"]').val();
            opt['manifestItem.color.cid'] = $line.find('[name="color"]').val();
            opt['manifestItem.format.fid'] = $line.find('[name="format"]').val();
            if (storehouse) { opt['manifestItem.' + storehouse + '.shid'] = $line.find('[name="storehouse"]').val(); }
        }
        opt['manifestItem.inprice'] = $line.find('[name="inprice"]').val();
        opt['manifestItem.outprice'] = $line.find('[name="outprice"]').val();
        opt['manifestItem.num'] = $line.find('[name="num"]').val();
        app.post(url, opt, function (res) {
            app.showAlert(app.success, '操作成功');
            if (res.manifestItem) { $line.attr('data-miid', res.manifestItem.miid); }
        });
    });

    // 删除单行
    $(document).on('click', '.btn-del', function () {
        var $line = $(this).closest('tr');
        var miid = $line.attr('data-miid');
        if (miid) {
            app.post(api.inventory.deleteManifestItem, { 'manifest.mid': mid, 'manifestItem.miid': miid }, function () { $line.remove(); });
        } else { $line.remove(); }
    });

    $('#btnAdd').on('click', function () { addRow(); });
    $('#btnBack').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
