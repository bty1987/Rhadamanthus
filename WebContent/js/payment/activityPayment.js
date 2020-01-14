jQuery(function ($) {

    var activityPayment = {
        activityPaymentPostData: {},

        saveBtn: com.focusPage("#saveBtn"),
        collectPaymentBtn: com.focusPage("#collectPaymentBtn"),

        modals: {
            activityPaymentModal: com.focusPage("#activityPaymentModal"),
            layerAddActivity: com.focusPage("#layerAddActivity")
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
            activityCouponType: com.focusPage("#activityCouponType"),
            couponVal: com.focusPage('#couponVal'),

            activityposDivGroup: com.focusPage("#activityposDivGroup"),
            activitybankDivGroup: com.focusPage('#activitybankDivGroup'),
            couponUl: com.focusPage('#couponUl'),

            cashDiv: com.focusPage('#cashDiv'),
            bankDiv: com.focusPage('#bankDiv'),
            couponDiv: com.focusPage('#couponDiv')
        },
        
        mno: null,
        pointofsalesType: 5,
        
        type: {},

        _posway: [],
        _banks: [],
        bankInfo: {},
        bankUtil: [],
        posValues: {},

        apids: [],
        couponInfo: "#",
        activityCouponType: [],
        htmlName: "activity"
    };

    activityPayment.saveBtn.bindClick(saveData);
    activityPayment.collectPaymentBtn.bindClick(collectPayments);

    //隐藏触发
    activityPayment.modals.activityPaymentModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanTypeahead("brand");
        com.cleanItems(activityPayment.items);
    });

    activityPayment.modals.layerAddActivity.on('hide.bs.modal', function () {
        activityPayment.apids = [];
        com.clearValidator();
        com.cleanItems(activityPayment.items);
        activityPayment.items.couponUl.empty();

        activityPayment.items.activityposDivGroup.empty();
        activityPayment.items.activitybankDivGroup.empty();
        com.cleanTypeahead("activityCouponType");
    });

    com.initTypeahead('brand', api.data.queryBrandByPinyin, "pinyinName", {}, "autoFillKeyValue", "value", "value" ,null);
    com.selectTypeahead("activityCouponType", activityPayment.activityCouponType, 'key', 'value' ,null);

    com.focusPage("#layerAddActivity :checkbox").on("change", function(){
        $(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
        if($(this).prop("checked") && this.id == "bankCheckbox"){
            com.focusPage("#activitybankDivGroup").html("");
            paymentUtils.addBankPosUtil("#activitybankDivGroup", activityPayment.bankUtil, activityPayment);
        }
    });

    com.post(api.common.queryReceiptType, {}, function(res){
        $.each(res.receiptTypes, function(i, v){
            if(v.type == 2){
                if(v.status == 1){
                    activityPayment._banks.push(v);
                    activityPayment.posValues[v.no] = v;
                    activityPayment.bankUtil.push({"key": v.no, "value": v.name});
                }
                activityPayment.bankInfo[v.no] = v.name;
            }
        });
    }, null, false);
    
    com.post(api.ds.payment, {}, function (res) {

        activityPayment.items.type.bindData(res.activityPayment, "key", "value", false);
        com.focusPage("#cashInfo").bindData(res.ways, "key", "value", false);

        activityPayment.type = res.activityPayment.split("key", "value");

        activityPayment.posway = res.posway.split("key", "value");

        $.each(res.posway, function (i, v) {
            activityPayment._posway.push(v);
        });

        $.each(res.activityCouponType, function(i,v) {
            activityPayment.activityCouponType.push(v);
        });

    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCol = $('<a></a>').addClass('btn btn-minier btn-primary').html('收款');

            var propertyArr = [
                ["会员号:", v.mno, "grey"],
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "blue"],
                ["类型:", activityPayment.type[v.type], "grey"],
                ["品牌:", v.brand == null || v.brand == "" ? "---" : v.brand, "grey"],
                ["应收金额:", v.money, "blue"],
                ["状态:", v.status == 1 ? "已付款" : "未付款", "red"],
                ["备注:", v.comment, "grey"]
            ];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "apids",
                "class": "",
                "apid": v.apid,
                "mno": v.mno,
                "orderId": v.orderId,
                "money": v.money,
                "status": v.status
            }).addClass('ace ace-checkbox-2');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(activityPayment.type[v.type]);

            _label.append($input).append(_span).appendTo($label);

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

                $label.appendTo($h3);
            });

            $divBtnWrap.append($btnCol).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnCol.click(function () {
                activityPayment.items.referMoney.val(v.money);
                activityPayment.apids.push(v.apid);
                activityPayment.mno = v.mno;

                com.post(api.payment.queryPointofsalesByPid, {"pointofsales.pid": v.mno, "pointofsales.type": 5}, function(res){
                    $.each(res.pointofsaleses, function(i, v){
                        if(v.status == 0 || v.status == 1) paymentUtils.addPos(v, activityPayment.htmlName);
                    });
                });

                activityPayment.modals.layerAddActivity.modal("show");
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(["ap_mno", "ap_brand", "ap_createrName"], "condList", api.payment.pageActivityPayment, function (data) {
        displayFunc.init('resultList', data);

    }, "pagenation", "activityPaymentPostData", {"activityPayment.status": 0}, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'createActivityPayment').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $batch = $('<a></a>').addClass('btn btn-minier pull-left btn-info').attr('id', 'collects').css("margin", "0px 3px");
        var $batchi = $('<i></i>').addClass('icon-money bigger-110').appendTo($batch);
        var $batchspan = $('<span></span>').text('批量收款').appendTo($batch);

        return [$batch, $adda];
    }, 'resultList');

    var hdisplayFunc = (function () {

        var hrenderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = hcreatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var hcreatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-pink').html('打印');

            var propertyArr = [
                ["会员号:", v.mno, "grey"],
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "blue"],
                ["收款人:", v.collecter.currentName, "grey"],
                ["收款时间:", v.collectTime, "blue"],
                ["类型:", activityPayment.type[v.type], "grey"],
                ["品牌:", v.brand == null || v.brand == "" ? "---" : v.brand, "grey"],
                ["应收金额:", v.money, "blue"],
                ["状态:", v.status == 1 ? "已付款" : "未付款", "red"],
                ["备注:", v.comment, "grey"]
            ];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(activityPayment.type[v.type]);

            _label.append(_span).appendTo($label);

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

                $label.appendTo($h3);

            });

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnPrint.click(function () {
                params.activityPayment = v;
                com.popup("专用收款收据__会员编号:" + v.mno, api.index.activityPaymentReceiptIndex.url, function () {
                    parent.layer.getFrameIndex(window.name);
                }, null, true);

            });

            var styleArr = [];

            v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
            v.bank != null && v.bank != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, activityPayment.bankInfo), "blue"]) : true;
            v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;

            $.each(styleArr, function (index, value) {
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
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                hrenderList(tableId, listData);
            },
            drawLine: function (v) {
                return hcreatLine(v);
            }
        };
    })();

    var hsearcher = new Searcher();

    hsearcher.init(["ap_mno", "ap_brand", "ap_createrName"], "hcondList", api.payment.pageActivityPayment, function (data) {
        hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "hactivityPaymentPostData", {"activityPayment.status": 1}, false, null, function () {}, 'hresultList');

    com.focusPage('#createActivityPayment', '#pagenation').click(function () {
        activityPayment.modals.activityPaymentModal.modal("show");
    });

    com.focusPage('#type').on('change', function () {
        var way = com.focusPage("#type").val();

        if (way == 0 || way == 1) {
            com.focusPage("#brand").attr('readonly', "readonly");
            com.updateTypeahead("brand", "", "");
            com.focusPage("#brand").removeClass('v_typeahead');
        } else if (way == 2 || way == 3) {
            com.focusPage("#brand").removeAttr('readonly');
            com.focusPage("#brand").addClass('v_typeahead');
        }
    });

    //批量收款
    com.focusPage("#collects").click(function() {

        var $inputs = com.focusPage('input[name="apids"]:checked', '#resultList');

        activityPayment.apids = [];

        var _mno = "";
        var mnoId = [];
        var mnoIdArr = [];
        var referMoney = 0;
        var flags = [];
        var flag = 0;
        var _paymentType = 0;

        activityPayment.activityPaymentPostData.paymentInfo = [];

        $.each($inputs, function (i, v) {
            var $input = $(v);

            var row = {
                "apid": $input.attr('apid'),
                "mno": $input.attr("mno"),
                "orderId": $input.attr("orderId"),
                "money": $input.attr("money"),
                "status": $input.attr("status")
            };
            flags.push(row.status);

            if (_paymentType == 0) {
                _paymentType = row.status;
            }

            activityPayment.activityPaymentPostData.paymentInfo.push(row);

            mnoIdArr.push(row.mno);
            activityPayment.apids.push(row.apid);

            referMoney += parseFloat(row.money);
        });

        $.each(mnoIdArr, function (i, v) {
            if ($.inArray(v, mnoId) == -1) {
                mnoId.push(v);
            }
        });
        $.each(flags, function (i, v) {
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

        activityPayment.items.referMoney.val(referMoney);
        com.focusPage('#layerAddActivity').attr('mno', mnoId[0]);
        activityPayment.mno = mnoId[0];

        com.post(api.payment.queryPointofsalesByPid, {"pointofsales.pid": mnoId[0], "pointofsales.type": 5}, function(res){
            $.each(res.pointofsaleses, function(i, v){
                if(v.status == 0 || v.status == 1) paymentUtils.addPos(v, activityPayment.htmlName);
            });
        });

        activityPayment.modals.layerAddActivity.modal("show");
    });

    com.focusPage("#couponAdd").unbind().click(function(){
        
        activityPayment.items.activityCouponType.addClass("v_typeahead");
        activityPayment.items.couponVal.addClass("v_float_3");
        
        if(com.validate("couponInputs")){
            return false;
        }

        var $li = $("<li></li>").css({"background-color":"#91b8d0", "margin-bottom":"5px", "margin-right":"5px"}).appendTo(com.focusPage("#couponUl"));
        var $span = $("<span></span>").css({'color':'#fff'}).attr('typeName', com.typeahead("activityCouponType")).attr('money', activityPayment.items.couponVal.val()).html(com.typeahead("activityCouponType")).appendTo($li);
        var $spanTwo = $("<span></span>").css({'font-size':'16px', 'color':'#fff', 'margin':'0 5px'}).html(activityPayment.items.couponVal.val()).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({'color':'#d15b47'}).appendTo($li);

        $a.click(function () {
            $li.remove();
        });

        com.cleanTypeahead("activityCouponType");
        
        activityPayment.items.couponVal.val("");
    });

    function saveData() {
        
        if (com.validate('redact')) {
            return false;
        }

        var options = {
            'activityPayment.mno': activityPayment.items.mno.val(),
            'activityPayment.orderId': activityPayment.items.orderId.val(),
            'activityPayment.type': activityPayment.items.type.val(),
            'activityPayment.brand': activityPayment.items.brand.val(),
            'activityPayment.money': activityPayment.items.money.val(),
            'activityPayment.comment': activityPayment.items.comment.val()
        };
        com.post(api.payment.createActivityPayment, options, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        activityPayment.modals.activityPaymentModal.modal("hide");
    }

    function collectPayments() {
        paymentUtils.bankIsChecked(activityPayment.htmlName, false);
        activityPayment.items.activityCouponType.removeClass("v_typeahead");
        activityPayment.items.couponVal.removeClass("v_float_3");

        if(com.validate('layerAddActivity')) {
            return false;
        }

        var _cash = 0;
        var _bank = 0;
        var _bankInfo = "#";
        var apids = activityPayment.apids;
        var referMoney = parseFloat(activityPayment.items.referMoney.val());
        var coupon = 0;
        var couponInfo = "#";

        if(com.focusPage("#cashCheckbox").prop("checked")){
            _cash = parseFloat(activityPayment.items.cash.val() != "" ? activityPayment.items.cash.val() : 0);
        }

        if(com.focusPage('.positem[data-status=0]').length != 0){
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }
        
        if(com.focusPage("#bankCheckbox").prop("checked")){
            var posids = {};
            var positems = com.focusPage(".positem");

            $.each(positems, function(i, v){
                var data = $(v).data();

                _bankInfo += data.no + "|" + data.money + "|" + data.createtime + "#";

                _bank = utils.accAdd(parseFloat(data.money), _bank);

                posids["posids[" + i + "]"] = data.posid;
            });

            var bankitems = com.focusPage(".bankitem");

            $.each(bankitems, function(i, v){

                var index = $(v).data().index;

                var bankName = $("#bankName_" + index).val();
                var bankMoney = $("#bank_" + index).val();
                var bankDate = $("#bankDate_" + index).val();
                var bankTime = $("#bankTime_" + index).val();

                _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

                _bank = utils.accAdd(parseFloat(bankMoney), _bank);
            });
        }
        
        var bank = _bank;
        var bankInfo = _bankInfo;

        if(com.focusPage("#couponCheckbox").prop("checked")){
            com.focusPage("#couponUl li").each(function (i, e) {
                var _ = $(e);
                var item = _.children("span");
                var money = parseFloat(item.attr("money"));
                var typename = item.attr("typename");

                coupon += money;

                couponInfo += typename + "|" + money + "#";
            });
        }

        var realMoney = parseFloat(_cash ? _cash : 0) + parseFloat(bank != "" ? bank : 0) + parseFloat(coupon != "" ? coupon : 0);

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        var option = {
            "activityReceipt.cash": _cash,
            "activityReceipt.bank": bank,
            "activityReceipt.bankInfo": bankInfo,
            "activityReceipt.coupon": coupon,
            "activityReceipt.couponInfo": couponInfo,
            "activityReceipt.comment": com.focusPage('#collectDes').val()
        };
        
        $.extend(option, {}, posids);
        
        $.each(apids, function (i, v) {
            option["activityPayments[" + i + "].apid"] = v;
        });
        
        com.post(api.payment.collectActivityPayment, option, function () {
            com.closePopup();
            com.showAlert(com.info,"收款成功");
            activityPayment.modals.layerAddActivity.modal("hide");
            searcher.doSearch();
            hsearcher.doSearch();
        });
    }

});
