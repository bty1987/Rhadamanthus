var QuotetionDetail = (function() {

    var rtems = {

        quotationRtems: {},
        queryQuotationRtems: function(qiid) {

            var _rtems = [];
            var quotationRtems = this.quotationRtems;
            qiid = parseInt(qiid);

            if (quotationRtems[qiid]) {
                _rtems = quotationRtems[qiid];
            } else {
                com.post(api.quotation.queryQuotationRtem, {
                    "quotationRtem.source.qiid": qiid
                }, function(res) {

                    _rtems = res.quotationRtems;

                    quotationRtems[qiid] = res.quotationRtems;
                }, null, false);
            }

            return _rtems;
        }
    };

    var quo = {

        quotetion: null,

        quotetionid: null, // 报价ID
        versionId: null, // 报价版本
        basicParams: null,
        notSalesmanRate: null,
        decoration: null,
        paymentType: null,
        packageType: null,
        startTime: null,

        modals: {},
        btns: {},
        items: {

            functionAreaName: com.focusPage("#functionAreaName", "#functionAreaModal"),
            functionAreaOrder: com.focusPage("#functionAreaOrder", "#functionAreaModal"),

            name: com.focusPage("#name", "#customItemModal"),
            formula: com.focusPage('#formula', "#customItemModal"),
            num: com.focusPage("#num", "#customItemModal"),
            unitPrice: com.focusPage("#unitPrice", "#customItemModal"),
            addPrice: com.focusPage("#addPrice", "#customItemModal"),
            subPrice: com.focusPage("#subPrice", "#customItemModal"),
            quotetionType: com.focusPage("#quotetionType", "#customItemModal"),
            measurementUnit: com.focusPage("#measurementUnit", "#customItemModal"),
            workType: com.focusPage("#workType", "#customItemModal"),
            discountFlag: com.focusPage("#discountFlag", "#customItemModal"),
            comment: com.focusPage("#comment", "#customItemModal"),

            calculateDiscount: com.focusPage("#calculateDiscount", "#calculateModal"),

            manageRate: com.focusPage("#manageRate", "#manageRateModal"),

            trafficRate: com.focusPage("#trafficRate", "#trafficRateModal"),

            orderIds: com.focusPage("#orderIds", "#orderIdModal"),
        },

        quoteCalculation: {},
        machingType: {},
        typeness: {},
        scales: {},

        initBtns: function() {

            var that = this;

            that.btns = {

                $btnAddDomain: com.focusPage('#functionAreaTemplateBtn').click(function() { // 功能区

                    that.modals.functionAreaTemplateModal.modal("show");
                }),

                $btnDiscount: com.focusPage('#discountBtn').on('click', function() { // 折扣界面

                    that.modals.discountModal.modal("show");
                }),

                $btnCalculateTotal: com.focusPage('#calculateTotalBtn').on('click', function() { // 计算总价

                    that.modals.calculateModal.find('.fl-quo-cal').html(null);

                    com.focusPage("#calculateDiscount").val("");

                    quo.calculateTotalFee(10);

                    quo.servePriceShow();

                    that.modals.calculateModal.find('.machingInfos').hide();

                    that.modals.calculateModal.modal("show");
                }),
                $btnCalculate: com.focusPage('#calculateConsBtn').on('click', function() {

                    com.focusPage("#conStartTime", "#calculateConsModal").val("");
                    com.datetime(com.focusPage("#conStartTime", "#calculateConsModal"));
                    quo.constructionPaceNode();
                    that.modals.calculateConsModal.modal("show");
                }),
                $btnMachingMore: com.focusPage('#machingMoreBtn').on('click', function() {

                    com.focusPage('#calculateModal').find('.machingInfos').toggle();
                }),

                // $btnReport :com.focusPage('#viewStatisticalBtn'), // 统计

                $btnSave: com.focusPage('#saveQuotetionBtn').bindClick(function() { // 保存报价信息

                    com.post(api.quotation.updateQuotetionForAdvance, quo.basicParams, function(res) {

                        com.showAlert(com.info, "操作成功");
                    });
                }, 2000),

                $btnPrint: com.focusPage('#printQuotetionBtn').click(function() { // 打印

                    params.quotation.quotetionId = quo.quotetionid;
                    params.quotation.type = 2;
                    params.quotation.subtype = -1;

                    com.popup("打印报价", api.index.quotetionOutputIndex.url, null, null, true);
                }),

                $btnBack: com.focusPage('#detailBckBtn').on('click', function() { // 返回

                    com.showConfirm("当前页面存在重要数据,是否进行当前操作", function() {

                        com.switchPage(api.index.quotetionIndex.url);
                    });
                }),

                $btnSpread: com.focusPage('#openFunctionAreasBtn').click(function() { // 展开

                    com.focusPage('.icon-chevron-down').parent().trigger('click');
                }),

                $btnCollapse: com.focusPage('#closeFunctionAreasBtn').click(function() { // 收起

                    com.focusPage('.icon-chevron-up').parents('[data-action="collapse"]').trigger('click');
                }),
                $btnOrderId: com.focusPage('#orderIdBtn').click(function() {

                    com.focusPage('#orderIdModal').modal('show');

                }),
            };
            return that;
        },

        initModals: function() { // 弹窗初始化 , 显示/隐藏执行业务

            var that = this;

            that.modals = {

                // 添加功能区
                functionAreaTemplateModal: com.focusPage("#functionAreaTemplateModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="quotempl"]:checked').removeAttr('checked');
                }),

                discountModal: com.focusPage("#discountModal"), // 编辑折扣
                calculateModal: com.focusPage('#calculateModal'), // 计算总价
                calculateConsModal: com.focusPage('#calculateConsModal').on('shown.bs.modal', function(e) {

                    quo.initPlan();
                }),
                functionAreaModal: com.focusPage("#functionAreaModal"), // 编辑功能区

                // 添加默认报价项
                quotetionItemModal: com.focusPage("#quotetionItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
                }),

                // 添加自定义报价项
                customItemModal: com.focusPage("#customItemModal").on("show.bs.modal", function(a) {

                    com.cleanItems(that.items);

                    quo.items.name.val("");
                    quo.items.comment.val("");
                    quo.items.unitPrice.val("");
                    quo.items.addPrice.val("");
                    quo.items.subPrice.val("");
                    quo.items.formula.val("");
                    quo.items.num.val("");
                    quo.items.measurementUnit.get(0).selectedIndex = 0;
                    quo.items.workType.get(0).selectedIndex = 0;
                    quo.items.discountFlag.removeAttr("checked");
                }),

                // 历史记录
                historyItemModal: com.focusPage("#historyItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
                }),

                // 管理费比例设置saveMrBtn
                manageRateModal: com.focusPage('#manageRateModal').on("show.bs.modal", function(a) {

                    quo.items.manageRate.val(null);
                }),

                // 车运费比例设置
                trafficRateModal: com.focusPage('#trafficRateModal').on("show.bs.modal", function(a) {

                    quo.items.trafficRate.val(null);
                }),

                orderIdModal: com.focusPage('#orderIdModal').on("show.bs.modal", function(a) {

                    quo.items.orderIds.val(null);
                }),
            };

            return that;
        },

        initDatas: function() {

            var that = this;

            // 初始化功能区添加弹层 通过版本号查询出来的功能区
            com.post(api.quotation.queryFunctionAreaByVersionId, {
                "functionArea.version.no": that.basicParams["quotetion.version.no"]
            }, function(data) {

                data.functionAreas.length && $.each(data.functionAreas, function(i, v) {

                    if (v.type == constant.data().functionArea.TYPE_MANAGE_INT)
                        return true;

                    var $dtempl = painter.createDomainTemplete(v);

                    that.modals.functionAreaTemplateModal.find('.modal-body').append($dtempl);
                });
            }, null, false);

            com.post(api.common.queryMeasurementUnit, {}, function(res) { // 初始化自定义报价项弹层

                quo.items.measurementUnit.bindData(res.measurementUnits, "name", "name");
            }, null, false);

            com.post(api.common.queryWorkType, {}, function(res) {

                quo.items.workType.bindData(res.workTypes, "name", "name");
            }, null, false);

            com.post(api.quotation.queryQuotationType, {}, function(res) { // 初始化自定义报价中的类型

                quo.items.quotetionType.bindData(res.quotationTypes, "id", "name");
            });

            com.post(api.data.queryDecorationAtttype, {}, function(res) {

                $.each(res.decorationAtttypes, function(i, v) {

                    if (v.status == 0)
                        quo.typeness["typeness[" + i + "]"] = v.key;
                });
            }, null, false);

            com.post(api.data.queryDecorationMatching, quo.typeness, function(res) { // 初始化半价/满减配比

                quo.machingType = res.decorationMatchings;

            });

            return that;
        },

        pageQuotationItemForPrice: function() {

            // 初始化报价项选择弹层
            var extraParams = {
                "quotationItem.version.no": quo.basicParams["quotetion.version.no"],
                "quotationPrice.updateTime": quo.basicParams["quotetion.updateTime"] != null ? quo.basicParams["quotetion.updateTime"] : com.currentTime()
            };

            var postData = "quotetionPartItemPostData";

            if (parseInt(domain.nowEditDomain.attr("data-areatype")) == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT) {
                extraParams["quotationItem.type"] = constant.data().quotationItem.TYPE_CMPREH_INT;
                postData = "quotetionPartItemByCmprehPostData";
            } else {
                extraParams["quotationItem.type"] = null;
            }

            var _condArr = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'quotation-worktype'];

            var searcher = new Searcher();

            // 通过报价版本编号获取分页方式获取状态为启用报价项信息
            searcher.init(_condArr, "condList", api.quotation.pageQuotationItemForPrice, function(data) {

                var $tableWrap = com.focusPage('#resultList').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if (!data || data.length == 0)
                    return false;

                $.each(data, function(i, v) {

                    painter.createQuoteModalItem(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);

                if (!quote.quotesRecord || quote.quotesRecord.length == 0)
                    return false;

                $.each(quote.quotesRecord, function(index, val) {

                    var $input = com.focusPage('input[name="modalQuots"][value="' + $(val).val() + '"]');
                    $input.length && ($input.prop('checked', true));
                });
            }, "pagenation", postData, extraParams);
        },

        // 统计车运费管理费总价折扣价
        calculateQuoFees: function(func) {

            var _discount = utils.accDiv(quo.basicParams['quotetion.discount'], 10);
            var _undisPrice = 0, _disPrice = 0, _costPrice = 0, _unachePrice = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0, _taxfee = 0, _taxRate = 0, _rtemPrice = 0, _consPrice = 0, _comsPrice = 0;

            var $domains = com.focusPage('#functionAreaDetailList .widget-box:not([data-del-sign="1"])');

            if (!$domains.length) {
                return false;
            }

            $domains.each(function() {

                var sum = 0, sumd = 0, sumdp = 0, cost = 0, unache = 0, rtem = 0;

                var $this = $(this);

                var _areaType = $this.attr('data-areaType'); // 功能区类型

                if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_PROJECT_NUM_INT) {

                    if (func)
                        func($this);

                    sum = parseFloat($this.attr('data-undisPrice')); // 非折扣总价格
                    sumdp = parseFloat($this.attr('data-disPrice')); // 折扣总价格
                    sumd = parseFloat($this.attr('data-desTotalprice')); // 折扣后总价格
                    cost = parseFloat($this.attr('data-costPrice'));
                    unache = parseFloat($this.attr('data-unachePrice'));

                    _undisPrice = utils.changeThrDecimal(utils.accAdd(_undisPrice, sum)); // 非折扣总价格
                    _disPrice = utils.changeThrDecimal(utils.accAdd(_disPrice, sumdp)); // 折扣总价格
                    _dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd)); // 格式化折扣后的总价格
                    _costPrice = utils.accAdd(_costPrice, cost);
                    _unachePrice = utils.accAdd(_unachePrice, unache);
                }

                if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) {
                    _undisPrice = $this.attr('data-total') ? $this.attr('data-total') : 0; // 非折扣总价格
                    _dtotalfee = $this.attr('data-total') ? $this.attr('data-total') : 0; // 格式化折扣后的总价格
                    _unachePrice = 0;
                }

                if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_COST_INT) {
                    _costPrice = $this.attr('data-total') ? $this.attr('data-total') : 0;
                }

                if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_ACHIEVEMENT_INT) {
                    _unachePrice = $this.attr('data-total') ? $this.attr('data-total') : 0;

                    sum = parseFloat($this.attr('data-undisPrice')); // 非折扣总价格
                    sumdp = parseFloat($this.attr('data-disPrice')); // 折扣总价格
                    sumd = parseFloat($this.attr('data-desTotalprice')); // 折扣后总价格

                    _undisPrice = utils.changeThrDecimal(utils.accAdd(_undisPrice, sum)); // 非折扣总价格
                    _disPrice = utils.changeThrDecimal(utils.accAdd(_disPrice, sumdp)); // 折扣总价格
                    _dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd)); // 格式化折扣后的总价格
                    _unachePrice = utils.changeThrDecimal(utils.accAdd(_unachePrice, sumd));
                }

                if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT) {
                    sum = parseFloat($this.attr('data-undisPrice'));
                    sumdp = parseFloat($this.attr('data-disPrice'));
                    sumd = parseFloat($this.attr('data-desTotalprice'));
                    cost = parseFloat($this.attr('data-costPrice'));
                    unache = parseFloat($this.attr('data-unachePrice'));
                    rtem = parseFloat($this.attr('data-rtemPrice'));

                    _undisPrice = utils.changeThrDecimal(utils.accAdd(_undisPrice, sum));
                    _disPrice = utils.changeThrDecimal(utils.accAdd(_disPrice, sumdp));
                    _dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd));
                    _costPrice = utils.accAdd(_costPrice, cost);
                    _unachePrice = utils.accAdd(_unachePrice, unache);
                    _rtemPrice = utils.accAdd(_rtemPrice, rtem);
                }

                _consPrice = utils.changeThrDecimal(utils.accAdd(_consPrice, parseFloat($this.attr('data-consPrice'))));
                _comsPrice = utils.changeThrDecimal(utils.accAdd(_comsPrice, parseFloat($this.attr('data-comsPrice'))));
            });

            var manageCost = com.focusPage('#manageCost'); // 管理费
            var converyanceCost = com.focusPage('#conveyanceCost'); // 车运费
            var taxCost = com.focusPage('#taxCost'); // 税金

            _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _discount : 1; // 车运费的折扣
            _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? _discount : 1; // 管理费的折扣
            _taxDiscount = taxCost.length != 0 ? taxCost.find('.discountprice').attr('data-discount') : 0;// 税金折扣

            _tranRate = parseFloat(converyanceCost.find('.discountprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
            _manageRate = parseFloat(manageCost.find('.unitprice').attr('data-unitprice')); // 获取管理费比例(根据报价版本获得)
            _taxRate = parseFloat(taxCost.length != 0 ? taxCost.find('.discountprice .cell-wrap').text() : 0); // 获取税金比例(根据报价版本获得)

            _transfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(_undisPrice, _disPrice), _tranRate)); // 车运费 = (打折项总额+不打折项总额)*车运费比例
            _managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _transfee), _manageRate)); // 管理费 = (打折项总额+不打折项总额+车运费)*管理费比例

            _dtransfee = utils.changeThrDecimal(utils.accMul(_transfee, _transDiscount)); // 车运费*车运费折扣
            _dmanagefee = utils.changeThrDecimal(utils.accMul(_managefee, _manageDiscount)); // (打折项总额+不打折项总额+车运费)*管理费比例*管理费折扣
            _dtaxfee = 0;

            if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) {
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee), _taxRate));
                _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
            }

            if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) {
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee), _managefee), _taxRate));
                _dtaxfee = _taxfee;
            }

            _total = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee), _managefee), _taxfee)));

            if (quo.basicParams["quotetion.basePrice"] && quo.basicParams["quotetion.basePrice"] != 0) {
                // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
                var total = utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee); // 工程基数
                var remainder = utils.changeThrDecimal(total % quo.basicParams['quotetion.basePrice']); // 余数
                _dtotal = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), _discount), remainder), _dmanagefee), _dtaxfee)));
            } else {
                // 折扣价 = (不打折总和+ 打折项折后总额 +折扣后的车运费)+折扣后的管理费(打折后的总价格)
                _dtotal = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(_dtotalfee, _dtransfee), _dmanagefee), _dtaxfee)));
            }

            converyanceCost.find('.num .cell-wrap').text(_dtransfee); // 显示到生成项目 车运费(折扣后的车运费)
            manageCost.find('.num .cell-wrap').text(_dmanagefee); // 显示到生成项目 管理费(折扣后的管理费)
            taxCost.find('.num .cell-wrap').text(_taxfee);// 显示到生成项目 税金(未折扣的管理费)

            com.focusPage('#costPrice').text(utils.changeThrDecimal(_costPrice)); // 显示到左上角的折扣价
            com.focusPage('#sumquoSumMoney').text(utils.changeThrDecimal(_total)); // 显示到左上角的总价
            com.focusPage('#sumquoDiscountMoney').text(_dtotal); // 显示到左上角的折扣价
            com.focusPage('#taxPrices').text(_taxfee);

            if (quo.notSalesmanRate) {

                var notpoint = 0, notManage = 0, notTotal = 0, rate = 0;

                if (quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) {
                    notpoint = utils.changeThrDecimal(utils.accMul(utils.accAdd(_disPrice, utils.accAdd(_undisPrice, _transfee)), quo.notSalesmanRate));
                    rate = utils.changeThrDecimal(utils.accAdd(quo.notSalesmanRate, _manageRate));
                } else {
                    notpoint = quo.notSalesmanRate;
                    rate = _manageRate;
                }

                notManage = utils.changeThrDecimal(utils.accAdd(_dmanagefee, notpoint));
                notTotal = utils.changeThrDecimal(utils.accAdd(_total, notpoint));

                manageCost.find('.unitprice .cell-wrap').text(rate);
                manageCost.find('.discountprice .cell-wrap').text(rate);
                manageCost.find('.totalprice-discount .cell-wrap').text(rate);
                manageCost.find('.num .cell-wrap').text(notManage);
                com.focusPage('#sumquoSumMoney').text(notTotal);
            }

            quo.basicParams["quotetion.totalPrice"] = _dtotal; // 报价总额
            quo.basicParams["quotetion.manageRate"] = _manageRate; // 管理费比例
            quo.basicParams["quotetion.managePrice"] = _managefee; // 管理费
            quo.basicParams["quotetion.trafficPrice"] = _transfee; // 车运费
            quo.basicParams["quotetion.trafficRate"] = _tranRate; // 车运费比例
            quo.basicParams["quotetion.taxPrice"] = _taxfee;// 税金
            quo.basicParams["quotetion.taxRate"] = _taxRate;// 税金比例
            quo.basicParams["quotetion.undisPrice"] = _undisPrice; // 非打折项折前总额
            quo.basicParams["quotetion.disPrice"] = _disPrice; // 打折项折前总额
            quo.basicParams["quotetion.costPrice"] = utils.changeThrDecimal(_costPrice); // 成本总额
            quo.basicParams["quotetion.unachePrice"] = utils.changeThrDecimal(_unachePrice);
            quo.basicParams["quotetion.consPrice"] = _consPrice;
            quo.basicParams["quotetion.comsPrice"] = _comsPrice;

        },

        // 计算功能区总价和折扣总价
        calculateDomainFees: function($domain, func) {

            var _domanFees = 0, sum = 0, sumd = 0, sumdp = 0, cost = 0, unache = 0, rtem = 0, cons = 0, coms = 0;

            var _areaType = $domain.attr("data-areaType");

            if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_PROJECT_NUM_INT || _areaType == constant.quotation().quotetionFunctionArea.TYPE_COST_INT || _areaType == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT) {

                var $arr = com.focusPage('.fl-quo-item.item:not([data-del-sign="1"])', $domain);

                if ($arr.length) {
                    $arr.each(function() {

                        $this = $(this);

                        if (func)
                            func($this);

                        var _type = $this.find(".cell.type").attr("data-type");
                        var _subtype = $this.find('.cell.num').attr('data-subtype');

                        var _undisPrice = parseFloat($this.attr("data-undisPrice")); // 报价项非折扣总价
                        var _disPrice = parseFloat($this.attr("data-disPrice")); // 报价项折扣总价
                        var _totlaPriceDiscount = parseFloat($this.find('.totalprice-discount .cell-wrap').text()); // 折扣后的一个工程的(折扣单价*数量)
                        var _costPrice = parseFloat($this.attr("data-costPrice"));
                        var _unachePrice = parseFloat($this.attr("data-unachePrice"));
                        var _rtemPrice = parseFloat($this.attr("data-rtemPrice"));
                        var _consPrice = parseFloat($this.attr("data-consPrice"));
                        var _comsPrice = parseFloat($this.attr("data-comsPrice"));

                        if (_subtype == constant.quotation().quotetionFunctionAreaItem.SUBTYPE_PROJECT_INT) {
                            cons = utils.changeThrDecimal(utils.accAdd(cons, _consPrice));
                        }

                        if (_subtype != constant.quotation().quotetionFunctionAreaItem.SUBTYPE_PROJECT_INT) {
                            coms = utils.changeThrDecimal(utils.accAdd(coms, _comsPrice));
                        }

                        if (_type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT || _type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT) {
                            sum = utils.changeThrDecimal(utils.accAdd(sum, _undisPrice));// 无折扣总价
                            sumdp = utils.changeThrDecimal(utils.accAdd(sumdp, _disPrice));// 折扣总价
                            sumd = utils.changeThrDecimal(utils.accAdd(sumd, _totlaPriceDiscount));// 折扣后的总价格
                        }

                        if (_type == constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT) {
                            cost = utils.changeThrDecimal(utils.accAdd(cost, _costPrice));
                        }

                        if (_type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT) {
                            sum = utils.changeThrDecimal(utils.accAdd(sum, _undisPrice));// 无折扣总价
                            sumdp = utils.changeThrDecimal(utils.accAdd(sumdp, _disPrice));// 折扣总价
                            sumd = utils.changeThrDecimal(utils.accAdd(sumd, _totlaPriceDiscount));// 折扣后的总价格

                            unache = utils.changeThrDecimal(utils.accAdd(unache, _unachePrice));
                        }

                        if (_type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT) {

                            rtem = utils.changeThrDecimal(utils.accAdd(rtem, _rtemPrice));
                        }
                    });
                }

                _domanFees = sumd;
            }

            if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) {

                sum = $domain.attr('data-total'); // 无折扣总价
                sumdp = 0;// 折扣总价
                sumd = $domain.attr('data-total'); // 折扣后的总价格
                cost = 0;
                unache = 0;

                _domanFees = $domain.attr('data-total');
            }

            if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_COST_INT) {

                cost = sum;

                sum = 0; // 无折扣总价
                sumdp = 0; // 折扣总价
                sumd = 0; // 折扣后的总价格
                unache = 0;

                _domanFees = 0;
            }

            if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_ACHIEVEMENT_INT) {

                cost = 0;
                unache = sumd;
            }

            $domain.attr('data-undisPrice', sum); // 总价格存入
            $domain.attr('data-desTotalprice', sumd); // 折扣后的总价格
            $domain.attr('data-disPrice', sumdp); // 折扣项总价
            $domain.attr('data-costPrice', cost); // 成本总额
            $domain.attr('data-unachePrice', unache);
            $domain.attr('data-rtemPrice', rtem);
            $domain.attr('data-consPrice', cons);
            $domain.attr('data-comsPrice', coms);

            return _domanFees;
        },

        // 计算报价项各种值
        calculateQuoteFee: function($quote) {

            var _num = parseFloat($quote.find('.num .cell-wrap').text());
            var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
            var _discountFlag = $quote.find('.discountprice').attr('data-discount'); // 1打折, 0不打折
            var _discountprice = utils.changeThrDecimal(utils.accMul(_unitprice, (_discountFlag == constant.quotation().quotetionFunctionAreaItem.DISCOUNT_DISCOUNT_INT ? utils.accDiv(quo.basicParams['quotetion.discount'], 10) : 1)));

            var _discount = $quote.find('.discountprice').attr('data-discount');// 1打折,0不打折

            var _totalprice = utils.changeThrDecimal(utils.accMul(_num, _unitprice));
            var _totalpriced = utils.changeThrDecimal(utils.accMul(_num, _discountprice));

            $quote.find('.discountprice .cell-wrap').text(_discountprice);
            $quote.find('.totalprice-discount .cell-wrap').text(_totalpriced);

            $quote.attr('data-totalprice', _totalprice);
            $quote.attr('data-costPrice', _totalprice);
            $quote.attr('data-unachePrice', _totalprice);
        },

        // 计算报价总金额
        calculateTotalFee: function(discount) {

            var _manageDiscount, _transDiscount, _totalfee = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0, _total = 0, cdiscount = 0, ndiscount = 0;

            var _undisPrice = quo.basicParams["quotetion.undisPrice"];
            var _disPrice = quo.basicParams["quotetion.disPrice"];
            var _dtransfee = quo.basicParams["quotetion.trafficPrice"];
            var _dmanagefee = quo.basicParams["quotetion.managePrice"];
            var _costfee = quo.basicParams["quotetion.costPrice"];
            var _unachefee = quo.basicParams["quotetion.unachePrice"];
            var _dtaxfee = quo.basicParams["quotetion.taxPrice"];
            var _dtaxRate = quo.basicParams["quotetion.taxRate"];
            var _dtaxDiscount = quo.basicParams["quotetion.taxDiscount"];

            var _discount = utils.accDiv(discount, 10);

            var total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), _dmanagefee)); // 折前总额
            var dtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), _dtransfee), _dmanagefee), _dtaxfee)); // 半包折扣总额
            var bbtotal = utils.changeThrDecimal(utils.accMul(utils.accAdd(total, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 0 : _dtaxfee), utils.accAdd(1, utils.accMul(_dtaxRate, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 1 : 0))));
            dtotal = utils.changeThrDecimal(utils.accMul(utils.accAdd(dtotal, _dtaxfee), utils.accAdd(1, utils.accMul(_dtaxRate, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 1 : 0))));

            var table = com.focusPage('#calculateModal').find('.fl-quo-cal').html(null);

            var divItem1 = $('<div></div>').addClass('fl-quo-cal-item');

            divItem1.append(createCalItem("基础", 'normal border-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-info'));
            divItem1.append(createCalItem("", 'small border-left-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left alert-info'));
            divItem1.append(createCalItem("", 'normal').addClass("hide"));
            divItem1.append(createCalItem("", 'normal').addClass("hide"));
            divItem1.append(createCalItem("", 'normal').addClass("hide"));
            divItem1.append(createCalItem("", 'normal').addClass("hide"));
            divItem1.append(createCalItem("装修", 'normal alert-success'));
            divItem1.append(createCalItem("主材", 'small border-right alert-danger material'));
            divItem1.append(createCalItem("", 'normal border-left alert-danger'));
            divItem1.append(createCalItem("综合", 'normal border-left-right alert-warning cmpreh'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-warning'));
            divItem1.append(createCalItem("", 'normal border-left alert-warning'));

            divItem1.appendTo(table);

            var divItem2 = $('<div></div>').addClass('fl-quo-cal-item');

            divItem2.append(createCalItem("版本", 'normal'));
            divItem2.append(createCalItem("折前总价", 'normal'));
            divItem2.append(createCalItem("折扣", 'small'));
            divItem2.append(createCalItem("打折总额", 'normal'));
            divItem2.append(createCalItem("非打折总额", 'normal'));
            divItem2.append(createCalItem("非业绩", 'normal').addClass("hide"));
            divItem2.append(createCalItem("管理费", 'normal').addClass("hide"));
            divItem2.append(createCalItem("税金", 'normal').addClass("hide"));
            divItem2.append(createCalItem("优惠", 'normal').addClass("hide"));
            divItem2.append(createCalItem("折后总价", 'normal'));
            divItem2.append(createCalItem("配比", 'small material'));
            divItem2.append(createCalItem("主材额", 'normal materialPrice'));
            divItem2.append(createCalItem("服务费", 'normal servicePrice'));
            divItem2.append(createCalItem("团队服务费", 'normal servePayment'));
            divItem2.append(createCalItem("实花总额", ' normal alert-warning'));

            divItem2.appendTo(table);

            var labels = com.focusPage('#calculateModal').find('.machingInfos').html(null);

            $.each(quo.machingType, function(i, v) {

                if ((v.vision & 1) != constant.data().decorationMatching.VISION_QUOTEDISCOUNT_INT)
                    return true;

                var scale = 0;

                _manageDiscount = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? _discount : 1; // 管理费折扣
                _transDiscount = v.transDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _discount : 1; // 车运费折扣

                var $label = $('<label></label>').addClass('col-xs-2').appendTo(labels);
                var $radio = $('<input>').addClass('ace').attr({
                    "name": "machingInfos",
                    "type": "checkbox",
                    "checked": v.isShow == constant.data().decorationMatching.ISSHOW_SHOW_INT ? true : false
                }).val(v.dmid).appendTo($label);
                var $span = $('<span></span>').addClass('lbl').text(v.name).appendTo($label);

                $radio.click(function() {

                    var info = com.focusPage('#calculateModal').find('.dmid' + v.dmid);

                    if ($(this).is(":checked") == false) {
                        info.attr("data-show", 1);
                        info.hide();
                    } else {
                        info.attr("data-show", 0);
                        info.show();
                    }

                    v.isShow = $(this).is(":checked") == false ? constant.data().decorationMatching.ISSHOW_HIDE_INT : constant.data().decorationMatching.ISSHOW_SHOW_INT;

                    quo.servePriceShow();
                });

                var _dtaxfee = 0;

                if (v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) {
                    _dtaxfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), _dtaxRate));
                }

                if (v.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) {
                    _dtaxfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), _managefee), _dtaxRate));
                }

                var _ddtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), _dmanagefee), _dtaxfee));

                if (v.base && v.base != 0) {

                    _ddmanagefee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dmanagefee, utils.accDiv(v.discount, 10))) : _dmanagefee;
                    _ddtaxfee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtaxfee, utils.accDiv(v.discount, 10))) : _dtaxfee;

                    _cdiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), (v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? _dtaxfee : 0) : 0)));
                    _ndiscount = utils.changeThrDecimal(v.manageDiscount == constant.data().quotationVersion.MANAGE_NODISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? _dtaxfee : 0) : 0);

                    var materialPrice = utils.changeTwoDecimal(utils.accMul(_ddtotal, v.material));
                    var servicePrice = utils.changeTwoDecimal(utils.accMul(materialPrice, v.service));

                    var _totalProject = utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee); // 工程总额
                    var _balance = utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee) % v.base; // 余数 = 工程总额%基数

                    var servePayment = utils.changeThrDecimal(utils.accMul(materialPrice, utils.accDiv(quo.scales[v.typeness] ? parseFloat(quo.scales[v.typeness]) : quo.paymentType.rate ? quo.paymentType.rate : 0, 100)));

                    // 满减折后总额 //折后工程总额=(工程总额-余数)*折扣 + (余数) + 管理费
                    var _projectPrice = utils.changeTwoDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(_totalProject, _balance), utils.accDiv(v.discount, 10)), _balance), _ddmanagefee), _ddtaxfee));
                    var $_total = utils.changeTwoDecimal(utils.accAdd(_projectPrice, utils.accAdd(servePayment, utils.accAdd(materialPrice, servicePrice))));

                    var halfPriceDiv = $('<div></div>').addClass('fl-quo-cal-item');

                    halfPriceDiv.append(createCalItem(v.name, 'normal'));
                    halfPriceDiv.append(createCalItem(_ddtotal, 'normal'));
                    halfPriceDiv.append(createCalItem(v.discount, 'small'));
                    halfPriceDiv.append(createCalItem(_cdiscount, 'normal'));
                    halfPriceDiv.append(createCalItem(_ndiscount, 'normal'));
                    halfPriceDiv.append(createCalItem(_unachefee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_ddmanagefee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_ddtaxfee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_costfee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_projectPrice, 'normal'));
                    halfPriceDiv.append(createCalItem(utils.accMul(v.material, 100) + "%", 'small'));
                    halfPriceDiv.append(createCalItem(materialPrice, 'normal comsPrice'));
                    halfPriceDiv.append(createCalItem(servicePrice, 'normal servicePrice'));
                    halfPriceDiv.append(createCalItem(servePayment, 'normal servePayment'));
                    halfPriceDiv.append(createCalItem($_total, 'normal alert-warning'));

                    halfPriceDiv.addClass('dmid' + v.dmid).attr("data-show", v.isShow).appendTo(table);

                    v.isShow != constant.data().decorationMatching.ISSHOW_SHOW_INT ? halfPriceDiv.hide() : halfPriceDiv.show();
                } else {
                    _ddtransfee = v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtransfee, _discount)) : _dtransfee;
                    _ddmanagefee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dmanagefee, _discount)) : _dmanagefee;
                    _ddtaxfee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtaxfee, utils.accDiv(v.discount, 10))) : _dtaxfee;

                    _cdiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_disPrice, (v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _ddtransfee : 0)), (v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? _dtaxfee : 0) : 0)));
                    _ndiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_undisPrice, (v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_NODISCOUNT_INT ? _ddtransfee : 0)), (v.manageDiscount == constant.data().quotationVersion.MANAGE_NODISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? _dtaxfee : 0) : 0)));

                    var materialPrice = utils.changeTwoDecimal(utils.accMul(_ddtotal, v.material));
                    var servicePrice = utils.changeTwoDecimal(utils.accMul(materialPrice, v.service));

                    var servePayment = utils.changeThrDecimal(utils.accMul(materialPrice, utils.accDiv(quo.scales[v.typeness] ? parseFloat(quo.scales[v.typeness]) : quo.paymentType.rate ? quo.paymentType.rate : 0, 100)));

                    var _projectPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), _ddtransfee), _ddmanagefee), _ddtaxfee));
                    var $_total = utils.changeTwoDecimal(utils.accAdd(_projectPrice, utils.accAdd(servePayment, utils.accAdd(materialPrice, servicePrice))));

                    var halfPacksDiv = $('<div></div>').addClass('fl-quo-cal-item');

                    halfPacksDiv.append(createCalItem(v.name, 'normal'));
                    halfPacksDiv.append(createCalItem(_ddtotal, 'normal'));
                    halfPacksDiv.append(createCalItem(discount, 'small'));
                    halfPacksDiv.append(createCalItem(_cdiscount, 'normal'));
                    halfPacksDiv.append(createCalItem(_ndiscount, 'normal'));
                    halfPacksDiv.append(createCalItem(_unachefee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_ddmanagefee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_ddtaxfee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_costfee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_projectPrice, 'normal'));
                    halfPacksDiv.append(createCalItem(utils.accMul(v.material, 100) + "%", 'small'));
                    halfPacksDiv.append(createCalItem(materialPrice, 'normal comsPrice'));
                    halfPacksDiv.append(createCalItem(servicePrice, 'normal servicePrice'));
                    halfPacksDiv.append(createCalItem(servePayment, 'normal servePayment'));
                    halfPacksDiv.append(createCalItem($_total, 'normal alert-warning'));

                    halfPacksDiv.addClass('dmid' + v.dmid).attr("data-show", v.isShow).appendTo(table);

                    v.isShow != constant.data().decorationMatching.ISSHOW_SHOW_INT ? halfPacksDiv.hide() : halfPacksDiv.show();
                }
            });

            if (quo.packageType) {

                var $packageTypeDiv = com.focusPage('#calculateModal').find('#packageType').html(null);

                $.each(quo.packageType, function(i, v) {

                    var div = createCalItem("", 'normal border-left-right alert-danger packageType' + i + '');
                    var name = createCalItem(v[0], 'normal packageType' + i + '');
                    var price = createCalItem(v[1], 'normal packageType' + i + '');

                    v[2] == 1 ? div.hide() : div.show();
                    v[2] == 1 ? name.hide() : name.show();
                    v[2] == 1 ? price.hide() : price.show();

                    divItem1.find('.material').after(div);
                    divItem2.find('.materialPrice').after(name);
                    table.find('.fl-quo-cal-item .comsPrice').after(price);

                    var $label = $('<label></label>').addClass('col-xs-2').appendTo($packageTypeDiv);
                    var $radio = $('<input>').addClass('ace').attr({
                        "name": "packageType",
                        "type": "checkbox",
                        "checked": v[2] == 0 ? true : false
                    }).val(i).appendTo($label);
                    var $span = $('<span></span>').addClass('lbl').text(v[0]).appendTo($label);

                    $radio.click(function() {

                        var info = com.focusPage('#calculateModal').find('.packageType' + i);

                        if ($(this).is(":checked") == false) {
                            v[2] = 1;
                            info.hide();
                        } else {
                            v[2] = 0;
                            info.show();
                        }
                    });
                });
            }

            function createCalItem(text, inclass) {

                return $('<div></div>').html(text).css({
                    "text-overflow": "ellipsis",
                    "overflow": "hidden",
                    "white-space": "nowrap"
                }).addClass('cell').addClass(inclass);
            }
        },

        servePriceShow: function() {

            var $cal = com.focusPage('#calculateModal').find('.fl-quo-cal');

            $cal.find('.fl-quo-cal-item .cmpreh').next('.cell.normal').hide();
            $cal.find('.fl-quo-cal-item .cmpreh').next('.cell.normal').next('.cell.normal').hide();
            $cal.find('.fl-quo-cal-item .servicePrice').hide();
            $cal.find('.fl-quo-cal-item .servePayment').hide();

            $cal.each(function() {

                var serviceItem = $(this).find('.fl-quo-cal-item:not([data-show="1"])');

                serviceItem.each(function() {

                    var servePrice = $(this).find('.servicePrice').text();
                    var servePayment = $(this).find('.servePayment').text();

                    servePrice = parseFloat(servePrice) ? parseFloat(servePrice) : 0;
                    servePayment = parseFloat(servePayment) ? parseFloat(servePayment) : 0;

                    if (servePrice != 0) {
                        $cal.find('.fl-quo-cal-item .cmpreh').next('.cell.normal').show();
                        $cal.find('.fl-quo-cal-item .servicePrice').show();
                    }

                    if (servePayment != 0) {
                        $cal.find('.fl-quo-cal-item .cmpreh').next('.cell.normal').next('.cell.normal').show();
                        $cal.find('.fl-quo-cal-item .servePayment').show();
                    }
                })
            });
        },

        constructionPaceNode: function() {

            var cpid = 0;

            if (quo.decoration) {
                com.post(api.data.queryConstructionPace, {
                    "constructionPace.lowerArea": quo.decoration.house.innerArea
                }, function(res) {

                    if (res.constructionPace.cpid != null)
                        cpid = res.constructionPace.cpid;
                }, null, false);
            }

            var searcher = new Searcher();

            searcher.set("nodeCondList", "nodePagenation", "nodeResultList", api.data.queryConstructionPaceNode, {
                "constructionPaceNode.cpid": cpid
            }, null, null, "constructionPaceNodes", true);

            var lineprops = [{
                fieId: "name",
                name: "名称",
                prop: "name",
                clazz: "grey"
            }, {
                fieId: "connum",
                name: "工程天数",
                prop: "connum",
                clazz: "blue"
            }, {
                field: "conStartTime",
                name: "工程开始时间",
                prop: function(v) {

                    if (com.focusPage("#conStartTime").val() == "")
                        return "";

                    var conStartTime = quo.startTime;

                    conStartTime.setDate(quo.startTime.getDate());

                    return com.dateFormat(conStartTime, "yyyy-MM-dd");
                },
                clazz: "green"
            }, {
                field: "conEndTime",
                name: "工程结束时间",
                prop: function(v) {

                    if (com.focusPage("#conStartTime").val() == "")
                        return "";

                    var conStartTime = quo.startTime;

                    conStartTime.setDate(quo.startTime.getDate() + v.connum);

                    return com.dateFormat(conStartTime, "yyyy-MM-dd");
                },
                clazz: "green"
            }, {
                fieId: "comnum",
                name: "主材天数",
                prop: "comnum",
                clazz: "blue"
            }, {
                field: "comStartTime",
                name: "主材开始时间",
                prop: function(v) {

                    if (com.focusPage("#conStartTime").val() == "")
                        return "";

                    var conStartTime = quo.startTime;

                    conStartTime.setDate(quo.startTime.getDate());

                    return com.dateFormat(conStartTime, "yyyy-MM-dd");
                },
                clazz: "green"
            }, {
                field: "comEndTime",
                name: "主材结束时间",
                prop: function(v) {

                    if (com.focusPage("#conStartTime").val() == "")
                        return "";

                    var conStartTime = quo.startTime;

                    conStartTime.setDate(quo.startTime.getDate() + v.comnum);

                    return com.dateFormat(conStartTime, "yyyy-MM-dd");
                },
                clazz: "green"
            }, {
                fieId: "phase",
                name: "施工节点",
                prop: "phase",
                clazz: "blue",
            }, {
                fieId: "material",
                name: "配套主材",
                prop: "material",
                clazz: "blue",
            }, {
                fieId: "period",
                name: "进场周期",
                prop: "period",
                clazz: "blue",
            }, {
                fieId: "content",
                name: "说明",
                prop: "content",
                clazz: "grey"
            }, {
                fieId: "comment",
                name: "注释",
                prop: "comment",
                clazz: "grey"
            }];

            searcher.line("name", lineprops, []).render();
        },

        initPlan: function() {

            com.focusPage('#calendar').fullCalendar('destroy');
            com.focusPage('#calendar').fullCalendar('today');

            com.focusPage('#calendar').fullCalendar($.extend(com.calendardefault, {
                dayClick: function() {

                    return false;
                },
                eventClick: function() {

                    return false;
                },
                eventRender: function(event, element) {

                    element.off('click');
                },
                viewRender: function(view, element) {

                    $('.fc-day').off('click').css('pointer-events', 'none');
                    $('.fc-event').off('click').css('pointer-events', 'none');
                },
                events: function(start, end, callback) {

                    var startTime = com.dateFormat(new Date(start));
                    var endTime = com.dateFormat(new Date(end));

                    var options = {
                        "constructionInfo.startTime": startTime,
                        "constructionInfo.endTime": endTime
                    };

                    com.post(api.construction.countConstructionInfo, options, function(res) {

                        var counts = res.count;
                        var events = [];

                        for ( var i in counts) {

                            var _ = counts[i];
                            var _date = _[0] + "";

                            var event = {
                                title: "已放线" + _[1] + "户",
                                start: new Date(_date.substr(0, 4), _date.substr(4, 2) - 1, _date.substr(6, 2)),
                                allDay: true
                            };

                            events.push(event);
                        }

                        callback(events);
                    });
                }
            }));
            $('.fc-day').off('click').css('pointer-events', 'none');
        },

        calculateNowQuoteItem: function(num, areaType, $nowLine) {

            var type = $nowLine.find(".cell.type").attr("data-type");
            var subtype = $nowLine.find(".cell.num").attr("data-subtype");
            var discount = $nowLine.find('.discountprice').attr('data-discount');

            var _discount = utils.accDiv(quo.basicParams['quotetion.discount'], 10);

            var price = parseFloat($nowLine.find('.unitprice .cell-wrap').text());// 单价
            var dprice = parseFloat($nowLine.find('.discountprice .cell-wrap').text());// 折扣单价

            $nowLine.find('.totalprice-discount .cell-wrap').text(utils.changeThrDecimal(utils.accMul(dprice, num))); // 折扣单价*数量

            $nowLine.attr('data-undisPrice', discount == constant.quotation().quotetionFunctionAreaItem.DISCOUNT_NODISCOUNT_INT && (type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT || type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT || type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT || type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT) ? utils.changeThrDecimal(utils.accMul(num, dprice)) : 0);
            $nowLine.attr('data-disPrice', discount == constant.quotation().quotetionFunctionAreaItem.DISCOUNT_DISCOUNT_INT && (type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT || type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT || type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT || type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT) ? utils.changeThrDecimal(utils.accMul(num, dprice)) : 0);
            $nowLine.attr('data-costPrice', type == constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT ? utils.changeThrDecimal(utils.accMul(num, dprice)) : 0);
            $nowLine.attr('data-unachePrice', type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT ? utils.changeThrDecimal(utils.accMul(num, utils.accMul(price, discount == constant.quotation().quotetionFunctionAreaItem.DISCOUNT_NODISCOUNT_INT ? 1 : _discount))) : 0);
            $nowLine.attr('data-rtemPrice', type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(num, dprice)) : 0);
            $nowLine.attr('data-consPrice', subtype == constant.quotation().quotetionFunctionAreaItem.SUBTYPE_PROJECT_INT ? utils.changeThrDecimal(utils.accMul(num, price)) : 0);
            $nowLine.attr('data-comsPrice', subtype != constant.quotation().quotetionFunctionAreaItem.SUBTYPE_PROJECT_INT ? utils.changeThrDecimal(utils.accMul(num, price)) : 0);

            var _fee = quo.calculateDomainFees($nowLine.parents('.widget-box'));

            quo.calculateQuoFees();

            return _fee;
        },

        init: function() {

            this.initModals();
            this.initBtns();
            this.initDatas();
        }
    };

    // 功能区
    var domain = {
        nowEditDomain: null,

        // 编辑功能区
        editDomain: function($domain) {

            this.nowEditDomain = $domain;

            com.focusPage("#functionAreaName").val($domain.find('.widget-header strong').text());
            com.focusPage("#functionAreaOrder").val($domain.attr('data-dlevel'));

            // 加载功能区参数
            com.focusPage("#girth", "#functionAreaModal").val($domain.attr("data-girth") ? $domain.attr("data-girth") : 0);
            com.focusPage("#area", "#functionAreaModal").val($domain.attr("data-area") ? $domain.attr("data-area") : 0);
            com.focusPage("#height", "#functionAreaModal").val($domain.attr("data-height") ? $domain.attr("data-height") : 0);
            com.focusPage("#holeLength", "#functionAreaModal").val($domain.attr("data-holeLength") ? $domain.attr("data-holeLength") : 0);
            com.focusPage("#holeHeight", "#functionAreaModal").val($domain.attr("data-holeHeight") ? $domain.attr("data-holeHeight") : 0);
            com.focusPage("#windowLength", "#functionAreaModal").val($domain.attr("data-windowLength") ? $domain.attr("data-windowLength") : 0);
            com.focusPage("#windowHeight", "#functionAreaModal").val($domain.attr("data-windowHeight") ? $domain.attr("data-windowHeight") : 0);
            com.focusPage("#beamLength", "#functionAreaModal").val($domain.attr("data-beamLength") ? $domain.attr("data-beamLength") : 0);
            com.focusPage("#beamHeight", "#functionAreaModal").val($domain.attr("data-beamHeight") ? $domain.attr("data-beamHeight") : 0);

            quo.modals.functionAreaModal.modal("show");

            return false;
        },

        // 编辑功能区保存按钮点击
        saveDomainEdit: function() {

            var that = this;

            com.focusPage('#saveFunctionAreaBtn').on('click', function() { // 编辑功能区页面

                if (com.validate("functionAreaModal")) {
                    return false;
                }

                var _dname = com.focusPage("#functionAreaName").val();
                var _dorder = com.focusPage("#functionAreaOrder").val();

                // 获取功能区参数
                var _girth = com.focusPage("#girth", "#functionAreaModal").val();
                var _area = com.focusPage("#area", "#functionAreaModal").val();
                var _height = com.focusPage("#height", "#functionAreaModal").val();
                var _holeLength = com.focusPage("#holeLength", "#functionAreaModal").val();
                var _holeHeight = com.focusPage("#holeHeight", "#functionAreaModal").val();
                var _windowLength = com.focusPage("#windowLength", "#functionAreaModal").val();
                var _windowHeight = com.focusPage("#windowHeight", "#functionAreaModal").val();
                var _beamLength = com.focusPage("#beamLength", "#functionAreaModal").val();
                var _beamHeight = com.focusPage("#beamHeight", "#functionAreaModal").val();

                var _params = $.extend({}, {
                    "quotetionFunctionArea.name": _dname,// 功能区名 ;
                    "quotetionFunctionArea.functionAreaOrder": _dorder,// 排序 ;
                    "quotetionFunctionArea.qfaId": that.nowEditDomain.attr('data-qfaid'), // 功能区Id ;

                    "quotetionFunctionArea.quotetionFunctionAreaParam.girth": _girth,
                    "quotetionFunctionArea.quotetionFunctionAreaParam.area": _area,
                    "quotetionFunctionArea.quotetionFunctionAreaParam.height": _height,
                    "quotetionFunctionArea.quotetionFunctionAreaParam.holeLength": _holeLength,
                    "quotetionFunctionArea.quotetionFunctionAreaParam.holeHeight": _holeHeight,
                    "quotetionFunctionArea.quotetionFunctionAreaParam.windowLength": _windowLength,
                    "quotetionFunctionArea.quotetionFunctionAreaParam.windowHeight": _windowHeight,
                    "quotetionFunctionArea.quotetionFunctionAreaParam.beamLength": _beamLength,
                    "quotetionFunctionArea.quotetionFunctionAreaParam.beamHeight": _beamHeight,
                }, quo.basicParams);

                var _paramsHide = $.extend({}, {
                    "quotetionFunctionArea.name": _dname,// 功能区名 ;
                    "quotetionFunctionArea.functionAreaOrder": _dorder,// 排序 ;
                    "quotetionFunctionArea.qfaId": that.nowEditDomain.attr('data-qfaid'), // 功能区Id ;
                }, quo.basicParams);

                // 根据 modal 是否有 parameter class 决定是否包含参数
                if (!quo.modals.functionAreaModal.hasClass("parameter")) {
                    _params = _paramsHide;
                }

                com.post(api.quotation.updateQuotetionFunctionArea, _params, function(res) {

                    var $dOrder = that.nowEditDomain.find('.widget-header em');
                    var $dname = that.nowEditDomain.find('.widget-header strong');
                    var $domains = that.nowEditDomain.siblings('.widget-box');

                    $dname.html(_dname);
                    $dOrder.html(_dorder);

                    that.nowEditDomain.attr('data-dlevel', _dorder);
                    that.insertDomainByOrder(_dorder, that.nowEditDomain, $domains, true);

                    // 更新 DOM 属性
                    that.nowEditDomain.attr("data-girth", _girth);
                    that.nowEditDomain.attr("data-area", _area);
                    that.nowEditDomain.attr("data-height", _height);
                    that.nowEditDomain.attr("data-holeLength", _holeLength);
                    that.nowEditDomain.attr("data-holeHeight", _holeHeight);
                    that.nowEditDomain.attr("data-windowLength", _windowLength);
                    that.nowEditDomain.attr("data-windowHeight", _windowHeight);
                    that.nowEditDomain.attr("data-beamLength", _beamLength);
                    that.nowEditDomain.attr("data-beamHeight", _beamHeight);

                    var _index = that.nowEditDomain.index();
                    var $dmoney = com.focusPage('[data-qfaid="' + that.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList');

                    $dmoney.find('.order').text(_dorder);
                    $dmoney.find('.name').text(_dname);
                    $dmoney.remove();

                    if (_index != 0) {
                        $dmoney.insertAfter(com.focusPage('#functionAreaSumList > div').eq(_index - 1));
                    } else {
                        $dmoney.insertBefore(com.focusPage('#functionAreaSumList > div').eq(0));
                    }

                    quo.modals.functionAreaModal.modal("hide");

                }, null, false);

            });
        },

        // 参数显示/隐藏切换
        paramsDomainEdit: function() {

            com.focusPage('#paramsFunctionAreasBtn').click(function() {

                if (quo.modals.functionAreaModal.hasClass("parameter")) {
                    quo.modals.functionAreaModal.find(".parameter").hide();
                    quo.modals.functionAreaModal.removeClass("parameter");
                } else {
                    quo.modals.functionAreaModal.find(".parameter").show();
                    quo.modals.functionAreaModal.addClass("parameter");
                }

                com.closeTip();
            });
        },

        // 删除功能区
        deletDomain: function($domain) {

            com.showConfirm("是否确定要删除功能区", function() {

                var $itemlist = $domain.find("li.fl-quo-item.item");

                $domain.attr("data-del-sign", 1);
                var items = [];
                $.each($itemlist, function(i, v) {

                    var $quote = $(v);

                    $quote.attr("data-del-sign", 1);

                    if ($quote.attr("data-qfaiid")) {
                        quote.cacsedeUpdateItem($quote);
                        items.push($quote)
                    }
                });

                quote.cacsedeUpdateCpItem(items);
                quo.calculateQuoFees(); // 调用 统计车运费管理费总价折扣价

                var _params = $.extend({}, {
                    'quotetionFunctionArea.qfaId': $domain.attr('data-qfaid'), // 功能区Id
                }, quo.basicParams);

                com.post(api.quotation.deleteQuotetionFunctionArea, _params, function(res) {

                    $domain.remove();

                    com.focusPage('[data-qfaid="' + $domain.attr('data-qfaid') + '"]', '#functionAreaSumList').remove();
                }, function(res) {

                    $itemlist.removeAttr('data-del-sign');
                    $domain.removeAttr('data-del-sign');
                    quo.calculateQuoFees();
                }, null, false);
            });
        },

        // 复制功能区
        copyDomain: function($domain) {

            com.showConfirm("是否确定要复制功能区", function() {

                var qfaId = $domain.attr('data-qfaid');

                var _params = $.extend({}, {
                    'quotetionFunctionArea.qfaId': qfaId
                }, quo.basicParams);

                com.post(api.quotation.copyQuotetionFunctionArea, _params, function(data) {

                    com.showSuccess("功能区复制成功");

                    // 复用 saveDomainTemplete 的局部刷新逻辑
                    var $aimDomains = com.focusPage('.widget-box', '#functionAreaDetailList');

                    if (data.quotetionFunctionArea) {
                        var v = data.quotetionFunctionArea;

                        // 创建新功能区的详情 DOM
                        var $newDomain = painter.createdomain(v);

                        // 插入到功能区详情列表
                        that.insertDomainByOrder(v.functionAreaOrder, $newDomain, $aimDomains, false);

                        // 计算价格
                        var sum = 0, sumd = 0, sumdp = 0, $dmoney;

                        sum = parseFloat($newDomain.attr('data-undisPrice'));
                        sumdp = parseFloat($newDomain.attr('data-disPrice'));
                        sumd = parseFloat($newDomain.attr('data-desTotalprice'));

                        var _index = $newDomain.index();

                        // 创建并插入功能区汇总 DOM
                        $dmoney = painter.createDomainMoney(sumd, v);

                        if (_index == 0) {
                            $dmoney.appendTo(com.focusPage('#functionAreaSumList'));
                        } else {
                            $dmoney.insertAfter(com.focusPage('#functionAreaSumList > div').eq(_index - 1));
                        }

                        // 如果功能区有报价项，也插入到详情列表中
                        if (v.quotetionFunctionAreaItems && v.quotetionFunctionAreaItems.length) {
                            $.each(v.quotetionFunctionAreaItems, function(index, j) {

                                // 创建报价项 DOM
                                var $newItem = painter.createQuote(index + 1, j).appendTo($newDomain.find('.fl-quo-list.list'));
                            });
                        }

                        // 重新计算报价费用
                        quo.calculateQuoFees();
                    }

                    // 关闭弹窗
                    if (quo.modals && quo.modals.functionAreaModal) {
                        quo.modals.functionAreaModal.modal("hide");
                    }

                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);
                }, null, false);
            });
        },

        calculateTotal: function() {

            com.focusPage('#calculateBtn').on('click', function() {

                if (com.validate("calculateModal")) {
                    return false;
                }

                var table = com.focusPage('#calculateModal').find('table');

                table.find('thead').remove();
                table.find('tbody').remove();

                var dis = quo.items.calculateDiscount.val();

                if (parseFloat(dis) <= 0 || parseFloat(dis) > 10) {

                    com.showPopover(com.focusPage("#calculateDiscount"), {
                        errorMsg: "折扣非法"
                    }, "right");

                    return false;
                }

                com.focusPage("#calculateDiscount").css("border", "1px solid #d5d5d5").popover("destroy");

                quo.calculateTotalFee(dis);

                quo.servePriceShow();
            });

            com.focusPage('#calculateBtns').on('click', function() {

                com.focusPage('#calculateBtn').click();
            });
        },

        calculateCons: function() {

            com.focusPage('#calculateConsBtns').on('click', function() {

                if (com.validate("calculateConsModal")) {
                    return false;
                }

                quo.startTime = new Date(com.focusPage("#conStartTime").val());

                quo.constructionPaceNode();
            });
        },

        // 保存报价修改
        saveDiscountEdit: function() {

            com.focusPage('#saveDiscountBtn').on('click', function() {

                if (com.validate("discountModal")) {
                    return false;
                }

                var matching = com.focusPage('input[name="basePrice"]:checked');

                var dis = com.focusPage("#discount").val();
                var basePrice = matching.val();
                var baseName = com.focusPage('input[name="basePrice"]:checked').attr('data-name');

                if (!dis || parseFloat(dis) <= 0 || parseFloat(dis) > 10) {
                    com.showPopover(com.focusPage("#discount"), {
                        errorMsg: "请选择正确的折扣"
                    }, "right");
                    return false;
                }

                com.focusPage("#discount").css("border", "1px solid #d5d5d5").popover("destroy");

                quo.basicParams['quotetion.discount'] = Math.round(parseFloat(dis) * 1000) / 1000;
                quo.basicParams['quotetion.basePrice'] = parseInt(basePrice);

                var trafficDiscount = matching.attr("data-trafficDiscount");
                var manageDiscount = matching.attr("data-manageDiscount");
                var taxDiscount = matching.attr("data-taxDiscount");

                com.focusPage('#conveyanceCost').find('.discountprice').attr('data-discount', trafficDiscount);
                com.focusPage('#manageCost').find('.discountprice').attr('data-discount', manageDiscount);
                com.focusPage('#taxCost').find('.discountprice').attr('data-discount', taxDiscount);

                com.focusPage('#sumquoDiscount').text(quo.basicParams['quotetion.discount']);

                quo.calculateQuoFees(function($domain) {

                    var dfee = quo.calculateDomainFees($domain, function($quote) {

                        quo.calculateQuoteFee($quote);
                    });

                    com.focusPage('[data-qfaid="' + $domain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(dfee);
                });

                var params = $.extend({}, {
                    "quotation.trafficDiscount": trafficDiscount,
                    "quotation.manageDiscount": manageDiscount,
                    "quotation.taxDiscount": taxDiscount,
                }, quo.basicParams);

                com.post(api.quotation.updateQuotationForAdvance, params, function(res) {

                    quo.modals.discountModal.modal("hide");
                });
            });
        },

        // 保存功能区修改
        saveDomainTemplete: function() {

            var that = this;

            com.focusPage('#addFunctionAreaTemplateBtn').click(function() {

                var $darr = com.focusPage('input[name="quotempl"]:checked');
                var $aimDomains = com.focusPage('.widget-box', '#functionAreaDetailList');

                var _param = $.extend({}, quo.basicParams);

                if (!$darr.length) {
                    return false;
                }

                $.each($darr, function(i, v) {

                    _param['functionAreaIds[' + i + ']'] = $(v).val();
                });

                if (!_param["quotetion.updateTime"]) {
                    _param["quotetion.updateTime"] = com.currentTime();
                }

                com.post(api.quotation.addQuotetionFuctionArea, _param, function(data) {

                    data.quotetionFunctionAreas.length && $.each(data.quotetionFunctionAreas, function(i, v) {

                        var sum = 0, sumd = 0, sumdp = 0, $dmoney;
                        var $domain = painter.createdomain(v);

                        that.insertDomainByOrder(v.functionAreaOrder, $domain, $aimDomains, false);

                        sum = parseFloat($domain.attr('data-undisPrice'));
                        sumdp = parseFloat($domain.attr('data-disPrice'));
                        sumd = parseFloat($domain.attr('data-desTotalprice'));

                        var _index = $domain.index();

                        $dmoney = painter.createDomainMoney(sumd, v);

                        if (_index == 0) {
                            $dmoney.appendTo(com.focusPage('#functionAreaSumList'));
                        } else {
                            $dmoney.insertAfter(com.focusPage('#functionAreaSumList > div').eq(_index - 1));
                        }

                        if (v.quotetionFunctionAreaItems.length) {

                            $.each(v.quotetionFunctionAreaItems, function(index, j) {

                                if (j.isRtem != 1)
                                    return true;

                                var _rtems = rtems.queryQuotationRtems(j.qiid);

                                $.each(_rtems, function(indexs, rt) {

                                    var quolist = $domain.find('.fl-quo-list.list');
                                    var windex = quolist.find('.fl-quo-item.item').length;
                                    var areaType = $domain.attr('data-areaType');

                                    var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
                                    var cpList = cpWidget.find('.fl-quo-list.list');
                                    var cpIndex = cpList.find('.fl-quo-item.item').length;

                                    var rtem = {
                                        "discount": rt.target.discount,
                                        "content": rt.target.comment,
                                        "name": rt.target.name,
                                        "measurementUnit": rt.target.unit.name,
                                        "formula": 0,
                                        "num": 0,
                                        "qfaiId": "",
                                        "qiid": rt.target.qiid,
                                        "subtype": rt.target.category.id,
                                        "unitPrice": rt.target.unitPrice,
                                        "addPrice": rt.target.addPrice,
                                        "subPrice": rt.target.subPrice,
                                        "workType": rt.target.workType.name,
                                        "isRtem": 0
                                    };

                                    if (rt.type == constant.data().quotationRtem.TYPE_CMPREH_INT) {
                                        rtem["qfaid"] = cpWidget.attr("data-qfaid");
                                        rtem["type"] = constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT;
                                        rtem["areaType"] = constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT;
                                        rtem["index"] = cpIndex + 1;
                                    }

                                    if (rt.type == constant.data().quotationRtem.TYPE_GENERRAL_INT && com.focusPage('.item[data-qiid="' + rt.target.qiid + '"]', $domain).length == 0) {
                                        rtem["qfaid"] = $domain.attr("data-qfaid");
                                        rtem["type"] = quote.quoItemType(rt.target.type, $domain.attr('data-areaType'));
                                        rtem["areaType"] = $domain.attr('data-areaType');
                                        rtem["index"] = windex + 1;
                                    }

                                    var item = null;

                                    if (rtem.areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                                        item = cpList.find('.fl-quo-item.item[data-qiid="' + rtem.qiid + '"]', cpWidget);
                                    } else {
                                        item = quolist.find('.fl-quo-item.item[data-qiid="' + rtem.qiid + '"]', $domain);
                                    }

                                    if (!item.length && rtem.areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                                        item = painter.createQuote(rtem.index, rtem).appendTo(cpList);
                                    } else if (!item.length && rtem.areaType != constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                                        item = painter.createQuote(rtem.index, rtem).appendTo(quolist);
                                    }

                                });
                            });
                        }

                        quo.calculateQuoFees();
                    });
                }, null, false);

                quo.modals.functionAreaTemplateModal.modal("hide");
            });
        },

        /**
         * 
         * 将功能区添加到功能区列表中
         * 
         * @param order 功能区排序
         * @param $domain 正在编辑的功能区
         * @param $aimDomains 参与排序的其他功能区 , 不包含当前要插入的功能区
         * @param existed 是否已存在功能区列表中
         */
        insertDomainByOrder: function(order, $domain, $aimDomains, existed) {

            var that = this;
            var maxflag = true;

            if (!$aimDomains.length && existed) {
                return false;
            }

            $aimDomains.each(function(i) {

                var _order = parseInt($(this).attr('data-dlevel'));

                if (_order > parseInt(order) || !_order) {
                    $domain.insertBefore($(this));
                    maxflag = false;
                    return false;
                }
            });

            maxflag && $domain.appendTo(com.focusPage('#functionAreaDetailList'));

            quo.modals.functionAreaModal.modal("hide");
        },

        // 保存默认报价项 添加工程项按钮
        saveQuotesToDomain: function() {

            com.focusPage('#addQuotetionItemBtn').click(function() {

                quote.addDefaultQuotes();
                quo.modals.quotetionItemModal.modal("hide");
            });
        },

        deleteQuotesToDomain: function() {

            quo.modals.quotetionItemModal.on('hide.bs.modal', function() {

                quote.quotesRecord = [];
            });
        },

        // 管理费比例弹窗保存按钮 saveManageRateBtn
        saveManageRate: function() {

            com.focusPage('#saveManageRateBtn').click(function() {

                if (com.validate("manageRateModal")) {
                    return false;
                }

                var _manageId = com.focusPage('#manageCost').attr('qfaiId');
                var _qfaId = com.focusPage('#manageCost').find('.cell.name').attr("data-qfaId");

                var _manageRate = parseFloat(quo.items.manageRate.val());

                com.focusPage('#manageCost').find('.unitprice .cell-wrap').text(_manageRate);

                com.focusPage('#manageCost').find('.discountprice .cell-wrap').text(_manageRate);
                com.focusPage('#manageCost').find('.totalprice-discount .cell-wrap').text(_manageRate);

                com.focusPage('#manageCost').find('.unitprice').attr('data-unitprice', _manageRate);

                // ("调用 统计车运费管理费总价折扣价")
                quo.calculateQuoFees();
                quo.modals.manageRateModal.modal("hide");

                var option = $.extend({}, {
                    "quotetionFunctionAreaItem.qfaiId": _manageId,
                    "quotetionFunctionAreaItem.qfaid": _qfaId,
                    "quotetionFunctionAreaItem.unitPrice": _manageRate
                }, quo.basicParams);

                com.post(api.quotation.updateQuotetionFunctionAreaItemForSpec, option);
            });
        },

        // 车运费管理保存
        saveconveyanceRate: function() {

            com.focusPage('#saveTrafficRateBtn').click(function() {

                if (com.validate("trafficRateModal")) {
                    return false;
                }

                var _conveyanceId = com.focusPage('#conveyanceCost').attr('qfaiId');
                var _qfaId = com.focusPage('#conveyanceCost').find('.cell.name').attr("data-qfaId");
                var _conveyanceCost = parseFloat(com.focusPage('#trafficRate').val());

                com.focusPage('#conveyanceCost').find('.unitprice').text(_conveyanceCost);
                com.focusPage('#conveyanceCost').find('.discountprice .cell-wrap').text(_conveyanceCost);
                com.focusPage('#conveyanceCost').find('.totalprice-discount .cell-wrap').text(_conveyanceCost);

                // ("调用 统计车运费管理费总价折扣价")
                quo.calculateQuoFees();

                var option = $.extend({}, {
                    "quotetionFunctionAreaItem.qfaiId": _conveyanceId,
                    "quotetionFunctionAreaItem.qfaid": _qfaId,
                    "quotetionFunctionAreaItem.unitPrice": _conveyanceCost
                }, quo.basicParams);

                com.post(api.quotation.updateQuotetionFunctionAreaItemForSpec, option, function(res) {

                    quo.modals.trafficRateModal.modal("hide");
                }, null, false);

                com.post(api.quotation.updateQuotetionForAdvance, quo.basicParams, function(res) {

                }, null, false);

            });
        },

        // 折扣窗体配置基数
        showDiscountBasePrice: function() {

            com.focusPage("#showBaseVersion").empty();
            com.focusPage("#discount").prop("disabled", "disabled");

            com.post(api.data.queryDecorationMatching, quo.typeness, function(res) {

                $.each(res.decorationMatchings, function(i, v) {

                    if ((v.vision & 2) != constant.data().decorationMatching.VISION_QUOTECOUNT_INT || v.type != constant.decoration().decoration.TYPE_HOLONOMY_INT)
                        return true; // 原报价显示v=0/2, 新报价显示v=0/1

                    var params = {
                        "value": v.base,
                        "data-name": v.name,
                        "data-baseDiscount": v.discount,
                        "data-trafficDiscount": v.trafficDiscount,
                        "data-manageDiscount": v.manageDiscount,
                    }

                    var radio = $('<div class="radio no-padding" style="margin-bottom:10px"></div>');
                    var lableInput = $('<label></label>').append($('<input type="radio" name="basePrice" class="ace"></input>').attr(params)).append('<sapn class="lbl"></sapn>');
                    var lbl1 = $('<label>' + v.name + '</label>').addClass('quotation-base-price-radio').addClass('quotation-base-price-radio-width15');
                    var lbl2 = $('<label> 折扣数: ' + v.discount + '</label>').addClass('quotation-base-price-lbl');
                    var lbl3 = $('<label> 基数: ' + v.base + '</label>').addClass('quotation-base-price-lbl').addClass('hide');

                    radio.append(lableInput).append(lbl1).append(lbl2).append(lbl3).appendTo(com.focusPage("#showBaseVersion"));
                });

                var customInput = $('<label> <input type="radio" name="basePrice" class="ace" value="' + 0 + '" data-customDiscount="true"/> <sapn class="lbl"></sapn></label>'); // 以上类型之外,自定义折扣数
                var customlbl = $('<label>半包/全包</label>').addClass('quotation-base-price-radio');
                var customlb2 = $('<label>请自定义折扣数</label>').addClass('quotation-base-price-lbl').addClass('quotation-base-price-lbl-left23');

                com.focusPage("#showBaseVersion").append(customInput).append(customlbl).append(customlb2);

                com.focusPage('input[name="basePrice"]').click(function(e) {

                    if ($(this).attr("data-customDiscount")) {
                        com.focusPage("#discount").val('').removeAttr("disabled");
                    } else {
                        com.focusPage("#discount").prop("disabled", "disabled").val($(this).attr("data-baseDiscount"));
                    }
                });
            });
        },

        saveOrderId: function() {

            var materialPrice = null;

            com.focusPage('#saveOrderIdBtn').click(function() {

                if (com.validate("orderIdModal")) {
                    return false;
                }

                com.post(api.decoration.queryDecorationForCommonByOrderId, {
                    "decoration.orderId": quo.items.orderIds.val()
                }, function(res) {

                    com.focusPage('#orderId').text(res.decoration.orderId);
                    com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
                    com.focusPage('#version').text(res.decoration.version.name);

                    quo.notSalesmanRate = res.decoration.notSalesmanRate;
                    quo.decoration = res.decoration;

                }, null, false);

                if (quo.decoration != null) {
                    com.post(api.data.fetchPaymentScaleItem, {
                        "paymentScaleItem.ptid": quo.paymentType.ptid,
                        "paymentScale.atttype": 0,
                        "paymentScale.dbid": quo.decoration.busitype
                    }, function(res) {

                        $.each(res.paymentScaleItems, function(i, v) {

                            quo.scales[v.paymentScale.typeness] = v.scale;
                        });

                    }, null, false);
                }

                com.focusPage('#orderIdModal').modal('hide');

                quo.calculateQuoFees();
            });

        },

        // 绑定各种关于报价的操作
        init: function() {

            this.saveDomainEdit();
            this.calculateTotal();
            this.calculateCons();
            this.saveDiscountEdit();
            this.saveDomainTemplete();
            this.saveQuotesToDomain();
            this.saveManageRate();
            this.saveconveyanceRate();
            this.deleteQuotesToDomain();
            this.showDiscountBasePrice();
            this.saveOrderId();
        }

    };

    // 报价
    var quote = {
        quotesRecord: [],
        $nowLine: null,
        $nowEditInput: null,

        // 排序报价项
        sortQuote: function($domain) {

            var $arr = $domain.find('.fl-quo-item.item');

            if (!$arr) {
                return false;
            }

            $arr.each(function() {

                $this = $(this);
                $this.find('.line .cell-wrap').text($this.index() + 1);
            });
        },

        getNumCellFocus: function($line) {

            var that = this;

            // 选中后代中带有*class的标签
            var $numCell = $line.find('.cell.formula');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $line.parents('.widget-body-inner').find('.fl-quo-input');

            // 报价项的模块
            domain.nowEditDomain = $line.parents('.widget-box');
            quote.checkedStyle($line);

            // 选中元素中input标签 val赋值为$numCell的文本值 并且点击input标签获取焦点 .focus()获取焦点 .select()选中
            $editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();

            that.$nowLine = $line;
            that.$nowEditInput = $editInput;
            that.$nowEditInput.find('input').off('keydown').on("keydown", function(e) {

                var $input = $(this);
                that.bindInputKeydown($input.val(), e);
            });
        },

        // 回车添加
        bindInputKeydown: function(formula, e) {

            var that = this;

            var $line = null;

            // keyCode码 13为回车符
            if (e.keyCode == 13) {
                try {
                    formula = formula.replace(/\s+/g, "");
                    var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/;
                    if (test.test(formula) || formula == null || formula == '') {
                        that.hideInputWrap();
                        return false;
                    }
                    var num = utils.changeThrDecimal(eval(formula));
                    if (num < 0 || num > 10000000) {
                        that.hideInputWrap();
                        return false;
                    }
                } catch (e) {
                    that.hideInputWrap();
                    return false;
                }

                var oldFormula = that.$nowLine.find('.cell.formula .cell-wrap').text();
                var oldNum = that.$nowLine.find('.cell.num .cell-wrap').text();

                // 赋值给外部的公式显示
                that.$nowLine.find('.cell.formula .cell-wrap').text(formula);
                // 赋值给外部显示DIV 显示数量
                that.$nowLine.find('.cell.num .cell-wrap').text(num);
                // 获取下一个报价项的整体元素标签
                $line = that.$nowLine.next('.fl-quo-item.item');

                // 获取报价项的类型
                var _type = that.$nowLine.find('.type').attr('data-type');
                var _areaType = that.$nowLine.find('.line').attr('data-areaType');
                var isRtem = that.$nowLine.attr("data-isRtem");

                var _rtems = rtems.queryQuotationRtems(that.$nowLine.attr('data-qiid'));
                var qrid = "";

                $.each(_rtems, function(i, v) {

                    qrid += v.target.qiid + ",";
                });

                that.$nowLine.attr("data-qrid", qrid);

                var args = {
                    "quotetionFunctionAreaItem.discount": that.$nowLine.find('.discountprice').attr('data-discount'),// 折扣标示 1:打折 ;
                    "quotetionFunctionAreaItem.qfaiId": that.$nowLine.find('input[name="deleteItems"]').val(),// 报价项Id , 可空 ;
                    "quotetionFunctionAreaItem.name": that.$nowLine.find('.name .cell-wrap').text(),// 报价项名
                    "quotetionFunctionAreaItem.measurementUnit": that.$nowLine.find('.unit .cell-wrap').text(),// 单位 ;
                    "quotetionFunctionAreaItem.formula": that.$nowLine.find('.formula .cell-wrap').text(),// 计算公式
                    "quotetionFunctionAreaItem.workType": that.$nowLine.find('.worktype .cell-wrap').text(),// 工种 workTypeId :quo.items.workType.val(),

                    "quotetionFunctionAreaItem.unitPrice": that.$nowLine.find('.unitprice').attr('data-unitPrice'),// 单价 ;
                    "quotetionFunctionAreaItem.addPrice": that.$nowLine.attr('data-addPrice'),// 增补价;
                    "quotetionFunctionAreaItem.subPrice": that.$nowLine.attr('data-subPrice'),// 退减价;
                    "quotetionFunctionAreaItem.initNum": that.$nowLine.find('.num .cell-wrap').text(),// 初始化数量
                    "quotetionFunctionAreaItem.num": that.$nowLine.find('.num .cell-wrap').text(),// 数量;
                    "quotetionFunctionAreaItem.subtype": that.$nowLine.find('.num').attr('data-subtype'),// 1工程,2主材
                    "quotetionFunctionAreaItem.type": _type,// , 类型 , 自定义为1 , 工程报价项为0 不计算为4
                    "quotetionFunctionAreaItem.qfaid": domain.nowEditDomain.attr('data-qfaId'),// 功能区Id
                    "quotetionFunctionAreaItem.index": parseInt(that.$nowLine.find(".line .cell-wrap").text())
                };

                if (_type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT || _type == constant.quotation().quotetionFunctionAreaItem.TYPE_IGNORE_INT || _type == constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT || _type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT || _type == constant.quotation().quotetionFunctionAreaItem.TYPE_HIDE_INT) {
                    // 报价项Id , 标准类型报价项需要传递 "data-qiid"
                    args["quotetionFunctionAreaItem.qiid"] = that.$nowLine.find('input[name="deleteItems"]').attr('data-qiid');
                } else if (_type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT) {
                    // 报价项说明 , 自定义类型报价项需要传递 ;
                    args["quotetionFunctionAreaItem.content"] = that.$nowLine.prop('title');
                }

                that.$nowLine.find('input[name="deleteItems"]').val(that.$nowLine.find('input[name="deleteItems"]').val());

                var _fee = quo.calculateNowQuoteItem(num, _areaType, that.$nowLine);

                com.clearValidator();

                that.$nowLine.find(".icon-arrow-up").removeClass("grey").addClass("green"), that.$nowLine.find(".icon-arrow-down").removeClass("grey").addClass("red");

                var _params = $.extend({}, args, quo.basicParams);

                com.post(api.quotation.updateQuotetionFunctionAreaItem, _params, function(res) {

                    // 选中左上角报价中的功能区ID 将总价格显示
                    com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                    that.$nowLine.attr("data-qfaiid", res.quotetionFunctionAreaItem.qfaiId);
                    that.$nowLine.find('input[name="deleteItems"]').val(res.quotetionFunctionAreaItem.qfaiId);

                    that.cacsedeUpdateItem(that.$nowLine);
                    that.cacsedeUpdateCpItem([that.$nowLine]);

                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    that.$nowLine.find('.cell.formula .cell-wrap').text(oldFormula);
                    that.$nowLine.find('.cell.num .cell-wrap').text(oldNum);

                    quo.calculateNowQuoteItem(oldNum, _areaType, that.$nowLine);
                }, false);

                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }

                return false;
            }

            // 如果按键为上 调整焦点到功能区内上一个报价项
            if (e.keyCode == 38) {

                $line = that.$nowLine.prev('.fl-quo-item.item');

                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }

                return false;
            }

            // 如果按键为下 调整焦点到功能区内的下一个报价项
            if (e.keyCode == 40) {

                $line = that.$nowLine.next('.fl-quo-item.item');

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
        },

        cacsedeUpdateItem: function(item) {

            var $domain = domain.nowEditDomain;
            var $cpdomain = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            $domain.find(".fl-quo-list.list").eq(0).find('.fl-quo-item.item').attr('data-count-num', 0);
            $cpdomain.find(".fl-quo-list.list").eq(0).find('.fl-quo-item.item').attr('data-count-num', 0);

            if ($domain.attr("data-dlevel") == "9998" || $domain.attr("data-del-sign") == "1" || !item.attr("data-qrid") || item.attr("data-qrid") == "")
                return false;

            $domain.find('.fl-quo-item.item').attr('data-count-num', 0);
            var itemQrid = item.attr("data-qrid");

            var arrQrid = itemQrid.split(",");

            var qiidArr = [], quoRtemsList = {};

            $.each(arrQrid, function(i, id) {

                if (id == "")
                    return true;

                var items = $domain.find('.fl-quo-item.item[data-qrid*="' + id + '"]');

                $.each(items, function(index, e) {

                    var $item = $(e);
                    var qiid = $item.attr("data-qiid");
                    var number = $item.find('.cell.num .cell-wrap').text();

                    if (qiidArr.indexOf(qiid) != -1)
                        return true;

                    qiidArr.push(qiid);

                    var _rtems = rtems.queryQuotationRtems(qiid);

                    if (!_rtems.length)
                        return false;

                    $.each(_rtems, function(ri, v) {

                        var handler = null;

                        if (v.type == constant.data().quotationRtem.TYPE_GENERRAL_INT && arrQrid.indexOf(String(v.target.qiid)) != -1) {
                            handler = $domain.find(".fl-quo-item.item[data-qiid=" + v.target.qiid + "]");
                        }

                        if (!handler || handler.length == 0 || handler.attr("data-control") == 1)
                            return true;

                        var newNum = parseFloat(handler.attr("data-count-num"));

                        newNum = newNum + ($item.attr('data-del-sign') == 1 ? 0 : quote.quotetionFunctionAreaFormula(v.formula, number));

                        handler.attr("data-count-num", utils.changeThrDecimal(newNum));

                        if (!quoRtemsList[v.target.qiid]) {
                            quoRtemsList[v.target.qiid] = handler;
                        }
                    });
                });
            });

            $.each(quoRtemsList, function(i, v) {

                quote.cacsedeUpdateQuoteItem(v);
            });
        },

        cacsedeUpdateCpItem: function(items) {

            var qrids = "";

            $.each(items, function(i, e) {

                var $this = $(e);
                qrids = qrids + $this.attr('data-qrid');
            });

            var qridArr = qrids.split(",");

            var $domain = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            var itemList = {}, quoRtemList = {};

            $.each(qridArr, function(i, id) {

                if (id == "")
                    return true;

                var items = com.focusPage('.fl-quo-item.item[data-qrid*="' + id + '"]');
                $.each(items, function(index, v) {

                    var $item = $(v);
                    var qfaiid = parseInt($item.find('input[name="deleteItems"]').val());
                    var qiid = parseInt($item.attr("data-qiid"));

                    if (!itemList[qfaiid]) {
                        itemList[qfaiid] = qiid;
                    }
                });
            });

            $.each(itemList, function(i, e) {

                var isItem = com.focusPage('.fl-quo-item.item[data-qfaiid*="' + i + '"]');
                var number = isItem.find('.cell.num .cell-wrap').text();
                var widget = isItem.parents('.widget-box');

                var _rtems = rtems.queryQuotationRtems(e);

                if (!_rtems.length)
                    return true;

                $.each(_rtems, function(index, v) {

                    var handler = null;

                    if (v.type == constant.data().quotationRtem.TYPE_CMPREH_INT) {
                        handler = $domain.find(".fl-quo-item.item[data-qiid=" + v.target.qiid + "]");
                    }

                    if (v.type == constant.data().quotationRtem.TYPE_GENERRAL_INT && widget.attr("data-dlevel") == "9998") {
                        handler = $domain.find(".fl-quo-item.item[data-qiid=" + v.target.qiid + "]");
                    }

                    if (!handler || handler.length == 0 || handler.attr("data-control") == 1)
                        return true;

                    var qiid = parseInt(handler.attr("data-qiid"));

                    var newNum = parseFloat(handler.attr("data-count-num"));

                    newNum = newNum + (isItem.attr('data-del-sign') == 1 ? 0 : quote.quotetionFunctionAreaFormula(v.formula, number));

                    handler.attr("data-count-num", utils.changeThrDecimal(newNum));

                    if (!quoRtemList[v.target.qiid]) {
                        quoRtemList[v.target.qiid] = handler;
                    }
                });
            });

            $.each(quoRtemList, function(i, v) {

                quote.cacsedeUpdateQuoteItem(v);
            });
        },

        cacsedeUpdateQuoteItem: function(handler) {

            var domain = handler.parents('.widget-box');
            var newNum = handler.attr("data-count-num");
            var oldFormula = handler.find('.cell.formula .cell-wrap').text();
            var oldNum = handler.find('.cell.num .cell-wrap').text();
            var _type = handler.find('.type').attr('data-type');
            handler.find('.cell.formula .cell-wrap').text(newNum);
            handler.find('.cell.num .cell-wrap').text(newNum);
            handler.find(".icon-arrow-up").removeClass("grey").addClass("green");
            handler.find(".icon-arrow-down").removeClass("grey").addClass("red");

            var fee = quo.calculateNowQuoteItem(newNum, domain.attr('data-areaType'), handler);
            com.focusPage('[data-qfaid="' + domain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(fee);

            var _params = {
                "quotetionFunctionAreaItem.discount": handler.find('.discountprice').attr('data-discount'),// 折扣标示;
                "quotetionFunctionAreaItem.qfaiId": handler.find('input[name="deleteItems"]').val(),// 报价项Id;
                "quotetionFunctionAreaItem.name": handler.find('.name .cell-wrap').text(),// 报价项名;
                "quotetionFunctionAreaItem.measurementUnit": handler.find('.unit .cell-wrap').text(),// 单位 ;
                "quotetionFunctionAreaItem.formula": handler.find('.formula .cell-wrap').text(),// 计算公式;
                "quotetionFunctionAreaItem.workType": handler.find('.worktype .cell-wrap').text(),// 工种;

                "quotetionFunctionAreaItem.unitPrice": handler.find('.unitprice').attr('data-unitPrice'),// 单价 ;
                "quotetionFunctionAreaItem.addPrice": handler.attr('data-addPrice'),// 增补价;
                "quotetionFunctionAreaItem.subPrice": handler.attr('data-subPrice'),// 退减价;
                "quotetionFunctionAreaItem.initNum": handler.find('.num .cell-wrap').text(),// 初始化数量;
                "quotetionFunctionAreaItem.num": handler.find('.num .cell-wrap').text(),// 数量;
                "quotetionFunctionAreaItem.subtype": handler.find('.num').attr('data-subtype'),// 1工程,2主材;
                "quotetionFunctionAreaItem.type": _type,// 类型 ;
                "quotetionFunctionAreaItem.qfaid": domain.attr('data-qfaid'),// 功能区Id;
                "quotetionFunctionAreaItem.index": parseInt(handler.find(".line .cell-wrap").text()),
                "quotetionFunctionAreaItem.qiid": handler.attr("data-qiid"),
                "quotetionFunctionAreaItem.content": handler.prop('title'),
            };

            var _params = $.extend({}, _params, quo.basicParams);

            com.post(api.quotation.updateQuotetionFunctionAreaItem, _params, function(res) {

                handler.attr('data-qfaiid', res.quotetionFunctionAreaItem.qfaiId);
                handler.find('input[name="deleteItems"]').val(res.quotetionFunctionAreaItem.qfaiId);

            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                handler.find('.cell.formula .cell-wrap').text(oldFormula);
                handler.find('.cell.num .cell-wrap').text(oldNum);

                quo.calculateNowQuoteItem(oldNum, handler.attr('data-areaType'), handler);
            }, false);
        },

        // 批量删除报价项
        deleteQuoteInBatches: function($domain) {

            var that = this;

            $domain.find('.fl-quo-input').insertAfter($domain.find('.fl-quo-list.list')).addClass('hide');

            // , 参数 : qfaiIds[n] , 报价项Id列表 ;
            var $quos = com.focusPage('[name="deleteItems"]:checked', $domain);

            var $q1 = [], $q2 = [];
            var _params = {};

            if (!$quos.length) {
                return false;
            }

            $quos.length && $.each($quos, function(i, v) {

                if ($(v).val()) {
                    _params['qfaiIds[' + $q1.length + ']'] = $(v).val();
                    $q1[$q1.length] = v;
                } else {
                    $q2[$q2.length] = v;
                }
            });

            $q2.length && $.each($q2, function(i, v) {

                $(v).parents('li.fl-quo-item.item').remove();
            });

            if ($q1.length) {

                var items = [];

                $.each($q1, function(i, v) {

                    var $inpit = $(v);

                    var item = $inpit.parents('li.fl-quo-item.item');
                    item.attr("data-del-sign", 1);

                    that.cacsedeUpdateItem(item);
                    items.push(item);
                });

                var _fee = quo.calculateDomainFees(domain.nowEditDomain);
                that.cacsedeUpdateCpItem(items);
                quo.calculateQuoFees();

                _params = $.extend({}, _params, quo.basicParams, {
                    "quotetionFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid')
                });

                com.post(api.quotation.deleteQuotetionFunctionAreaItem, _params, function(res) {

                    $.each($q1, function(i, v) {

                        $(v).parents('li.fl-quo-item.item').remove();
                    });

                    com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);

                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    $.each($q1, function(i, v) {

                        var $inpit = $(v);

                        var item = $inpit.parents('li.fl-quo-item.item');
                        item.removeAttr("data-del-sign");

                        that.cacsedeUpdateItem(item);
                    });

                    quo.calculateDomainFees(domain.nowEditDomain);
                    that.cacsedeUpdateCpItem(items);
                    quo.calculateQuoFees();
                });
            }

            quote.sortQuote(domain.nowEditDomain);
        },

        // 删除报价项
        deleteQuote: function($quote) {

            var that = this;

            var _qid = $quote.find('input[type="checkbox"]').val();
            var _params = {};

            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list.list')).addClass('hide');

            if (!_qid) {
                $quote.remove();
            } else {

                $quote.attr('data-del-sign', 1);

                that.cacsedeUpdateItem($quote);
                that.cacsedeUpdateCpItem([$quote]);

                $quote.remove();

                var _fee = quo.calculateDomainFees(domain.nowEditDomain);

                com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);

                quo.calculateQuoFees();

                _params = $.extend({}, quo.basicParams, {
                    "quotetionFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid'),
                    "qfaiIds[0]": _qid
                });

                com.post(api.quotation.deleteQuotetionFunctionAreaItem, _params, function(res) {

                }, function(res) {

                    $quote.removeAttr("data-del-sign");
                    that.cacsedeUpdateItem($quote);
                    that.cacsedeUpdateCpItem([$quote]);
                    quo.calculateDomainFees(domain.nowEditDomain);
                    quo.calculateQuoFees();
                }, false);
            }

            quote.sortQuote(domain.nowEditDomain);
        },

        // 添加自定义报价项
        saveCustomQuotesAdd: function() {

            com.focusPage("#saveCustomItemBtn").on('click', function(event) {

                var _areaType = domain.nowEditDomain.attr('data-areaType');

                if (com.validate("customItemModal")) {
                    return false;
                }

                var _index = domain.nowEditDomain.find('.fl-quo-item.item').length;
                var addRow = {
                    itemName: quo.items.name.val(),
                    name: quo.items.name.val(),
                    formula: quo.items.formula.val(),
                    num: quo.items.num.val(),
                    unitPrice: quo.items.unitPrice.val(),
                    addPrice: quo.items.addPrice.val(),
                    subPrice: quo.items.subPrice.val(),
                    discount: quo.items.discountFlag.prop("checked") ? constant.quotation().quotetionFunctionAreaItem.DISCOUNT_DISCOUNT_INT : constant.quotation().quotetionFunctionAreaItem.DISCOUNT_NODISCOUNT_INT,
                    type: constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT,
                    subtype: quo.items.quotetionType.val(),
                    measurementUnit: quo.items.measurementUnit.val(),
                    workType: quo.items.workType.val(),
                    areaType: _areaType,
                    content: quo.items.comment.val(),
                };

                var $item, $historyItem;
                var _fee = 0;

                $item = painter.createQuote(_index + 1, addRow);
                $item.find(".icon-arrow-up").removeClass("grey").addClass("green"), $item.find(".icon-arrow-down").removeClass("grey").addClass("red");
                $item.appendTo(domain.nowEditDomain.find('.fl-quo-list.list'));

                $historyItem = painter.createQuoteModalItem({
                    "name": addRow.name,
                    "unitPrice": addRow.unitPrice,
                    "type": 2,
                    "version": {},
                    "classification": {
                        "id": "",
                        "name": "自定义"
                    },
                    "category": {
                        "id": "",
                        "name": "自定义"
                    },
                    "bigCategory": {
                        "id": "",
                        "name": "自定义"
                    },
                    "smallCategory": {
                        "id": "",
                        "name": "自定义"
                    },
                    "workType": {
                        "id": quo.items.workType.val(),
                        "name": quo.items.workType.find("option:selected").text()
                    },
                    "unit": {
                        "id": quo.items.measurementUnit.val(),
                        "name": com.focusPage('#measurementUnit').find("option:selected").text()
                    },
                    "discount": addRow.discount,
                    "comment": addRow.content,
                });

                quote.recordHistoryQuotes($historyItem);

                _fee = quo.calculateDomainFees(domain.nowEditDomain);

                com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);

                quo.calculateQuoFees();
                quote.sortQuote(domain.nowEditDomain);

                var args = {
                    "quotetionFunctionAreaItem.discount": addRow.discount,// 是否打折
                    "quotetionFunctionAreaItem.name": addRow.name,// 报价项名
                    "quotetionFunctionAreaItem.measurementUnit": addRow.measurementUnit,// , 单位 ;
                    "quotetionFunctionAreaItem.workType": quo.items.workType.val(),// 工种 workTypeId :quo.items.workType.val(),
                    "quotetionFunctionAreaItem.content": addRow.content,// , 报价项说明 , 自定义类型报价项需要传递 ;
                    "quotetionFunctionAreaItem.unitPrice": addRow.unitPrice,// 单价 ;
                    "quotetionFunctionAreaItem.addPrice": addRow.addPrice,// 增补价 ;
                    "quotetionFunctionAreaItem.subPrice": addRow.subPrice,// 退减价 ;
                    "quotetionFunctionAreaItem.subtype": addRow.subtype,
                    "quotetionFunctionAreaItem.formula": addRow.formula,// 公式
                    "quotetionFunctionAreaItem.initNum": addRow.num,// 原数
                    "quotetionFunctionAreaItem.num": addRow.num,// , 工程量 ;
                    "quotetionFunctionAreaItem.type": addRow.type,// , 类型 , 自定义为1 , 标准报价项为0 ;
                    "quotetionFunctionAreaItem.qfaid": domain.nowEditDomain.attr('data-qfaId'),// 功能区Id ;
                    "quotetionFunctionAreaItem.index": (_index + 1),
                };

                var _params = $.extend({}, args, quo.basicParams);

                com.post(api.quotation.updateQuotetionFunctionAreaItem, _params, function(res) {

                    $item.attr("data-qfaiid", res.quotetionFunctionAreaItem.qfaiId);
                    $item.find('input[name="deleteItems"]').val(res.quotetionFunctionAreaItem.qfaiId);
                }, null, false);

                quo.modals.customItemModal.modal("hide");

                return false;
            });
        },

        /**
         * 添加报价项的时候记住上一页选中的报价项
         * 
         * @param $input: 正在操作的input标签
         * @param ischecked: 选举中或取消选中
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

        // 点击页面其他位置时清除表格行的选中样式
        clearQuoteSelected: function() {

            var that = this;

            $('body').click(function(e) {

                if (!com.focusPage(e.target).is('.cell-wrap') && !com.focusPage(e.target).is('[data-action="collapse"]')) {
                    that.hideInputWrap();
                }
            });
        },

        // 删除上一个选中的报价项选中样式 并添加当前报价项选中样式
        checkedStyle: function($item) {

            com.focusPage('.fl-quo-item.item.current').removeClass('current');
            $item.addClass('current');
        },

        calculationNum: function() {

            quo.items.formula.blur(function() {

                var that = $(this);

                try {

                    var formula = that.val();
                    formula = formula.replace(/\s+/g, "");

                    var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/;

                    if (test.test(formula) || formula == null || formula == '') {
                        com.focusPage('#num').val('');
                        return false;
                    }

                    var num = utils.changeThrDecimal(eval(formula));

                    if (num < 0 || num > 10000000) {
                        com.focusPage('#num').val('');
                        return false;
                    }

                    that.val(formula);
                    com.focusPage('#num').val(num);
                } catch (e) {
                    com.focusPage('#num').val('');
                    return false;
                }
            });
        },

        addHistoryQuotes: function() {

            com.focusPage('#addHistoryItemBtn').on('click', function(event) {

                quote.addDefaultQuotes();
                quo.modals.historyItemModal.modal("hide");
            });
        },

        // 记录历史数据
        recordHistoryQuotes: function($historyQuo) {

            var addflag = true;
            var $quos = com.focusPage('[type="checkbox"]', '#historyQuotetionItemDiv');

            if ($quos.length) {
                $.each($quos, function(i, v) {

                    if (com.focusPage(v).val() == $historyQuo.find('[type="checkbox"]').val()) {
                        addflag = false;
                        return false;
                    }
                });
            }

            addflag && $historyQuo.appendTo('#historyQuotetionItemDiv > ul.fl-table-list');
        },

        // 添加工程项 与 历史报价项 的保存按钮调用的保存方法
        addDefaultQuotes: function() {

            var _arrs = quote.quotesRecord;
            var _index = domain.nowEditDomain.find('.fl-quo-item.item').length;

            var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            var cpIndex = cpWidget.find('.fl-quo-item.item').length;

            if (!_arrs.length) {
                return false;
            }

            $.each(_arrs, function(i, v) {

                var $this = com.focusPage(v);

                if ($this.val() && com.focusPage('input[data-qiid="' + $this.val() + '"]', domain.nowEditDomain).length) {
                    return false;
                }

                var areaType = domain.nowEditDomain.attr('data-areaType');
                var type = quote.quoItemType($this.attr('data-type'), areaType);

                var _quotval = {
                    "discount": $this.attr('data-discount'),
                    "content": $this.attr('data-des'),
                    "name": $this.attr('data-name'),
                    "measurementUnit": $this.attr('data-itemUnite'),
                    "formula": '0',
                    "num": 0,
                    "qfaiId": "",
                    "qfaid": domain.nowEditDomain.attr("data-qfaid"),
                    "qiid": $this.val(),
                    "type": type,
                    "subtype": $this.attr('data-quotetionTypeId'),
                    "unitPrice": $this.attr('data-itemPrice'),
                    "addPrice": $this.attr('data-itemAddPrice'),
                    "subPrice": $this.attr('data-itemSubPrice'),
                    "workType": $this.attr('data-workType'),
                    "quotetionType": $this.attr('data-quotetionType'),
                    "quotetionTypeId": $this.attr('data-quotetionTypeId'),
                    "areaType": domain.nowEditDomain.attr('data-areaType'),
                    "isRtem": $this.attr('data-isRtem'),
                    "quotationRtemId": $this.attr('data-qrid')
                };

//                if (areaType == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT) {
//                    _quotval["type"] = constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT;
//                }

                quote.addQuoteRtem(_quotval);
                var $historyItem = $this.parents('li.item-blue').clone(true);
                quote.recordHistoryQuotes($historyItem);

                if ($this.attr('data-isRtem') != "1")
                    return true;

                var _rtems = rtems.queryQuotationRtems($this.val());

                $.each(_rtems, function(i, v) {

                    var _quortval = {
                        "discount": v.target.discount,
                        "content": v.target.comment,
                        "name": v.target.name,
                        "measurementUnit": v.target.unit.name,
                        "formula": 0,
                        "num": 0,
                        "qfaiId": "",
                        "qiid": v.target.qiid,
                        "subtype": v.target.category.id,
                        "unitPrice": v.target.unitPrice,
                        "addPrice": v.target.addPrice,
                        "subPrice": v.target.subPrice,
                        "workType": v.target.workType.name,
                        "isRtem": v.target.isRtem,
                        "quotationRtemId": v.target.rtemFlag,
                    };

                    if (v.type == constant.data().quotationRtem.TYPE_CMPREH_INT && cpWidget.length) {
                        _quortval["qfaid"] = cpWidget.attr("data-qfaid");
                        _quortval["type"] = constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT;
                        _quortval["areaType"] = constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT;

                        quote.addQuoteRtem(_quortval);
                    }

                    if (v.type == constant.data().quotationRtem.TYPE_GENERRAL_INT) {
                        _quortval["qfaid"] = domain.nowEditDomain.attr("data-qfaid");
                        _quortval["type"] = quote.quoItemType(v.target.type, domain.nowEditDomain.attr('data-areaType'));
                        _quortval["areaType"] = domain.nowEditDomain.attr('data-areaType');

                        quote.addQuoteRtem(_quortval);
                    }
                });
            });

            quote.quotesRecord = [];
        },

        addQuoteRtem: function(v) {

            var item = null;

            var widget = domain.nowEditDomain;
            var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');

            var cpList = cpWidget.find('.fl-quo-list.list');
            var quolist = widget.find('.fl-quo-list.list');

            if (v.areaType == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT) {
                item = cpList.find('.fl-quo-item.item[data-qiid="' + v.qiid + '"]', cpWidget);
            } else {
                item = quolist.find('.fl-quo-item.item[data-qiid="' + v.qiid + '"]', widget);
            }

            if (item && item.length != 0) {

                var oldFormula = item.find('.cell.formula .cell-wrap').text();
                var oldNum = item.find('.cell.num .cell-wrap').text();

                v.qfaiId = item.find('input[name="deleteItems"]').val();
                v.formula = utils.accAdd(oldFormula, v.formula);
                v.num = utils.accAdd(oldNum, v.num);

                item.find('.cell.formula .cell-wrap').text(v.formula);
                item.find('.cell.num .cell-wrap').text(v.num);

            } else if (v.areaType == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT) {
                v.index = cpList.find('.fl-quo-item.item').length + 1;
                item = painter.createQuote(v.index, v).appendTo(cpList);
            } else {
                v.index = quolist.find('.fl-quo-item.item').length + 1;
                item = painter.createQuote(v.index, v).appendTo(quolist);
            }

            var fee = quo.calculateNowQuoteItem(v.num, v.areaType, item);

            var args = {
                "quotetionFunctionAreaItem.discount": v.discount,
                "quotetionFunctionAreaItem.qfaiId": v.qfaiId,
                "quotetionFunctionAreaItem.name": v.name,
                "quotetionFunctionAreaItem.measurementUnit": v.measurementUnit,
                "quotetionFunctionAreaItem.formula": v.formula,
                "quotetionFunctionAreaItem.workType": v.workType,
                "quotetionFunctionAreaItem.unitPrice": v.unitPrice,
                "quotetionFunctionAreaItem.addPrice": v.addPrice,
                "quotetionFunctionAreaItem.subPrice": v.subPrice,
                "quotetionFunctionAreaItem.initNum": v.num,
                "quotetionFunctionAreaItem.num": v.num,
                "quotetionFunctionAreaItem.subtype": v.subtype,
                "quotetionFunctionAreaItem.type": v.type,
                "quotetionFunctionAreaItem.qfaid": v.qfaid,
                "quotetionFunctionAreaItem.index": v.index,
                "quotetionFunctionAreaItem.qiid": v.qiid,
                "quotetionFunctionAreaItem.content": v.content,
            }

            com.post(api.quotation.updateQuotetionFunctionAreaItem, $.extend({}, args, quo.basicParams), function(res) {

                com.focusPage('[data-qfaid="' + res.quotetionFunctionAreaItem.qfaid + '"]', '#functionAreaSumList').find('label.no-padding-left').text(fee);
                item.attr("data-qfaiid", res.quotetionFunctionAreaItem.qfaiId);
                item.find('input[name="deleteItems"]').val(res.quotetionFunctionAreaItem.qfaiId);

                item.find(".icon-arrow-up").removeClass("grey").addClass("green");
                item.find(".icon-arrow-down").removeClass("grey").addClass("red");
            }, null, false);
        },

        quoItemType: function(itemType, areaType) {

            var type = "0";

            if (itemType == constant.data().quotationItem.TYPE_CUSTOM_INT) { // 自定义
                type = constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT;
            }

            if (areaType == constant.quotation().quotetionFunctionArea.TYPE_NOT_COUNT_INT) { // 不计
                type = constant.quotation().quotetionFunctionAreaItem.TYPE_IGNORE_INT;
            }

            if (areaType == constant.quotation().quotetionFunctionArea.TYPE_COST_INT) { // 成本
                type = constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT;
            }

            if (areaType == constant.quotation().quotetionFunctionArea.TYPE_ACHIEVEMENT_INT) { // 非业绩
                type = constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT;
            }

            if (areaType == constant.quotation().quotetionFunctionArea.TYPE_PROJECT_NUM_INT && itemType == constant.data().quotationItem.TYPE_COST_INT) { // 工程量 && 成本
                type = constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT;
            }

            if (areaType == constant.quotation().quotetionFunctionArea.TYPE_PROJECT_NUM_INT && itemType == constant.data().quotationItem.TYPE_UNACHE_INT) { // 工程量 && 非业绩
                type = constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT;
            }

            return type;
        },

        moveAreaItem: function($quote, $movequote, $direction) {

            if (!$quote.find('input[name="deleteItems"]').val()) {
                return false;
            }

            if ($direction == "up") {
                if ($quote.prev().length == 0 || !$movequote.find('input[type="checkbox"]').val()) {
                    return false;
                }
                $quote.insertBefore($movequote);
            }
            if ($direction == "down") {
                if ($quote.next().length == 0 || !$movequote.find('input[type="checkbox"]').val()) {
                    return false;
                }
                $quote.insertAfter($movequote);
            }

            var _nowline = $quote.find(".cell.line .cell-wrap").text();
            var _upline = $movequote.find(".cell.line .cell-wrap").text();

            $quote.find(".cell.line .cell-wrap").text(_upline);
            $movequote.find(".cell.line .cell-wrap").text(_nowline);

            var _data = {};
            _data["quotetionFunctionAreaItems[" + 0 + "].qfaiId"] = $quote.find('input[type="checkbox"]').val();
            _data["quotetionFunctionAreaItems[" + 0 + "].index"] = _upline;
            _data["quotetionFunctionAreaItems[" + 1 + "].qfaiId"] = $movequote.find('input[type="checkbox"]').val();
            _data["quotetionFunctionAreaItems[" + 1 + "].index"] = _nowline;

            var _quotetionFunctionArea = {
                "quotetionFunctionArea.qfaId": $quote.parents('div.widget-box.transparent').attr('data-qfaid')
            };

            com.post(api.quotation.updateQuotetionFunctionAreaItemForIndex, $.extend({}, _data, _quotetionFunctionArea), function(res) {

            }, null, false);
        },

        quotetionFunctionAreaFormula: function(expres, $widget, initNum) {

            var param = {
                "girth": $widget.attr("data-girth") ? $widget.attr("data-girth") : 0,
                "area": $widget.attr("data-area") ? $widget.attr("data-area") : 0,
                "height": $widget.attr("data-height") ? $widget.attr("data-height") : 0,
                "holeLength": $widget.attr("data-holeLength") ? $widget.attr("data-holeLength") : 0,
                "holeHeight": $widget.attr("data-holeHeight") ? $widget.attr("data-holeHeight") : 0,
                "windowLength": $widget.attr("data-windowLength") ? $widget.attr("data-windowLength") : 0,
                "windowHeight": $widget.attr("data-windowHeight") ? $widget.attr("data-windowHeight") : 0,
                "beamLength": $widget.attr("data-beamLength") ? $widget.attr("data-beamLength") : 0,
                "beamHeight": $widget.attr("data-beamHeight") ? $widget.attr("data-beamHeight") : 0
            };

            expres = expres ? expres : "0";

            if (expres.indexOf("{") != -1 || expres.indexOf("}") != -1) {
                expres = com.format(expres, {
                    "a": param.girth, // 周长
                    "b": param.area, // 面积
                    "c": param.height, // 举架
                    "d": param.holeLength, // 洞面
                    "e": param.holeHeight, // 参数
                    "f": param.windowLength, // 窗面
                    "g": param.windowHeight, // 变量
                    "h": param.beamLength, // 梁长
                    "i": param.beamHeight, // 梁高

                    "o": 0, // 楼层（quotetion 默认为0）
                    "of": 0, // 有无电梯（quotetion 默认为0）

                    "u": quo.basicParams["quotetion.taxPrice"], // 税金
                    "v": quo.basicParams["quotetion.managePrice"], // 管理费
                    "x": quo.basicParams["quotetion.undisPrice"], // 不打折总额
                    "y": quo.basicParams["quotetion.disPrice"], // 打折总额
                    "z": quo.basicParams["quotetion.trafficPrice"], // 车运费
                    "w": initNum, // 工程量
                    "k": 0, // 计价面积
                    "j": 0
                });
            }

            if (expres.indexOf('~') != -1) {
                expres = expres.split('~')[1];
            }

            if (expres.indexOf('|') != -1) {

                var _pre = expres.split('|')[0];
                var _nex = expres.split('|')[1];

                expres = "Math.max(" + _pre + ", " + _nex + ")";
            }

            var formula = {
                "formula": expres,
                "num": utils.changeThrDecimal(isNaN(eval(expres)) ? 0 : eval(expres))
            };

            return formula;
        },

        init: function() {

            this.saveCustomQuotesAdd();
            this.clearQuoteSelected();
            this.calculationNum();
            this.addHistoryQuotes();
        }
    };

    var painter = {

        // 创建功能区
        createdomain: function(dv) {

            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var btnShow = [constant.quotation().quotetionFunctionArea.TYPE_MANAGEMENT_INT, constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT].indexOf(dv.type) == -1;

            var _btnSet = {
                "$btnEdit": ["编辑功能区", '<i class="bigger-125 icon-pencil blue"></i>', btnShow],
                "$btnAdd": ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type != constant.quotation().quotetionFunctionArea.TYPE_MANAGEMENT_INT],
                "$btnSet": ["自定义报价项", '<i class="bigger-125  icon-plus-sign purple"></i>', btnShow],
                "$btnHistory": ["历史报价项", '<i class="bigger-125 icon-star green"></i>', btnShow],
                "$btnDelQuo": ["批量删除报价项", '<i class="bigger-125 icon-remove pink"></i>', btnShow],
                "$btnDelDomain": ["删除功能区", '<i class="bigger-125 icon-trash red"></i>', btnShow],
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
            };
            var sum = 0, sumdp = 0, sumd = 0, cost = 0, unache = 0, cons = 0, coms = 0, rtem = 0;

            $domain = $('<div></div>').addClass('widget-box transparent').attr({
                "data-dlevel": dv.functionAreaOrder, // 排序
                "data-qfaId": dv.qfaId, // 报价项中的功能区ID
                "data-areaType": dv.type, // 类型 功能区的type
                "data-total": dv.total,

                // 功能区参数
                "data-girth": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.girth : 0,
                "data-area": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.area : 0,
                "data-height": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.height : 0,
                "data-holeLength": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.holeLength : 0,
                "data-holeHeight": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.holeHeight : 0,
                "data-windowLength": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.windowLength : 0,
                "data-windowHeight": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.windowHeight : 0,
                "data-beamLength": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.beamLength : 0,
                "data-beamHeight": dv.quotetionFunctionAreaParam ? dv.quotetionFunctionAreaParam.beamHeight : 0
            }).css({
                "margin-bottom": "20px"
            });

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == constant.quotation().quotetionFunctionArea.TYPE_MANAGEMENT_INT || dv.type == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.name));
            $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

            $.each(_btnSet, function(k, v) {

                if (!v[2]) {
                    return true;
                }

                $btns[k] = $('<a></a>').attr({
                    "href": "javascript:void(0)",
                }).css({
                    "padding-left": "5px"
                }).append(v[1]).appendTo($dtoolbar).mouseenter(function() {

                    com.showTip(this, v[0], "top");
                });
            });

            $btns["$btnFold"].attr({
                "data-action": "collapse"
            });

            var _lineSet = [];
            _lineSet.push(["line", "0"]);
            _lineSet.push(["formula", "数量"]);
            _lineSet.push(["num", "数量"]);
            _lineSet.push(["name", "名称"]);
            _lineSet.push(["type", "类型"]);
            _lineSet.push(["unit", "单位"]);
            _lineSet.push(["worktype", "工种"]);
            _lineSet.push(["worktype", "价格"]);
            _lineSet.push(["worktype", "价格"]);
            _lineSet.push(["worktype", "价格"]);
            _lineSet.push(["btns", "功能", {
                "width": "100px"
            }]);

            var $ul = $('<ul></ul>').addClass('fl-quo-list');
            var $li = $('<li></li>').addClass('fl-quo-item').appendTo($ul);

            $.each(_lineSet, function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).css(v.length == 3 ? v[2] : {}).appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list list');
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append(dv.type == constant.quotation().quotetionFunctionArea.TYPE_MANAGEMENT_INT ? null : $ul).append($dbody);

            if (dv.quotetionFunctionAreaItems.length) {

                // 功能区中的报价项
                var _items = dv.quotetionFunctionAreaItems;

                // 按照报价项主键顺序排序
                _items = _items.sort(function(a, b) {

                    if (a.index == null || b.index == null) {
                        return b.index - a.index; // 降序排列
                    } else {
                        return a.index - b.index; // 升序
                    }
                });

                $.each(_items, function(i, v) {

                    v.areaType = dv.type;

                    var $item = that.createQuote(i + 1, v).appendTo($list);

                    if (v.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT || v.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT) {
                        sumd = utils.accAdd(sumd, parseFloat($item.find('.totalprice-discount .cell-wrap').text()));
                        sum = utils.accAdd(sum, parseFloat($item.attr('data-undisPrice')));
                        sumdp = utils.accAdd(sumdp, parseFloat($item.attr('data-disPrice')));
                    }

                    if (v.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT) {
                        cost = utils.accAdd(cost, parseFloat($item.attr('data-costPrice')));
                    }

                    if (v.type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT) {
                        sumd = utils.accAdd(sumd, parseFloat($item.find('.totalprice-discount .cell-wrap').text()));
                        sum = utils.accAdd(sum, parseFloat($item.attr('data-undisPrice')));
                        sumdp = utils.accAdd(sumdp, parseFloat($item.attr('data-disPrice')));

                        unache = utils.accAdd(unache, parseFloat($item.attr('data-unachePrice')));
                    }

                    if (v.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT) {
                        rtem = utils.accAdd(rtem, parseFloat($item.attr('data-rtemPrice')));
                    }

                    if (v.subtype == constant.quotation().quotetionFunctionAreaItem.SUBTYPE_PROJECT_INT) {
                        cons = utils.accAdd(cons, parseFloat($item.attr('data-consPrice')));
                    }

                    if (v.subtype != constant.quotation().quotetionFunctionAreaItem.SUBTYPE_PROJECT_INT) {
                        coms = utils.accAdd(coms, parseFloat($item.attr('data-comsPrice')));
                    }
                });
            }

            if (dv.type == constant.quotation().quotetionFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) { // 总额功能区

                sum = dv.total;
                sumdp = 0;
                sumd = dv.total;
                cost = 0;
                unache = 0;
            }

            if (dv.type == constant.quotation().quotetionFunctionArea.TYPE_COST_INT) { // 成本功能区

                cost = sum;
                unache = 0;

                sum = 0;
                sumdp = 0;
                sumd = 0;
            }

            if (dv.type == constant.quotation().quotetionFunctionArea.TYPE_ACHIEVEMENT_INT) {
                cost = 0;
                unache = sumd;
            }

            if (dv.type != constant.quotation().quotetionFunctionArea.TYPE_MANAGEMENT_INT) {
                $btns.$btnAdd.click(function() {// 添加工程报价项

                    domain.nowEditDomain = $domain;
                    quo.pageQuotationItemForPrice();
                    quo.modals.quotetionItemModal.modal("show");
                    com.focusPage('#addItemFunctionAreaIndex').val(dv.qfaId);
                });
            }

            if (dv.type != constant.quotation().quotetionFunctionArea.TYPE_MANAGEMENT_INT && dv.type != constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT) { // 各种绑定事件

                $btns.$btnEdit.click(function() {// 编辑功能区

                    domain.editDomain($domain);
                });
                $btns.$btnSet.click(function() {// 自定义报价项

                    domain.nowEditDomain = $domain;
                    quo.modals.customItemModal.modal("show");
                });
                $btns.$btnHistory.click(function() {// 历史报价项

                    domain.nowEditDomain = $domain;

                    quo.modals.historyItemModal.modal("show");
                });
                $btns.$btnDelQuo.click(function() {// 批量删除报价项

                    quote.deleteQuoteInBatches($domain);
                });
                $btns.$btnDelDomain.click(function() {// 删除功能区

                    domain.nowEditDomain = $domain;
                    domain.deletDomain($domain);
                });
            }

            $domain.attr('data-desTotalprice', sumd);
            $domain.attr('data-disPrice', sumdp);
            $domain.attr('data-undisPrice', sum);
            $domain.attr('data-costPrice', utils.changeThrDecimal(cost));
            $domain.attr('data-unachePrice', utils.changeThrDecimal(unache));
            $domain.attr('data-rtemPrice', utils.changeThrDecimal(rtem));
            $domain.attr('data-consPrice', cons);
            $domain.attr('data-comsPrice', coms);

            return $domain;
        },

        // 创建报价项
        createQuote: function(linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', '');

            var discount = utils.accDiv(quo.basicParams['quotetion.discount'], 10);

            var _dcp = 0;
            var _num = qv.num;
            var _unitPrice = qv.unitPrice;
            var _type = qv.type;
            var _areaType = qv.areaType;

            var _class = [1].indexOf(qv.discount) != -1 ? "blue" : "green"; // 打折标识 , 名称样式不同

            var _typeName = "-";

            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT) {
                _typeName = "标准";
                _dcp = _unitPrice;
            }

            if (_type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT) { // 自定义
                _dcp = _unitPrice;
                _typeName = "自定义";
            }

            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_TRAFFIC_INT) { // 车运费
                _dcp = _unitPrice;
                _typeName = "管理";
                _num = 1;
            }

            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_MANAGE_INT) { // 管理费 , 单价+非业务人员提点
                _dcp = _unitPrice;
                _typeName = "管理";
                _num = 1;
            }

            if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_COST_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT) { // 成本
                _dcp = _unitPrice;
                _typeName = "优惠";
            }

            if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_NOT_COUNT_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_IGNORE_INT) { // 不计算
                _dcp = 0;
                _typeName = "不计";
            }

            if (_areaType == constant.quotation().quotetionFunctionArea.TYPE_ACHIEVEMENT_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT) { // 非业绩
                _dcp = _unitPrice;
                _typeName = "标准";
            }

            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_TAX_INT) {
                _dcp = _unitPrice;
                _typeName = "管理";
                _num = 1;
            }

            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT) {
                _dcp = _unitPrice;
                _typeName = "综合";
            }

            var _lineSet = [];

            _lineSet.push(["line", linenum, ["data-areaType", qv.areaType]]); // 编号
            _lineSet.push(qv.areaType == 0 ? "" : ["formula", qv.formula ? qv.formula : "0"]); // 公式
            _lineSet.push(["num", qv.num, ["data-subtype", qv.subtype]]); // 数量
            _lineSet.push(["name " + _class, qv.name, ["data-qfaId", qv.qfaid]]); // 名称
            _lineSet.push(["type", _typeName, ["data-type", qv.type]], ["unit", qv.measurementUnit]); // 单位
            _lineSet.push(["worktype", qv.workType]); // 工种
            _lineSet.push(["price unitprice", _dcp, ["data-unitprice", qv.unitPrice]]); // 单价
            _lineSet.push(["price discountprice", _dcp, ["data-discount", qv.discount]]); // 折后价
            _lineSet.push(["price totalprice-discount", utils.changeThrDecimal(utils.accMul(_num, _dcp))]); // 折后价

            var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel, $btnInfo, $btnset, $up, $down;

            $.each(_lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]);
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);

                if (v[2]) {
                    $cell.attr(v[2][0], v[2][1]);
                }

                $cell.append($cellWrap).appendTo($item);
            });

            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_IGNORE_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT) {
                $btnCell = $('<div></div>').addClass('cell btns');
                $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                $inputLable = $('<label></label>');
                $input = $('<input>').addClass('cbox ace').attr({
                    "type": "checkbox",
                    "role": "checkbox",
                    "name": "deleteItems",
                    "data-qiid": qv.qiid ? qv.qiid : "",
                    "disabled": qv.areaType == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT ? "disabled" : null
                }).val(qv.qfaiId);

                $ispan = $('<span></span>').addClass('lbl align-top');

                $inputLable.append($input).append($ispan);
                $btnCellWrap.append($inputLable).appendTo($btnCell);
                $item.append($btnCell);

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

                $up = $('<a></a>').attr({
                    "href": "javascript:void(0)"
                }).css({
                    "padding-left": "5px"
                }).append('<i class="icon-arrow-up bigger-110"></i>').mouseenter(function() {

                    com.showTip(this, "向上", "top");
                });

                $down = $('<a></a>').attr({
                    "href": "javascript:void(0)"
                }).css({
                    "padding-left": "5px"
                }).append('<i class="icon-arrow-down bigger-110"></i>').mouseenter(function() {

                    com.showTip(this, "向下", "top");
                });

                $btnCellWrap.append($btnDel).append($btnInfo).append($up).append($down);

                if (qv.qfaiId) {
                    $up.find("i").addClass("green");
                    $down.find("i").addClass("red");
                } else {
                    $up.find("i").addClass("grey");
                    $down.find("i").addClass("grey");
                }

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

                    com.post(api.quotation.queryQuotationItemByQiid, {
                        "quotationItem.qiid": qv.qiid
                    }, function(res) {

                        com.showTip($btnInfo, res.quotationItem.comment, "left");
                    });

                    return false;
                });

                // 向上移动
                $up.click(function(e) {

                    quote.checkedStyle($item);
                    quote.moveAreaItem($item, $item.prev(), "up");
                    return false;
                });

                // 向下移动
                $down.click(function(e) {

                    quote.checkedStyle($item);
                    quote.moveAreaItem($item, $item.next(), "down");
                    return false;
                });

            }

            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_TRAFFIC_INT) { // 车运费

                $item.attr('id', 'conveyanceCost').attr('qfaiId', qv.qfaiId);
                $btnCell = $('<div></div>').addClass('cell btns');
                $btnCellWrap = $('<div></div>').addClass('cell-wrap');

                $btnset = $('<a></a>').attr('href', 'javascript:void(0)').attr('data-original-title', '车运费设置').append('<i class="bigger-125 icon-cog purple"></i>').mouseenter(function() {

                    com.showTip(this, "车运费设置", "top");
                });

                $btnCellWrap.append($btnset).appendTo($btnCell);
                $item.append($btnCell);

                $btnset.click(function() {

                    quo.modals.trafficRateModal.modal('show');
                });
            }

            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_MANAGE_INT) { // 管理费

                $item.attr('id', 'manageCost').attr('qfaiId', qv.qfaiId);// 管理费
                $btnCell = $('<div></div>').addClass('cell btns');
                $btnCellWrap = $('<div></div>').addClass('cell-wrap');

                $btnset = $('<a></a>').attr('href', 'javascript:void(0)').attr('data-original-title', '管理费设置').append('<i class="bigger-125 icon-cog purple"></i>').mouseenter(function() {

                    com.showTip(this, "管理费设置", "top");
                });

                $btnCellWrap.append($btnset).appendTo($btnCell);
                $item.append($btnCell);

                $btnset.click(function() {

                    com.focusPage('#manageRateModal').modal('show');
                });
            }
            if (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_TAX_INT) {
                $item.attr('id', 'taxCost').attr('qfaiId', qv.qfaiId);
                $btnCell = $('<div></div>').addClass('cell btns');
                $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                $btnset = $('<a></a>').css('visibility', 'hidden').append('<i class="bigger-125 icon-cog purple"></i>');
                $btnCellWrap.append($btnset).appendTo($btnCell);
                $item.append($btnCell);
            }

            $item.attr('data-qfaiid', qv.qfaiId);
            $item.attr('data-qiid', qv.qiid);
            $item.attr('data-isRtem', qv.isRtem == 1 ? 1 : 0);
            $item.attr('data-qrid', qv.quotationRtemId);
            $item.attr('data-count-num', qv.isRtem == 1 ? null : qv.num);
            $item.attr('data-addPrice', qv.addPrice);
            $item.attr('data-subPrice', qv.subPrice);

            $item.attr('data-undisPrice', qv.discount == constant.quotation().quotetionFunctionAreaItem.DISCOUNT_NODISCOUNT_INT && (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT) ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-disPrice', qv.discount == constant.quotation().quotetionFunctionAreaItem.DISCOUNT_DISCOUNT_INT && (qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COMMON_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CUSTOM_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT || qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT) ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-costPrice', qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_COST_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-unachePrice', qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_UNACHE_INT ? utils.changeThrDecimal(utils.accMul(qv.num, utils.accMul(qv.unitPrice, qv.discount == constant.quotation().quotetionFunctionAreaItem.DISCOUNT_NODISCOUNT_INT ? 1 : discount))) : 0);
            $item.attr('data-rtemPrice', qv.type == constant.quotation().quotetionFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-consPrice', qv.subtype == constant.quotation().quotetionFunctionAreaItem.SUBTYPE_PROJECT_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-comsPrice', qv.subtype != constant.quotation().quotetionFunctionAreaItem.SUBTYPE_PROJECT_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);

            return $item;
        },

        // 创建添加功能区中的功能区
        createDomainTemplete: function(v) {

            var $label = $('<label></label>').addClass('col-xs-6');
            var $radio = $('<input>').addClass('ace').attr({
                "name": "quotempl",
                "type": "checkbox"
            }).val(v.faid);
            var $span = $('<span></span>').addClass('lbl').text(v.name);

            $label.append($radio).append($span);

            return $label;
        },

        // 创建添加报价项天窗中的报价项
        createQuoteModalItem: function(v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({
                "margin-bottom": 0
            });

            v.unitPrice = v.version.type == constant.data().quotationVersion.TYPE_INCLUSIVE_INT ? v.addPrice : v.unitPrice;

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "modalQuots",
                "class": "ace ace-checkbox-2",
                "data-name": v.name,
                "data-itemPrice": v.unitPrice,
                "data-itemAddPrice": v.addPrice,
                "data-itemSubPrice": v.subPrice,
                "data-itemUnite": v.unit.name,
                "data-discount": v.discount,
                "data-type": v.type,
                "data-quotetionType": v.category.name,
                "data-quotetionTypeId": v.category.id,
                "data-quotetionClassification": v.classification.name,
                "data-workType": v.workType ? v.workType.name : "-",
                "data-isRtem": v.isRtem,
                "data-qrid": v.rtemFlag,
                "data-des": v.comment,
            }).val(v.qiid);

            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.name);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [];
            propertyArr.push(["类型:", v.category.name, "red"]);
            propertyArr.push(["分类:", v.classification.name, "red"]);
            propertyArr.push(["大类:", v.bigCategory.name, "red"]);
            propertyArr.push(["小类:", v.smallCategory.name, "red"]);
            propertyArr.push(["单位:", v.unit.name, "red"]);
            propertyArr.push(["工种:", v.workType.name, "red"]);
            propertyArr.push(["单价:", v.unitPrice, "blue"]);
            propertyArr.push(["打折:", constant.data().quotationItem.discount.keys[v.discount], "red"]);
            propertyArr.push(["版本:", v.version.name, "grey"]);
            propertyArr.push(["说明:", v.comment, "grey"]);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $label.append($input).append($span).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $input.change(function() {

                var $this = $(this);
                quote.recordQuots($this, $(this).is(':checked'));
            });

            return $liLine;
        },

        // 创建左侧功能区金额统计标签
        createDomainMoney: function(sum, v) {

            var $item = $('<div></div>').addClass('col-md-12');
            var $dwrap = $('<label></label>').addClass('col-md-6 no-padding-right');
            var $dorder = $('<span class="order"></span>').text(v.functionAreaOrder);// 功能区排序
            var $dname = $('<span class="name"></span>').text(v.name);// 功能区名字
            var $dsum = $('<label></label>').addClass('col-md-6 no-padding-left').text(utils.changeThrDecimal(sum));// 折扣价

            if (v.functionAreaOrder == "9998") {
                $dwrap.append($dname);
            } else {
                $dwrap.append($dorder).append("  ").append($dname);
            }

            $item.attr("data-qfaId", v.qfaId).append($dwrap).append($dsum);// 存入功能区ID

            return $item;
        }
    };

    return {
        init: function() {

            // 报价ID
            quo.quotetionId = params.quotation.quotetion.qid;
            quo.quotetion = params.quotation.quotetion;

            com.post(api.quotation.queryQuotetionByQid, {
                "quotetion.qid": quo.quotetionId
            }, function(data) {

                // 左上角显示报价名称

                // 将报价数据获取到全局变量中
                quo.basicParams = {
                    "quotetion.qid": data.quotetion.qid, // 报价Id
                    "quotetion.discount": data.quotetion.discount, // 报价折扣
                    "quotetion.version.no": data.quotetion.version.no, // 报价版本
                    "quotetion.totalPrice": data.quotetion.totalPrice, // 报价总额
                    "quotetion.manageRate": data.quotetion.manageRate, // 管理费比例
                    "quotetion.managePrice": data.quotetion.managePrice, // 管理费
                    "quotetion.trafficPrice": data.quotetion.trafficPrice, // 车运费
                    "quotetion.basePrice": data.quotetion.basePrice, // 基数
                    "quotetion.costPrice": data.quotetion.costPrice, // 基数
                    "quotetion.taxPrice": data.quotetion.taxPrice, // 税金
                    "quotetion.taxRate": data.quotetion.taxRate, // 税金比例
                    "quotetion.consPrice": data.quotetion.consPrice,
                    "quotetion.comsPrice": data.quotetion.comsPrice,
                    "quotetion.updateTime": data.quotetion.updateTime
                };

                // 报价版本存入
                quo.version = data.quotetion.version.no;

                // 左上角显示的折扣
                com.focusPage('#quotetionName').text(data.quotetion.name);
                com.focusPage('#sumquoDiscount').text(data.quotetion.discount);

            }, null, false);

            com.post(api.quotation.queryQuotationVersionByVersionId, {
                "quotationVersion.no": quo.version
            }, function(res) {

                com.focusPage('#quotetionVersion').text(res.quotationVersion.name);
            });

            com.post(api.data.queryPaymentTypeByName, {
                "paymentType.name": "服务费",
                "paymentType.type": 1,
                "paymentType.atttype": 0
            }, function(res) {

                quo.paymentType = res.paymentType;
            }, function(res) {

                quo.paymentType = {
                    "ptid": 0,
                    "rate": 0
                }
            }, false);

            com.post(api.system.querySystemConfigByKey, {
                "systemConfig.key": "SERVICE_PAYMENT_RATE_INT"
            }, function(res) {

                if (res.systemConfig.value)
                    quo.paymentType.rate = parseFloat(res.systemConfig.value);
            });

            com.post(api.system.querySystemConfigByKey, {
                "systemConfig.key": "MATERIAL_PACKAGE_PRICE_STR"
            }, function(res) {

                if (!res.systemConfig.value || res.systemConfig.value == "")
                    return false;

                var obj = JSON.parse(res.systemConfig.value);
                quo.packageType = Object.entries(obj);

                $.each(quo.packageType, function(i, v) {

                    v.push(1);
                });

            }, null, false);

            // 通过报价ID获取报价项中的功能区
            com.post(api.quotation.queryQuotetionFunctionAreaByQid, {
                "quotetion.qid": quo.quotetionId
            }, function(data) {

                // 将整数折扣换算为小数点(解决浮点数计算BUG)
                var _discount = utils.accDiv(quo.basicParams['quotetion.discount'], 10);
                var _undisPrice = 0, _disPrice = 0, _costPrice = 0, _unachePrice = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _taxfee = 0, _rtemPrice = 0, _consPrice = 0, _comsPrice = 0;

                if (data.quotetionFunctionAreas.length) {

                    $.each(data.quotetionFunctionAreas, function(i, v) {

                        var sum = 0, sumdp = 0, sumd = 0, $dmoney = 0, unache = 0, rtem = 0;
                        var $domain = painter.createdomain(v).appendTo(com.focusPage('#functionAreaDetailList'));

                        if (v.type == constant.quotation().quotetionFunctionArea.TYPE_PROJECT_NUM_INT) {

                            sum = parseFloat($domain.attr('data-undisPrice')); // 功能区非打折项总价
                            sumdp = parseFloat($domain.attr('data-disPrice')); // 功能区打折项折前总价
                            sumd = parseFloat($domain.attr('data-desTotalprice')); // 功能区折后总价
                            cost = parseFloat($domain.attr('data-costPrice'));
                            unache = parseFloat($domain.attr('data-unachePrice'));

                            painter.createDomainMoney(utils.changeThrDecimal(sumd), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _disPrice = utils.changeThrDecimal(utils.accAdd(_disPrice, sumdp)); // 功能区打折项总价相加
                            _undisPrice = utils.changeThrDecimal(utils.accAdd(_undisPrice, sum)); // 功能区非打折项总价相加
                            _dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd)); // 功能区折后总价相加
                            _costPrice = utils.accAdd(_costPrice, cost);
                            _unachePrice = utils.accAdd(_unachePrice, unache);
                        } else if (v.type == constant.quotation().quotetionFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) {

                            painter.createDomainMoney(v.total ? v.total : 0, v).appendTo(com.focusPage('#functionAreaSumList'));

                            _undisPrice = utils.accAdd(_undisPrice, v.total ? v.total : 0); // 功能区非打折项总价相加
                            _dtotalfee = utils.accAdd(_dtotalfee, v.total ? v.total : 0); // 功能区折后总价相加
                        } else if (v.type == constant.quotation().quotetionFunctionArea.TYPE_NOT_COUNT_INT) {
                            painter.createDomainMoney(0, v).appendTo(com.focusPage('#functionAreaSumList'));
                        } else if (v.type == constant.quotation().quotetionFunctionArea.TYPE_COST_INT) {

                            sum = parseFloat($domain.attr('data-undisPrice')); // 功能区非打折项总价

                            painter.createDomainMoney(utils.changeThrDecimal(sum), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _costPrice = utils.accAdd(_costPrice, v.total ? v.total : 0);
                        } else if (v.type == constant.quotation().quotetionFunctionArea.TYPE_ACHIEVEMENT_INT) {
                            sum = parseFloat($domain.attr('data-undisPrice')); // 功能区非打折项总价
                            sumdp = parseFloat($domain.attr('data-disPrice')); // 功能区打折项折前总价
                            sumd = parseFloat($domain.attr('data-desTotalprice')); // 功能区折后总价

                            painter.createDomainMoney(utils.changeThrDecimal(sum), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _disPrice = utils.changeThrDecimal(utils.accAdd(_disPrice, sumdp)); // 功能区打折项总价相加
                            _undisPrice = utils.changeThrDecimal(utils.accAdd(_undisPrice, sum)); // 功能区非打折项总价相加
                            _dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd)); // 功能区折后总价相加
                            _unachePrice = utils.changeThrDecimal(utils.accAdd(_unachePrice, sumd));
                        } else if (v.type == constant.quotation().quotetionFunctionArea.TYPE_CMPREH_INT) {
                            sum = parseFloat($domain.attr('data-undisPrice'));
                            sumdp = parseFloat($domain.attr('data-disPrice'));
                            sumd = parseFloat($domain.attr('data-desTotalprice'));
                            cost = parseFloat($domain.attr('data-costPrice'));
                            unache = parseFloat($domain.attr('data-unachePrice'));
                            rtem = parseFloat($domain.attr('data-rtemPrice'));

                            painter.createDomainMoney(utils.changeThrDecimal(sum), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _disPrice = utils.changeThrDecimal(utils.accAdd(_disPrice, sumdp));
                            _undisPrice = utils.changeThrDecimal(utils.accAdd(_undisPrice, sum));
                            _dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd));
                            _costPrice = utils.accAdd(_costPrice, cost);
                            _unachePrice = utils.accAdd(_unachePrice, unache);
                            _rtemPrice = utils.accAdd(_rtemPrice, rtem);
                        }

                        _consPrice = utils.changeThrDecimal(utils.accAdd(_consPrice, parseFloat($domain.attr('data-consPrice'))));
                        _comsPrice = utils.changeThrDecimal(utils.accAdd(_comsPrice, parseFloat($domain.attr('data-comsPrice'))));
                    });

                    var manageCost = com.focusPage('#manageCost'); // 管理费
                    var converyanceCost = com.focusPage('#conveyanceCost'); // 车运费
                    var taxCost = com.focusPage('#taxCost'); // 税金

                    _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _discount : 1; // 车运费折扣
                    _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? _discount : 1; // 管理费折扣
                    _taxDiscount = taxCost.length != 0 ? taxCost.find('.discountprice').attr('data-discount') : 0;// 税金折扣

                    _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
                    _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
                    _taxRate = parseFloat(taxCost.length != 0 ? taxCost.find('.discountprice .cell-wrap').text() : 0); // 获取税金比例(根据报价版本获得)

                    _transfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(_disPrice, _undisPrice), _tranRate)); // 未计算车运费之前的总价格*车运费比例=车运费
                    _managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee), _manageRate)); // (未计算车运费之前的总价格+车运费)*管理费

                    _dtransfee = utils.changeThrDecimal(utils.accMul(_transfee, _transDiscount)); // 车运费*车运费折扣
                    _dmanagefee = utils.changeThrDecimal(utils.accMul(_managefee, _manageDiscount)); // (未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣
                    _dtaxfee = 0;

                    if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) {
                        _taxfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee), _taxRate));
                        _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
                    }

                    if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) {
                        _taxfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee), _managefee), _taxRate));
                        _dtaxfee = _taxfee;
                    }

                    _total = utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee), _managefee), _taxfee)); // 未计算车运费之前的总价格+车运费+管理费=(未打折的总价格)

                    if (quo.basicParams["quotetion.basePrice"] && quo.basicParams["quotetion.totalPrice"] != 0) {
                        // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
                        var total = utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _transfee); // 工程基数
                        var remainder = utils.changeThrDecimal(total % quo.basicParams['quotetion.basePrice']); // 余数

                        _dtotal = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), _discount), remainder), _dmanagefee), _dtaxfee)));
                    } else {
                        // (未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                        _dtotal = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(_dtotalfee, _dtransfee), _dmanagefee), _dtaxfee)));
                    }

                    converyanceCost.find('.num .cell-wrap').text(_dtransfee);// 显示到生成项目 车运费(未折扣的车运费)
                    manageCost.find('.num .cell-wrap').text(_dmanagefee);// 显示到生成项目 管理费(未折扣的管理费)
                    taxCost.find('.num .cell-wrap').text(_dtaxfee);// 显示到生成项目 税金(未折扣的管理费)

                    com.focusPage('#costPrice').text(utils.changeThrDecimal(_costPrice));
                    com.focusPage('#sumquoSumMoney').text(utils.changeThrDecimal(_total));
                    com.focusPage('#sumquoDiscountMoney').text(_dtotal);
                    com.focusPage('#taxPrices').text(_dtaxfee);

                    quo.basicParams["quotetion.totalPrice"] = _dtotal;
                    quo.basicParams["quotetion.managePrice"] = _managefee;// 管理费
                    quo.basicParams["quotetion.trafficPrice"] = _transfee;// 车运费
                    quo.basicParams["quotetion.trafficRate"] = _tranRate;// 车运费比例
                    quo.basicParams["quotetion.taxPrice"] = _taxfee;// 税金
                    quo.basicParams["quotetion.taxRate"] = _taxRate;// 税金比例
                    quo.basicParams["quotetion.undisPrice"] = _undisPrice;// 非打折项折前总额
                    quo.basicParams["quotetion.disPrice"] = _disPrice;// 打折项折前总额
                    quo.basicParams["quotetion.disPrice"] = _disPrice;// 打折项折前总额
                    quo.basicParams["quotetion.costPrice"] = _costPrice;// 打折项折前总额
                    quo.basicParams["quotetion.unachePrice"] = utils.changeThrDecimal(_unachePrice);
                    quo.basicParams["quotetion.consPrice"] = _consPrice;
                    quo.basicParams["quotetion.comsPrice"] = _comsPrice;
                }

            }, null, false);

            quo.init();
            domain.init();
            quote.init();
        }
    };

})();

$(function() {

    $.extend(com.validator, {
        manageRate: {
            type: "v_manageRate",
            regex: /^(1\.0{1,3}|1|0\.[0-9]{1,3})$/,
            errorMsg: "请输入0到1之间的小数"
        }
    });

    QuotetionDetail.init();
});
