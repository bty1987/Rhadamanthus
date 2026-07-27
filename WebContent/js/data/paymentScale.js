$(function() {

    var paymentScale = {

        btns: {
            addBtn: com.focusPage("#addBtn"),
            saveBtn: com.focusPage("#savePaymenScaleBtn")
        },
        modals: {
            itemModal: com.focusPage("#itemModal"),
            paymentScaleModal: com.focusPage("#paymentScaleModal")
        },
        items: {
            names: com.focusPage("#names"),
            typeness: com.focusPage("#typeness"),
            dbid: com.focusPage("#dbid"),
            atttype: com.focusPage("#atttype"),
            comment: com.focusPage("#comment")
        },
        scaleItems: {
            paymentType: com.focusPage("#paymentType"),
            scale: com.focusPage("#scale"),
            sort: com.focusPage("#sort")
        },
        saveBtn: null,
        cancelBtn: null,
        list: [],
        psid: null,
        validator: {
            newNum: {
                type: "v_newNum",
                regex: /^[0-9]*[1-9][0-9]*$/,
                errorMsg: "数量输入内容格式错误"
            }
        },
        atttype_decoration: [],
        typeness: constant.decoration().decoration.typeness.keys,
        busitypes: [],
        atttypes: []
    };

    $.extend(com.validator, paymentScale.validator);

    paymentScale.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    paymentScale.items.names = com.focusPage("#names");
    paymentScale.items.comment = com.focusPage("#comment");

    $.each(constant.data().paymentType.atttype.datas, function(i, v) {

        var type = v.key.split('-')[0];
        var atttype = v.key.split('-')[1];

        if (type == "1") {
            paymentScale.atttype_decoration.push({"key": atttype, "value": v.value});
            paymentScale.atttypes[atttype] = v.value;
        }
    });

    com.post(api.data.queryDecorationBusitype, {}, function(res){
        var decorationBusitypes = [{key: -1, value: '通用'}];

        $.each(res.decorationBusitypes, function(intex, value) {
            if (value.status == constant.data().decorationBusitype.STATUS_ACTIVATE) {
                decorationBusitypes.push({"key": value.dbid, "value": value.name});
                paymentScale.busitypes[value.dbid] = value.name;
            }
        });

        paymentScale.items.dbid.bindData(decorationBusitypes, "key", "value");
    });

    paymentScale.items.typeness.bindData([{key: -1, value: '通用'}].concat(constant.decoration().decoration.typeness.datas), "key", "value");

    paymentScale.items.atttype.bindData(paymentScale.atttype_decoration, "key", "value");

    paymentScale.modals.itemModal.on('hide.bs.modal', function(e) {

        com.closeTip();
        com.clearValidator();
        com.cleanItems(paymentScale.scaleItems);
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(tableId, v);
                });
            }
        };

        var creatLine = function(tableId, v) {

            var $div = $('<div></div>').appendTo(com.focusPage('#' + tableId));
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($div);
            var $liLine = $('<li></li>').addClass('item-orange clearfix').appendTo($ul);
            var $h3 = $('<h3 ></h3>').addClass('oid').append($('<small style="font-size:22px;"></small>').addClass('blue')).appendTo($liLine);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').css({
                'margin-top': '10px'
            }).appendTo($h3);
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').appendTo($ulProperty);
            var $btnshow = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看').appendTo($divBtnWrap);
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success ').html('删除');
            var $btnStatus = $('<div></div>').addClass('pull-right').appendTo($divBtnWrap);
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type": "checkbox"});
            var $span = $('<span></span>').addClass('lbl status-lbl');
            var propertyArr = [
                ["款项名称:", v.name, "grey"],
                ["类型:", com.checkNull(paymentScale.typeness[v.typeness], "暂无"), "red"],
                ["业务类型:", com.checkNull(paymentScale.busitypes[v.dbid], "暂无"), "red"],
                ["属性类型:", com.checkNull(paymentScale.atttypes[v.atttype], "暂无"), "red"],
                ["说明:", v.comment, "grey"],
                ["状态:", constant.data().common.status.keys[v.status], 'red']
            ];

            $btnStatus.append($statusSwitch).append($span);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong style="font-size:15px ; padding-bottom: 50px;"  ></strong>').html(value[0]).appendTo($liProperty);
                $('<b style="font-size:15px"></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnshow.click(function() {
                
                queryPaymentType(v);

                showPaymentScaleItem(v);
            });

            $btnDel.click(function() {

                deletePaymentScale(v.psid);
            });

            v.status == constant.data().common.STATUS_ENABLE_INT && $statusSwitch.prop("checked", true);

            $statusSwitch.prop("checked", v.status == constant.data().common.STATUS_ENABLE_INT ? true : false).switchBtn("status-lbl").on("click", function() {

                updateStatus(v.psid, $statusSwitch.prop("checked") ? 0 : 1);
            });

        };

        return {
            init: function(tableId, listData) {

                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    reloadPaymentScale();

    function reloadPaymentScale() {

        var resultList = com.focusPage('#resultList').html("");

        var $h3 = $('<h3 style="font-size:22px;"></h3>').addClass('blue').html(params.company.name).appendTo(resultList);

        com.post(api.data.queryPaymentScale, {
            "paymentScale.cid": params.company.cid
        }, function(data) {

            displayFunc.init('resultList', data.paymentScales);
        });
    }

    function deletePaymentScale(psid) {

        com.post(api.data.deletePaymentScale, {
            "paymentScale.psid": psid
        }, function() {

            reloadPaymentScale();
        });
    }

    // 启用禁用功能
    function updateStatus(psid, status) {

        com.post(api.data.updatePaymentScaleForStatus, {
            "paymentScale.psid": psid,
            "paymentScale.status": status
        }, function() {

            reloadPaymentScale();
        });
    }

    paymentScale.btns.addBtn.click(function() {

        com.cleanItems(paymentScale.items);
        paymentScale.modals.paymentScaleModal.modal("show");
    });

    function showPaymentScaleItem(res) {

        var paymentList = com.focusPage("#itemlist");

        paymentList.html("");
        paymentScale.psid = res.psid;

        com.post(api.data.queryPaymentScaleItemByPsid, {
            "paymentScaleItem.psid": res.psid
        }, function(data) {

            $.each(data.paymentScaleItems, function(i, v) {

                var $diva = $('<div></div>').addClass("col-sm-12").attr("name", v.psiid).css({
                    "margin-bottom": "8px",
                    "padding": '0px 50px'
                });
                var $div = $('<div></div>').addClass("marginBottom-50px");
                var $namediv = $('<div></div>').css({
                    'float': 'left',
                    'margin-right': '40px'
                });
                var $namelabel = $('<label><b>款项名 : </b></label>').appendTo($namediv);
                var $nameSpan = $('<span></span>').text(v.name).appendTo($namelabel);

                var $sacldiv = $('<div></div>').css({
                    'float': 'left',
                    'margin-right': '40px'
                }).attr("id", v.psiid);
                var $sacllabel = $('<label><b>款项比例 : </b></label>').appendTo($sacldiv);
                var $saclSpan = $('<span></span>').text(v.scale).appendTo($sacllabel);

                var $sortdiv = $('<div></div>').css({
                    'float': 'left',
                    'margin-right': '40px'
                });
                var $sortlabel = $('<label><b>比例顺序 : </b></label>').appendTo($sortdiv);
                var $sortSpan = $('<span></span>').text(v.sort).appendTo($sortlabel);

                var $delete = $("<button>删除</button>").addClass("btn btn-xs btn-danger pull-right").click(function() {

                    com.post(api.data.deletePaymentScaleItem, {
                        "paymentScaleItem.psiid": v.psiid
                    }, function() {

                        $delete.parents('div[name="' + v.psiid + '"]').remove();
                    });
                    return false;
                });

                $diva.append($div).append($namediv).append($sacldiv).append($sortdiv).append($delete).appendTo(paymentList);
            });
        });

        paymentScale.modals.itemModal.modal("show");
    }

    paymentScale.btns.saveBtn.on("click", function() {

        if (com.validate("itemModal"))
            return false;

        var options = {
            "paymentScaleItem.ptid": paymentScale.scaleItems.paymentType.val(),
            "paymentScaleItem.psid": paymentScale.psid,
            "paymentScaleItem.scale": paymentScale.scaleItems.scale.val(),
            "paymentScaleItem.sort": paymentScale.scaleItems.sort.val()
        };

        com.post(api.data.addPaymentScaleItem, options, function() {

            reloadPaymentScale();
            paymentScale.modals.itemModal.modal("hide");
        });
    });

    function saveData() {

        if (com.validate("form1"))
            return false;

        var options = {
            "paymentScale.cid": params.company.cid,
            "paymentScale.name": paymentScale.items.names.val(),
            "paymentScale.typeness": paymentScale.items.typeness.val(),
            "paymentScale.dbid": paymentScale.items.dbid.val(),
            "paymentScale.atttype": paymentScale.items.atttype.val(),
            "paymentScale.comment": paymentScale.items.comment.val()
        };

        com.post(api.data.addPaymentScale, options, function() {

            reloadPaymentScale();
            paymentScale.modals.paymentScaleModal.modal("hide");
        });
    }

    function queryPaymentType(v) {

        var options = {
            "paymentType.type": 1,
            "paymentType.paytype": 0,
            "paymentType.bustype": 0,
            "paymentType.atttype": v.atttype
        };
        
        com.post(api.data.queryPaymentType, options, function(res) {

            paymentScale.scaleItems.paymentType.bindData(res.paymentTypes, "ptid", "name");
        })
    }

});
