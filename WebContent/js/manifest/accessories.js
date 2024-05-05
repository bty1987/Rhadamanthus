$(function() {

    var accessories = {
        status: {},
        type: {},
        cnid: {},
        schedule: {},
        pageType: params.urlLoadParams.type,
    };
    accessories.type = constant.inventory().accessories.type.keys;
    accessories.status = constant.inventory().accessories.status.keys;
    accessories.cnid = constant.data().construction.node.keys;
    var conditions = ['inventory-accessories-orderId', 'inventory-accessories-no', 'inventory-accessories-createrName', 'inventory-accessories-approverName', 'inventory-accessories-createTime', 'inventory-accessories-approverTime', 'inventory-accessories-stauts', 'inventory-accessories-type'];

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
    }];


    var searcher = new Searcher();
    searcher.base("condList", "pagenation", "resultList", api.inventory.pageAccessories);
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
        name: "定额",
        clazz: "btn-pink",
        handle: function (v) {
            params.quotation.orderId = v.orderId;
            com.popup4page('#layerPopUp', "views/manifest/quotaItem.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "advance" && v.status == constant.inventory().accessories.STATUS_BATCHOUT_INT)
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
    },];
    searcher.line("no", lineprops, linebtns).render();

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
