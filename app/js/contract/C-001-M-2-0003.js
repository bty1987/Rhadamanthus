/** app/js/contract/C-001-M-2-0003.js —— 方林主材代购合同（半包配比版，合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company}, contract? }。
 *  金额来源：报价（queryQuotationForDefaultByOrderId）+ 半包配比（queryDecorationMidpack，材料款 50% 首付/尾款）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, midpack: null, quotation: null, cover: {}, current: new Date() };
    var decoration = {};

    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        decoration = res.decoration || {};
        var house = decoration.house || {}, village = house.village || {};
        var customer = decoration.customer || {};
        state.customer = customer;

        $('#con-customer-name').val(customer.name);

        state.cover['cov-orderId'] = orderId;
        state.cover['cov-customer-name'] = customer.name;
        state.cover['sin-customer-name'] = customer.name;

        $('#con-company-name').val(customer.companyName);
        $('#con-company-phone').val(customer.companyPhone);

        state.cover['sin-company-phone'] = customer.companyPhone;
        state.decoration = decoration;

        state.cover['cov-buildarea'] = house.innerArea;
        state.cover['cov-address'] = village.name + ' ' + house.houseNumber;
        state.cover['cov-designer-name'] = decoration.designer ? decoration.designer.currentName : '';
        state.cover['cov-designer-phone'] = decoration.designer ? decoration.designer.phone : '';
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#sin-customer-phone').val(state.customer.phone);
        $('#sin-customer-ident').val(state.customer.identity);

        $('#con-company-name').val(state.customer.companyName);
        $('#con-company-phone').val(state.customer.companyPhone);

        state.cover['cov-customer-phone'] = state.customer.phone;
        state.cover['sin-company-phone'] = state.customer.companyPhone;
    }, null, false);

    if (args.company == '1' && state.customer.type == 0) {
        app.showAlert(app.warning, '客户类型为个人');
        $('#form').empty();
        return;
    }

    // 报价金额
    app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
        var quotation = res.quotation || {};
        var u = app.utils;
        var preprice = parseInt(u.accAdd(quotation.undisPrice, u.accAdd(quotation.disPrice, u.accAdd(quotation.trafficPrice, u.accAdd(quotation.managePrice, quotation.taxDiscount == 0 ? 0 : quotation.taxPrice)))));

        $('#con-quotation-total').val(preprice);
        state.quotation = quotation;
    }, null, false);

    // 半包配比
    app.post(api.decoration.queryDecorationMidpack, { 'decorationMidpack.decoration.orderId': orderId }, function (res) {
        var midpack = res.decorationMidpack || {};
        if (!midpack.servicePrice) midpack.servicePrice = 0;
        if (!midpack.materialPrice) midpack.materialPrice = 0;

        $('#con-material-total').val(parseInt(midpack.materialPrice));
        $('#con-service-total').val(midpack.servicePrice);

        state.cover['con-payment-first'] = app.utils.accMul(midpack.materialPrice, 0.5);
        state.cover['con-payment-final'] = app.utils.accMul(midpack.materialPrice, 0.5);

        state.midpack = midpack;
    }, null, false);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-material-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-material-total']));
        data['con-quotation-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-quotation-total']));

        data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
        data['con-sign-month'] = app.dateFormat(state.current, 'MM');
        data['con-sign-day'] = app.dateFormat(state.current, 'dd');

        if (args.company == '1') {
            delete data['con-customer-ident'];
            delete data['cov-customer-name'];
            delete data['con-company-phone'];
            data['cov-company-name'] = data['con-company-name'];
            data['sin-company-name'] = data['con-company-name'];
        }
        if (args.company != '1') {
            delete data['sin-company-phone'];
        }

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            contractCommon.saveDecorationContract(data);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
