jQuery(function($) {

    var vpayment = {

        vpaymentPostData: {},

        saveBtn: com.focusPage("#saveBtn"),
        collectPaymentBtn: com.focusPage("#collectPaymentBtn"),

        modals: {
            vpaymentModal: com.focusPage("#vpaymentModal")
        },
        items: {
            mno: com.focusPage('#mno'),
            orderId: com.focusPage('#orderId'),
            type: com.focusPage('#type'),
            brand: com.focusPage('#brand'),
            money: com.focusPage('#money'),
            comment: com.focusPage('#comment'),
            referMoney: com.focusPage('#referMoney'),
            checkbox: com.focusPage('input[type=checkbox]'),
            collectDes: com.focusPage('#collectDes'),
            cash: com.focusPage('#cash'),
            couponType: com.focusPage("#couponType"),
            couponVal: com.focusPage('#couponVal'),

            posDivGroup: com.focusPage("#posDivGroup"),
            bankDivGroup: com.focusPage('#bankDivGroup'),
            couponUl: com.focusPage('#couponUl'),
            bankAdd: com.focusPage('#bankAdd'),

            cashDiv: com.focusPage('#cashDiv'),
            bankDiv: com.focusPage('#bankDiv'),
            couponDiv: com.focusPage('#couponDiv')
        },

        mno: null,

        type: {},
        banks: {},

        _posway: [],
        _pos: [],
        _banks: [],

        vpids: [],
        couponInfo: "#",
        couponType: []
    };

    vpayment.saveBtn.bindClick(saveData);
    vpayment.collectPaymentBtn.bindClick(collectPayments);

    vpayment.modals.vpaymentModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanTypeahead("brand");
        com.cleanItems(vpayment.items);
    });

    com.initTypeahead('brand', api.data.queryBrandByPinyin, "brand.pinyin", {}, "brands", "name", "name", null);
    com.selectTypeahead("couponType", vpayment.couponType, 'key', 'value', null);

    vpayment.items.type.bindData(constant.information().vpayment.type.datas, "key", "value");

    com.focusPage("#cashInfo").bindData(constant.information().vpayment.ways.datas, "key", "value");

    $.each(constant.information().vpayment.posway.datas, function(i, v) {

        vpayment._posway.push(v);
    });

    $.each(constant.information().vpayment.pos.datas, function(i, v) {

        vpayment._pos.push(v);
    });

    $.each(constant.information().vpayment.banks.datas, function(i, v) {

        vpayment._banks.push(v);
    });

    $.each(constant.information().vpayment.couponType.datas, function(i, v) {

        vpayment.couponType.push(v);
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCol = $('<a></a>').addClass('btn btn-minier btn-primary').html('收款');

            var propertyArr = [["会员号:", v.mno, "grey"], ["创建人:", v.creater.currentName, "grey"], ["创建时间:", v.createTime, "green"], ["收款人:", v.collecter.currentName, "grey"], ["收款时间:", v.collectTime, "green"], ["类型:", constant.information().vpayment.type.keys[v.type], "red"], ["品类:", v.category == null || v.category == "" ? "---" : v.category, "grey"], ["品牌:", v.brand == null || v.brand == "" ? "---" : v.brand, "grey"], ["应收金额:", v.money, "blue"], ["状态:", v.status == constant.information().vpayment.STATUS_PAYED_INT ? "已付款" : "未付款", "red"], ["备注:", v.comment, "grey"]];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "vpids",
                "class": "",
                "vpid": v.vpid,
                "mno": v.mno,
                "orderId": v.orderId,
                "money": v.money,
                "status": v.status,
            }).addClass('ace ace-checkbox-2');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(constant.information().vpayment.type.keys[v.type]);

            _label.append($input).append(_span).appendTo($label);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

                $label.appendTo($h3);
            });

            $divBtnWrap.append($btnCol).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnCol.click(function() {

                com.popup4model("#layerAdd", "收款", function() {

                    com.cleanItems(vpayment.items);
                    vpayment.items.couponUl.empty();

                    vpayment.items.posDivGroup.empty();
                    vpayment.items.bankDivGroup.empty();
                    com.cleanTypeahead("couponType");

                    vpayment.vpids = [];
                    com.focusPage("[name=top]").addClass("hide");

                    vpayment.items.referMoney.val(v.money);
                    vpayment.vpids.push(v.vpid);

                    vpayment.mno = v.mno;

                    com.post(api.payment.queryPaytran, {
                        "paytran.pid": v.mno,
                        "paytran.type": 5
                    }, function(res) {

                        $.each(res.paytrans, function(i, v) {

                            if (v.status == constant.information().vpayment.STATUS_INIT_INT || v.status == constant.information().vpayment.STATUS_PAYED_INT)
                                addPos(v);
                        });
                    });

                    $("li[class='search-choice']", com.focusPage('#couponType_chosen')).each(function(i, v) {

                        var _ = $(v);
                        var _couponVal = _.find('input[name="multi_input"]').val();
                        if (_couponVal < 0) {
                            com.showAlert(com.warning, "代金券价格填写错误");
                            return false;
                        }
                    });
                });
            });

            return $liLine;

        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(["information-v-payment-no", "information-v-payment-brand", "information-v-payment-creater-name"], "condList", api.information.pageVpayment, function(data) {

        displayFunc.init('resultList', data);

    }, "pagenation", "vpaymentPostData", {
        "vpayment.status": constant.information().vpayment.STATUS_INIT_INT
    }, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'createVpayment').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $batch = $('<a></a>').addClass('btn btn-minier pull-left btn-info').attr('id', 'collects').css("margin", "0px 3px");
        var $batchi = $('<i></i>').addClass('icon-money bigger-110').appendTo($batch);
        var $batchspan = $('<span></span>').text('批量收款').appendTo($batch);

        return [$batch, $adda];
    }, 'resultList');

    var hdisplayFunc = (function() {

        var hrenderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = hcreatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var hcreatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-pink').html('打印');

            var propertyArr = [["会员号:", v.mno, "grey"], ["创建人:", v.creater.currentName, "grey"], ["创建时间:", v.createTime, "blue"], ["收款人:", v.collecter.currentName, "grey"], ["收款时间:", v.collectTime, "blue"], ["类型:", constant.information().vpayment.type.keys[v.type], "red"], ["品类:", v.category == null || v.category == "" ? "---" : v.category, "grey"], ["品牌:", v.brand == null || v.brand == "" ? "---" : v.brand, "grey"], ["应收金额:", v.money, "blue"], ["状态:", v.status == constant.information().vpayment.STATUS_PAYED_INT ? "已付款" : "未付款", "red"], ["备注:", v.comment, "grey"]];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(constant.information().vpayment.type.keys[v.type]);

            _label.append(_span).appendTo($label);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

                $label.appendTo($h3);

            });

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnPrint.click(function() {

                params.infomation.vpayment = v;
                com.popup("专用收款收据__会员编号:" + v.mno, api.index.vpaymentReceiptIndex.url, function() {

                    parent.layer.getFrameIndex(window.name);
                }, null, true);

            });

            var styleArr = [];

            v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
            v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo) {

                var info = bank + ", ";
                var _s = bankInfo.split('#');
                for ( var i = 1; i < _s.length - 1; i++) {
                    var _i = _s[i].split('|');
                    info += vpayment.banks[_i[0]] + " " + _i[1] + ", ";
                }
                return info;
            })(v.bank, v.bankInfo), "blue"]) : true;
            v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;

            $.each(styleArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulStyle);
                $label.appendTo($h3);
            });

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            return $liLine;

        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                hrenderList(tableId, listData);
            },
            drawLine: function(v) {

                return hcreatLine(v);
            }
        };
    })();

    var hsearcher = new Searcher();
    hsearcher.init(["information-v-payment-no", "information-v-payment-brand", "information-v-payment-creater-name"], "hcondList", api.information.pageVpayment, function(data) {

        hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "hvpaymentPostData", {
        "vpayment.status": constant.information().vpayment.STATUS_PAYED_INT
    }, false, null, function() {

    }, 'hresultList');

    com.focusPage('#createVpayment', '#pagenation').click(function() {

        vpayment.modals.vpaymentModal.modal("show");

        var $_modalBody = $('.modal-body');
        var _brand = $_modalBody.find('input[name="brand"]');

        _brand.attr('readonly', "readonly");
        _brand.removeClass('v_required');

        com.focusPage('#type').on('change', function() {

            var way = $_modalBody.find('select[name="type"] option:selected').val();
            var $brand = $_modalBody.find('input[name="brand"]');

            if (way == 0 || way == 1) {
                $brand.attr('readonly', "readonly");
                $brand.val("");
                $brand.removeClass('v_typeahead');
            } else if (way == 2 || way == 3) {
                $brand.removeAttr('readonly');
                $brand.addClass('v_typeahead');
            }

        });
    });

    com.focusPage("#collects").click(function() {

        var $inputs = com.focusPage('input[name="vpids"]:checked', '#resultList');

        vpayment.vpids = [];

        var _mno = "";
        var mnoId = [];
        var mnoIdArr = [];
        var referMoney = 0;
        var flags = [];
        var flag = 0;
        var _paymentType = 0;

        vpayment.vpaymentPostData.paymentInfo = [];

        $.each($inputs, function(i, v) {

            var $input = $(v);

            var row = {
                "vpid": $input.attr('vpid'),
                "mno": $input.attr("mno"),
                "orderId": $input.attr("orderId"),
                "money": $input.attr("money"),
                "status": $input.attr("status"),
            };
            flags.push(row.status);

            if (_paymentType == 0) {
                _paymentType = row.status;
            }

            vpayment.vpaymentPostData.paymentInfo.push(row);

            mnoIdArr.push(row.mno);
            vpayment.vpids.push(row.vpid);

            referMoney += parseFloat(row.money);
        });

        $.each(mnoIdArr, function(i, v) {

            if ($.inArray(v, mnoId) == -1) {
                mnoId.push(v);
            }
        });
        $.each(flags, function(i, v) {

            if (["1"].indexOf(v) != -1) {
                flag = 1;
            }
        });

        if (!$inputs.length) {
            com.showAlert(com.warning, "请选择结算款项");
            return false;
        }
        if (flag == 1) {
            com.showAlert(com.warning, "批量收款不支持已收款");
            return false;
        }
        if (mnoId.length != 1) {
            com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
            return false;
        }

        com.popup4model("#layerAdd", "批量收款", function() {

            com.cleanItems(vpayment.items);

            vpayment.items.couponUl.empty();
            vpayment.items.posDivGroup.empty();
            vpayment.items.bankDivGroup.empty();

            com.cleanTypeahead("couponType");

            com.focusPage('#layerAdd').attr('mno', mnoId[0]);
            com.focusPage("[name=top]").addClass("hide");

            vpayment.mno = mnoId[0];

            com.post(api.payment.queryPaytran, {
                "paytran.pid": mnoId[0],
                "paytran.type": 5
            }, function(res) {

                $.each(res.paytrans, function(i, v) {

                    if (v.status == constant.information().vpayment.STATUS_INIT_INT || v.status == constant.information().vpayment.STATUS_PAYED_INT)
                        addPos(v);
                });
            });

            $("li[class='search-choice']", com.focusPage('#couponType_chosen')).each(function(i, v) {

                var _ = $(v);
                var _couponVal = _.find('input[name="multi_input"]').val();

                if (_couponVal < 0) {
                    com.showAlert(com.warning, "代金券价格填写错误");
                    return false;
                }
            });

            vpayment.items.referMoney.val(referMoney);
        });
    });

    com.focusPage("#bankAdd").click(function() {

        var num = $(this).attr("num");
        var nextNum = parseInt(num) + 1;

        addBankDiv(nextNum);
        $(this).attr("num", nextNum);

        return false;
    });

    com.focusPage("#couponAdd").unbind().click(function() {

        vpayment.items.couponType.addClass("v_typeahead");
        vpayment.items.couponVal.addClass("v_float_3");

        if (com.validate("couponInputs")) {
            return false;
        }

        var $li = $("<li></li>").css({
            "background-color": "#91b8d0",
            "margin-bottom": "5px",
            "margin-right": "5px"
        }).appendTo(com.focusPage("#couponUl"));
        var $span = $("<span></span>").css({
            'color': '#fff'
        }).attr('typeName', com.typeahead("couponType")).attr('money', vpayment.items.couponVal.val()).html(com.typeahead("couponType")).appendTo($li);
        var $spanTwo = $("<span></span>").css({
            'font-size': '16px',
            'color': '#fff',
            'margin': '0 5px'
        }).html(vpayment.items.couponVal.val()).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({
            'color': '#d15b47'
        }).appendTo($li);

        $a.click(function() {

            $li.remove();
        });

        com.cleanTypeahead("couponType");

        vpayment.items.couponVal.val("");
    });

    function saveData() {

        if (com.validate('redact')) {
            return false;
        }

        var brand = vpayment.items.brand.val();

        var options = {
            'vpayment.mno': vpayment.items.mno.val(),
            'vpayment.orderId': vpayment.items.orderId.val(),
            'vpayment.type': vpayment.items.type.val(),
            'vpayment.category': brand.split("-")[1],
            'vpayment.brand': brand.split("-")[0],
            'vpayment.money': vpayment.items.money.val(),
            'vpayment.comment': vpayment.items.comment.val()
        };

        com.post(api.information.createVpayment, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        vpayment.modals.vpaymentModal.modal("hide");
    }

    function collectPayments() {

        vpayment.items.couponType.removeClass("v_typeahead");
        vpayment.items.couponVal.removeClass("v_float_3");

        if (com.validate('layerAdd')) {
            return false;
        }

        var bankAdd = com.focusPage("#bankAdd");

        var _cash = 0;
        var _bank = 0;
        var _bankInfo = "#";
        var vpids = vpayment.vpids;
        var referMoney = parseFloat(vpayment.items.referMoney.val());
        var coupon = 0;
        var couponInfo = "#";

        checkPaymentHideFlag();

        _cash = parseFloat(vpayment.items.cash.val() != "" ? vpayment.items.cash.val() : 0);

        if (com.focusPage('.positem[data-status=0]').length != 0) {
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        var ptids = {};
        var positems = com.focusPage(".positem");

        $.each(positems, function(i, v) {

            var data = $(v).data();

            _bankInfo += data.no + "|" + data.money + "|" + data.createtime + "#";

            _bank = utils.accAdd(parseFloat(data.money), _bank);

            ptids["ptids[" + i + "]"] = data.ptid;
        });

        var bankitems = com.focusPage(".bankitem");

        $.each(bankitems, function(i, v) {

            var index = $(v).data().index;

            var bankName = $("#bankName_" + index).val();
            var bankMoney = $("#bank_" + index).val();
            var bankDate = $("#bankDate_" + index).val();
            var bankTime = $("#bankTime_" + index).val();

            _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

            _bank = utils.accAdd(parseFloat(bankMoney), _bank);
        });

        var bank = _bank;
        var bankInfo = _bankInfo;

        var des = com.focusPage('#collectDes').val();
        com.focusPage("#couponUl li").each(function(i, e) {

            var _ = $(e);
            var item = _.children("span");
            var money = parseFloat(item.attr("money"));
            var typename = item.attr("typename");

            coupon += money;

            couponInfo += typename + "|" + money + "#";
        });

        var realMoney = parseFloat(_cash ? _cash : 0) + parseFloat(bank != "" ? bank : 0) + parseFloat(coupon != "" ? coupon : 0);

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        var option = {
            "vreceipt.cash": _cash,
            "vreceipt.bank": bank,
            "vreceipt.bankInfo": bankInfo,
            "vreceipt.coupon": coupon,
            "vreceipt.couponInfo": couponInfo,
            "vreceipt.comment": des,
        };

        $.extend(option, {}, ptids);

        $.each(vpids, function(i, v) {

            option["vpayments[" + i + "].vpid"] = v;
        });

        com.post(api.information.collectVpayment, option, function() {

            com.closePopup();
            com.showAlert(com.info, "收款成功");
            searcher.doSearch();
            hsearcher.doSearch();
        });
    }
    ;

    function checkPaymentHideFlag() {

        if (vpayment.items.cashDiv.hasClass('hide')) {
            vpayment.items.cash.val("");
        }

        if (vpayment.items.bankDiv.hasClass('hide')) {
            vpayment.items.bankAdd.attr("num", 0);
            vpayment.items.posDivGroup.empty();
            vpayment.items.bankDivGroup.empty();
        }

        if (vpayment.items.couponDiv.hasClass('hide')) {
            vpayment.items.couponUl.empty();
        }
    }

    function baseClick() {

        var $input = com.focusPage('input[type="checkbox"]', '#form');

        $.each($input, function(i, v) {

            var $v = $(v);
            $v.click(function() {

                var id = $v.attr('key') + "Div";

                if ($v.is(':checked')) {
                    $("#" + id).removeClass('hide');
                } else {
                    $("#" + id).addClass('hide');
                }
            });
        });
    }

    baseClick();

    function addBankDiv(index) {

        var d = new Date();
        var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

        var bankDiv = $('<div></div>').addClass('form-group bankitem').attr("data-index", index).attr("id", "bankDiv_" + index).appendTo(com.focusPage("#bankDivGroup"));

        var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
        var bankNameDiv = $('<div></div>').addClass('col-sm-9').appendTo(bankDiv);
        var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_" + index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(vpayment._banks, 'key', 'value').appendTo(bankNameDiv);

        var bankDelBtn = $('<button></button>').addClass('btn btn-minier btn-danger pull-right inline').text("删除").attr("id", "bankDel_" + index).attr("index", index).appendTo(bankNameDiv).click(function() {

            com.focusPage("#bankDiv_" + $(this).attr("index")).remove();
            var bankAdd = com.focusPage("#bankAdd");
            var num = bankAdd.attr("num");
            bankAdd.attr("num", parseInt(num) - 1);
            return false;
        });

        var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankDiv);
        var bankMoneyDiv = $('<div></div>').addClass('col-sm-9').appendTo(bankDiv);
        var bankMoneyInput = $('<input/>').addClass("col-sm-6 v_float_3").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_" + index).appendTo(bankMoneyDiv);

        var posSendBtn = $('<button></button>').addClass('btn btn-minier btn-orange pull-right inline').text("POS推送").attr("id", "posSend_" + index).attr("index", index).appendTo(bankMoneyDiv).click(function() {

            var _index = $(this).attr("index");

            if (com.validate("bankDiv_" + _index))
                return false;

            var options = {
                "paytran.pid": vpayment.mno,
                "paytran.type": 5,
                "paytran.atttype": 0,
                "paytran.no": com.focusPage("#bankName_" + _index).val(),
                "paytran.sn": com.focusPage("#pos_" + _index).val(),
                "paytran.money": com.focusPage("#bank_" + _index).val(),
                "paytran.way": com.focusPage("#posway_" + _index).val()
            };

            com.post(api.payment.addPaytran, options, function(res) {

                addPos(res.paytran);

                $("#bankDiv_" + _index).remove();
                var bankAdd = com.focusPage("#bankAdd");
                var num = bankAdd.attr("num");
                bankAdd.attr("num", parseInt(num) - 1);
            });

            return false;
        });

        var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDiv);
        var bankDateDiv = $('<div></div>').addClass('col-sm-9').appendTo(bankDiv);
        var bankDateInput = $('<input/>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_" + index).attr("data-date-format", "yyyy-mm-dd").val(currentData).appendTo(bankDateDiv);
        com.datetime(bankDateInput);

        var poswayDiv = $('<select></select>').addClass("col-sm-5 pull-right inline").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("id", "posway_" + index).appendTo(bankDateDiv);
        poswayDiv.bindData(vpayment._posway, "key", "value");

        var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankDiv);
        var bankTimeDiv = $('<div></div>').addClass('col-sm-9').appendTo(bankDiv);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput = $('<input>').addClass('col-sm-6 v_required').attr("type", "text").attr("id", "bankTime_" + index).attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(bankTimePicker);
        com.datetime(bankTimeInput, "time");

        var posDiv = $('<select></select>').addClass("col-sm-5 pull-right inline").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("id", "pos_" + index).appendTo(bankTimeDiv);
        posDiv.bindData(vpayment._pos, "key", "value");
    }

    function addPos(v) {

        if (v.status == 2 || v.status == 3)
            return false;

        var posDivGroup = com.focusPage("#posDivGroup");

        var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix positem").attr("id", "pos" + v.ptid).appendTo(posDivGroup);
        var liname = $("<li></li>").append($("<strong></strong>").text("名称:")).append($("<b></b>").addClass("grey").text(v.no)).appendTo(ul);
        var limoney = $("<li></li>").append($("<strong></strong>").text("金额:")).append($("<b></b>").addClass("blue").text(v.money)).appendTo(ul);

        ul.attr({
            "data-ptid": v.ptid,
            "data-type": v.type,
            "data-no": v.no,
            "data-money": v.money,
            "data-createtime": v.createTime,
            "data-status": v.status
        });

        if (v.status == 1) {
            $("<li></li>").append($("<strong></strong>").text("时间:")).append($("<b></b>").addClass("blue").text(v.createTime)).appendTo(ul);
            $("<li></li>").append($("<strong></strong>").text("状态:")).append($("<b></b>").addClass("red").text("已付款")).appendTo(ul);
            return false;
        }

        var btns = $("<li></li>").attr("id", "posbtns" + v.ptid).appendTo(ul);
        var check = $("<button></button>").addClass("btn btn-minier btn-orange pull-right inline").text("验证").attr("id", "poscheck" + v.ptid).appendTo(btns);
        var cancel = $("<button></button>").addClass("btn btn-minier btn-danger pull-right inline hide").text("撤销").attr("id", "poscancel" + v.ptid).appendTo(btns);

        ul.attr({
            "data-ptid": v.ptid,
            "data-type": v.type,
            "data-no": v.no,
            "data-money": v.money,
            "data-createtime": v.createTime,
            "data-status": v.status
        });

        check.click(function() {

            var options =

            com.post(api.payment.checkPaytran, {
                "paytran.ptid": v.ptid
            }, function(res) {

                var paytran = res.paytran;

                var ptid = paytran.ptid;
                var posul = com.focusPage("#pos" + ptid);

                if (paytran.status == 0)
                    return false;

                if (paytran.status != 1) {
                    posul.remove();
                    com.showAlert(com.error, "POS支付失败");
                }

                posul.attr({
                    "data-status": paytran.status,
                    "data-createtime": paytran.createTime
                });

                $("<li></li>").append($("<strong></strong>").text("时间:")).append($("<b></b>").addClass("blue").text(paytran.createTime)).appendTo(posul);
                $("<li></li>").append($("<strong></strong>").text("状态:")).append($("<b></b>").addClass("red").text("已付款")).appendTo(posul);

                com.focusPage("#posbtns" + ptid).remove();
            });

            return false;
        });

        cancel.click(function() {

            com.post(api.payment.cancelPaytran, {
                "paytran.ptid": v.ptid
            }, function(res) {

                com.focusPage("#pos" + res.paytran.ptid).remove();
            });

            return false;
        });

    }

});
