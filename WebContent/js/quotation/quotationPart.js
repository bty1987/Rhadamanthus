var QuotationDetail = (function() {

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

        orderid: null, // 装修单号
        quotationid: null, // 报价ID
        versionId: null, // 报价版本
        notSalesmanRate: null, // 非业务人员提点
        basicParams: null,
        precontractTime: null,
        preferParams: null,
        houseParams: null,
        extensionManagePrice: 0,

        decoration: null,
        protation: null,

        quoModals: {},
        settingBtns: {},
        quoteCalculation: {},
        machingType: {},
        typeness: {},
        oldPrefer: {},
        currentSubmitType: 0, // 0=特批优惠审批, 1=活动优惠审批
        workTypes: null,
        defaults: null,
        quoteItemId: null,

        initSettingBtns: function() {

            var that = this;

            that.settingBtns = {
                // 功能区
                $btnAddDomain: com.focusPage('#functionAreaTemplateBtn').click(function() {

                    that.quoModals.$domainTempletModal.modal("show");
                }),
                // 折扣
                $btnDiscount: com.focusPage('#discountBtn').on('click', function() { // 折扣界面

                    that.quoModals.$domainDiscountModal.modal("show");
                }),
                // 优惠
                $btnPrefer: com.focusPage('#preferBtn').on('click', function() {

                    com.focusPage('#prefer').val(quo.preferParams["quotationPrefer.preferPrice"]);
                    com.focusPage('#manage').val(quo.preferParams["quotationPrefer.managePrefer"]);
                    com.focusPage('#advance').val(quo.preferParams["quotationPrefer.advancePrefer"]);
                    com.focusPage('#square').val(quo.preferParams["quotationPrefer.quoteArea"]);
                    com.focusPage('#activityProfit', "#quotationPreferModal").val(quo.preferParams["quotationPrefer.activityProfit"]);

                    com.focusPage("#innerFloor").val(quo.houseParams["house.innerFloor"]);
                    com.focusPage("#isLift").val(quo.houseParams["house.isLift"]);

                    that.quoModals.$domainPreferModal.modal("show");
                }),
                // 计价面积
                $btnInnerArea: com.focusPage('#innerAreaBtn').on('click', function() {

                    com.focusPage('#prefer').val(quo.preferParams["quotationPrefer.preferPrice"]);
                    com.focusPage('#manage').val(quo.preferParams["quotationPrefer.managePrefer"]);
                    com.focusPage('#advance').val(quo.preferParams["quotationPrefer.advancePrefer"]);
                    com.focusPage('#square').val(quo.preferParams["quotationPrefer.quoteArea"]);

                    com.focusPage("#innerFloor").val(quo.houseParams["house.innerFloor"]);
                    com.focusPage("#isLift").val(quo.houseParams["house.isLift"]);

                    that.quoModals.$domainPreferModal.modal("show");
                }),
                // 计算总价
                $btnCalculateTotal: com.focusPage('#calculateTotalBtn').on('click', function() {

                    com.focusPage('#calculateTotalFeeModal').find('.fl-quo-cal').html(null);
                    com.focusPage("#calDiscount").val("");
                    quo.calculateTotalFee(10);
                    quo.servePriceShow();
                    that.quoModals.$calculateTotalModal.find('.machingInfos').hide();
                    that.quoModals.$calculateTotalModal.modal("show");
                }),
                // 更新价格
                $btnPrice: com.focusPage('#priceBtn').click(function() {

                    that.quoModals.$updatePriceModal.modal("show");
                }),

                $btnMachingMore: com.focusPage('#machingMoreBtn').on('click', function() {

                    com.focusPage('#calculateTotalFeeModal').find('.machingInfos').toggle();
                }),
                // 统计
                $btnReport: com.focusPage('#viewStatisticalBtn').bindClick(function() {

                    com.post(api.quotation.amountQuotationNormood, {
                        'quotation.qid': quo.quotationid
                    }, function(res) {

                        quo.statisticsQuoteNormedData(res.normoods, 0);
                    }, null, false);

                    com.post(api.quotation.amountQuotationNormrice, {
                        'quotation.qid': quo.quotationid
                    }, function(res) {

                        quo.statisticsQuoteNormedData(res.normrices, 1);
                    }, null, false);

                    that.quoModals.$quotationStatisticalModal.modal('show');
                }, 2000),
                // 保存
                $btnSave: com.focusPage('#saveQuotationBtn').bindClick(function() { // 保存报价信息

                    com.post(api.quotation.updateQuotationForAdvance, quo.basicParams, function(res) {

                        com.showAlert(com.info, "操作成功");
                    });
                }, 2000),
                // 打印
                // $btnPrint : com.focusPage('#printFinanceBtn').attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quo.quotationid + "&orderType="+ quo.decorationType + "&type=2&time=" + params.loginTime),
                $btnPrint: com.focusPage('#printFinanceBtn').click(function() {

                    var printConf = {
                        "quotationId": quo.quotationid,
                        "layout": "3",
                        "type": 17,
                        "itemtype": [0, 1, 2, 3, 4, 5, 6, 7],
                        "calType": "0"
                    };

                    params.quotation.quotation = {
                        "printConf": printConf
                    };

                    com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, true);
                }),
                // 返回
                $btnBack: com.focusPage('#detailBckBtn').on('click', function() {

                    com.showConfirm("当前页面存在重要数据,是否进行当前操作", function(result) {

                        com.switchPage(api.index.quotationIndex.url);
                        com.closePopover();
                    });
                }),
                // 展开
                $btnSpread: com.focusPage('#openFunctionAreasBtn').click(function() {

                    com.focusPage('.icon-chevron-down').parent().trigger('click');
                }),
                // 收起
                $btnCollapse: com.focusPage('#closeFunctionAreasBtn').click(function() {

                    com.focusPage('.icon-chevron-up').parents('[data-action="collapse"]').trigger('click');
                }),
                $closeStatisticalBtn: com.focusPage('#closeStatisticalBtn').click(function() {

                    quo.quoModals.statisticalNormedDataDiv.empty();
                }),
                $updatePreferBtn: com.focusPage('#updatePreferBtn').click(function() {

                    com.focusPage("#produceShow").show();
                }),
                $btnApproveClose: com.focusPage('#closeApproveBtn', '#approveModal').click(function() {

                    quo.oldQuotationPreferData();
                }),
                $btnApproveX: com.focusPage('.close', '#approveModal').click(function() {

                    quo.oldQuotationPreferData();
                }),
                $pauseTimerPageBtn: com.focusPage('#pauseTimerBtn').bindClick(function() {

                    if (params.urlLoadParams.type != null) {
                        clearInterval(params.quotation.pagingTimeId);
                        params.quotation.pagingTimeId = null;
                        com.focusPage('#quotationPartPage').hide();
                    } else {
                        clearInterval(params.quotation.pagesTimeId);
                        params.quotation.pagesTimeId = null;
                        com.focusPage('#quotationPart').hide();
                    }

                    com.clearValidator();
                    quote.updateQuotationForTime();
                    com.focusPage('#resumeTimer').show();
                }, 5000),
                $resumeTimerBtn: com.focusPage('#resumeTimerBtn').click(function() {

                    quote.quotationResumeEntryTime();
                    com.focusPage('#resumeTimer').hide();

                    if (params.urlLoadParams.type != null) {
                        com.focusPage('#quotationPartPage').show();
                    } else {
                        com.focusPage('#quotationPart').show();
                    }
                })
            };
            return that;
        },

        initQuoModals: function() {

            var that = this;

            that.quoModals = {
                // 编辑功能区
                $domainEditModal: com.focusPage("#functionAreaModal"),
                $domainParamEditModal: com.focusPage("#functionAreaParamModal"),
                // 添加功能区
                $domainTempletModal: com.focusPage("#functionAreaTemplateModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="quoteparam"]').val('');
                    com.focusPage('input[name="quotempl"]:checked').removeAttr('checked');
                }),
                // 编辑折扣
                $domainDiscountModal: com.focusPage("#discountModal"),
                // 编辑优惠
                $domainPreferModal: com.focusPage("#quotationPreferModal").on("show.bs.modal", function(a) {

                    com.focusPage('#produceShow').hide();
                }),
                // 优惠审批
                $domainApproveModal: com.focusPage("#approveModal"),
                // 计算总价
                $calculateTotalModal: com.focusPage('#calculateTotalFeeModal'),
                // 更新价格
                $updatePriceModal: com.focusPage('#updatePriceModal'),
                // 添加默认报价项
                $quoteModal: com.focusPage("#quotationItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                // 添加自定义报价项
                $quoteAddModal: com.focusPage("#customFunctionAreaItemsModal").on("show.bs.modal", function(a) {

                    com.focusPage("#name").val("");
                    com.focusPage("#quotationItemDes").val("");
                    com.focusPage("#unitPrice").val("");
                    com.focusPage("#addPrice").val("");
                    com.focusPage("#subPrice").val("");
                    com.focusPage('#formula').val("");
                    com.focusPage("#num").val("");
                    com.focusPage("#measurementUnit").get(0).selectedIndex = 0;
                    com.focusPage("#workType").get(0).selectedIndex = 0;
                    com.focusPage("#discountFlag").removeAttr("checked");
                }),
                // 历史记录
                $historyModal: com.focusPage("#historyQuotationItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                // 管理费比例设置saveMrBtn
                $manageRateModal: com.focusPage('#manageRateModal').on("show.bs.modal", function(a) {

                    com.focusPage('#manageRate').val(null);
                }),
                // 税金类型设置saveTrBtn
                $taxRateModal: com.focusPage('#taxRateModal').on("show.bs.modal", function(a) {

                    com.focusPage('#taxType').val(null);
                }),
                $quotationStatisticalModal: com.focusPage('#quotationStatisticalModal'),
                statisticalNormedDataDiv: com.focusPage('#statisticalNormedDataDiv'),
                $quotationRtemAddModal: com.focusPage('#quotationRtemUpgradeModal').on("show.bs.modal", function(a) {

                    quote.quotesRecord = [];
                }),
            };

            com.focusPage("#functionAreaModal").find('.parameter').hide();

            // 初始化功能区添加弹层
            com.post(api.quotation.queryFunctionAreaByVersionId, {
                "functionArea.version.no": that.versionId
            }, function(data) {

                data.functionAreas.length && $.each(data.functionAreas, function(i, v) {

                    if (v.type != constant.data().functionArea.TYPE_MANAGE_INT) {
                        var $dtempl = painter.createDomainTemplete(v);
                        that.quoModals.$domainTempletModal.find('.modal-body').append($dtempl);
                    }
                });
            }, null, false);

            // 初始化自定义报价项弹层
            com.post(api.common.queryMeasurementUnit, {}, function(res) {

                com.focusPage("#measurementUnit").bindData(res.measurementUnits, "name", "name");
            }, null, false);

            com.post(api.common.queryWorkType, {}, function(res) {

                com.focusPage("#workType").bindData(res.workTypes, "name", "name");
            }, null, false);

            // 初始化自定义报价中的类型
            com.post(api.quotation.queryQuotationType, {}, function(res) {

                com.focusPage("#quotationType").bindData(res.quotationTypes, "id", "name");
            });

            com.post(api.data.queryDecorationAtttype, {}, function(res) {

                $.each(res.decorationAtttypes, function(i, v) {

                    if (v.status == constant.decoration().decorationAtttype.status.STATUS_ENABLE_INT)
                        quo.typeness["typeness[" + i + "]"] = v.key;
                });
            }, null, false);

            // 初始化半价/满减配比
            com.post(api.data.queryDecorationMatching, quo.typeness, function(res) {

                quo.machingType = res.decorationMatchings;

            });

            return that;
        },

        // 统计车运费管理费总价折扣价
        calculateQuoFees: function(func) {

            var _discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);
            var _undisPrice = 0, _disPrice = 0, _costPrice = 0, _unachePrice = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0, _taxfee = 0, _taxRate = 0, _rtemPrice = 0, _undisComPrice = 0, _disComPrice = 0, _consPrice = 0, _comsPrice = 0;

            var $domains = com.focusPage('#functionAreaDetailList .widget-box:not([data-del-sign="1"])');

            if (!$domains.length) {
                return false;
            }

            $domains.each(function() {

                var sum = 0, sumd = 0, sumdp = 0, cost = 0, unache = 0, rtem = 0, comdp = 0, comp = 0;

                var $this = $(this);

                var _areaType = $this.attr('data-areaType');

                if (_areaType == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT || _areaType == constant.quotation().quotationFunctionArea.TYPE_HIDE_INT) { // 工程量计算

                    if (func)
                        func($this);

                    sum = parseFloat($this.attr('data-undisPrice')); // 非折扣总价格
                    sumdp = parseFloat($this.attr('data-disPrice')); // 折扣总价格
                    sumd = parseFloat($this.attr('data-desTotalprice')); // 折扣后总价格
                    cost = parseFloat($this.attr('data-costPrice'));
                    unache = parseFloat($this.attr('data-unachePrice'));

                    _undisPrice = utils.accAdd(_undisPrice, sum); // 非折扣总价格
                    _disPrice = utils.accAdd(_disPrice, sumdp); // 折扣总价格
                    _dtotalfee = utils.accAdd(_dtotalfee, sumd); // 格式化折扣后的总价格
                    _costPrice = utils.accAdd(_costPrice, cost);
                    _unachePrice = utils.accAdd(_unachePrice, unache);
                }

                if (_areaType == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) {

                    _undisPrice = utils.accAdd(_undisPrice, $this.attr('data-total')); // 非折扣总价格
                    _disPrice = utils.accAdd(_disPrice, 0); // 折扣总价格
                    _dtotalfee = utils.accAdd(_dtotalfee, $this.attr('data-total')); // 格式化折扣后的总价格
                    _costPrice = 0;
                    _unachePrice = 0;
                }

                if (_areaType == constant.quotation().quotationFunctionArea.TYPE_COST_INT) {
                    _costPrice = $this.attr('data-total');
                }

                if (_areaType == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT) {
                    _unachePrice = $this.attr('data-total');

                    sum = parseFloat($this.attr('data-undisPrice')); // 非折扣总价格
                    sumdp = parseFloat($this.attr('data-disPrice')); // 折扣总价格
                    sumd = parseFloat($this.attr('data-desTotalprice')); // 折扣后总价格

                    _undisPrice = utils.accAdd(_undisPrice, sum); // 非折扣总价格
                    _disPrice = utils.accAdd(_disPrice, sumdp); // 折扣总价格
                    _dtotalfee = utils.accAdd(_dtotalfee, sumd); // 格式化折扣后的总价格
                    _unachePrice = utils.accAdd(_unachePrice, sumd);
                }

                if (_areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                    sum = parseFloat($this.attr('data-undisPrice'));
                    sumdp = parseFloat($this.attr('data-disPrice'));
                    sumd = parseFloat($this.attr('data-desTotalprice'));
                    cost = parseFloat($this.attr('data-costPrice'));
                    unache = parseFloat($this.attr('data-unachePrice'));
                    rtem = parseFloat($this.attr('data-rtemPrice'));
                    comdp = parseFloat($this.attr('data-undisComPrice'));
                    comp = parseFloat($this.attr('data-disComPrice'));

                    _undisPrice = utils.accAdd(_undisPrice, sum);
                    _disPrice = utils.accAdd(_disPrice, sumdp);
                    _dtotalfee = utils.accAdd(_dtotalfee, sumd);
                    _costPrice = utils.accAdd(_costPrice, cost);
                    _unachePrice = utils.accAdd(_unachePrice, unache);
                    _rtemPrice = utils.accAdd(_rtemPrice, rtem);
                    _undisComPrice = utils.accAdd(_undisComPrice, comdp);
                    _disComPrice = utils.accAdd(_disComPrice, comp);
                }

                _consPrice = utils.accAdd(_consPrice, parseFloat($this.attr('data-consPrice')));
                _comsPrice = utils.accAdd(_comsPrice, parseFloat($this.attr('data-comsPrice')));
            });

            var manageCost = com.focusPage('#manageCost'); // 管理费
            var converyanceCost = com.focusPage('#conveyanceCost'); // 车运费
            var taxCost = com.focusPage('#taxCost'); // 税金

            var preferPrice = quo.preferParams["quotationPrefer.preferPrice"];
            var managePrefer = quo.preferParams["quotationPrefer.managePrefer"];
            var advancePrefer = quo.preferParams["quotationPrefer.advancePrefer"];
            var quotePrice = quo.preferParams["quotationPrefer.quotePrice"];
            var quoteArea = quo.preferParams["quotationPrefer.quoteArea"];
            var activityPrice = quo.preferParams["quotationPrefer.activityPrice"];
            var activityProfit = quo.preferParams["quotationPrefer.activityProfit"];

            _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _discount : 1; // 车运费的折扣
            _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? _discount : 1; // 管理费的折扣
            _taxDiscount = taxCost.find('.discountprice').attr('data-discount'); // 税金折扣

            _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text() == "" ? 0 : converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
            _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text() == "" ? 0 : manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
            _taxRate = parseFloat(taxCost.find('.discountprice .cell-wrap').text() == "" ? 0 : taxCost.find('.discountprice .cell-wrap').text()); // 获取税金比例(根据报价版本获得)

            quotePrice = utils.accAdd(quotePrice, activityPrice);
            _transfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), quotePrice), _tranRate)); // 未计算车运费之前的总价格*车运费比例=车运费
            _managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), quotePrice), _transfee), _manageRate)); // (未计算车运费之前的总价格+车运费)*管理费

            _dtransfee = utils.changeThrDecimal(utils.accMul(_transfee, _transDiscount)); // 车运费*车运费折扣
            _dmanagefee = utils.changeThrDecimal(utils.accMul(_managefee, _manageDiscount)); // (未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣
            _dtaxfee = 0;

            if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) {
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), preferPrice), managePrefer), advancePrefer), activityProfit), _taxRate));
                _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
            }

            if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) {
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), preferPrice), managePrefer), advancePrefer), activityProfit), _taxRate));
                _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
            }

            _total = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), _taxfee), preferPrice), managePrefer), advancePrefer), activityProfit));

            // 基数是否存在,无需判断装修单类型
            if (quo.basicParams["quotation.basePrice"] && quo.basicParams["quotation.basePrice"] != 0) {
                // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
                var total = utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee); // 工程基数
                var remainder = utils.changeThrDecimal(total % quo.basicParams['quotation.basePrice']); // 余数
                _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), _discount), remainder), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer), activityProfit));
            } else {
                // (未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), quotePrice), _dtransfee), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer), activityProfit));
            }

            _dtotal = utils.accAdd(_dtotal, utils.accAdd(_rtemPrice, !(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0));
            _total = utils.accAdd(_total, utils.accAdd(_rtemPrice, !(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0));

            converyanceCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dtransfee)); // 显示到生成项目 车运费(折扣后的车运费)
            manageCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dmanagefee)); // 显示到生成项目 管理费(折扣后的管理费)
            taxCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dtaxfee));// 显示到生成项目 税金(未折扣的管理费)

            com.focusPage('#basePrice').text(utils.changeThrDecimal(quo.basicParams["quotation.basePrice"])); // 显示到左上角的总价
            com.focusPage('#sumLabDiscount').text(utils.changeThrDecimal(quo.basicParams["quotation.discount"])); // 显示到左上角的总价

            com.focusPage('#disPrice').text(utils.changeThrDecimal(_disPrice)); // 显示到左上角的总价
            com.focusPage('#undisPrice').text(utils.changeThrDecimal(_undisPrice)); // 显示到左上角的折扣价
            com.focusPage('#costPrice').text(utils.changeThrDecimal(_costPrice));
            com.focusPage('#unachePrice').text(utils.changeThrDecimal(_unachePrice));// 显示到左上角的折扣价
            com.focusPage('#sumLabSumMoney').text(utils.changeThrDecimal(_total)); // 显示到左上角的总价
            com.focusPage('#sumLabDiscountMoney').text(utils.changeThrDecimal(_dtotal)); // 显示到左上角的折扣价
            com.focusPage('#taxPrices').text(utils.changeThrDecimal(_dtaxfee));
            com.focusPage('#preferPrice').text(preferPrice);
            com.focusPage('#managePrefer').text(managePrefer);
            com.focusPage('#advancePrefer').text(advancePrefer);
            com.focusPage('#quotePrice').text(quotePrice);
            com.focusPage('#countQuotePrice').text(quotePrice);
            com.focusPage('#countTotalPrice').text(utils.changeThrDecimal(_total));
            com.focusPage('#rtemPrice').text(utils.changeThrDecimal(_rtemPrice));

            if (advancePrefer != 0) {
                com.focusPage('#advancePreferShow').show();
                com.focusPage('#advanceShow').show();
            } else {
                com.focusPage('#advancePreferShow').hide();
                com.focusPage('#advanceShow').hide();
            }

            quo.basicParams["quotation.totalPrice"] = utils.changeThrDecimal(_dtotal); // 报价总额
            quo.basicParams["quotation.manageRate"] = utils.changeThrDecimal(utils.accSub(_manageRate, (quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0)); // 管理费比例
            quo.basicParams["quotation.managePrice"] = utils.changeThrDecimal(_managefee); // 管理费
            quo.basicParams["quotation.trafficPrice"] = utils.changeThrDecimal(_transfee); // 车运费
            quo.basicParams["quotation.trafficRate"] = utils.changeThrDecimal(_tranRate); // 车运费比例
            quo.basicParams["quotation.taxPrice"] = utils.changeThrDecimal(_taxfee);// 税金
            quo.basicParams["quotation.taxRate"] = utils.changeThrDecimal(_taxRate);// 税金比例
            quo.basicParams["quotation.undisPrice"] = utils.changeThrDecimal(_undisPrice); // 非打折项折前总额
            quo.basicParams["quotation.disPrice"] = utils.changeThrDecimal(_disPrice); // 打折项折前总额
            quo.basicParams["quotation.costPrice"] = utils.changeThrDecimal(_costPrice); // 成本总额
            quo.basicParams["quotation.unachePrice"] = utils.changeThrDecimal(_unachePrice);
            quo.basicParams["quotation.undisComPrice"] = utils.changeThrDecimal(_undisComPrice);
            quo.basicParams["quotation.disComPrice"] = utils.changeThrDecimal(_disComPrice);
            quo.basicParams["quotation.consPrice"] = utils.changeThrDecimal(_consPrice);
            quo.basicParams["quotation.comsPrice"] = utils.changeThrDecimal(_comsPrice);

            return true;
        },

        calculateQuoFeesPost: function() {

            var _discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);

            var _disPrice = 0, _undisPrice = 0, _transfee = 0, _managefee = 0, _taxfee = 0, quotePrice = 0, preferPrice = 0, managePrefer = 0, advancePrefer = 0, activityProfit = 0, activityPrice = 0, _total = 0, _dtotal = 0;

            _disPrice = quo.basicParams["quotation.disPrice"];
            _undisPrice = quo.basicParams["quotation.undisPrice"];
            _transfee = quo.basicParams["quotation.trafficPrice"];
            _managefee = quo.basicParams["quotation.managePrice"];
            _taxfee = quo.basicParams["quotation.taxPrice"];

            var _taxDiscount = quo.basicParams["quotation.taxDiscount"];

            var manageCost = com.focusPage('#manageCost');
            var converyanceCost = com.focusPage('#conveyanceCost');
            var _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _discount : 1;
            var _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? _discount : 1;

            var _dtransfee = utils.changeThrDecimal(utils.accMul(_transfee, _transDiscount));
            var _dmanagefee = utils.changeThrDecimal(utils.accMul(_managefee, _manageDiscount));
            var _dtaxfee = 0;

            if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) {
                _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
            }

            if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) {
                _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
            }

            preferPrice = quo.preferParams["quotationPrefer.preferPrice"];
            managePrefer = quo.preferParams["quotationPrefer.managePrefer"];
            advancePrefer = quo.preferParams["quotationPrefer.advancePrefer"];
            activityProfit = quo.preferParams["quotationPrefer.activityProfit"];
            quotePrice = quo.preferParams["quotationPrefer.quotePrice"];
            activityPrice = quo.preferParams["quotationPrefer.activityPrice"];
            
            quotePrice = utils.accAdd(quotePrice, activityPrice);

            var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            var cpItems = cpWidget.find("li.fl-quo-item.item");

            var _rtotal = 0;

            $.each(cpItems, function(i, e) {

                var $item = $(e);

                var expres = $item.attr("data-expres");
                var control = $item.attr("data-control");
                var types = $item.find(".cell.type").attr("data-type");

                if (types != constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT)
                    return true;

                if (!expres || control == "1") {
                    var rprice = parseFloat($item.attr('data-rtemprice'));// 无公式综合类型项目价格
                    _rtotal += rprice;
                    return true;
                }

                var quoteFormula = quote.quotationFunctionAreaFormula(expres, cpWidget, 0);

                $item.find('.cell.formula .cell-wrap span').text(quoteFormula.formula);
                $item.find('.cell.num .cell-wrap .number').text(quoteFormula.num);

                var dprice = parseFloat($item.find('.discountprice .cell-wrap').text());// 折扣单价

                var rtotal = utils.changeThrDecimal(utils.accMul(dprice, quoteFormula.num));

                $item.find('.totalprice-discount .cell-wrap').text(rtotal); // 折扣单价*数量

                _rtotal += rtotal;
                var args = {
                    "quotationFunctionAreaItem.qfaiId": $item.attr("data-qfaiid"),
                    "quotationFunctionAreaItem.quotationFunctionAreaId": cpWidget.attr('data-qfaid'),
                    "quotationFunctionAreaItem.formula": quoteFormula.formula,
                    "quotationFunctionAreaItem.initNum": quoteFormula.num,
                    "quotationFunctionAreaItem.num": quoteFormula.num,
                };

                quo.calculateNowQuoteItem(quoteFormula.num, cpWidget.attr('data-areaType'), $item);

                var $params = $.extend({}, args, quo.basicParams);

                com.post(api.quotation.updateQuotationFunctionAreaItem, $params, function(res) {

                });
            });

            cpWidget.attr("data-rtemprice", _rtotal);

            _total = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), _taxfee), preferPrice), managePrefer), advancePrefer), activityProfit));

            // 基数是否存在,无需判断装修单类型
            if (quo.basicParams["quotation.basePrice"] && quo.basicParams["quotation.basePrice"] != 0) {
                // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
                var total = utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee); // 工程基数
                var remainder = utils.changeThrDecimal(total % quo.basicParams['quotation.basePrice']); // 余数
                _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), _discount), remainder), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer), activityProfit));
            } else {
                // (未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), quotePrice), _dtransfee), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer), activityProfit));
            }

            _dtotal = utils.accAdd(_dtotal, utils.accAdd(_rtotal, !(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0));
            _total = utils.accAdd(_total, utils.accAdd(_rtotal, !(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0));

            quo.basicParams["quotation.totalPrice"] = utils.changeThrDecimal(_dtotal); // 报价总额

            com.focusPage('#sumLabSumMoney').text(utils.changeThrDecimal(_total)); // 显示到左上角的总价
            com.focusPage('#sumLabDiscountMoney').text(utils.changeThrDecimal(_dtotal)); // 显示到左上角的折扣价
            com.focusPage('#countTotalPrice').text(utils.changeThrDecimal(_total));
        },

        // 计算功能区总价和折扣总价
        calculateDomainFees: function($domain, func) {

            var _domanFees = 0, sum = 0, sumd = 0, sumdp = 0, cost = 0, unache = 0, rtem = 0, comdp = 0, comp = 0, cons = 0, coms = 0;

            var _areaType = $domain.attr('data-areaType');

            var $arr = com.focusPage('.fl-quo-item.item:not([data-del-sign="1"])', $domain.find(".fl-quo-list.list").eq(0));

            if ($arr.length) {
                $arr.each(function() {

                    $this = $(this);

                    if (func)
                        func($this);
                    var _consPrice = parseFloat($this.attr("data-consPrice"));
                    var _comsPrice = parseFloat($this.attr("data-comsPrice"));
                    cons = utils.changeThrDecimal(utils.accAdd(cons, _consPrice));
                    coms = utils.changeThrDecimal(utils.accAdd(coms, _comsPrice));
                });
            }

            if (_areaType == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT || _areaType == constant.quotation().quotationFunctionArea.TYPE_COST_INT || _areaType == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT || _areaType == constant.quotation().quotationFunctionArea.TYPE_HIDE_INT || _areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) { // 工程量

                if ($arr.length) {
                    $arr.each(function() {

                        $this = $(this);

                        if (func)
                            func($this);

                        var _type = $this.find(".cell.type").attr("data-type");

                        var _undisPrice = parseFloat($this.attr("data-undisPrice"));// 报价项非折扣总价
                        var _disPrice = parseFloat($this.attr("data-disPrice"));// 报价项折扣总价
                        var _totlaPriceDiscount = parseFloat($this.find('.totalprice-discount .cell-wrap').text());// 折扣后的一个工程的(折扣单价*数量)
                        var _costPrice = parseFloat($this.attr("data-costPrice"));
                        var _unachePrice = parseFloat($this.attr("data-unachePrice"));
                        var _rtemPrice = parseFloat($this.attr("data-rtemPrice"));
                        var _undisComPrice = parseFloat($this.attr("data-undisComPrice"));
                        var _disComPrice = parseFloat($this.attr("data-disComPrice"));

                        if (_type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || _type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || _type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT) {

                            sum = utils.changeThrDecimal(utils.accAdd(sum, _undisPrice)); // 无折扣总价
                            sumdp = utils.changeThrDecimal(utils.accAdd(sumdp, _disPrice)); // 折扣总价
                            sumd = utils.changeThrDecimal(utils.accAdd(sumd, _totlaPriceDiscount)); // 折扣后的总价格
                        }

                        if (_type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT) {
                            cost = utils.changeThrDecimal(utils.accAdd(cost, _costPrice));
                        }

                        if (_type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT) {

                            sum = utils.changeThrDecimal(utils.accAdd(sum, _undisPrice)); // 无折扣总价
                            sumdp = utils.changeThrDecimal(utils.accAdd(sumdp, _disPrice)); // 折扣总价
                            sumd = utils.changeThrDecimal(utils.accAdd(sumd, _totlaPriceDiscount)); // 折扣后的总价格

                            unache = utils.changeThrDecimal(utils.accAdd(unache, _unachePrice));
                        }

                        if (_type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) {

                            rtem = utils.changeThrDecimal(utils.accAdd(rtem, _rtemPrice));
                            comdp = utils.changeThrDecimal(utils.accAdd(comdp, _undisComPrice));
                            comp = utils.changeThrDecimal(utils.accAdd(comp, _disComPrice));
                        }
                    });
                }

                _domanFees = sumd;
            }

            if (_areaType == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) { // 总额

                sum = $domain.attr('data-total');// 无折扣总价
                sumdp = 0;// 折扣总价
                sumd = $domain.attr('data-total');// 折扣后的总价格
                cost = 0;
                unache = 0;

                _domanFees = $domain.attr('data-total');
            }

            if (_areaType == constant.quotation().quotationFunctionArea.TYPE_COST_INT) {

                cost = sum;

                sum = 0;// 无折扣总价
                sumdp = 0;// 折扣总价
                sumd = 0;// 折扣后的总价格
                unache = 0;

                _domanFees = 0;
            }

            if (_areaType == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT) {

                cost = 0;
                unache = sumd;
            }

            $domain.attr('data-undisPrice', sum); // 总价格存入
            $domain.attr('data-desTotalprice', sumd); // 折扣后的总价格
            $domain.attr('data-disPrice', sumdp); // 折扣项总价
            $domain.attr('data-costPrice', cost); // 成本总额
            $domain.attr('data-unachePrice', unache);
            $domain.attr('data-rtemPrice', rtem);
            $domain.attr('data-undisComPrice', comdp);
            $domain.attr('data-disComPrice', comp);
            $domain.attr('data-consPrice', cons);
            $domain.attr('data-comsPrice', coms);

            return _domanFees;
        },

        // 计算报价项各种值
        calculateQuoteFee: function($quote) {

            var _num = parseFloat($quote.find('.num .cell-wrap').text());
            var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
            var _discountFlag = $quote.find('.discountprice').attr('data-discount'); // 1打折, 0不打折
            var _discountprice = utils.changeThrDecimal(utils.accMul(_unitprice, (_discountFlag == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT ? utils.accDiv(quo.basicParams['quotation.discount'], 10) : 1)));

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

            var _undisPrice = quo.basicParams["quotation.undisPrice"];
            var _disPrice = quo.basicParams["quotation.disPrice"];
            var _dtransfee = quo.basicParams["quotation.trafficPrice"];
            var _dmanagefee = quo.basicParams["quotation.managePrice"];
            var _costfee = quo.basicParams["quotation.costPrice"];
            var _unachefee = quo.basicParams["quotation.unachePrice"];
            var _dtaxfee = quo.basicParams["quotation.taxPrice"];
            var _dtaxRate = quo.basicParams["quotation.taxRate"];
            var _dtaxDiscount = quo.basicParams["quotation.taxDiscount"];
            var _rtemPrice = com.focusPage('#rtemPrice').text();

            var _discount = utils.accDiv(discount, 10);

            var total = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), _dmanagefee))); // 折前总额
            var dtotal = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), _dtransfee), _dmanagefee), _dtaxfee))); // 半包折扣总额
            var bbtotal = utils.changeThrDecimal(utils.accMul(utils.accAdd(total, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 0 : _dtaxfee), utils.accAdd(1, utils.accMul(_dtaxRate, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 1 : 0))));
            dtotal = utils.changeThrDecimal(utils.accMul(utils.accAdd(dtotal, _dtaxfee), utils.accAdd(1, utils.accMul(_dtaxRate, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 1 : 0))));

            var table = com.focusPage('#calculateTotalFeeModal').find('.fl-quo-cal').html(null);

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
            divItem1.append(createCalItem("主材", 'small border-right alert-danger'));
            divItem1.append(createCalItem("", ' normal border-left alert-danger'));
            divItem1.append(createCalItem("综合", 'normal border-right alert-warning cmpreh'));
            divItem1.append(createCalItem("", ' normal border-left alert-warning'));

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
            divItem2.append(createCalItem("配比", 'small'));
            divItem2.append(createCalItem("主材额", 'normal'));
            divItem2.append(createCalItem("服务费", 'normal servicePrice'));
            divItem2.append(createCalItem("实花总额", ' normal alert-warning'));

            divItem2.appendTo(table);

            var labels = com.focusPage('#calculateTotalFeeModal').find('.machingInfos').html(null);

            $.each(quo.machingType, function(i, v) {

                if ((v.vision & 1) != constant.data().decorationMatching.VISION_QUOTEDISCOUNT_INT)
                    return true;

                var $label = $('<label></label>').addClass('col-xs-2').appendTo(labels);
                var $radio = $('<input>').addClass('ace').attr({
                    "name": "machingInfos",
                    "type": "checkbox",
                    "checked": v.isShow == constant.data().decorationMatching.ISSHOW_SHOW_INT ? true : false
                }).val(v.dmid).appendTo($label);
                var $span = $('<span></span>').addClass('lbl').text(v.name).appendTo($label);

                $radio.click(function() {

                    var info = com.focusPage('#calculateTotalFeeModal').find('.dmid' + v.dmid);

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

                var preferPrice = quo.preferParams["quotationPrefer.preferPrice"];
                var managePrefer = quo.preferParams["quotationPrefer.managePrefer"];
                var advancePrefer = quo.preferParams["quotationPrefer.advancePrefer"];
                var activityProfit = quo.preferParams["quotationPrefer.activityProfit"];

                if (v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
                    _dtaxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), preferPrice), managePrefer), advancePrefer), activityProfit), _dtaxRate));
                }

                if (v.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
                    _dtaxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _dtransfee), _dmanagefee), preferPrice), managePrefer), advancePrefer), activityProfit), _dtaxRate));
                }

                var _ddtotal = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer), activityProfit)));

                if (v.base && v.base != 0) {

                    _ddmanagefee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dmanagefee, utils.accDiv(v.discount, 10))) : _dmanagefee;
                    _ddtaxfee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtaxfee, utils.accDiv(v.discount, 10))) : _dtaxfee;

                    cdiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), (v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NOTTAXDISCOUNT_INT ? 0 : _dtaxfee) : 0)));
                    ndiscount = utils.changeThrDecimal(v.manageDiscount == constant.data().quotationVersion.MANAGE_NODISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NOTTAXDISCOUNT_INT ? 0 : _dtaxfee) : 0);

                    var materialPrice = utils.changeThrDecimal(utils.accMul(_ddtotal, v.material));
                    var servicePrice = utils.changeThrDecimal(utils.accMul(materialPrice, v.service));
                    var _totalProject = utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee); // 工程总额
                    var _balance = _totalProject % v.base; // 余数 = 工程总额%基数
                    // 满减折后总额 //折后工程总额=(工程总额-余数)*折扣 + (余数) + 管理费
                    var _projectPrice = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(_totalProject, _balance), utils.accDiv(v.discount, 10)), _balance), _ddmanagefee), _ddtaxfee)));
                    var $_total = utils.changeThrDecimal(utils.accAdd(_projectPrice, utils.accAdd(materialPrice, servicePrice)));

                    var halfPriceDiv = $('<div></div>').addClass('fl-quo-cal-item');

                    halfPriceDiv.append(createCalItem(v.name, 'normal'));
                    halfPriceDiv.append(createCalItem(_ddtotal, 'normal'));
                    halfPriceDiv.append(createCalItem(v.discount, 'small'));
                    halfPriceDiv.append(createCalItem(cdiscount, 'normal'));
                    halfPriceDiv.append(createCalItem(ndiscount, 'normal'));
                    halfPriceDiv.append(createCalItem(_unachefee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_ddmanagefee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_ddtaxfee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_costfee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_projectPrice, 'normal'));
                    halfPriceDiv.append(createCalItem(utils.accMul(v.material, 100) + "%", 'small'));
                    halfPriceDiv.append(createCalItem(materialPrice, 'normal'));
                    halfPriceDiv.append(createCalItem(servicePrice, 'normal servicePrice'));
                    halfPriceDiv.append(createCalItem($_total, 'normal alert-warning'));

                    halfPriceDiv.addClass('dmid' + v.dmid).attr("data-show", v.isShow).appendTo(table);

                    v.isShow != constant.data().decorationMatching.ISSHOW_SHOW_INT ? halfPriceDiv.hide() : halfPriceDiv.show();

                } else {

                    // 判断是否为固定折扣模式，如果是则使用配置的固定折扣，否则使用用户输入的折扣
                    var _useDiscount = v.discountType == constant.data().decorationMatching.DISCOUNTTYPE_ONLY_INT ? utils.accDiv(v.discount, 10) : _discount;
                    var _showDiscount = v.discountType == constant.data().decorationMatching.DISCOUNTTYPE_ONLY_INT ? v.discount : discount;

                    _ddtransfee = v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtransfee, _useDiscount)) : _dtransfee;
                    _ddmanagefee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dmanagefee, _useDiscount)) : _dmanagefee;
                    _ddtaxfee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtaxfee, utils.accDiv(v.discount, 10))) : _dtaxfee;

                    cdiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_disPrice, (v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _ddtransfee : 0)), (v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NOTTAXDISCOUNT_INT ? 0 : _dtaxfee) : 0)));
                    ndiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_undisPrice, (v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_NODISCOUNT_INT ? _ddtransfee : 0)), (v.manageDiscount == constant.data().quotationVersion.MANAGE_NODISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NOTTAXDISCOUNT_INT ? 0 : _dtaxfee) : 0)));

                    var materialPrice = utils.changeThrDecimal(utils.accMul(_ddtotal, v.material));
                    var servicePrice = utils.changeThrDecimal(utils.accMul(materialPrice, v.service));

                    var _projectPrice = utils.changeThrDecimal(utils.accAdd(_rtemPrice, utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _useDiscount), _undisPrice), _ddtransfee), _ddmanagefee), _ddtaxfee)));
                    var $_total = utils.changeTwoDecimal(utils.accAdd(_projectPrice, utils.accAdd(materialPrice, servicePrice)));

                    var halfPacksDiv = $('<div></div>').addClass('fl-quo-cal-item');

                    halfPacksDiv.append(createCalItem(v.name, 'normal'));
                    halfPacksDiv.append(createCalItem(_ddtotal, 'normal'));
                    halfPacksDiv.append(createCalItem(_showDiscount, 'small'));
                    halfPacksDiv.append(createCalItem(cdiscount, 'normal'));
                    halfPacksDiv.append(createCalItem(ndiscount, 'normal'));
                    halfPacksDiv.append(createCalItem(_unachefee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_ddmanagefee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_ddtaxfee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_costfee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_projectPrice, 'normal'));
                    halfPacksDiv.append(createCalItem(utils.accMul(v.material, 100) + "%", 'small'));
                    halfPacksDiv.append(createCalItem(materialPrice, 'normal'));
                    halfPacksDiv.append(createCalItem(servicePrice, 'normal servicePrice'));
                    halfPacksDiv.append(createCalItem($_total, 'normal alert-warning'));

                    halfPacksDiv.addClass('dmid' + v.dmid).attr("data-show", v.isShow).appendTo(table);

                    v.isShow != constant.data().decorationMatching.ISSHOW_SHOW_INT ? halfPacksDiv.hide() : halfPacksDiv.show();
                }
            });

            function createCalItem(text, inclass) {

                return $('<div></div>').html(text).css({
                    "text-overflow": "ellipsis",
                    "overflow": "hidden",
                    "white-space": "nowrap"
                }).addClass('cell').addClass(inclass);
            }
        },

        servePriceShow: function() {

            var $cal = com.focusPage('#calculateTotalFeeModal').find('.fl-quo-cal');

            $cal.find('.fl-quo-cal-item .cmpreh').next('.cell.normal').hide();
            $cal.find('.fl-quo-cal-item .servicePrice').hide();

            $cal.each(function() {

                var servicePrice = $(this).find('.fl-quo-cal-item:not([data-show="1"])');

                servicePrice.each(function() {

                    var price = $(this).find('.servicePrice').text();

                    price = parseFloat(price) ? parseFloat(price) : 0;

                    if (price != 0) {
                        $cal.find('.fl-quo-cal-item .cmpreh').next('.cell.normal').show();
                        $cal.find('.fl-quo-cal-item .servicePrice').show();
                    }
                })
            });
        },

        calculateNowQuoteItem: function(num, areaType, $nowLine) {

            var _areaType = $nowLine.find('.cell.line').attr('data-areatype');
            var type = $nowLine.find(".cell.type").attr("data-type");
            var subtype = $nowLine.find(".cell.num").attr("data-subtype");
            var discount = $nowLine.find('.discountprice').attr('data-discount');
            var expres = $nowLine.attr('data-expres');

            var _discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);

            var price = parseFloat($nowLine.find('.unitprice .cell-wrap').text());// 单价
            var dprice = parseFloat($nowLine.find('.discountprice .cell-wrap').text());// 折扣单价

            $nowLine.find('.totalprice-discount .cell-wrap').text(utils.changeThrDecimal(utils.accMul(dprice, num))); // 折扣单价*数量

            $nowLine.attr('data-undisPrice', discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT && (type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) ? utils.changeThrDecimal(utils.accMul(num, dprice)) : 0);
            $nowLine.attr('data-disPrice', discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT && (type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) ? utils.changeThrDecimal(utils.accMul(num, dprice)) : 0);
            $nowLine.attr('data-costPrice', type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT ? utils.changeThrDecimal(utils.accMul(num, dprice)) : 0);
            $nowLine.attr('data-unachePrice', type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT ? utils.changeThrDecimal(utils.accMul(num, utils.accMul(price, discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT ? 1 : _discount))) : 0);
            $nowLine.attr('data-rtemPrice', type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(num, price)) : 0);
            $nowLine.attr('data-undisComPrice', discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT && type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(num, price)) : 0);
            $nowLine.attr('data-disComPrice', discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT && type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(num, price)) : 0);
            $nowLine.attr('data-consPrice', subtype == constant.quotation().quotationFunctionAreaItem.SUBTYPE_PROJECT_INT ? utils.changeThrDecimal(utils.accMul(num, price)) : 0);
            $nowLine.attr('data-comsPrice', subtype != constant.quotation().quotationFunctionAreaItem.SUBTYPE_PROJECT_INT ? utils.changeThrDecimal(utils.accMul(num, price)) : 0);

            var _fee = quo.calculateDomainFees($nowLine.parents('.widget-box'));

            quo.calculateQuoFees();

            return _fee;
        },

        calculateNowExtensionItem: function(num, $nowLine) {

            var price = parseFloat($nowLine.find('.unitprice .cell-wrap').text());// 单价
            var dprice = parseFloat($nowLine.find('.discountprice .cell-wrap').text());// 折扣单价

            $nowLine.find('.totalprice-discount .cell-wrap').text(utils.changeThrDecimal(utils.accMul(dprice, num))); // 折扣单价*数量
        },

        statisticsQuoteNormedData: function(norms, classify) {

            var title = {
                '0': '定额材料统计',
                '1': '定额工费统计'
            };
            var nameStr = {
                '0': '商品名: ',
                '1': '工程节点: '
            };
            var numStr = {
                '0': '数量: ',
                '1': '工费共计: '
            };
            var args = {
                "0": "goods",
                "1": "constructionNode"
            };

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(title[classify]));

            $liLine.append($h3);

            if (norms != null) {
                $.each(norms, function(i, v) {

                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var propertyArr = [[nameStr[classify], v[args[classify]].name, "blue"], [numStr[classify], v.amount, "blue"], ];

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    quo.quoModals.statisticalNormedDataDiv.append($ul.append($liLine.append($ulProperty)));
                });
            }
        },

        quotationPreferControl: function(presignProduce, prefer) {

            if (presignProduce == null)
                return true;

            var preferPrice = parseFloat(prefer.preferPrice);
            var managePrefer = parseFloat(prefer.managePrefer);
            var advancePrefer = parseFloat(prefer.advancePrefer);
            var _disPrice = quo.basicParams["quotation.disPrice"];
            var _undisPrice = quo.basicParams["quotation.undisPrice"];

            var manageCost = com.focusPage('#manageCost'); // 管理费
            var converyanceCost = com.focusPage('#conveyanceCost'); // 车运费
            var taxCost = com.focusPage('#taxCost'); // 税金

            var _taxDiscount = taxCost.find('.discountprice').attr('data-discount');// 税金折扣

            var _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text() == "" ? 0 : manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
            var _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text() == "" ? 0 : converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
            var _taxRate = parseFloat(taxCost.find('.discountprice .cell-wrap').text() == "" ? 0 : taxCost.find('.discountprice .cell-wrap').text()); // 获取税金比例(根据报价版本获得)
            var activityPrice = quo.quotationPrefer ? quo.quotationPrefer.activityPrice : 0;
            var activityProfit = quo.quotationPrefer ? quo.quotationPrefer.activityProfit : 0;

            var quotePrice = utils.accAdd(presignProduce.quotePrice, activityPrice);
            var _transfee = utils.accMul(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _tranRate);
            var _managefee = utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _manageRate);
            var _taxfee = 0;

            if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), preferPrice), managePrefer), advancePrefer), activityProfit), _taxRate));
            }

            if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), preferPrice), managePrefer), advancePrefer), activityProfit), _taxRate));
            }

            var _total = utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), _taxfee), preferPrice), managePrefer), advancePrefer), activityProfit);

            _total = utils.accAdd(_total, !(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0);

            var _managePrice = utils.changeThrDecimal(utils.accAdd(_managefee, quo.extensionManagePrice)); // 总管理费
            var _totalPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee)); // 直接费

            var _preferPrice = 0, _discount = 0, _discountValue = 0, _manageDiscount = 0, _manageDiscountValue = 0;

            if (quo.decorationType == constant.decoration().decoration.TYPE_INCLUSIVE_INT && quo.protation) {

                _preferPrice = quo.protation.quotePrice;
                _discount = utils.changeThrDecimal(utils.accDiv(utils.accSub(presignProduce.quotePrice, preferPrice), presignProduce.quotePrice));
                _discountValue = utils.changeThrDecimal(utils.accDiv(utils.accSub(quo.protation.quotePrice, quo.protation.preferPrice), quo.protation.quotePrice));

                _manageDiscount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_managePrice, managePrefer), _managePrice));
                _manageDiscountValue = utils.changeThrDecimal(utils.accDiv(utils.accSub(quo.protation.managePrice, quo.protation.manageProfit), quo.protation.managePrice));
            } else {
                _discount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_totalPrice, preferPrice), _totalPrice));
                _discountValue = quo.basicParams["quotation.discount"];

                _manageDiscount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_managePrice, managePrefer), _managePrice));
                _manageDiscountValue = quo.basicParams["quotation.discount"];
            }

            _discount = _discount < 0 ? 0 : _discount > 1 ? 1 : _discount;
            _discountValue = _discountValue < 0 ? 0 : _discountValue > 1 ? 1 : _discountValue;

            _manageDiscount = _manageDiscount < 0 ? 0 : _manageDiscount > 1 ? 1 : _manageDiscount;
            _manageDiscountValue = _manageDiscountValue < 0 ? 0 : _manageDiscountValue > 1 ? 1 : _manageDiscountValue;

            if (!prefer.prompt && (_discount < _discountValue || _managePrice < managePrefer || _manageDiscount < _manageDiscountValue)) {
                return false;
            }

            if (_discount < _discountValue) {
                com.showAlert(com.warning, "优惠金额不合理");
                return false;
            }

            if (_managePrice < managePrefer) {
                com.showAlert(com.warning, "管理优惠不能大于管理费");
                return false;
            }

            if (_manageDiscount < _manageDiscountValue) {
                com.showAlert(com.warning, "管理费优惠金额不合理");
                return false;
            }

            com.focusPage('#countQuotePrice').text(quotePrice);
            com.focusPage('#countTotalPrice').text(utils.changeThrDecimal(_total));

            return true;
        },

        // 还原优惠价格
        oldQuotationPreferData: function() {

            quo.preferParams["quotationPrefer.presignProduce.ppid"] = quo.oldPrefer.ppid;
            quo.preferParams["quotationPrefer.preferPrice"] = quo.oldPrefer.preferPrice;
            quo.preferParams["quotationPrefer.managePrefer"] = quo.oldPrefer.managePrefer;
            quo.preferParams["quotationPrefer.advancePrefer"] = quo.oldPrefer.advancePrefer;
            quo.preferParams["quotationPrefer.discount"] = quo.oldPrefer.discount;
            quo.preferParams["quotationPrefer.manageDiscount"] = quo.oldPrefer.manageDiscount;
            quo.preferParams["quotationPrefer.quotePrice"] = quo.oldPrefer.quotePrice;
            quo.preferParams["quotationPrefer.quoteArea"] = quo.oldPrefer.quoteArea;
            quo.preferParams["quotationPrefer.activityPrice"] = quo.oldPrefer.activityPrice;
            quo.preferParams["quotationPrefer.activityProfit"] = quo.oldPrefer.activityProfit;

            quo.calculateQuoFees();
        },

        init: function() {

            this.initQuoModals();
            this.initSettingBtns();
        }
    }

    // 功能区
    var domain = {

        nowEditDomain: null,

        // 编辑功能区(名称/排序)
        editDomain: function(qfaid) {

            var $domain = com.focusPage('.widget-box[data-qfaid="' + qfaid + '"]', '#functionAreaDetailList');

            this.nowEditDomain = $domain;

            com.focusPage("#functionAreaName").val($domain.find('.widget-header strong').text());
            com.focusPage("#functionAreaOrder").val($domain.attr("data-dlevel"));

            quo.quoModals.$domainEditModal.on('hide.bs.modal', function() {

                com.closeTip();
            });

            quo.quoModals.$domainEditModal.modal("show");

            return false;
        },

        // 编辑功能区参数
        editDomainParam: function(qfaid) {

            var $domain = com.focusPage('.widget-box[data-qfaid="' + qfaid + '"]', '#functionAreaDetailList');

            this.nowEditDomain = $domain;

            com.focusPage("#paramGirth").val($domain.attr("data-girth") ? $domain.attr("data-girth") : 0);
            com.focusPage("#paramArea").val($domain.attr("data-area") ? $domain.attr("data-area") : 0);
            com.focusPage("#paramHeight").val($domain.attr("data-height") ? $domain.attr("data-height") : 0);
            com.focusPage("#paramHoleLength").val($domain.attr("data-holeLength") ? $domain.attr("data-holeLength") : 0);
            com.focusPage("#paramHoleHeight").val($domain.attr("data-holeHeight") ? $domain.attr("data-holeHeight") : 0);
            com.focusPage("#paramWindowLength").val($domain.attr("data-windowLength") ? $domain.attr("data-windowLength") : 0);
            com.focusPage("#paramWindowHeight").val($domain.attr("data-windowHeight") ? $domain.attr("data-windowHeight") : 0);
            com.focusPage("#paramBeamLength").val($domain.attr("data-beamLength") ? $domain.attr("data-beamLength") : 0);
            com.focusPage("#paramBeamHeight").val($domain.attr("data-beamHeight") ? $domain.attr("data-beamHeight") : 0);

            quo.quoModals.$domainParamEditModal.modal("show");

            return false;
        },

        // 编辑功能区保存按钮点击(名称/排序)
        saveDomainEdit: function() {

            var that = this;

            com.focusPage('#saveFunctionAreaBtn').on('click', function() { // 编辑功能区页面

                if (com.validate("functionAreaModal")) {
                    return false;
                }

                var _dname = com.focusPage("#functionAreaName").val();
                var _dorder = com.focusPage("#functionAreaOrder").val();

                var _params = $.extend({}, {
                    "quotationFunctionArea.functionAreaName": _dname,
                    "quotationFunctionArea.functionAreaOrder": _dorder,
                    "quotationFunctionArea.qfaId": that.nowEditDomain.attr('data-qfaid'),
                }, quo.basicParams);

                com.post(api.quotation.updateQuotationFunctionArea, _params, function(res) {

                    var $dOrder = that.nowEditDomain.find('.widget-header em');
                    var $dname = that.nowEditDomain.find('.widget-header strong');
                    var $domains = that.nowEditDomain.siblings('.widget-box');

                    $dname.html(_dname);
                    $dOrder.html(_dorder);
                    that.nowEditDomain.attr('data-dlevel', _dorder);
                    that.insertDomainByOrder(_dorder, that.nowEditDomain, $domains, true);

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

                    quo.quoModals.$domainEditModal.modal("hide");
                }, null, false);

            });
        },

        // 编辑功能区参数保存按钮点击
        saveDomainParamEdit: function() {

            var that = this;

            com.focusPage('#saveFunctionAreaParamBtn').on('click', function() {

                if (com.validate("functionAreaParamModal")) {
                    return false;
                }

                var _girth = com.focusPage("#paramGirth").val();
                var _area = com.focusPage("#paramArea").val();
                var _height = com.focusPage("#paramHeight").val();
                var _holeLength = com.focusPage("#paramHoleLength").val();
                var _holeHeight = com.focusPage("#paramHoleHeight").val();
                var _windowLength = com.focusPage("#paramWindowLength").val();
                var _windowHeight = com.focusPage("#paramWindowHeight").val();
                var _beamLength = com.focusPage("#paramBeamLength").val();
                var _beamHeight = com.focusPage("#paramBeamHeight").val();

                var _params = $.extend({}, {
                    "quotationFunctionArea.qfaId": that.nowEditDomain.attr('data-qfaid'),
                    "quotationFunctionArea.functionAreaName": that.nowEditDomain.find('.widget-header strong').text(),
                    "quotationFunctionArea.functionAreaOrder": that.nowEditDomain.attr('data-dlevel'),

                    "quotationFunctionArea.quotationFunctionAreaParam.girth": _girth,
                    "quotationFunctionArea.quotationFunctionAreaParam.area": _area,
                    "quotationFunctionArea.quotationFunctionAreaParam.height": _height,
                    "quotationFunctionArea.quotationFunctionAreaParam.holeLength": _holeLength,
                    "quotationFunctionArea.quotationFunctionAreaParam.holeHeight": _holeHeight,
                    "quotationFunctionArea.quotationFunctionAreaParam.windowLength": _windowLength,
                    "quotationFunctionArea.quotationFunctionAreaParam.windowHeight": _windowHeight,
                    "quotationFunctionArea.quotationFunctionAreaParam.beamLength": _beamLength,
                    "quotationFunctionArea.quotationFunctionAreaParam.beamHeight": _beamHeight,

                }, quo.basicParams);

                com.post(api.quotation.updateQuotationFunctionArea, _params, function(res) {

                    if (res.quotationFunctionArea.quotationFunctionAreaParam) {
                        $.each(res.quotationFunctionArea.quotationFunctionAreaParam, function(k, v) {

                            if (v != null)
                                that.nowEditDomain.attr("data-" + k, v);
                        });
                    }

                    var $btnExpres = that.nowEditDomain.find('.widget-body .num .icon-circle-arrow-up');

                    $.each($btnExpres, function(i, e) {

                        var $line = $(e).parents("li");

                        if (!$line.attr("data-qfaiid") || !$line.attr("data-expres") || $line.attr("data-control") == 1)
                            return true;

                        $(e).show();
                    });

                    // 自动触发功能区内所有报价项的 num 计算
                    var $items = that.nowEditDomain.find('.fl-quo-list.list .fl-quo-item.item[data-expres]');
                    $.each($items, function(i, item) {
                        var $item = $(item);
                        if ($item.attr('data-qfaiid') && $item.attr("data-expres") && $item.attr("data-control") != 1) {
                            quote.checkedExpres($item);
                        }
                    });

                    quo.quoModals.$domainParamEditModal.modal("hide");
                }, null, false);

            });
        },

        // 删除功能区
        deletDomain: function($domain) {

            var that = this;

            com.showConfirm("是否确定要删除功能区", function(res) {

                var $itemlist = $domain.find("li.fl-quo-item.item");

                $domain.attr("data-del-sign", 1);
                var items = [];

                $.each($itemlist, function(i, v) {

                    var $quote = $(v);

                    $quote.attr("data-del-sign", 1);

                    if ($quote.attr("data-qfaiid")) {
                        quote.cacsedeUpdateItem($quote);
                        items.push($quote);
                    }
                });

                quote.cacsedeUpdateCpItem(items);
                quo.calculateQuoFees();

                var _params = $.extend({}, {
                    'quotationFunctionArea.qfaId': $domain.attr('data-qfaid'), // 功能区Id
                }, quo.basicParams);

                com.post(api.quotation.deleteQuotationFunctionArea, _params, function(res) {

                    $domain.remove();
                    quo.calculateDomainFees(domain.nowEditDomain);
                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();

                    com.focusPage('[data-qfaid="' + $domain.attr('data-qfaid') + '"]', '#functionAreaSumList').remove();
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);
                    $itemlist.removeAttr('data-del-sign');
                    $domain.removeAttr('data-del-sign');
                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();
                }, false);
            });
        },

        // 复制功能区
        copyDomain: function($domain) {

            var that = this;

            com.showConfirm("是否确定要复制功能区", function() {

                var qfaId = $domain.attr('data-qfaid');

                var _params = $.extend({}, {
                    'quotationFunctionArea.qfaId': qfaId
                }, quo.basicParams);

                com.post(api.quotation.copyQuotationFunctionArea, _params, function(data) {

                    var quotationFunctionArea = data.quotationFunctionArea;

                    // 创建新的功能区数据
                    var newFunctionArea = {
                        qfaId: quotationFunctionArea.qfaId,
                        functionAreaName: quotationFunctionArea.functionAreaName,
                        functionAreaOrder: quotationFunctionArea.functionAreaOrder,
                        type: quotationFunctionArea.type,
                        total: quotationFunctionArea.total,
                        quotationFunctionAreaParam: quotationFunctionArea.quotationFunctionAreaParam,
                        quotationFunctionAreaItems: []
                    };

                    // 处理报价项数据
                    if (quotationFunctionArea.quotationFunctionAreaItems && quotationFunctionArea.quotationFunctionAreaItems.length) {
                        $.each(quotationFunctionArea.quotationFunctionAreaItems, function(i, item) {
                            item.areaType = quotationFunctionArea.type;
                            item.qfaid = quotationFunctionArea.qfaId;
                            newFunctionArea.quotationFunctionAreaItems.push(item);
                        });
                    }

                    // 使用 painter 创建新的功能区 DOM
                    var $newDomain = painter.createdomain(newFunctionArea);

                    // 将新功能区插入到当前功能区之后
                    $newDomain.insertAfter($domain);

                    // 更新左侧功能区金额统计列表
                    // 获取当前功能区对应的左侧金额项
                    var $currentMoneyItem = com.focusPage('#functionAreaSumList > div[data-qfaId="' + qfaId + '"]');
                    // createdomain 内部已通过 items 累加计算出 sumd, 存入 data-desTotalprice
                    var sumd = $newDomain.attr('data-desTotalprice');
                    // 创建新的金额统计项
                    var $newMoneyItem = painter.createDomainMoney(sumd, newFunctionArea);
                    // 插入到当前金额项之后
                    if ($currentMoneyItem.length > 0) {
                        $newMoneyItem.insertAfter($currentMoneyItem);
                    } else {
                        $newMoneyItem.appendTo(com.focusPage('#functionAreaSumList'));
                    }

                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();
                    
                    // 更新报价金额（管理费、车运费、总价等）
                    com.post(api.quotation.updateQuotationForAdvance, quo.basicParams, function(res) {

                        // 更新页面显示
//                        quo.calculateQuoFees();
//                        quo.calculateQuoFeesPost();

                    }, null, false);

                }, null, false);
            });
        },

        calculateTotal: function() {

            com.focusPage('#calculateTotalFeeBtn').on('click', function() {

                if (com.validate("calculateTotalFeeModal")) {
                    return false;
                }

                var table = com.focusPage('#calculateTotalFeeModal').find('table');

                table.find('thead').remove();
                table.find('tbody').remove();

                var dis = com.focusPage("#calDiscount").val();

                if (parseFloat(dis) <= 0 || parseFloat(dis) > 10) {
                    com.showPopover(com.focusPage("#calDiscount"), {
                        errorMsg: "折扣非法"
                    }, "bottom");
                    return false;
                } else {
                    com.focusPage("#calDiscount").css("border", "1px solid #d5d5d5").popover("destroy");
                }

                quo.calculateTotalFee(dis);
                quo.servePriceShow();
            });

            com.focusPage('#calculateTotalFeeBtns').on("click", function() {

                com.focusPage('#calculateTotalFeeBtn').click();
            });
        },

        quotationItemPriceEdit: function() {

            com.focusPage("#keepPriceTime").on('click', function() {

                painter.updateQuotePrice(quo.basicParams["quotation.updateTime"]);

            });

            com.focusPage("#currentTime").on('click', function() {

                painter.updateQuotePrice(com.currentTime());

            });
        },
        // 保存报价修改
        saveDiscountEdit: function() {

            com.focusPage('#saveDisCountBtn').on('click', function() { // 折扣保存

                if (com.validate("discountModal")) {
                    return false;
                }

                var matching = com.focusPage('input[name="basePrice"]:checked');

                var dis = com.focusPage("#discount").val();
                var basePrice = matching.val();
                var disableFlag = com.focusPage("#discount").prop("disabled");

                if (!dis || parseFloat(dis) <= 0 || parseFloat(dis) > 10) {

                    com.showPopover(com.focusPage("#discount"), {
                        errorMsg: "请选择正确的折扣"
                    }, "right");

                    return false;
                } else {
                    com.focusPage("#discount").css("border", "1px solid #d5d5d5").popover("destroy");
                }

                var baseDiscount = matching.attr("data-baseDiscount");
                var discountType = matching.attr("data-discountType");

                quo.quoModals.$domainDiscountModal.modal("hide");

                if (!disableFlag && parseFloat(dis) < baseDiscount && discountType == constant.data().decorationMatching.DISCOUNTTYPE_LOW_INT) {

                    approvalUtils.initqueryApprovalUser("approveManSel", 4);

                    com.focusPage("#customerApproveModal").modal("show");
                    com.focusPage("#cApproveSaveBtn").bindClick(function() {

                        if (com.validate("customerApproveModal")) {
                            return false;
                        }

                        var receiverId = com.focusPage("#approveManSel").find('input:checked').attr('userid');

                        if (receiverId == null || receiverId == "") {

                            com.showAlert(com.error, "请选择审批人");

                            return false;
                        }

                        var options = {
                            "approval.receiver.userId": receiverId,
                            "approval.comment": com.focusPage('#customerDes').val(),

                            "approvalQuotationDiscount.orderId": quo.orderid,
                            "approvalQuotationDiscount.qid": quo.quotationid,
                            "approvalQuotationDiscount.newDiscount": dis,
                            "approvalQuotationDiscount.basePrice": basePrice,
                        };

                        com.post(api.approval.submitApprovalForQuotationDiscount, options, function(res) {

                            com.showAlert(com.info, "折扣申请成功");

                            com.focusPage('#customerDes').html("");
                            com.focusPage("#customerApproveModal").modal("hide");
                        });
                    }, 5000);

                } else {

                    quo.basicParams['quotation.basePrice'] = parseFloat(basePrice);
                    quo.basicParams['quotation.discount'] = Math.round(parseFloat(dis) * 1000) / 1000;

                    var trafficDiscount = matching.attr("data-trafficDiscount");
                    var manageDiscount = matching.attr("data-manageDiscount");
                    var taxDiscount = matching.attr("data-taxDiscount");

                    com.focusPage('#conveyanceCost').find('.discountprice').attr('data-discount', trafficDiscount);
                    com.focusPage('#manageCost').find('.discountprice').attr('data-discount', manageDiscount);
                    com.focusPage('#taxCost').find('.discountprice').attr('data-discount', taxDiscount);

                    quo.calculateQuoFees(function($domain) {

                        var dfee = quo.calculateDomainFees($domain);
                        com.focusPage('[data-qfaid="' + $domain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(dfee);
                    });

                    var params = $.extend({}, {
                        "quotation.trafficDiscount": trafficDiscount,
                        "quotation.manageDiscount": manageDiscount,
                        "quotation.taxDiscount": taxDiscount,
                    }, quo.basicParams);

                    com.post(api.quotation.updateQuotationForAdvance, params, function(res) {

                        quo.quoModals.$domainDiscountModal.modal("hide");
                    }, null, false);
                }
            });
        },

        // 保存功能区修改
        saveDomainTemplete: function() {

            var that = this;

            com.focusPage("#paramFunctionAreasBtn").click(function() {

                if (quo.quoModals.$domainTempletModal.hasClass("params")) {
                    quo.quoModals.$domainTempletModal.find(".params").hide();
                    quo.quoModals.$domainTempletModal.removeClass("params");
                } else {
                    quo.quoModals.$domainTempletModal.find(".params").show();
                    quo.quoModals.$domainTempletModal.addClass("params");
                }
            });

            com.focusPage('#addFunctionAreasBtn').click(function() {

                var $darr = com.focusPage('input[name="quotempl"]:checked');
                var _param = $.extend({}, quo.basicParams);
                var $aimDomains = com.focusPage('.widget-box', '#functionAreaDetailList');

                if (!$darr.length) {
                    return false;
                }

                $.each($darr, function(i, v) {

                    var input = $(v);
                    var params = input.parents(".functionAreaItem").find("[name='quoteparam']");

                    _param['quotationFunctionAreas[' + i + '].id'] = input.val();

                    $.each(params, function(j, v) {

                        var e = com.focusPage(v);
                        var param = e.attr("param");
                        var parama = e.attr("parama");

                        if (e.val() == '')
                            return true;

                        _param['quotationFunctionAreas[' + i + '].quotationFunctionAreaParam.' + param] = e.val();
                    });
                });

                if (!_param["quotation.updateTime"]) {
                    _param["quotation.updateTime"] = com.currentTime();
                }

                com.post(api.quotation.addQuotationFunctionAreaByFunctionAreaIds, _param, function(data) {

                    data.quotationFunctionAreas.length && $.each(data.quotationFunctionAreas, function(i, v) {

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

                        if (v.quotationFunctionAreaItems.length) {

                            $.each(v.quotationFunctionAreaItems, function(index, j) {

                                if (j.isRtem != 1)
                                    return true;

                                var num = com.focusPage('.item[data-qiid="' + j.quotationItemId + '"]', $domain).find('.num .number').text();

                                var _rtems = rtems.queryQuotationRtems(j.quotationItemId);

                                $.each(_rtems, function(indexs, rt) {

                                    var quolist = $domain.find('.fl-quo-list.list').eq(0);
                                    var windex = quolist.find('.fl-quo-item.item').length;
                                    var areaType = $domain.attr('data-areaType');

                                    var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
                                    var cpList = cpWidget.find('.fl-quo-list.list').eq(0);
                                    var cpIndex = cpList.find('.fl-quo-item.item').length;

                                    var cpitem = cpList.find('.fl-quo-item.item[data-qiid="' + rt.target.qiid + '"]');
                                    var quoitem = quolist.find('.fl-quo-item.item[data-qiid="' + rt.target.qiid + '"]');

                                    var rtem = {
                                        "discount": rt.target.discount,
                                        "content": rt.target.comment,
                                        "itemName": rt.target.name,
                                        "measurementUnit": rt.target.unit.name,
                                        "formula": 0,
                                        "num": 0,
                                        "qfaiId": null,
                                        "quotationItemId": rt.target.qiid,
                                        "subtype": rt.target.category.id,
                                        "unitPrice": rt.target.unitPrice,
                                        "addPrice": rt.target.addPrice,
                                        "subPrice": rt.target.subPrice,
                                        "workType": rt.target.workType.name,
                                        "expres": rt.target.formula
                                    };

                                    if (!cpitem.length && rt.type == constant.data().quotationRtem.TYPE_CMPREH_INT) {
                                        rtem["quotationFunctionAreaId"] = cpWidget.attr("data-qfaid");
                                        rtem["type"] = quote.quoItemType(rt.target.type, cpWidget.attr('data-areaType'));
                                        rtem["areaType"] = constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT;
                                        rtem["index"] = cpIndex + 1;
                                        painter.createQuote(rtem.index, rtem).appendTo(cpList);
                                    }

                                    if (!quoitem.length && rt.type == constant.data().quotationRtem.TYPE_GENERRAL_INT) {
                                        rtem["quotationFunctionAreaId"] = $domain.attr("data-qfaid");
                                        rtem["type"] = quote.quoItemType(rt.target.type, $domain.attr('data-areaType'));
                                        rtem["areaType"] = $domain.attr('data-areaType');
                                        rtem["index"] = windex + 1;
                                        painter.createQuote(rtem.index, rtem).appendTo(quolist);
                                    }
                                });
                            });
                        }

                        quo.calculateQuoFees();
                    });
                }, null, false);

                quo.quoModals.$domainTempletModal.modal("hide");
            });
        },

        /**
         * 将功能区添加到功能区列表中 参数:
         * 
         * @order : 功能区排序
         * @$domain : 正在编辑的功能区
         * @$aimDomains : 参与排序的其他功能区（不包含当前要插入的功能区）
         * @existed : 是否已存在功能区列表中
         */
        insertDomainByOrder: function(order, $domain, $aimDomains, existed) {

            var that = this;
            var maxflag = true;

            if (!$aimDomains.length && existed) {
                return false;
            }

            if ($aimDomains.length) {
                $aimDomains.each(function(i) {

                    var _order = parseInt($(this).attr('data-dlevel'));

                    if (_order > parseInt(order) || !_order) {

                        $domain.insertBefore($(this));
                        maxflag = false;

                        return false;
                    }
                });
            }

            maxflag && $domain.appendTo(com.focusPage('#functionAreaDetailList'));
            quo.quoModals.$domainEditModal.modal("hide");
        },

        // 保存默认报价项
        saveQuotesToDomain: function() {

            com.focusPage('#addFunctionAreaItemsBtn').click(function() {

                quote.addDefaultQuotes();

                quo.calculateQuoFeesPost();

                quo.quoModals.$quoteModal.modal("hide");
            });
        },

        deleteQuotesToDomain: function() {

            quo.quoModals.$quoteModal.on('hide.bs.modal', function() {

                quote.quotesRecord = [];
            });
        },

        // 管理费比例弹窗保存按钮 saveMrBtn
        saveManageRate: function() {

            com.focusPage('#saveMrBtn').click(function() {

                if (com.validate('manageRateModal')) {
                    return false;
                }

                var _manageId = com.focusPage('#manageCost').attr('qfaiId');
                var _qfaId = com.focusPage('#manageCost').find('.cell.name').attr("data-qfaId");

                var _manageRate = parseFloat(com.focusPage('#manageRate').val());
                var mgrate = utils.accAdd(_manageRate, (quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0);

                com.focusPage('#manageCost').find('.unitprice').text(mgrate);

                com.focusPage('#manageCost').find('.discountprice .cell-wrap').text(mgrate);
                com.focusPage('#manageCost').find('.totalprice-discount .cell-wrap').text(mgrate);

                quo.calculateQuoFees();
                quo.quoModals.$manageRateModal.modal("hide");

                var args = {
                    "quotationFunctionAreaItem.qfaiId": _manageId,
                    "quotationFunctionAreaItem.quotationFunctionAreaId": _qfaId,
                    "quotationFunctionAreaItem.unitPrice": _manageRate
                };

                var _params = $.extend(true, {}, args, quo.basicParams);

                com.post(api.quotation.updateQuotationFunctionAreaItemForSpec, _params);
            });
        },

        // 税金类型弹窗保存按钮 saveTrBtn
        saveTaxRate: function() {

            com.focusPage('#saveTrBtn').click(function() {

                if (com.validate('taxRateModal')) {
                    return false;
                }

                var _taxId = com.focusPage('#taxCost').attr('qfaiId');
                var _qfaId = com.focusPage('#taxCost').find('.cell.name').attr("data-qfaId");

                var _taxDiscount = com.focusPage('#taxType').val();

                // 更新税金行的折扣类型显示
                com.focusPage('#taxCost').find('.discountprice').attr('data-discount', _taxDiscount);

                // 更新税金类型名称显示
                var _typeName = constant.data().quotationVersion.taxDiscount.keys[_taxDiscount];
                com.focusPage('#taxCost').find('.cell.type .cell-wrap span').text(_typeName);

                // 更新 basicParams 中的税金折扣类型
                quo.basicParams["quotation.taxDiscount"] = _taxDiscount;

                // 重新计算费用
                quo.calculateQuoFees();
                quo.quoModals.$taxRateModal.modal("hide");

                // 提交到后端：更新税金项的折扣类型
                var args = {
                    "quotationFunctionAreaItem.qfaiId": _taxId,
                    "quotationFunctionAreaItem.quotationFunctionAreaId": _qfaId,
                    "quotationFunctionAreaItem.discount": _taxDiscount
                };

                var _params = $.extend(true, {}, args, quo.basicParams);

                com.post(api.quotation.updateQuotationFunctionAreaItemForSpec, _params);

                // 同步更新 quotation 表的 taxDiscount
                var advanceParams = $.extend({}, {
                    "quotation.taxDiscount": _taxDiscount
                }, quo.basicParams);

                com.post(api.quotation.updateQuotationForAdvance, advanceParams, function(res) {}, null, false);
            });
        },

        // 折扣窗体配置基数
        showDiscountBasePrice: function() {

            com.focusPage("#showBaseVersion").empty();
            com.focusPage("#discount").prop("disabled", "disabled");

            com.post(api.data.queryDecorationMatching, quo.typeness, function(res) {

                // 按 typeness 分组缓存,保持组内顺序
                var groups = {};

                $.each(res.decorationMatchings, function(i, v) {

                    if ((v.vision & 2) != constant.data().decorationMatching.VISION_QUOTECOUNT_INT)
                        return true;

                    var key = v.typeness;

                    if (!groups[key]) groups[key] = [];
                    groups[key].push(v);
                });

                // 按 typeness 升序(0/1/2)依次渲染,每组先标题后 radio 列表
                Object.keys(groups).sort(function(a, b) {
                    return a - b;
                }).forEach(function(key) {

                    // 组标题: typeness 即 decorationAtttype 的 key,直接复用常量取中文名(0=半包/1=整装/2=满减)
                    var typenessName = constant.data().decorationAtttype.type.keys[key] || "其他";
                    com.focusPage("#showBaseVersion").append($('<div class="quotation-base-price-group-title" style="font-weight:bold;font-size:14px;margin:10px 0 5px;color:#676a6c;border-bottom:1px solid #eee;padding-bottom:3px;">' + typenessName + '</div>'));

                    $.each(groups[key], function(i, v) {

                        var params = {
                            "value": v.base,
                            "data-name": v.name,
                            "data-baseDiscount": v.discount,
                            "data-trafficDiscount": v.trafficDiscount,
                            "data-manageDiscount": v.manageDiscount,
                            "data-taxDiscount": v.taxDiscount,
                            "data-discountType": v.discountType
                        };

                        var radio = $('<div class="radio no-padding" style="margin-bottom:10px"></div>');
                        var lableInput = $('<label></label>').append($('<input type="radio" name="basePrice" class="ace"></input>').attr(params)).append('<sapn class="lbl"></sapn>');
                        var lbl1 = $('<label>' + v.name + '</label>').addClass('quotation-base-price-radio').addClass('quotation-base-price-radio-width15');
                        var lbl2 = $('<label> 折扣(' + constant.data().decorationMatching.discountType.keys[v.discountType] + "): " + v.discount + '</label>').addClass('quotation-base-price-lbl');
                        var lbl3 = $('<label> 基数: ' + v.base + '</label>').addClass('quotation-base-price-lbl').addClass('hide');

                        radio.append(lableInput).append(lbl1).append(lbl2).append(lbl3).appendTo(com.focusPage("#showBaseVersion"));

                        lableInput.click(function(e) {

                            if (v.discountType != constant.data().decorationMatching.DISCOUNTTYPE_ONLY_INT) {
                                com.focusPage("#discount").val(10).removeAttr("disabled");
                            } else {
                                com.focusPage("#discount").prop("disabled", "disabled").val(v.discount);
                            }
                        });
                    });
                });
            });
        },

        saveQuotationPrefer: function() {

            com.focusPage('#savePreferBtn').click(function() {

                if (com.validate('quotationPreferModal')) {
                    return false;
                }

                quo.oldPrefer.ppid = quo.preferParams["quotationPrefer.presignProduce.ppid"];
                quo.oldPrefer.preferPrice = quo.preferParams["quotationPrefer.preferPrice"];
                quo.oldPrefer.managePrefer = quo.preferParams["quotationPrefer.managePrefer"];
                quo.oldPrefer.advancePrefer = quo.preferParams["quotationPrefer.advancePrefer"];
                quo.oldPrefer.discount = quo.preferParams["quotationPrefer.discount"];
                quo.oldPrefer.manageDiscount = quo.preferParams["quotationPrefer.manageDiscount"];
                quo.oldPrefer.quotePrice = quo.preferParams["quotationPrefer.quotePrice"];
                quo.oldPrefer.quoteArea = quo.preferParams["quotationPrefer.quoteArea"];
                quo.oldPrefer.activityPrice = quo.preferParams["quotationPrefer.activityPrice"];
                quo.oldPrefer.activityProfit = quo.preferParams["quotationPrefer.activityProfit"];

                var produce = com.focusPage('#produce').val();
                var preferPrice = com.focusPage('#prefer').val();
                var managePrefer = com.focusPage('#manage').val();
                var advancePrefer = com.focusPage('#advance').val();
                var quoteArea = com.focusPage('#square').val();
                var quotePrice = com.focusPage('#countQuotePrice').text();
                var activityPrice = quo.quotationPrefer ? quo.quotationPrefer.activityPrice : 0;

                quotePrice = utils.accSub(quotePrice, activityPrice);

                var produceId = produce ? produce : quo.oldPrefer.ppid;

                var presignProduce = null;

                if (produceId) {
                    com.post(api.quotation.queryPresignProduceByPpid, {
                        "presignProduce.ppid": produceId
                    }, function(res) {

                        if (res.presignProduce && res.presignProduce.ppid != 0) {
                            presignProduce = res.presignProduce;

                            presignProduce.quoteArea = quoteArea;
                            presignProduce.quotePrice = quotePrice;
                        }
                    }, null, false);
                }

                quo.preferParams["quotationPrefer.qid"] = quo.quotationid;
                quo.preferParams["quotationPrefer.presignProduce.ppid"] = presignProduce ? presignProduce.ppid : null;
                quo.preferParams["quotationPrefer.preferPrice"] = preferPrice;
                quo.preferParams["quotationPrefer.managePrefer"] = managePrefer;
                quo.preferParams["quotationPrefer.advancePrefer"] = advancePrefer;
                quo.preferParams["quotationPrefer.discount"] = presignProduce ? presignProduce.discount : 0;
                quo.preferParams["quotationPrefer.manageDiscount"] = presignProduce ? presignProduce.manageDiscount : 0;
                quo.preferParams["quotationPrefer.quoteArea"] = quoteArea;
                quo.preferParams["quotationPrefer.quotePrice"] = quotePrice;

                var perfer = {
                    "preferPrice": com.focusPage('#prefer').val(),
                    "managePrefer": com.focusPage('#manage').val(),
                    "advancePrefer": com.focusPage('#advance').val(),
                    "prompt": true
                }

                if (!quo.quotationPreferControl(presignProduce, perfer)) {
                    return false;
                }

                if (parseFloat(advancePrefer) > quo.oldPrefer.advancePrefer && parseFloat(advancePrefer) > quo.protation.advanceProfit) {

                    quo.currentSubmitType = 0;

                    com.focusPage('#approveModal').modal("show");

                    return false;
                }

                if (!quo.calculateQuoFees()) {
                    quo.oldQuotationPreferData();
                    return false;
                }

                quote.editQuotePreferArea(quoteArea, com.focusPage("#innerFloor").val(), com.focusPage("#isLift").val());

                com.focusPage('#presentPrefer').val(presignProduce ? presignProduce.name : '无');
                com.focusPage('#square').val(quoteArea);

                quote.updateQuotationForTime();

                var $domains = com.focusPage('#functionAreaDetailList .widget-box:not([data-del-sign="1"])');

                if ($domains.length) {

                    $domains.each(function() {

                        var $this = $(this);

                        var $btnExpres = $this.find('.widget-body .num .icon-circle-arrow-up');

                        $.each($btnExpres, function(i, e) {

                            var $line = $(e).parents("li");

                            if (!$line.attr("data-qfaiid") || !$line.attr("data-expres") || $line.attr("data-control") == 1)
                                return true;

                            $(e).show();
                        });
                    });
                }

            });
        },

        submitApprovalPrefer: function() {

            com.focusPage('#submitApproveBtn').bindClick(function() {

                if (com.validate("approveModal")) {
                    return false;
                }

                var receiverId = com.focusPage("#approveManSel", "#approveModal").find('input:checked').attr('userid');

                if (receiverId == null || receiverId == "") {
                    com.showAlert(com.error, "请选择审批人");
                    return false;
                }

                var params = {
                    "approval.receiver.userId": receiverId,
                    "approval.comment": com.focusPage("#changeReason", "#approveModal").val(),
                    "approvalQuotationPrefer.qid": quo.quotationid,
                    "approvalQuotationPrefer.qpid": quo.preferParams["quotationPrefer.qpid"],
                    "approvalQuotationPrefer.ppid": quo.preferParams["quotationPrefer.presignProduce.ppid"],
                };

                if (quo.currentSubmitType === 1) {
                    // 活动优惠审批：传入 activityProfit, activityPrice, totalPrice, type
                    params["approvalQuotationPrefer.activityProfit"] = com.focusPage('#activityProfit', "#quotationPreferModal").val();
                    params["approvalQuotationPrefer.activityPrice"] = quo.preferParams["quotationPrefer.activityPrice"];
                    params["approvalQuotationPrefer.totalPrice"] = quo.basicParams["quotation.totalPrice"];
                    params["approvalQuotationPrefer.taxPrice"] = quo.basicParams["quotation.taxPrice"];
                    params["approvalQuotationPrefer.type"] = 1;
                } else {
                    // 特批优惠审批：传入原有的优惠参数
                    params["approvalQuotationPrefer.preferPrice"] = quo.preferParams["quotationPrefer.preferPrice"];
                    params["approvalQuotationPrefer.managePrefer"] = quo.preferParams["quotationPrefer.managePrefer"];
                    params["approvalQuotationPrefer.advancePrefer"] = quo.preferParams["quotationPrefer.advancePrefer"];
                    params["approvalQuotationPrefer.activityPrice"] = quo.preferParams["quotationPrefer.activityPrice"];
                    params["approvalQuotationPrefer.activityProfit"] = quo.preferParams["quotationPrefer.activityProfit"];
                    params["approvalQuotationPrefer.taxPrice"] = quo.basicParams["quotation.taxPrice"];
                    params["approvalQuotationPrefer.totalPrice"] = quo.basicParams["quotation.totalPrice"];
                    params["approvalQuotationPrefer.type"] = 0;
                }

                com.post(api.approval.submitApprovalForQuotationPrefer, params, function(res) {

                    com.showAlert(com.info, "操作成功");

                    quote.updateQuotationForTime();

                    quo.quoModals.$domainApproveModal.modal("hide");
                    quo.quoModals.$domainPreferModal.modal("hide");
                });
            });
        },

        handleActivityProfitSubmit: function() {

            com.focusPage('#submitActivityProfitBtn', '#quotationPreferModal').click(function() {

                quo.currentSubmitType = 1;

                // 保存旧值，用于取消时恢复
                quo.oldPrefer.preferPrice = quo.preferParams["quotationPrefer.preferPrice"];
                quo.oldPrefer.managePrefer = quo.preferParams["quotationPrefer.managePrefer"];
                quo.oldPrefer.advancePrefer = quo.preferParams["quotationPrefer.advancePrefer"];
                quo.oldPrefer.discount = quo.preferParams["quotationPrefer.discount"];
                quo.oldPrefer.manageDiscount = quo.preferParams["quotationPrefer.manageDiscount"];
                quo.oldPrefer.quotePrice = quo.preferParams["quotationPrefer.quotePrice"];
                quo.oldPrefer.quoteArea = quo.preferParams["quotationPrefer.quoteArea"];
                quo.oldPrefer.activityPrice = quo.preferParams["quotationPrefer.activityPrice"];
                quo.oldPrefer.activityProfit = quo.preferParams["quotationPrefer.activityProfit"];

                // 获取用户输入的活动优惠金额
                var activityProfitInput = com.focusPage('#activityProfit', "#quotationPreferModal").val();

                // 校验活动优惠金额合理性
                if (parseFloat(activityProfitInput) < 0) {
                    com.showAlert(com.warning, "活动优惠不能为负数");
                    return false;
                }

                var activityPrice = quo.quotationPrefer ? quo.quotationPrefer.activityPrice : 0;
                if (parseFloat(activityProfitInput) > parseFloat(activityPrice)) {
                    com.showAlert(com.warning, "活动优惠不能大于活动金额");
                    return false;
                }

                // 临时更新到全局参数，用于计算 totalPrice
                quo.preferParams["quotationPrefer.activityProfit"] = activityProfitInput;

                // 重新计算费用，验证优惠金额是否合理
                if (!quo.calculateQuoFees()) {
                    quo.oldQuotationPreferData();
                    return false;
                }

                // 清空旧的审批人列表，重新加载
                com.focusPage("#approveManSel", "#approveModal").empty();

                com.post(api.approval.queryApproverByType, {
                    "approver.type": 26
                }, function(res) {

                    $.each(res.approvers, function(i, v) {

                        var comment = v.comment == null ? "" : v.comment;

                        var approveManSel = com.focusPage("#approveManSel", "#approveModal");
                        var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px").appendTo(approveManSel);
                        var $approvaler = $('<label></label>').appendTo($div);

                        var $input = $('<input>').attr({
                            "type": "radio",
                            "name": "form-field-radio",
                            "class": "ace",
                            "uid": v.userBase.uid,
                            "userId": v.userBase.userId
                        }).appendTo($approvaler);

                        var $span = $('<span></span>').addClass('lbl').appendTo($approvaler);
                        var $name = $('<label></label>').attr('style', 'margin-left:10px;').text(v.userBase.currentName).appendTo($span);

                        var $comment = $('<span></span>').addClass("lbl").text(comment).attr("style", "margin-left:15px").appendTo($approvaler);
                    });

                    // 显示审批弹窗
                    com.focusPage("#approveModal").modal("show");
                }, null, false);

                return false;
            });
        },

        handleInput: function() {

            com.focusPage('#square').on('blur', function() {

                var produceId = null;

                if (com.focusPage('#produce').val() != 0) {
                    produceId = com.focusPage('#produce').val();
                }

                var perfer = {
                    "preferPrice": com.focusPage('#prefer').val(),
                    "managePrefer": com.focusPage('#manage').val(),
                    "advancePrefer": com.focusPage('#advance').val(),
                    "prompt": true
                }

                quote.obtainQuotePrice(produceId, $(this).val(), perfer);

            });
        },

        handlechange: function() {

            com.focusPage('#produce').on('change', function() {

                var presignProduce = null, produceId = null;

                if (com.focusPage('#produce').val() != 0) {
                    produceId = com.focusPage('#produce').val();
                } else {
                    produceId = quo.preferParams["quotationPrefer.presignProduce.ppid"];
                }

                com.post(api.quotation.queryPresignProduceByPpid, {
                    "presignProduce.ppid": produceId
                }, function(res) {

                    presignProduce = res.presignProduce;
                }, null, false);
            });
        },

        pageQuotationItemForPrice: function() {

            // 初始化报价项选择弹层
            var extraParams = {
                "quotationItem.version.no": quo.versionId,
                "quotationPrice.updateTime": quo.basicParams["quotation.updateTime"] != null ? quo.basicParams["quotation.updateTime"] : com.currentTime()
            };

            var postData = "quotationDetailItemPostData"

            if (quo.decorationType == constant.decoration().decoration.TYPE_INCLUSIVE_INT && quo.precontractTime != null) {
                extraParams["quotationPrice.updateTime"] = quo.precontractTime;
            }

            if (parseInt(domain.nowEditDomain.attr("data-dlevel")) == "9998") {
                postData = "quotationDetailCmprehItemPostData"
            } else {
                extraParams["quotationItem.type"] = null;
            }

            var _condArr = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'quotation-worktype'];
            var quotationItemSeacher = new Searcher();
            quotationItemSeacher.init(_condArr, "condList", api.quotation.pageQuotationItemForPrice, function(data) {

                var $tableWrap = com.focusPage('#resultList').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if (data && data.length) {
                    $.each(data, function(i, v) {

                        painter.createQuoteModalItem(v).appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);

                    if (quote.quotesRecord.length) {
                        $.each(quote.quotesRecord, function(index, val) {

                            var $input = com.focusPage('input[name="modalQuots"][value="' + $(val).val() + '"]');
                            $input.length && ($input.prop('checked', true));
                        });
                    }
                }
            }, "pagenation", postData, extraParams);
        },

        sortFunctionAreaItem: function($domain) {

            var quoteFunctionAreaItem = {};
            var $itemlist = $domain.find("li.fl-quo-item.item");

            if ($itemlist.length == 0)
                return false;

            // 重新排序功能区下的项目
            $itemlist.sort(function(a, b) {

                var itemA = $(a).find(".worktype .cell-wrap").text();
                var itemB = $(b).find(".worktype .cell-wrap").text();

                function getID(text) {

                    return quo.workTypes.find(function(item) {

                        return item.name === text;
                    }).id;
                }

                return getID(itemA) - getID(itemB);
            });

            // 重新将项目添加回功能区下
            $itemlist.each(function(i, li) {

                $(li).find(".line .cell-wrap").text(i + 1);
                $(li).appendTo($domain.find(".fl-quo-list.list").eq(0));

                quoteFunctionAreaItem["quotationFunctionAreaItems[" + i + "].qfaiId"] = $(li).attr('data-qfaiId');
                quoteFunctionAreaItem["quotationFunctionAreaItems[" + i + "].index"] = (i + 1);
            });

            var quoteFunctionArea = {
                "quotationFunctionArea.qfaId": $domain.attr('data-qfaId')
            };

            var params = $.extend({}, quoteFunctionAreaItem, quoteFunctionArea);

            com.post(api.quotation.updateQuotationFunctionAreaItemForIndex, params);

        },

        // 绑定各种关于报价的操作
        init: function() {

            this.saveDomainEdit();
            this.saveDomainParamEdit();
            this.calculateTotal();
            this.quotationItemPriceEdit();
            this.saveDiscountEdit();
            this.saveDomainTemplete();
            this.saveQuotesToDomain();
            this.saveManageRate();
            this.saveTaxRate();
            this.deleteQuotesToDomain();
            this.showDiscountBasePrice();
            this.saveQuotationPrefer();
            if ([constant.decoration().decoration.TYPE_MIDPACK_INT, constant.decoration().decoration.TYPE_HOLONOMY_INT].indexOf(quo.decorationType) == -1)
                this.handleInput();
            this.handlechange();
            this.submitApprovalPrefer();
            this.handleActivityProfitSubmit();
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
                return false
            }

            $arr.each(function() {

                $this = $(this);
                $this.find('.line .cell-wrap').text($this.index() + 1);
            });
        },

        getNumCellFocus: function($line) {

            if ($line.attr('data-control') == 1)
                return false;

            var that = this;

            // 选中后代中带有*class的标签
            var $numCell = $line.find('.cell.formula');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $line.parents('.widget-body-inner').find('.fl-quo-input');

            // 报价项的模块
            domain.nowEditDomain = $line.parents('.widget-box');
            quote.checkedStyle($line);

            // 选中元素中input标签 val赋值为$numCell的文本值 并且点击input标签获取焦点 .focus()获取焦点 .select()选中
            $editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();

            if ($line.attr('data-expres').indexOf('~') != -1) {
                $editInput.find('input').attr('readonly', 'readonly');
            } else {
                $editInput.find('input').removeAttr('readonly');
            }

            that.$nowLine = $line;
            that.$nowEditInput = $editInput;

            that.$nowEditInput.find('input').off('keydown').on("keydown", function(e) {

                var $input = $(this);
                that.bindInputKeydown($input.val(), e);
            });
        },

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

                if (that.$nowLine.attr("data-areaItem") == "quotationItem") {
                    quote.updateQuoteFunctionAreaItem(formula, num, that);
                } else {
                    quote.updateExtensionItem(formula, num, that);
                }

                return false;
            }

            // 如果按键为上 调整焦点到功能区内上一个报价项
            if (e.keyCode == 38) {

                if (that.$nowLine.attr("data-areaItem") == "quotationItem") {
                    $line = that.$nowLine.prevAll('.fl-quo-item.item[data-control="0"]').first();
                } else {
                    $line = that.$nowLine.prev();
                }

                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }

                return false;
            }
            // 如果按键为下 调整焦点到功能区内的下一个报价项
            if (e.keyCode == 40) {

                if (that.$nowLine.attr("data-areaItem") == "quotationItem") {
                    $line = that.$nowLine.nextAll('.fl-quo-item.item[data-control="0"]').first();
                } else {
                    $line = that.$nowLine.next();
                }

                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }

                return false;
            }
        },

        updateQuoteFunctionAreaItem: function(formula, num, that) {

            // 保留原先的工程量和数量
            var oldFormula = that.$nowLine.find('.cell.formula .cell-wrap span').text();
            var oldNum = that.$nowLine.find('.cell.num .cell-wrap .number').text();

            // 赋值给外部的公式显示
            that.$nowLine.find('.cell.formula .cell-wrap span').text(formula);
            // 赋值给外部显示DIV 显示数量
            that.$nowLine.find('.cell.num .cell-wrap .number').text(num);
            // 获取下一个报价项的整体元素标签
            var $line = that.$nowLine.nextAll('.fl-quo-item.item[data-control="0"]').first();

            var _type = that.$nowLine.find('.type').attr('data-type');
            var _areaType = that.$nowLine.find('.line').attr('data-areaType');
            var isRtem = that.$nowLine.attr("data-isRtem");

            var num = that.$nowLine.find('.num .cell-wrap .number').text();

            var _rtems = rtems.queryQuotationRtems(that.$nowLine.attr('data-qiid'));
            var qrid = "";

            $.each(_rtems, function(i, v) {

                qrid += v.target.qiid + ",";
            });

            that.$nowLine.attr("data-qrid", qrid);

            var args = {
                "quotationFunctionAreaItem.discount": that.$nowLine.find('.discountprice').attr('data-discount'),// 折扣标示 1:打折 ;
                "quotationFunctionAreaItem.qfaiId": that.$nowLine.find('input[name="deleteItems"]').val(),// 报价项Id , 可空 ;
                "quotationFunctionAreaItem.itemName": that.$nowLine.find('.name .cell-wrap').text(),// 报价项名
                "quotationFunctionAreaItem.measurementUnit": that.$nowLine.find('.unit .cell-wrap').text(),// 单位 ;
                "quotationFunctionAreaItem.formula": that.$nowLine.find('.formula .cell-wrap').text(),// 计算公式
                "quotationFunctionAreaItem.workType": that.$nowLine.find('.worktype .cell-wrap').text(),// 工种 workTypeId : $("#workType").val(),

                "quotationFunctionAreaItem.unitPrice": that.$nowLine.find('.unitprice').attr('data-unitprice'),// 单价 ;
                "quotationFunctionAreaItem.addPrice": that.$nowLine.attr('data-addprice'),// 增补价;
                "quotationFunctionAreaItem.subPrice": that.$nowLine.attr('data-subprice'),// 退减价;
                "quotationFunctionAreaItem.initNum": that.$nowLine.find('.num .cell-wrap .number').text(),// 初始化数量
                "quotationFunctionAreaItem.num": that.$nowLine.find('.num .cell-wrap .number').text(),// 数量;
                "quotationFunctionAreaItem.subtype": that.$nowLine.find('.num').attr('data-subtype'),// 1工程,2主材
                "quotationFunctionAreaItem.type": _type,// , 类型 , 自定义为1 , 工程报价项为0 不计算为4
                "quotationFunctionAreaItem.quotationFunctionAreaId": domain.nowEditDomain.attr('data-qfaId'),// 功能区Id
                "quotationFunctionAreaItem.index": parseInt(that.$nowLine.find(".line .cell-wrap").text())
            };

            if (_type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || _type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT || _type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT || _type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || _type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT || _type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) {
                // 报价项Id , 标准类型报价项需要传递 "data-qiid"
                args["quotationFunctionAreaItem.quotationItemId"] = that.$nowLine.find('input[name="deleteItems"]').attr('data-qiid');
            } else if (_type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT) {
                // 报价项说明 , 自定义类型报价项需要传递 ;
                args["quotationFunctionAreaItem.content"] = that.$nowLine.prop('title');
            }
            that.$nowLine.find('input[name="deleteItems"]').val(that.$nowLine.find('input[name="deleteItems"]').val());

            var _fee = quo.calculateNowQuoteItem(num, _areaType, that.$nowLine);

            com.clearValidator();

            that.$nowLine.find(".icon-arrow-up").removeClass("grey").addClass("green"), that.$nowLine.find(".icon-arrow-down").removeClass("grey").addClass("red");

            var _params = $.extend({}, args, quo.basicParams);

            com.post(api.quotation.updateQuotationFunctionAreaItem, _params, function(res) {

                // 选中左上角报价中的功能区ID 将总价格显示
                com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                that.$nowLine.find('input[name="deleteItems"]').val(res.quotationFunctionAreaItem.qfaiId);

                that.$nowLine.attr("data-qfaiid", res.quotationFunctionAreaItem.qfaiId);
                that.$nowLine.find('.num .icon-circle-arrow-up').hide();
                that.$nowLine.attr("data-isItem", 1);

                that.cacsedeUpdateItem(that.$nowLine);
                that.cacsedeUpdateCpItem([that.$nowLine]);
                quo.calculateQuoFeesPost();

                quote.reverseUpdateInnerArea(that.$nowLine);
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                that.$nowLine.find('.cell.formula .cell-wrap span').text(oldFormula);
                that.$nowLine.find('.cell.num .cell-wrap .number').text(oldNum);

                quo.calculateNowQuoteItem(oldNum, _areaType, that.$nowLine);

                quo.calculateQuoFeesPost();
            }, false);

            if ($line.length) {
                that.getNumCellFocus($line);
            } else {
                that.hideInputWrap();
            }
        },

        updateExtensionItem: function(formula, num, that) {

            // 保留原先的工程量和数量
            var oldFormula = that.$nowLine.find('.cell.formula .cell-wrap span').text();
            var oldNum = that.$nowLine.find('.cell.num .cell-wrap .number').text();

            // 赋值给外部的公式显示
            that.$nowLine.find('.cell.formula .cell-wrap span').text(formula);
            // 赋值给外部显示DIV 显示数量
            that.$nowLine.find('.cell.num .cell-wrap .number').text(num);
            // 获取下一个报价项的整体元素标签
            var $line = that.$nowLine.next('.fl-quo-item.item');

            var num = that.$nowLine.find('.num .cell-wrap .number').text();

            var args = {
                "extension.qid": quo.quotationid,
                "extension.type": that.$nowLine.attr("data-type"),

                "extensionItem.eiid": that.$nowLine.attr("data-eiid"),
                "extensionItem.discount": that.$nowLine.find('.discountprice').attr('data-discount'),
                "extensionItem.content": that.$nowLine.attr("data-content"),
                "extensionItem.itemName": that.$nowLine.find('.name .cell-wrap').text(),
                "extensionItem.measurementUnit": that.$nowLine.find('.unit .cell-wrap').text(),
                "extensionItem.num": num,
                "extensionItem.quotationFunctionAreaId": that.$nowLine.parents('.widget-box').attr('data-qfaid'),
                "extensionItem.quoteItemId": that.$nowLine.attr("data-qfaiid"),
                "extensionItem.qiid": that.$nowLine.attr("data-qiid"),
                "extensionItem.subtype": that.$nowLine.attr("data-subtype"),
                "extensionItem.unitPrice": that.$nowLine.find('.unitprice').attr('data-unitprice'),
                "extensionItem.addPrice": that.$nowLine.attr("data-addPrice"),
                "extensionItem.subPrice": that.$nowLine.attr("data-subPrice"),
                "extensionItem.workType": that.$nowLine.attr("data-workType")
            };

            quo.calculateNowExtensionItem(num, that.$nowLine);

            com.post(api.quotation.upgradeExtensionItem, args, function(res) {

            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                that.$nowLine.find('.cell.formula .cell-wrap span').text(oldFormula);
                that.$nowLine.find('.cell.num .cell-wrap .number').text(oldNum);
            }, false);

            if ($line.length) {
                that.getNumCellFocus($line);
            } else {
                that.hideInputWrap();
            }
        },

        hideInputWrap: function() {

            if (!this.$nowEditInput) {
                return false;
            }

            this.$nowEditInput.addClass('hide');
            // this.$nowEditInput = null;
        },

        cacsedeUpdateItem: function(item) {

            var $domain = domain.nowEditDomain;
            var $cpdomain = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            $domain.find(".fl-quo-list.list").eq(0).find('.fl-quo-item.item').attr('data-count-num', 0);
            $cpdomain.find(".fl-quo-list.list").eq(0).find('.fl-quo-item.item').attr('data-count-num', 0);

            if ($domain.attr("data-dlevel") == "9998" || $domain.attr("data-del-sign") == "1" || !item.attr("data-qrid") || item.attr("data-qrid") == "")
                return false;

            var itemQrid = item.attr("data-qrid");

            var arrQrid = itemQrid.split(",");

            var qiidArr = [], quoRtemsList = {};

            $.each(arrQrid, function(i, id) {

                if (id == "")
                    return true;

                var items = $domain.find(".fl-quo-list.list").eq(0).find('.fl-quo-item.item[data-qrid*="' + id + '"]');

                $.each(items, function(index, e) {

                    var $item = $(e);
                    var qiid = $item.attr("data-qiid");
                    var number = $item.find('.cell.num .cell-wrap .number').text();

                    if (qiidArr.indexOf(qiid) != -1)
                        return true;

                    qiidArr.push(qiid);

                    var _rtems = rtems.queryQuotationRtems(qiid);

                    if (!_rtems.length)
                        return false;

                    $.each(_rtems, function(ri, v) {

                        var handler = null;

                        if (v.type == constant.data().quotationRtem.TYPE_GENERRAL_INT && arrQrid.indexOf(String(v.target.qiid)) != -1) {
                            handler = $domain.find(".fl-quo-list.list").eq(0).find(".fl-quo-item.item[data-qiid=" + v.target.qiid + "]");
                        }

                        if (!handler || handler.length == 0 || handler.attr("data-control") == 1)
                            return true;

                        var newNum = parseFloat(handler.attr("data-count-num"));

                        newNum = newNum + ($item.attr('data-del-sign') == 1 ? 0 : quote.quotationFunctionAreaFormula(v.formula, $domain, number).num);

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
                    var qfaiid = parseInt($item.attr("data-qfaiid"));
                    var qiid = parseInt($item.attr("data-qiid"));

                    if (!itemList[qfaiid]) {
                        itemList[qfaiid] = qiid;
                    }
                });
            });

            $.each(itemList, function(i, e) {

                var isItem = com.focusPage('.fl-quo-item.item[data-qfaiid*="' + i + '"]');
                var number = parseFloat(isItem.find('.cell.num .cell-wrap .number').text());
                var widget = isItem.parents('.widget-box');

                var _rtems = rtems.queryQuotationRtems(e);

                if (!_rtems.length)
                    return true;

                $.each(_rtems, function(index, v) {

                    var handler = null;

                    if (v.type == constant.data().quotationRtem.TYPE_CMPREH_INT) {
                        handler = $domain.find(".fl-quo-list.list").eq(0).find(".fl-quo-item.item[data-qiid=" + v.target.qiid + "]");
                    }

                    if (v.type == constant.data().quotationRtem.TYPE_GENERRAL_INT && widget.attr("data-dlevel") == "9998") {
                        handler = $domain.find(".fl-quo-list.list").eq(0).find(".fl-quo-item.item[data-qiid=" + v.target.qiid + "]");
                    }

                    if (!handler || handler.length == 0 || handler.attr("data-control") == 1)
                        return true;

                    var qiid = parseInt(handler.attr("data-qiid"));

                    var newNum = parseFloat(handler.attr("data-count-num"));

                    newNum = newNum + (isItem.attr('data-del-sign') == 1 ? 0 : quote.quotationFunctionAreaFormula(v.formula, widget, number).num);

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
            var oldFormula = handler.find('.cell.formula .cell-wrap span').text();
            var oldNum = handler.find('.cell.num .cell-wrap .number').text();
            var _type = handler.find('.type').attr('data-type');
            handler.find('.cell.formula .cell-wrap span').text(newNum);
            handler.find('.cell.num .cell-wrap .number').text(newNum);
            handler.find(".icon-arrow-up").removeClass("grey").addClass("green");
            handler.find(".icon-arrow-down").removeClass("grey").addClass("red");

            var fee = quo.calculateNowQuoteItem(newNum, domain.attr('data-areaType'), handler);
            com.focusPage('[data-qfaid="' + domain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(fee);

            var _params = {
                "quotationFunctionAreaItem.discount": handler.find('.discountprice').attr('data-discount'),// 折扣标示 1:打折 ;
                "quotationFunctionAreaItem.qfaiId": handler.find('input[name="deleteItems"]').val(),// 报价项Id , 可空 ;
                "quotationFunctionAreaItem.itemName": handler.find('.name .cell-wrap').text(),// 报价项名
                "quotationFunctionAreaItem.measurementUnit": handler.find('.unit .cell-wrap').text(),// 单位 ;
                "quotationFunctionAreaItem.formula": newNum,// 计算公式
                "quotationFunctionAreaItem.workType": handler.find('.worktype .cell-wrap').text(),// 工种

                "quotationFunctionAreaItem.unitPrice": handler.find('.unitprice').attr('data-unitprice'),// 单价 ;
                "quotationFunctionAreaItem.addPrice": handler.attr('data-addprice'),// 增补价;
                "quotationFunctionAreaItem.subPrice": handler.attr('data-subprice'),// 退减价;
                "quotationFunctionAreaItem.initNum": newNum,// 初始化数量
                "quotationFunctionAreaItem.num": newNum,// 数量;
                "quotationFunctionAreaItem.subtype": handler.find('.num').attr('data-subtype'),// 1工程,2主材
                "quotationFunctionAreaItem.type": _type,// , 类型
                "quotationFunctionAreaItem.quotationFunctionAreaId": domain.attr('data-qfaId'),// 功能区Id
                "quotationFunctionAreaItem.index": parseInt(handler.find(".line .cell-wrap").text()),
                "quotationFunctionAreaItem.quotationItemId": handler.attr('data-qiid'),
                "quotationFunctionAreaItem.content": handler.prop('title')
            };

            var _params = $.extend({}, _params, quo.basicParams);

            com.post(api.quotation.updateQuotationFunctionAreaItem, _params, function(res) {

                handler.attr("data-qfaiid", res.quotationFunctionAreaItem.qfaiId);
                handler.find('input[name="deleteItems"]').val(res.quotationFunctionAreaItem.qfaiId);

            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                handler.find('.cell.formula .cell-wrap span').text(oldFormula);
                handler.find('.cell.num .cell-wrap .number').text(oldNum);

                quo.calculateNowQuoteItem(oldNum, handler.attr('data-areaType'), handler);
            }, false);
        },

        // 逆向更新计价面积（工程量箭头按钮）显示规则
        reverseUpdateInnerArea: function($Item) {

            var $domain = domain.nowEditDomain;
            var $cpdomain = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            var _rtems = rtems.queryQuotationRtems($Item.attr("data-qiid"));
            var rtemlength = 0;

            if (_rtems.length) {
                $.each(_rtems, function(ri, v) {

                    var handler = $domain.find(".fl-quo-list.list").eq(0).find(".fl-quo-item.item[data-qiid=" + v.target.qiid + "]");

                    if (handler.length == 0 && v.type == constant.data().quotationRtem.TYPE_CMPREH_INT) {
                        handler = $cpdomain.find(".fl-quo-list.list").eq(0).find(".fl-quo-item.item[data-qiid=" + v.target.qiid + "]");
                    }

                    if (v.target.formula.indexOf('j') != -1 && handler.length)
                        rtemlength += 1;
                });
            }

            if ($Item.attr("data-expres").indexOf('j') == -1 && rtemlength == 0)
                return true;

            var tnum = 0;

            var items = com.focusPage(".fl-quo-item.item[data-expres='{j}']");

            $.each(items, function(i, e) {

                var itemnum = $(e).find('.cell.num .cell-wrap .number').text();

                tnum = utils.accAdd(tnum, parseFloat(itemnum ? itemnum : 0));
            });

            var perfer = {
                "preferPrice": quo.preferParams["quotationPrefer.preferPrice"],
                "managePrefer": quo.preferParams["quotationPrefer.managePrefer"],
                "advancePrefer": quo.preferParams["quotationPrefer.advancePrefer"],
                "prompt": false
            };

            // 验证计价面积合理性
            if (quote.obtainQuotePrice(null, tnum, perfer)) {

                quo.preferParams["quotationPrefer.quoteArea"] = tnum;

                quote.editQuotePreferArea(tnum, quo.houseParams["house.innerFloor"], quo.houseParams["house.isLift"]);

                quo.calculateQuoFees();
            }
        },

        // 批量删除报价项
        deleteQuoteInBatches: function($domain) {

            $domain.find('.fl-quo-input').insertAfter($domain.find('.fl-quo-list.list').eq(0)).addClass('hide');

            var that = this;

            var $quos = com.focusPage('[name="deleteItems"]:checked', $domain);

            var $q1 = [], $q2 = [], _params = {};

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

            quo.calculateQuoFees();

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
                quo.calculateQuoFeesPost();

                _params = $.extend({}, _params, quo.basicParams, {
                    "quotationFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid')
                });

                com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res) {

                    $.each($q1, function(i, v) {

                        $(v).parents('li.fl-quo-item.item').remove();
                    });

                    quo.calculateDomainFees(domain.nowEditDomain);
                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();

                    com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    $.each($q1, function(i, v) {

                        $(v).parents('li.fl-quo-item.item').removeAttr("data-del-sign");
                        that.cacsedeUpdateItem(item);
                    });

                    that.cacsedeUpdateCpItem(items);
                    quo.calculateDomainFees(domain.nowEditDomain);
                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();
                }, false);
            }
            quote.sortQuote(domain.nowEditDomain);
        },

        // 删除报价项
        deleteQuote: function($quote) {

            if ($quote.attr("data-control") == 1)
                return false;

            var that = this;

            var _qid = $quote.find('input[type="checkbox"]').val();

            var _params = {};

            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list.list').eq(0)).addClass('hide');

            if (!_qid) {
                $quote.remove();
            } else {

                $quote.attr('data-del-sign', 1);

                var _fee = quo.calculateDomainFees(domain.nowEditDomain);

                that.cacsedeUpdateItem($quote);
                that.cacsedeUpdateCpItem([$quote]);
                quo.calculateQuoFees();

                _params = $.extend({}, quo.basicParams, {
                    "quotationFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid'),
                    "qfaiIds[0]": _qid
                });

                com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res) {

                    $quote.remove();

                    var _fee = quo.calculateDomainFees(domain.nowEditDomain);

                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();

                    com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    $quote.removeAttr("data-del-sign");

                    that.cacsedeUpdateItem($quote);
                    that.cacsedeUpdateCpItem([$quote]);
                    quo.calculateDomainFees(domain.nowEditDomain);
                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();
                }, false);
            }

            quote.sortQuote(domain.nowEditDomain);
        },

        // 删除扩展项
        deleteExtensionItem: function($item) {

            var params = {};
            var eid = $item.attr("data-eid");
            var eiid = $item.attr("data-eiid");

            domain.nowEditDomain = $item.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list.list').eq(1)).addClass('hide');

            com.post(api.quotation.queryExtensionByEid, {
                "extension.eid": eid
            }, function(res) {

                var extension = res.extension;

                params = {
                    "extension.undisPrice": extension.undisPrice,
                    "extension.disPrice": extension.disPrice,
                    "extension.manageRate": extension.manageRate,
                    "extension.managePrice": extension.managePrice,
                    "extension.manageDiscount": extension.manageDiscount,
                    "extension.taxRate": extension.taxRate,
                    "extension.taxPrice": extension.taxPrice,
                    "extension.total": extension.total,
                    "extension.consPrice": extension.consPrice,
                    "extension.comsPrice": extension.comsPrice,

                    "extensionItem.eid": extension.eid,
                    "extensionItem.eiid": eiid
                }
            }, null, false);

            com.post(api.quotation.deleteExtensionItem, params, function(res) {

                $item.remove();

                quote.controlQuoteItems($item.attr("data-qfaid"), $item.attr("data-qfaiid"));

            }, null, false);

            quote.sortQuote(domain.nowEditDomain);
        },

        // 添加自定义报价项
        saveCustomQuotesAdd: function() {

            com.focusPage("#saveCustomFunctionAreaItemBtn").on('click', function(event) {

                var _areaType = domain.nowEditDomain.attr('data-areaType');

                if (com.validate("customFunctionAreaItemsModal")) {
                    return false;
                }

                var _index = domain.nowEditDomain.find('.fl-quo-item.item').length;

                var addRow = {
                    discount: com.focusPage("#discountFlag").prop("checked") ? constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT : constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT,
                    formula: com.focusPage("#formula").val(),
                    subtype: com.focusPage("#quotationType").val(),
                    num: com.focusPage("#num").val(),
                    itemName: com.focusPage("#name").val(),
                    name: com.focusPage("#name").val(),
                    measurementUnit: com.focusPage("#measurementUnit").val(),
                    unitPrice: com.focusPage("#unitPrice").val(),
                    addPrice: com.focusPage("#addPrice").val(),
                    subPrice: com.focusPage("#subPrice").val(),
                    content: com.focusPage("#comment").val(),
                    type: constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT,
                    workType: com.focusPage('#workType').val(),
                    areaType: _areaType,
                };

                var args = {
                    "quotationFunctionAreaItem.discount": addRow.discount,// 是否打折
                    "quotationFunctionAreaItem.itemName": addRow.name,// 报价项名
                    "quotationFunctionAreaItem.measurementUnit": addRow.measurementUnit,// , 单位 ;
                    "quotationFunctionAreaItem.workType": com.focusPage('#workType').val(),// 工种 workTypeId : $("#workType").val(),
                    "quotationFunctionAreaItem.content": addRow.content,// , 报价项说明 , 自定义类型报价项需要传递 ;
                    "quotationFunctionAreaItem.unitPrice": addRow.unitPrice,// 单价 ;
                    "quotationFunctionAreaItem.addPrice": addRow.addPrice,// 增补价 ;
                    "quotationFunctionAreaItem.subPrice": addRow.subPrice,// 退减价 ;
                    "quotationFunctionAreaItem.subtype": addRow.subtype,
                    "quotationFunctionAreaItem.formula": addRow.formula,// 公式
                    "quotationFunctionAreaItem.initNum": addRow.num,// 原数
                    "quotationFunctionAreaItem.num": addRow.num,// , 工程量 ;
                    "quotationFunctionAreaItem.type": addRow.type,// , 类型 , 自定义为1 , 标准报价项为0 ;
                    "quotationFunctionAreaItem.quotationFunctionAreaId": domain.nowEditDomain.attr('data-qfaId'),// 功能区Id ;
                    "quotationFunctionAreaItem.index": (_index + 1),
                };

                var $item, $historyItem, _fee = 0;

                $item = painter.createQuote(_index + 1, addRow);
                $item.find(".icon-arrow-up").removeClass("grey").addClass("green"), $item.find(".icon-arrow-down").removeClass("grey").addClass("red");
                $item.appendTo(domain.nowEditDomain.find('.fl-quo-list.list').eq(0));

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
                        "id": com.focusPage('#workType').val(),
                        "name": com.focusPage('#workType').find("option:selected").text()
                    },
                    "unit": {
                        "id": com.focusPage("#measurementUnit").val(),
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

                var _params = $.extend({}, args, quo.basicParams);

                com.post(api.quotation.updateQuotationFunctionAreaItem, _params, function(res) {

                    $item.find('input[name="deleteItems"]').val(res.quotationFunctionAreaItem.qfaiId);
                }, null, false);

                quo.quoModals.$quoteAddModal.modal("hide");
                return false;
            });
        },

        /**
         * 添加报价项的时候记住上一页选中的报价项 参数
         * 
         * @$input : 正在操作的input标签
         * @ischecked : 选举中或取消选中
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

                if (!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')) {
                    that.hideInputWrap();
                }
            });
        },

        // 删除上一个选中的报价项选中样式 并添加当前报价项选中样式
        checkedStyle: function($item) {

            if ($item.attr("data-control") == 1)
                return false;

            com.focusPage('.fl-quo-item.item.current').removeClass('current');
            $item.addClass('current');
        },

        calculationNum: function() {

            com.focusPage('#formula').blur(function() {

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

            com.focusPage('#addHistoryItemsBtn').on('click', function(event) {

                quote.addDefaultQuotes();

                quo.calculateQuoFeesPost();

                quo.quoModals.$historyModal.modal("hide");
            });
        },

        // 记录历史数据
        recordHistoryQuotes: function($historyQuo) {

            var addflag = true;
            var $quos = com.focusPage('[type="checkbox"]', '#historyQuotationItemDiv');

            if ($quos.length) {

                $.each($quos, function(i, v) {

                    if ($(v).val() == $historyQuo.find('[type="checkbox"]').val()) {

                        addflag = false;

                        return false;
                    }
                });
            }

            addflag && $historyQuo.appendTo('#historyQuotationItemDiv > ul.fl-table-list');
        },

        addDefaultExtensionItems: function() {

            var _arrs = quote.quotesRecord;

            if (!_arrs.length) {
                return false;
            }

            var widget = domain.nowEditDomain;
            var extensionAddlist = domain.nowEditDomain.find('.fl-quo-list.list').eq(1);
            var _addIndex = extensionAddlist.find('.fl-quo-item.item').length;
            var extensionSublist = domain.nowEditDomain.find('.fl-quo-list.list').eq(2);
            var _subIndex = extensionSublist.find('.fl-quo-item.item').length;

            $.each(_arrs, function(i, v) {

                var $this = $(v);

                var num = quote.quotationFunctionAreaFormula($this.attr('data-formula'), widget, 0).num;
                var rtemType = $this.attr('data-rtemType');
                var item = null, type = 0, index = 0, content = "";

                if (rtemType == constant.data().quotationRtem.TYPE_UPGRADE_INT) {
                    type = constant.quotation().extension.TYPE_ADD_INT;
                    index = _addIndex += 1;
                    content = "升级";
                } else if (rtemType == constant.data().quotationRtem.TYPE_DOWNGRADE_INT) {
                    type = constant.quotation().extension.TYPE_SUB_INT;
                    index = _subIndex += 1;
                    content = "降级";
                }

                var _quotval = {
                    "eiid": "",
                    "discount": parseInt($this.attr('data-discount')),
                    "content": $this.attr('data-des'),
                    "itemName": $this.attr('data-name'),
                    "measurementUnit": $this.attr('data-itemUnite'),
                    "initnum": num,
                    "num": num,
                    "eiId": null,
                    "quotationFunctionAreaId": widget.attr("data-qfaid"),
                    "quoteItemId": quo.quoteItemId,
                    "qiid": $this.val(),
                    "subtype": $this.attr('data-quotationTypeId'),
                    "unitPrice": $this.attr('data-itemPrice'),
                    "addPrice": $this.attr('data-itemAddPrice'),
                    "subPrice": $this.attr('data-itemSubPrice'),
                    "workType": $this.attr('data-workType'),
                    "type": type,
                    "index": index
                };

                var arges = {
                    "extension.qid": quo.quotationid,
                    "extension.content": content,
                    "extension.orderId": quo.orderid,
                    "extension.type": type,

                    "extensionItem.discount": _quotval.discount,
                    "extensionItem.content": _quotval.content,
                    "extensionItem.itemName": _quotval.itemName,
                    "extensionItem.measurementUnit": _quotval.measurementUnit,
                    "extensionItem.num": _quotval.num,
                    "extensionItem.quotationFunctionAreaId": _quotval.quotationFunctionAreaId,
                    "extensionItem.quoteItemId": _quotval.quoteItemId,
                    "extensionItem.qiid": _quotval.qiid,
                    "extensionItem.subtype": _quotval.subtype,
                    "extensionItem.unitPrice": _quotval.unitPrice,
                    "extensionItem.addPrice": _quotval.addPrice,
                    "extensionItem.subPrice": _quotval.subPrice,
                    "extensionItem.workType": _quotval.workType
                };

                if (rtemType == constant.data().quotationRtem.TYPE_UPGRADE_INT) {
                    item = painter.createExtensionItem(_quotval.index, _quotval).appendTo(extensionAddlist);
                } else if (rtemType == constant.data().quotationRtem.TYPE_DOWNGRADE_INT) {
                    item = painter.createExtensionItem(_quotval.index, _quotval).appendTo(extensionSublist);
                }

                com.post(api.quotation.upgradeExtensionItem, arges, function(res) {

                    item.attr("data-eiid", res.extensionItem.eiid);
                    item.attr("data-eid", res.extensionItem.eid);

                    quote.controlQuoteItems(_quotval.quotationFunctionAreaId, _quotval.quoteItemId);
                });
            });

            quote.quotesRecord = [];
        },

        addDefaultQuotes: function() {

            var _arrs = quote.quotesRecord;

            if (!_arrs.length) {
                return false;
            }

            var widget = domain.nowEditDomain;
            var quolist = widget.find('.fl-quo-list.list').eq(0);
            var areaType = widget.attr('data-areaType');

            var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            var cpList = cpWidget.find('.fl-quo-list.list').eq(0);

            $.each(_arrs, function(i, v) {

                var $this = $(v);

                if ($this.val() && com.focusPage('input[data-qiid="' + $this.val() + '"]', domain.nowEditDomain).length) {
                    return false;
                }

                var type = quote.quoItemType($this.attr('data-type'), areaType);
                var quoteFormula = quote.quotationFunctionAreaFormula($this.attr('data-formula'), widget, 0);

                var _quotval = {
                    "discount": parseInt($this.attr('data-discount')),
                    "content": $this.attr('data-des'),
                    "itemName": $this.attr('data-name'),
                    "measurementUnit": $this.attr('data-itemUnite'),
                    "formula": quoteFormula.num,
                    "num": quoteFormula.num,
                    "qfaiId": null,
                    "quotationFunctionAreaId": widget.attr("data-qfaid"),
                    "quotationItemId": $this.val(),
                    "type": type,
                    "subtype": $this.attr('data-quotationTypeId'),
                    "unitPrice": $this.attr('data-itemPrice'),
                    "addPrice": $this.attr('data-itemAddPrice'),
                    "subPrice": $this.attr('data-itemSubPrice'),
                    "workType": $this.attr('data-workType'),
                    "quotationType": $this.attr('data-quotationType'),
                    "quotationTypeId": $this.attr('data-quotationTypeId'),
                    "areaType": areaType,
                    "isRtem": $this.attr('data-isRtem'),
                    "quotationRtemId": $this.attr('data-quotationRtemId'),
                    "expres": $this.attr('data-formula'),
                };

                // if (areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                // _quotval["type"] = constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT;
                // }

                quote.addQuoteRtem(_quotval);
                quote.recordHistoryQuotes($this.parents('li.item-blue').clone(true));

                if ($this.attr('data-isRtem') != "1")
                    return true;

                var _rtems = rtems.queryQuotationRtems($this.val());

                $.each(_rtems, function(i, v) {

                    var num = quote.quotationFunctionAreaFormula(v.formula, widget, _quotval["num"]).num;

                    var _quortval = {
                        "discount": v.target.discount,
                        "content": v.target.comment,
                        "itemName": v.target.name,
                        "measurementUnit": v.target.unit.name,
                        "formula": num,
                        "num": num,
                        "qfaiId": null,
                        "quotationItemId": v.target.qiid,
                        "quotationRtemId": "",
                        "subtype": v.target.category.id,
                        "unitPrice": v.target.unitPrice,
                        "addPrice": v.target.addPrice,
                        "subPrice": v.target.subPrice,
                        "workType": v.target.workType.name,
                        "expres": v.target.formula
                    };

                    if (v.type == constant.data().quotationRtem.TYPE_CMPREH_INT && cpWidget.length) {
                        _quortval["quotationFunctionAreaId"] = cpWidget.attr("data-qfaid");
                        _quortval["type"] = quote.quoItemType(v.target.type, cpWidget.attr('data-areaType'));
                        _quortval["areaType"] = constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT;

                        quote.addQuoteRtem(_quortval);
                    }

                    if (v.type == constant.data().quotationRtem.TYPE_GENERRAL_INT) {
                        _quortval["quotationFunctionAreaId"] = widget.attr("data-qfaid");
                        _quortval["type"] = quote.quoItemType(v.target.type, widget.attr('data-areaType'));
                        _quortval["areaType"] = widget.attr('data-areaType');

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

            var cpList = cpWidget.find('.fl-quo-list.list').eq(0);
            var quolist = widget.find('.fl-quo-list.list').eq(0);

            if (v.areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                item = cpList.find('.fl-quo-item.item[data-qiid="' + v.quotationItemId + '"]', cpWidget);
            } else {
                item = quolist.find('.fl-quo-item.item[data-qiid="' + v.quotationItemId + '"]', widget);
            }

            if (item && item.length != 0) {

                if (item.attr('data-control') == 1)
                    return true;

                var oldFormula = item.find('.cell.formula .cell-wrap span').text();
                var oldNum = item.find('.cell.num .cell-wrap .number').text();

                v.qfaiId = item.attr("data-qfaiid");
                v.formula = utils.accAdd(oldFormula, v.formula);
                v.num = utils.accAdd(oldNum, v.num);

                item.find('.cell.formula .cell-wrap span').text(v.formula);
                item.find('.cell.num .cell-wrap .number').text(v.num);

            } else if (v.areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                v.index = cpList.find('.fl-quo-item.item').length + 1;
                item = painter.createQuote(v.index, v).appendTo(cpList);
            } else {
                v.index = quolist.find('.fl-quo-item.item').length + 1;
                item = painter.createQuote(v.index, v).appendTo(quolist);
            }

            var fee = quo.calculateNowQuoteItem(v.num, null, item);

            var args = {
                "quotationFunctionAreaItem.discount": v.discount,
                "quotationFunctionAreaItem.qfaiId": v.qfaiId,
                "quotationFunctionAreaItem.itemName": v.itemName,
                "quotationFunctionAreaItem.measurementUnit": v.measurementUnit,
                "quotationFunctionAreaItem.formula": v.formula,
                "quotationFunctionAreaItem.workType": v.workType,
                "quotationFunctionAreaItem.unitPrice": v.unitPrice,
                "quotationFunctionAreaItem.addPrice": v.addPrice,
                "quotationFunctionAreaItem.subPrice": v.subPrice,
                "quotationFunctionAreaItem.initNum": v.num,
                "quotationFunctionAreaItem.num": v.num,
                "quotationFunctionAreaItem.subtype": v.subtype,
                "quotationFunctionAreaItem.type": v.type,
                "quotationFunctionAreaItem.quotationFunctionAreaId": v.quotationFunctionAreaId,
                "quotationFunctionAreaItem.index": v.index,
                "quotationFunctionAreaItem.quotationItemId": v.quotationItemId,
                "quotationFunctionAreaItem.content": v.content,
            }

            com.post(api.quotation.updateQuotationFunctionAreaItem, $.extend({}, args, quo.basicParams), function(res) {

                com.focusPage('[data-qfaid="' + res.quotationFunctionAreaItem.quotationFunctionAreaId + '"]', '#functionAreaSumList').find('label.no-padding-left').text(fee);
                item.find('input[name="deleteItems"]').val(res.quotationFunctionAreaItem.qfaiId);

                item.attr("data-qfaiid", res.quotationFunctionAreaItem.qfaiId);
                item.find(".icon-arrow-up").removeClass("grey").addClass("green");
                item.find(".icon-arrow-down").removeClass("grey").addClass("red");

                quote.reverseUpdateInnerArea(item);

            }, null, false);
        },

        quoItemType: function(itemType, areaType) {

            var type = 0;

            if (itemType == constant.data().quotationItem.TYPE_CUSTOM_INT) {
                type = constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT;
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_NOT_COUNT_INT) { // 不计
                type = constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT;
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_COST_INT) { // 成本
                type = constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT;
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT) { // 非业绩
                type = constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT;
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_HIDE_INT) { // 隐藏
                type = constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT;
            }

            if ([constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT, constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT].indexOf(parseInt(areaType)) != -1 && itemType == constant.data().quotationItem.TYPE_COST_INT) { // 工程量 && 成本
                type = constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT;
            }

            if ([constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT, constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT].indexOf(parseInt(areaType)) != -1 && itemType == constant.data().quotationItem.TYPE_UNACHE_INT) { // 工程量 && 非业绩
                type = constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT;
            }

            if ([constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT, constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT].indexOf(parseInt(areaType)) != -1 && itemType == constant.data().quotationItem.TYPE_HIDE_INT) { // 工程量 && 隐藏
                type = constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT;
            }

            return type;
        },

        moveAreaItem: function($quote, $movequote, $direction) {

            if (!$quote.find('input[name="deleteItems"]').val() || $quote.attr("data-control") == 1) {
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
            _data["quotationFunctionAreaItems[" + 0 + "].qfaiId"] = $quote.find('input[type="checkbox"]').val();
            _data["quotationFunctionAreaItems[" + 0 + "].index"] = _upline;
            _data["quotationFunctionAreaItems[" + 1 + "].qfaiId"] = $movequote.find('input[type="checkbox"]').val();
            _data["quotationFunctionAreaItems[" + 1 + "].index"] = _nowline;

            var _quotationFunctionArea = {
                "quotationFunctionArea.qfaId": $quote.parents('div.widget-box.transparent').attr('data-qfaid')
            };

            var _params = $.extend({}, _data, _quotationFunctionArea);

            com.post(api.quotation.updateQuotationFunctionAreaItemForIndex, _params);
        },

        checkedExpres: function($item) {

            var expres = $item.attr("data-expres");

            if (!expres)
                return false;

            var qfaiid = $item.attr('data-qfaiid');

            if (!qfaiid)
                return false;

            var $widget = $item.parents('.widget-box');

            var num = quote.quotationFunctionAreaFormula(expres, $widget, 0).num;

            var oldformula = $item.find('.cell.formula .cell-wrap span').text();
            var oldNum = $item.find('.cell.num .cell-wrap .number').text();

            $item.find('.cell.formula .cell-wrap span').text(num);
            $item.find('.cell.num .cell-wrap .number').text(num);

            var $fee = quo.calculateNowQuoteItem(num, null, $item);

            var args = {
                "quotationFunctionAreaItem.qfaiId": qfaiid,
                "quotationFunctionAreaItem.quotationFunctionAreaId": $widget.attr('data-qfaid'),
                "quotationFunctionAreaItem.formula": num,
                "quotationFunctionAreaItem.initNum": num,
                "quotationFunctionAreaItem.num": num,
            };

            var $params = $.extend({}, args, quo.basicParams);

            com.post(api.quotation.updateQuotationFunctionAreaItem, $params, function(res) {

                com.focusPage('[data-qfaid="' + $widget.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text($fee);
                $item.find('.num .icon-circle-arrow-up').hide();

                quote.cacsedeUpdateItem($item);
                quote.cacsedeUpdateCpItem([$item]);
                quo.calculateQuoFeesPost();

                quote.reverseUpdateInnerArea($item);
            });
        },

        quotationFunctionAreaFormula: function(expres, $widget, initNum) {

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

                    "o": quo.houseParams["house.floor"] ? quo.houseParams["house.floor"] : 0, // 楼层
                    "of": quo.houseParams["house.isLift"] ? 0 : 1, // 有无电梯

                    "u": quo.basicParams["quotation.taxPrice"], // 税金
                    "v": quo.basicParams["quotation.managePrice"], // 管理费
                    "x": quo.basicParams["quotation.undisPrice"], // 不打折总额
                    "y": quo.basicParams["quotation.disPrice"], // 打折总额
                    "z": quo.basicParams["quotation.trafficPrice"], // 车运费
                    "w": initNum, // 工程量
                    "k": quo.preferParams["quotationPrefer.quoteArea"], // 计价面积
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

            expres = expres.replace(/\!\s*\(/g, "Math.ceil(");

            var formula = {
                "formula": expres,
                "num": utils.changeThrDecimal(isNaN(eval(expres)) ? 0 : eval(expres))
            }

            return formula;
        },

        // 根据计价面积匹配起报价金额
        obtainQuotePrice: function(produceId, quoteArea, perfer) {

            var presignProduce = null;

            if (produceId == null && quo.preferParams["quotationPrefer.presignProduce.ppid"] != null) {
                produceId = quo.preferParams["quotationPrefer.presignProduce.ppid"];
            } else if (produceId == null) {
                produceId = 0;
            }

            com.post(api.quotation.queryPresignProduceByPpid, {
                "presignProduce.ppid": produceId
            }, function(res) {

                presignProduce = res.presignProduce;
            }, null, false);

            if (presignProduce == null)
                return false;

            presignProduce.quotePrice = 0;

            if (presignProduce && presignProduce.quotePrice) {
                presignProduce.quotePrice = utils.changeThrDecimal(utils.accMul(presignProduce.quotePrice, quoteArea));
            }

            com.post(api.quotation.queryPresignPrice, {
                "presignPrice.ppid": produceId,
                "presignPrice.lowerArea": quoteArea
            }, function(res) {

                if (res.presignPrice && res.presignPrice.price) {
                    presignProduce.quotePrice = res.presignPrice.price;
                }

            }, null, false);

            return quo.quotationPreferControl(presignProduce, perfer);
        },

        // 修改优惠信息
        editQuotePreferArea: function(quoteArea, innerFloor, isLift) {

            if (quo.preferParams["quotationPrefer.presignProduce.ppid"] == 0) {
                quo.preferParams["quotationPrefer.presignProduce.ppid"] = null
            }

            var params = {
                "quotation.qid": quo.quotationid,
                "quotation.totalPrice": quo.basicParams["quotation.totalPrice"],
                "quotation.taxPrice": quo.basicParams["quotation.taxPrice"]
            };

            params = $.extend({}, params, quo.preferParams);

            com.post(api.quotation.updateQuotationPrefer, params, function(res) {

                quo.oldPrefer.quoteArea = quo.preferParams["quotationPrefer.quoteArea"];
                quo.quoModals.$domainPreferModal.modal("hide");
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                quo.oldQuotationPreferData();

                quo.quoModals.$domainPreferModal.modal("hide");

                return false;
            });

            if (quo.defaults == constant.quotation().quotation.DEFAULTS_DEFAULT_INT) {

                com.post(api.data.updateHouse, {
                    "house.hid": quo.decoration.house.hid,
                    "house.innerArea": quoteArea,
                    "house.innerFloor": innerFloor,
                    "house.isLift": isLift
                }, function(res) {

                    com.focusPage('#innerArea').text(quoteArea);
                    quo.houseParams["house.innerFloor"] = innerFloor;
                    quo.houseParams["house.isLift"] = isLift;
                    domain.house = null;
                }, null, false);
            }
        },

        updateQuotationForTime: function() {

            com.post(api.quotation.updateQuotationForTime, {
                "quotation.qid": quo.basicParams["quotation.qid"],
                "quotation.workTime": quo.basicParams["quotation.workTime"],
                "quotation.auditTime": quo.basicParams["quotation.auditTime"]
            }, function() {

            });
        },

        quotationEntryTime: function() {

            if (params.urlLoadParams.type != null && params.quotation.pagingTimeId) {
                clearInterval(params.quotation.pagingTimeId);
                params.quotation.pagingTimeId = null;
            } else if (params.urlLoadParams.type == null && params.quotation.pagesTimeId) {
                clearInterval(params.quotation.pagesTimeId);
                params.quotation.pagesTimeId = null;
            }

            quote.quotationResumeEntryTime();
        },

        quotationResumeEntryTime: function() {

            if (params.urlLoadParams.type != null && params.quotation.attpaging != null) {

                params.quotation.pagingTimeId = setInterval(function() {

                    if (params.quotation.attpaging == "work") {
                        quo.basicParams["quotation.workTime"] += 1;
                    } else if (params.quotation.attpaging == "audi") {
                        quo.basicParams["quotation.auditTime"] += 1;
                    }

                    if ($("#quotationPartPage").length == 0) {
                        clearInterval(params.quotation.pagingTimeId);
                        params.quotation.pagingTimeId = null;
                        quote.updateQuotationForTime();
                    }
                }, 1000);
            }

            if (params.urlLoadParams.type == null && params.quotation.attpages != null) {

                params.quotation.pagesTimeId = setInterval(function() {

                    if (params.quotation.attpages == "work") {
                        quo.basicParams["quotation.workTime"] += 1;
                    } else if (params.quotation.attpages == "audi") {
                        quo.basicParams["quotation.auditTime"] += 1;
                    }

                    if ($("#quotationPart").length == 0) {
                        clearInterval(params.quotation.pagesTimeId);
                        params.quotation.pagesTimeId = null;
                        quote.updateQuotationForTime();
                    }
                }, 1000);
            }

        },

        // 获取升级报价项信息
        queryQuotationRtemForUpgrade: function($line, type) {

            com.focusPage('#upgradeResultList').val("");
            domain.nowEditDomain = $line.parents('.widget-box');

            var qiid = $line.attr("data-qiid");
            quo.quoteItemId = $line.attr("data-qfaiid");

            var _rtems = rtems.queryQuotationRtems(qiid);

            var $tableWrap = com.focusPage('#upgradeResultList').empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (_rtems.length) {
                $.each(_rtems, function(i, v) {

                    if (v.type == type) {
                        var quoteItem = v.target;

                        quoteItem.formula = v.formula;
                        quoteItem.rtemType = v.type;

                        painter.createQuoteModalItem(quoteItem).appendTo($ul);
                    }
                });

                $ul.appendTo($tableWrap);

                if (quote.quotesRecord.length) {
                    $.each(quote.quotesRecord, function(index, val) {

                        var $input = com.focusPage('input[name="modalQuots"][value="' + $(val).val() + '"]');
                        $input.length && ($input.prop('checked', true));
                    });
                }
            }
        },

        // 保存升级报价项
        saveQuotationRtemForUpgrade: function() {

            com.focusPage('#addRtemUpgradeBtn').click(function() {

                quote.addDefaultExtensionItems();

                quo.quoModals.$quotationRtemAddModal.modal("hide");
            });
        },

        // 报价项存在关联扩展项控制
        controlQuoteItems: function(qfaid, qfaiid) {

            var widget = com.focusPage("#functionAreaDetailList").find('.widget-box[data-qfaid="' + qfaid + '"]');

            var quoList = widget.find('.fl-quo-list.list').eq(0);
            var quoItem = quoList.find('.fl-quo-item.item[data-qfaiid="' + qfaiid + '"]');
            var areatype = quoItem.find('.cell.line').attr('data-areatype');

            var extensionAddlist = widget.find('.fl-quo-list.list').eq(1);
            var extensionAddItem = extensionAddlist.find('.fl-quo-item.item[data-qfaiid="' + qfaiid + '"]');
            var extensionSublist = widget.find('.fl-quo-list.list').eq(2);
            var extensionSubItem = extensionSublist.find('.fl-quo-item.item[data-qfaiid="' + qfaiid + '"]');

            if (extensionAddItem.length == 0 && extensionSubItem.length == 0) {
                quoItem.attr("data-control", "0");
                quoItem.find('input[name="deleteItems"]').attr("disabled", null);
                quoItem.find('.icon-remove').removeClass("grey").addClass("pink");
                quoItem.find('.icon-arrow-up').removeClass("grey").addClass("green");
                quoItem.find('.icon-arrow-down').removeClass("grey").addClass("red");
            } else {
                quoItem.attr("data-control", "1");
                quoItem.find('input[name="deleteItems"]').attr("disabled", "disabled");
                quoItem.find('.icon-remove').removeClass("pink").addClass("grey");
                quoItem.find('.icon-arrow-up').removeClass("green").addClass("grey");
                quoItem.find('.icon-arrow-down').removeClass("red").addClass("grey");
            }

            if (areatype == constant.quotation.quotationFunctionArea.TYPE_CMPREH_INT) {
                quoItem.find('input[name="deleteItems"]').attr("disabled", "disabled");
            }
        },

        init: function() {

            this.saveCustomQuotesAdd();
            this.clearQuoteSelected();
            this.calculationNum();
            this.addHistoryQuotes();
            this.quotationEntryTime();
            this.saveQuotationRtemForUpgrade();
        }
    }

    var painter = {

        // 创建功能区
        createdomain: function(dv) {

            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var btnShow = [constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT, constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT].indexOf(dv.type) == -1;

            if (dv.functionAreaOrder == "9998") {
                btnShow = false;
            }
            var _btnSet = {
                "$btnSort": ["根据工种排序", '<i class="bigger-125 icon-sort orange"></i>', dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT],
                "$btnEdit": ["编辑功能区", '<i class="bigger-125 icon-pencil blue"></i>', btnShow],
                "$btnParam": ["功能区参数", '<i class="bigger-125 icon-list-alt green"></i>', btnShow],
                "$btnAdd": ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT],
                "$btnSet": ["自定义报价项", '<i class="bigger-125  icon-plus-sign purple"></i>', btnShow],
                "$btnHistory": ["历史报价项", '<i class="bigger-125 icon-star green"></i>', btnShow],
                "$btnDelQuo": ["批量删除报价项", '<i class="bigger-125 icon-remove pink"></i>', btnShow],
                "$btnCopyDomain": ["复制功能区", '<i class="bigger-125 icon-copy orange"></i>', btnShow],
                "$btnDelDomain": ["删除功能区", '<i class="bigger-125 icon-trash red"></i>', btnShow],
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
            };

            var sum = 0, sumdp = 0, sumd = 0, cost = 0, unache = 0, rtem = 0, comdp = 0, comp = 0, cons = 0, coms = 0;

            $domain = $('<div></div>').addClass('widget-box transparent').attr({
                "data-dlevel": dv.functionAreaOrder,// 排序
                "data-qfaId": dv.qfaId,// 报价项中的功能区ID
                "data-areaType": dv.type, // 类型
                "data-total": dv.total,
            }).css({
                "margin-bottom": "20px"
            });

            if (dv.quotationFunctionAreaParam) {

                $.each(dv.quotationFunctionAreaParam, function(k, v) {

                    $domain.attr("data-" + k, v ? v : "0");
                });
            }

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT || dv.functionAreaOrder == "9998" ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.functionAreaName));
            $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

            $.each(_btnSet, function(k, v) {

                if (!v[2])
                    return true;

                $btns[k] = $('<a></a>').attr({
                    "href": "javascript:void(0)"
                }).css({
                    "padding-left": "5px"
                }).append(v[1]).appendTo($dtoolbar).mouseenter(function() {

                    com.showTip($btns[k], v[0], "top");
                });
            });

            $btns["$btnFold"].attr({
                "data-action": "collapse"
            });

            var _lineSet = [["line", "0"], ["formula", "数量"], ["num", "数量"], ["name", "名称"], ["type", "类型"], ["unit", "单位"], ["worktype", "工种"], ["cell price unitprice", "价格"], ["cell price discountprice", "价格"], ["cell price totalprice-discount", "价格"], ["btns", "功能", {
                "width": "100px"
            }]];

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

            var $extensionAddList = $('<ul></ul>').addClass('fl-quo-list list');

            var $extensionSubList = $('<ul></ul>').addClass('fl-quo-list list');

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            if (dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT) {
                $dbodyInner.append($extensionAddList).appendTo($dbody);
                $dbodyInner.append($extensionSubList).appendTo($dbody);
            }

            $domain.append($dhead).append(dv.type == constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT ? null : $ul).append($dbody);

            var param = dv.quotationFunctionAreaParam ? dv.quotationFunctionAreaParam : {
                "girth": 0,
                "area": 0,
                "height": 0,
                "holeLength": 0,
                "holeHeight": 0,
                "windowLength": 0,
                "windowHeight": 0,
                "beamLength": 0,
                "beamHeight": 0
            };

            if (dv.quotationFunctionAreaItems.length) {

                // 功能区中的报价项
                var _items = dv.quotationFunctionAreaItems;

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

                    v.formula = v.formula ? v.formula : "0";

                    if (v.formula.indexOf("{") != -1 || v.formula.indexOf("}") != -1) {
                        v.formula = com.format(v.formula, {
                            "a": param.girth,
                            "b": param.area,
                            "c": param.height,
                            "d": param.holeLength,
                            "e": param.holeHeight,
                            "f": param.windowLength,
                            "g": param.windowHeight,
                            "h": param.beamLength,
                            "i": param.beamHeight,

                            "o": quo.houseParams["house.floor"] ? quo.houseParams["house.floor"] : 0, // 楼层
                            "of": quo.houseParams["house.isLift"] ? 0 : 1, // 有无电梯

                            "u": com.focusPage('#taxCost').find('.num .cell-wrap').text(),// 税金
                            "v": com.focusPage('#manageCost').find('.num .cell-wrap').text(),// 管理费
                            "x": com.focusPage('#undisPrice').text(),// 不打折总额
                            "y": com.focusPage('#disPrice').text(),// 打折总额
                            "z": com.focusPage('#conveyanceCost').find('.num .cell-wrap').text(),// 车运费
                            "k": quo.preferParams["quotationPrefer.quoteArea"], // 计价面积
                            "j": 0
                        });
                    }

                    if (v.formula.indexOf('~') != -1) {

                        v.formula = v.formula.split('~')[1];
                    }

                    if (v.formula.indexOf('|') != -1) {

                        var _pre = v.formula.split('|')[0];
                        var _nex = v.formula.split('|')[1];

                        v.formula = "Math.max(" + _pre + ", " + _nex + ")";
                    }

                    v.formula = v.formula.replace(/\!\s*\(/g, "Math.ceil(");

                    v.formula = v.qfaiId != null ? v.formula : utils.changeThrDecimal(isNaN(eval(v.formula)) ? 0 : eval(v.formula));
                    v.num = utils.changeThrDecimal(isNaN(eval(v.formula)) ? 0 : eval(v.formula));

                    var $item = that.createQuote(i + 1, v).appendTo($list);

                    if (v.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || v.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || v.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT) {
                        sumd = utils.accAdd(sumd, parseFloat($item.find('.totalprice-discount .cell-wrap').text()));
                        sum = utils.accAdd(sum, parseFloat($item.attr('data-undisPrice')));
                        sumdp = utils.accAdd(sumdp, parseFloat($item.attr('data-disPrice')));
                        cons = utils.accAdd(cons, parseFloat($item.attr('data-consPrice')));
                        coms = utils.accAdd(coms, parseFloat($item.attr('data-comsPrice')));
                    }

                    if (v.type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT) {
                        cost = utils.accAdd(cost, parseFloat($item.attr('data-costPrice')));
                        cons = utils.accAdd(cons, parseFloat($item.attr('data-consPrice')));
                        coms = utils.accAdd(coms, parseFloat($item.attr('data-comsPrice')));
                    }

                    if (v.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT) {

                        sumd = utils.accAdd(sumd, parseFloat($item.find('.totalprice-discount .cell-wrap').text()));
                        sum = utils.accAdd(sum, parseFloat($item.attr('data-undisPrice')));
                        sumdp = utils.accAdd(sumdp, parseFloat($item.attr('data-disPrice')));
                        cons = utils.accAdd(cons, parseFloat($item.attr('data-consPrice')));
                        coms = utils.accAdd(coms, parseFloat($item.attr('data-comsPrice')));

                        unache = utils.accAdd(unache, parseFloat($item.attr('data-unachePrice')));
                    }

                    if (v.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) {
                        rtem = utils.accAdd(rtem, parseFloat($item.attr('data-rtemPrice')));
                        comdp = utils.accAdd(comdp, parseFloat($item.attr('data-undisComPrice')));
                        comp = utils.accAdd(comp, parseFloat($item.attr('data-disComPrice')));
                    }
                });
            }

            if (dv.type == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) { // 总额功能区
                sum = dv.total;
                sumdp = 0;
                sumd = dv.total;
                cost = 0;
                unache = 0;
            }

            if (dv.type == constant.quotation().quotationFunctionArea.TYPE_COST_INT) { // 成本功能区
                sum = 0;
                sumdp = 0;
                sumd = 0;

                cost = sumd;
                unache = 0;
            }

            if (dv.type == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT) { // 非业绩功能区
                cost = 0;
                unache = sumd;
            }

            if (dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT) {
                $btns.$btnAdd.click(function() {// 添加工程报价项

                    domain.nowEditDomain = $domain;
                    domain.pageQuotationItemForPrice();
                    quo.quoModals.$quoteModal.modal("show");
                    com.focusPage('#addItemFunctionAreaIndex').val(dv.qfaId);
                });
                $btns.$btnSort.click(function() {// 功能区按照工种排序

                    domain.sortFunctionAreaItem($domain);
                });
            }

            if (dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT && dv.functionAreaOrder != "9998") { // 管理区类型之外

                $btns.$btnEdit.click(function() {// 编辑功能区
                    domain.editDomain(dv.qfaId);
                });
                $btns.$btnParam.click(function() {// 功能区参数
                    domain.editDomainParam(dv.qfaId);
                });
                $btns.$btnSet.click(function() {// 自定义报价项

                    domain.nowEditDomain = $domain;
                    quo.quoModals.$quoteAddModal.modal("show");
                });
                $btns.$btnHistory.click(function() {// 历史报价项

                    domain.nowEditDomain = $domain;
                    quo.quoModals.$historyModal.modal("show");
                });
                $btns.$btnDelQuo.click(function() {// 批量删除报价项

                    quote.deleteQuoteInBatches($domain);
                });
                $btns.$btnCopyDomain.click(function() {// 复制功能区

                    domain.copyDomain($domain);
                });
                $btns.$btnDelDomain.click(function() {// 删除功能区

                    domain.nowEditDomain = $domain;
                    domain.deletDomain($domain);
                });
            }

            $domain.attr('data-desTotalprice', utils.changeThrDecimal(sumd));
            $domain.attr('data-disPrice', utils.changeThrDecimal(sumdp));
            $domain.attr('data-undisPrice', utils.changeThrDecimal(sum));
            $domain.attr('data-costPrice', utils.changeThrDecimal(cost));
            $domain.attr('data-unachePrice', utils.changeThrDecimal(unache));
            $domain.attr('data-rtemPrice', utils.changeThrDecimal(rtem));
            $domain.attr('data-undisComPrice', utils.changeThrDecimal(comdp));
            $domain.attr('data-disComPrice', utils.changeThrDecimal(comp));
            $domain.attr('data-consPrice', utils.changeThrDecimal(cons));
            $domain.attr('data-comsPrice', utils.changeThrDecimal(coms));

            return $domain;
        },

        // 创建报价项
        createQuote: function(linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content);

            var discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);

            var _dcp = 0;
            var _num = qv.num;
            var _unitPrice = qv.unitPrice;
            var _type = qv.type;
            var _areaType = qv.areaType;

            var _class = [1].indexOf(qv.discount) != -1 ? "blue" : "green"; // 打折标识 , 名称样式不同

            var _typeName = "-";

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || _areaType == constant.quotation().quotationFunctionArea.TYPE_HIDE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT) {
                _typeName = "标准";
                _dcp = _unitPrice;
            }

            if (_type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT) { // 自定义
                _dcp = _unitPrice;
                _typeName = "自定义";
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_TRAFFIC_INT) { // 车运费
                _dcp = _unitPrice;
                _typeName = "管理";
                _num = 1;
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_MANAGE_INT) { // 管理费 , 单价+非业务人员提点

                _dcp = utils.changeThrDecimal(utils.accAdd(_unitPrice, (quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0));
                _typeName = "管理";
                _num = 1;
            }

            if (_areaType == constant.quotation().quotationFunctionArea.TYPE_COST_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT) { // 成本
                _dcp = _unitPrice;
                _typeName = "标准"; // 成本
            }

            if (_areaType == constant.quotation().quotationFunctionArea.TYPE_NOT_COUNT_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT) { // 不计算
                _dcp = 0;
                _typeName = "不计";
            }

            if (_areaType == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT) {
                _dcp = _unitPrice;
                _typeName = "标准"; // 非业绩
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_TAX_INT) {
                _dcp = _unitPrice;
                _typeName = "管理";
                _num = 1;
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) {
                _dcp = _unitPrice;
                _typeName = "综合";
            }

            var _lineSet = [];
            _lineSet.push(["line", linenum, ["data-areaType", qv.areaType]]); // 编号
            _lineSet.push(_areaType == constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT ? "" : ["formula", qv.formula ? qv.formula : "0"]); // 数量/公式
            _lineSet.push(["num", "<span class='number'>" + _num + "</span>", ["data-subtype", qv.subtype]]); // 数量
            _lineSet.push(["name " + _class, qv.itemName, ["data-qfaId", qv.quotationFunctionAreaId]]); // 报价名
            _lineSet.push(["type", _typeName, ["data-type", qv.type]], ["unit", qv.measurementUnit]); // 工种
            _lineSet.push(["worktype", qv.workType]); // 工种
            _lineSet.push(["price unitprice", _dcp, ["data-unitprice", qv.unitPrice]]); // 单价
            _lineSet.push(["price discountprice", _dcp, ["data-discount", qv.discount]]); // 折扣价
            _lineSet.push(["price totalprice-discount", utils.changeThrDecimal(utils.accMul(_num, _dcp))]); // 总价

            var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel, $btnInfo, $btnset, $up, $down, $btnExpres;

            $.each(_lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]);
                var $cellWrap = $('<div></div>').addClass('cell-wrap').append($("<span></span>").html(v[1]));

                if (v[2]) {
                    $cell.attr(v[2][0], v[2][1]);
                }

                if (v[0] == "num" && qv.expres) {

                    var $update = $('<i class="icon-circle-arrow-up blue" style=" display: none; padding-left: 3px; cursor: pointer"></i>');

                    $cellWrap.append($update);

                    $update.click(function() {

                        quote.checkedExpres($item);
                    });
                }

                if (v[0] == "name " + _class && [constant.quotation().quotationFunctionAreaItem.TYPE_TRAFFIC_INT, constant.quotation().quotationFunctionAreaItem.TYPE_MANAGE_INT, constant.quotation().quotationFunctionAreaItem.TYPE_TAX_INT].indexOf(qv.type) == -1) {

                    var $upgrade = $('<i class="bigger-125 icon-double-angle-up blue" style="padding-right: 5px;"></i>');
                    var $downgrade = $('<i class="bigger-125 icon-double-angle-down red" style="padding-left: 5px;"></i>');

                    $upgrade.click(function() {

                        quote.queryQuotationRtemForUpgrade($item, constant.data().quotationRtem.TYPE_UPGRADE_INT);
                        quo.quoModals.$quotationRtemAddModal.modal("show");
                    })

                    $downgrade.click(function() {

                        quote.queryQuotationRtemForUpgrade($item, constant.data().quotationRtem.TYPE_DOWNGRADE_INT);
                        quo.quoModals.$quotationRtemAddModal.modal("show");
                    })

                    $cellWrap.prepend($upgrade).append($downgrade);
                }

                $cell.append($cellWrap).appendTo($item);
            });

            // 报价类型为标准跟自定义
            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) {

                $btnCell = $('<div></div>').addClass('cell btns');
                $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                $inputLable = $('<label></label>');
                $input = $('<input>').addClass('cbox ace').attr({
                    "type": "checkbox",
                    "role": "checkbox",
                    "name": "deleteItems",
                    "data-qiid": qv.quotationItemId ? qv.quotationItemId : "",
                    "disabled": qv.areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT ? "disabled" : null
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

                $btnCellWrap.append($btnDel).append($btnInfo).append($up).append($down);

                if (qv.qfaiId) {
                    $up.find("i").addClass("green"), $down.find("i").addClass("red")
                } else {
                    $up.find("i").addClass("grey"), $down.find("i").addClass("grey")
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

                    qv.content && com.showTip(this, qv.content, 'left');
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

            } else {
                if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_TRAFFIC_INT) { // 车运费
                    $item.attr('id', 'conveyanceCost');
                    $btnCell = $('<div></div>').addClass('cell btns');
                    $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                    $btnset = $('<a></a>').css('visibility', 'hidden').append('<i class="bigger-125 icon-cog purple"></i>');
                    $btnCellWrap.append($btnset).appendTo($btnCell);
                    $item.append($btnCell);
                }
                if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_MANAGE_INT) {
                    $item.attr('id', 'manageCost').attr('qfaiId', qv.qfaiId);// 管理费
                    $btnCell = $('<div></div>').addClass('cell btns');
                    $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                    $btnset = $('<a></a>').attr('href', 'javascript:void(0)').append('<i class="bigger-125 icon-cog purple"></i>').mouseenter(function() {

                        com.showTip(this, "管理费设置", "top");
                    });
                    $btnCellWrap.append($btnset).appendTo($btnCell);
                    $item.append($btnCell);

                    $btnset.click(function() {

                        com.focusPage('#manageRateModal').modal('show');
                    });
                }
                if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_TAX_INT) {
                    $item.attr('id', 'taxCost').attr('qfaiId', qv.qfaiId);
                    $btnCell = $('<div></div>').addClass('cell btns');
                    $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                    $btnset = $('<a></a>').attr('href', 'javascript:void(0)')
                        .append('<i class="bigger-125 icon-cog purple"></i>')
                        .mouseenter(function() {
                            com.showTip(this, "税金类型设置", "top");
                        });
                    $btnCellWrap.append($btnset).appendTo($btnCell);
                    $item.append($btnCell);

                    $btnset.click(function() {
                        com.focusPage('#taxRateModal').modal('show');
                    });
                }
            }

            $item.attr('data-areaItem', "quotationItem");
            $item.attr('data-expres', (qv.expres && qv.expres != "") ? qv.expres : "");
            $item.attr('data-qfaiid', qv.qfaiId);
            $item.attr('data-qiid', qv.quotationItemId);
            $item.attr('data-addPrice', qv.addPrice);
            $item.attr('data-subPrice', qv.subPrice);
            $item.attr('data-isRtem', qv.isRtem == 1 ? 1 : 0);
            $item.attr('data-qrid', qv.quotationRtemId);
            $item.attr('data-count-num', qv.num);
            $item.attr('data-control', "0");

            $item.attr('data-undisPrice', qv.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT && (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-disPrice', qv.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT && (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-costPrice', qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-unachePrice', qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT ? utils.changeThrDecimal(utils.accMul(qv.num, utils.accMul(qv.unitPrice, qv.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT ? 1 : discount))) : 0);
            $item.attr('data-rtemPrice', qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-undisComPrice', qv.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT && qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-disComPrice', qv.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT && qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-consPrice', qv.subtype == constant.quotation().quotationFunctionAreaItem.SUBTYPE_PROJECT_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);
            $item.attr('data-comsPrice', qv.subtype != constant.quotation().quotationFunctionAreaItem.SUBTYPE_PROJECT_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);

            return $item;
        },

        // 创建扩展项
        createExtensionItem: function(linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content);

            var discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);

            var _num = qv.num;
            var _unitPrice = qv.unitPrice;

            var _class = [1].indexOf(qv.discount) != -1 ? "blue" : "green"; // 打折标识 , 名称样式不同

            var _typeName = "-";

            if (qv.type == constant.quotation().extension.TYPE_ADD_INT) {
                _typeName = "升级";
            }

            if (qv.type == constant.quotation().extension.TYPE_SUB_INT) {
                _typeName = "降级";
            }

            var _lineSet = [];
            _lineSet.push(["line", linenum]); // 编号
            _lineSet.push(["formula", qv.num]); // 数量
            _lineSet.push(["num", "<span class='number'>" + _num + "</span>"]); // 数量
            _lineSet.push(["name " + _class, qv.itemName]); // 报价名
            _lineSet.push(["type", _typeName]); // 单位
            _lineSet.push(["unit", qv.measurementUnit]); // 单位
            _lineSet.push(["worktype", qv.workType]); // 工种
            _lineSet.push(["price unitprice", _num, ["data-unitprice", qv.unitPrice]]); // 单价
            _lineSet.push(["price discountprice", _num, ["data-discount", qv.discount]]); // 折扣价
            _lineSet.push(["price totalprice-discount", utils.changeThrDecimal(utils.accMul(_num, _unitPrice))]); // 总价

            $.each(_lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]);
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);

                if (v[2]) {
                    $cell.attr(v[2][0], v[2][1]);
                }

                $cell.append($cellWrap);
                $cell.appendTo($item);
            });

            var $btnCell = $('<div></div>').addClass('cell btns');
            var $btnCellWrap = $('<div></div>').addClass('cell-wrap');
            var $inputLable = $('<label></label>');
            var $input = $('<input>').addClass('cbox ace').attr({
                "type": "checkbox",
                "role": "checkbox",
                "name": "deleteItems",
                "disabled": "disabled"
            }).val(qv.qfaiId);
            var $ispan = $('<span></span>').addClass('lbl align-top');

            $inputLable.append($input).append($ispan);
            $btnCellWrap.append($inputLable).appendTo($btnCell);
            $item.append($btnCell);

            var $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-remove pink"></i>');

            var $btnInfo = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-search grey"></i>');

            var $up = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-arrow-up grey"></i>');

            var $down = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-arrow-down grey"></i>');

            $btnCellWrap.append($btnDel).append($btnInfo).append($up).append($down);

            // 各种绑定事件
            $item.click(function() {// 编辑数量

                quote.getNumCellFocus($item);
            });

            $btnDel.click(function() {// 删除扩展项

                quote.deleteExtensionItem($item);
            })

            $item.attr('data-areaItem', "extensionItem");
            $item.attr('data-eid', qv.eid);
            $item.attr('data-eiid', qv.eiid);
            $item.attr('data-qfaid', qv.quotationFunctionAreaId);
            $item.attr('data-qfaiid', qv.quoteItemId);
            $item.attr('data-qiid', qv.qiid);
            $item.attr('data-subtype', qv.subtype);
            $item.attr('data-workType', qv.workType);
            $item.attr('data-type', qv.type);
            $item.attr('data-content', qv.content);

            $item.attr('data-addPrice', qv.addPrice);
            $item.attr('data-subPrice', qv.subPrice);

            return $item;
        },

        // 创建添加功能区中的功能区
        createDomainTemplete: function(v) {

            var $div = $('<div></div>').addClass('functionAreaItem');

            var $item = $('<div></div>').addClass('col-xs-2').appendTo($div);

            var $label = $('<label></label>').appendTo($item);
            var $radio = $('<input>').addClass('ace').attr({
                "name": "quotempl",
                "type": "checkbox"
            }).val(v.faid).appendTo($label);
            var $span = $('<span></span>').addClass('lbl').text(v.name).appendTo($label);

            var $params = $('<div></div>').addClass('col-xs-10 params').css("display", "none").appendTo($div);

            var ainput = $('<input></input>').addClass("col-xs-1 a").attr({
                "type": "text",
                "placeholder": "周长",
                "name": "quoteparam",
                "param": "girth",
                "parama": "a"
            }).appendTo($params);
            var binput = $('<input></input>').addClass("col-xs-1 b").attr({
                "type": "text",
                "placeholder": "面积",
                "name": "quoteparam",
                "param": "area",
                "parama": "b"
            }).appendTo($params);
            var cinput = $('<input></input>').addClass("col-xs-1 c").attr({
                "type": "text",
                "placeholder": "举架",
                "name": "quoteparam",
                "param": "height",
                "parama": "c"
            }).appendTo($params);
            var dinput = $('<input></input>').addClass("col-xs-1 d").attr({
                "type": "text",
                "placeholder": "洞面",
                "name": "quoteparam",
                "param": "holeLength",
                "parama": "d"
            }).appendTo($params);
            var finput = $('<input></input>').addClass("col-xs-1 f").attr({
                "type": "text",
                "placeholder": "窗面",
                "name": "quoteparam",
                "param": "windowLength",
                "parama": "f"
            }).appendTo($params);
            var hinput = $('<input></input>').addClass("col-xs-1 h").attr({
                "type": "text",
                "placeholder": "梁长",
                "name": "quoteparam",
                "param": "beamLength",
                "parama": "h"
            }).appendTo($params);
            var iinput = $('<input></input>').addClass("col-xs-1 i").attr({
                "type": "text",
                "placeholder": "粱高",
                "name": "quoteparam",
                "param": "beamHeight",
                "parama": "i"
            }).appendTo($params);
            var einput = $('<input></input>').addClass("col-xs-1 e").attr({
                "type": "text",
                "placeholder": "参数",
                "name": "quoteparam",
                "param": "holeHeight",
                "parama": "e"
            }).appendTo($params);
            var ginput = $('<input></input>').addClass("col-xs-1 g").attr({
                "type": "text",
                "placeholder": "变量",
                "name": "quoteparam",
                "param": "windowHeight",
                "parama": "g"
            }).appendTo($params);

            return $div;
        },

        // 创建添加报价项天窗中的报价项
        createQuoteModalItem: function(v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({
                "margin-bottom": 0
            });

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
                "data-quotationType": v.category.name,
                "data-quotationTypeId": v.category.id,
                "data-quotationClassification": v.classification.name,
                "data-workType": v.workType ? v.workType.name : "-",
                "data-des": v.comment,
                "data-formula": v.formula,
                "data-isRtem": v.isRtem,
                "data-quotationRtemId": v.rtemFlag,
                "data-rtemType": v.rtemType ? v.rtemType : ""
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

            var $item = $('<div></div>');
            var $dwrap = $('<label></label>').addClass('col-md-6 no-padding-right');
            var $dorder = $('<span class="order"></span>').text(v.functionAreaOrder);// 功能区排序
            var $dname = $('<span class="name"></span>').text(v.functionAreaName);// 功能区名字
            var $dsum = $('<label></label>').addClass('col-md-6 no-padding-left').text(sum);// 折扣价

            if (v.functionAreaOrder == "9998") {
                $dwrap.append($dname);
            } else {
                $dwrap.append($dorder).append("|").append($dname);
            }

            $item.attr("data-qfaId", v.qfaId).append($dwrap).append($dsum);// 存入功能区ID

            return $item;
        },

        updateQuotePrice: function(updateTime) {

            quo.quoModals.$updatePriceModal.modal("hide");

            com.showConfirm("更新价格需要重新进到页面编辑, 是否进行当前操作", function(result) {

                com.post(api.quotation.updateQuotationForPrice, {
                    "quotation.qid": quo.quotationid,
                    "quotation.updateTime": updateTime
                }, function(res) {

                    com.switchPage(api.index.quotationIndex.url);

                });

            });
        }
    }

    return {
        init: function() {

            quo.orderid = params.quotation.orderId;
            quo.quotationid = params.quotation.quotation.qid;
            quo.versionId = params.quotation.quotation.version.no;

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": quo.orderid
            }, function(res) {

                com.focusPage('#orderId').text(res.decoration.orderId);
                com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
                com.focusPage('#mileage').text(res.decoration.house.village.mileage);
                com.focusPage('#innerArea').text(res.decoration.house.innerArea);

                quo.decoration = res.decoration;

                quo.decorationType = res.decoration.type;
                quo.precontractTime = res.decoration.precontractTime;

                quo.notSalesmanRate = res.decoration.notSalesmanRate ? res.decoration.notSalesmanRate : 0; // 非业务人员提点比例

                var house = res.decoration.house;
                quo.houseParams = {
                    "house.hid": house.hid, // 房产ID
                    "house.floor": house.floor, // 楼层
                    "house.innerFloor": house.innerFloor, // 计价楼层
                    "house.isLift": house.isLift, // 有无电梯
                }
            }, null, false);

            // 管理费选择弹层初始化
            com.post(api.quotation.queryQuotationForConfig, {}, function(res) {

                // 将管理费取出 放入select标签中(下拉框)
                com.focusPage('#manageRate').bindData(res.configs.manageRates);
            });

            // 税金类型选择弹层初始化
            com.focusPage('#taxType').bindData(constant.data().quotationVersion.taxDiscount.datas, 'key', 'value', false);

            // 根据报价ID 获取报价信息(同步ajax)
            com.post(api.quotation.queryQuotationById, {
                "quotation.qid": quo.quotationid
            }, function(data) {

                var quotation = data.quotation;

                quo.defaults = quotation.defaults;

                // 将报价数据获取到全局变量中
                quo.basicParams = {
                    "quotation.qid": quotation.qid,// 报价Id
                    "quotation.basePrice": quotation.basePrice, // 基数
                    "quotation.discount": quotation.discount, // 报价折扣
                    "quotation.totalPrice": quotation.totalPrice, // 报价总额
                    "quotation.manageRate": quotation.manageRate, // 管理费比例
                    "quotation.managePrice": quotation.managePrice, // 管理费
                    "quotation.trafficPrice": quotation.trafficPrice, // 车运费
                    "quotation.taxPrice": quotation.taxPrice, // 税金
                    "quotation.taxRate": quotation.taxRate, // 税金比例
                    "quotation.taxDiscount": quotation.taxDiscount, // 税金类型
                    "quotation.undisComPrice": quotation.undisComPrice, // 综合不打折总额
                    "quotation.disComPrice": quotation.disComPrice, // 综合打折总额
                    "quotation.consPrice": quotation.consPrice, // 工程总额
                    "quotation.comsPrice": quotation.comsPrice, // 主材总额
                    "quotation.updateTime": quotation.updateTime,
                    "quotation.workTime": quotation.workTime,
                    "quotation.auditTime": quotation.auditTime
                };

                com.focusPage('#quotationName').text(quotation.quotationName); // 左上角显示报价名称
                com.focusPage('#basePrice').text(quotation.basePrice);
                com.focusPage('#sumLabDiscount').text(quotation.discount); // 左上角显示的折扣
            }, null, false);

            com.post(api.quotation.queryQuotationPrefer, {
                "quotationPrefer.qid": quo.quotationid
            }, function(res) {

                var quotationPrefer = res.quotationPrefer

                quo.preferParams = {
                    "quotationPrefer.qid": quotationPrefer.qid,
                    "quotationPrefer.qpid": quotationPrefer.qpid,
                    "quotationPrefer.presignProduce.ppid": quotationPrefer.presignProduce && quotationPrefer.presignProduce.ppid ? quotationPrefer.presignProduce.ppid : 0,
                    "quotationPrefer.preferPrice": quotationPrefer.preferPrice ? quotationPrefer.preferPrice : 0,
                    "quotationPrefer.managePrefer": quotationPrefer.managePrefer ? quotationPrefer.managePrefer : 0,
                    "quotationPrefer.advancePrefer": quotationPrefer.advancePrefer ? quotationPrefer.advancePrefer : 0,
                    "quotationPrefer.discount": quotationPrefer.discount ? quotationPrefer.discount : 0,
                    "quotationPrefer.manageDiscount": quotationPrefer.manageDiscount ? quotationPrefer.manageDiscount : 0,
                    "quotationPrefer.quotePrice": quotationPrefer.quotePrice ? quotationPrefer.quotePrice : 0,
                    "quotationPrefer.quoteArea": quotationPrefer.quoteArea ? quotationPrefer.quoteArea : 0,
                    "quotationPrefer.activityPrice": quotationPrefer.activityPrice ? quotationPrefer.activityPrice : 0,
                    "quotationPrefer.activityProfit": quotationPrefer.activityProfit ? quotationPrefer.activityProfit : 0,
                }

                quo.quotationPrefer = quotationPrefer;

                quo.oldPrefer.quoteArea = quo.preferParams["quotationPrefer.quoteArea"];
                com.focusPage('#presentPrefer').val(quotationPrefer.presignProduce && quotationPrefer.presignProduce.name ? quotationPrefer.presignProduce.name : "无");
            }, null, false);

            com.post(api.quotation.queryPresignProduce, {}, function(res) {

                com.focusPage('#produce').bindData(res.presignProduces, "ppid", "name", "请选择");
            }, null, false);

            com.post(api.quotation.queryProtationForDefaultByOrderId, {
                "protation.orderId": quo.orderid
            }, function(res) {

                if (!res.protation.pid)
                    return false;

                quo.protation = res.protation;

                var _discountValue = utils.changeThrDecimal(utils.accDiv(utils.accSub(quo.protation.quotePrice, quo.protation.preferPrice), quo.protation.quotePrice));
                var _manageDiscountValue = utils.changeThrDecimal(utils.accDiv(utils.accSub(quo.protation.managePrice, quo.protation.manageProfit), quo.protation.managePrice));

                if (_discountValue == 1)
                    com.focusPage('#prefer').attr("disabled", "disabled");

                if (_manageDiscountValue == 1)
                    com.focusPage('#manage').attr("disabled", "disabled");

            }, null, false);

            com.post(api.approval.queryApproverByType, {
                "approver.type": 22
            }, function(res) {

                $.each(res.approvers, function(i, v) {

                    var comment = v.comment == null ? "" : v.comment;

                    var approveManSel = com.focusPage("#approveManSel", "#approveModal");
                    var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px").appendTo(approveManSel);
                    var $approvaler = $('<label></label>').appendTo($div);

                    var $input = $('<input>').attr({
                        "type": "radio",
                        "name": "form-field-radio",
                        "class": "ace",
                        "uid": v.userBase.uid,
                        "userId": v.userBase.userId
                    }).appendTo($approvaler);

                    var $span = $('<span></span>').addClass('lbl').appendTo($approvaler);
                    var $name = $('<label></label>').attr('style', 'margin-left:10px;').text(v.userBase.currentName).appendTo($span);

                    var $comment = $('<span></span>').addClass("lbl").text(comment).attr("style", "margin-left:15px").appendTo($approvaler);
                });
            }, null, false);

            // 获取工种
            com.post(api.common.queryWorkType, {}, function(res) {

                quo.workTypes = res.workTypes;
            }, null, false);

            com.focusPage("#isLift").bindData(constant.building().buildingHouse.elevator.datas, "key", "value");

            // 通过报价ID获取报价项中的功能区
            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {
                "quotation.qid": quo.quotationid
            }, function(data) {

                var _discount = utils.accDiv(quo.basicParams['quotation.discount'], 10); // 将整数折扣换算为小数点(解决浮点数计算BUG)
                var _undisPrice = 0, _disPrice = 0, _costPrice = 0, _unachePrice = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _taxfee = 0, _quotePrice, _rtemPrice = 0, _consPrice = 0, _comsPrice = 0, _undisComPrice = 0, _disComPrice = 0;

                if (data.quotationFunctionAreas.length) {
                    // 报价中的功能区
                    $.each(data.quotationFunctionAreas, function(i, v) {

                        var sum = 0, sumdp = 0, sumd = 0, cost = 0, unache = 0, rtem = 0, comdp = 0, comp = 0, cons = 0, coms = 0;
                        var $domain = painter.createdomain(v).appendTo(com.focusPage('#functionAreaDetailList'));

                        if (v.type == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT) { // 工程量

                            sum = parseFloat($domain.attr('data-undisPrice'));// 功能区非打折项总价
                            sumdp = parseFloat($domain.attr('data-disPrice'));// 功能区打折项折前总价
                            sumd = parseFloat($domain.attr('data-desTotalprice'));// 功能区折后总价
                            cost = parseFloat($domain.attr('data-costPrice'));
                            unache = parseFloat($domain.attr('data-unachePrice'));
                            cons = parseFloat($domain.attr('data-consPrice'));
                            coms = parseFloat($domain.attr('data-comsPrice'));

                            painter.createDomainMoney(utils.changeThrDecimal(sumd), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _disPrice = utils.accAdd(_disPrice, sumdp); // 功能区打折项总价相加
                            _undisPrice = utils.accAdd(_undisPrice, sum); // 功能区非打折项总价相加
                            _dtotalfee = utils.accAdd(_dtotalfee, sumd); // 功能区折后总价相加
                            _costPrice = utils.accAdd(_costPrice, cost);
                            _unachePrice = utils.accAdd(_unachePrice, unache);
                            _consPrice = utils.accAdd(_consPrice, cons);
                            _comsPrice = utils.accAdd(_comsPrice, coms);
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) { // 总额

                            cons = parseFloat($domain.attr('data-consPrice'));
                            coms = parseFloat($domain.attr('data-comsPrice'));

                            painter.createDomainMoney(v.total, v).appendTo(com.focusPage('#functionAreaSumList'));

                            _undisPrice = utils.accAdd(_undisPrice, v.total); // 功能区非打折项总价相加
                            _dtotalfee = utils.accAdd(_dtotalfee, v.total); // 功能区折后总价相加
                            _consPrice = utils.accAdd(_consPrice, cons);
                            _comsPrice = utils.accAdd(_comsPrice, coms);
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_NOT_COUNT_INT) { // 不计算
                            painter.createDomainMoney(0, v).appendTo(com.focusPage('#functionAreaSumList'));
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_COST_INT) {

                            sum = parseFloat($domain.attr('data-undisPrice'));// 功能区非打折项总价
                            cons = parseFloat($domain.attr('data-consPrice'));
                            coms = parseFloat($domain.attr('data-comsPrice'));

                            painter.createDomainMoney(utils.changeThrDecimal(sum), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _costPrice = utils.accAdd(_costPrice, sum);
                            _consPrice = utils.accAdd(_consPrice, cons);
                            _comsPrice = utils.accAdd(_comsPrice, coms);
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT) {

                            sum = parseFloat($domain.attr('data-undisPrice'));// 功能区非打折项总价
                            sumdp = parseFloat($domain.attr('data-disPrice'));// 功能区打折项折前总价
                            sumd = parseFloat($domain.attr('data-desTotalprice'));// 功能区折后总价
                            cons = parseFloat($domain.attr('data-consPrice'));
                            coms = parseFloat($domain.attr('data-comsPrice'));

                            painter.createDomainMoney(utils.changeThrDecimal(sumd), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _disPrice = utils.accAdd(_disPrice, sumdp); // 功能区打折项总价相加
                            _undisPrice = utils.accAdd(_undisPrice, sum); // 功能区非打折项总价相加
                            _dtotalfee = utils.accAdd(_dtotalfee, sumd); // 功能区折后总价相加
                            _unachePrice = utils.accAdd(_unachePrice, sumd);
                            _consPrice = utils.accAdd(_consPrice, cons);
                            _comsPrice = utils.accAdd(_comsPrice, coms);
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                            sum = parseFloat($domain.attr('data-undisPrice'));
                            sumdp = parseFloat($domain.attr('data-disPrice'));
                            sumd = parseFloat($domain.attr('data-desTotalprice'));
                            cost = parseFloat($domain.attr('data-costPrice'));
                            unache = parseFloat($domain.attr('data-unachePrice'));
                            rtem = parseFloat($domain.attr('data-rtemPrice'));
                            comdp = parseFloat($domain.attr('data-undisComPrice'));
                            comp = parseFloat($domain.attr('data-disComPrice'));
                            cons = parseFloat($domain.attr('data-consPrice'));
                            coms = parseFloat($domain.attr('data-comsPrice'));

                            painter.createDomainMoney(utils.changeThrDecimal(sumd), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _disPrice = utils.accAdd(_disPrice, sumdp);
                            _undisPrice = utils.accAdd(_undisPrice, sum);
                            _dtotalfee = utils.accAdd(_dtotalfee, sumd);
                            _costPrice = utils.accAdd(_costPrice, cost);
                            _unachePrice = utils.accAdd(_unachePrice, unache);
                            _rtemPrice = utils.accAdd(_rtemPrice, rtem);
                            _undisComPrice = utils.accAdd(_undisComPrice, comdp);
                            _disComPrice = utils.accAdd(_disComPrice, comp);
                            _consPrice = utils.accAdd(_consPrice, cons);
                            _comsPrice = utils.accAdd(_comsPrice, coms);
                        }
                    });

                    var manageCost = com.focusPage('#manageCost'); // 管理费
                    var converyanceCost = com.focusPage('#conveyanceCost'); // 车运费
                    var taxCost = com.focusPage('#taxCost'); // 税金

                    var preferPrice = quo.preferParams["quotationPrefer.preferPrice"];
                    var managePrefer = quo.preferParams["quotationPrefer.managePrefer"];
                    var advancePrefer = quo.preferParams["quotationPrefer.advancePrefer"];
                    var quotePrice = quo.preferParams["quotationPrefer.quotePrice"];
                    var quoteArea = quo.preferParams["quotationPrefer.quoteArea"];
                    var activityPrice = quo.preferParams["quotationPrefer.activityPrice"];
                    var activityProfit = quo.preferParams["quotationPrefer.activityProfit"];

                    _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _discount : 1; // 车运费折扣
                    _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? _discount : 1; // 管理费折扣
                    _taxDiscount = taxCost.find('.discountprice').attr('data-discount');// 税金折扣

                    _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text() == "" ? 0 : manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
                    _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text() == "" ? 0 : converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
                    _taxRate = parseFloat(taxCost.find('.discountprice .cell-wrap').text() == "" ? 0 : taxCost.find('.discountprice .cell-wrap').text()); // 获取税金比例(根据报价版本获得)

                    quotePrice = utils.accAdd(quotePrice, activityPrice);
                    _transfee = utils.accMul(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _tranRate); // 未计算车运费之前的总价格*车运费比例=车运费
                    _managefee = utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _manageRate); // (未计算车运费之前的总价格+车运费)*管理费

                    _dtransfee = utils.accMul(_transfee, _transDiscount); // 车运费*车运费折扣
                    _dmanagefee = utils.accMul(_managefee, _manageDiscount); // (未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣,管理费
                    _dtaxfee = 0;

                    if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
                        _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), preferPrice), managePrefer), advancePrefer), activityProfit), _taxRate));
                        _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
                    }

                    if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
                        _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), preferPrice), managePrefer), advancePrefer), activityProfit), _taxRate));
                        _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
                    }

                    _total = utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), _taxfee), preferPrice), managePrefer), advancePrefer), activityProfit); // 未计算车运费之前的总价格+车运费+管理费=(未打折的总价格)

                    if (quo.basicParams["quotation.basePrice"] && quo.basicParams["quotation.basePrice"] != 0) {
                        // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
                        var total = utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee); // 工程基数
                        var remainder = total % quo.basicParams['quotation.basePrice']; // 余数
                        _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), _discount), remainder), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer), activityProfit));
                    } else {
                        // (未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                        _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), quotePrice), _dtransfee), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer), activityProfit));
                    }

                    _dtotal = utils.accAdd(_dtotal, utils.accAdd(_rtemPrice, !(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0));
                    _total = utils.accAdd(_total, utils.accAdd(_rtemPrice, !(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0));

                    converyanceCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dtransfee)); // 显示到生成项目 车运费(未折扣的车运费)
                    manageCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dmanagefee)); // 显示到生成项目 管理费(未折扣的管理费)
                    taxCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dtaxfee));// 显示到生成项目 税金(未折扣的管理费)

                    com.focusPage('#version').text(params.quotation.quotation.version.name);
                    com.focusPage('#disPrice').text(utils.changeThrDecimal(_disPrice));
                    com.focusPage('#undisPrice').text(utils.changeThrDecimal(_undisPrice));
                    com.focusPage('#costPrice').text(utils.changeThrDecimal(_costPrice));
                    com.focusPage('#unachePrice').text(utils.changeThrDecimal(_unachePrice));
                    com.focusPage('#sumLabSumMoney').text(utils.changeThrDecimal(_total));
                    com.focusPage('#sumLabDiscountMoney').text(utils.changeThrDecimal(_dtotal));
                    com.focusPage('#taxPrices').text(utils.changeThrDecimal(_dtaxfee));
                    com.focusPage('#preferPrice').text(preferPrice);
                    com.focusPage('#managePrefer').text(managePrefer);
                    com.focusPage('#advancePrefer').text(advancePrefer);
                    com.focusPage('#quotePrice').text(quotePrice);
                    com.focusPage('#countQuotePrice').text(quotePrice);
                    com.focusPage('#countTotalPrice').text(utils.changeThrDecimal(_total));
                    com.focusPage('#rtemPrice').text(utils.changeThrDecimal(_rtemPrice));

                    quo.basicParams["quotation.totalPrice"] = utils.changeThrDecimal(_dtotal);
                    quo.basicParams["quotation.managePrice"] = utils.changeThrDecimal(_managefee); // 管理费
                    quo.basicParams["quotation.manageRate"] = utils.changeThrDecimal(utils.accSub(_manageRate, (quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0)); // 管理费比例
                    quo.basicParams["quotation.trafficPrice"] = utils.changeThrDecimal(_transfee); // 车运费
                    quo.basicParams["quotation.trafficRate"] = utils.changeThrDecimal(_tranRate); // 车运费比例
                    quo.basicParams["quotation.taxPrice"] = utils.changeThrDecimal(_taxfee);// 税金
                    quo.basicParams["quotation.taxRate"] = utils.changeThrDecimal(_taxRate);// 税金比例
                    quo.basicParams["quotation.undisPrice"] = utils.changeThrDecimal(_undisPrice); // 非打折项折前总额
                    quo.basicParams["quotation.disPrice"] = utils.changeThrDecimal(_disPrice); // 打折项折前总额
                    quo.basicParams["quotation.costPrice"] = utils.changeThrDecimal(_costPrice); // 成本总额
                    quo.basicParams["quotation.unachePrice"] = utils.changeThrDecimal(_unachePrice);
                    quo.basicParams["quotation.undisComPrice"] = utils.changeThrDecimal(_undisComPrice);
                    quo.basicParams["quotation.disComPrice"] = utils.changeThrDecimal(_disComPrice);
                    quo.basicParams["quotation.consPrice"] = utils.changeThrDecimal(_consPrice);
                    quo.basicParams["quotation.comsPrice"] = utils.changeThrDecimal(_comsPrice);
                }

            }, null, false);

            com.post(api.quotation.queryExtensionByOrderId, {
                "extension.orderId": quo.orderid
            }, function(res) {

                $.each(res.extensions, function(i, v) {

                    if (v.qid == quo.quotationid && v.atttype == constant.quotation().extension.ATTTYPE_QUOTATION_INT) {
                        $.each(v.extensionItems, function(index, data) {

                            var widget = com.focusPage("#functionAreaDetailList").find(".widget-box[data-qfaid='" + data.quotationFunctionAreaId + "']");

                            var quoList = widget.find('.fl-quo-list.list').eq(0);
                            var quoItem = quoList.find('.fl-quo-item.item[data-qfaiid=' + data.quoteItemId + ']');

                            var extensionAddlist = widget.find('.fl-quo-list.list').eq(1);
                            var extensionAddItem = extensionAddlist.find('.fl-quo-item.item');
                            var extensionSublist = widget.find('.fl-quo-list.list').eq(2);
                            var extensionSubItem = extensionSublist.find('.fl-quo-item.item');

                            quoItem.attr("data-control", "1");
                            quoItem.find('input[name="deleteItems"]').attr("disabled", "disabled");
                            quoItem.find('.icon-remove').removeClass("pink").addClass("grey");
                            quoItem.find('.icon-arrow-up').removeClass("green").addClass("grey");
                            quoItem.find('.icon-arrow-down').removeClass("red").addClass("grey");

                            data.type = v.type

                            if (v.type == constant.quotation().extension.TYPE_ADD_INT) {
                                painter.createExtensionItem(extensionAddItem.length + 1, data).appendTo(extensionAddlist);
                            } else {
                                painter.createExtensionItem(extensionSubItem.length + 1, data).appendTo(extensionSublist);
                            }
                            ;
                        });
                    }

                    quo.extensionManagePrice = utils.accAdd(quo.extensionManagePrice, v.type == constant.quotation().extension.TYPE_ADD_INT ? v.managePrice : -v.managePrice);
                });

            }, null, false);

            if (!(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1)) {
                com.focusPage('#notsalesPrice').text(quo.notSalesmanRate).parent("div").addClass("show");
            } else {
                com.focusPage('#notsalesPrice').text(0).parent("div").addClass("hide");
            }

            if ([constant.decoration().decoration.TYPE_MIDPACK_INT, constant.decoration().decoration.TYPE_HOLONOMY_INT].indexOf(quo.decorationType) != -1) {
                com.focusPage('#quotePriceShow').hide();
                com.focusPage('#presentPreferShow').hide();
                com.focusPage('#countQuotePriceShow').hide();
                com.focusPage('#countTotalPriceShow').hide();
                com.focusPage('#preferShow').hide();
                com.focusPage('#manageShow').hide();
                com.focusPage('#advanceShow').hide();
                com.focusPage('#preferBtn').hide();
            }

            if (quo.decorationType == constant.decoration().decoration.TYPE_INCLUSIVE_INT) {
                com.focusPage('#innerAreaBtn').hide();
            }

            if (quo.preferParams["quotationPrefer.advancePrefer"] != 0) {
                com.focusPage('#advancePreferShow').show();
                com.focusPage('#advanceShow').show();
            } else {
                com.focusPage('#advancePreferShow').hide();
                com.focusPage('#advanceShow').hide();
            }

            if (params.urlLoadParams.type != null) {
                com.focusPage('#quotationPart').attr("id", "quotationPartPage");
            }

            if (params.urlLoadParams.type != null && params.quotation.attpaging == null) {
                com.focusPage('#pauseTimerBtn', '#quotationPartPage').hide();
            }

            if (params.urlLoadParams.type == null && params.quotation.attpages == null) {
                com.focusPage('#pauseTimerBtn', '#quotationPart').hide();
            }

            if (quo.defaults != constant.quotation().quotation.DEFAULTS_DEFAULT_INT) {
                com.focusPage("#innerFloor").attr("disabled", "disabled");
                com.focusPage("#isLift").attr("disabled", "disabled");
            }

            quo.init();
            domain.init();
            quote.init();
        }
    };

})();

$(function() {

    QuotationDetail.init();
});