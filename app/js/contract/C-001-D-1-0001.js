/** app/js/contract/C-001-D-1-0001.js —— 方林装修设计费合同（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company,agent}, contract? }。
 *  流程：装修单/客户 → 款项（设计费）；保存走 add/makeDecorationContract。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, cover: {}, current: new Date() };

    if (args.agent == '1') $('.agent').hide();
    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {}, proper = village.cityProper || {};
        var customer = data.customer || {};
        state.customer = customer;

        $('#con-customer-name').val(customer.name);
        $('#con-bank-man').val(customer.name);
        $('#con-bank-no').val(customer.companyBankno);
        $('#con-bank-name').val(customer.companyBank);

        state.cover['cov-orderId'] = orderId;
        state.cover['cov-customer-name'] = customer.name;
        state.cover['sin-customer-name'] = customer.name;

        $('#con-company-no').val(customer.companyNo);
        $('#con-company-name').val(customer.companyName);
        $('#con-company-name1').val(customer.companyName);
        $('#con-company-phone').val(customer.companyPhone);
        $('#con-company-addr').val(customer.companyAddr);
        $('#con-company-bank').val(customer.companyBank);
        $('#con-company-bankno').val(customer.companyBankno);

        $('#con-province-name').val(proper.city ? proper.city.province : '');
        $('#con-city-name').val(proper.city ? proper.city.name : '');
        $('#con-proper-name').val(proper.name);
        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);
        $('#con-buildarea').val(house.innerArea);

        $('#con-designer-name').val(data.designer ? data.designer.currentName : '');
        $('#con-designer-phone').val(data.designer ? data.designer.phone : '');

        state.decoration = data;
        state.cover['cov-buildarea'] = house.innerArea;
        state.cover['cov-address'] = village.name + ' ' + house.houseNumber;
        state.cover['cov-designer-name'] = data.designer ? data.designer.currentName : '';
        state.cover['cov-designer-phone'] = data.designer ? data.designer.phone : '';
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#con-customer-phone').val(state.customer.phone);
        $('#con-customer-ident').val(state.customer.identity);

        $('#con-bank-no').val(state.customer.companyBankno);
        $('#con-bank-name').val(state.customer.companyBank);

        $('#con-company-no').val(state.customer.companyNo);
        $('#con-company-name').val(state.customer.companyName);
        $('#con-company-name1').val(state.customer.companyName);
        $('#con-company-phone').val(state.customer.companyPhone);
        $('#con-company-addr').val(state.customer.companyAddr);
        $('#con-company-bank').val(state.customer.companyBank);
        $('#con-company-bankno').val(state.customer.companyBankno);

        state.cover['cov-customer-phone'] = state.customer.phone;
        state.cover['sin-customer-ident'] = state.customer.identity;
    }, null, false);

    // 款项：设计费
    app.post(api.payment.queryDecorationPaymentByOrderId, { 'decorationPayment.decoration.orderId': orderId }, function (res) {
        var payments = contractCommon.paymentMap(res.decorationPayments);
        $('#con-design-money').val(payments['设计费'] == null ? 0 : payments['设计费']);
        $('#con-design-rmoney').val(payments['设计费'] == null ? 0 : payments['设计费']);
    }, null, false);

    // 话术（全部 .makeup.conitem 双击）
    contractCommon.bindTalking([{ id: 'con-markup-one', types: { 'types[0]': 0, 'types[1]': 1 } }]);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-design-money-cn'] = contractCommon.getCNMoney(parseFloat(data['con-design-money']));
        data['con-design-rmoney-cn'] = contractCommon.getCNMoney(parseFloat(data['con-design-rmoney']));

        data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
        data['con-sign-month'] = app.dateFormat(state.current, 'MM');
        data['con-sign-day'] = app.dateFormat(state.current, 'dd');

        data['sin-customer-phone'] = data['con-customer-phone'];
        data['sin-customer-ident'] = data['con-customer-ident'];

        if (args.agent == '0') {
            data['sin-agent-name'] = data['con-agent-name'];
            data['sin-agent-phone'] = data['con-agent-phone'];
            data['sin-agent-ident'] = data['con-agent-ident'];
        }

        if (args.company == '1') {
            delete data['con-customer-name'];
            delete data['con-customer-ident'];
            delete data['cov-customer-name'];
            data['cov-company-name'] = data['con-company-name'];
            data['sin-company-name'] = data['con-company-name'];
            data['sin-company-phone'] = data['con-company-phone'];
        }

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            contractCommon.saveDecorationContract(data);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
