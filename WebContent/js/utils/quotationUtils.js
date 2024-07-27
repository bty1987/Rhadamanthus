var quotationUtils = {
    sortQuo: function(_items) {

        _items = _items.sort(function(a, b) {

            if (a.index == null || b.index == null) {// 降序排列
                return b.index - a.index;
            } else {// 升序
                return a.index - b.index;
            }
        });
        return _items;
    },
    loadQuotationDetail: function() {

        quotationUtils.quotationDetail = {};

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": params.quotation.orderId,
        }, function(res) {

            quotationUtils.quotationDetail.quotation = res.quotation;
        }, null, false);

        if (!quotationUtils.quotationDetail.quotation.qid) {
            com.showAlert(com.warning, "默认报价不存在");
            return false;
        }

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": params.quotation.orderId,
        }, function(res) {

            quotationUtils.quotationDetail.quotation.decoration = res.decoration;
        }, null, false);

        var quotationId = quotationUtils.quotationDetail.quotation.qid;
        var status = quotationUtils.quotationDetail.quotation.status;

        if (!quotationUtils.quotationDetail.quotationFunctionAreas) {
            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {
                "quotation.qid": quotationId
            }, function(res) {

                quotationUtils.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
            }, null, false);
        }

        if (!quotationUtils.quotationDetail.addReduces) {
            com.post(api.addReduce.queryAddReduceByOrderId, {
                "addReduce.orderId": params.quotation.orderId
            }, function(res) {

                quotationUtils.quotationDetail.addReduces = res.addReduces;
            }, null, false);
        }

        if (!quotationUtils.quotationDetail.extensions) {
            com.post(api.quotation.queryExtensionByOrderId, {
                "extension.orderId": params.quotation.orderId
            }, function(res) {

                quotationUtils.quotationDetail.extensions = res.extensions;
            }, null, false);
        }

        quotationUtils.statisticalQuotationItem(quotationUtils.quotationDetail.quotationFunctionAreas, quotationUtils.quotationDetail.addReduces, quotationUtils.quotationDetail.extensions);

        var showType = {
            itemtype: 31
        };

        quotationUtils.initQuotationDetailItem(quotationUtils.quotationDetail.quotation, quotationUtils.quotationDetail.quotationFunctionAreas, quotationUtils.quotationDetail.addReduces, quotationUtils.quotationDetail.extensions, params.quotation.orderType, true, showType);

        quotationUtils.initQuotationFunctionAreaDetail();
        quotationUtils.initQuotationWorkerTypeDetail();
        quotationUtils.initQuotationSelectionCategoryDetail();

    },
    statisticalQuotationItem: function(quotationFunctionAreas, addReduces, extensions) {

        var $quotationUndisPrice = 0;// 报价项折扣总额
        var $quotationTotalPrice = 0;// 报价项非折扣总额
        var $quotationCostPrice = 0;// 报价项成本总额

        var $addExtensionItemTotalPrice = 0;// 扩展项增项总额
        var $minusExtensionItemTotalPrice = 0;// 扩展项减项总额

        var $extensionTotalPrice = 0; // 拓展项总额

        var $addReduceTotal = 0;// 增项总额
        var $minusQuoTotalPrice = 0;// 减项中的报价项非折扣总额
        var $minusQuoUndisPrice = 0;// 减项中的报价折扣总额
        var $minusAddReduceTotal = 0;// 减项中的增项总额
        var $minusExtensionTotalPrice = 0;// 减项中的扩展项总额

        var $addReduceTotalPrice = 0; // 增减项总额
        var $addReduceManagePrice = 0; // 增减项管理费

        var quotationFunctionAreaLength = quotationFunctionAreas.length;

        for ( var i = 0; i < quotationFunctionAreaLength; ++i) {

            var quotationFunctionArea = quotationFunctionAreas[i];

            var quotationFunctionAreaItems = quotationUtils.sortQuo(quotationFunctionArea.quotationFunctionAreaItems);
            var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;

            var _disPrice = 0, _undisPrice = 0, _costPrice = 0;

            for ( var j = 0; j < quotationFunctionAreaItemLength; j++) {

                var quotationFunctionAreaItem = quotationFunctionAreaItems[j];

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT) {
                    if (quotationFunctionAreaItem.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT) {
                        _disPrice = utils.accAdd(_disPrice, utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.initNum));
                    } else if (quotationFunctionAreaItem.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT) {
                        _undisPrice = utils.accAdd(_undisPrice, utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.initNum));
                    }
                }

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT) {
                    _costPrice = utils.accAdd(_costPrice, utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.initNum));
                }
            }

            if (quotationFunctionArea.type == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT) {
                $quotationUndisPrice = utils.accAdd($quotationUndisPrice, _undisPrice);
                $quotationTotalPrice = utils.accAdd($quotationTotalPrice, _disPrice);
                $quotationCostPrice = utils.accAdd($quotationCostPrice, _costPrice);
            } else if (quotationFunctionArea.type == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) {
                $quotationUndisPrice = utils.accAdd($quotationUndisPrice, quotationFunctionArea.total);
            } else if (quotationFunctionArea.type == constant.quotation().quotationFunctionArea.TYPE_COST_INT) {
                $quotationUndisPrice = utils.accAdd($quotationUndisPrice, quotationFunctionArea.total);
                $quotationCostPrice = utils.accAdd($quotationCostPrice, quotationFunctionArea.total);
            }
        }

        if (extensions != null && extensions.length != 0) {

            for ( var i = 0; i < extensions.length; i++) {

                var extension = extensions[i];
                var extensionItems = extension.extensionItems;

                if (extensionItems == null || extensionItems.length == 0)
                    continue;

                for ( var j = 0; j < extensionItems.length; j++) {

                    var extensionItem = extensionItems[j];

                    var _dcp = 0, _dcpt = 0;

                    if ([0, 1, 5].indexOf(extensionItem.type) != -1) {

                        _dcp = extensionItem.unitPrice;
                        _dcpt = utils.changeThrDecimal(utils.accMul(extensionItem.num, _dcp));

                        $addExtensionItemTotalPrice = utils.accAdd($addExtensionItemTotalPrice, _dcpt);
                    } else if ([2, 3, 4].indexOf(extensionItem.type) != -1) {

                        _dcp = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, utils.accDiv(quotationUtils.quotationDetail.quotation.discount, 10)));
                        _dcpt = utils.changeThrDecimal(utils.accMul(extensionItem.num, _dcp));

                        $minusExtensionItemTotalPrice = utils.accAdd($minusExtensionItemTotalPrice, _dcpt);
                    }
                }

                $extensionTotalPrice = utils.accAdd($extensionTotalPrice, utils.accMul(extension.total, extension.type == 0 ? 1 : -1));
            }
        }

        if (addReduces != null && addReduces.length != 0) {

            for ( var i = 0; i < addReduces.length; i++) {

                var addReduce = addReduces[i];
                var addReduceItems = addReduce.addReduceItems;

                if (addReduceItems == null || addReduceItems.length == 0)
                    continue;

                for ( var j = 0; j < addReduceItems.length; j++) {

                    var addReduceItem = addReduceItems[j];

                    if ([0, 2].indexOf(addReduceItem.type) != -1) {// 统计增项总额
                        $addReduceTotal = utils.accAdd($addReduceTotal, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
                    } else {
                        var addReduceItemNum = -addReduceItem.num;

                        var price = utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice));
                        if (addReduceItem.type == 4 || addReduceItem.type == 5) {

                            if (addReduceItem.type == 4) {// 统计减项中增项总额
                                $minusAddReduceTotal = utils.accAdd($minusAddReduceTotal, price);
                            } else {// 统计减项中拓展项总额
                                $minusExtensionTotalPrice = utils.accAdd($minusExtensionTotalPrice, price);
                            }

                            // 统计减项中的报价项非折扣总额 , 增项中数量已经为0 , 不重复处理
                            // $minusQuoTotalPrice = utils.accAdd($minusQuoTotalPrice, price);

                        } else if (params.quotation.orderType == 2) {
                            // 统计减项中的报价折扣总额
                            $minusQuoUndisPrice = utils.accAdd($minusQuoUndisPrice, price);
                        } else {
                            if ([0, 2].indexOf(addReduceItem.discount) != -1) {// 统计减项中的报价项非折扣总额
                                $minusQuoTotalPrice = utils.accAdd($minusQuoTotalPrice, price);
                            } else {// 统计减项中的报价折扣总额
                                $minusQuoUndisPrice = utils.accAdd($minusQuoUndisPrice, price);
                            }
                        }
                    }
                }

                $addReduceTotalPrice = utils.accAdd($addReduceTotalPrice, utils.accMul(addReduce.total, addReduce.type == 0 ? 1 : -1));
                $addReduceManagePrice = utils.accAdd($addReduceManagePrice, utils.accMul(addReduce.managePrice, addReduce.type == 0 ? 1 : -1));
            }
        }

        quotationUtils.quotationDetail.quotationUndisPrice = $quotationUndisPrice; // 报价项折扣总额
        quotationUtils.quotationDetail.quotationTotalPrice = $quotationTotalPrice; // 报价项非折扣总额

        quotationUtils.quotationDetail.addExtensionItemTotalPrice = $addExtensionItemTotalPrice; // 扩展项总额
        quotationUtils.quotationDetail.minusExtensionItemTotalPrice = $minusExtensionItemTotalPrice; // 扩展项总额

        quotationUtils.quotationDetail.extensionTotalPrice = $extensionTotalPrice; // 扩展项总额

        quotationUtils.quotationDetail.addReduceTotal = $addReduceTotal;// 增项总额
        quotationUtils.quotationDetail.minusQuoTotalPrice = $minusQuoTotalPrice;// 减项中的报价项非折扣总额
        quotationUtils.quotationDetail.minusQuoUndisPrice = $minusQuoUndisPrice;// 减项中的报价折扣总额
        quotationUtils.quotationDetail.minusAddReduceTotal = $minusAddReduceTotal;// 减项中的增项总额
        quotationUtils.quotationDetail.minusExtensionTotalPrice = $minusExtensionTotalPrice;// 减项中的扩展项总额

        quotationUtils.quotationDetail.addReduceTotalPrice = $addReduceTotalPrice; // 增减项总额
        quotationUtils.quotationDetail.addReduceManagePrice = $addReduceManagePrice; // 增减项管理费总额
    },
    initQuotationDetailItem: function(quotation, quotationFunctionAreas, addReduces, extensions, orderType, dataProcessing, showType) {

        var extensionItemTypes = {
            "0": "标准增(扩展)",
            "1": "定义增(扩展)",
            "2": "标准减(扩展)",
            "3": "定义减(扩展)",
            "4": "报价减(扩展)",
            "5": "报价增(扩展)",
        };

        var addReduceItemTypes = {
            "0": "标准增(增减)",
            "1": "系统增(增减)",
            "2": "定义增(增减)",
            "3": "报价减(增减)",
            "4": "增项减(增减)",
            "5": "扩展减(增减)"
        };

        var $decorationtype = orderType;
        var discount = quotation.discount;
        var quotationFunctionAreaItemCs = {};
        var quotationFunctionAreaItemWs = {};

        var reduceNums = {
            ariId: {},
            eiId: {},
            qfaiId: {},
        };

        var quotationFunctionAreaLength = quotationFunctionAreas.length;

        for ( var i = 0; i < quotationFunctionAreaLength; ++i) {

            var quotationFunctionArea = quotationFunctionAreas[i];

            // if (showType.notManagementArea == quotationFunctionArea.functionAreaName) continue;
            if (quotationFunctionArea.functionAreaOrder == 9999 && (showType.itemtype & 16) != 16)
                continue;

            var quotationFunctionAreaItems = quotationUtils.sortQuo(quotationFunctionArea.quotationFunctionAreaItems);
            var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;

            quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName] = [];

            for ( var j = 0; j < quotationFunctionAreaItemLength; j++) {

                var quotationFunctionAreaItem = quotationFunctionAreaItems[j];

                if (quotationFunctionAreaItem.type != 5 && (showType.itemtype & 1) != 1)
                    continue;
                if (quotationFunctionAreaItem.type == 5 && (showType.itemtype & 8) != 8)
                    continue;

                if (!quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType]) {
                    quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType] = {};
                }

                var _price = 0;
                var _dcp = 0;
                var _dcpt = 0;
                var _discountNum = 10;
                var _total = 0;

                quotationFunctionAreaItem.typestr = "-";

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT) {
                    quotationFunctionAreaItem.typestr = "标准";
                    quotationFunctionAreaItem.discount = $decorationtype == 2 ? 1 : quotationFunctionAreaItem.discount;
                }

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT) {
                    quotationFunctionAreaItem.typestr = "自定义";
                    quotationFunctionAreaItem.discount = $decorationtype == 2 ? 1 : quotationFunctionAreaItem.discount;
                }

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_TRAFFIC_INT) {
                    quotationFunctionAreaItem.typestr = "管理";
                    quotationFunctionAreaItem.discount = $decorationtype == 2 ? 1 : quotationFunctionAreaItem.discount;
                }

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_MANAGE_INT) {
                    quotationFunctionAreaItem.typestr = "管理";
                }
                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_TAX_INT) {
                    quotationFunctionAreaItem.typestr = "管理";
                }

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT) {
                    quotationFunctionAreaItem.typestr = "不计";
                    quotationFunctionAreaItem.discount = 0;
                }

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT) {
                    quotationFunctionAreaItem.typestr = "标准"; // 成本/优惠
                    quotationFunctionAreaItem.discount = 0;
                }

                if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT) {
                    quotationFunctionAreaItem.typestr = "标准"; // 非业绩
                    quotationFunctionAreaItem.discount = $decorationtype == 2 ? 1 : quotationFunctionAreaItem.discount;
                }

                if (quotationFunctionAreaItem.discount == 1) {
                    _discountNum = discount;
                }

                if ([0, 1, 6, 7].indexOf(quotationFunctionAreaItem.type) != -1) {
                    _price = quotationFunctionAreaItem.unitPrice;
                    _dcp = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, utils.accDiv(_discountNum, 10)));
                    _dcpt = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.initNum, _dcp));
                    _total = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.initNum, quotationFunctionAreaItem.unitPrice));
                }

                quotationFunctionAreaItem.suptype = 1; // 大类型 , 1: 报价项 , 2: 扩展项 , 3: 增减项

                quotationFunctionAreaItem.price = _price;
                quotationFunctionAreaItem.num = quotationFunctionAreaItem.initNum;
                quotationFunctionAreaItem.dcp = _dcp;
                quotationFunctionAreaItem.dcpt = _dcpt;
                quotationFunctionAreaItem._discountNum = _discountNum;
                quotationFunctionAreaItem.total = _total;

                quotationFunctionAreaItem.quotationTotalPrice = _dcpt;

                if (quotationFunctionArea.type == constant.quotation().quotetionFunctionArea.TYPE_NOT_COUNT_INT) {

                    quotationFunctionAreaItem._discountNum = 0;
                    quotationFunctionAreaItem.quotationTotalPrice = 0;

                    quotationFunctionAreaItem.dcp = 0;
                    quotationFunctionAreaItem.dcpt = 0;
                }

                if (quotationFunctionAreaItem.type == constant.quotation().quotetionFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) {
                    quotationUtils.quotationDetail.trafficDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.price = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.num = quotation.trafficPrice;
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT || $decorationtype == 2 ? utils.changeThrDecimal(utils.accMul(quotation.trafficPrice, utils.accDiv(discount, 10))) : quotation.trafficPrice;
                    quotationFunctionAreaItem.dcp = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.measurementUnit = "车运费";
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.trafficPrice;
                    quotationFunctionAreaItem.total = quotation.trafficPrice;
                } else if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_MANAGE_INT) {
                    quotationUtils.quotationDetail.manageDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.num = quotation.managePrice;
                    quotationFunctionAreaItem.measurementUnit = "管理费";
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(quotation.managePrice, utils.accDiv(discount, 10))) : quotation.managePrice;
                    quotationFunctionAreaItem._discountNum = quotationFunctionAreaItem.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT ? _discountNum : 10;
                    quotationFunctionAreaItem.dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice, (quotation.decoration.notSalesmanRate > 0 && quotation.decoration.notSalesmanRate < 1) ? quotation.decoration.notSalesmanRate : 0));
                    quotationFunctionAreaItem.unitPrice = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice, (quotation.decoration.notSalesmanRate > 0 && quotation.decoration.notSalesmanRate < 1) ? quotation.decoration.notSalesmanRate : 0));
                    quotationFunctionAreaItem.price = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.managePrice;
                    quotationFunctionAreaItem.total = quotation.managePrice;
                } else if (quotationFunctionAreaItem.type == constant.quotation().quotationFunctionAreaItem.TYPE_TAX_INT) {
                    quotationUtils.quotationDetail.taxDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.num = quotation.taxPrice;
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(quotation.taxPrice, utils.accDiv(discount, 10))) : quotation.taxPrice;
                    quotationFunctionAreaItem.dcp = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.measurementUnit = "税金";
                    quotationFunctionAreaItem.price = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.taxPrice;
                    quotationFunctionAreaItem.total = quotation.taxPrice;
                }

                if (quotationFunctionAreaItem.type != constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT)
                    quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName].push(quotationFunctionAreaItem);
            }
        }

        if ((showType.itemtype & 16) == 16) {
            quotationFunctionAreaItemCs['-扩展项目'] = [];
            quotationFunctionAreaItemCs['-增减项目'] = [];
        }

        if ((showType.itemtype & 2) == 2 && extensions != null && extensions.length != 0) {

            for ( var i = 0; i < extensions.length; i++) {

                var extension = extensions[i];
                var extensionItems = extension.extensionItems;

                var totalPrice = 0;

                if (extensionItems != null && extensionItems.length != 0) {

                    for ( var j = 0; j < extensionItems.length; j++) {

                        var extensionItem = extensionItems[j];

                        var _dcp = 0, _dcpt = 0;

                        if ([0, 1, 5].indexOf(extensionItem.type) != -1) {

                            extensionItem._discountNum = 10;

                            _dcp = extensionItem.unitPrice;
                            _dcpt = utils.changeThrDecimal(utils.accMul(_dcp, extensionItem.num));
                        } else if ([2, 3, 4].indexOf(extensionItem.type) != -1) {

                            extensionItem.unitPrice = -extensionItem.unitPrice;
                            extensionItem._discountNum = discount;

                            _dcp = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, utils.accDiv(discount, 10)));
                            _dcpt = utils.changeThrDecimal(utils.accMul(utils.accMul(extensionItem.unitPrice, extensionItem.num), utils.accDiv(discount, 10)));
                        }

                        extensionItem.suptype = 2; // 大类型 , 1: 报价项 , 2: 扩展项 , 3: 增减项
                        extensionItem.typestr = extensionItemTypes[extensionItem.type];

                        extensionItem.price = extensionItem.unitPrice;
                        extensionItem.dcp = _dcp;
                        extensionItem.dcpt = _dcpt;

                        extensionItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, extensionItem.num));
                        extensionItem.total = extensionItem.quotationTotalPrice;

                        totalPrice = utils.changeTwoDecimal(utils.accAdd(totalPrice, extensionItem.quotationTotalPrice));

                        if (quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName] == undefined) {
                            quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName] = [];
                        }

                        if (quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName]) {
                            quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName].push(extensionItem);
                        }
                    }
                }

                if (quotationFunctionAreaItemCs['-扩展项目'] && extension.manageRate != 0 && extension.managePrice != 0) {
                    quotationFunctionAreaItemCs['-扩展项目'].push({
                        subtype: 0,
                        suptype: 2,
                        typestr: "管理",
                        workType: "其他",
                        itemName: "管理费",
                        num: extension.managePrice,
                        measurementUnit: "管理费",
                        _discountNum: extension.manageDiscount,
                        unitPrice: extension.manageRate,
                        price: extension.managePrice,
                        quotationTotalPrice: extension.managePrice,
                        total: extension.managePrice,
                    });
                }
            }
        }

        if ((showType.itemtype & 4) == 4 && addReduces != null && addReduces.length != 0) {

            for ( var i = 0; i < addReduces.length; i++) {

                var addReduce = addReduces[i];
                var addReduceItems = addReduce.addReduceItems;

                var totalPrice = 0;

                if (addReduceItems != null && addReduceItems.length != 0) {

                    for ( var j = 0; j < addReduceItems.length; j++) {

                        var addReduceItem = addReduceItems[j];

                        if (addReduceItem.type == 4) {
                            if (reduceNums.ariId[addReduceItem.quoteItemId]) {
                                reduceNums.ariId[addReduceItem.quoteItemId].num = utils.accAdd(reduceNums.ariId[addReduceItem.quoteItemId].num, addReduceItem.num);
                            } else {
                                reduceNums.ariId[addReduceItem.quoteItemId] = {};
                                reduceNums.ariId[addReduceItem.quoteItemId].num = addReduceItem.num;
                                reduceNums.ariId[addReduceItem.quoteItemId].quotationFunctionType = addReduceItem.quotationFunctionAreaType;
                            }
                        }

                        if (addReduceItem.type == 5) {
                            if (reduceNums.eiId[addReduceItem.quoteItemId]) {
                                reduceNums.eiId[addReduceItem.quoteItemId].num = utils.accAdd(reduceNums.eiId[addReduceItem.quoteItemId].num, addReduceItem.num);
                            } else {
                                reduceNums.eiId[addReduceItem.quoteItemId] = {};
                                reduceNums.eiId[addReduceItem.quoteItemId].num = addReduceItem.num;
                                reduceNums.eiId[addReduceItem.quoteItemId].quotationFunctionType = addReduceItem.quotationFunctionAreaType;
                            }
                        }

                        if (addReduce.type == 1) {
                            addReduceItem.num = -addReduceItem.num;
                        }

                        var _discountNum = addReduce.discount;
                        var _dcp = [1, 3].indexOf(addReduceItem.discount) != -1 ? utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(addReduce.discount, 10))) : addReduceItem.unitPrice;
                        var _dcpt = utils.changeThrDecimal(utils.accMul(addReduceItem.num, _dcp));

                        addReduceItem.suptype = 3; // 大类型 , 1: 报价项 , 2: 扩展项 , 3: 增减项
                        addReduceItem.typestr = addReduceItemTypes[addReduceItem.type];

                        addReduceItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice));
                        addReduceItem.total = addReduceItem.quotationTotalPrice;

                        addReduceItem.price = addReduceItem.unitPrice;
                        addReduceItem.dcp = _dcp;
                        addReduceItem.dcpt = _dcpt;
                        addReduceItem._discountNum = _discountNum;

                        totalPrice = utils.changeTwoDecimal(utils.accAdd(totalPrice, addReduceItem.quotationTotalPrice));

                        if (quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName] == undefined) {
                            quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName] = [];
                        }

                        if (quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName]) {
                            quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName].push(addReduceItem);
                        }
                    }
                }

                if (quotationFunctionAreaItemCs['-增减项目'] && addReduce.manageRate != 0 && addReduce.managePrice != 0) {
                    quotationFunctionAreaItemCs['-增减项目'].push({
                        subtype: 0,
                        suptype: 3,
                        typestr: "管理",
                        workType: "其他",
                        itemName: "管理费",
                        num: addReduce.managePrice,
                        measurementUnit: "管理费",
                        _discountNum: addReduce.manageDiscount,
                        unitPrice: addReduce.manageRate,
                        price: addReduce.managePrice,
                        quotationTotalPrice: addReduce.managePrice,
                        total: addReduce.managePrice,
                    });
                }

                if (quotationFunctionAreaItemCs['-增减项目'] && addReduce.taxRate != 0 && addReduce.taxPrice != 0) {
                    quotationFunctionAreaItemCs['-增减项目'].push({
                        subtype: 0,
                        suptype: 3,
                        typestr: "管理",
                        workType: "其他",
                        itemName: "税金",
                        num: addReduce.taxPrice,
                        measurementUnit: "税金",
                        _discountNum: addReduce.taxDiscount,
                        unitPrice: addReduce.taxRate,
                        price: addReduce.taxPrice,
                        quotationTotalPrice: addReduce.taxPrice,
                        total: addReduce.taxPrice,
                    });
                }
            }
        }

        quotationUtils.quotationDataProcessing(quotationFunctionAreaItemCs, reduceNums, dataProcessing);
    },

    initQuotationSelectionCategoryDetail: function() {

        var $selectionCategory = com.focusPage('#selectionCategory').html("");
        var $ulselectionCategory = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($selectionCategory);

        // 已选品类
        var $domainSelected = $('<div></div>').addClass('widget-box transparent');
        var $dheadSelected = $('<div></div>').addClass('widget-header');
        var $dnameSelected = $('<h4></h4>').append($('<strong></strong>').html("已选品类"));

        var $dbodySelected = $('<div></div>').addClass('widget-body col-md-12').css("padding-top", "10px");
        var $dbodyInnerSelected = $('<div></div>').addClass('widget-body-inner');
        var $listSelected = $('<ul></ul>').addClass('fl-quo-list selected');

        $dheadSelected.append($dnameSelected);
        $dbodyInnerSelected.append($listSelected).appendTo($dbodySelected);
        $domainSelected.append($dheadSelected).append($dbodySelected);
        $domainSelected.appendTo($ulselectionCategory);

        // 未选品类
        var $domainUnselected = $('<div></div>').addClass('widget-box transparent');
        var $dheadUnselected = $('<div></div>').addClass('widget-header');
        var $dnameUnselected = $('<h4></h4>').append($('<strong></strong>').html("未选品类"));

        var $dbodyUnselected = $('<div></div>').addClass('widget-body col-md-12').css("padding-top", "10px");
        var $dbodyInnerUnselected = $('<div></div>').addClass('widget-body-inner');
        var $listUnselected = $('<ul></ul>').addClass('fl-quo-list unselected');

        $dheadUnselected.append($dnameUnselected);
        $dbodyInnerUnselected.append($listUnselected).appendTo($dbodyUnselected);
        $domainUnselected.append($dheadUnselected).append($dbodyUnselected);
        $domainUnselected.appendTo($ulselectionCategory);

        com.post(api.data.queryCategory, {}, function(res) {

            $.each(res.categorys, function(index, value) {

                if (value.name == "")
                    return true;

                if ($listUnselected.find("li[name='" + value.name + "']").length != 0)
                    return true;

                var $liLine = $('<li></li>').attr("name", value.name).addClass('item-orange clearfix col-md-3');
                var $h4 = $('<h4></h4>').text(value.name);
                $liLine.append($h4).appendTo($listUnselected);

            });

        }, null, false);

        com.post(api.quotation.querySelectionItemByOrderId, {
            "selectionItem.decoration.orderId": quotationUtils.quotationDetail.quotation.decoration.orderId
        }, function(res) {

            $.each(res.selectionItems, function(i, v) {

                if (v.goods.category == "")
                    return true;

                if ($listSelected.find("li[name='" + v.goods.category + "']").length != 0)
                    return true;

                var $liLine = $('<li></li>').attr("name", v.goods.category).addClass('item-orange clearfix col-md-3');
                var $h4 = $('<h4></h4>').text(v.goods.category);
                $liLine.append($h4).appendTo($listSelected);

                $listUnselected.find("li[name='" + v.goods.category + "']").remove();

            });

        }, null, false);
    },
    initQuotationFunctionAreaDetail: function() {

        var $ribbonSubset = com.focusPage('#ribbonSubset').html("");

        var $ulribbon = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($ribbonSubset);
        var db = 1;

        var _data = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;

        var _version = quotationUtils.quotationDetail.quotation.decoration.type == constant.decoration().decoration.TYPE_INCLUSIVE_INT ? " show" : " hide";

        _data && $.each(_data, function(i, v) {

            var $dcpts = 0.0;

            var $domain, $dhead, $dname, $btns, $dbody, $dbodyInner, $list;

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });
            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h4></h4>').append($('<strong></strong>').html(i.split('-')[1]));

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list');

            $dhead.append($dname);
            $dbodyInner.append($list).appendTo($dbody);
            $domain.append($dhead).append($dbody);

            var $li = $('<li></li>').addClass('fl-quo-item').appendTo($list);

            $.each([["line", ""], ["num", "工程量"], ["name", "名称"], ["type", "类型"], ["unit", "单位"], ["worktype", "工种"], ["price" + _version, "单价"], ["price" + _version, "单价"], ["price" + _version, "单价"]], function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none').appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            var linenum = 1;
            $.each(v, function(j, qv) {

                var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content ? qv.content : "-");

                $dcpts = utils.accAdd($dcpts, qv.quotationTotalPrice);

                var _total = (qv.suptype == 1 && qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT) ? 0 : qv.total;
                var _unitPrice = (qv.suptype == 1 && qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT) ? 0 : qv.unitPrice;

                var _lineSet = [["line", linenum++], ["num", qv.num], ["name", qv.itemName], ["type", qv.typestr, ["data-type", qv.type]], ["unit", qv.measurementUnit], ["worktype", qv.workType], ["price unitprice" + _version, _unitPrice], ["price discountprice" + _version, _unitPrice, ["data-discount", qv.discount]], ["price totalprice-discount" + _version, _total, ["style", "white-space:nowrap"]]];

                $.each(_lineSet, function(i, v) {

                    var $cell = $('<div></div>').addClass('cell ' + v[0]);
                    var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);

                    if (v[2]) {
                        $cell.attr(v[2][0], v[2][1]);
                    }

                    $cell.append($cellWrap).appendTo($item);
                });

                qv.type == 7 ? $item.appendTo($list).hide() : $item.appendTo($list);
            });

            var $totalInner = $("<span></span>").addClass('fl-quo-total').text("总额:" + utils.changeTwoDecimal($dcpts));
            var $total = $('<div></div>').addClass("pull-right inline").append($totalInner);
            var $item = $('<li></li>');

            $item.append($total).appendTo($list);
            $domain.appendTo($ulribbon);
        });

        com.post(api.decoration.queryDecorationHolonomy, {
            "decorationHolonomy.decoration.orderId": params.quotation.orderId
        }, function(res) {

            db = res.decorationHolonomy.discountBase == null || res.decorationHolonomy.discountBase == "" || res.decorationHolonomy.discountBase == undefined ? 1 : res.decorationHolonomy.discountBase;
        }, null, false);

        var $total = quotationUtils.quotationCalculator(quotationUtils.quotationDetail.quotation.discount, quotationUtils.quotationDetail.quotation.basePrice);
        $domain = $('<div></div>').addClass('widget-box transparent').css({
            "margin-bottom": "20px"
        }).appendTo($ulribbon);

        $dhead = $('<div></div>').addClass('widget-header').appendTo($domain);
        $dname = $('<h4></h4>').append($('<strong></strong>').css('color', '#E2737D').html("总额: " + $total)).appendTo($dhead);
    },
    initQuotationWorkerTypeDetail: function() {

        var $workTypeSubset = com.focusPage('#workTypeSubset').html("");

        var $ulworkType = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($workTypeSubset);
        var db = 1;

        var _data = quotationUtils.quotationDetail.quotationFunctionAreaItemWs;

        var _version = quotationUtils.quotationDetail.quotation.decoration.type == constant.decoration().decoration.TYPE_INCLUSIVE_INT ? " show" : " hide";

        _data && $.each(_data, function(i, v) {

            var $dcpts = 0.0;

            var $domain, $dhead, $dname, $btns, $dbody, $dbodyInner, $list;

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });
            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h4></h4>').append($('<strong></strong>').html(i.split('-')[1]));

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list');

            $dhead.append($dname);
            $dbodyInner.append($list).appendTo($dbody);
            $domain.append($dhead).append($dbody);

            var $li = $('<li></li>').addClass('fl-quo-item').appendTo($list);

            $.each([["line", ""], ["num", "工程量"], ["name", "名称"], ["type", "类型"], ["unit", "单位"], ["worktype", "工种"], ["price" + _version, "单价"], ["price" + _version, "单价"], ["price" + _version, "单价"]], function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none').appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            var linenum = 1;
            $.each(v, function(j, qv) {

                var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content ? qv.content : "-");

                $dcpts = utils.accAdd($dcpts, qv.quotationTotalPrice);

                var _total = (qv.suptype == 1 && qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT) ? 0 : qv.total;
                var _unitPrice = (qv.suptype == 1 && qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT) ? 0 : qv.unitPrice;

                var _lineSet = [["line", linenum++], ["num", qv.num], ["name", qv.itemName], ["type", qv.typestr, ["data-type", qv.type]], ["unit", qv.measurementUnit], ["worktype", qv.workType], ["price unitprice" + _version, _unitPrice], ["price discountprice" + _version, _unitPrice, ["data-discount", qv.discount]], ["price totalprice-discount" + _version, _total, ["style", "white-space:nowrap"]]];

                $.each(_lineSet, function(i, v) {

                    var $cell = $('<div></div>').addClass('cell ' + v[0]);
                    var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);

                    if (v[2]) {
                        $cell.attr(v[2][0], v[2][1]);
                    }

                    $cell.append($cellWrap).appendTo($item);
                });

                qv.type == 7 ? $item.appendTo($list).hide() : $item.appendTo($list);
            });

            var $totalInner = $("<span></span>").addClass('fl-quo-total').text("总额:" + utils.changeTwoDecimal($dcpts));
            var $total = $('<div></div>').addClass("pull-right inline").append($totalInner);
            var $printWork = $('<a class ="btn btn-minier btn-info" >打印</a>');
            var $item = $('<li></li>');

            $item.append($printWork);

            $printWork.click(function() {

                params.quotation.quotationId = quotationUtils.quotationDetail.quotation.qid;

                var printConf = {
                    "quotationId": quotationUtils.quotationDetail.quotation.qid,
                    "layout": "4",
                    "type": 31,
                    "itemtype": [0, 1, 2],
                    "workType": i.split('-')[1],
                };

                params.quotation.quotation = {
                    "printConf": printConf
                };

                com.popup("报价工种打印", api.index.quotationOutputIndex.url, null, null, true);
            });

            $item.append($total).appendTo($list);

            $domain.appendTo($ulworkType);
        });

        com.post(api.decoration.queryDecorationHolonomy, {
            "decorationHolonomy.decoration.orderId": params.quotation.orderId
        }, function(res) {

            db = res.decorationHolonomy.discountBase == null || res.decorationHolonomy.discountBase == "" || res.decorationHolonomy.discountBase == undefined ? 1 : res.decorationHolonomy.discountBase;
        }, null, false);

        var $total = quotationUtils.quotationCalculator(quotationUtils.quotationDetail.quotation.discount, quotationUtils.quotationDetail.quotation.basePrice);
        $domain = $('<div></div>').addClass('widget-box transparent').css({
            "margin-bottom": "20px"
        }).appendTo($ulworkType);
        $dhead = $('<div></div>').addClass('widget-header').appendTo($domain);
        $dname = $('<h4></h4>').append($('<strong></strong>').css('color', '#E2737D').html("总额: " + $total)).appendTo($dhead);
    },
    quotationDataProcessing: function(quotationFunctionAreaItemCs, reduceNums, dataProcessing) {

        var quotationFunctionAreaItemWs = {};
        var index = 0;

        $.each(quotationFunctionAreaItemCs, function(i, v) {

            var areaName = i.split('-')[1];
            $.each(v, function(j, qv) {

                // if((qv.arId && [0, 1, 2].indexOf(qv.type) != -1) || !qv.arId ) {

                if (qv["quoteItemId"]) {
                    qv["quotationItemId"] = qv["quoteItemId"];
                    delete (qv["quoteItemId"]);
                }

                if (!quotationFunctionAreaItemWs["-" + qv.workType]) {
                    quotationFunctionAreaItemWs["-" + qv.workType] = {};
                }

                qv["areaName"] = areaName;

                if (dataProcessing) {
                    if (quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId] && qv.quotationItemId != 0 && qv.quotationItemId) {
                        quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].num = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].num, qv.num));
                        quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].dcp, qv.dcp));
                        quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].dcpt = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].dcpt, qv.dcpt));
                        quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].quotationTotalPrice = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].quotationTotalPrice, qv.quotationTotalPrice));
                        quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].total = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId].total, qv.total));
                    } else if (qv.quotationItemId == 0 || !qv.quotationItemId) {
                        quotationFunctionAreaItemWs["-" + qv.workType]["customize" + index++] = $.extend({}, qv);
                    } else {
                        quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId] = $.extend({}, qv);
                    }
                } else {
                    if (qv.quotationItemId == 0 || !qv.quotationItemId) {
                        quotationFunctionAreaItemWs["-" + qv.workType]["customize" + index++] = $.extend({}, qv);
                    } else {
                        quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId + "-" + index++] = $.extend({}, qv);
                    }
                }

                if (qv.ariId && reduceNums.ariId[qv.ariId]) {
                    qv.num = utils.accAdd(qv.num, reduceNums.ariId[qv.ariId].num);
                    qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                    qv.total = qv.dcpt;
                    qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                } else if (qv.eiid && reduceNums.eiId[qv.eiid]) {
                    qv.num = utils.accAdd(qv.num, reduceNums.eiId[qv.eiid].num);
                    qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                    qv.total = qv.dcpt;
                    qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                }
            });
        });

        quotationUtils.quotationDetail.quotationFunctionAreaItemWs = quotationFunctionAreaItemWs;
        quotationUtils.quotationDetail.quotationFunctionAreaItemCs = quotationFunctionAreaItemCs;
    },
    quotationNormriceProcessing: function(quotationFunctionAreas, extensions, addreduces) {

        var quotationFunctionAreaItemMs = {};
        var index = 0;

        $.each(quotationFunctionAreas, function(i, v) {

            var functionAreaName = v.functionAreaName;
            var functionAreaId = v.qfaid;

            $.each(v.quotationFunctionAreaItems, function(j, qv) {

                var normrice = qv.normrice;

                qv.quotationFunctionAreaId = functionAreaId;
                qv.quotationFunctionAreaName = functionAreaName;

                if (!quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-1"]) {
                    quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-1"] = [qv];
                } else {
                    quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-1"].push(qv);
                }
            });
        });

        $.each(extensions, function(i, v) {

            $.each(v.extensionItems, function(j, qv) {

                var normrice = qv.normrice;

                qv.initNum = [0, 1, 5].indexOf(qv.type) != -1 ? qv.initnum : -qv.initnum;

                if (!quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-2"]) {
                    quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-2"] = [qv];
                } else {
                    quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-2"].push(qv);
                }
            });
        });

        $.each(addreduces, function(i, v) {

            $.each(v.addReduceItems, function(j, qv) {

                var normrice = qv.normrice;

                qv.initNum = [0, 1, 2].indexOf(qv.type) != -1 ? qv.initnum : -qv.initnum;

                if (!quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-3"]) {
                    quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-3"] = [qv];
                } else {
                    quotationFunctionAreaItemMs[normrice.constructionNode.cnid + "-" + normrice.constructionNode.name + "-3"].push(qv);
                }
            });
        });

        quotationUtils.quotationDetail.quotationFunctionAreaItemMs = quotationFunctionAreaItemMs;
    },
    quotationNormoodProcessing: function(quotationFunctionAreas, extensions, addreduces, normoods) {

        var quotationFunctionAreaItemAs = {};
        var index = 0;

        $.each(quotationFunctionAreas, function(i, v) {

            var functionAreaName = v.functionAreaName;
            var functionAreaId = v.qfaid;

            $.each(v.quotationFunctionAreaItems, function(j, qv) {

                var normood = qv.normood;

                normood.normnum = utils.accMul(normood.normnum, qv.initNum);
                normood.storenum = utils.accMul(normood.storenum, qv.initNum);

                if (!quotationFunctionAreaItemAs[normood.noods.nid + "-"]) {
                    quotationFunctionAreaItemAs[normood.noods.nid + "-"] = normood;
                } else {

                    var item = quotationFunctionAreaItemAs[normood.noods.nid + "-"];

                    item.normnum = utils.accAdd(item.normnum, normood.normnum);
                    item.storenum = utils.accAdd(item.storenum, normood.storenum);

                    quotationFunctionAreaItemAs[normood.noods.nid + "-"] = item;
                }
            });
        });

        $.each(extensions, function(i, v) {

            var functionAreaName = v.quotationFunctionAreaName;
            var functionAreaId = v.quotationFunctionAreaId;

            $.each(v.extensionItems, function(j, qv) {

                var normood = qv.normood;

                var usenum = [0, 1, 5].indexOf(qv.type) != -1 ? qv.num : -qv.num;

                normood.normnum = utils.accMul(normood.normnum, usenum);
                normood.storenum = utils.accMul(normood.storenum, usenum);

                if (!quotationFunctionAreaItemAs[normood.noods.nid + "-"]) {
                    quotationFunctionAreaItemAs[normood.noods.nid + "-"] = normood;
                } else {

                    var item = quotationFunctionAreaItemAs[normood.noods.nid + "-"];

                    item.normnum = utils.accAdd(item.normnum, normood.normnum);
                    item.storenum = utils.accAdd(item.storenum, normood.storenum);
                }
            });
        });

        $.each(addreduces, function(i, v) {

            var functionAreaName = v.quotationFunctionAreaName;
            var functionAreaId = v.quotationFunctionAreaId;

            $.each(v.addReduceItems, function(j, qv) {

                var normood = qv.normood;

                var usenum = [0, 1, 2].indexOf(qv.type) != -1 ? qv.num : -qv.num;

                normood.normnum = utils.accMul(normood.normnum, usenum);
                normood.storenum = utils.accMul(normood.storenum, usenum);

                if (!quotationFunctionAreaItemAs[normood.noods.nid + "-"]) {
                    quotationFunctionAreaItemAs[normood.noods.nid + "-"] = normood;
                } else {

                    var item = quotationFunctionAreaItemAs[normood.noods.nid + "-"];

                    item.normnum = utils.accAdd(item.normnum, normood.normnum);
                    item.storenum = utils.accAdd(item.storenum, normood.storenum);
                }
            });
        });

        $.each(normoods, function(j, qv) {

            var normood = qv;

            if (!quotationFunctionAreaItemAs[normood.noods.nid + "-"]) {
                quotationFunctionAreaItemAs[normood.noods.nid + "-"] = normood;
            } else {

                var item = quotationFunctionAreaItemAs[normood.noods.nid + "-"];

                item.normnum = utils.accAdd(item.normnum, normood.normnum);
                item.storenum = utils.accAdd(item.storenum, normood.storenum);
            }
        });

        quotationUtils.quotationDetail.quotationFunctionAreaItemAs = quotationFunctionAreaItemAs;
    },
    // 查询主材配比价格
    quotationMaterial: function(mm) {

        var $quotationUndisPrice = quotationUtils.quotationDetail.quotationUndisPrice;// 报价项折扣总额
        var $quotationTotalPrice = quotationUtils.quotationDetail.quotationTotalPrice;// 报价项非折扣总额

        var $managePrice = quotationUtils.quotationDetail.quotation.managePrice;

        var $trafficPrice = quotationUtils.quotationDetail.quotation.trafficPrice;

        var _quotationMaterial = utils.changeTwoDecimal(utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd($quotationUndisPrice, $quotationTotalPrice), $managePrice), $trafficPrice), mm));

        return _quotationMaterial
    },
    // 计算工程额
    quotationCalculator: function(discount, basePrice) {

        var $quotationUndisPrice = quotationUtils.quotationDetail.quotationUndisPrice;// 报价项折扣总额
        var $quotationTotalPrice = quotationUtils.quotationDetail.quotationTotalPrice;// 报价项非折扣总额

        var $extensionTotalPrice = quotationUtils.quotationDetail.extensionTotalPrice;// 扩展项总额

        var $addReduceTotal = quotationUtils.quotationDetail.addReduceTotal;// 增项总额
        var $minusQuoTotalPrice = quotationUtils.quotationDetail.minusQuoTotalPrice;// 减项中的报价项非折扣总额
        var $minusQuoUndisPrice = quotationUtils.quotationDetail.minusQuoUndisPrice;// 减项中的报价折扣总额
        // var $minusAddReduceTotal = quotationUtils.quotationDetail.minusAddReduceTotal;//减项中的增项总额
        // var $minusExtensionTotalPrice = quotationUtils.quotationDetail.minusExtensionTotalPrice;//减项中的扩展项总额

        var $addReduceTotalPrice = quotationUtils.quotationDetail.addReduceTotalPrice; // 增减项总额

        var $discount = discount;
        var $basePrice = basePrice;
        var $managePrice = quotationUtils.quotationDetail.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(quotationUtils.quotationDetail.quotation.managePrice, utils.accDiv($discount, 10))) : quotationUtils.quotationDetail.quotation.managePrice;
        var $trafficPrice = quotationUtils.quotationDetail.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(quotationUtils.quotationDetail.quotation.trafficPrice, utils.accDiv($discount, 10))) : quotationUtils.quotationDetail.quotation.trafficPrice;
        var $taxPrice = quotationUtils.quotationDetail.quotation.taxPrice;
        var $Total = 0;
        var $manageDiscount = quotationUtils.quotationDetail.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.accDiv($discount, 10) : 1; // 管理费折扣

        if (quotationUtils.quotationDetail.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
            $taxPrice = utils.changeThrDecimal(utils.accMul($taxPrice, $manageDiscount));
        } else if (quotationUtils.quotationDetail.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
            $taxPrice == $taxPrice;
        }

        if ($basePrice && $basePrice != 0) {
            // 工程基数
            var total = utils.accAdd(utils.accAdd($quotationUndisPrice, $quotationTotalPrice), quotationUtils.quotationDetail.quotation.trafficPrice);
            // 余数
            var remainder = total % $basePrice;
            // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
            var _dicProjectPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), utils.accDiv($discount, 10)), remainder), $managePrice), $taxPrice));
            // 增减增项总额 + 拓展项总额
            var addTotal = utils.accAdd($addReduceTotal, $extensionTotalPrice);
            // 减项非打折项 + 减项打折项 * 折扣
            var reduceTotal = utils.accAdd($minusQuoTotalPrice, utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10)));

            var _manageDiscount = quotationUtils.quotationDetail.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.accDiv($discount, 10) : 1; // 管理费折扣

            // $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dicProjectPrice, addTotal), reduceTotal));
            $Total = utils.changeThrDecimal(utils.accAdd(_dicProjectPrice, $addReduceTotalPrice));

        } else {

            // 报价项打折价 * 折扣 + 报价项非打折价 + 增项 + 减项打折项 * 折扣 + 减项不打折项 + 拓展项总额 + 车运费 + 管理费
            var quotationTotal = utils.accAdd(utils.accMul($quotationUndisPrice, utils.accDiv($discount, 10)), $quotationTotalPrice);
            var addReduceTotal = utils.accAdd(utils.accAdd(utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10)), $minusQuoTotalPrice), $addReduceTotal);

            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(quotationTotal, $addReduceTotalPrice), $extensionTotalPrice));
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd($Total, $managePrice), $trafficPrice), $taxPrice));
        }

        return utils.changeThrDecimal($Total);
    },
    quotationTotal: function() {

        var $quotationUndisPrice = quotationUtils.quotationDetail.quotationUndisPrice;// 报价项折扣总额
        var $quotationTotalPrice = quotationUtils.quotationDetail.quotationTotalPrice;// 报价项非折扣总额

        var $extensionTotalPrice = quotationUtils.quotationDetail.extensionTotalPrice;// 扩展项总额

        var $addReduceTotal = quotationUtils.quotationDetail.addReduceTotal;// 增项总额
        var $minusQuoTotalPrice = quotationUtils.quotationDetail.minusQuoTotalPrice;// 减项中的报价项非折扣总额
        var $minusQuoUndisPrice = quotationUtils.quotationDetail.minusQuoUndisPrice;// 减项中的报价折扣总额
        // var $minusAddReduceTotal = quotationUtils.quotationDetail.minusAddReduceTotal;//减项中的增项总额
        // var $minusExtensionTotalPrice = quotationUtils.quotationDetail.minusExtensionTotalPrice;//减项中的扩展项总额

        var $addReduceTotalPrice = quotationUtils.quotationDetail.addReduceTotalPrice; // 增减项总额
        var $taxPrice = quotationUtils.quotationDetail.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? utils.changeThrDecimal(utils.accAdd(quotationUtils.quotationDetail.quotation.taxRate, 1)) : quotationUtils.quotationDetail.quotation.taxPrice;

        var $Total = utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd($quotationUndisPrice, $quotationTotalPrice), $addReduceTotalPrice), $extensionTotalPrice), quotationUtils.quotationDetail.quotation.managePrice), quotationUtils.quotationDetail.quotation.trafficPrice);
        $Total = utils.changeThrDecimal(utils.accMul(utils.accAdd($Total, quotationUtils.quotationDetail.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? $taxPrice : 0), quotationUtils.quotationDetail.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? $taxPrice : 1));

        return utils.changeThrDecimal($Total);
    },
    initPresignDetail: function(orderId) {// 预签信息

        var presignItemListDiv = com.focusPage("#presignItemListDiv").html("");
        var protation = null;

        var inclusiveDiv = $("<div></div>").addClass('row');
        var inclusiveBody = $("<div></div>").addClass('widget-body');
        var inclusiveTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        var serviceMoneyBody = $("<div></div>").addClass('widget-body');

        inclusiveBody.append($("<div></div>").addClass('widget-body-inner').append(inclusiveTable.append(this.createDivForHolonomy("col-md-2", "起报价", "quotePrice", true), this.createDivForHolonomy("col-md-2", "优惠价", "preferPrice", true), this.createDivForHolonomy("col-md-2", "管理费", "managePrice", true), this.createDivForHolonomy("col-md-2", "管理优惠", "manageProfit", true), this.createDivForHolonomy("col-md-2", "特殊优惠", "advanceProfit", true), this.createDivForHolonomy("col-md-2", "面积", "quoteArea", true), this.createDivForHolonomy("col-md-2", "总价", "totalPrice", false))));
        serviceMoneyBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
        inclusiveDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(inclusiveBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceMoneyBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(inclusiveDiv);
        $('<div></div>').addClass('hr col-md-12').prependTo(inclusiveDiv);
        inclusiveDiv.appendTo(presignItemListDiv);

        com.post(api.quotation.queryProtationForDefaultByOrderId, {
            "protation.orderId": orderId
        }, function(res) {

            protation = res.protation;

            com.focusPage('#quotePrice').html(com.checkNull(protation.quotePrice, 0));
            com.focusPage('#preferPrice').html(com.checkNull(protation.preferPrice, 0));
            com.focusPage('#managePrice').html(com.checkNull(protation.managePrice, 0));
            com.focusPage('#manageProfit').html(com.checkNull(protation.manageProfit, 0));
            com.focusPage('#quoteArea').html(com.checkNull(protation.quoteArea, 0));
            com.focusPage('#totalPrice').html(com.checkNull(protation.totalPrice, 0));
            com.focusPage('#product').html(protation.product);

            if(protation.advanceProfit != 0){
                com.focusPage('#advanceProfit').html(com.checkNull(protation.advanceProfit, 0));
            }else{
                com.focusPage('#advanceProfit').hide();
            }

        }, null, false);

        params.quotation.protationId = protation.pid;
        if (protation.pid == null)
            return false;

        params.quotation.protation = protation;

        var protationFunctionAreas = [{
            "pfaid": 1,
            "name": "功能区",
            "functionAreaOrder": 1,
            "functionAreaType": 0,
            "type": 0,
            total: 0,
            index: 1,
            "protationFunctionAreaItems": [],
        }, {
            "pfaid": 2,
            "name": "可选",
            "functionAreaOrder": 2,
            "functionAreaType": 0,
            "type": 1,
            total: 0,
            index: 2,
            "protationFunctionAreaItems": [],
        }, {
            "pfaid": 3,
            "name": "个性",
            "functionAreaOrder": 3,
            "functionAreaType": 0,
            "type": 2,
            total: 0,
            index: 3,
            "protationFunctionAreaItems": [],
        }, {
            "pfaid": 4,
            "name": "减项",
            "functionAreaOrder": 4,
            "functionAreaType": 0,
            "type": 3,
            total: 0,
            index: 4,
            "protationFunctionAreaItems": [],
        }, {
            "pfaid": 5,
            "name": "赋能",
            "functionAreaOrder": 5,
            "functionAreaType": 0,
            "type": 4,
            total: 0,
            index: 5,
            "protationFunctionAreaItems": [],
        }];

        com.post(api.quotation.queryProtationItemByPid, {
            "protationItem.pid": protation.pid
        }, function(res) {

            $.each(res.protationItems, function(i, v) {

                var type = (v.type + v.type % 2) / 2;

                if (v.type == constant.quotation().protationItem.TYPE_PRCURRENT_INT) {
                    type = 1;
                } else if (v.type == constant.quotation().protationItem.TYPE_CUTCURRENT_INT) {
                    type = 3;
                }

                protationFunctionAreas[type].protationFunctionAreaItems.push(v);
            });
        }, null, false);

        $.each(protationFunctionAreas, function(i, v) {

            var $domain, $dhead, $dname, $dbody, $dbodyInner, $list;

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });
            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h4></h4>').append($('<strong></strong>').html(v.name));

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list');

            $dhead.append($dname);
            $dbodyInner.append($list).appendTo($dbody);
            $domain.append($dhead).append($dbody);

            if (v.protationFunctionAreaItems.length) {

                var $li = $('<li></li>').addClass('fl-quo-item').appendTo($list);

                $.each([["line", ""], ["num", "数量"], ["num", "数量"], ["name", "名称"], ["type", "类型"], ["num", "基础量"], ["price", "单价"], ["price", "单价"], ["price", "总额"]], function(i, v) {

                    var $div = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none').appendTo($li);
                    var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
                });

                $.each(v.protationFunctionAreaItems, function(j, qv) {

                    var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content);
                    var _num = qv.num;
                    var _unitPrice = qv.price;
                    var _total = 0;
                    var _type = qv.type % 2;
                    var _areaCale = qv.areaCale == constant.data().presignItem.AREACALE_AREA_INT ? protation.quoteArea : 1;

                    var _typeName = "-";

                    if (_type == 1) {
                        _typeName = "工程";
                        _total = qv.type == constant.quotation().protationItem.TYPE_PROJECT_INT ? _total : utils.changeThrDecimal(utils.accMul(utils.accMul(_unitPrice, _num), _areaCale));
                    } else {
                        _typeName = "主材";
                        _total = qv.type == constant.quotation().protationItem.TYPE_PRINCIPAL_INT ? _total : utils.changeThrDecimal(utils.accMul(utils.accMul(_unitPrice, _num), _areaCale));
                    }

                    if (qv.type == constant.quotation().protationItem.TYPE_BASE_INT) {
                        _typeName = "信息";
                        _total = utils.changeThrDecimal(utils.accMul(utils.accMul(_unitPrice, utils.accSub(_num, qv.basicNum)), _areaCale));
                    }

                    if ([constant.quotation().protationItem.TYPE_PRCURRENT_INT, constant.quotation().protationItem.TYPE_CUTCURRENT_INT].indexOf(qv.type) != -1) {
                        _typeName = "通用";
                        _total = qv.type == constant.quotation().protationItem.TYPE_PRCURRENT_INT ? 0 : utils.changeThrDecimal(utils.accMul(utils.accMul(_unitPrice, _num), _areaCale));
                    }

                    var _lineSet = [["line", j + 1, ["data-areaType", qv.areaType]], // 编号
                    ["num", qv.num ? qv.num : "0"], // 公式
                    ["num", qv.num, ["data-subtype", qv.subtype]], // 数量
                    ["name", qv.name, ["data-piid", qv.piid]], // 预签名称
                    ["type", _typeName, ["data-type", qv.type]], // 类型
                    ["num", qv.basicNum], // 基础量
                    ["price unitprice", _unitPrice], // 单价
                    ["price discountprice", _unitPrice, ["data-discount", 0]], // 折扣后的价格 将折扣存入
                    ["price totalprice-discount", _total], // 根据类型计算(数量*折扣)
                    ];

                    $.each(_lineSet, function(i, v) {

                        var $cell = $('<div></div>').addClass('cell ' + v[0]);
                        var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);

                        if (v[2]) {
                            $cell.attr(v[2][0], v[2][1]);
                        }

                        $cell.append($cellWrap).appendTo($item);
                    });
                    $item.appendTo($list);
                });
            }

            $domain.appendTo(presignItemListDiv);
        });

        var $show = params.decoration.viewNode[1].opt == null ? [] : params.decoration.viewNode[1].opt.show == null ? [] : params.decoration.viewNode[1].opt.show;

        if ($show.includes("totalPrice")) {
            var amount = 0;

            com.post(api.decoration.amountDecorationActivity, {
                "decorationActivity.orderId": orderId,
                "decorationActivityItem.daiid": 0
            }, function(res) {

                amount = res.decorationActivity.amount;
            }, null, false);

            var profit = utils.changeThrDecimal(utils.accSub(1.0, utils.accDiv(protation.totalCost, utils.accSub(protation.totalPrice, amount))));
            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            }).appendTo(presignItemListDiv);
            $dhead = $('<div></div>').addClass('widget-header').appendTo($domain);
            $dname = $('<h4></h4>').append($('<strong></strong>').css('color', '#E2737D').html("总额: " + protation.totalPrice + " 成本: " + protation.totalCost + " 利润: " + profit));
        }
    },
    createDivForHolonomy: function(inclass, string, id, isleft) {

        return $("<div></div>").addClass(inclass).css(isleft ? {
            "border-left": "solid 1px #e3e3e3",
        } : {
            "border-left": "solid 1px #e3e3e3",
            "border-right": "solid 1px #e3e3e3",
        }).append($("<h5></h5>").addClass('bigger-110 center').html(string)).append($("<h2></h2>").addClass('oid bigger  center').append($('<b></b>').addClass('blue').attr('id', id).html(0)));
    },

    initSelectionDetail: function() {

        var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreas;
        var addReduces = quotationUtils.quotationDetail.addReduces;
        var extensions = quotationUtils.quotationDetail.extensions;

        var $selectItemList = com.focusPage('#selectItemListDiv').html("");

        var $ulribbon = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($selectItemList);

        var selectionItemType = 0

        if (quotationFunctionAreas && quotationFunctionAreas.length) {
            $.each(quotationFunctionAreas, function(i, v) {

                v.type != constant.quotation().selectionItem.TYPE_QUOTATION_INT ? createQuotationItem(v.functionAreaName, selectionItemType, v.quotationFunctionAreaItems) : null;
            });
        }

        if (extensions && extensions.length) {
            $.each(extensions, function(i, v) {

                selectionItemType = v.type == constant.quotation().selectionItem.TYPE_QUOTATION_INT ? constant.quotation().selectionItem.TYPE_EXTENSIONADD_INT : constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT;
                createQuotationItem("", selectionItemType, v.extensionItems);
            });
        }

        if (addReduces && addReduces.length) {
            $.each(addReduces, function(i, v) {

                selectionItemType = v.type == constant.quotation().selectionItem.TYPE_QUOTATION_INT ? constant.quotation().selectionItem.TYPE_ADDITEM_INT : constant.quotation().selectionItem.TYPE_MINUSITEM_INT;
                createQuotationItem("", selectionItemType, v.addReduceItems);
            });
        }

        createQuotationItem({}, constant.quotation().selectionItem.TYPE_ALONE_INT);

        com.post(api.quotation.querySelectionItemByOrderId, {
            'selectionItem.decoration.orderId': params.decoration.orderId
        }, function(res) {

            if (!res.selectionItems || res.selectionItems.length == 0)
                return false;

            $.each(res.selectionItems, function(i, v) {

                var price = utils.accMul(v.postprice, v.num);
                var $selectionItemLi = createSelectionItem(v).attr('data-price', price);
                var $functionArea = $selectionItemLi.parents('.widget-box');

                $functionArea.attr('data-total', utils.accAdd($functionArea.attr('data-total'), price));
            });
        });

        function createSelectionItem(data) {

            var $selectionItemLi = com.focusPage('#' + data.areaId + '-' + data.quoteId + '-' + data.type).empty();

            if (data.type == constant.quotation().selectionItem.TYPE_ALONE_INT) {
                var _list = com.focusPage("div[data-type=5]").find(".fl-quo-list.list");
                var $rowDiv = $('<div></div>').addClass('row alone').css({
                    'border-bottom': '1px solid #dce8f1',
                    'margin': '0 2px 0 2px'
                }).appendTo(_list);
                var $quoteItemLi = $('<li></li>').addClass('fl-quo-item col-md-6').css({
                    'border': 'none',
                    'border-right': '1px solid #dce8f1'
                }).appendTo($rowDiv);
                $selectionItemLi = $('<li></li>').addClass("fl-quo-item col-md-6").appendTo($rowDiv);
            }

            var img = $('<img width="40px"/>');

            if (data.soods.path != null) {
                com.showImg(img, data.soods.path, 40, 40, data.goods.name, null, null);
            }

            var lineSet = [['path', img], ['name green', data.goods.name], ['num blue', [constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT, constant.quotation().selectionItem.TYPE_MINUSITEM_INT].indexOf(data.type) != -1 ? -data.num : data.num]];

            $.each(lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                $cell.append($cellWrap).appendTo($selectionItemLi);
            });

            return $selectionItemLi;
        }

        function createQuote(data) {

            var $rowDiv = $('<div></div>').addClass('row').css({
                'border-bottom': '1px solid #dce8f1',
                'margin': '0 2px 0 2px'
            });
            var $selectionItemLi = $('<li></li>').addClass("fl-quo-item col-md-6").prop('id', data.areaId + '-' + data.quoteId + '-' + data.type);
            var $quoteItemLi = $('<li></li>').addClass('fl-quo-item col-md-6').css({
                'border': 'none',
                'border-right': '1px solid #dce8f1'
            }).attr({
                'data-quoteId': data.quoteId,
                'data-type': data.type,
                'data-areaId': data.areaId,
                'data-quotationItemId': data.quotationItemId,
                'data-areaName': data.quotationFunctionAreaName,
                'data-preprice': data.preprice,
            });

            var lineSet = [['name blue', data.itemName], ['num red', data.num]];

            $.each(lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            $rowDiv.append($quoteItemLi).append($selectionItemLi);

            return $rowDiv;
        }

        function createQuotationItem(name, type, items) {

            var subtypes = [0, 1];
            var name = type == constant.quotation().selectionItem.TYPE_QUOTATION_INT ? name : type == constant.quotation().selectionItem.TYPE_ALONE_INT ? "未匹配" : constant.quotation().selectionItem.type.keys[type];

            var $dcpts = 0.0;

            var $domain, $dhead, $dname, $btns, $dbody, $dbodyInner, $list;

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });
            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h4></h4>').append($('<strong></strong>').html(constant.quotation().selectionItem.type.keys[type] + "-" + name));

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list');

            $dhead.append($dname);
            $dbodyInner.append($list).appendTo($dbody);
            $domain.append($dhead).append($dbody);

            var $row = $("<div></div>").addClass('row').css({
                'border-bottom': '1px solid #dce8f1',
                'margin': '0 2px 0 2px'
            }).appendTo($list);

            var $li = $('<li></li>').css({
                'border': 'none',
                'border-right': '1px solid #dce8f1'
            }).addClass('fl-quo-item col-xs-6').appendTo($row);

            $.each([["name", "报价项"], ["num", "数量"]], function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none').appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            var $li = $('<li></li>').addClass('fl-quo-item col-xs-6').appendTo($row);

            $.each([["path", "图片"], ["name", "选材"], ["num", "数量"]], function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none').appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            if (type === constant.quotation().selectionItem.TYPE_QUOTATION_INT) {

                $.each(items, function(i, v) {

                    if (!subtypes.includes(v.subtype))
                        $list.append(createQuote(dataProcessing(v, type, null)));
                });
            } else if (type === constant.quotation().selectionItem.TYPE_EXTENSIONADD_INT || type === constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT) {

                $.each(items, function(i, v) {

                    if (!subtypes.includes(v.subtype))
                        $list.append(createQuote(dataProcessing(v, type, null)));
                });
            } else if (type == constant.quotation().selectionItem.TYPE_ADDITEM_INT || type == constant.quotation().selectionItem.TYPE_MINUSITEM_INT) {

                $.each(items, function(i, v) {

                    if (!subtypes.includes(v.subtype))
                        $list.append(createQuote(dataProcessing(v, type, null)));
                });
            }

            $ulribbon.append($domain);
        }

        function dataProcessing(rawData, type, functionAreaName) {

            var preprice, quotationItemId, data;

            if (type == constant.quotation().selectionItem.TYPE_QUOTATION_INT) {

                data = {
                    "areaId": rawData.quotationFunctionAreaId,
                    "quoteId": rawData.qfaiId,
                    "quotationItemId": rawData.quotationItemId,
                    "itemName": rawData.itemName,
                    "type": type,
                    "num": rawData.num,
                    "quotationFunctionAreaName": functionAreaName,
                    "preprice": rawData.unitPrice,
                }
            } else if (type == constant.quotation().selectionItem.TYPE_EXTENSIONADD_INT || type == constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT) {

                preprice = type == constant.quotation().selectionItem.TYPE_QUOTATION_INT ? rawData.addPrice : rawData.subPrice;

                data = {
                    "areaId": rawData.eid,
                    "quoteId": rawData.eiid,
                    "quotationItemId": rawData.quoteItemId,
                    "itemName": rawData.itemName,
                    "type": type,
                    "num": rawData.num,
                    "quotationFunctionAreaName": rawData.quotationFunctionAreaName,
                    "preprice": preprice,
                }
            } else if (type == constant.quotation().selectionItem.TYPE_ADDITEM_INT || type == constant.quotation().selectionItem.TYPE_MINUSITEM_INT) {

                if (type == constant.quotation().selectionItem.TYPE_QUOTATION_INT) {
                    quotationItemId = rawData.quoteItemId;
                    preprice = rawData.addPrice;
                } else {
                    quotationItemId = rawData.quotationItemId;
                    preprice = rawData.subPrice;
                }

                data = {
                    "areaId": rawData.arId,
                    "quoteId": rawData.ariId,
                    "quotationItemId": quotationItemId,
                    "itemName": rawData.itemName,
                    "type": type,
                    "num": rawData.num,
                    "quotationFunctionAreaName": rawData.quotationFunctionAreaName,
                    "preprice": preprice,
                }
            }

            return data;
        }
    },

};