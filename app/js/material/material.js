/** app/js/material/material.js —— 主材子订单（按装修单列出，多操作入口）
 * 上下文：app.params.materialOrder = {orderId, customerId, customerName, designerId, designerName, orderAddr, hid}。
 * 操作跳转的子页同样通过 app.params 传递 mid 及订单上下文。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var ctx = app.params.materialOrder || {};
    var STATUS = { 0: '初始', 2: '退货', 3: '预结', 4: '结算' };
    var TYPE = { 1: '标准', 2: '员工自购', 3: '老总关系' };
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 0 ? 'layui-bg-green' : d.status == 4 ? 'layui-bg-gray' : 'layui-bg-orange'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    function tpB(d) { return TYPE[d.type] || '-'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '主材单号', width: 140 }, { field: 'category', title: '品类', width: 120 }, { field: 'brand', title: '品牌', width: 140 }, { field: 'type', title: '类型', width: 100, templet: tpB }, { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } }, { field: 'distotal', title: '折扣总价', width: 100, templet: function (d) { return app.formatMoney(d.distotal); } }, { field: 'depositPayment', title: '定金', width: 100, templet: function (d) { return app.formatMoney(d.depositPayment); } }, { field: 'fullPayment', title: '补款', width: 100, templet: function (d) { return app.formatMoney(d.fullPayment); } }, { field: 'maling', title: '抹零', width: 90 }, { field: 'venderMaling', title: '厂商抹零', width: 90 }, { field: 'coupon', title: '券额', width: 90 }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'comment', title: '备注', minWidth: 140 }, { title: '操作', width: 380, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'add') goAdd(v);
            else if (ev === 'sub') goDetail(v);
            else if (ev === 'money') openMoney(v);
            else if (ev === 'collect') goCollect(v);
            else if (ev === 'refund') goRefund(v);
            else if (ev === 'print') goPrint(v);
            else if (ev === 'activity') goActivity(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        if (!ctx.orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }
        app.post(api.material.pageMaterialByUserId, $.extend({}, bF(), { 'material.orderId': ctx.orderId, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function passCtx(v) { app.params.materialSubOrder = { msoId: v.mid, msoNo: v.no, depositStatus: v.depositStatus, fullStatus: v.fullStatus, customerId: v.customer ? v.customer.no : '', customerName: v.customer ? v.customer.name : '', materialBrand: v.brand, maling: v.maling, venderMaling: v.venderMaling, orderId: ctx.orderId, designerId: ctx.designerId, designerName: ctx.designerName, orderAddr: ctx.orderAddr, hid: ctx.hid, customerCid: v.customer ? v.customer.cid : '' }; }
    function goAdd(v) { if (v.fullStatus == 4) { app.showAlert(app.warning, '补款提交正在审批中，不允许添项'); return; } passCtx(v); app.params.materialSaleType = 'add'; app.switchPage(api.index.materialAddIndex.url); }
    function goDetail(v) { passCtx(v); app.switchPage(api.index.materialDetailIndex.url); }
    function goCollect(v) { passCtx(v); app.params.historyPage = api.index.materialIndex.url; app.switchPage(api.index.materialCollectionIndex.url); }
    function goRefund(v) { passCtx(v); app.switchPage(api.index.materialRefundIndex.url); }
    function goActivity(v) { app.params.materialActivity = { orderId: v.orderId, mid: v.mid, no: v.no, activityId: v.activityId }; app.switchPage(api.index.materialActivityIndex.url); }
    function goPrint(v) { app.params.materialReceipt = { type: 1, msoId: v.mid }; app.popup(api.index.materialReceipt.url, '主材销售收据', null, { area: ['900px', '600px'] }); }
    function openMoney(v) {
        if (v.fullStatus == 4) { app.showAlert(app.warning, '补款正在审批'); return; }
        var html = '<div class="layui-form" style="padding:20px;">'
            + '<div class="layui-form-item"><label class="layui-form-label">总价</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(v.total) + '" disabled></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">定金</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(v.depositPayment) + '" disabled></div><div class="layui-input-inline"><button type="button" class="layui-btn" id="mBtnDeposit">交款</button></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">补款</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(v.fullPayment) + '" disabled></div><div class="layui-input-inline"><button type="button" class="layui-btn" id="mBtnFull">交款</button></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">券额</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(v.coupon) + '" disabled></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">抹零</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(app.utils.accAdd(v.maling, v.venderMaling)) + '" disabled></div></div>'
            + '</div>';
        var idx = layer.open({ type: 1, title: '款项 - ' + v.no, content: html, area: ['600px', 'auto'], btn: ['关闭'] });
        $('#mBtnDeposit').on('click', function () { doPay(v, 2, idx); });
        $('#mBtnFull').on('click', function () { doPay(v, 3, idx); });
    }
    function doPay(v, paymentType, idx) {
        layer.prompt({ title: '请输入收款金额', value: app.formatMoney(paymentType == 2 ? v.depositPayment : v.fullPayment) }, function (val, i) {
            if (!/^\d+(\.\d{1,2})?$/.test(val) || parseFloat(val) <= 0) { app.showAlert(app.error, '金额格式错误'); return; }
            app.post(api.payment.addMaterialPaymentForDeposit, { 'materialPayment.material.mid': v.mid, 'materialPayment.paymentType': paymentType, 'materialPayment.referMoney': val }, function () {
                layer.close(i); if (idx) layer.close(idx); app.showAlert(app.success, '收款成功'); query(state.page);
            });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(api.index.decorationMaterialIndex.url); });
});
}); // end app.ready
