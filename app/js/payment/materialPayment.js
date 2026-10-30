/** app/js/payment/materialPayment.js —— 主材款
 *  上下文：app.params.materialPayment = { orderId?, mid?, paytype }。
 *  type: 0=定金,1=补款,2=全额,3=退货,4=全退,5=券退,6=定金退。status: 0=初始,1=已付款,3=已确认,4=已结算。
 *  collect/refund/update 通道：materialPayment.cash/bank/checkv/advance/coupon。
 *  定金/补款（addMaterialPaymentForDeposit/Fullpay）→ 生成收款项；取消（cancelMaterialPaymentForDeposit/Fullpay）。 */
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
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'material.no', title: '主材单号', width: 150, templet: function (d) { return d.material ? d.material.no : ''; } }, { field: 'material.brand.name', title: '品牌', width: 130, templet: function (d) { return d.material && d.material.brand ? d.material.brand.name : ''; } }, { field: 'type', title: '类型', width: 80, templet: tpB }, { field: 'referMoney', title: '应收', width: 100, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'material.decoration.orderId', title: '装修单号', width: 140, templet: function (d) { return d.material && d.material.decoration ? d.material.decoration.orderId : ''; } }, { field: 'cash', title: '现金', width: 80 }, { field: 'bank', title: '刷卡', width: 80 }, { field: 'checkv', title: '银行', width: 80 }, { field: 'advance', title: '预付', width: 80 }, { field: 'coupon', title: '券', width: 80 }, { field: 'status', title: '状态', width: 80, templet: stB }, { field: 'comment', title: '备注', minWidth: 120 }, { title: '操作', width: 430, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (ev === 'deposit') addPay(v, 0);
            else if (ev === 'fullpay') addPay(v, 1);
            else if (ev === 'collect') { if (v.status != 0) { app.showAlert(app.warning, '仅初始可收款'); return; } openTrans(v, 'collect'); }
            else if (ev === 'refund') openTrans(v, 'refund');
            else if (ev === 'update') openTrans(v, 'update');
            else if (ev === 'print') { app.params.payment = { orderId: v.material && v.material.decoration ? v.material.decoration.orderId : '', mrId: v.mrId }; app.popup(api.index.materialPaymentReceiptIndex.url, '主材款收款收据'); }
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        var ctx = app.params.materialPayment || {};
        var extra = {}; if (ctx.mid) { extra['materialPayment.material.mid'] = ctx.mid; }
        app.post(api.payment.pageMaterialPayment, $.extend({}, bF(), extra, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function addPay(v, payType) {
        layer.prompt({ title: payType == 0 ? '请输入定金金额' : '请输入补款金额', value: app.formatMoney(v.referMoney) }, function (val, i) {
            if (!/^\d+(\.\d{1,2})?$/.test(val) || parseFloat(val) <= 0) { app.showAlert(app.error, '金额格式错误'); return; }
            var url = payType == 0 ? api.payment.addMaterialPaymentForDeposit : api.payment.addMaterialPaymentForFullpay;
            app.post(url, { 'materialPayment.material.mid': v.material.mid, 'materialPayment.paymentType': payType, 'materialPayment.referMoney': val }, function () { layer.close(i); app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
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
        layer.open({ type: 1, title: titleMap[mode] + ' - ' + (v.material ? v.material.no : ''), content: html, area: ['500px', 'auto'], btn: [titleMap[mode], '取消'], yes: function (i) {
            var f = {}; $('#transForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            var url = mode === 'collect' ? api.payment.collectMaterialPayment : (mode === 'refund' ? api.payment.refundMaterialPayment : api.payment.updateMaterialPayment);
            var opts = { 'materialPayment.mpId': v.mpId, 'materialPayment.cash': f.cash, 'materialPayment.bank': f.bank, 'materialPayment.checkv': f.checkv, 'materialPayment.advance': f.advance, 'materialPayment.coupon': f.coupon, 'materialPayment.comment': f.comment };
            app.post(url, opts, function () { layer.close(i); app.showAlert(app.success, titleMap[mode] + '成功'); query(state.page); });
        } });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
