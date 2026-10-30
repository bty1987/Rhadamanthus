/** app/js/contract/C-001-M-2-0001.js —— 方林主材代购合同（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company,type}, contract? }。
 *  金额来源：报价（queryQuotationForDefaultByOrderId）+ 满减/半包配比（queryDecorationHolonomy/Midpack）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var C = contractCommon.CONST;
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, holonomy: null, midpack: null, quotation: null, cover: {}, current: new Date() };
    var decoration = {};

    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();
    if (args.type == '1') $('.total').hide();

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

        if (decoration.typeness != C.TYPENESS_NEWFULLREDUCTION_INT) {
            $('#con-quotation-total-undis').val(parseInt(u.accAdd(quotation.undisPrice, u.accAdd(quotation.disPrice, quotation.trafficPrice))));
            $('#con-manage-total').val(parseInt(u.accAdd(quotation.managePrice, quotation.taxDiscount == 0 ? 0 : quotation.taxPrice)));
        } else {
            $('.total').hide();
        }

        state.quotation = quotation;
    }, null, false);

    // 配比金额
    function updateMaterialPrice() {
        var materialPrice = 0;
        var servicePrice = 0;

        if (state.holonomy && state.holonomy.materialPrice > 0) {
            materialPrice = state.holonomy.materialPrice;
            servicePrice = state.holonomy.servicePrice || 0;
        } else if (state.midpack && state.midpack.materialPrice > 0) {
            materialPrice = state.midpack.materialPrice;
            servicePrice = state.midpack.servicePrice || 0;
        }

        $('#con-material-total').val(parseInt(materialPrice));
        $('#con-service-total').val(servicePrice);

        state.cover['con-payment-first'] = app.utils.accMul(materialPrice, 0.5);
        state.cover['con-payment-final'] = app.utils.accMul(materialPrice, 0.5);
    }

    app.post(api.decoration.queryDecorationHolonomy, { 'decorationHolonomy.decoration.orderId': orderId }, function (res) {
        var holonomy = res.decorationHolonomy || {};
        if (!holonomy.servicePrice) holonomy.servicePrice = 0;
        if (!holonomy.materialPrice) holonomy.materialPrice = 0;
        state.holonomy = holonomy;
    }, null, false);

    app.post(api.decoration.queryDecorationMidpack, { 'decorationMidpack.decoration.orderId': orderId }, function (res) {
        var midpack = res.decorationMidpack || {};
        if (!midpack.servicePrice) midpack.servicePrice = 0;
        if (!midpack.materialPrice) midpack.materialPrice = 0;
        state.midpack = midpack;
    }, null, false);

    updateMaterialPrice();

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-material-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-material-total']));
        data['con-quotation-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-quotation-total']));

        data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
        data['con-sign-month'] = app.dateFormat(state.current, 'MM');
        data['con-sign-day'] = app.dateFormat(state.current, 'dd');

        if (decoration.typeness != C.TYPENESS_NEWFULLREDUCTION_INT & args.type != '1') {
            data['con-quotation-total-undis-cn'] = contractCommon.getCNMoney(parseFloat(data['con-quotation-total-undis']));
            data['con-manage-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-manage-total']));
        }

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
