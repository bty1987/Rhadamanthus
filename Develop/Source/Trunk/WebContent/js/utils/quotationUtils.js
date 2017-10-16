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
            $("#printProjectBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&orderType="+ decorationOrderDetail.orderType + "&type=1&time=" + params.loginTime);
            $("#printFinanceBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId + "&orderType="+ decorationOrderDetail.orderType + "&type=2&time=" + params.loginTime);
            $("#printCustomerBtn").attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quotationId +  "&orderType="+ decorationOrderDetail.orderType +"&type=3&time=" + params.loginTime);
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
            quotationUtils.statisticalQuotationItem(decorationOrderDetail.quotationDetail.quotationFunctionAreas, decorationOrderDetail.quotationDetail.addReduceItems, decorationOrderDetail.quotationDetail.extensions);

            quotationUtils.initQuotationDetailItem(decorationOrderDetail.quotation, decorationOrderDetail.quotationDetail.quotationFunctionAreas, decorationOrderDetail.quotationDetail.addReduceItems, decorationOrderDetail.quotationDetail.extensions);

            quotationUtils.initQuotationDetail();

            $("#showWay").on("change", function () {
                quotationUtils.initQuotationDetail();
            });
        } else {
            $("#btnPrintDefaultQuotationInfo").attr("disabled", "disabled");
        }
    },statisticalQuotationItem : function(quotationFunctionAreas, addReduceItems, extensionItems){
        var $quotationUndisPrice = 0;   //报价项折扣总额
        var $quotationTotalPrice = 0;	//报价项非折扣总额
        var $addReduceTotal = 0; //增项总额
        var $minusQuoTotalPrice = 0; //减项中的报价项非折扣总额
        var $minusQuoUndisPrice = 0; //减项中的报价折扣总额
        var $minusAddReduceTotal = 0; //减项中的增项总额
        var $$minusDefineUndisPrice = 0; //定义项目打折项
        var $minusDefineTotalPrice = 0;	//定义项目非打折项
        var $minusExtensionTotalPrice = 0; //减项中的扩展项总额
        var $extensionItemTotalPrice = 0; //扩展项总额
        var $NotCountingMinusQuoTotalPrice = 0; //不计算功能区的减项非折扣总额
        var $NotCountingMinusQuoUndisPrice = 0; //不计算功能的减项折扣总额


        var quotationFunctionAreaLength = quotationFunctionAreas.length;

        for (var i = 0; i < quotationFunctionAreaLength; ++i) {

            var quotationFunctionArea = quotationFunctionAreas[i];
            var quotationFunctionAreaItems = quotationFunctionArea.quotationFunctionAreaItems;
            var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;

            for (var j = 0; j < quotationFunctionAreaItemLength; j++) {

                var quotationFunctionAreaItem = quotationFunctionAreaItems[j];

                if (quotationFunctionArea.type != 3 && quotationFunctionArea.type != 0 && quotationFunctionAreaItem.type != 3 && quotationFunctionAreaItem.type != 2) {
                    if (quotationFunctionAreaItem.discount == 0) {
                        $quotationTotalPrice = utils.accAdd($quotationTotalPrice, utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.num)));
                    } else if (quotationFunctionAreaItem.discount == 1) {
                        $quotationUndisPrice = utils.accAdd($quotationUndisPrice, utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.num)));
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

                $extensionItemTotalPrice = utils.accAdd($extensionItemTotalPrice, _dcpt);
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
                if (addReduceItem.discount == 0 && addReduceItem.quotationFunctionAreaType != 3) {
                    $minusQuoTotalPrice = utils.accAdd($minusQuoTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
                } else if (addReduceItem.discount == 1 && addReduceItem.quotationFunctionAreaType != 3) {
                    $minusQuoUndisPrice = utils.accAdd($minusQuoUndisPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
                }else if(addReduceItem.discount == 0 && addReduceItem.quotationFunctionAreaType == 3){
                    $NotCountingMinusQuoTotalPrice = utils.accAdd($NotCountingMinusQuoTotalPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
                }else if(addReduceItem.discount == 1 && addReduceItem.quotationFunctionAreaType == 3){
                    $NotCountingMinusQuoUndisPrice = utils.accAdd($NotCountingMinusQuoUndisPrice, utils.changeThrDecimal(utils.accMul(addReduceItemNum, addReduceItem.unitPrice)));
                }
            }
        }

        $quotationUndisPrice = utils.changeThrDecimal(utils.accAdd($quotationUndisPrice, -$minusQuoUndisPrice));
        $quotationTotalPrice = utils.changeThrDecimal(utils.accAdd($quotationTotalPrice, -$minusQuoTotalPrice));
        $addReduceTotal = utils.changeThrDecimal(utils.accAdd($addReduceTotal, -$minusAddReduceTotal));
        $extensionItemTotalPrice = utils.changeThrDecimal(utils.accAdd($extensionItemTotalPrice, -$minusExtensionTotalPrice));
        $minusQuoTotalPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd($minusQuoTotalPrice, $minusDefineTotalPrice),$NotCountingMinusQuoTotalPrice));//定义项目非打折项
        $minusQuoUndisPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd($minusQuoUndisPrice, $$minusDefineUndisPrice),$NotCountingMinusQuoUndisPrice));//定义项目打折项

        decorationOrderDetail.quotationUndisPrice = $quotationUndisPrice; //报价项折扣总额
        decorationOrderDetail.quotationTotalPrice = $quotationTotalPrice; //报价项非折扣总额
        decorationOrderDetail.addReduceTotal = $addReduceTotal;  //增项总额
        decorationOrderDetail.minusQuoTotalPrice = $minusQuoTotalPrice //减项中的报价项非折扣总额
        decorationOrderDetail.minusQuoUndisPrice = $minusQuoUndisPrice; //减项中的报价折扣总额
        decorationOrderDetail.minusAddReduceTotal = $minusAddReduceTotal; //减项中的增项总额
        decorationOrderDetail.minusExtensionTotalPrice = $minusExtensionTotalPrice; //减项中的扩展项总额
        decorationOrderDetail.extensionItemTotalPrice = $extensionItemTotalPrice  //扩展项总额

    }, initQuotationDetailItem: function (quotation, quotationFunctionAreas, addReduceItems, extensionItems) {
        var addReduceItemtypeDict = {"0": "工程", "1": "系统", "2": "自定义", "3": "报价中", "4": "增项", "5": "扩展项"};


        var $decorationtype = decorationOrderDetail.orderType;
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

                quotationFunctionAreaItem.typestr = quotationFunctionAreaItem.type == 0 || quotationFunctionAreaItem.type == 4 ? "工程" : quotationFunctionAreaItem.type == 1 ? "自定义" : quotationFunctionAreaItem.type == 5 ? "主材" : "-";
                var _dcp = 0;
                if ($decorationtype == 2) {
                    _dcp = quotationFunctionAreaItem.type < 2 || quotationFunctionAreaItem.type == 5 ? utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, utils.accDiv(discount, 10))) : quotationFunctionAreaItem.unitPrice;
                } else {
                    _dcp = quotationFunctionAreaItem.type < 2 || quotationFunctionAreaItem.type == 5 ? utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, (quotationFunctionAreaItem.discount == 1 ? utils.accDiv(discount, 10) : 1))) : quotationFunctionAreaItem.unitPrice;
                }
                var _dcpt = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.num, _dcp));

                if (quotationFunctionArea.type == 3) {
                    quotationFunctionAreaItem.dcp = 0;
                    quotationFunctionAreaItem.dcpt = 0;
                    quotationFunctionAreaItem.quotationTotalPrice = 0;
                } else {
                    quotationFunctionAreaItem.dcp = _dcp;
                    quotationFunctionAreaItem.dcpt = _dcpt;
                    quotationFunctionAreaItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.num, quotationFunctionAreaItem.unitPrice));
                }

                if (quotationFunctionAreaItem.type == 2) {
                    decorationOrderDetail.trafficDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.defaultFunctionArea = -1;
                    quotationFunctionAreaItem.num = quotation.trafficPrice;
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == 1 || $decorationtype == 2 ? utils.changeThrDecimal(utils.accMul(quotation.trafficPrice,utils.accDiv(discount, 10))) : quotation.trafficPrice;
                    quotationFunctionAreaItem.dcp = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.trafficPrice;;
                } else if (quotationFunctionAreaItem.type == 3) {
                    decorationOrderDetail.manageDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.defaultFunctionArea = -1;
                    quotationFunctionAreaItem.num = quotation.managePrice;
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == 1 ? utils.changeThrDecimal(utils.accMul(quotation.managePrice,utils.accDiv(discount, 10))) : quotation.managePrice;
                    quotationFunctionAreaItem.dcp = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.managePrice;
                }

                quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName].push(quotationFunctionAreaItem);

            }
        }


        if (extensionItems != null && extensionItems != '') {

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
                    if (reduceNums.qfaiId[addReduceItem.quoteItemId]) {
                        reduceNums.qfaiId[addReduceItem.quoteItemId].num = utils.accAdd(reduceNums.qfaiId[addReduceItem.quoteItemId].num, addReduceItem.num);
                    } else {
                        reduceNums.qfaiId[addReduceItem.quoteItemId] = {};
                        reduceNums.qfaiId[addReduceItem.quoteItemId].num = addReduceItem.num;
                        reduceNums.qfaiId[addReduceItem.quoteItemId].quotationFunctionType = addReduceItem.quotationFunctionAreaType;
                    }
                }
                addReduceItem.MinusType = -1;
                addReduceItem.num = -addReduceItem.num;
                addReduceItem.typestr = "减项 " + addReduceItemtypeDict[addReduceItem.type];
            }




            var _dcp = addReduceItem.unitPrice;
            addReduceItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice));
            if ($decorationtype == 0 && [1, 3].indexOf(addReduceItem.type) != -1 && addReduceItem.discount == 1) {
                _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
            } else if ($decorationtype == 1 && [1, 3].indexOf(addReduceItem.type) != -1 && addReduceItem.discount == 1) {
                _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
            } else if ($decorationtype == 2) {
                if ([0, 2, 4].indexOf(addReduceItem.type) != -1) {
                    _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(config.addreduceDiscount, 10)));
                } else if ([1, 3].indexOf(addReduceItem.type) != -1) {
                    _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
                }
            }

            /*if(addReduceItem.quotationFunctionAreaType == 3 && [3].indexOf(addReduceItem.type) != -1){
                addReduceItem.quotationTotalPrice = 0;
                _dcp = 0;
            }*/

            var _dcpt = utils.changeThrDecimal(utils.accMul(addReduceItem.num, _dcp));

            addReduceItem.dcp = _dcp;
            addReduceItem.dcpt = _dcpt;

            if (quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName]) {
                quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName].push(addReduceItem);
            }
        }

        quotationUtils.quotationDataProcessing(quotationFunctionAreaItemCs,reduceNums);

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
            $.each(v, function (j, qv) {


                var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content);

                /*	if (decorationOrderDetail.reduceNums[qv.qfaiId]) {
                 qv.num = utils.accAdd(qv.num, decorationOrderDetail.reduceNums[qv.qfaiId]);
                 qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                 }*/


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

                    if (!qv.MinusType) {
                        if (qv.qfaiId && reduceNums.qfaiId[qv.qfaiId]) {
                            qv.num = utils.accAdd(qv.num, reduceNums.qfaiId[qv.qfaiId].num);
                            qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                            reduceNums.qfaiId[qv.qfaiId].quotationFunctionType == 3 ? 0 : qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                        } else if (qv.ariId && reduceNums.ariId[qv.ariId]) {
                            qv.num = utils.accAdd(qv.num, reduceNums.ariId[qv.ariId].num);
                            qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                            qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                        } else if (qv.eiId && reduceNums.eiId[qv.eiId]) {
                            qv.num = utils.accAdd(qv.num, reduceNums.eiId[qv.eiId].num);
                            qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                            qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                        }
                    }
                }
            })
        })

        decorationOrderDetail.quotationFunctionAreaItemWs = quotationFunctionAreaItemWs;
        decorationOrderDetail.quotationFunctionAreaItemCs = quotationFunctionAreaItemCs;

    }, quotationCalculator: function (discount,decorationOrderType) {

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

/*
        console.log("报价项折扣总额  " + $quotationUndisPrice);
        console.log("报价项非折扣  " + $quotationTotalPrice);
        console.log("扩展项总额  " + $extensionItemTotalPrice);
        console.log("增项总额  " + $addReduceTotal);
        console.log("减项中的报价项非折扣总额  " + $minusQuoTotalPrice);
        console.log("减项中的报价折扣总额  " + $minusQuoUndisPrice);
        console.log("减项中的增项总额  " + $minusAddReduceTotal);
        console.log("减项中的扩展项总额  " + $minusExtensionTotalPrice);
        console.log("车运费  " + decorationOrderDetail.quotation.trafficPrice);
        console.log("管理费  " + decorationOrderDetail.quotation.managePrice);
*/

        var $Total = 0;
        if ($decorationtype == 0) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul($quotationUndisPrice, utils.accDiv($discount, 10)), $quotationTotalPrice), $extensionItemTotalPrice), $addReduceTotal), utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10))), $minusQuoTotalPrice), $minusExtensionTotalPrice), $minusAddReduceTotal));
        } else if ($decorationtype == 1) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul($quotationUndisPrice, utils.accDiv($discount, 10)), $quotationTotalPrice), $extensionItemTotalPrice), $addReduceTotal), (utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10)))), $minusQuoTotalPrice), $minusExtensionTotalPrice), $minusAddReduceTotal));
        } else if ($decorationtype == 2) {
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accAdd($quotationUndisPrice,$quotationTotalPrice),utils.accDiv($discount, 10)), $extensionItemTotalPrice),utils.accMul($addReduceTotal,utils.accDiv(config.addreduceDiscount, 10))),utils.accMul(utils.accAdd($minusQuoTotalPrice,$minusQuoUndisPrice),utils.accDiv($discount, 10))),utils.accMul($minusAddReduceTotal,utils.accDiv(config.addreduceDiscount, 10))),$minusExtensionTotalPrice));
        }

        var $managePrice = decorationOrderDetail.manageDiscount == 1 ? utils.changeThrDecimal(utils.accMul(decorationOrderDetail.quotation.managePrice,utils.accDiv($discount, 10))) : decorationOrderDetail.quotation.managePrice ;

        var $trafficPrice = decorationOrderDetail.trafficDiscount == 1 || $decorationtype == 2 ? utils.changeThrDecimal(utils.accMul(decorationOrderDetail.quotation.trafficPrice,utils.accDiv($discount, 10))) : decorationOrderDetail.quotation.trafficPrice ;

        $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd($Total, $managePrice),$trafficPrice))
        return $Total;
    },quotationTotal : function(){
        var $discount = decorationOrderDetail.quotation.discount;
        var $quotationUndisPrice = decorationOrderDetail.quotationUndisPrice;   //报价项折扣总额
        var $quotationTotalPrice = decorationOrderDetail.quotationTotalPrice;	//报价项非折扣总额
        var $addReduceTotal = decorationOrderDetail.addReduceTotal; //增项总额
        var $minusQuoTotalPrice = decorationOrderDetail.minusQuoTotalPrice; //减项中的报价项非折扣总额
        var $minusQuoUndisPrice = decorationOrderDetail.minusQuoUndisPrice; //减项中的报价折扣总额
        var $minusAddReduceTotal = decorationOrderDetail.minusAddReduceTotal; //减项中的增项总额
        var $minusExtensionTotalPrice = decorationOrderDetail.minusExtensionTotalPrice; //减项中的扩展项总额
        var $extensionItemTotalPrice = decorationOrderDetail.extensionItemTotalPrice; //扩展项总额

        var $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd($quotationUndisPrice,$quotationTotalPrice),$addReduceTotal),$minusQuoTotalPrice),$minusQuoUndisPrice),$minusAddReduceTotal),$minusExtensionTotalPrice), $extensionItemTotalPrice),decorationOrderDetail.quotation.managePrice),decorationOrderDetail.quotation.trafficPrice));

        return $Total;
    }
}