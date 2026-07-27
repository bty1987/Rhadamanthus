$(function() {

    var balanceCutpay = {

        btns: {
            balanceCutpayBtn: com.focusPage("#balanceCutpayBtn"),
            addBalanceCutpayBtn: com.focusPage("#addBalanceCutpayBtn"),
            saveBtn: com.focusPage("#saveBtn"),
            createBtn: com.focusPage("#createBtn"),
            cancelBtn: com.focusPage("#cancelBtn"),
            saveDeductBtn: com.focusPage("#saveDeductBtn"),
            saveAddBtn: com.focusPage("#saveAddBtn"),
            printBtn: com.focusPage("#printBtn"),
        },

        modals: {
            balanceCutpayModal: com.focusPage("#balanceCutpayModal"),
            deductBalanceCutpayModal: com.focusPage("#deductBalanceCutpayModal"),
            addBalanceCutpayModal: com.focusPage("#addBalanceCutpayModal"),
            createModal: com.focusPage("#createModal")
        },

        items: {
            name: com.focusPage("#name", "#createModal"),
            belonger: com.focusPage("#belonger", "#createModal"),
            money: com.focusPage("#money", "#createModal"),
            atttype: com.focusPage("#atttype", "#createModal"),
            comment: com.focusPage("#comment", "#createModal"),
            path: com.focusPage("#path", "#createModal"),
            sampleImg: com.focusPage("#sampleImg", "#createModal"),

            balanceCutpayName: com.focusPage("#balanceCutpayName"),
            deductMoney: com.focusPage("#deductMoney"),
            deductComment: com.focusPage("#deductComment"),

            balanceCutpayName: com.focusPage("#balanceCutpayName"),
            balanceDccountName: com.focusPage("#balanceDccountName"),
            balanceDccountSurplus: com.focusPage("#balanceDccountSurplus"),
            balanceDccountCutpay: com.focusPage("#balanceDccountCutpay"),
            balanceCutpayMoney: com.focusPage("#balanceCutpayMoney"),
            balanceCutpayComment: com.focusPage("#balanceCutpayComment"),
        },

        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        uid: params.balance.uid,
        bcid: null,
        deductName: null,
        bid: params.balance.bid,
        balance: params.balance,
        balanceCutpayType: {},
        depage: params['urlLoadParams'].depage
    };

    balanceCutpay.items.atttype.bindData(constant.balance().balanceCutpay.atttype.datas, "key", "value");

    balanceCutpay.modals.balanceCutpayModal.on("hide.bs.modal", function() {

        com.cleanItems(balanceCutpay.items);
        com.clearValidator();
        com.closeTip();
    });

    balanceCutpay.modals.addBalanceCutpayModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("name1");
        com.cleanItems(balanceCutpay.items);
    });

    com.initTypeahead('belonger', api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "departmentType.name": "",
        "user.status": 0
    }, "suppliers", "userId", "currentName", null);

    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.png', {
        'uploadType': 2
    }, 1, function(data) {

        balanceCutpay.items.path.val(data.resUrl);
        balanceCutpay.items.filesize.val(data.filesize);

        com.showImg(balanceCutpay.items.sampleImg, data.resUrl, 150, 150, '', null, 0);
    });

    balanceCutpay.items.balanceDccountName.on('change', function() {

        com.post(api.balance.queryBalanceDccount, {
            "balanceDccount.belonger.uid": balanceCutpay.uid
        }, function(res) {

            $.each(res.balanceDccountes, function(i, v) {

                if (com.focusPage("#balanceDccountName").val() == v.bdid) {

                    com.focusPage("#balanceDccountSurplus").val(v.surplus);
                    com.focusPage("#balanceDccountCutpay").val(v.cutpay);
                }
            });
        });
    });

    if (balanceCutpay.depage == "cutpay") {
        com.focusPage(".title").hide();
        com.focusPage("#balanceCutpayName").hide();
        com.focusPage("#addBalanceCutpayBtn").hide();
        com.focusPage("#balanceCutpayBtn").hide();
        balanceCutpay.btns.printBtn.hide();
    } else {
        com.focusPage("#name").hide();
        com.focusPage("#pagebalanceCutpays").hide();
        com.focusPage("#money").attr("readOnly", "readOnly");

        com.post(api.balance.queryBalanceDccount, {
            "balanceDccount.belonger.uid": balanceCutpay.uid
        }, function(res) {

            var balanceDccountes = [];
            balanceDccountes.push({
                name: " "
            });

            $.each(res.balanceDccountes, function(i, v) {

                if (v.status == constant.balance().balanceDccount.status.STATUS_VALID_SHORT) {

                    balanceDccountes.push(v);
                }
            });

            com.focusPage("#balanceDccountName").bindData(balanceDccountes, "bdid", "name");
        }, null, false);

        com.post(api.balance.queryBalanceCutpayByOuid, {
            "balanceCutpay.belonger.uid": balanceCutpay.uid
        }, function(res) {

            var balanceCutpays = [];
            balanceCutpays.push({
                name: " "
            });

            $.each(res.balanceCutpays, function(i, v) {

                if (v.status == constant.balance().balanceCutpay.status.STATUS_INIT_INT) {

                    balanceCutpays.push(v);
                }
            });

            com.focusPage("#balanceCutpayName").bindData(balanceCutpays, "bcid", "name");
        }, null, false);

    }

    var searcher = new Searcher();

    searcher.history(balanceCutpay.depage + "balanceCutpayPostData");

    if (balanceCutpay.depage == "cutpay") {
        searcher.base("condList", "pagenation", "resultList", api.balance.pageBalanceCutpay);
        searcher.condition(["balance-cutpay-name", "balance-cutpay-operater"]);

        searcher.button([{
            id: "createBalanceCutpay",
            name: "创建",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);
    } else {
        searcher.set("pageltList", "pageltList", "balanceCutpays", api.balance.queryBalanceCutpay, {
            "balanceCutpay.balance.bid": balanceCutpay.bid
        }, null, null, "balanceCutpays", true);
    }

    var lineprops = [{
        fieId: "operater.currentName",
        name: "操作人",
        prop: "operater.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.operater.userId);
        }
    }, {
        fieId: "belonger.currentName",
        name: "归属人",
        prop: "belonger.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.operater.userId);
        }
    }, {
        fieId: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green",
    }, {
        field: "cutpay.name",
        name: "关联扣款",
        prop: "cutpay.name",
        clazz: "grey",
    }, {
        field: "dccount.name",
        name: "关联扣款账户",
        prop: "dccount.name",
        clazz: "grey",
    }, {
        field: "money",
        name: "金额",
        prop: "money",
        clazz: "blue",
    }, {
        fieId: "total",
        name: "总额",
        prop: "total",
        clazz: "blue",
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.balance().balanceCutpay.type.keys,
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.balance().balanceCutpay.status.keys,
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey",
    }];

    var linebtns = [{
        name: "抵扣",
        clazz: "btn-yellow",
        handle: function(v) {

            balanceCutpay.deductName = v.name;
            balanceCutpay.bcid = v.bcid;
            deductBalanceCutpay(v);
            return false;
        },
        show: function(v) {

            return balanceCutpay.depage != "cutpay";
        }
    }, {
        name: "解绑",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.balance.unbindBalanceCutpay, {
                "balanceCutpay.bcid": v.bcid,
                "balanceCutpay.balance.bid": balanceCutpay.bid,
            }, function() {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return balanceCutpay.depage != "cutpay";
        }
    }, {
        name: "图片",
        clazz: "btn-inverse",
        handle: function(v) {

            managedrawing(v);
            initUploadBtn(v);
            return false;
        },
        show: function(v) {

            return balanceCutpay.depage == "cutpay";
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#balanceCutpayBtn').on("click", function() {

        com.post(api.balance.queryBalanceCutpayByOuid, {
            "balanceCutpay.belonger.uid": balanceCutpay.uid
        }, function(res) {

            balanceCutpay.items.balanceCutpayName.bindData(res.balanceCutpays, "bcid", "name");
        });

        balanceCutpay.modals.balanceCutpayModal.modal("show");
    });

    com.focusPage('#createBalanceCutpay').on("click", function() {

        balanceCutpay.modals.createModal.modal("show");
    });

    com.focusPage('#addBalanceCutpayBtn').on("click", function() {

        balanceCutpay.modals.addBalanceCutpayModal.modal("show");
    });

    com.focusPage('#printBtn').on("click", function() {

        params.balance = balanceCutpay.balance;

        com.popup("扣款明细表", api.index.balanceCutpay2print.url, null, null, true);
    });

    function deductBalanceCutpay(v) {

        balanceCutpay.modals.deductBalanceCutpayModal.modal("show");
    }

    balanceCutpay.btns.saveBtn.on("click", function() {

        if (com.validate('balanceCutpayModal')) {
            return false;
        }

        var url = null;
        var options = {};

        if (balanceCutpay.depage != "cutpay") {
            url = api.balance.submitBalanceCutpay;

            options = {
                "balanceCutpay.bcid": balanceCutpay.items.balanceCutpayName.val(),
                "balanceCutpay.balance.bid": balanceCutpay.bid,
                "balanceCutpay.comment": balanceCutpay.items.comment.val()
            };
        } else {
            url = api.balance.addBalanceCutpay;

            options = {
                "balanceCutpay.name": balanceCutpay.items.name.val(),
                "balanceCutpay.belonger.userId": com.typeahead("belonger"),
                "balanceCutpay.type": constant.balance().balanceCutpay.TYPE_CUTPAY_INT,
                "balanceCutpay.money": balanceCutpay.items.money.val(),
                "balanceCutpay.comment": balanceCutpay.items.comment.val(),
                "balanceCutpay.path": balanceCutpay.items.path.val(),
            };
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });

        balanceCutpay.modals.balanceCutpayModal.modal("hide");
    });

    balanceCutpay.btns.saveDeductBtn.on("click", function() {

        if (com.validate('deductBalanceCutpayModal')) {
            return false;
        }

        var options = {
            "balanceCutpay.balance.bid": balanceCutpay.bid,
            "balanceCutpay.bcid": balanceCutpay.bcid,
            "balanceCutpay.name": balanceCutpay.deductName,
            "balanceCutpay.type": constant.balance().balanceCutpay.TYPE_UNCUTPAY_INT,
            "balanceCutpay.money": balanceCutpay.items.deductMoney.val(),
            "balanceCutpay.comment": balanceCutpay.items.deductComment.val(),
        };

        com.post(api.balance.deductBalanceCutpay, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        balanceCutpay.modals.deductBalanceCutpayModal.modal("hide");
    });

    balanceCutpay.btns.createBtn.on("click", function() {

        if (com.validate('createModal')) {
            return false;
        }

        var options = {
            "balanceCutpay.name": balanceCutpay.items.name.val(),
            "balanceCutpay.type": constant.balance().balanceCutpay.TYPE_CUTPAY_INT,
            "balanceCutpay.atttype": balanceCutpay.items.atttype.val(),
            'balanceCutpay.belonger.userId': com.typeahead("belonger"),
            "balanceCutpay.money": balanceCutpay.items.money.val(),
            "balanceCutpay.comment": balanceCutpay.items.comment.val(),
        };

        com.post(api.balance.addBalanceCutpay, options, function(res) {

            com.showAlert(com.info, "添加成功");
            
            searcher.doSearch();

            balanceCutpay.modals.createModal.modal("hide");
        });
    });

    function managedrawing(v) {

        com.focusPage('#balanceDrawing').html("");

        com.post(api.balance.queryBalancePicture, {
            "balancePicture.pid": v.bcid,
            "balancePicture.type": 0
        }, function(data) {

            var balancePictures = data.balancePictures;

            if (balancePictures && balancePictures.length) {
                $.each(balancePictures, function(i, value) {

                    if (value.status == constant.balance().balancePicture.STATUS_YES_SHORT) {
                        appendGalleryElement("balanceDrawing", value);
                    }

                });
                com.popup4photos(com.focusPage("#balanceDrawing"));
            }
        }, null, false);

        balanceCutpay.drawingModal.modal("show");
    }

    function appendGalleryElement(galleryId, value, type) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.bpid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, value.name, null, type);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.balance.deleteBalancePicture, {
                "balancePicture.bpid": value.bpid
            }, function(res) {

                com.focusPage("#gallery_li" + value.bpid).remove();
            });
        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    function initUploadBtn(v) {

        com.uploadify("#balanceUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};

            options["balancePicture.bid"] = v.balance.bid;
            options["balancePicture.pid"] = v.bcid;
            options["balancePicture.name"] = data.strutsUploadsFileName;
            options["balancePicture.path"] = data.resUrl;
            options["balancePicture.type"] = 0;
            options["balancePicture.filesize"] = data.filesize;

            com.post(api.balance.addBalancePicture, options, function(res) {

                var balancePicture = res.balancePicture;

                appendGalleryElement("balanceDrawing", balancePicture);

                com.popup4photos("#balanceDrawing");

            });

            searcher.doSearch();
        });
    }
});
