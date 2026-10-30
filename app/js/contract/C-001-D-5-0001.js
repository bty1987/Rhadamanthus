/** app/js/contract/C-001-D-5-0001.js —— 方林解除协议（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company}, contract? }。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var E = contractCommon.ENUM;
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, cover: {}, current: new Date() };

    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();

    contractCommon.current(function (d) { state.current = d; });
    contractCommon.date(['con-sign-year'], 'year');
    contractCommon.date(['con-sign-month'], 'month');
    contractCommon.date(['con-sign-day'], 'day');

    state.cover['sin-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['sin-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['sin-sign-day'] = app.dateFormat(state.current, 'dd');

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {}, proper = village.cityProper || {};
        var customer = data.customer || {};
        state.customer = customer;

        $('#con-orderId').val(data.orderId);
        $('#con-work-status').val(E.projectStatus[data.projectStatus]);
        $('#con-customer-name').val(customer.name);

        $('#con-province-name').val(proper.city ? proper.city.province : '');
        $('#con-city-name').val(proper.city ? proper.city.name : '');
        $('#con-proper-name').val(proper.name);
        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);

        $('#con-company-no').val(customer.companyNo);
        $('#con-company-name').val(customer.companyName);

        state.cover['con-customer-name'] = customer.name;
        state.cover['con-work-model'] = E.typeness[data.typeness];
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#con-customer-ident').val(state.customer.identity);

        $('#con-company-no').val(state.customer.companyNo);
        $('#con-company-name').val(state.customer.companyName);

        state.cover['con-customer-ident'] = state.customer.identity;
        state.cover['sin-customer-phone'] = state.customer.phone;
        state.cover['sin-customer-ident'] = state.customer.identity;
    }, null, false);

    // 话术
    contractCommon.bindTalking([
        { id: 'con-markup-one', types: { 'types[0]': 0 } },
        { id: 'con-markup-two', types: { 'types[0]': 1 } },
        { id: 'con-markup-thr', types: { 'types[0]': 3 } }
    ]);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['sin-customer-name'] = data['con-customer-name'];

        if (args.company == '1') {
            data['sin-company-name'] = data['con-company-name'];
            data['sin-company-no'] = data['con-company-no'];
        }

        delete data['con-housetype'];

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            contractCommon.saveDecorationContract(data);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
