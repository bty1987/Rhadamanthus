jQuery(function($) {

    var customerChance = {
        modals: {
            issueModal: com.focusPage("#issueModal"),
            changeModal: com.focusPage("#changeModal"),
            approveModal: com.focusPage("#approveModal"),
            firstApprove: com.focusPage("#firstApprove"),
            QRcodeModal: com.focusPage("#QRcodeModal")
        },
        items: {
            region: com.focusPage("#region"),
            department: com.focusPage("#department"),
            belonger: com.focusPage("#belonger"),
            busitype: com.focusPage("#busitype"),

            houseType: com.focusPage("#houseType", "#changeModal"),
            houseClass: com.focusPage("#houseClass", "#changeModal"),
            orderType: com.focusPage("#orderType", "#changeModal"),
            resourceType: com.focusPage("#resourceType", "#changeModal"),

            villageNoDesigerApprove: com.focusPage("#villageNoDesigerApprove", "#approveModal"),
            houseNumberApprove: com.focusPage("#houseNumberApprove", "#approveModal"),
            nameApprove: com.focusPage("#nameApprove", "#approveModal"),
            phoneApprove: com.focusPage("#phoneApprove", "#approveModal"),
            busitypeApprove: com.focusPage("#busitypeApprove", "#approveModal"),
            houseTypeApprove: com.focusPage("#houseTypeApprove", "#approveModal"),
            houseClassApprove: com.focusPage("#houseClassApprove", "#approveModal"),
            orderTypeApprove: com.focusPage("#orderTypeApprove", "#approveModal"),
            resourceTypeApprove: com.focusPage("#resourceTypeApprove", "#approveModal"),
            approveMan: com.focusPage("#approveMan", "#approveModal"),
            approveComment: com.focusPage("#approveComment", "#approveModal"),

            firstApproveComment: com.focusPage("#firstApproveComment", "#firstApprove"),

            infolist: com.focusPage("#infolist"),
        },

        approveItems: {
            villageName: com.focusPage("#villageName", "#firstApprove"),
            built: com.focusPage("#built", "#firstApprove"),
            unit: com.focusPage("#unit", "#firstApprove"),
            floor: com.focusPage("#floor", "#firstApprove"),
            door: com.focusPage("#door", "#firstApprove"),
            builtrule: com.focusPage("#builtrule", "#firstApprove"),
            unitrule: com.focusPage("#unitrule", "#firstApprove"),
            floorrule: com.focusPage("#floorrule", "#firstApprove"),
            doorrule: com.focusPage("#doorrule", "#firstApprove"),
            rule: com.focusPage("#rule", "#firstApprove"),
            busitype: com.focusPage("#busitype", "#firstApprove"),
            rate: com.focusPage("#rate", "#firstApprove"),
        },

        btns: {
            issueSaveBtn: com.focusPage("#saveBtn", "#issueModal").on("click", issue),
            changeBtn: com.focusPage("#changeBtn", "#changeModal").on("click", change),
            approveBtn: com.focusPage("#approvalBtn", "#approveModal").on("click", approval),
            firstApprovalBtn: com.focusPage("#firstApprovalBtn", "#firstApprove").on("click", firstApproval)
        },

        atttypes: [],

        decoration: {
            "types": {}
        },

        source: {
            "csid": null
        },

        userRule: {
            "curid": null,
            "score": 0,
            "chance": 0,
            "polling": 0,
            "status": 0,
        },

        ccid: null,

        depage: params['urlLoadParams'].depage,

    };

    com.post(api.ds.building, {}, function(res) {

        customerChance.approveItems.builtrule.bindData(res.buildruleOne, "key", "value");
        customerChance.approveItems.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerChance.approveItems.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerChance.approveItems.doorrule.bindData(res.buildruleThr, "key", "value");
    });

    com.initTypeahead(customerChance.approveItems.villageName, api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v) {

        com.post(api.data.queryVillageByVid, {
            "village.no": k
        }, function(res) {

            customerChance.approveItems.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);

        return v;
    });

    customerChance.items.houseType.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    customerChance.items.houseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerChance.items.resourceType.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    customerChance.items.houseTypeApprove.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    customerChance.items.houseClassApprove.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerChance.items.resourceTypeApprove.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    com.post(api.data.queryDecorationAtttype, {}, function(res) {

        $.each(res.decorationAtttypes, function(i, v) {

            customerChance.decoration.types[v.key] = v.type;

            if (v.status == 0) {
                customerChance.atttypes.push(v);
            }
        });

        customerChance.items.orderType.bindData(customerChance.atttypes, 'key', 'name');
        customerChance.items.orderTypeApprove.bindData(customerChance.atttypes, 'key', 'name');
    });

    com.post(api.customer.queryCustomerUserRule, {
        "customerUserRule.user.uid": params.userInfo.user.uid,
    }, function(res) {

        if (res.customerUserRule)
            customerChance.userRule = res.customerUserRule;

    }, null, false);

    function drawInfo() {

        var $widget = $('<div></div>').addClass("widget-container-span col-xs-6 col-md-3").prependTo(customerChance.items.infolist);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var $name = $('<h4></h4>').attr('id', 'h4name_').text("分配规则").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('得分: ' + customerChance.userRule.score)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('机会数: ' + customerChance.userRule.chance)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('轮询数: ' + customerChance.userRule.polling)).appendTo($info);

        var $enable = $('<a></a>').addClass('btn btn-app btn-success').click(function() {

            com.showConfirm("是否启用人员规则", function() {

                updateUserRule($disable, $enable);
            });
        });
        var $enableI = $('<i></i>').addClass('icon-ok-circle bigger-230');
        var $enableS = $('<span></span>').html("上线分配");

        $enable.append($enableI).append($enableS).appendTo(customerChance.items.infolist);

        var $disable = $('<a></a>').addClass('btn btn-app btn-warning').click(function() {

            com.showConfirm("是否禁用人员规则", function() {

                updateUserRule($enable, $disable);
            });
        });
        $('<i></i>').addClass('icon-ban-circle bigger-230');

        var $disableI = $('<i></i>').addClass('icon-ban-circle bigger-230');
        var $disableS = $('<span></span>').html("下线分配");

        $disable.append($disableI).append($disableS).appendTo(customerChance.items.infolist);

        customerChance.userRule.status == 0 ? $enable.hide() : $disable.hide();
    }

    if (customerChance.depage != "source")
        drawInfo();

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerChance);

    searcher.condition(["customer-chance-createTime", "customer-chance-type", "customer-chance-status", "customer-chance-source-phone", "customer-chance-source-village", "customer-chance-source-createTime"]);

    searcher.history(customerChance.depage + "customerChancePostData");

    var extraParams = {
        "customerChance.belonger.uid": null
    };

    if (customerChance.depage == 'user') {
        extraParams["customerChance.belonger.userId"] = params.userInfo.user.userId;
    } else if (customerChance.depage == "dept") {
        extraParams["customerChance.belonger.dept.no"] = params.userInfo.user.dept.no;
    } else if (customerChance.depage == "region") {
        extraParams["customerChance.belonger.dept.fatherDept.no"] = params.userInfo.user.dept.fatherDept.no;
    } else if (customerChance.depage == "source") {
        extraParams["customerChance.source.csid"] = params.customer.customerSource.csid;
    }

    searcher.param(extraParams);

    var lineprops = [{
        field: "source",
        name: "客户姓名",
        prop: "source.name",
        clazz: "grey"
    }, {
        field: "busitype",
        name: "业务类型",
        prop: "busitype.name",
        clazz: "red",
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "issuer",
        name: "分配人",
        prop: "issuer.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "issueTime",
        name: "分配时间",
        prop: "issueTime",
        clazz: "green"
    }, {
        field: "confirmTime",
        name: "确认时间",
        prop: "confirmTime",
        clazz: "green"
    }, {
        field: "belonger",
        name: "归属人",
        prop: "belonger.currentName",
        clazz: "grey"
    }, {
        field: "department",
        name: "归属部门",
        prop: "department.name",
        clazz: "grey"
    }, {
        field: "region",
        name: "归属分区",
        prop: "region.name",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.customer().customerChance.type.keys
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerChance.status.keys,
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "分配",
        clazz: "btn-yellow",
        handle: function(v) {

            com.cleanTypeahead('region');
            com.cleanTypeahead('belonger');
            com.cleanTypeahead('busitype');

            customerChance.ccid = v.ccid;

            customerChance.modals.issueModal.modal("show");

        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT || v.status == 2) && customerChance.depage != "source";
        },
    }, {
        name: "失效",
        clazz: "btn-success",
        handle: function(v) {

            disable(v.ccid);
        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT || v.status == 2 || v.status == 3) && customerChance.depage != "source";
        },
    }, {
        name: "推送",
        clazz: "btn-warning",
        handle: function(v) {

            send(v);
        },
    }, {
        name: "确认",
        clazz: "btn-inverse",
        handle: function(v) {

            confirm(v.ccid);
        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT || v.status == 2) && customerChance.depage != "source";
        },
    }, {
        name: "转换",
        clazz: "btn-danger",
        handle: function(v) {

            customerChance.ccid = v.ccid;

            customerChance.modals.changeModal.modal("show");
        },
        show: function(v) {

            return v.status == 3 && customerChance.depage != "source";
        },
    }, {
        name: "初审",
        clazz: "btn-pink",
        handle: function(v) {

            com.cleanTypeahead("villageName");
            com.cleanTypeahead("firstApproveComment");
            com.cleanItems(customerChance.approveItems);

            customerChance.ccid = v.ccid;
            customerChance.source.csid = v.source.csid;

            approvalUtils.initqueryApprovalUser('firstApproveMan', 20);

            customerChance.modals.firstApprove.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT || v.status == 2) && customerChance.depage != "source";
        },
    }, {
        name: "审批",
        clazz: "btn-danger",
        handle: function(v) {

            approvalUtils.initqueryApprovalUser('approveMan', 21);

            customerChance.ccid = v.ccid;

            customerChance.currentCustomerChance = v;
            customerChance.items.villageNoDesigerApprove.prop("disabled", true);
            customerChance.items.houseNumberApprove.attr("disabled", "disabled");
            customerChance.items.nameApprove.attr("disabled", "disabled");
            customerChance.items.phoneApprove.attr("disabled", "disabled");
            com.cleanTypeahead('approveComment');

            v.busitype != null ? customerChance.items.busitypeApprove.val(v.busitype.dbid) : "";
            com.updateTypeahead('villageNoDesigerApprove', v.source.village.no, v.source.village.name + "-" + v.source.village.cityProper.name);
            customerChance.items.houseNumberApprove.val(v.source.houseNumber);
            customerChance.items.nameApprove.val(v.source.name);
            customerChance.items.phoneApprove.val(v.source.phone);

            customerChance.modals.approveModal.modal("show");
        },
        show: function(v) {

            return v.status == 3 && customerChance.depage != "source";
        },

    }, {
        name: "记录",
        clazz: "btn-pink",
        handle: function(v) {

            params.customer.customerSource = v.source;

            com.popup4page("#stockRecordPopUp", "/views/customer/customerSourceRecord.html", "记录", "", function() {

                searcher.doSearch();
            });

            return false;
        },
        show: function(res) {

            return customerChance.depage != "source";
        }

    }, ];

    searcher.line("source.name", lineprops, linebtns).render();

    com.post(api.communion.queryDepartment, {
        "dept.type.dtid": 1
    }, function(res) {

        customerChance.items.region.bindData(res.deptList, "did", "name", true);
    });

    com.post(api.communion.queryDepartment, {
        "dept.type.dtid": 2
    }, function(res) {

        customerChance.items.department.bindData(res.deptList, "did", "name", true);
    });

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, "autoFillKeyValue", "key", "value");

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        var $arr = [];

        $.each(res.decorationBusitypes, function(intex, value) {

            if (value.status == 0) {
                $arr.push(value);
            }
        });

        customerChance.items.busitypeApprove.bindData($arr, 'dbid', 'name');
        customerChance.items.busitype.bindData($arr, "dbid", "name", true);
        customerChance.approveItems.busitype.bindData($arr, 'dbid', 'name');
    });

    function issue() {

        if (com.validate("issueModal")) {
            return;
        }

        var options = {
            "customerChance.ccid": customerChance.ccid,
            "customerChance.region.did": customerChance.items.region.val(),
            "customerChance.department.did": customerChance.items.department.val(),
            "customerChance.belonger.userId": com.typeahead("belonger"),
            "customerChance.busitype.dbid": customerChance.items.busitype.val(),
        };

        com.post(api.customer.issueCustomerChance, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        customerChance.modals.issueModal.modal("hide");
    }

    function disable(ccid) {

        var options = {
            "customerChance.ccid": ccid,
        };

        com.showConfirm("确认失效机会", function() {

            com.post(api.customer.disableCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
        });

    }

    function send(v) {

        com.focusPage('#QRcode').html("");

        com.focusPage('#QRcode').qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: 'http://fanglin.vip/wx/customerchance?csid=' + v.source.csid + '&ccid=' + v.ccid

        });

        customerChance.modals.QRcodeModal.modal('show');
    }

    function confirm(ccid) {

        var options = {
            "customerChance.ccid": ccid,
            "verifyCode": "999999",
            "securityCode": "DwRF4Epz3/Qv9Qoxq+9g0w=="
        };

        com.showConfirm("确认机会信息", function() {

            com.post(api.customer.confirmCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "确认成功");
            });
        });
    }

    function change() {

        var options = {
            "customerChance.ccid": customerChance.ccid,
            "decoration.type": customerChance.decoration.types[customerChance.items.orderType.val()],
            "decoration.typeness": customerChance.items.orderType.val(),
            "decoration.resourceType": customerChance.items.resourceType.val(),
            "decoration.houseType": customerChance.items.houseType.val(),
            "decoration.houseClass": customerChance.items.houseClass.val(),
        };

        com.post(api.customer.changeCustomerChance, options, function(res) {

            searcher.doSearch();

            com.showAlert(com.info, "转换成功");

            customerChance.modals.changeModal.modal("hide");
        });
    }

    // 提交审批
    function approval() {

        if (com.validate("approveModal")) {
            return false;
        }

        // 审批创建装修单
        var approver = com.focusPage("#approveMan").find('input:checked').attr('userid');

        if (approver == null || approver == "") {
            com.showAlert(com.error, "请选择审批人");
            return false;
        }

        com.showConfirm("是否确认提交审批", function() {

            var option = {
                "approval.receiver.userId": approver,
                "approval.comment": customerChance.items.approveComment.val(),

                "approvalCustomerChance.chance.ccid": customerChance.ccid,
                "approvalCustomerChance.type": customerChance.decoration.types[customerChance.items.orderTypeApprove.val()],
                "approvalCustomerChance.typeness": customerChance.items.orderTypeApprove.val(),
                "approvalCustomerChance.busitype.dbid": customerChance.items.busitypeApprove.val(),
                "approvalCustomerChance.houseType": customerChance.items.houseTypeApprove.val(),
                "approvalCustomerChance.houseClass": customerChance.items.houseClassApprove.val(),
                "approvalCustomerChance.resourceType": customerChance.items.resourceTypeApprove.val()
            };

            com.post(api.approval.submitApprovalForCustomerChance, option, function(res) {

                com.showAlert(com.info, "操作成功");

                com.clearValidator();
                searcher.doSearch();

                customerChance.modals.approveModal.modal("hide");
            });
        });
    }

    // 提交初审
    function firstApproval() {

        if (com.validate("firstApprove")) {
            return false;
        }

        var approver = com.focusPage("#firstApproveMan").find('input:checked').attr('userid');

        if (approver == null || approver == "") {
            com.showAlert(com.error, "请选择审批人");
            return false;
        }

        var hid = checkHouse(customerChance.approveItems);

        com.showConfirm("是否确认提交审批", function() {

            var option = {
                "approval.receiver.userId": approver,
                "approval.comment": customerChance.items.firstApproveComment.val(),
                "approvalCustomerSource.csid": customerChance.source.csid,
                "approvalCustomerSource.ccid": customerChance.ccid,
                "approvalCustomerSource.hid": hid,
                "approvalCustomerSource.dbid": customerChance.approveItems.busitype.val(),
                "approvalCustomerSource.rate": customerChance.approveItems.rate.val(),
            };

            com.post(api.approval.submitApprovalForCustomerSource, option, function(res) {

                com.showAlert(com.info, "操作成功");

                com.clearValidator();
                searcher.doSearch();

                customerChance.modals.firstApprove.modal("hide");
            });

        });
    }

    // 检查获取楼盘
    function checkHouse(items) {

        var hid = "";
        var rulenum = [items.built.val().trim().toUpperCase(), items.builtrule.val(), items.unit.val().trim().toUpperCase(), items.unitrule.val(), items.floor.val().trim().toUpperCase(), items.floorrule.val(), items.door.val().trim().toUpperCase(), items.doorrule.val()];

        var houseNumber = houseUtils.creatHouseNumber(rulenum);

        var houseOption = {
            "house.village.no": com.typeahead(items.villageName),
            "house.houseNumber": houseNumber,
            "house.built": items.built.val(),
            "house.unit": items.unit.val(),
            "house.floor": items.floor.val(),
            "house.door": items.door.val()
        };

        if (items.buildArea) {
            houseOption["house.buildArea"] = items.buildArea.val();
        }

        if (items.freeArea) {
            houseOption["house.freeArea"] = items.freeArea.val();
        }

        if (items.totalArea) {
            houseOption["house.totalArea"] = items.totalArea.val();
        }

        if (items.buildArea) {
            houseOption["house.innerArea"] = items.innerArea.val();
        }

        com.post(api.data.existHouse, houseOption, function(res) {

            hid = res.house.hid;
        }, null, false);

        return hid;
    }

    // 启用禁用个人规则
    function updateUserRule(btn1, btn2) {

        if (customerChance.userRule.curid == null) {
            com.showAlert(com.error, "无人员规则信息");
            return false;
        }

        com.post(api.customer.updateCustomerUserRuleForStatus, {
            "customerUserRule.curid": customerChance.userRule.curid,
            "customerUserRule.status": 1,
        }, function(res) {

            com.showAlert(com.info, "操作成功");

            btn2.hide();
            btn1.show();
            return false;
        });
    }

});
