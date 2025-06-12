jQuery(function($) {

    var supplierContracts = {

        uid: params.personel.uid,
        scid: null,
        ucid: null,
        user: null,

        btns: {
            signUser: com.focusPage("#signUser"),
            addContractBtn: com.focusPage('#addContractBtn'), // 添加合同
            backBtn: com.focusPage("#backBtn"), // 返回
            saveBtn: com.focusPage("#saveBtn"),// 保存

            signBtn: com.focusPage("#signBtn", "#userContractModal"),
            supplierSignBtn: com.focusPage("#supplierSignBtn", "#supplierContractModal"),
        },

        modals: {
            addContractModal: com.focusPage("#addContractModal"),
            userContractModal: com.focusPage("#userContractModal"),
            supplierContractModal: com.focusPage("#supplierContractModal"),
            qrcodeModal: null,
        },

        items: {
            name: com.focusPage("#name"),
            contractTemplate: com.focusPage("#contractTemplate"),
            comment: com.focusPage("#comment"),

            signet: com.focusPage("#signet"),
            supplierSignet: com.focusPage("#supplierSignet"),
        },
        htmls: {
            contractPopUp: com.focusPage("#contractPopUp")
        },

        userInfo: com.focusPage("#userInfo"),

        no: null,
        name: null,
        title: null,
        contracts: {},
        html: null,
    };

    supplierContracts.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{
        "id": "qrcode",
        "type": "div",
        "clazz": "qrcode"
    }], []);
    supplierContracts.items.qrcode = com.focusPage("#qrcode");

    com.focusPage('#fl-statement').statement("厂商", "合同");
    com.focusPage('#fl-statement2').statement("合同", "列表");

    com.post(api.personel.queryUserByUserId, {
        "user.userId": params.personel.userId
    }, function(res) {

        supplierContracts.user = res.user;

        userItems(res.user);
    });

    com.post(api.data.querySupplierSignet, {
        "signet.suid": params.personel.uid
    }, function(res) {

        supplierContracts.items.supplierSignet.bindData(res.signets, "ssid", "name", false);
    });

    com.post(api.data.querySignet, {}, function(res) {

        supplierContracts.items.signet.bindData(res.signets, "sid", "name", false);
    });

    com.post(api.data.queryContract, {
        "contract.atttype": constant.data().contract.ATTTYPE_SUPPLIER_INT
    }, function(res) {

        supplierContracts.items.contractTemplate.bindData(res.contracts, "cid", "name", " ");

        supplierContracts.contracts = res.contracts.split("cid", "page");
        supplierContracts.no = res.contracts.split("cid", "no");
        supplierContracts.name = res.contracts.split("cid", "name");
        supplierContracts.title = res.contracts.split("cid", "title");
    });

    supplierContracts.items.contractTemplate.on('change', function() {

        var cid = supplierContracts.items.contractTemplate.val();
        var page = supplierContracts.contracts[cid];
        var no = supplierContracts.no[cid];
        var name = supplierContracts.name[cid];
        var title = supplierContracts.title[cid];

        supplierContracts.html = page;

        params.personel.contractargs = com.splitUrl(page);
        params.personel.contractargs.cid = cid;
        params.personel.contractargs.no = no;
        params.personel.contractargs.name = name;
        params.personel.contractargs.title = title;
        params.personel.contractargs.html = page;
    });

    function userItems(user) {

        var $widget = $('<div></div>').addClass("").prependTo(supplierContracts.userInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("厂商").appendTo($header);
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

    searcher.set("pageltList", "pageltList", "contracts", api.personel.querySupplierContract, {
        "supplierContract.uid": supplierContracts.uid
    }, null, null, "supplierContracts", true);

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "blue",
    }, {
        fieId: "signTime",
        name: "签订时间",
        prop: "signTime",
        clazz: "green",
    }, {
        fieId: "startTime",
        name: "开始时间",
        prop: "startTime",
        clazz: "green ",
    }, {
        fieId: "endTime",
        name: "结束时间",
        prop: "endTime",
        clazz: "green ",
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
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
        prop: "comment",
        clazz: "blue",
    }];

    var linebtns = [{
        name: "修改",
        clazz: "btn-yellow",
        handle: function(v) {

            supplierContracts.scid = v.scid;

            supplierContracts.items.name.val(v.name);
            supplierContracts.items.comment.val(v.comment);

            supplierContracts.modals.addContractModal.modal("show");
        },
        show: function(v) {

            return v.status != 2;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            deleteContract(v.scid);
        },
        show: function(v) {

            return v.status != 2;
        },
    }, {
        type: "newline"
    }, {
        name: "生成合同",
        clazz: "btn-warning",
        handle: function(v) {

            generateContract(v.cid, v.scid);
        },
        show: function(v) {

            return v.status == 0 && (!v.download || !v.viewpdf);
        }
    }, {
        name: "查看",
        clazz: "btn-yellow",
        handle: function(v) {

            viewContract(v.scid);
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
        name: "已签",
        clazz: "btn-danger",
        handle: function(v) {

            signContract(v.scid);
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "失效",
        clazz: "btn-pink",
        handle: function(v) {

            expireContract(v.scid);
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "公司签",
        clazz: "btn-purple",
        handle: function(v) {

            companySign(v.scid);
        },
        show: function(v) {

            return v.status == 0 && (v.download && v.viewpdf);
        }
    }, {
        name: "厂商签",
        clazz: "btn-yellow",
        handle: function(v) {

            supplierSign(v.scid);
        },
        show: function(v) {

            return v.status == 0 && (v.download && v.viewpdf);
        }
    }, {
        type: "newline"
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

            showQRCode("http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?dcid=" + v.ucid + "&type=3&module=personel");
        },
        show: function() {

            return false;
        }
    }, {
        name: "归档",
        clazz: "btn-success",
        handle: function(v) {

            filingContract(v.scid);
        },
        show: function(v) {

            return v.status == 1;
        }
    }, {
        name: "品牌",
        clazz: "btn-success",
        handle: function(v) {

            brandContract(v.scid);
        }
    }, {
        name: "商品",
        clazz: "btn-success",
        handle: function(v) {

            goodsContract(v.scid);
        }
    }, ];

    searcher.card("name", lineprops, linebtns).render();

    supplierContracts.btns.backBtn.on("click", function() {

        com.switchPage(params.historyPage);
    });

    supplierContracts.modals.addContractModal.on("hide.bs.modal", function() {

        supplierContracts.scid = null;

        com.clearValidator();
        com.cleanItems(supplierContracts.items);
    });

    supplierContracts.btns.signBtn.on('click', function() {

        com.post(api.personel.signSupplierContractForCompany, {
            "supplierContract.scid": supplierContracts.scid,
            "signet.sid": supplierContracts.items.signet.val()
        });

        supplierContracts.modals.userContractModal.modal("hide");
    });

    supplierContracts.btns.supplierSignBtn.on('click', function() {

        com.post(api.personel.signSupplierContractForSupplier, {
            "supplierContract.scid": supplierContracts.scid,
            "supplierSignet.ssid": supplierContracts.items.supplierSignet.val()
        }, function(res) {

            com.popup4frame("客户签", res.redirect);

            supplierContracts.modals.supplierContractModal.modal("hide");
        });
    });

    // 保存
    supplierContracts.btns.saveBtn.on("click", function() {

        if (com.validate("addContractModal")) {
            return false;
        }

        var url = api.personel.addSupplierContract;
        var options = {
            "supplierContract.uid": supplierContracts.uid,
            "supplierContract.name": supplierContracts.items.name.val(),
            "supplierContract.cid": supplierContracts.items.contractTemplate.val(),
            "contract.cid": supplierContracts.items.contractTemplate.val(),
            "supplierContract.comment": supplierContracts.items.comment.val()
        };

        if (supplierContracts.scid) {
            url = api.personel.updateSupplierContract;

            options['supplierContract.scid'] = supplierContracts.scid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            supplierContracts.modals.addContractModal.modal("hide");

            searcher.doSearch();

        }, null, false);
    });

    // 创建合同
    supplierContracts.btns.addContractBtn.on("click", function() {

        supplierContracts.modals.addContractModal.modal("show");
    });

    // 签章
    supplierContracts.btns.signUser.on("click", function() {

        params["suid"] = supplierContracts.uid;

        com.popup4page('#layerPopUp', api.index.supplierSignet.url, "厂商签章");
    });

    function showQRCode(url) {

        supplierContracts.items.qrcode.html("").qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: url
        });

        supplierContracts.modals.qrcodeModal.modal('show');
    }

    function deleteContract(scid) {

        com.post(api.personel.deleteSupplierContract, {
            "supplierContract.scid": scid
        }, function() {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

        }, null, false);

    }

    function companySign(scid) {

        supplierContracts.scid = scid;
        supplierContracts.modals.userContractModal.modal("show");
    }

    function supplierSign(scid) {

        supplierContracts.scid = scid;
        supplierContracts.modals.supplierContractModal.modal("show");
    }

    // 生成合同
    function generateContract(cid, scid) {

        var page = supplierContracts.contracts[cid];

        params.personel.contractargs = com.splitUrl(page);
        params.personel.contractargs.cid = cid;
        params.personel.contractargs.html = page;
        params.personel.contractargs.scid = scid;

        com.popup4page("#layerPopUp", "/views/personnel/supplierContract4create.html", "生成合同", null, function() {

            searcher.doSearch();
        });
    }

    // 合同查看按钮
    function viewContract(scid) {

        com.post(api.personel.viewSupplierContract, {
            "supplierContract.scid": scid
        }, function(res) {

            com.popup4frame("合同查看", res.redirect);
        });
    }

    // 合同已签按钮
    function signContract(scid) {

        com.showConfirm("是否已签合同", function() {

            com.post(api.personel.affixSupplierContract, {
                "supplierContract.scid": scid
            }, function() {

                searcher.doSearch();
            });
        });
    }

    // 合同失效按钮
    function expireContract(scid) {

        com.showConfirm("是否失效合同", function() {

            com.post(api.personel.expireSupplierContract, {
                "supplierContract.scid": scid
            }, function() {

                searcher.doSearch();
            });
        });
    }

    // 合同归档按钮
    function filingContract(scid) {

        com.showConfirm("是否归档", function() {

            com.post(api.personel.filingSupplierContract, {
                "supplierContract.scid": scid
            }, function() {

                searcher.doSearch();
            });
        });
    }

    // 品牌
    function brandContract(scid) {

        params["scid"] = scid;

        com.popup4page('#layerPopUp', api.index.supplierContractBrand.url, "厂商品牌");
    }

    // 商品
    function goodsContract(scid) {

        params["scid"] = scid;
        com.popup4page('#layerPopUp', api.index.supplierContractGoods.url, "厂商商品");
    }

    function downloadContract(v) {

        if (v.status == 3) {
            window.open(v.download);
        } else {
            com.popup("装修单: " + v.orderId + " 合同", config.media + v.path);
        }
    }

});