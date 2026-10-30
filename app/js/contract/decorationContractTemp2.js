/** app/js/contract/decorationContractTemp2.js —— 方林装修设计费合同（旧模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,agent} }。
 *  旧模板直接取装修单客户；仅走 addDecorationContract。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, cover: {}, current: new Date() };

    if (args.agent == '1') $('.agent').hide();

    contractCommon.current(function (d) { state.current = d; });

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {}, proper = village.cityProper || {};
        var customer = data.customer || {};

        $('#con-customer-name').val(customer.name);
        $('#con-customer-phone').val(customer.phone);
        $('#con-customer-ident').val(customer.identity);

        state.customer = customer;

        state.cover['cov-orderId'] = orderId;
        state.cover['cov-customer-name'] = customer.name;
        state.cover['cov-customer-phone'] = customer.phone == '' ? '' : customer.phone;

        $('#con-province-name').val(proper.city ? proper.city.province : '');
        $('#con-city-name').val(proper.city ? proper.city.name : '');
        $('#con-proper-name').val(proper.name);
        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);
        $('#con-buildarea').val(house.innerArea);

        $('#con-designer-name').val(data.designer ? data.designer.currentName : '');
        $('#con-designer-phone').val(data.designer ? data.designer.phone : '');
    }, null, false);

    // 话术
    contractCommon.bindTalking([{ id: 'con-markup-one', types: { 'types[0]': 0, 'types[1]': 1 } }]);

    // 保存（旧模板仅 add）
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-design-money-cn'] = contractCommon.getCNMoney(parseFloat(data['con-design-money']));
        data['con-design-rmoney-cn'] = contractCommon.getCNMoney(parseFloat(data['con-design-rmoney']));

        data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
        data['con-sign-month'] = app.dateFormat(state.current, 'MM');
        data['con-sign-day'] = app.dateFormat(state.current, 'dd');

        data['sin-customer-name'] = data['con-customer-name'];
        data['sin-customer-phone'] = data['con-customer-phone'];
        data['sin-customer-ident'] = data['con-customer-ident'];

        if (args.agent == '0') {
            data['sin-agent-name'] = data['con-agent-name'];
            data['sin-agent-phone'] = data['con-agent-phone'];
            data['sin-agent-ident'] = data['con-agent-ident'];
        }

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
