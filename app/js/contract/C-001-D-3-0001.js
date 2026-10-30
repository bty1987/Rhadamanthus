/** app/js/contract/C-001-D-3-0001.js —— 方林装修服务费合同（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company,agent}, contract? }。
 *  半包单取半包配比服务费（queryDecorationMidpack），满减单取满减配比服务费（queryDecorationHolonomy）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var C = contractCommon.CONST;
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, midpack: null, holonomy: null, cover: {}, current: new Date() };

    if (args.agent == '1') $('.agent').hide();
    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();

    contractCommon.current(function (d) { state.current = d; });

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var customer = data.customer || {};
        state.customer = customer;

        $('#con-customer-name').val(customer.name);
        state.cover['sin-customer-name'] = customer.name;

        $('#con-company-name').val(customer.companyName);
        $('#con-company-phone').val(customer.companyPhone);
        state.cover['sin-company-phone'] = customer.companyPhone;

        state.decoration = data;
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#sin-customer-phone').val(state.customer.phone);
        $('#sin-customer-ident').val(state.customer.identity);

        $('#con-company-name').val(state.customer.companyName);
        $('#con-company-phone').val(state.customer.companyPhone);
        state.cover['sin-company-phone'] = state.customer.companyPhone;
    }, null, false);

    if (args.company == '1' && state.customer.type == 0) {
        app.showAlert(app.warning, '客户类型为个人');
        $('#form').empty();
        return;
    }

    // 半包配比服务费
    if (state.decoration.type == C.TYPE_MIDPACK_INT) {
        app.post(api.decoration.queryDecorationMidpack, { 'decorationMidpack.decoration.orderId': orderId }, function (res) {
            var midpack = res.decorationMidpack || {};
            if (midpack) midpack.materialPrice = 0;
            if (!midpack.servicePrice) midpack.servicePrice = 0;
            $('#con-service-total').val(midpack.servicePrice);
            state.midpack = midpack;
        }, null, false);
    }

    // 满减配比服务费
    if (state.decoration.type == C.TYPE_HOLONOMY_INT) {
        app.post(api.decoration.queryDecorationHolonomy, { 'decorationHolonomy.decoration.orderId': orderId }, function (res) {
            var holonomy = res.decorationHolonomy || {};
            if (holonomy) holonomy.materialPrice = 0;
            if (!holonomy.servicePrice) holonomy.servicePrice = 0;
            $('#con-service-total').val(holonomy.servicePrice);
            state.holonomy = holonomy;
        }, null, false);
    }

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-service-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-service-total']));
        data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
        data['con-sign-month'] = app.dateFormat(state.current, 'MM');
        data['con-sign-day'] = app.dateFormat(state.current, 'dd');

        if (args.company == '1') {
            delete data['con-customer-name'];
            delete data['con-company-phone'];
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
