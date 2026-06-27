$(function () {

    var aepair = {
        aid: null,
        items: {
            outlay: com.focusPage("#outlay")
        },
        modals: {
            updateAepairModal: com.focusPage("#updateAepairModal"),
            tranAepairModal: com.focusPage("#tranAepairModal")
        },
        updateSaveBtn: com.focusPage("#updateSaveBtn"),
        saveBtn: com.focusPage("#saveBtn"),
        type: null
    };

    aepair.updateSaveBtn.bindClick(updateFunction);
    aepair.saveBtn.bindClick(saveFunction);

    aepair.modals.updateAepairModal.on('hide.bs.modal', function (e) {
        com.cleanItems(aepair.items);
        com.clearValidator();
    });

    aepair.modals.tranAepairModal.on('hide.bs.modal', function (e) {
        com.cleanTypeahead('userName');
        com.clearValidator();
    });

    com.initTypeahead('userName', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": "0",
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value", null);


    var lineprops = (function() {

        return [{
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "updater.currentName",
            name: "操作人",
            prop: "updater.currentName",
            clazz: "grey"
        }, {
            field: "updateTime",
            name: "操作时间",
            prop: "updateTime",
            clazz: "green"
        }, {
            field: "repaier.currentName",
            name: "维修人",
            prop: "repaier.currentName",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.customer().aepair.status.keys[v.status]; },
            clazz: "red"
        }, {
            field: "onestate",
            name: "水",
            prop: function(v) { return constant.customer().aepair.oneState.keys[v.onestate]; },
            clazz: "red"
        }, {
            field: "twostate",
            name: "电",
            prop: function(v) { return constant.customer().aepair.twoState.keys[v.twostate]; },
            clazz: "red"
        }, {
            field: "thrstate",
            name: "瓦",
            prop: function(v) { return constant.customer().aepair.thrState.keys[v.thrstate]; },
            clazz: "red"
        }, {
            field: "forstate",
            name: "木",
            prop: function(v) { return constant.customer().aepair.forState.keys[v.forstate]; },
            clazz: "red"
        }, {
            field: "fivstate",
            name: "油",
            prop: function(v) { return constant.customer().aepair.fivState.keys[v.fivstate]; },
            clazz: "red"
        }, {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            send: {
                name: "发送",
                clazz: "btn-blue",
                handle: function(v) {

                    var option = {
                        "code": "1b0c4d577a692ccbea1020147d2d851e1db9f9055d204872a3c76c9edab27204",
                        "aepair.aid": v.aid
                    };
                    com.post(api.customer.sendAepair, option, function () {
                        com.showAlert(com.info, '发送成功');
                    });
                }
            },
            view: {
                name: "查看",
                clazz: "btn-yellow",
                handle: function(v) {

                    params.customer.aid = v.aid;
                    com.popup4page('#repairPopUp', api.index.repair.url, '维修单');
                }
            },
            pay: {
                name: "维修款",
                clazz: "btn-purple",
                handle: function(v) {

                    params.customer.aid = v.aid;
                    com.popup4page('#repairPayPopUp', api.index.repairPay.url, '维修款');
                }
            },
            update: {
                name: "更新",
                clazz: "btn-success",
                handle: function(v) {

                    aepair.aid = v.aid;
                    aepair.modals.updateAepairModal.modal("show");
                }
            },
            receive: {
                name: "领取",
                clazz: "btn-danger",
                handle: function(v) {

                    receiveFunction(v.aid);
                }
            },
            delive: {
                name: "分配",
                clazz: "btn-pink",
                handle: function(v) {

                    com.focusPage("#tranModal").html("分配报修信息");
                    aepair.aid = v.aid;
                    aepair.type = "delive";
                    aepair.modals.tranAepairModal.modal("show");
                }
            },
            tran: {
                name: "转交",
                clazz: "btn-warning",
                handle: function(v) {

                    com.focusPage("#tranModal").html("转交报修信息");
                    aepair.aid = v.aid;
                    aepair.type = null;
                    aepair.modals.tranAepairModal.modal("show");
                }
            },
            finish: {
                name: "完工",
                clazz: "btn-inverse",
                handle: function(v) {

                    finishFunction(v.aid);
                }
            },
            close: {
                name: "关闭",
                clazz: "btn-yellow",
                handle: function(v) {

                    closeFunction(v.aid);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condListData", "pagenationData", "resultListData", api.customer.pageAepair, null, ["customer-service-creater-name", "customer-service-updater-name", "customer-aepair-status"], "aepairPostData", null, false, null);
    searcher.line("comment", lineprops, linebtns).render();

    function updateFunction() {

        if (com.validate('form')) {
            return false;
        }

        var options = {};
        options["aepair.aid"] = aepair.aid;
        options["aepair.outlay"] = aepair.items.outlay.val();

        com.post(api.customer.updateAepair, options, function (res) {
            com.showAlert(com.info, '操作成功');
            aepair.modals.updateAepairModal.modal("hide");
            searcher.doSearch();
        });
    }

    function receiveFunction(aid) {

        com.showConfirm("确认要领取吗", function () {
            com.post(api.customer.receiveAepair, {"aepair.aid": aid}, function (res) {
                com.showAlert(com.info, '领取成功');
                searcher.doSearch();
            });
        });

    }

    function saveFunction() {

        if (com.validate('tranForm')) {
            return false;
        }

        var options = {
            "aepair.aid": aepair.aid,
            "aepair.repaier.userId": com.typeahead("#userName")
        };

        if (aepair.type == "delive") {
            com.post(api.customer.deliveAepair, options, function (res) {
                com.showAlert(com.info, '分配成功');
                aepair.modals.tranAepairModal.modal("hide");
                searcher.doSearch();
            });
        } else {
            com.post(api.customer.tranAepair, options, function (res) {
                com.showAlert(com.info, '转交成功');
                aepair.modals.tranAepairModal.modal("hide");
                searcher.doSearch();
            });
        }

    }

    function finishFunction(aid) {

        com.showConfirm("确认要完工吗", function () {
            com.post(api.customer.finishAepair, {"aepair.aid": aid}, function (res) {
                com.showAlert(com.info, '操作成功');
                searcher.doSearch();
            });
        });

    }

    function closeFunction(aid) {

        com.showConfirm("确认要关闭吗", function () {
            com.post(api.customer.closeAepair, {"aepair.aid": aid}, function (res) {
                com.showAlert(com.info, '关闭成功');
                searcher.doSearch();
            });
        });

    }
});