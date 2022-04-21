$(function() {

    var quotation = {

        decorationInfo: com.focusPage("#decorationInfo"),
        quotationList: com.focusPage("#quotationList"),
        quotationModal: com.focusPage('#quotationModal'),
        replicaQuotationModal: com.focusPage('#replicaQuotationModal'),

        items: {
            qid: com.focusPage("#qid"),
            replicaOrderId: com.focusPage('#replicaOrderId'),
            replicaType: com.focusPage("#replicaType"),
            name: com.focusPage("#name"),
            quotations: com.focusPage('#quotations'),
            style: com.focusPage("#style"),
            content: com.focusPage("#content"),
            quotetionNo: com.focusPage("#quotetionNo"),
        },

        orderId: params.quotation.orderId,

        type: params.orderType,

        editFlg: 0,
        defaultsQid: null,
        leftflg: false,
        rightflg: false,

        compareType: [{
            "key": "0",
            "value": "唯一编号"
        }, {
            "key": "1",
            "value": "装修单号"
        }, ]
    };

    com.focusPage('#fl-statement').statement("装修单", "报价");

    quotation.items.replicaType.bindData(quotation.compareType, 'key', 'value');
    quotation.items.replicaOrderId.on("blur", function() {

        var options = {
            "quotation.orderId": $(this).val(),
        };

        com.post(api.quotation.queryQuotationByOrderId, options, function(res) {

            quotation.items.quotations.bindData(res.quotations, 'qid', 'name');
        });
    });

    com.focusPage('#btnBack').on('click', function() {

        com.switchPage("/views/decoration/decoration.html");
    });

    com.focusPage('#createQuotation').on('click', function() {

        quotation.editFlg = 0;
        com.clearValidator();
        com.cleanItems(quotation.items);
        quotation.items.style.get(0).selectedIndex = 0;
        quotation.quotationModal.modal("show");
    });

    com.focusPage('#replicaQuotation').on('click', function() {

        com.clearValidator();
        com.cleanItems(quotation.items);
        quotation.items.replicaType.on("change", function(e) {

            $this = $(this);
            if ($this.val() == 0) {
                com.focusPage("#Bquoteno").removeClass("hide");
                com.focusPage("#bOrderId").addClass("hide");

            } else {
                com.focusPage("#Bquoteno").addClass("hide");
                com.focusPage("#bOrderId").removeClass("hide");
            }
            quotation.items.replicaOrderId.val("");
            quotation.items.quotetionNo.val("");
            quotation.items.quotations.bindData([], 'qid', 'name');
        }).trigger("change");
        quotation.replicaQuotationModal.modal("show");
    });

    com.focusPage('#saveBtn').bindClick(function() {

        if (com.validate("quotationModal"))
            return;

        if (quotation.editFlg == 0) {

            var options = {
                "quotation.orderId": quotation.orderId,
                "quotation.name": quotation.items.name.val(),
                "quotation.style": quotation.items.style.val(),
                "quotation.content": quotation.items.content.val(),
            };

            com.post(api.quotation.addQuotation, options, function(res) {

                searcher.doSearch();
                quotation.quotationModal.modal("hide");
            }, null, false);

        } else if (quotation.editFlg == 1) {

            var options = {
                "quotation.orderId": quotation.orderId,
                "quotation.qid": quotation.items.qid.val(),
                "quotation.name": quotation.items.name.val(),
                "quotation.style": quotation.items.style.val(),
                "quotation.content": quotation.items.content.val(),
            };

            com.post(api.quotation.updateQuotation, options, function(res) {

                var _qid = quotation.items.qid.val();
                var name = quotation.items.name.val();
                var style = quotation.items.style.val();
                var content = quotation.items.content.val();

                com.focusPage("#h4name_" + _qid).text(name);
                com.focusPage("#name_" + _qid).text('名称:' + name);
                com.focusPage("#style_" + _qid).text('风格:' + style);
                com.focusPage("#content_" + _qid).text('备注:' + content);

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
                quotation.quotationModal.modal("hide");
            }, null, false);

        } else {

            var options = {
                "quotation.qid": quotation.items.qid.val(),
                "quotation.orderId": quotation.orderId,
                "quotation.name": quotation.items.name.val(),
                "quotation.style": quotation.items.style.val(),
                "quotation.content": quotation.items.content.val(),
            };

            com.post(api.quotation.copyQuotation, options, function(res) {

                searcher.doSearch();
                quotation.quotationModal.modal("hide");
            }, null, false);
        }
    });

    com.focusPage("#replicaBtn").bindClick(function() {

        if (com.validate("replicaQuotationModal"))
            return;

        var options = {};

        if (quotation.items.replicaType.val() == 0) {

            options = {
                "no": quotation.items.quotetionNo.val(),
                "quotation.orderId": quotation.orderId,
            };

            com.post(api.quotation.cloneQuotation, options, function(res) {

                searcher.doSearch();

                quotation.replicaQuotationModal.modal("hide");
            }, null, false);
        } else {

            options = {
                "quotation.qid": quotation.items.quotations.val(),
                "quotation.orderId": quotation.orderId,
            };

            com.post(api.quotation.replicaQuotation, options, function(res) {

                quotation.defaultsQid = res.quotation.qid;

                searcher.doSearch();
                quotation.replicaQuotationModal.modal("hide");
            }, null, false);
        }

    }, 5000);

    initQuotationList();

    function initQuotationList() {

        var quotationList = com.focusPage("#quotationList").html("");

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": quotation.orderId
        }, function(res) {

            drawdecoration(res.decoration);
        }, null, false);

    }

    function drawdecoration(decoration) {

        var $widget1 = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(decorationInfo);
        var $box1 = $('<div></div>').addClass("widget-box").appendTo($widget1);
        var $header1 = $('<div></div>').addClass("widget-header header-color-green").appendTo($box1);

        var name1 = $('<h4></h4>').attr('id', 'h4name_').text("客户").appendTo($header1);

        var $body1 = $('<div></div>').addClass("widget-body").appendTo($box1);
        var $main1 = $('<div></div>').addClass("widget-main").appendTo($body1);
        var $info1 = $('<div></div>').css("padding", "5px").appendTo($main1);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('姓名: ' + decoration.customer.name)).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('电话: ' + (decoration.customer.phone == "" ? "暂无" : decoration.customer.phone))).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('地址: ' + (decoration.customer.address == "" ? "暂无" : decoration.customer.address))).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('客户关系: ' + decoration.customer.relationshipType)).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('身份证: ' + (decoration.customer.identity == "" ? "暂无" : decoration.customer.identity))).appendTo($info1);

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(decorationInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo($header);

        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('装修单号: ' + decoration.orderId)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('报价版本: ' + decoration.version.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计师: ' + decoration.designer.currentName)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('业务员: ' + decoration.salesman.currentName)).appendTo($info);
    }

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "quotationList", api.quotation.queryQuotationByOrderId, {
        "quotation.orderId": quotation.orderId
    }, null, null, "quotations", true);

    var cardprops = [{
        field: "name",
        name: "名称",
        prop: "name"
    }, {
        field: "style",
        name: "风格",
        prop: "style"
    }, {
        field: "createTime",
        name: "时间",
        prop: "createTime"
    }, {
        field: "totalPrice",
        name: "总价",
        prop: "totalPrice"
    }, {
        field: "content",
        name: "备注",
        prop: "content"
    }];

    var cardbtns = [{
        name: "复制",
        clazz: "btn-yellow",
        handle: function(v) {

            quotation.editFlg = 2;

            com.clearValidator();
            com.cleanItems(quotation.items);

            quotation.items.qid.val(v.qid);
            quotation.items.style.get(0).selectedIndex = 0;
            com.post(api.quotation.queryQuotationById, {
                "quotation.qid": v.qid
            }, function(res) {

                quotation.quotationModal.modal("show");
            });
        }
    }, {
        name: "修改",
        clazz: "btn-blue",
        handle: function(v) {

            quotation.editFlg = 1;

            com.clearValidator();

            com.post(api.quotation.queryQuotationById, {
                "quotation.qid": v.qid
            }, function(res) {

                quotation.items.qid.val(res.quotation.qid);
                quotation.items.name.val(res.quotation.name);
                quotation.items.style.val(res.quotation.style);
                quotation.items.content.val(res.quotation.content);

                quotation.quotationModal.modal("show");
            });
        }
    }, {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.orderId = v.orderId;
            params.quotation.quotation = v;

            com.switchPage(api.index.quotationPartIndex.url);
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            if (com.focusPage("#defaultQuotation_" + $(this).attr("data-qid")).hasClass("hide")) {
                com.showAlert(com.warning, "默认报价不能删除");
                return false;
            }

            var dataname = v.name

            com.showConfirm("确定要删除报价: " + dataname, function() {

                com.post(api.quotation.deleteQuotationById, {
                    "quotation.qid": v.qid,
                    "quotation.orderId": quotation.orderId
                }, function(res) {

                    searcher.doSearch();
                });
            });
        }
    }, {
        name: "默认",
        clazz: "btn-inverse aababa",
        handle: function(v) {

            if (v.defaults == 0) {
                quotation.defaultsQid = v.qid;
                var that = $(this);
                var options = {
                    "quotation.qid": v.qid,
                    "quotation.orderId": quotation.orderId
                };
                com.post(api.quotation.changeQuotationForDefault, options, function(res) {

                    quotation.defaultsQid = res.quotation.qid;
                    $(".btn-default").each(function(i, e) {

                        $(e).removeClass("hide");
                    });
                    searcher.doSearch();
                    that.addClass("hide");
                });
            }
        },
        show: function(v) {

            return (v.defaults == 0);
        }
    }, {
        name: "锁定",
        clazz: "btn-pink",
        handle: function(v) {

            var that = $(this);
            var qid = v.qid;
            var unlockBtn = $("#unlockQuotation_" + qid);

            var options = {
                "quotation.qid": v.qid
            };

            com.post(api.quotation.lockQuotation, options, function(res) {

                that.addClass("hide");
                searcher.doSearch();
            });
        },
        show: function(v) {

            return (v.status == 0);
        }
    }, {
        name: "解锁",
        clazz: "btn-info",
        handle: function(v) {

            var that = $(this);
            var qid = v.qid;
            var lockBtn = $("#lockQuotation_" + qid);
            var options = {
                "quotation.qid": qid
            };
            com.post(api.quotation.unlockQuotation, options, function(res) {

                that.addClass("hide");
                searcher.doSearch();
            });
        },
        show: function(v) {

            return (v.status == 1);
        }
    }, {
        type: "newline"
    }, {
        name: "选材",
        clazz: "btn-purple",
        handle: function(v) {

            params.quotation.editFlg = true;
            params.quotation.orderId = quotation.orderId;
            params.quotation.quotation = v;

            params.historyPage = api.index.quotationIndex.url;

            com.switchPage(api.index.selectionIndex.url);
        }
    }, {
        name: "定额",
        clazz: "btn-warning",
        handle: function(v) {

            params.quotation.editFlg = true;
            params.quotation.orderId = quotation.orderId;
            params.quotation.quotation = v;

            params.historyPage = api.index.quotationIndex.url;

            com.switchPage(api.index.normPart.url);
        }
    }, ];

    searcher.card("name", cardprops, cardbtns).render();

});