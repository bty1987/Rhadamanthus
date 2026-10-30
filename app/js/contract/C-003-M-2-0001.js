/** app/js/contract/C-003-M-2-0001.js —— 宜家半包主材代购合同（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company}, contract? }。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, holonomy: null, quotation: null, cover: {}, current: new Date() };
    var decoration = {};

    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.agent').hide();

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');
    state.cover['sin-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['sin-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['sin-sign-day'] = app.dateFormat(state.current, 'dd');

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

        state.cover['sin-company-phone'] = state.customer.companyPhone;
        state.cover['cov-customer-phone'] = state.customer.phone;
    }, null, false);

    if (args.company == '1' && state.customer.type == 0) {
        app.showAlert(app.warning, '客户类型为个人');
        $('#form').empty();
        return;
    }

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-material-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-material-total']));

        if (args.company == '1') {
            delete data['con-customer-ident'];
            delete data['con-customer-name'];
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
