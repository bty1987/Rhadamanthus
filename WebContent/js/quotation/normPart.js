var QuotationDetail = (function() {

    var quo = {
        protationId: null, // 预签ID
        versionId: null, // 预签版本
        basicParams: null,

        normnumtotal: 0,
        storenumtotal: 0,
        normricetotal: 0,
        trannum: 0,
        sayary: 0,

        quoModals: {},
        settingBtns: {},
        quoteCalculation: {},
        machingType: {},
        typeness: {},

        // 定义左下角按钮重新定义和弹窗提示
        initSettingBtns: function() {

            var that = this;

            that.settingBtns = {
                // 返回
                $btnBack: com.focusPage('#detailBckBtn').on('click', function() {

                    com.showConfirm("当前页面存在重要数据,是否进行当前操作", function() {

                        com.switchPage(quo.historyPage);
                        com.closePopover();
                    });
                }),
                // 打包项
                $btnNormpack: com.focusPage('#packageitem').on('click', function() {

                    that.quoModals.$domainTempletModal.modal("show");
                }),
                // 附加项
                $btnAddtionitem: com.focusPage('#addtionitem').on('click', function() {

                    that.quoModals.$domainNormriceModal.modal("show");
                }),
                // 展开
                $btnSpread: com.focusPage('#openFunctionAreasBtn').click(function() {

                    com.focusPage('.icon-chevron-down').parent().trigger('click');
                }),
                // 收起
                $btnCollapse: com.focusPage('#closeFunctionAreasBtn').click(function() {

                    com.focusPage('.icon-chevron-up').parents('[data-action="collapse"]').trigger('click');
                }),
            };
            return that;
        },
        initQuoModals: function() {

            var that = this;

            that.quoModals = {

                $domainTempletModal: com.focusPage("#quotationNormoodItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="quoteparam"]').val('');
                    com.focusPage('input[name="quotempl"]:checked').removeAttr('checked');
                }),

                $domainNormriceModal: com.focusPage("#quotationNormriceItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="quoteparam"]').val('');
                    com.focusPage('input[name="quotempl"]:checked').removeAttr('checked');
                })
            },
            // 初始化功能区添加
            com.post(api.data.queryNormpack, {}, function(data) {

                data.normpacks.length && $.each(data.normpacks, function(i, v) {

                    if (v.type != 0) {
                        var $dtempl = painter.createDomainTemplete(v);
                        that.quoModals.$domainTempletModal.find('.modal-body').append($dtempl);
                    }
                });
            });

            com.post(api.data.queryNormadd, {
                "normadd.constructionNode.cnid": 0
            }, function(data) {

                data.normadds.length && $.each(data.normadds, function(i, v) {

                    var $dtempl = painter.createNormriceTemplete(v);
                    that.quoModals.$domainNormriceModal.find('.modal-body').append($dtempl);
                });
            });
        },
        calculateQuoFees: function(func) {

            var normnumtotal = 0, storenumtotal = 0;
            var $domains = com.focusPage('#quotationNormoodItem0 .fl-quo-item');

            if (!$domains.length) {
                return false;
            }

            $domains.each(function(i, v) {

                var $this = $(this);
                var _storenumtotal = parseFloat($this.attr('data-storenum'));
                var _normnumtotal = parseFloat($this.attr('data-normnum'));

                normnumtotal = utils.changeThrDecimal(utils.accAdd(normnumtotal, _normnumtotal));
                storenumtotal = utils.changeThrDecimal(utils.accAdd(storenumtotal, _storenumtotal));
            });

            com.focusPage('#normnumtotal').text(normnumtotal);
            com.focusPage('#storenumtotal').text(storenumtotal);
        },

        normriceQuoFees: function(func) {

            var normricetotal = 0;

            var $domains = com.focusPage('#quotationNormoodItem1 .fl-quo-item');

            if (!$domains.length) {
                return false;
            }

            $domains.each(function(i, v) {

                var $this = $(this);
                var _normricetotal = parseFloat($this.attr('data-salary'));

                normricetotal = utils.changeThrDecimal(utils.accAdd(normricetotal, _normricetotal));
            });

            com.focusPage('#normricetotal').text(normricetotal);
        },
        init: function() {

            this.initQuoModals();
            this.initSettingBtns();
        }
    };

    var painter = {
        // 创建打包项
        createdomain: function(dv) {

            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var _btnSet = {
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
            };

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == 0 ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.name));
            $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

            $.each(_btnSet, function(k, v) {

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

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list').attr("id", "quotationNormoodItem" + dv.type);
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append($dbody);

            if (dv.quotationFunctionAreaItems.length) {

                var _items = dv.quotationFunctionAreaItems;

                $.each(_items, function(i, v) {

                    var $item = that.createQuote(i + 1, v).appendTo($list);
                });
            }

            return $domain;
        },

        // 创建附加项
        nomricedomain: function(dv) {

            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var _btnSet = {
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
            };

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == 0 ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.name));
            $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

            $.each(_btnSet, function(k, v) {

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

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list').attr("id", "quotationNormoodItem" + dv.type);
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append($dbody);

            if (dv.quotationFunctionAreaItems1.length) {

                var _items = dv.quotationFunctionAreaItems1;

                $.each(_items, function(i, v) {

                    var $item = that.normriceQuote(i + 1, v).appendTo($list);
                });
            }

            return $domain;
        },
        // 创建添加功能区--打包项
        createDomainTemplete: function(v) {

            var $div = $('<div></div>').addClass('col-xs-12');
            var $label = $('<label></label>').addClass('col-xs-12').appendTo($div);
            var $radio = $('<input>').addClass('ace').attr({
                "name": "quotempl",
                "type": "checkbox"
            }).val(v.npid).appendTo($label);
            var $span = $('<span></span>').addClass('lbl').text(v.name).appendTo($label);
            return $div;
        },

        // 创建添加功能区--附加项
        createNormriceTemplete: function(v) {

            var $div = $('<div></div>').addClass('col-xs-12');
            var $label = $('<label></label>').addClass('col-xs-12').appendTo($div);
            var $radio = $('<input>').addClass('ace').attr({
                "name": "quotempl",
                "type": "checkbox"
            }).val(v.naid).appendTo($label);
            var $span = $('<span></span>').addClass('lbl').text(v.name).appendTo($label);
            return $div;
        },

        // 打包项
        createQuote: function(linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content).attr({
                "data-normnum": qv.normnum,
                "data-storenum": qv.storenum
            });

            var _typeName = "-";

            if (qv.normtype == 0) {
                _typeName = "材料";
            }

            if (qv.normtype == 1) { // 工费
                _typeName = "打包";
            }

            var _lineSet = [["line", linenum, ["data-areaType", qv.areaType]], // 编号
            ["formula", qv.normnum ? qv.normnum : "0"], // 公式
            ["num", qv.storenum, ["data-subtype", qv.subtype]], // 数量
            ["name", qv.goods.name, ["data-piid", qv.piid]], // 预签名称
            ["type", _typeName, ["data-type", qv.type]], ["unit", qv.normunit], // 单位
            ["worktype", qv.storeunit], // 工种
            ];

            var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel;

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
            $inputLable = $('<label></label>');
            $ispan = $('<span></span>').addClass('lbl align-top');

            $inputLable.append($ispan);
            $btnCellWrap.appendTo($btnCell);
            $item.append($btnCell);

            $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)",
                "type": "checkbox",
                "role": "checkbox",
                "name": "deleteItems",
                "data-qngiid": qv.qngiid ? qv.qngiid : ""
            }).val(qv.qngiid).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-remove pink"></i>');

            $btnCellWrap.append($inputLable).append($btnDel);
            // 删除预签项
            $btnDel.click(function(e) {

                quote.deleteQuote($item);
                return false;
            });
            return $item;
        },

        // 附加项
        normriceQuote: function(linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.qnpiid).attr({
                "data-salary": qv.salary,
            });

            var _typeName = "-";

            if (qv.normtype == 0) {
                _typeName = "材料";
            }

            if (qv.normtype == 1) { // 工费
                _typeName = "附加";
            }

            var _lineSet = [["line", linenum, ["data-areaType", qv.areaType]], // 编号
            ["num", qv.salary ? qv.salary : "0"], // 公式
            ["num", qv.salary], // 数量
            ["name", qv.constructionNode.name, ["data-name", qv.constructionNode.name]], // 施工节点
            ["type", _typeName, ["data-type", qv.type]], ["unit", qv.normunit], // 单位
            ];

            var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel;

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
            $inputLable = $('<label></label>');
            $ispan = $('<span></span>').addClass('lbl align-top');

            $inputLable.append($ispan);
            $btnCellWrap.appendTo($btnCell);
            $item.append($btnCell);

            $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)",
                "type": "checkbox",
                "role": "checkbox",
                "name": "deleteItems",
                "data-qnpiid": qv.qnpiid ? qv.qnpiid : ""
            }).val(qv.qnpiid).css({
                "padding-left": "5px"
            }).append('<i class="bigger-125 icon-remove pink"></i>');

            $btnCellWrap.append($inputLable).append($btnDel);

            // 删除附加项
            $btnDel.click(function(e) {

                quote.deleteNormriceQuote($item);
                return false;
            });
            return $item;
        }
    };

    var domain = {
        noewEditDomain: null,

        saveQuotesToDomain: function() {

            var that = this;

            com.focusPage('#addQuotationNormoodItem').click(function() {

                quote.addquotationNormood();
                quo.quoModals.$domainTempletModal.modal("hide");
            });
        },
        saveNormriceDoamin: function() {

            var that = this;

            com.focusPage('#addQuotationNormriceItem').click(function() {

                quote.addQuotationNormrice();
                quo.quoModals.$domainNormriceModal.modal("hide");
            });
        },

        init: function() {

            this.saveQuotesToDomain();
            this.saveNormriceDoamin();
        }
    };

    var quote = {

        quoteRecord: [],
        // 增加方法--打包项
        addquotationNormood: function() {

            var npids = com.focusPage("[name='quotempl']:checked");

            var _param = $.extend({
                "quotation.qid": quo.quotationId
            }, quo.basicParams);

            if (!npids.length) {
                return;
            }

            $.each(npids, function(i, v) {

                _param['quotationNormoodItems[' + i + '].sid'] = $(v).val();
            });

            com.post(api.quotation.addQuotationNormoodItem, _param, function(data) {

                var _items = data.quotationNormoodItems;

                $.each(_items, function(i, v) {

                    painter.createQuote(i + 1, v).appendTo(com.focusPage("#quotationNormoodItem0"));
                });
            }, null, false);
            quo.calculateQuoFees();
        },

        // 增加方法--附加项
        addQuotationNormrice: function() {

            var npids = com.focusPage("[name='quotempl']:checked");

            if (!npids.length) {
                return false;
            }

            var _param = $.extend({
                "quotation.qid": quo.quotationId
            }, quo.basicParams);

            $.each(npids, function(i, v) {

                _param['quotationNormriceItems[' + i + '].sid'] = $(v).val();
            });

            com.post(api.quotation.addQuotationNormriceItem, _param, function(data) {

                var _items = data.quotationNormriceItems;

                $.each(_items, function(i, v) {

                    painter.normriceQuote(i + 1, v).appendTo(com.focusPage("#quotationNormoodItem1"));
                });
            }, null, false);
            quo.normriceQuoFees();
        },
        // 删除预签项
        deleteQuote: function($quote) {

            var that = this;
            var _qngiid = $quote.find('a[type="checkbox"]').val();
            var _params = {};

            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list')).addClass('hide');
            if (!_qngiid) {
                $quote.remove();
            } else {
                $quote.remove();
                _params = $.extend({
                    "quotationNormoodItem.qngiid": _qngiid
                }, quo.basicParams);
                com.post(api.quotation.deleteQuotationNormoodItem, _params, function(res) {

                }, null, false);
                quo.calculateQuoFees();
            }
        },
        // 删除附加项
        deleteNormriceQuote: function($quote) {

            var that = this;
            var _qnpiid = $quote.find('a[type="checkbox"]').val();
            var _params = {};

            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list')).addClass('hide');

            if (!_qnpiid) {
                $quote.remove();
            } else {
                $quote.remove();
                _params = $.extend({
                    "quotationNormriceItem.qnpiid": _qnpiid
                }, quo.basicParams);
                com.post(api.quotation.deleteQuotationNormriceItem, _params, function(res) {

                }, null, false);
                quo.normriceQuoFees();
            }
        },
        init: function() {

        }
    };

    return {
        init: function() {

            quo.historyPage = params.historyPage;

            quo.quotationId = params.quotationId;

            var orderId = params.decorationOrderId;
            var editFlg = params.editFlg;
            editFlg ? quotationId = params.quotationId : com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                'quotation.orderId': orderId
            }, function(e) {

                quo.quotationId = e.quotation.qid;
            }, null, false);

            if (!quo.quotationId) {

                com.showAlert(com.warning, "默认报价不存在");

                com.switchPage(quo.historyPage);
                return false;
            }

            var quotationFunctionAreas = [{
                "pfaid": 1,
                "name": "材料",
                "functionAreaOrder": 1,
                "functionAreaType": 0,
                "type": 0,
                "total": 0,
                "index": 1,
                "quotationFunctionAreaItems": [],
            }];
            var quotationFunctionAreasa = [{
                "pfaid": 2,
                "name": "工费",
                "functionAreaOrder": 2,
                "functionAreaType": 1,
                "type": 1,
                "total": 0,
                "index": 2,
                "quotationFunctionAreaItems1": [],
            }];

            com.post(api.quotation.queryQuotationNormoodItem, {
                "quotationNormoodItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.quotationNormoodItems, function(i, v) {

                    quo.normnumtotal = utils.accAdd(quo.normnumtotal, v.normnum);
                    quo.storenumtotal = utils.accAdd(quo.storenumtotal, v.storenum);
                    quotationFunctionAreas[0].quotationFunctionAreaItems.push(v);
                });
            }, null, false);

            com.post(api.quotation.queryQuotationNormriceItem, {
                "quotationNormriceItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.quotationNormriceItems, function(i, v) {

                    // quo.trannum = utils.accAdd(quo.trannum, v.trannum);
                    // quo.salary = utils.accAdd(quo.salary,v.salary);
                    quo.normricetotal = utils.accAdd(quo.normricetotal, v.salary);
                    quotationFunctionAreasa[0].quotationFunctionAreaItems1.push(v);
                });
            }, null, false);

            $.each(quotationFunctionAreas, function(i, v) {

                $domain = painter.createdomain(v).appendTo(com.focusPage('#functionAreaDetailList'));
            });
            $.each(quotationFunctionAreasa, function(i, v) {

                $domain = painter.nomricedomain(v).appendTo(com.focusPage('#functionAreaDetailList'));
            });

            com.focusPage('#normnumtotal').text(quo.normnumtotal);
            com.focusPage('#storenumtotal').text(quo.storenumtotal);

            com.focusPage('#normricetotal').text(quo.normricetotal);

            // com.focusPage('#trannumtotal').text(quo.trannum);
            // com.focusPage('#salarytotal').text(quo.salary);

            quo.init();
            domain.init();
            quote.init();
        }
    };

})();

$(function() {

    QuotationDetail.init();
});