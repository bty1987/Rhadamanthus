$(function () {

    var PaymentScale = {
        saveBtn: null,
        cancelBtn: null,
        items: {},
        list: [],
        psid: null,
        validator: {
            newNum: {
                type: "v_newNum",
                regex: /^[0-9]*[1-9][0-9]*$/,
                errorMsg: "数量输入内容格式错误"
            }
        }
    };
    
    $.extend(com.validator, PaymentScale.validator);
    
    PaymentScale.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    PaymentScale.items.names = com.focusPage("#names");
    PaymentScale.items.comment = com.focusPage("#comment");

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(tableId, v);
                });
            }
        };

        var creatLine = function (tableId, v) {
            var $div = $('<div></div>').appendTo(com.focusPage('#' + tableId));
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($div);
            var $liLine = $('<li></li>').addClass('item-orange clearfix').appendTo($ul);
            var $h3 = $('<h3 ></h3>').addClass('oid').append($('<small style="font-size:22px;"></small>').addClass('blue')).appendTo($liLine);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').css({'margin-top': '10px'}).appendTo($h3);
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').appendTo($ulProperty);
            var $btnshow = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看').appendTo($divBtnWrap);
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success ').html('删除').appendTo($divBtnWrap);
            var propertyArr = [
                ["款项名称:", v.name, "grey"],
                ["说明:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong style="font-size:15px ; padding-bottom: 50px;"  ></strong>').html(value[0]).appendTo($liProperty);
                $('<b style="font-size:15px"></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnshow.click(function () {
                showPaymentScaleitem(v);
            });

            $btnDel.click(function () {
                DelePaymentScale(v.psid);
            });
        };

        return {
            init: function (tableId, listData) {
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var $div = $('<div></div>').attr("id", params.company.cid).appendTo(com.focusPage('#resultList'));
    var $h3 = $('<h3 style="font-size:22px;"></h3>').addClass('blue').html(params.company.name).appendTo($div);
    com.post(api.data.queryPaymentScaleByCid, {"paymentScale.cid": params.company.cid}, function (data) {
        displayFunc.init(params.company.cid, data.paymentScales);
    }, null, false);

    function DelePaymentScale(psid) {
        com.post(api.data.deletePaymentScale, {"paymentScale.psid": psid}, function () {
            com.switchPage(api.index.PaymentScale.url);
        });
    }

    com.focusPage("#addBtn").click(function () {
        com.cleanItems(PaymentScale.items);
        com.focusPage("#paymentScaleModal").modal("show");
    });

    function showPaymentScaleitem(res) {

        var paymentList = com.focusPage("#itemlist");

        paymentList.html("");
        PaymentScale.psid = res.psid;
        com.post(api.data.queryPaymentScaleItemByPsid, {"paymentScaleitem.psid": res.psid}, function (data) {
            $.each(data.paymentScaleItems, function (i, v) {

                var $diva = $('<div></div>').addClass("col-sm-12 ").attr("name", v.psiid).css({
                    "margin-bottom": "8px",
                    "padding": '0px 50px'
                });
                var $div = $('<div></div>').addClass("marginBottom-50px");
                var $namediv = $('<div></div>').css({'float': 'left', 'margin-right': '40px'});
                var $namelabel = $('<label><b>款项名 : </b></label>').appendTo($namediv);
                var $nameSpan = $('<span></span>').text(v.name).appendTo($namelabel);

                var $sacldiv = $('<div></div>').css({'float': 'left', 'margin-right': '40px'}).attr("id", v.psiid);
                var $sacllabel = $('<label><b>款项比例 : </b></label>').appendTo($sacldiv);
                var $saclSpan = $('<span></span>').text(v.scale).appendTo($sacllabel);

                var $sortdiv = $('<div></div>').css({'float': 'left', 'margin-right': '40px'});
                var $sortlabel = $('<label><b>比例顺序 : </b></label>').appendTo($sortdiv);
                var $sortSpan = $('<span></span>').text(v.sort).appendTo($sortlabel);

                var $delete = $("<button>删除</button>").addClass("btn btn-xs btn-danger pull-right").click(function () {
                    com.post(api.data.deletePaymentScaleItem, {"paymentScaleitem.psiid": v.psiid}, function () {
                        $delete.parents('div[name="' + v.psiid + '"]').remove();
                    });
                    return false;
                });

                $diva.append($div).append($namediv).append($sacldiv).append($sortdiv).append($delete).appendTo(paymentList);
            });

            var scalenameDiv = $('<div></div>').addClass("form-group").css({
                "padding-left": "35px",
                "margin-top": "20px"
            }).appendTo(paymentList);

            var vLabelT = $('<label><b>款项名</b></label>').addClass('col-sm-1 control-label no-padding-right').appendTo(scalenameDiv);
            var divinput = $('<div></div>').addClass("col-sm-9").appendTo(scalenameDiv);
            var scaleInput = $('<input/>').addClass("col-sm-5 v_required").attr("type", "text").attr("id", "scalname").appendTo(divinput);

            var scalDiv = $('<div></div>').addClass("form-group").appendTo("#itemlist").css({"padding-left": "35px"});
            var dvT = $('<label><b>比例</b></label>').addClass("col-sm-1 control-label no-padding-right").appendTo(scalDiv);
            var dvinput = $('<div></div>').addClass("col-sm-9").appendTo(scalDiv);
            var scaleinput = $('<input/>').addClass("col-sm-5 v_required v_number").attr("id", "sscal").attr("type", "text").appendTo(dvinput);

            var sortDiv = $('<div></div>').addClass("form-group").appendTo("#itemlist").css({"padding-left": "35px"});
            var sortLabel = $('<label><b>排序</b></label>').addClass("col-sm-1 control-label no-padding-right").appendTo(sortDiv);
            var slDiv = $('<div></div>').addClass("col-sm-9").appendTo(sortDiv);
            var slInput = $('<input/>').addClass("col-sm-5 v_required v_newNum").attr("id", "sort").attr("maxlength", "2").attr("type", "text").appendTo(slDiv);

        });
        com.focusPage("#itemModal").modal("show");
    }

    com.focusPage("#savePaymenScaleBtn").on("click", function () {

        if (!com.validate("form3")) {
            com.post(api.data.addPaymentScaleItem, {
                "paymentScaleitem.name": com.focusPage("#scalname").val(),
                "paymentScaleitem.psid": PaymentScale.psid,
                "paymentScaleitem.scale": com.focusPage("#sscal").val(),
                "paymentScaleitem.sort": com.focusPage("#sort").val()
            }, function () {
                com.focusPage("#itemModal").modal("hide");
            });
        }
    });

    function saveData() {
        if (!com.validate("form1")) {
            com.post(api.data.addPaymentScale, {
                "paymentScale.cid": params.company.cid,
                "paymentScale.name": PaymentScale.items.names.val(),
                "paymentScale.comment": PaymentScale.items.comment.val()
            }, function () {
                com.switchPage(api.index.PaymentScale.url);
            });
            com.focusPage("#paymentScaleModal").modal("hide");
        }
    }

});
