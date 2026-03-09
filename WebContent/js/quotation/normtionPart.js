var QuotationDetail = (function() {

    var quo = {
        protationId: null, // 预签ID
        versionId: null, // 预签版本
        normtionId: null,
        basicParams: null,

        normnumtotal: 0,
        storenumtotal: 0,
        normnumtotals: 0,
        storenumtotals: 0,
        normricetotal: 0,
        normricetotals: 0,
        normtimetotal: 0,
        normtimetotals: 0,
        trannum: 0,
        sayary: 0,

        quoModals: {},
        settingBtns: {},
        quoteCalculation: {},
        machingType: {},
        typeness: {},

        items: {
            noodsName: com.focusPage('#noodsName'),
            unit: com.focusPage('#unit'),
            normoNum: com.focusPage('#normoNum'),
            constructionNode: com.focusPage('#constructionNode'),
            normrName: com.focusPage('#normrName'),
            salary: com.focusPage('#salary'),
            normtimeConstructionNode: com.focusPage('#normtimeConstructionNode'),
            normtName: com.focusPage('#normtName'),
            workdays: com.focusPage('#workdays')
        },

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
                // 材料项
                $btnNormoodItempack: com.focusPage('#normooditem').on('click', function() {

                    that.quoModals.$domainNormoodItemModal.modal("show");
                }),
                // 附加项
                $btnAddtionitem: com.focusPage('#addtionitem').on('click', function() {

                    that.quoModals.$domainNormriceModal.modal("show");
                }),
                // 工费项
                $btnNormriceItempack: com.focusPage('#normriceitem').on('click', function() {

                    that.quoModals.$domainNormriceItemModal.modal("show");
                }),
                // 工时项
                $btnNormtimeItempack: com.focusPage('#normtimeitem').on('click', function() {

                    that.quoModals.$domainNormtimeItemModal.modal("show");
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

                $domainNormoodItemModal: com.focusPage("#normoodModal").on("show.bs.modal", function(a) {

                    com.cleanItems(quo.items);
                }),

                $domainNormriceModal: com.focusPage("#normriceItemModal").on("show.bs.modal", function(a) {

                    com.focusPage('input[name="num"]').val('');
                }),
                $domainNormriceItemModal: com.focusPage("#normriceModal").on("show.bs.modal", function(a) {

                    com.cleanItems(quo.items);
                }),

                $domainNormtimeItemModal: com.focusPage("#normtimeModal").on("show.bs.modal", function(a) {

                    com.cleanItems(quo.items);
                })
            },
            // 初始化功能区添加
            com.post(api.data.queryNormpack, {}, function(data) {

                data.normpacks.length && $.each(data.normpacks, function(i, v) {

                    if (v.type != constant.quotation().normoodItem.TYPE_OFFER_INT) {
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

                var that = $(this);

                var _storenumtotal = parseFloat(that.attr('data-storenum'));
                var _normnumtotal = parseFloat(that.attr('data-normnum'));
                var atttype = that.attr('data-atttype');

                normnumtotal = utils.changeThrDecimal(utils.accAdd(normnumtotal, utils.accMul(_normnumtotal, atttype == "0" ? 1 : -1)));
                storenumtotal = utils.changeThrDecimal(utils.accAdd(storenumtotal, utils.accMul(_storenumtotal, atttype == "0" ? 1 : -1)));
            });

            com.focusPage('#normnumtotal').text(normnumtotal);
            com.focusPage('#storenumtotal').text(storenumtotal);
        },

        normriceQuoFees: function(func) {

            var normricetotal = 0;
            var normnodes = {};

            var $domains = [];

            $.each(com.focusPage('#normriceItem1 .fl-quo-item.item'), function(i, v) {

                $domains.push(v);
            });

            $.each(com.focusPage('#normriceItem3 .fl-quo-item.item'), function(i, v) {

                $domains.push(v);
            });

            if (!$domains.length) {
                return false;
            }

            $.each($domains, function(i, v) {

                var that = $(this);

                var _datasalary = parseFloat(that.attr('data-salary'));
                var _datanum = parseFloat(that.attr('data-num'));
                var _datatrannum = parseFloat(that.attr('data-trannum'));
                
                var num = parseFloat(_datatrannum == '0' ? 1 : _datanum);
                var trannum = parseFloat(_datatrannum == '0' ? 1 : _datatrannum);
                var salary = parseFloat(_datasalary);
                var atttype = that.attr('data-atttype');
                
                var _normricetotal = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, utils.accMul(num, salary)), atttype == "0" ? 1 : -1));

                normricetotal = utils.changeThrDecimal(utils.accAdd(normricetotal, _normricetotal));

                var _schedule = that.attr('data-name');

                if (normnodes["#cn_" + _schedule]) {
                    normnodes["#cn_" + _schedule] = utils.accAdd(normnodes["#cn_" + _schedule], _normricetotal);
                } else {
                    normnodes["#cn_" + _schedule] = utils.accAdd(0, _normricetotal);
                }
            });

            com.focusPage('#normricetotal').text(normricetotal);

            com.focusPage("#normriceSumList").find(".normnodesum").each(function(i, e) {

                $(e).text(0).attr("data-total", 0);
            });

            $.each(normnodes, function(k, v) {

                var nodesum = com.focusPage(k);

                if (!nodesum)
                    return true;

                nodesum.text(v).attr("data-total", v);
            });

        },

        normtimeQuoFees: function(func) {

            var normtimetotal = 0;
            var normtimenodes = {};

            var $domains = [];

            $.each(com.focusPage('#normtimeItem1 .fl-quo-item.item'), function(i, v) {

                $domains.push(v);
            });

            $.each(com.focusPage('#normtimeItem3 .fl-quo-item.item'), function(i, v) {

                $domains.push(v);
            });

            if (!$domains.length) {
                return false;
            }

            $.each($domains, function(i, v) {

                var that = $(this);

                var _dataworkdays = parseFloat(that.attr('data-workdays'));
                var _datanum = parseFloat(that.attr('data-num'));
                var _datatrannum = parseFloat(that.attr('data-trannum'));

                var num = parseFloat(_datatrannum == '0' ? 1 : _datanum);
                var trannum = parseFloat(_datatrannum == '0' ? 1 : _datatrannum);
                var workdays = parseFloat(_dataworkdays);
                var atttype = that.attr('data-atttype');

                var _normtimetotal = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, utils.accMul(num, workdays)), atttype == "0" ? 1 : -1));

                normtimetotal = utils.changeThrDecimal(utils.accAdd(normtimetotal, _normtimetotal));

                var _schedule = that.attr('data-name');

                if (normtimenodes["#cnt_" + _schedule]) {
                    normtimenodes["#cnt_" + _schedule] = utils.accAdd(normtimenodes["#cnt_" + _schedule], _normtimetotal);
                } else {
                    normtimenodes["#cnt_" + _schedule] = utils.accAdd(0, _normtimetotal);
                }
            });

            com.focusPage('#normtimetotal').text(normtimetotal);

            com.focusPage("#normtimeSumList").find(".normtimenodesum").each(function(i, e) {

                $(e).text(0).attr("data-total", 0);
            });

            $.each(normtimenodes, function(k, v) {

                var nodesum = com.focusPage(k);

                if (!nodesum)
                    return true;

                nodesum.text(v).attr("data-total", v);
            });

        },
        init: function() {

            this.initQuoModals();
            this.initSettingBtns();
        }
    };

    var painter = {

        createdomain: function(dv) {

            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var _btnSet = {
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up functionindexdata="1" id="oneChevron_1"></i>', true]
            };

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == constant.quotation().normoodItem.TYPE_OFFER_INT ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.name));
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

        nomricedomain: function(dv) {

            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var _btnSet = {
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up functionindexdata="1" id="oneChevron_1"></i>', true]
            };

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == constant.quotation().normriceItem.TYPE_OFFER_INT ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.name));
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

            // 根据 dv.name 或 dv.index 来决定列表类型和表头
            var listType = (dv.name === "工时") ? "normtime" : "normrice";
            var fieldLabel = (dv.name === "工时") ? "工时(天)" : "工费";

            var _lineSet = [["line", "0"], ["formula", "数量"], ["num", fieldLabel], ["name", "施工进度"], ["type", "类型"], ["num totalPrice", "总额"], ["btns", "功能"]];

            var $ul = $('<ul></ul>').addClass('fl-quo-list');
            var $li = $('<li></li>').addClass('fl-quo-item').appendTo($ul);
            $.each(_lineSet, function(i, v) {

                var $div = $('<div></div>').addClass('cell ' + v[0]).appendTo($li);
                var $span = $('<span></span').addClass('cell-wrap').text(v[1]).appendTo($div);

            });

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list items').attr("id", listType + "Item" + dv.type);
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append($ul).append($dbody);

            if (dv.quotationFunctionAreaItems1.length) {

                var _items = dv.quotationFunctionAreaItems1;

                $.each(_items, function(i, v) {

                    if (dv.name === "工时") {
                        $list.append(that.normtimeQuote($list, i + 1, v));
                    } else {
                        $list.append(that.normriceQuote($list, i + 1, v));
                    }
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

            var $quote = list.find('li[data-nid=' + qv.noods.nid + '][data-normtype=0]');

            // if ($quote.length != 0 && qv.normtype == 0) {

            // var normnum = utils.accAdd($quote.attr("data-normnum"), qv.normnum);
            // var storenum = utils.accAdd($quote.attr("data-storenum"), qv.storenum);

            // $quote.attr("data-normnum", normnum);
            // $quote.attr("data-storenum", storenum);

            // $quote.find(".formula>.cell-wrap").text(normnum);
            // $quote.find(".num>.cell-wrap").text(storenum);

            // return "";
            // }

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content).attr({
                "data-normnum": qv.normnum,
                "data-storenum": qv.storenum,
                "data-nid": qv.noods.nid,
                "data-normtype": qv.normtype,
                "data-atttype": qv.atttype,
            });

            var _typeName = "-";

            if (qv.normtype == constant.quotation().normoodItem.NORMTYPE_MATERIAL_INT && qv.type == constant.quotation().normoodItem.TYPE_OFFER_INT) {
                _typeName = constant.quotation().normoodItem.type.keys[constant.quotation().normoodItem.TYPE_OFFER_INT];
            }

            if (qv.normtype == constant.quotation().normoodItem.NORMTYPE_MATERIAL_INT && qv.type == constant.quotation().normoodItem.TYPE_EXPAND_INT) {
                _typeName = constant.quotation().normoodItem.type.keys[constant.quotation().normoodItem.TYPE_EXPAND_INT];
            }

            if (qv.normtype == constant.quotation().normoodItem.NORMTYPE_MATERIAL_INT && qv.type == constant.quotation().normoodItem.TYPE_ADDCUT_INT) {
                _typeName = constant.quotation().normoodItem.type.keys[constant.quotation().normoodItem.TYPE_ADDCUT_INT];
            }

            if (qv.normtype == constant.quotation().normoodItem.NORMTYPE_MATERIAL_INT && qv.type == constant.quotation().normoodItem.TYPE_QUOTA_INT) {
                _typeName = constant.quotation().normoodItem.type.keys[constant.quotation().normoodItem.TYPE_QUOTA_INT];
            }

            if (qv.normtype == constant.quotation().normoodItem.NORMTYPE_PACK_INT) { // 工费
                _typeName = constant.quotation().normoodItem.normtype.keys[constant.quotation().normoodItem.NORMTYPE_PACK_INT];
            }

            var _lineSet = [];

            _lineSet.push(["line", list.find("li").length + 1, ["data-areaType", qv.areaType]]);
            _lineSet.push(["formula", qv.normnum ? qv.normnum : "0"]);
            _lineSet.push(["num", qv.storenum, ["data-subtype", qv.subtype]]);
            _lineSet.push(["name", qv.noods.name, ["data-piid", qv.piid]]);
            _lineSet.push(["type", _typeName, ["data-type", qv.type]]);
            _lineSet.push(["unit", qv.normunit]);
            _lineSet.push(["worktype", qv.storeunit]);

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

            var colour = qv.normtype == constant.quotation().normoodItem.NORMTYPE_PACK_INT || qv.type == constant.quotation().normriceItem.TYPE_QUOTA_INT ? "pink" : "grey";

            $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)",
                "type": "checkbox",
                "role": "checkbox",
                "name": "deleteItems",
                "data-ngiid": qv.ngiid ? qv.ngiid : ""
            }).val(qv.ngiid).css({
                "padding-left": "5px"
            }).append($('<i class="bigger-125 icon-remove"></i>').addClass(colour));

            $btnCellWrap.append($inputLable).append($btnDel);
            $btnDel.click(function(e) {

                if (qv.normtype == constant.quotation().normoodItem.NORMTYPE_PACK_INT || qv.type == constant.quotation().normriceItem.TYPE_QUOTA_INT)
                    quote.deleteQuote($item);

                return false;
            });

            return $item;
        },

        // 附加项
        normriceQuote: function(list, linenum, qv) {

            var $quote = list.find('li[data-name= "' + qv.constructionNode.sort + '" ][data-salary= "' + qv.salary + '"][data-normtype=0]');

            // if ($quote.length != 0 && qv.normtype == 0) {

            // var num = utils.accAdd($quote.attr("data-num"), qv.num);
            // var total = utils.accAdd(parseFloat($quote.find(".totalPrice>.cell-wrap").text()), utils.accMul(qv.num, qv.salary));

            // $quote.attr("data-num", num);

            // $quote.find(".formula>.cell-wrap").text(num);
            // $quote.find(".totalPrice>.cell-wrap").text(total);

            // return "";
            // }

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.npiid).attr({
                "data-salary": qv.salary,
                "data-num": qv.num,
                "data-trannum": qv.trannum,
                "data-name": qv.constructionNode.sort,
                "data-normtype": qv.normtype,
                "data-atttype": qv.atttype,
            });

            var _total = 0;

            var _typeName = "-";

            if (qv.normtype == constant.quotation().normriceItem.NORMTYPE_WORKFEE_INT && qv.type == constant.quotation().normriceItem.TYPE_OFFER_INT) {
                _typeName = constant.quotation().normriceItem.type.keys[constant.quotation().normriceItem.TYPE_OFFER_INT];
            }

            if (qv.normtype == constant.quotation().normriceItem.NORMTYPE_WORKFEE_INT && qv.type == constant.quotation().normriceItem.TYPE_EXPAND_INT) {
                _typeName = constant.quotation().normriceItem.type.keys[constant.quotation().normriceItem.TYPE_EXPAND_INT];
            }

            if (qv.normtype == constant.quotation().normriceItem.NORMTYPE_WORKFEE_INT && qv.type == constant.quotation().normriceItem.TYPE_ADDCUT_INT) {
                _typeName = constant.quotation().normriceItem.type.keys[constant.quotation().normriceItem.TYPE_ADDCUT_INT];
            }

            if (qv.normtype == constant.quotation().normriceItem.NORMTYPE_WORKFEE_INT && qv.type == constant.quotation().normriceItem.TYPE_QUOTA_INT) {
                _typeName = constant.quotation().normriceItem.type.keys[constant.quotation().normriceItem.TYPE_QUOTA_INT];
            }

            if (qv.normtype == constant.quotation().normriceItem.NORMTYPE_ADD_INT) { // 工费
                _typeName = constant.quotation().normriceItem.normtype.keys[constant.quotation().normriceItem.NORMTYPE_ADD_INT];
            }
            
            var num = parseFloat(qv.trannum == '0' ? 1 : qv.num);
            var trannum = parseFloat(qv.trannum == '0' ? 1 : qv.trannum);
            var salary = parseFloat(qv.salary);
            
            _total = utils.changeThrDecimal(utils.accMul(trannum, utils.accMul(num, salary)));
            
            var _lineSet = [];

            _lineSet.push(["line", list.find("li").length + 1, ["data-areaType", qv.areaType]]);
            _lineSet.push(["formula", num, ]);
            _lineSet.push(["num", qv.salary]);
            _lineSet.push(["name", qv.constructionNode.name]);
            _lineSet.push(["type", _typeName, ["data-type", qv.type]]);
            _lineSet.push(["num totalPrice", _total]);

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

            var colour = qv.normtype == constant.quotation().normriceItem.NORMTYPE_ADD_INT || qv.type == constant.quotation().normriceItem.TYPE_QUOTA_INT ? "pink" : "grey"

            $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)",
                "type": "checkbox",
                "role": "checkbox",
                "name": "deleteItems",
                "data-npiid": qv.npiid ? qv.npiid : ""
            }).val(qv.npiid).css({
                "padding-left": "5px"
            }).append($('<i class="bigger-125 icon-remove"></i>').addClass(colour));

            $btnCellWrap.append($inputLable).append($btnDel);

            $btnDel.click(function(e) {

                if (qv.normtype == constant.quotation().normriceItem.NORMTYPE_ADD_INT || qv.type == constant.quotation().normriceItem.TYPE_QUOTA_INT)

                    quote.deleteNormriceQuote($item);

                return false;
            });

            return $item;
        },

        // 工时项
        normtimeQuote: function(list, linenum, qv) {

            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.ntiid).attr({
                "data-workdays": qv.workdays,
                "data-num": qv.num,
                "data-trannum": qv.trannum,
                "data-name": qv.constructionNode.sort,
                "data-normtype": qv.normtype,
                "data-atttype": qv.atttype,
            });

            var _total = 0;

            var _typeName = "-";

            if (qv.normtype == 0 && qv.type == 0) {
                _typeName = "报价项";
            }

            if (qv.normtype == 0 && qv.type == 1) {
                _typeName = "增项";
            }

            if (qv.normtype == 0 && qv.type == 2) {
                _typeName = "增减项";
            }

            if (qv.normtype == 0 && qv.type == 3) {
                _typeName = "定额";
            }

            if (qv.normtype == 1) { // 附加型定额
                _typeName = "附加";
            }

            var num = parseFloat(qv.trannum == '0' ? 1 : qv.num);
            var trannum = parseFloat(qv.trannum == '0' ? 1 : qv.trannum);
            var workdays = parseFloat(qv.workdays);

            _total = utils.changeThrDecimal(utils.accMul(trannum, utils.accMul(num, workdays)));

            var _lineSet = [];

            _lineSet.push(["line", list.find("li").length + 1, ["data-areaType", qv.areaType]]);
            _lineSet.push(["formula", num]);
            _lineSet.push(["num", qv.workdays + " 天"]);
            _lineSet.push(["name", qv.constructionNode.name]);
            _lineSet.push(["type", _typeName, ["data-type", qv.type]]);
            _lineSet.push(["num totalPrice", _total]);

            var $btnCell, $btnCellWrap, $inputLable, $ispan, $btnDel;

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

            var colour = qv.normtype == 1 || qv.type == 3 ? "pink" : "grey";

            $btnDel = $('<a></a>').attr({
                "href": "javascript:void(0)",
                "type": "checkbox",
                "role": "checkbox",
                "name": "deleteItems",
                "data-ntiid": qv.ntiid ? qv.ntiid : ""
            }).val(qv.ntiid).css({
                "padding-left": "5px"
            }).append($('<i class="bigger-125 icon-remove"></i>').addClass(colour));

            $btnCellWrap.append($inputLable).append($btnDel);

            $btnDel.click(function(e) {

                if (qv.normtype == 1 || qv.type == 3)

                    quote.deleteNormtimeQuote($item);

                return false;
            });

            return $item;
        }
    };

    var domain = {
        noewEditDomain: null,

        saveNormoodToDomain: function() {

            var that = this;

            com.focusPage('#addNormoodItem').click(function() {

                if (com.validate("normoodItemModal"))
                    return false;

                quote.addquotationNormood();
                quo.quoModals.$domainTempletModal.modal("hide");
            });
        },
        saveNormoodItemDomain: function() {

            var that = this;

            com.focusPage('#addNormood').click(function() {

                if (com.validate("normoodModal"))
                    return false;

                var _param = {
                    "quotation.qid": quo.quotationId,
                    "normoodItems[0].noods.nid": com.typeahead(quo.items.noodsName),
                    "normoodItems[0].normunit": quo.items.unit.val(),
                    "normoodItems[0].normnum": quo.items.normoNum.val(),
                    "normoodItems[0].storeunit": quo.items.unit.val(),
                    "normoodItems[0].storenum": quo.items.normoNum.val()
                };

                com.post(api.quotation.addNormoodItem, _param, function(res) {

                    var _list = com.focusPage("#normoodItem1");

                    $.each(res.normoodItems, function(i, v) {

                        _list.append(painter.createQuote(_list, _list.find("li").length + 1, v));
                    });

                    quo.calculateQuoFees();

                    quo.quoModals.$domainNormoodItemModal.modal("hide");

                }, null, false);

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
        saveNormriceItemDomain: function() {

            com.focusPage('#addNormrice').click(function() {

                if (com.validate("normriceModal"))
                    return false;

                var options = {
                    "normtion.qid": quo.quotationId,
                    "normriceItem.constructionNode.cnid": quo.items.constructionNode.val(),
                    "normriceItem.name": quo.items.normrName.val(),
                    "normriceItem.num": 1,
                    "normriceItem.trannum": 1,
                    "normriceItem.salary": quo.items.salary.val()
                };

                com.post(api.quotation.addNormriceItem, options, function(res) {

                    var _list = com.focusPage("#normriceItem1");

                    _list.append(painter.normriceQuote(_list, _list.find("li").length + 1, res.normriceItem));

                    quo.normriceQuoFees();

                    quo.quoModals.$domainNormriceItemModal.modal("hide");

                }, null, false);

            });
        },
        saveNormtimeItemDomain: function() {

            com.focusPage('#addNormtime').click(function() {

                if (com.validate("normtimeModal"))
                    return false;

                var options = {
                    "normtion.qid": quo.quotationId,
                    "normtimeItem.constructionNode.cnid": quo.items.normtimeConstructionNode.val(),
                    "normtimeItem.name": quo.items.normtName.val(),
                    "normtimeItem.num": 1,
                    "normtimeItem.trannum": 1,
                    "normtimeItem.workdays": quo.items.workdays.val()
                };

                com.post(api.quotation.addNormtimeItem, options, function(res) {

                    var _list = com.focusPage("#normtimeItem1");

                    _list.append(painter.normtimeQuote(_list, _list.find("li").length + 1, res.normtimeItem));

                    quo.normtimeQuoFees();

                    quo.quoModals.$domainNormtimeItemModal.modal("hide");

                }, null, false);

            });
        },
        makeNormtionForQuotation: function() {

            com.focusPage('#makeQuotation').click(function() {

                var params = {
                    "normtion.qid": quo.quotationId,
                    "normtion.orderId": quo.orderid,
                    "normtion.moodPrintNum": 0,
                    "normtion.moodTotal": 0,
                    "normtion.mricePriceNum": 0,
                    "normtion.mriceTotal": 0
                };

                com.post(api.quotation.makeNormtion, params, function() {

                    com.focusPage("#normoodItem1").html('');
                    com.focusPage("#normriceItem1").html('');

                    quote.makeNormtion();
                });

            });
        },

        init: function() {

            this.saveNormoodToDomain();
            this.saveNormoodItemDomain();
            this.saveNormriceDoamin();
            this.saveNormriceItemDomain();
            this.saveNormtimeItemDomain();
            this.makeNormtionForQuotation();
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
                var _list = com.focusPage("#normoodItem0");

                $.each(_items, function(i, v) {

                    _list.append(painter.createQuote(_list, _list.find("li").length + 1, v))
                });
            }, null, false);
            quo.calculateQuoFees();
        },

        // 增加方法--附加项
        addQuotationNormrice: function() {

            var npid = com.focusPage("[name='quotempla']").val();
            var num = com.focusPage("[name='num']").val();

            var options = {
                "normtion.qid": quo.quotationId,
                "normriceItem.sid": npid,
                "normriceItem.num": num
            };

            com.post(api.quotation.addNormriceItem, options, function(data) {

                var _list = com.focusPage("#normriceItem3");

                _list.append(painter.normriceQuote(_list, _list.find("li").length + 1, data.normriceItem));

            }, null, false);
            quo.normriceQuoFees();
        },

        makeNormtion: function() {

            quo.normnumtotals = 0;
            quo.storenumtotals = 0;
            quo.normricetotals = 0;
            quo.normtimetotals = 0;

            com.post(api.quotation.queryNormoodItem, {
                "normoodItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.normoodItems, function(i, v) {

                    if (v.normtype == 0) {

                        var _list = com.focusPage("#normoodItem1");

                        quo.normnumtotals = utils.accAdd(quo.normnumtotals, utils.accMul(v.normnum, v.atttype == "0" ? 1 : -1));
                        quo.storenumtotals = utils.accAdd(quo.storenumtotals, utils.accMul(v.normnum, v.atttype == "0" ? 1 : -1));

                        _list.append(painter.createQuote(_list, _list.find("li").length + 1, v));
                    }

                });

            }, null, false);

            com.post(api.quotation.queryNormriceItem, {
                "normriceItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.normriceItems, function(i, v) {

                    if (v.normtype == 0) {

                        var _list = com.focusPage("#normriceItem1");

                        var _total = utils.changeThrDecimal(utils.accMul(utils.accMul(v.num, v.salary), v.atttype == "0" ? 1 : -1));

                        quo.normricetotals = utils.accAdd(quo.normricetotals, _total);

                        _list.append(painter.normriceQuote(_list, _list.find("li").length + 1, v));
                    }

                });

            }, null, false);

            com.post(api.quotation.queryNormtimeItem, {
                "normtimeItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.normtimeItems, function(i, v) {

                    if (v.normtype == 0) {

                        var _list = com.focusPage("#normtimeItem1");

                        var num = parseFloat(v.trannum == '0' ? 1 : v.num);
                        var trannum = parseFloat(v.trannum == '0' ? 1 : v.trannum);
                        var workdays = parseFloat(v.workdays);
                        var _total = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, utils.accMul(num, workdays)), v.atttype == "0" ? 1 : -1));

                        quo.normtimetotals = utils.accAdd(quo.normtimetotals, _total);

                        _list.append(painter.normtimeQuote(_list, _list.find("li").length + 1, v));
                    }

                });

            }, null, false);

            com.focusPage('#normnumtotals').text(quo.normnumtotals);
            com.focusPage('#storenumtotals').text(quo.storenumtotals);
            com.focusPage('#normricetotals').text(quo.normricetotals);
            com.focusPage('#normtimetotals').text(quo.normtimetotals);

            quo.calculateQuoFees();
            quo.normriceQuoFees();
            quo.normtimeQuoFees();
        },
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

                com.post(api.quotation.deleteNormriceItem, _params);

                quo.normriceQuoFees();
            }
        },
        deleteNormtimeQuote: function($quote) {

            var that = this;
            var _ntiid = $quote.find('a[type="checkbox"]').val();
            var _params = {};

            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list.items')).addClass('hide');

            if (!_ntiid) {
                $quote.remove();
            } else {

                $quote.remove();

                _params = $.extend({
                    "normtimeItem.ntiid": _ntiid
                }, quo.basicParams);

                com.post(api.quotation.deleteNormtimeItem, _params);

                quo.normtimeQuoFees();
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
                "name": "打包",
                "functionAreaOrder": 1,
                "functionAreaType": 0,
                "type": 0,
                "total": 0,
                "index": 1,
                "quotationFunctionAreaItems": [],
            }, {
                "pfaid": 2,
                "name": "材料",
                "functionAreaOrder": 2,
                "functionAreaType": 0,
                "type": 1,
                "total": 0,
                "index": 2,
                "quotationFunctionAreaItems": [],
            }];
            var quotationFunctionAreasa = [{
                "pfaid": 3,
                "name": "附加",
                "functionAreaOrder": 3,
                "functionAreaType": 1,
                "type": 3,
                "total": 0,
                "index": 3,
                "quotationFunctionAreaItems1": [],
            }, {
                "pfaid": 4,
                "name": "工费",
                "functionAreaOrder": 4,
                "functionAreaType": 1,
                "type": 1,
                "total": 0,
                "index": 4,
                "quotationFunctionAreaItems1": [],
            }, {
                "pfaid": 5,
                "name": "工时",
                "functionAreaOrder": 5,
                "functionAreaType": 1,
                "type": 1,
                "total": 0,
                "index": 5,
                "quotationFunctionAreaItems1": [],
            }];

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": quo.orderid
            }, function(res) {

                com.focusPage('#orderId').text(res.decoration.orderId)
                com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
                com.focusPage('#version').text(res.decoration.version.name);
            });

            com.post(api.data.queryConstructionNode, {}, function(res) {

                var sumlist = com.focusPage("#normriceSumList");

                $.each(res.constructionNodes, function(i, v) {

                    var group = $('<div class="form-group"></div>').appendTo(sumlist);

                    $('<label class=" col-md-6 no-padding-right"></label>').text(v.name + "总额").appendTo(group);
                    $('<label class=" col-md-6 no-padding-left normnodesum"></label>').attr("id", "cn_" + v.sort).attr("data-total", 0).text(0).appendTo(group);
                });

                // 创建工时汇总节点
                var normtimesumlist = com.focusPage("#normtimeSumList");

                $.each(res.constructionNodes, function(i, v) {

                    var group = $('<div class="form-group"></div>').appendTo(normtimesumlist);

                    $('<label class=" col-md-6 no-padding-right"></label>').text(v.name + "总额").appendTo(group);
                    $('<label class=" col-md-6 no-padding-left normtimenodesum"></label>').attr("id", "cnt_" + v.sort).attr("data-total", 0).text(0).appendTo(group);
                });

            }, null, false);

            com.initTypeahead('noodsName', api.data.queryNoodsByName, "noods.name", {}, "noodes", "nid", "name", null);

            com.post(api.common.queryMeasurementUnit, {}, function(res) {

                quo.items.unit.bindData(res.measurementUnits, "name", "name");
            }, null, false);

            com.post(api.data.queryConstructionNodeByOrderId, {
                "orderId": quo.orderid
            }, function(res) {

                quo.items.constructionNode.bindData(res.constructionNodes, 'cnid', 'name');
                quo.items.normtimeConstructionNode.bindData(res.constructionNodes, 'cnid', 'name');
            }, null, false);

            com.post(api.quotation.queryNormoodItem, {
                "normoodItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.normoodItems, function(i, v) {

                    if (v.normtype == 0) {
                        quo.normnumtotals = utils.accAdd(quo.normnumtotals, utils.accMul(v.normnum, v.atttype == "0" ? 1 : -1));
                        quo.storenumtotals = utils.accAdd(quo.storenumtotals, utils.accMul(v.storenum, v.atttype == "0" ? 1 : -1));
                        quotationFunctionAreas[1].quotationFunctionAreaItems.push(v);
                    } else {
                        quo.normnumtotal = utils.accAdd(quo.normnumtotal, utils.accMul(v.normnum, v.atttype == "0" ? 1 : -1));
                        quo.storenumtotal = utils.accAdd(quo.storenumtotal, utils.accMul(v.storenum, v.atttype == "0" ? 1 : -1));
                        quotationFunctionAreas[0].quotationFunctionAreaItems.push(v);
                    }
                });
            }, null, false);

            com.post(api.quotation.queryNormriceItem, {
                "normriceItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.normriceItems, function(i, v) {
                    
                    var num = parseFloat(v.trannum == '0' ? 1 : v.num);
                    var trannum = parseFloat(v.trannum == '0' ? 1 : v.trannum);
                    var salary = parseFloat(v.salary);
                    
                    if (v.normtype == 0) {
                        var _total = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, utils.accMul(num, salary)), v.atttype == "0" ? 1 : -1));
                        quo.normricetotals = utils.changeThrDecimal(utils.accAdd(quo.normricetotals, _total));
                        quotationFunctionAreasa[1].quotationFunctionAreaItems1.push(v);
                    } else {
                        var _total = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, utils.accMul(num, salary)), v.atttype == "0" ? 1 : -1));
                        quo.normricetotal = utils.changeThrDecimal(utils.accAdd(quo.normricetotal, _total));
                        quotationFunctionAreasa[0].quotationFunctionAreaItems1.push(v);
                    }

                });
            }, null, false);

            com.post(api.quotation.queryNormtimeItem, {
                "normtimeItem.qid": quo.quotationId
            }, function(res) {

                $.each(res.normtimeItems, function(i, v) {

                    var num = parseFloat(v.trannum == '0' ? 1 : v.num);
                    var trannum = parseFloat(v.trannum == '0' ? 1 : v.trannum);
                    var workdays = parseFloat(v.workdays);

                    if (v.normtype == 0) {
                        var _total = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, utils.accMul(num, workdays)), v.atttype == "0" ? 1 : -1));
                        quo.normtimetotals = utils.changeThrDecimal(utils.accAdd(quo.normtimetotals, _total));
                        quotationFunctionAreasa[2].quotationFunctionAreaItems1.push(v);
                    } else {
                        var _total = utils.changeThrDecimal(utils.accMul(utils.accMul(trannum, utils.accMul(num, workdays)), v.atttype == "0" ? 1 : -1));
                        quo.normtimetotal = utils.changeThrDecimal(utils.accAdd(quo.normtimetotal, _total));
                        quotationFunctionAreasa[2].quotationFunctionAreaItems1.push(v);
                    }

                });
            }, null, false);

            $.each(quotationFunctionAreas, function(i, v) {

                if (v.type == 1)
                    $domain = painter.createdomain(v).appendTo(com.focusPage('#functionAreaDetailList'));
            });
            $.each(quotationFunctionAreasa, function(i, v) {

                if (v.type == 1)
                    $domain = painter.nomricedomain(v).appendTo(com.focusPage('#functionAreaDetailList'));
            });

            com.focusPage('#normnumtotal').text(quo.normnumtotal);
            com.focusPage('#storenumtotal').text(quo.storenumtotal);

            com.focusPage('#normricetotal').text(quo.normricetotal);

            com.focusPage('#normnumtotals').text(quo.normnumtotals);
            com.focusPage('#storenumtotals').text(quo.storenumtotals);

            com.focusPage('#normricetotals').text(quo.normricetotals);

            com.focusPage('#normtimetotals').text(quo.normtimetotals);

            quo.calculateQuoFees();
            quo.normriceQuoFees();
            quo.normtimeQuoFees();

            quo.init();
            domain.init();
            quote.init();
        }
    };

})();

$(function() {

    QuotationDetail.init();
});