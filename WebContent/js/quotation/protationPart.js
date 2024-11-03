var protationPart = (function() {

    var quo = {

        protationId: null, // 预签ID
        versionId: null, // 预签版本
        basicParams: null,
        presignProduce: null,

        modals: {},
        btns: {},

        // 定义左下角按钮重定义及指定弹窗显示
        initSettingBtns: function() {

            var that = this;

            that.btns = {
                // 保存
                $btnSave: com.focusPage('#saveProtationBtn').bindClick(function() { // 保存预签信息

                    com.post(api.quotation.updateProtationForAdvance, quo.basicParams, function(res) {

                        com.showAlert(com.info, "操作成功");
                    });
                }, 2000),
                // 打印
                $btnPrint: com.focusPage('#printFinanceBtn').click(function() {

                    params.quotation.protationId = quo.protationId;

                    var printConf = {
                        "type": 31
                    };

                    params.quotation.protation = {
                        "printConf": printConf
                    };

                    com.popup("打印预签", api.index.protationOutputIndex.url, null, null, true);
                }),
                // 返回
                $btnBack: com.focusPage('#detailBckBtn').on('click', function() {

                    com.showConfirm("当前页面存在重要数据,是否进行当前操作", function() {

                        com.switchPage("views/quotation/protationIndex.html");
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
                // 优惠价格修改
                $preferPriceBlueButton: com.focusPage('#preferPriceBlueButton').click(function() {

                    com.focusPage('#functionAreaPreferPrice').modal("show");

                    com.focusPage('#preferPrices').val(quo.basicParams["protation.preferPrice"]);
                    com.focusPage('#preferManage').val(quo.basicParams["protation.manageProfit"]);
                    com.focusPage('#preferAdvance').val(quo.basicParams["protation.advanceProfit"]);
                }),
            };
            return that;
        },
        // 左下角按钮的弹窗显示及处理 每个功能区右上角的编辑功能区,添加工程项,添加自定义工程项,历史记录,管理费比例设置 弹窗处理
        initQuoModals: function(areatype) {

            var that = this;

            that.modals = {
                // 添加默认预签项
                $quoteModal: com.focusPage("#protationItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
            };

            var extraParams = {
                "presignItem.ppid": quo.protation.ppid,
                "presignItem.status": 0
            };

            if (areatype == 0) {
                extraParams["types[0]"] = constant.data().presignItem.TYPE_BASICS_INT;
            } else if (areatype == 2) {
                extraParams["types[0]"] = constant.data().presignItem.TYPE_CUSTOM_INT;
            } else if (areatype == 4) {
                extraParams["types[0]"] = constant.data().presignItem.TYPE_ADDTION_INT;
            }

            var searcher = new Searcher();
            searcher.init(["quotation-presignItem-name", "quotation-presignItem-type"], "condList", api.quotation.pagePresignItem, function(data) {

                var $tableWrap = com.focusPage('#resultList').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($tableWrap);

                if (!data || data.length == 0)
                    return false;

                $.each(data, function(i, v) {

                    painter.createQuoteModalItem(v).appendTo($ul);
                });

                if (quote.quotesRecord.length == 0)
                    return false;

                $.each(quote.quotesRecord, function(index, val) {

                    var $input = com.focusPage('input[name="modalQuots"][value="' + $(val).val() + '"]');
                    $input.length && ($input.prop('checked', true));
                });
            }, "pagenation", "protationPartItemPostData", extraParams);

            return that;
        },
        calculateQuoFees: function(func) {

            var basic = 0, comd = 0, comm = 0, addd = 0, addm = 0, subd = 0, subm = 0, subc = 0, total = 0, cost = 0, profit = 0, accm = 0, accd = 0;

            var $domains = com.focusPage('#functionAreaDetailList .widget-box');

            if (!$domains.length) {
                return false;
            }

            $domains.each(function() {

                var $this = $(this);

                var _basic = parseFloat($this.attr('data-basic'));
                var _comd = parseFloat($this.attr('data-comd'));
                var _comm = parseFloat($this.attr('data-comm'));
                var _addd = parseFloat($this.attr('data-addd'));
                var _addm = parseFloat($this.attr('data-addm'));
                var _subd = parseFloat($this.attr('data-subd'));
                var _subm = parseFloat($this.attr('data-subm'));
                var _subc = parseFloat($this.attr('data-subc'));
                var _accm = parseFloat($this.attr('data-accm'));
                var _accd = parseFloat($this.attr('data-accd'));
                var _cost = parseFloat($this.attr('data-cost'));

                basic = utils.changeThrDecimal(utils.accAdd(basic, _basic));
                comd = utils.changeThrDecimal(utils.accAdd(comd, _comd));
                comm = utils.changeThrDecimal(utils.accAdd(comm, _comm));
                addd = utils.changeThrDecimal(utils.accAdd(addd, _addd));
                addm = utils.changeThrDecimal(utils.accAdd(addm, _addm));
                subd = utils.changeThrDecimal(utils.accAdd(subd, _subd));
                subm = utils.changeThrDecimal(utils.accAdd(subm, _subm));
                subc = utils.changeThrDecimal(utils.accAdd(subc, _subc));
                accm = utils.changeThrDecimal(utils.accAdd(accm, _accm));
                accd = utils.changeThrDecimal(utils.accAdd(accd, _accd));
                cost = utils.changeThrDecimal(utils.accAdd(cost, _cost));

                var amount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_basic, utils.accAdd(_addd, utils.accSub(_addm, utils.accAdd(utils.accAdd(_subd, _subm), subc)))), utils.accAdd(_accm, _accd)));

                total = utils.changeThrDecimal(utils.accAdd(total, amount));

            });

            var _discout = utils.changeThrDecimal(utils.accDiv(utils.accSub(quo.basicParams["protation.quotePrice"], quo.basicParams["protation.preferPrice"]), quo.basicParams["protation.quotePrice"]));

            _discout = _discout < 0 ? 0 : _discout > 1 ? 1 : _discout;

            if (utils.accMul(_discout, 10) < quo.presignProduce.discount) {

                com.showAlert(com.warning, "优惠金额不合理");

                return false;
            }

            var manageFormula = quo.basicParams["protation.manageFormula"] ? quo.basicParams["protation.manageFormula"] : "0";

            if (manageFormula.indexOf("{") != -1 || manageFormula.indexOf("}") != -1) {
                manageFormula = com.format(manageFormula, {
                    "a": quo.basicParams["protation.quotePrice"],
                    "b": quo.basicParams["protation.preferPrice"],
                    "c": basic,
                    "d": utils.accAdd(addd, addm),
                    "e": utils.accAdd(utils.accAdd(subd, subm), subc),
                    "f": utils.accAdd(accm, accd),
                    "h": quo.basicParams["protation.advanceProfit"]
                });
            }

            var _managePrice = utils.changeThrDecimal(isNaN(eval(manageFormula)) ? 0 : eval(manageFormula));

            var taxFormula = quo.basicParams["protation.taxFormula"] ? quo.basicParams["protation.taxFormula"] : "0";

            if (taxFormula.indexOf("{") != -1 || taxFormula.indexOf("}") != -1) {
                taxFormula = com.format(taxFormula, {
                    "a": quo.basicParams["protation.quotePrice"],
                    "b": quo.basicParams["protation.preferPrice"],
                    "c": basic,
                    "d": utils.accAdd(addd, addm),
                    "e": utils.accAdd(utils.accAdd(subd, subm), subc),
                    "f": utils.accAdd(accm, accd),
                    "g": _managePrice,
                    "h": quo.basicParams["protation.advanceProfit"],
                    "i": quo.basicParams["protation.manageProfit"]
                });
            }

            var _taxPrice = utils.changeThrDecimal(isNaN(eval(taxFormula)) ? 0 : eval(taxFormula));

            total = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(quo.basicParams["protation.quotePrice"], _managePrice), _taxPrice), quo.basicParams["protation.preferPrice"]), quo.basicParams["protation.manageProfit"]), quo.basicParams["protation.advanceProfit"]));
            total = utils.changeThrDecimal(utils.accAdd(total, utils.accAdd(utils.accAdd(basic, utils.accAdd(addd, utils.accSub(addm, utils.accAdd(utils.accAdd(subd, subm), subc)))), utils.accAdd(accm, accd))));

            _discout = utils.changeThrDecimal(utils.accMul(_discout, 10));

            quo.basicParams["protation.basicPrice"] = basic;
            quo.basicParams["protation.comdPrice"] = comd;
            quo.basicParams["protation.commPrice"] = comm;
            quo.basicParams["protation.adddPrice"] = addd;
            quo.basicParams["protation.addmPrice"] = addm;
            quo.basicParams["protation.subdPrice"] = subd;
            quo.basicParams["protation.submPrice"] = subm;
            quo.basicParams["protation.subcPrice"] = subc;
            quo.basicParams["protation.accmPrice"] = accm;
            quo.basicParams["protation.accdPrice"] = accd;
            quo.basicParams["protation.totalPrice"] = total;
            quo.basicParams["protation.managePrice"] = _managePrice;
            quo.basicParams["protation.taxPrice"] = _taxPrice;
            quo.basicParams["protation.discount"] = _discout;

            com.focusPage('#houstCost').text(cost);

            cost = utils.accAdd(utils.accAdd(utils.accMul(quo.basicParams["protation.addmPrice"], quo.basicParams["protation.mostRate"]), utils.accMul(quo.basicParams["protation.adddPrice"], quo.basicParams["protation.costRate"])), utils.accAdd(quo.basicParams["protation.mostCost"], utils.accAdd(utils.accMul(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.costPrice"]), cost)));

            quo.basicParams["protation.basicCost"] = utils.accMul(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.costPrice"]);
            quo.basicParams["protation.addCost"] = utils.accAdd(utils.accMul(quo.basicParams["protation.adddPrice"], quo.basicParams["protation.costRate"]), utils.accMul(quo.basicParams["protation.addmPrice"], quo.basicParams["protation.mostRate"]));

            quo.basicParams["protation.totalCost"] = cost;

            com.focusPage('#preferPrice').text(quo.basicParams["protation.preferPrice"]);
            com.focusPage('#basicCost').text(quo.basicParams["protation.basicCost"]);
            com.focusPage('#materialCost').text(quo.basicParams["protation.mostCost"]);
            com.focusPage('#addCost').text(quo.basicParams["protation.addCost"]);
            com.focusPage('#totalCost').text(quo.basicParams["protation.totalCost"]);
            com.focusPage('#discount').text(_discout);
            com.focusPage('#managePrice').text(quo.basicParams["protation.managePrice"]);
            com.focusPage('#taxPrice').text(quo.basicParams["protation.taxPrice"]);
            com.focusPage('#quoteArea').text(quo.basicParams["protation.quoteArea"]);
            com.focusPage('#manageProfit').text(quo.basicParams["protation.manageProfit"]);
            com.focusPage('#advanceProfit').text(quo.basicParams["protation.advanceProfit"]);

            profit = utils.changeThrDecimal(utils.accSub(1.0, utils.accDiv(cost, utils.accSub(total, quo.basicParams["protation.activityAmount"]))));

            com.focusPage('#profitRate').text(profit);

            com.focusPage('#sumquoSumMoney').text(total);

            if (quo.basicParams["protation.advanceProfit"] != 0) {
                com.focusPage('#advanceProfitShow').show();
                com.focusPage('#preferAdvanceShow').show();
            } else {
                com.focusPage('#advanceProfitShow').hide();
                com.focusPage('#preferAdvanceShow').hide();
            }

            return true;
        },

        calculateDomainFees: function($domain, func) {

            var basic = 0, comd = 0, comm = 0, addd = 0, addm = 0, subd = 0, subm = 0, subc = 0, cost = 0, accm = 0, accd = 0, total = 0;

            var $arr = com.focusPage('.fl-quo-item.item', $domain);

            $arr.each(function() {

                $this = $(this);

                if (func)
                    func($this);

                var _type = $this.find(".cell.type").attr("data-type");

                var _total = $this.attr("data-total");
                var _cost = $this.attr("data-cost");

                cost = utils.changeThrDecimal(utils.accAdd(cost, _cost));

                if (_type == constant.quotation().protationItem.TYPE_BASE_INT)
                    basic = utils.changeThrDecimal(utils.accAdd(basic, _total));
                if (_type == constant.quotation().protationItem.TYPE_PROJECT_INT)
                    comd = utils.changeThrDecimal(utils.accAdd(comd, _total));
                if (_type == constant.quotation().protationItem.TYPE_PRINCIPAL_INT)
                    comm = utils.changeThrDecimal(utils.accAdd(comm, _total));
                if (_type == constant.quotation().protationItem.TYPE_ADDWORK_INT)
                    addd = utils.changeThrDecimal(utils.accAdd(addd, _total));
                if (_type == constant.quotation().protationItem.TYPE_ADDMAIN_INT)
                    addm = utils.changeThrDecimal(utils.accAdd(addm, _total));
                if (_type == constant.quotation().protationItem.TYPE_CUTWORK_INT)
                    subd = utils.changeThrDecimal(utils.accAdd(subd, _total));
                if (_type == constant.quotation().protationItem.TYPE_CUTMAIN_INT)
                    subm = utils.changeThrDecimal(utils.accAdd(subm, _total));
                if (_type == constant.quotation().protationItem.TYPE_CUTCURRENT_INT)
                    subc = utils.changeThrDecimal(utils.accAdd(subc, _total));
                if (_type == constant.quotation().protationItem.TYPE_ACCMAIN_INT)
                    accm = utils.changeThrDecimal(utils.accAdd(accm, _total));
                if (_type == constant.quotation().protationItem.TYPE_ACCWORK_INT)
                    accd = utils.changeThrDecimal(utils.accAdd(accd, _total));

            });

            $domain.attr('data-basic', basic);
            $domain.attr('data-comd', comd);
            $domain.attr('data-comm', comm);
            $domain.attr('data-addd', addd);
            $domain.attr('data-addm', addm);
            $domain.attr('data-subd', subd);
            $domain.attr('data-subm', subm);
            $domain.attr('data-subc', subc);
            $domain.attr('data-accm', accm);
            $domain.attr('data-accd', accd);
            $domain.attr('data-cost', cost);

            return utils.changeThrDecimal(utils.accAdd(utils.accAdd(basic, utils.accAdd(addd, utils.accSub(addm, utils.accAdd(utils.accAdd(subd, subm), subc)))), utils.accAdd(accm, accd)));
        },
        calculateNowQuoteItem: function(num, areaType, $nowLine) {

            var type = $nowLine.find(".cell.type").attr("data-type");

            var cost = parseFloat($nowLine.find('.unitprice').attr("data-cost"));
            var price = parseFloat($nowLine.find('.unitprice .cell-wrap').text());// 单价
            var basicNum = parseFloat($nowLine.find('.unit .cell-wrap').text());

            var _areaCale = $nowLine.attr('data-areaCale') == constant.data().presignItem.AREACALE_AREA_INT ? quo.basicParams["protation.quoteArea"] : 1;

            var _total = 0;
            var _cost = 0;

            if (type == constant.quotation().protationItem.TYPE_BASE_INT) {
                _total = utils.changeThrDecimal(utils.accMul(utils.accMul(price, utils.accSub(num, basicNum)), _areaCale));
                _cost = utils.changeThrDecimal(utils.accMul(cost, utils.accSub(num, basicNum)));
            }

            if (type == constant.quotation().protationItem.TYPE_ADDWORK_INT || type == constant.quotation().protationItem.TYPE_ADDMAIN_INT) { // 个性
                _total = utils.changeThrDecimal(utils.accMul(utils.accMul(price, num), _areaCale));
                _cost = utils.changeThrDecimal(utils.accMul(cost, num));
            }

            if (type == constant.quotation().protationItem.TYPE_CUTWORK_INT || type == constant.quotation().protationItem.TYPE_CUTMAIN_INT || type == constant.quotation().protationItem.TYPE_CUTCURRENT_INT) { // 增主材
                _total = utils.changeThrDecimal(utils.accMul(utils.accMul(price, num), _areaCale));
                _cost = utils.changeThrDecimal(utils.accMul(cost, num));
            }

            if (type == constant.quotation().protationItem.TYPE_ACCWORK_INT || type == constant.quotation().protationItem.TYPE_ACCMAIN_INT) { // 赋能
                _total = utils.changeThrDecimal(utils.accMul(utils.accMul(price, num), _areaCale));
                _cost = utils.changeThrDecimal(utils.accMul(cost, num));
            }

            $nowLine.find('.totalprice-discount .cell-wrap').text(_total); // 折扣单价*数量

            $nowLine.attr('data-total', _total);
            $nowLine.attr('data-cost', _cost);

            var _fee = quo.calculateDomainFees(domain.nowEditDomain);

            return _fee;
        },
        init: function() {

            this.initQuoModals();
            this.initSettingBtns();
        }
    };

    // 功能区
    var domain = {

        nowEditDomain: null,

        // 保存默认预签项 添加工程项按钮
        saveQuotesToDomain: function() {

            com.focusPage('#addFunctionAreaItemsBtn').click(function() {

                quote.addDefaultQuotes();
                quo.modals.$quoteModal.modal("hide");
            });
        },
        deleteQuotesToDomain: function() {

            quo.modals.$quoteModal.on('hide.bs.modal', function() {

                quote.quotesRecord = [];
            });
        },
        // 绑定各种关于预签的操作
        init: function() {

            this.saveQuotesToDomain();
            this.deleteQuotesToDomain();
        }

    };
    // 预签
    var quote = {

        quotesRecord: [],
        $nowLine: null,
        $nowEditInput: null,

        getNumCellFocus: function($line) {

            var that = this;

            var $numCell = $line.find('.cell.formula');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $line.parents('.widget-body-inner').find('.fl-quo-input');

            domain.nowEditDomain = $line.parents('.widget-box');
            quote.checkedStyle($line);

            $editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();

            that.$nowLine = $line;
            that.$nowEditInput = $editInput;
            that.$nowEditInput.find('input').off('keydown').on("keydown", function(e) {

                that.bindInputKeydown($(this).val(), e);
            });
        },
        bindInputKeydown: function(formula, e) { // 回车添加

            var that = this;
            var $line = null;

            if (e.keyCode == 13) { // keyCode码 13为回车符
                try {
                    formula = formula.replace(/\s+/g, "");
                    var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)/;
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

                // 获取下一个预签项的整体元素标签
                $line = that.$nowLine.next('.fl-quo-item.item');

                // 获取预签项的类型
                var _type = that.$nowLine.find('.type').attr('data-type');
                var _basicNum = that.$nowLine.find('.unit .cell-wrap').text();

                if (_type == constant.quotation().protationItem.TYPE_BASE_INT && num < _basicNum) {
                    com.showAlert(com.warning, "工程量不能小于基础数量");
                    return false;
                }

                var args = {
                    "protationItem.piid": that.$nowLine.find('input[name="deleteItems"]').val(), // 预签项Id, 可空 ;
                    "protationItem.name": that.$nowLine.find('.name .cell-wrap').text(), // 预签项名

                    "protationItem.price": that.$nowLine.find('.unitprice .cell-wrap').text(), // 单价 ;
                    "protationItem.num": that.$nowLine.find('.num .cell-wrap').text(), // 数量;
                    "protationItem.type": that.$nowLine.find('.type').attr("data-type"), // 类型
                    "protationItem.areaCale": that.$nowLine.attr("data-areaCale"), // 面积规则
                    "protationItem.basicNum": that.$nowLine.attr("data-basicNum"), // 基础量
                    "protationItem.addPrice": that.$nowLine.attr("data-addPrice"),
                    "protationItem.subPrice": that.$nowLine.attr("data-subPrice"),
                    "protationItem.achePrice": that.$nowLine.attr("data-achePrice"),
                    "protationItem.cost": that.$nowLine.attr("data-cost"), // 成本 ;
                    "protationItem.onetype": that.$nowLine.attr("data-onetype"),
                    "protationItem.atttype": that.$nowLine.attr("data-atttype"),

                    "protationItem.ppiid": that.$nowLine.attr("data-ppiid"),
                };

                that.$nowLine.find('input[name="deleteItems"]').val(that.$nowLine.find('input[name="deleteItems"]').val());

                var _fee = quo.calculateNowQuoteItem(num, 1, that.$nowLine);

                if (!quo.calculateQuoFees()) {

                    that.$nowLine.find('.cell.formula .cell-wrap').text(oldFormula);
                    that.$nowLine.find('.cell.num .cell-wrap').text(oldNum);

                    quo.calculateNowQuoteItem(oldNum, 1, that.$nowLine);
                    quo.calculateQuoFees();

                    that.hideInputWrap();

                    return false;
                }

                com.clearValidator();

                var _params = $.extend({}, args, quo.basicParams);

                com.post(api.quotation.updateProtationItem, _params, function(res) {

                    // 选中左上角预签中的功能区ID 将总价格显示
                    com.focusPage('[data-pfaid="' + domain.nowEditDomain.attr('data-pfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                    that.$nowLine.find('input[name="deleteItems"]').val(res.protationItem.piid);
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    that.$nowLine.find('.cell.formula .cell-wrap').text(oldFormula);
                    that.$nowLine.find('.cell.num .cell-wrap').text(oldNum);

                    quo.calculateNowQuoteItem(oldNum, 1, that.$nowLine);
                    quo.calculateQuoFees();
                }, false);

                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }

                return false;
            }

            // 如果按键为上 调整焦点到功能区内上一个预签项
            if (e.keyCode == 38) {

                $line = that.$nowLine.prev('.fl-quo-item.item');

                if ($line.length) {
                    that.getNumCellFocus($line);
                } else {
                    that.hideInputWrap();
                }

                return false;
            }

            // 如果按键为下 调整焦点到功能区内的下一个预签项
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
        // 删除预签项
        deleteQuote: function($quote) {

            var that = this;

            var _total = $quote.find('.totalprice-discount .cell-wrap').text();
            var _pid = $quote.find('input[type="checkbox"]').val();
            var _params = {};

            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list.items')).addClass('hide');

            if (!_pid) {
                $quote.remove();
            } else {

                $quote.attr("data-total", 0);

                var _fee = quo.calculateDomainFees(domain.nowEditDomain);

                if (!quo.calculateQuoFees()) {

                    $quote.attr("data-total", _total);

                    quo.calculateDomainFees(domain.nowEditDomain);
                    quo.calculateQuoFees();

                    return false;
                }

                $quote.remove();

                com.focusPage('[data-pfaid="' + domain.nowEditDomain.attr('data-pfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);

                _params = $.extend({
                    "protationItem.piid": _pid
                }, quo.basicParams);

                com.post(api.quotation.deleteProtationItem, _params, function(res) {

                }, null, false);
            }
        },

        /**
         * 添加预签项的时候记住上一页选中的预签项 参数 $input : 正在操作的input标签 ischecked : 选举中或取消选中
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
         * 点击页面其他位置时清除表格行的选中样式
         */
        clearQuoteSelected: function() {

            var that = this;

            $('body').click(function(e) {

                if (!com.focusPage(e.target).is('.cell-wrap') && !com.focusPage(e.target).is('[data-action="collapse"]')) {
                    that.hideInputWrap();
                }
            });
        },

        /**
         * 删除上一个选中的预签项选中样式 并添加当前预签项选中样式
         */
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
                    var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)/;
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
        // 添加工程项 与 历史预签项 的保存按钮调用的保存方法
        addDefaultQuotes: function() {

            var _arrs = quote.quotesRecord;
            var _index = domain.nowEditDomain.find('.fl-quo-item.item').length;
            var _areaType = domain.nowEditDomain.attr("data-areatype");

            if (!_arrs.length) {
                return false;
            }

            $.each(_arrs, function(i, v) {

                var $this = com.focusPage(v);

                if ($this.val() && com.focusPage('input[data-qiid="' + $this.val() + '"]', domain.nowEditDomain).length) {
                    return false;
                }

                var type = parseInt($this.attr("data-type"));
                var atttype = parseInt($this.attr("data-atttype"));

                if (type == constant.data().presignItem.TYPE_BASICS_INT && _areaType == 0)
                    type = constant.quotation().protationItem.TYPE_BASE_INT;

                if (type == constant.data().presignItem.TYPE_OPTIONAL_INT && atttype == constant.data().presignItem.ATTTYPE_ENGINEERING_INT && _areaType == 1)
                    type = constant.quotation().protationItem.TYPE_PROJECT_INT;

                if (type == constant.data().presignItem.TYPE_OPTIONAL_INT && _areaType == 1)
                    type = constant.quotation().protationItem.TYPE_PRINCIPAL_INT;

                if (type == constant.data().presignItem.TYPE_CUSTOM_INT && atttype == constant.data().presignItem.ATTTYPE_ENGINEERING_INT && _areaType == 2)
                    type = constant.quotation().protationItem.TYPE_ADDWORK_INT;

                if (type == constant.data().presignItem.TYPE_CUSTOM_INT && _areaType == 2)
                    type = constant.quotation().protationItem.TYPE_ADDMAIN_INT;

                if (type == constant.data().presignItem.TYPE_ADDTION_INT && atttype == constant.data().presignItem.ATTTYPE_ENGINEERING_INT && _areaType == 4)
                    type = constant.quotation().protationItem.TYPE_ACCWORK_INT;

                if (type == constant.data().presignItem.TYPE_ADDTION_INT && _areaType == 4)
                    type = constant.quotation().protationItem.TYPE_ACCMAIN_INT;

                var _quotval = {
                    "name": $this.attr('data-name'),
                    "basicNum": $this.attr('data-itemUnite'),
                    "formula": '0',
                    "num": 0,
                    "qiid": "",
                    "type": type,
                    "price": $this.attr('data-itemPrice'),
                    "cost": $this.attr('data-cost'),
                    "ppiid": $this.val(),
                    "areaCale": $this.attr("data-areaCale"),
                    "addPrice": $this.attr("data-addPrice"),
                    "subPrice": $this.attr("data-subPrice"),
                    "achePrice": $this.attr("data-achePrice"),
                    "onetype": $this.attr("data-onetype"),
                    "atttype": $this.attr("data-atttype"),
                };

                var $item = painter.createQuote(_index + i + 1, _quotval).appendTo(domain.nowEditDomain.find('.fl-quo-list.items'));
            });
            quote.quotesRecord = [];
        },

        // 修改优惠价格保存按钮方法
        saveFunctionAreaPreferPrice: function() {

            com.focusPage('#saveFunctionAreaBtn').click(function() {

                var preferPrice = quo.basicParams["protation.preferPrice"];
                var manageProfit = quo.basicParams["protation.manageProfit"];
                var advanceProfit = quo.basicParams["protation.advanceProfit"];
                var discount = quo.basicParams["protation.discount"];

                var subd = quo.basicParams["protation.subdPrice"];
                var subm = quo.basicParams["protation.submPrice"];

                quo.basicParams["protation.preferPrice"] = com.focusPage('#preferPrices').val();
                quo.basicParams["protation.manageProfit"] = com.focusPage('#preferManage').val();
                quo.basicParams["protation.advanceProfit"] = com.focusPage('#preferAdvance').val();
                quo.basicParams["protation.discount"] = utils.accMul(utils.changeThrDecimal(utils.accDiv(utils.accSub(utils.accSub(quo.basicParams["protation.quotePrice"], utils.accAdd(subd, subm)), com.focusPage('#preferPrices').val()), utils.accSub(quo.basicParams["protation.quotePrice"], utils.accAdd(subd, subm)))), 10);

                if (quo.basicParams["protation.manageProfit"] > quo.basicParams["protation.managePrice"]) {

                    quo.basicParams["protation.preferPrice"] = preferPrice;
                    quo.basicParams["protation.manageProfit"] = manageProfit;
                    quo.basicParams["protation.advanceProfit"] = advanceProfit;
                    quo.basicParams["protation.discount"] = discount;

                    com.showAlert(com.warning, "管理优惠不能大于管理费");

                    return false;
                }

                if (!quo.calculateQuoFees()) {

                    quo.basicParams["protation.preferPrice"] = preferPrice;
                    quo.basicParams["protation.manageProfit"] = manageProfit;
                    quo.basicParams["protation.advanceProfit"] = advanceProfit;
                    quo.basicParams["protation.discount"] = discount;

                    quo.calculateQuoFees();

                    return false;
                }

                com.post(api.quotation.updateProtationForAdvance, quo.basicParams, function(res) {

                    com.focusPage('#functionAreaPreferPrice').modal("hide");
                    com.showAlert(com.info, "操作成功");

                });
            });
        },

        init: function() {

            this.clearQuoteSelected();
            this.calculationNum();
            this.saveFunctionAreaPreferPrice();
        }
    };

    var painter = {
        // 创建功能区
        createdomain: function(dv) {

            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var _btnSet = {
                "$btnAdd": ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type == 0 || dv.type == 2 || dv.type == 4],
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
            };

            var basic = 0, comd = 0, comm = 0, addd = 0, addm = 0, subd = 0, subm = 0, subc = 0, cost = 0, accm = 0, accd = 0, total = 0;

            $domain = $('<div></div>').addClass('widget-box transparent').attr({
                "data-dlevel": dv.functionAreaOrder, // 排序
                "data-pfaid": dv.pfaid, // 预签项中的功能区ID
                "data-areaType": dv.type, // 类型 功能区的type
                "data-total": dv.total,
                "data-cost": 0,
            }).css({
                "margin-bottom": "20px"
            });

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == constant.quotation().protationItem.TYPE_BASE_INT ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.name));
            $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

            $.each(_btnSet, function(k, v) {

                if (!v[2])
                    return true;

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

            var _lineSet = [["line", "0"], ["formula", "数量"], ["num", "数量"], ["name", "名称"], ["type", "类型"], ["unit", "基础量"], ["price", "单价"], ["price", "折后价"], ["price", "总价"], ["btns", "功能"]];

            var $ul = $('<ul></ul>').addClass('fl-quo-list');
            var $li = $('<li></li>').addClass('fl-quo-item').appendTo($ul);

            $.each(_lineSet, function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).appendTo($li);
                var $span = $('<span></span>').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list items');
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append($ul).append($dbody);

            if (dv.protationFunctionAreaItems.length) {
                // 功能区中的预签项
                var _items = dv.protationFunctionAreaItems;

                $.each(_items, function(i, v) {

                    var _areaCale = v.areaCale == constant.data().presignItem.AREACALE_AREA_INT ? quo.basicParams["protation.quoteArea"] : 1;

                    var $item = that.createQuote(i + 1, v).appendTo($list);

                    if (v.type == constant.quotation().protationItem.TYPE_BASE_INT) {
                        cost = utils.changeThrDecimal(utils.accAdd(cost, utils.accMul(v.cost, utils.accSub(v.num, v.basicNum))));
                    } else {
                        cost = utils.changeThrDecimal(utils.accAdd(cost, utils.accMul(v.cost, v.num)));
                    }

                    if (v.type == constant.quotation().protationItem.TYPE_BASE_INT)
                        basic = utils.changeThrDecimal(utils.accAdd(basic, utils.accMul(utils.accMul(v.price, utils.accSub(v.num, v.basicNum)), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_PROJECT_INT)
                        comd = utils.changeThrDecimal(utils.accAdd(comd, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_PRINCIPAL_INT)
                        comm = utils.changeThrDecimal(utils.accAdd(comm, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_ADDWORK_INT)
                        addd = utils.changeThrDecimal(utils.accAdd(addd, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_ADDMAIN_INT)
                        addm = utils.changeThrDecimal(utils.accAdd(addm, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_CUTWORK_INT)
                        subd = utils.changeThrDecimal(utils.accAdd(subd, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_CUTMAIN_INT)
                        subm = utils.changeThrDecimal(utils.accAdd(subm, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_CUTCURRENT_INT)
                        subc = utils.changeThrDecimal(utils.accAdd(subc, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_ACCMAIN_INT)
                        accm = utils.changeThrDecimal(utils.accAdd(accm, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                    if (v.type == constant.quotation().protationItem.TYPE_ACCWORK_INT)
                        accd = utils.changeThrDecimal(utils.accAdd(accd, utils.accMul(utils.accMul(v.price, v.num), _areaCale)));
                });
            }

            $btns.$btnAdd && $btns.$btnAdd.click(function() {// 添加工程预签项

                domain.nowEditDomain = $domain;
                var areatype = $(this).parents(".widget-box.transparent").attr("data-areatype");
                quo.initQuoModals(areatype);
                quo.modals.$quoteModal.modal("show");
                com.focusPage('#addItemFunctionAreaIndex').val(dv.qfaId);
            });

            $domain.attr('data-cost', cost);
            $domain.attr('data-basic', basic);
            $domain.attr('data-comd', comd);
            $domain.attr('data-comm', comm);
            $domain.attr('data-addd', addd);
            $domain.attr('data-addm', addm);
            $domain.attr('data-subd', subd);
            $domain.attr('data-subm', subm);
            $domain.attr('data-subc', subc);
            $domain.attr('data-accm', accm);
            $domain.attr('data-accd', accd);

            return $domain;
        },
        // 创建预签项
        createQuote: function(linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content);

            var _dcp = 0;
            var _num = qv.num;
            var _unitPrice = qv.price;
            var _type = qv.type % 2;
            var _total = 0;
            var _cost = 0;
            var _typeName = "-";
            var _areaCale = qv.areaCale == constant.data().presignItem.AREACALE_AREA_INT ? quo.basicParams["protation.quoteArea"] : 1;

            if (_type == 1) {
                _typeName = "工程";
                _total = qv.type == constant.quotation().protationItem.TYPE_PROJECT_INT ? _total : utils.changeThrDecimal(utils.accMul(utils.accMul(_unitPrice, _num), _areaCale));
            } else {
                _typeName = "主材";
                _total = qv.type == constant.quotation().protationItem.TYPE_PRINCIPAL_INT ? _total : utils.changeThrDecimal(utils.accMul(utils.accMul(_unitPrice, _num), _areaCale));
            }

            if (qv.type == constant.quotation().protationItem.TYPE_BASE_INT) {
                _typeName = "信息";
                _total = utils.changeThrDecimal(utils.accMul(utils.accMul(_unitPrice, utils.accSub(_num, qv.basicNum)), _areaCale));
            }

            if ([constant.quotation().protationItem.TYPE_PRCURRENT_INT, constant.quotation().protationItem.TYPE_CUTCURRENT_INT].indexOf(qv.type) != -1) {
                _typeName = "通用";
                _total = qv.type == constant.quotation().protationItem.TYPE_PRCURRENT_INT ? 0 : utils.changeThrDecimal(utils.accMul(utils.accMul(_unitPrice, _num), _areaCale));
            }

            var _lineSet = [];
            _lineSet.push(["line", linenum, ["data-areaType", qv.areaType]]); // 编号
            _lineSet.push(["formula", qv.num ? qv.num : "0"]); // 公式
            _lineSet.push(["num", qv.num, ["data-subtype", qv.subtype]]); // 数量
            _lineSet.push(["name", qv.name, ["data-piid", qv.piid]]); // 预签名称
            _lineSet.push(["type", _typeName, ["data-type", qv.type]]);
            _lineSet.push(["unit", qv.basicNum]); // 基础量
            _lineSet.push(["price unitprice", _unitPrice, ["data-cost", qv.cost]]); // 单价
            _lineSet.push(["price discountprice", _unitPrice]);
            _lineSet.push(["price totalprice-discount", _total]);

            var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel;

            $.each(_lineSet, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[0]).appendTo($item);
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]).appendTo($cell);

                if (v[2]) {
                    $cell.attr(v[2][0], v[2][1]);
                }
            });

            $btnCell = $('<div></div>').addClass('cell btns');
            $btnCellWrap = $('<div></div>').addClass('cell-wrap');
            $inputLable = $('<label></label>');
            $input = $('<input>').addClass('cbox ace').attr({
                "type": "checkbox",
                "role": "checkbox",
                "name": "deleteItems",
                "data-qiid": qv.qiid ? qv.qiid : "",
                "data-ppiid": qv.ppiid,
            }).val(qv.piid);
            $ispan = $('<span></span>').addClass('lbl align-top');

            $inputLable.append($input).append($ispan);
            $btnCellWrap.appendTo($btnCell);
            $item.append($btnCell);

            $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)"
            }).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-remove pink"></i>').mouseenter(function() {

                // com.showTip(this, "删除预签项", "top");
            });

            if ([constant.quotation().protationItem.TYPE_BASE_INT, constant.quotation().protationItem.TYPE_PROJECT_INT, constant.quotation().protationItem.TYPE_PRINCIPAL_INT, constant.quotation().protationItem.TYPE_PRCURRENT_INT].indexOf(qv.type) != -1) {
                $input.attr("disabled", "disabled");
            }

            $btnCellWrap.append($inputLable).append($btnDel);

            // 各种绑定事件
            $item.click(function() {// 编辑数量

                quote.getNumCellFocus($item);

            });

            // 删除预签项
            $btnDel.click(function(e) {

                e.stopPropagation();

                var _domain = com.focusPage('.widget-box[data-pfaid="4"]').find(".fl-quo-list.items");
                var _index = _domain.find(".fl-quo-item").length;

                var args = $.extend({}, qv);

                args.num = 0;
                args.piid = null;
                args.ppiid = qv.ppiid;

                if ([constant.quotation().protationItem.TYPE_BASE_INT, constant.quotation().protationItem.TYPE_ADDWORK_INT, constant.quotation().protationItem.TYPE_ADDMAIN_INT, constant.quotation().protationItem.TYPE_CUTWORK_INT, constant.quotation().protationItem.TYPE_CUTMAIN_INT, constant.quotation().protationItem.TYPE_CUTCURRENT_INT].indexOf(qv.type) != -1 || ([constant.quotation().protationItem.TYPE_PROJECT_INT, constant.quotation().protationItem.TYPE_PRINCIPAL_INT, constant.quotation().protationItem.TYPE_ACCWORK_INT, constant.quotation().protationItem.TYPE_ACCMAIN_INT].indexOf(qv.type) != -1 && qv.onetype != constant.quotation().protationItem.ONETYPE_MATESUB_INT))
                    quote.deleteQuote($item);

                if ([constant.quotation().protationItem.TYPE_PROJECT_INT, constant.quotation().protationItem.TYPE_PRINCIPAL_INT, constant.quotation().protationItem.TYPE_PRCURRENT_INT].indexOf(qv.type) != -1 && qv.onetype == constant.quotation().protationItem.ONETYPE_MATESUB_INT) {

                    args.type = args.type == constant.quotation().protationItem.TYPE_PRCURRENT_INT ? constant.quotation().protationItem.TYPE_CUTCURRENT_INT : args.type + 4;

                    painter.createQuote(_index + 1, args).appendTo(_domain);
                }

                if ([constant.quotation().protationItem.TYPE_ACCWORK_INT, constant.quotation().protationItem.TYPE_ACCMAIN_INT].indexOf(qv.type) != -1 && qv.onetype == constant.quotation().protationItem.ONETYPE_MATESUB_INT) {

                    args.type = args.type - 2;
                    args.price = args.subPrice;

                    painter.createQuote(_index + 1, args).appendTo(_domain);
                }

                return false;
            });

            $item.attr("data-ppiid", qv.ppiid);
            $item.attr("data-areaCale", qv.areaCale);
            $item.attr("data-basicNum", qv.basicNum);
            $item.attr("data-addPrice", qv.addPrice);
            $item.attr("data-subPrice", qv.subPrice);
            $item.attr("data-achePrice", qv.achePrice);
            $item.attr('data-cost', qv.cost);
            $item.attr("data-onetype", qv.onetype);
            $item.attr("data-atttype", qv.atttype);
            $item.attr('data-total', _total);

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

        // 创建添加预签项天窗中的预签项
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
                "data-cost": v.cost,
                "data-itemPrice": v.price,
                "data-itemUnite": v.basicNum,
                "data-addPrice": v.addPrice,
                "data-subPrice": v.subPrice,
                "data-achePrice": v.achePrice,
                "data-des": v.common,
                "data-type": v.type,
                "data-onetype": v.onetype,
                "data-atttype": v.atttype,
                "data-areaCale": v.areaCale,
            }).val(v.piid);
            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.name);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [];

            propertyArr.push(["类型: ", constant.data().presignItem.type.keys[v.type], "red"]);
            propertyArr.push(["单位: ", v.basicNum, "red"]);
            propertyArr.push(["单价: ", v.price, "blue"]);
            propertyArr.push(["说明: ", v.content, "grey"]);

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

            $dwrap.append($dorder).append("  ").append($dname);
            $item.attr("data-pfaid", v.pfaid).append($dwrap).append($dsum);// 存入功能区ID

            return $item;
        }
    };

    return {

        init: function() {

            quo.decorationOrderId = params.quotation.protation.orderId;
            quo.protationId = params.quotation.protation.pid;

            com.post(api.quotation.queryProtationByPid, {
                "protation.pid": quo.protationId
            }, function(data) {

                // 左上角显示预签产品名称
                com.focusPage('#product').text(data.protation.product);

                // 左上角显示预签名称
                com.focusPage('#protationName').text(data.protation.name);

                // 将预签数据获取到全局变量中
                quo.basicParams = {
                    "protation.pid": data.protation.pid,// 预签Id
                    "protation.quotePrice": data.protation.quotePrice, // 起预签
                    "protation.quoteArea": data.protation.quoteArea, // 起报面积
                    "protation.unitPrice": data.protation.unitPrice, // 起报面积
                    "protation.costPrice": data.protation.costPrice, // 成本单价
                    "protation.totalCost": data.protation.totalCost, // 成本总额
                    "protation.totalProfit": data.protation.totalProfit, // 利润总额
                    "protation.costRate": data.protation.costRate,// 工程增项成本比例
                    "protation.mostRate": data.protation.mostRate,// 主材增项成本比例
                    "protation.mostPrice": data.protation.mostPrice,// 主材成本
                    "protation.preferPrice": data.protation.preferPrice, // 优惠价
                    "protation.managePrice": data.protation.managePrice, // 管理费
                    "protation.profitRate": data.protation.profitRate, // 利润率
                    "protation.basicPrice": data.protation.basicPrice, // 基础额
                    "protation.comdPrice": data.protation.comdPrice, // 工程额
                    "protation.commPrice": data.protation.commPrice, // 主材额
                    "protation.adddPrice": data.protation.adddPrice, // 增工额
                    "protation.addmPrice": data.protation.addmPrice, // 增主额
                    "protation.subdPrice": data.protation.subdPrice, // 减工额
                    "protation.submPrice": data.protation.submPrice, // 减主额
                    "protation.subcPrice": data.protation.subcPrice, // 减通额
                    "protation.totalPrice": data.protation.totalPrice, // 总额
                    "protation.accdPrice": data.protation.accmPrice, // 赋工额
                    "protation.accmPrice": data.protation.accdPrice, // 赋主额
                    "protation.discount": data.protation.discount, // 折扣
                    "protation.manageRate": data.protation.manageRate, // 管理费比例
                    "protation.manageFormula": data.protation.manageFormula, // 管理费公式
                    "protation.manageProfit": data.protation.manageProfit, // 管理优惠
                    "protation.advanceProfit": data.protation.advanceProfit, // 特殊优惠
                    "protation.taxRate": data.protation.taxRate, // 税金比例
                    "protation.taxFormula": data.protation.taxFormula, // 税金公式
                    "protation.taxPrice": data.protation.taxPrice, // 税金
                };
                quo.protation = data.protation;
            }, null, false);

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": quo.decorationOrderId
            }, function(res) {

                quo.decoration = res.decoration;
                quo.basicParams["protation.cacelArea"] = res.decoration.house.innerArea;

                com.focusPage('#orderId').text(res.decoration.orderId);
                com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
                com.focusPage('#version').text(res.decoration.version.name);
            }, null, false);

            com.post(api.decoration.amountDecorationActivity, {
                "decorationActivity.orderId": quo.protation.orderId,
                "decorationActivityItem.daiid": 0
            }, function(res) {

                quo.basicParams["protation.activityAmount"] = res.decorationActivity.amount;
            }, null, false);

            com.post(api.quotation.queryPresignProduceByPpid, {
                "presignProduce.ppid": quo.protation.ppid
            }, function(res) {

                quo.presignProduce = res.presignProduce;
            });

            var protationFunctionAreas = [{
                "pfaid": 1,
                "name": "功能区",
                "functionAreaOrder": 1,
                "functionAreaType": 0,
                "type": 0,
                total: 0,
                index: 1,
                "protationFunctionAreaItems": [],
            }, {
                "pfaid": 2,
                "name": "可选",
                "functionAreaOrder": 2,
                "functionAreaType": 0,
                "type": 1,
                total: 0,
                index: 2,
                "protationFunctionAreaItems": [],
            }, {
                "pfaid": 3,
                "name": "个性",
                "functionAreaOrder": 3,
                "functionAreaType": 0,
                "type": 2,
                total: 0,
                index: 3,
                "protationFunctionAreaItems": [],
            }, {
                "pfaid": 4,
                "name": "减项",
                "functionAreaOrder": 4,
                "functionAreaType": 0,
                "type": 3,
                total: 0,
                index: 4,
                "protationFunctionAreaItems": [],
            }, {
                "pfaid": 5,
                "name": "赋能",
                "functionAreaOrder": 5,
                "functionAreaType": 0,
                "type": 4,
                total: 0,
                index: 5,
                "protationFunctionAreaItems": [],
            }];

            com.post(api.quotation.queryProtationItemByPid, {
                "protationItem.pid": quo.protationId
            }, function(res) {

                $.each(res.protationItems, function(i, v) {

                    var type = (v.type + v.type % 2) / 2;

                    if (v.type == constant.quotation().protationItem.TYPE_PRCURRENT_INT) {
                        type = 1;
                    } else if (v.type == constant.quotation().protationItem.TYPE_CUTCURRENT_INT) {
                        type = 3;
                    }

                    protationFunctionAreas[type].protationFunctionAreaItems.push(v);
                });
            }, null, false);

            var basic = 0, comd = 0, comm = 0, addd = 0, addm = 0, subd = 0, subm = 0, subc = 0, total = 0, cost = 0, profit = 0, accm = 0, accd = 0;

            $.each(protationFunctionAreas, function(i, v) {

                var $domain = painter.createdomain(v).appendTo(com.focusPage('#functionAreaDetailList'));

                var _cost = parseFloat($domain.attr('data-cost'));
                var _basic = parseFloat($domain.attr('data-basic'));
                var _comd = parseFloat($domain.attr('data-comd'));
                var _comm = parseFloat($domain.attr('data-comm'));
                var _addd = parseFloat($domain.attr('data-addd'));
                var _addm = parseFloat($domain.attr('data-addm'));
                var _subd = parseFloat($domain.attr('data-subd'));
                var _subm = parseFloat($domain.attr('data-subm'));
                var _subc = parseFloat($domain.attr('data-subc'));
                var _accm = parseFloat($domain.attr('data-accm'));
                var _accd = parseFloat($domain.attr('data-accd'));

                cost = utils.changeThrDecimal(utils.accAdd(cost, _cost));
                basic = utils.changeThrDecimal(utils.accAdd(basic, _basic));
                comd = utils.changeThrDecimal(utils.accAdd(comd, _comd));
                comm = utils.changeThrDecimal(utils.accAdd(comm, _comm));
                addd = utils.changeThrDecimal(utils.accAdd(addd, _addd));
                addm = utils.changeThrDecimal(utils.accAdd(addm, _addm));
                subd = utils.changeThrDecimal(utils.accAdd(subd, _subd));
                subm = utils.changeThrDecimal(utils.accAdd(subm, _subm));
                subc = utils.changeThrDecimal(utils.accAdd(subc, _subc));
                accm = utils.changeThrDecimal(utils.accAdd(accm, _accm));
                accd = utils.changeThrDecimal(utils.accAdd(accd, _accd));

                var amount = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_basic, utils.accAdd(_addd, utils.accSub(_addm, utils.accAdd(utils.accAdd(_subd, _subm), _subc)))), utils.accAdd(_accm, _accd)));

                $dmoney = painter.createDomainMoney(amount, v).appendTo(com.focusPage('#functionAreaSumList'));
            });

            var mostCost = quo.basicParams["protation.mostPrice"];

            com.post(api.quotation.queryProtationCost, {
                "protationCost.pid": quo.basicParams["protation.pid"]
            }, function(res) {

                $.each(res.protationCosts, function(i, v) {

                    if (quo.basicParams["protation.cacelArea"] > v.lowlimit) {
                        mostCost = utils.accAdd(mostCost, utils.accMul(utils.accSub(quo.basicParams["protation.cacelArea"], v.lowlimit), v.costPrice));
                    }

                });
            }, null, false);

            quo.basicParams["protation.mostCost"] = mostCost;
            quo.basicParams["protation.houseCost"] = cost;

            var _discout = utils.changeThrDecimal(utils.accDiv(utils.accSub(quo.basicParams["protation.quotePrice"], quo.basicParams["protation.preferPrice"]), quo.basicParams["protation.quotePrice"]));

            _discout = _discout < 0 ? 0 : _discout > 1 ? 1 : _discout;

            var manageFormula = quo.basicParams["protation.manageFormula"] ? quo.basicParams["protation.manageFormula"] : "0";

            if (manageFormula.indexOf("{") != -1 || manageFormula.indexOf("}") != -1) {
                manageFormula = com.format(manageFormula, {
                    "a": quo.basicParams["protation.quotePrice"],
                    "b": quo.basicParams["protation.preferPrice"],
                    "c": basic,
                    "d": utils.accAdd(addd, addm),
                    "e": utils.accAdd(utils.accAdd(subd, subm), subc),
                    "f": utils.accAdd(accm, accd),
                    "h": quo.basicParams["protation.advanceProfit"],
                });
            }

            var _managePrice = utils.changeThrDecimal(isNaN(eval(manageFormula)) ? 0 : eval(manageFormula));

            var taxFormula = quo.basicParams["protation.taxFormula"] ? quo.basicParams["protation.taxFormula"] : "0";

            if (taxFormula.indexOf("{") != -1 || taxFormula.indexOf("}") != -1) {
                taxFormula = com.format(taxFormula, {
                    "a": quo.basicParams["protation.quotePrice"],
                    "b": quo.basicParams["protation.preferPrice"],
                    "c": basic,
                    "d": utils.accAdd(addd, addm),
                    "e": utils.accAdd(utils.accAdd(subd, subm), subc),
                    "f": utils.accAdd(accm, accd),
                    "g": _managePrice,
                    "h": quo.basicParams["protation.advanceProfit"],
                    "i": quo.basicParams["protation.manageProfit"]
                });
            }

            var _taxPrice = utils.changeThrDecimal(isNaN(eval(taxFormula)) ? 0 : eval(taxFormula));

            total = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(quo.basicParams["protation.quotePrice"], _managePrice), _taxPrice), quo.basicParams["protation.preferPrice"]), quo.basicParams["protation.manageProfit"]), quo.basicParams["protation.advanceProfit"]));
            total = utils.changeThrDecimal(utils.accAdd(total, utils.accAdd(utils.accAdd(basic, utils.accAdd(addd, utils.accSub(addm, utils.accAdd(utils.accAdd(subd, subm), subc)))), utils.accAdd(accm, accd))));

            _discout = utils.changeThrDecimal(utils.accMul(_discout, 10));

            quo.basicParams["protation.basicPrice"] = basic;
            quo.basicParams["protation.comdPrice"] = comd;
            quo.basicParams["protation.commPrice"] = comm;
            quo.basicParams["protation.adddPrice"] = addd;
            quo.basicParams["protation.addmPrice"] = addm;
            quo.basicParams["protation.subdPrice"] = subd;
            quo.basicParams["protation.submPrice"] = subm;
            quo.basicParams["protation.subcPrice"] = subc;
            quo.basicParams["protation.accmPrice"] = accm;
            quo.basicParams["protation.accdPrice"] = accd;
            quo.basicParams["protation.totalPrice"] = total;
            quo.basicParams["protation.managePrice"] = _managePrice;
            quo.basicParams["protation.taxPrice"] = _taxPrice;
            quo.basicParams["protation.discount"] = _discout;

            cost = utils.accAdd(utils.accAdd(utils.accMul(quo.basicParams["protation.addmPrice"], quo.basicParams["protation.mostRate"]), utils.accMul(quo.basicParams["protation.adddPrice"], quo.basicParams["protation.costRate"])), utils.accAdd(quo.basicParams["protation.mostCost"], utils.accAdd(utils.accMul(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.costPrice"]), cost)));

            quo.basicParams["protation.totalCost"] = cost;

            com.focusPage('#quotePrice').text(quo.basicParams["protation.quotePrice"]);
            com.focusPage('#quoteArea').text(quo.basicParams["protation.quoteArea"]);
            com.focusPage('#cacelArea').text(quo.basicParams["protation.cacelArea"]);
            com.focusPage('#preferPrice').text(quo.basicParams["protation.preferPrice"]);
            com.focusPage('#discount').text(_discout);
            com.focusPage('#managePrice').text(quo.basicParams["protation.managePrice"]);
            com.focusPage('#taxPrice').text(quo.basicParams["protation.taxPrice"]);
            com.focusPage('#quoteArea').text(quo.basicParams["protation.quoteArea"]);
            com.focusPage('#manageProfit').text(quo.basicParams["protation.manageProfit"]);
            com.focusPage('#advanceProfit').text(quo.basicParams["protation.advanceProfit"]);

            com.focusPage('#sumquoSumMoney').text(total);

            quo.basicParams["protation.basicCost"] = utils.accMul(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.costPrice"]);
            quo.basicParams["protation.materialCost"] = quo.basicParams["protation.materialCost"];
            quo.basicParams["protation.addCost"] = utils.accAdd(utils.accMul(quo.basicParams["protation.adddPrice"], quo.basicParams["protation.costRate"]), utils.accMul(quo.basicParams["protation.addmPrice"], quo.basicParams["protation.mostRate"]));

            com.focusPage('#basicCost').text(quo.basicParams["protation.basicCost"]);
            com.focusPage('#materialCost').text(quo.basicParams["protation.mostCost"]);
            com.focusPage('#addCost').text(quo.basicParams["protation.addCost"]);
            com.focusPage('#houstCost').text(quo.basicParams["protation.houseCost"]);
            com.focusPage('#totalCost').text(quo.basicParams["protation.totalCost"]);

            profit = utils.changeThrDecimal(utils.accSub(1.0, utils.accDiv(cost, utils.accSub(total, quo.basicParams["protation.activityAmount"]) == 0 ? 1 : utils.accSub(total, quo.basicParams["protation.activityAmount"]))));

            com.focusPage('#profitRate').text(profit);

            if (quo.basicParams["protation.advanceProfit"] != 0) {
                com.focusPage('#advanceProfitShow').show();
                com.focusPage('#preferAdvanceShow').show();
            } else {
                com.focusPage('#advanceProfitShow').hide();
                com.focusPage('#preferAdvanceShow').hide();
            }

            quo.init();
            domain.init();
            quote.init();
        }
    };

})();

$(function() {

    protationPart.init();
});
