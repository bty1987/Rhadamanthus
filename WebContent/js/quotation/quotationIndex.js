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
        
        if (com.validate("quotationModal")) {
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
                drawquotation(res.quotation);
            }, null, false);
            
            btn.button("reset");
        } else if (decorationQuotation.editFlg == 1) {
            
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
                
                var _qid = com.focusPage("#qid").val()
                
                com.focusPage("#h4name_" + _qid).text(com.focusPage("#quotationName").val());
                com.focusPage("#name_" + _qid).text('名称:' + com.focusPage("#quotationName").val());
                com.focusPage("#style_" + _qid).text('风格:' + com.focusPage("#decorationStyle").val());
                com.focusPage("#content_" + _qid).text('备注:' + com.focusPage("#content").val());
                
                com.showAlert(com.info, "操作成功");
                
            }, null, false);

            btn.button("reset");
        } else {
            
            var options = {
                "quotation.qid": com.focusPage("#qid").val(),
                "quotation.orderId": decorationQuotation.decorationOrderId,
                "quotation.quotationName": com.focusPage("#quotationName").val(),
                "quotation.decorationStyle": com.focusPage("#decorationStyle").val(),
                "quotation.content": com.focusPage("#content").val(),
            };
            
            com.post(api.quotation.copyQuotation, options, function (res) {
                drawquotation(res.quotation);
            }, null, false);
            
            btn.button("reset");
        }
    });

    com.focusPage("#replicaBtn").bindClick(function () {
        
        if (com.validate("replicaQuotationModal")) {
            return;
        }
        
        var options;
        
        if(decorationQuotation.quotationItems.replicaType.val() == 0){
            
            options = {
                "no": decorationQuotation.quotationItems.quotetionNo.val(),
                "quotation.orderId": decorationQuotation.decorationOrderId,
            };
            
            com.post(api.quotation.cloneQuotation, options, function (res) {
                
                com.focusPage("#quotationDiv_" + decorationQuotation.defaultsQid).remove();
                
                drawquotation(res.quotation);
                
                decorationQuotation.replicaQuotationModal.modal("hide");
            }, null, false);
        }else{
            
            options = {
                "quotation.qid": decorationQuotation.quotationItems.quotationNames.val(),
                "quotation.orderId": decorationQuotation.decorationOrderId,
            };
            
            com.post(api.quotation.replicaQuotation, options, function (res) {
                
                com.focusPage("#quotationDiv_" + decorationQuotation.defaultsQid).remove();
                
                decorationQuotation.defaultsQid = res.quotation.qid;
                
                drawquotation(res.quotation);

            }, null, false);
        }

        decorationQuotation.replicaQuotationModal.modal("hide");
    }, 5000);

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
            $.each(res.quotations, function (i, v) {
                drawquotation(v);
            });
        }, null, false);
    }

    function enterQuotation(quotationId) {

        params["orderId"] = decorationQuotation.decorationOrderId;
        params["quotationId"] = quotationId;
        com.switchPage(api.index.quotationPartIndex.url);

    }

    function selectionQuotation(quotationId) {
        params["editFlg"] = true;
        params.historyPage = api.index.quotationIndex.url;
        params["decorationOrderId"] = decorationQuotation.decorationOrderId;
        params["quotationId"] = quotationId;
        com.switchPage(api.index.selectionIndex.url);

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
        var quotationWidgetInfoDiv = $('<div></div>').css("padding", "5px").appendTo(quotationWidgetMain);

        var quotationWidgetDivOne = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelOne = $('<label></label>').attr('for', 'form-field').attr('id', 'name_' + qid).text('名称: ' + quotation.quotationName).appendTo(quotationWidgetDivOne);
        var quotationWidgetDivTwo = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelTwo = $('<label></label>').attr('for', 'form-field').attr('id', 'style_' + qid).text('风格: ' + quotation.decorationStyle).appendTo(quotationWidgetDivTwo);
        var quotationWidgetDivThr = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelThr = $('<label></label>').attr('for', 'form-field').attr('id', 'time_' + qid).text('时间: ' + quotation.createTime).appendTo(quotationWidgetDivThr);
        var quotationWidgetDivFiv = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelFiv = $('<label></label>').attr('for', 'form-field').attr('id', 'totalPrice_' + qid).text('总价: ' + quotation.totalPrice).appendTo(quotationWidgetDivFiv);
        var quotationWidgetDivSix = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelSix = $('<label></label>').attr('for', 'form-field').attr('id', 'content_' + qid).text('备注: ' + quotation.content).appendTo(quotationWidgetDivSix);

        var quotationWidgetToolDiv = $('<div></div>').addClass("action-buttons").appendTo(quotationWidgetMain);
        
        var copyBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').append($('<i></i>').addClass('icon-copy')).text('复制').attr('id', 'copyQuotation_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv);
        var editBtn = $('<a></a>').addClass('btn btn-minier btn-blue').append($('<i>').addClass('icon-copy')).text('修改').attr('id', 'editQuotation_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv);
        var enterBtn = $('<a></a>').addClass('btn btn-minier btn-success').append($('<i>').addClass('icon-copy')).text('查看').attr('id', 'enterQuotation_' + qid).attr('data', qid).attr('data-type', decorationQuotation.type).appendTo(quotationWidgetToolDiv);
        var deleteBtn = $('<a></a>').addClass('btn btn-minier btn-danger').append($('<i>').addClass('icon-copy')).text('删除').attr('id', 'deleteQuotation_' + qid).attr('data', qid).attr('dataname', quotation.quotationName).appendTo(quotationWidgetToolDiv);
        var defaultBtn = $('<a></a>').addClass('btn btn-minier btn-inverse btn-default').append($('<i>').addClass('icon-copy')).text('默认').attr('id', 'defaultQuotation_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv);
        
        var lockBtn = $('<a></a>').addClass('btn btn-minier btn-pink').append($('<i>').addClass('icon-copy')).text('锁定').attr('id', 'lockQuotation_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv);
        var unlockBtn = $('<a></a>').addClass('btn btn-minier btn-info').append($('<i>').addClass('icon-copy')).text('解锁').attr('id', 'unlockQuotation_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv);
        var selectionBtn = $('<a></a>').addClass('btn btn-minier btn-purple').append($('<i>').addClass('icon-copy')).text('选材').attr('id', 'selectionQuotation_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv);

        if (quotation.defaults == 1) {
            defaultBtn.addClass("hide");
            decorationQuotation.defaultsQid = quotation.qid;
        }
        
        if (quotation.status == 0) {
            unlockBtn.addClass("hide");
        }else {
            lockBtn.addClass("hide");
        }
        
        copyBtn.on(ace.click_event, function () {
            
            decorationQuotation.editFlg = 2;
            
            com.clearValidator();
            com.cleanItems(decorationQuotation.quotationItems);
            
            decorationQuotation.quotationItems.qid.val($(this).attr("data"));
            decorationQuotation.quotationItems.decorationStyle.get(0).selectedIndex = 0;
            com.post(api.quotation.queryQuotationById, {"quotation.qid": $(this).attr("data")}, function (res) {
                decorationQuotation.quotationModal.modal("show");
            });
        });

        editBtn.on(ace.click_event, function () {
            
            decorationQuotation.editFlg = 1;
            
            com.clearValidator();
            
            com.post(api.quotation.queryQuotationById, {"quotation.qid": $(this).attr("data")}, function (res) {
                
                decorationQuotation.quotationItems.qid.val(res.quotation.qid);
                decorationQuotation.quotationItems.quotationName.val(res.quotation.quotationName);
                decorationQuotation.quotationItems.decorationStyle.val(res.quotation.decorationStyle);
                decorationQuotation.quotationItems.content.val(res.quotation.content);
                
                decorationQuotation.quotationModal.modal("show");
            });
        });
        
        defaultBtn.on(ace.click_event, function(){
            
            var that = $(this)
            
            var options = {
                "quotation.qid": $(this).attr("data"),
                "quotation.orderId": decorationQuotation.decorationOrderId
            }
            
            com.post(api.quotation.changeQuotationForDefault, options, function (res) {
                
                decorationQuotation.defaultsQid = res.quotation.qid;
                
                $(".btn-default").each(function(i, e){
                    $(e).removeClass("hide");
                });
                
                that.addClass("hide");
            });
        });

        deleteBtn.on(ace.click_event, function () {
            
            if (com.focusPage("#defaultQuotation_" + $(this).attr("data")).hasClass("hide")) {
                com.showAlert(com.warning, "默认报价不能删除");
                return false;
            }

            var autoData = $(this).attr("data");
            var dataname = $(this).attr("dataname");
            
            com.showConfirm("确定要删除报价: " + dataname, function(){
                com.post(api.quotation.deleteQuotationById, {"quotation.qid": autoData, "quotation.orderId": decorationQuotation.decorationOrderId}, function (res) {
                    com.focusPage("#quotationDiv_" + autoData).remove();
                });
            });
        });

        enterBtn.on(ace.click_event, function () {
            enterQuotation($(this).attr("data"));
        });
        
        lockBtn.on(ace.click_event, function(){
            
            var that = $(this);
            var qid = that.attr("data");
            var unlockBtn = $("#unlockQuotation_" + qid);
            
            var options = {
                "quotation.qid": qid
            }
            
            com.post(api.quotation.lockQuotation, options, function (res) {
                that.addClass("hide");
                unlockBtn.removeClass("hide");
            });
        });
        
        unlockBtn.on(ace.click_event, function(){
            
            var that = $(this);
            var qid = that.attr("data");
            var lockBtn = $("#lockQuotation_" + qid);
            
            var options = {
                "quotation.qid": qid
            }
            
            com.post(api.quotation.unlockQuotation, options, function (res) {
                that.addClass("hide");
                lockBtn.removeClass("hide");
            });
            
        });

        selectionBtn.on(ace.click_event, function(){
            selectionQuotation($(this).attr("data"));
        });

    }
});

