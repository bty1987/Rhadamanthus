var selectionDetail = (function() {

    var selection = {
        basicParams: {},
        nowEditQuote: null,
        nowEditDomain: null,
        orderId: null,
        areaParams: {},
        datasets: {
            status: {}
        },
        btns: {
            saveSelectionBtn: com.focusPage('#saveSelectionBtn'),
            returnBtn: com.focusPage('#returnBtn'),
            addSelectionItemBtn: com.focusPage('#addSelectionItemBtn'),
            addSelectionItemCancelBtn: com.focusPage('#addSelectionItemCancelBtn'),
            printFinanceBtn: com.focusPage('#printFinanceBtn'),
            updateSelectionItemBtn: com.focusPage('#updateSelectionItemBtn'),
        },
        modals: {
            quotationItemSoodsModal: com.focusPage('#quotationItemSoodsModal'),
            quotationItemMateria: com.focusPage('#quotationItemMateria'),
            QRcodeModal: com.focusPage('#QRcodeModal'),
            updateSelectionItemModal: com.focusPage('#updateSelectionItemModal'),
        },
        items: {
            goodsName: com.focusPage('#goodsName'),

            num: com.focusPage("#num", "#updateSelectionItemModal"),
            comment: com.focusPage("#comment", "#updateSelectionItemModal")
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
        initQuoModals: function() {

            var that = this;

            that.quoModals = {
                $updateSelectionItemModal: com.focusPage("#updateSelectionItemModal").on("show.bs.modal", function(a) {

                    var domain = selection.nowEditDomain;

                    selection.items.num.val(domain.find('.num .cell-wrap').text());
                    selection.items.comment.val(domain.attr('data-comment'));
                })
            };

            return that;
        },
        initSettingBtns: function() {

            selection.btns.printFinanceBtn.click(function() {

                com.post(api.quotation.querySelectionByOrderId, {
                    "selection.orderId": params.quotation.orderId
                }, function(res) {

                    params.quotation.supplierPage = selectionItem.pageType == "supplier" ? true : false;
                    params.selection = res.selection;

                    com.popup("打印选材", api.index.selectionOutputIndex.url, null, null, true);
                }, null, false);
            }), selection.btns.saveSelectionBtn.bindClick(function() {

                selection.calculateAllDomainTotal();
                com.post(api.quotation.updateSelectionForAdvance, selection.basicParams, function(a) {

                    com.showAlert(com.info, '操作成功');
                });
            }, 2000);

            selection.btns.returnBtn.click(function() {

                com.showConfirm('当前页面存在重要数据,是否进行当前操作', function(a) {

                    com.switchPage(selection.historyPage);
                    com.closePopover();
                });
            });

            com.focusPage('#sendSelectionBtn').on('click', function() {

                com.showConfirm('是否要执行推送操作', function(a) {

                    var options = {
                        "selection.sid": selection.basicParams['selection.sid'],
                    };

                    com.post(api.quotation.sendSelection, options, function(res) {

                        com.showAlert(com.info, "操作成功");

                        if (selection.basicParams['selection.sendTime'] != null && selection.basicParams['selection.affirmTime'] != null) {
                            com.focusPage('#isAffirm').text('已变更');
                        }
                    }, function(res){
                        com.showAlert(com.error, res.errorMsg);
                    });
                });

            });

            com.initTypeahead('splitter', api.personel.queryUserByPinyin, "pinyinName", {
                "user.status": 0,
                "departmentType.name": ""
            }, "autoFillKeyValue", "key", "value");

            com.initTypeahead('traner', api.personel.queryUserByPinyin, "pinyinName", {
                "user.status": 0,
                "departmentType.name": ""
            }, "autoFillKeyValue", "key", "value");

            com.focusPage('#saveConfigBtn').on('click', function() {

                com.focusPage('#saveConfigModal').modal("show");

            });

            com.focusPage('#saveFunctionAreaBtn').on('click', function() {

                var option = {
                    "selection.sid": selection.basicParams['selection.sid']
                };

                if (com.focusPage('#splitter').val()) {
                    option["selection.splitter.userId"] = com.typeahead("splitter");
                }

                if (com.focusPage('#traner').val()) {
                    option["selection.traner.userId"] = com.typeahead("traner");
                }

                com.post(api.quotation.updateSelection, option, function(res) {

                    com.showAlert(com.info, "操作成功");
                    com.focusPage('#saveConfigModal').modal("hide");
                });

            });

            QRCodeBtn: com.focusPage('#QRCodeBtn').on('click', function() {

                com.focusPage('#QRcode').html("");

                com.focusPage('#QRcode').qrcode({
                    render: "canvas",
                    width: 150,
                    height: 150,
                    text: "http://fanglin.vip/wx/selection?orderId=" + selection.orderId

                });

                selection.modals.QRcodeModal.modal('show');
            });

            lockBtn: com.focusPage('#lockBtn').on('click', function() {

                com.post(api.quotation.lockSelection, {
                    "selection.sid": selection.basicParams['selection.sid']
                }, function(res) {
                    com.showAlert(com.info, "操作成功");
                    selection.lockSelectionByStatus(constant.quotation().selection.STATUS_LOCK_INT);
                });
            });

            unlockBtn: com.focusPage('#unlockBtn').on('click', function() {

                com.post(api.quotation.unlockSelection, {
                    "selection.sid": selection.basicParams['selection.sid']
                }, function(res) {
                    com.showAlert(com.info, "操作成功");
                    selection.lockSelectionByStatus(constant.quotation().selection.STATUS_INIT_INT);
                });
            });

            resetBtn: com.focusPage('#resetBtn').on('click', function() {

                com.post(api.quotation.resetSelection, {
                    "selection.sid": selection.basicParams['selection.sid']
                }, function(res) {

                    com.showAlert(com.info, "操作成功");
                });
            });

            saveMaterialBtn: com.focusPage('#saveMaterialBtn').on('click', function() {

                selection.modals.quotationItemMateria.modal("show");
                var cardbtns = [{
                    name: "添加",
                    clazz: "btn-success",
                    handle: function(soods) {

                        var option = {
                            "selectionItem.goods.gid": soods.goods.gid,
                            "selectionItem.postprice": soods.selling,
                            "selectionItem.preprice": 0,
                            "selectionItem.initNum": 0,
                            "selectionItem.num": 0,
                            "selectionItem.quoteId": soods.sid,
                            "selectionItem.soods.sid": soods.sid,
                            "selectionItem.qiid": soods.sid,
                            "selectionItem.type": constant.quotation().selectionItem.TYPE_ALONE_INT,
                            "selectionItem.areaId": 0,
                            "selectionItem.areaName": '未匹配',
                            "selection.sid": selection.basicParams['selection.sid'],
                            "selection.quotationTotal": selection.basicParams['selection.quotationTotal'],
                            "selection.extensionAddTotal": selection.basicParams['selection.extensionAddTotal'],
                            "selection.extensionReduceTotal": selection.basicParams['selection.extensionReduceTotal'],
                            "selection.addReduceAddTotal": selection.basicParams['selection.addReduceAddTotal'],
                            "selection.addReduceMinusTotal": selection.basicParams['selection.addReduceMinusTotal']
                        };

                        com.post(api.quotation.addSelectionItem, option, function(res) {

                            painter.createSelectionItem(res.selectionItem);

                            com.showAlert(com.info, "操作成功");

                            selectionItem.initSelectionItem();
                        }, null, false);

                        selection.modals.quotationItemMateria.modal("hide");
                    }
                }];

                var searcher = new Searcher();

                searcher.base("condLists", "pagenations", "resultLists", api.data.pageSoods);
                searcher.condition(["data-soods-name"]);
                searcher.history("pagegoodsPostData");
                searcher.param({
                    "soods.status": 0
                })

                var selecprops = [{
                    field: "goods.brand",
                    name: "品牌",
                    prop: "goods.brand",
                    clazz: "grey"
                }, {
                    field: "goods.category",
                    name: "品类",
                    prop: "goods.category",
                    clazz: "grey"
                }, {
                    field: "goods.measurementUnit",
                    name: "单位",
                    prop: "goods.measurementUnit",
                    clazz: "red"
                }, {
                    field: "selling",
                    name: "结算价",
                    prop: "selling",
                    clazz: "blue",
                    show: function(v) {

                        return false;
                    }
                }, {
                    field: "num",
                    name: "数量",
                    prop: "num",
                    clazz: "blue"
                }, {
                    field: "status",
                    name: "状态",
                    prop: "status",
                    dataset: constant.quotation().selectionItem.status.keys,
                    clazz: "red"
                }]

                searcher.line("goods.name", selecprops, cardbtns).render();

            });
        },
        calculatePrice: function(selling, num, nowEditDomain) {

            var price = utils.accMul(selling, num);
            var $selectionItemLi = nowEditDomain.attr("data-price", price);
            var $functionArea = $selectionItemLi.parents('.widget-box');

            var total = 0;
            $functionArea.find('*[data-price]').each(function(i, v) {

                total = utils.accAdd(total, $(this).attr("data-price"))
            });

            $functionArea.attr("data-total", total);
        },
        calculateAllDomainTotal: function() {

            var quotationTotal = 0, extensionAddTotal = 0, extensionReduceTotal = 0, addReduceAddTotal = 0, addReduceMinusTotal = 0;

            selection.selectionBox.find('.widget-box').each(function(i, v) {

                var type = parseInt($(this).attr('data-type'));

                switch (type) {
                    case constant.quotation().selectionItem.TYPE_QUOTATION_INT:
                        quotationTotal = utils.accAdd($(this).attr('data-total'), quotationTotal);
                        break;
                    case constant.quotation().selectionItem.TYPE_EXTENSIONADD_INT:
                        extensionAddTotal = utils.accAdd($(this).attr('data-total'), extensionAddTotal);
                        break;
                    case constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT:
                        extensionReduceTotal = utils.accAdd($(this).attr('data-total'), extensionReduceTotal);
                        break;
                    case constant.quotation().selectionItem.TYPE_ADDITEM_INT:
                        addReduceAddTotal = utils.accAdd($(this).attr('data-total'), addReduceAddTotal);
                        break;
                    case constant.quotation().selectionItem.TYPE_ADDITEM_COM_INT:
                        addReduceAddTotal = utils.accAdd($(this).attr('data-total'), addReduceAddTotal);
                        break;
                    case constant.quotation().selectionItem.TYPE_MINUSITEM_INT:
                        addReduceMinusTotal = utils.accAdd($(this).attr('data-total'), addReduceMinusTotal);
                        break;
                    case constant.quotation().selectionItem.TYPE_MINUSITEM_NORETURN_INT:
                        addReduceMinusTotal = utils.accAdd($(this).attr('data-total'), addReduceMinusTotal);
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
        lockSelectionByStatus: function(status) {
            status == constant.quotation().selection.STATUS_LOCK_INT ? com.focusPage('#unlockBtn').show() : com.focusPage('#unlockBtn').hide();
            status == constant.quotation().selection.STATUS_INIT_INT ? com.focusPage('#lockBtn').show() : com.focusPage('#lockBtn').hide();
        },
        init: function() {

            this.initQuoModals();
            this.initSettingBtns();
            this.calculateAllDomainTotal();
        }
    };

    var goods = {

        GoodsPage: function(quotationItemId) {

            var displayFunc = (function() {

                var renderList = function(tableId, listData) {

                    var $tableWrap = com.focusPage('#' + tableId);
                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                    if (listData && listData.length) {
                        $.each(listData, function(i, v) {

                            var $liLine = creatLine(v);

                            $liLine.appendTo($ul);
                        });

                        $ul.appendTo($tableWrap);
                    }
                };

                var creatLine = function(v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.goods.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    var $btnSoods = $('<a></a>').addClass('btn btn-minier btn-success').html('添加');

                    var propertyArr = [["品牌: ", v.goods.brand, "grey"], ["品类: ", v.goods.category, "grey"], ["单位: ", v.goods.measurementUnit, "grey"], ["数量: ", v.num, "blue"], ["状态: ", constant.data().goods.status.keys[v.status], "red"], ["报价名称: ", v.quotationItem.name, "grey"], ["报价版本: ", v.quotationItem.version.name, "grey"], ];

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $divBtnWrap.append($btnSoods).appendTo($h3);

                    $liLine.append($h3).append($ulProperty);

                    $btnSoods.click(function(e) {

                        com.post(api.data.queryGoodsByGId, {
                            'goods.gid': v.goods.gid
                        }, function(res) {

                            var goods = res.goods;

                            if (selectionItem.brandId.length != 0 && selectionItem.brandId.indexOf(goods.bid) == -1) {
                                com.showAlert(com.warning, "与关联项品牌不一致");
                                return false;
                            }

                            v.goods.bid = goods.bid;
                            selectionItem.addSelectionItem(v);
                        }, null, false);
                    });

                    return $liLine;
                };

                return {
                    init: function(tableId, listData) {

                        com.focusPage('#' + tableId).html(null);
                        renderList(tableId, listData);
                    },
                    drawLine: function(v) {

                        return creatLine(v);
                    }
                }
            })();

            var soodsSeacher = new Searcher();

            soodsSeacher.param({
                "soodsItem.status": 0
            });

            soodsSeacher.init(["data-soods-name"], "condList", api.data.pageSoodsItemByQiid, function(data) {

                displayFunc.init("resultList", data);
            }, "pagenation", "selectionItemSoodsPostData", {
                "soodsItem.quotationItem.qiid": quotationItemId,
                "soodsItem.status": constant.data().soodsItem.STATUS_ENABLE_INT,
                "soodsItem.goods.status": constant.data().goods.STATUS_ENABLE_INT
            }, false, null, null);

        },
    };

    var selectionItem = {
        type: [],
        brandId: [],
        $nowLine: null,
        $nowEditInput: null,
        getNumCellFocus: function($line) {

            var that = this;

            var $numCell = $line.find('.cell.num');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $line.find('.fl-quo-input');

            selectionItem.checkedStyle($line);

            $editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();

            that.$nowLine = $line;
            that.$nowEditInput = $editInput;

            that.$nowEditInput.find('input').off('keydown').on("keydown", function(e) {

                var $input = $(this);
                that.bindInputKeydown($input.val(), e);
            });
        },
        bindInputKeydown: function(num, e) {

            var that = this;

            if (e.keyCode == 13) {

                var postprice = that.$nowLine.attr('data-postprice');
                var oldNum = that.$nowLine.find('.num .cell-wrap').text();

                that.$nowLine.find('.num .cell-wrap').text(num);

                selection.calculatePrice(postprice, num, that.$nowLine);
                selection.calculateAllDomainTotal();

                var option = {
                    "selectionItem.siid": that.$nowLine.attr('data-siid'),
                    "selectionItem.num": num
                };

                com.post(api.quotation.updateSelectionItem, option, function(res) {

                }, function(v) {

                    that.$nowLine.find('.num .cell-wrap').text(oldNum);
                    selection.calculatePrice(postprice, oldNum, that.$nowLine);
                    selection.calculateAllDomainTotal();
                    com.showAlert(com.error, v.errorMsg);
                });

                that.hideInputWrap();

                return false;
            }
        },
        clearQuoteSelected: function() {

            var that = this;

            $('body').click(function(e) {

                if (!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')) {
                    that.hideInputWrap();
                }
            });
        },
        hideInputWrap: function() {

            if (!this.$nowEditInput) {
                return false;
            }

            this.$nowEditInput.addClass('hide');
        },
        checkedStyle: function($item) {

            com.focusPage('.fl-quo-item.col-md-6.current').removeClass('current');
            $item.addClass('current');
        },
        initSelectionItem: function() {
            com.post(api.quotation.querySelectionItem, {
                'selection.sid': selection.basicParams['selection.sid']
            }, function(res) {
                if (res.selectionItems && res.selectionItems.length) {
                    com.focusPage('#sendSelectionBtn').removeClass("disabled");
                    com.focusPage('#QRCodeBtn').removeClass("disabled");
                } else {
                    com.focusPage('#sendSelectionBtn').addClass("disabled");
                    com.focusPage('#QRCodeBtn').addClass("disabled");
                }
            });
        },
        addSelectionItem: function(soods) {

            var selling = soods.selling;
            var num = selection.nowEditQuote.find('.num').text();
            var price = selection.nowEditQuote.next().attr('data-price');
            var total = selection.nowEditQuote.parents('.widget-box').attr('data-total');

            if (num === '0') {
                com.showAlert(com.warning, '工程量为空');
                return false;
            }

            if (selling > selection.quotationItem.preprice) {
                // com.showAlert(com.warning, "选材结算价高于项目单价");
                // return false;
            }

            selection.calculatePrice(selling, num, selection.nowEditQuote.next());
            selection.calculateAllDomainTotal();

            var option = {
                "selectionItem.goods.gid": soods.goods.gid,
                "selectionItem.postprice": selling,
                "selectionItem.preprice": selection.nowEditQuote.attr('data-preprice'),
                "selectionItem.initNum": num,
                "selectionItem.num": 0,
                "selectionItem.quoteId": selection.nowEditQuote.attr('data-quoteId'),
                "selectionItem.type": selection.nowEditQuote.attr('data-type'),
                "selectionItem.areaId": selection.nowEditQuote.attr('data-areaId'),
                "selectionItem.areaName": selection.nowEditQuote.attr('data-areaName'),
                "selectionItem.qiid": selection.quotationItem.quotationItemId,
                "selectionItem.soods.sid": soods.sid,
                "selection.sid": selection.basicParams['selection.sid'],
                "selection.total": selection.basicParams['selection.total'],
                "selection.quotationTotal": selection.basicParams['selection.quotationTotal'],
                "selection.extensionAddTotal": selection.basicParams['selection.extensionAddTotal'],
                "selection.extensionReduceTotal": selection.basicParams['selection.extensionReduceTotal'],
                "selection.addReduceAddTotal": selection.basicParams['selection.addReduceAddTotal'],
                "selection.addReduceMinusTotal": selection.basicParams['selection.addReduceMinusTotal']
            };

            com.post(api.quotation.addSelectionItem, option, function(res) {

                res.selectionItem.goods.bid = soods.goods.bid;
                res.selectionItem.goods.category = soods.goods.category;
                res.selectionItem.goods.format = soods.goods.format;

                painter.createSelectionItem(res.selectionItem);
                painter.updateHeight(selection.nowEditQuote.next());
                com.showAlert(com.info, "操作成功");
                selectionItem.initSelectionItem();

                formula.refresh();
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);
                selection.nowEditQuote.next().attr('data-price', price);
                selection.nowEditQuote.parents('.widget-box').attr('data-total', total);
                selection.calculateAllDomainTotal();
            }, false);
            selection.modals.quotationItemSoodsModal.modal("hide");
        },
        deleteSelectionItem: function($selectionItemLi, selectionitem) {

            var price = $selectionItemLi.attr('data-price');
            var $functionArea = $selectionItemLi.parents('.widget-box');
            var total = $functionArea.attr('data-total');

            $functionArea.attr('data-total', utils.accSub($functionArea.attr('data-total'), price));
            selection.calculateAllDomainTotal();

            var option = {
                "selectionItem.siid": selectionitem.siid,
                "selection.sid": selection.basicParams['selection.sid'],
                "selection.total": selection.basicParams['selection.total'],
                "selection.quotationTotal": selection.basicParams['selection.quotationTotal'],
                "selection.extensionAddTotal": selection.basicParams['selection.extensionAddTotal'],
                "selection.extensionReduceTotal": selection.basicParams['selection.extensionReduceTotal'],
                "selection.addReduceAddTotal": selection.basicParams['selection.addReduceAddTotal'],
                "selection.addReduceMinusTotal": selection.basicParams['selection.addReduceMinusTotal']
            };

            com.post(api.quotation.deleteSelectionItem, option, function(e) {

                $selectionItemLi.attr("data-siid", null);
                $selectionItemLi.attr("data-price", 0).empty();
                $selectionItemLi.parent("div.alone").remove();
                com.showAlert(com.info, "操作成功");
                selectionItem.initSelectionItem();

                formula.paintFormulaResults();
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);
                $selectionItemLi.attr('data-price', price);
                $functionArea.attr('data-total', total);
                selection.calculateAllDomainTotal();
            }, false);
        },
        updateSelectionItem: function() {

            selection.btns.updateSelectionItemBtn.click(function() {

                if (com.validate('updateSelectionItemModal'))
                    return false;

                var domain = selection.nowEditDomain;
                var postprice = domain.attr('data-postprice');
                var oldNum = domain.find('.num .cell-wrap').text();

                domain.find('.num .cell-wrap').text(selection.items.num.val());
                selection.calculatePrice(postprice, selection.items.num.val(), domain);
                selection.calculateAllDomainTotal();

                var option = {
                    "selectionItem.siid": domain.attr('data-siid'),
                    "selectionItem.num": selection.items.num.val(),
                    "selectionItem.comment": selection.items.comment.val()
                };

                com.post(api.quotation.updateSelectionItem, option, function(res) {

                    domain.attr('data-comment', selection.items.comment.val());
                    com.showAlert(com.info, "操作成功");
                }, function(v) {
                    domain.find('.num .cell-wrap').text(oldNum);
                    selection.calculatePrice(postprice, oldNum, domain);
                    selection.calculateAllDomainTotal();
                    com.showAlert(com.error, v.errorMsg);
                });

                selection.modals.updateSelectionItemModal.modal("hide");
            });
        },
        init: function() {

            // 初始化选材项类型
            this.type = constant.quotation().selectionItem.type.keys;
            this.clearQuoteSelected();
            this.initSelectionItem();
            this.updateSelectionItem();
        }
    };

    var rtem = {
        quotationRtem: function($item) {

            selectionItem.brandId = [];
            var $domain = $item.parents('.widget-box');
            var qiid = $item.attr('data-quotationItemId');

            com.post(api.quotation.queryQuotationRtem, {
                "quotationRtem.source.qiid": qiid
            }, function(res) {

                if (res.quotationRtems.length == 0)
                    return false;

                $.each(res.quotationRtems, function(i, v) {

                    var itemRight = $domain.find('.fl-quo-item[data-quotationitemid="' + v.target.qiid + '"]').next('.fl-quo-item');

                    if (!itemRight.attr('data-siid'))
                        return true;

                    var bid = parseInt(itemRight.attr('data-bid'));

                    selectionItem.brandId.push(bid);
                });
            }, null, false);
        }
    };

    var painter = {

        createFunctionArea: function(name, type) {

            var $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            }).attr({
                "data-total": 0,
                "data-type": type
            });
            var $dhead = $('<div></div>').addClass('widget-header');
            var $hname = $('<h5></h5>').append($('<strong></strong>').html(selectionItem.type[type] + "-" + name));

            var $ul = $('<ul></ul>').addClass('fl-quo-list');
            var $row = $("<div></div>").addClass('row').css({
                'border-bottom': '1px solid #dce8f1',
                'margin': '0 2px 0 2px'
            }).appendTo($ul);

            var $li = $('<li></li>').css({
                'border': 'none',
                'border-right': '1px solid #dce8f1'
            }).addClass('fl-quo-item col-xs-6').appendTo($row);

            var lineSetLeft = [];
            lineSetLeft.push(["name", "报价项"]);
            if (selection.historyPage != api.index.selectionItemIndex.url) lineSetLeft.push(["num", "数量"]);
            lineSetLeft.push(["btns", "功能"]);

            var lineSetRight = [];
            lineSetRight.push(["name", "商品"]);
            lineSetRight.push(["num", "数量"]);
            if (selection.historyPage != api.index.selectionItemIndex.url) lineSetRight.push(["btns", "功能"]);

            $.each(lineSetLeft, function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none').appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            var $li = $('<li></li>').addClass('fl-quo-item col-xs-6').appendTo($row);

            $.each(lineSetRight, function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none').appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            $dhead.append($hname);
            $domain.append($dhead).append($ul);

            return $domain;
        },
        createQuote: function(data) {

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

            var lineSet = [];

            lineSet.push(['name blue', data.itemName + '(' + data.quotationFunctionAreaName + ')']);

            if (selection.historyPage != api.index.selectionItemIndex.url) lineSet.push(['num red', data.num]);

            $.each(lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            var $btnCell = $('<div></div>').addClass('cell btns').css("border", "none");
            var $btnCellWrap = $('<div></div>').addClass('cell-wrap');

            var $btnSelection = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('选材').css('visibility', 'hidden');

            if (data.quotationItemId != null && data.quotationItemId != 0 && [constant.quotation().selectionItem.TYPE_MINUSITEM_INT, constant.quotation().selectionItem.TYPE_MINUSITEM_NORETURN_INT].indexOf(data.type) == -1) {
                $btnSelection.css('visibility', 'visible');
            }

            $btnSelection.click(function(e) {

                selection.nowEditQuote = $quoteItemLi;
                selection.quotationItem = data;
                goods.GoodsPage(data.quotationItemId);
                rtem.quotationRtem($quoteItemLi);
                selection.modals.quotationItemSoodsModal.modal("show");
            });

            $btnCell.append($btnCellWrap.append($btnSelection));

            $quoteItemLi.append($btnCell);

            $rowDiv.append($quoteItemLi).append($selectionItemLi);

            return $rowDiv;
        },
        createSelectionItem: function(data) {

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

            var $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));
            $input.appendTo($selectionItemLi);

            var lineSet = [['name green', data.goods.name], ['num blue', [constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT, constant.quotation().selectionItem.TYPE_MINUSITEM_INT, constant.quotation().selectionItem.TYPE_MINUSITEM_NORETURN_INT].indexOf(data.type) != -1 ? -data.num : data.num]];

            $.each(lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                $cell.append($cellWrap).appendTo($selectionItemLi);
            });

            var $btnCell = $('<div></div>').addClass('cell btns').css("border", "none");
            var $btnCellWrap = $('<div></div>').addClass('cell-wrap');

            var $btnDel = $('<a></a>').attr({
                'href': 'javascript:void(0)'
            }).css({
                'padding-left': '5px'
            }).append('<i class="bigger-125 icon-remove pink"></i>');

            var $btnUpdate = $('<a></a>').addClass(' btn btn-minier btn-pink').html('编辑');

            if (selection.historyPage != api.index.selectionItemIndex.url) {
                $btnCellWrap.append($btnDel);
                $selectionItemLi.append($btnCell.append($btnCellWrap));
            }

            if (selection.historyPage == api.index.selectionItemIndex.url) {
                $selectionItemLi.click(function(e) {
                    selectionItem.getNumCellFocus($selectionItemLi);
                });
            }

            $btnDel.click(function(e) {

                selectionItem.deleteSelectionItem($selectionItemLi, data);
                return false;
            });

            $btnUpdate.click(function(e) {
                selection.nowEditDomain = $selectionItemLi;

                selection.modals.updateSelectionItemModal.modal('show');
            });

            $selectionItemLi.attr('data-siid', data.siid);
            $selectionItemLi.attr('data-bid', data.goods.bid);
            $selectionItemLi.attr('data-category', data.goods.category);
            $selectionItemLi.attr('data-format', data.goods.format);
            $selectionItemLi.attr('data-postprice', data.postprice);
            $selectionItemLi.attr('data-comment', data.comment);

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

    // 选材公式:报价项已选材时,按 报价功能区->模板功能区(版本+名称)->品类(品牌品类名)->规格(商品规格) 匹配公式,
    // 用功能区参数({a}周长{b}面积{c}举架{d}{e}洞面{f}{g}窗面{h}{i}梁,毫米/平方毫米,与报价页口径一致)求值,
    // 结果追加在报价项数量旁(仅展示不落库);基础数据一次拉取(品类粒度),规格仅对命中品类批量查询
    var formula = {

        categoryByArea: {}, // qfaId -> [{fcid, categoryName}]
        formatsByFcid: {}, // fcid -> {format: 公式表达式}

        loadFormulaInfos: function() {

            if (!selection.basicParams['selection.qid']) return;

            com.post(api.quotation.queryFunctionAreaCategoryForQuotation, {
                'quotation.qid': selection.basicParams['selection.qid']
            }, function(res) {

                formula.categoryByArea = {};

                $.each(res.quotationFunctionAreaCategorys || [], function(i, v) {

                    (formula.categoryByArea[v.qfaId] = formula.categoryByArea[v.qfaId] || []).push({
                        fcid: v.fcid,
                        categoryName: v.categoryName
                    });
                });

                formula.refresh();
            }, null, false);
        },

        // 收集当前已选材行命中的品类fcid,缺失规格批量补查(IN)后重绘
        refresh: function() {

            var fcids = [];

            com.focusPage('#selectionBox li.fl-quo-item[data-siid]').each(function() {

                var $li = $(this);
                var ids = ($li.attr('id') || '').split('-');

                if (ids.length != 3 || ids[2] != String(constant.quotation().selectionItem.TYPE_QUOTATION_INT)) return true;

                var category = $li.attr('data-category');

                $.each(formula.categoryByArea[ids[0]] || [], function(i, c) {
                    if (c.categoryName == category && fcids.indexOf(c.fcid) == -1) fcids.push(c.fcid);
                });
            });

            var need = [];

            $.each(fcids, function(i, fcid) {
                if (formula.formatsByFcid[fcid] == undefined) need.push(fcid);
            });

            if (need.length == 0) {
                formula.paintFormulaResults();
                return;
            }

            // 先占位防重复请求,失败时清掉
            $.each(need, function(i, fcid) {
                formula.formatsByFcid[fcid] = {};
            });

            com.post(api.quotation.queryFunctionAreaFormatByFacids, {
                'facids': need.join(',')
            }, function(res) {

                $.each(res.functionAreaFormats || [], function(i, v) {
                    if (v.fcid != null && v.format) formula.formatsByFcid[v.fcid][v.format] = v.formula;
                });

                formula.paintFormulaResults();
            }, function() {

                $.each(need, function(i, fcid) {
                    delete formula.formatsByFcid[fcid];
                });
            }, false);
        },

        paintFormulaResults: function() {

            com.focusPage('#selectionBox .formula-num').remove();

            com.focusPage('#selectionBox li.fl-quo-item[data-siid]').each(function() {

                var $li = $(this);
                var ids = ($li.attr('id') || '').split('-');

                if (ids.length != 3 || ids[2] != String(constant.quotation().selectionItem.TYPE_QUOTATION_INT)) return true;

                var category = $li.attr('data-category');
                var format = $li.attr('data-format');
                var param = selection.areaParams[ids[0]];

                if (!category || !format || !param) return true;

                var expres = null;

                $.each(formula.categoryByArea[ids[0]] || [], function(i, c) {
                    if (c.categoryName == category && formula.formatsByFcid[c.fcid]) {
                        expres = formula.formatsByFcid[c.fcid][format] || expres;
                    }
                });

                if (!expres) return true;

                var result = formula.evalFormula(expres, param);

                if (result == null) return true;

                $li.prev('.fl-quo-item').find('.cell.num .cell-wrap').append(
                    $('<span></span>').addClass('formula-num').css({
                        'padding-left': '4px',
                        'color': '#999'
                    }).text('→' + result));
            });
        },

        evalFormula: function(expres, param) {

            var variables = {
                a: param.girth,
                b: param.area,
                c: param.height,
                d: param.holeLength,
                e: param.holeHeight,
                f: param.windowLength,
                g: param.windowHeight,
                h: param.beamLength,
                i: param.beamHeight
            };

            expres = String(expres == null ? '' : expres);

            $.each(variables, function(key, value) {
                expres = expres.replace(new RegExp('\\{' + key + '\\}', 'g'), value == null ? 0 : value);
            });

            if (/\{[a-zA-Z]+\}/.test(expres)) return null;

            expres = expres.replace(/!\s*\(/g, 'Math.ceil(');

            try {

                var result = new Function('return function(){return ' + expres + '}')()();

                if (typeof result != 'number' || isNaN(result) || !isFinite(result)) return null;

                return utils.changeThrDecimal(result);
            } catch (e) {
                return null;
            }
        }
    };

    return {
        init: function() {

            selection.historyPage = params.historyPage;

            var orderId = params.quotation.orderId;

            selection.orderId = params.quotation.orderId;

            var quotationId = null;
            var selectionItemType = 0;

            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                'quotation.orderId': orderId
            }, function(res) {

                quotationId = res.quotation.qid;
            }, null, false);

            if (!quotationId) {

                com.showAlert(com.warning, "默认报价不存在");

                com.switchPage(selection.historyPage);
                return false;
            }

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": orderId
            }, function(res) {

                com.focusPage('#orderId').text(res.decoration.orderId)
                com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
                com.focusPage('#version').text(res.decoration.version.name);
            });

            com.post(api.quotation.querySelectionByQid, {
                'selection.qid': quotationId
            }, function(queryRes) {

                var res = queryRes.selection;

                if (res.affirmTime < res.sendTime && res.affirmTime != null && res.sendTime != null) {
                    com.focusPage('#isAffirm').text('已变更');
                } else {
                    com.focusPage('#isAffirm').text(constant.quotation().selection.isAffirm.keys[res.isAffirm]);
                }

                com.focusPage('#affirmTime').text(queryRes.selection.affirmTime);

                if (queryRes.selection == null) {

                    com.showConfirm("是否创建选材单", function() {

                        com.post(api.quotation.addSelection, {
                            "selection.qid": quotationId
                        }, function(addRes) {

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

                    selection.orderId = res.selection.orderId;

                    selection.basicParams['selection.sid'] = res.selection.sid;
                    selection.basicParams['selection.qid'] = res.selection.qid;
                    selection.basicParams['selection.status'] = res.selection.status;
                    selection.basicParams['selection.total'] = res.selection.total;
                    selection.basicParams['selection.quotationTotal'] = res.selection.quotationTotal;
                    selection.basicParams['selection.extensionAddTotal'] = res.selection.extensionAddTotal;
                    selection.basicParams['selection.extensionReduceTotal'] = res.selection.extensionReduceTotal;
                    selection.basicParams['selection.addReduceAddTotal'] = res.selection.addReduceAddTotal;
                    selection.basicParams['selection.addReduceMinusTotal'] = res.selection.addReduceMinusTotal;
                    selection.basicParams['selection.affirmTime'] = res.selection.affirmTime;
                    selection.basicParams['selection.sendTime'] = res.selection.sendTime;

                    selectionItem.init();
                    selection.lockSelectionByStatus(res.selection.status);

                    com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {
                        'quotation.qid': selection.basicParams['selection.qid']
                    }, function(res) {

                        if (res.quotationFunctionAreas && res.quotationFunctionAreas.length) {
                            $.each(res.quotationFunctionAreas, function(i, v) {

                                v.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT ? createItem(v, selectionItemType) : null;
                            });
                        }
                    }, null, false);

                    com.post(api.quotation.queryExtensionByOrderId, {
                        'extension.orderId': orderId
                    }, function(res) {

                        if (res.extensions && res.extensions.length) {
                            $.each(res.extensions, function(i, v) {

                                selectionItemType = v.type == constant.quotation().extension.TYPE_ADD_INT ? constant.quotation().selectionItem.TYPE_EXTENSIONADD_INT : constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT;
                                createItem(v, selectionItemType);
                            });
                        }
                    }, null, false);

                    com.post(api.quotation.queryAddReduceByOrderId, {
                        'addReduce.orderId': orderId
                    }, function(res) {

                        if (res.addReduces && res.addReduces.length) {
                            $.each(res.addReduces, function(i, v) {

                                if (v.type == constant.quotation().addreduce.TYPE_ADD_INT) {
                                    selectionItemType = constant.quotation().selectionItem.TYPE_ADDITEM_INT;
                                } else {
                                    selectionItemType = constant.quotation().selectionItem.TYPE_MINUSITEM_INT;
                                }

                                if (v.type == constant.quotation().addreduce.TYPE_ADD_INT && v.paytype == constant.quotation().addreduce.PAYTYPE_COM_INT) {
                                    selectionItemType = constant.quotation().selectionItem.TYPE_ADDITEM_COM_INT;
                                }

                                if (v.type == constant.quotation().addreduce.TYPE_REDUCE_INT && v.paytype == constant.quotation().addreduce.PAYTYPE_NORETURN_INT) {
                                    selectionItemType = constant.quotation().selectionItem.TYPE_MINUSITEM_NORETURN_INT;
                                }

                                createItem(v, selectionItemType);
                            });
                        }
                    }, null, false);

                    createItem({}, constant.quotation().selectionItem.TYPE_ALONE_INT);

                    com.post(api.quotation.querySelectionItem, {
                        'selection.sid': selection.basicParams['selection.sid']
                    }, function(res) {

                        if (res.selectionItems && res.selectionItems.length) {
                            $.each(res.selectionItems, function(i, v) {

                                if ([constant.quotation().selectionItem.TYPE_ADDED_QUOTATION_SHORT, constant.quotation().selectionItem.TYPE_ADDED_EXTENSIONADD_INT, constant.quotation().selectionItem.TYPE_ADDED_EXTENSIONMINUS_INT, constant.quotation().selectionItem.TYPE_ADDED_ADDITEM_INT, constant.quotation().selectionItem.TYPE_ADDED_MINUSITEM_INT].indexOf(v.type) != -1)
                                    return true;

                                var price = utils.accMul(v.postprice, v.num);
                                var $selectionItemLi = painter.createSelectionItem(v).attr('data-price', price);
                                var $functionArea = $selectionItemLi.parents('.widget-box');

                                $functionArea.attr('data-total', utils.accAdd($functionArea.attr('data-total'), price));

                                painter.updateHeight($selectionItemLi);
                            });
                        }
                    }, null, false);

                    selection.init();

                    formula.loadFormulaInfos();
                }
            }

            function createItem(functionArea, type) {

                var selectionBox = selection.selectionBox;

                var subtypes = [0, 1];
                var name = type == constant.quotation().selectionItem.TYPE_QUOTATION_INT ? functionArea.functionAreaName : type == constant.quotation().selectionItem.TYPE_ALONE_INT ? "未匹配" : selectionItem.type[type];

                var $domain = painter.createFunctionArea(name, type);
                var $ul = $('<ul></ul>').addClass('fl-quo-list list');

                if (type === constant.quotation().selectionItem.TYPE_QUOTATION_INT) {

                    selection.areaParams[functionArea.qfaId] = functionArea.quotationFunctionAreaParam;

                    $.each(functionArea.quotationFunctionAreaItems, function(i, v) {

                        if (!subtypes.includes(v.subtype)) {
                            var data = dataProcessing(v, functionArea, type, functionArea.functionAreaName);
                            var $quoteItem = painter.createQuote(data);
                            $ul.append($quoteItem);
                        }
                    });
                } else if (type === constant.quotation().selectionItem.TYPE_EXTENSIONADD_INT || type === constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT) {
                    com.post(api.quotation.queryExtensionItemByEid, {
                        'extensionItem.eid': functionArea.eid
                    }, function(res) {

                        $.each(res.extensionItems, function(i, v) {

                            if (!subtypes.includes(v.subtype)) {
                                var data = dataProcessing(v, functionArea, type, null);
                                var $quoteItem = painter.createQuote(data);
                                $ul.append($quoteItem);
                            }
                        });
                    }, null, false);
                } else if ([constant.quotation().selectionItem.TYPE_ADDITEM_INT, constant.quotation().selectionItem.TYPE_MINUSITEM_INT, constant.quotation().selectionItem.TYPE_ADDITEM_COM_INT, constant.quotation().selectionItem.TYPE_MINUSITEM_NORETURN_INT].indexOf(type) != -1) {
                    com.post(api.quotation.queryAddReduceItemByAddReduceId, {
                        'addReduce.arId': functionArea.arId
                    }, function(res) {

                        $.each(res.addReduceItems, function(i, v) {

                            if (!subtypes.includes(v.subtype)) {
                                var data = dataProcessing(v, functionArea, type, null);
                                var $quoteItem = painter.createQuote(data);
                                $ul.append($quoteItem);
                            }
                        });
                    }, null, false);
                }

                selectionBox.append($domain.append($ul));
            }

            /**
             * 该方法用于处理数据, 返回新的数据作为 painter.createQuote()方法的参数
             * 
             * @param rawData 源数据
             * @param functionArea 当前项目的功能区
             * @param type 选材项的类型
             * @param functionAreaName 功能区名
             * @returns {*} 新数据
             */
            function dataProcessing(rawData, functionArea, type, functionAreaName) {

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
                    preprice = functionArea.type == constant.quotation().selectionItem.TYPE_QUOTATION_INT ? rawData.addPrice : rawData.subPrice;

                    data = {
                        "areaId": rawData.eid,
                        "quoteId": rawData.eiid,
                        "quotationItemId": rawData.qiid,
                        "itemName": rawData.itemName,
                        "type": type,
                        "num": rawData.num,
                        "quotationFunctionAreaName": rawData.quotationFunctionAreaName,
                        "preprice": rawData.unitPrice,
                    }
                } else if ([constant.quotation().selectionItem.TYPE_ADDITEM_INT, constant.quotation().selectionItem.TYPE_MINUSITEM_INT, constant.quotation().selectionItem.TYPE_ADDITEM_COM_INT, constant.quotation().selectionItem.TYPE_MINUSITEM_NORETURN_INT].indexOf(type) != -1) {

                    if (functionArea.type == constant.quotation().selectionItem.TYPE_QUOTATION_INT) {
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
                        "preprice": rawData.unitPrice,
                    }
                }

                return data;
            }

            if (selection.historyPage != api.index.selectionItemIndex.url) {
                com.focusPage('#saveMaterialBtn').show();
                com.focusPage('#saveConfigBtn').show();
                com.focusPage('#sendSelectionBtn').show();
                com.focusPage('#QRCodeBtn').show();
            }
        }
    }
})();

$(function() {

    selectionDetail.init();
});