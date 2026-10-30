/** app/js/contract/C-002-M-2-0001.js —— 1918主材代购合同（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company,type}, contract? }。
 *  金额来源：满减/半包配比材料款（50% 首付 / 50% 尾款）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, holonomy: null, midpack: null, cover: {}, current: new Date() };

    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();
    if (args.type != '1') $('.second').hide();

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {};
        var customer = data.customer || {};
        state.customer = customer;

        $('#con-customer-name').val(customer.name);

        state.cover['cov-orderId'] = orderId;
        state.cover['cov-customer-name'] = customer.name;
        state.cover['sin-customer-name'] = customer.name;

        $('#con-company-name').val(customer.companyName);
        $('#con-company-phone').val(customer.companyPhone);
        $('#con-contract-total').val(data.orderTotalPrice);

        state.cover['sin-company-phone'] = customer.companyPhone;
        state.decoration = data;

        state.cover['cov-buildarea'] = house.innerArea;
        state.cover['cov-address'] = village.name + ' ' + house.houseNumber;
        state.cover['cov-designer-name'] = data.designer ? data.designer.currentName : '';
        state.cover['cov-designer-phone'] = data.designer ? data.designer.phone : '';
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

    // 配比金额
    function updateMaterialPrice() {
        var materialPrice = 0;
        if (state.holonomy && state.holonomy.materialPrice > 0) {
            materialPrice = state.holonomy.materialPrice;
        } else if (state.midpack && state.midpack.materialPrice > 0) {
            materialPrice = state.midpack.materialPrice;
        }
        $('#con-material-total').val(materialPrice);
        $('#con-material-first').val(Math.round(app.utils.accMul(materialPrice, 0.5)));
        $('#con-material-final').val(Math.round(app.utils.accMul(materialPrice, 0.5)));
    }

    app.post(api.decoration.queryDecorationHolonomy, { 'decorationHolonomy.decoration.orderId': orderId }, function (res) {
        var holonomy = res.decorationHolonomy || {};
        if (!holonomy.materialPrice) holonomy.materialPrice = 0;
        state.holonomy = holonomy;
    }, null, false);

    app.post(api.decoration.queryDecorationMidpack, { 'decorationMidpack.decoration.orderId': orderId }, function (res) {
        var midpack = res.decorationMidpack || {};
        if (!midpack.materialPrice) midpack.materialPrice = 0;
        state.midpack = midpack;
    }, null, false);

    updateMaterialPrice();

    if (args.company == '1' && state.customer.type == 0) {
        app.showAlert(app.warning, '客户类型为个人');
        $('#form').empty();
        return;
    }

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        var data = $.extend({}, contractCommon.collect('#form'), state.cover);

        data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
        data['con-sign-month'] = app.dateFormat(state.current, 'MM');
        data['con-sign-day'] = app.dateFormat(state.current, 'dd');

        data['con-material-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-material-total']));
        data['con-contract-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-contract-total']));

        if (args.company == '1') {
            delete data['con-customer-ident'];
            delete data['cov-customer-name'];
            delete data['con-company-phone'];
            delete data['sin-agent-ident'];
            delete data['sin-agent-name'];
            delete data['sin-agent-phone'];

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
