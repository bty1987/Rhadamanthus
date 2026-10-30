/** app/js/payment/oalesPayment.js —— 外销款
 *  上下文：app.params.oalesPayment = { paytype }。
 *  type: 0=定金,1=补款,2=全额。status: 0=初始,1=已付款,3=已确认。
 *  collect/refund/update 通道：oalesReceipt.cash/bank/checkv/advance/coupon。
 *  添加(addOalesPayment)、收款(collectOalesPayment)、退款(refundOalesPayment)、更新(updateOalesPayment)、确认/取消、打印。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '定金', 1: '补款', 2: '全额' };
    var STATUS = { 0: '初始', 1: '已付款', 3: '已确认' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 3 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-orange' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'oales.no', title: '外销单号', width: 150, templet: function (d) { return d.oales ? d.oales.no : ''; } }, { field: 'oales.orderId', title: '装修单号', width: 140, templet: function (d) { return d.oales ? d.oales.orderId : ''; } }, { field: 'oales.customer.name', title: '客户', width: 110, templet: function (d) { return d.oales && d.oales.customer ? d.oales.customer.name : ''; } }, { field: 'type', title: '类型', width: 80, templet: tpB }, { field: 'referMoney', title: '应收', width: 100, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'oalesReceipt.realMoney', title: '实收', width: 100, templet: function (d) { return app.formatMoney(d.oalesReceipt ? d.oalesReceipt.realMoney : 0); } }, { field: 'oales.maling', title: '抹零', width: 80, templet: function (d) { return d.oales ? app.formatMoney(d.oales.maling) : '0'; } }, { field: 'oales.coupon', title: '券', width: 80, templet: function (d) { return d.oales ? app.formatMoney(d.oales.coupon) : '0'; } }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'comment', title: '备注', minWidth: 140 }, { title: '操作', width: 320, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (ev === 'collect') { if (v.status != 0) { app.showAlert(app.warning, '仅初始可收款'); return; } openTrans(v, 'collect'); }
            else if (ev === 'refund') openTrans(v, 'refund');
            else if (ev === 'update') openTrans(v, 'update');
            else if (ev === 'print') { app.params.payment = { orId: v.orId }; app.popup(api.index.oalesPaymentReceiptIndex.url, '外销款收款收据'); }
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageOalesPayment, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
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
        layer.open({ type: 1, title: titleMap[mode] + ' - ' + (v.oales ? v.oales.no : ''), content: html, area: ['500px', 'auto'], btn: [titleMap[mode], '取消'], yes: function (i) {
            var f = {}; $('#transForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            var url = mode === 'collect' ? api.payment.collectOalesPayment : (mode === 'refund' ? api.payment.refundOalesPayment : api.payment.updateOalesPayment);
            var opts = { 'oalesReceipt.orId': v.orId, 'oalesReceipt.cash': f.cash, 'oalesReceipt.bank': f.bank, 'oalesReceipt.checkv': f.checkv, 'oalesReceipt.advance': f.advance, 'oalesReceipt.coupon': f.coupon, 'oalesReceipt.comment': f.comment };
            app.post(url, opts, function () { layer.close(i); app.showAlert(app.success, titleMap[mode] + '成功'); query(state.page); });
        } });
    }
    $('#btnAdd').on('click', function () {
        var html = '<div class="layui-form" style="padding:20px;" id="addForm"><div class="layui-form-item"><label class="layui-form-label">装修单号</label><div class="layui-input-block"><input class="layui-input" name="orderId" data-rule="required"></div></div><div class="layui-form-item"><label class="layui-form-label">金额</label><div class="layui-input-block"><input class="layui-input" name="money" data-rule="required"></div></div><div class="layui-form-item"><label class="layui-form-label">类型</label><div class="layui-input-block"><select name="type"><option value="0">定金</option><option value="1">补款</option><option value="2">全额</option></select></div></div></div>';
        layer.open({ type: 1, title: '添加外销款', content: html, area: ['500px', 'auto'], btn: ['添加', '取消'], yes: function (i) {
            var f = {}; $('#addForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            app.post(api.payment.addOalesPayment, { 'oalesPayment.orderId': f.orderId, 'oalesPayment.referMoney': f.money, 'oalesPayment.type': f.type }, function () { layer.close(i); app.showAlert(app.success, '添加成功'); query(state.page); });
        } });
    });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
