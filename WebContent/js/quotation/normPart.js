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

                $domainTempletModal: com.focusPage("#normoodItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="quoteparam"]').val('');
                    com.focusPage('input[name="quotempl"]:checked').removeAttr('checked');
                }),

                $domainNormriceModal: com.focusPage("#normriceItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="num"]').val('');
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

                var $dtempl = painter.createNormriceTemplete(data.normadds);
                that.quoModals.$domainNormriceModal.find('.modal-body').append($dtempl);
            });
        },
        calculateQuoFees: function(func) {

            var normnumtotal = 0, storenumtotal = 0;
            var $domains = com.focusPage('#normoodItem0 .fl-quo-item.item');

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

            var $domains = com.focusPage('#normoodItem1 .fl-quo-item.item');

            if (!$domains.length) {
                return false;
            }

            $domains.each(function(i, v) {

                var $this = $(this);
                var _datasalary = parseFloat($this.attr('data-salary'));
                var _datanum = parseFloat($this.attr('data-num'));
                var _normricetotal = utils.changeThrDecimal(utils.accMul(_datasalary, _datanum));

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

            var _lineSet = [["line", "0"], ["formula", "定额数量"], ["num", "库房数量"], ["name", "名称"], ["type", "类型"], ["unit", "单位"], ["worktype", "单位"], ["btns", "功能"]];

            var $ul = $('<ul></ul>').addClass('fl-quo-list');
            var $li = $('<li></li>').addClass('fl-quo-item').appendTo($ul);
            $.each(_lineSet, function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);

            });
            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list items').attr("id", "normoodItem" + dv.type);
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append($ul).append($dbody);

            if (dv.quotationFunctionAreaItems.length) {

                var _items = dv.quotationFunctionAreaItems;

                $.each(_items, function(i, v) {

                    $list.append(that.createQuote($list, i + 1, v));
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
            var _lineSet = [["line", "0"], ["formula", "数量"], ["num", "工费"], ["name", "施工进度"], ["type", "类型"], ["num totalPrice", "总额"], ["btns", "功能"]];

            var $ul = $('<ul></ul>').addClass('fl-quo-list');
            var $li = $('<li></li>').addClass('fl-quo-item').appendTo($ul);
            $.each(_lineSet, function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);

            });

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list items').attr("id", "normoodItem" + dv.type);
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append($ul).append($dbody);

            if (dv.quotationFunctionAreaItems1.length) {

                var _items = dv.quotationFunctionAreaItems1;

                $.each(_items, function(i, v) {

                    $list.append(that.normriceQuote($list, i + 1, v));
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

            var $form = $("<form></form>").addClass("form-horizontal");

            var $group = $("<div></div>").addClass("form-group").appendTo($form);
            var $label = $("<label></label>").addClass("col-sm-3 control-label no-padding-right").text("附加项").appendTo($group);
            var $div = $("<div></div>").addClass("col-sm-9").appendTo($group);
            var $select = $('<select></select>').attr({
                "name": "quotempla"
            }).addClass('col-xs-10 col-sm-5 v_float v_required').appendTo($div);

            var $group = $("<div></div>").addClass("form-group").appendTo($form);
            var $label = $("<label></label>").addClass("col-sm-3 control-label no-padding-right").text("数量").appendTo($group);
            var $div = $("<div></div>").addClass("col-sm-9").appendTo($group);
            var $num = $('<input>').addClass('col-xs-10 col-sm-5 v_float v_required').attr({
                "type": "text",
                "name": "num"
            }).appendTo($div);

            $.each(v, function(i, j) {

                $select.append("<option value='" + j.naid + "'>" + j.name + "</option>");
            });

            return $form;
        },

        // 打包项
        createQuote: function(list, linenum, qv) {

            var quote = list.find('li[data-gid=' + qv.goods.gid + ']');

            if (quote.length != 0) {

                var normnum = utils.accAdd(quote.attr("data-normnum"), qv.normnum);
                var storenum = utils.accAdd(quote.attr("data-storenum"), qv.storenum);

                quote.attr("data-normnum", normnum);
                quote.attr("data-storenum", storenum);

                quote.find(".formula>.cell-wrap").text(normnum);
                quote.find(".num>.cell-wrap").text(storenum);

                return "";
            }

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content).attr({
                "data-normnum": qv.normnum,
                "data-storenum": qv.storenum,
                "data-gid": qv.goods.gid
            });

            var _typeName = "-";

            if (qv.normtype == 0 && qv.type == 0) {
                _typeName = "报价";
            }

            if (qv.normtype == 0 && qv.type == 1) {
                _typeName = "拓展";
            }

            if (qv.normtype == 0 && qv.type == 2) {
                _typeName = "增减";
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
                "data-ngiid": qv.ngiid ? qv.ngiid : ""
            }).val(qv.ngiid).css({
                "padding-left": "5px"
            }).append($('<i class="bigger-125 icon-remove"></i>').addClass(qv.normtype == 1 ? "pink" : "grey"));

            $btnCellWrap.append($inputLable).append($btnDel);
            // 删除预签项
            $btnDel.click(function(e) {

                if (qv.normtype != 1)
                    return false;

                quote.deleteQuote($item);

                return false;
            });

            return $item;
        },

        // 附加项
        normriceQuote: function(list, linenum, qv) {

            var quote = list.find('li[data-name= "' + qv.constructionNode.sort + '" ][data-salary= "' + qv.salary + '"]');

            if (quote.length != 0) {

                var num = utils.accAdd(quote.attr("data-num"), qv.num);
                var total = utils.accAdd(parseFloat(quote.find(".totalPrice>.cell-wrap").text()), utils.accMul(qv.num, qv.salary));

                quote.attr("data-num", num);

                quote.find(".formula>.cell-wrap").text(num);
                quote.find(".totalPrice>.cell-wrap").text(total);

                return "";
            }

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.npiid).attr({
                "data-salary": qv.salary,
                "data-num": qv.num,
                "data-name": qv.constructionNode.sort
            });

            var _total = 0;

            var _typeName = "-";

            if (qv.normtype == 0 && qv.type == 0) {
                _typeName = "报价";
            }

            if (qv.normtype == 0 && qv.type == 1) {
                _typeName = "拓展";
            }

            if (qv.normtype == 0 && qv.type == 2) {
                _typeName = "增减";
            }

            if (qv.normtype == 1) { // 工费
                _typeName = "附加";
            }

            _total = utils.changeThrDecimal(utils.accMul(qv.num, qv.salary));
            var _lineSet = [["line", linenum, ["data-areaType", qv.areaType]], // 编号
            ["formula", qv.num ? qv.num : "0", ], // 公式
            ["num", qv.salary], // 数量
            ["name", qv.constructionNode.name], // 施工节点
            ["type", _typeName, ["data-type", qv.type]], // 单位
            ["num totalPrice", _total] // 总价
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
                "data-npiid": qv.npiid ? qv.npiid : ""
            }).val(qv.npiid).css({
                "padding-left": "5px"
            }).append($('<i class="bigger-125 icon-remove"></i>').addClass(qv.normtype == 1 ? "pink" : "grey"));

            $btnCellWrap.append($inputLable).append($btnDel);

            $btnDel.click(function(e) {

                if (qv.normtype != 1)
                    return false;

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

            com.focusPage('#addNormoodItem').click(function() {

                quote.addquotationNormood();
                quo.quoModals.$domainTempletModal.modal("hide");
            });
        },
        saveNormriceDoamin: function() {

            var that = this;

            com.focusPage('#addNormriceItem').click(function() {

                if (com.validate("normriceItemModal"))
                    return false;

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

                _param['normoodItems[' + i + '].sid'] = $(v).val();
            });

            com.post(api.quotation.addNormoodItem, _param, function(data) {

                var _items = data.normoodItems;
                var _list = com.focusPage("#normoodItem0")

                $.each(_items, function(i, v) {

                    _list.append(painter.createQuote(_list, i + 1, v))
                });
            }, null, false);
            quo.calculateQuoFees();
        },

        // 增加方法--附加项
        addQuotationNormrice: function() {

            var npid = com.focusPage("[name='quotempla']").val();
            var num = com.focusPage("[name='num']").val();

            var options = {
                "quotation.qid": quo.quotationId,
                "normriceItem.sid": npid,
                "normriceItem.num": num
            };

            com.post(api.quotation.addNormriceItem, options, function(data) {

                var _items = data.normriceItem;
                var _list = com.focusPage("#normoodItem1")

                $.each(_items, function(i, v) {

                    _list.append(painter.normriceQuote(_list, i + 1, v))
                });
            }, null, false);
            quo.calculateQuoFees();
        },
        // 删除预签项
        deleteQuote: function($quote) {

            var that = this;
            var _ngiid = $quote.find('a[type="checkbox"]').val();
            var _params = {};

            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list.items')).addClass('hide');
            if (!_ngiid) {
                $quote.remove();
            } else {
                $quote.remove();
                _params = $.extend({
                    "normoodItem.ngiid": _ngiid
                }, quo.basicParams);
                com.post(api.quotation.deleteNormoodItem, _params, function(res) {

                }, null, false);
                quo.calculateQuoFees();
            }
        },
        // 删除附加项
        deleteNormriceQuote: function($quote) {

            var that = this;
            var _npiid = $quote.find('a[type="checkbox"]').val();
            var _params = {};

            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list.items')).addClass('hide');

            if (!_npiid) {
                $quote.remove();
            } else {
                $quote.remove();
                _params = $.extend({
                    "normriceItem.npiid": _npiid
                }, quo.basicParams);
                com.post(api.quotation.deleteNormriceItem, _params, function(res) {

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

            quo.quotationId = params.quotation.quotation ? params.quotation.quotation.qid : null;
            quo.orderid = params.quotation.orderId;

            var orderId = params.quotation.orderId;
            var editFlg = params.quotation.editFlg;

            editFlg ? quotationId = quo.quotationId : com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                'quotation.orderId': orderId
            }, function(res) {

                quo.quotationId = res.quotation.qid;
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

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": quo.orderid
            }, function(res) {

                com.focusPage('#orderId').text(res.decoration.orderId)
                com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
                com.focusPage('#version').text(res.decoration.version.name);
            });

            com.post(api.quotation.queryQuotationNormood, {
                "quotation.qid": quo.quotationId
            }, function(res) {

                $.each(res.quotationFunctionAreas, function(i, v) {

                    $.each(v.quotationFunctionAreaItems, function(j, qv) {

                        var normood = qv.normood;

                        normood["type"] = 0;
                        normood["normtype"] = 0;

                        quo.normnumtotal = utils.accAdd(quo.normnumtotal, normood.normnum);
                        quo.storenumtotal = utils.accAdd(quo.storenumtotal, normood.storenum);

                        quotationFunctionAreas[0].quotationFunctionAreaItems.push(normood);

                    });
                });

            }, null, false);

            com.post(api.quotation.queryExtensionNormood, {
                "extension.orderId": quo.orderid
            }, function(res) {

                $.each(res.extensions, function(i, v) {

                    $.each(v.extensionItems, function(j, qv) {

                        var normood = qv.normood;

                        normood["type"] = 1;
                        normood["normtype"] = 0;

                        quo.normnumtotal = utils.accAdd(quo.normnumtotal, normood.normnum);
                        quo.storenumtotal = utils.accAdd(quo.storenumtotal, normood.storenum);

                        quotationFunctionAreas[0].quotationFunctionAreaItems.push(normood);

                    });
                });

            }, null, false);

            com.post(api.quotation.queryAddReduceNormood, {
                "addReduce.orderId": quo.orderid
            }, function(res) {

                $.each(res.addReduces, function(i, v) {

                    var functionAreaName = v.quotationFunctionAreaName;
                    var functionAreaId = v.quotationFunctionAreaId;

                    $.each(v.addReduceItems, function(j, qv) {

                        var normood = qv.normood;

                        normood["type"] = 2;
                        normood["normtype"] = 0;

                        quo.normnumtotal = utils.accAdd(quo.normnumtotal, normood.normnum);
                        quo.storenumtotal = utils.accAdd(quo.storenumtotal, normood.storenum);

                        quotationFunctionAreas[0].quotationFunctionAreaItems.push(normood);
                    });
                });

            }, null, false);

            com.post(api.quotation.queryNormoodItem, {
                "normoodItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.normoodItems, function(i, v) {

                    quo.normnumtotal = utils.accAdd(quo.normnumtotal, v.normnum);
                    quo.storenumtotal = utils.accAdd(quo.storenumtotal, v.storenum);

                    quotationFunctionAreas[0].quotationFunctionAreaItems.push(v);
                });
            }, null, false);

            com.post(api.quotation.queryQuotationNormrice, {
                "quotation.qid": quo.quotationId
            }, function(res) {

                $.each(res.quotationFunctionAreas, function(i, v) {

                    var functionAreaName = v.functionAreaName;
                    var functionAreaId = v.qfaid;

                    $.each(v.quotationFunctionAreaItems, function(j, qv) {

                        var normrice = qv.normrice;

                        normrice["num"] = qv.initNum;
                        normrice["type"] = 0;
                        normrice["normtype"] = 0;

                        var _total = utils.changeThrDecimal(utils.accMul(normrice.num, normrice.salary));
                        quo.normricetotal = utils.accAdd(quo.normricetotal, _total);

                        quotationFunctionAreasa[0].quotationFunctionAreaItems1.push(qv.normrice);

                    });
                });

            }, null, false);

            com.post(api.quotation.queryExtensionNormrice, {
                "extension.orderId": quo.orderid
            }, function(res) {

                $.each(res.extensions, function(i, v) {

                    $.each(v.extensionItems, function(j, qv) {

                        var normrice = qv.normrice;

                        normrice["num"] = qv.num;
                        normrice["type"] = 1;
                        normrice["normtype"] = 0;

                        var _total = utils.changeThrDecimal(utils.accMul(normrice.num, normrice.salary));
                        quo.normricetotal = utils.accAdd(quo.normricetotal, _total);

                        quotationFunctionAreasa[0].quotationFunctionAreaItems1.push(qv.normrice);

                    });
                });

            }, null, false);

            com.post(api.quotation.queryAddReduceNormrice, {
                "addReduce.orderId": params.quotation.orderId
            }, function(res) {

                addreduces = res.addReduces;

                $.each(addreduces, function(i, v) {

                    $.each(v.addReduceItems, function(j, qv) {

                        var normrice = qv.normrice;

                        normrice["num"] = qv.num;
                        normrice["type"] = 2;
                        normrice["normtype"] = 0;

                        var _total = utils.changeThrDecimal(utils.accMul(normrice.num, normrice.salary));
                        quo.normricetotal = utils.accAdd(quo.normricetotal, _total);

                        quotationFunctionAreasa[0].quotationFunctionAreaItems1.push(qv.normrice);

                    });
                });
            }, null, false);

            com.post(api.quotation.queryNormriceItem, {
                "normriceItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.normriceItems, function(i, v) {

                    var _total = utils.changeThrDecimal(utils.accMul(v.num, v.salary));
                    quo.normricetotal = utils.accAdd(quo.normricetotal, _total);
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

            quo.init();
            domain.init();
            quote.init();
        }
    };

})();

$(function() {

    QuotationDetail.init();
});