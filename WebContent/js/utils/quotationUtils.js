var quotationUtils = {
    sortQuo : function(_items){
        _items = _items.sort(function (a, b) {
            if (a.index == null || b.index == null) {//降序排列
                return b.index - a.index;
            } else {//升序
                return a.index - b.index;
            }
        });
        return _items;
    },
    loadQuotationDetail: function () {

        quotationUtils.quotationDetail = {};

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": params.decorationOrderId,
        }, function (res) {
            quotationUtils.quotationDetail.quotation = res.quotation;
        }, null, false);

        var quotationId = quotationUtils.quotationDetail.quotation.qid;
        var status = quotationUtils.quotationDetail.quotation.status;

        if (quotationId) {
            $("#printProjectBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 1;
                params.subtype = [-2];
                params.showType = {itemtype: 7};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printFinanceBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 2;
                params.subtype = [-2];
                params.showType = {itemtype: 7, "showStandardPrice": true};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printCostBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 6;
                params.subtype = [-2];
                params.showType = {itemtype: 8, notManagementArea: "生成项目"};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printCustomerBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 3;
                params.subtype = [-2];
                params.showType = {itemtype: 7};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printEngineeringBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 3;
                params.subtype = [1];
                params.showType = {itemtype: 7};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printMaterialBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 3;
                params.subtype = [2];
                params.showType = {itemtype: 7};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printWorkBtn").click(function(){
                params.quotationId = quotationId;
                params.type = 4;
                params.subtype = [-2];
                params.showType = {itemtype: 7};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printQuoteItemBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 2;
                params.subtype = [1];
                params.showType = {itemtype: 1, notManagementArea: "生成项目"};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printExtensionItemBtn").click(function () {
                params.quotationId = quotationId;
                params.type = 2;
                params.subtype = [1];
                params.showType = {itemtype: 2};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            $("#printAddReduceItemBtn").click(function(){
                params.quotationId = quotationId;
                params.type = 2;
                params.subtype = [1];
                params.showType = {itemtype: 4};
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });
            
            $("#printNormriceSBtn").click(function(){
                params.quotationId = quotationId;
                params.type = 1;
                params.subtype = [1];
                params.showType = {itemtype: 4};
                params.workType = com.focusPage("#quotationCNSelect", "#printQuotationCNModal").val();
                com.popup("打印报价", "/views/quotation/normriceOutput.html", null, null, !!status);
            });
            $("#printNormriceWBtn").click(function(){
                params.quotationId = quotationId;
                params.type = 2;
                params.subtype = [1];
                params.showType = {itemtype: 4};
                params.workType = com.focusPage("#quotationCNSelect", "#printQuotationCNModal").val();
                com.popup("打印报价", "/views/quotation/normriceOutput.html", null, null, !!status);
            });
            
            $("#printingBtn").click(function(){
                
                var printConf = {
                    "quotationId" : quotationId,
                    "layout" : $('input[name="layout"]:checked').val(),
                    "type" : 0,
                    "itemtype" : [],
                    "calType" : $('input[name="calType"]:checked').val()
                };

                var $types = com.focusPage('input[name="type"]:checked', '#types');
                var $itemtypes = com.focusPage('input[name="itemtype"]:checked', '#itemtypes');

                $.each($types, function (i, v){
                    var $input = $(v);
                    printConf["type"] = parseInt(printConf["type"]) + parseInt($input.attr('value'));
                });

                $.each($itemtypes, function (i, v){
                    printConf["itemtype"].push(parseInt($(v).attr('value')));
                });

                params.quotation = {"printConf": printConf};
                
                com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
            });

            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid": quotationId}, function (res) {
                quotationUtils.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
            }, null, false);

            quotationUtils.quotationDetail.addReduces = [];

            com.post(api.addReduce.queryAddReduceByOrderId, {"addReduce.orderId":params.decorationOrderId}, function (res) {
                quotationUtils.quotationDetail.addReduces = res.addReduces;
            }, null, false);

            quotationUtils.quotationDetail.extensions = [];

            com.post(api.quotation.queryExtensionByOrderId, {"extension.orderId": params.decorationOrderId}, function (res) {
                quotationUtils.quotationDetail.extensions = res.extensions;
            }, null, false);

            quotationUtils.statisticalQuotationItem(
                quotationUtils.quotationDetail.quotationFunctionAreas,
                quotationUtils.quotationDetail.addReduces,
                quotationUtils.quotationDetail.extensions);

            var showType = {itemtype: 31};

            quotationUtils.initQuotationDetailItem(
                quotationUtils.quotationDetail.quotation,
                quotationUtils.quotationDetail.quotationFunctionAreas,
                quotationUtils.quotationDetail.addReduces,
                quotationUtils.quotationDetail.extensions, params.orderType, true, showType);

            quotationUtils.initQuotationDetail();

            $("#showWay").on("change", function () {
                quotationUtils.initQuotationDetail();
            });
        } else {
            $("#btnPrintDefaultQuotationInfo").attr("disabled", "disabled");
        }
    },
    statisticalQuotationItem : function(quotationFunctionAreas, addReduces, extensions){

        var $quotationUndisPrice = 0;//报价项折扣总额
        var $quotationTotalPrice = 0;//报价项非折扣总额
        var $quotationCostPrice = 0;//报价项成本总额
        
        var $addExtensionItemTotalPrice = 0;//扩展项增项总额
        var $minusExtensionItemTotalPrice = 0;//扩展项减项总额
        
        var $extensionTotalPrice = 0; // 拓展项总额
        
        var $addReduceTotal = 0;//增项总额
        var $minusQuoTotalPrice = 0;//减项中的报价项非折扣总额
        var $minusQuoUndisPrice = 0;//减项中的报价折扣总额
        var $minusAddReduceTotal = 0;//减项中的增项总额
        var $minusExtensionTotalPrice = 0;//减项中的扩展项总额
        
        var $addReduceTotalPrice = 0; // 增减项总额
        var $addReduceManagePrice = 0;  // 增减项管理费

        var quotationFunctionAreaLength = quotationFunctionAreas.length;

        for (var i = 0; i < quotationFunctionAreaLength; ++i) {

            var quotationFunctionArea = quotationFunctionAreas[i];

            var quotationFunctionAreaItems = quotationUtils.sortQuo(quotationFunctionArea.quotationFunctionAreaItems);
            var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;
            
            var _disPrice = 0, _undisPrice = 0, _costPrice = 0;

            for (var j = 0; j < quotationFunctionAreaItemLength; j++) {

                var quotationFunctionAreaItem = quotationFunctionAreaItems[j];
                
                if(quotationFunctionAreaItem.type == 0 || quotationFunctionAreaItem.type == 1){
                    if (quotationFunctionAreaItem.discount == 0) {
                        _disPrice = utils.accAdd(_disPrice, utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.initNum));
                    } else if (quotationFunctionAreaItem.discount == 1) {
                        _undisPrice = utils.accAdd(_undisPrice, utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.initNum));
                    }
                }
                
                if(quotationFunctionAreaItem.type == 5){
                    _costPrice = utils.accAdd(_costPrice, utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.initNum));
                }
            }
            
            if (quotationFunctionArea.type == 1){
                $quotationUndisPrice = utils.accAdd($quotationUndisPrice, _undisPrice);
                $quotationTotalPrice = utils.accAdd($quotationTotalPrice, _disPrice);
                $quotationCostPrice = utils.accAdd($quotationCostPrice, _costPrice);
            } else if (quotationFunctionArea.type == 2){
                $quotationUndisPrice = utils.accAdd($quotationUndisPrice, quotationFunctionArea.total);
            } else if (quotationFunctionArea.type == 4){
                $quotationUndisPrice = utils.accAdd($quotationUndisPrice, quotationFunctionArea.total);
                $quotationCostPrice = utils.accAdd($quotationCostPrice, quotationFunctionArea.total);
            }
        }
        
        if (extensions != null && extensions.length != 0){
            
            for(var i = 0; i < extensions.length ; i++){
                
                var extension = extensions[i];
                var extensionItems = extension.extensionItems;
                
                if (extensionItems == null || extensionItems.length == 0)  continue;
                
                for (var j = 0; j < extensionItems.length; j++) {

                    var extensionItem = extensionItems[j];

                    var _dcp = 0, _dcpt = 0;

                    if([0, 1].indexOf(extensionItem.type) != -1){

                        _dcp = extensionItem.unitPrice;
                        _dcpt = utils.changeThrDecimal(utils.accMul(extensionItem.num, _dcp));

                        $addExtensionItemTotalPrice = utils.accAdd($addExtensionItemTotalPrice, _dcpt);
                    }else if([2, 3, 4].indexOf(extensionItem.type) != -1){

                        _dcp = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, utils.accDiv(quotationUtils.quotationDetail.quotation.discount, 10)));
                        _dcpt = utils.changeThrDecimal(utils.accMul(extensionItem.num, _dcp));

                        $minusExtensionItemTotalPrice = utils.accAdd($minusExtensionItemTotalPrice, _dcpt);
                    }
                }
                
                $extensionTotalPrice = utils.accAdd($extensionTotalPrice, utils.accMul(extension.total, extension.type == 0 ? 1 : -1));
            }
        }
        
        if (addReduces != null && addReduces.length != 0){
            
            for(var i = 0; i < addReduces.length; i++){
                
                var addReduce = addReduces[i];
                var addReduceItems = addReduce.addReduceItems;
                
                if(addReduceItems == null || addReduceItems.length == 0) continue;
                
                for (var j = 0; j < addReduceItems.length; j++) {

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
                            //$minusQuoTotalPrice = utils.accAdd($minusQuoTotalPrice, price);

                        } else if (params.orderType == 2) {
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
        
        quotationUtils.quotationDetail.addReduceTotal = $addReduceTotal;//增项总额
        quotationUtils.quotationDetail.minusQuoTotalPrice = $minusQuoTotalPrice;//减项中的报价项非折扣总额
        quotationUtils.quotationDetail.minusQuoUndisPrice = $minusQuoUndisPrice;//减项中的报价折扣总额
        quotationUtils.quotationDetail.minusAddReduceTotal = $minusAddReduceTotal;//减项中的增项总额
        quotationUtils.quotationDetail.minusExtensionTotalPrice = $minusExtensionTotalPrice;//减项中的扩展项总额
        
        quotationUtils.quotationDetail.addReduceTotalPrice = $addReduceTotalPrice; // 增减项总额
        quotationUtils.quotationDetail.addReduceManagePrice = $addReduceManagePrice; // 增减项管理费总额
    },
    initQuotationDetailItem: function (quotation, quotationFunctionAreas, addReduces, extensions, orderType, dataProcessing, showType) {
        
        var addReduceItemtypeDict = {"0": "普通", "1": "系统", "2": "自定义", "3": "报价中", "4": "增项", "5": "扩展项"};
        var extensionItemtypeDict = {"0": "扩展项增项", "1": "扩展项增项 自定义", "2": "扩展项减项", "3": "扩展项减项 自定义", "4": "扩展项减项"};

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

            //if (showType.notManagementArea == quotationFunctionArea.functionAreaName) continue;
            if (quotationFunctionArea.functionAreaOrder == 9999 && (showType.itemtype & 16) != 16) continue;
            
            var quotationFunctionAreaItems = quotationUtils.sortQuo(quotationFunctionArea.quotationFunctionAreaItems);
            var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;

            quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName] = [];

            for (var j = 0; j < quotationFunctionAreaItemLength; j++) {

                var quotationFunctionAreaItem = quotationFunctionAreaItems[j];
                
                if (quotationFunctionAreaItem.type != 5 && (showType.itemtype & 1) != 1) continue;
                if (quotationFunctionAreaItem.type == 5 && (showType.itemtype & 8) != 8) continue;

                if (!quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType]) {
                    quotationFunctionAreaItemWs[quotationFunctionAreaItem.workType] = {};
                }
                
                var _dcp = 0;
                var _dcpt = 0;
                var _discountNum = 10;
                var _total = 0;
                
                quotationFunctionAreaItem.typestr = "-";
                
                if(quotationFunctionAreaItem.type == 0){
                    quotationFunctionAreaItem.typestr = "普通";
                    quotationFunctionAreaItem.discount = $decorationtype == 2 ? 1 : quotationFunctionAreaItem.discount;
                }
                
                if(quotationFunctionAreaItem.type == 1){
                    quotationFunctionAreaItem.typestr = "自定义";
                    quotationFunctionAreaItem.discount = $decorationtype == 2 ? 1 : quotationFunctionAreaItem.discount;
                }
                
                if(quotationFunctionAreaItem.type == 2){
                    quotationFunctionAreaItem.typestr = "管理";
                    quotationFunctionAreaItem.discount = $decorationtype == 2 ? 1 : quotationFunctionAreaItem.discount;
                }
                
                if(quotationFunctionAreaItem.type == 3){
                    quotationFunctionAreaItem.typestr = "管理";
                }
                
                if(quotationFunctionAreaItem.type == 4){
                    quotationFunctionAreaItem.typestr = "不计";
                    quotationFunctionAreaItem.discount = 0;
                }
                
                if(quotationFunctionAreaItem.type == 5){
                    quotationFunctionAreaItem.typestr = "成本";
                    quotationFunctionAreaItem.discount = 0;
                }
                
                if (quotationFunctionAreaItem.discount == 1){
                    _discountNum = discount;
                }

                if(quotationFunctionAreaItem.type == 0 || quotationFunctionAreaItem.type == 1){
                    _dcp = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, utils.accDiv(_discountNum, 10)));
                    _dcpt = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.initNum, _dcp));
                    _total = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.initNum, quotationFunctionAreaItem.unitPrice));
                }
                
                quotationFunctionAreaItem.num = quotationFunctionAreaItem.initNum;
                quotationFunctionAreaItem.dcp = _dcp;
                quotationFunctionAreaItem.dcpt = _dcpt;
                quotationFunctionAreaItem._discountNum = _discountNum;
                quotationFunctionAreaItem.total = _total;
                
                quotationFunctionAreaItem.quotationTotalPrice = _dcpt;
                
                if (quotationFunctionAreaItem.type == 5){
                    quotationFunctionAreaItem.quotationTotalPrice = 0;
                }
                
                if (quotationFunctionArea.type == 3) {
                    quotationFunctionAreaItem.showItem = true;
                    
                    quotationFunctionAreaItem._discountNum = 0;
                    quotationFunctionAreaItem.quotationTotalPrice = 0;
                    
                    quotationFunctionAreaItem.dcp = 0;
                    quotationFunctionAreaItem.dcpt = 0;
                }

                if (quotationFunctionAreaItem.type == 2) {
                    quotationUtils.quotationDetail.trafficDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.num = quotation.trafficPrice;
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == 1 || $decorationtype == 2 ? utils.changeThrDecimal(utils.accMul(quotation.trafficPrice,utils.accDiv(discount, 10))) : quotation.trafficPrice;
                    quotationFunctionAreaItem.dcp = quotationFunctionAreaItem.unitPrice;
                    quotationFunctionAreaItem.measurementUnit = "车运费";
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.trafficPrice;
                    quotationFunctionAreaItem.total = quotation.trafficPrice;
                } else if (quotationFunctionAreaItem.type == 3) {
                    quotationUtils.quotationDetail.manageDiscount = quotationFunctionAreaItem.discount;
                    quotationFunctionAreaItem.num = quotation.managePrice;
                    quotationFunctionAreaItem.measurementUnit = "管理费";
                    quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == 1 ? utils.changeThrDecimal(utils.accMul(quotation.managePrice,utils.accDiv(discount, 10))) : quotation.managePrice;
                    quotationFunctionAreaItem._discountNum = quotationFunctionAreaItem.discount == 1 ? _discountNum : 10;
                    quotationFunctionAreaItem.dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice,quotation.notSalesmanRate));
                    quotationFunctionAreaItem.unitPrice = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice ,quotation.notSalesmanRate));
                    quotationFunctionAreaItem.quotationTotalPrice = quotation.managePrice;
                    quotationFunctionAreaItem.total = quotation.managePrice;
                }

                quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName].push(quotationFunctionAreaItem);
            }
        }
        
        if ((showType.itemtype & 2) == 2 && extensions != null && extensions.length != 0) {
            
            for(var i = 0; i < extensions.length; i++){
                
                var extension = extensions[i];
                var extensionItems = extension.extensionItems;
                
                if (extensionItems == null || extensionItems.length == 0) continue;
                
                for (var j = 0; j < extensionItems.length; j++) {

                    var extensionItem = extensionItems[j];

                    var _dcp = 0, _dcpt = 0;

                    if([0, 1].indexOf(extensionItem.type) != -1){

                        extensionItem._discountNum = 10;

                        _dcp = extensionItem.unitPrice;
                        _dcpt = utils.changeThrDecimal(utils.accMul(_dcp, extensionItem.num));
                    }else if([2, 3, 4].indexOf(extensionItem.type) != -1){

                        extensionItem.unitPrice = -extensionItem.unitPrice;
                        extensionItem._discountNum = discount;

                        _dcp = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, utils.accDiv(discount, 10)));
                        _dcpt = utils.changeThrDecimal(utils.accMul(utils.accMul(extensionItem.unitPrice, extensionItem.num), utils.accDiv(discount, 10)));
                    }

                    extensionItem.typestr = extensionItemtypeDict[extensionItem.type];

                    extensionItem.dcp = _dcp;
                    extensionItem.dcpt = _dcpt;

                    extensionItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, extensionItem.num));
                    extensionItem.total = extensionItem.quotationTotalPrice;

                    if (quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName] == undefined) {
                        quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName] = [];
                    }

                    if (quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName]) {
                        quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName].push(extensionItem);
                    }
                }
            }
        }
        
        if ((showType.itemtype & 4) == 4 && addReduces != null && addReduces.length != 0) {
            
            for(var i = 0; i < addReduces.length; i++){
                
                var addReduce = addReduces[i];
                var addReduceItems = addReduce.addReduceItems;
                
                if(addReduceItems == null || addReduceItems.length == 0) continue;
                
                for (var j = 0; j < addReduceItems.length; j++) {

                    var addReduceItem = addReduceItems[j];
                    
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
                        
                        addReduceItem.typestr = "减项 " + addReduceItemtypeDict[addReduceItem.type];
                    }

                    var _dcp = addReduceItem.unitPrice;
                    var _discountNum = 10;

                    if ([0, 2].indexOf(addReduceItem.type) != -1) {

                    } else {

                        addReduceItem.num = -addReduceItem.num;

                        if (addReduceItem.type == 4 || addReduceItem.type == 5) {

                        } else if ($decorationtype == 2) {
                            _discountNum = discount;
                            _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
                        } else {
                            if ([1, 3].indexOf(addReduceItem.discount)) {
                                _discountNum = discount;
                                _dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, utils.accDiv(discount, 10)));
                            }
                        }
                    }

                    addReduceItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice));
                    addReduceItem.total = addReduceItem.quotationTotalPrice;
                    
                    _dcpt = utils.changeThrDecimal(utils.accMul(addReduceItem.num, _dcp));

                    addReduceItem.dcp = _dcp;
                    addReduceItem.dcpt = _dcpt;
                    addReduceItem._discountNum = _discountNum;
                    
                    if (quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName] == undefined) {
                        quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName] = [];
                    }

                    if (quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName]) {
                        quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName].push(addReduceItem);
                    }
                }
            }

        }

        quotationUtils.quotationDataProcessing(quotationFunctionAreaItemCs,reduceNums,dataProcessing);
    },
    initQuotationDetail: function () {

        var quotationItemListDiv = $("#quotationItemListDiv").html("");
        var db = 1, _data = null;
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

                var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content ? qv.content : "-");
                
                $dcpts = utils.accAdd($dcpts, qv.quotationTotalPrice);

                var _lineSet = [
                    ["line", linenum++],
                    ["num", qv.num],
                    ["name", qv.itemName],
                    ["type", qv.typestr, ["data-type", qv.type]],
                    ["unit", qv.measurementUnit],
                    ["worktype", qv.workType],
                    ["price unitprice", qv.unitPrice],
                    ["price discountprice", qv.unitPrice, ["data-discount", qv.discount]],
                    ["price totalprice-discount", qv.total, ["style", "white-space:nowrap"]],
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
            var $printWork = $('<a class ="btn btn-minier btn-info" >打印</a>');
            var $item = $('<li></li>');
            
            if($("#showWay").val() != 0){
                
                $item.append($printWork);
                
                $printWork.click(function(){
                    
                    params.quotationId = quotationUtils.quotationDetail.quotation.qid;
                    
                    var printConf = {
                        "quotationId" : quotationUtils.quotationDetail.quotation.qid,
                        "layout" : "4",
                        "type" : 31,
                        "itemtype" : [0, 1, 2],
                        "workType": i.split('-')[1],
                    };

                    params.quotation = {"printConf": printConf};
                    
                    com.popup("报价工种打印", api.index.quotationOutputIndex.url, null, null, true);
                });
            }
            
            $item.append($total).appendTo($list);

            $domain.appendTo(quotationItemListDiv);
        });

        com.post(api.decoration.queryDecorationHolonomy, {
            "decorationHolonomy.decoration.orderId": params.decorationOrderId
        }, function(res){
            db = res.decorationHolonomy.discountBase == null || res.decorationHolonomy.discountBase == "" || res.decorationHolonomy.discountBase == undefined ? 1 : res.decorationHolonomy.discountBase;
        }, null, false);


        var $total = quotationUtils.quotationCalculator(quotationUtils.quotationDetail.quotation.discount, quotationUtils.quotationDetail.quotation.basePrice);
        $domain = $('<div></div>').addClass('widget-box transparent').css({"margin-bottom": "20px"}).appendTo(quotationItemListDiv);
        $dhead = $('<div></div>').addClass('widget-header').appendTo($domain);
        $dname = $('<h4></h4>').append($('<strong></strong>').css('color', '#E2737D').html("总额: " + $total)).appendTo($dhead);
    },
    quotationDataProcessing : function (quotationFunctionAreaItemCs,reduceNums,dataProcessing){

        var quotationFunctionAreaItemWs = {};
        var index = 0;
        $.each(quotationFunctionAreaItemCs, function (i, v) {
            var areaName = i.split('-')[1];
            $.each(v, function (j, qv) {

//              if((qv.arId && [0, 1, 2].indexOf(qv.type) != -1) || !qv.arId ) {

                if(qv["quoteItemId"]){
                    qv["quotationItemId"] = qv["quoteItemId"];
                    delete(qv["quoteItemId"]);
                }

                if (!quotationFunctionAreaItemWs["-"+qv.workType]) {
                    quotationFunctionAreaItemWs["-"+qv.workType] = {};
                }
                
                qv["areaName"] = areaName;
                
                if(dataProcessing){
                    if (quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId] && qv.quotationItemId != 0 && qv.quotationItemId) {
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].num = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].num, qv.num));
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcp, qv.dcp));
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcpt = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcpt, qv.dcpt));
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].quotationTotalPrice = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].quotationTotalPrice, qv.quotationTotalPrice));
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].total = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].total, qv.total));
                    }else if(qv.quotationItemId == 0 || !qv.quotationItemId){
                        quotationFunctionAreaItemWs["-"+qv.workType]["customize"+index++] = $.extend({}, qv);
                    }else {
                        quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId] = $.extend({}, qv);
                    }
                }else {
                    /* if (quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId] && qv.quotationItemId != 0 && qv.quotationItemId) {
                     quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].num = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].num, qv.num));
                     quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcp, qv.dcp));
                     quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcpt = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItemWs["-"+qv.workType][qv.quotationItemId].dcpt, qv.dcpt));
                     }else*/
                    if (qv.quotationItemId == 0 || !qv.quotationItemId) {
                        quotationFunctionAreaItemWs["-" + qv.workType]["customize" + index++] = $.extend({}, qv);
                    } else {
                        quotationFunctionAreaItemWs["-" + qv.workType][qv.quotationItemId + "-" + index++] = $.extend({}, qv);
                    }
                }

                if (qv.ariId && reduceNums.ariId[qv.ariId]) {
                    qv.num = utils.accAdd(qv.num, reduceNums.ariId[qv.ariId].num);
                    qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                    qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                } else if (qv.eiid && reduceNums.eiId[qv.eiid]) {
                    qv.num = utils.accAdd(qv.num, reduceNums.eiId[qv.eiid].num);
                    qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
                    qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                }
            });
        });

        quotationUtils.quotationDetail.quotationFunctionAreaItemWs = quotationFunctionAreaItemWs;
        quotationUtils.quotationDetail.quotationFunctionAreaItemCs = quotationFunctionAreaItemCs;
    },
    quotationNormriceProcessing: function(quotationFunctionAreas, extensions, addreduces){
        
        var quotationFunctionAreaItemMs = {};
        var index = 0;
        
        $.each(quotationFunctionAreas, function (i, v) {
            
            var functionAreaName = v.functionAreaName;
            var functionAreaId = v.qfaid;
            
            $.each(v.quotationFunctionAreaItems, function (j, qv) {
                
                var normrice = qv.normrice;
                
                qv.quotationFunctionAreaId = functionAreaId;
                qv.quotationFunctionAreaName = functionAreaName;
                
                if (!quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name]) {
                    quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name] = [qv];
                }else{
                    quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name].push(qv);
                }
            });
        });
        
        $.each(extensions, function (i, v) {
            
            $.each(v.extensionItems, function (j, qv) {
                
                var normrice = qv.normrice;
                
                qv.initNum = [0, 1, 2].indexOf(qv.type) != -1 ? qv.num : -qv.num;
                
                if (!quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name]) {
                    quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name] = [qv];
                }else{
                    quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name].push(qv);
                }
            });
        });
        
        $.each(addreduces, function (i, v) {
            
            $.each(v.addReduceItems, function (j, qv) {
                
                var normrice = qv.normrice;
                
                qv.initNum = [0, 1, 2].indexOf(qv.type) != -1 ? qv.num : -qv.num;
                
                if (!quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name]) {
                    quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name] = [qv];
                }else{
                    quotationFunctionAreaItemMs[normrice.constructionNode.sort + "-" + normrice.constructionNode.name].push(qv);
                }
            });
        });
        
        quotationUtils.quotationDetail.quotationFunctionAreaItemMs = quotationFunctionAreaItemMs;
    },
    quotationNormoodProcessing: function(quotationFunctionAreas, extensions, addreduces){
        
        var quotationFunctionAreaItemAs = {};
        var index = 0;
        
        $.each(quotationFunctionAreas, function (i, v) {
            
            var functionAreaName = v.functionAreaName;
            var functionAreaId = v.qfaid;
            
            $.each(v.quotationFunctionAreaItems, function (j, qv) {
                
                var normood = qv.normood;
                
                normood.usenum = qv.initNum;
                
                if (!quotationFunctionAreaItemAs[normood.goods.gid + "-"]) {
                    quotationFunctionAreaItemAs[normood.goods.gid + "-"] = normood;
                }else{
                    
                    var item = quotationFunctionAreaItemAs[normood.goods.gid + "-"];
                    
                    item.usenum = utils.accAdd(item.usenum, normood.usenum);
                }
            });
        });
        
        $.each(extensions, function (i, v) {
            
            var functionAreaName = v.quotationFunctionAreaName;
            var functionAreaId = v.quotationFunctionAreaId;
            
            $.each(v.extensionItems, function (j, qv) {
                
                var normood = qv.normood;
                
                normood.usenum = [0, 1].indexOf(qv.type) != -1 ? qv.num : -qv.num;
                
                if (!quotationFunctionAreaItemAs[normood.goods.gid + "-"]) {
                    quotationFunctionAreaItemAs[normood.goods.gid + "-"] = normood;
                }else{
                    
                    var item = quotationFunctionAreaItemAs[normood.goods.gid + "-"];
                    
                    item.usenum = utils.accAdd(item.usenum, normood.usenum);
                }
            });
        });
        
        $.each(addreduces, function (i, v) {
            
            var functionAreaName = v.quotationFunctionAreaName;
            var functionAreaId = v.quotationFunctionAreaId;
            
            $.each(v.addReduceItems, function (j, qv) {
                
                var normood = qv.normood;
                
                normood.usenum = [0, 1, 2].indexOf(qv.type) != -1 ? qv.num : -qv.num;
                
                if (!quotationFunctionAreaItemAs[normood.goods.gid + "-"]) {
                    quotationFunctionAreaItemAs[normood.goods.gid + "-"] = normood;
                }else{
                    
                    var item = quotationFunctionAreaItemAs[normood.goods.gid + "-"];
                    
                    item.usenum = utils.accAdd(item.usenum, normood.usenum);
                }
            });
        });
        
        quotationUtils.quotationDetail.quotationFunctionAreaItemAs = quotationFunctionAreaItemAs;
    },
    //查询主材配比价格
    quotationMaterial:function(mm){

        var $quotationUndisPrice = quotationUtils.quotationDetail.quotationUndisPrice;//报价项折扣总额
        var $quotationTotalPrice = quotationUtils.quotationDetail.quotationTotalPrice;//报价项非折扣总额

        var $managePrice = quotationUtils.quotationDetail.quotation.managePrice ;

        var $trafficPrice = quotationUtils.quotationDetail.quotation.trafficPrice;

        var _quotationMaterial = utils.changeTwoDecimal(utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd($quotationUndisPrice,$quotationTotalPrice),$managePrice),$trafficPrice),mm));

        return _quotationMaterial
    },
    //计算工程额
    quotationCalculator: function (discount, basePrice) {
        
        var $quotationUndisPrice = quotationUtils.quotationDetail.quotationUndisPrice;//报价项折扣总额
        var $quotationTotalPrice = quotationUtils.quotationDetail.quotationTotalPrice;//报价项非折扣总额

        var $extensionTotalPrice = quotationUtils.quotationDetail.extensionTotalPrice;//扩展项总额

        var $addReduceTotal = quotationUtils.quotationDetail.addReduceTotal;//增项总额
        var $minusQuoTotalPrice = quotationUtils.quotationDetail.minusQuoTotalPrice;//减项中的报价项非折扣总额
        var $minusQuoUndisPrice = quotationUtils.quotationDetail.minusQuoUndisPrice;//减项中的报价折扣总额
        //var $minusAddReduceTotal = quotationUtils.quotationDetail.minusAddReduceTotal;//减项中的增项总额
        //var $minusExtensionTotalPrice = quotationUtils.quotationDetail.minusExtensionTotalPrice;//减项中的扩展项总额

        var $addReduceTotalPrice = quotationUtils.quotationDetail.addReduceTotalPrice; // 增减项总额

        var $discount = discount;
        var $basePrice = basePrice;
        var $managePrice = quotationUtils.quotationDetail.manageDiscount == 1 ? utils.changeThrDecimal(utils.accMul(quotationUtils.quotationDetail.quotation.managePrice,utils.accDiv($discount, 10))) : quotationUtils.quotationDetail.quotation.managePrice ;
        var $trafficPrice = quotationUtils.quotationDetail.trafficDiscount == 1  ? utils.changeThrDecimal(utils.accMul(quotationUtils.quotationDetail.quotation.trafficPrice,utils.accDiv($discount, 10))) : quotationUtils.quotationDetail.quotation.trafficPrice ;
        var $Total = 0;

        if ($basePrice && $basePrice != 0){
            // 工程基数
            var total = utils.accAdd(utils.accAdd($quotationUndisPrice,$quotationTotalPrice),quotationUtils.quotationDetail.quotation.trafficPrice);
            // 余数
            var remainder = total % $basePrice;
            // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
            var _dicProjectPrice = utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder),utils.accDiv($discount, 10)), remainder), $managePrice);
            // 增减增项总额 + 拓展项总额
            var addTotal = utils.accAdd($addReduceTotal, $extensionTotalPrice);
            // 减项非打折项 + 减项打折项 * 折扣
            var reduceTotal = utils.accAdd($minusQuoTotalPrice, utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10)));
            
