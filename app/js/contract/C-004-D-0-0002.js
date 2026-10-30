/** app/js/contract/C-004-D-0-0002.js —— 爱林装修工程补充协议（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,agent,type,company}, contract? }。
 *  报价 + 选材（querySelectionItemByOrderId）→ 家装项目列表 / 主材选材明细列表 两张表。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var E = contractCommon.ENUM;
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, decoration: null, cover: {}, table: [], current: new Date() };
    var selectionTypes = E.selectionType;

    if (args.agent == '1') $('.agent').hide();
    if (args.type == '0') $('#con-payment-second').closest('.layui-inline').hide();
    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();

    contractCommon.current(function (d) { state.current = d; });
    state.cover['cov-sign-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['cov-sign-month'] = app.dateFormat(state.current, 'MM');
    state.cover['cov-sign-day'] = app.dateFormat(state.current, 'dd');

    app.bindData($('#con-housetype'), contractCommon.toDatas(E.houseClass), 'key', 'value');
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

        state.cover['cov-orderId'] = orderId;
        state.cover['cov-customer-name'] = customer.name;
        state.cover['sin-customer-name'] = customer.name;

        $('#con-company-no').val(customer.companyNo);
        $('#con-company-name').val(customer.companyName);

        $('#con-province-name').val(proper.city ? proper.city.province : '');
        $('#con-city-name').val(proper.city ? proper.city.name : '');
        $('#con-proper-name').val(proper.name);
        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);
        $('#con-housetype').val(data.houseClass);

        $('#con-house-type').val(E.typeness[data.type]);
        $('#con-work-type').val(E.typeness[data.type]);
        $('#con-work-model').val(E.typeness[data.type]);

        $('#con-contract-total').val(app.utils.accAdd(parseFloat(data.orderTotalPrice), parseFloat(state.designPrice)));
        $('#con-contract-rtotal').val(data.factPrice);
        $('#cov-orderId').val(data.orderId);

        $('#con-buildarea').val(house.innerArea);

        state.cover['cov-buildarea'] = house.innerArea;
        state.cover['cov-designer-name'] = data.designer ? data.designer.currentName : '';
        state.cover['cov-designer-phone'] = data.designer ? data.designer.phone : '';
        state.decoration = data;
        form.render('select');
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#con-customer-phone').val(state.customer.phone);
        $('#sin-customer-phone').val(state.customer.phone);
        $('#con-customer-ident').val(state.customer.identity);

        $('#con-company-no').val(state.customer.companyNo);
        $('#con-company-name').val(state.customer.companyName);
        $('#sin-company-phone').val(state.customer.companyPhone);

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

    // 报价
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

    // 活动物品（预留，对齐旧注释逻辑不产出表）
    var decorationActivityItems = [];
    app.post(api.decoration.queryDecorationActivityItem, { 'decoration.orderId': orderId }, function (res) {
        decorationActivityItems = res.decorationActivityItems || [];
    }, null, false);

    // 选材明细
    var selectionItems = [];
    app.post(api.quotation.querySelectionItemByOrderId, { 'selectionItem.decoration.orderId': orderId }, function (res) {
        selectionItems = res.selectionItems || [];
    }, null, false);

    var table1 = { insertWay: 1, keyword: '家装项目列表', pageBegin: 1, headers: ['序号', '项目名称', '类型', '单位', '数量', '工艺做法及材料说明'], colWidthPercent: [1, 3, 3, 1, 1, 5], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };
    var table3 = { insertWay: 1, keyword: '主材选材明细列表', pageBegin: 1, headers: ['序号', '报价项', '品牌', '类型', '型号', '单位', '数量', '备注'], colWidthPercent: [2, 3, 3, 2, 3, 2, 2, 5], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };

    var index = 0;
    $.each(qu.quotationDetail.quotationFunctionAreaItemCs, function (i, v) {
        var functionArea = i.split('-')[1];
        table1.datas.push([contractCommon.getBigNumber(index + 1), functionArea, '', '', '', '']);
        $.each(v, function (j, qv) {
            qv.num = 1;
            qv.measurementUnit = '项';
            table1.datas.push([(j + 1), qv.itemName, qv.typestr, qv.measurementUnit, qv.num, qv.content ? qv.content : '-']);
        });
        index++;
    });

    index = 0;
    var printSelectionItems = [];

    if (selectionItems && selectionItems.length) {
        var sIndex = 0;
        var areaName = [];

        $.each(selectionItems, function (i, v) {
            var itemName = '';

            $.each(qu.quotationDetail.quotationFunctionAreaItemCs, function (qi, qv) {
                $.each(qv, function (qii, qvv) {
                    if ([0, 30].indexOf(v.type) != -1) {
                        if (qvv.qfaiId == v.quoteId) {
                            itemName = qvv.itemName;
                        }
                    }
                    if ([1, 2, 31, 32].indexOf(v.type) != -1) {
                        if (qvv.eiid == v.quoteId) {
                            itemName = qvv.itemName;
                        }
                    }
                    if ([3, 4, 13, 14, 33, 34].indexOf(v.type) != -1) {
                        if (qvv.ariId == v.quoteId) {
                            itemName = qvv.itemName;
                        }
                    }
                });
            });

            if (printSelectionItems.length == 0 || areaName.indexOf(v.areaName) == -1) {
                printSelectionItems[sIndex] = { name: '', item: [], items: [] };
                areaName.push(v.areaName);
                printSelectionItems[sIndex].name = v.areaName;
                printSelectionItems[sIndex].item.push(contractCommon.getBigNumber(index++ + 1), v.areaName, '', '', '', '', '', '');
                printSelectionItems[sIndex].items.push([1, itemName, v.goods.brand, selectionTypes[v.type], v.goods.name, v.goods.measurementUnit, v.num, v.comment == null ? '' : v.comment]);
                sIndex++;
            } else {
                $.each(printSelectionItems, function (si, sv) {
                    if (v.areaName == sv.name) {
                        printSelectionItems[si].items.push([sv.items.length + 1, itemName, v.goods.brand, selectionTypes[v.type], v.goods.name, v.goods.measurementUnit, v.num, v.comment == null ? '' : v.comment]);
                    }
                });
            }
        });

        $.each(printSelectionItems, function (i, v) {
            table3.datas.push(v.item);
            $.each(v.items, function (ii, iv) {
                table3.datas.push(iv);
            });
        });

        table3.datas.push(['', '', '', '', '', '', '', '注: 开工放线当日起，48小时内是允许变更一次主材，且最多只允许变更两个品类，如超期发生主材变更，每变更一个品类，客户主材工期自动顺延7个工作日.']);
    }

    state.table.push(table1);
    state.table.push(table3);

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

            data['cov-address'] = data['con-village-name'] + ' ' + data['con-housenumber'];

            data['con-sign-year'] = app.dateFormat(state.current, 'yyyy');
            data['con-sign-month'] = app.dateFormat(state.current, 'MM');
            data['con-sign-day'] = app.dateFormat(state.current, 'dd');

            data['con-contract-rtotal-cn'] = contractCommon.getCNMoney(parseFloat(data['con-contract-rtotal']));
            data['sin-customer-ident'] = data['con-customer-ident'];

            if (args.company == '1') {
                delete data['con-customer-name'];
                delete data['con-customer-ident'];
                delete data['cov-customer-name'];

                data['cov-company-name'] = data['con-company-name'];
                data['sin-company-name'] = data['con-company-name'];
            }

            contractCommon.saveDecorationContract(data, state.table);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
