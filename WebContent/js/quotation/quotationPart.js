var QuotationDetail = (function() {

    var quo = {

        orderid: null, // 装修单号
        quotationid: null, // 报价ID
        versionId: null, // 报价版本
        notSalesmanRate: null, // 非业务人员提点
        basicParams: null,
        precontractTime: null,
        preferParams: null,
        extensionManagePrice: 0,

        decoration: null,
        house: null,
        protation: null,

        quoModals: {},
        settingBtns: {},
        quoteCalculation: {},
        machingType: {},
        typeness: {},
        oldPrefer: {},
        workTypes: null,
        defaults: null,

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
                $btnDiscount: com.focusPage('#preferBtn').on('click', function() {

                    com.focusPage('#prefer').val(quo.preferParams["quotationPrefer.preferPrice"]);
                    com.focusPage('#manage').val(quo.preferParams["quotationPrefer.managePrefer"]);
                    com.focusPage('#advance').val(quo.preferParams["quotationPrefer.advancePrefer"]);
                    com.focusPage('#square').val(quo.preferParams["quotationPrefer.quoteArea"]);

                    that.quoModals.$domainPreferModal.modal("show");
                }),
                // 计算总价
                $btnCalculateTotal: com.focusPage('#calculateTotalBtn').on('click', function() {

                    com.focusPage('#calculateTotalFeeModal').find('.fl-quo-cal').html(null);
                    com.focusPage("#calDiscount").val("");
                    quo.calculateTotalFee(10);
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
                $quotationStatisticalModal: com.focusPage('#quotationStatisticalModal'),
                statisticalNormedDataDiv: com.focusPage('#statisticalNormedDataDiv')
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

                    if (v.status == 0)
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

            _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _discount : 1; // 车运费的折扣
            _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? _discount : 1; // 管理费的折扣
            _taxDiscount = taxCost.find('.discountprice').attr('data-discount'); // 税金折扣

            _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text() == "" ? 0 : converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
            _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text() == "" ? 0 : manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
            _taxRate = parseFloat(taxCost.find('.discountprice .cell-wrap').text() == "" ? 0 : taxCost.find('.discountprice .cell-wrap').text()); // 获取税金比例(根据报价版本获得)

            _transfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), quotePrice), _tranRate)); // 未计算车运费之前的总价格*车运费比例=车运费
            _managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), quotePrice), _transfee), _manageRate)); // (未计算车运费之前的总价格+车运费)*管理费

            _dtransfee = utils.changeThrDecimal(utils.accMul(_transfee, _transDiscount)); // 车运费*车运费折扣
            _dmanagefee = utils.changeThrDecimal(utils.accMul(_managefee, _manageDiscount)); // (未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣
            _dtaxfee = 0;

            if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) {
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), preferPrice), managePrefer), advancePrefer), _taxRate));
                _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
            }

            if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) {
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), preferPrice), managePrefer), advancePrefer), _taxRate));
                _dtaxfee = _taxfee;
            }

            _total = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), _taxfee), preferPrice), managePrefer), advancePrefer));

            // 基数是否存在,无需判断装修单类型
            if (quo.basicParams["quotation.basePrice"] && quo.basicParams["quotation.basePrice"] != 0) {
                // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
                var total = utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee); // 工程基数
                var remainder = utils.changeThrDecimal(total % quo.basicParams['quotation.basePrice']); // 余数
                _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), _discount), remainder), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer));
            } else {
                // (未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), quotePrice), _dtransfee), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer));
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
        },

        calculateQuoFeesPost: function() {

            var _discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);

            var _disPrice = 0, _undisPrice = 0, _transfee = 0, _managefee = 0, _taxfee = 0, quotePrice = 0, preferPrice = 0, managePrefer = 0, advancePrefer = 0, _total = 0, _dtotal = 0;

            _disPrice = quo.basicParams["quotation.disPrice"];
            _undisPrice = quo.basicParams["quotation.undisPrice"];
            _transfee = quo.basicParams["quotation.trafficPrice"];
            _managefee = quo.basicParams["quotation.managePrice"];
            _taxfee = quo.basicParams["quotation.taxPrice"];

            preferPrice = quo.preferParams["quotationPrefer.preferPrice"];
            managePrefer = quo.preferParams["quotationPrefer.managePrefer"];
            advancePrefer = quo.preferParams["quotationPrefer.advancePrefer"];
            quotePrice = quo.preferParams["quotationPrefer.quotePrice"];

            var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            var cpItems = cpWidget.find("li.fl-quo-item.item");

            var _rtotal = 0;

            $.each(cpItems, function(i, e) {

                var $item = $(e);

                var expres = $item.attr("data-expres");
                var qfaiid = $item.attr("data-qfaiid");

                if ($item.find(".cell.type").attr("data-type") != constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT)
                    return true;

                if (!expres)
                    return true;

                var num = quote.quotationFunctionAreaFormula(expres, cpWidget, 0);

                $item.find('.cell.formula .cell-wrap').text(num);
                $item.find('.cell.num .cell-wrap .number').text(num);

                var price = parseFloat($item.find('.unitprice .cell-wrap').text());// 单价
                var dprice = parseFloat($item.find('.discountprice .cell-wrap').text());// 折扣单价

                var rtotal = utils.changeThrDecimal(utils.accMul(dprice, num));

                $item.find('.totalprice-discount .cell-wrap').text(rtotal); // 折扣单价*数量

                _rtotal += rtotal;

                var args = {
                    "quotationFunctionAreaItem.qfaiId": $item.attr("data-qfaiid"),
                    "quotationFunctionAreaItem.quotationFunctionAreaId": cpWidget.attr('data-qfaid'),
                    "quotationFunctionAreaItem.formula": num,
                    "quotationFunctionAreaItem.initNum": num,
                    "quotationFunctionAreaItem.num": num,
                };
                
                quo.calculateNowQuoteItem(num, cpWidget.attr('data-areaType'), $item);

                var $params = $.extend({}, args, quo.basicParams);

                com.post(api.quotation.updateQuotationFunctionAreaItem, $params, function(res) {

                });
            });

            cpWidget.attr("data-rtemprice", _rtotal);

            _total = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), _taxfee), preferPrice), managePrefer), advancePrefer));

            // 基数是否存在,无需判断装修单类型
            if (quo.basicParams["quotation.basePrice"] && quo.basicParams["quotation.basePrice"] != 0) {
                // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
                var total = utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee); // 工程基数
                var remainder = utils.changeThrDecimal(total % quo.basicParams['quotation.basePrice']); // 余数
                _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), _discount), remainder), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer));
            } else {
                // (未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), quotePrice), _dtransfee), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer));
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

            var $arr = com.focusPage('.fl-quo-item.item:not([data-del-sign="1"])', $domain);

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

            var _discount = utils.accDiv(discount, 10);

            var total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), _dmanagefee)); // 折前总额
            var dtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), _dtransfee), _dmanagefee), _dtaxfee)); // 半包折扣总额
            var bbtotal = utils.changeThrDecimal(utils.accMul(utils.accAdd(total, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 0 : _dtaxfee), utils.accAdd(1, utils.accMul(_dtaxRate, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 1 : 0))));
            dtotal = utils.changeThrDecimal(utils.accMul(utils.accAdd(dtotal, _dtaxfee), utils.accAdd(1, utils.accMul(_dtaxRate, _dtaxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT ? 1 : 0))));

            var table = com.focusPage('#calculateTotalFeeModal').find('.fl-quo-cal').html(null);

            var divItem1 = $('<div></div>').addClass('fl-quo-cal-item');

            divItem1.append(createCalItem("基础", 'normal border-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-info'));
            divItem1.append(createCalItem("", 'normal border-left alert-info').addClass("hide"));
            divItem1.append(createCalItem("装修", ' small border-left-right alert-success'));
            divItem1.append(createCalItem("", 'normal border-left alert-success'));
            divItem1.append(createCalItem("主材", 'small border-left-right alert-danger'));
            divItem1.append(createCalItem("", 'normal border-left-right alert-danger'));
            divItem1.append(createCalItem("综合", 'normal border-left-right alert-warning'));
            divItem1.append(createCalItem("", 'normal border-left alert-warning'));

            divItem1.appendTo(table);

            var divItem2 = $('<div></div>').addClass('fl-quo-cal-item');

            divItem2.append(createCalItem("版本", 'normal'));
            divItem2.append(createCalItem("折前总价", 'normal'));
            divItem2.append(createCalItem("打折总额", 'normal'));
            divItem2.append(createCalItem("非打折总额", 'normal'));
            divItem2.append(createCalItem("非业绩", 'normal').addClass("hide"));
            divItem2.append(createCalItem("管理费", 'normal'));
            divItem2.append(createCalItem("税金", 'normal'));
            divItem2.append(createCalItem("优惠", 'normal').addClass("hide"));
            divItem2.append(createCalItem("折扣", 'small'));
            divItem2.append(createCalItem("折后总价", 'normal'));
            divItem2.append(createCalItem("配比", 'small'));
            divItem2.append(createCalItem("主材额", 'normal'));
            divItem2.append(createCalItem("服务费", 'normal'));
            divItem2.append(createCalItem("实花总额", ' normal alert-warning'));

            divItem2.appendTo(table);

            var labels = com.focusPage('#calculateTotalFeeModal').find('.machingInfos').html(null);

            $.each(quo.machingType, function(i, v) {

                if ((v.vision & 1) != constant.data().decorationMatching.VISION_QUOTEDISCOUNT_INT)
                    return true;

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

                    var info = com.focusPage('#calculateTotalFeeModal').find('.dmid' + v.dmid);

                    $(this).is(":checked") == false ? info.hide() : info.show();

                    v.isShow = $(this).is(":checked") == false ? constant.data().decorationMatching.ISSHOW_HIDE_INT : constant.data().decorationMatching.ISSHOW_SHOW_INT;
                });

                var _dtaxfee = 0;

                var preferPrice = quo.preferParams["quotationPrefer.preferPrice"];
                var managePrefer = quo.preferParams["quotationPrefer.managePrefer"];
                var advancePrefer = quo.preferParams["quotationPrefer.advancePrefer"];

                if (v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
                    _dtaxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), preferPrice), managePrefer), advancePrefer), _dtaxRate));
                }

                if (v.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
                    _dtaxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), _dtransfee), _dmanagefee), preferPrice), managePrefer), advancePrefer), _dtaxRate));
                }

                var _ddtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer));

                if (v.base && v.base != 0) {

                    _ddmanagefee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dmanagefee, utils.accDiv(v.discount, 10))) : _dmanagefee;
                    _ddtaxfee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtaxfee, utils.accDiv(v.discount, 10))) : _dtaxfee;

                    cdiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee), (v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? _dtaxfee : 0) : 0)));
                    ndiscount = utils.changeThrDecimal(v.manageDiscount == constant.data().quotationVersion.MANAGE_NODISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? _dtaxfee : 0) : 0);

                    var materialPrice = utils.changeThrDecimal(utils.accMul(_ddtotal, v.material));
                    var servicePrice = utils.changeThrDecimal(utils.accMul(materialPrice, v.service));
                    var _totalProject = utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _dtransfee); // 工程总额
                    var _balance = _totalProject % v.base; // 余数 = 工程总额%基数
                    // 满减折后总额 //折后工程总额=(工程总额-余数)*折扣 + (余数) + 管理费
                    var _projectPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(_totalProject, _balance), utils.accDiv(v.discount, 10)), _balance), _ddmanagefee), _ddtaxfee));
                    var $_total = utils.changeThrDecimal(utils.accAdd(_projectPrice, utils.accAdd(materialPrice, servicePrice)));

                    var halfPriceDiv = $('<div></div>').addClass('fl-quo-cal-item');

                    halfPriceDiv.append(createCalItem(v.name, 'normal'));
                    halfPriceDiv.append(createCalItem(_ddtotal, 'normal'));
                    halfPriceDiv.append(createCalItem(cdiscount, 'normal'));
                    halfPriceDiv.append(createCalItem(ndiscount, 'normal'));
                    halfPriceDiv.append(createCalItem(_unachefee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(_ddmanagefee, 'normal'));
                    halfPriceDiv.append(createCalItem(_ddtaxfee, 'normal'));
                    halfPriceDiv.append(createCalItem(_costfee, 'normal').addClass("hide"));
                    halfPriceDiv.append(createCalItem(v.discount, 'small'));
                    halfPriceDiv.append(createCalItem(_projectPrice, 'normal'));
                    halfPriceDiv.append(createCalItem(utils.accMul(v.material, 100) + "%", 'small'));
                    halfPriceDiv.append(createCalItem(materialPrice, 'normal'));
                    halfPriceDiv.append(createCalItem(servicePrice, 'normal'));
                    halfPriceDiv.append(createCalItem($_total, 'normal alert-warning'));

                    halfPriceDiv.addClass('dmid' + v.dmid).appendTo(table);

                    v.isShow != constant.data().decorationMatching.ISSHOW_SHOW_INT ? halfPriceDiv.hide() : halfPriceDiv.show();

                } else {

                    _ddtransfee = v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtransfee, _discount)) : _dtransfee;
                    _ddmanagefee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dmanagefee, _discount)) : _dmanagefee;
                    _ddtaxfee = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.changeThrDecimal(utils.accMul(_dtaxfee, utils.accDiv(v.discount, 10))) : _dtaxfee;

                    cdiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_disPrice, (v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _ddtransfee : 0)), (v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? _dtaxfee : 0) : 0)));
                    ndiscount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_undisPrice, (v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_NODISCOUNT_INT ? _ddtransfee : 0)), (v.manageDiscount == constant.data().quotationVersion.MANAGE_NODISCOUNT_INT ? utils.accAdd(_dmanagefee, v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT ? _dtaxfee : 0) : 0)));

                    var materialPrice = utils.changeThrDecimal(utils.accMul(_ddtotal, v.material));
                    var servicePrice = utils.changeThrDecimal(utils.accMul(materialPrice, v.service));

                    var _projectPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), _ddtransfee), _ddmanagefee), _ddtaxfee));
                    var $_total = utils.changeTwoDecimal(utils.accAdd(_projectPrice, utils.accAdd(materialPrice, servicePrice)));

                    var halfPacksDiv = $('<div></div>').addClass('fl-quo-cal-item');

                    halfPacksDiv.append(createCalItem(v.name, 'normal'));
                    halfPacksDiv.append(createCalItem(_ddtotal, 'normal'));
                    halfPacksDiv.append(createCalItem(cdiscount, 'normal'));
                    halfPacksDiv.append(createCalItem(ndiscount, 'normal'));
                    halfPacksDiv.append(createCalItem(_unachefee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(_ddmanagefee, 'normal'));
                    halfPacksDiv.append(createCalItem(_ddtaxfee, 'normal'));
                    halfPacksDiv.append(createCalItem(_costfee, 'normal').addClass("hide"));
                    halfPacksDiv.append(createCalItem(discount, 'small'));
                    halfPacksDiv.append(createCalItem(_projectPrice, 'normal'));
                    halfPacksDiv.append(createCalItem(utils.accMul(v.material, 100) + "%", 'small'));
                    halfPacksDiv.append(createCalItem(materialPrice, 'normal'));
                    halfPacksDiv.append(createCalItem(servicePrice, 'normal'));
                    halfPacksDiv.append(createCalItem($_total, 'normal alert-warning'));

                    halfPacksDiv.addClass('dmid' + v.dmid).appendTo(table);

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

        calculateNowQuoteItem: function(num, areaType, $nowLine) {

            var _areaType = $nowLine.find('.cell.line').attr('data-areatype');
            var type = $nowLine.find(".cell.type").attr("data-type");
            var subtype = $nowLine.find(".cell.num").attr("data-subtype");
            var discount = $nowLine.find('.discountprice').attr('data-discount');

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

        quotationPreferControl: function(presignProduce) {

            if (presignProduce == null)
                return true;

            var preferPrice = com.focusPage('#prefer').val();
            var managePrefer = com.focusPage('#manage').val();
            var advancePrefer = com.focusPage('#advance').val();
            var _disPrice = quo.basicParams["quotation.disPrice"];
            var _undisPrice = quo.basicParams["quotation.undisPrice"];

            var manageCost = com.focusPage('#manageCost'); // 管理费
            var converyanceCost = com.focusPage('#conveyanceCost'); // 车运费
            var taxCost = com.focusPage('#taxCost'); // 税金

            var _taxDiscount = taxCost.find('.discountprice').attr('data-discount');// 税金折扣

            var _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text() == "" ? 0 : manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
            var _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text() == "" ? 0 : converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
            var _taxRate = parseFloat(taxCost.find('.discountprice .cell-wrap').text() == "" ? 0 : taxCost.find('.discountprice .cell-wrap').text()); // 获取税金比例(根据报价版本获得)

            var _transfee = utils.accMul(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), presignProduce.quotePrice), _tranRate);
            var _managefee = utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), presignProduce.quotePrice), _transfee), _manageRate);
            var _taxfee = 0;

            if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), presignProduce.quotePrice), _transfee), preferPrice), managePrefer), advancePrefer), _taxRate));
            }

            if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
                _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), presignProduce.quotePrice), _transfee), _managefee), preferPrice), managePrefer), advancePrefer), _taxRate));
            }

            var _total = utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), presignProduce.quotePrice), _transfee), _managefee), _taxfee), preferPrice), managePrefer), advancePrefer);

            _total = utils.accAdd(_total, !(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1) ? quo.notSalesmanRate : 0);

            var _managePrice = utils.changeThrDecimal(utils.accAdd(_managefee, quo.extensionManagePrice)); // 总管理费
            var _totalPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), presignProduce.quotePrice), _transfee)); // 直接费

            var _preferPrice = 0, _discount = 0, _discountValue = 0, _manageDiscount = 0, _manageDiscountValue = 0;

            if (quo.decorationType == constant.decoration().decoration.TYPE_INCLUSIVE_INT && quo.protation.quotePrice) {

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

            quo.preferParams["quotationPrefer.quotePrice"] = presignProduce.quotePrice;

            com.focusPage('#countQuotePrice').text(presignProduce.quotePrice);
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

        // 编辑功能区
        editDomain: function(qfaid) {

            var $domain = com.focusPage('.widget-box[data-qfaid="' + qfaid + '"]', '#functionAreaDetailList');

            this.nowEditDomain = $domain;

            com.focusPage("#functionAreaName").val($domain.find('.widget-header strong').text());
            // $("#functionAreaIndex").val(dv.functionAreaIndex);
            com.focusPage("#functionAreaOrder").val($domain.attr("data-dlevel"));

            com.focusPage("#girth", "#functionAreaModal").val($domain.attr("data-girth"));
            com.focusPage("#area", "#functionAreaModal").val($domain.attr("data-area"));
            com.focusPage("#height", "#functionAreaModal").val($domain.attr("data-height"));
            com.focusPage("#holeLength", "#functionAreaModal").val($domain.attr("data-holeLength"));
            com.focusPage("#holeHeight", "#functionAreaModal").val($domain.attr("data-holeHeight"));
            com.focusPage("#windowLength", "#functionAreaModal").val($domain.attr("data-windowLength"));
            com.focusPage("#windowHeight", "#functionAreaModal").val($domain.attr("data-windowHeight"));
            com.focusPage("#beamLength", "#functionAreaModal").val($domain.attr("data-beamLength"));
            com.focusPage("#beamHeight", "#functionAreaModal").val($domain.attr("data-beamHeight"));

            quo.quoModals.$domainEditModal.on('hide.bs.modal', function() {

                com.closeTip();
            });

            quo.quoModals.$domainEditModal.modal("show");

            return false;
        },

        paramsDomainEdit: function() {

            com.focusPage('#paramsFunctionAreasBtn').click(function() {

                if (quo.quoModals.$domainEditModal.hasClass("parameter")) {
                    quo.quoModals.$domainEditModal.find(".parameter").hide();
                    quo.quoModals.$domainEditModal.removeClass("parameter");
                } else {
                    quo.quoModals.$domainEditModal.find(".parameter").show();
                    quo.quoModals.$domainEditModal.addClass("parameter");
                }

                com.closeTip();

            });
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
                    "quotationFunctionArea.functionAreaName": _dname,// 功能区名
                    "quotationFunctionArea.functionAreaOrder": _dorder,// 排序
                    "quotationFunctionArea.qfaId": that.nowEditDomain.attr('data-qfaid'), // 功能区Id

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

                var _paramsHide = $.extend({}, {
                    "quotationFunctionArea.functionAreaName": _dname,// 功能区名
                    "quotationFunctionArea.functionAreaOrder": _dorder,// 排序
                    "quotationFunctionArea.qfaId": that.nowEditDomain.attr('data-qfaid'), // 功能区Id

                }, quo.basicParams);

                if (!quo.quoModals.$domainEditModal.hasClass("parameter")) {
                    _params = _paramsHide;
                }

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

                    if (res.quotationFunctionArea.quotationFunctionAreaParam) {
                        $.each(res.quotationFunctionArea.quotationFunctionAreaParam, function(k, v) {

                            if (v)
                                that.nowEditDomain.attr("data-" + k, v ? v : "0");
                        });
                    }

                    var $btnExpres = that.nowEditDomain.find('.widget-body .icon-circle-arrow-down');

                    $.each($btnExpres, function(i, e) {

                        var $line = $(e).parents("li");

                        if (!$line.attr("data-qfaiid"))
                            return true;

                        if (!$line.attr("data-expres"))
                            return true;

                        $(e).show();
                    });

                    quo.quoModals.$domainEditModal.modal("hide");
                }, null, false);

            });
        },

        // 删除功能区
        deletDomain: function($domain) {

            var that = this;

            com.showConfirm("是否确定要删除功能区", function(res) {

                var $itemlist = $domain.find("li.fl-quo-item.item");

                $.each($itemlist, function(i, v) {

                    var $quote = $(v);

                    var isRtem = $quote.attr("data-isRtem");

                    if (isRtem != "1")
                        return true;

                    var qiid = $quote.attr("data-qiid");
                    var formula = $quote.find('.cell.formula .cell-wrap').text();
                    var num = $quote.find('.cell.num .cell-wrap .number').text();

                    quote.cacsedeUpdateItem(qiid, formula, parseFloat(0) - parseFloat(num));

                    $quote.remove();
                });

                $domain.attr("data-del-sign", 1);
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
                    $domain.removeAttr('data-del-sign');
                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();
                }, false);
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

        // 折扣窗体配置基数
        showDiscountBasePrice: function() {

            com.focusPage("#showBaseVersion").empty();
            com.focusPage("#discount").prop("disabled", "disabled");

            com.post(api.data.queryDecorationMatching, quo.typeness, function(res) {

                $.each(res.decorationMatchings, function(i, v) {

                    if ((v.vision & 2) != constant.data().decorationMatching.VISION_QUOTECOUNT_INT)
                        return true;

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

                var produce = com.focusPage('#produce').val();
                var preferPrice = com.focusPage('#prefer').val();
                var managePrefer = com.focusPage('#manage').val();
                var advancePrefer = com.focusPage('#advance').val();
                var quoteArea = com.focusPage('#square').val();
                var quotePrice = com.focusPage('#countQuotePrice').text();

                var produceId = produce ? produce : quo.oldPrefer.ppid;

                var presignProduce = null;

                com.post(api.quotation.queryPresignProduceByPpid, {
                    "presignProduce.ppid": produceId
                }, function(res) {

                    presignProduce = res.presignProduce;
                }, null, false);

                quo.preferParams["quotationPrefer.qid"] = quo.quotationid;
                quo.preferParams["quotationPrefer.presignProduce.ppid"] = presignProduce ? presignProduce.ppid : null;
                quo.preferParams["quotationPrefer.preferPrice"] = preferPrice;
                quo.preferParams["quotationPrefer.managePrefer"] = managePrefer;
                quo.preferParams["quotationPrefer.advancePrefer"] = advancePrefer;
                quo.preferParams["quotationPrefer.discount"] = presignProduce ? presignProduce.discount : 0;
                quo.preferParams["quotationPrefer.manageDiscount"] = presignProduce ? presignProduce.manageDiscount : 0;
                quo.preferParams["quotationPrefer.quoteArea"] = quoteArea;
                quo.preferParams["quotationPrefer.quotePrice"] = quotePrice;

                presignProduce.quoteArea = quoteArea;
                presignProduce.quotePrice = quotePrice;

                if (!quo.quotationPreferControl(presignProduce)) {
                    return false;
                }

                if (parseFloat(advancePrefer) > quo.oldPrefer.advancePrefer && parseFloat(advancePrefer) > quo.protation.advanceProfit) {
                    com.focusPage('#approveModal').modal("show");

                    return false;
                }

                quo.calculateQuoFees();

                var params = {
                    "quotation.qid": quo.quotationid,
                    "quotation.totalPrice": quo.basicParams["quotation.totalPrice"],
                    "quotation.taxPrice": quo.basicParams["quotation.taxPrice"]
                };

                params = $.extend({}, params, quo.preferParams);

                com.post(api.quotation.updateQuotationPrefer, params, function(res) {

                    com.focusPage('#presentPrefer').val(presignProduce ? presignProduce.name : '无');
                    com.focusPage('#square').val(quoteArea);

                    quote.updateQuotationForTime();

                    quo.quoModals.$domainPreferModal.modal("hide");
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    quo.oldQuotationPreferData();

                    quo.quoModals.$domainPreferModal.modal("hide");

                    quoteArea = quo.oldPrefer.quoteArea;
                });

                if (quo.defaults == constant.quotation().quotation.DEFAULTS_DEFAULT_INT) {
                    com.post(api.data.updateHouse, {
                        "house.hid": quo.decoration.house.hid,
                        "house.innerArea": quoteArea
                    }, function(res) {
                        com.focusPage('#innerArea').text(quoteArea);
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
                    "approvalQuotationPrefer.preferPrice": quo.preferParams["quotationPrefer.preferPrice"],
                    "approvalQuotationPrefer.managePrefer": quo.preferParams["quotationPrefer.managePrefer"],
                    "approvalQuotationPrefer.advancePrefer": quo.preferParams["quotationPrefer.advancePrefer"],
                    "approvalQuotationPrefer.taxPrice": quo.basicParams["quotation.taxPrice"],
                    "approvalQuotationPrefer.totalPrice": quo.basicParams["quotation.totalPrice"],
                };

                com.post(api.approval.submitApprovalForQuotationPrefer, params, function(res) {

                    com.showAlert(com.info, "操作成功");

                    quote.updateQuotationForTime();

                    quo.quoModals.$domainApproveModal.modal("hide");
                    quo.quoModals.$domainPreferModal.modal("hide");
                });
            });
        },

        handleInput: function() {

            com.focusPage('#square').on('blur', function() {

                var presignProduce = null, produceId = null;
                var quoteArea = com.focusPage('#square').val();

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

                if (presignProduce == null)
                    return false;

                presignProduce.quotePrice = 0;

                if (presignProduce && presignProduce.quotePrice) {
                    presignProduce.quotePrice = utils.changeThrDecimal(utils.accMul(presignProduce.quotePrice, quoteArea));
                }

                com.post(api.quotation.queryPresignPrice, {
                    "presignPrice.ppid": produceId,
                    "presignPrice.lowerArea": $(this).val()
                }, function(res) {

                    if (res.presignPrice && res.presignPrice.price) {
                        presignProduce.quotePrice = res.presignPrice.price;
                    }

                }, null, false);

                if (!quo.quotationPreferControl(presignProduce)) {
                    return false;
                }
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
            } else {
                extraParams["quotationPrice.updateTime"] = null;
            }

            if (parseInt(domain.nowEditDomain.attr("data-areatype")) == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                extraParams["quotationItem.type"] = constant.data().quotationItem.TYPE_CMPREH_INT;
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
                $(li).appendTo($domain.find(".fl-quo-list.list"));

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
            this.paramsDomainEdit();
            this.calculateTotal();
            this.quotationItemPriceEdit();
            this.saveDiscountEdit();
            this.saveDomainTemplete();
            this.saveQuotesToDomain();
            this.saveManageRate();
            this.deleteQuotesToDomain();
            this.showDiscountBasePrice();
            this.saveQuotationPrefer();
            if (quo.decorationType != constant.decoration().decoration.TYPE_MIDPACK_INT) this.handleInput();
            this.handlechange();
            this.submitApprovalPrefer();
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
                // 保留原先的工程量和数量
                var oldFormula = that.$nowLine.find('.cell.formula .cell-wrap').text();
                var oldNum = that.$nowLine.find('.cell.num .cell-wrap .number').text();

                // 赋值给外部的公式显示
                that.$nowLine.find('.cell.formula .cell-wrap').text(formula);
                // 赋值给外部显示DIV 显示数量
                that.$nowLine.find('.cell.num .cell-wrap .number').text(num);
                // 获取下一个报价项的整体元素标签
                $line = that.$nowLine.next('.fl-quo-item.item');

                var _type = that.$nowLine.find('.type').attr('data-type');
                var _areaType = that.$nowLine.find('.line').attr('data-areaType');

                var num = that.$nowLine.find('.num .cell-wrap .number').text();

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
                    that.$nowLine.find('.icon-circle-arrow-down').hide();

                    that.cacsedeUpdateItem(res.quotationFunctionAreaItem.quotationItemId, that.$nowLine.find('.formula .cell-wrap').text(), parseFloat(num) - parseFloat(oldNum));

                    quo.calculateQuoFeesPost();
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    that.$nowLine.find('.cell.formula .cell-wrap').text(oldFormula);
                    that.$nowLine.find('.cell.num .cell-wrap .number').text(oldNum);

                    quo.calculateNowQuoteItem(oldNum, _areaType, that.$nowLine);

                    quo.calculateQuoFeesPost();
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
            // this.$nowEditInput = null;
        },

        cacsedeUpdateItem: function(qiid, formula, num) {

            var widget = domain.nowEditDomain;
            var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');

            com.post(api.quotation.queryQuotationRtem, {
                "quotationRtem.source.qiid": qiid
            }, function(res) {

                var rtems = res.quotationRtems;

                $.each(rtems, function(i, v) {

                    var target = v.target;

                    var handler = widget.find(".fl-quo-item.item[data-qiid=" + target.qiid + "]");

                    if (handler.length == 0) {
                        handler = cpWidget.find(".fl-quo-item.item[data-qiid=" + target.qiid + "]");
                    }

                    if (handler.length == 0)
                        return true;

                    var oldNum = handler.find('.cell.num .cell-wrap .number').text();
                    var oldFormula = handler.find('.cell.formula .cell-wrap').text();

                    var newNum = parseFloat(oldNum) + parseFloat(num);

                    handler.find('.cell.formula .cell-wrap').text(newNum);
                    handler.find('.cell.num .cell-wrap .number').text(newNum);

                    var fee = quo.calculateNowQuoteItem(newNum, widget.attr('data-areaType'), handler);
                    com.focusPage('[data-qfaid="' + handler.parents('.widget-box').attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(fee);

                    var _params = {
                        "quotationFunctionAreaItem.qfaiId": handler.find('input[name="deleteItems"]').val(),// 报价项Id , 可空 ;
                        "quotationFunctionAreaItem.initNum": newNum,// 初始化数量
                        "quotationFunctionAreaItem.num": newNum,// 数量;
                        "quotationFunctionAreaItem.formula": newNum,// 计算公式
                        "quotationFunctionAreaItem.quotationFunctionAreaId": widget.attr('data-qfaId'),// 功能区Id
                    };

                    var _params = $.extend({}, _params, quo.basicParams);

                    com.post(api.quotation.updateQuotationFunctionAreaItem, _params, function(res) {

                    }, function(res) {

                        com.showAlert(com.error, res.errorMsg);

                        handler.find('.cell.formula .cell-wrap').text(oldFormula);
                        handler.find('.cell.num .cell-wrap .number').text(oldNum);

                        quo.calculateNowQuoteItem(oldNum, widget.attr('data-areaType'), handler);
                    }, false);
                });
            }, null, false);
        },

        // 批量删除报价项
        deleteQuoteInBatches: function($domain) {

            $domain.find('.fl-quo-input').insertAfter($domain.find('.fl-quo-list.list')).addClass('hide');

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

            if ($q1.length) {

                $.each($q1, function(i, v) {

                    $(v).parents('li.fl-quo-item.item').attr("data-del-sign", 1);
                });

                $.each($q1, function(i, v) {

                    var $quote = $(v).parents('li.fl-quo-item.item');

                    var isRtem = $quote.attr("data-isRtem");

                    if (isRtem != "1")
                        return true;

                    var qiid = $quote.attr("data-qiid");
                    var formula = $quote.find('.cell.formula .cell-wrap').text();
                    var num = $quote.find('.cell.num .cell-wrap .number').text();

                    that.cacsedeUpdateItem(qiid, formula, parseFloat(0) - parseFloat(num));
                });

                var _fee = quo.calculateDomainFees(domain.nowEditDomain);

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
                    });

                    quo.calculateDomainFees(domain.nowEditDomain);
                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();
                }, false);
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

                var _fee = quo.calculateDomainFees(domain.nowEditDomain);

                quo.calculateQuoFees();

                _params = $.extend({}, quo.basicParams, {
                    "quotationFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid'),
                    "qfaiIds[0]": _qid
                });

                com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res) {

                    var formula = $quote.find('.cell.formula .cell-wrap').text();
                    var num = $quote.find('.cell.num .cell-wrap .number').text();

                    that.cacsedeUpdateItem($quote.attr("data-qiid"), formula, parseFloat(0) - parseFloat(num));

                    $quote.remove();

                    var _fee = quo.calculateDomainFees(domain.nowEditDomain);

                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();

                    com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    $quote.removeAttr("data-del-sign");

                    quo.calculateDomainFees(domain.nowEditDomain);
                    quo.calculateQuoFees();
                    quo.calculateQuoFeesPost();
                }, false);
            }

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

        addDefaultQuotes: function() {

            var _arrs = quote.quotesRecord;

            if (!_arrs.length) {
                return false;
            }

            var widget = domain.nowEditDomain;
            var _index = domain.nowEditDomain.find('.fl-quo-item.item').length;
            var quolist = domain.nowEditDomain.find('.fl-quo-list.list');
            var areaType = domain.nowEditDomain.attr('data-areaType');

            var cpWidget = com.focusPage('#functionAreaDetailList').find('.widget-box[data-dlevel="9998"]');
            var cpList = cpWidget.find('.fl-quo-list.list');
            var cpIndex = cpWidget.find('.fl-quo-item.item').length;

            $.each(_arrs, function(i, v) {

                var $this = $(v);

                if ($this.val() && com.focusPage('input[data-qiid="' + $this.val() + '"]', domain.nowEditDomain).length) {
                    return false;
                }

                var type = quote.quoItemType($this.attr('data-type'), areaType);
                var num = quote.quotationFunctionAreaFormula($this.attr('data-formula'), widget, 0);

                var _quotval = {
                    "discount": parseInt($this.attr('data-discount')),
                    "content": $this.attr('data-des'),
                    "itemName": $this.attr('data-name'),
                    "measurementUnit": $this.attr('data-itemUnite'),
                    "formula": num,
                    "num": num,
                    "qfaiId": null,
                    "quotationFunctionAreaId": widget.attr("data-qfaid"),
                    "quotationItemId": $this.val(),
                    "type": quote.quoItemType($this.attr('data-type'), areaType),
                    "subtype": $this.attr('data-quotationTypeId'),
                    "unitPrice": $this.attr('data-itemPrice'),
                    "addPrice": $this.attr('data-itemAddPrice'),
                    "subPrice": $this.attr('data-itemSubPrice'),
                    "workType": $this.attr('data-workType'),
                    "quotationType": $this.attr('data-quotationType'),
                    "quotationTypeId": $this.attr('data-quotationTypeId'),
                    "areaType": areaType,
                    "isRtem": $this.attr('data-isRtem'),
                    "expres": $this.attr('data-formula'),
                    "index": _index + i + 1
                };

                if (type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT && areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                    _quotval["quotationFunctionAreaId"] = cpWidget.attr("data-qfaid");
                    _quotval["index"] = cpIndex + 1;
                }

                quote.addQuoteRtem(_quotval);
                quote.recordHistoryQuotes($this.parents('li.item-blue').clone(true));

                if ($this.attr('data-isRtem') != "1")
                    return true;

                com.post(api.quotation.queryQuotationRtem, {
                    "quotationRtem.source.qiid": $this.val()
                }, function(res) {

                    $.each(res.quotationRtems, function(i, v) {

                        var _quortval = {
                            "discount": v.target.discount,
                            "content": v.target.comment,
                            "itemName": v.target.name,
                            "measurementUnit": v.target.unit.name,
                            "formula": quote.quotationFunctionAreaFormula(v.formula, widget, _quotval["num"]),
                            "num": quote.quotationFunctionAreaFormula(v.formula, widget, _quotval["num"]),
                            "qfaiId": null,
                            "quotationItemId": v.target.qiid,
                            "subtype": v.target.category.id,
                            "unitPrice": v.target.unitPrice,
                            "addPrice": v.target.addPrice,
                            "subPrice": v.target.subPrice,
                            "workType": v.target.workType.name,
                            "expres": v.formula
                        };

                        if (v.type == constant.data().quotationRtem.TYPE_CMPREH_INT && cpWidget.length) {
                            _quortval["quotationFunctionAreaId"] = cpWidget.attr("data-qfaid");
                            _quortval["type"] = constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT;
                            _quortval["areaType"] = constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT;
                            _quortval["index"] = cpIndex + 1;

                            quote.addQuoteRtem(_quortval);
                        }

                        if (v.type == constant.data().quotationRtem.TYPE_GENERRAL_INT && com.focusPage('.item[data-qiid="' + v.target.qiid + '"]', domain.nowEditDomain).length == 0) {
                            _quortval["quotationFunctionAreaId"] = widget.attr("data-qfaid");
                            _quortval["type"] = quote.quoItemType(v.target.type, widget.attr('data-areaType'));
                            _quortval["areaType"] = widget.attr('data-areaType');
                            _quortval["index"] = _index + i + 1;

                            quote.addQuoteRtem(_quortval);
                        }
                    });
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

            if (v.areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                item = cpList.find('.fl-quo-item.item[data-qiid="' + v.quotationItemId + '"]', cpWidget);
            } else {
                item = quolist.find('.fl-quo-item.item[data-qiid="' + v.quotationItemId + '"]', widget);
            }

            if (item && item.length != 0) {

                var oldFormula = item.find('.cell.formula .cell-wrap').text();
                var oldNum = item.find('.cell.num .cell-wrap .number').text();

                v.qfaiId = item.attr("data-qfaiid");
                v.formula = utils.accAdd(oldFormula, v.formula);
                v.num = utils.accAdd(oldNum, v.num);

                item.find('.cell.formula .cell-wrap').text(v.formula);
                item.find('.cell.num .cell-wrap .number').text(v.num);

            } else if (v.areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                item = painter.createQuote(v.index, v).appendTo(cpList);
            } else {
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

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) { // 综合
                type = constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT;
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT && itemType == constant.data().quotationItem.TYPE_COST_INT) { // 工程量 && 成本
                type = constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT;
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT && itemType == constant.data().quotationItem.TYPE_UNACHE_INT) { // 工程量 && 非业绩
                type = constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT;
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT && itemType == constant.data().quotationItem.TYPE_HIDE_INT) { // 工程量 && 隐藏
                type = constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT;
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

            var num = quote.quotationFunctionAreaFormula(expres, $widget, 0);

            $item.find('.cell.formula .cell-wrap').text(num);
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
                $item.find('.icon-circle-arrow-down').hide();
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

                    "o": quo.house.floor ? quo.house.floor : 0, // 楼层
                    "of": quo.house.islift ? 0 : 1, // 有无电梯

                    "u": quo.basicParams["quotation.taxPrice"], // 税金
                    "v": quo.basicParams["quotation.managePrice"], // 管理费
                    "x": quo.basicParams["quotation.undisPrice"], // 不打折总额
                    "y": quo.basicParams["quotation.disPrice"], // 打折总额
                    "z": quo.basicParams["quotation.trafficPrice"], // 车运费
                    "w": initNum, // 工程量
                });
            }

            if (expres.indexOf('|') != -1) {

                var _pre = expres.split('|')[0];
                var _nex = expres.split('|')[1];

                expres = "Math.max(" + _pre + ", " + _nex + ")";
            }

            return utils.changeThrDecimal(isNaN(eval(expres)) ? 0 : eval(expres));
        },

        updateQuotationForTime: function() {

            com.post(api.quotation.updateQuotationForTime, {
                "quotation.qid": quo.basicParams["quotation.qid"],
                "quotation.workTime": quo.basicParams["quotation.workTime"],
                "quotation.audiTime": quo.basicParams["quotation.audiTime"]
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
                        quo.basicParams["quotation.audiTime"] += 1;
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
                        quo.basicParams["quotation.audiTime"] += 1;
                    }

                    if ($("#quotationPart").length == 0) {
                        clearInterval(params.quotation.pagesTimeId);
                        params.quotation.pagesTimeId = null;
                        quote.updateQuotationForTime();
                    }
                }, 1000);
            }

        },

        init: function() {

            this.saveCustomQuotesAdd();
            this.clearQuoteSelected();
            this.calculationNum();
            this.addHistoryQuotes();
            this.quotationEntryTime();
        }
    }

    var painter = {

        // 创建功能区
        createdomain: function(dv) {

            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var btnShow = [constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT, constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT].indexOf(dv.type) == -1;

            var _btnSet = {
                "$btnSort": ["根据工种排序", '<i class="bigger-125 icon-sort orange"></i>', dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT],
                "$btnEdit": ["编辑功能区", '<i class="bigger-125 icon-pencil blue"></i>', btnShow],
                "$btnAdd": ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT],
                "$btnSet": ["自定义报价项", '<i class="bigger-125  icon-plus-sign purple"></i>', btnShow],
                "$btnHistory": ["历史报价项", '<i class="bigger-125 icon-star green"></i>', btnShow],
                "$btnDelQuo": ["批量删除报价项", '<i class="bigger-125 icon-remove pink"></i>', btnShow],
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
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT || dv.type == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.functionAreaName));
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

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

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

                            "o": quo.house.floor ? quo.house.floor : 0, // 楼层
                            "of": quo.house.islift ? 0 : 1, // 有无电梯

                            "u": com.focusPage('#taxCost').find('.num .cell-wrap').text(),// 税金
                            "v": com.focusPage('#manageCost').find('.num .cell-wrap').text(),// 管理费
                            "x": com.focusPage('#undisPrice').text(),// 不打折总额
                            "y": com.focusPage('#disPrice').text(),// 打折总额
                            "z": com.focusPage('#conveyanceCost').find('.num .cell-wrap').text(),// 车运费
                        });
                    }

                    if (v.formula.indexOf('|') != -1) {

                        var _pre = v.formula.split('|')[0];
                        var _nex = v.formula.split('|')[1];

                        v.formula = "Math.max(" + _pre + ", " + _nex + ")";
                    }

                    v.formula = utils.changeThrDecimal(isNaN(eval(v.formula)) ? 0 : eval(v.formula));
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

            if (dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT && dv.type != constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) { // 管理区类型之外

                $btns.$btnEdit.click(function() {// 编辑功能区

                    domain.editDomain(dv.qfaId);
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
                $btns.$btnDelDomain.click(function() {// 删除功能区

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
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);

                if (v[2]) {
                    $cell.attr(v[2][0], v[2][1]);
                }

                if (v[0] == "num" && qv.expres) {

                    var $update = $('<i class="icon-circle-arrow-down icon-rotate-180 blue" style=" display: none; padding-left: 3px; cursor: pointer"></i>');

                    $cellWrap.append($update);

                    $update.click(function() {

                        quote.checkedExpres($item);
                    });
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
                    "padding-left": "5px",
                    'pointer-events': 'auto'
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
                    $btnset = $('<a></a>').css('visibility', 'hidden').append('<i class="bigger-125 icon-cog purple"></i>');
                    $btnCellWrap.append($btnset).appendTo($btnCell);
                    $item.append($btnCell);
                }
            }

            $item.attr('data-expres', qv.expres ? qv.expres : "");
            $item.attr('data-qfaiid', qv.qfaiId);
            $item.attr('data-qiid', qv.quotationItemId);
            $item.attr('data-addPrice', qv.addPrice);
            $item.attr('data-subPrice', qv.subPrice);
            $item.attr('data-isRtem', qv.isRtem == 1 ? 1 : 0);

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

            $dwrap.append($dorder).append("|").append($dname);
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
                com.focusPage('#innerArea').text(res.decoration.house.innerArea);

                quo.decoration = res.decoration;
                quo.house = res.decoration.house;

                quo.decorationType = res.decoration.type;
                quo.precontractTime = res.decoration.precontractTime;

                quo.notSalesmanRate = res.decoration.notSalesmanRate ? res.decoration.notSalesmanRate : 0; // 非业务人员提点比例
            }, null, false);

            // 管理费选择弹层初始化
            com.post(api.quotation.queryQuotationForConfig, {}, function(res) {

                // 将管理费取出 放入select标签中(下拉框)
                com.focusPage('#manageRate').bindData(res.configs.manageRates);
            });

            // 根据报价ID 获取报价信息(同步ajax)
            com.post(api.quotation.queryQuotationById, {
                "quotation.qid": quo.quotationid
            }, function(data) {

                var quotation = data.quotation;

                quo.defaults =  quotation.defaults;

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
                    "quotation.undisComPrice": quotation.undisComPrice, // 综合不打折总额
                    "quotation.disComPrice": quotation.disComPrice, // 综合打折总额
                    "quotation.consPrice": quotation.consPrice, // 工程总额
                    "quotation.comsPrice": quotation.comsPrice, // 主材总额
                    "quotation.updateTime": quotation.updateTime,
                    "quotation.workTime": quotation.workTime,
                    "quotation.audiTime": quotation.audiTime
                };

                com.focusPage('#quotationName').text(quotation.quotationName); // 左上角显示报价名称
                com.focusPage('#basePrice').text(quotation.basePrice);
                com.focusPage('#sumLabDiscount').text(quotation.discount); // 左上角显示的折扣

                if (params.urlLoadParams.type != null && quotation.attstatus == constant.quotation().quotation.ATTSTATUS_FINISH_INT) {
                    com.focusPage('#preferBtn').css('pointer-events','none');
                    com.focusPage('#quotationFnBtn').css('pointer-events','none');
                    com.focusPage('#functionAreaDetailList').css('pointer-events','none');
                }
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
                }

                com.focusPage('#presentPrefer').val(quotationPrefer.presignProduce && quotationPrefer.presignProduce.name ? quotationPrefer.presignProduce.name : "无");
            }, null, false);

            com.post(api.quotation.queryExtensionByOrderId, {
                "extension.orderId": quo.orderid
            }, function(res) {

                $.each(res.extensions, function(i, v) {

                    quo.extensionManagePrice = utils.accAdd(quo.extensionManagePrice, v.type == constant.quotation().extension.TYPE_ADD_INT ? v.managePrice : -v.managePrice);
                });

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
                            _comsPrice = utils.accAdd(_comsPrice, comns);
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_NOT_COUNT_INT) { // 不计算
                            painter.createDomainMoney(0, v).appendTo(com.focusPage('#functionAreaSumList'));
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_COST_INT) {

                            sum = parseFloat($domain.attr('data-undisPrice'));// 功能区非打折项总价
                            cons = parseFloat($domain.attr('data-consPrice'));
                            coms = parseFloat($domain.attr('data-comsPrice'));

                            painter.createDomainMoney(utils.changeThrDecimal(sum), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _costPrice = utils.accAdd(_costPrice, sum);
                            _consPrice = utils.accAdd(_consPrice, cons);
                            _comsPrice = utils.accAdd(_comsPrice, comns);
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
                            _comsPrice = utils.accAdd(_comsPrice, comns);
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

                    _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? _discount : 1; // 车运费折扣
                    _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? _discount : 1; // 管理费折扣
                    _taxDiscount = taxCost.find('.discountprice').attr('data-discount');// 税金折扣

                    _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text() == "" ? 0 : manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
                    _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text() == "" ? 0 : converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
                    _taxRate = parseFloat(taxCost.find('.discountprice .cell-wrap').text() == "" ? 0 : taxCost.find('.discountprice .cell-wrap').text()); // 获取税金比例(根据报价版本获得)

                    _transfee = utils.accMul(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _tranRate); // 未计算车运费之前的总价格*车运费比例=车运费
                    _managefee = utils.accMul(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _manageRate); // (未计算车运费之前的总价格+车运费)*管理费

                    _dtransfee = utils.accMul(_transfee, _transDiscount); // 车运费*车运费折扣
                    _dmanagefee = utils.accMul(_managefee, _manageDiscount); // (未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣,管理费
                    _dtaxfee = 0;

                    if (_taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
                        _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), preferPrice), managePrefer), advancePrefer), _taxRate));
                        _dtaxfee = utils.changeThrDecimal(utils.accMul(_taxfee, _manageDiscount));
                    }

                    if (_taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
                        _taxfee = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), preferPrice), managePrefer), advancePrefer), _taxRate));
                        _dtaxfee = _taxfee
                    }

                    _total = utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee), _managefee), _taxfee), preferPrice), managePrefer), advancePrefer); // 未计算车运费之前的总价格+车运费+管理费=(未打折的总价格)

                    if (quo.basicParams["quotation.basePrice"] && quo.basicParams["quotation.basePrice"] != 0) {
                        // (工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
                        var total = utils.accAdd(utils.accAdd(utils.accAdd(_disPrice, _undisPrice), quotePrice), _transfee); // 工程基数
                        var remainder = total % quo.basicParams['quotation.basePrice']; // 余数
                        _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), _discount), remainder), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer));
                    } else {
                        // (未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                        _dtotal = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), quotePrice), _dtransfee), _dmanagefee), _dtaxfee), preferPrice), managePrefer), advancePrefer));
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

                    if (!(quo.notSalesmanRate > 0 && quo.notSalesmanRate < 1)) {
                        com.focusPage('#notsalesPrice').text(quo.notSalesmanRate).parent("div").addClass("show");
                    } else {
                        com.focusPage('#notsalesPrice').text(0).parent("div").addClass("hide");
                    }

                    if (quo.decorationType != constant.decoration().decoration.TYPE_INCLUSIVE_INT) {
                        com.focusPage('#innerAreaShow').hide();
                        com.focusPage('#preferBtn').hide();
                        com.focusPage('#quotePriceShow').hide();
                        com.focusPage('#presentPreferShow').hide();
                        com.focusPage('#squareShow').hide();
                        com.focusPage('#countQuotePriceShow').hide();
                        com.focusPage('#countTotalPriceShow').hide();
                    }

                    if (quo.decorationType == constant.decoration().decoration.TYPE_MIDPACK_INT) {
                        com.focusPage('#innerAreaShow').show();
                        com.focusPage('#preferBtn').show();
                        com.focusPage('#preferShow').hide();
                        com.focusPage('#manageShow').hide();
                        com.focusPage('#advanceShow').hide();
                        com.focusPage('#squareShow').show();
                    }

                    if (advancePrefer != 0) {
                        com.focusPage('#advancePreferShow').show();
                        com.focusPage('#advanceShow').show();
                    } else {
                        com.focusPage('#advancePreferShow').hide();
                        com.focusPage('#advanceShow').hide();
                    }

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

            if (params.urlLoadParams.type != null) {
                com.focusPage('#quotationPart').attr("id", "quotationPartPage");
            }

            if (params.urlLoadParams.type != null && params.quotation.attpaging == null) {
                com.focusPage('#pauseTimerBtn', '#quotationPartPage').hide();
            }

            if (params.urlLoadParams.type == null && params.quotation.attpages == null) {
                com.focusPage('#pauseTimerBtn', '#quotationPart').hide();
            }

            com.focusPage('#openFunctionAreasBtn').css('pointer-events','auto');
            com.focusPage('#closeFunctionAreasBtn').css('pointer-events','auto');
            com.focusPage('#calculateTotalBtn').css('pointer-events','auto');
            com.focusPage('#viewStatisticalBtn').css('pointer-events','auto');
            com.focusPage('#detailBckBtn').css('pointer-events','auto');
            com.focusPage('.icon-chevron-up').css('pointer-events','auto');
            com.focusPage('.icon-chevron-down').css('pointer-events','auto');

            quo.init();
            domain.init();
            quote.init();
        }
    };

})();

$(function() {

    QuotationDetail.init();
});