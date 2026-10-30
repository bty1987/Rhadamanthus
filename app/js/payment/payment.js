/** app/js/payment/payment.js —— 预付款（合同/主材预付款账户的收款/提款/更新/确认）
 *  上下文：app.params.paymentPage = { paytype, depage?, profit? }。
 *  type: 0=提款, 1=收款。paymentType: 1=合同额, 2=主材额。status: 0=初始, 1=已付款, 2=已确认。
 *  collect/withdraw/update 三通道：payment.cash/bank/checkv，实收合计需校验（收款>0；提款=提款额；更新=原额）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var ctx = app.params.paymentPage || {};
    var AT = { 0: '提款', 1: '收款' };
    var APT = { 1: '合同额', 2: '主材额' };
    var STATUS = { 0: '初始', 1: '已付款', 2: '已确认' };
    function atB(d) { return AT[d.type] || '-'; }
    function apB(d) { return APT[d.paymentType] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 2 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-blue' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 }, { type: 'numbers', title: '#', width: 60 }, { field: 'decoration.orderId', title: '装修单号', width: 160, templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } }, { field: 'decoration.customer.name', title: '客户', width: 110, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } }, { field: 'type', title: '收款类型', width: 90, templet: atB }, { field: 'paymentType', title: '预付款类型', width: 100, templet: apB }, { field: 'recharge', title: '操作金额', width: 110, templet: function (d) { return app.formatMoney(d.recharge); } }, { field: 'balance', title: '余额', width: 110, templet: function (d) { return app.formatMoney(d.balance); } }, { field: 'realMoney', title: '实收额', width: 110, templet: function (d) { return app.formatMoney(d.realMoney); } }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'comment', title: '备注', minWidth: 140 }, { title: '操作', width: 400, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (ev === 'collect') { if (v.type != 1 || v.status != 0) { app.showAlert(app.warning, '仅初始收款可操作'); return; } openTrans(v, 'collect'); }
            else if (ev === 'withdraw') { if (v.type != 0 || v.status != 0) { app.showAlert(app.warning, '仅初始提款可操作'); return; } openTrans(v, 'withdraw'); }
            else if (ev === 'update') { if (v.status != 1) { app.showAlert(app.warning, '仅已付款可更新'); return; } openTrans(v, 'update'); }
            else if (ev === 'print') { app.params.payment = { pid: v.pid, orderId: v.decoration.orderId, cid: v.decoration.customer.cid, profit: ctx.profit }; app.popup(api.index.paymentReceiptIndex.url, '专用收款收据'); }
            else if (ev === 'wechat') app.showConfirm('是否发送付款通知', function () { app.post(api.payment.sendPayment, { 'payment.pid': v.pid }, function () { app.showAlert(app.info, '发送成功'); }); });
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        var extra = {};
        if (ctx.depage) extra['payment.company'] = ctx.depage;
        app.post(api.payment.pagePayment, $.extend({}, bF(), extra, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openTrans(v, mode) {
        var titleMap = { collect: '收款', withdraw: '提款', update: '更新' };
        var html = '<div class="layui-form" style="padding:20px;" id="transForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">应收</label><div class="layui-input-block"><input class="layui-input" value="' + app.formatMoney(v.recharge) + '" disabled></div></div>'
            + (mode == 'withdraw' ? '<div class="layui-form-item"><label class="layui-form-label">余额</label><div class="layui-input-block"><input class="layui-input" id="wdBalance" value="' + app.formatMoney(v.balance) + '" disabled></div></div><div class="layui-form-item"><label class="layui-form-label">提款额</label><div class="layui-input-block"><input class="layui-input" id="wdAmount" data-rule="required"></div></div>' : '')
            + '<div class="layui-form-item"><label class="layui-form-label">现金</label><div class="layui-input-block"><input class="layui-input" name="cash" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">刷卡</label><div class="layui-input-block"><input class="layui-input" name="bank" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">银行</label><div class="layui-input-block"><input class="layui-input" name="checkv" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">备注</label><div class="layui-input-block"><input class="layui-input" name="comment"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: titleMap[mode] + ' - ' + (v.decoration ? v.decoration.orderId : ''), content: html, area: ['500px', 'auto'], btn: [titleMap[mode], '取消'], yes: function (i) {
            var f = {}; $('#transForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            var real = app.utils.accAdd(app.utils.accAdd(parseFloat(f.cash) || 0, parseFloat(f.bank) || 0), parseFloat(f.checkv) || 0);
            var url, opts = { 'payment.customer.cid': v.decoration.customer.cid, 'payment.paymentType': v.paymentType, 'payment.orderId': v.decoration.orderId, 'payment.realMoney': real, 'payment.cash': f.cash, 'payment.bank': f.bank, 'payment.checkv': f.checkv, 'payment.comment': f.comment, 'payment.uniqueid': new Date().getTime() };
            if (mode == 'collect') { if (real <= 0) { app.showAlert(app.warning, '收款金额需大于零'); return; } url = api.payment.collectPayment; opts['payment.type'] = 1; }
            else if (mode == 'withdraw') { var wd = parseFloat($('#wdAmount').val()); if (!(wd > 0)) { app.showAlert(app.warning, '提款金额需大于零'); return; } if (wd > parseFloat(v.balance)) { app.showAlert(app.warning, '提款金额不能大于余额'); return; } if (Math.abs(real - wd) > 0.01) { app.showAlert(app.warning, '提款项合计与提款额不等'); return; } url = api.payment.withdrawPayment; opts['payment.type'] = 0; }
            else { var hist = app.utils.accAdd(app.utils.accAdd(parseFloat(v.cash) || 0, parseFloat(v.bank) || 0), parseFloat(v.checkv) || 0); if (Math.abs(real - hist) > 0.01) { app.showAlert(app.warning, '更新金额与原收款不等'); return; } url = api.payment.updatePayment; opts['payment.pid'] = v.pid; delete opts['payment.type']; delete opts['payment.uniqueid']; }
            app.post(url, opts, function (res) { layer.close(i); app.showAlert(app.success, titleMap[mode] + '成功'); query(state.page); if (mode == 'collect') { app.showConfirm('是否打印收据?', function () { app.params.payment = { pid: res.payment.pid, orderId: res.payment.orderId, cid: res.payment.customer.cid, profit: ctx.profit }; app.popup(api.index.paymentReceiptIndex.url, '专用收款收据'); }); } });
        } });
    }
    $('#btnCreate').on('click', function () {
        layer.prompt({ title: '请输入装修单号' }, function (orderId, i) {
            app.post(api.payment.addAdvancePayment, { 'advancePayment.decoration.orderId': orderId }, function () { layer.close(i); app.showAlert(app.success, '创建成功'); query(state.page); });
        });
    });
    $('#btnGen').on('click', function () {
        var html = '<div class="layui-form" style="padding:20px;" id="genForm"><div class="layui-form-item"><label class="layui-form-label">装修单号</label><div class="layui-input-block"><input class="layui-input" name="orderId" data-rule="required"></div></div><div class="layui-form-item"><label class="layui-form-label">类型</label><div class="layui-input-block"><select name="paymentType"><option value="1">合同额</option><option value="2">主材额</option></select></div></div><div class="layui-form-item"><label class="layui-form-label">金额</label><div class="layui-input-block"><input class="layui-input" name="money" data-rule="required"></div></div></div>';
        layer.open({ type: 1, title: '生成预付款', content: html, area: ['500px', 'auto'], btn: ['生成', '取消'], yes: function (i) {
            var f = {}; $('#genForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            app.post(api.payment.addPayment, { 'payment.orderId': f.orderId, 'payment.paymentType': f.paymentType, 'payment.recharge': f.money }, function () { layer.close(i); app.showAlert(app.success, '生成成功'); query(state.page); });
        } });
    });
    $('#btnConfirm').on('click', function () {
        var ck = table.checkStatus('resultTable').data;
        if (!ck.length) { app.showAlert(app.warning, '请选择要确认的款项'); return; }
        var opts = {}; ck.forEach(function (v, i) { opts['paymentIds[' + i + ']'] = v.pid; });
        app.showConfirm('确定将选中项置为已确认?', function () { app.post(api.payment.confirmPayment, opts, function () { app.showAlert(app.success, '确认成功'); query(state.page); }); });
    });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
