/** app/js/payment/walletard.js —— 钱包银行卡（弹窗子页）
 *  上下文：app.params.payment = { wid, phone }。
 *  操作：绑定（弹窗：卡号/银行名/有效期/CVV/类型/电话+验证码）、解绑、删除。 */
app.ready(function () {
layui.use(['table', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var ctx = app.params.payment || {};
    var TYPE = { 0: '储蓄卡', 1: '信用卡' };
    var STATUS = { 0: '正常', 1: '已解绑', 2: '已删除' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    initTable();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'bankName', title: '银行', width: 140 }, { field: 'bankNo', title: '卡号', width: 200 }, { field: 'validTime', title: '有效期', width: 110 }, { field: 'type', title: '类型', width: 90, templet: tpB }, { field: 'mobile', title: '电话', width: 140 }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'bindTime', title: '绑定时间', width: 170 }, { field: 'comment', title: '备注', minWidth: 120 }, { title: '操作', width: 150, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data;
            if (obj.event === 'unbind') doAction('unbind', v);
            else if (obj.event === 'delete') doAction('delete', v);
        });
    }
    function query() {
        if (!ctx.wid) { app.showAlert(app.warning, '缺少钱包信息'); return; }
        app.post(api.payment.queryWalletard, { 'walletard.wid': ctx.wid }, function (res) { table.reload('resultTable', { data: res.walletards || [] }); });
    }
    function doAction(act, v) {
        var msg = act === 'unbind' ? '确认要解绑当前银行卡吗?' : '确认要删除当前银行卡吗?';
        var url = act === 'unbind' ? api.payment.unbindWalletard : api.payment.deleteWalletard;
        app.showConfirm(msg, function () {
            app.post(url, { 'walletard.wcid': v.wcid }, function () { app.showAlert(app.success, '操作成功'); query(); });
        });
    }
    $('#btnBind').on('click', function () {
        var html = '<div class="layui-form" style="padding:20px;" id="bindForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">卡号</label><div class="layui-input-block"><input class="layui-input" name="bankNo" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">银行名</label><div class="layui-input-block"><input class="layui-input" name="bankName" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">有效期</label><div class="layui-input-inline"><input class="layui-input" name="validTime" placeholder="YYYY-MM"></div><label class="layui-form-label" style="width:60px;">CVV</label><div class="layui-input-inline"><input class="layui-input" name="cvv"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">类型</label><div class="layui-input-block"><select name="type"><option value="0">储蓄卡</option><option value="1">信用卡</option></select></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">电话</label><div class="layui-input-block"><input class="layui-input" name="mobile"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">验证码</label><div class="layui-input-inline"><input class="layui-input" name="code"></div><div class="layui-input-inline"><button type="button" class="layui-btn layui-btn-primary" id="btnCode">获取验证码</button></div></div>'
            + '</div>';
        var idx = layer.open({ type: 1, title: '绑定银行卡', content: html, area: ['500px', 'auto'], btn: ['绑定', '取消'], yes: function (i) {
            var f = {};
            $('#bindForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            if (!f.bankNo || !f.bankName) { app.showAlert(app.warning, '请填写卡号和银行名'); return; }
            var options = { 'walletard.wid': ctx.wid, 'walletard.bankNo': f.bankNo, 'walletard.bankName': f.bankName, 'walletard.validTime': f.validTime, 'walletard.cvv': f.cvv, 'walletard.type': f.type, 'walletard.mobile': f.mobile };
            app.post(api.payment.bindWalletard, options, function () { layer.close(i); app.showAlert(app.success, '绑定成功'); query(); });
        } });
        var cd = 60; $('#btnCode').on('click', function () { var btn = $(this); if (btn.attr('disabled')) return; btn.attr('disabled', true); var t = setInterval(function () { if (cd <= 0) { clearInterval(t); btn.text('获取验证码').attr('disabled', false); cd = 60; } else { btn.text(cd + 's'); cd--; } }, 1000); });
    });
    query();
});
}); // end app.ready
