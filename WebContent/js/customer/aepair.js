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


    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerOriginPage.getConfig("aepair");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "creater": {
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        },
        "createTime": {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        },
        "updater": {
            field: "updater.currentName",
            name: "操作人",
            prop: "updater.currentName",
            clazz: "grey"
        },
        "updateTime": {
            field: "updateTime",
            name: "操作时间",
            prop: "updateTime",
            clazz: "green"
        },
        "repaier": {
            field: "repaier.currentName",
            name: "维修人",
            prop: "repaier.currentName",
            clazz: "grey"
        },
        "status": {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.customer().aepair.status.keys[v.status]; },
            clazz: "red"
        },
        "onestate": {
            field: "onestate",
            name: "水",
            prop: function(v) { return constant.customer().aepair.oneState.keys[v.onestate]; },
            clazz: "red"
        },
        "twostate": {
            field: "twostate",
            name: "电",
            prop: function(v) { return constant.customer().aepair.twoState.keys[v.twostate]; },
            clazz: "red"
        },
        "thrstate": {
            field: "thrstate",
            name: "瓦",
            prop: function(v) { return constant.customer().aepair.thrState.keys[v.thrstate]; },
            clazz: "red"
        },
        "forstate": {
            field: "forstate",
            name: "木",
            prop: function(v) { return constant.customer().aepair.forState.keys[v.forstate]; },
            clazz: "red"
        },
        "fivstate": {
            field: "fivstate",
            name: "油",
            prop: function(v) { return constant.customer().aepair.fivState.keys[v.fivstate]; },
            clazz: "red"
        },
        "comment": {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function() {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
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
                },
                show: function() { return btnVisible("send"); }
            },
            view: {
                name: "查看",
                clazz: "btn-yellow",
                handle: function(v) {

                    params.customer.aid = v.aid;
                    com.popup4page('#repairPopUp', api.index.repair.url, '维修单');
                },
                show: function() { return btnVisible("view"); }
            },
            pay: {
                name: "维修款",
                clazz: "btn-purple",
                handle: function(v) {

                    params.customer.aid = v.aid;
                    com.popup4page('#repairPayPopUp', api.index.repairPay.url, '维修款');
                },
                show: function() { return btnVisible("pay"); }
            },
            update: {
                name: "更新",
                clazz: "btn-success",
                handle: function(v) {

                    aepair.aid = v.aid;
                    aepair.modals.updateAepairModal.modal("show");
                },
                show: function() { return btnVisible("update"); }
            },
            receive: {
                name: "领取",
                clazz: "btn-danger",
                handle: function(v) {

                    receiveFunction(v.aid);
                },
                show: function() { return btnVisible("receive"); }
            },
            delive: {
                name: "分配",
                clazz: "btn-pink",
                handle: function(v) {

                    com.focusPage("#tranModal").html("分配报修信息");
                    aepair.aid = v.aid;
                    aepair.type = "delive";
                    aepair.modals.tranAepairModal.modal("show");
                },
                show: function() { return btnVisible("delive"); }
            },
            tran: {
                name: "转交",
                clazz: "btn-warning",
                handle: function(v) {

                    com.focusPage("#tranModal").html("转交报修信息");
                    aepair.aid = v.aid;
                    aepair.type = null;
                    aepair.modals.tranAepairModal.modal("show");
                },
                show: function() { return btnVisible("tran"); }
            },
            finish: {
                name: "完工",
                clazz: "btn-inverse",
                handle: function(v) {

                    finishFunction(v.aid);
                },
                show: function() { return btnVisible("finish"); }
            },
            close: {
                name: "关闭",
                clazz: "btn-yellow",
                handle: function(v) {

                    closeFunction(v.aid);
                },
                show: function() { return btnVisible("close"); }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condListData", "pagenationData", "resultListData", pageConfig.apiPage || api.customer.pageAepair, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-service-creater-name", "customer-service-updater-name", "customer-aepair-status"], "aepairPostData", null, false, null);
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