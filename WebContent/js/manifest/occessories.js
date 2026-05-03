$(function() {

    var occessories = {
        oid: null,
        number: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            cancelBtn: com.focusPage("#cancelBtn"),
            callBtn: com.focusPage("#callBtn"),
            balanceSubmitBtn: com.focusPage("#balanceSubmitBtn").on("click", submitBalance),
            remarkSubmitBtn: com.focusPage("#remarkSubmitBtn").on("click", submitRemark),
        },

        items: {

            supplier: com.focusPage("#supplier", "#bindOccessoriesModal"),
            rate: com.focusPage('#rate', "#finishModal"),
            remake: com.focusPage('#remake', "#finishModal"),
            vbalanceInput: com.focusPage("#vbalanceInput", "#balanceModal"),
            rchargeInput: com.focusPage("#rchargeInput", "#balanceModal"),
            balanceNo: com.focusPage("#balanceNo", "#balanceModal"),
            remarkInput: com.focusPage("#remarkInput", "#remarkModal"),
        },

        modals: {
            bindOccessoriesModal: com.focusPage("#bindOccessoriesModal"),
            finishModal: com.focusPage("#finishModal"),
            balanceModal: com.focusPage("#balanceModal"),
            remarkModal: com.focusPage("#remarkModal"),
        },
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),
        status: {},
        isEnter: {},
        isLift: {},

        pageType: params.urlLoadParams.type,
    };

    com.post(api.ds.manifest, {}, function(res) {

        occessories.status = res.occessoriesStatus.split("key", "value");
        occessories.isEnter = res.occessoriesisEnter.split("key", "value");
        occessories.isLift = res.occessoriesisLift.split("key", "value");
        occessories.isExceed = res.occessoriesisExceed.split("key", "value");
        occessories.isAttic = res.occessoriesisAttic.split("key", "value");
        occessories.loadFloor = res.occessoriesloadFloor.split("key", "value");
    }, null, false);

    var url = api.inventory.pageOccessories;
    var conditions = ['inventory-accessories-orderId', 'inventory-occessories-no', 'inventory-accessories-createrName', 'inventory-occessories-status', 'inventory-occessories-isEnter', 'inventory-occessories-isLift', 'inventory-accessories-createTime', ];
    var options = {};

    if (occessories.pageType == "supplier") {
        url = api.inventory.pageOccessoriesForSupplier;
        options = $.extend({}, options, {});
    } else if (occessories.pageType == "delive") {
        options = $.extend({}, options, {
            "occessories.status": 2
        });
        conditions = conditions.concat(['inventory-accessories-deliveTime']);
    } else if (occessories.pageType == "receive") {
        options = $.extend({}, options, {
            "occessories.status": 3
        });
        conditions = conditions.concat(['inventory-accessories-deliveTime', 'inventory-accessories-receiveTime']);
    } else if (occessories.pageType == "balance") {
        options = $.extend({}, options, {
            "occessories.status": 4
        });
        conditions = conditions.concat(['inventory-accessories-deliveTime', 'inventory-accessories-receiveTime', 'inventory-accessories-balanceTime']);
    } else if (occessories.pageType == "bind") {
        options = $.extend({}, options, {
            "occessories.status": 1
        });
    } else {
        options = $.extend({}, options, {
            "occessories.status": 0
        });
    }

    occessories.modals.bindOccessoriesModal.on("hide.bs.modal", function(e) {

        com.cleanItems(occessories.items);
    });

    occessories.modals.finishModal.on("hide.bs.modal", function(e) {

        com.cleanItems(occessories.items);
        com.focusPage(".occessories").remove();
        searcher.doSearch();
    });

    occessories.modals.balanceModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        occessories.items.vbalanceInput.val('');
        occessories.items.rchargeInput.val('');
        occessories.items.balanceNo.text('');
    });

    occessories.modals.remarkModal.on("hide.bs.modal", function(e) {
        occessories.items.remarkInput.val('');
    });

    com.initTypeahead('supplier', api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "user.status": 0
    }, "suppliers", "uid", "userName", null);

    var lineprops = [{
        type: "checkbox",
        field: "oid",
        name: "oids",
        prop: "oid",
        show: function(v) {
            return occessories.pageType == "receive" && v.status == 3;
        }
    }, {
        fieId: "no",
        name: "外辅单号",
        prop: "no",
        clazz: "blue"
    }, {
        fieId: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue"
    }, {
        field: "village",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "supervisor",
        name: "监理",
        prop: "supervisor.currentName",
        clazz: "grey"
    }, {
        field: "supplier",
        name: "厂商",
        prop: "supplier.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "deliveTime",
        name: "送货时间",
        prop: "deliveTime",
        clazz: "green",
        show: function(v) {

            return [2, 3, 4].indexOf(v.status) != -1;
        }
    }, {
        field: "receiveTime",
        name: "到货时间",
        prop: "receiveTime",
        clazz: "green",
        show: function(v) {

            return [3, 4].indexOf(v.status) != -1;
        }
    }, {
        field: "balanceTime",
        name: "结算时间",
        prop: "balanceTime",
        clazz: "green",
        show: function(v) {

            return [4].indexOf(v.status) != -1;
        }
    }, {
        field: "total",
        name: "总额",
        prop: "total",
        clazz: "blue",
        dataset: occessories.total
    }, {
        field: "charge",
        name: "费用额",
        prop: function(v) {

            // charge 字段单位是厘，需要除以 1000 转换为元
            var charge = v.charge || 0;
            return charge;
        },
        clazz: "blue"
    }, {
        field: "rcharge",
        name: "结算费用额",
        prop: function(v) {

            // charge 字段单位是厘，需要除以 1000 转换为元
            var charge = v.rcharge || 0;
            return charge;
        },
        clazz: "blue"
    }, {
        field: "rbalance",
        name: "材料额",
        prop: "rbalance",
        clazz: "blue"
    }, {
        field: "vbalance",
        name: "结算材料额",
        prop: "vbalance",
        clazz: "blue"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: occessories.status
    }, {
        field: "isEnter",
        name: "可进园区",
        prop: "isEnter",
        clazz: "red",
        dataset: occessories.isEnter
    }, {
        field: "isLift",
        name: "有无电梯",
        prop: "isLift",
        clazz: "red",
        dataset: occessories.isLift
    }, {
        field: "isExceed",
        name: "有无超阶",
        prop: "isExceed",
        clazz: "red",
        dataset: occessories.isExceed
    }, {
        field: "isAttic",
        name: "有无阁楼",
        prop: "isAttic",
        clazz: "red",
        dataset: occessories.isAttic
    }, {
        field: "loadFloor",
        name: "上料楼层",
        prop: "loadFloor",
        clazz: "red",
        dataset: occessories.loadFloor
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }, {
        field: "content",
        name: "说明",
        prop: "content",
        clazz: "grey"
    }, {
        field: "rate",
        name: "评分",
        prop: "rate",
        clazz: "grey"
    }, {
        field: "remake",
        name: "评价",
        prop: "remake",
        clazz: "grey"
    }, {
        field: "remark",
        name: "备注",
        prop: "remark",
        clazz: "grey"
    }, ];

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", url);

    searcher.condition(conditions);
    searcher.history("accessoriesPostData");
    searcher.param(options);

    var _btns = [];

    if (occessories.pageType == "receive") {

        var $checkAllBtn = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checkAllBtn);
        $('<span></span>').text('全选').appendTo($checkAllBtn);

        var $batchBalanceBtn = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($batchBalanceBtn);
        $('<span></span>').text('批量结算').appendTo($batchBalanceBtn);

        $checkAllBtn.on("click", function() {
            if (com.focusPage('.searcher-checkbox', "#resultList").prop('checked')) {
                com.focusPage('.searcher-checkbox', "#resultList").removeAttr('checked').prop('checked', false);
            } else {
                com.focusPage('.searcher-checkbox', "#resultList").attr('checked', true).prop('checked', true);
            }
        });

        $batchBalanceBtn.on("click", function() {
            batchConfirmBalance();
        });

        _btns = [$checkAllBtn, $batchBalanceBtn];
    }

    searcher.button(function() { return _btns; });

    var linebtns = [{
        name: "到货",
        clazz: "btn-info",
        handle: function(v) {

            if (v.status != 2) {
                com.showAlert(com.warning, "外辅单状态不可操作");
                return false;
            }

            var options = {
                "occessories.oid": v.oid,
                "occessoriesItems[0].oiid": 1,
                "occessoriesItems[0].recnum": 0
            };

            com.post(api.inventory.receiveOccessories, options, function(data) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return occessories.pageType == "delive" && v.status == 2;
        }
    }, {
        name: "送货",
        clazz: "btn-info",
        handle: function(v) {

            params.manifest.status = v.status;
            params.manifest.oid = v.oid;
            params.manifest.isExceed = v.isExceed;

            com.popup4page('#layerPopUp', "views/manifest/occessories4view.html", "外辅单 : " + v.no, null, function() {

                searcher.doSearch();
            });
            return false;
        },
        show: function(v) {

            return v.status == 1;
        }
    }, {
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            if (v.status != 0) {
                com.showAlert(com.warning, "外辅单状态不可操作");
                return false;
            }

            params.manifest.oid = v.oid;
            params.manifest.orderId = v.orderId;

            com.popup4page('#layerPopUp', "views/manifest/occessories2edit.html", "外辅单 : " + v.no);
            return false;
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "填写结算额",
        clazz: "btn-danger",
        handle: function(v) {

            if (v.status != 3) {
                com.showAlert(com.warning, "外辅单状态不可操作");
                return false;
            }

            occessories.oid = v.oid;
            occessories.items.balanceNo.text(v.no);

            // 设置默认值
            occessories.items.vbalanceInput.val(v.vbalance || '');
            occessories.items.rchargeInput.val(v.rcharge || '');

            occessories.modals.balanceModal.modal("show");
            return false;
        },
        show: function(v) {

            return occessories.pageType == "receive" && v.status == 3;
        }
    }, {
        name: "确认结算",
        clazz: "btn-inverse",
        handle: function(v) {

            if (v.status != 3) {
                com.showAlert(com.warning, "外辅单状态不可操作");
                return false;
            }

            confirmBalance(v);
            return false;
        },
        show: function(v) {

            return occessories.pageType == "receive" && v.status == 3;
        }
    }, {
        name: "驳回",
        clazz: "btn-warning",
        handle: function(v) {

            if (v.status != 4) {
                com.showAlert(com.warning, "外辅单状态不可操作");
                return false;
            }

            com.showConfirm("确定要驳回外辅单 " + v.no + " 的结算信息吗？", function() {

                var options = {
                    "occessories.oid": v.oid
                };

                com.post(api.inventory.rejectOccessories, options, function(res) {

                    com.showAlert(com.info, "驳回成功，可重新结算");
                    searcher.doSearch();
                });
            });

            return false;
        },
        show: function(v) {

            return occessories.pageType == "balance" && v.status == 4;
        }
    }, {
        name: "分配",
        clazz: "btn-success",
        handle: function(v) {

            occessories.oid = v.oid;
            occessories.modals.bindOccessoriesModal.modal("show");

            return false;
        },
        show: function(v) {

            return v.status == 0 || (occessories.pageType == "bind" && v.status == 1);
        }
    }, {
        name: "完成",
        clazz: "btn-pink",
        handle: function(v) {

            finish(v.oid);
        },
        show: function(v) {

            return v.status == 4 || (occessories.pageType == "balance");
        }
    }, {
        name: "查看",
        clazz: "btn-info",
        handle: function(v) {

            params.manifest.oid = v.oid;
            params.manifest.isExceed = v.isExceed;
            com.popup4page('#layerPopUp', "views/manifest/occessories4view.html", "外辅单 : " + v.no);

            return false;
        },
        show: function(v) {

            return true;
        }
    }, {
        name: "评分",
        clazz: "btn-inverse",
        handle: function(v) {

            occessories.oid = v.oid;
            occessories.items.remake.val(v.remake);
            rate(v);

            occessories.modals.finishModal.modal("show");
            return false;
        }
    }, {
        name: "费用",
        clazz: "btn-primary",
        handle: function(v) {

            params.manifest.oid = v.oid;

            com.popup4page('#layerPopUp', "views/manifest/occessoriesCost.html", "费用 : " + v.no);

            return false;
        },
        show: function(v) {

            return true;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            var options = {
                "occessories.oid": v.oid,
            };

            com.post(api.inventory.deleteOccessories, options, function(data) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "打印",
        clazz: "btn-warning",
        handle: function(v) {

            printPayment(v.decoration.orderId, v.oid, v);
            return false;
        },
    }, {
        name: "图片",
        clazz: "btn-primary",
        handle: function(v) {

            managedrawing(v);
            initUploadBtn(v);
        }
    }, {
        name: "备注",
        clazz: "btn-success",
        handle: function(v) {

            occessories.oid = v.oid;
            occessories.items.remarkInput.val(v.remark || '');
            occessories.modals.remarkModal.modal("show");
            return false;
        }
    }, ];

    searcher.line("no", lineprops, linebtns).render();

    function managedrawing(v) {

        com.focusPage('#inventoryDrawing').html("");

        com.post(api.inventory.queryInventoryDrawing, {
            "inventoryDrawing.sid": v.oid,
            "inventoryDrawing.atttype": 0
        }, function(data) {

            var occessoriesPictures = data.inventoryDrawings;
            if (occessoriesPictures && occessoriesPictures.length) {
                $.each(occessoriesPictures, function(i, value) {

                    if (value.status == 0) {
                        appendGalleryElement("inventoryDrawing", value);
                    }
                });
                com.popup4photos(com.focusPage("#inventoryDrawing"));
            }
        }, null, false);

        occessories.drawingModal.modal("show");
    }

    function rate(v) {

        var ratyGroupDiv = $('<div class="occessories">').appendTo(occessories.items.rate);
        var ratyDiv = $('<div></div>').attr("id", "raty-" + v.oid).appendTo(ratyGroupDiv);

        setWorkerRaty("#raty-" + v.oid, v.rate);
        com.focusPage("#finishBtn").unbind("click");

        com.focusPage("#finishBtn").click(function() {

            var rate = parseInt(com.focusPage("#raty-" + v.oid + "-score").val());
            var options = {};
            options["occessories.rate"] = v.rate;
            options["occessories.oid"] = v.oid;
            options["occessories.rate"] = rate;
            options["occessories.remake"] = occessories.items.remake.val();
            com.post(api.inventory.rateOccessories, options, function(res) {

                com.showAlert(com.info, "操作成功");
                occessories.modals.finishModal.modal("hide");
            });
        });

        return false;
    }

    function setWorkerRaty(id, raty) {

        com.focusPage(id).raty({
            path: './assets/altogether/images/',
            start: raty,
            number: 10,
            name: ""
        });
    }

    function initUploadBtn(v) {

        com.uploadify("#salesUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};
            options["inventoryDrawing.sid"] = v.oid;
            options["inventoryDrawing.name"] = data.strutsUploadsFileName;
            options["inventoryDrawing.path"] = data.resUrl;
            options["inventoryDrawing.type"] = 0;
            options["inventoryDrawing.atttype"] = 0;
            com.post(api.inventory.addInventoryDrawing, options, function(res) {

                var salesPicture = res.inventoryDrawing;

                appendGalleryElement("inventoryDrawing", salesPicture);

                com.popup4photos("#inventoryDrawing");

            });
            searcher.doSearch();
        });
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.idid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, value.name, null, 0);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.inventory.deleteInventoryDrawing, {
                "inventoryDrawing.idid": value.idid
            }, function(res) {

                com.focusPage("#gallery_li" + value.idid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    function saveData() {

        if (com.validate('bindOccessoriesModal'))
            return false;

        var options = {
            'occessories.oid': occessories.oid,
            'occessories.supplier.uid': com.typeahead(occessories.items.supplier),
        };

        com.post(api.inventory.bindOccessories, options, function(res) {

            com.showAlert(com.info, "操作成功");
            occessories.modals.bindOccessoriesModal.modal("hide");
            searcher.doSearch();
        });
    }

    function printPayment(orderId, oid, v) {

        params.manifest.occessories = v;

        com.popup("外购辅料单: " + v.no, api.index.occessoriesPrintIndex.url, null, null, true);
    }

    function finish(oid) {

        var options = {
            "occessories.oid": oid,
        };
        com.post(api.inventory.finishOccessories, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function submitBalance() {

        if (com.validate('balanceModal')) {
            return false;
        }

        var options = {
            "occessories.oid": occessories.oid,
            "occessories.vbalance": occessories.items.vbalanceInput.val(),
            "occessories.rcharge": occessories.items.rchargeInput.val()
        };

        com.post(api.inventory.updateOccessoriesForBalance, options, function(res) {

            com.showAlert(com.info, "结算额更新成功");
            occessories.modals.balanceModal.modal("hide");
            searcher.doSearch();
        });
    }

    function submitRemark() {

        var options = {
            "occessories.oid": occessories.oid,
            "occessories.remark": occessories.items.remarkInput.val()
        };

        com.post(api.inventory.updateOccessoriesForRemark, options, function(res) {

            com.showAlert(com.info, "备注保存成功");
            occessories.modals.remarkModal.modal("hide");
            searcher.doSearch();
        });
    }

    function confirmBalance(v) {

        com.showConfirm("确定要确认结算外辅单 " + v.no + " 吗？", function() {

            var options = {
                "occessories.oid": v.oid
            };

            com.post(api.inventory.balanceOccessories, options, function(res) {

                com.showAlert(com.info, "结算确认成功");
                searcher.doSearch();
            });
        });
    }

    function batchConfirmBalance() {

        var inputs = searcher.checks();

        if (!inputs.length) {
            com.showAlert(com.warning, "请选择需要结算的外辅单");
            return false;
        }

        var options = {};

        $.each(inputs, function(i) {

            var oid = $(inputs[i]).val();
            options["occessoriess[" + i + "].oid"] = oid;
        });

        com.showConfirm("确定要批量结算选中的 " + inputs.length + " 条外辅单吗？", function() {

            com.post(api.inventory.batchBalanceOccessories, options, function(res) {

                com.showAlert(com.info, "批量结算成功");
                searcher.doSearch();
            });
        });
    }

});