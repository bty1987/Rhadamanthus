/** app/js/payment/salesPayment.js —— 销售款
 *  上下文：app.params.salesPayment = { paytype }。
 *  type: 0=定金,1=补款,2=全额,3=退货,4=全退,5=券退,6=定金退。status: 0=初始,1=已付款,3=已确认,4=已结算。
 *  collect/refund/update 通道：salesPayment.referMoney + salesReceipt.cash/bank/checkv/advance/coupon。
 *  settle/withdraw/cancel/confirm/affirm + send/push + 退款定金(refundSalesPaymentForDeposit)/退款券(refundSalesPaymentForCoupon)。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '定金', 1: '补款', 2: '全额', 3: '退货', 4: '全退', 5: '券退', 6: '定金退' };
    var STATUS = { 0: '初始', 1: '已付款', 3: '已确认', 4: '已结算' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 4 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-orange' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'sales.no', title: '销售单号', width: 150, templet: function (d) { return d.sales ? d.sales.no : ''; } }, { field: 'sales.orderId', title: '装修单号', width: 140, templet: function (d) { return d.sales ? d.sales.orderId : ''; } }, { field: 'sales.brand.name', title: '品牌', width: 130, templet: function (d) { return d.sales && d.sales.brand ? d.sales.brand.name : ''; } }, { field: 'type', title: '类型', width: 80, templet: tpB }, { field: 'referMoney', title: '应收', width: 100, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'salesReceipt.realMoney', title: '实收', width: 100, templet: function (d) { return app.formatMoney(d.salesReceipt ? d.salesReceipt.realMoney : 0); } }, { field: 'sales.maling', title: '抹零', width: 80, templet: function (d) { return d.sales ? app.formatMoney(d.sales.maling) : '0'; } }, { field: 'sales.coupon', title: '券', width: 80, templet: function (d) { return d.sales ? app.formatMoney(d.sales.coupon) : '0'; } }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'comment', title: '备注', minWidth: 140 }, { title: '操作', width: 540, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (ev === 'collect') { if (v.status != 0) { app.showAlert(app.warning, '仅初始可收款'); return; } openTrans(v, 'collect'); }
            else if (ev === 'refund') openTrans(v, 'refund');
            else if (ev === 'update') openTrans(v, 'update');
            else if (ev === 'settle') confirmAct(api.payment.settleSalesPayment, { 'salesPayment.spid': v.spid }, '确认结算?', '结算成功');
            else if (ev === 'withdraw') confirmAct(api.payment.withdrawSalesPayment, { 'salesPayment.spid': v.spid }, '确认撤款?', '撤款成功');
            else if (ev === 'print') { app.params.payment = { srId: v.srId }; app.popup(api.index.salesPaymentReceiptIndex.url, '销售款收款收据'); }
            else if (ev === 'wechat') app.showConfirm('是否发送付款通知', function () { app.post(api.payment.sendSalesPayment, { 'salesPayment.spid': v.spid }, function () { app.showAlert(app.info, '发送成功'); }); });
        });
    }
    function confirmAct(url, opts, msg, ok) { app.showConfirm(msg, function () { app.post(url, opts, function () { app.showAlert(app.success, ok); query(state.page); }); }); }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageSalesPayment, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openTrans(v, mode) {
        var titleMap = { collect: '收款', refund: '退款', update: '更新' };
        var html = '<div class="layui-form" style="padding:20px;" id="transForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">应收</label><div class="layui-input-block"><input class="layui-input" name="referMoney" value="' + app.formatMoney(v.referMoney) + '"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">现金</label><div class="layui-input-block"><input class="layui-input" name="cash" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">刷卡</label><div class="layui-input-block"><input class="layui-input" name="bank" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">银行</label><div class="layui-input-block"><input class="layui-input" name="checkv" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">预付款</label><div class="layui-input-block"><input class="layui-input" name="advance" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">券额</label><div class="layui-input-block"><input class="layui-input" name="coupon" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">备注</label><div class="layui-input-block"><input class="layui-input" name="comment"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: titleMap[mode] + ' - ' + (v.sales ? v.sales.no : ''), content: html, area: ['500px', 'auto'], btn: [titleMap[mode], '取消'], yes: function (i) {
            var f = {}; $('#transForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            var url = mode === 'collect' ? api.payment.collectSalesPayment : (mode === 'refund' ? api.payment.refundSalesPayment : api.payment.updateSalesPayment);
            var opts = { 'salesPayment.spid': v.spid, 'salesPayment.referMoney': f.referMoney, 'salesReceipt.cash': f.cash, 'salesReceipt.bank': f.bank, 'salesReceipt.checkv': f.checkv, 'salesReceipt.advance': f.advance, 'salesReceipt.coupon': f.coupon, 'salesReceipt.comment': f.comment };
            app.post(url, opts, function () { layer.close(i); app.showAlert(app.success, titleMap[mode] + '成功'); query(state.page); });
        } });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
