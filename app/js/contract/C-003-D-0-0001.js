/** app/js/contract/C-003-D-0-0001.js —— 宜家装修工程预签合同（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,agent,type,company}, contract? }。
 *  预签数据：queryProtationForDefaultByOrderId + queryProtationItemByPid（家装项目列表 table），
 *  券总额：amountDecorationActivity。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var E = contractCommon.ENUM;
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, cover: {}, table: [], current: new Date() };

    if (args.agent == '1') $('.agent').hide();
    if (args.type == '0') $('#con-payment-second').closest('.layui-inline').hide();
    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');

    app.bindData($('#con-housetype'), contractCommon.toDatas(E.houseType), 'key', 'value');
    form.render('select');

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var customer = (res.decoration || {}).customer || {};
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
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#con-customer-phone').val(state.customer.phone);
        $('#con-customer-ident').val(state.customer.identity);

        $('#con-bank-no').val(state.customer.companyBankno);
        $('#con-bank-name').val(state.customer.companyBank);
        $('#con-bank-phone').val(state.customer.phone);

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

    if (args.company == '1' && state.customer.type == 0) {
        app.showAlert(app.warning, '客户类型为个人');
        $('#form').empty();
        return;
    }

    // 工期
    app.post(api.construction.queryConstructionInfoByOrderId, { 'constructionInfo.orderId': orderId }, function (result) {
        var datas = result.constructionInfo || {};
        $('#con-work-number').val(datas.timeLimit);
        $('#con-work-year').val(datas.drawlineTime ? datas.drawlineTime.substr(0, 4) : '');
        $('#con-work-month').val(datas.drawlineTime ? datas.drawlineTime.substr(5, 2) : '');
        $('#con-work-day').val(datas.drawlineTime ? datas.drawlineTime.substr(8, 2) : '');
    }, null, false);

    // 款项
    app.post(api.payment.queryDecorationPaymentByOrderId, { 'decorationPayment.decoration.orderId': orderId }, function (res) {
        var payments = contractCommon.paymentMap(res.decorationPayments);
        $('#con-design-money').val(payments['设计费'] == null ? 0 : payments['设计费']);
        $('#con-payment-first').val(payments['首付款'] == null ? 0 : payments['首付款']);
        $('#con-payment-second').val(payments['首付二期款'] == null ? 0 : payments['首付二期款']);
        $('#con-payment-third').val(payments['二期款'] == null ? 0 : payments['二期款']);
        $('#con-payment-final').val(payments['尾款'] == null ? 0 : payments['尾款']);
        state.designPrice = payments['设计费'] == null ? 0 : payments['设计费'];
    }, null, false);

    // 预签报价总额
    app.post(api.quotation.queryProtationForDefaultByOrderId, { 'protation.orderId': orderId }, function (res) {
        state.totalPrice = (res.protation || {}).totalPrice;
    }, null, false);

    // 计入款项的券总额
    app.post(api.decoration.amountDecorationActivity, {
        'decorationActivity.orderId': orderId,
        'decorationActivityItem.isPayment': 0,
        'decorationActivityItem.type': 0
    }, function (res) {
        state.amount = (res.decorationActivity || {}).amount;
    }, null, false);

    // 装修单金额信息
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {}, proper = village.cityProper || {};
        var u = app.utils;

        $('#con-province-name').val(proper.city ? proper.city.province : '');
        $('#con-city-name').val(proper.city ? proper.city.name : '');
        $('#con-proper-name').val(proper.name);
        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);
        $('#cov-buildarea').val(house.innerArea);
        $('#con-housetype').val(data.houseType);
        $('#con-invoice-type').val(data.invoiceClass);
        form.render('select');

        $('#con-house-type').val(E.typeness[data.type]);
        $('#con-work-type').val(E.typeness[data.type]);
        $('#con-work-model').val(E.typeness[data.type]);

        $('#con-contract-total').val(u.accAdd(parseFloat(data.orderTotalPrice), parseFloat(state.designPrice)));
        $('#con-contract-stotal').val(data.orderTotalPrice);
        $('#con-contract-rtotal').val(data.factPrice);

        $('#con-innerarea').val(house.innerArea);
        $('#con-precontract-total').val(Math.round(u.accSub(state.totalPrice, state.amount)));
        $('#con-precontract-total-30').val(Math.round(u.accMul(u.accSub(state.totalPrice, state.amount), 0.3)));

        state.decoration = data;
        state.cover['cov-designer-name'] = data.designer ? data.designer.currentName : '';
        state.cover['cov-designer-phone'] = data.designer ? data.designer.phone : '';
    }, null, false);

    // 优惠活动
    app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': orderId }, function (res) {
        var activitys = res.decorationActivitys || [];
        if (activitys.length != 0) $('#con-activity-name').val(activitys[0].activity.name);
    }, null, false);

    // 预签项目
    var qu = contractCommon.quotationUtils;
    qu.quotationDetail = { protation: {}, protationItems: {} };

    app.post(api.quotation.queryProtationForDefaultByOrderId, { 'protation.orderId': orderId }, function (res) {
        qu.quotationDetail.protation = res.protation || {};
    }, null, false);

    if (!qu.quotationDetail.protation.pid) {
        app.showAlert(app.warning, '无预签信息');
        $('#form').empty();
        return;
    }

    app.post(api.quotation.queryProtationItemByPid, { 'protationItem.pid': qu.quotationDetail.protation.pid }, function (res) {
        qu.quotationDetail.protationItems = res.protationItems || [];
    }, null, false);

    var table1 = { insertWay: 1, keyword: '家装项目列表', pageBegin: 1, headers: ['序号', '名称'], colWidthPercent: [1, 3], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };
    $.each(qu.quotationDetail.protationItems, function (i, v) {
        table1.datas.push([(i + 1), v.name]);
    });
    state.table.push(table1);

    // 话术
    contractCommon.bindTalking([
        { id: 'con-markup-one', types: { 'types[0]': 0 } },
        { id: 'con-markup-two', types: { 'types[0]': 1 } },
        { id: 'con-markup-thr', types: { 'types[0]': 3 } }
    ]);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'), state.cover);

            data['cov-innerarea'] = data['con-innerarea'];
            data['cov-address'] = data['con-village-name'] + ' ' + data['con-housenumber'];

            data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
            data['con-sign-month'] = app.dateFormat(state.current, 'MM');
            data['con-sign-day'] = app.dateFormat(state.current, 'dd');

            data['con-design-money-cn'] = contractCommon.getCNMoney(parseFloat(data['con-design-money']));
            data['con-precontract-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-precontract-total']));
            data['con-precontract-total-30'] = Math.round(parseFloat(data['con-precontract-total']) * 0.3);
            data['con-precontract-total-30-cn'] = contractCommon.getCNMoney(data['con-precontract-total-30']);
            data['con-invoice-type1'] = data['con-invoice-type'];
            data['sin-customer-ident'] = data['con-customer-ident'];

            if (args.company == '1') {
                delete data['con-customer-name'];
                delete data['con-customer-ident'];
                delete data['cov-customer-name'];

                data['cov-company-name'] = data['con-company-name'];
                data['sin-company-name'] = data['con-company-name'];
                data['sin-company-phone'] = data['con-company-phone'];
            }

            contractCommon.saveDecorationContract(data, state.table);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
