$(function() {
    var quotetion = {
        quotetionList: com.focusPage("#quotetionList"),
        quotetionModal: com.focusPage('#quotetionModal'),
        replicaQuotetionModal: com.focusPage('#replicaQuotetionModal'),
        quotetionItems: {
            qid: com.focusPage("#quotetionid"),
            name: com.focusPage("#name"),
            version: com.focusPage("#version"),
            quotationVersion: com.focusPage("#quotationVersion"),
            content: com.focusPage("#content"),
            replicaType: com.focusPage("#replicaType"),
            quotetionNo: com.focusPage("#quotetionNo"),
            quotationNames: com.focusPage('#quotationNames'),
            replicaOrderId: com.focusPage('#replicaOrderId'),
        },
        canChangeStatus: 0,
        editFlg: 0,
        version: [],
        leftflg:false,
        rightflg: false,
        replicaType: [
            {"key": "0", "value": "唯一编号"},
            {"key": "1", "value": "装修单号"},
        ],
    };

    com.focusPage('#quotetion-statement').statement("报价", "报价信息列表");

    com.post(api.quotation.queryQuotationVersion, {}, function (res) {
        $.each(res.quotationVersions, function (i, val) {
            quotetion.version[val.no] = val.name;
        });
        quotetion.quotetionItems.quotationVersion.bindData(res.quotationVersions, 'no', 'name');
    }, null, false);

    quotetion.quotetionItems.replicaType.bindData(quotetion.replicaType, 'key', 'value');

    quotetion.quotetionItems.replicaOrderId.on("blur", function () {
        var options = {
            "quotation.orderId": $(this).val()
        };
        com.post(api.quotation.queryQuotationByOrderId, options, function (res) {
            quotetion.quotetionItems.quotationNames.bindData(res.quotations, 'qid', 'name');
        });
    });

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
            quotetion.quotetionItems.replicaOrderId.val("");
            quotetion.quotetionItems.quotetionNo.val("");
            quotetion.quotetionItems.quotationNames.bindData([], 'qid', 'quotationName');
        }).trigger("change");
        quotetion.replicaQuotetionModal.modal("show");
    });

    com.focusPage('#quotesaveBtn').bindClick(function () {

        if (com.validate("quotetionModal")) {
            return;
        }

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
        } else if (quotetion.editFlg == 1) {
            var options = {
                "quotetion.qid": quotetion.quotetionItems.qid.val(),
                "quotetion.name": quotetion.quotetionItems.name.val(),
                "quotetion.version": quotetion.quotetionItems.quotationVersion.val(),
                "quotetion.content": quotetion.quotetionItems.content.val(),
            };

            com.post(api.quotation.updateQuotetion, options, function (res) {
                com.showAlert(com.info, "操作成功");
                quotetion.quotetionModal.modal("hide");
                com.focusPage("#h4name_" + quotetion.quotetionItems.qid.val()).text(quotetion.quotetionItems.name.val());
                com.focusPage("#content_" + quotetion.quotetionItems.qid.val()).text('备注:' + quotetion.quotetionItems.content.val());
            }, null, false);
        } else {
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
        }
    });

    com.focusPage("#replicaBtn").bindClick(function () {

        if (com.validate("replicaQuotetionModal")) {
            return;
        }

        var options = {};

        if(quotetion.quotetionItems.replicaType.val() == 0){
            options = {
                "quotetion.no": quotetion.quotetionItems.quotetionNo.val(),
            };
            com.post(api.quotation.cloneQuotetion, options, function (res) {
                com.showAlert(com.info, "操作成功");
                quotetion.replicaQuotetionModal.modal("hide");
                drawquotetion(res.quotetion);
            }, null, false);
        } else {
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

    function drawquotetion(quo){

        var $color = ['header-color-blue', 'header-color-green', 'header-color-red'];
        var qid = quo.qid;
        var totalPrice = quo.totalPrice;

        var quotationDiv = $('<div></div>').addClass("col-xs-12 col-md-3").attr('id', 'quotationDiv_' + qid).appendTo(quotetion.quotetionList);
        var quotationWidget = $('<div></div>').addClass("widget-box").appendTo(quotationDiv);

        var quotationWidgetHeader = $('<div></div>').addClass("widget-header " + ($color[0])).appendTo(quotationWidget);
        var quotationName = $('<h4></h4>').attr('id', 'h4name_' + qid).text(quo.name).appendTo(quotationWidgetHeader);
        var quotationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(quotationWidget);
        var quotationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(quotationWidgetBody);
        var quotationWidgetInfoDiv = $('<div></div>').css("padding", "5px").appendTo(quotationWidgetMain);

        var quotationWidgetDivOne = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('报价版本: ' + quotetion.version[quo.version]).appendTo(quotationWidgetDivOne);
        var quotationWidgetDivTwo = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('编号: ' + quo.no).css("word-break","break-all").appendTo(quotationWidgetDivTwo);
        var quotationWidgetDivThr = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('时间: ' + quo.createTime).appendTo(quotationWidgetDivThr);
        var quotationWidgetDivFiv = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('总价:' + totalPrice).appendTo(quotationWidgetDivFiv);
        var quotationWidgetDivSix = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').attr('id', 'content_' + qid).text('备注:  ' + quo.content).css("word-break","break-all").appendTo(quotationWidgetDivSix);

        var quotationWidgetToolDiv = $('<div></div>').addClass("action-buttons").appendTo(quotationWidgetMain);
        
        var copyBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').append($('<i></i>').addClass('icon-copy')).text('复制').attr('id', 'copyQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);
        var editBtn = $('<a></a>').addClass('btn btn-minier btn-blue').append($('<i>').addClass('icon-copy')).text('修改').attr('id', 'editQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);
        var enterBtn = $('<a></a>').addClass('btn btn-minier btn-success').append($('<i>').addClass('icon-copy')).text('查看').attr('id', 'editQuotationDetail_' + qid).attr('data-qid', qid).attr('data-type', quotetion.type).appendTo(quotationWidgetToolDiv);
        var deleteBtn = $('<a></a>').addClass('btn btn-minier btn-danger').append($('<i>').addClass('icon-copy')).text('删除').attr('id', 'deleteQuotation_' + qid).attr('data-qid', qid).attr('data-name', quo.name).appendTo(quotationWidgetToolDiv);

        //复制
        com.focusPage("#copyQuotation_" + qid).on('click', function () {
            quotetion.editFlg = 2;
            com.clearValidator();
            com.cleanItems(quotetion.quotetionItems);
            quotetion.quotetionItems.qid.val($(this).attr("data-qid"));
            com.post(api.quotation.queryQuotetionByQid, {"quotetion.qid": $(this).attr("data-qid")}, function (res) {
                if (res.quotetion != null) {
                    quotetion.quotetionItems.version.addClass("hide");
                    quotetion.quotetionModal.modal("show");
                }
            });
        });

        //修改更新
        com.focusPage("#editQuotation_" + qid).on('click', function () {
            quotetion.editFlg = 1;
            com.clearValidator();
            com.post(api.quotation.queryQuotetionByQid, {"quotetion.qid": $(this).attr("data-qid")}, function (res) {
                if (res.quotetion != null) {
                    quotetion.quotetionItems.version.addClass("hide");
                    quotetion.quotetionItems.quotationVersion.attr("disabled","disabled");
                    quotetion.quotetionItems.qid.val(res.quotetion.qid);
                    quotetion.quotetionItems.name.val(res.quotetion.name);
                    quotetion.quotetionItems.quotationVersion.val(res.quotetion.version);
                    quotetion.quotetionItems.content.val(res.quotetion.content);
                    quotetion.quotetionModal.modal("show");
                }
            });
        });

        //报价
        com.focusPage("#editQuotationDetail_" + qid).on('click', function () {
            params["quotetionId"] = $(this).attr("data-qid");
            com.switchPage(api.index.quotetionPartIndex.url);
        });

        //删除
        com.focusPage("#deleteQuotation_" + qid).on('click', function(){

            var dataname = $(this).attr("data-name");
            var option = {
                "quotetion.qid":$(this).attr("data-qid")
            };

            com.showConfirm("确定要删除报价: " + dataname, function(){
                com.post(api.quotation.deleteQuotetion,option, function(res){
                    com.focusPage("#quotationDiv_" + res.quotetion.qid).remove();
                });
            });
        });
    }
});