/** app/js/contract/decorationContractTemp4.js —— 方林服务费合同（旧模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,agent} }。
 *  服务费来源：满减配比 servicePrice（queryDecorationHolonomy）；仅走 addDecorationContract。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, holonomy: null, cover: {}, current: new Date() };

    if (args.agent == '1') $('.agent').hide();

    contractCommon.current(function (d) { state.current = d; });

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var customer = data.customer || {};

        $('#con-customer-name').val(customer.name);
        $('#sin-customer-phone').val(customer.phone);
        $('#sin-customer-ident').val(customer.identity);

        state.customer = customer;
        state.decoration = data;
    }, null, false);

    // 满减配比服务费
    app.post(api.decoration.queryDecorationHolonomy, { 'decorationHolonomy.decoration.orderId': orderId }, function (res) {
        var holonomy = res.decorationHolonomy || {};
        if (holonomy) holonomy.materialPrice = 0;
        if (!holonomy.servicePrice) holonomy.servicePrice = 0;

        $('#con-service-total').val(holonomy.servicePrice);
        state.holonomy = holonomy;
    }, null, false);

    // 保存（旧模板仅 add）
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-service-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-service-total']));

        data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
        data['con-sign-month'] = app.dateFormat(state.current, 'MM');
        data['con-sign-day'] = app.dateFormat(state.current, 'dd');

        data['sin-customer-name'] = data['con-customer-name'];

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var loader = app.showLoading('合同生成中...', { shade: 0.3 });
            app.post(api.decoration.addDecorationContract, {
                'decorationContract.orderId': orderId,
                'contract.cid': args.cid,
                'data': JSON.stringify(data)
            }, function () {
                app.hideLoading(loader);
                app.showAlert(app.success, '操作成功');
                contractCommon.closeSelfPopup();
            }, function (res) {
                app.hideLoading(loader);
                app.showAlert(app.error, (res && res.errorMsg) || '操作失败');
            });
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
