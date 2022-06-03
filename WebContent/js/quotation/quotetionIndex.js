$(function() {

    var quotetion = {

        quotetionList: com.focusPage("#quotetionList"),

        modals: {
            updateQuotetionModal: com.focusPage('#updateQuotetionModal'),
            replicaQuotetionModal: com.focusPage('#replicaQuotetionModal'),
        },

        items: {
            qid: com.focusPage("#quotetionid"),
            name: com.focusPage("#name"),
            version: com.focusPage("#version"),
            quotationVersion: com.focusPage("#quotationVersion"),
            content: com.focusPage("#content"),
            replicaType: com.focusPage("#replicaType"),
            quotetionNo: com.focusPage("#quotetionNo"),
            quotation: com.focusPage('#quotation'),
            replicaOrderId: com.focusPage('#replicaOrderId'),

            replicaQuotetionNo: com.focusPage("#replicaQuotetionNo"),
            cloneOrderId: com.focusPage("#cloneOrderId"),
        },

        btns: {

            createQuotetionBtn: com.focusPage("#createQuotetionBtn"),
            copyQuotetionBtn: com.focusPage("#copyQuotetionBtn"),
            compareQuotetionBtn: com.focusPage("#compareQuotetionBtn"),

            updateQuotetionBtn: com.focusPage("#updateQuotetionBtn", "#updateQuotetionModal"),
            replicaQuotetionBtn: com.focusPage("#replicaQuotetionBtn", "#replicaQuotetionModal"),
        },

        quotetion: null,
        cuotetion: null,

        canChangeStatus: 0,
        editFlg: 0,
        version: [],

        leftflg: false,
        rightflg: false,

        replicaType: [{
            "key": "0",
            "value": "唯一编号"
        }, {
            "key": "1",
            "value": "装修单号"
        }, ],
    };

    com.focusPage('#quotetion-statement').statement("报价", "报价列表");

    com.post(api.quotation.queryQuotationVersion, {}, function(res) {

        $.each(res.quotationVersions, function(i, val) {

            quotetion.version[val.no] = val.name;
        });

        quotetion.items.quotationVersion.bindData(res.quotationVersions, 'no', 'name');
    }, null, false);

    quotetion.items.replicaType.bindData(quotetion.replicaType, 'key', 'value');

    quotetion.items.replicaOrderId.on("blur", function() {

        var options = {
            "quotation.orderId": $(this).val()
        };
        com.post(api.quotation.queryQuotationByOrderId, options, function(res) {

            quotetion.items.quotation.bindData(res.quotations, 'qid', 'name');
        });
    });

    quotetion.btns.createQuotetionBtn.on('click', function() {

        quotetion.quotetion = null;

        com.clearValidator();
        com.cleanItems(quotetion.items);

        quotetion.items.version.removeClass("hide");
        quotetion.items.quotationVersion.removeAttr("disabled");

        quotetion.modals.updateQuotetionModal.modal("show");
    });

    quotetion.btns.copyQuotetionBtn.on('click', function() {

        com.clearValidator();
        com.cleanItems(quotetion.items);

        quotetion.items.replicaType.on("change", function(e) {

            var that = $(this);

            if (that.val() == 0) {
                quotetion.items.replicaQuotetionNo.removeClass("hide");
                quotetion.items.cloneOrderId.addClass("hide");
            } else {
                quotetion.items.replicaQuotetionNo.addClass("hide");
                quotetion.items.cloneOrderId.removeClass("hide");
            }

            quotetion.items.replicaOrderId.val("");
            quotetion.items.quotetionNo.val("");
            quotetion.items.quotation.bindData([], 'qid', 'quotationName');
        }).trigger("change");

        quotetion.modals.replicaQuotetionModal.modal("show");
    });

    quotetion.btns.updateQuotetionBtn.bindClick(function() {

        if (com.validate("updateQuotetionModal")) {
            return false;
        }

        var url = api.quotation.addQuotetion;
        var options = {
            "quotetion.name": quotetion.items.name.val(),
            "quotetion.version": quotetion.items.quotationVersion.val(),
            "quotetion.content": quotetion.items.content.val(),
        }

        if (quotetion.quotetion && !quotetion.cuotetion) {
            url = api.quotation.updateQuotetion;
            options["quotetion.qid"] = quotetion.quotetion.qid;
        }

        if (!quotetion.quotetion && quotetion.cuotetion) {
            url = api.quotation.copyQuotetion;
            options["quotetion.qid"] = quotetion.cuotetion.qid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            initQuotetionList();

            quotetion.modals.updateQuotetionModal.modal("hide");
        }, null, false);

    });

    quotetion.btns.replicaQuotetionBtn.bindClick(function() {

        if (com.validate("replicaQuotetionModal")) {
            return false;
        }

        var options = {};

        if (quotetion.items.replicaType.val() == 0) {
            options = {
                "quotetion.no": quotetion.items.quotetionNo.val(),
            };
            com.post(api.quotation.cloneQuotetion, options, function(res) {

                com.showAlert(com.info, "操作成功");

                initQuotetionList();

                quotetion.modals.replicaQuotetionModal.modal("hide");
            });
        } else {
            options = {
                "quotetion.qid": quotetion.items.quotation.val(),
            };
            com.post(api.quotation.replicaQuotetion, options, function(res) {

                com.showAlert(com.info, "操作成功");

                initQuotetionList();

                quotetion.modals.replicaQuotetionModal.modal("hide");
            });
        }
    }, 5000);

    initQuotetionList();

    function initQuotetionList() {

        quotetion.quotetionList.html("");
        com.post(api.quotation.queryQuotetion, {}, function(res) {

            if (res.quotetions == null || res.quotetions.length == 0) {
                return false;
            }

            $.each(res.quotetions, function(i, v) {

                drawquotetion(v);
            });
        });
    }

    function drawquotetion(quo) {

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
        $('<label></label>').attr('for', 'form-field').text('编号: ' + quo.no).css("word-break", "break-all").appendTo(quotationWidgetDivTwo);
        var quotationWidgetDivThr = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('时间: ' + quo.createTime).appendTo(quotationWidgetDivThr);
        var quotationWidgetDivFiv = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').text('总价:' + totalPrice).appendTo(quotationWidgetDivFiv);
        var quotationWidgetDivSix = $('<div></div>').appendTo(quotationWidgetInfoDiv);
        $('<label></label>').attr('for', 'form-field').attr('id', 'content_' + qid).text('备注:  ' + quo.content).css("word-break", "break-all").appendTo(quotationWidgetDivSix);

        var quotationWidgetToolDiv = $('<div></div>').addClass("action-buttons").appendTo(quotationWidgetMain);

        var copyBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').append($('<i></i>').addClass('icon-copy')).text('复制').attr('id', 'copyQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);
        var editBtn = $('<a></a>').addClass('btn btn-minier btn-blue').append($('<i>').addClass('icon-copy')).text('修改').attr('id', 'editQuotation_' + qid).attr('data-qid', qid).appendTo(quotationWidgetToolDiv);
        var enterBtn = $('<a></a>').addClass('btn btn-minier btn-success').append($('<i>').addClass('icon-copy')).text('查看').attr('id', 'editQuotationDetail_' + qid).attr('data-qid', qid).attr('data-type', quotetion.type).appendTo(quotationWidgetToolDiv);
        var deleteBtn = $('<a></a>').addClass('btn btn-minier btn-danger').append($('<i>').addClass('icon-copy')).text('删除').attr('id', 'deleteQuotation_' + qid).attr('data-qid', qid).attr('data-name', quo.name).appendTo(quotationWidgetToolDiv);

        // 复制
        copyBtn.on('click', function() {

            quotetion.quotetion = null;
            quotetion.cuotetion = quo;

            com.clearValidator();
            com.cleanItems(quotetion.items);

            quotetion.items.version.addClass("hide");

            quotetion.modals.updateQuotetionModal.modal("show");
        });

        // 修改更新
        editBtn.on('click', function() {

            quotetion.quotetion = quo;
            quotetion.cuotetion = null;

            com.clearValidator();
            com.cleanItems(quotetion.items);

            quotetion.items.version.addClass("hide");
            quotetion.items.quotationVersion.attr("disabled", "disabled");

            quotetion.items.qid.val(quo.qid);
            quotetion.items.name.val(quo.name);
            quotetion.items.quotationVersion.val(quo.version);
            quotetion.items.content.val(quo.content);

            quotetion.modals.updateQuotetionModal.modal("show");
        });

        // 报价
        enterBtn.on('click', function() {

            params.quotation.quotetion = quo;

            com.switchPage(api.index.quotetionPartIndex.url);
        });

        // 删除
        deleteBtn.on('click', function() {

            var option = {
                "quotetion.qid": quo.qid
            };

            com.showConfirm("确定要删除报价: " + quo.name, function() {

                com.post(api.quotation.deleteQuotetion, option, function(res) {

                    initQuotetionList();
                });
            });
        });
    }
});