/** app/js/manifest/alloting.js —— 调拨（header + 多行明细 + 审批人 → submitApprovalForManifestDB）
 *  对齐旧 WebContent/js/manifest/alloting.js。
 *  ⚠️ 提交走 api.approval.submitApprovalForManifestDB（审批流）。该审批 API 命名空间在审批模块
 *     迁入后可用；未迁入时提交按钮会提示需先迁入审批接口。
 *  旧版审批人选择用 approvalUtils 渲染单选列表，新版简化为直接填 userId。 */
app.ready(function () {
layui.use(['form', 'laydate', 'jquery'], function () {
    var form = layui.form, laydate = layui.laydate, $ = layui.jquery;
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '调拨' }]);
    laydate.render({ elem: '#manifestTime' });

    function renderHead() {
        var html = '<table class="layui-table"><colgroup>' +
            '<col width="50"><col><col><col><col><col><col><col width="90"></colgroup>' +
            '<thead><tr><th>#</th><th>商品gid</th><th>颜色cid</th><th>规格fid</th><th>入库仓库shid</th><th>出库仓库shid</th><th>数量</th><th>操作</th></tr></thead>' +
            '<tbody id="itemTableBody"></tbody></table>';
        $('#itemTableWrap').html(html);
    }
    function addRow() {
        var seq = $('#itemTableBody tr').length + 1;
        var html = '<tr class="item-line">' +
            '<td>' + seq + '</td>' +
            '<td><input type="text" class="layui-input app-cell" name="gid" placeholder="商品gid" style="width:110px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="color" placeholder="颜色cid" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="format" placeholder="规格fid" style="width:90px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="instorehouse" placeholder="入库shid" style="width:100px;"></td>' +
            '<td><input type="text" class="layui-input app-cell" name="outstorehouse" placeholder="出库shid" style="width:100px;"></td>' +
            '<td><input type="text" class="layui-input app-cell v_float_3" name="num" placeholder="数量" style="width:80px;"></td>' +
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
        if (!$lines.length) { app.showAlert(app.warning, '请填写商品'); return; }
        var approverId = $('#approver').val();
        if (!approverId) { app.showAlert(app.warning, '请选择审批人'); return; }
        if (!api.approval || !api.approval.submitApprovalForManifestDB) { app.showAlert(app.warning, '审批接口(api.approval.submitApprovalForManifestDB)尚未迁入，无法提交'); return; }

        var opt = {
            'approval.receiver.userId': approverId,
            'approval.comment': $('#headForm [name="comment"]').val(),
            'approvalManifestDB.manifestTime': $('#headForm [name="manifestTime"]').val(),
            'approvalManifestDB.comment': $('#headForm [name="comment"]').val(),
            'approvalManifestDB.attachment': ''
        };
        var valid = true;
        $lines.each(function (i) {
            var $t = $(this);
            opt['approvalManifestDBItems[' + i + '].goods.gid'] = $t.find('[name="gid"]').val();
            opt['approvalManifestDBItems[' + i + '].color.cid'] = $t.find('[name="color"]').val();
            opt['approvalManifestDBItems[' + i + '].format.fid'] = $t.find('[name="format"]').val();
            opt['approvalManifestDBItems[' + i + '].instorehouse.shid'] = $t.find('[name="instorehouse"]').val();
            opt['approvalManifestDBItems[' + i + '].outstorehouse.shid'] = $t.find('[name="outstorehouse"]').val();
            opt['approvalManifestDBItems[' + i + '].num'] = $t.find('[name="num"]').val();
            if (!opt['approvalManifestDBItems[' + i + '].goods.gid'] || !opt['approvalManifestDBItems[' + i + '].num']) { valid = false; return false; }
        });
        if (!valid) { app.showAlert(app.warning, '请填写每行的商品gid和数量'); return; }

        app.post(api.approval.submitApprovalForManifestDB, opt, function () {
            app.showAlert(app.success, '操作成功');
            $('#headForm')[0].reset(); form.render(); renderHead(); addRow();
        });
    });

    $('#btnReset').on('click', function () { $('#headForm')[0].reset(); form.render(); renderHead(); addRow(); });
    form.render();
});
}); // end app.ready
