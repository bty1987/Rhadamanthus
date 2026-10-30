/** app/js/payment/kingdeeRecord.js —— 金蝶同步记录（按订单号/创建时间筛选，查看款项明细弹窗）
 *  atttype: 0=合同预付款,1=主材预付款,2=装修款,3=销售款,4=服务款,6=外销款,-1=未知。
 *  操作"款项信息"：依据 atttype 调对应 query 接口，弹窗展示装修单号/类型/金额/通道明细/收付款人。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var ATTTYPES = { 0: '合同预付款', 1: '主材预付款', 2: '装修款', 3: '销售款', 4: '服务款', 6: '外销款', '-1': '未知' };
    function attB(d) { return ATTTYPES[d.atttype] || '-'; }
    laydate.render({ elem: '#createTime' });
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'rtid', title: '收据ID', width: 90 }, { field: 'orderId', title: '订单号', width: 160 }, { field: 'atttype', title: '属性类型', width: 110, templet: attB }, { field: 'type', title: '款项类型', width: 110 }, { field: 'createTime', title: '创建时间', width: 170 }, { field: 'message', title: '错误信息', minWidth: 200 }, { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'info') showInfo(obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageKingdeeRecord, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function row(label, val) { return '<p style="line-height:24px;"><label style="display:inline-block;width:90px;color:#666;">' + label + '：<\/label><span>' + (val == null ? '' : val) + '<\/span><\/p>'; }
    function receiptBlock(p) { var h = ''; if (p.cash > 0) h += row('现金', app.formatMoney(p.cash)); if (p.bank > 0) h += row('刷卡', app.formatMoney(p.bank)); if (p.checkv > 0) h += row('银行', app.formatMoney(p.checkv)); if (p.advance > 0) h += row('预付款', app.formatMoney(p.advance)); if (p.coupon > 0) h += row('优惠券', app.formatMoney(p.coupon)); return h; }
    function showInfo(v) {
        if (v.atttype == -1 || !(v.rtid > 0)) { app.showAlert(app.warning, '无款项信息'); return; }
        var html = '<div style="padding:16px;">';
        if (v.atttype == 0) {
            app.post(api.payment.queryPaymentByArid, { 'payment.arId': v.rtid }, function (res) {
                var p = res.payment || {}; var t = { 0: '收款', 1: '提款' }; var pt = { 1: '合同额', 2: '主材额' };
                html += row('装修单号', p.decoration.orderId) + row('收款类型', t[p.type]) + row(pt[p.paymentType] || '类型', app.formatMoney(p.recharge)) + receiptBlock(p);
                html += row('收款人', p.collecter.currentName) + row('收款时间', p.collectTime) + row('确认人', p.confirmer.currentName) + row('确认时间', p.confirmTime);
                html += '<\/div>'; layer.open({ type: 1, title: '款项信息', content: html, area: ['480px', 'auto'], btn: ['关闭'] });
            });
        } else if (v.atttype == 2) {
            app.post(api.payment.queryDecorationPaymentForNotInitByDrId, { 'decorationReceipt.drId': v.rtid }, function (res) {
                var p = (res.decorationPayments || [])[0] || {};
                html += row('装修单号', p.decoration.orderId) + row(p.paymentType, app.formatMoney(p.referMoney)) + receiptBlock(p);
                html += row('收款人', p.collecter.currentName) + row('收款时间', p.collectTime) + row('确认人', p.confirmer.currentName) + row('确认时间', p.confirmTime);
                html += '<\/div>'; layer.open({ type: 1, title: '款项信息', content: html, area: ['480px', 'auto'], btn: ['关闭'] });
            });
        } else if (v.atttype == 3) {
            app.post(api.payment.querySalesPaymentForNotInitBySrid, { 'salesReceipt.srId': v.rtid }, function (res) {
                var list = res.salesPayments || []; var p = list[0] || {};
                list.forEach(function (s) { html += row('销售单号 ' + s.sales.no, app.formatMoney(s.referMoney)); });
                html += '<hr>'; html += row('装修单号', p.sales.orderId) + receiptBlock(p.salesReceipt);
                var r = p.salesReceipt || {}; html += row('收款人', r.collecter.currentName) + row('收款时间', r.collectTime);
                html += '<\/div>'; layer.open({ type: 1, title: '款项信息', content: html, area: ['480px', 'auto'], btn: ['关闭'] });
            });
        } else if (v.atttype == 4) {
            app.post(api.payment.queryServicePaymentForNotInitBySrId, { 'serviceReceipt.srId': v.rtid }, function (res) {
                var p = (res.servicePayments || [])[0] || {}; var r = p.serviceReceipt || {};
                html += row('装修单号', p.decoration.orderId) + row('服务费', app.formatMoney(p.serviceMoney)) + receiptBlock(r);
                html += row('收款人', r.collecter.currentName) + row('收款时间', r.collectTime);
                html += '<\/div>'; layer.open({ type: 1, title: '款项信息', content: html, area: ['480px', 'auto'], btn: ['关闭'] });
            });
        } else { app.showAlert(app.warning, '该类型暂不支持查看'); }
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
