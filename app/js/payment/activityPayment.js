/** app/js/payment/activityPayment.js —— 活动收款
 *  列表 + 添加活动款（createActivityPayment）+ 收款弹窗（collectActivityPayment，现金/刷卡/券三通道）+ 打印。
 *  type: 0=定金,1=补款,2=全额。status: 0=初始,1=已付款。
 *  collect 三通道：activityReceipt.cash/bank/coupon，实收合计需等于 referMoney。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '定金', 1: '补款', 2: '全额' };
    var STATUS = { 0: '初始', 1: '已付款' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 1 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    laydate.render({ elem: '#createTime' });
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'mno', title: '会员号', width: 140 }, { field: 'orderId', title: '订单号', width: 150 }, { field: 'type', title: '类型', width: 80, templet: tpB }, { field: 'brand', title: '品牌', width: 140 }, { field: 'category', title: '品类', width: 120 }, { field: 'money', title: '金额', width: 110, templet: function (d) { return app.formatMoney(d.money); } }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'comment', title: '备注', minWidth: 140 }, { field: 'createTime', title: '创建时间', width: 170 }, { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data;
            if (obj.event === 'collect') { if (v.status != 0) { app.showAlert(app.warning, '仅初始状态可收款'); return; } openCollect(v); }
            else if (obj.event === 'print') { app.params.payment = { activityPayment: v }; app.popup(api.index.activityPaymentReceiptIndex.url, '专用收款收据'); }
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageActivityPayment, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openCollect(v) {
        var html = '<div class="layui-form" style="padding:20px;" id="colForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">应收金额</label><div class="layui-input-block"><input class="layui-input" value="' + app.formatMoney(v.money) + '" disabled></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">现金</label><div class="layui-input-block"><input class="layui-input" name="cash" value="0" placeholder="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">刷卡</label><div class="layui-input-block"><input class="layui-input" name="bank" value="0" placeholder="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">券额</label><div class="layui-input-block"><input class="layui-input" name="coupon" value="0" placeholder="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">备注</label><div class="layui-input-block"><input class="layui-input" name="comment"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: '收款 - ' + v.mno, content: html, area: ['500px', 'auto'], btn: ['收款', '取消'], yes: function (i) {
            var f = {}; $('#colForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            var real = app.utils.accAdd(app.utils.accAdd(parseFloat(f.cash) || 0, parseFloat(f.bank) || 0), parseFloat(f.coupon) || 0);
            if (Math.abs(real - parseFloat(v.money)) > 0.01) { app.showAlert(app.warning, '实收合计与应收不等'); return; }
            var opts = { 'activityReceipt.cash': f.cash, 'activityReceipt.bank': f.bank, 'activityReceipt.coupon': f.coupon, 'activityReceipt.comment': f.comment, 'activityPayments[0].apid': v.apid };
            app.post(api.payment.collectActivityPayment, opts, function () { layer.close(i); app.showAlert(app.success, '收款成功'); query(state.page); });
        } });
    }
    $('#btnAdd').on('click', function () {
        var html = '<div class="layui-form" style="padding:20px;" id="addForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">会员号</label><div class="layui-input-block"><input class="layui-input" name="mno" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">订单号</label><div class="layui-input-block"><input class="layui-input" name="orderId"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">类型</label><div class="layui-input-block"><select name="type"><option value="0">定金</option><option value="1">补款</option><option value="2">全额</option></select></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">品牌</label><div class="layui-input-block"><input class="layui-input" name="brand"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">金额</label><div class="layui-input-block"><input class="layui-input" name="money" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">备注</label><div class="layui-input-block"><input class="layui-input" name="comment"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: '添加活动款', content: html, area: ['500px', 'auto'], btn: ['保存', '取消'], yes: function (i) {
            var f = {}; $('#addForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            if (!f.mno || !f.money) { app.showAlert(app.warning, '请填写必填项'); return; }
            app.post(api.payment.createActivityPayment, { 'activityPayment.mno': f.mno, 'activityPayment.orderId': f.orderId, 'activityPayment.type': f.type, 'activityPayment.brand': f.brand, 'activityPayment.money': f.money, 'activityPayment.comment': f.comment }, function () { layer.close(i); app.showAlert(app.success, '添加成功'); query(state.page); });
        } });
    });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
