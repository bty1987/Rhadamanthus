var quotationUtils = {
    loadQuotationDetail: function () {

        var quotation = null;

        decorationOrderDetail.quotationDetail = {};

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": decorationOrderDetail.decorationOrderId,
        }, function (res) {
            decorationOrderDetail.quotation = res.quotation;
        }, null, false);

        var quotationId = decorationOrderDetail.quotation.qid;

        if (quotationId) {
            $("#printProjectBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=1&time=" + params.loginTime);
            $("#printFinanceBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=2&time=" + params.loginTime);
            $("#printCustomerBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=3&time=" + params.loginTime);
            /*$("#printProjectBtn").click(function () {
             com.popup("打印报价",api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=1&time=" + params.loginTime,null,null,true)
             });
             $("#printFinanceBtn").click(function () {
             com.popup("打印报价",api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=2&time=" + params.loginTime,null,null,true)
             });
             $("#printCustomerBtn").click(function () {
             com.popup("打印报价",api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&type=3&time=" + params.loginTime,null,null,true)
             });*/

            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid": quotationId}, function (res) {
                decorationOrderDetail.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
            }, null, false);

            var addReduceIds = {};

            com.post(api.addReduce.queryAddReduceByOrderId, {"addReduce.orderId": decorationOrderDetail.decorationOrderId}, function (res) {
                var addReduces = res.addReduces;

                $.each(addReduces, function (i, v) {
                    addReduceIds["addReduceIds[" + i + "]"] = v.arId;
                });

            }, null, false);

            com.post(api.addReduce.queryAddReduceItemByAddReduceIds, addReduceIds, function (res) {
                decorationOrderDetail.quotationDetail.addReduceItems = res.addReduceItems;
            }, null, false);

            var extensionItemIDs = {};

            com.post(api.quotation.queryExtensionByOrderId, {"extension.orderId": decorationOrderDetail.decorationOrderId}, function (res) {
                var extensions = res.extensions;
                $.each(extensions, function (i, v) {
                    extensionItemIDs["extensionItemIDs[" + i + "]"] = v.eid;
                });

            }, null, false);

            com.post(api.quotation.queryExtensionItemByEids, extensionItemIDs, function (res) {
                decorationOrderDetail.quotationDetail.extensions = res.extensionItems;
            }, null, false);

            quotationUtils.initQuotationDetailItem(decorationOrderDetail.quotation, decorationOrderDetail.quotationDetail.quotationFunctionAreas, decorationOrderDetail.quotationDetail.addReduceItems, decorationOrderDetail.quotationDetail.extensions);

            quotationUtils.initQuotationDetail();

            $("#showWay").on("change", function () {
                quotationUtils.initQuotationDetail();
            });
        } else {
            $("#btnPrintDefaultQuotationInfo").attr("disabled", "disabled");
        }
    }, initQuotationDetailItem: function (quotation, quotationFunctionAreas, addReduceItems, extensionItems) {
        var addReduceItemtypeDict = {"0": "普通", "1": "系统", "2": "自定义", "3": "报价中", "4": "增项", "5": "扩展项"};

        var $decorationtype = decorationOrderDetail.orderType;
        var discount = quotation.discount;
        var $quotationUndisPrice = 0;   //报价项折扣总额
        var $quotationTotalPrice = 0;	//报价项非折扣总额
        var $addReduceTotal = 0; //增项总额
        var $minusQuoTotalPrice = 0; //减项中的报价项非折扣总额
        var $minusQuoUndisPrice = 0; //减项中的报价折扣总额
        var $minusAddReduceTotal = 0; //减项中的增项总额
        var $$minusDefineUndisPrice = 0; //定义项目打折项
        var $minusDefineTotalPrice = 0;	//定义项目非打折项
        var $minusExtensionTotalPrice = 0; //减项中的扩展项总额
        var $minusAddReduceTotalFunctionAreaTotalPrice = 0; //除不计算功能区外的不折扣减项总额
        var $minusAddReduceTotalFunctionAreaUndisPrice = 0; //除不计算功能区外的折扣减项总额
        var $extensionItemTotalPrice = 0; //扩展项总额
        var quotationFunctionAreaItemCs = {};
        var quotationFunctionAreaItemWs = {};
        var reduceNums = {
            ariId: {},
            eiId: {},
            qfaiId: {},
        };


        var quotationFunctionAreaLength = quotationFunctionAreas.length;

        for (var i = 0; i < quotationFunctionAreaLength; ++i) {

            var quotationFunctionAreaTotal = 0;

            var quotationFunctionArea = quotationFunctionAreas[i];
            var quotationFunctionAreaItems = quotationFunctionArea.quotationFunctionAreaItems;
            var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;
            quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName] = [];


            for (var j = 0; j < quotationFunctionAreaItemLength; j++) {

                var quotationFunctionAreaItem = quotationFunctionAreaItems[j];

                if (!quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType]) {
                    quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType] = {};
                }

                quotationFunctionAreaItem.typestr = quotationFunctionAreaItem.type == 0 || quotationFunctionAreaItem.type == 4 ? "普通" : quotationFunctionAreaItem.type == 1 ? "自定义" : quotationFunctionAreaItem.type == 5 ? "主材" : "-";
                var _dcp = 0;
                if ($decorationtype == 2) {
                    _dcp = quotationFunctionAreaItem.type < 2 || quotationFunctionAreaItem.type == 5 ? utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, utils.accDiv(discount, 10))) : quotationFunctionAreaItem.unitPrice;
                } else {
                    _dcp = quotationFunctionAreaItem.type < 2 || quotationFunctionAreaItem.type == 5 ? utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, (quotationFunctionAreaItem.discount == 1 ? utils.accDiv(discount, 10) : 1))) : quotationFunctionAreaItem.unitPrice;
                }
                var _dcpt = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.num, _dcp));

                if (quotationFunctionArea.type != 3 && quotationFunctionArea.type != 0 && quotationFunctionAreaItem.type != 3 && quotationFunctionAreaItem.type != 2) {
                    if (quotationFunctionAreaItem.discount == 0) {
                        $quotationTotalPrice = utils.accAdd($quotationTotalPrice, utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.num)));
                    } else if (quotationFunctionAreaItem.discount == 1) {
                        $quotationUndisPrice = utils.accAdd($quotationUndisPrice, utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.num)));
                    }
                }
                quotationFunctionAreaTotal = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaTotal, _dcpt));
                if (quotationFunctionArea.type == 3) {
                    quotationFunctionAreaItem.dcp = 0;
                    quotationFunctionAreaItem.dcpt = 0;
                } else {
                    quotationFunctionAreaItem.dcp = _dcp;
                    quotationFunctionAreaItem.dcpt = _dcpt;
                }


                if (quotationFunctionAreaItem.type == 2) {
                    quotationFunctionAreaItem.num = quotation.trafficPrice;
                    quotationFunctionAreaItem.dcpt = quotation.trafficPrice;
                } else if (quotationFunctionAreaItem.type == 3) {
                    var _unitPrice = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice, quotation.notSalesmanRate));
                    quotationFunctionAreaItem.num = quotation.managePrice;
                    quotationFunctionAreaItem.dcpt = quotation.managePrice;
                    quotationFunctionAreaItem.unitPrice = _unitPrice;
                    quotationFunctionAreaItem.dcp = _unitPrice;
                }

                quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName].push(quotationFunctionAreaItem);


                if (quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType][quotationFunctionAreaItem.itemName]) {
                    quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType][quotationFunctionAreaItem.itemName].num = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType][quotationFunctionAreaItem.itemName].num, quotationFunctionAreaItem.num));
                    quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType][quotationFunctionAreaItem.itemName].dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType][quotationFunctionAreaItem.itemName].dcp, quotationFunctionAreaItem.dcp));
                    quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType][quotationFunctionAreaItem.itemName].dcpt = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType][quotationFunctionAreaItem.itemName].dcpt, quotationFunctionAreaItem.dcpt));
                } else {
                    quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType][quotationFunctionAreaItem.itemName] = $.extend({}, quotationFunctionAreaItem);
                }
            }
        }


        if (extensionItems != null && extensionItems != '') {

            var extensionItemtypeDict = {"0": "工程", "1": "主材"};

            var extensionItemsLength = extensionItems.length;

            for (var i = 0; i < extensionItemsLength; ++i) {

                var extensionItem = extensionItems[i];


                if (extensionItem.quoteItemId == 0) {
                    extensionItem.typestr = "扩展项 " + "自定义";
                } else {
                    extensionItem.typestr = "扩展项 " + extensionItem.quotationType;
                }


                var _dcp = extensionItem.unitPrice;
                var _dcpt = utils.changeThrDecimal(utils.accMul(extensionItem.num, _dcp));

                extensionItem.dcp = _dcp;
                extensionItem.dcpt = _dcpt;
                $extensionItemTotalPrice = utils.accAdd($extensionItemTotalPrice, _dcpt);
                if (quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName]) {
                    quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName].push(extensionItem);
                }

                if (!quotationFunctionAreaItemWs[extensionItem.workType]) {
                    quotationFunctionAreaItemWs[extensionItem.workType] = {};
                }

                if (quotationFunctionAreaItemWs[extensionItem.workType][extensionItem.itemName]) {
                    quotationFunctionAreaItemWs[extensionItem.workType][extensionItem.itemName].num = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[extensionItem.workType][extensionItem.itemName].num, extensionItem.num));
                    quotationFunctionAreaItemWs[extensionItem.workType][extensionItem.itemName].dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[extensionItem.workType][extensionItem.itemName].dcp, extensionItem.dcp));
                    quotationFunctionAreaItemWs[extensionItem.workType][extensionItem.itemName].dcpt = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[extensionItem.workType][extensionItem.itemName].dcpt, extensionItem.dcpt));
                } else {
                    quotationFunctionAreaItemWs[extensionItem.workType][extensionItem.itemName] = $.extend({}, extensionItem);
                }
            }
        }


        var addReduceItemLength = addReduceItems.length;

        for (var i = 0; i < addReduceItemLength; ++i) {

            var addReduceItem = addReduceItems[i];

            if ([0, 2].indexOf(addReduceItem.type) != -1) {
                addReduceItem.typestr = "增项 " + addReduceItemtypeDict[addReduceItem.type];
            } else {

                if ([4].indexOf(addReduceItem.type) != -1) {
                    if (reduceNums.ariId[addReduceItem.quoteItemId]) {
                        reduceNums.ariId[addReduceItem.quoteItemId] = utils.accAdd(reduceNums.ariId[addReduceItem.quoteItemId], addReduceItem.num);
                    } else {
                        reduceNums.ariId[addReduceItem.quoteItemId] = addReduceItem.num;
                    }

                } else if ([5].indexOf(addReduceItem.type) != -1) {
                    if (reduceNums.eiId[addReduceItem.quoteItemId]) {
                        reduceNums.eiId[addReduceItem.quoteItemId] = utils.accAdd(reduceNums.eiId[addReduceItem.quoteItemId], addReduceItem.num);
                    } else {
                        reduceNums.eiId[addReduceItem.quoteItemId] = addReduceItem.num;
                    }
                } else if ([1].indexOf(addReduceItem.type) != -1) {

                } else {
                    if (reduceNums.qfaiId[addReduceItem.quoteItemId]) {
                        reduceNums.qfaiId[addReduceItem.quoteItemId] = utils.accAdd(reduceNums.qfaiId[addReduceItem.quoteItemId], addReduceItem.num);
                    } else {
                        reduceNums.qfaiId[addReduceItem.quoteItemId] = addReduceItem.num;
                    }
                }
                addReduceItem.MinusType = -1;
                addReduceItem.num = -addReduceItem.num;
                addReduceItem.typestr = "减项 " + addReduceItemtypeDict[addReduceItem.type];
            }


            var _dcp = addReduceItem.unitPrice;
            if ($decorationtype == 0 && [1, 3].indexOf(addReduceItem.type) != -1 && addReduceItem.discount == 1) {
                _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
            } else if ($decorationtype == 1 && ![1, 3].indexOf(addReduceItem.type) != -1) {
                if (addReduceItem.discount == 1) {
                    _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
                }
            } else if ($decorationtype == 2) {
                if ([0, 2, 4].indexOf(addReduceItem.type) != -1) {
                    _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(8.8, 10)));
                } else if ([1, 3].indexOf(addReduceItem.type) != -1) {
                    _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
                }
            }

            var _dcpt = utils.changeThrDecimal(utils.accMul(addReduceItem.num, _dcp));

            if ([0, 2].indexOf(addReduceItem.type) != -1) {
                $addReduceTotal = utils.accAdd($addReduceTotal, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
            } else if ([4].indexOf(addReduceItem.type) != -1) {
                $minusAddReduceTotal = utils.accAdd($minusAddReduceTotal, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
            } else if ([5].indexOf(addReduceItem.type) != -1) {
                $minusExtensionTotalPrice = utils.accAdd($minusExtensionTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
            } else if ([1].indexOf(addReduceItem.type) != -1) {
                if (addReduceItem.discount == 0) {
                    $minusDefineTotalPrice = utils.accAdd($minusDefineTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
                }
                if (addReduceItem.discount == 1) {
                    $$minusDefineUndisPrice = utils.accAdd($$minusDefineUndisPrice, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
                }
            } else {
                if (addReduceItem.discount == 0) {
                    $minusQuoTotalPrice = utils.accAdd($minusQuoTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
                } else if (addReduceItem.discount == 1) {
                    $minusQuoUndisPrice = utils.accAdd($minusQuoUndisPrice, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
                }
                if (addReduceItem.quotationFunctionAreaType != 3) {
                    if (addReduceItem.discount == 0) {
                        $minusAddReduceTotalFunctionAreaTotalPrice = utils.accAdd($minusAddReduceTotalFunctionAreaTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
                    } else if (addReduceItem.discount == 1) {
                        $minusAddReduceTotalFunctionAreaUndisPrice = utils.accAdd($minusAddReduceTotalFunctionAreaUndisPrice, utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice)));
                    }
                }
            }

            addReduceItem.dcp = _dcp;
            addReduceItem.dcpt = _dcpt;

            if (quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName]) {
                quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName].push(addReduceItem);
            }

            if (!quotationFunctionAreaItemWs[addReduceItem.workType]) {
                quotationFunctionAreaItemWs[addReduceItem.workType] = {};
            }

            if (quotationFunctionAreaItemWs[addReduceItem.workType][addReduceItem.itemName]) {
                quotationFunctionAreaItemWs[addReduceItem.workType][addReduceItem.itemName].num = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[addReduceItem.workType][addReduceItem.itemName].num, addReduceItem.num));
                quotationFunctionAreaItemWs[addReduceItem.workType][addReduceItem.itemName].dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[addReduceItem.workType][addReduceItem.itemName].dcp, addReduceItem.dcp));
                quotationFunctionAreaItemWs[addReduceItem.workType][addReduceItem.itemName].dcpt = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs[addReduceItem.workType][addReduceItem.itemName].dcpt, addReduceItem.dcpt));
            } else {
                quotationFunctionAreaItemWs[addReduceItem.workType][addReduceItem.itemName] = $.extend({}, addReduceItem);
            }
        }

        $quotationUndisPrice = utils.changeThrDecimal(utils.accAdd($quotationUndisPrice, -$minusQuoUndisPrice));
        $quotationTotalPrice = utils.changeThrDecimal(utils.accAdd($quotationTotalPrice, -$minusQuoTotalPrice));
        $addReduceTotal = utils.changeThrDecimal(utils.accAdd($addReduceTotal, -$minusAddReduceTotal));
        $extensionItemTotalPrice = utils.changeThrDecimal(utils.accAdd($extensionItemTotalPrice, -$minusExtensionTotalPrice));
        $minusQuoTotalPrice = utils.changeThrDecimal(utils.accAdd($minusQuoTotalPrice, $minusDefineTotalPrice));//定义项目非打折项
        $minusQuoUndisPrice = utils.changeThrDecimal(utils.accAdd($minusQuoUndisPrice, $$minusDefineUndisPrice));//定义项目打折项
        $minusAddReduceTotalFunctionAreaTotalPrice = utils.changeThrDecimal(utils.accAdd($minusAddReduceTotalFunctionAreaTotalPrice, $minusDefineTotalPrice));//定义项目非打折项
        $minusAddReduceTotalFunctionAreaUndisPrice = utils.changeThrDecimal(utils.accAdd($minusAddReduceTotalFunctionAreaUndisPrice, $$minusDefineUndisPrice));//定义项目打折项

        decorationOrderDetail.quotationFunctionAreaItemCs = quotationFunctionAreaItemCs;
        decorationOrderDetail.quotationFunctionAreaItemWs = quotationFunctionAreaItemWs;
        decorationOrderDetail.reduceNums = reduceNums;


        decorationOrderDetail.quotationUndisPrice = $quotationUndisPrice; //报价项折扣总额
        decorationOrderDetail.quotationTotalPrice = $quotationTotalPrice; //报价项非折扣总额
        decorationOrderDetail.addReduceTotal = $addReduceTotal;  //增项总额
        decorationOrderDetail.minusQuoTotalPrice = $minusQuoTotalPrice //减项中的报价项非折扣总额
        decorationOrderDetail.minusQuoUndisPrice = $minusQuoUndisPrice; //减项中的报价折扣总额
        decorationOrderDetail.minusAddReduceTotal = $minusAddReduceTotal; //减项中的增项总额
        decorationOrderDetail.minusExtensionTotalPrice = $minusExtensionTotalPrice; //减项中的扩展项总额
        decorationOrderDetail.extensionItemTotalPrice = $extensionItemTotalPrice  //扩展项总额
        decorationOrderDetail.minusAddReduceTotalFunctionAreaTotalPrice = $minusAddReduceTotalFunctionAreaTotalPrice; //除不计算功能区外的不折扣减项总额
        decorationOrderDetail.minusAddReduceTotalFunctionAreaUndisPrice = $minusAddReduceTotalFunctionAreaUndisPrice; //除不计算功能区外的折扣减项总额
    }, initQuotationDetail: function () {

        var quotationItemListDiv = $("#quotationItemListDiv").html("");

        if ($("#showWay").val() == 0) {
            _data = decorationOrderDetail.quotationFunctionAreaItemCs;
        } else {
            _data = decorationOrderDetail.quotationFunctionAreaItemWs;
        }

        _data && $.each(_data, function (i, v) {

            var $dcpts = 0.0;

            var $domain, $dhead, $dname, $btns, $dbody, $dbodyInner, $list;

            $domain = $('<div></div>').addClass('widget-box transparent').css({"margin-bottom": "20px"});
            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h4></h4>').append($('<strong></strong>').html(i.split('-')[1]));

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list');

            $dhead.append($dname);
            $dbodyInner.append($list).appendTo($dbody);
            $domain.append($dhead).append($dbody);

            var linenum = 1;
            $.each(v, function (i, qv) {


                var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content);

                /*	if (decorationOrderDetail.reduceNums[qv.qfaiId]) {
                 qv.num = utils.accAdd(qv.num, decorationOrderDetail.reduceNums[qv.qfaiId]);
                 qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                 }*/

                if (!qv.MinusType) {
                    if (qv.qfaiId && decorationOrderDetail.reduceNums.qfaiId[qv.qfaiId]) {
                        qv.num = utils.accAdd(qv.num, decorationOrderDetail.reduceNums.qfaiId[qv.qfaiId]);
                        qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                    } else if (qv.ariId && decorationOrderDetail.reduceNums.ariId[qv.ariId]) {
                        qv.num = utils.accAdd(qv.num, decorationOrderDetail.reduceNums.ariId[qv.ariId]);
                        qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                    } else if (qv.eiId && decorationOrderDetail.reduceNums.eiId[qv.eiId]) {
                        qv.num = utils.accAdd(qv.num, decorationOrderDetail.reduceNums.eiId[qv.eiId]);
                        qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                    }
                }

                $dcpts = utils.accAdd($dcpts, qv.dcpt);

                var _lineSet = [
                    ["line", linenum++],
                    ["num", qv.num],
                    ["name", qv.itemName],
                    ["type", qv.typestr, ["data-type", qv.type]],
                    ["unit", qv.measurementUnit],
                    ["worktype", qv.workType],
                    ["price unitprice", qv.unitPrice],
                    ["price discountprice", qv.dcp, ["data-discount", qv.discount]],
                    ["price totalprice-discount", qv.dcpt, ["style", "white-space:nowrap"]],
                ];

                $.each(_lineSet, function (i, v) {
                    var $cell = $('<div></div>').addClass('cell ' + v[0]);
                    var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                    if (v[2]) {
                        $cell.attr(v[2][0], v[2][1]);
                    }
                    $cell.append($cellWrap).appendTo($item);
                });
                $item.appendTo($list);
            });

            var $totalInner = $("<span></span>").addClass('fl-quo-total').text("总额:" + utils.changeTwoDecimal($dcpts));
            var $total = $('<div></div>').addClass("pull-right inline").append($totalInner);
            var $item = $('<li></li>').append($total).appendTo($list);

            $domain.appendTo(quotationItemListDiv);
        });
        var $total = quotationUtils.quotationCalculator(decorationOrderDetail.quotation.discount,decorationOrderDetail.orderType);
        $domain = $('<div></div>').addClass('widget-box transparent').css({"margin-bottom": "20px"}).appendTo(quotationItemListDiv);
        $dhead = $('<div></div>').addClass('widget-header').appendTo($domain);
        $dname = $('<h4></h4>').append($('<strong></strong>').css('color', '#E2737D').html("总额: " + $total)).appendTo($dhead);
    }, quotationCalculator: function (discount,decorationOrderType) {


        var $minusAddReduceTotalFunctionAreaTotalPrice = decorationOrderDetail.minusAddReduceTotalFunctionAreaTotalPrice; //除不计算功能区外的不折扣减项总额
        var $minusAddReduceTotalFunctionAreaUndisPrice = decorationOrderDetail.minusAddReduceTotalFunctionAreaUndisPrice; //除不计算功能区外的折扣减项总额
        var $quotationUndisPrice = decorationOrderDetail.quotationUndisPrice;   //报价项折扣总额
        var $quotationTotalPrice = decorationOrderDetail.quotationTotalPrice;	//报价项非折扣总额
        var $addReduceTotal = decorationOrderDetail.addReduceTotal; //增项总额
        var $minusQuoTotalPrice = decorationOrderDetail.minusQuoTotalPrice; //减项中的报价项非折扣总额
        var $minusQuoUndisPrice = decorationOrderDetail.minusQuoUndisPrice; //减项中的报价折扣总额
        var $minusAddReduceTotal = decorationOrderDetail.minusAddReduceTotal; //减项中的增项总额
        var $minusExtensionTotalPrice = decorationOrderDetail.minusExtensionTotalPrice; //减项中的扩展项总额
        var $extensionItemTotalPrice = decorationOrderDetail.extensionItemTotalPrice; //扩展项总额
        var $discount = discount;
        var $decorationtype = decorationOrderType;

/*      console.log("报价项折扣总额  " + $quotationUndisPrice);
        console.log("报价项非折扣  " + $quotationTotalPrice);
        console.log("扩展项总额  " + $extensionItemTotalPrice);
        console.log("增项总额  " + $addReduceTotal);
        console.log("减项中的报价项非折扣总额  " + $minusQuoTotalPrice);
        console.log("减项中的报价折扣总额  " + $minusQuoUndisPrice);
        console.log("减项中的增项总额  " + $minusAddReduceTotal);
        console.log("减项中的扩展项总额  " + $minusExtensionTotalPrice);
        console.log("计算功能区的不折扣减项总额" + $minusAddReduceTotalFunctionAreaTotalPrice);
        console.log("计算功能区的折扣减项总额" + $minusAddReduceTotalFunctionAreaUndisPrice);*/

        var $Total = 0;
        if ($decorationtype == 0) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul($quotationUndisPrice, utils.accDiv($discount, 10)), $quotationTotalPrice), $extensionItemTotalPrice), $addReduceTotal), utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10))), $minusQuoTotalPrice), $minusExtensionTotalPrice), $minusAddReduceTotal));
        } else if ($decorationtype == 1) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul($quotationUndisPrice, utils.accDiv($discount, 10)), $quotationTotalPrice), $extensionItemTotalPrice), $addReduceTotal), (utils.accMul($minusAddReduceTotalFunctionAreaUndisPrice, utils.accDiv($discount, 10)))), $minusAddReduceTotalFunctionAreaTotalPrice), $minusExtensionTotalPrice), $minusAddReduceTotal));
        } else if ($decorationtype == 2) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accAdd($quotationUndisPrice,$quotationTotalPrice),utils.accDiv($discount, 10)), $extensionItemTotalPrice),utils.accMul($addReduceTotal,0.88)),utils.accMul(utils.accAdd($minusQuoTotalPrice,$minusQuoUndisPrice),utils.accDiv($discount, 10))),utils.accMul($minusAddReduceTotal,0.88)),$minusExtensionTotalPrice));
        }
        $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd($Total, decorationOrderDetail.quotation.managePrice), decorationOrderDetail.quotation.trafficPrice));
        return $Total;
    }
}