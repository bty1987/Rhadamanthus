jQuery(function($) {

    var balanceSelection = {

        bsid: null,
        btns: {
            createBalanceSelectionBtn: com.focusPage("#createBalanceSelectionBtn").on("click", saveData),
            withdrawBtn: com.focusPage("#withdrawBtn").on("click", updateData)
        },

        modals: {
            createBalanceSelectionModal: com.focusPage("#createBalanceSelectionModal"),
            renewal: com.focusPage("#renewal")
        },

        items: {
            name: com.focusPage("#balanceSelectionName"),
            brand: com.focusPage("#brand"),
            updateName: com.focusPage("#updata")
        },

        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        status: {},

        depage: params['urlLoadParams'].depage
    };

    var url = api.balance.pageBalanceSelection;

    if (balanceSelection.depage == "supplier") {
        url = api.balance.pageBalanceSelectionForSupplier;
    }

    com.initTypeahead("brand", api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.status": 0
    }, "brands", "bid", "name", null);

    var seacher = new Searcher();
    var history = balanceSelection.depage + "balanceSelectionPostData";

    seacher.base("bscondList", "bspagenation", "bsresultList", url);

    seacher.condition(["balance-selection-name", "balance-selection-status", "balance-selection-brand", "balance-selection-grade", "balance-selection-createTime", "balance-selection-creater", "balance-selection-lockTime", "balance-selection-balanceTime"]);

    seacher.button([{
        id: "createBalanceSelection",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus",
        show: function(v) {

            return (balanceSelection.depage == "material");
        }
    }, {
        id: "export",
        name: "导出",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    seacher.history(history);

    var lineprops = [{
        fieId: "brand.name",
        name: "品牌名",
        prop: "brand.name",
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.balance().balanceSelection.status.keys
    }, {
        fieId: "grade",
        name: "等级",
        prop: "grade",
        clazz: "red"
    }, {
        fieId: "income",
        name: "收入",
        prop: "income",
        clazz: "blue",
    }, {
        fieId: "cost",
        name: "成本",
        prop: "cost",
        clazz: "blue",
    }, {
        fieId: "payment",
        name: "应付",
        prop: "payment",
        clazz: "blue",
    }, {
        fieId: "profit",
        name: "利润",
        prop: "profit",
        clazz: "blue",
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "lockTime",
        name: "锁定时间",
        prop: "lockTime",
        clazz: "green"
    }, {
        field: "auditer",
        name: "待审人",
        prop: "auditer.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.auditer.userId);
        }
    }, {
        field: "auditTime",
        name: "待审时间",
        prop: "auditTime",
        clazz: "green"
    }, {
        field: "balancer",
        name: "审核人",
        prop: "balancer.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.balancer.userId);
        }
    }, {
        field: "balanceTime",
        name: "审核时间",
        prop: "balanceTime",
        clazz: "green"
    }];

    var linebtus = [{
        name: "扣款",
        clazz: "btn-danger",
        handle: function(v) {

            params.balance.bsid = v.bsid;

            params.balance = v.balance;
            params.balance.bid = v.balance.bid;
            params.balance.uid = v.balance.belonger.uid;

            com.popup4page("#stockRecordPopUp", api.index.balanceCutpayIndex.url, "结算扣款") && balanceSelection.depage != "supplier";

            return false;
        },
        show: function(v) {

            return (v.balance && v.balance.no != "0000000000");
        }
    }, {
        name: "汇总",
        clazz: "btn-purple",
        handle: function(v) {

            com.post(api.balance.amountBalanceSelection, {
                "balanceSelection.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "汇总成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSelection.STATUS_UNLOCK_INT);
        }
    }, {
        name: "明细",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance = v;
            params.balance.bsid = v.bsid;

            com.popup4page("#stockRecordPopUp", api.index.balanceSelectionItemIndex.url, "选材项");

            return false;
        }
    }, {
        name: "更新",
        clazz: "btn-info",
        handle: function(v) {

            balanceSelection.bsid = v.bsid;
            balanceSelection.items.updateName.val(v.name);
            balanceSelection.modals.renewal.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSelection.STATUS_INIT_INT) && (balanceSelection.depage == "material" || balanceSelection.depage == "supplier");
        }
    }, {
        name: "待审",
        clazz: "btn-inverse",
        handle: function(v) {

            var options = {
                "balanceSelection.bsid": v.bsid
            };

            com.post(api.balance.auditBalanceSelection, options, function() {

                com.showAlert(com.info, "操作成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSelection.STATUS_UNLOCK_INT) && (balanceSelection.depage == "supplyChain" || !balanceSelection.depage);
        }
    }, {
        name: "审核",
        clazz: "btn-danger",
        handle: function(v) {

            var options = {
                "balanceSelection.bsid": v.bsid,
                "balanceSelection.payment": v.grade == "A" ? v.income : v.payment
            };

            com.post(api.balance.balanceBalanceSelection, options, function() {

                com.showAlert(com.info, "审核成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSelection.STATUS_WAIT_INT) && (balanceSelection.depage == "audit" || !balanceSelection.depage);
        }
    }, {
        name: "驳回",
        clazz: "btn-inverse",
        handle: function(v) {

            var options = {
                "balanceSelection.bsid": v.bsid,
                "balanceSelection.status": v.status - 1
            };

            com.post(api.balance.unauditBalanceSelection, options, function() {

                com.showAlert(com.info, "操作成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return v.status == constant.balance().balanceSelection.STATUS_WAIT_INT && balanceSelection.depage == "audit";
        }
    }, {
        name: "拆分",
        clazz: "btn-yellow",
        handle: function(v) {

            com.showConfirm("确定将该结算选材平均拆分为两个？", function() {

                com.post(api.balance.splitBalanceSelection, {
                    "balanceSelection.bsid": v.bsid
                }, function() {

                    com.showAlert(com.info, "拆分成功");
                    seacher.doSearch();
                });
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSelection.STATUS_INIT_INT);
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.balance.deleteBalanceSelection, {
                "balanceSelection.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "删除成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSelection.STATUS_INIT_INT);
        }
    }, {
        name: "锁定",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.balance.lockBalanceSelection, {
                "balanceSelection.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "锁定成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSelection.STATUS_INIT_INT) && (balanceSelection.depage == "material" || balanceSelection.depage == "supplier" || !balanceSelection.depage);
        }
    }, {
        name: "解锁",
        clazz: "btn-inverse",
        handle: function(v) {

            com.post(api.balance.unlockBalanceSelection, {
                "balanceSelection.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "解锁成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSelection.STATUS_UNLOCK_INT) && (balanceSelection.depage != "supplier");
        }
    }, {
        name: "打印",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance.bsid = v.bsid;
            params.balance.type = 1;

            com.popup("明细表", api.index.balanceSelection2print.url, null, null, true);

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSelection.STATUS_INIT_INT);
        }
    }, {
        name: "记录",
        clazz: "btn-inverse",
        handle: function(v) {

            console.log(v.bsid);
            params.balance.bsid = v.bsid;
            params.balance.type = 1;
            com.popup4page("#stockRecordPopUp", api.index.balanceSelectionRecordIndex.url, "结算选材记录");

            return false;
        }
    }, {
        name: "图片",
        clazz: "btn-inverse",
        handle: function(v) {

            managedrawing(v);

            initUploadBtn(v);

            return false;
        }
    }, {
        name: "同步金蝶",
        clazz: "btn-warning",
        handle: function(v) {

            kingdee(v);
        },
        show: function(v) {

            return v.status == constant.balance().balanceSelection.STATUS_ENABLE_CHECK_INT;
        }
    }];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#createBalanceSelection').on("click", function() {

        balanceSelection.modals.createBalanceSelectionModal.modal("show");
    });

    com.focusPage('#export', '#bspagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]', "#bspagenation").text();

        if (total == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (total > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(url, $.extend({}, params[history], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [['名称', 'name'], ['品牌名', 'brand.name'], ['状态', 'status'], ['等级', 'grade'], ['收入', 'income'], ['成本', 'cost'], ['应付', 'payment'], ['利润', 'profit'], ['创建人', 'creater.userName'], ['创建时间', 'createTime'], ['锁定时间', 'lockTime'], ['待审人', 'auditer.userName'], ['待审时间', 'auditTime'], ['审核人', 'balancer.userName'], ['审核时间', 'balanceTime']],
                list: res.paging.data
            }, function(v) {

                v.status = constant.balance().balanceSelection.status.keys[v.status];
                v.lockTime = v.lockTime == null ? "" : v.lockTime;
                v.balancer.userName = v.balancer.userName == null ? "" : v.balancer.userName;
                v.auditer.userName = v.auditer.userName == null ? "" : v.auditer.userName;
                v.auditTime = v.auditTime == null ? "" : v.auditTime;
                v.balanceTime = v.balanceTime == null ? "" : v.balanceTime;
            });
        });
    });

    function saveData() {

        if (com.validate('createBalanceSelectionModal'))
            return false;

        var options = {
            "balanceSelection.name": balanceSelection.items.name.val(),
            "balanceSelection.brand.bid": com.typeahead("brand"),
            "balanceSelection.grade": $('input[name="grade"]:checked').val(),
        };

        com.post(api.balance.createBalanceSelection, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceSelection.modals.createBalanceSelectionModal.modal("hide");
    }

    function updateData() {

        if (com.validate('renewal'))
            return false;

        var options = {
            "balanceSelection.bsid": balanceSelection.bsid,
            "balanceSelection.name": balanceSelection.items.updateName.val(),
        };

        com.post(api.balance.updateBalanceSelection, options, function() {

            com.showAlert(com.info, "操作成功");

            seacher.doSearch();
        });

        balanceSelection.modals.renewal.modal("hide");
    }

    function managedrawing(v) {

        com.focusPage('#balanceDrawing').html("");

        com.post(api.balance.queryBalancePicture, {
            "balancePicture.pid": v.bsid,
            "balancePicture.type": 2
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

        balanceSelection.drawingModal.modal("show");
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
            options["balancePicture.pid"] = v.bsid;
            options["balancePicture.name"] = data.strutsUploadsFileName;
            options["balancePicture.path"] = data.resUrl;
            options["balancePicture.type"] = 2;
            options["balancePicture.filesize"] = data.filesize;
            com.post(api.balance.addBalancePicture, options, function(res) {

                var balancePicture = res.balancePicture;

                appendGalleryElement("balanceDrawing", balancePicture);

                com.popup4photos("#balanceDrawing");

            });

            searcher.doSearch();
        });
    }

    function kingdee(v) {

        var drganizationNo = "";
        var balanceSelections = {
            bsid: 0,
            creater: {
                userId: null
            },
            balanceTime: null,
            grade: null,
            brand: {
                kino: null,
                supplier: {
                    oldUserId: null
                }
            },
            name: null,
            payment: 0,
            income: 0,
            paymentOrg: null,
            items: []
        };

        // 单据编号/创建人/业务日期/币别/类型/核算类别/款项组织/结算组织/品牌/供应商/结算单号/代收服务费合计/代收合计
        com.post(api.balance.queryBalanceSelectionByBsid, {
            "balanceSelection.bsid": v.bsid
        }, function(res) {

            balanceSelections.bsid = res.balanceSelection.bsid;
            balanceSelections.creater.userId = res.balanceSelection.creater.userId;
            balanceSelections.balanceTime = res.balanceSelection.balanceTime;
            balanceSelections.grade = res.balanceSelection.grade;
            balanceSelections.brand.kino = res.balanceSelection.brand.kino;
            balanceSelections.brand.supplier.oldUserId = res.balanceSelection.brand.supplier != null ? res.balanceSelection.brand.supplier.oldUserId : "";
            balanceSelections.name = res.balanceSelection.name;
            balanceSelections.payment = res.balanceSelection.payment;
            balanceSelections.income = res.balanceSelection.income;
            balanceSelections.paymentOrg = params.company.srganization.no;
        }, null, false);

        com.post(api.balance.pageBalanceSelectionItem, {
            "paging.noPage": 1,
            "balanceSelection.bsid": v.bsid
        }, function(res) {

            $.each(res.paging.data, function(i, v) {

                var orderId = v.selectionItem.decoration.orderId;

                if (i == 0) {
                    com.post(api.decoration.queryDecorationForCommonByOrderId, {
                        "decoration.orderId": orderId
                    }, function(res) {

                        com.post(api.system.queryCompanyByCid, {
                            "company.cid": res.decoration.dompany
                        }, function(data) {

                            drganizationNo = data.company.drganization.no;
                        }, null, false);

                    }, null, false);
                }

                // 代收金额/服务费金额/客户/装修单号/销售单号/优惠券
                var item = {
                    salesRevenue: 0, // TODO
                    serviceMoney: 0, // TODO
                    orderId: orderId,
                    no: orderId,
                    coupon: 0, // 结算选材没有coupon
                    address: v.selectionItem.decoration.house.village.name + " " + v.selectionItem.decoration.house.houseNumber,
                    dorgNo: drganizationNo
                };

                balanceSelections.items.push(item);
            });

        }, null, false);

        kingdeeUtils.balance(balanceSelections);
    }
});
