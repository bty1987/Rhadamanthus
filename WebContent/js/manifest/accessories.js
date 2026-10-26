$(function() {

    var accessories = {
        status: {},
        type: {},
        cnid: {},
        schedule: {},
        pageType: params.urlLoadParams.type,
        aid: null, // 分配厂商/结算弹窗当前操作单
        modals: {
            bindAccessoriesModal: com.focusPage("#bindAccessoriesModal"),
            balanceAccessoriesModal: com.focusPage("#balanceAccessoriesModal"),
        },
        items: {
            supplier: com.focusPage("#supplier", "#bindAccessoriesModal"),
            balanceInput: com.focusPage("#balanceInput", "#balanceAccessoriesModal"),
        },
    };
    accessories.type = constant.inventory().accessories.type.keys;
    accessories.status = constant.inventory().accessories.status.keys;
    accessories.cnid = constant.data().construction.node.keys;
    var conditions = ['inventory-accessories-orderId', 'inventory-accessories-no', 'inventory-accessories-createrName', 'inventory-accessories-approverName', 'inventory-accessories-createTime', 'inventory-accessories-approverTime', 'inventory-accessories-stauts', 'inventory-accessories-type'];

    // 厂商视角固定看自己的单(登录人=厂商), 授权按公司 pageBtn 自行开放(拍板②)
    var url = api.inventory.pageAccessories;
    if (accessories.pageType == "supplier") {
        url = api.inventory.pageAccessoriesForSupplier;
    }

    var lineprops = [{
        fieId: "no",
        name: "辅料单号",
        prop: "no",
        clazz: "blue"
    }, {
        fieId: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "approverTime",
        name: "审批人",
        prop: "approver.userName",
        clazz: "grey"
    }, {
        field: "approverTime",
        name: "审批时间",
        prop: "approverTime",
        clazz: "green"
    }, {
        field: "total",
        name: "总价",
        prop: "total",
        clazz: "green"
    }, {
        field: "supplier",
        name: "厂商",
        prop: "supplier.userName",
        clazz: "grey"
    }, {
        field: "charge",
        name: "费用额",
        prop: "charge",
        clazz: "green"
    }, {
        field: "balance",
        name: "结算额",
        prop: "balance",
        clazz: "green"
    }, {
        field: "cnid",
        name: "施工环节",
        prop: "cnid",
        clazz: "red",
        dataset: constant.data().construction.node.keys,
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.inventory().accessories.status.keys,
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.inventory().accessories.type.keys,
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];


    var searcher = new Searcher();
    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(conditions);
    searcher.history("accessoriesPostData");
    var linebtns = [{
        name: "查看",
        clazz: "btn-info",
        handle: function (v) {
            if (v.status == constant.inventory().accessories.STATUS_INIT_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }
            params.manifest.aid = v.aid;

            com.popup4page('#layerPopUp', "views/manifest/accessories4view.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_RETURN_INT || v.status == constant.inventory().accessories.STATUS_DELIVER_INT || (accessories.pageType == "advance" && v.status == constant.inventory().accessories.STATUS_BATCHOUT_INT))
        }
    }, {
        name: "预出",
        clazz: "btn-info",
        handle: function (v) {
            if (v.status != 0) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            com.showConfirm("是否确认预出辅料单", function() {

                com.post(api.inventory.preoutAccessories, {
                    "accessories.aid": v.aid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function (v) {
            return (accessories.pageType == "advance" && v.status == constant.inventory().accessories.STATUS_INIT_INT)
        }
    }, {
        name: "出货",
        clazz: "btn-yellow",
        handle: function (v) {
            if (v.status != constant.inventory().accessories.STATUS_INIT_INT && v.status != constant.inventory().accessories.STATUS_ADVANCE_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            params.manifest.aid = v.aid;
            params.manifest.orderId = v.orderId;

            com.popup4page('#layerPopUp', "views/manifest/accessories2out.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "advance" && (v.status == constant.inventory().accessories.STATUS_INIT_INT || v.status == constant.inventory().accessories.STATUS_ADVANCE_INT))
        }
    }, {
        name: "修改",
        clazz: "btn-danger",
        handle: function (v) {
            if (v.status != constant.inventory().accessories.STATUS_INIT_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            params.manifest.aid = v.aid;
            params.manifest.type = v.type;
            params.manifest.orderId = v.orderId;

            com.popup4page('#layerPopUp', "views/manifest/accessories2edit.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (v.status != constant.inventory().accessories.STATUS_DELIVER_INT)
        }
    }, {
        name: "拒绝",
        clazz: "btn-success",
        handle: function (v) {
            if (v.status != 0) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            com.showConfirm("是否确认拒绝辅料单", function() {

                com.post(api.inventory.refuseAccessories, {
                    "accessories.aid": v.aid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_INIT_INT)
        }
    }, {
        name: "退货",
        clazz: "btn-pink",
        handle: function (v) {
            params.manifest.aid = v.aid;
            params.manifest.accessories = v;

            com.popup4page('#layerPopUp', "views/manifest/accessories4refund.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_DELIVER_INT ||(accessories.pageType != "advance" && v.status == constant.inventory().accessories.STATUS_DELIVER_INT) )
        }
    }, {
        name: "打印",
        clazz: "btn-warning",
        handle: function (v) {
            params.manifest.accessories = v;
            printAccessoriesItem(v.aid, v.no);
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_ADVANCE_INT || v.status == constant.inventory().accessories.STATUS_BATCHOUT_INT || v.status == constant.inventory().accessories.STATUS_DELIVER_INT)
        }
    }, {
        name: "到货",
        clazz: "btn-pink",
        handle: function (v) {
            if (v.status != constant.inventory().accessories.STATUS_BATCHOUT_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }
            com.showConfirm("确认到货?", function() {

                com.post(api.inventory.deliveAccessories, {
                    "accessories.aid": v.aid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "advance" && v.status == constant.inventory().accessories.STATUS_BATCHOUT_INT)
        }
    }, {
        name: "分配厂商",
        clazz: "btn-info",
        handle: function (v) {
            if (v.status != 0 && v.status != 1 && v.status != 2) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }
            accessories.aid = v.aid;
            accessories.modals.bindAccessoriesModal.modal("show");
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "supplier" && (v.status == 0 || v.status == 1 || v.status == 2))
        }
    }, {
        name: "结算",
        clazz: "btn-success",
        handle: function (v) {
            if (v.status != constant.inventory().accessories.STATUS_DELIVER_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }
            accessories.aid = v.aid;
            accessories.modals.balanceAccessoriesModal.modal("show");
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "supplier" && v.status == constant.inventory().accessories.STATUS_DELIVER_INT)
        }
    }, {
        name: "审核",
        clazz: "btn-primary",
        handle: function (v) {
            com.showConfirm("是否确认审核辅料单", function() {

                com.post(api.inventory.auditAccessories, {
                    "accessories.aid": v.aid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_ADVANCE_INT && v.type == constant.inventory().accessories.TYPE_POST_INT)
        }
    }, {
        name: "出库-金蝶",
        clazz: "btn-inverse",
        handle: function (v) {
            kingdeeUtils.accessories(v.aid, 7, "SalesOutStock");
            return false;
        }
    }, {
        name: "入库-金蝶",
        clazz: "btn-purple",
        handle: function (v) {
            kingdeeUtils.accessories(v.aid, 8, "SalesReturnStock");
            return false;
        }
    }];
    searcher.line("no", lineprops, linebtns).render();

    // 厂商选人(照外辅 occcessories.js 同款)
    com.initTypeahead('supplier', api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "user.status": 0
    }, "suppliers", "uid", "userName", null);

    // 分配厂商提交
    com.focusPage("#saveBindAccessoriesBtn").click(function() {

        com.post(api.inventory.bindAccessories, {
            "accessories.aid": accessories.aid,
            "accessories.supplier.uid": com.typeahead(accessories.items.supplier)
        }, function() {

            com.showAlert(com.info, "操作成功");
            accessories.modals.bindAccessoriesModal.modal("hide");
            searcher.doSearch();
        });
    });

    // 结算提交(金额元直传, api tranargs ×1000 折厘)
    com.focusPage("#saveBalanceAccessoriesBtn").click(function() {

        if (com.validate('balanceAccessoriesModal', 'right')) {
            return false;
        }

        com.post(api.inventory.balanceAccessories, {
            "accessories.aid": accessories.aid,
            "accessories.balance": accessories.items.balanceInput.val() || 0
        }, function() {

            com.showAlert(com.info, "操作成功");
            accessories.modals.balanceAccessoriesModal.modal("hide");
            searcher.doSearch();
        });
    });

    accessories.modals.bindAccessoriesModal.on("hide.bs.modal", function(e) {
        accessories.items.supplier.val('');
    });

    accessories.modals.balanceAccessoriesModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        accessories.items.balanceInput.val('');
    });

    // 打印货单项
    function printAccessoriesItem(aid, no) {

        com.popup4frame("辅料单号" + no, api.index.accessoriesPrintIndex.url, function() {

            parent.layer.getFrameIndex(window.name);
            searcher.doSearch();
        }, null, function(layero) {

            com.post(api.inventory.updateAccessoriesForPrint, {
                "accessories.aid": aid
            }, function(res) {

                layero.find("iframe").contents().find("#printNum").text("打印次数:" + res.accessories.printnum)
            }, null, false)
        });
    }
});
