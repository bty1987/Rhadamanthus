/** app/js/contract/decorationContractTemp3.js —— 方林主材代购合同（旧模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company} }。
 *  金额来源：报价（queryQuotationForDefaultByOrderId）+ 满减配比（queryDecorationHolonomy）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, holonomy: null, quotation: null, cover: {}, current: new Date() };

    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {};
        var customer = data.customer || {};

        $('#con-customer-name').val(customer.name);
        $('#sin-customer-phone').val(customer.phone);
        $('#sin-customer-ident').val(customer.identity);

        state.customer = customer;

        state.cover['cov-orderId'] = orderId;
        state.cover['cov-customer-name'] = customer.name;
        state.cover['cov-customer-phone'] = customer.phone;
        state.cover['sin-customer-name'] = customer.name;

        $('#con-company-name').val(customer.companyName);
        $('#con-company-phone').val(customer.companyPhone);

        state.cover['sin-company-phone'] = customer.companyPhone;
        state.decoration = data;

        state.cover['cov-buildarea'] = house.innerArea;
        state.cover['cov-address'] = village.name + ' ' + house.houseNumber;
        state.cover['cov-designer-name'] = data.designer ? data.designer.currentName : '';
        state.cover['cov-designer-phone'] = data.designer ? data.designer.phone : '';
    }, null, false);

    // 报价金额
    app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
        var quotation = res.quotation || {};
        var u = app.utils;
        var preprice = parseInt(u.accAdd(quotation.undisPrice, u.accAdd(quotation.disPrice, u.accAdd(quotation.trafficPrice, quotation.managePrice))));

        $('#con-quotation-total').val(preprice);
        $('#con-quotation-total-undis').val(parseInt(u.accSub(preprice, quotation.managePrice)));
        $('#con-manage-total').val(quotation.managePrice);

        state.quotation = quotation;
    }, null, false);

    // 满减配比
    app.post(api.decoration.queryDecorationHolonomy, { 'decorationHolonomy.decoration.orderId': orderId }, function (res) {
        var holonomy = res.decorationHolonomy || {};
        if (!holonomy.servicePrice) holonomy.servicePrice = 0;

        $('#con-material-total').val(parseInt(holonomy.materialPrice));
        $('#con-service-total').val(holonomy.servicePrice);

        state.cover['con-payment-first'] = app.utils.accMul(holonomy.materialPrice, 0.5);
        state.cover['con-payment-final'] = app.utils.accMul(holonomy.materialPrice, 0.5);

        state.holonomy = holonomy;
    }, null, false);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-material-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-material-total']));
        data['con-quotation-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-quotation-total']));
        data['con-quotation-total-undis-cn'] = contractCommon.getCNMoney(parseFloat(data['con-quotation-total-undis']));
        data['con-manage-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-manage-total']));

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
