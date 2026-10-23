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
            quotationTime: com.focusPage('#quotationTime').switchBtn(),
            quotationPrice: com.focusPage('#quotationPrice').switchBtn(),

            replicaQuotetionNo: com.focusPage("#replicaQuotetionNo"),
            cloneOrderId: com.focusPage("#cloneOrderId"),
        },

        btns: {

            createQuotetionBtn: com.focusPage("#createQuotetionBtn"),
            copyQuotetionBtn: com.focusPage("#copyQuotetionBtn"),
            copyOwnQuotetionBtn: com.focusPage("#copyOwnQuotetionBtn"),
            copyOtherQuotetionBtn: com.focusPage("#copyOtherQuotetionBtn"),
            compareQuotetionBtn: com.focusPage("#compareQuotetionBtn"),

            updateQuotetionBtn: com.focusPage("#updateQuotetionBtn", "#updateQuotetionModal"),
            replicaQuotetionBtn: com.focusPage("#replicaQuotetionBtn", "#replicaQuotetionModal"),
        },

        quotetion: null,
        cuotetion: null,

        replicaMode: null, // 拷贝模式: quotetion=预报单拷贝(唯一编号) / own=个人报价拷贝(校验归属) / other=他人报价拷贝(不校验)

        version: [],

        replicaType: [{
            "key": "0",
            "value": "唯一编号"
        }, {
            "key": "1",
            "value": "装修单号"
        }, ],

        pageConfig: null,

        datasets: {
            "quotetionLimit": 20,
            "quotetionNum": 0,
        }
    };

    com.focusPage('#quotetion-statement').statement("报价", "预报");

    com.post(api.quotation.queryQuotationVersion, {}, function(res) {

        quotetion.items.quotationVersion.bindData(res.quotationVersions, 'qvId', 'name');
    }, null, false);

    quotetion.items.replicaType.bindData(quotetion.replicaType, 'key', 'value');

    com.post(api.system.querySystemConfigByKey, {
        "systemConfig.key": "quotetionlimit"
    }, function(res) {

        if (res.systemConfig.value)
            quotetion.datasets.quotetionLimit = res.systemConfig.value;
    }, null, false);

    quotetion.items.replicaOrderId.on("blur", function() {

        var orderId = $(this).val();

        quotetion.items.quotation.bindData([], 'qid', 'name');

        if (!orderId)
            return;

        // 个人报价拷贝(replicaMode='own'): 仅设计师或业务员为当前操作人的装修单才可拷贝;
        // 他人报价拷贝(mode='other')不校验归属; 预报单拷贝不走本输入框
        if (quotetion.replicaMode == 'own') {

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": orderId
            }, function(res) {

                var decoration = res.decoration;
                var userId = params.userInfo.user.userId;

                var owned = (decoration.designer != null && decoration.designer.userId == userId) ||
                            (decoration.salesman != null && decoration.salesman.userId == userId);

                if (!owned) {

                    com.showAlert(com.warning, "仅归属(设计师/业务员)为本人的装修单才可个人拷贝报价");
                    quotetion.items.replicaOrderId.val("");
                    return;
                }

                com.post(api.quotation.queryQuotationByOrderId, {
                    "quotation.orderId": orderId
                }, function(res) {

                    quotetion.items.quotation.bindData(res.quotations, 'qid', 'name');
                });
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);
            }, false);

        } else {

            com.post(api.quotation.queryQuotationByOrderId, {
                "quotation.orderId": orderId
            }, function(res) {

                quotetion.items.quotation.bindData(res.quotations, 'qid', 'name');
            });
        }
    });

    quotetion.btns.createQuotetionBtn.on('click', function() {

        quotetion.quotetion = null;

        com.clearValidator();
        com.cleanItems(quotetion.items);

        quotetion.items.version.removeClass("hide");
        quotetion.items.quotationVersion.removeAttr("disabled");

        quotetion.modals.updateQuotetionModal.modal("show");
    });

    // 预报单拷贝: 按唯一编号克隆预报单
    quotetion.btns.copyQuotetionBtn.on('click', function() {

        com.clearValidator();
        com.cleanItems(quotetion.items);

        quotetion.replicaMode = 'quotetion';
        quotetion.items.replicaType.val("0").addClass("hide");

        quotetion.items.replicaQuotetionNo.removeClass("hide");
        quotetion.items.cloneOrderId.addClass("hide");

        com.focusPage("#replicaQuotetionDialog").text("预报拷贝");

        quotetion.modals.replicaQuotetionModal.modal("show");
    });

    // 个人报价拷贝: 按装修单号拷贝归属(设计师/业务员)为本人的装修单报价
    quotetion.btns.copyOwnQuotetionBtn.on('click', function() {

        com.clearValidator();
        com.cleanItems(quotetion.items);

        quotetion.replicaMode = 'own';
        quotetion.items.replicaType.val("1").addClass("hide");

        quotetion.items.replicaQuotetionNo.addClass("hide");
        quotetion.items.cloneOrderId.removeClass("hide");

        com.focusPage("#replicaQuotetionDialog").text("报价拷贝");

        quotetion.modals.replicaQuotetionModal.modal("show");
    });

    // 他人报价拷贝: 按装修单号拷贝任意装修单报价, 不校验归属
    quotetion.btns.copyOtherQuotetionBtn.on('click', function() {

        com.clearValidator();
        com.cleanItems(quotetion.items);

        quotetion.replicaMode = 'other';
        quotetion.items.replicaType.val("1").addClass("hide");

        quotetion.items.replicaQuotetionNo.addClass("hide");
        quotetion.items.cloneOrderId.removeClass("hide");

        com.focusPage("#replicaQuotetionDialog").text("报价拷贝");

        quotetion.modals.replicaQuotetionModal.modal("show");
    });

    // 页面变体(params.urlLoadParams.type): designer=预报单拷贝+个人报价拷贝; quoter=预报单拷贝+他人报价拷贝; 未指定全部显示
    var pageVariant = params.urlLoadParams.type;

    if (pageVariant == 'quoter')
        quotetion.btns.copyOwnQuotetionBtn.addClass("hide");

    if (pageVariant == 'designer')
        quotetion.btns.copyOtherQuotetionBtn.addClass("hide");

    quotetion.pageConfig = getConfig(params['urlLoadParams'].depage, 1);

    var searcher = new Searcher();

    quotetion.btns.updateQuotetionBtn.bindClick(function() {

        if (com.validate("updateQuotetionModal")) {
            return false;
        }

        var url = api.quotation.addQuotetion;
        var options = {
            "quotetion.name": quotetion.items.name.val(),
            "quotetion.version.qvId": quotetion.items.quotationVersion.val(),
            "quotetion.content": quotetion.items.content.val(),
            "quotetion.keeprice": 0,
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

            searcher.doSearch();

            quotetion.modals.updateQuotetionModal.modal("hide");
        }, null, false);

    });

    quotetion.btns.replicaQuotetionBtn.bindClick(function() {

        if (com.validate("replicaQuotetionModal")) {
            return false;
        }

        var options = {}, keeprice = null;

        var quotationTime = quotetion.items.quotationTime.prop("checked");
        var quotationPrice = quotetion.items.quotationPrice.prop("checked");

        if (!quotationTime && !quotationPrice) {
            keeprice = 0;
        } else if (quotationTime && !quotationPrice) {
            keeprice = 1;
        } else if (!quotationTime && quotationPrice) {
            keeprice = 2;
        } else if (quotationTime && quotationPrice) {
            keeprice = 3;
        }

        if (quotetion.items.replicaType.val() == 0) {
            options = {
                "quotetion.no": quotetion.items.quotetionNo.val(),
                "quotetion.keeprice": keeprice
            };
            com.post(api.quotation.cloneQuotetion, options, function(res) {

                com.showAlert(com.info, "操作成功");

                searcher.doSearch();

                quotetion.modals.replicaQuotetionModal.modal("hide");
            });
        } else {
            options = {
                "quotetion.qid": quotetion.items.quotation.val(),
                "quotetion.keeprice": keeprice
            };
            com.post(api.quotation.replicaQuotetion, options, function(res) {

                com.showAlert(com.info, "操作成功");

                searcher.doSearch();

                quotetion.modals.replicaQuotetionModal.modal("hide");
            });
        }
    }, 5000);

    var cardbtns = [];

    var copyBtn = {
        name: "复制",
        clazz: "btn-yellow",
        handle: function(v) {

            quotetion.quotetion = null;
            quotetion.cuotetion = v;

            com.clearValidator();
            com.cleanItems(quotetion.items);

            quotetion.items.version.addClass("hide");

            quotetion.modals.updateQuotetionModal.modal("show");
        }
    };

    var updateBtn = {
        name: "修改",
        clazz: "btn-blue",
        handle: function(v) {

            quotetion.quotetion = v;
            quotetion.cuotetion = null;

            com.clearValidator();
            com.cleanItems(quotetion.items);

            quotetion.items.version.addClass("hide");
            quotetion.items.quotationVersion.attr("disabled", "disabled");

            quotetion.items.qid.val(v.qid);
            quotetion.items.name.val(v.name);
            quotetion.items.quotationVersion.val(v.version.qvId);
            quotetion.items.content.val(v.content);

            quotetion.modals.updateQuotetionModal.modal("show");
        }
    };

    var viewBtn = {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.quotetion = v;

            com.switchPage(api.index.quotetionPartIndex.url);
        }
    };

    var deleteBtn = {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            var option = {
                "quotetion.qid": v.qid
            };

            com.showConfirm("确定要删除报价: " + v.name, function() {

                com.post(api.quotation.deleteQuotetion, option, function(res) {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();

                });
            });
        }
    };

    if (quotetion.pageConfig.pageBtn.contains("copy"))
        cardbtns.push(copyBtn);

    if (quotetion.pageConfig.pageBtn.contains("update"))
        cardbtns.push(updateBtn);

    if (quotetion.pageConfig.pageBtn.contains("view"))
        cardbtns.push(viewBtn);

    if (quotetion.pageConfig.pageBtn.contains("delete"))
        cardbtns.push(deleteBtn);

    searcher.set("pageltList", "pageltList", "resultList", quotetion.pageConfig.apiQuery, {}, null, null, "quotetions", true);

    var cardprops = [{
        field: "version",
        name: "报价版本",
        prop: function(v) {

            return v.version.name;
        },
        show: function(v) {

            return quotetion.pageConfig.propertyArr.contains("quotetionVersion");
        }
    }, {
        field: "no",
        name: "编号",
        prop: "no",
        show: function(v) {

            return quotetion.pageConfig.propertyArr.contains("no");
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        show: function(v) {

            return quotetion.pageConfig.propertyArr.contains("createTime");
        }
    }, {
        field: "updateTime",
        name: "保价时间",
        prop: "updateTime",
        show: function(v) {

            return quotetion.pageConfig.propertyArr.contains("updateTime");
        }
    }, {
        field: "totalPrice",
        name: "总价",
        prop: "totalPrice",
        show: function(v) {

            return quotetion.pageConfig.propertyArr.contains("totalPrice");
        }
    }, {
        field: "content",
        name: "备注",
        prop: "content",
        show: function(v) {

            return quotetion.pageConfig.propertyArr.contains("content");
        }
    }];

    searcher.card("name", cardprops, cardbtns).render(function() {

        init();
    });

    function getConfig(page, type) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "postDataName": page + "PostData",
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subtype) {

            var prop = props.shift();
            if (props.length != 0) {
                if (!o[prop])
                    o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }

            if (subtype == 0) {
                o[prop] = value;
            } else if (subtype == 1 && !o[prop]) {
                o[prop] = [value];
            } else if (subtype == 1 && o[prop]) {
                o[prop].push(value);
            }
        }

        function getApi(o, props) {

            var prop = props.shift();

            if (props.length == 0) {
                return o[prop];
            } else if (o[prop]) {
                return getApi(o[prop], props);
            }
            return "";
        }

        com.post(api.right.queryQuotationFunctionRight, {
            "quotationFunctionRight.name": page,
            "quotationFunctionRight.type": type
        }, function(res) {

            var rights = res.quotationFunctionRights.sort(function(a, b) {

                return a.quotationFunction.sort - b.quotationFunction.sort;
            });

            $.each(rights, function(i, v) {

                var data = v.quotationFunction;

                if (data.type == 1)
                    data.value = getApi({
                        "api": api
                    }, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
            });
        }, null, false);

        return pageConfig;
    }

    function init() {

        quotetion.datasets.quotetionNum = com.focusPage("#resultList").find("div.widget-box").length;

        var sub = quotetion.datasets.quotetionLimit - quotetion.datasets.quotetionNum;

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-4").prependTo(com.focusPage("#quotetionContent"));
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);
        var name = $('<h4></h4>').attr('id', 'worksheet4content').text("预报单").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('可用数量: ' + quotetion.datasets.quotetionLimit)).appendTo($main);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('已用数量: ' + quotetion.datasets.quotetionNum)).appendTo($main);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('剩余数量: ' + sub)).appendTo($main);

    }
});