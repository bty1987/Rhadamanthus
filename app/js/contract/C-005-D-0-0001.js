/** app/js/contract/C-005-D-0-0001.js —— 恩林装修工程合同（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,agent,type,company}, contract? }。
 *  报价 → 家装项目列表 table（itemtype=31）。 */
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
    if (args.type == '0') $('.thirdPaymentGroup').hide();
    if (args.type == '2') {
        $('.secondPaymentGroup').hide();
        $('.thirdPaymentGroup').hide();
    }
    if (args.type == '3') {
        $('.secondPaymentGroup').hide();
        $('.thirdPaymentGroup').hide();
        $('.finalPaymentGroup').hide();
    }
    if (args.company != '1') $('.company').hide();
    if (args.company == '1') {
        $('.customer').hide();
        $('.agent').hide();
    }

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');

    app.bindData($('#con-housetype'), contractCommon.toDatas(E.houseClass), 'key', 'value');
    app.bindData($('#con-housetypeness'), contractCommon.toDatas(E.houseType), 'key', 'value');
    app.bindData($('#con-decorationPicture-type'), contractCommon.toDatas(E.decorationPictureType), 'key', 'value');
    form.render('select');

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

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {}, proper = village.cityProper || {};
        var customer = data.customer || {};
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

        $('#con-province-name').val(proper.city ? proper.city.province : '');
        $('#con-city-name').val(proper.city ? proper.city.name : '');
        $('#con-proper-name').val(proper.name);
        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);
        $('#con-buildarea').val(house.innerArea);
        $('#con-housetype').val(data.houseClass);
        $('#con-housetypeness').val(data.houseType);

        $('#con-house-type').val(E.typeness[data.type]);
        $('#con-work-model').val(E.typeness[data.typeness]);

        $('#con-contract-stotal').val(data.orderTotalPrice);
        $('#con-contract-rtotal').val(data.factPrice);

        state.decoration = data;
        state.cover['cov-buildarea'] = house.innerArea;
        state.cover['cov-address'] = village.name + ' ' + house.houseNumber;
        state.cover['cov-designer-name'] = data.designer ? data.designer.currentName : '';
        state.cover['cov-designer-phone'] = data.designer ? data.designer.phone : '';
        form.render('select');
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#con-customer-phone').val(state.customer.phone);
        $('#sin-customer-phone').val(state.customer.phone);
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

    // 优惠活动
    app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': orderId }, function (res) {
        var activitys = res.decorationActivitys || [];
        if (activitys.length != 0) $('#con-activity-name').val(activitys[0].activity.name);
    }, null, false);

    // 报价 → 家装项目列表
    var qu = contractCommon.quotationUtils;
    qu.quotationDetail = { quotation: {}, quotationFunctionAreas: {} };
    var showType = { itemtype: 31 };

    app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
        qu.quotationDetail.quotation = res.quotation || {};
    }, null, false);

    if (!qu.quotationDetail.quotation.qid) {
        app.showAlert(app.warning, '无报价信息');
        $('#form').empty();
        return;
    }

    app.post(api.quotation.queryQuotationFunctionAreaByQuotationId, { 'quotation.qid': qu.quotationDetail.quotation.qid }, function (res) {
        qu.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
    }, null, false);

    app.post(api.quotation.queryExtensionByOrderId, { 'extension.orderId': orderId }, function (res) {
        qu.quotationDetail.extensions = res.extensions || [];
    }, null, false);

    app.post(api.quotation.queryAddReduceByOrderId, { 'addReduce.orderId': orderId }, function (res) {
        qu.quotationDetail.addReduces = res.addReduces || [];
    }, null, false);

    qu.initQuotationDetailItem(qu.quotationDetail.quotation, qu.quotationDetail.quotationFunctionAreas,
        qu.quotationDetail.addReduces, qu.quotationDetail.extensions, null,
        state.decoration ? state.decoration.type : undefined, false, showType);

    var table1 = { insertWay: 1, keyword: '家装项目列表', pageBegin: 1, headers: ['序号', '项目名称', '单位', '数量', '工艺做法及材料说明'], colWidthPercent: [1, 3, 1, 1, 5], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };
    var index = 0;
    $.each(qu.quotationDetail.quotationFunctionAreaItemCs, function (i, v) {
        var functionArea = i.split('-')[1];
        var _index = 0;
        table1.datas.push([contractCommon.getBigNumber(index + 1), functionArea, '', '', '']);
        $.each(v, function (j, qv) {
            qv.num = 1;
            qv.measurementUnit = '项';
            table1.datas.push([(_index + 1), qv.itemName, qv.measurementUnit, qv.num, qv.content ? qv.content : '-']);
            _index++;
        });
        index++;
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

            data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
            data['con-sign-month'] = app.dateFormat(state.current, 'MM');
            data['con-sign-day'] = app.dateFormat(state.current, 'dd');

            data['con-design-money1'] = parseFloat(data['con-design-money']);
            data['con-activity-name1'] = data['con-activity-name'];

            data['con-contract-stotal-cn'] = contractCommon.getCNMoney(parseFloat(data['con-contract-stotal']));
            data['con-contract-rtotal-cn'] = contractCommon.getCNMoney(parseFloat(data['con-contract-rtotal']));
            data['con-design-money-cn'] = contractCommon.getCNMoney(parseFloat(data['con-design-money']));

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
