/** app/js/payment/decorationPayment.js —— 装修款
 *  上下文：app.params.decorationPayment = { paytype }。
 *  paymentStatus: 0=初始,1=已付款,2=已确认,3=落款,4=已结算。oneType: 0=收款,1=退款。
 *  collect/refund/update 通道：decorationPayment.cash/bank/checkv/advance/coupon。
 *  落款(settleDecorationPayment)/撤款(withdrawDecorationPayment)/确认(confirmDecorationPayment)/affirm/print/send/push。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var STATUS = { 0: '初始', 1: '已付款', 2: '已确认', 3: '落款', 4: '已结算' };
    function stB(d) { var s = STATUS[d.paymentStatus] || ('状态' + d.paymentStatus); var c = d.paymentStatus == 4 ? 'layui-bg-green' : d.paymentStatus == 3 ? 'layui-bg-blue' : d.paymentStatus == 1 ? 'layui-bg-orange' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'decoration.orderId', title: '装修单号', width: 160, templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } }, { field: 'decoration.customer.name', title: '客户', width: 100, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } }, { field: 'paymentType', title: '款项', width: 110 }, { field: 'referMoney', title: '应收', width: 110, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'cash', title: '现金', width: 90, templet: function (d) { return app.formatMoney(d.cash); } }, { field: 'bank', title: '刷卡', width: 90, templet: function (d) { return app.formatMoney(d.bank); } }, { field: 'checkv', title: '银行', width: 90, templet: function (d) { return app.formatMoney(d.checkv); } }, { field: 'advance', title: '预付', width: 90, templet: function (d) { return app.formatMoney(d.advance); } }, { field: 'coupon', title: '券', width: 90, templet: function (d) { return app.formatMoney(d.coupon); } }, { field: 'paymentStatus', title: '状态', width: 90, templet: stB }, { field: 'comment', title: '备注', minWidth: 140 }, { title: '操作', width: 560, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (ev === 'collect') { if (v.paymentStatus != 0) { app.showAlert(app.warning, '仅初始状态可收款'); return; } openTrans(v, 'collect'); }
            else if (ev === 'refund') { if (v.paymentStatus != 1 && v.paymentStatus != 2) { app.showAlert(app.warning, '仅已付款/已确认可退款'); return; } openTrans(v, 'refund'); }
            else if (ev === 'update') { if (v.paymentStatus != 1 && v.paymentStatus != 2) { app.showAlert(app.warning, '仅已付款可更新'); return; } openTrans(v, 'update'); }
            else if (ev === 'settle') confirmAct(api.payment.settleDecorationPayment, { 'decorationPayment.dpId': v.dpId }, '确认落款?', '落款成功');
            else if (ev === 'withdraw') confirmAct(api.payment.withdrawDecorationPayment, { 'decorationPayment.dpId': v.dpId }, '确认撤款?', '撤款成功');
            else if (ev === 'print') { app.params.payment = { orderId: v.decoration.orderId, drId: v.drId }; app.popup(api.index.decorationPaymentReceiptIndex.url, '装修款收款收据'); }
            else if (ev === 'wechat') app.showConfirm('是否发送付款通知', function () { app.post(api.payment.sendDecorationPayment, { 'decorationPayment.dpId': v.dpId }, function () { app.showAlert(app.info, '发送成功'); }); });
        });
    }
    function confirmAct(url, opts, msg, ok) { app.showConfirm(msg, function () { app.post(url, opts, function () { app.showAlert(app.success, ok); query(state.page); }); }); }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageDecorationPayment, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openTrans(v, mode) {
        var titleMap = { collect: '收款', refund: '退款', update: '更新' };
        var html = '<div class="layui-form" style="padding:20px;" id="transForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">应收</label><div class="layui-input-block"><input class="layui-input" value="' + app.formatMoney(v.referMoney) + '" disabled></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">现金</label><div class="layui-input-block"><input class="layui-input" name="cash" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">刷卡</label><div class="layui-input-block"><input class="layui-input" name="bank" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">银行</label><div class="layui-input-block"><input class="layui-input" name="checkv" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">预付款</label><div class="layui-input-block"><input class="layui-input" name="advance" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">券额</label><div class="layui-input-block"><input class="layui-input" name="coupon" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">备注</label><div class="layui-input-block"><input class="layui-input" name="comment"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: titleMap[mode] + ' - ' + v.paymentType, content: html, area: ['500px', 'auto'], btn: [titleMap[mode], '取消'], yes: function (i) {
            var f = {}; $('#transForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            var real = parseFloat(f.cash) || 0; ['bank', 'checkv', 'advance', 'coupon'].forEach(function (k) { real = app.utils.accAdd(real, parseFloat(f[k]) || 0); });
            var url = mode === 'collect' ? api.payment.collectDecorationPayment : (mode === 'refund' ? api.payment.refundDecorationPayment : api.payment.updateDecorationPayment);
            var opts = { 'decorationPayment.dpId': v.dpId, 'decorationPayment.cash': f.cash, 'decorationPayment.bank': f.bank, 'decorationPayment.checkv': f.checkv, 'decorationPayment.advance': f.advance, 'decorationPayment.coupon': f.coupon, 'decorationPayment.comment': f.comment };
            if (mode == 'collect') { if (real <= 0) { app.showAlert(app.warning, '收款金额需大于零'); return; } }
            app.post(url, opts, function () { layer.close(i); app.showAlert(app.success, titleMap[mode] + '成功'); query(state.page); });
        } });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
