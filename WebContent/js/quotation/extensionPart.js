var ExtensionDetail = (function() {

    var extensionDetail = {

        orderId: null, // 装修单号
        versionId: null, // 报价版本
        discount: 10,
        manageDiscount: 0,
        quoManageRate: 0,
        quoManagePrice: 0,
        quotaxRate: 0,
        quotaxPrice: 0,
        quotation: null,

        quotationItemId: null,

        qid: null, // 订单的默认报价编号
        eid: null, // 扩展项编号

        basicParams: {
            "extension.eid": null,
            "extension.orderId": null,
            "extension.undisPrice": 0,
            "extension.disPrice": 0,
            "extension.manageRate": 0,
            "extension.managePrice": 0,
            "extension.manageDiscount": 0,
            "extension.taxRate": 0,
            "extension.taxPrice": 0,
            "extension.total": 0,

            "extensionItem.eid": null,
        },

        sumLabType: com.focusPage("#sumLabType"),
        undisPrice: com.focusPage("#undisPrice"),
        disPrice: com.focusPage("#disPrice"),
        discounts: com.focusPage("#discount"),
        sumLabSumMoney: com.focusPage("#sumLabSumMoney"),
        manageRate: com.focusPage("#manageRate"),
        managePrice: com.focusPage("#managePrice"),
        taxRate: com.focusPage("#taxRate"),
        taxPrice: com.focusPage("#taxPrice"),

        isCountManage: com.focusPage("#isCountManage"),
        isCountManageDiscount: com.focusPage("#isCountManageDiscount"),
        isCountTax: com.focusPage("#isCountTax"),

        $modals: {},
        $btnItems: {},

        initModals: function() {

            var that = this;
            that.$modals = {

                // 标准报价项弹窗
                addNormalItemModal: com.focusPage('#addNormalItemModal').on("show.bs.modal", function(a) {

                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),

                addQuotaionItemModal: com.focusPage('#addQuotaionItemModal').on("show.bs.modal", function(a) {

                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),

                // 自定义添加
                addItemModal: com.focusPage("#addItemModal").on("show.bs.modal", function() {

                    com.focusPage("#itemName").val("");
                    com.focusPage("#quotationItemDes").val("");
                    com.focusPage("#unitPrice").val("");
                    com.focusPage("#num").val("");
                    com.focusPage("#measurementUnit").get(0).selectedIndex = 0;
                    com.focusPage("#workType").get(0).selectedIndex = 0;
                }),

                // 功能区选择弹层
                functionAreaModal: com.focusPage("#functionAreaModal")
            };

            // 标准报价项弹出层
            var extraParams = {
                "quotationItem.version.no": extensionDetail.versionId,
                "quotationPrice.updateTime": com.currentTime()
            };

            var _condArrn = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'quotation-worktype'];
            var normalItemSeacher = new Searcher();
            normalItemSeacher.init(_condArrn, "condListn", api.quotation.pageQuotationItemForPrice, function(data) {

                var $tableWrap = com.focusPage('#resultListn').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if (data && data.length) {
                    $.each(data, function(i, v) {

                        v.measurementUnit = v.unit.name;
                        v.workType = v.workType.name;
                        v.quotationItemDes = v.comment;
                        painter.createDataItemModal(v, "qiid", "name").appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);
                }
            }, "pagenationn", "addNormalItemModalPostDatan", extraParams);

            // 初始化自定义报价中的类型
            com.post(api.quotation.queryQuotationType, {}, function(res) {

                com.focusPage("#quotationType").bindData(res.quotationTypes, "id", "name");
            });

            // 新增报价项select初始化
            // 单位

            com.post(api.common.queryMeasurementUnit, {}, function(res) {

                com.focusPage("#measurementUnit").bindData(res.measurementUnits, "name", "name");
            });

            // 工种
            com.post(api.common.queryWorkType, {}, function(res) {

                com.focusPage("#workType").bindData(res.workTypes, "name", "name");
            });

            // 功能区选择弹出层
            if (that.qid == null) {
                com.showAlert(com.error, "该订单没有默认报价");
                return false;
            }

            com.post(api.quotation.queryQuotationFunctionAreaForCommonByQuotationId, {
                "quotation.qid": that.qid
            }, function(res) {

                com.focusPage("#addQuotationFunctionAreaId").bindData(res.quotationFunctionAreas, "qfaId", "functionAreaName");
                com.focusPage("#quotationFunctionAreaId").bindData(res.quotationFunctionAreas, "qfaId", "functionAreaName");
            });
        },
        initBtnItems: function() {

            var that = this;

            that.$btnItems = {

                // 选择标准报价项按钮点击(增项)
                addNormalItemBtn: com.focusPage('#addNormalItemBtn').on('click', function() {

                    modalEventBinding.showingModalName = "addNormalItemModal";

                    extensionDetail.quotationItemId = null;
                    quote.quotesRecord = [];

                    that.$modals.functionAreaModal.modal("show");
                }),

                // 选择标准报价项按钮点击(增项)
                addQuotaionItemBtn: com.focusPage('#addQuotaionItemBtn').on('click', function() {

                    modalEventBinding.showingModalName = "addQuotaionItemModal";

                    extensionDetail.quotationItemId = null;
                    quote.quotesRecord = [];

                    that.$modals.functionAreaModal.modal("show");
                }),

                // 新增(增项)
                addNewItemBtn: com.focusPage('#addNewItemBtn').on('click', function(event) {

                    event.stopPropagation();
                    com.clearValidator();
                    that.$modals.addItemModal.modal("show");
                }),

                submitAddReduceDetailOKBtn: com.focusPage('#submitAddReduceDetailOKBtn').on('click', function(event) {

                    com.post(api.quotation.updateExtensionForAdvance, extensionDetail.basicParams, function() {

                        com.showAlert(com.info, '提交成功');
                    }, null, false);

                }),

                // 保存
                detailBckBtn: com.focusPage('#detailBckBtn').on('click', function() {// 返回

                    com.switchPage(api.index.extensionIndex.url);
                }),
            };
        },
        init: function() {

            this.initModals();
            this.initBtnItems();
        }
    }

    var arCalculator = {

        total: 0, // 总金额
        changeQuoFee: function($quote) {

            var _unitPrice = parseFloat($quote.find('.unitprice .cell-wrap').text());
            var _num = parseFloat($quote.find('.num .cell-wrap').text());

            var _total = utils.changeThrDecimal(utils.accMul(_unitPrice, _num));

            $quote.find('.totalprice-discount .cell-wrap').text(_total);
            $quote.attr('data-totalprice', _total);
        },
        calculateArFees: function() {

            var $arr = $('.fl-quo-item:not([data-del-flag="1"])', '#addReduceItemDiv');
            var undisPrice = 0, disPrice = 0, total = 0, managePrice = 0, managediscount = 0, taxPrice = 0, taxdiscount = 0;

            if ($arr.length) {
                $arr.each(function(i, e) {

                    var $this = $(e);

                    var _unitPrice = parseFloat($this.find('.unitprice .cell-wrap').text());
                    var _num = parseFloat($this.find('.num .cell-wrap').text());

                    var _discount = parseInt($this.find(".discountprice").attr("data-discount"));

                    var _total = utils.accMul(_unitPrice, _num);

                    undisPrice = utils.accAdd(undisPrice, _discount == constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT ? _total : 0);
                    disPrice = utils.accAdd(disPrice, _discount == constant.quotation().extensionItem.DISCOUMNT_DISCOUMNT_INT ? _total : 0);

                    total = utils.accAdd(total, utils.accMul(_discount == constant.quotation().extensionItem.DISCOUMNT_DISCOUMNT_INT ? extensionDetail.discount : 1, _total));
                });
            }

            undisPrice = utils.changeThrDecimal(undisPrice);
            disPrice = utils.changeThrDecimal(disPrice);

            if (extensionDetail.isCountManage.prop("checked")) {
                managePrice = utils.changeTwoDecimal(utils.accMul(total, extensionDetail.quoManageRate));
            } else {
                managePrice = 0;
            }
            
            if(extensionDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT){
                taxPrice = utils.changeThrDecimal(utils.accMul(total, extensionDetail.quoTaxRate));
            }

            if(extensionDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT){
                taxPrice = utils.changeThrDecimal(utils.accMul(utils.accAdd(total, managePrice), extensionDetail.quoTaxRate));
            }
            
            if (extensionDetail.isCountTax.prop("checked")) {
                taxPrice = taxPrice;
            } else {
                total = utils.changeThrDecimal(total);
                taxPrice = 0;
            }

            if (extensionDetail.isCountManageDiscount.prop("checked")) {
                managediscount = utils.changeTwoDecimal(utils.accMul(extensionDetail.discount, managePrice));
                taxdiscount = extensionDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? utils.changeTwoDecimal(utils.accMul(extensionDetail.discount, taxPrice)) : taxPrice;
            } else {
                managediscount = managePrice;
                taxdiscount = taxPrice;
            }
            
            total = utils.changeThrDecimal(utils.accAdd(total, utils.accAdd(managediscount, taxdiscount)));

            extensionDetail.undisPrice.text(undisPrice);
            extensionDetail.disPrice.text(disPrice);
            extensionDetail.sumLabSumMoney.text(total);
            extensionDetail.managePrice.text(managediscount);
            extensionDetail.taxPrice.text(taxdiscount);

            extensionDetail.basicParams['extension.undisPrice'] = undisPrice;
            extensionDetail.basicParams['extension.disPrice'] = disPrice;
            extensionDetail.basicParams['extension.total'] = total;
            extensionDetail.basicParams['extension.managePrice'] = managePrice;
            extensionDetail.basicParams['extension.manageDiscount'] = extensionDetail.isCountManageDiscount.prop("checked") ? constant.quotation().extension.MANAGEDISCOUNT_DISCOUNT_INT : constant.quotation().extension.MANAGEDISCOUNT_NODISCOUNT_INT;
            extensionDetail.basicParams['extension.taxPrice'] = taxPrice;
        }
    }

    // 弹层确定按钮事件绑定
    var modalEventBinding = {

        functionAreaId: null,
        functionAreaName: null,

        // 功能区选择弹层确认按钮
        functionAreaModalConfirm: function() {

            var that = this;
            com.focusPage('#confirmItemBtn').off().on('click', function() {

                if (com.validate("functionAreaModal"))
                    return false;

                var funcid = com.focusPage('#quotationFunctionAreaId').val();
                that.functionAreaId = funcid;
                that.functionAreaName = com.focusPage('#quotationFunctionAreaId').find('option:selected').text();

                if (that.showingModalName == "addQuotaionItemModal") {

                    var _params = {
                        "quotationFunctionAreaItem.quotationFunctionAreaId": funcid
                    };
                    com.post(api.quotation.queryQuotationFunctionAreaItemByQuotationFunctionAreaId, _params, function(res) {

                        var $tableWrap = com.focusPage('#quateList', extensionDetail.$modals.quotationItemModal).empty();
                        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                        if (res.quotationFunctionAreaItems && res.quotationFunctionAreaItems.length) {
                            $.each(res.quotationFunctionAreaItems, function(i, v) {

                                v.quotationItemDes = v.content;
                                v.type = constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT;
                                painter.createQuoteItemModal(v, "qfaiId", "itemName").appendTo($ul);
                            });
                            $ul.appendTo($tableWrap);
                        }
                    }, null, false);
                }

                extensionDetail.$modals.functionAreaModal.modal('hide');
                extensionDetail.$modals[that.showingModalName].modal("show");

            });
        },
        /**
         * 0: 数据报价项(增项) , 1: 自定义(增项) , 2: 数据报价项(减项) , 3: 自定义(减项) , 4: 报价中项(减项) 标准报价项确认按钮点击
         */
        addNormalItemModalConfirm: function() {

            com.focusPage('#saveaddNormalItemBtn').off().on('click', function() {

                quote.addQuotesFromModal(extensionDetail.type == constant.quotation().extension.TYPE_ADD_INT ? constant.quotation().extensionItem.TYPE_QUOTATIONADD_INT : constant.quotation().extensionItem.TYPE_QUOTATIONSUB_INT);

                extensionDetail.$modals.addNormalItemModal.modal('hide');

                extensionDetail.quotationItemId = null;
            });
        },
        // 自定义报价项确认按钮点击
        addItemModalConfirm: function() {

            com.focusPage("#saveAddItemBtn").on('click', function(event) {

                if (com.validate("addItemModal"))
                    return false;

                var addRow = {
                    "num": com.focusPage("#num").val(),// 工程预算量
                    "itemName": com.focusPage("#itemName").val(),// 名称
                    "quotationFunctionAreaId": com.focusPage("#quotationFunctionAreaId").val(),// 功能区
                    "quotationFunctionAreaName": com.focusPage("#addQuotationFunctionAreaId").find('option:selected').text(),
                    "measurementUnit": com.focusPage("#measurementUnit").val(),// 单位
                    "unitPrice": com.focusPage("#unitPrice").val(),// 单价(折后单价、总价为计算值)
                    "workType": com.focusPage("#workType").val(),// 工种
                    "content": com.focusPage("#quotationItemDes").val(),// 工艺说明
                    "subtype": com.focusPage("#quotationType").val(),
                    "type": extensionDetail.type == constant.quotation().extensionItem.TYPE_QUOTATIONADD_INT ? constant.quotation().extensionItem.TYPE_CUTOMADD_INT : constant.quotation().extensionItem.TYPE_CUTOMSUB_INT,// 类型(隐藏属性)
                    "discount": constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT
                };

                var args = {
                    "extensionItem.itemName": addRow.itemName, // 项目名
                    "extensionItem.measurementUnit": addRow.measurementUnit, // 单位
                    "extensionItem.workType": addRow.workType, // 工种
                    "extensionItem.addPrice": addRow.unitPrice, // 增补价
                    "extensionItem.unitPrice": addRow.unitPrice, // 单价
                    "extensionItem.subPrice": addRow.unitPrice, // 退减价
                    "extensionItem.subtype": addRow.subtype, // 类型
                    "extensionItem.type": addRow.type,
                    "extensionItem.num": addRow.num, // 工程量 ;
                    "extensionItem.quotationFunctionAreaId": addRow.quotationFunctionAreaId, // 所属功能区Id ;
                    "extensionItem.quotationFunctionAreaName": com.focusPage("#quotationFunctionAreaId").find('option:selected').text(),// 所属功能区name ;
                    "extensionItem.content": addRow.content,
                    "quotationFunctionAreaItem.content": addRow.content
                };
                var _index = $('.fl-quo-item', '#addReduceItemDiv').length;
                var $item = painter.createQuote(_index + 1, addRow).appendTo(com.focusPage('#addReduceItemDiv > ul'));

                arCalculator.changeQuoFee($item);
                arCalculator.calculateArFees();

                var _params = $.extend(true, {}, extensionDetail.basicParams, args);

                com.post(api.quotation.updateExtensionItem, _params, function(res) {

                    $item.find('input[name="eiid"]').val(res.extensionItem.eiid);
                }, null, false);

                extensionDetail.$modals.addItemModal.modal("hide");
            });

        },

        changeTotalIsCountIn: function() {

            extensionDetail.isCountManage.on("click", function(e) {

                arCalculator.calculateArFees();

                var options = $.extend({}, extensionDetail.basicParams);

                if (!extensionDetail.isCountManage.prop("checked")) {
                    options["extension.manageRate"] = 0;
                    options["extension.managePrice"] = 0;
                }

                com.post(api.quotation.updateExtensionForAdvance, options, function() {

                }, null, false);
            });

            extensionDetail.isCountTax.on("click", function(e) {

                arCalculator.calculateArFees();

                var options = $.extend({}, extensionDetail.basicParams);

                if (!extensionDetail.isCountTax.prop("checked")) {
                    options["extension.taxRate"] = 0;
                    options["extension.taxPrice"] = 0;
                }

                com.post(api.quotation.updateExtensionForAdvance, options, function() {

                }, null, false);
            });
        },
        changeTotalIsCountInDiscount: function() {

            extensionDetail.isCountManageDiscount.on("click", function(res) {

                arCalculator.calculateArFees();

                var options = $.extend({}, extensionDetail.basicParams);

                com.post(api.quotation.updateExtensionForAdvance, options, function() {

                }, null, false);
            });
        },

        init: function() {

            this.functionAreaModalConfirm();
            this.addNormalItemModalConfirm();
            this.addItemModalConfirm();
            this.changeTotalIsCountIn();
            this.changeTotalIsCountInDiscount();
        }
    }

    // 报价项操作
    var quote = {

        quotesRecord: [],
        $nowLine: null,
        $nowEditInput: null,
        /**
         * 排序报价项
         */
        sortQuote: function() {

            var $arr = com.focusPage('.fl-quo-item', '#addReduceItemDiv');
            if (!$arr) {
                return false;
            }
            $arr.each(function() {

                $this = $(this);
                $this.find('.line .cell-wrap').text($this.index() + 1);
            });
        },
        /**
         * 添加报价项的时候记住上一页选中的报价项 参数 $input : 正在操作的input标签 ischecked : 选举中或取消选中
         */
        recordQuots: function($input, ischecked) {

            var that = this;
            if (ischecked) {
                that.quotesRecord[that.quotesRecord.length] = $input;// 据说这样比push快
            } else {
                that.quotesRecord = $.map(that.quotesRecord, function(v) {

                    return v.val() != $input.val() ? v : null;
                });
            }
        },
        /**
         * 添加弹窗中的报价项到扩展项报价项区域
         */
        addQuotesFromModal: function(type) {

            var that = this;
            var $arwrap = com.focusPage('#addReduceItemDiv');
            var _arrs = that.quotesRecord;
            var _index = $arwrap.find('.fl-quo-item').length;

            if (!_arrs.length) {
                return false;
            }

            if (extensionDetail.quotationItemId != null) {
                type = extensionDetail.type == constant.quotation().extension.TYPE_ADD_INT ? constant.quotation().extensionItem.TYPE_QUOTATIONINADD_INT : constant.quotation().extensionItem.TYPE_QUOTATIONINSUB_INT;
            }

            $.each(_arrs, function(i, v) {

                var $this = $(v);
                var $li = $this.parents('.fl-table-list > li');

                if ($this.val() && com.focusPage('input[data-qiid="' + $this.val() + '"]', '#addReduceItemDiv').length) {
                    return false;
                }

                var atttype = extensionDetail.basicParams["extension.atttype"];

                var addPrice = parseFloat($li.find("li .addPrice").text() ? $li.find("li .addPrice").text() : 0);
                var unitPrice = parseFloat($li.find("li .unitPrice").text() ? $li.find("li .unitPrice").text() : 0);
                var subPrice = parseFloat($li.find("li .subPrice").text() ? $li.find("li .subPrice").text() : 0);
                var achePrice = parseFloat($li.find("li .achePrice").text() ? $li.find("li .achePrice").text() : 0);

                var discount = $this.attr('data-discount-flag');

                if (extensionDetail.type == constant.quotation().extension.TYPE_ADD_INT) { // 增项,增补价
                    unitPrice = addPrice;
                    discount = constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT;
                }

                if (extensionDetail.type == constant.quotation().extension.TYPE_ADD_INT && atttype == constant.quotation().extension.ATTTYPE_CURRENCY_INT) {
                    subPrice = addPrice;
                }

                if (extensionDetail.type == constant.quotation().extension.TYPE_SUB_INT) { // 减项,退减价
                    unitPrice = subPrice;
                    discount = constant.quotation().extensionItem.DISCOUMNT_DISCOUMNT_INT;
                }

                if (atttype == constant.quotation().extension.ATTTYPE_DISPLACE_INT) {
                    unitPrice = achePrice;
                }

                var _quotval = {
                    "num": 0,// 工程预算量
                    "itemName": $li.find('.lbl').text(),// 名称
                    "quotationFunctionAreaId": modalEventBinding.functionAreaId,// 功能区
                    "quotationFunctionAreaName": modalEventBinding.functionAreaName,// 功能区
                    "quotationBigCategory": $li.find("li .quotationBigCategory").text(),// 大类
                    "measurementUnit": $li.find("li .measurementUnit").text(),// 单位
                    "addPrice": addPrice,
                    "unitPrice": unitPrice,
                    "subPrice": subPrice,
                    "content": $li.find("li .quotationItemDes").text(),// 工艺说明
                    "workType": $li.find("li .workType").text(),// 工种
                    "type": type,// 类型(隐藏属性)
                    "subtype": $this.attr("data-quotationType"),
                    "eid": "",// 扩展项中报价项的id
                    "quoteItemId": $this.val(),// id(隐藏属性)
                    "discount": discount,
                    "quotationitemid": extensionDetail.quotationItemId,
                    "qiid": $this.val()
                };
                var $item = painter.createQuote(_index + i + 1, _quotval);
                $item.appendTo($arwrap.find('.fl-quo-list'));
            });
            quote.quotesRecord = [];
        },
        /**
         * 选中报价项显示编辑input
         * 
         * @param $line
         */
        getNumCellFocus: function($line) {

            var that = this;
            var $numCell = $line.find('.cell.num');
            var $arwrap = com.focusPage('#addReduceItemDiv');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $arwrap.find('.fl-quo-input');

            com.focusPage('.fl-quo-item.current').removeClass('current');
            $line.addClass('current');
            $editInput.removeClass('hide').appendTo($numCell).find('input').val(null).focus();
            that.$nowLine = $line;
            that.$nowEditInput = $editInput;
            that.$nowEditInput.find('input').off('keydown').on("keydown", function(e) {

                var $input = $(this);
                that.bindInputKeydown($input.val(), e);
            });
        },
        bindInputKeydown: function(num, e) {

            var that = this;
            var $line = null;

            if (e.keyCode == 13) {

                if (com.validate("addReduceItemDiv")) {
                    return false;
                }

                var oldmum = that.$nowLine.find('.cell.num .cell-wrap').text() ? that.$nowLine.find('.cell.num .cell-wrap').text() : '0';

                that.$nowLine.find('.cell.num .cell-wrap').text(num);
                $line = that.$nowLine.next('.fl-quo-item');

                var _type = that.$nowLine.find('.typedict').attr('data-type');

                var args = {
                    "extensionItem.eiid": that.$nowLine.find('input[name="eiid"]').val(),// 扩展项报价项Id , 新建无此参数;
                    "extensionItem.itemName": that.$nowLine.find('.name .cell-wrap').text(),// 项目名;
                    "extensionItem.measurementUnit": that.$nowLine.find('.unit .cell-wrap').text(),// 单位 ;
                    "extensionItem.workType": that.$nowLine.find('.worktype .cell-wrap').text(),// 工种 ;
                    "extensionItem.addPrice": that.$nowLine.attr('data-addPrice'), // 单价
                    "extensionItem.unitPrice": that.$nowLine.find('.unitprice .cell-wrap').text(),// 单价
                    "extensionItem.subPrice": that.$nowLine.attr('data-subPrice'), // 单价
                    "extensionItem.type": _type,// 类型
                    "extensionItem.subtype": that.$nowLine.find('.subtypedict').attr('data-subtype'),
                    "extensionItem.num": that.$nowLine.find('.num .cell-wrap').text(),// 工程量 ;
                    "extensionItem.quotationFunctionAreaId": that.$nowLine.find('.quotationFunctionArea').attr('data-quotationfunctionareaid'), // 所属功能区Id ;
                    "extensionItem.discount": that.$nowLine.find('.discountprice').attr('data-discount'),// 折扣
                    "extensionItem.qiid": that.$nowLine.attr('data-qiid')

                };

                if (_type == constant.quotation().extensionItem.TYPE_QUOTATIONADD_INT || _type == constant.quotation().extensionItem.TYPE_QUOTATIONSUB_INT) {
                    args["extensionItem.quoteItemId"] = that.$nowLine.find('input[name="eiid"]').attr('data-quoteitemid');// , 报价项Id , 标准类型报价项需要传递 "data-qiid"
                }
                if (_type == constant.quotation().extensionItem.TYPE_CUTOMADD_INT || _type == constant.quotation().extensionItem.TYPE_CUTOMSUB_INT) {
                    args["extensionItem.content"] = that.$nowLine.prop('title');// , 报价项说明 , 自定义类型报价项需要传递 ;
                }
                if (_type == constant.quotation().extensionItem.TYPE_QUOTATIONINSUB_INT || _type == constant.quotation().extensionItem.TYPE_QUOTATIONINADD_INT) {
                    args["extensionItem.quoteItemId"] = that.$nowLine.find('input[name="eiid"]').attr("data-quotationItemId");
                }

                arCalculator.changeQuoFee(that.$nowLine);
                arCalculator.calculateArFees();

                com.clearValidator();

                var _params = $.extend(true, {}, extensionDetail.basicParams, args);
                com.post(api.quotation.updateExtensionItem, _params, function(res) {

                    that.$nowLine.find('input[name="eiid"]').val(res.extensionItem.eiid);
                    that.$nowLine.attr("data-eiid", res.extensionItem.eiid);

                    if ($line.length) {
                        that.getNumCellFocus($line);
                    } else {
                        that.hideInputWrap();
                    }
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);
                    that.$nowLine.find('.cell.num .cell-wrap').text(oldmum);

                    arCalculator.changeQuoFee(that.$nowLine);
                    arCalculator.calculateArFees();

                    that.hideInputWrap();
                }, false);
                return false;
            }

            if (e.keyCode == 38) {
                $line = that.$nowLine.prev('.fl-quo-item');
                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }
                return false;
            }

            if (e.keyCode == 40) {
                $line = that.$nowLine.next('.fl-quo-item');
                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }
                return false;
            }
        },
        hideInputWrap: function() {

            if (!this.$nowEditInput) {
                return false;
            }
            this.$nowEditInput.addClass('hide');
            this.$nowEditInput = null;
        },
        /**
         * 点击页面其他位置时清除表格行的选中样式
         */
        clearQuoteSelected: function() {

            var that = this;
            $('body').click(function(e) {

                if (!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')) {
                    that.hideInputWrap();
                }
            });
        },
        /**
         * 删除报价项
         * 
         * @param $quote
         */
        deleteQuote: function($quote) {

            var that = this;

            var _qid = $quote.attr("data-eiid");
            var $rqwrap = com.focusPage('#addReduceItemDiv');
            $rqwrap.find('.fl-quo-input').insertAfter($rqwrap.find('.fl-quo-list')).addClass('hide');

            var _params = {};

            if (!_qid) {
                $quote.remove();
            } else {
                $quote.attr('data-del-flag', 1);
                that.sortQuote();

                arCalculator.calculateArFees();

                var options = {
                    "extensionItem.eiid": _qid
                };

                com.post(api.quotation.deleteExtensionItem, $.extend({}, options, extensionDetail.basicParams), function(res) {

                    $quote.remove();
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);
                    $quote.removeAttr('data-del-flag');

                    arCalculator.calculateArFees();
                }, false);
            }
        },
        init: function() {

            this.clearQuoteSelected();
        }
    }

    var painter = {
        /**
         * 创建添加数据中报价项弹窗中的报价项
         * 
         * @param v
         * @param id
         * @param name
         * @returns
         */
        createDataItemModal: function(v, id, name) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({
                "margin-bottom": 0
            });

            var qiid = v.qiid;
            var name = v.name;

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "modalQuots",
                "class": "ace ace-checkbox-2",
                "data-discount-flag": v.discount,
                "data-quotationType": (v.category && v.category.id) ? v.category.id : v.subtype,
                "data-subtype": v.subtype,
                "data-quotationItemId": v.quotationItemId,
                "data-id": qiid
            // 功能区
            }).val(qiid);

            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(name);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [];
            propertyArr.push(["编号:", v.itemId, "grey"]);
            propertyArr.push(["大类:", v.quotationBigCategory, "grey quotationBigCategory"]);
            propertyArr.push(["单位:", v.measurementUnit, "grey measurementUnit"]);
            propertyArr.push(["工种:", v.workType, "red workType"]);
            propertyArr.push(["单价:", v.addPrice, "blue addPrice", extensionDetail.basicParams["extension.type"] == constant.quotation().extension.TYPE_ADD_INT && extensionDetail.basicParams["extension.atttype"] == constant.quotation().extension.ATTTYPE_CURRENCY_INT ? "show" : "hide"]);
            propertyArr.push(["单价:", v.unitPrice, "blue unitPrice", "hide"]);
            propertyArr.push(["单价:", v.subPrice, "blue subPrice", extensionDetail.basicParams["extension.type"] == constant.quotation().extension.TYPE_SUB_INT && extensionDetail.basicParams["extension.atttype"] == constant.quotation().extension.ATTTYPE_CURRENCY_INT ? "show" : "hide"]);
            propertyArr.push(["单价:", v.achePrice, "blue achePrice", extensionDetail.basicParams["extension.atttype"] == constant.quotation().extension.ATTTYPE_DISPLACE_INT ? "show" : "hide"]);
            propertyArr.push(["工程量:", v.num, "blue"]);
            propertyArr.push(["是否打折:", constant.quotation().extensionItem.discount.keys[v.discount], "red"]);
            propertyArr.push(["说明:", v.quotationItemDes, "grey quotationItemDes"]);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');

                if (value[1]) {
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                    $liProperty.appendTo($ulProperty);
                }

                if (value[3]) {
                    $liProperty.addClass(value[3]);
                }
            });

            $label.append($input).append($span).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $input.change(function() {

                var $this = $(this);

                quote.recordQuots($this, $(this).is(':checked'));
            });

            return $liLine;
        },
        /**
         * 创建添加报价中报价项弹窗中的报价项
         * 
         * @param v
         * @param id
         * @param name
         * @returns
         */
        createQuoteItemModal: function(v, id, name) {

            var qfaiId = v.qfaiId;
            var name = v.itemName;

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({
                "margin-bottom": 0
            });

            var $btnDiv = $('<div></div>').addClass('pull-right action-buttons').appendTo($h3);

            var $btnSelect = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('选择').appendTo($btnDiv);

            var $label = $('<label></label>');
            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.itemName);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [];
            propertyArr.push(["编号:", v.itemId, "grey"]);
            propertyArr.push(["大类:", v.quotationBigCategory, "grey quotationBigCategory"]);
            propertyArr.push(["单位:", v.measurementUnit, "grey measurementUnit"]);
            propertyArr.push(["工种:", v.workType, "red workType"]);
            propertyArr.push(["单价:", v.addPrice, "blue addPrice", extensionDetail.basicParams["extension.type"] != constant.quotation().extension.TYPE_ADD_INT ? "hide" : "show"]);
            propertyArr.push(["单价:", v.unitPrice, "blue unitPrice", "hide"]);
            propertyArr.push(["单价:", v.subPrice, "blue subPrice", extensionDetail.basicParams["extension.type"] != constant.quotation().extension.TYPE_SUB_INT ? "hide" : "show"]);
            propertyArr.push(["工程量:", v.num, "blue"]);
            propertyArr.push(["是否打折:", constant.quotation().extensionItem.discount.keys[v.discount], "red"]);
            propertyArr.push(["说明:", v.quotationItemDes, "grey quotationItemDes"]);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');

                if (value[1]) {
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                    $liProperty.appendTo($ulProperty);
                }

                if (value[3]) {
                    $liProperty.addClass(value[3]);
                }
            });

            $label.append($span).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnSelect.click(function() {

                extensionDetail.$modals.addQuotaionItemModal.modal('hide');

                extensionDetail.quotationItemId = v.qfaiId;

                extensionDetail.$modals.addNormalItemModal.modal('show');
            });

            return $liLine;
        },

        /**
         * 创建报价项
         * 
         * @param linenum
         * @param qv
         * @returns
         */
        createQuote: function(linenum, qv) {

            var typeDict = {
                "0": "标",
                "1": "自",
                "2": "标",
                "3": "自",
                "4": "报",
                "5": "报"
            };

            var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content);

            var total = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));

            var _class = qv.discount != constant.data().quotationItem.DISCOUNT_DISCOUNT_INT ? "blue" : "green";

            var $badgeInfo = "<span class='badge badge-info'>" + typeDict[qv.type] + "</span>";

            var _lineSet = [//
            ["line", linenum], // 索引
            ["num subtypedict", qv.num, ['data-subtype', qv.subtype]],// 工程预算量
            ["name " + _class, qv.itemName],// 名称
            ["type typedict", $badgeInfo, ['data-type', qv.type]],// 类型
            ["worktype", qv.workType],// 工种
            ["type quotationFunctionArea", qv.quotationFunctionAreaName ? qv.quotationFunctionAreaName : "---", ["data-quotationFunctionAreaId", qv.quotationFunctionAreaId]],// 功能区
            ["unit", qv.measurementUnit],// 单位
            ["price unitprice", qv.unitPrice],// 单价
            ["price discountprice", qv.unitPrice, ["data-discount", qv.discount]],// 折后单价
            ["price totalprice-discount", total, ["style", "white-space:nowrap"]],// 总价
            ];

            var $btnCell, $btnCellWrap, $input, $btnDel, $btnInfo;

            $.each(_lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]);
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                if (v[2]) {
                    $cell.attr(v[2][0], v[2][1]);
                }
                $cell.append($cellWrap).appendTo($item);
            });

            $btnCell = $('<div></div>').addClass('cell btns');
            $btnCellWrap = $('<div></div>').addClass('cell-wrap');
            $input = $('<input>').attr({
                "type": "hidden",
                "name": "eiid",
                "data-quoteItemId": qv.quoteItemId,
                "data-quotationItemId": qv.quotationitemid
            }).val(qv.eiid);

            $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-remove pink"></i>').mouseenter(function() {

                com.showTip(this, "删除报价项", "top");
            });
            $btnInfo = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-search"></i>').mouseenter(function() {

                com.showTip(this, "报价信息", "top");
            });

            $btnCellWrap.append($input).append($btnDel).append($btnInfo).appendTo($btnCell);
            $item.append($btnCell);

            // 各种绑定事件
            $item.click(function() {// 编辑数量

                quote.getNumCellFocus($item);
            });
            // 删除报价项
            $btnDel.click(function(e) {

                quote.deleteQuote($item);
                return false;
            });
            // 查看
            $btnInfo.click(function(e) {

                qv.content && com.showTip(this, qv.content, 'left');
                return false;
            });

            var itemInfo = {
                "data-eiid": qv.eiid,
                "data-totalprice": total,
                "data-addPrice": qv.addPrice,
                "data-subPrice": qv.subPrice,
                "data-qiid": qv.qiid
            }

            $item.attr(itemInfo);

            return $item;
        }
    }

    return {
        init: function() {

            com.post(api.quotation.queryExtensionByEid, {
                "extension.eid": params.quotation.extensionId
            }, function(res) {

                var extension = res.extension;

                extensionDetail.basicParams["extension.eid"] = extension.eid;
                extensionDetail.basicParams["extension.type"] = extension.type;
                extensionDetail.basicParams["extension.atttype"] = extension.atttype;
                extensionDetail.basicParams["extension.orderId"] = extension.orderId;
                extensionDetail.basicParams["extension.undisPrice"] = extension.undisPrice;
                extensionDetail.basicParams["extension.disPrice"] = extension.disPrice;
                extensionDetail.basicParams["extension.total"] = extension.total;
                extensionDetail.basicParams["extension.managePrice"] = extension.managePrice;
                extensionDetail.basicParams["extension.manageRate"] = extension.manageRate;
                extensionDetail.basicParams["extension.taxPrice"] = extension.taxPrice;
                extensionDetail.basicParams["extension.taxRate"] = extension.taxRate;

                extensionDetail.basicParams["extensionItem.eid"] = extension.eid;

                extensionDetail.eid = extension.eid;
                extensionDetail.orderId = extension.orderId;
                extensionDetail.type = extension.type;
                extensionDetail.manageDiscount = extension.manageDiscount;
                extensionDetail.quoManagePrice = extension.managePrice;
                extensionDetail.quoTaxPrice = extension.taxPrice;

                extensionDetail.sumLabType.text(constant.quotation().extension.type.keys[extensionDetail.type]);
            }, null, false);

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": extensionDetail.orderId
            }, function(res) {

                extensionDetail.decoration = res.decoration;

            }, null, false);

            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                "quotation.orderId": extensionDetail.orderId
            }, function(res) {

                var quotation = res.quotation;

                extensionDetail.discount = utils.accDiv(quotation.discount, 10);
                extensionDetail.qid = quotation.qid;
                extensionDetail.quoManageRate = quotation.manageRate;
                extensionDetail.quoTaxRate = quotation.taxRate;
                extensionDetail.quotation = quotation;
                extensionDetail.versionId = quotation.version.no;

                extensionDetail.discounts.text(quotation.discount);
                extensionDetail.manageRate.text(quotation.manageRate);
                extensionDetail.taxRate.text(quotation.taxRate);
                com.focusPage('#version').text(quotation.version.name);

                extensionDetail.basicParams["extension.manageRate"] = quotation.manageRate;
                extensionDetail.basicParams["extension.taxRate"] = quotation.taxRate;

            }, null, false);

            com.post(api.quotation.queryExtensionItemByEid, {
                "extensionItem.eid": extensionDetail.eid
            }, function(res) {

                var $ul = $('<ul></ul>').addClass('fl-quo-list').appendTo(com.focusPage('#addReduceItemDiv'));

                if (res.extensionItems && res.extensionItems.length) {
                    $.each(res.extensionItems, function(i, v) {

                        painter.createQuote(i + 1, v).appendTo($ul);
                    });
                }

            }, null, false);

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": extensionDetail.orderId
            }, function(res) {

                com.focusPage('#orderId').text(res.decoration.orderId)
                com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
            });

            if (extensionDetail.quoManagePrice != 0 && extensionDetail.quoManageRate != 0) {
                extensionDetail.isCountManage.attr("checked", "checked");
            }

            if (extensionDetail.manageDiscount == constant.quotation().extension.MANAGEDISCOUNT_DISCOUNT_INT) {
                extensionDetail.isCountManageDiscount.attr("checked", "checked");
            }

            if (extensionDetail.quoTaxPrice != 0 && extensionDetail.quoTaxRate != 0) {
                extensionDetail.isCountTax.attr("checked", "checked");
            }

            arCalculator.calculateArFees();

            extensionDetail.init();
            modalEventBinding.init();
            quote.init();
        }
    }

})();

$(function() {

    ExtensionDetail.init();
});