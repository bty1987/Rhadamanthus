$(function () {
    
    var decorationQuotation = {
            
        quotationList: com.focusPage("#quotationList"),
        quotationModal: com.focusPage('#quotationModal'),
        replicaQuotationModal: com.focusPage('#replicaQuotationModal'),
        
        quotationItems: {
            qid: com.focusPage("#qid"),
            replicaOrderId: com.focusPage('#replicaOrderId'),
            replicaType: com.focusPage("#replicaType"),
            name: com.focusPage("#name"),
            quotations: com.focusPage('#quotations'),
            style: com.focusPage("#style"),
            content: com.focusPage("#content"),
            quotetionNo: com.focusPage("#quotetionNo"),
        },
        
        decorationOrderId: params.decorationOrderId,
        
        type: params.orderType,
        
        editFlg: 0,
        defaultsQid: null,
        leftflg: false,
        rightflg: false,
        
        compareType: [
            {"key": "0", "value": "唯一编号"},
            {"key": "1", "value": "订单号"},
        ]
    };

    com.focusPage('#fl-statement').statement("装修单", "报价");

    decorationQuotation.quotationItems.replicaType.bindData(decorationQuotation.compareType, 'key', 'value');
    decorationQuotation.quotationItems.replicaOrderId.on("blur", function () {

        var options = {
            "quotation.orderId": $(this).val(),
        };

        com.post(api.quotation.queryQuotationByOrderId, options, function (res) {
            decorationQuotation.quotationItems.quotations.bindData(res.quotations, 'qid', 'name');
        });
    });

    com.focusPage('#btnBack').on('click', function () {
        com.switchPage("/views/decoration/decoration.html");
    });

    com.focusPage('#createQuotation').on('click', function () {
        decorationQuotation.editFlg = 0;
        com.clearValidator();
        com.cleanItems(decorationQuotation.quotationItems);
        decorationQuotation.quotationItems.style.get(0).selectedIndex = 0;
        decorationQuotation.quotationModal.modal("show");
    });

    com.focusPage('#replicaQuotation').on('click', function () {
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
            decorationQuotation.quotationItems.replicaOrderId.val("");
            decorationQuotation.quotationItems.quotetionNo.val("");
            decorationQuotation.quotationItems.quotations.bindData([], 'qid', 'name');
        }).trigger("change");
        decorationQuotation.replicaQuotationModal.modal("show");
    });

    com.focusPage('#saveBtn').bindClick(function () {

        if (com.validate("quotationModal")) {
            return;
        }

        if (decorationQuotation.editFlg == 0) {

            var options = {
                "quotation.orderId": decorationQuotation.decorationOrderId,
                "quotation.name": decorationQuotation.quotationItems.name.val(),
                "quotation.style": decorationQuotation.quotationItems.style.val(),
                "quotation.content": decorationQuotation.quotationItems.content.val(),
            };

            com.post(api.quotation.addQuotation, options, function (res) {
                drawquotation(res.quotation);
                decorationQuotation.quotationModal.modal("hide");
            }, null, false);

        } else if (decorationQuotation.editFlg == 1) {

            var options = {
                "quotation.orderId": decorationQuotation.decorationOrderId,
                "quotation.qid": decorationQuotation.quotationItems.qid.val(),
                "quotation.name": decorationQuotation.quotationItems.name.val(),
                "quotation.style": decorationQuotation.quotationItems.style.val(),
                "quotation.content": decorationQuotation.quotationItems.content.val(),
            };

            com.post(api.quotation.updateQuotation, options, function (res) {

                var _qid = decorationQuotation.quotationItems.qid.val();
                var name = decorationQuotation.quotationItems.name.val();
                var style = decorationQuotation.quotationItems.style.val();
                var content = decorationQuotation.quotationItems.content.val();

                com.focusPage("#h4name_" + _qid).text(name);
                com.focusPage("#name_" + _qid).text('名称:' + name);
                com.focusPage("#style_" + _qid).text('风格:' + style);
                com.focusPage("#content_" + _qid).text('备注:' + content);

                com.showAlert(com.info, "操作成功");
                decorationQuotation.quotationModal.modal("hide");
            }, null, false);

        } else {

            var options = {
                "quotation.qid": decorationQuotation.quotationItems.qid.val(),
                "quotation.orderId": decorationQuotation.decorationOrderId,
                "quotation.name": decorationQuotation.quotationItems.name.val(),
                "quotation.style": decorationQuotation.quotationItems.style.val(),
                "quotation.content": decorationQuotation.quotationItems.content.val(),
            };

            com.post(api.quotation.copyQuotation, options, function (res) {
                drawquotation(res.quotation);
                decorationQuotation.quotationModal.modal("hide");
            }, null, false);
        }
    });

    com.focusPage("#replicaBtn").bindClick(function () {

        if (com.validate("replicaQuotationModal")) {
            return;
        }

        var options = {};

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
                "quotation.qid": decorationQuotation.quotationItems.quotations.val(),
                "quotation.orderId": decorationQuotation.decorationOrderId,
            };

            com.post(api.quotation.replicaQuotation, options, function (res) {

                com.focusPage("#quotationDiv_" + decorationQuotation.defaultsQid).remove();

                decorationQuotation.defaultsQid = res.quotation.qid;

                drawquotation(res.quotation);
                decorationQuotation.replicaQuotationModal.modal("hide");
            }, null, false);
        }

    }, 5000);

    initQuotationList();

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

    function drawquotation(quotation) {

        var $color = ['header-color-blue', 'header-color-green', 'header-color-red'];
        var qid = quotation.qid;

        var quotationDiv = $('<div></div>').addClass("col-xs-12 col-md-3").attr('id', 'quotationDiv_' + qid).appendTo(quotationList);
        var quotationWidget = $('<div></div>').addClass("widget-box").appendTo(quotationDiv);
        var quotationWidgetHeader = $('<div></div>').addClass("widget-header " + ($color[decorationQuotation.type])).appendTo(quotationWidget);

        var name = $('<h4></h4>').attr('id', 'h4name_' + qid).text(quotation.name).appendTo(quotationWidgetHeader);

        var quotationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(quotationWidget);
        var quotationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(quotationWidgetBody);
        var quotationWidgetInfoDiv = $('<div></div>').css("padding", "5px").appendTo(quotationWidgetMain);

        var quotationWidgetDivOne = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelOne = $('<label></label>').attr('for', 'form-field').attr('id', 'name_' + qid).text('名称: ' + quotation.name).appendTo(quotationWidgetDivOne);
        var quotationWidgetDivTwo = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelTwo = $('<label></label>').attr('for', 'form-field').attr('id', 'style_' + qid).text('风格: ' + quotation.style).appendTo(quotationWidgetDivTwo);
        var quotationWidgetDivThr = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelThr = $('<label></label>').attr('for', 'form-field').attr('id', 'time_' + qid).text('时间: ' + quotation.createTime).appendTo(quotationWidgetDivThr);
        var quotationWidgetDivFiv = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelFiv = $('<label></label>').attr('for', 'form-field').attr('id', 'totalPrice_' + qid).text('总价: ' + quotation.totalPrice).appendTo(quotationWidgetDivFiv);
        var quotationWidgetDivSix = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        var quotationWidgetLabelSix = $('<label></label>').attr('for', 'form-field').attr('id', 'content_' + qid).text('备注: ' + quotation.content).appendTo(quotationWidgetDivSix);

        var quotationWidgetToolDiv = $('<div></div>').addClass("action-buttons").appendTo(quotationWidgetMain);

        var copyBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').append($('<i></i>').addClass('icon-copy')).text('复制').attr('id', 'copyQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);
        var editBtn = $('<a></a>').addClass('btn btn-minier btn-blue').append($('<i>').addClass('icon-copy')).text('修改').attr('id', 'editQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);
        var enterBtn = $('<a></a>').addClass('btn btn-minier btn-success').append($('<i>').addClass('icon-copy')).text('查看').attr('id', 'enterQuotation_' + qid).attr('data-qid', qid).attr('data-type', decorationQuotation.type).appendTo(quotationWidgetToolDiv);
        var deleteBtn = $('<a></a>').addClass('btn btn-minier btn-danger').append($('<i>').addClass('icon-copy')).text('删除').attr('id', 'deleteQuotation_' + qid).attr('data-qid', qid).attr('data-name', quotation.name).appendTo(quotationWidgetToolDiv);
        var defaultBtn = $('<a></a>').addClass('btn btn-minier btn-inverse btn-default').append($('<i>').addClass('icon-copy')).text('默认').attr('id', 'defaultQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);

        var lockBtn = $('<a></a>').addClass('btn btn-minier btn-pink').append($('<i>').addClass('icon-copy')).text('锁定').attr('id', 'lockQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);
        var unlockBtn = $('<a></a>').addClass('btn btn-minier btn-info').append($('<i>').addClass('icon-copy')).text('解锁').attr('id', 'unlockQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);
        var selectionBtn = $('<a></a>').addClass('btn btn-minier btn-purple').append($('<i>').addClass('icon-copy')).text('选材').attr('id', 'selectionQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);

        if (quotation.defaults == 1) {
            defaultBtn.addClass("hide");
            decorationQuotation.defaultsQid = quotation.qid;
        }

        if (quotation.status == 0) {
            unlockBtn.addClass("hide");
        }else {
            lockBtn.addClass("hide");
        }

        copyBtn.on('click', function () {

            decorationQuotation.editFlg = 2;

            com.clearValidator();
            com.cleanItems(decorationQuotation.quotationItems);

            decorationQuotation.quotationItems.qid.val($(this).attr("data-qid"));
            decorationQuotation.quotationItems.style.get(0).selectedIndex = 0;
            com.post(api.quotation.queryQuotationById, {"quotation.qid": $(this).attr("data-qid")}, function (res) {
                decorationQuotation.quotationModal.modal("show");
            });
        });

        editBtn.on('click', function () {

            decorationQuotation.editFlg = 1;

            com.clearValidator();

            com.post(api.quotation.queryQuotationById, {"quotation.qid": $(this).attr("data-qid")}, function (res) {

                decorationQuotation.quotationItems.qid.val(res.quotation.qid);
                decorationQuotation.quotationItems.name.val(res.quotation.name);
                decorationQuotation.quotationItems.style.val(res.quotation.style);
                decorationQuotation.quotationItems.content.val(res.quotation.content);

                decorationQuotation.quotationModal.modal("show");
            });
        });

        defaultBtn.on('click', function(){

            var that = $(this)

            var options = {
                "quotation.qid": $(this).attr("data-qid"),
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

        deleteBtn.on('click', function () {

            if (com.focusPage("#defaultQuotation_" + $(this).attr("data-qid")).hasClass("hide")) {
                com.showAlert(com.warning, "默认报价不能删除");
                return false;
            }

            var autoData = $(this).attr("data-qid");
            var dataname = $(this).attr("data-name");

            com.showConfirm("确定要删除报价: " + dataname, function(){
                com.post(api.quotation.deleteQuotationById, {"quotation.qid": autoData, "quotation.orderId": decorationQuotation.decorationOrderId}, function (res) {
                    com.focusPage("#quotationDiv_" + autoData).remove();
                });
            });
        });

        enterBtn.on('click', function () {
            enterQuotation($(this).attr("data-qid"));
        });

        lockBtn.on('click', function(){

            var that = $(this);
            var qid = that.attr("data-qid");
            var unlockBtn = $("#unlockQuotation_" + qid);

            var options = {
                "quotation.qid": qid
            };

            com.post(api.quotation.lockQuotation, options, function (res) {
                that.addClass("hide");
                unlockBtn.removeClass("hide");
            });
        });

        unlockBtn.on('click', function(){

            var that = $(this);
            var qid = that.attr("data-qid");
            var lockBtn = $("#lockQuotation_" + qid);

            var options = {
                "quotation.qid": qid
            };

            com.post(api.quotation.unlockQuotation, options, function (res) {
                that.addClass("hide");
                lockBtn.removeClass("hide");
            });

        });

        selectionBtn.on('click', function(){
            selectionQuotation($(this).attr("data-qid"));
        });
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
});