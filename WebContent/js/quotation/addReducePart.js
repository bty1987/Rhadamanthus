var AddReduceDetail = (function() {

    var addReduceDetail = {

        addReduce: null,
        artype: null,// 增减项类型 , "0":"增项", "1":"减项", "2":"漏项"
        orderid: null,// 装修单号
        versionid: null,// 报价版本
        ordertype: null,// 订单类型
        atttype: null, // 业务类型 , 0: 工程 , 1: 主材
        discount: null,
        qid: null,// 订单的默认报价编号
        arid: null,// 增减项编号
        managePrice: 0,
        manageRate: 0,
        manageDiscount: 0,
        taxPrice: 0,
        taxRate: 0,
        taxDiscount: 0,
        isCountIn: false,
        customFlag: false,

        isCountManage: com.focusPage("#isCountManage"),
        isCountManageDiscount: com.focusPage("#isCountManageDiscount"),
        $isCountManageLabel: com.focusPage('#isCountManageLabel'),
        isCountTax: com.focusPage("#isCountTax"),

        basicParams: {
            "addReduce.arId": null,
            "addReduceItem.arId": null,
            "addReduce.dpId": null,
            "addReduce.total": 0,
            "addReduce.manageRate": 0,
            "addReduce.managePrice": 0,
            "addReduce.undisPrice": 0,
            "addReduce.disPrice": 0,
            "addReduce.uncalPrice": 0,
            "addReduce.calPrice": 0,
            "addReduce.consPrice": 0,
            "addReduce.comsPrice": 0,
            "addReduce.discount": 0,
            "addReduce.manageDiscount": 0,
            "addReduce.taxRate": 0,
            "addReduce.taxPrice": 0,
            "addReduce.taxDiscount": 0,
            "addReduce.status": null

        },
        $modals: {},
        $btnItems: {},

        quotationTypes: [],

        quoManagePrice: 0,
        quoManageRate: 0,

        initModals: function() {

            var that = this;
            that.$modals = {
                // 标准报价项弹窗
                addNormalItemModal: com.focusPage('#addNormalItemModal').on("show.bs.modal", function(a) {

                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                // 系统定义
                systemDefineItemModal: com.focusPage("#systemDefineItemModal").on("show.bs.modal", function(a) {

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
                functionAreaModal: com.focusPage("#functionAreaModal"),
                // 报价项弹层
                quotationItemModal: com.focusPage("#quotationItemModal").on("show.bs.modal", function(a) {

                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                extensionItemModal: com.focusPage('#extensionItemModal').on("show.bs.modal", function(a) {

                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                addAddItemModal: com.focusPage('#addAddItemModal').on("show.bs.modal", function(a) {

                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                discountModal: com.focusPage('#discountModal').on("show.bs.modal", function(a) {

                    var factDiscount = utils.changeThrDecimal(utils.accMul(utils.accDiv(utils.accSub(addReduceDetail.factPrice, addReduceDetail.quoManagePrice), utils.accSub(addReduceDetail.decoration.quotationPrice, addReduceDetail.quoManagePrice)), 10));
                    var realDiscount = utils.changeThrDecimal(addReduceDetail.quotation.realDiscount * 10);

                    com.focusPage("#signPrice").val(addReduceDetail.decoration.quotationPrice);
                    com.focusPage("#factPrice").val(addReduceDetail.factPrice);
                    com.focusPage("#managePrices").val(addReduceDetail.quoManagePrice);
                    com.focusPage("#factDiscount").val(realDiscount);
                    com.focusPage("#originDiscount").val(addReduceDetail.discount);

                    if (addReduceDetail.artype == constant.quotation().addreduce.TYPE_ADD_INT) {
                        com.focusPage("#currentDiscount").val(0);
                    }

                    if (addReduceDetail.artype == constant.quotation().addreduce.TYPE_REDUCE_INT) {
                        com.focusPage("#currentDiscount").val(realDiscount);
                    }
                }),
            };

            // 初始化自定义报价中的类型
            com.post(api.quotation.queryQuotationType, {}, function(res) {

                addReduceDetail.quotationTypes = res.quotationTypes.split("id", "name");
                com.focusPage("#quotationType").bindData(res.quotationTypes, "id", "name");
            }, null, false);
            // 单位
            com.post(api.common.queryMeasurementUnit, {}, function(res) {

                com.focusPage("#measurementUnit").bindData(res.measurementUnits, "name", "name");
            });
            // 工种
            com.post(api.common.queryWorkType, {}, function(res) {

                com.focusPage("#workType").bindData(res.workTypes, "name", "name");
            });

            // 功能区选择弹出层 todo
            com.post(api.quotation.queryQuotationFunctionAreaForCommonByQuotationId, {
                "quotation.qid": addReduceDetail.qid
            }, function(res) {

                com.focusPage("#addQuotationFunctionAreaId").bindData(res.quotationFunctionAreas, "qfaId", "functionAreaName");
                com.focusPage("#quotationFunctionAreaId").bindData(res.quotationFunctionAreas, "qfaId", "functionAreaName", false, null, "type");
            });

            // 系统定义弹出层
            var _condArr = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'quotation-worktype'];
            var addReduceDetailSeacher = new Searcher();
            addReduceDetailSeacher.init(_condArr, "condList", api.quotation.pageSystemDefineItemForEnable, function(data) {

                var $tableWrap = com.focusPage('#resultList').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if (data && data.length) {
                    $.each(data, function(i, v) {

                        v.measurementUnit = v.unit.name;
                        v.workType = v.workType.name;
                        v.quotationItemDes = v.comment;
                        var $liLine = painter.createQuoteModalItem(v, "sdiid", "name");
                        $liLine.appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);
                }
            }, "pagenation", "systemDefineItemModalPostData");

            // 标准报价项弹出层
            var extraParams = {
                "quotationItem.version.no": addReduceDetail.versionid,
                "quotationPrice.updateTime": com.currentTime()
            };
            if (addReduceDetail.decoration.contractTime != null) {
                extraParams["quotationPrice.updateTime"] = addReduceDetail.decoration.contractTime;
            }
            var _condArrn = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'quotation-worktype'];
            var normalItemSeacher = new Searcher();
            normalItemSeacher.init(_condArrn, "condListn", api.quotation.pageQuotationItemForPrice, function(data) {

                var $tableWrap = com.focusPage('#resultListn').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if (data && data.length) {
                    $.each(data, function(i, v) {

                        v.measurementUnit = v.unit.name;
                        v.workType = v.workType.name;
                        v.quotationItemDes = v.comment;
                        var $liLine = painter.createQuoteModalItem(v, "qiid", "name");
                        $liLine.appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);
                }
            }, "pagenationn", "addNormalItemModalPostDatan", extraParams);
        },
        initBtnItems: function() {

            var that = this;

            that.$btnItems = {
                // 选择标准报价项按钮点击(增项)
                addNormalItemBtn: com.focusPage('#addNormalItemBtn').on('click', function() {

                    modalEventBinding.showingModalName = "addNormalItemModal";
                    that.$modals.functionAreaModal.modal("show");
                }),
                // 新增(增项)
                addNewItemBtn: com.focusPage('#addNewItemBtn').on('click', function(event) {

                    event.stopPropagation();
                    com.clearValidator();
                    that.$modals.addItemModal.modal("show");
                }),
                // 报价项
                addQuotaionItemBtn: com.focusPage('#addQuotaionItemBtn').on('click', function() {

                    modalEventBinding.showingModalName = "quotationItemModal";
                    that.$modals.functionAreaModal.modal("show");
                }),
                // 系统定义
                addSystemDefineItemBtn: com.focusPage('#addSystemDefineItemBtn').on('click', function(event) {

                    modalEventBinding.showingModalName = "systemDefineItemModal";
                    that.$modals.functionAreaModal.modal("show");
                }),
                // 增项
                addItemBtn: com.focusPage('#addItemBtn').on('click', function(event) {

                    modalEventBinding.showingModalName = "addAddItemModal";
                    that.$modals.functionAreaModal.modal("show");
                }),
                // 扩展项
                extensionItemBtn: com.focusPage('#extensionItemBtn').on('click', function(event) {

                    modalEventBinding.showingModalName = "extensionItemModal";
                    that.$modals.functionAreaModal.modal("show");
                }),
                // 提交
                submitAddReduceBtn: com.focusPage('#submitAddReduceBtn').on('click', function(event) {

                    var option = {
                        "addReduces[0].arId": addReduceDetail.basicParams["addReduce.arId"],
                        "addReduce.orderId": addReduceDetail.orderid
                    };
                    com.post(api.addReduce.submitAddReduce, option, function() {

                        com.showAlert(com.info, '提交成功');
                        com.focusPage('#cancelAddReduceBtn').show();
                        com.focusPage('#submitAddReduceBtn').hide();
                    }, null, false);
                }),
                // 撤销
                cancelAddReduceBtn: com.focusPage('#cancelAddReduceBtn').on('click', function(event) {

                    var option = {
                        "addReduce.dpId": addReduceDetail.basicParams["addReduce.dpId"]
                    };
                    com.post(api.addReduce.cancelAddReduce, option, function() {

                        com.showAlert(com.info, '提交成功');
                        addReduceDetail.addReduce.paytype == constant.quotation().addreduce.PAYTYPE_PAY_INT ? com.focusPage('#submitAddReduceBtn').show() : null;
                        com.focusPage('#cancelAddReduceBtn').hide();
                    }, null, false);
                }),
                discountBtn: com.focusPage("#discountBtn").on('click', function() { // 折扣

                    that.$modals.discountModal.modal("show");
                }),
                detailBckBtn: com.focusPage('#detailBckBtn').on('click', function() { // 返回

                    com.closePopover();

                    com.switchPage(api.index.addReduceIndex.url);
                }),

                updateAddReduceBtn: com.focusPage('#updateAddReduceBtn').on('click', function(event) {

                    var option = $.extend({}, addReduceDetail.basicParams);

                    com.post(api.addReduce.updateAddReduceForAdvance, option, function() {

                        com.showAlert(com.info, '提交成功');
                    }, null, false);
                }),
            };
        },
        init: function() {

            this.initModals();
            this.initBtnItems();
        }
    };

    var arCalculator = {
        total: 0,// 总金额
        // 计算报价项各种值
        calculateQuoteFee: function($quote) {

            var _type = parseFloat($quote.find('.typedict').attr("data-type"));
            var _subtype = parseInt($quote.find('.subtypedict').attr('data-subtype'));
            var _num = parseFloat($quote.find('.num .cell-wrap').text());
            var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
            var _discountFlag = parseInt($quote.attr('data-discount')); // 0: 不打折, 1: 打折, 2: 不打折(非配比), 3: 打折(非配比)

            var _discount = null;
            // 报价折扣
            var quotationDiscount = utils.accDiv(addReduceDetail.discount, 10);

            // 根据折扣标识判断项目折扣
            if ([constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT].indexOf(_discountFlag) != -1) {
                _discount = 1;
            } else if ([constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(_discountFlag) != -1) {
                _discount = quotationDiscount;
            }

            var _dcp = utils.changeThrDecimal(utils.accMul(_unitprice, _discount));
            var _sum = utils.changeThrDecimal(utils.accMul(_unitprice, _num));
            var _sumd = utils.changeThrDecimal(utils.accMul(utils.accMul(_unitprice, _discount), _num));

            var _undisPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT].indexOf(_discountFlag) != -1 ? _sum : 0;
            var _disPrice = [constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(_discountFlag) != -1 ? _sum : 0;
            var _uncalPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(_discountFlag) != -1 ? _sum : 0;
            var _calPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT].indexOf(_discountFlag) != -1 ? _sum : 0;
            var _consPrice = _subtype == constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT ? _sum : 0;
            var _comsPrice = _subtype != constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT ? _sum : 0;
            var _managePrice = utils.changeThrDecimal(utils.accMul(_sum, addReduceDetail.manageRate)); // 获取到管理费
            var _taxPrice = 0;

            if(addReduceDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT){
                _taxPrice = utils.changeThrDecimal(utils.accMul(_sum, addReduceDetail.taxRate)); // 获取管理税金
            }

            if(addReduceDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT){
                _taxPrice = utils.changeThrDecimal(utils.accMul(utils.accAdd(_sum, _managePrice), addReduceDetail.taxRate)); // 获取总额税金
            }

            var itemInfo = {
                "data-totalprice": _sumd,
                "data-undisprice": _undisPrice,
                "data-disprice": _disPrice,
                "data-uncalprice": _uncalPrice,
                "data-calprice": _calPrice,
                "data-consprice": _consPrice,
                "data-comsprice": _comsPrice,
                "data-manageprice": _managePrice,
                "data-taxprice": _taxPrice,
            };

            $quote.find('.totalprice-discount .cell-wrap').text(_sum);
            $quote.attr(itemInfo);
        },
        calculateFees: function() {

            var sum = 0, sumd = 0, undisprice = 0, disprice = 0, uncalprice = 0, calprice = 0, consprice = 0, comsprice = 0, manageprice = 0, taxprice = 0, managetaxprice = 0;

            var $items = com.focusPage('.fl-quo-item:not([data-del="1"])', '#addReduceItemDiv');

            $.each($items, function(i, e) {

                var $item = $(e);

                var _subtype = parseInt($item.find('.subtypedict').attr('data-subtype'));
                var _num = parseFloat($item.find('.num .cell-wrap').text());
                var _unitprice = parseFloat($item.find('.unitprice .cell-wrap').text());
                var _discountFlag = parseInt($item.attr('data-discount')); // 0: 不打折, 1: 打折, 2: 不打折(非配比), 3: 打折(非配比)

                var _discount = null;
                // 报价折扣
                var quotationDiscount = utils.accDiv(addReduceDetail.discount, 10);

                // 根据折扣标识判断项目折扣
                if ([constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT].indexOf(_discountFlag) != -1) {
                    _discount = 1;
                } else if ([constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(_discountFlag) != -1) {
                    _discount = quotationDiscount;
                }

                var _dcp = utils.changeThrDecimal(utils.accMul(_unitprice, _discount));
                var _sum = utils.changeThrDecimal(utils.accMul(_unitprice, _num));
                var _sumd = utils.changeThrDecimal(utils.accMul(utils.accMul(_unitprice, _discount), _num));

                var _undisPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT].indexOf(_discountFlag) != -1 ? _sum : 0;
                var _disPrice = [constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(_discountFlag) != -1 ? _sum : 0;
                var _uncalPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(_discountFlag) != -1 ? _sum : 0;
                var _calPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT].indexOf(_discountFlag) != -1 ? _sum : 0;
                var _consPrice = _subtype == constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT ? _sum : 0;
                var _comsPrice = _subtype != constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT ? _sum : 0;
                var _managePrice = utils.changeThrDecimal(utils.accMul(_sum, addReduceDetail.manageRate));
                var _taxPrice = 0;

                var itemInfo = {
                    "data-totalprice": _sumd,
                    "data-undisprice": _undisPrice,
                    "data-disprice": _disPrice,
                    "data-uncalprice": _uncalPrice,
                    "data-calprice": _calPrice,
                    "data-consprice": _consPrice,
                    "data-comsPrice": _comsPrice,
                    "data-taxprice": _taxPrice,
                };

                $item.find('.discountprice .cell-wrap').text(_unitprice);
                $item.find('.totalprice-discount .cell-wrap').text(_sum);

                $item.attr(itemInfo);

                sumd = utils.accAdd(sumd, _sumd);
                undisprice = utils.accAdd(undisprice, _undisPrice);
                disprice = utils.accAdd(disprice, _disPrice);
                uncalprice = utils.accAdd(uncalprice, _uncalPrice);
                calprice = utils.accAdd(calprice, _calPrice);
                consprice = utils.accAdd(consprice, _consPrice);
                comsprice = utils.accAdd(comsprice, _comsPrice);
                manageprice = utils.accAdd(manageprice, _managePrice);
                taxprice = utils.accAdd(taxprice, _taxPrice);
            });

            sum = utils.accAdd(undisprice, disprice);
            sumd = utils.changeTwoDecimal(sumd);
            undisprice = utils.changeTwoDecimal(undisprice);
            disprice = utils.changeTwoDecimal(disprice);
            uncalprice = utils.changeTwoDecimal(uncalprice);
            calprice = utils.changeTwoDecimal(calprice);
            consprice = utils.changeTwoDecimal(consprice);
            comsprice = utils.changeTwoDecimal(comsprice);
            manageprice = utils.changeTwoDecimal(manageprice);
            taxprice = utils.changeTwoDecimal(taxprice);
            
            if (!addReduceDetail.isCountManage.prop("checked")) {
                manageprice = 0;
            }
            
            if(addReduceDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT){
                taxprice = utils.changeThrDecimal(utils.accMul(sum, addReduceDetail.taxRate)); // 获取管理税金
            }

            if(addReduceDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT){
                taxprice = utils.changeThrDecimal(utils.accMul(utils.accAdd(sum, manageprice), addReduceDetail.taxRate)); // 获取总额税金
            }
            
            if (!addReduceDetail.isCountTax.prop("checked")) {
                taxprice = 0;
            }

            if (addReduceDetail.isCountManageDiscount.prop("checked")) {
                managediscount = utils.changeTwoDecimal(utils.accDiv(utils.accMul(addReduceDetail.discount, manageprice), 10));
                managetaxprice = addReduceDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? utils.changeTwoDecimal(utils.accDiv(utils.accMul(addReduceDetail.discount, taxprice), 10)) : utils.changeTwoDecimal(taxprice);
            } else if (!addReduceDetail.isCountManageDiscount.prop("checked")) {
                managediscount = utils.changeTwoDecimal(manageprice);
                managetaxprice = utils.changeTwoDecimal(taxprice);
            }

            sum = utils.changeTwoDecimal(utils.accAdd(sum, utils.accAdd(manageprice, taxprice)));
            sumd = utils.changeTwoDecimal(utils.accAdd(sumd, utils.accAdd(managediscount, managetaxprice)));

            com.focusPage("#managePrice").text(managediscount);
            com.focusPage("#sumLabSumMoney").text(sum);
            com.focusPage("#sumLabDiscountMoney").text(sumd);
            com.focusPage("#undisprice").text(undisprice);
            com.focusPage("#disprice").text(disprice);
            com.focusPage("#uncalprice").text(uncalprice);
            com.focusPage("#calprice").text(calprice);
            com.focusPage("#consprice").text(consprice);
            com.focusPage("#comsprice").text(comsprice);
            com.focusPage("#taxPrice").text(managetaxprice);

            addReduceDetail.basicParams["addReduce.total"] = sumd;
            addReduceDetail.basicParams["addReduce.managePrice"] = manageprice;
            addReduceDetail.basicParams["addReduce.undisPrice"] = undisprice;
            addReduceDetail.basicParams["addReduce.disPrice"] = disprice;
            addReduceDetail.basicParams["addReduce.uncalPrice"] = uncalprice;
            addReduceDetail.basicParams["addReduce.calPrice"] = calprice;
            addReduceDetail.basicParams["addReduce.consPrice"] = consprice;
            addReduceDetail.basicParams["addReduce.comsPrice"] = comsprice;
            addReduceDetail.basicParams["addReduce.manageDiscount"] = addReduceDetail.isCountManageDiscount.prop("checked") ? 1 : 0;
            addReduceDetail.basicParams["addReduce.taxPrice"] = taxprice;

        }
    };
    // 弹层确定按钮事件绑定
    var modalEventBinding = {

        functionAreaId: null,
        functionAreaName: null,
        showingModalName: "",

        // 功能区选择弹层确认按钮
        functionAreaModalConfirm: function() {

            var that = this;
            com.focusPage('#confirmItemBtn').off().on('click', function() {

                var funcid = com.focusPage('#quotationFunctionAreaId').val();
                that.functionAreaId = funcid;
                that.functionAreaName = com.focusPage('#quotationFunctionAreaId').find('option:selected').text();

                if (that.showingModalName == "quotationItemModal") {
                    var _params = {
                        "quotationFunctionAreaItem.quotationFunctionAreaId": funcid
                    };
                    com.post(api.quotation.queryQuotationFunctionAreaItemByQuotationFunctionAreaId, _params, function(res) {

                        var $tableWrap = com.focusPage('#quolist', addReduceDetail.$modals.quotationItemModal).empty();
                        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                        if (res.quotationFunctionAreaItems && res.quotationFunctionAreaItems.length) {
                            $.each(res.quotationFunctionAreaItems, function(i, v) {

                                v.quotationItemDes = v.content;

                                if (v.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT) { // 自定义项目 , 原金额=增补价=退减价
                                    v.addPrice = v.unitPrice;
                                    v.subPrice = v.unitPrice;
                                }

                                var $liLine = painter.createQuoteModalItem(v, "qfaiId", "itemName");
                                $liLine.appendTo($ul);
                            });
                            $ul.appendTo($tableWrap);
                        }
                    }, null, false);
                } else if (that.showingModalName == "addAddItemModal") {

                    var index = 0;
                    var arIds = {};

                    com.post(api.addReduce.queryAddReduceForPayedByOrderId, {
                        "addReduce.orderId": addReduceDetail.orderid
                    }, function(res) {

                        $.each(res.addReduces, function(i, v) {

                            if (v.type == constant.quotation().addreduce.TYPE_ADD_INT) {
                                arIds['addReduceIds[' + index + ']'] = v.arId;
                                index++;
                            }
                        });
                    }, null, false);

                    com.post(api.addReduce.queryAddReduceItemByAddReduceIds, arIds, function(res) {

                        var $tableWrap = com.focusPage('#addItemList', addReduceDetail.$modals.addAddItemModal).empty();
                        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                        if (res.addReduceItems && res.addReduceItems.length) {
                            $.each(res.addReduceItems, function(i, v) {

                                if (v.quotationFunctionAreaId == funcid) {
                                    v.quotationItemDes = v.content;
                                    var $liLine = painter.createQuoteModalItem(v, "ariId", "itemName");
                                    $liLine.appendTo($ul);
                                }
                            });
                            $ul.appendTo($tableWrap);
                        }
                    }, null, false);

                } else if (that.showingModalName == 'extensionItemModal') {
                    var index = 0;
                    var eids = {};
                    com.post(api.quotation.queryExtensionByOrderId, {
                        "extension.orderId": addReduceDetail.orderid,
                        "extension.type": 0
                    }, function(res) {

                        $.each(res.extensions, function(i, v) {

                            eids['extensionIds[' + index + ']'] = v.eid;
                            index++;
                        });
                    }, null, false);

                    com.post(api.quotation.queryExtensionItemByEids, eids, function(res) {

                        var $tableWrap = com.focusPage('#extensionItemList', addReduceDetail.$modals.extensionItemModal).empty();
                        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                        if (res.extensionItems && res.extensionItems.length) {
                            $.each(res.extensionItems, function(i, v) {

                                if (v.quotationFunctionAreaId == funcid) {
                                    v.quotationItemDes = v.content;
                                    v.discount = constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT;
                                    var $liLine = painter.createQuoteModalItem(v, "eiid", "itemName");
                                    $liLine.appendTo($ul);
                                }
                            });
                            $ul.appendTo($tableWrap);
                        }
                    }, null, false);
                }

                addReduceDetail.$modals.functionAreaModal.modal('hide');
                addReduceDetail.$modals[that.showingModalName].modal("show");
            });
        },
        // 0表示标准报价项 , 1表示系统定义 , 2表示自定义 , 3表示报价中项目 , 4表示增项中项目
        // 标准报价项确认按钮点击
        addNormalItemModalConfirm: function() {

            com.focusPage('#saveaddNormalItemBtn').off().on('click', function() {

                quote.addQuotesFromModal(constant.quotation().addReduceItem.TYPE_COMMON_QUOTATION_INT);
                addReduceDetail.$modals.addNormalItemModal.modal('hide');
            });
        },
        // 系统定义报价项确认按钮点击
        systemDefineItemModalConfirm: function() {

            com.focusPage('#systemDefineItemBtn').off().on('click', function() {

                quote.addQuotesFromModal(constant.quotation().addReduceItem.TYPE_SYSTEM_QUOTATION_INT);
                addReduceDetail.$modals.systemDefineItemModal.modal('hide');
            });
        },
        // 报价中项目确认按钮点击
        quotationItemModalConfirm: function() {

            com.focusPage('#addItemsBtn').off().on('click', function() {

                quote.addQuotesFromModal(constant.quotation().addReduceItem.TYPE_QUOTATION_ITEM_INT);
                addReduceDetail.$modals.quotationItemModal.modal('hide');
            });
        },

        addAddItemModalConfirm: function() {

            com.focusPage('#addAddItemBtn').off().on('click', function() {

                quote.addQuotesFromModal(constant.quotation().addReduceItem.TYPE_ADD_ITEM_INT);
                addReduceDetail.$modals.addAddItemModal.modal('hide');
            });
        },
        extensionItemModalConfirm: function() {

            com.focusPage('#exItemBtn').off().on('click', function() {

                quote.addQuotesFromModal(constant.quotation().addReduceItem.TYPE_EXTENSION_ITEM_INT);
                addReduceDetail.$modals.extensionItemModal.modal('hide');
            });
        },
        // 自定义报价项确认按钮点击
        addItemModalConfirm: function() {

            com.focusPage("#saveAddItemBtn").on('click', function(event) {

                if (com.validate("addItemModal"))
                    return false;

                var index = com.focusPage('#addReduceItemDiv').find('.fl-quo-item').length;

                var addRow = {
                    "num": com.focusPage("#num").val(),// 工程预算量
                    "itemName": com.focusPage("#itemName").val(),// 名称
                    "quotationFunctionAreaId": com.focusPage("#addQuotationFunctionAreaId").val(),// 功能区
                    "quotationFunctionAreaName": com.focusPage("#addQuotationFunctionAreaId").find('option:selected').text(),
                    "measurementUnit": com.focusPage("#measurementUnit").val(),// 单位
                    "unitPrice": com.focusPage("#unitPrice").val(),// 单价(折后单价、总价为计算值)
                    "workType": com.focusPage("#workType").val(),// 工种
                    "content": com.focusPage("#quotationItemDes").val(),// 工艺说明
                    "subtype": com.focusPage("#quotationType").val(),
                    "type": constant.quotation().addReduceItem.TYPE_CUSTOM_QUOTATION_INT, // 类型(隐藏属性)
                    "discount": constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT,
                    "itemtype": constant.quotation().addReduceItem.ITEMTYPE_NORM_INT,
                    "index": (index + 1)
                };

                /*
                 * addReduceItem.quoteItemId , 引用报价项Id , type类型为0, 1, 3需要传递该参数 , 同时分别传递标准报价项id , 系统定义项id , 报价中报价项Id ; addReduceItem.content , 说明信息 , type类型为2需要传递该参数 .
                 */
                var args = {
                    "addReduceItem.discount": addRow.discount,// 是否打折;
                    "addReduceItem.ariId": "",// 增减项报价项Id , 新建无此参数;
                    "addReduceItem.itemName": addRow.itemName,// 项目名;
                    "addReduceItem.type": addRow.type,// 增减项类型 , 0表示标准报价项 , 1表示系统定义 , 2表示自定义 , 3表示报价中项目 ;
                    "addReduceItem.subtype": addRow.subtype,// 1工程,2主材,3套餐,4家具,5电器,6灯具,7软装
                    "addReduceItem.itemtype": addRow.itemtype,// 项目类型 , 0: 标准 , 1: 成本
                    "addReduceItem.measurementUnit": addRow.measurementUnit,// 单位 ;
                    "addReduceItem.workType": addRow.workType,// 工种 ;
                    "addReduceItem.addPrice": addRow.unitPrice,// 单价 ;
                    "addReduceItem.unitPrice": addRow.unitPrice,// 单价 ;
                    "addReduceItem.subPrice": addRow.unitPrice,// 单价 ;
                    "addReduceItem.num": addRow.num,// 工程量 ;
                    "addReduceItem.quotationFunctionAreaId": addRow.quotationFunctionAreaId,// 所属功能区Id ;
                    "addReduceItem.quotationFunctionAreaName": com.focusPage("#addQuotationFunctionAreaId").find('option:selected').text(),// 所属功能区name ;
                    "addReduceItem.content": addRow.content,
                    "addReduceItem.index": addRow.index
                };

                var _index = com.focusPage('.fl-quo-item:not([data-del="1"])', '#addReduceItemDiv').length;
                var $item = painter.createQuote(_index + 1, addRow).appendTo(com.focusPage('#addReduceItemDiv > ul'));
                $item.find(".icon-arrow-up").removeClass("grey").addClass("green");
                $item.find(".icon-arrow-down").removeClass("grey").addClass("red");

                arCalculator.calculateQuoteFee($item);
                arCalculator.calculateFees();

                var _params = $.extend(true, {}, args, addReduceDetail.basicParams);

                com.post(api.addReduce.updateAddReduceItem, _params, function(res) {

                    $item.find('input[name="deleteItems"]').val(res.addReduceItem.ariId);
                    $item.attr("data-ariid", res.addReduceItem.ariId);
                }, null, false);

                addReduceDetail.$modals.addItemModal.modal("hide");
            });
        },
        changeTotalIsCountIn: function() {

            addReduceDetail.isCountManage.on("click", function(e) {

                arCalculator.calculateFees();

                var options = $.extend({}, addReduceDetail.basicParams);

                if (!addReduceDetail.isCountManage.prop("checked")) {
                    options["addReduce.manageRate"] = 0;
                    options["addReduce.managePrice"] = 0;
                }

                com.post(api.addReduce.updateAddReduceForAdvance, options, function() {

                }, null, false);
            });
        },
        changeTotalIsCountInDiscount: function() {

            addReduceDetail.isCountManageDiscount.on("click", function(res) {

                arCalculator.calculateFees();

                var options = $.extend({}, addReduceDetail.basicParams);

                options["addReduce.manageDiscount"] = addReduceDetail.isCountManageDiscount.prop("checked") ? 1 : 0;

                com.post(api.addReduce.updateAddReduceForAdvance, options, function() {

                }, null, false);
            });
        },
        changeDiscount: function() {

            com.focusPage("#changeDiscountBtn").on('click', function(event) {

                if (com.validate("discountModal"))
                    return false;

                var originDiscount = com.focusPage("#originDiscount").val();
                var currentDiscount = com.focusPage("#currentDiscount").val();

                addReduceDetail.discount = currentDiscount;
                addReduceDetail.basicParams["addReduce.discount"] = currentDiscount;

                arCalculator.calculateFees();

                var _params = $.extend(true, {}, addReduceDetail.basicParams);

                com.post(api.addReduce.updateAddReduceForAdvance, _params, function() {

                    com.showAlert(com.info, '提交成功');
                    com.focusPage('#sumLabDiscount').text(addReduceDetail.discount);

                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    addReduceDetail.discount = originDiscount;
                    addReduceDetail.basicParams["addReduce.discount"] = originDiscount;

                    arCalculator.calculateFees();
                }, false);

                addReduceDetail.$modals.discountModal.modal("hide");
            });
        },
        changeTotalIsCountTax: function() {

            addReduceDetail.isCountTax.on("click", function(e) {

                arCalculator.calculateFees();

                var options = $.extend({}, addReduceDetail.basicParams);

                if (!addReduceDetail.isCountTax.prop("checked")) {
                    options["addReduce.taxRate"] = 0;
                    options["addReduce.taxPrice"] = 0;
                    options["addReduce.taxDiscount"] = constant.quotation().addreduce.TAX_NODISCOUNT_INT;
                } else {
                    options["addReduce.taxDiscount"] = addReduceDetail.quotation.taxDiscount;
                }

                com.post(api.addReduce.updateAddReduceForAdvance, options, function() {

                }, null, false);
            });
        },
        init: function() {

            this.functionAreaModalConfirm();
            this.addNormalItemModalConfirm();
            this.systemDefineItemModalConfirm();
            this.quotationItemModalConfirm();
            this.addAddItemModalConfirm();
            this.extensionItemModalConfirm();
            this.addItemModalConfirm();
            this.changeTotalIsCountIn();
            this.changeTotalIsCountInDiscount();
            this.changeDiscount();
            this.changeTotalIsCountTax();
        }
    };

    // 报价项操作
    var quote = {

        quotesRecord: [],
        $nowLine: null,
        $nowEditInput: null,
        // 排序报价项
        sortQuote: function() {

            com.focusPage('.fl-quo-item:not([data-del="1"])', '#addReduceItemDiv').each(function() {

                $(this).find('.line .cell-wrap').text($(this).index() + 1);
            });
        },
        /*
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
        /*
         * 添加弹窗中的报价项到增减项报价项区域 type : 0表示标准报价项 , 1表示系统定义 , 2表示自定义 , 3表示报价中项目,4表示增减项中项目,5表示扩展项中项目
         */
        addQuotesFromModal: function(type) {

            var that = this;
            var $arwrap = com.focusPage('#addReduceItemDiv');
            var _arrs = that.quotesRecord;
            var _index = $arwrap.find('.fl-quo-item').length;

            if (!_arrs.length) {
                return false;
            }

            $.each(_arrs, function(i, v) {

                var $this = $(v);
                var $li = $this.parents('.fl-table-list > li');

                if ($this.val() && $('input[data-qiid="' + $this.val() + '"]', '#addReduceItemDiv').length) {
                    return false;
                }

                var subtype = $this.attr("data-quotationSubType");

                if (addReduceDetail.atttype == 1 && subtype != constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT)
                    return true;

                if (addReduceDetail.atttype == 2 && subtype == constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT)
                    return true;

                var addPrice = parseFloat($li.find("li .addPrice").text() ? $li.find("li .addPrice").text() : 0);
                var unitPrice = parseFloat($li.find("li .unitPrice").text() ? $li.find("li .unitPrice").text() : 0);
                var subPrice = parseFloat($li.find("li .subPrice").text() ? $li.find("li .subPrice").text() : 0);

                var itemType = $this.attr("data-quotationType");

                if (addReduceDetail.artype == constant.quotation().addreduce.TYPE_ADD_INT) { // 增项
                    unitPrice = addPrice;
                    subPrice = addPrice;
                } else if (addReduceDetail.artype == constant.quotation().addreduce.TYPE_REDUCE_INT) { // 减项
                    unitPrice = subPrice;
                }

                // 增减项打折标识
                var discount = parseInt($this.attr('data-discount'));

                if (type == constant.quotation().addReduceItem.TYPE_COMMON_QUOTATION_INT) { // 项目类型为0
                    discount = addReduceDetail.artype == constant.quotation().addreduce.TYPE_REDUCE_INT ? discount : constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT;
                } else if (type == constant.quotation().addReduceItem.TYPE_ADD_ITEM_INT || type == constant.quotation().addReduceItem.TYPE_EXTENSION_ITEM_INT) { // 项目类型为4, 5
                    discount = constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT;
                }

                if (addReduceDetail.ordertype == constant.decoration().decoration.TYPE_HOLONOMY_INT) { // 装修单类型为满减
                    discount = addReduceDetail.artype == constant.quotation().addreduce.TYPE_REDUCE_INT ? constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT : constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT;
                }

                var $itemtype = 0;

                // 成本类型不打折
                if ((itemType == constant.data().quotationItem.TYPE_COST_INT && type == constant.quotation().addReduceItem.TYPE_COMMON_QUOTATION_INT) || (itemType == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT && type == constant.quotation().addReduceItem.TYPE_QUOTATION_ITEM_INT) || $this.attr("data-itemType") == constant.quotation().addReduceItem.ITEMTYPE_COST_INT) {
                    discount = constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT;
                    $itemtype = constant.quotation().addReduceItem.ITEMTYPE_COST_INT;

                } else {
                    $itemtype = constant.quotation().addReduceItem.ITEMTYPE_NORM_INT;
                }

                var _quotval = {
                    "num": 0, // 工程预算量
                    "itemName": $li.find('.lbl').text(), // 名称
                    "quotationFunctionAreaId": modalEventBinding.functionAreaId, // 功能区
                    "quotationFunctionAreaName": modalEventBinding.functionAreaName, // 功能区
                    "quotationBigCategory": $li.find("li .quotationBigCategory").text(), // 大类
                    "measurementUnit": $li.find("li .measurementUnit").text(), // 单位
                    "addPrice": addPrice,
                    "unitPrice": unitPrice,
                    "subPrice": subPrice,
                    "content": $li.find("li .quotationItemDes").text(), // 工艺说明
                    "workType": $li.find("li .workType").text(), // 工种
                    "quotationFunctionAreaType": $this.attr('quotationFunctionAreaType'),
                    "type": type, // 类型(隐藏属性)
                    "subtype": $this.attr("data-quotationSubType"),
                    "ariId": "", // 增减项中报价项的id
                    "quoteItemId": $this.val(), // id(隐藏属性)
                    "discount": discount, // 项目折扣标识
                    "itemtype": $itemtype
                };

                var $item = painter.createQuote(_index + i + 1, _quotval).appendTo($arwrap.find('.fl-quo-list'));
            });

            quote.quotesRecord = [];
        },

        /* 选中报价项显示编辑input */
        getNumCellFocus: function($line) {

            var that = this;
            var $numCell = $line.find('.cell.num');
            var $arwrap = com.focusPage('#addReduceItemDiv');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $arwrap.find('.fl-quo-input');

            quote.checkedStyle($line);

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
                    "addReduceItem.discount": that.$nowLine.attr("data-discount"),// 是否打折
                    "addReduceItem.ariId": that.$nowLine.attr('data-ariid'),// 增减项报价项Id , 新建无此参数;
                    "addReduceItem.itemName": that.$nowLine.find('.name .cell-wrap').text(),// 项目名;
                    "addReduceItem.type": _type,// 增减项类型 , 0表示标准报价项 , 1表示系统定义 , 2表示自定义 , 3表示报价中项目 ;
                    "addReduceItem.subtype": that.$nowLine.find('.subtypedict').attr('data-subtype'),
                    "addReduceItem.itemtype": that.$nowLine.attr('data-itemtype'),// 项目类型 , 0: 标准 , 1: 成本
                    "addReduceItem.measurementUnit": that.$nowLine.find('.unit .cell-wrap').text(),// 单位 ;
                    "addReduceItem.workType": that.$nowLine.find('.worktype .cell-wrap').text(),// 工种 ;
                    "addReduceItem.addPrice": that.$nowLine.attr('data-addPrice'), // 增补价
                    "addReduceItem.unitPrice": that.$nowLine.find('.unitprice .cell-wrap').text(), // 单价
                    "addReduceItem.subPrice": that.$nowLine.attr('data-subPrice'), // 退减价
                    "addReduceItem.num": that.$nowLine.find('.num .cell-wrap').text(),// 工程量 ;
                    "addReduceItem.quotationFunctionAreaId": that.$nowLine.find('.quotationFunctionArea').attr('data-quotationfunctionareaid'),// 所属功能区Id ;
                    "addReduceItem.index": that.$nowLine.find('.line .cell-wrap').text(),
                };

                // addReduceItem.quoteItemId , 引用报价项Id , type类型为0, 1, 3需要传递该参数 , 同时分别传递标准报价项id , 系统定义项id , 报价中报价项Id ;
                // addReduceItem.content , 说明信息 , type类型为2需要传递该参数 .
                if (_type == constant.quotation().addReduceItem.TYPE_CUSTOM_QUOTATION_INT) {
                    args["quotationFunctionAreaItem.content"] = that.$nowLine.prop('title');// , 报价项说明 , 自定义类型报价项需要传递 ;
                } else {
                    args["addReduceItem.quoteItemId"] = that.$nowLine.find('input[name="ariid"]').attr('data-quoteitemid');// , 报价项Id , 标准类型报价项需要传递 "data-qiid"
                }

                com.clearValidator();

                that.$nowLine.find(".icon-arrow-up").removeClass("grey").addClass("green");
                that.$nowLine.find(".icon-arrow-down").removeClass("grey").addClass("red");

                arCalculator.calculateQuoteFee(that.$nowLine);
                arCalculator.calculateFees();

                var _params = $.extend(true, {}, args, addReduceDetail.basicParams);

                com.post(api.addReduce.updateAddReduceItem, _params, function(res) {

                    that.$nowLine.find('input[name="ariid"]').val(res.addReduceItem.ariId);
                    that.$nowLine.attr("data-ariid", res.addReduceItem.ariId);
                    if ($line.length) {
                        that.getNumCellFocus($line);
                    } else {
                        that.hideInputWrap();
                    }
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);
                    that.$nowLine.find('.cell.num .cell-wrap').text(oldmum);

                    arCalculator.calculateQuoteFee(that.$nowLine);
                    arCalculator.calculateFees();

                    that.hideInputWrap();
                }, false);

                return;
            }

            if (e.keyCode == 38) {
                $line = that.$nowLine.prev('.fl-quo-item:not([data-del="1"])');
                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }
                return;
            }

            if (e.keyCode == 40) {
                $line = that.$nowLine.next('.fl-quo-item:not([data-del="1"])');
                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }
                return;
            }
        },
        hideInputWrap: function() {

            if (!this.$nowEditInput) {
                return;
            }
            this.$nowEditInput.addClass('hide');
            this.$nowEditInput = null;
        },
        // 点击页面其他位置时清除表格行的选中样式
        clearQuoteSelected: function() {

            var that = this;
            $('body').click(function(e) {

                if (!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')) {
                    that.hideInputWrap();
                }
            });
        },
        checkQuote: function($quote) {

            var _ariid = $quote.attr("data-ariid");

            var _uncalprice = $quote.attr("data-uncalprice");
            var _calprice = $quote.attr("data-calprice");
            var _num = $quote.find('num .cell-wrap').text();

            $quote.attr({
                "data-uncalprice": _calprice,
                "data-calprice": _uncalprice
            });

            var _check = $quote.find(".checkcal").prop("checked");
            var _discount = $quote.find(".discounted").prop("checked");
            var discount = null;

            if (!_check && !_discount) {
                discount = constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT;
            } else if (!_check && _discount) {
                discount = constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT;
            } else if (_check && !_discount) {
                discount = constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT;
            } else if (_check && _discount) {
                discount = constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT;
            }

            $quote.attr("data-discount", discount);

            arCalculator.calculateFees();

            var args = {
                "addReduceItem.ariId": _ariid,
                "addReduceItem.discount": discount,
            }

            var _params = $.extend(true, {}, args, addReduceDetail.basicParams);

            com.post(api.addReduce.updateAddReduceItemForAdvance, _params);
        },
        // 删除报价项
        deleteQuote: function($quote) {

            var that = this;
            var _ariid = $quote.attr("data-ariid");
            var quotationItemId = $quote.attr("data-quotationItemId");

            if ($quote.find(".fl-quo-input"))
                $quote.find(".fl-quo-input").insertAfter(com.focusPage('.fl-quo-list')).addClass('hide');

            if (!_ariid) {
                $quote.remove();
            } else {
                $quote.attr("data-del", "1");

                arCalculator.calculateFees();
                var _params = $.extend({}, addReduceDetail.basicParams);
                _params["addReduceItem.ariId"] = _ariid;
                _params["addReduceItem.quotationItemId"] = quotationItemId;

                com.post(api.addReduce.deleteAddReduceItem, _params, function(res) {

                    $quote.remove();
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);
                    $quote.removeAttr("data-del");
                    arCalculator.calculateFees();
                }, false);
            }

            that.sortQuote();
        },

        checkedStyle: function($item) {

            com.focusPage('.fl-quo-item.current').removeClass('current');
            $item.addClass('current');
        },

        moveAreaItem: function($quote, $movequote, $direction) {

            if (!$quote.attr('data-ariid')) {
                return false;
            }

            if ($direction == "up") {

                if ($quote.prev().length == 0 || !$movequote.attr('data-ariid')) {
                    return false;
                }

                $quote.insertBefore($movequote);
            }

            if ($direction == "down") {

                if ($quote.next().length == 0 || !$movequote.attr('data-ariid')) {
                    return false;
                }

                $quote.insertBefore($movequote);
            }

            var nowline = $quote.find(".cell.line .cell-wrap").text();
            var upline = $movequote.find(".cell.line .cell-wrap").text();

            $quote.find(".cell.line .cell-wrap").text(upline);
            $movequote.find(".cell.line .cell-wrap").text(nowline);

            var params = {};
            params["addReduceItems[" + 0 + "].ariId"] = $quote.attr('data-ariid');
            params["addReduceItems[" + 0 + "].index"] = upline;
            params["addReduceItems[" + 1 + "].ariId"] = $movequote.attr('data-ariid');
            params["addReduceItems[" + 1 + "].index"] = nowline;
 
            com.post(api.addReduce.updateAddReduceItemForIndex, params);
        },

        init: function() {

            this.clearQuoteSelected();
        }
    };

    var painter = {
        // 创建添加报价项弹窗中的报价项 .sdiid

        createQuoteModalItem: function(v, id, name) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({
                "margin-bottom": 0
            });
            var $label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "modalQuots",
                "class": "ace ace-checkbox-2",
                "data-discount": v.discount,
                "data-quotationType": v.type,
                "data-itemType": v.itemtype,
                "data-quotationSubType": (v.category && v.category.id) ? v.category.id : v.subtype,
                "quotationFunctionAreaType": com.focusPage('#quotationFunctionAreaId').find('option:selected').attr("other"),
            }).val(v[id]);

            var subtype = (v.category && v.category.id) ? v.category.id : v.subtype;

            if (addReduceDetail.atttype == 1 && subtype != constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT)
                $input.attr("disabled", "disabled");

            if (addReduceDetail.atttype == 2 && subtype == constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT)
                $input.attr("disabled", "disabled");

            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v[name]);

            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [];
            propertyArr.push(["编号:", v.itemId, "grey"]);
            propertyArr.push(["大类:", addReduceDetail.quotationTypes[(v.category && v.category.id) ? v.category.id : v.subtype], "red quotationBigCategory"]);
            propertyArr.push(["单位:", v.measurementUnit, "red measurementUnit"]);
            propertyArr.push(["工种:", v.workType, "red workType"]);
            propertyArr.push(["单价:", v.addPrice, "blue addPrice", modalEventBinding.showingModalName == "extensionItemModal" ? "show" : modalEventBinding.showingModalName == "addAddItemModal" ? "show" : addReduceDetail.artype == constant.quotation().addreduce.TYPE_ADD_INT ? "show" : "hide"]);
            propertyArr.push(["单价:", v.unitPrice, "blue unitPrice", "hide"]);
            propertyArr.push(["单价:", v.subPrice, "blue subPrice", modalEventBinding.showingModalName == "extensionItemModal" ? "hide" : modalEventBinding.showingModalName == "addAddItemModal" ? "hide" : addReduceDetail.artype == constant.quotation().addreduce.TYPE_REDUCE_INT ? "show" : "hide"]);
            propertyArr.push(["工程量:", v.num, "blue"]);
            propertyArr.push(["是否打折:", constant.quotation().addreduce.manageDiscount.keys[v.discount], "red"]);
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
                quote.recordQuots($this, $this.is(':checked'));
            });

            return $liLine;
        },

        // 创建报价项
        createQuote: function(linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content);
            var typeDict = {
                "0": "标",
                "1": "系",
                "2": "自",
                "3": "报",
                "4": "增",
                "5": "扩"
            };
            var itemtypeDict = {
                "1": "成"
            };

            var _discount = null;
            // 报价折扣
            var quotationDiscount = utils.accDiv(addReduceDetail.discount, 10);

            // 根据折扣标识判断项目折扣
            if ([constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT].indexOf(qv.discount) != -1) {
                _discount = 1;
            } else if ([constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(qv.discount) != -1) {
                _discount = quotationDiscount;
            }

            var _dcp = utils.changeThrDecimal(utils.accMul(qv.unitPrice, _discount));
            var _sum = utils.changeThrDecimal(utils.accMul(qv.unitPrice, qv.num));
            var _sumd = utils.changeThrDecimal(utils.accMul(utils.accMul(qv.unitPrice, _discount), qv.num));

            var _undisPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT].indexOf(qv.discount) != -1 ? _sum : 0;
            var _disPrice = [constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(qv.discount) != -1 ? _sum : 0;
            var _uncalPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(qv.discount) != -1 ? _sum : 0;
            var _calPrice = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT].indexOf(qv.discount) != -1 ? _sum : 0;
            var _consPrice = qv.subtype == constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT ? _sum : 0;
            var _comsPrice = qv.subtype != constant.quotation().addReduceItem.SUBTYPE_PROJECT_INT ? _sum : 0;

            var _managePrice = utils.changeThrDecimal(utils.accMul(_sum, addReduceDetail.manageRate));
            var _taxPrice = 0;

            if(addReduceDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT){
                _taxPrice = utils.changeThrDecimal(utils.accMul(_sum, addReduceDetail.taxRate));
            }

            if(addReduceDetail.quotation.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT){
                _taxPrice = utils.changeThrDecimal(utils.accMul(utils.accAdd(_sum,_managePrice), addReduceDetail.taxRate));
            }

            var _class = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(qv.discount) != -1 ? "blue" : "green";
            var _classd = [constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT, constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT].indexOf(qv.discount) != -1 ? "blue" : "green";

            var $badgeInfo = "<span class='badge badge-info'>" + typeDict[qv.type] + "</span>";

            if (qv.itemtype == constant.quotation().addReduceItem.ITEMTYPE_COST_INT) {
                $badgeInfo += "<span class='badge badge-danger'>" + itemtypeDict[qv.itemtype] + "</span>";
            }

            var _lineSet = [ // 
            ["line", linenum, ['quotationFunctionAreaType', qv.quotationFunctionAreaType]], // 索引
            ["num subtypedict", qv.num, ['data-subtype', qv.subtype]], // 工程预算量
            ["name " + _class, qv.itemName], // 名称
            ["type typedict " + _classd, $badgeInfo, ['data-type', qv.type]], // 类型
            ["worktype", qv.workType], // 工种
            ["type quotationFunctionArea", qv.quotationFunctionAreaName ? qv.quotationFunctionAreaName : "---", ["data-quotationFunctionAreaId", qv.quotationFunctionAreaId]],// 功能区
            ["unit", qv.measurementUnit], // 单位
            ["price unitprice", qv.unitPrice], // 单价
            ["price discountprice", qv.unitPrice], // 折后单价
            ["price totalprice-discount", _sum, ["style", "white-space:nowrap"]], // 总价
            ];

            var $checkCell, $checkCellWrap, $btnCell, $btnCellWrap, $input, $btnDel, $btnInfo, $up, $down, $discountCell, $discountCellWrap, $checkDiscount, $lblDiscount;

            $.each(_lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]);
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);

                if (v[2]) {
                    $cell.attr(v[2][0], v[2][1]);
                }
                $cell.append($cellWrap).appendTo($item);
            });

            $checkCell = $('<div></div>').addClass('cell btns');
            $checkCellWrap = $('<div></div>').addClass('cell-wrap');

            $check = $("<input></input>").attr("type", "checkbox").addClass("ace checkcal");
            $lbl = $("<span></span>").addClass("lbl");

            $checkCellWrap.append($check).append($lbl).appendTo($checkCell);

            $discountCell = $('<div></div>').addClass('cell btns');
            $discountCellWrap = $('<div></div>').addClass('cell-wrap');

            $checkDiscount = $("<input></input>").attr("type", "checkbox").addClass("ace discounted");
            $lblDiscount = $("<span></span>").addClass("lbl");

            $discountCellWrap.append($checkDiscount).append($lblDiscount).appendTo($discountCell);

            $btnCell = $('<div></div>').addClass('cell btns');
            $btnCellWrap = $('<div></div>').addClass('cell-wrap');
            $input = $('<input>').attr({
                "type": "hidden",
                "name": "ariid",
                "data-quoteItemId": qv.quoteItemId
            }).val(qv.ariId);

            $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)"
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
            $up = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-arrow-up"></i>').mouseenter(function() {

                com.showTip(this, "向上", "top");
            });
            $down = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-arrow-down"></i>').mouseenter(function() {

                com.showTip(this, "向下", "top");
            });

            if (qv.ariId) {
                $up.find("i").addClass("green"), $down.find("i").addClass("red");
            } else {
                $up.find("i").addClass("grey"), $down.find("i").addClass("grey");
            }

            $btnCellWrap.append($input).append($btnDel).append($btnInfo).append($up).append($down).appendTo($btnCell);

            $item.append($discountCell).append($checkCell).append($btnCell);

            if ([constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT].indexOf(qv.discount) != -1)
                $check.attr("checked", "checked");
            if ([constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_NON_INT, constant.quotation().addReduceItem.DISCOUNT_DISCOUNT_INT].indexOf(qv.discount) != -1)
                $checkDiscount.attr("checked", "checked");

            // 各种绑定事件
            $item.click(function() {// 编辑数量

                quote.getNumCellFocus($item);
            });

            $check.click(function() {

                if (!$item.attr("data-ariid"))
                    return false;
                quote.checkQuote($item);
            });

            $checkDiscount.click(function() {

                if (!$item.attr("data-ariid") || addReduceDetail.status != constant.quotation().addreduce.STATUS_UNSUBMIT_INT)
                    return false;

                quote.checkQuote($item);
            });

            // 删除报价项
            $btnDel.click(function() {

                quote.deleteQuote($item);
                return false;
            });

            // 查看
            $btnInfo.click(function() {

                qv.content && com.showTip(this, qv.content, 'left');
                return false;
            });

            // 向上移动
            $up.click(function(e) {

                quote.checkedStyle($item);
                quote.moveAreaItem($item, $item.prev(), 'up');
                return false;
            });

            // 向下移动
            $down.click(function(e) {

                quote.checkedStyle($item);
                quote.moveAreaItem($item, $item.next(), 'down');
                return false;
            });

            var itemInfo = {
                "data-ariid": qv.ariId,
                "data-totalprice": _sumd,
                "data-undisprice": _undisPrice,
                "data-disprice": _disPrice,
                "data-uncalprice": _uncalPrice,
                "data-calprice": _calPrice,
                "data-consprice": _consPrice,
                "data-comsprice": _comsPrice,
                "data-manageprice": _managePrice,
                "data-addPrice": qv.addPrice,
                "data-unitPrice": qv.unitPrice,
                "data-subPrice": qv.subPrice,
                "data-discount": qv.discount,
                "data-quotationItemId": qv.quotationItemId,
                "data-taxPrice": _taxPrice,
                "data-itemtype": qv.itemtype
            }

            $item.attr(itemInfo);

            return $item;
        }
    };

    return {
        init: function() {

            addReduceDetail.arid = params.quotation.addReduce.arId;
            addReduceDetail.atttype = params.quotation.atttype;

            addReduceDetail.historyPage = params.historyPage;

            com.post(api.addReduce.queryAddReduceByArid, {
                "addReduce.arId": addReduceDetail.arid
            }, function(res) {

                var addReduce = res.addReduce;

                addReduceDetail.arid = addReduce.arId;
                addReduceDetail.artype = addReduce.type;
                addReduceDetail.total = addReduce.total;
                addReduceDetail.managePrice = addReduce.managePrice;
                addReduceDetail.manageRate = addReduce.manageRate;
                addReduceDetail.discount = addReduce.discount;
                addReduceDetail.status = addReduce.status;
                addReduceDetail.manageDiscount = addReduce.manageDiscount;
                addReduceDetail.taxRate = addReduce.taxRate;
                addReduceDetail.taxPrice = addReduce.taxPrice;
                addReduceDetail.taxDiscount = addReduce.taxDiscount;

                addReduceDetail.basicParams["addReduce.arId"] = addReduce.arId;
                addReduceDetail.basicParams["addReduceItem.arId"] = addReduce.arId;
                addReduceDetail.basicParams["addReduce.dpId"] = addReduce.dpId;
                addReduceDetail.basicParams["addReduce.managePrice"] = addReduce.managePrice;
                addReduceDetail.basicParams["addReduce.manageRate"] = addReduce.manageRate;
                addReduceDetail.basicParams["addReduce.undisPrice"] = addReduce.undisPrice;
                addReduceDetail.basicParams["addReduce.disPrice"] = addReduce.disPrice;
                addReduceDetail.basicParams["addReduce.uncalPrice"] = addReduce.uncalPrice;
                addReduceDetail.basicParams["addReduce.calPrice"] = addReduce.calPrice;
                addReduceDetail.basicParams["addReduce.consPrice"] = addReduce.consPrice;
                addReduceDetail.basicParams["addReduce.comsPrice"] = addReduce.comsPrice;
                addReduceDetail.basicParams["addReduce.taxPrice"] = addReduce.taxPrice;
                addReduceDetail.basicParams["addReduce.taxRate"] = addReduce.manageRate;
                addReduceDetail.basicParams["addReduce.status"] = addReduce.status;

                addReduceDetail.orderid = addReduce.orderId;

                addReduceDetail.addReduce = addReduce;
                addReduceDetail.addReduceItems = addReduce.addReduceItems;

                com.focusPage('#atttypeR').text(constant.quotation().addreduce.atttype.keys[addReduce.atttype]);
                com.focusPage('#atttypeV').text(addReduceDetail.atttype == 1 ? "工程" : addReduceDetail.atttype == 2 ? "主材" : "工程/主材");

                if (addReduce.status == constant.quotation().addreduce.STATUS_SUBMIT_INT) {
                    com.focusPage('#cancelAddReduceBtn').show();
                } else if (addReduce.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT && addReduce.paytype == constant.quotation().addreduce.PAYTYPE_PAY_INT) {
                    com.focusPage('#submitAddReduceBtn').show();
                }

            }, null, false);

            com.post(api.system.querySystemConfigByKey, {
                "systemConfig.key": "QUOTATION_PART_CUSTOM_FLAG"
            }, function(res) {

                if (res.systemConfig.value)
                    addReduceDetail.customFlag = true;

            }, null, false);

            if (addReduceDetail.artype == constant.quotation().addreduce.TYPE_ADD_INT) {

                com.focusPage('#sumLabType').text('增项');
                com.focusPage('#addNormalItemBtn').removeClass('hide');
                com.focusPage('.unitprice .cell-wrap').text('增补价');

            } else if (addReduceDetail.artype == constant.quotation().addreduce.TYPE_REDUCE_INT) {

                com.focusPage('#sumLabType').text('减项');
                com.focusPage('#extensionItemBtn').removeClass('hide');
                com.focusPage('#addQuotaionItemBtn').removeClass('hide');
                com.focusPage('#addSystemDefineItemBtn').removeClass('hide');
                com.focusPage('#addItemBtn').removeClass('hide');

            }

            if (addReduceDetail.artype == constant.quotation().addreduce.TYPE_ADD_INT && addReduceDetail.customFlag){

                com.focusPage('#addNewItemBtn').removeClass('hide');
            }

            // 根据装修单号获取默认报价
            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                "quotation.orderId": addReduceDetail.orderid
            }, function(res) {

                var quotation = res.quotation;

                addReduceDetail.discount = addReduceDetail.discount == 0 ? quotation.discount : addReduceDetail.discount;
                com.focusPage('#sumLabDiscount').text(addReduceDetail.discount);
                addReduceDetail.basicParams["addReduce.discount"] = addReduceDetail.discount;

                addReduceDetail.qid = quotation.qid;

                // 报价中的管理费
                com.focusPage('#manageRate').text(quotation.manageRate);
                com.focusPage('#managePrice').text(addReduceDetail.managePrice);

                com.focusPage('#taxRate').text(quotation.taxRate);
                com.focusPage('#taxPrice').text(addReduceDetail.taxPrice);
                com.focusPage('#version').text(quotation.version.name);

                addReduceDetail.quoManagePrice = quotation.managePrice;
                addReduceDetail.quoManageRate = res.quotation.manageRate;
                addReduceDetail.manageRate = res.quotation.manageRate;
                addReduceDetail.taxRate = quotation.taxRate;
                addReduceDetail.versionid = quotation.version.no;
                addReduceDetail.basicParams["addReduce.manageRate"] = res.quotation.manageRate;
                addReduceDetail.basicParams["addReduce.taxRate"] = quotation.taxRate;

                addReduceDetail.quotation = res.quotation;
            }, null, false);

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": addReduceDetail.orderid
            }, function(res) {

                var decoration = res.decoration;

                com.focusPage('#orderId').text(decoration.orderId)
                com.focusPage('#address').text(decoration.house.village.name + " " + decoration.house.houseNumber);

                addReduceDetail.ordertype = decoration.type;
                addReduceDetail.factPrice = decoration.factPrice;

                addReduceDetail.decoration = decoration;

                var quotation = addReduceDetail.quotation;

                addReduceDetail.quotation.realDiscount = utils.changeThrDecimal(decoration.factPrice / (quotation.undisPrice + quotation.disPrice + quotation.trafficPrice + quotation.managePrice + quotation.taxPrice));
            }, null, false);

            var $ul = $('<ul></ul>').addClass('fl-quo-list').appendTo(com.focusPage('#addReduceItemDiv'));
            if (addReduceDetail.addReduceItems && addReduceDetail.addReduceItems.length) {

                addReduceDetail.addReduceItems.sort(function(a, b) {
                    if (a.index == null || b.index == null) {
                        return b.index - a.index;
                    } else {
                        return a.index - b.index;
                    }
                });

                $.each(addReduceDetail.addReduceItems, function(i, v) {

                    painter.createQuote(i + 1, v).appendTo($ul);
                });
            }

            if (addReduceDetail.artype == constant.quotation().addreduce.TYPE_REDUCE_INT && addReduceDetail.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT) {
                com.focusPage("#discountBtn").removeClass("disabled");
            }

            if (addReduceDetail.managePrice != 0 && addReduceDetail.manageRate != 0) {
                addReduceDetail.isCountManage.prop("checked", true);
            } else {
                addReduceDetail.isCountManage.prop("checked", false);
            }

            if (addReduceDetail.manageDiscount != constant.quotation().addreduce.MANAGEDISCOUNT_NODISCOUNT_INT) {
                addReduceDetail.isCountManageDiscount.prop("checked", true);
            } else {
                addReduceDetail.isCountManageDiscount.prop("checked", false);
            }

            if (addReduceDetail.taxDiscount != constant.quotation().addreduce.TAX_NODISCOUNT_INT) {
                addReduceDetail.isCountTax.prop("checked", true);
            } else if (addReduceDetail.taxPrice != 0 && addReduceDetail.taxRate != 0) {
                addReduceDetail.isCountTax.prop("checked", true);
            } else {
                addReduceDetail.isCountTax.prop("checked", false);
            }

            if (addReduceDetail.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT && addReduceDetail.addReduceItems.length == 0) {

                addReduceDetail.isCountManage.prop("checked", true);
                addReduceDetail.isCountTax.prop("checked", true);
            }

            arCalculator.calculateFees();

            addReduceDetail.init();
            modalEventBinding.init();
            quote.init();
        }
    };
})();

$(function() {

    AddReduceDetail.init();
});