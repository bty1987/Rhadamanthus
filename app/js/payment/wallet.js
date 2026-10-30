/** app/js/payment/wallet.js —— 钱包账户
 *  列表 + 绑定/更新/冻结/解冻/提现/转账 + 跳转银行卡/交易记录/资源子页（app.popup）。
 *  type: 0=客户,1=员工。status: 0=初始,1=已绑定,2=已冻结。验证码默认 1111（与旧版一致）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var PHONE_CODE = '1111';
    var TYPE = { 0: '客户', 1: '员工' };
    var STATUS = { 0: '初始', 1: '已绑定', 2: '已冻结' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 1 ? 'layui-bg-green' : d.status == 2 ? 'layui-bg-red' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '编号', width: 140 }, { field: 'phone', title: '电话', width: 140 }, { field: 'identity', title: '身份证', width: 180 }, { field: 'balance', title: '余额', width: 120, templet: function (d) { return app.formatMoney(d.balance); } }, { field: 'type', title: '类型', width: 80, templet: tpB }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'belonger.currentName', title: '归属人', width: 110, templet: function (d) { return d.belonger ? d.belonger.currentName : ''; } }, { title: '操作', width: 700, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (ev === 'bind' || ev === 'update') openBind(v, ev === 'update');
            else if (ev === 'freeze') confirmAct(api.payment.freezeWallet, { 'wallet.wid': v.wid }, '确认要冻结该账户吗?', '冻结成功');
            else if (ev === 'unfreeze') confirmAct(api.payment.unfreezeWallet, { 'wallet.wid': v.wid }, '确认要解冻该账户吗?', '解冻成功');
            else if (ev === 'withdraw') openWithdraw(v);
            else if (ev === 'transfer') openTransfer(v);
            else if (ev === 'cards') { app.params.payment = { wid: v.wid, phone: v.phone }; app.popup(api.index.walletardIndex.url, '银行卡'); }
            else if (ev === 'walletran') { app.params.payment = { wid: v.wid }; app.popup(api.index.walletranIndex.url, '交易记录'); }
            else if (ev === 'walletres') { app.params.payment = { wid: v.wid }; app.popup(api.index.walletresIndex.url, '资源'); }
        });
    }
    function confirmAct(url, opts, msg, ok) { app.showConfirm(msg, function () { app.post(url, opts, function () { app.showAlert(app.success, ok); query(state.page); }); }); }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageWallet, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function codeRow(label, name) { return '<div class="layui-form-item"><label class="layui-form-label">' + label + '<\/label><div class="layui-input-inline"><input class="layui-input" name="' + name + '"><\/div><div class="layui-input-inline"><button type="button" class="layui-btn layui-btn-primary btnCode">获取验证码<\/button><\/div><\/div>'; }
    function bindCode() { var cd = 60; $('.btnCode').on('click', function () { var btn = $(this); if (btn.attr('disabled')) return; btn.attr('disabled', true); var t = setInterval(function () { if (cd <= 0) { clearInterval(t); btn.text('获取验证码').attr('disabled', false); cd = 60; } else { btn.text(cd + 's'); cd--; } }, 1000); }); }
    function openBind(v, isUpdate) {
        var html = '<div class="layui-form" style="padding:20px;" id="bindForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">电话</label><div class="layui-input-block"><input class="layui-input" name="phone" value="' + (v.phone || '') + '" ' + (isUpdate ? '' : 'disabled') + '></div></div>'
            + codeRow('验证码', 'code') + '</div>';
        layer.open({ type: 1, title: isUpdate ? '更新信息' : '绑定信息', content: html, area: ['500px', 'auto'], btn: ['确定', '取消'], success: bindCode, yes: function (i) {
            var f = {}; $('#bindForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            if (f.code != PHONE_CODE) { app.showAlert(app.error, '验证码错误'); return; }
            var url = isUpdate ? api.payment.updateWallet : api.payment.confirmWallet;
            var opts = { 'wallet.wid': v.wid }; if (isUpdate) opts['wallet.phone'] = f.phone;
            app.post(url, opts, function () { layer.close(i); app.showAlert(app.success, '操作成功'); query(state.page); });
        } });
    }
    function openWithdraw(v) {
        app.post(api.payment.queryWalletard, { 'walletard.wid': v.wid }, function (res) {
            var cards = res.walletards || []; var opts = cards.map(function (c) { return '<option value="' + c.wcid + '">' + c.bankName + ' ' + c.bankNo + '<\/option>'; }).join('');
            var html = '<div class="layui-form" style="padding:20px;" id="wdForm">'
                + '<div class="layui-form-item"><label class="layui-form-label">余额</label><div class="layui-input-block"><input class="layui-input" value="' + app.formatMoney(v.balance) + '" disabled></div></div>'
                + '<div class="layui-form-item"><label class="layui-form-label">银行卡</label><div class="layui-input-block"><select name="wcid">' + opts + '</select></div></div>'
                + '<div class="layui-form-item"><label class="layui-form-label">提现金额</label><div class="layui-input-block"><input class="layui-input" name="amount" data-rule="required"></div></div>'
                + codeRow('验证码', 'code') + '</div>';
            layer.open({ type: 1, title: '提现 - ' + v.no, content: html, area: ['500px', 'auto'], btn: ['提现', '取消'], success: bindCode, yes: function (i) {
                var f = {}; $('#wdForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
                if (!f.amount || parseFloat(f.amount) <= 0) { app.showAlert(app.warning, '金额需大于零'); return; }
                if (parseFloat(f.amount) > parseFloat(v.balance)) { app.showAlert(app.warning, '提现金额不能大于余额'); return; }
                if (f.code != PHONE_CODE) { app.showAlert(app.error, '验证码错误'); return; }
                app.post(api.payment.withdrawWallet, { 'wallet.wid': v.wid, 'wallet.amount': f.amount }, function () { layer.close(i); app.showAlert(app.success, '提现成功'); query(state.page); });
            } });
        });
    }
    function openTransfer(v) {
        var html = '<div class="layui-form" style="padding:20px;" id="tfForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">转入钱包编号</label><div class="layui-input-block"><input class="layui-input" name="no" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">转账金额</label><div class="layui-input-block"><input class="layui-input" name="amount" data-rule="required"></div></div>'
            + codeRow('验证码', 'code') + '</div>';
        layer.open({ type: 1, title: '转账 - ' + v.no, content: html, area: ['500px', 'auto'], btn: ['转账', '取消'], success: bindCode, yes: function (i) {
            var f = {}; $('#tfForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            if (!f.amount || parseFloat(f.amount) <= 0) { app.showAlert(app.warning, '金额需大于零'); return; }
            if (parseFloat(f.amount) > parseFloat(v.balance)) { app.showAlert(app.warning, '转账金额不能大于余额'); return; }
            if (f.code != PHONE_CODE) { app.showAlert(app.error, '验证码错误'); return; }
            app.post(api.payment.transferWallet, { 'wallet.wid': v.wid, 'wallet.amount': f.amount, 'tallet.no': f.no }, function () { layer.close(i); app.showAlert(app.success, '转账成功'); query(state.page); });
        } });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
