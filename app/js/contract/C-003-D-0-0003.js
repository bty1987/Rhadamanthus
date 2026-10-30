/** app/js/contract/C-003-D-0-0003.js —— 恩林装修工程合同（合同模板页，主材达额）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company,type}, contract? }。
 *  款项来源：queryDecorationPaymentByOrderId（保证金/首付款/首付二期款/二期款/尾款）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, cover: {}, table: {}, current: new Date() };

    if (args.agent == '1') $('.agent').hide();
    if (args.type == '0') $('.secondPaymentGroup').hide();
    if (args.type == '2') {
        $('.secondPaymentGroup').hide();
        $('.thirdPaymentGroup').hide();
    }
    if (args.type == '3') {
        $('.firstPaymentGroup').hide();
        $('.secondPaymentGroup').hide();
        $('.thirdPaymentGroup').hide();
        $('.finalPaymentGroup').hide();
    }
    if (args.company != '1') {
        $('.company').hide();
        $('.customer').hide();
    }

    contractCommon.current(function (d) { state.current = d; });

    // 款项
    app.post(api.payment.queryDecorationPaymentByOrderId, { 'decorationPayment.decoration.orderId': orderId }, function (res) {
        var payments = contractCommon.paymentMap(res.decorationPayments);
        $('#con-bond-price').val(payments['保证金'] == null ? 0 : payments['保证金']);
        $('#con-payment-first').val(payments['首付款'] == null ? 0 : payments['首付款']);
        $('#con-payment-second').val(payments['首付二期款'] == null ? 0 : payments['首付二期款']);
        $('#con-payment-third').val(payments['二期款'] == null ? 0 : payments['二期款']);
        $('#con-payment-final').val(payments['尾款'] == null ? 0 : payments['尾款']);
        state.designPrice = payments['设计费'] == null ? 0 : payments['设计费'];
    }, null, false);

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {}, proper = village.cityProper || {};
        var customer = data.customer || {};
        state.customer = customer;

        $('#con-customer-name').val(customer.name);

        state.cover['cov-orderId'] = orderId;
        state.cover['sin-customer-name'] = customer.name;

        $('#con-company-name').val(customer.companyName);
        state.cover['cov-company-name'] = customer.companyName;

        $('#con-province-name').val(proper.city ? proper.city.province : '');
        $('#con-city-name').val(proper.city ? proper.city.name : '');
        $('#con-proper-name').val(proper.name);
        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);

        $('#con-contract-total').val(app.utils.accAdd(parseFloat(data.orderTotalPrice), parseFloat(state.designPrice)));

        state.decoration = data;
        state.cover['cov-address'] = village.name + ' ' + house.houseNumber;
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#con-customer-phone').val(state.customer.phone);
        $('#con-customer-ident').val(state.customer.identity);

        $('#con-company-name').val(state.customer.companyName);
        state.cover['cov-company-name'] = state.customer.companyName;
        state.cover['sin-customer-ident'] = state.customer.identity;
    }, null, false);

    if (args.company == '1' && state.customer.type == 0) {
        app.showAlert(app.warning, '客户类型为个人');
        $('#form').empty();
        return;
    }

    // 话术（对齐旧页：markup-one=5，markup-thr=4）
    contractCommon.bindTalking([
        { id: 'con-markup-one', types: { 'types[0]': 5 } },
        { id: 'con-markup-thr', types: { 'types[0]': 4 } }
    ]);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'), state.cover);

            data['con-contract-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-contract-total']));

            if (args.company == '1') {
                delete data['con-company-name'];
                delete data['con-customer-name'];
            }
            if (args.company != '1') {
                delete data['cov-company-name'];
                delete data['sin-customer-name'];
            }

            contractCommon.saveDecorationContract(data, state.table);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
