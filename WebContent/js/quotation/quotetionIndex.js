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
        pageConfig: null
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

    quotetion.pageConfig = getConfig(params['urlLoadParams'].depage, 1);

    var searcher = new Searcher();

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

            searcher.doSearch();

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

                searcher.doSearch();

                quotetion.modals.replicaQuotetionModal.modal("hide");
            });
        } else {
            options = {
                "quotetion.qid": quotetion.items.quotation.val(),
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
            quotetion.items.quotationVersion.val(v.version);
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

            return quotetion.version[v.version];
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
        name: "时间",
        prop: "createTime",
        show: function(v) {

            return quotetion.pageConfig.propertyArr.contains("createTime");
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

    searcher.card("name", cardprops, cardbtns).render();

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
});