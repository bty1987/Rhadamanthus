var quotationUtils = {
    loadQuotationDetail: function () {
        quotationUtils.quotationDetail = {};
        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": params.decorationOrderId,
        }, function (res) {
            quotationUtils.quotationDetail.quotation = res.quotation;
        }, null, false);
        var quotationId = quotationUtils.quotationDetail.quotation.qid;
        if (quotationId) {
            $("#printProjectBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 1;
                params.subtype = -1;
             com.popup("打印报价",api.index.quotationOutputIndex.url,null,null,true);
             });
             $("#printFinanceBtn").click(function () {
                 params.quotationId = quotationId;
                 params.type = 2;
                 params.subtype = -1;
             com.popup("打印报价",api.index.quotationOutputIndex.url,null,null,true);
             });
             $("#printCustomerBtn").click(function () {
                 params.quotationId = quotationId;
                 params.type = 3;
                 params.subtype = -1;
             com.popup("打印报价",api.index.quotationOutputIndex.url,null,null,true);
             });
            $("#printEngineeringBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 3;
                params.subtype = 1;
                com.popup("打印报价",api.index.quotationOutputIndex.url,null,null,true);
            });
            $("#printMaterialBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 3;
                params.subtype = 2;
                com.popup("打印报价",api.index.quotationOutputIndex.url,null,null,true);
            });


            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid": quotationId}, function (res) {
                quotationUtils.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
            }, null, false);

            var addReduceIds = {};

            com.post(api.addReduce.queryAddReduceByOrderId, {"addReduce.orderId":params.decorationOrderId}, function (res) {
                var addReduces = res.addReduces;

                $.each(addReduces, function (i, v) {
                    addReduceIds["addReduceIds[" + i + "]"] = v.arId;
                });

            }, null, false);

            com.post(api.addReduce.queryAddReduceItemByAddReduceIds, addReduceIds, function (res) {
                quotationUtils.quotationDetail.addReduceItems = res.addReduceItems;
            }, null, false);

            var extensionItemIDs = {};

            com.post(api.quotation.queryExtensionByOrderId, {"extension.orderId": params.decorationOrderId}, function (res) {
                var extensions = res.extensions;
                $.each(extensions, function (i, v) {
                    extensionItemIDs["extensionItemIDs[" + i + "]"] = v.eid;
                });

            }, null, false);

            com.post(api.quotation.queryExtensionItemByEids, extensionItemIDs, function (res) {
                quotationUtils.quotationDetail.extensions = res.extensionItems;
            }, null, false);
            quotationUtils.statisticalQuotationItem(quotationUtils.quotationDetail.quotationFunctionAreas,quotationUtils.quotationDetail.addReduceItems, quotationUtils.quotationDetail.extensions);

            quotationUtils.initQuotationDetailItem(quotationUtils.quotationDetail.quotation,quotationUtils.quotationDetail.quotationFunctionAreas,quotationUtils.quotationDetail.addReduceItems, quotationUtils.quotationDetail.extensions,params.orderType);

            quotationUtils.initQuotationDetail();

            $("#showWay").on("change", function () {
                quotationUtils.initQuotationDetail();
            });
        } else {
            $("#btnPrintDefaultQuotationInfo").attr("disabled", "disabled");
        }
    },statisticalQuotationItem : function(quotationFunctionAreas, addReduceItems, extensionItems){
        var $quotationUndisPrice = 0;//报价项折扣总额
        var $quotationTotalPrice = 0;//报价项非折扣总额
        var $addReduceTotal = 0;//增项总额
        var $minusQuoTotalPrice = 0;//减项中的报价项非折扣总额
        var $minusQuoUndisPrice = 0;//减项中的报价折扣总额
        var $minusAddReduceTotal = 0;//减项中的增项总额
        var $$minusDefineUndisPrice = 0;//定义项目打折项
        var $minusDefineTotalPrice = 0; //定义项目非打折项
        var $minusExtensionTotalPrice = 0;//减项中的扩展项总额
        var $addExtensionItemTotalPrice = 0;//扩展项增项总额
        var $minusExtensionItemTotalPrice = 0;//扩展项减项总额


        var quotationFunctionAreaLength = quotationFunctionAreas.length;

        for (var i = 0; i < quotationFunctionAreaLength; ++i) {

            var quotationFunctionArea = quotationFunctionAreas[i];
            var quotationFunctionAreaItems = quotationFunctionArea.quotationFunctionAreaItems;
            var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;

            for (var j = 0; j < quotationFunctionAreaItemLength; j++) {

                var quotationFunctionAreaItem = quotationFunctionAreaItems[j];

                if (quotationFunctionArea.type != 3 && quotationFunctionArea.type != 0 && quotationFunctionAreaItem.type != 3 && quotationFunctionAreaItem.type != 2) {
                    if (quotationFunctionAreaItem.discount == 0) {
                        $quotationTotalPrice = utils.accAdd($quotationTotalPrice, utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.initNum)));
                    } else if (quotationFunctionAreaItem.discount == 1) {
                        $quotationUndisPrice = utils.accAdd($quotationUndisPrice, utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.initNum)));
                    }
                }
            }
        }


        if (extensionItems != null && extensionItems != '') {

            var extensionItemsLength = extensionItems.length;

            for (var i = 0; i < extensionItemsLength; ++i) {

                var extensionItem = extensionItems[i];

                var _dcp = extensionItem.unitPrice;
                var _dcpt = utils.changeThrDecimal(utils.accMul(extensionItem.num, _dcp));

                if(extensionItem.type == 0 || extensionItem.type == 1){
                    $addExtensionItemTotalPrice = utils.accAdd($addExtensionItemTotalPrice, _dcpt);
                }else if(extensionItem.type == 2 || extensionItem.type == 3){
                    $minusExtensionItemTotalPrice = utils.accAdd($minusExtensionItemTotalPrice, _dcpt);
                }
            }
        }


        var addReduceItemLength = addReduceItems.length;

        for (var i = 0; i < addReduceItemLength; ++i) {

            var addReduceItem = addReduceItems[i];

            var addReduceItemNum = addReduceItem.num;
            if ([1, 3, 4, 5].indexOf(addReduceItem.type) != -1){
                addReduceItemNum = -addReduceItemNum;
            }
            if ([0, 2].indexOf(addReduceItem.type) != -1) {
                $addReduceTotal = utils.accAdd($addReduceTotal, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
            } else if ([4].indexOf(addReduceItem.type) != -1) {
                $minusAddReduceTotal = utils.accAdd($minusAddReduceTotal, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
            } else if ([5].indexOf(addReduceItem.type) != -1) {
                $minusExtensionTotalPrice = utils.accAdd($minusExtensionTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
            } else if ([1].indexOf(addReduceItem.type) != -1) {
                if (addReduceItem.discount == 0) {
                    $minusDefineTotalPrice = utils.accAdd($minusDefineTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
                }
                if (addReduceItem.discount == 1) {
                    $$minusDefineUndisPrice = utils.accAdd($$minusDefineUndisPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
                }
            } else if([3].indexOf(addReduceItem.type) != -1){
                if (addReduceItem.discount == 0) {
                    $minusQuoTotalPrice = utils.accAdd($minusQuoTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
                } else if (addReduceItem.discount == 1) {
                    $minusQuoUndisPrice = utils.accAdd($minusQuoUndisPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
                }
            }
        }

        $addReduceTotal = utils.changeThrDecimal(utils.accAdd($addReduceTotal, -$minusAddReduceTotal));
        $addExtensionItemTotalPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd($addExtensionItemTotalPrice,-$minusExtensionItemTotalPrice), -$minusExtensionTotalPrice));
        $minusQuoTotalPrice = utils.changeThrDecimal(utils.accAdd($minusQuoTotalPrice, $minusDefineTotalPrice));//定义项目非打折项
        $minusQuoUndisPrice = utils.changeThrDecimal(utils.accAdd($minusQuoUndisPrice, $$minusDefineUndisPrice));//定义项目打折项

        quotationUtils.quotationDetail.quotationUndisPrice = $quotationUndisPrice;//报价项折扣总额
        quotationUtils.quotationDetail.quotationTotalPrice = $quotationTotalPrice;//报价项非折扣总额
        quotationUtils.quotationDetail.addReduceTotal = $addReduceTotal;//增项总额
        quotationUtils.quotationDetail.minusQuoTotalPrice = $minusQuoTotalPrice;//减项中的报价项非折扣总额
        quotationUtils.quotationDetail.minusQuoUndisPrice = $minusQuoUndisPrice;//减项中的报价折扣总额
        quotationUtils.quotationDetail.minusAddReduceTotal = $minusAddReduceTotal;//减项中的增项总额
        quotationUtils.quotationDetail.minusExtensionTotalPrice = $minusExtensionTotalPrice;//减项中的扩展项总额
        quotationUtils.quotationDetail.extensionItemTotalPrice = $addExtensionItemTotalPrice;//扩展项总额

    }, initQuotationDetailItem: function (quotation, quotationFunctionAreas, addReduceItems, extensionItems,orderType) {
        var addReduceItemtypeDict = {"0": "普通", "1": "系统", "2": "自定义", "3": "报价中", "4": "增项", "5": "扩展项"};
        var extensionItemtypeDict = {"0" :"扩展项 增项","1":"扩展项增项 自定义","2":"扩展项 减项","3":"扩展项减项 自定义"};

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

        for (var i = 0; i < quotationFunctionAreaLength; ++i) {

            var quotationFunctionArea = quotationFunctionAreas[i];
            var quotationFunctionAreaItems = quotationFunctionArea.quotationFunctionAreaItems;
            var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;
            quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName] = [];


            for (var j = 0; j < quotationFunctionAreaItemLength; j++) {

                var quotationFunctionAreaItem = quotationFunctionAreaItems[j];

                if (!quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType]) {
                    quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType] = {};
                }

                quotationFunctionAreaItem.typestr = quotationFunctionAreaItem.type == 0 ? "普通" : quotationFunctionAreaItem.type == 1 ? "自定义" : quotationFunctionAreaItem.type == 4  ? "不计算" : "-";
                var _dcp = 0;
                var _discountNum = 10;
                if ($decorationtype == 2) {
                    _discountNum = discount;
                    _dcp = quotationFunctionAreaItem.type < 2 || quotationFunctionAreaItem.type == 5 ? utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, utils.accDiv(discount, 10))) : quotationFunctionAreaItem.unitPrice;
                } else {
                    _discountNum = quotationFunctionAreaItem.discount == 1 ? discount : 10 ;
                    _dcp = quotationFunctionAreaItem.type < 2 || quotationFunctionAreaItem.type == 5 ? utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, (quotationFunctionAreaItem.discount == 1 ? utils.accDiv(discount, 10) : 1))) : quotationFunctionAreaItem.unitPrice;
                }
                var _dcpt = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.initNum, _dcp));

                if (quotationFunctionArea.type == 3) {
                    quotationFunctionAreaItem.dcp = 0;
                    quotationFunctionAreaItem.dcpt = 0;
                    quotationFunctionAreaItem._discountNum = 0;
                    quotationFunctionAreaItem.quotationTotalPrice = 0;
                } else {
                    quotationFunctionAreaItem.dcp = _dcp;
                    quotationFunctionAreaItem.dcpt = _dcpt;
                    quotationFunctionAreaItem._discountNum = _discountNum;
                    quotationFunctionAreaItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.num, quotationFunctionAreaItem.unitPrice));
                }

                if (quotationFunctionAreaItem.type == 2) {
                    quotationUtils.quotationDetail.trafficDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.num = quotation.trafficPrice;
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == 1 || $decorationtype == 2 ? utils.changeThrDecimal(utils.accMul(quotation.trafficPrice,utils.accDiv(discount, 10))) : quotation.trafficPrice;
                    quotationFunctionAreaItem.dcp = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.trafficPrice;
                } else if (quotationFunctionAreaItem.type == 3) {
                    quotationUtils.quotationDetail.manageDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.num = quotation.managePrice;
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == 1 ? utils.changeThrDecimal(utils.accMul(quotation.managePrice,utils.accDiv(discount, 10))) : quotation.managePrice;
                    quotationFunctionAreaItem._discountNum = quotationFunctionAreaItem.discount == 1 ? _discountNum : 10;
                    quotationFunctionAreaItem.dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice,quotation.notSalesmanRate));
                    quotationFunctionAreaItem.unitPrice = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice ,quotation.notSalesmanRate));
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.managePrice;
                }

                quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName].push(quotationFunctionAreaItem);

            }
        }


        if (extensionItems != null && extensionItems != '') {

            var extensionItemsLength = extensionItems.length;

            for (var i = 0; i < extensionItemsLength; ++i) {

                var extensionItem = extensionItems[i];

                if(extensionItem.type == 2 || extensionItem.type == 3){
                    extensionItem.num = -extensionItem.num;
                }
                extensionItem.typestr =extensionItemtypeDict[extensionItem.type] ;
                var _dcp = extensionItem.unitPrice;
                var _dcpt = utils.changeThrDecimal(utils.accMul(extensionItem.num, _dcp));

                extensionItem.dcp = _dcp;
                extensionItem.dcpt = _dcpt;
                extensionItem._discountNum = 10;
                extensionItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(extensionItem.num, extensionItem.unitPrice));

                if (quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName]) {
                    quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName].push(extensionItem);
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
                        reduceNums.ariId[addReduceItem.quoteItemId].num = utils.accAdd(reduceNums.ariId[addReduceItem.quoteItemId].num, addReduceItem.num);
                    } else {
                        reduceNums.ariId[addReduceItem.quoteItemId] = {};
                        reduceNums.ariId[addReduceItem.quoteItemId].num = addReduceItem.num;
                        reduceNums.ariId[addReduceItem.quoteItemId].quotationFunctionType = addReduceItem.quotationFunctionAreaType;
                    }
                } else if ([5].indexOf(addReduceItem.type) != -1) {
                    if (reduceNums.eiId[addReduceItem.quoteItemId]) {
                        reduceNums.eiId[addReduceItem.quoteItemId].num = utils.accAdd(reduceNums.eiId[addReduceItem.quoteItemId].num, addReduceItem.num);
                    } else {
                        reduceNums.eiId[addReduceItem.quoteItemId] = {};
                        reduceNums.eiId[addReduceItem.quoteItemId].num = addReduceItem.num;
                        reduceNums.eiId[addReduceItem.quoteItemId].quotationFunctionType = addReduceItem.quotationFunctionAreaType;
                    }
                } else if ([1].indexOf(addReduceItem.type) != -1) {

                } else if([3].indexOf(addReduceItem.type) != -1){

                }
                addReduceItem.num = -addReduceItem.num;
                addReduceItem.typestr = "减项 " + addReduceItemtypeDict[addReduceItem.type];
            }




            var _dcp = addReduceItem.unitPrice;
            var _discountNum = 10;
            addReduceItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice));
            if ($decorationtype == 0 && [1, 3].indexOf(addReduceItem.type) != -1 && addReduceItem.discount == 1) {
                _discountNum = discount;
                _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
            } else if ($decorationtype == 1 && [1, 3].indexOf(addReduceItem.type) != -1 && addReduceItem.discount == 1) {
                _discountNum = discount;
                _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
            } else if ($decorationtype == 2) {
                if ([0, 2, 4].indexOf(addReduceItem.type) != -1) {
                    _discountNum = config.addreduceDiscount;
                    _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(config.addreduceDiscount, 10)));
                } else if ([1, 3].indexOf(addReduceItem.type) != -1) {
                    _discountNum = discount;
                    _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
                }
            }

            var _dcpt = utils.changeThrDecimal(utils.accMul(addReduceItem.num, _dcp));

            addReduceItem.dcp = _dcp;
            addReduceItem.dcpt = _dcpt;
            addReduceItem._discountNum = _discountNum;

            if (quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName]) {
                quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName].push(addReduceItem);
            }
        }

        quotationUtils.quotationDataProcessing(quotationFunctionAreaItemCs,reduceNums);

    }, initQuotationDetail: function () {

        var quotationItemListDiv = $("#quotationItemListDiv").html("");

        if ($("#showWay").val() == 0) {
            _data = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;
        } else {
            _data = quotationUtils.quotationDetail.quotationFunctionAreaItemWs;
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
            $.each(v, function (j, qv) {


                var $item = $('<li></li>').addClass('fl-quo-item').prop('title',qv.content ? qv.content : "-");

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
        var $total = quotationUtils.quotationCalculator(quotationUtils.quotationDetail.quotation.discount,params.orderType);
        $domain = $('<div></div>').addClass('widget-box transparent').css({"margin-bottom": "20px"}).appendTo(quotationItemListDiv);
        $dhead = $('<div></div>').addClass('widget-header').appendTo($domain);
        $dname = $('<h4></h4>').append($('<strong></strong>').css('color', '#E2737D').html("总额: " + $total)).appendTo($dhead);
    },quotationDataProcessing : function (quotationFunctionAreaItemCs,reduceNums){

        var quotationFunctionAreaItemWs = {};
        var index = 0;
        $.each(quotationFunctionAreaItemCs, function (i, v) {

            $.each(v, function (j, qv) {
                if((qv.arId && [0, 1, 2].indexOf(qv.type) != -1) || !qv.arId ) {

                    if(qv["quoteItemId"]){
                        qv["quotationItemId"] = qv["quoteItemId"];
                        delete(qv["quoteItemId"]);
                    }

                    if (!quotationFunctionAreaItemWs["-"+qv.workType]) {
                        quotationFunctionAreaItemWs["-"+qv.workType] = {};
                    }

                    if (quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId] && qv.quotationItemId != 0 && qv.quotationItemId) {
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].num = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].num, qv.num));
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcp, qv.dcp));
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcpt = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcpt, qv.dcpt));
                    }else if(qv.quotationItemId == 0 || !qv.quotationItemId){
                        quotationFunctionAreaItemWs["-"+qv.workType]["customize"+index++] = $.extend({}, qv);
                    } else {
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId] = $.extend({}, qv);
                    }

                    if (qv.ariId && reduceNums.ariId[qv.ariId]) {
                        qv.num = utils.accAdd(qv.num, reduceNums.ariId[qv.ariId].num);
                        qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                        qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                    } else if (qv.eiId && reduceNums.eiId[qv.eiId]) {
                        qv.num = utils.accAdd(qv.num, reduceNums.eiId[qv.eiId].num);
                        qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                        qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                    }
                }
            })
        })

        quotationUtils.quotationDetail.quotationFunctionAreaItemWs = quotationFunctionAreaItemWs;
        quotationUtils.quotationDetail.quotationFunctionAreaItemCs = quotationFunctionAreaItemCs;

    }, quotationCalculator: function (discount,decorationOrderType) {

        var $quotationUndisPrice = quotationUtils.quotationDetail.quotationUndisPrice;//报价项折扣总额
        var $quotationTotalPrice = quotationUtils.quotationDetail.quotationTotalPrice;//报价项非折扣总额
        var $addReduceTotal = quotationUtils.quotationDetail.addReduceTotal;//增项总额
        var $minusQuoTotalPrice = quotationUtils.quotationDetail.minusQuoTotalPrice;//减项中的报价项非折扣总额
        var $minusQuoUndisPrice = quotationUtils.quotationDetail.minusQuoUndisPrice;//减项中的报价折扣总额
        var $minusAddReduceTotal = quotationUtils.quotationDetail.minusAddReduceTotal;//减项中的增项总额
        var $minusExtensionTotalPrice = quotationUtils.quotationDetail.minusExtensionTotalPrice;//减项中的扩展项总额
        var $extensionItemTotalPrice = quotationUtils.quotationDetail.extensionItemTotalPrice;//扩展项总额
        var $decorationtype = decorationOrderType;
        var $discount = discount;

        var $Total = 0;
        if ($decorationtype == 0) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul($quotationUndisPrice, utils.accDiv($discount, 10)), $quotationTotalPrice), $extensionItemTotalPrice), $addReduceTotal), utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10))), $minusQuoTotalPrice), $minusExtensionTotalPrice), $minusAddReduceTotal));
        } else if ($decorationtype == 1) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul($quotationUndisPrice, utils.accDiv($discount, 10)), $quotationTotalPrice), $extensionItemTotalPrice), $addReduceTotal), (utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10)))), $minusQuoTotalPrice), $minusExtensionTotalPrice), $minusAddReduceTotal));
        } else if ($decorationtype == 2) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accAdd($quotationUndisPrice,$quotationTotalPrice),utils.accDiv($discount, 10)), $extensionItemTotalPrice),utils.accMul($addReduceTotal,utils.accDiv(config.addreduceDiscount, 10))),utils.accMul(utils.accAdd($minusQuoTotalPrice,$minusQuoUndisPrice),utils.accDiv($discount, 10))),utils.accMul($minusAddReduceTotal,utils.accDiv(config.addreduceDiscount, 10))),$minusExtensionTotalPrice));
        }
        var $managePrice = quotationUtils.quotationDetail.manageDiscount == 1 ? utils.changeThrDecimal(utils.accMul(quotationUtils.quotationDetail.quotation.managePrice,utils.accDiv($discount, 10))) : quotationUtils.quotationDetail.quotation.managePrice ;

        var $trafficPrice = quotationUtils.quotationDetail.trafficDiscount == 1 || $decorationtype == 2 ? utils.changeThrDecimal(utils.accMul(quotationUtils.quotationDetail.quotation.trafficPrice,utils.accDiv($discount, 10))) : quotationUtils.quotationDetail.quotation.trafficPrice ;

        $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd($Total, $managePrice),$trafficPrice));
        return $Total;
    },quotationTotal : function(){
        var $quotationUndisPrice = quotationUtils.quotationDetail.quotationUndisPrice;//报价项折扣总额
        var $quotationTotalPrice = quotationUtils.quotationDetail.quotationTotalPrice;//报价项非折扣总额
        var $addReduceTotal = quotationUtils.quotationDetail.addReduceTotal;//增项总额
        var $minusQuoTotalPrice = quotationUtils.quotationDetail.minusQuoTotalPrice;//减项中的报价项非折扣总额
        var $minusQuoUndisPrice = quotationUtils.quotationDetail.minusQuoUndisPrice;//减项中的报价折扣总额
        var $minusAddReduceTotal = quotationUtils.quotationDetail.minusAddReduceTotal;//减项中的增项总额
        var $minusExtensionTotalPrice = quotationUtils.quotationDetail.minusExtensionTotalPrice;//减项中的扩展项总额
        var $extensionItemTotalPrice = quotationUtils.quotationDetail.extensionItemTotalPrice;//扩展项总额

        var $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd($quotationUndisPrice,$quotationTotalPrice),$addReduceTotal),$minusQuoTotalPrice),$minusQuoUndisPrice),$minusAddReduceTotal),$minusExtensionTotalPrice), $extensionItemTotalPrice),quotationUtils.quotationDetail.quotation.managePrice),quotationUtils.quotationDetail.quotation.trafficPrice));

        return $Total;
    }
}