/** app/js/contract/C-003-D-0-0004.js —— 对公司保密协议（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company}, contract? }。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, cover: {}, current: new Date() };

    if (args.company != '1') {
        $('.company').hide();
        $('.agentor').hide();
    }
    if (args.company == '1') $('.customer').hide();

    contractCommon.date(['con-valid-start-date', 'con-valid-end-date']);

    contractCommon.current(function (d) { state.current = d; });

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {};
        var customer = data.customer || {};

        $('#con-customer-name').val(customer.name);
        state.customer = customer;

        state.cover['con-customer-name'] = customer.name;
        $('#con-company-name').val(customer.companyName);

        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#con-customer-ident').val(state.customer.identity);
        $('#con-company-name').val(state.customer.companyName);

        state.cover['con-customer-phone'] = state.customer.phone;
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

        data['con-valid-start-date'] = $('#con-valid-start-date').val();
        data['con-valid-end-date'] = $('#con-valid-end-date').val();
        data['sin-sign-date'] = app.dateFormat(state.current, 'yyyy年MM月dd日');
        data['sin-sign-date1'] = app.dateFormat(state.current, 'yyyy年MM月dd日');

        if (args.company == '1') {
            delete data['con-customer-ident'];
            delete data['con-customer-phone'];
            delete data['sin-agent-name'];
        }
        if (args.company != '1') {
            delete data['sin-agent-name'];
        }

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            contractCommon.saveDecorationContract(data);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
