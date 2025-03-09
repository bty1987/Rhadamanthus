$(function() {

    var customerUserRule = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addCustomerUserRuleModal: com.focusPage("#addCustomerUserRuleModal")
        },

        items: {
            user: com.focusPage("#user", "#customerUserRule"),
            period: com.focusPage("#period", "#customerUserRule"),
            measureNum: com.focusPage("#measureNum", "#customerUserRule"),
            contractNum: com.focusPage("#contractNum", "#customerUserRule"),
            contractPrice: com.focusPage("#contractPrice", "#customerUserRule"),
            materialPrice: com.focusPage("#materialPrice", "#customerUserRule"),
            designPrice: com.focusPage("#designPrice", "#customerUserRule"),
            predisPrice: com.focusPage("#predisPrice", "#customerUserRule"),
            chance: com.focusPage("#chance", "#customerUserRule"),
            surplus: com.focusPage("#surplus", "#customerUserRule"),
        },

        currentCurid: null,
        status: constant.customer().customerUserRule.status.keys,
        weightInfo: [{
            "key": "签单转化",
            "value": 0.5
        }, {
            "key": "主基比例",
            "value": 0.3
        }, {
            "key": "签单额",
            "value": 0.2
        }, {
            "key": "设计费",
            "value": 0.2
        }],
        customerUserRuleInfo: [{
            "key": "保底资源数(月)",
            "value": 600
        }, {
            "key": "个人资源数(月)",
            "value": 2
        }, {
            "key": "轮询资源数",
            "value": 100
        }, {
            "key": "人员数",
            "value": 120
        }],
        depage: params['urlLoadParams'].depage
    };

    customerUserRule.modals.addCustomerUserRuleModal.on("hide.bs.modal", function(a) {

        com.cleanItems(customerUserRule.items);
        com.clearValidator();

        customerUserRule.items.user.removeAttr("disabled");
        customerUserRule.currentCurid = null;
    });

    com.initTypeahead('user', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);

    // queryInfo();
    drawInfo("customerUserRuleInfo", "资源", "header-color-orange", customerUserRule.customerUserRuleInfo);
    drawInfo("weightInfo", "权重", "header-color-green", customerUserRule.weightInfo);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerUserRule);

    searcher.condition(["customer-customerUserRule-createTime", "customer-customerUserRule-finishTime", "customer-customerUserRule-user", "customer-customerUserRule-creater", "customer-customerUserRule-status"]);

    var extraParams = {
        "customerUserRule.user.userId": params.userInfo.user.userId
    };

    if (customerUserRule.depage == "dept") {
        extraParams["customerUserRule.user.dept.no"] = params.userInfo.user.dept.no;
    } else if (customerUserRule.depage == "fatherDept") {
        extraParams["customerUserRule.user.dept.fatherDept.no"] = params.userInfo.user.dept.fatherDept.no;
    }

    searcher.param(extraParams);

    searcher.button([{
        id: "addCustomerUserRule",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus",
        show: function() {

            return customerUserRule.depage == null;
        }
    }, {
        id: "import",
        name: "批量导入",
        clazz: "btn-info",
        icon: "icon-upload",
        show: function() {

            return customerUserRule.depage == null;
        }
    }, {
        id: "update",
        name: "失效",
        clazz: "btn-danger",
        icon: "icon-ban-circle",
        show: function() {

            return customerUserRule.depage == null;
        }
    }]);

    searcher.history(customerUserRule.depage + "customerUserRulePostData");

    var lineprops = [{
        fieId: "userId",
        name: "编号",
        prop: "user.userId",
        clazz: "grey"
    }, {
        fieId: "deptname",
        name: "部门",
        prop: "user.dept.name",
        clazz: "grey"
    }, {
        fieId: "regionname",
        name: "分区",
        prop: "user.dept.fatherDept.name",
        clazz: "grey"
    }, {
        fieId: "measureNum",
        name: "量尺数",
        prop: "measureNum",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "contractNum",
        name: "签单数",
        prop: "contractNum",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "contractPrice",
        name: "签单额",
        prop: "contractPrice",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "materialPrice",
        name: "主材额",
        prop: "materialPrice",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "designPrice",
        name: "设计费",
        prop: "designPrice",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "predisPrice",
        name: "折前额",
        prop: "predisPrice",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "score",
        name: "得分",
        prop: "score",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "rank",
        name: "排名",
        prop: "rank",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "chance",
        name: "机会数",
        prop: "chance",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "surplus",
        name: "剩余数",
        prop: "surplus",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "polling",
        name: "轮询数",
        prop: "polling",
        clazz: "blue",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "updateTime",
        name: "更新时间",
        prop: "updateTime",
        clazz: "green",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "finishTime",
        name: "结束时间",
        prop: "finishTime",
        clazz: "green",
        show: function(v) {

            return customerUserRule.depage == null;
        }
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerUserRule.status.keys
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            customerUserRule.currentCurid = v.curid;

            customerUserRule.items.user.val(v.user.currentName);
            customerUserRule.items.period.val(v.period);
            customerUserRule.items.measureNum.val(v.measureNum);
            customerUserRule.items.contractNum.val(v.contractNum);
            customerUserRule.items.contractPrice.val(v.contractPrice);
            customerUserRule.items.materialPrice.val(v.materialPrice);
            customerUserRule.items.designPrice.val(v.designPrice);
            customerUserRule.items.predisPrice.val(v.predisPrice);
            customerUserRule.items.chance.val(v.chance);
            customerUserRule.items.surplus.val(v.surplus);

            customerUserRule.items.user.attr("disabled", "disabled");

            customerUserRule.modals.addCustomerUserRuleModal.modal("show");
            return false;
        },
        show: function(v) {

            return v.status != 4 && customerUserRule.depage == null;
        }
    }, {
        name: "项目",
        clazz: "btn-success",
        handle: function(v) {

            params.customer["curid"] = v.curid;

            com.popup4page("#layerPopUp", api.index.customerUserRuleItem.url, "人员规则项目");

            return false;
        },
        show: function(v) {

            return v.status != 4 && customerUserRule.depage == null;
        }
    }, {
        name: "开始接单",
        clazz: "btn-success",
        handle: function(v, check) {

            if (v.status == 4) {
                com.showAlert(com.warning, "状态不可操作.");
                return false;
            }

            var status = customerUserRule.depage == "dept" ? 2 : customerUserRule.depage == "fatherDept" ? 3 : 1;

            com.post(api.customer.updateCustomerUserRuleForStatus, {
                "customerUserRule.curid": v.curid,
                "customerUserRule.status": status
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        },
        show: function(v) {

            return (v.status == 1 || v.status == 2 || v.status == 3) && customerUserRule.depage == null;
        }
    }, {
        name: "停止接单",
        clazz: "btn-danger",
        handle: function(v, check) {

            if (v.status == 4) {
                com.showAlert(com.warning, "状态不可操作.");
                return false;
            }

            var status = customerUserRule.depage == "dept" ? 2 : customerUserRule.depage == "fatherDept" ? 3 : 1;

            com.post(api.customer.updateCustomerUserRuleForStatus, {
                "customerUserRule.curid": v.curid,
                "customerUserRule.status": status
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        show: function(v) {

            return v.status == 0;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            if (v.status == 4) {
                com.showAlert(com.warning, "状态不可操作.");
                return false;
            }

            var status = customerUserRule.depage == "dept" ? 2 : customerUserRule.depage == "fatherDept" ? 3 : 1;

            com.post(api.customer.updateCustomerUserRuleForStatus, {
                "customerUserRule.curid": v.curid,
                "customerUserRule.status": status
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        },
        show: function(v) {

            return false;
        }
    }];

    searcher.line("user.currentName", lineprops, linebtns).render();

    com.focusPage("#resultList").find("div.action-buttons").find("a.btn-yellow").hide();

    com.focusPage('#addCustomerUserRule', '#pagenation').on("click", function() {

        customerUserRule.modals.addCustomerUserRuleModal.modal("show");
    });

    com.focusPage('#import', '#pagenation').on("click", function() { // 导入数据

    });

    com.focusPage('#update', '#pagenation').on("click", function() {

        com.showConfirm("确认将当前所有人员规则置为失效?", function(result) {

            com.post(api.customer.disableCustomerUserRule, {}, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "已完成.")
            });
        })
    });

    function saveData() {

        if (com.validate('addCustomerUserRuleModal'))
            return false;

        var url = api.customer.addCustomerUserRule;
        var options = {
            "customerUserRule.user.userId": com.typeahead("user"),
            "customerUserRule.period": customerUserRule.items.period.val(),
            "customerUserRule.measureNum": customerUserRule.items.measureNum.val(),
            "customerUserRule.contractNum": customerUserRule.items.contractNum.val(),
            "customerUserRule.contractPrice": customerUserRule.items.contractPrice.val(),
            "customerUserRule.materialPrice": customerUserRule.items.materialPrice.val(),
            "customerUserRule.designPrice": customerUserRule.items.designPrice.val(),
            "customerUserRule.predisPrice": customerUserRule.items.predisPrice.val(),
            "customerUserRule.chance": customerUserRule.items.chance.val(),
            "customerUserRule.surplus": customerUserRule.items.surplus.val(),
        };

        if (customerUserRule.currentCurid != null) {
            url = api.customer.updateCustomerUserRule;
            options["customerUserRule.curid"] = customerUserRule.currentCurid;
        }

        com.post(url, options, function() {

            searcher.doSearch();
            customerUserRule.modals.addCustomerUserRuleModal.modal("hide");
        });
    }

    function queryInfo() {

        com.post(api.system.querySystemConfigByGroup, {
            "systemConfig.group": ""
        }, function(res) {

        }, null, false)
    }

    function drawInfo(id, name, style, infos) {

        com.focusPage("#" + id).remove();

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").attr("id", id).prependTo(com.focusPage("#infolist"));
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header " + style).appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text(name).appendTo($header);

        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $.each(infos, function(i, v) {

            $('<div></div>').append($('<label></label>').attr('for', 'form-field').text(v.key + ": " + v.value)).appendTo($info);
        });
    }

});
