jQuery(function($) {

    var decorationContract = {

        showtype: params.urlLoadParams.showtype,

        items: {
            download: com.focusPage("#download"),
            viewpdf: com.focusPage("#viewpdf"),
            signet: com.focusPage("#signet"),

            qrcode: null,
        },
        btns: {
            saveBtn: com.focusPage('#saveBtn'),
            register: com.focusPage("#register"),
            authentication: com.focusPage("#authentication"),
            sendAuth: com.focusPage("#sendAuth"),
            confirm: com.focusPage("#confirm"),
            reset: com.focusPage("#reset"),
            signBtn: com.focusPage("#signBtn", "#decorationContractModal"),
            backBtn: com.focusPage("#backBtn"),
        },
        modals: {
            qrcodeModal: null,
            decorationContractModal: com.focusPage("#decorationContractModal")
        },

        decorationInfo: com.focusPage("#decorationInfo"),
        customerInfo: com.focusPage("#customerInfo"),

        dcid: null,

        authFlag: false,

        status: {},

        pageType: params.urlLoadParams.depage,
    };

    com.focusPage('#fl-statement').statement("装修单", "合同");

    com.focusPage('#fl-statement2').statement("合同", "列表");

    if (decorationContract.showtype == "design") {
        decorationContract.btns.saveBtn.addClass("hide");
    }

    decorationContract.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{
        "id": "qrcode",
        "type": "div",
        "clazz": "qrcode"
    }], []);
    decorationContract.items.qrcode = com.focusPage("#qrcode");

    com.post(api.decoration.queryDecorationByOrderId, {
        "decorationOrderId": params.decoration.orderId
    }, function(res) {

        var decoration = res.decoration;
        customerItems(decoration);
        decorationContract.authFlag = [1, 2].indexOf(decoration.customer.status) != -1;
    });

    decorationContract.status = constant.decoration.decorationContract.status.keys;

    com.post(api.data.querySignet, {}, function(res) {

        decorationContract.items.signet.bindData(res.signets, "sid", "name", false);
    });

    if (decorationContract.pageType == "finance") {

        decorationContract.decorationInfo.hide();
        decorationContract.customerInfo.hide();
    }

    function customerItems(decoration) {

        var $widget = $('<div></div>').addClass("").prependTo(decorationContract.customerInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("客户").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('姓名: ' + decoration.customer.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('电话: ' + (decoration.customer.phone == "" || decoration.customer.phone == null ? "暂无" : [3, 6, 8].indexOf(decoration.status) == -1 ? decoration.customer.phone.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2") : decoration.customer.phone))).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('地址: ' + (decoration.customer.address == "" ? "暂无" : decoration.customer.address))).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('客户关系: ' + decoration.customer.relationshipType)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('身份证: ' + (decoration.customer.identity == "" || decoration.customer.identity == null ? "暂无" : decoration.customer.identity.replace(/(.{6}).*(.{4})/, '$1********$2')))).appendTo($info);

        var $widget2 = $('<div></div>').addClass("").prependTo(decorationContract.decorationInfo);
        var $box2 = $('<div></div>').addClass("widget-box").appendTo($widget2);
        var $header2 = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box2);

        var name2 = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo($header2);

        var $body2 = $('<div></div>').addClass("widget-body").appendTo($box2);
        var $main2 = $('<div></div>').addClass("widget-main").appendTo($body2);
        var $info2 = $('<div></div>').css("padding", "5px").appendTo($main2);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('装修单号: ' + decoration.orderId)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('报价版本: ' + decoration.version.name)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计师: ' + decoration.designer.currentName)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('业务员: ' + decoration.salesman.currentName)).appendTo($info2);

    }
    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "contracts", api.decoration.queryDecorationContractByOrderId, {
        "decorationContract.orderId": params.decoration.orderId
    }, null, null, "decorationContracts", true);

    var lineprops = [{
        fieId: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue",
    }, {
        fieId: "name",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: decorationContract.status
    }, {
        fieId: "ishow",
        name: "是否显示",
        prop: "ishow",
        clazz: "red",
        dataset: {
            0: "显示",
            1: "隐藏"
        }
    }, {
        fieId: "creater.currentName",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
    }, {
        fieId: "signner.currentName",
        name: "签署人",
        prop: "signner.currentName",
        clazz: "grey",
        show: function(v) {

            return v.signner.currentName = v.signner.currentName ? v.signner.currentName : "无";
        }
    }, {
        fieId: "filinner.currentName",
        name: "归档人",
        prop: "filinner.currentName",
        clazz: "grey",
        show: function(v) {

            return v.filinner.currentName = v.filinner.currentName ? v.filinner.currentName : "无";
        }
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green ",
    }, {
        fieId: "cussignTime",
        name: "公司签时间",
        prop: "comsignTime",
        clazz: "green ",
        show: function(v) {

            return v.comsignTime = v.comsignTime ? v.comsignTime : "无";
        }
    }, {
        fieId: "brand",
        name: "客户签时间",
        prop: "cussignTime",
        clazz: "green ",
        show: function(v) {

            return v.cussignTime = v.cussignTime ? v.cussignTime : "无";
        }
    }, {
        fieId: "filingTime",
        name: "归档时间",
        prop: "filingTime",
        clazz: "green ",
        show: function(v) {

            return v.filingTime = v.filingTime ? v.filingTime : "无";
        }
    }, ];

    var cardbtns = [{
        name: "查看",
        clazz: "btn-yellow",
        handle: function(v) {

            viewContract(v.dcid);
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "归档",
        clazz: "btn-success",
        handle: function(v) {

            filingContract(v.dcid);
        },
        show: function(v) {

            return v.status == 1;
        }
    }, {
        name: "下载",
        clazz: "btn-warning",
        handle: function(v) {

            downloadContract(v);
        },
        show: function(v) {

            return [3, 4].indexOf(v.status) != -1;

        }
    }, {
        name: "隐藏",
        clazz: "btn-danger",
        handle: function(v) {

            showContract(v.dcid, 1);
        },
        show: function(v) {

            return v.ishow == 0;
        }
    }, {
        name: "显示",
        clazz: "btn-inverse",
        handle: function(v) {

            showContract(v.dcid, 0);
        },
        show: function(v) {

            return v.ishow == 1;
        }
    }, {
        name: "已签",
        clazz: "btn-success",
        handle: function(v) {

            signContract(v.dcid);
        },
        show: function(v) {

            return v.status == 0 && decorationContract.showtype != "design";
        }
    }, {
        name: "失效",
        clazz: "btn-danger",
        handle: function(v) {

            expireContract(v.dcid);
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        type: "newline"
    }, {
        name: "公司签",
        clazz: "btn-purple",
        handle: function(v) {

            companySign(v.dcid);
        },
        show: function(v) {

            return v.status == 0 && decorationContract.showtype != "design";
        }
    }, {
        name: "客户签",
        clazz: "btn-purple",
        handle: function(v) {

            customerSign(v.dcid);
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "二维签名",
        clazz: "btn-info",
        handle: function(v) {

            showQRCode("http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?dcid=" + v.dcid + "&type=1");
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "二维客签",
        clazz: "btn-info",
        handle: function(v) {

            showQRCode("http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?dcid=" + v.dcid + "&type=2");
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        type: "newline"
    }, {
        name: "签名通知",
        clazz: "btn-success",
        handle: function(v) {

            sendNotice("是否发送签章通知", v.dcid, 1);
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "客签通知",
        clazz: "btn-success",
        handle: function(v) {

            sendNotice("是否发送签订通知", v.dcid, 2);
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "查看通知",
        clazz: "btn-yellow",
        handle: function(v) {

            showContract(v.dcid, 1);
        },
        show: function() {

            return false;
        }
    }, {
        name: "下载通知",
        clazz: "btn-yellow",
        handle: function(v) {

            sendNotice("是否发送下载通知", v.dcid, 4);
        },
        show: function() {

            return false;
        }
    }, {
        name: "二维查看",
        clazz: "btn-info",
        handle: function(v) {

            showQRCode("http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?dcid=" + v.dcid + "&type=1");
        },
        show: function() {

            return false;
        }
    }, ];

    searcher.card("name", lineprops, cardbtns).render();

    decorationContract.btns.backBtn.on("click", function() {

        com.switchPage(params.historyPage);
    });

    // 跳转创建合同弹窗
    decorationContract.btns.saveBtn.on("click", function() {

        if (!decorationContract.authFlag) {
            com.showAlert(com.warning, "客户未认证");
            return false;
        }

        com.popup4page("#layerPopUp", "/views/decoration/decorationContract2create.html", "创建合同", null, function() {

            searcher.doSearch();
        });
    });

    // 注册按钮
    decorationContract.btns.register.on("click", function() {

        com.showConfirm("确定要注册吗?", function() {

            com.post(api.data.registCustomer, {
                "customer.cid": params.decoration.cid
            }, function(res) {

                com.showAlert(com.info, "注册成功");
            });
        });
    });

    // 认证按钮
    decorationContract.btns.authentication.on("click", function() {

        com.post(api.data.authCustomer, {
            "customer.cid": params.decoration.cid
        }, function(res) {

            // com.popup4frame("认证", res.redirect);
            showQRCode(res.redirect);
        });
    });

    // 认证通知
    decorationContract.btns.sendAuth.on("click", function() {

        com.post(api.decoration.sendDecorationContractForAuth, {
            "decorationContract.orderId": params.decoration.orderId
        }, function(res) {

            com.popup4frame("认证", res.redirect);
        });
    });

    // 确认按钮
    decorationContract.btns.confirm.on("click", function() {

        com.post(api.data.confirmCustomer, {
            "customer.cid": params.decoration.cid
        }, function(res) {

            searcher.doSearch();
        });
    });

    decorationContract.btns.signBtn.on('click', function() {

        com.post(api.decoration.signDecorationContractForCompany, {
            "decorationContract.dcid": decorationContract.dcid,
            "signet.sid": decorationContract.items.signet.val()
        });

        decorationContract.modals.decorationContractModal.modal("hide");
    });

    decorationContract.btns.reset.on('click', function() {

        com.showConfirm("是否重置客户认证", function() {

            com.post(api.data.resetCustomer, {
                "customer.cid": params.decoration.cid
            });
        });

    });

    function sendNotice(title, dcid, type) {

        com.showConfirm(title, function() {

            com.post(api.decoration.sendDecorationContract, {
                "decorationContract.dcid": dcid,
                "decorationContract.type": type
            });
        });
    }

    function showQRCode(url) {

        decorationContract.items.qrcode.html("").qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: url
        });

        decorationContract.modals.qrcodeModal.modal('show');
    }

    // 公司签按钮
    function companySign(dcid) {

        decorationContract.dcid = dcid;
        decorationContract.modals.decorationContractModal.modal("show");
    }

    // 客户签按钮
    function customerSign(dcid) {

        com.post(api.decoration.signDecorationContractForCustomer, {
            "decorationContract.dcid": dcid,
            "customer.cid": params.decoration.cid
        }, function(res) {

            com.popup4frame("客户签", res.redirect);
        });
    }

    // 合同查看按钮
    function viewContract(dcid) {

        com.post(api.decoration.viewDecorationContract, {
            "decorationContract.dcid": dcid
        }, function(res) {

            com.popup4frame("合同查看", res.redirect);
        });
    }
    // 合同已签按钮
    function signContract(dcid) {

        com.showConfirm("是否已签合同?", function() {

            com.post(api.decoration.affixDecorationContract, {
                "decorationContract.dcid": dcid
            }, function() {

                searcher.doSearch();
            });
        });
    }

    // 合同失效按钮
    function expireContract(dcid) {

        com.showConfirm("是否失效合同?", function() {

            com.post(api.decoration.expireDecorationContract, {
                "decorationContract.dcid": dcid
            }, function() {

                searcher.doSearch();
            });
        });
    }

    // 合同归档按钮
    function filingContract(dcid) {

        com.showConfirm("是否归档?", function() {

            com.post(api.decoration.filingDecorationContract, {
                "decorationContract.dcid": dcid
            }, function() {

                searcher.doSearch();
            });
        });
    }

    function downloadContract(v) {

        if (v.status == 3)
            window.open(v.download);
        else
            com.popup("装修单: " + v.orderId + " 合同", config.media + v.path);
    }

    function showContract(dcid, ishow) {

        com.post(api.decoration.showDecorationContract, {
            "decorationContract.dcid": dcid,
            "decorationContract.ishow": ishow
        }, function() {

            searcher.doSearch();
        });
    }
});