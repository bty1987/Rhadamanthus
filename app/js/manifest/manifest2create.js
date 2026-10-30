/** app/js/manifest/manifest2create.js —— 创建货单（CG进货/XG出货：header + 多行明细）
 *  对齐旧 WebContent/js/manifest/manifest2create.js。
 *  新前端无 typeahead，明细行采用可编辑 input 表格（与旧 line 思路一致），用户填 gid/color/format/storehouse/num/price/comment。
 *  type=1 → addManifestForCG（instorehouse + inprice）；type=3 → addManifestForXG（outstorehouse + outprice）。 */
app.ready(function () {
layui.use(['form', 'laydate', 'jquery'], function () {
    var form = layui.form, laydate = layui.laydate, $ = layui.jquery;
    var rowSeq = 0;

    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '创建货单' }]);
    laydate.render({ elem: '#manifestTime' });

    // 加载货单模板下拉
    app.post(api.inventory.queryManifestTemplate, {}, function (res) {
        var list = res.manifestTemplates || [];
        var html = '<option value="">不选</option>';
        for (var i = 0; i < list.length; i++) { html += '<option value="' + list[i].mtid + '">' + list[i].name + '</option>'; }
        $('#manifestTemplate').html(html);
        form.render('select');
    });

    function addRow() {
        rowSeq++;
        var html = '<tr class="item-line" data-seq="' + rowSeq + '">' +
            '<td>' + rowSeq + '</td>' +
            '<td><input type="text" class="layui-input app-cell" name="gid" placeholder="商品gid" style="width:110px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="color" placeholder="颜色cid" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="format" placeholder="规格fid" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="storehouse" placeholder="仓库shid" style="width:100px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="num" placeholder="数量" style="width:80px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="price" placeholder="单价" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="comment" placeholder="备注" style="width:140px;"></td>' +
            '<td><button type="button" class="layui-btn layui-btn-xs layui-btn-danger btn-del">删除</button></td>' +
            '</tr>';
        $('#itemTableBody').append(html);
    }

    // 渲染空表头表格（运行时插入 tbody）
    function renderTableHead() {
        var html = '<table class="layui-table" id="itemTable"><colgroup>' +
            '<col width="50"><col><col><col><col><col><col><col><col width="90"></colgroup>' +
            '<thead><tr><th>#</th><th>商品gid</th><th>颜色cid</th><th>规格fid</th><th>仓库shid</th><th>数量</th><th>单价</th><th>备注</th><th>操作</th></tr></thead>' +
            '<tbody id="itemTableBody"></tbody></table>';
        $('#itemTableWrap').html(html);
    }

    // 初始化（HTML 里只有占位容器）
    $('#itemTable').replaceWith('<div id="itemTableWrap"></div>');
    renderTableHead();
    addRow();

    // 删除行
    $(document).on('click', '.btn-del', function () { $(this).closest('tr').remove(); reseq(); });

    function reseq() {
        $('#itemTableBody tr').each(function (i) { $(this).find('td:first').text(i + 1); });
    }

    // 添加明细
    $('#btnAddItem').on('click', addRow);

    // 按模板添加
    $('#btnAddStyle').on('click', function () {
        var mtid = $('#manifestTemplate').val();
        if (!mtid) { app.showAlert(app.warning, '请选择模板'); return; }
        app.post(api.inventory.queryManifestTemplateItemByMtid, { 'manifestTemplate.mtid': mtid }, function (res) {
            var items = res.manifestTemplateItems || [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].goods && items[i].goods.status != 0) continue;
                addRow();
                var $last = $('#itemTableBody tr:last');
                $last.find('[name="gid"]').val(items[i].goods.gid);
                $last.find('[name="num"]').val(0);
                $last.find('[name="price"]').val(0);
            }
        });
    });

    // 提交
    $('#btnSubmit').on('click', function () {
        if (app.validate('headForm')) return;
        var $lines = $('#itemTableBody tr');
        if (!$lines.length) { app.showAlert(app.warning, '请填写商品'); return; }

        var manifestType = $('#headForm [name="type"]').val();
        var url, storehouse, priceinfo;
        if (manifestType == 1) { url = api.inventory.addManifestForCG; storehouse = 'instorehouse'; priceinfo = 'inprice'; }
        else if (manifestType == 3) { url = api.inventory.addManifestForXG; storehouse = 'outstorehouse'; priceinfo = 'outprice'; }
        else { app.showAlert(app.warning, '类型仅支持进货/出货'); return; }

        var opt = {
            'manifest.manifestTime': $('#headForm [name="manifestTime"]').val(),
            'manifest.type': manifestType,
            'manifest.comment': $('#headForm [name="comment"]').val(),
            'manifest.attachment': ''
        };
        var valid = true;
        $lines.each(function (i) {
            var $t = $(this);
            opt['manifestItems[' + i + '].goods.gid'] = $t.find('[name="gid"]').val();
            opt['manifestItems[' + i + '].color.cid'] = $t.find('[name="color"]').val();
            opt['manifestItems[' + i + '].format.fid'] = $t.find('[name="format"]').val();
            opt['manifestItems[' + i + '].num'] = $t.find('[name="num"]').val();
            opt['manifestItems[' + i + '].' + priceinfo] = $t.find('[name="price"]').val();
            opt['manifestItems[' + i + '].comment'] = $t.find('[name="comment"]').val();
            opt['manifestItems[' + i + '].' + storehouse + '.shid'] = $t.find('[name="storehouse"]').val();
            if (!opt['manifestItems[' + i + '].goods.gid'] || !opt['manifestItems[' + i + '].num']) { valid = false; return false; }
        });
        if (!valid) { app.showAlert(app.warning, '请填写每行的商品gid和数量'); return; }

        app.post(url, opt, function () {
            app.showAlert(app.success, '操作成功');
            $('#headForm')[0].reset(); form.render();
            renderTableHead(); addRow();
        });
    });

    $('#btnReset').on('click', function () { $('#headForm')[0].reset(); form.render(); renderTableHead(); addRow(); });
    form.render();
});
}); // end app.ready
