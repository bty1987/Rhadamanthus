var selectionDetail = (function(){
    var selection = {
        basicParams: {},
        nowEditQuote: null,
        btns: {
            saveSelectionBtn: com.focusPage('#saveSelectionBtn'),
            returnBtn: com.focusPage('#returnBtn'),
            addSelectionItemBtn: com.focusPage('#addSelectionItemBtn'),
            addSelectionItemCancelBtn: com.focusPage('#addSelectionItemCancelBtn'),
			printFinanceBtn: com.focusPage('#printFinanceBtn')
        },
        modals: {
            quotationItemSoodsModal: com.focusPage('#quotationItemSoodsModal')
        },
        items: {
            goodsName: com.focusPage('#goodsName')
        },
        selectionBox: com.focusPage('#selectionBox'),
        totals: {
            total: com.focusPage('#total'),
            quotationTotal: com.focusPage('#quotationTotal'),
            extensionAddTotal: com.focusPage('#extensionAddTotal'),
            extensionReduceTotal: com.focusPage('#extensionReduceTotal'),
            addReduceAddTotal: com.focusPage('#addReduceAddTotal'),
            addReduceMinusTotal: com.focusPage('#addReduceMinusTotal')
        },
        initSettingBtns: function() {
			selection.btns.printFinanceBtn.click(function() {
				com.post(api.quotation.querySelectionByOrderId, {"selection.orderId": params.decorationOrderId}, function(res) {
				    params.supplierPage = selectionItem.pageType == "supplier" ? true : false;
				    params.selectionOrderId = res.selection.orderId;
				    com.popup("打印选材", api.index.selectionOutputIndex.url, null, null, true);
				}, null, false);
			}),
            selection.btns.saveSelectionBtn.bindClick(function() {
                selection.calculateAllDomainTotal();
                com.post(api.quotation.updateSelectionForAdvance, selection.basicParams, function(a){
                    com.showAlert(com.info, '操作成功');
                });
            },2000);

            selection.btns.returnBtn.click(function() {
                com.showConfirm('当前页面存在重要数据,是否进行当前操作', function(a) {
                    com.switchPage(selection.historyPage);
                    com.closePopover();
                });
            });
        },
        calculatePrice: function(selling, num) {

            var price = utils.accMul(selling, num);
            var $selectionItemLi = selection.nowEditQuote.next().attr("data-price", price);
            var $functionArea = $selectionItemLi.parents('.widget-box');

            var total = 0;
            $functionArea.find('*[data-price]').each(function(i, v){
                total = utils.accAdd(total, $(this).attr("data-price"))
            });

            $functionArea.attr("data-total", total);
        },
        calculateAllDomainTotal: function() {
            var quotationTotal = 0, extensionAddTotal = 0, extensionReduceTotal = 0,addReduceAddTotal = 0,addReduceMinusTotal = 0;

            selection.selectionBox.find('.widget-box').each(function(i, v){

                var type = $(this).attr('data-type');
                switch (type) {
                    case "0": quotationTotal = utils.accAdd($(this).attr('data-total'), quotationTotal);
                        break;
                    case "1": extensionAddTotal = utils.accAdd($(this).attr('data-total'), extensionAddTotal);
                        break;
                    case "2": extensionReduceTotal = utils.accAdd($(this).attr('data-total'), extensionReduceTotal);
                        break;
                    case "3": addReduceAddTotal = utils.accAdd($(this).attr('data-total'), addReduceAddTotal);
                        break;
                    case "4": addReduceMinusTotal = utils.accAdd($(this).attr('data-total'), addReduceMinusTotal);
                        break;
                }
            });

            var total = utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(quotationTotal, extensionAddTotal), addReduceAddTotal), extensionReduceTotal), addReduceMinusTotal);

            selection.totals.total.text(total);
            selection.totals.quotationTotal.text(quotationTotal);
            selection.totals.extensionAddTotal.text(extensionAddTotal);
            selection.totals.extensionReduceTotal.text(-extensionReduceTotal);
            selection.totals.addReduceAddTotal.text(addReduceAddTotal);
            selection.totals.addReduceMinusTotal.text(-addReduceMinusTotal);
            selection.basicParams['selection.total'] = utils.changeThrDecimal(total);
            selection.basicParams['selection.quotationTotal'] = utils.changeThrDecimal(quotationTotal);
            selection.basicParams['selection.extensionAddTotal'] = utils.changeThrDecimal(extensionAddTotal);
            selection.basicParams['selection.extensionReduceTotal'] = utils.changeThrDecimal(extensionReduceTotal);
            selection.basicParams['selection.addReduceAddTotal'] = utils.changeThrDecimal(addReduceAddTotal);
            selection.basicParams['selection.addReduceMinusTotal'] = utils.changeThrDecimal(addReduceMinusTotal);
        },
        init: function() {
            selection.initSettingBtns();
            selection.calculateAllDomainTotal();
        }
    };

    var goods = {

        GoodsPage: function(quotationItemId){

            var displayFunc = (function () {

                var renderList = function (tableId, listData) {
                    var $tableWrap = com.focusPage('#' + tableId);
                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                    if (listData && listData.length) {
                        $.each(listData, function (i, v) {
                            var $liLine = creatLine(v);

                            $liLine.appendTo($ul);
                        });

                        $ul.appendTo($tableWrap);
                    }
                };

                var creatLine = function (v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.goods.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    var $btnSoods = $('<a></a>').addClass('btn btn-minier btn-success').html('添加');

                    var propertyArr = [
                        ["品牌: ", v.goods.brand, "grey"],
                        ["品类: ", v.goods.category, "grey"],
                        ["单位: ", v.goods.measurementUnit, "grey"],
                        ["数量: ", v.num, "blue"],
                        ["状态: ", v.status == 0 ? "有效" : "无效", "red"],
                        ["报价名称: ", v.quotationItem.itemName, "grey"],
                        ["报价版本: ", v.quotationItem.version, "grey"],
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $divBtnWrap.append($btnSoods).appendTo($h3);

                    $liLine.append($h3).append($ulProperty);

                    $btnSoods.click(function(e) {
                        selectionItem.addSelectionItem(v);
                    });

                    return $liLine;
                };

                return {
                    init: function (tableId, listData) {
                        com.focusPage('#' + tableId).html(null);
                        renderList(tableId, listData);
                    },
                    drawLine: function (v) {
                        return creatLine(v);
                    }
                }
            })();

            var soodsSeacher = new Searcher();

            soodsSeacher.init(["data-soods-name"], "condList", api.data.pageSoodsByQiid, function(data) {
                displayFunc.init("resultList", data);
            }, "pagenation", "selectionItemSoodsPostData", {"soods.quotationItem.qiid": quotationItemId}, false, null, null);

        },
    };

    var selectionItem = {
        type: [],
        addSelectionItem: function(soods) {

            var selling = soods.selling;
            var num = selection.nowEditQuote.find('.num').text();
            var price = selection.nowEditQuote.next().attr('data-price');
            var total = selection.nowEditQuote.parents('.widget-box').attr('data-total');
            
            if (num === '0') {
                com.showAlert(com.warning, '工程量为空');
                return false;
            }
            
            if(selling > selection.quotationItem.preprice){
//                com.showAlert(com.warning, "选材结算价高于项目单价");
//                return false;
            }
            
            selection.calculatePrice(selling, num);
            selection.calculateAllDomainTotal();

            var option = {
                "selectionItem.goods.gid": soods.goods.gid,
                "selectionItem.postprice": selling,
                "selectionItem.preprice": selection.nowEditQuote.attr('data-preprice'),
                "selectionItem.initNum": num,
                "selectionItem.quoteId": selection.nowEditQuote.attr('data-quoteId'),
                "selectionItem.type": selection.nowEditQuote.attr('data-type'),
                "selectionItem.areaId": selection.nowEditQuote.attr('data-areaId'),
                "selectionItem.areaName": selection.nowEditQuote.attr('data-areaName'),
                "selection.sid": selection.basicParams['selection.sid'],
                "selection.total": selection.basicParams['selection.total'],
                "selection.quotationTotal": selection.basicParams['selection.quotationTotal'],
                "selection.extensionAddTotal": selection.basicParams['selection.extensionAddTotal'],
                "selection.extensionReduceTotal": selection.basicParams['selection.extensionReduceTotal'],
                "selection.addReduceAddTotal": selection.basicParams['selection.addReduceAddTotal'],
                "selection.addReduceMinusTotal": selection.basicParams['selection.addReduceMinusTotal']
            };

            com.post(api.quotation.addSelectionItem, option, function(res){
                painter.createSelectionItem(res.selectionItem);
                painter.updateHeight(selection.nowEditQuote.next());
                com.showAlert(com.info, "操作成功");
            }, function(res) {
                com.showAlert(com.error, res.errorMsg);
                selection.nowEditQuote.next().attr('data-price', price);
                selection.nowEditQuote.parents('.widget-box').attr('data-total', total);
                selection.calculateAllDomainTotal();
            }, false);
            selection.modals.quotationItemSoodsModal.modal("hide");
        },
        deleteSelectionItem: function($selectionItemLi, selectionItem) {
            var price = $selectionItemLi.attr('data-price');
            var $functionArea = $selectionItemLi.parents('.widget-box');
            var total = $functionArea.attr('data-total');

            $functionArea.attr('data-total', utils.accSub($functionArea.attr('data-total'), price));
            selection.calculateAllDomainTotal();

            var option = {
                "selectionItem.siid": selectionItem.siid,
                "selection.sid": selection.basicParams['selection.sid'],
                "selection.total": selection.basicParams['selection.total'],
                "selection.quotationTotal": selection.basicParams['selection.quotationTotal'],
                "selection.extensionAddTotal": selection.basicParams['selection.extensionAddTotal'],
                "selection.extensionReduceTotal": selection.basicParams['selection.extensionReduceTotal'],
                "selection.addReduceAddTotal": selection.basicParams['selection.addReduceAddTotal'],
                "selection.addReduceMinusTotal": selection.basicParams['selection.addReduceMinusTotal']
            };

            com.post(api.quotation.deleteSelectionItem, option, function(e){
                $selectionItemLi.attr("data-price", 0).empty();
                com.showAlert(com.info, "操作成功");
            },function(res) {
                com.showAlert(com.error, res.errorMsg);
                $selectionItemLi.attr('data-price', price);
                $functionArea.attr('data-total', total);
                selection.calculateAllDomainTotal();
            },false);
        },
        init: function() {
            // 初始化选材项类型
            com.post(api.ds.quotation, {}, function(res){
                selectionItem.type = res.selectionItemType.split("key", "value");
            }, null, false);
        }
    };

    var painter = {

        createFunctionArea: function(name, type) {

            var $domain = $('<div></div>').addClass('widget-box transparent').css({"margin-bottom" : "20px"}).attr({"data-total": 0, "data-type": type});
            var $dhead = $('<div></div>').addClass('widget-header');
            var $hname = $('<h5></h5>').append($('<strong></strong>').html(selectionItem.type[type] + "-" + name));

            $dhead.append($hname);
            $domain.append($dhead);

            return $domain;
        },
        createQuote: function(data) {

            var $rowDiv = $('<div></div>').addClass('row').css({'border-bottom': '1px solid #dce8f1', 'margin': '0 2px 0 2px'});
            var $selectionItemLi = $('<li></li>').addClass("fl-quo-item col-md-6").prop('id', data.areaId + '-' + data.quoteId + '-' + data.type);
            var $quoteItemLi = $('<li></li>').addClass('fl-quo-item col-md-6').css({'border': 'none', 'border-right': '1px solid #dce8f1'}).attr({
                'data-quoteId': data.quoteId,
                'data-type': data.type,
                'data-areaId': data.areaId,
                'data-quotationItemId': data.quotationItemId,
                'data-areaName': data.quotationFunctionAreaName,
                'data-preprice': data.preprice,
            });

            var lineSet = [
                ['name blue', data.itemName],
                ['num red', data.num]
            ];

            $.each(lineSet, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[0]).css('border','none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            var $btnCell = $('<div></div>').addClass('cell btns').css("border", "none");
            var $btnCellWrap = $('<div></div>').addClass('cell-wrap');

            var $btnSelection = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('选材').css('visibility', 'hidden');

            if (data.quotationItemId != null && data.quotationItemId != 0 && data.type != 4){
                $btnSelection.css('visibility', 'visible');
            }

            $btnSelection.click(function (e) {
                selection.nowEditQuote = $quoteItemLi;
                selection.quotationItem = data;
                goods.GoodsPage(data.quotationItemId);
                selection.modals.quotationItemSoodsModal.modal("show");
            });

            $quoteItemLi.append($btnCell.append($btnCellWrap.append($btnSelection)));
            $rowDiv.append($quoteItemLi).append($selectionItemLi);

            return $rowDiv;
        },
        createSelectionItem: function(data) {
            var $selectionItemLi = com.focusPage('#' + data.areaId + '-' + data.quoteId + '-' + data.type).empty();

            var lineSet = [
                ['name green', data.goods.name],
                ['num blue', [2, 4].indexOf(data.type) != -1 ? -data.num : data.num]
            ];

            $.each(lineSet, function(i, v){
                var $cell = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                $cell.append($cellWrap).appendTo($selectionItemLi);
            });

            var $btnCell = $('<div></div>').addClass('cell btns').css("border","none");
            var $btnCellWrap = $('<div></div>').addClass('cell-wrap');

            var $btnDel = $('<a></a>').attr({'href': 'javascript:void(0)'}).css({'padding-left': '5px'}).append('<i class="bigger-125 icon-remove pink"></i>');

            $btnCellWrap.append($btnDel);
            $selectionItemLi.append($btnCell.append($btnCellWrap));

            $btnDel.click(function(e) {
                selectionItem.deleteSelectionItem($selectionItemLi, data);
                return false;
            });

            return $selectionItemLi;
        },
        updateHeight: function($selectionItemli) {
            var quoteItemNameDiv = $selectionItemli.prev().find('.name');
            var selectionItemNameDiv = $selectionItemli.find('.name');

            if (quoteItemNameDiv.height() > selectionItemNameDiv.height()) {
                selectionItemNameDiv.height(quoteItemNameDiv.height());
            } else {
                quoteItemNameDiv.height(selectionItemNameDiv.height());
            }
        }
    };

    return {
        init: function(){
            selection.historyPage = params.historyPage;

            var orderId = params.decorationOrderId;
            var editFlg = params.editFlg;
            var quotationId = null;
            var selectionItemType = 0;

            editFlg ? quotationId = params.quotationId : com.post(api.quotation.queryQuotationForDefaultByOrderId, {'quotation.orderId': orderId}, function(e){
                quotationId = e.quotation.qid;
            }, null, false);

            com.post(api.quotation.querySelectionByQid, {'selection.qid': quotationId}, function(queryRes){

                if (queryRes.selection == null) {
                    com.showConfirm("是否创建选材单", function () {
                        com.post(api.quotation.addSelection, {"selection.qid": quotationId}, function(addRes) {
                            loadPage(addRes);
                        }, null, false);
                    }, function() {
                        com.switchPage(selection.historyPage);
                    });
                }
                loadPage(queryRes);
            }, null, false);

            function loadPage(res) {

                if (res.selection != null) {

                    selection.basicParams['selection.sid'] = res.selection.sid;
                    selection.basicParams['selection.qid'] = res.selection.qid;
                    selection.basicParams['selection.status'] = res.selection.status;
                    selection.basicParams['selection.total'] = res.selection.total;
                    selection.basicParams['selection.quotationTotal'] = res.selection.quotationTotal;
                    selection.basicParams['selection.extensionAddTotal'] = res.selection.extensionAddTotal;
                    selection.basicParams['selection.extensionReduceTotal'] = res.selection.extensionReduceTotal;
                    selection.basicParams['selection.addReduceAddTotal'] = res.selection.addReduceAddTotal;
                    selection.basicParams['selection.addReduceMinusTotal'] = res.selection.addReduceMinusTotal;

                    selectionItem.init();

                    com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {'quotation.qid' : selection.basicParams['selection.qid']}, function(res){
                        if (res.quotationFunctionAreas && res.quotationFunctionAreas.length) {
                            $.each(res.quotationFunctionAreas, function(i, v){
                                v.type != 0 ? createItem(v, selectionItemType) : null;
                            });
                        }
                    }, null, false);

                    com.post(api.quotation.queryExtensionByOrderId, {'extension.orderId': orderId}, function(res){
                        if (res.extensions && res.extensions.length) {
                            $.each(res.extensions, function(i, v){
                                selectionItemType = v.type == 0 ? 1 : 2;
                                createItem(v, selectionItemType);
                            });
                        }
                    }, null, false);

                    com.post(api.addReduce.queryAddReduceByOrderId, {'addReduce.orderId': orderId}, function(res){
                        if (res.addReduces && res.addReduces.length) {
                            $.each(res.addReduces, function(i, v){
                                selectionItemType = v.type == 0 ? 3 : 4;
                                createItem(v, selectionItemType);
                            });
                        }
                    }, null, false);

                    com.post(api.quotation.querySelectionItem, {'selection.sid': selection.basicParams['selection.sid']}, function(res){
                        if (res.selectionItems && res.selectionItems.length) {
                            $.each(res.selectionItems, function(i, v){
                                var price = utils.accMul(v.postprice, v.num);
                                var $selectionItemLi = painter.createSelectionItem(v).attr('data-price', price);
                                var $functionArea = $selectionItemLi.parents('.widget-box');

                                $functionArea.attr('data-total', utils.accAdd($functionArea.attr('data-total'), price));

                                painter.updateHeight($selectionItemLi);
                            });
                        }
                    }, null, false);

                    selection.init();
                }
            }

            function createItem(functionArea, type) {

                var selectionBox = selection.selectionBox;

                var subtypes = [0, 1];
                var name = type === 0 ? functionArea.functionAreaName : selectionItem.type[type];

                var $domain = painter.createFunctionArea(name, type);
                var $ul = $('<ul></ul>').addClass('fl-quo-list');

                if (type === 0) {
                    $.each(functionArea.quotationFunctionAreaItems, function(i, v){
                        if (!subtypes.includes(v.subtype)) {
                            var data = dataProcessing(v, functionArea, type, functionArea.functionAreaName);
                            var $quoteItem = painter.createQuote(data);
                            $ul.append($quoteItem);
                        }
                    });
                } else if (type === 1 || type === 2) {
                    com.post(api.quotation.queryExtensionItemByEid, {'extensionItem.eid': functionArea.eid}, function(res){
                        $.each(res.extensionItems, function(i, v){
                            if (!subtypes.includes(v.subtype)) {
                                var data = dataProcessing(v, functionArea, type, null);
                                var $quoteItem = painter.createQuote(data);
                                $ul.append($quoteItem);
                            }
                        });
                    },null, false);
                } else {
                    com.post(api.addReduce.queryAddReduceItemByAddReduceId, {'addReduce.arId': functionArea.arId}, function(res){
                        $.each(res.addReduceItems, function(i, v){
                            if (!subtypes.includes(v.subtype)) {
                                var data = dataProcessing(v, functionArea, type, null);
                                var $quoteItem = painter.createQuote(data);
                                $ul.append($quoteItem);
                            }
                        });
                    },null, false);
                }

                selectionBox.append($domain.append($ul));
            }

            /**
             * 该方法用于处理数据, 返回新的数据作为 painter.createQuote()方法的参数
             * @param rawData 源数据
             * @param functionArea 当前项目的功能区
             * @param type 选材项的类型
             * @param functionAreaName 功能区名
             * @returns {*} 新数据
             */
            function dataProcessing(rawData, functionArea, type, functionAreaName) {

                var preprice, quotationItemId, data;

                if (type == 0) {

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
                } else if (type == 1 || type == 2) {
                    preprice = functionArea.type == 0 ? rawData.addPrice : rawData.subPrice;

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
                } else if (type == 3 || type == 4) {

                    if (functionArea.type == 0) {
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
        }
    }
})();

$(function(){
    selectionDetail.init();
});