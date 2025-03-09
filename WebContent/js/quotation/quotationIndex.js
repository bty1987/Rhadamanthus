$(function() {

    var quotation = {

        decorationInfo: com.focusPage("#decorationInfo"),
        quotationList: com.focusPage("#quotationList"),

        items: {
            qid: com.focusPage("#qid"),

            name: com.focusPage("#name", "#quotationModal"),
            style: com.focusPage("#style", "#quotationModal"),
            content: com.focusPage("#content", "#quotationModal"),
            quotationTimeCopy: com.focusPage('#quotationTime', "#quotationModal").switchBtn(),
            quotationPriceCopy: com.focusPage('#quotationPrice', "#quotationModal").switchBtn(),
            createOredrId: com.focusPage('#createOredrId', "#quotationModal"),

            keepriceGroup: com.focusPage('#keepriceGroup', "#quotationModal"),
            createOredrIdGroup: com.focusPage('#createOredrIdGroup', "#quotationModal"),

            replicaType: com.focusPage("#replicaType", "#replicaQuotationModal"),
            quotetionNo: com.focusPage("#quotetionNo", "#replicaQuotationModal"),
            replicaOrderId: com.focusPage('#replicaOrderId', "#replicaQuotationModal"),
            quotations: com.focusPage('#quotations', "#replicaQuotationModal"),
            quotationTime: com.focusPage('#quotationTime', "#replicaQuotationModal").switchBtn(),
            quotationPrice: com.focusPage('#quotationPrice', "#replicaQuotationModal").switchBtn(),
            replicaOredrId: com.focusPage('#replicaOredrId', "#replicaQuotationModal"),

            replicaOredrIdGroup: com.focusPage('#replicaOredrIdGroup', "#replicaQuotationModal"),

            preferPrice: com.focusPage('#preferPrice', "#quotationPreferModal"),
            managePrefer: com.focusPage('#managePrefer', "#quotationPreferModal"),
            advancePrefer: com.focusPage('#advancePrefer', "#quotationPreferModal"),
            produceShow: com.focusPage('#produceShow', "#quotationPreferModal"),
            produce: com.focusPage('#produce', "#quotationPreferModal"),

            changeReason: com.focusPage("#changeReason", "#approveModal"),
            approveManSel: com.focusPage("#approveManSel", "#approveModal"),
        },

        modals: {
            quotationModal: com.focusPage("#quotationModal"),
            replicaQuotationModal: com.focusPage("#replicaQuotationModal"),
            quotationPreferModal: com.focusPage("#quotationPreferModal"),
            approveModal: com.focusPage('#approveModal'),
        },

        orderId: params.quotation.orderId,
        type: params.orderType,
        pageType: params.urlLoadParams.type,

        editFlg: 0,
        defaultsQid: null,

        compareType: [{
            "key": "0",
            "value": "唯一编号"
        }, {
            "key": "1",
            "value": "装修单号"
        }, ],

        pageConfig: null,
        presignProduces: null,

        datasets: {
            "quotationLimit": 3,
            "quotationNum": 0,
        }
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

    com.post(api.quotation.queryPresignProduce, {}, function(res) {

        quotation.presignProduces = res.presignProduces;

        com.focusPage('#produce').bindData(res.presignProduces, "ppid", "name");
    }, null, false);

    com.post(api.approval.queryApproverByType, {
        "approver.type": 22
    }, function(res) {

        $.each(res.approvers, function(i, v) {

            var comment = v.comment == null ? "" : v.comment;

            var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px").appendTo(quotation.items.approveManSel);
            var $approvaler = $('<label></label>').appendTo($div);

            var $input = $('<input>').attr({
                "type": "radio",
                "name": "form-field-radio",
                "class": "ace",
                "uid": v.userBase.uid,
                "userId": v.userBase.userId
            }).appendTo($approvaler);

            var $span = $('<span></span>').addClass('lbl').appendTo($approvaler);
            var $name = $('<label></label>').attr('style', 'margin-left:10px;').text(v.userBase.currentName).appendTo($span);

            var $comment = $('<span></span>').addClass("lbl").text(comment).attr("style", "margin-left:15px").appendTo($approvaler);
        });
    }, null, false);

    com.focusPage('#btnBack').on('click', function() {

        com.switchPage("/views/decoration/decoration.html");
    });

    com.focusPage('#createQuotation').on('click', function() {

        quotation.items.keepriceGroup.hide();
        quotation.items.createOredrIdGroup.hide();

        quotation.editFlg = 0;

        com.clearValidator();
        com.cleanItems(quotation.items);

        quotation.items.style.get(0).selectedIndex = 0;

        quotation.modals.quotationModal.modal("show");
    });

    com.focusPage('#replicaQuotation').on('click', function() {

        quotation.items.replicaOredrIdGroup.hide();

        com.clearValidator();
        com.cleanItems(quotation.items);
        quotation.items.replicaType.on("change", function(e) {

            var $this = $(this);

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

        quotation.modals.replicaQuotationModal.modal("show");
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

            if(quotation.items.createOredrIdGroup.css("display") != "none"){
                options["quotation.orderId"] = quotation.items.createOredrId.val();
            }

            com.post(api.quotation.addQuotation, options, function(res) {

                searcher.doSearch();
                quotation.modals.quotationModal.modal("hide");
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
                quotation.modals.quotationModal.modal("hide");
            }, null, false);

        } else {

            var keeprice = null;

            var quotationTime = quotation.items.quotationTimeCopy.prop("checked");
            var quotationPrice = quotation.items.quotationPriceCopy.prop("checked");

            if (!quotationTime && !quotationPrice) {
                keeprice = 0;
            } else if (quotationTime && !quotationPrice) {
                keeprice = 1;
            } else if (!quotationTime && quotationPrice) {
                keeprice = 2;
            } else if (quotationTime && quotationPrice) {
                keeprice = 3;
            }

            var options = {
                "quotation.qid": quotation.items.qid.val(),
                "quotation.orderId": quotation.orderId,
                "quotation.name": quotation.items.name.val(),
                "quotation.style": quotation.items.style.val(),
                "quotation.content": quotation.items.content.val(),
                "quotation.keeprice": keeprice
            };

            com.post(api.quotation.copyQuotation, options, function(res) {

                searcher.doSearch();
                quotation.modals.quotationModal.modal("hide");
            }, null, false);
        }
    });

    com.focusPage("#replicaBtn").bindClick(function() {

        if (com.validate("replicaQuotationModal"))
            return;

        var options = {}, keeprice = null;

        var quotationTime = quotation.items.quotationTime.prop("checked");
        var quotationPrice = quotation.items.quotationPrice.prop("checked");

        if (!quotationTime && !quotationPrice) {
            keeprice = 0;
        } else if (quotationTime && !quotationPrice) {
            keeprice = 1;
        } else if (!quotationTime && quotationPrice) {
            keeprice = 2;
        } else if (quotationTime && quotationPrice) {
            keeprice = 3;
        }

        if (quotation.items.replicaType.val() == 0) {

            options = {
                "no": quotation.items.quotetionNo.val(),
                "quotation.orderId": quotation.orderId,
                "quotation.keeprice": keeprice
            };

            if(quotation.items.replicaOredrIdGroup.css("display") != "none"){
                options["quotation.orderId"] = quotation.items.replicaOredrId.val();
            }

            com.post(api.quotation.cloneQuotation, options, function(res) {

                searcher.doSearch();

                quotation.modals.replicaQuotationModal.modal("hide");
            }, null, false);
        } else {

            options = {
                "quotation.qid": quotation.items.quotations.val(),
                "quotation.orderId": quotation.orderId,
                "quotation.keeprice": keeprice
            };

            if(quotation.items.replicaOredrIdGroup.css("display") != "none"){
                options["quotation.orderId"] = quotation.items.replicaOredrId.val();
            }

            com.post(api.quotation.replicaQuotation, options, function(res) {

                quotation.defaultsQid = res.quotation.qid;

                searcher.doSearch();
                quotation.modals.replicaQuotationModal.modal("hide");
            }, null, false);
        }

    }, 5000);

    function initQuotationList() {

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": quotation.orderId
        }, function(res) {

            drawquotation(res.decoration);
            drawdecoration(res.decoration);
        }, null, false);

    }

    function drawdecoration(decoration) {

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(quotation.decorationInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-blue").appendTo($box);

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

    function drawquotation(decoration) {

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "quotationlimit"
        }, function(res) {

            if (res.systemConfig.value)
                quotation.datasets.quotationLimit = res.systemConfig.value;
        }, null, false);

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(quotation.decorationInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box);
        var name = $('<h4></h4>').attr('id', 'worksheet4content').text("报价单").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('可用数量: ' + quotation.datasets.quotationLimit)).appendTo($main);
        $('<div></div>').append($('<label></label>').attr('id', 'quotationNum').attr('for', 'form-field').text('已用数量: ')).appendTo($main);
        $('<div></div>').append($('<label></label>').attr('id', 'subNum').attr('for', 'form-field').text('剩余数量: ')).appendTo($main);
    }

    var searcher = new Searcher();

    var btnCopy = {
        name: "复制",
        clazz: "btn-yellow",
        handle: function(v) {

            quotation.items.keepriceGroup.show();
            quotation.items.createOredrIdGroup.hide();

            quotation.editFlg = 2;

            com.clearValidator();
            com.cleanItems(quotation.items);

            quotation.items.qid.val(v.qid);
            quotation.items.style.get(0).selectedIndex = 0;
            com.post(api.quotation.queryQuotationById, {
                "quotation.qid": v.qid
            }, function(res) {

                quotation.modals.quotationModal.modal("show");
            });
        }
    };

    var btnUpdate = {
        name: "修改",
        clazz: "btn-blue",
        handle: function(v) {

            quotation.items.keepriceGroup.hide();
            quotation.items.createOredrIdGroup.hide();

            quotation.editFlg = 1;

            com.clearValidator();

            com.post(api.quotation.queryQuotationById, {
                "quotation.qid": v.qid
            }, function(res) {

                quotation.items.qid.val(res.quotation.qid);
                quotation.items.name.val(res.quotation.name);
                quotation.items.style.val(res.quotation.style);
                quotation.items.content.val(res.quotation.content);

                quotation.modals.quotationModal.modal("show");
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

            params.quotation.orderId = quotation.orderId;

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

    var btnPrefer = {
            name: "优惠",
            clazz: "btn-info",
            handle: function(v) {

                var managePrice = 0, quotationPrefer = null;

                com.post(api.quotation.queryQuotationPrefer, {
                    "quotationPrefer.qid": v.qid
                }, function(res) {

                    quotationPrefer = res.quotationPrefer;

                    quotation.items.produce.val(quotationPrefer.ppid ? quotationPrefer.ppid : 0);
                    quotation.items.preferPrice.val(quotationPrefer.preferPrice ? quotationPrefer.preferPrice : 0);
                    quotation.items.managePrefer.val(quotationPrefer.managePrefer ? quotationPrefer.managePrefer : 0);
                    quotation.items.advancePrefer.val(quotationPrefer.advancePrefer ? quotationPrefer.advancePrefer : 0);

                    if (quotationPrefer.discount && quotationPrefer.discount == 10) {
                        com.focusPage('#preferPrice').attr("disabled", "disabled");
                    } else {
                    	com.focusPage('#preferPrice').removeAttr("disabled");
                    }

                    if (quotationPrefer.manageDiscount && quotationPrefer.manageDiscount == 10) {
                        com.focusPage('#managePrefer').attr("disabled", "disabled");
                    } else {
                    	com.focusPage('#managePrefer').removeAttr("disabled");
                    }

                    quotation.items.produceShow.hide();

                    quotation.modals.quotationPreferModal.modal("show");
                }, null, false);

                com.post(api.quotation.queryExtensionByOrderId, {
                    "extension.orderId": v.decoration.orderId
                }, function(res) {
                    $.each(res.extensions, function(i, v) {

                        managePrice = utils.accAdd(managePrice, v.type == constant.quotation().extension.TYPE_ADD_INT ? v.managePrice : -v.managePrice);
                    });

                }, null, false);

                updateQuotationPrefer(v, quotationPrefer, managePrice);
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
            field: "version.name",
            name: "报价版本",
            prop: "version.name"
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

        searcher.card("name", cardprops, cardbtns).render(function() {

            quotation.datasets.quotationNum = com.focusPage("#resultList").find("div.widget-box").length;

            var sub = quotation.datasets.quotationLimit - quotation.datasets.quotationNum;

            com.focusPage("#quotationNum").text('已用数量: ' + quotation.datasets.quotationNum);
            com.focusPage("#subNum").text('剩余数量: ' + sub);
        });
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

        if (quotation.pageConfig.pageBtn.contains("btnCopy"))
            cardbtns.push(btnCopy);

        if (quotation.pageConfig.pageBtn.contains("btnPrefer"))
            cardbtns.push(btnPrefer);

        com.focusPage("#quotationIndexPageContent").removeClass("page-content");

        searcher.base("condList", "pagenation", "resultList", quotation.pageConfig.apiPage);
        searcher.condition(quotation.pageConfig.condArr);
        searcher.history("quotationPostData");

        searcher.button(function() {

            var $createA = $('<a></a>').addClass('btn btn-minier btn-default pull-left').attr('name', 'create').css("margin", "0px 3px");
            var $createI = $('<i></i>').addClass('icon-plus-sign bigger-110').appendTo($createA);
            var $createSpan = $('<span></span>').text('创建').appendTo($createA);
            
            var $replicaA = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'replica').css("margin", "0px 3px");
            var $replicaI = $('<i></i>').addClass('icon-hdd bigger-110').appendTo($replicaA);
            var $replicaSpan = $('<span></span>').text('拷贝').appendTo($replicaA);

            return [$createA, $replicaA];
        });

        var cardprops = [{
            field: "decoration.orderId",
            name: "装修单号",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {

                tools.decoration.info(btn, v.decoration.orderId);
            },
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
            },
            click: function(btn, v) {

                tools.village.info(btn, v.decoration.house.village.no);
            }
        }, {
            field: "houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationHouseHouseNumber");
            },
            click: function(btn, v) {

                tools.house.info(btn, v.decoration.house.hid);
            }
        }, {
            field: "name",
            name: "客户名",
            prop: "decoration.customer.name",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationCustomerName");
            },
            click: function(btn, v) {

                tools.customer.info(btn, v.decoration.customer.cid);
            }
        }, {
            field: "currentName",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationDesignerCurrentName");
            },
            click: function(btn, v) {

                tools.personel.info(btn, v.decoration.designer.userId);
            }
        }, {
            field: "currentName",
            name: "业务员",
            prop: "decoration.salesman.currentName",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("decorationSalesmanCurrentName");
            },
            click: function(btn, v) {

                tools.personel.info(btn, v.decoration.salesman.userId);
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
            field: "updateTime",
            name: "保价时间",
            prop: "updateTime",
            clazz: "green",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("updateTime");
            }
        }, {
            field: "lockTime",
            name: "锁定时间",
            prop: "lockTime",
            clazz: "green",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("lockTime");
            }
        }, {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey",
            show: function(v) {

                return quotation.pageConfig.propertyArr.contains("createrCurrentName");
            },
            click: function(btn, v) {

                tools.personel.info(btn, v.creater.userId);
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

    com.focusPage('a[name="create"]', '#pagenation').click(function() {

        quotation.items.keepriceGroup.hide();
        quotation.items.createOredrIdGroup.show();

        quotation.editFlg = 0;

        com.clearValidator();
        com.cleanItems(quotation.items);

        quotation.items.style.get(0).selectedIndex = 0;

        quotation.modals.quotationModal.modal("show");
    });

    com.focusPage('a[name="replica"]', '#pagenation').click(function() {

        quotation.items.replicaOredrIdGroup.show();

        com.clearValidator();
        com.cleanItems(quotation.items);
        quotation.items.replicaType.on("change", function(e) {

            var $this = $(this);

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

        quotation.modals.replicaQuotationModal.modal("show");
    });

    function updateQuotationPrefer(v, quotationPrefer, extensionManagePrice){

        com.focusPage('#savePreferBtn').click(function() {

            if (com.validate('quotationPreferModal')) {
                return false;
            }

            var preferPrice = quotation.items.preferPrice.val();
            var managePrefer = quotation.items.managePrefer.val();
            var advancePrefer = quotation.items.advancePrefer.val();
            var preferDiscount = quotationPrefer.discount != null ? quotationPrefer.discount : 0;
            var preferManageDiscount = quotationPrefer.manageDiscount != null ? quotationPrefer.manageDiscount : 0;
            var quotePrice = quotationPrefer.quotePrice != null ? quotationPrefer.quotePrice : 0;

            var _discount = 0, _discountValue = 0;
            var _managePrice = utils.changeThrDecimal(utils.accAdd(v.managePrice, extensionManagePrice));
            var _manageDiscount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_managePrice, managePrefer), _managePrice));
            var _totalPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(v.undisPrice, v.disPrice), quotePrice), v.trafficPrice));

            if (v.decoration.type == constant.decoration().decoration.TYPE_INCLUSIVE_INT) {
                _discount = utils.changeThrDecimal(utils.accDiv(utils.accSub(quotePrice, preferPrice), quotePrice));
                _discountValue = preferDiscount;
            } else {
                _discount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_totalPrice, preferPrice), _totalPrice));
                _discountValue = v.discount;
            }

            _discount = _discount < 0 ? 0 : _discount > 1 ? 1 : _discount;

            var protation = null;

            com.post(api.quotation.queryProtationForDefaultByOrderId, {
            	"protation.orderId": v.decoration.orderId
            }, function(res){
            	if(res.protation.pid) 
            		protation = res.protation;
            }, null, false);

            if (utils.accMul(_discount, 10) < _discountValue || (protation && utils.accMul(_discount, 10) < protation.discount)) {

                com.showAlert(com.warning, "优惠金额不合理");

                return false;
            }

            if (_managePrice < managePrefer) {

                com.showAlert(com.warning, "管理优惠不能大于管理费");

                return false;
            }

            if (utils.accMul(_manageDiscount, 10) < preferManageDiscount || (protation && _manageDiscount < protation.manageDiscount)) {

                com.showAlert(com.warning, "管理费优惠金额不合理");

                return false;
            }

            var totalPrice = 0, dtaxPrice = 0, taxPrice = 0;
            var discount = utils.accDiv(v.discount, 10);
            var manageDiscount = v.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? discount : 1;
            var trafficDiscount = v.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? discount : 1;
            var dmanagePrice = utils.accMul(v.managePrice, manageDiscount);
            var dtrafficPrice = utils.accMul(v.trafficPrice, trafficDiscount);
            var notSalesmanRate = v.decoration.notSalesmanRate;

            if (v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
                taxPrice = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(v.disPrice, v.undisPrice), quotePrice), v.trafficPrice), preferPrice), managePrefer), advancePrefer), v.taxRate));
                dtaxPrice = utils.changeThrDecimal(utils.accMul(taxPrice, manageDiscount));
            }

            if (v.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
                taxPrice = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(v.disPrice, v.undisPrice), quotePrice), v.trafficPrice), v.managePrice), preferPrice), managePrefer), advancePrefer), v.taxRate));
                dtaxPrice = taxPrice;
            }

            if (v.basePrice && v.basePrice != 0) {

                var total = utils.accAdd(utils.accAdd(utils.accAdd(v.disPrice, v.undisPrice), quotePrice), v.trafficPrice);
                var remainder = total % v.basePrice;
                totalPrice = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), discount), remainder), dmanagePrice), dtaxPrice), preferPrice), managePrefer), advancePrefer));
            } else {

                totalPrice = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(v.disPrice, discount), v.undisPrice), quotePrice), dtrafficPrice), dmanagePrice), dtaxPrice), preferPrice), managePrefer), advancePrefer));
            }

            totalPrice = utils.accAdd(totalPrice, !(notSalesmanRate > 0 && notSalesmanRate < 1) ? notSalesmanRate : 0);

            var params = {
                "quotation.qid": v.qid,
                "quotation.totalPrice": totalPrice,
                "quotation.taxPrice": taxPrice,
                "quotationPrefer.qid": v.qid,
                "quotationPrefer.preferPrice": preferPrice,
                "quotationPrefer.managePrefer": managePrefer,
                "quotationPrefer.advancePrefer": advancePrefer,
            };

			if(parseFloat(advancePrefer) > quotationPrefer.advancePrefer && parseFloat(advancePrefer) > protation.advanceProfit){
				submitApprovalForQuotationPrefer(v, params, quotationPrefer);
				quotation.modals.approveModal.modal("show");
				return false;
			}

            com.post(api.quotation.updateQuotationPrefer, params, function(res) {

                searcher.doSearch();
                quotation.modals.quotationPreferModal.modal("hide");
            });
        });
    };

    function submitApprovalForQuotationPrefer(v, options, quotationPrefer) {

        com.focusPage('#submitApproveBtn').bindClick(function() {

            if (com.validate("approveModal")) {
                return false;
            }

            var receiverId = quotation.items.approveManSel.find('input:checked').attr('userid');

            if (receiverId == null || receiverId == "") {
                com.showAlert(com.error, "请选择审批人!");
                return false;
            }

            var params = {
                "approval.receiver.userId": receiverId,
                "approval.comment": quotation.items.changeReason.val(),
                "approvalQuotationPrefer.qid": v.qid,
                "approvalQuotationPrefer.qpid": quotationPrefer.qpid,
                "approvalQuotationPrefer.ppid": quotationPrefer.presignProduce.ppid,
                "approvalQuotationPrefer.preferPrice": options["quotationPrefer.preferPrice"],
                "approvalQuotationPrefer.managePrefer": options["quotationPrefer.managePrefer"],
                "approvalQuotationPrefer.advancePrefer": options["quotationPrefer.advancePrefer"],
                "approvalQuotationPrefer.taxPrice": options["quotation.taxPrice"],
                "approvalQuotationPrefer.totalPrice": options["quotation.totalPrice"],
            };

            com.post(api.approval.submitApprovalForQuotationPrefer, params, function(res) {

                com.showAlert(com.info, "操作成功");

                quotation.modals.approveModal.modal("hide");
                quotation.modals.quotationPreferModal.modal("hide");
            });
        });
    }

});