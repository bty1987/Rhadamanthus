/** app/js/payment/customer.js —— 客户款项汇总
 *  按装修单号查询三类待收款：装修款（queryDecorationPaymentByOrderId, status=0）、
 *  销售款（querySalesPaymentByOrderId, status=0）、预付款账户（pageAdvancePayment by orderId）。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    table.render({ elem: '#decorationTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'decoration.orderId', title: '装修单号', width: 160, templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } }, { field: 'paymentType', title: '款项', width: 120 }, { field: 'referMoney', title: '应收金额', width: 120, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'decoration.customer.name', title: '客户', width: 120, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } }, { field: 'comment', title: '备注', minWidth: 160 } ]] });
    table.render({ elem: '#salesTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'sales.no', title: '销售单号', width: 160, templet: function (d) { return d.sales ? d.sales.no : ''; } }, { field: 'type', title: '类型', width: 90 }, { field: 'referMoney', title: '应收金额', width: 120, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'sales.brand.name', title: '品牌', width: 140, templet: function (d) { return d.sales && d.sales.brand ? d.sales.brand.name : ''; } }, { field: 'comment', title: '备注', minWidth: 160 } ]] });
    table.render({ elem: '#advanceTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'orderId', title: '装修单号', width: 160 }, { field: 'balance', title: '余额', width: 120, templet: function (d) { return app.formatMoney(d.balance); } }, { field: 'projectBalance', title: '合同额', width: 120, templet: function (d) { return app.formatMoney(d.projectBalance); } }, { field: 'materialBalance', title: '主材额', width: 120, templet: function (d) { return app.formatMoney(d.materialBalance); } } ]] });
    function query() {
        var orderId = $.trim($('#orderId').val());
        if (!orderId) { app.showAlert(app.warning, '请输入装修单号'); return; }
        app.post(api.payment.queryDecorationPaymentByOrderId, { 'decorationPayment.decoration.orderId': orderId, 'decorationPayment.paymentStatus': 0, 'decorationPayment.oneType': 0 }, function (res) { table.reload('decorationTable', { data: res.decorationPayments || [] }); });
        app.post(api.payment.querySalesPaymentByOrderId, { 'salesPayment.sales.orderId': orderId, 'salesPayment.status': 0 }, function (res) { table.reload('salesTable', { data: res.salesPayments || [] }); });
        app.post(api.payment.pageAdvancePayment, { 'paging.noPage': 1, 'filters[0].data': orderId, 'filters[0].field': 'orderId', 'filters[0].op': 'eq' }, function (res) { table.reload('advanceTable', { data: (res.paging || {}).data || [] }); });
    }
    $('#btnSearch').on('click', query);
    $('#btnReset').on('click', function () { $('#orderId').val(''); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
