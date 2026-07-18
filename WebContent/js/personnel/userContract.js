jQuery(function($) {

    var userContracts = {

        user: null,

        uid: params.personel.uid,
        ucid: null,

        btns: {
            registUser: com.focusPage("#registUser"), // 注册按钮
            resetUser: com.focusPage("#resetUser"), // 重置
            authUser: com.focusPage("#authUser"), // 认证按钮
            confirmUser: com.focusPage("#confirmUser"), // 确认按钮
            signateUser: com.focusPage("#signateUser"), // 签名
            addContractBtn: com.focusPage('#addContractBtn'), // 添加合同
            backBtn: com.focusPage("#backBtn"), // 返回

            addBtn: com.focusPage("#addBtn"), // 添加
            saveBtn: com.focusPage("#saveBtn"),// 保存

            signBtn: com.focusPage("#signBtn", "#userContractModal"),
        },

        modals: {
            addContractModal: com.focusPage("#addContractModal"),
            userContractModal: com.focusPage("#userContractModal"),

            qrcodeModal: null,
        },

        items: {
            name: com.focusPage("#name"),
            signTime: com.focusPage("#signTime"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            status: com.focusPage("#status"),
            comment: com.focusPage("#comment"),

            signet: com.focusPage("#signet"),
        },

        userInfo: com.focusPage("#userInfo"),

    };

    userContracts.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{
        "id": "qrcode",
        "type": "div",
        "clazz": "qrcode"
    }], []);
    userContracts.items.qrcode = com.focusPage("#qrcode");

    userContracts.items.status.bindData(constant.personel().userContract.status.datas, "key", "value");

    com.focusPage('#fl-statement').statement("人员", "合同");
    com.focusPage('#fl-statement2').statement("合同", "列表");

    com.post(api.personel.queryUserByUserId, {
        "user.userId": params.personel.userId
    }, function(res) {

        userContracts.user = res.user;

        userItems(res.user);
    });

    com.post(api.data.querySignet, {
        "signet.type": 2
    }, function(res) {

        userContracts.items.signet.bindData(res.signets, "sid", "name", false);
    });

    function userItems(user) {

        var $widget = $('<div></div>').addClass("").prependTo(userContracts.userInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("人员").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('姓名: ' + user.currentName)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('电话: ' + user.phone.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2"))).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('身份证: ' + (user.identity == "" || user.identity == null ? "暂无" : user.identity.replace(/(.{6}).*(.{4})/, '$1********$2')))).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('职位: ' + user.duty.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('角色: ' + user.role.name)).appendTo($info);

    }

    var searcher = new Searcher();

    searcher.set("pageltList", "pageltList", "contracts", api.personel.queryUserContract, {
        "userContract.uid": userContracts.uid
    }, null, null, "userContracts", true);

    var lineprops = [{
        fieId: "no",
        name: "编号",
        prop: "no",
    }, {
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "blue",
    }, {
        fieId: "signTime",
        name: "签订时间",
        prop: function(v) {

            return v.signTime != null ? v.signTime : '';
        },
        clazz: "green",
    }, {
        fieId: "startTime",
        name: "开始时间",
        prop: function(v) {

            return v.startTime != null ? v.startTime : '';
        },
        clazz: "green ",
    }, {
        fieId: "endTime",
        name: "结束时间",
        prop: function(v) {

            return v.endTime != null ? v.endTime : '';
        },
        clazz: "green ",
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: function(v) {

            return v.createTime != null ? v.createTime : '';
        },
        clazz: "green ",
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.personel().userContract.status.keys
    }, {
        fieId: "comment",
        name: "说明",
        prop: function(v) {

            return v.comment != null ? v.comment : '';
        },
        clazz: "blue",
    }];

    // 字段上的功能按钮
    var linebtns = [{
        name: "修改",
        clazz: "btn-yellow",
        handle: function(v) {

            userContracts.ucid = v.ucid;

            userContracts.items.name.val(v.name);
            userContracts.items.signTime.val(v.signTime);
            userContracts.items.startTime.val(v.startTime);
            userContracts.items.endTime.val(v.endTime);
            userContracts.items.status.val(v.status);
            userContracts.items.comment.val(v.comment);

            userContracts.modals.addContractModal.modal("show");
        },
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            deleteContract(v.ucid);
        },
        show: function(v) {

            return false;
        }
    }, {
        type: "newline"
    }, {
        name: "查看",
        clazz: "btn-yellow",
        handle: function(v) {

            viewContract(v.ucid);
        }
    }, {
        name: "下载",
        clazz: "btn-warning",
        handle: function(v) {

            downloadContract(v);
        },
        show: function(v) {

            return [constant.personel().userContract.STATUS_FILE_INT, 4].indexOf(v.status) != -1;

        }
    }, {
        name: "已签",
        clazz: "btn-success",
        handle: function(v) {

            signContract(v.ucid);
        },
        show: function(v) {

            return v.status == constant.personel().userContract.STATUS_VALID_INT;
        }
    }, {
        name: "失效",
        clazz: "btn-danger",
        handle: function(v) {

            expireContract(v.ucid);
        },
        show: function(v) {

            return v.status == constant.personel().userContract.STATUS_VALID_INT;
        }
    }, {
        name: "公司签",
        clazz: "btn-purple",
        handle: function(v) {

            companySign(v.ucid);
        },
        show: function(v) {

            return v.status == constant.personel().userContract.STATUS_VALID_INT;
        }
    }, {
        name: "员工签",
        clazz: "btn-purple",
        handle: function(v) {

            userSign(v.ucid);
        },
        show: function(v) {

            return v.status == constant.personel().userContract.STATUS_VALID_INT;
        }
    }, {
        type: "newline"
    }, {
        name: "二维签名",
        clazz: "btn-info",
        handle: function(v) {

            var url = "http://service-erp.fanglin.vip/platform/" + "/views/contract/redirect1.html?dcid=" + v.ucid + "&type=1&module=personel";
            showQRCode(url);
        },
        show: function(v) {

            return v.status == constant.personel().userContract.STATUS_VALID_INT;
        }
    }, {
        name: "二维员工签",
        clazz: "btn-info",
        handle: function(v) {

            var url = "http://service-erp.fanglin.vip/platform/" + "/views/contract/redirect1.html?dcid=" + v.ucid + "&type=2&module=personel";
            showQRCode(url);
        },
        show: function(v) {

            return v.status == constant.personel().userContract.STATUS_VALID_INT;
        }
    }, {
        name: "查看通知",
        clazz: "btn-pink",
        handle: function(v) {

            showContract(v.ucid, 1);
        },
        show: function() {

            return false;
        }
    }, {
        name: "二维查看",
        clazz: "btn-yellow",
        handle: function(v) {

            showQRCode("http://service-erp.fanglin.vip/platform/" + "/views/contract/redirect1.html?dcid=" + v.ucid + "&type=3&module=personel");
        },
        show: function() {

            return false;
        }
    }, {
        name: "归档",
        clazz: "btn-success",
        handle: function(v) {

            filingContract(v.ucid);
        },
        show: function(v) {

            return v.status == constant.personel().userContract.STATUS_SIGN_INT;
        }
    }, ];

    searcher.card("name", lineprops, linebtns).render();

    userContracts.btns.backBtn.on("click", function() {

        com.switchPage(params.historyPage);
    });

    com.datetime(com.focusPage("#signTime"));
    com.datetime(com.focusPage("#startTime"));
    com.datetime(com.focusPage("#endTime"));

    userContracts.modals.addContractModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(userContracts.items);
    });

    userContracts.btns.signBtn.on('click', function() {

        var signet = null;

        com.post(api.data.querySignetBySid, {
            "signet.sid": userContracts.items.signet.val()
        }, function(v) {

            signet = v.signet;
        }, null, false);

        if (signet == null) {
            com.showAlert(com.error, "签章不存在");

            return false;
        }

        var options = {
            "userContract.ucid": userContracts.ucid,
            "signet.sid": signet.sid,
            "signet.signno": signet.signno,
            "signet.keyword": signet.keyword,
            "signet.signid": signet.signid
        }

        com.post(api.personel.signUserContractForCompany, options);

        userContracts.modals.userContractModal.modal("hide");
    });

    // 保存
    userContracts.btns.saveBtn.on("click", function() {

        if (com.validate("addContractModal")) {
            return false;
        }

        var url = api.personel.addUserContract;
        var options = {
            "userContract.uid": userContracts.uid,
            "userContract.name": userContracts.items.name.val(),
            "userContract.signTime": userContracts.items.signTime.val(),
            "userContract.startTime": userContracts.items.startTime.val(),
            "userContract.endTime": userContracts.items.endTime.val(),
            "userContract.status": userContracts.items.status.val(),
            "userContract.comment": userContracts.items.comment.val()
        };

        if (userContracts.ucid) {
            url = api.personel.updateUserContract;

            options['userContract.ucid'] = userContracts.ucid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            userContracts.modals.addContractModal.modal("hide");

            searcher.doSearch();

        });
    });

    // 创建合同
    userContracts.btns.addContractBtn.on("click", function() {

        if (userContracts.user.authStatus == 0) {
            com.showAlert(com.warning, "人员未认证");

            return false;
        }

        com.popup4page("#layerPopUp", api.index.userContract4create.url, "创建合同", null, function() {

            searcher.doSearch();
        });
    });

    // 注册
    userContracts.btns.registUser.on("click", function() {

        com.showConfirm("确定要注册吗?", function() {

            com.post(api.personel.registUser, {
                "user.uid": params.personel.uid
            }, function(res) {

                com.showAlert(com.info, "注册成功");
            });
        });
    });

    // 认证
    userContracts.btns.authUser.on("click", function() {

        com.post(api.personel.authUser, {
            "user.uid": params.personel.uid
        }, function(res) {

            showQRCode(res.redirect);
        });
    });

    // 签名
    userContracts.btns.signateUser.on("click", function() {

        com.post(api.personel.signateUser, {
            "user.uid": params.personel.uid
        }, function(res) {

            com.popup4frame("签名", res.redirect);
        });
    });

    // 确认
    userContracts.btns.confirmUser.on("click", function() {

        com.post(api.personel.confirmUser, {
            "user.uid": params.personel.uid
        }, function(res) {

            searcher.doSearch();
        });
    });

    // 重置
    userContracts.btns.resetUser.on('click', function() {

        com.showConfirm("是否重置人员认证", function() {

            com.post(api.personel.resetUser, {
                "user.uid": params.personel.uid
            });
        });

    });

    function showQRCode(url) {

        userContracts.items.qrcode.html("").qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: url
        });

        userContracts.modals.qrcodeModal.modal('show');
    }

    function deleteContract(ucid) {

        com.post(api.personel.deleteUserContract, {
            "userContract.ucid": ucid
        }, function() {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

        }, null, false);

    }

    // 公司签按钮
    function companySign(ucid) {

        userContracts.ucid = ucid;
        userContracts.modals.userContractModal.modal("show");
    }

    // 员工签按钮
    function userSign(ucid) {

        com.post(api.personel.signUserContractForUser, {
            "userContract.ucid": ucid
        }, function(res) {

            com.popup4frame("员工签", res.redirect);
        });
    }

    // 合同查看按钮
    function viewContract(ucid) {

        com.post(api.personel.viewUserContract, {
            "userContract.ucid": ucid
        }, function(res) {

            com.popup4frame("合同查看", res.redirect);
        });
    }

    // 合同已签按钮
    function signContract(ucid) {

        com.showConfirm("是否已签合同?", function() {

            com.post(api.personel.affixUserContract, {
                "userContract.ucid": ucid
            }, function() {

                searcher.doSearch();
            });
        });
    }

    // 合同失效按钮
    function expireContract(ucid) {

        com.showConfirm("是否失效合同?", function() {

            com.post(api.personel.expireUserContract, {
                "userContract.ucid": ucid
            }, function() {

                searcher.doSearch();
            });
        });
    }

    // 合同归档按钮
    function filingContract(ucid) {

        com.showConfirm("是否归档?", function() {

            com.post(api.personel.filingUserContract, {
                "userContract.ucid": ucid
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

});