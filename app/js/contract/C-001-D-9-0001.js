/** app/js/contract/C-001-D-9-0001.js —— 环保协议（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company}, contract? }。
 *  注意：仅走 addDecorationContract（对齐旧逻辑）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, cover: {}, current: new Date() };

    if (args.company != '1') $('.company').hide();
    if (args.company == '1') { $('.customer').hide(); $('.agent').hide(); }

    contractCommon.current(function (d) { state.current = d; });

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var customer = data.customer || {};
        state.customer = customer;

        $('#con-customer-name').val(customer.name);
        state.cover['sin-customer-name'] = customer.name;
        $('#con-company-name').val(customer.companyName);
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#sin-customer-phone1').val(state.customer.phone);
        $('#sin-customer-ident').val(state.customer.identity);
        $('#con-company-name').val(state.customer.companyName);

        state.cover['sin-customer-phone1'] = state.customer.phone;
        state.cover['sin-customer-ident'] = state.customer.identity;
    }, null, false);

    if (args.company == '1' && state.customer.type == 0) {
        app.showAlert(app.warning, '客户类型为个人');
        $('#form').empty();
        return;
    }

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'), state.cover);

            data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
            data['con-sign-month'] = app.dateFormat(state.current, 'MM');
            data['con-sign-day'] = app.dateFormat(state.current, 'dd');

            if (args.company == '1') {
                data['sin-company-name'] = data['con-company-name'];
                delete data['sin-customer-ident'];
                delete data['con-customer-name'];
            }

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
