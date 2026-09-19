var RuotationDetail = (function() {

    var quoRefund = {

        quoteRefundId: null,
        ruotation: null,
        orderId: null,
        decoration: null,
        quoteId: null,
        quotationPrefer: null,

        settingBtns: null,
        quoteRefundParams: null,

        initSettingBtns: function() {

            var that = this;

            that.settingBtns = {

                $btnOpenFunctionAreas: com.focusPage('#openFunctionAreasBtn').click(function() { // 展开功能区
                    com.focusPage('.icon-chevron-down').parent().trigger('click');
                }),

                $btnCloseFunctionAreas: com.focusPage('#closeFunctionAreasBtn').click(function() { // 收起功能区
                    com.focusPage('.icon-chevron-up').parents().trigger('click');
                }),

                $btnSave: com.focusPage('#saveRuotationBtn').bindClick(function() { // 保存退报单信息

                    com.post(api.quotation.updateRuotation, quoRefund.quoteRefundParams);
                }, 2000),

                $btnPrint: com.focusPage('#printBtn').bindClick(function() { // 打印退报单信息

                }, 2000),

                $btnBack: com.focusPage('#backBtn').click(function() { // 返回
                    com.showConfirm("当前页面存在重要数据, 是否进行当前操作", function() {

                        com.switchPage(api.index.ruotationIndex.url);
                        com.closePopover();
                    });
                })
            };

            return that;
        },

        initQuoModals: function() {

            var that = this;

            that.quoModals = {
                // 添加功能区报价项
                $addQuotaionFunctionAreaItemModal: com.focusPage("#addQuotaionFunctionAreaItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
                    quoteRefund.quotesRecord = [];
                }),
               
            };

            return that;
        },

        // 统计退报单价格
        calculateQuoFees: function(func) {

            var _total = 0, _totalAmount = 0;

            var $domains = com.focusPage('#functionAreaDetailList .widget-box:not([data-del-sign="1"])');

            if (!$domains.length)
                return false;

            $domains.each(function() {

                var sum = 0;

                var $this = $(this);

                var areaType = $this.attr('data-areaType');

                if (areaType == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT || areaType == constant.quotation().quotationFunctionArea.TYPE_HIDE_INT) { // 工程量计算

                    if (func)
                        func($this);

                    sum = parseFloat($this.attr('data-totalAmount')); // 功能区单价

                    _totalAmount = utils.accAdd(_totalAmount, sum); // 功能区单价总和
                }

                if (areaType == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) { // 总额功能区

                    _totalAmount = utils.accAdd(_totalAmount, $this.attr('data-total')); // 功能区单价总和
                }

                if (areaType == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT) { // 非业绩功能区

                    sum = parseFloat($this.attr('data-totalAmount')); // 功能区单价

                    _totalAmount = utils.accAdd(_totalAmount, sum); // 功能区单价总和
                }

                if (areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) { // 综合功能区
                    sum = parseFloat($this.attr('data-totalAmount')); // 功能区单价

                    _totalAmount = utils.accAdd(_totalAmount, sum); // 功能区单价总和
                }

            });

            _total = utils.changeThrDecimal(_totalAmount);

            com.focusPage('#totalPrice').text(_total); // 显示到左侧的总价

            quoRefund.quoteRefundParams["ruotation.totalPrice"] = _total;
        },

        // 计算功能区总价
        calculateDomainFees: function($domain, func) {

            var sum = 0;

            var areaType = $domain.attr('data-areaType');

            var $arr = com.focusPage('.fl-quo-item.item:not([data-del-sign="1"])', $domain);

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT || areaType == constant.quotation().quotationFunctionArea.TYPE_COST_INT || areaType == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT || areaType == constant.quotation().quotationFunctionArea.TYPE_HIDE_INT || areaType == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) { // 工程量

                if ($arr.length) {
                    $arr.each(function() {

                        $this = $(this);

                        if (func)
                            func($this);

                        var type = $this.find(".cell.type").attr("data-type");

                        var totalAmount = parseFloat($this.attr("data-totalAmount"));// 报价项非折扣总价

                        if (type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT) {

                            sum = utils.changeThrDecimal(utils.accAdd(sum, totalAmount)); // 功能区项目总和
                        }

                        if (type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT) {

                            sum = utils.changeThrDecimal(utils.accAdd(sum, totalAmount)); // 功能区项目总和
                        }
                    });
                }
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) { // 总额功能区

                sum = $domain.attr('data-total');
            }

            if (areaType == constant.quotation().quotationFunctionArea.TYPE_COST_INT) {

                sum = 0;
            }

            $domain.attr('data-totalAmount', sum); // 总价格

            return sum;
        },

        calculateNowQuoteItem: function(num, areaType, $nowLine) {

            var type = $nowLine.find(".cell.type").attr("data-type");
            var price = parseFloat($nowLine.find('.unitprice .cell-wrap').text());// 单价

            var totalAmount = utils.changeThrDecimal(utils.accMul(num, price));

            $nowLine.find('.totalprice .cell-wrap').text(totalAmount);
            $nowLine.attr('data-totalAmount', type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT || type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT ? totalAmount : 0);

            var fee = quoRefund.calculateDomainFees($nowLine.parents('.widget-box'));

            quoRefund.calculateQuoFees();

            return fee;
        },

        init: function() {
            this.initSettingBtns();
            this.initQuoModals();
        }
    };

    // 功能区
    var domain = {

        nowEditDomain: null,

        // 获取功能区下的退报项信息
        ruotationItems: function(qfaId) {

            var ruotationItems = null;

            com.post(api.quotation.queryRuotationItem, {
                "ruotationItem.ruotation.qrid": quoRefund.quoteRefundId,
                "ruotationItem.quotationFunctionArea.qfaId": qfaId
            }, function(res) {

                ruotationItems = res.ruotationItems;
            }, null, false);

            return ruotationItems;
        },

        //拉取三源候选项目(报价/扩展/增减, 带已产生费用标记)
        queryRuotationCandidates: function() {
            com.post(api.quotation.queryRuotationItemForCandidateByOrderId, {
                "ruotationItem.ruotation.decoration.orderId": quoRefund.orderId
            }, function(data) {

                var $tableWrap = com.focusPage('#quateFunctionAreaItemList').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                var sourceNames = {
                    0: "报价",
                    1: "扩展",
                    2: "增减"
                };

                if (data.ruotationItems && data.ruotationItems.length) {
                    $.each(data.ruotationItems, function(i, v) {

                        v.sourceName = sourceNames[v.source] || "报价";

                        painter.createQuoteModalItem(v).appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);

                    // 已产生费用项默认勾选
                    com.focusPage('input[name="modalQuots"]').each(function() {

                        var $this = $(this);

                        if ($this.attr('data-incur') == 1) {
                            $this.prop('checked', true);
                            quoteRefund.recordQuots($this, true);
                        }
                    });
                } else {
                    $('<div></div>').addClass('alert alert-info').text('该订单无报价/扩展/增减项目').appendTo($tableWrap);
                }
            }, null, false);
        },

        // 保存报价项
        saveQuotesToDomain: function() {

            com.focusPage('#addFunctionAreaItemBtn').click(function() {

                quoteRefund.addDefaultQuotes();

                quoRefund.quoModals.$addQuotaionFunctionAreaItemModal.modal("hide");
            });
        },

        init: function() {
            this.saveQuotesToDomain();
        }
    };

    var quoteRefund = {

        quotesRecord: [],

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
            quoteRefund.checkedStyle($line);

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

                var areaType = that.$nowLine.find('.line').attr('data-areaType');

                var num = that.$nowLine.find('.num .cell-wrap .number').text();

                var args = {
                    "ruotationItem.qriid": that.$nowLine.attr('data-qriid'), // 退报项ID
                    "ruotationItem.ruotation.qrid": quoRefund.quoteRefundId, // 退报单ID
                    "ruotationItem.quotationFunctionArea.qfaId": that.$nowLine.find('.name').attr('data-qfaId'), //报价功能区ID
                    "ruotationItem.quotationItem.qiid": that.$nowLine.attr('data-qiid'), //数据报价项ID
                    "ruotationItem.itemName": that.$nowLine.find('.name .cell-wrap').text(), // 名称
                    "ruotationItem.measurementUnit": that.$nowLine.find('.unit .cell-wrap').text(), // 单位
                    "ruotationItem.workType": that.$nowLine.find('.worktype .cell-wrap').text(), // 工种
                    "ruotationItem.unitPrice": that.$nowLine.find('.unitprice').attr('data-unitprice'), // 单价
                    "ruotationItem.addPrice": that.$nowLine.attr('data-addprice'), // 增补价
                    "ruotationItem.subPrice": that.$nowLine.attr('data-subprice'), // 退减价
                    "ruotationItem.formula": that.$nowLine.find('.formula .cell-wrap').text(), // 计算公式
                    "ruotationItem.initNum": num, // 初始化数量
                    "ruotationItem.num": num, // 数量
                    "ruotationItem.type": that.$nowLine.find('.type').attr('data-type'), // 类型
                    "ruotationItem.subtype": that.$nowLine.find('.num').attr('data-subtype'), // 工程, 主材
                    "ruotationItem.content": that.$nowLine.prop('title'), // 说明
                    "ruotationItem.source": that.$nowLine.attr('data-source'), // 来源:0报价/1扩展/2增减
                    "ruotationItem.sourceItemId": that.$nowLine.attr('data-sourceItemId'), // 源单行ID
                    "ruotationItem.qfaiId": that.$nowLine.attr('data-qfaiId'), // 报价项实例ID
                    "ruotationItem.index":  parseInt(that.$nowLine.find(".line .cell-wrap").text()) // 标识
                };

                var fee = quoRefund.calculateNowQuoteItem(num, areaType, that.$nowLine);

                that.$nowLine.find(".icon-arrow-up").removeClass("grey").addClass("green"), that.$nowLine.find(".icon-arrow-down").removeClass("grey").addClass("red");

                var params = $.extend({}, args, quoRefund.quoteRefundParams);

                com.post(api.quotation.updateRuotationItem, params, function(res) {

                    // 选中左上角报价中的功能区ID 将总价格显示
                    com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(fee);

                    that.$nowLine.attr("data-qriid", res.ruotationItem.qriid);
                    that.$nowLine.find('.icon-circle-arrow-down').hide();
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    that.$nowLine.find('.cell.formula .cell-wrap').text(oldFormula);
                    that.$nowLine.find('.cell.num .cell-wrap .number').text(oldNum);
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

        addDefaultQuotes: function() {

            var quotationFunctionAreaItems = quoteRefund.quotesRecord;

            if (!quotationFunctionAreaItems.length) {
                return false;
            }

            var areaType = domain.nowEditDomain ? domain.nowEditDomain.attr('data-areaType') : 0;

            $.each(quotationFunctionAreaItems, function(i, v) {

                var $this = $(v);

                if (!$this.val()) {
                    return true;
                }

                // 候选项归位其原功能区, 找不到才落到当前编辑功能区
                var quotfaId = $this.attr('data-qfaId');
                var $targetDomain = com.focusPage('.widget-box[data-qfaId="' + quotfaId + '"]', '#functionAreaDetailList');

                if (!$targetDomain.length) {
                    $targetDomain = domain.nowEditDomain;

                    if (!$targetDomain) {
                        return true;
                    }

                    quotfaId = $targetDomain.attr('data-qfaId');
                }

                if (com.focusPage('.fl-quo-item[data-sourceid="' + $this.val() + '"]', '#functionAreaDetailList').length) {
                    return true;
                }

                var index = $targetDomain.find('.fl-quo-item.item').length;
                var quolist = $targetDomain.find('.fl-quo-list.list');

                var quotval = {
                    "qriid": "",
                    "ruotation": {"qrid": quoRefund.quoteRefundId},
                    "quotationFunctionArea": {"qfaId": quotfaId},
                    "quotationItem": {"qiid": $this.attr('data-quotationItemId')},
                    "itemName": $this.attr('data-itemName'),
                    "measurementUnit": $this.attr("data-measurementUnit"),
                    "workType": $this.attr('data-workType'),
                    "unitPrice": $this.attr('data-unitPrice'),
                    "addPrice": $this.attr('data-addPrice'),
                    "subPrice": $this.attr('data-subPrice'),
                    "formula": "",
                    "initNum": $this.attr('data-initNum'),
                    "num": $this.attr('data-initNum'),
                    "type": $this.attr('data-type'),
                    "subtype": $this.attr('data-subtype'),
                    "content": $this.attr('data-content'),
                    "source": $this.attr('data-source'),
                    "sourceItemId": $this.attr('data-sourceItemId'),
                    "qfaiId": $this.attr('data-qfaiId'),
                    "areaType": $targetDomain.attr('data-areaType') || areaType
                };

                painter.createQuote(index + 1, quotval).appendTo(quolist);

            });

            quoteRefund.quotesRecord = [];
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
                that.quotesRecord[that.quotesRecord.length] = $input;
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

        // 删除退报项
        deleteQuote: function($quoteItem) {

            domain.nowEditDomain = $quoteItem.parents('.widget-box');
            var qriid = $quoteItem.attr('data-qriid');

            if (!qriid) {
                $quoteItem.remove();
            } else {

                $quoteItem.attr('data-del-sign', 1);

                quoRefund.calculateDomainFees(domain.nowEditDomain);
                quoRefund.calculateQuoFees();

                var params = $.extend({}, quoRefund.quoteRefundParams, {
                    "ruotationItem.qriid": qriid
                });

                com.post(api.quotation.deleteRuotationItem, params, function(res) {

                    $quoteItem.remove();

                    var fee = quoRefund.calculateDomainFees(domain.nowEditDomain);

                    quoRefund.calculateQuoFees();

                    com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(fee);
                }, function(res) {

                    com.showAlert(com.error, res.errorMsg);

                    $quoteItem.removeAttr("data-del-sign");

                    quoRefund.calculateDomainFees(domain.nowEditDomain);
                    quoRefund.calculateQuoFees();
                }, false);
            }

            quoteRefund.sortQuote(domain.nowEditDomain);
        },

        moveAreaItem: function($quote, $movequote, $direction) {

            if (!$quote.attr('data-qriid')) {
                return false;
            }

            if ($direction == "up") {

                if ($quote.prev().length == 0 || !$movequote.attr('data-qriid')) {
                    return false;
                }

                $quote.insertBefore($movequote);
            }

            if ($direction == "down") {

                if ($quote.next().length == 0 || !$movequote.attr('data-qriid')) {
                    return false;
                }

                $quote.insertAfter($movequote);
            }

            var nowline = $quote.find(".cell.line .cell-wrap").text();
            var upline = $movequote.find(".cell.line .cell-wrap").text();

            $quote.find(".cell.line .cell-wrap").text(upline);
            $movequote.find(".cell.line .cell-wrap").text(nowline);

            var params = {};
            params["ruotationItems[" + 0 + "].qriid"] = $quote.attr('data-qriid');
            params["ruotationItems[" + 0 + "].index"] = upline;
            params["ruotationItems[" + 1 + "].qriid"] = $movequote.attr('data-qriid');
            params["ruotationItems[" + 1 + "].index"] = nowline;

            com.post(api.quotation.updateRuotationItemForIndex, params);
        },

        init: function() {

            this.clearQuoteSelected();
            this.calculationNum();
        }
    };

    var painter = {

        // 创建功能区
        createdomain: function(dv) {

            var that = this;

            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var _btnSet = {
                "$btnAdd": ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT],
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
            };

            $domain = $('<div></div>').addClass('widget-box transparent').attr({
                "data-dlevel": dv.functionAreaOrder, // 功能区排序
                "data-qfaId": dv.qfaId, // 功能区ID
                "data-areaType": dv.type, // 功能区类型
                "data-total": dv.total, // 功能区总额
            }).css({
                "margin-bottom": "20px"
            });

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

            var _lineSet = [["line", "0"], ["formula", "数量"], ["num", "数量"], ["name", "名称"], ["type", "类型"], ["unit", "单位"], ["worktype", "工种"], ["cell price unitprice", "价格"], ["cell price totalprice", "价格"], ["btns", "功能", {"width": "100px"}]];

            var $ul = $('<ul></ul>').addClass('fl-quo-list');
            var $li = $('<li></li>').addClass('fl-quo-item').appendTo($ul);

            $.each(_lineSet, function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).css(v.length == 3 ? v[2] : {}).appendTo($li);
                $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);
            });

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list list');
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append(dv.type == constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT ? null : $ul).append($dbody);

            var sum = 0;

            var ruotationItems = domain.ruotationItems(dv.qfaId);

            if (ruotationItems) {

                // 功能区中的报价项
                var _items = ruotationItems;

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

                    if (v.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || v.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || v.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT) {

                        sum = utils.accAdd(sum, parseFloat($item.attr('data-totalAmount')));
                    }

                    if (v.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT) {

                        sum = utils.accAdd(sum, parseFloat($item.attr('data-totalAmount')));
                    }
                });
            }

            if (dv.type == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) { // 总额功能区

                sum = dv.total;
            }

            if (dv.type == constant.quotation().quotationFunctionArea.TYPE_COST_INT) { // 成本功能区

                sum = 0;
            }

            if (dv.type != constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT) {
                $btns.$btnAdd.click(function() {// 添加三源候选项目(报价/扩展/增减)

                    domain.nowEditDomain = $domain;
                    domain.queryRuotationCandidates();
                    quoRefund.quoModals.$addQuotaionFunctionAreaItemModal.modal("show");
                    com.focusPage('#addItemFunctionAreaIndex').val(dv.qfaId);
                });
            }

            $domain.attr('data-totalAmount', utils.changeThrDecimal(sum));

            return $domain;
        },

        // 创建报价项
        createQuote: function(linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content);

            var _dcp = 0;
            var _num = qv.num;

            var _typeName = "-";

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || qv.areaType == constant.quotation().quotationFunctionArea.TYPE_HIDE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT) {
                _typeName = "标准";
                _dcp = qv.unitPrice;
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT) { // 自定义
                _dcp = qv.unitPrice;
                _typeName = "自定义";
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_TRAFFIC_INT) { // 车运费
                _dcp = qv.unitPrice;
                _typeName = "管理";
                _num = 1;
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_MANAGE_INT) { // 管理费 单价+非业务人员提点
                _dcp = qv.unitPrice;
                _typeName = "管理";
                _num = 1;
            }

            if (qv.areaType == constant.quotation().quotationFunctionArea.TYPE_COST_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COST_INT) { // 成本
                _dcp = qv.unitPrice;
                _typeName = "标准";
            }

            if (qv.areaType == constant.quotation().quotationFunctionArea.TYPE_NOT_COUNT_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_IGNORE_INT) { // 不计算
                _dcp = 0;
                _typeName = "不计";
            }

            if (qv.areaType == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT) { // 非业绩
                _dcp = qv.unitPrice;
                _typeName = "标准";
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_TAX_INT) { // 税金
                _dcp = qv.unitPrice;
                _typeName = "管理";
                _num = 1;
            }

            if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) { // 综合
                _dcp = qv.unitPrice;
                _typeName = "综合";
            }

            var _lineSet = [];
            _lineSet.push(["line", linenum, ["data-areaType", qv.areaType]]); // 编号
            _lineSet.push(qv.areaType == constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT ? "" : ["formula", qv.formula ? qv.formula : "0"]); // 数量/公式
            _lineSet.push(["num", "<span class='number'>" + _num + "</span>", ["data-subtype", qv.subtype]]); // 数量
            _lineSet.push(["name green", qv.itemName, ["data-qfaId", qv.quotationFunctionArea.qfaId]]); // 报价名
            _lineSet.push(["type", _typeName, ["data-type", qv.type]], ["unit", qv.measurementUnit]); // 工种
            _lineSet.push(["worktype", qv.workType]); // 工种
            _lineSet.push(["price unitprice", _dcp, ["data-unitPrice", qv.unitPrice]]); // 单价
            _lineSet.push(["price totalprice", utils.changeThrDecimal(utils.accMul(_num, _dcp))]); // 总价

            var $btnCell, $btnCellWrap, $btnDel, $btnInfo, $up, $down;

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
                $btnCellWrap.appendTo($btnCell);
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

                if (qv.qriid) {
                    $up.find("i").addClass("green"), $down.find("i").addClass("red");
                } else {
                    $up.find("i").addClass("grey"), $down.find("i").addClass("grey");
                }

                // 各种绑定事件
                $item.click(function() {// 编辑数量

                    quoteRefund.getNumCellFocus($item);
                });
                // 删除报价项
                $btnDel.click(function(e) {

                    quoteRefund.deleteQuote($item);
                    return false;
                });
                // 查看
                $btnInfo.click(function(e) {

                    qv.content && com.showTip(this, qv.content, 'left');
                    return false;
                });
                // 向上移动
                $up.click(function(e) {

                    quoteRefund.checkedStyle($item);
                    quoteRefund.moveAreaItem($item, $item.prev(), "up");
                    return false;
                });
                // 向下移动
                $down.click(function(e) {

                    quoteRefund.checkedStyle($item);
                    quoteRefund.moveAreaItem($item, $item.next(), "down");
                    return false;
                });

            }

            $item.attr('data-qriid', qv.qriid);
            $item.attr('data-qiid', qv.quotationItem.qiid);
            $item.attr('data-source', qv.source);
            $item.attr('data-sourceid', (qv.source != null ? qv.source : 0) + "-" + (qv.sourceItemId != null ? qv.sourceItemId : qv.qriid));
            $item.attr('data-sourceItemId', qv.sourceItemId);
            $item.attr('data-qfaiId', qv.qfaiId);
            $item.attr('data-expres', qv.quotationItem.formula ? qv.quotationItem.formula : "");
            $item.attr('data-isRtem', qv.quotationItem.isRtem == 1 ? 1 : 0);

            $item.attr('data-addPrice', qv.addPrice);
            $item.attr('data-subPrice', qv.subPrice);
            $item.attr('data-totalAmount', qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_COMMON_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CUSTOM_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_UNACHE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_HIDE_INT || qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT ? utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice)) : 0);

            return $item;
        },

        // 创建添加退报项弹窗中的候选项目(报价/扩展/增减三源)
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
                "data-itemName": v.itemName,
                "data-unitPrice": v.unitPrice,
                "data-addPrice": v.addPrice,
                "data-subPrice": v.subPrice,
                "data-measurementUnit": v.measurementUnit,
                "data-quotationItemId": v.quotationItem.qiid,
                "data-type": v.type,
                "data-subtype": v.subtype,
                "data-workType": v.workType,
                "data-content": v.content,
                "data-formula": v.formula,
                "data-num": v.num,
                "data-initNum": v.initNum,
                "data-source": v.source,
                "data-sourceItemId": v.sourceItemId,
                "data-qfaiId": v.qfaiId,
                "data-qfaId": v.quotationFunctionArea.qfaId,
                "data-incur": v.incur
            }).val(v.source + "-" + v.sourceItemId);

            var sourceClz = v.source == 1 ? "orange" : (v.source == 2 ? "purple" : "blue");
            var $span = $('<span></span>').addClass('lbl bigger-150').append($('<span></span>').addClass('label label-' + sourceClz + ' arrowed-in').css({
                "margin-right": "5px",
                "font-size": "12px"
            }).text(v.sourceName || "报价")).append(v.itemName);

            if (v.incur == 1) {
                $span.append($('<span></span>').addClass('label label-success arrowed-in-right').css({
                    "margin-left": "5px",
                    "font-size": "12px"
                }).text("已产生费用"));
            }

            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [];
            propertyArr.push(["来源:", v.sourceName || "报价", sourceClz]);
            propertyArr.push(["单位:", v.measurementUnit, "red"]);
            propertyArr.push(["工种:", v.workType, "red"]);
            propertyArr.push(["工程量:", v.num, "blue"]);
            propertyArr.push(["单价:", v.unitPrice, "blue"]);
            propertyArr.push(["已产生费用:", v.incur == 1 ? "是" : "否", v.incur == 1 ? "green" : "grey"]);
            propertyArr.push(["说明:", v.content, "grey"]);

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
                quoteRefund.recordQuots($this, $(this).is(':checked'));
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
        }
    };

    return {
        init: function() {

            quoRefund.quoteRefundId = params.quotation.ruotation.qrid;
            quoRefund.orderId = params.quotation.ruotation.decoration.orderId;
            quoRefund.quoteId = params.quotation.ruotation.quotation.qid;

            // 初始化装修单信息
            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": quoRefund.orderId
            }, function(res) {

                com.focusPage('#orderId').text(res.decoration.orderId);
                com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);

            }, null, false);

            // 初始化退报单信息
            com.post(api.quotation.queryRuotationById, {
                "ruotation.qrid": quoRefund.quoteRefundId
            }, function(data) {

                var ruotation = data.ruotation;

                // 将报价数据获取到全局变量中
                quoRefund.quoteRefundParams = {
                    "ruotation.qrid": ruotation.qrid, // 退报单Id
                    "ruotation.totalPrice": ruotation.totalPrice, // 退报单总额
                };

                com.focusPage('#quotationName').text(ruotation.quotation.name); // 左上角显示报价名称
                com.focusPage('#version').text(ruotation.version.name); // 左测显示报价版本
            }, null, false);

            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {
                "quotation.qid": quoRefund.quoteId
            }, function(data) {

                var _total = 0, _totalAmount = 0;

                if (data.quotationFunctionAreas.length) {

                    $.each(data.quotationFunctionAreas, function(i, v) {

                        if (v.type == constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT) 
                            return false;

                        var $domain = painter.createdomain(v).appendTo(com.focusPage('#functionAreaDetailList'));

                        if (v.type == constant.quotation().quotationFunctionArea.TYPE_PROJECT_NUM_INT) { // 工程量

                            sum = parseFloat($domain.attr('data-totalAmount'));// 功能区非打折项总价

                            painter.createDomainMoney(utils.changeThrDecimal(sum), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _totalAmount = utils.accAdd(_totalAmount, sum); // 功能区非打折项总价相加
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_FUNCTIONAREA_TOTAL_INT) { // 总额

                            painter.createDomainMoney(v.total, v).appendTo(com.focusPage('#functionAreaSumList'));

                            _totalAmount = utils.accAdd(_totalAmount, v.total); // 功能区非打折项总价相加
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_NOT_COUNT_INT) { // 不计算
                            painter.createDomainMoney(0, v).appendTo(com.focusPage('#functionAreaSumList'));
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_COST_INT) {

                            sum = parseFloat($domain.attr('data-totalAmount'));// 功能区非打折项总价

                            painter.createDomainMoney(utils.changeThrDecimal(sum), v).appendTo(com.focusPage('#functionAreaSumList'));
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_ACHIEVEMENT_INT) {

                            sum = parseFloat($domain.attr('data-totalAmount'));// 功能区非打折项总价

                            painter.createDomainMoney(utils.changeThrDecimal(sum), v).appendTo(com.focusPage('#functionAreaSumList'));

                            _totalAmount = utils.accAdd(_totalAmount, sum); // 功能区非打折项总价相加
                        } else if (v.type == constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT) {
                            sum = parseFloat($domain.attr('data-totalAmount'));

                            _totalAmount = utils.accAdd(_totalAmount, sum);
                        }
                    });

                    _total = utils.changeThrDecimal(_totalAmount);

                    com.focusPage('#totalPrice').text(_total);

                    quoRefund.quoteRefundParams["ruotation.totalPrice"] = _total;
                }
            }, null, false);

            quoRefund.init();
            domain.init();
            quoteRefund.init();
        }
    };

})();

$(function() {
    RuotationDetail.init();
});