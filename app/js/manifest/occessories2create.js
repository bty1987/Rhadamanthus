/** app/js/manifest/occessories2create.js —— 创建外辅单（装修单 + 外辅项列表 → addOccessories）
 *  对齐旧 WebContent/js/manifest/occessories2create.js。
 *  ⚠️ 旧版功能极复杂：辅材 typeahead(aoods)、费用模板(amountOccessoriesItem/queryAoodsCharge)、
 *     装修单/施工环节联动。纯 layui 版无 typeahead，外辅项需手动填 gid/num/selling/charge 等；
 *     费用/数量联动依赖 data/decoration API（未迁入时跳过，相关字段留空由后端默认）。 */
app.ready(function () {
layui.use(['form', 'jquery'], function () {
    var form = layui.form, $ = layui.jquery;
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '创建外辅单' }]);

    var postData = { orderId: null, supervisor: null, house: null };

    function renderHead() {
        var html = '<table class="layui-table"><colgroup>' +
            '<col width="50"><col><col><col><col><col><col><col><col width="90"></colgroup>' +
            '<thead><tr><th>#</th><th>商品gid</th><th>数量</th><th>售价</th><th>送货数</th><th>到货数</th><th>材料额</th><th>费用额</th><th>操作</th></tr></thead>' +
            '<tbody id="itemTableBody"></tbody></table>';
        $('#itemTableWrap').html(html);
    }
    function addRow() {
        var seq = $('#itemTableBody tr').length + 1;
        var html = '<tr class="item-line">' +
            '<td>' + seq + '</td>' +
            '<td><input type="text" class="layui-input app-cell" name="gid" placeholder="商品gid" style="width:120px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="num" placeholder="数量" style="width:80px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="selling" placeholder="售价" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="sennum" placeholder="送货数" style="width:80px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="recnum" placeholder="到货数" style="width:80px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="rbalance" placeholder="材料额" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="charge" placeholder="费用额" style="width:90px;"></td>' +
            '<td><button type="button" class="layui-btn layui-btn-xs layui-btn-danger btn-del">删除</button></td>' +
            '</tr>';
        $('#itemTableBody').append(html);
    }
    function reseq() { $('#itemTableBody tr').each(function (i) { $(this).find('td:first').text(i + 1); }); }

    renderHead(); addRow();
    $(document).on('click', '.btn-del', function () { $(this).closest('tr').remove(); reseq(); });

    $('#btnAdd').on('click', addRow);

    $('#btnSubmit').on('click', function () {
        if (app.validate('headForm')) return;
        var $lines = $('#itemTableBody tr');
        if (!$lines.length) { app.showAlert(app.warning, '请添加外辅项'); return; }
        var opt = {
            'occessories.decoration.orderId': $('#orderId').val(),
            'occessories.isEnter': $('[name="isEnter"]').val(),
            'occessories.isLift': $('[name="isLift"]').val()
        };
        var valid = true;
        $lines.each(function (i) {
            var $t = $(this);
            opt['occessoriesItems[' + i + '].goods.gid'] = $t.find('[name="gid"]').val();
            opt['occessoriesItems[' + i + '].num'] = $t.find('[name="num"]').val();
            opt['occessoriesItems[' + i + '].goods.selling'] = $t.find('[name="selling"]').val();
            opt['occessoriesItems[' + i + '].sennum'] = $t.find('[name="sennum"]').val();
            opt['occessoriesItems[' + i + '].recnum'] = $t.find('[name="recnum"]').val();
            opt['occessoriesItems[' + i + '].rbalance'] = $t.find('[name="rbalance"]').val();
            opt['occessoriesItems[' + i + '].vbalance'] = $t.find('[name="rbalance"]').val();
            opt['occessoriesItems[' + i + '].charge'] = $t.find('[name="charge"]').val();
            if (!opt['occessoriesItems[' + i + '].goods.gid']) { valid = false; return false; }
        });
        if (!valid) { app.showAlert(app.warning, '请填写每行的商品gid'); return; }
        app.post(api.inventory.addOccessories, opt, function () {
            app.showAlert(app.success, '操作成功');
            $('#headForm')[0].reset(); form.render(); renderHead(); addRow();
        });
    });

    $('#btnReset').on('click', function () { $('#headForm')[0].reset(); form.render(); renderHead(); addRow(); });
    form.render();
});
}); // end app.ready
