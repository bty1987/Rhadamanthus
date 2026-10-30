/** app/js/manifest/accessories2create.js —— 创建辅料单（装修单信息 + 辅料项列表 → addAccessories）
 *  对齐旧 WebContent/js/manifest/accessories2create.js。
 *  ⚠️ 旧版用 typeahead 选商品(aoods) + 装修单/施工环节联动。纯 layui 版无 typeahead，
 *     辅料项需手动填 goods.gid/num/selling/caid；装修单信息通过 api.decoration / api.construction 联动
 *     （这两组接口在 decoration/construction API 迁入后可用；未迁入时"载入"按钮提示需先迁入）。 */
app.ready(function () {
layui.use(['form', 'laydate', 'jquery'], function () {
    var form = layui.form, laydate = layui.laydate, $ = layui.jquery;

    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '创建辅料单' }]);
    laydate.render({ elem: '#fetchTime' });

    var postData = { orderId: null, supervisor: null, house: null };

    // 载入装修单信息（依赖 decoration/construction API）
    $('#btnLoadOrder').on('click', function () {
        var orderId = $('#orderId').val();
        if (!orderId) { app.showAlert(app.warning, '请输入装修单号'); return; }
        if (!api.decoration || !api.decoration.queryDecorationForCommonByOrderId) { app.showAlert(app.warning, '装修单接口(api.decoration)尚未迁入，无法载入'); return; }
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (data) {
            var d = data.decoration;
            $('[name="supervisorName"]').val(d.supervisor && d.supervisor.userId != null ? d.supervisor.currentName : '---');
            $('[name="orderAddr"]').val(d.house ? (d.house.village.name + ' ' + d.house.houseNumber) : '');
            postData.orderId = d.orderId;
            postData.supervisor = d.supervisor ? d.supervisor.userId : null;
            postData.house = d.house ? d.house.hid : null;
        }, function () { app.showAlert(app.warning, '装修单不存在'); });
        if (api.construction && api.construction.queryConstructionScheduleByOrderId) {
            app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': orderId }, function (res) {
                var list = res.constructionSchedules || [];
                var html = '';
                for (var i = 0; i < list.length; i++) { html += '<option value="' + list[i].cnid + '">' + (list[i].name || list[i].cnid) + '</option>'; }
                $('#schedule').html(html);
                form.render('select');
            });
        }
    });

    function renderHead() {
        var html = '<table class="layui-table"><colgroup>' +
            '<col width="50"><col><col><col><col><col width="90"><col width="90"></colgroup>' +
            '<thead><tr><th>#</th><th>商品gid</th><th>数量</th><th>售价</th><th>辅料caid</th><th>费用额(元,选填)</th><th>操作</th></tr></thead>' +
            '<tbody id="itemTableBody"></tbody></table>';
        $('#itemTableWrap').html(html);
    }
    function addRow() {
        var seq = $('#itemTableBody tr').length + 1;
        var html = '<tr class="item-line">' +
            '<td>' + seq + '</td>' +
            '<td><input type="text" class="layui-input app-cell" name="gid" placeholder="商品gid" style="width:130px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="num" placeholder="数量" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="selling" placeholder="售价" style="width:100px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="caid" placeholder="辅料caid" style="width:110px;"></td>' +
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
        if (!$lines.length) { app.showAlert(app.warning, '请添加辅料项'); return; }

        var total = 0;
        $lines.each(function () {
            var num = parseFloat($(this).find('[name="num"]').val());
            var selling = parseFloat($(this).find('[name="selling"]').val());
            if (!isNaN(num) && !isNaN(selling)) { total += app.utils.accMul(num, selling); }
        });

        var opt = {
            'accessories.orderId': postData.orderId || $('#orderId').val(),
            'accessories.supervisor.userId': postData.supervisor,
            'accessories.fetchTime': $('[name="fetchTime"]').val() + ' 00:00:00',
            'accessories.cnid': $('#schedule').val(),
            'accessories.schedule': $('#schedule').val(),
            'accessories.comment': $('[name="comment"]').val(),
            'accessories.type': $('[name="type"]').val(),
            'accessories.total': total
        };
        var valid = true;
        $lines.each(function (i) {
            var $t = $(this);
            opt['accessoriesItems[' + i + '].goods.gid'] = $t.find('[name="gid"]').val();
            opt['accessoriesItems[' + i + '].num'] = $t.find('[name="num"]').val();
            opt['accessoriesItems[' + i + '].selling'] = $t.find('[name="selling"]').val();
            opt['accessoriesItems[' + i + '].caid'] = $t.find('[name="caid"]').val();
            opt['accessoriesItems[' + i + '].total'] = app.utils.accMul(parseFloat($t.find('[name="num"]').val() || 0), parseFloat($t.find('[name="selling"]').val() || 0));
            // 费用额(元,选填)映射为单条费用行走行Σ路径; 留空不上送, 后端回退 aoodscharge 模板现算(价格经 tranargs ×1000 折厘)
            var chargeVal = parseFloat($t.find('[name="charge"]').val());
            if (!isNaN(chargeVal) && chargeVal > 0) {
                opt['accessoriesItems[' + i + '].accessoriesCharges[0].name'] = '费用';
                opt['accessoriesItems[' + i + '].accessoriesCharges[0].price'] = chargeVal;
                opt['accessoriesItems[' + i + '].accessoriesCharges[0].surplus'] = 0;
                opt['accessoriesItems[' + i + '].accessoriesCharges[0].num'] = 1;
            }
            if (!opt['accessoriesItems[' + i + '].goods.gid'] || !opt['accessoriesItems[' + i + '].num']) { valid = false; return false; }
        });
        if (!valid) { app.showAlert(app.warning, '请填写每行的商品gid和数量'); return; }

        app.post(api.inventory.addAccessories, opt, function () {
            app.showAlert(app.success, '操作成功');
            $('#headForm')[0].reset(); form.render(); renderHead(); addRow();
        });
    });

    $('#btnReset').on('click', function () { $('#headForm')[0].reset(); form.render(); renderHead(); addRow(); });
    form.render();
});
}); // end app.ready