//            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dicProjectPrice, addTotal), reduceTotal));
            $Total = utils.accAdd(_dicProjectPrice, $addReduceTotalPrice);
        } else {

            // 报价项打折价 * 折扣 + 报价项非打折价 + 增项 + 减项打折项 * 折扣 + 减项不打折项 + 拓展项总额 + 车运费 + 管理费
            var quotationTotal = utils.accAdd(utils.accMul($quotationUndisPrice, utils.accDiv($discount, 10)), $quotationTotalPrice);
            var addReduceTotal = utils.accAdd(utils.accAdd(utils.accMul($minusQuoUndisPrice, utils.accDiv($discount, 10)), $minusQuoTotalPrice), $addReduceTotal);

            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(quotationTotal, $addReduceTotalPrice), $extensionTotalPrice));
            $Total = utils.changeThrDecimal(utils.accAdd(utils.accAdd($Total, $managePrice), $trafficPrice));
        }

        return utils.changeThrDecimal($Total);
    },
    quotationTotal : function(){
        
        var $quotationUndisPrice = quotationUtils.quotationDetail.quotationUndisPrice;//报价项折扣总额
        var $quotationTotalPrice = quotationUtils.quotationDetail.quotationTotalPrice;//报价项非折扣总额
        
        var $extensionTotalPrice = quotationUtils.quotationDetail.extensionTotalPrice;//扩展项总额
        
        var $addReduceTotal = quotationUtils.quotationDetail.addReduceTotal;//增项总额
        var $minusQuoTotalPrice = quotationUtils.quotationDetail.minusQuoTotalPrice;//减项中的报价项非折扣总额
        var $minusQuoUndisPrice = quotationUtils.quotationDetail.minusQuoUndisPrice;//减项中的报价折扣总额
        //var $minusAddReduceTotal = quotationUtils.quotationDetail.minusAddReduceTotal;//减项中的增项总额
        //var $minusExtensionTotalPrice = quotationUtils.quotationDetail.minusExtensionTotalPrice;//减项中的扩展项总额
        
        var $addReduceTotalPrice = quotationUtils.quotationDetail.addReduceTotalPrice; // 增减项总额
        
        var $Total = utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd($quotationUndisPrice, $quotationTotalPrice), $addReduceTotalPrice), $extensionTotalPrice), quotationUtils.quotationDetail.quotation.managePrice), quotationUtils.quotationDetail.quotation.trafficPrice);

        return utils.changeThrDecimal($Total);
    }
};