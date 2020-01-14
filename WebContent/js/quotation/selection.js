var selectionDetail = (function(){
    var selection = {
        basicParams: {},
        nowEditQuote: null,
        btns: {
            saveSelectionBtn: com.focusPage('#saveSelectionBtn'),
            returnBtn: com.focusPage('#returnBtn'),
            addSelectionItemBtn: com.focusPage('#addSelectionItemBtn'),
            addSelectionItemCancelBtn: com.focusPage('#addSelectionItemCancelBtn')
        },
        modals: {
            addSelectionItemModal: com.focusPage('#addSelectionItemModal')
        },
        items: {
            goodsName: com.focusPage('#goodsName')
        },
        boxs: {
            quotationItemList: com.focusPage('#quotationItemList'),
            extensionAddItemList: com.focusPage('#extensionAddItemList'),
            extensionReduceItemList: com.focusPage('#extensionReduceItemList'),
            addReduceAddItemList: com.focusPage('#addReduceAddItemList'),
            addReduceReduceItemList: com.focusPage('#addReduceReduceItemList')
        },
        totals: {
            total: com.focusPage('#total'),
            quotationTotal: com.focusPage('#quotationTotal'),
            extensionAddTotal: com.focusPage('#extensionAddTotal'),
            extensionReduceTotal: com.focusPage('#extensionReduceTotal'),
            addReduceAddTotal: com.focusPage('#addReduceAddTotal'),
            addReduceMinusTotal: com.focusPage('#addReduceMinusTotal')
        },
        initSettingBtns: function() {
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
        initSelectionModals: function() {
            selection.modals.addSelectionItemModal.on('show.bs.modal', function(a) {
                selection.items.goodsName.get(0).selectedIndex = 0;
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

            selection.boxs.quotationItemList.find('.widget-box').each(function(i, v){
                quotationTotal = utils.accAdd($(this).attr('data-total'), quotationTotal);
            });

            selection.boxs.extensionAddItemList.find('.widget-box').each(function(i, v){
                extensionAddTotal = utils.accAdd($(this).attr('data-total'), extensionAddTotal);
            });

            selection.boxs.extensionReduceItemList.find('.widget-box').each(function(i, v){
                extensionReduceTotal = utils.accAdd($(this).attr('data-total'), extensionReduceTotal);
            });

            selection.boxs.addReduceAddItemList.find('.widget-box').each(function(i, v){
                addReduceAddTotal = utils.accAdd($(this).attr('data-total'), addReduceAddTotal);
            });

            selection.boxs.addReduceReduceItemList.find('.widget-box').each(function(i, v){
                addReduceMinusTotal = utils.accAdd($(this).attr('data-total'), addReduceMinusTotal);
            });

            var total = utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(quotationTotal, extensionAddTotal), addReduceAddTotal), extensionReduceTotal), addReduceMinusTotal);

            selection.totals.total.text(total);
            selection.totals.quotationTotal.text(quotationTotal);
            selection.totals.extensionAddTotal.text(extensionAddTotal);
            selection.totals.extensionReduceTotal.text(extensionReduceTotal);
            selection.totals.addReduceAddTotal.text(addReduceAddTotal);
            selection.totals.addReduceMinusTotal.text(addReduceMinusTotal);
            selection.basicParams['selection.total'] = utils.changeThrDecimal(total);
            selection.basicParams['selection.quotationTotal'] = utils.changeThrDecimal(quotationTotal);
            selection.basicParams['selection.extensionAddTotal'] = utils.changeThrDecimal(extensionAddTotal);
            selection.basicParams['selection.extensionReduceTotal'] = utils.changeThrDecimal(extensionReduceTotal);
            selection.basicParams['selection.addReduceAddTotal'] = utils.changeThrDecimal(addReduceAddTotal);
            selection.basicParams['selection.addReduceMinusTotal'] = utils.changeThrDecimal(addReduceMinusTotal);
        },
        getGoodsInformation: function(quotationItemId){
            // 10446
            com.post(api.data.querySoodsByQiid, {"soods.quotationItem.qiId": quotationItemId}, function (res) {
                if (res.soodes.length == 0) {
                    com.showAlert(com.warning, '该报价没有选材信息');
                    return false;
                }
                var list = [];
                $.each(res.soodes, function (i, v) {

                    var option = {
                        "gid": v.goods.gid,
                        "name": v.goods.name,
                        "selling": v.selling
                    };
                    list.push(option);
                });
                selection.items.goodsName.bindData(list, "gid", "name", false, null, "selling");
                selection.modals.addSelectionItemModal.modal("show");
            }, null, false);
        },
        init: function() {
            selection.initSettingBtns();
            selection.initSelectionModals();
            selection.calculateAllDomainTotal();
        }
    };

    var selectionItem = {
        type: [],
        addSelectionItem: function() {
            selection.btns.addSelectionItemBtn.click(function() {
                if(com.validate('addSelectionItemModal')) return;

                var selling = selection.items.goodsName.find('option:selected').attr('other');
                var num = selection.nowEditQuote.find('.num').text();
                var price = selection.nowEditQuote.next().attr('data-price');
                var total = selection.nowEditQuote.parents('.widget-box').attr('data-total');

                if (num === '0') {
                    com.showAlert(com.warning, '工程量为空');
                    return false;
                }

                selection.calculatePrice(selling, num);
                selection.calculateAllDomainTotal();

                var option = {
                    "selectionItem.goods.gid": selection.items.goodsName.val(),
                    "selectionItem.selling": selling,
                    "selectionItem.initNum": num,
                    "selectionItem.quoteId": selection.nowEditQuote.attr('data-quoteId'),
                    "selectionItem.type": selection.nowEditQuote.attr('data-type'),
                    "selectionItem.areaId": selection.nowEditQuote.attr('data-areaId'),
                    "selectionItem.areaName": selection.nowEditQuote.parents('.widget-box').attr("data-name"),
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

                selection.modals.addSelectionItemModal.modal("hide");
            });
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

            selectionItem.addSelectionItem();
        }
    };

    var painter = {

        createFunctionArea: function(name, type) {

            var $domain = $('<div></div>').addClass('widget-box transparent').css({"margin-bottom" : "20px"}).attr({"data-total": 0, "data-name": name});
            var $dhead = $('<div></div>').addClass('widget-header');
            var $hname = $('<h5></h5>').append($('<strong></strong>').html(selectionItem.type[type] + "-" + name));

            $dhead.append($hname);
            $domain.append($dhead);

            return $domain;
        },
        createQuote: function(areaId, quoteId, itemName, type, num) {

            var $rowDiv = $('<div></div>').addClass('row').css({'border-bottom': '1px solid #dce8f1', 'margin': '0 2px 0 2px'});
            var $selectionItemLi = $('<li></li>').addClass("fl-quo-item col-md-6").prop('id', quoteId + '-' + type);
            var $quoteItemLi = $('<li></li>').addClass('fl-quo-item col-md-6').css({'border': 'none', 'border-right': '1px solid #dce8f1'}).attr({
                'data-quoteId': quoteId,
                'data-type': type,
                'data-areaId': areaId
            });

            var lineSet = [
                ['name blue', itemName],
                ['num red', num]
            ];

            $.each(lineSet, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[0]).css('border','none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            var $btnCell = $('<div></div>').addClass('cell btns').css("border", "none");
            var $btnCellWrap = $('<div></div>').addClass('cell-wrap');

            var $btnSelection = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('选材').css('visibility', 'hidden');

            if (quoteId != null && quoteId != 0){
                $btnSelection.css('visibility', 'visible');
            }

            $btnSelection.click(function (e) {
                selection.nowEditQuote = $quoteItemLi;
                selection.getGoodsInformation(quoteId);
            });

            $quoteItemLi.append($btnCell.append($btnCellWrap.append($btnSelection)));
            $rowDiv.append($quoteItemLi).append($selectionItemLi);

            return $rowDiv;
        },
        createSelectionItem: function(data) {
            var $selectionItemLi = com.focusPage('#' + data.quoteId + '-' + data.type).empty();

            var lineSet = [
                ['name green', data.goods.name],
                ['selling red', data.selling],
                ['num blue', data.num]
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
            editFlg ? quotationId = params.quotationId : com.post(api.quotation.queryQuotationForDefaultByOrderId, {'quotation.orderId': orderId}, function(e){
                quotationId = e.quotation.qid;
            }, null, false);

            com.post(api.quotation.querySelectionByQid, {'selection.qid': quotationId}, function(res){

                selection.basicParams['selection.sid'] = res.selection.sid;
                selection.basicParams['selection.qid'] = res.selection.qid;
                selection.basicParams['selection.status'] = res.selection.status;
                selection.basicParams['selection.total'] = res.selection.total;
                selection.basicParams['selection.quotationTotal'] = res.selection.quotationTotal;
                selection.basicParams['selection.extensionAddTotal'] = res.selection.extensionAddTotal;
                selection.basicParams['selection.extensionReduceTotal'] = res.selection.extensionReduceTotal;
                selection.basicParams['selection.addReduceAddTotal'] = res.selection.addReduceAddTotal;
                selection.basicParams['selection.addReduceMinusTotal'] = res.selection.addReduceMinusTotal;

            }, null, false);

            selectionItem.init();

            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {'quotation.qid' : selection.basicParams['selection.qid']}, function(res){
                if (res.quotationFunctionAreas && res.quotationFunctionAreas.length) {
                    $.each(res.quotationFunctionAreas, function(i, v){
                        createQuote(v, 0);
                    });
                }
            }, null, false);

            com.post(api.quotation.queryExtensionByOrderId, {'extension.orderId': orderId}, function(res){
                if (res.extensions && res.extensions.length) {
                    $.each(res.extensions, function(i, v){
                        var type = v.type == 0 ? 1 : 2;
                        createQuote(v, type);
                    });
                }
            }, null, false);

            com.post(api.addReduce.queryAddReduceByOrderId, {'addReduce.orderId': orderId}, function(res){
                if (res.addReduces && res.addReduces.length) {
                    $.each(res.addReduces, function(i, v){
                        var type = v.type == 0 ? 3 : 4;
                        createQuote(v, type);
                    });
                }
            }, null, false);

            com.post(api.quotation.querySelectionItem, {'selection.sid': selection.basicParams['selection.sid']}, function(res){
                if (res.selectionItems && res.selectionItems.length) {
                    $.each(res.selectionItems, function(i, v){
                        var price = utils.accMul(v.selling, v.num);
                        var $selectionItemLi = painter.createSelectionItem(v).attr('data-price', price);
                        var $functionArea = $selectionItemLi.parents('.widget-box');

                        $functionArea.attr('data-total', utils.accAdd($functionArea.attr('data-total'), price));

                        painter.updateHeight($selectionItemLi);
                    });
                }
            }, null, false);

            selection.init();

            function createQuote(functionArea, type) {
                var boxs = [
                    selection.boxs.quotationItemList,
                    selection.boxs.extensionAddItemList,
                    selection.boxs.extensionReduceItemList,
                    selection.boxs.addReduceAddItemList,
                    selection.boxs.addReduceReduceItemList
                ];
                var list = [0, 1];
                var name = type === 0 ? functionArea.functionAreaName : functionArea.content;

                var $domain = painter.createFunctionArea(name, type);
                var $ul = $('<ul></ul>').addClass('fl-quo-list');

                if (type === 0) {
                    $.each(functionArea.quotationFunctionAreaItems, function(i, v){
                        if (!list.includes(v.subtype)) {
                            var $quoteItem = painter.createQuote(v.quotationFunctionAreaId,  v.quotationItemId, v.itemName, 0, v.num);
                            $ul.append($quoteItem);
                        }
                    });
                    boxs[type].append($domain.append($ul));
                } else if (type === 1 || type === 2) {
                    com.post(api.quotation.queryExtensionItemByEid, {'extensionItem.eid': functionArea.eid}, function(res){
                        $.each(res.extensionItems, function(i, v){
                            if (!list.includes(v.subtype)) {
                                var $quoteItem = painter.createQuote(v.eid, v.quoteItemId, v.itemName, type, v.num);
                                $ul.append($quoteItem);
                            }
                        });

                        boxs[type].append($domain.append($ul));
                    },null, false);
                } else {
                    com.post(api.addReduce.queryAddReduceItemByAddReduceId, {'addReduce.arId': functionArea.arId}, function(res){
                        $.each(res.addReduceItems, function(i, v){
                            if (!list.includes(v.subtype)) {
                                var quotationItemId = functionArea.type == 0 ? v.quoteItemId : v.quotationItemId;

                                var $quoteItem = painter.createQuote(v.arId, quotationItemId, v.itemName, type, v.num);
                                $ul.append($quoteItem);
                            }
                        });

                        boxs[type].append($domain.append($ul));
                    },null, false);
                }
            }
        }
    }
})();

$(function(){
    selectionDetail.init();
});