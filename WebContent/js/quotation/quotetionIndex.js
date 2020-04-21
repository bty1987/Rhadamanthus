$(function() {
    var quotetion = {
        initQuotetionList: initQuotetionList,
        canChangeStatus: 0,
        quotetionItems: {},
        editFlg: 0,
        version: [],
        replicaType: [
            {"key": "0", "value": "唯一编号"},
            {"key": "1", "value": "订单号"},
        ],
        leftflg:false,
        rightflg: false,
    };
    quotetion.quotetionList = com.focusPage("#quotetionList");
    com.focusPage('#quotetion-statement').statement("报价", "报价信息列表");
    quotetion.quotetionItems.qid = com.focusPage("#quotetionid");
    //创建报价model
    quotetion.quotetionItems.name = com.focusPage("#name");
    quotetion.quotetionItems.version = com.focusPage("#version");
    quotetion.quotetionItems.quotationVersion = com.focusPage("#quotationVersion");
    quotetion.quotetionItems.content = com.focusPage("#content");
    com.post(api.quotation.queryQuotationVersion, {}, function (res) {
        $.each(res.quotationVersions, function (i, val) {
            quotetion.version[val.no] = val.name;
        });
        quotetion.quotetionItems.quotationVersion.bindData(res.quotationVersions, 'no', 'name');
    }, null, false);
    //拷贝报价
    quotetion.quotetionItems.replicaType = com.focusPage("#replicaType"); //拷贝类型
    quotetion.quotetionItems.replicaType.bindData(quotetion.replicaType, 'key', 'value');

    quotetion.quotetionItems.replicaType.on("change", function (e) {
        $this = $(this);
        if ($this.val() == 0) {
            com.focusPage("#Bquoteno").removeClass("hide");
            com.focusPage("#bOrderId").addClass("hide");
        } else {
            com.focusPage("#Bquoteno").addClass("hide");
            com.focusPage("#bOrderId").removeClass("hide");
        }
    }).trigger("change");

    quotetion.quotetionItems.quotetionNo = com.focusPage("#quotetionNo"); //要拷贝报价编号
    quotetion.quotetionItems.quotationNames = com.focusPage('#quotationNames');
    quotetion.quotetionItems.replicaOrderId = com.focusPage('#replicaOrderId').on("blur", function () {
        var options = {
            "quotation.orderId": $(this).val()
        };
        com.post(api.quotation.queryQuotationByOrderId, options, function (res) {
            quotetion.quotetionItems.quotationNames.bindData(res.quotations, 'qid', 'quotationName');
        });
    });

    quotetion.quotetionModal = com.focusPage('#quotetionModal');
    quotetion.replicaQuotetionModal = com.focusPage('#replicaQuotetionModal');

    com.focusPage('#quotesaveBtn').click(function () {
        
        if (com.validate("quotetionModal")) {
            return;
        }
        
        var btn = $(this).button('loading');
        
        if (quotetion.editFlg == 0) {
            var options = {
                "quotetion.name": quotetion.quotetionItems.name.val(),
                "quotetion.version": quotetion.quotetionItems.quotationVersion.val(),
                "quotetion.content": quotetion.quotetionItems.content.val(),
            };
            com.post(api.quotation.addQuotetion, options, function (res) {
                com.showAlert(com.info, "操作成功");
                quotetion.quotetionModal.modal("hide");
                drawquotetion(res.quotetion);
            }, null, false);
            btn.button("reset");
        }
        else if (quotetion.editFlg == 1) {
            var options = {
                "quotetion.qid": quotetion.quotetionItems.qid.val(),
                "quotetion.name": quotetion.quotetionItems.name.val(),
                "quotetion.version": quotetion.quotetionItems.quotationVersion.val(),
                "quotetion.content": quotetion.quotetionItems.content.val(),
            };

            com.post(api.quotation.updateQuotetion, options, function (res) {
                com.showAlert(com.info, "操作成功");
                quotetion.quotetionModal.modal("hide");
                com.focusPage("#h4name_"+quotetion.quotetionItems.qid.val()).text(quotetion.quotetionItems.name.val());
                com.focusPage("#content_"+quotetion.quotetionItems.qid.val()).text('备注:'+quotetion.quotetionItems.content.val());
            }, null, false);
            btn.button("reset");
        }
        else {
            var options = {
                "quotetion.qid": quotetion.quotetionItems.qid.val(),
                "quotetion.name": quotetion.quotetionItems.name.val(),
                "quotetion.content": quotetion.quotetionItems.content.val(),
            };
            com.post(api.quotation.copyQuotetion, options, function (res) {
                com.showAlert(com.info, "操作成功");
                quotetion.quotetionItems.version.removeClass("hide");
                quotetion.quotetionModal.modal("hide");
                drawquotetion(res.quotetion);
            }, null, false);
            btn.button("reset");
        }
    });
    com.focusPage("#replicaBtn").bindClick(function () {
        
        if (com.validate("replicaQuotetionModal")) {
            return;
        }
        
        var options;
        
        if( quotetion.quotetionItems.replicaType.val() == 0){
            options = {
                "quotetion.no": quotetion.quotetionItems.quotetionNo.val(),
            };
            com.post(api.quotation.cloneQuotetion, options, function (res) {
                com.showAlert(com.info, "操作成功");
                quotetion.replicaQuotetionModal.modal("hide");
                drawquotetion(res.quotetion);
            }, null, false);
        }else{
            options = {
                "quotetion.qid": quotetion.quotetionItems.quotationNames.val(),
            };
            com.post(api.quotation.replicaQuotetion, options, function (res) {
                com.showAlert(com.info, "操作成功");
                quotetion.replicaQuotetionModal.modal("hide");
                drawquotetion(res.quotetion);
            }, null, false);
        }
    }, 5000);

    com.focusPage('#createQuotetion').on('click', function () {
        quotetion.editFlg = 0;
        com.clearValidator();
        com.cleanItems(quotetion.quotetionItems);
        quotetion.quotetionItems.quotationVersion.get(0).selectedIndex = 0;
        quotetion.quotetionItems.version.removeClass("hide");
        quotetion.quotetionItems.quotationVersion.removeAttr("disabled");
        quotetion.quotetionModal.modal("show");
    });

    com.focusPage('#replicaQuotetion').on('click', function () {
        com.clearValidator();
        com.cleanItems(quotetion.quotetionItems);
        quotetion.quotetionItems.replicaType.on("change", function (e) {
            $this = $(this);
            if ($this.val() == 0) {
                com.focusPage("#Bquoteno").removeClass("hide");
                com.focusPage("#bOrderId").addClass("hide");

            } else {
                com.focusPage("#Bquoteno").addClass("hide");
                com.focusPage("#bOrderId").removeClass("hide");
            }
        }).trigger("change");
        quotetion.quotetionItems.quotationNames.bindData([], 'qid', 'quotationName');
        quotetion.replicaQuotetionModal.modal("show");
    });

    initQuotetionList();

    function initQuotetionList() {
        quotetion.quotetionList.html("");
        com.post(api.quotation.queryQuotetion, {}, function (res) {
            if (res.errorCode == 0) {
                if (res.quotetions == null || res.quotetions.length == 0) {
                    return;
                }
                $.each(res.quotetions,function(i,v){
                    drawquotetion(v);
                });
            }
        });
    }

    function editQuotationDetail(quotetionId) {
        params["quotetionId"] = quotetionId;
        com.switchPage(api.index.quotetionPartIndex.url);
    }

    function drawquotetion(quo){

        var $color = ['header-color-blue', 'header-color-green', 'header-color-red'];
        var qid = quo.qid;
        var totalPrice = quo.totalPrice;

        var quotationDiv = $('<div></div>').addClass("col-xs-12 col-md-3").attr('id', 'quotationDiv_'+qid).appendTo(quotetion.quotetionList);
        var quotationWidget = $('<div></div>').addClass("widget-box").appendTo(quotationDiv);

        var quotationWidgetHeader = $('<div></div>').addClass("widget-header " + ($color[0])).appendTo(quotationWidget);
        var quotationName = $('<h4></h4>').attr('id', 'h4name_'+qid).text(quo.name).appendTo(quotationWidgetHeader);
        var quotationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(quotationWidget);
        var quotationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(quotationWidgetBody);
        var quotationWidgetInfoDiv = $('<div></div>').addClass("col-md-12").appendTo(quotationWidgetMain);

        var quotationWidgetDivOne = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('报价版本: ' + quotetion.version[quo.version]).appendTo(quotationWidgetDivOne);
        var quotationWidgetDivTwo = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('编号: ' + quo.no).css("word-break","break-all").appendTo(quotationWidgetDivTwo);
        var quotationWidgetDivThr = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('时间: ' + quo.createTime).appendTo(quotationWidgetDivThr);
        var quotationWidgetDivFiv = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('总价:' + totalPrice).appendTo(quotationWidgetDivFiv);
        var quotationWidgetDivSix = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').attr('id', 'content_'+qid).text('备注:  ' + quo.content).css("word-break","break-all").appendTo(quotationWidgetDivSix);

        var quotationWidgetToolDiv = $('<div></div>').addClass("ui-pg-div").appendTo(quotationWidgetMain);
        var copySpan = $('<span></span>').addClass('ui-icon icon-copy blue').attr('title', '复制').attr('id', 'copyQuotation_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv).mouseenter(function(){
            com.showTip(this, "复制", "top");
        });
        var editSpan = $('<span></span>').addClass('ui-icon icon-pencil blue').attr('title', '修改').attr('id', 'editQuotation_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv).mouseenter(function(){
            com.showTip(this, "修改", "top");
        });
        var editDetailSpan = $('<span></span>').addClass('ui-icon icon-edit blue').attr('title', '报价').attr('id', 'editQuotationDetail_' + qid).attr('data', qid).appendTo(quotationWidgetToolDiv).attr('data-type', quotetion.type).mouseenter(function(){
            com.showTip(this, "报价", "top");
        });
        var deleteSpan = $('<span></span>').addClass('ui-icon ui-icon-trash').attr('title', '删除').attr('id', 'deleteQuotation_' + qid).attr('data', qid).attr('dataname', quo.name).appendTo(quotationWidgetToolDiv).mouseenter(function(){
            com.showTip(this, "删除", "top");
        });

        //复制
        com.focusPage("#copyQuotation_" + qid).on('click', function () {
            quotetion.editFlg = 2;
            com.clearValidator();
            com.cleanItems(quotetion.quotetionItems);
            quotetion.quotetionItems.qid.val($(this).attr("data"));
            com.post(api.quotation.queryQuotetionByQid, {"quotetion.qid": $(this).attr("data")}, function (res) {
                if (res.quotetion != null) {
                    quotetion.quotetionItems.version.addClass("hide");
                    quotetion.quotetionModal.modal("show");
                }
            });
        });
        //修改更新
        com.focusPage("#editQuotation_"+qid).on('click', function () {
            quotetion.editFlg = 1;
            com.clearValidator();
            com.post(api.quotation.queryQuotetionByQid, {"quotetion.qid": $(this).attr("data")}, function (res) {
                if (res.quotetion != null) {
                    quotetion.quotetionItems.quotationVersion.attr("disabled","true");
                    quotetion.quotetionItems.qid.val(res.quotetion.qid);
                    quotetion.quotetionItems.name.val(res.quotetion.name);
                    quotetion.quotetionItems.quotationVersion.val(res.quotetion.version);
                    quotetion.quotetionItems.content.val(res.quotetion.content);
                    quotetion.quotetionModal.modal("show");
                }
            });
        });
        //报价
        com.focusPage("#editQuotationDetail_"+qid).on('click', function () {
            editQuotationDetail($(this).attr("data"));
        });
        //删除
        com.focusPage("#deleteQuotation_"+qid).on('click', function(){

            var dataname = $(this).attr("dataname");
            var option = {
                "quotetion.qid":$(this).attr("data")
            };
            
            com.showConfirm("确定要删除报价: "+dataname, function(){
                com.post(api.quotation.deleteQuotetion,option, function(res){
                    com.focusPage("#quotationDiv_" + res.quotetion.qid).remove();
                });
            });
        });
    }

});

