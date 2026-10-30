/** app/js/contract/C-001-D-7-0001.js —— 签约后交付流程（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid}, contract? }。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var orderId = ctx.orderId;

    var state = { customer: null, cover: {}, current: new Date() };

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');

    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {};
        var customer = data.customer || {};

        state.cover['cov-orderId'] = data.orderId;
        $('#con-customer-name').val(customer.name);
        $('#cov-designer-name').val(data.designer ? data.designer.currentName : '');

        state.customer = customer;

        state.cover['cov-customer-name'] = customer.name;
        state.cover['sin-customer-name'] = customer.name;
        state.cover['cov-address'] = village.name + ' ' + house.houseNumber;
    }, null, false);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'), state.cover);
            contractCommon.saveDecorationContract(data);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
