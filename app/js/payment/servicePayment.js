/** app/js/payment/servicePayment.js —— 服务款
 *  上下文：app.params.servicePayment = { paytype }。
 *  type: 0=服务费,1=预付款。status: 0=初始,1=已付款,3=已确认。
 *  collect/refund/update 通道：servicePayment.referMoney + serviceReceipt.cash/bank/checkv/advance。
 *  收款(collectServicePayment)、退款(refundServicePaymentForService)、更新(updateServicePayment)、send、print。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '服务费', 1: '预付款' };
    var STATUS = { 0: '初始', 1: '已付款', 3: '已确认' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 3 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-orange' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'decoration.orderId', title: '装修单号', width: 160, templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } }, { field: 'decoration.customer.name', title: '客户', width: 110, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } }, { field: 'type', title: '类型', width: 90, templet: tpB }, { field: 'serviceMoney', title: '服务费', width: 100, templet: function (d) { return app.formatMoney(d.serviceMoney); } }, { field: 'advanceMoney', title: '预付款', width: 100, templet: function (d) { return app.formatMoney(d.advanceMoney); } }, { field: 'serviceReceipt.realMoney', title: '实收', width: 100, templet: function (d) { return app.formatMoney(d.serviceReceipt ? d.serviceReceipt.realMoney : 0); } }, { field: 'serviceReceipt.cash', title: '现金', width: 80, templet: function (d) { return app.formatMoney(d.serviceReceipt ? d.serviceReceipt.cash : 0); } }, { field: 'serviceReceipt.bank', title: '刷卡', width: 80, templet: function (d) { return app.formatMoney(d.serviceReceipt ? d.serviceReceipt.bank : 0); } }, { field: 'serviceReceipt.advance', title: '预付', width: 80, templet: function (d) { return app.formatMoney(d.serviceReceipt ? d.serviceReceipt.advance : 0); } }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'comment', title: '备注', minWidth: 140 }, { title: '操作', width: 460, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (ev === 'collect') { if (v.status != 0) { app.showAlert(app.warning, '仅初始可收款'); return; } openTrans(v, 'collect'); }
            else if (ev === 'refund') openTrans(v, 'refund');
            else if (ev === 'update') openTrans(v, 'update');
            else if (ev === 'print') { app.params.payment = { orderId: v.decoration.orderId, serId: v.serviceReceipt ? v.serviceReceipt.srId : '' }; app.popup(api.index.servicePaymentReceiptIndex.url, '服务款收款收据'); }
            else if (ev === 'wechat') app.showConfirm('是否发送付款通知', function () { app.post(api.payment.sendServicePayment, { 'servicePayment.spid': v.spid }, function () { app.showAlert(app.info, '发送成功'); }); });
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageServicePayment, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
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
            + '<div class="layui-form-item"><label class="layui-form-label">备注</label><div class="layui-input-block"><input class="layui-input" name="comment"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: titleMap[mode] + ' - ' + (v.decoration ? v.decoration.orderId : ''), content: html, area: ['500px', 'auto'], btn: [titleMap[mode], '取消'], yes: function (i) {
            var f = {}; $('#transForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            var url = mode === 'collect' ? api.payment.collectServicePayment : (mode === 'refund' ? api.payment.refundServicePaymentForService : api.payment.updateServicePayment);
            var opts = { 'servicePayment.spid': v.spid, 'servicePayment.referMoney': f.referMoney, 'serviceReceipt.cash': f.cash, 'serviceReceipt.bank': f.bank, 'serviceReceipt.checkv': f.checkv, 'serviceReceipt.advance': f.advance, 'serviceReceipt.comment': f.comment };
            app.post(url, opts, function () { layer.close(i); app.showAlert(app.success, titleMap[mode] + '成功'); query(state.page); });
        } });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
