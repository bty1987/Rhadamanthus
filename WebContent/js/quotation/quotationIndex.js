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

        pageType: params.urlLoadParams.type,

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
        }, ],
        pageConfig: null
    };

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

    function initQuotationList() {

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": quotation.orderId
        }, function(res) {

            drawdecoration(res.decoration);
        }, null, false);

    }

    function drawdecoration(decoration) {

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

    var btnCopy = {
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
    };

    var btnUpdate = {
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
    };

    var btnView = {
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.orderId = quotation.pageType != null ? v.decoration.orderId : v.orderId;
            params.quotation.quotation = v;

            com.switchPage(api.index.quotationPartIndex.url);
        }
    };

    var btnDelete = {
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
                    "quotation.orderId": quotation.pageType != null ? v.decoration.orderId : quotation.orderId
                }, function(res) {

                    searcher.doSearch();
                });
            });
        }
    };

    var btnDefault = {
        name: "默认",
        clazz: "btn-inverse aababa",
        handle: function(v) {

            if (v.defaults == constant.quotation().quotation.DEFAULTS_NONDEFAULT_INT) {
                quotation.defaultsQid = v.qid;
                var that = $(this);
                var options = {
                    "quotation.qid": v.qid,
                    "quotation.orderId": quotation.pageType != null ? v.decoration.orderId : quotation.orderId
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

            return (v.defaults == constant.quotation().quotation.DEFAULTS_NONDEFAULT_INT);
        }
    };

    var btnLock = {
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

            return (v.status == constant.quotation().quotation.STATUS_INIT_INT);
        }
    };

    var btnUnlock = {
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

            return (v.status == constant.quotation().quotation.STATUS_LOCK_INT);
        }
    };

    var btnSelection = {
        name: "选材",
        clazz: "btn-purple",
        handle: function(v) {

            params.quotation.editFlg = true;
            params.quotation.orderId = quotation.orderId;
            params.quotation.quotation = v;

            params.historyPage = api.index.quotationIndex.url;

            com.switchPage(api.index.selectionPartIndex.url);
        }
    };

    var btnNormtion = {
        name: "定额",
        clazz: "btn-warning",
        handle: function(v) {

            params.quotation.editFlg = true;
            params.quotation.orderId = quotation.orderId;
            params.quotation.quotation = v;

            params.historyPage = api.index.quotationIndex.url;

            com.switchPage(api.index.normPart.url);
        }
    };

    if (quotation.pageType == null) {

        var cardbtns = [btnCopy, btnUpdate, btnView, btnDelete, btnDefault, btnLock, btnUnlock, {
            type: "newline"
        }, btnSelection, btnNormtion];

        com.focusPage('#fl-statement').statement("报价", "报价").show();
        com.focusPage('#decorationInfo').show();

        com.focusPage("#pagenation").hide();

        initQuotationList();

        searcher.set("pageltList", "pageltList", "resultList", api.quotation.queryQuotationByOrderId, {
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

        searcher.card("name", cardprops, cardbtns);
    }

    if (quotation.pageType == "page") {

        quotation.pageConfig = getConfig(params['urlLoadParams'].depage, 3);

        var cardbtns = [];

        if (quotation.pageConfig.pageBtn.contains("view"))
            cardbtns.push(btnView);

        if (quotation.pageConfig.pageBtn.contains("update"))
            cardbtns.push(btnUpdate);

        if (quotation.pageConfig.pageBtn.contains("default"))
            cardbtns.push(btnDefault);

        if (quotation.pageConfig.pageBtn.contains("lock"))
            cardbtns.push(btnLock);

        if (quotation.pageConfig.pageBtn.contains("unlock"))
            cardbtns.push(btnUnlock);

        if (quotation.pageConfig.pageBtn.contains("delete"))
            cardbtns.push(btnDelete);

        com.focusPage("#quotationIndexPageContent").removeClass("page-content");

        searcher.base("condList", "pagenation", "resultList", quotation.pageConfig.apiPage);
        searcher.condition(quotation.pageConfig.condArr);
        searcher.history("quotationPostData");

        var cardprops = [{
            field: "decoration.orderId",
            name: "装修单号",
            prop: "decoration.orderId",
            clazz: "blue",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationOrderId");
            }
        }, {
            field: "name",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationHouseVillageName");
            }
        }, {
            field: "houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationHouseHouseNumber");
            }
        }, {
            field: "name",
            name: "客户名",
            prop: "decoration.customer.name",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationCustomerName");
            }
        }, {
            field: "currentName",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationDesignerCurrentName");
            }
        }, {
            field: "currentName",
            name: "业务员",
            prop: "decoration.salesman.currentName",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationSalesmanCurrentName");
            }
        }, {
            field: "buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationHouseBuildArea");
            }
        }, {
            field: "decoration.status",
            name: "订单状态",
            prop: "decoration.status",
            dataset: constant.decoration().decoration.status.keys,
            clazz: "red",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationStatus");
            }
        }, {
            type: "newline"
        }, {
            field: "name",
            name: "名称",
            prop: "name",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("name");
            }
        }, {
            field: "decoration.version.name",
            name: "报价版本",
            prop: "decoration.version.name",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationVersionName");
            }
        }, {
            field: "style",
            name: "风格",
            prop: "style",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("style");
            }
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("createTime");
            }
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("createrCurrentName");
            }
        }, {
            field: "discount",
            name: "折扣",
            prop: "discount",
            clazz: "blue",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("discount");
            }
        }, {
            field: "totalPrice",
            name: "总额",
            prop: "totalPrice",
            clazz: "blue",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("totalPrice");
            }
        }, {
            field: "managePrice",
            name: "管理费",
            prop: "managePrice",
            clazz: "blue",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("managePrice");
            }
        }, {
            field: "trafficPrice",
            name: "车运费",
            prop: "trafficPrice",
            clazz: "blue",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("trafficPrice");
            }
        }, {
            field: "defaults",
            name: "默认标识",
            prop: "defaults",
            dataset: constant.quotation().quotation.defaults.keys,
            clazz: "red",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("defaults");
            }
        }, {
            field: "status",
            name: "状态",
            prop: "status",
            dataset: constant.quotation().quotation.status.keys,
            clazz: "red",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("status");
            }
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("content");
            }
        }];

        searcher.line("decoration.orderId", cardprops, cardbtns);
    }

    searcher.render();

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