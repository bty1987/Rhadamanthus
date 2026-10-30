/** app/js/contract/C-004-D-0-0001.js —— 爱林装修工程预签合同（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,agent,type,company}, contract? }。
 *  预签数据：queryProtationForDefaultByOrderId + queryProtationByPid + queryPresignProduceByPpid，
 *  保存时按 showMoney 组装 家装项目预签列表 table。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var C = contractCommon.CONST;
    var E = contractCommon.ENUM;
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, cover: {}, table: [], current: new Date() };
    var protation = {};
    var presignProduce = null;

    if (args.agent == '1') $('.agent').hide();
    if (args.type == '0') $('#con-payment-second').closest('.layui-inline').hide();
    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();

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
        $('#con-housetype').val(data.houseClass);
        $('#con-housetypeness').val(data.houseType);

        $('#con-house-type').val(E.typeness[data.type]);
        $('#con-work-type').val(E.typeness[data.type]);
        $('#con-work-model').val(E.typeness[data.type]);

        $('#con-contract-total').val(app.utils.accAdd(parseFloat(data.orderTotalPrice), parseFloat(state.designPrice)));
        $('#con-contract-stotal').val(data.orderTotalPrice);
        $('#con-contract-rtotal').val(data.factPrice);
        $('#con-buildarea').val(house.innerArea);

        state.decoration = data;
        state.cover['cov-buildarea'] = house.innerArea;
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

    // 工期
    app.post(api.construction.queryConstructionInfoByOrderId, { 'constructionInfo.orderId': orderId }, function (result) {
        var datas = result.constructionInfo || {};
        $('#con-work-number').val(datas.timeLimit);
        $('#con-work-year').val(datas.drawlineTime ? datas.drawlineTime.substr(0, 4) : '');
        $('#con-work-month').val(datas.drawlineTime ? datas.drawlineTime.substr(5, 2) : '');
        $('#con-work-day').val(datas.drawlineTime ? datas.drawlineTime.substr(8, 2) : '');
    }, null, false);

    // 预签数据
    var qu = contractCommon.quotationUtils;
    qu.quotationDetail = { protation: {}, protationItems: {} };
    var showType = { itemtype: 10 };

    app.post(api.quotation.queryProtationForDefaultByOrderId, { 'protation.orderId': orderId }, function (res) {
        qu.quotationDetail.protation = res.protation || {};
        state.totalPrice = qu.quotationDetail.protation.totalPrice;

        $('#con-precontract-total').val(Math.round(app.utils.accSub(qu.quotationDetail.protation.totalPrice, state.decoration.couponCut)));
        $('#con-precontract-total-30').val(Math.round(app.utils.accMul(app.utils.accSub(qu.quotationDetail.protation.totalPrice, state.decoration.couponCut), 0.3)));
    }, null, false);

    // 优惠活动
    app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': orderId }, function (res) {
        var activitys = res.decorationActivitys || [];
        if (activitys.length != 0) $('#con-activity-name').val(activitys[0].activity.name);
    }, null, false);

    if (!qu.quotationDetail.protation.pid) {
        app.showAlert(app.warning, '无预签信息');
        $('#form').empty();
        return;
    }

    app.post(api.quotation.queryProtationItemByPid, { 'protationItem.pid': qu.quotationDetail.protation.pid }, function (res) {
        qu.quotationDetail.protationItems = res.protationItems || [];
    }, null, false);

    app.post(api.quotation.queryProtationByPid, { 'protation.pid': qu.quotationDetail.protation.pid }, function (res) {
        protation = res || {};
    }, null, false);

    app.post(api.quotation.queryPresignProduceByPpid, { 'presignProduce.ppid': protation.protation ? protation.protation.ppid : '' }, function (res) {
        presignProduce = res.presignProduce;
    }, null, false);

    var table1 = { insertWay: 1, keyword: '家装项目预签列表', pageBegin: 1, headers: [], colWidthPercent: [], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };

    var protationItems = {
        0: { name: '标配产品', item: [], items: [], totals: [] },
        1: { name: '赋能产品', item: [], items: [], totals: [] },
        2: { name: '标配外功能区', item: [], items: [], totals: [] },
        3: { name: '个性化产品', item: [], items: [], totals: [] },
        4: { name: '标配产品减项', item: [], items: [], totals: [] }
    };

    var empowermentTotal = 0;
    var functionTotal = 0;
    var subtractTotal = 0;
    var u = app.utils;

    $.each(qu.quotationDetail.protationItems, function (i, qv) {
        if (qv.type == 0 && u.accSub(qv.num, qv.basicNum) > 0) {
            qv.total = qv.areaCale == C.AREACALE_NUMBER_INT ? u.changeThrDecimal(u.accMul(qv.price, u.accSub(qv.num, qv.basicNum))) : u.changeThrDecimal(u.accMul(u.accMul(qv.price, u.accSub(qv.num, qv.basicNum)), protation.protation.quoteArea));
            protationItems[2].items.push([qv.name, u.accSub(qv.num, qv.basicNum), qv.total]);
            protationItems[2].item.push([qv.name, u.accSub(qv.num, qv.basicNum)]);
            functionTotal = u.accAdd(functionTotal, qv.total);
        }
        if (qv.type == 5 || qv.type == 6) {
            qv.total = qv.areaCale == C.AREACALE_NUMBER_INT ? u.changeThrDecimal(u.accMul(qv.price, qv.num)) : u.changeThrDecimal(u.accMul(u.accMul(qv.price, qv.num), protation.protation.quoteArea));
            protationItems[4].items.push([qv.name, -qv.num, qv.total]);
            protationItems[4].item.push([qv.name, -qv.num]);
            subtractTotal = u.accAdd(subtractTotal, qv.total);
        }
        if (qv.type == 7 || qv.type == 8) {
            qv.total = qv.areaCale == C.AREACALE_NUMBER_INT ? u.changeThrDecimal(u.accMul(qv.price, qv.num)) : u.changeThrDecimal(u.accMul(u.accMul(qv.price, qv.num), protation.protation.quoteArea));
            protationItems[1].items.push([qv.name, qv.num, qv.total]);
            protationItems[1].item.push([qv.name, qv.num]);
            empowermentTotal = u.accAdd(empowermentTotal, qv.total);
        }
    });

    protationItems[0].items.push(['标配产品', 1, u.accAdd(protation.protation.quotePrice, protation.protation.activityPrice)]);
    protationItems[0].items.push(['优惠金额', '', protation.protation.preferPrice]);
    protationItems[0].items.push(['管理费收取比例', 1, protation.protation.manageRate]);
    protationItems[0].items.push(['管理费', 1, protation.protation.managePrice]);
    protationItems[0].items.push(['管理优惠', 1, protation.protation.manageProfit]);
    protationItems[0].items.push(['活动优惠', 1, protation.protation.activityProfit]);
    if (protation.protation.advanceProfit && protation.protation.advanceProfit != 0) {
        protationItems[0].items.push(['特批优惠', 1, protation.protation.advanceProfit]);
    }
    protationItems[0].items.push(['税金金额', 1, protation.protation.taxPrice]);
    protationItems[3].items.push(['基础增项', 1, protation.protation.adddPrice]);
    protationItems[3].items.push(['主材增项', 1, protation.protation.addmPrice]);
    protationItems[0].item.push(['标配产品', 1]);
    protationItems[0].item.push(['优惠金额', '']);
    protationItems[0].item.push(['管理费收取比例', 1]);
    protationItems[0].item.push(['折后管理费', 1]);
    protationItems[3].item.push(['工程个性化预收', 1]);
    protationItems[3].item.push(['主材个性化预收', 1]);

    // 话术
    contractCommon.bindTalking([
        { id: 'con-markup-one', types: { 'types[0]': 0 } },
        { id: 'con-markup-two', types: { 'types[0]': 1 } },
        { id: 'con-markup-thr', types: { 'types[0]': 3 } }
    ]);

    function showControl(v) {
        if (v == 3) {
            table1.headers.push('', '', '');
            table1.colWidthPercent.push(3, 3, 3);
            table1.datas.push([presignProduce ? presignProduce.name : '', '', '']);
            table1.datas.push(['项目', '计价面积', '']);
            table1.datas.push([protation.protation.name, protation.protation.quoteArea, '']);

            $.each(protationItems, function (i, q) {
                table1.datas.push([q.name, '', '']);
                table1.datas.push(['项目', '数量', '金额']);
                $.each(q.items, function (j, qi) {
                    table1.datas.push(qi);
                });
                $.each(q.totals, function (k, qt) {
                    table1.datas.push(qt);
                });
            });

            table1.datas.push(['合计(不含税)', '', u.changeThrDecimal(u.accSub(protation.protation.totalPrice, protation.protation.taxPrice))]);
            table1.datas.push(['税金', '', protation.protation.taxPrice]);
            table1.datas.push(['预签合计(含税)', '', protation.protation.totalPrice]);
        } else {
            table1.headers.push('', '');
            table1.colWidthPercent.push(3, 3);
            table1.datas.push([presignProduce ? presignProduce.name : '', '']);
            table1.datas.push(['项目', '计价面积']);
            table1.datas.push([protation.protation.name, protation.protation.quoteArea]);

            $.each(protationItems, function (i, q) {
                table1.datas.push([q.name, '']);
                table1.datas.push(['项目', '数量']);
                $.each(q.item, function (j, qi) {
                    table1.datas.push(qi);
                });
            });
        }
    }

    state.table.push(table1);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'), state.cover);

            data['cov-address'] = data['con-village-name'] + ' ' + data['con-housenumber'];

            data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
            data['con-sign-month'] = app.dateFormat(state.current, 'MM');
            data['con-sign-day'] = app.dateFormat(state.current, 'dd');

            data['con-design-money-cn'] = contractCommon.getCNMoney(parseFloat(data['con-design-money']));
            data['con-precontract-total-cn'] = contractCommon.getCNMoney(parseFloat(data['con-precontract-total']));
            data['con-precontract-total-30'] = Math.round(parseFloat(data['con-precontract-total']) * 0.3);
            data['sin-customer-ident'] = data['con-customer-ident'];

            delete data['showMoney'];

            if (args.company == '1') {
                delete data['con-customer-name'];
                delete data['con-customer-ident'];
                delete data['cov-customer-name'];

                data['cov-company-name'] = data['con-company-name'];
                data['sin-company-name'] = data['con-company-name'];
                data['sin-company-phone'] = data['con-company-phone'];
            }

            if ($('#showMoney').val() == 1) {
                showControl(3);
            } else {
                showControl(2);
            }

            contractCommon.saveDecorationContract(data, state.table);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
