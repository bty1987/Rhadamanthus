$(function () {
    var decorationQuotation = {
        decorationOrderId: null,
        initQuotationList: initQuotationList,
        canChangeStatus: 0,
        quotationItems: {},
        editFlg: 0,
        defaultsQid: null,
        leftflg: false,
        rightflg: false,
        compareType: [
            {"key": "0", "value": "唯一编号"},
            {"key": "1", "value": "订单号"},
        ]
    };

    com.focusPage('#fl-statement').statement("装修订单报价", "报价信息列表");

    decorationQuotation.decorationOrderId = params.decorationOrderId;
    decorationQuotation.type = params.orderType;

    decorationQuotation.quotationItems.replicaType = com.focusPage("#replicaType"); //拷贝类型
    decorationQuotation.quotationItems.replicaType.bindData(decorationQuotation.compareType, 'key', 'value');

    decorationQuotation.quotationItems.replicaType.on("change", function (e) {
        $this = $(this);
        if ($this.val() == 0) {
            com.focusPage("#Bquoteno").removeClass("hide");
            com.focusPage("#bOrderId").addClass("hide");
        } else {
            com.focusPage("#Bquoteno").addClass("hide");
            com.focusPage("#bOrderId").removeClass("hide");
        }
    }).trigger("change");

    decorationQuotation.quotationItems.qid = com.focusPage("#qid");
    decorationQuotation.quotationItems.quotationName = com.focusPage("#quotationName");
    decorationQuotation.quotationItems.decorationStyle = com.focusPage("#decorationStyle");
    decorationQuotation.quotationItems.content = com.focusPage("#content");
    decorationQuotation.quotationItems.quotationNames = com.focusPage('#quotationNames');
    decorationQuotation.quotationItems.quotetionNo = com.focusPage("#quotetionNo"); //要拷贝报价编号

    //拷贝报价
    decorationQuotation.quotationItems.replicaOrderId = com.focusPage('#replicaOrderId').on("blur", function () {
        var options = {
            "quotation.orderId": $(this).val(),
        };
        com.post(api.quotation.queryQuotationByOrderId, options, function (res) {
            decorationQuotation.quotationItems.quotationNames.bindData(res.quotations, 'qid', 'quotationName');
        });
    });

    decorationQuotation.quotationModal = com.focusPage('#quotationModal');
    decorationQuotation.replicaQuotationModal = com.focusPage('#replicaQuotationModal');

    com.focusPage('#saveBtn').click(function () {
        if (com.validate()) {
            return;
        }
        decorationQuotation.quotationModal.modal("hide");
        var btn = $(this).button('loading');
        if (decorationQuotation.editFlg == 0) {
            var options = {
                "quotation.orderId": decorationQuotation.decorationOrderId,
                "quotation.quotationName": com.focusPage("#quotationName").val(),
                "quotation.decorationStyle": com.focusPage("#decorationStyle").val(),
                "quotation.content": com.focusPage("#content").val(),
                "quotation.type": com.focusPage('#quotationType').val(),
                "quotation.setpackage": com.focusPage('#setpackage').val() ? com.focusPage('#setpackage').val() : 0
            };

            com.post(api.quotation.addQuotation, options, function (res) {
                com.showAlert(com.info, "操作成功");
                drawquotation(res.quotation);
            }, null, false);
            btn.button("reset");

        }
        else if (decorationQuotation.editFlg == 1) {
            var options = {
                "quotation.orderId": decorationQuotation.decorationOrderId,
                "quotation.qid": com.focusPage("#qid").val(),
                "quotation.quotationName": com.focusPage("#quotationName").val(),
                "quotation.decorationStyle": com.focusPage("#decorationStyle").val(),
                "quotation.content": com.focusPage("#content").val(),
                "quotation.type": com.focusPage('#quotationType').val(),
                "quotation.setpackage": com.focusPage('#setpackage').val() ? com.focusPage('#setpackage').val() : 0
            };

            com.post(api.quotation.updateQuotation, options, function (res) {
                com.showAlert(com.info, "操作成功");
                com.focusPage("#h4name_" + com.focusPage("#qid").val()).text(com.focusPage("#quotationName").val());
                com.focusPage("#name_" + com.focusPage("#qid").val()).text('名称:' + com.focusPage("#quotationName").val());
                com.focusPage("#style_" + com.focusPage("#qid").val()).text('风格:' + com.focusPage("#decorationStyle").val());
                com.focusPage("#content_" + com.focusPage("#qid").val()).text('备注:' + com.focusPage("#content").val());
            }, null, false);

            btn.button("reset");
        }
        else {
            var options = {
                "quotation.qid": com.focusPage("#qid").val(),
                "quotation.orderId": decorationQuotation.decorationOrderId,
                "quotation.quotationName": com.focusPage("#quotationName").val(),
                "quotation.decorationStyle": com.focusPage("#decorationStyle").val(),
                "quotation.content": com.focusPage("#content").val(),
            };
            com.post(api.quotation.copyQuotation, options, function (res) {
                com.showAlert(com.info, "操作成功");
                drawquotation(res.quotation);
            }, null, false);
            btn.button("reset");
        }
    });

    com.focusPage("#replicaBtn").bindClick(function () {
        if (com.validate()) {
            return;
        }
        var options;
        if(decorationQuotation.quotationItems.replicaType.val() == 0){
            options = {
                "no": decorationQuotation.quotationItems.quotetionNo.val(),
                "quotation.orderId": decorationQuotation.decorationOrderId,
            };
            com.post(api.quotation.cloneQuotation, options, function (res) {
                com.showAlert(com.info, "操作成功");
                com.focusPage("#quotationDiv_" + decorationQuotation.defaultsQid).remove();
                decorationQuotation.replicaQuotationModal.modal("hide");
                drawquotation(res.quotation);
            }, null, false);
        }else{
            options = {
                "quotation.qid": decorationQuotation.quotationItems.quotationNames.val(),
                "quotation.orderId": decorationQuotation.decorationOrderId,
            };
            com.post(api.quotation.replicaQuotation, options, function (res) {
                com.showAlert(com.info, "操作成功");
                com.focusPage("#quotationDiv_" + decorationQuotation.defaultsQid).remove();
                decorationQuotation.defaultsQid = res.quotation.qid;
                drawquotation(res.quotation);

            }, null, false);
        }

        decorationQuotation.replicaQuotationModal.modal("hide");
    }, 5000);
//新增对比
    //报价对比

    decorationQuotation.compareQuotationModal = com.focusPage('#compareQuotationModal ');
    decorationQuotation.quotationItems.leftQuotationNo = com.focusPage("#leftQuotationNo");
    decorationQuotation.quotationItems.leftType = com.focusPage("#leftType");
    decorationQuotation.quotationItems.leftType.bindData(decorationQuotation.compareType, 'key', 'value');
    decorationQuotation.quotationItems.leftType.on("change", function (e) {
        $this = $(this);
        if ($this.val() == 0) {
            com.focusPage("#leftquono").removeClass("hide");
            com.focusPage("#leftOrd").addClass("hide");
            decorationQuotation.quotationItems.leftQuotationNo.val("");
            com.focusPage("#leftQuotationNo").css("border", "1px solid #d5d5d5").popover("destroy");
        } else {
            com.focusPage("#leftquono").addClass("hide");
            com.focusPage("#leftOrd").removeClass("hide");
            decorationQuotation.quotationItems.leftOrderId.val("");
        }
    }).trigger("change");

    decorationQuotation.quotationItems.leftQuotationNo.on("change", function (e) {
        com.post(api.quotation.queryQuotetionByNo, {"quotetion.no": $(this).val()}, function (res) {

            if (res.quotetion.qid == null) {
                decorationQuotation.leftflg = false;
                com.showPopover(com.focusPage("#leftQuotationNo"), {errorMsg: "编号不合法"}, "right");
            }
            else {
                decorationQuotation.leftflg = true;
                com.focusPage("#leftQuotationNo").css("border", "1px solid #d5d5d5").popover("destroy");
            }
        }, null, false);
    }).trigger("change");

    decorationQuotation.quotationItems.leftQuotationNames = com.focusPage("#leftQuotationNames");
    decorationQuotation.quotationItems.leftOrderId = com.focusPage('#leftOrderId').on("blur", function () {
        var options = {
            "quotation.orderId": $(this).val()
        };
        com.post(api.quotation.queryQuotationByOrderId, options, function (res) {
            decorationQuotation.quotationItems.leftQuotationNames.bindData(res.quotations, 'qid', 'quotationName');
        });
    });

    decorationQuotation.quotationItems.rightQuotationNo = com.focusPage("#rightQuotationNo");
    decorationQuotation.quotationItems.rightType = com.focusPage("#rightType");
    decorationQuotation.quotationItems.rightType.bindData(decorationQuotation.compareType, 'key', 'value');
    decorationQuotation.quotationItems.rightType.on("change", function (e) {
        $this = $(this);
        if ($this.val() == 0) {
            com.focusPage("#rightquono").removeClass("hide");
            com.focusPage("#rightOrd").addClass("hide");
            decorationQuotation.quotationItems.rightQuotationNo.val("");
            com.focusPage("#rightQuotationNo").css("border", "1px solid #d5d5d5").popover("destroy");
        } else {
            com.focusPage("#rightquono").addClass("hide");
            com.focusPage("#rightOrd").removeClass("hide");
            decorationQuotation.quotationItems.rightOrderId.val("");
        }
    }).trigger("change");

    decorationQuotation.quotationItems.rightQuotationNo.on("change", function (e) {
        com.post(api.quotation.queryQuotetionByNo, {"quotetion.no": $(this).val()}, function (res) {

            if (res.quotetion.qid == null) {
                decorationQuotation.rightflg = false;
                com.showPopover(com.focusPage("#rightQuotationNo"), {errorMsg: "编号不合法"}, "right");
            }
            else {
                decorationQuotation.rightflg = true;
                com.focusPage("#rightQuotationNo").css("border", "1px solid #d5d5d5").popover("destroy");
            }
        }, null, false);
    }).trigger("change");

    decorationQuotation.quotationItems.rightQuotationNames = com.focusPage("#rightQuotationNames");
    decorationQuotation.quotationItems.rightOrderId = com.focusPage('#rightOrderId').on("blur", function () {
        var options = {
            "quotation.orderId": $(this).val()
        };
        com.post(api.quotation.queryQuotationByOrderId, options, function (res) {
            decorationQuotation.quotationItems.rightQuotationNames.bindData(res.quotations, 'qid', 'quotationName');
        });
    });

    com.focusPage('#compareQuotation').on(ace.click_event, function () {
        com.clearValidator();
        com.cleanItems(decorationQuotation.quotationItems);
        decorationQuotation.quotationItems.leftType.on("change", function (e) {
            $this = $(this);
            if ($this.val() == 0) {
                com.focusPage("#leftquono").removeClass("hide");
                com.focusPage("#leftOrd").addClass("hide");
            } else {
                com.focusPage("#leftquono").addClass("hide");
                com.focusPage("#leftOrd").removeClass("hide");
            }
        }).trigger("change");
        decorationQuotation.quotationItems.rightType.on("change", function (e) {
            $this = $(this);
            if ($this.val() == 0) {
                com.focusPage("#rightquono").removeClass("hide");
                com.focusPage("#rightOrd").addClass("hide");
            } else {
                com.focusPage("#rightquono").addClass("hide");
                com.focusPage("#rightOrd").removeClass("hide");
            }
        }).trigger("change");

        decorationQuotation.quotationItems.leftQuotationNames.bindData([], 'qid', 'quotationName');
        decorationQuotation.quotationItems.rightQuotationNames.bindData([], 'qid', 'quotationName');
        decorationQuotation.compareQuotationModal.modal("show");
    });

    com.focusPage("#compareQuotationBtn").on(ace.click_event, function () {
        if (decorationQuotation.quotationItems.leftType.val() == 0 && decorationQuotation.quotationItems.rightType.val() == 0) {
            if (com.validate() || (decorationQuotation.leftflg == false) || (decorationQuotation.rightflg == false)) {
                if (decorationQuotation.leftflg == false) {
                    com.showPopover(com.focusPage("#leftQuotationNo"), {errorMsg: "编号不合法"}, "right");
                }
                if (decorationQuotation.rightflg == false) {
                    com.showPopover(com.focusPage("#rightQuotationNo"), {errorMsg: "编号不合法"}, "right");
                }
                return;
            }
        } else if (decorationQuotation.quotationItems.leftType.val() == 0) {
            if (com.validate() || (decorationQuotation.leftflg == false)) {
                if (decorationQuotation.leftflg == false) {
                    com.showPopover(com.focusPage("#leftQuotationNo"), {errorMsg: "编号不合法"}, "right");
                }
                return;
            }
        } else if (decorationQuotation.quotationItems.rightType.val() == 0) {
            if (com.validate() || (decorationQuotation.rightflg == false)) {
                if (decorationQuotation.rightflg == false) {
                    com.showPopover(com.focusPage("#rightQuotationNo"), {errorMsg: "编号不合法"}, "right");
                }
                return;
            }
        } else {
            if (com.validate()) {
                return;
            }
        }


        params["historyQuotation"] = api.index.quotationIndex.url;
        params["leftType"] = decorationQuotation.quotationItems.leftType.val();
        params["rightType"] = decorationQuotation.quotationItems.rightType.val();
        if (decorationQuotation.quotationItems.leftType.val() == 0) {
            params["leftqId"] = decorationQuotation.quotationItems.leftQuotationNo.val();
        } else {
            params["leftqId"] = decorationQuotation.quotationItems.leftQuotationNames.val();
        }

        if (decorationQuotation.quotationItems.rightType.val() == 0) {
            params["rightqId"] = decorationQuotation.quotationItems.rightQuotationNo.val();
        } else {
            params["rightqId"] = decorationQuotation.quotationItems.rightQuotationNames.val();
        }

        if(params["leftqId"] ==  params["rightqId"]){
            com.showAlert(com.warning,"请对比不同的报价");
        }else{
            decorationQuotation.compareQuotationModal.modal("hide");
            com.focusPage('#compareQuotationModal').on('hidden.bs.modal', function () {
                com.switchPage(api.index.quotetionCompareIndex.url);
            });
        }

    });

    initQuotationList();

    com.focusPage('#btnBack').on(ace.click_event, function () {
        com.switchPage("/views/decoration/decoration.html");
    });

    com.focusPage('#createQuotation').on(ace.click_event, function () {
        decorationQuotation.editFlg = 0;
        com.clearValidator();
        com.cleanItems(decorationQuotation.quotationItems);
        decorationQuotation.quotationItems.decorationStyle.get(0).selectedIndex = 0;
        decorationQuotation.quotationModal.modal("show");
    });

    com.focusPage('#replicaQuotation').on(ace.click_event, function () {
        com.clearValidator();
        com.cleanItems(decorationQuotation.quotationItems);
        decorationQuotation.quotationItems.replicaType.on("change", function (e) {
            $this = $(this);
            if ($this.val() == 0) {
                com.focusPage("#Bquoteno").removeClass("hide");
                com.focusPage("#bOrderId").addClass("hide");

            } else {
                com.focusPage("#Bquoteno").addClass("hide");
                com.focusPage("#bOrderId").removeClass("hide");
            }
        }).trigger("change");
        decorationQuotation.quotationItems.quotationNames.bindData([], 'qid', 'quotationName');
        decorationQuotation.replicaQuotationModal.modal("show");
    });

    function initQuotationList() {
        var quotationList = com.focusPage("#quotationList").html("");

        var options = {
            "quotation.orderId": decorationQuotation.decorationOrderId,
        };
        com.post(api.quotation.queryQuotationByOrderId, options, function (res) {
            if (res.errorCode == 0) {
                if (res.quotations == null || res.quotations.length == 0) {
                    return;
                }
                $.each(res.quotations, function (i, v) {
                    drawquotation(v);
                });
            }
        }, null, false);
    }

    function editQuotationDetail(quotationId) {

        params["orderId"] = decorationQuotation.decorationOrderId;
        params["quotationId"] = quotationId;
        com.switchPage(api.index.quotationPartIndex.url);

    }

    function drawquotation(quotation) {

        var $color = ['header-color-blue', 'header-color-green', 'header-color-red'];
        var qid = quotation.qid;

        var quotationDiv = $('<div></div>').addClass("col-xs-12 col-md-3").attr('id', 'quotationDiv_' + qid).appendTo(quotationList);
        var quotationWidget = $('<div></div>').addClass("widget-box").appendTo(quotationDiv);
        var quotationWidgetHeader = $('<div></div>').addClass("widget-header " + ($color[decorationQuotation.type])).appendTo(quotationWidget);

        var quotationName = $('<h4></h4>').attr('id', 'h4name_' + qid).text(quotation.quotationName).appendTo(quotationWidgetHeader);

        var quotationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(quotationWidget);
        var quotationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(quotationWidgetBody);
        var quotationWidgetInfoDiv = $('<div></div>').addClass("col-md-12").appendTo(quotationWidgetMain);

        var quotationWidgetDivOne = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelOne = $('<label></label>').attr('for', 'form-field').attr('id', 'name_' + qid).text('名称:' + quotation.quotationName).appendTo(quotationWidgetDivOne);
        var quotationWidgetDivTwo = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelTwo = $('<label></label>').attr('for', 'form-field').attr('id', 'style_' + qid).text('风格:' + quotation.decorationStyle).appendTo(quotationWidgetDivTwo);
        var quotationWidgetDivThr = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelThr = $('<label></label>').attr('for', 'form-field').attr('id', 'time_' + qid).text('时间:' + quotation.createTime).appendTo(quotationWidgetDivThr);
        var quotationWidgetDivFiv = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelFiv = $('<label></label>').attr('for', 'form-field').attr('id', 'totalPrice_' + qid).text('总价:' + quotation.totalPrice).appendTo(quotationWidgetDivFiv);
        var quotationWidgetDivSix = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelSix = $('<label></label>').attr('for', 'form-field').attr('id', 'content_' + qid).text('备注:' + quotation.content).appendTo(quotationWidgetDivSix);

        var quotationWidgetToolDiv = $('<div></div>').addClass("ui-pg-div").appendTo(quotationWidgetMain);
        var copySpan = $('<span></span>').addClass('ui-icon icon-copy blue').attr('title', '复制').attr('id', 'copyQuotation_' + qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '复制').appendTo(quotationWidgetToolDiv);
        var editSpan = $('<span></span>').addClass('ui-icon icon-pencil blue').attr('title', '修改').attr('id', 'editQuotation_' + qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '修改').appendTo(quotationWidgetToolDiv);
        var editDetailSpan = $('<span></span>').addClass('ui-icon icon-edit blue').attr('title', '报价').attr('id', 'editQuotationDetail_' + qid).attr('data', qid).attr('data-rel', 'tooltip').attr('data-original-title', '报价').appendTo(quotationWidgetToolDiv).attr('data-type', decorationQuotation.type);
        var deleteSpan = $('<span></span>').addClass('ui-icon ui-icon-trash').attr('title', '删除').attr('id', 'deleteQuotation_' + qid).attr('data', qid).attr('data-rel', 'tooltip').attr('dataname', quotation.quotationName).attr('data-original-title', '删除').appendTo(quotationWidgetToolDiv);

        var statusDiv = $('<div></div>').addClass('pull-right inline').appendTo(quotationWidgetToolDiv);
        var statusInput = $('<input></input>').attr('name', 'statusInput').attr('id', 'id-button-borders_' + qid).addClass('ace ace-switch ace-switch-5').attr('data', qid).attr('type', 'checkbox');
        var statusSpan = $('<span></span>').addClass('lbl');

        if (quotation.defaults == 1) {
            decorationQuotation.defaultsQid = quotation.qid;
            statusInput.prop('checked', true);
        }

        statusInput.appendTo(statusDiv);
        statusSpan.appendTo(statusDiv);

        com.focusPage("#copyQuotation_" + qid).on(ace.click_event, function () {
            decorationQuotation.editFlg = 2;
            com.clearValidator();
            com.cleanItems(decorationQuotation.quotationItems);
            decorationQuotation.quotationItems.qid.val($(this).attr("data"));
            decorationQuotation.quotationItems.decorationStyle.get(0).selectedIndex = 0;
            com.post(api.quotation.queryQuotationById, {"quotation.qid": $(this).attr("data")}, function (res) {
                if (res.quotation != null) {
                    decorationQuotation.quotationModal.modal("show");
                }
            });
        });

        com.focusPage("#editQuotation_" + qid).on(ace.click_event, function () {
            decorationQuotation.editFlg = 1;
            com.clearValidator();
            com.post(api.quotation.queryQuotationById, {"quotation.qid": $(this).attr("data")}, function (res) {
                if (res.quotation != null) {
                    decorationQuotation.quotationItems.qid.val(res.quotation.qid);
                    decorationQuotation.quotationItems.quotationName.val(res.quotation.quotationName);
                    decorationQuotation.quotationItems.decorationStyle.val(res.quotation.decorationStyle);
                    decorationQuotation.quotationItems.content.val(res.quotation.content);
                    decorationQuotation.quotationModal.modal("show");
                }
            });
        });

        com.focusPage('#id-button-borders_' + qid).on(ace.click_event, function () {
            com.focusPage('input[name="statusInput"]:checked').removeAttr("checked");//取消全选
            com.post(api.quotation.changeQuotationForDefault, {
                "quotation.qid": $(this).attr("data"),
                "quotation.orderId": decorationQuotation.decorationOrderId
            }, function (res) {
                decorationQuotation.defaultsQid = res.quotation.qid;
                com.focusPage("#id-button-borders_" + res.quotation.qid).prop('checked', true);
            }, null, false);

        });

        com.focusPage("#deleteQuotation_" + qid).on(ace.click_event, function () {
            if (com.focusPage("#id-button-borders_" + $(this).attr("data")).attr("checked")) {
                bootbox.alert("默认报价不能删除");
                return;
            }

            var autoData = $(this).attr("data");
            bootbox.confirm("确定要删除报价(" + $(this).attr("dataname") + ")?", function (result) {
                if (result) {
                    com.post(api.quotation.deleteQuotationById, {
                        "quotation.qid": autoData,
                        "quotation.orderId": decorationQuotation.decorationOrderId
                    }, function (res) {
                        com.focusPage("#quotationDiv_" + autoData).remove();
                    }, null, false);
                }
            });
        });

        com.focusPage("#editQuotationDetail_" + qid).on(ace.click_event, function () {
            editQuotationDetail($(this).attr("data"));
        });

        $('[data-rel=tooltip]').tooltip();

    }
});

