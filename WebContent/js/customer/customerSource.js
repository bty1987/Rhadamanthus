$(function() {

    var customerSource = {

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#customerSource"),
            issueBtn: com.focusPage("#issueBtn", "#issueCustomerChanceModal"),
            firstApprovalBtn: com.focusPage("#firstApprovalBtn", "#commitFirstApprove")
        },

        modals: {
            createSourceModal: com.focusPage("#createsource"),
            issueCustomerChanceModal: com.focusPage("#issueCustomerChanceModal"),
            commitFirstApprove: com.focusPage("#commitFirstApprove")
        },

        items: {
            name: com.focusPage("#name", "#customerSource"),
            gender: com.focusPage("#gender", "#customerSource"),
            phone: com.focusPage("#phone", "#customerSource"),
            intention: com.focusPage("#intention", "#customerSource"),
            grade: com.focusPage("#grade", "#customerSource"),
            villageName: com.focusPage("#villageName", "#customerSource"),
            built: com.focusPage("#built", "#customerSource"),
            unit: com.focusPage("#unit", "#customerSource"),
            floor: com.focusPage("#floor", "#customerSource"),
            door: com.focusPage("#door", "#customerSource"),
            builtrule: com.focusPage("#builtrule", "#customerSource"),
            unitrule: com.focusPage("#unitrule", "#customerSource"),
            floorrule: com.focusPage("#floorrule", "#customerSource"),
            doorrule: com.focusPage("#doorrule", "#customerSource"),
            rule: com.focusPage("#rule", "#customerSource"),
            buildArea: com.focusPage("#buildArea", "#customerSource"),
            freeArea: com.focusPage("#freeArea", "#customerSource"),
            totalArea: com.focusPage("#totalArea", "#customerSource"),
            innerArea: com.focusPage("#innerArea", "#customerSource"),
            comment: com.focusPage("#comment", "#customerSource"),
            houseNumber: com.focusPage("#houseNumber", "#customerSource"),
            purpose: com.focusPage("#purpose", "#customerSource"),
            price: com.focusPage("#price", "#customerSource"),

            company: com.focusPage("#company", "#issueCustomerChanceModal"),
            region: com.focusPage("#region", "#issueCustomerChanceModal"),
            department: com.focusPage("#department", "#issueCustomerChanceModal"),
            belonger: com.focusPage("#belonger", "#issueCustomerChanceModal"),

            firstApproveComment: com.focusPage("#firstApproveComment", "#commitFirstApprove")
        },

        approveItems: {
            villageName: com.focusPage("#villageName1", "#commitFirstApprove"),
            built: com.focusPage("#built1", "#commitFirstApprove"),
            unit: com.focusPage("#unit1", "#commitFirstApprove"),
            floor: com.focusPage("#floor1", "#commitFirstApprove"),
            door: com.focusPage("#door1", "#commitFirstApprove"),
            builtrule: com.focusPage("#builtrule1", "#commitFirstApprove"),
            unitrule: com.focusPage("#unitrule1", "#commitFirstApprove"),
            floorrule: com.focusPage("#floorrule1", "#commitFirstApprove"),
            doorrule: com.focusPage("#doorrule1", "#commitFirstApprove"),
            rule: com.focusPage("#rule1", "#commitFirstApprove"),
            busitype: com.focusPage("#busitype", "#commitFirstApprove"),
            rate: com.focusPage("#rate", "#commitFirstApprove"),
        },

        source: null,
        rule: null,
        grade: ["A", "B", "C", "D"],
        currentCustomerSource: {},
        customerDeptRule: {
            "atttype": constant.customer().customerDeptRule.ATTTYPE_USER_INT
        },

        depage: params['urlLoadParams'].depage,
    };

    customerSource.btns.saveBtn.bindClick(saveDate);
    customerSource.btns.issueBtn.bindClick(issueDate);
    customerSource.btns.firstApprovalBtn.bindClick(firstApproval);

    com.post(api.ds.building, {}, function(res) {

        customerSource.items.builtrule.bindData(res.buildruleOne, "key", "value");
        customerSource.items.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerSource.items.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerSource.items.doorrule.bindData(res.buildruleThr, "key", "value");
        customerSource.approveItems.builtrule.bindData(res.buildruleOne, "key", "value");
        customerSource.approveItems.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerSource.approveItems.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerSource.approveItems.doorrule.bindData(res.buildruleThr, "key", "value");
    });

    function drawInit(e) {

        com.initTypeahead(e.villageName, api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v) {

            com.post(api.data.queryVillageByVid, {
                "village.no": k
            }, function(res) {

                e.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
            }, null, false);

            return v;
        });
    }

    drawInit(customerSource.items);
    drawInit(customerSource.approveItems);

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value');

    customerSource.items.company.change(function(res) {

        com.post(api.communion.queryDepartment, {
            "dept.type.dtid": 1,
            "company": customerSource.items.company.val()
        }, function(res) {

            customerSource.items.region.bindData(res.deptList, "did", "name", true);
        });

        com.post(api.communion.queryDepartment, {
            "dept.type.dtid": 2,
            "company": customerSource.items.company.val()
        }, function(res) {

            customerSource.items.department.bindData(res.deptList, "did", "name", true);
        });
    });

    com.post(api.system.queryCompany, {}, function(res) {

        customerSource.items.company.bindData(res.companys, 'cid', 'name', true);
    });

    com.post(api.communion.queryDepartment, {
        "dept.type.dtid": 1
    }, function(res) {

        customerSource.items.region.bindData(res.deptList, "did", "name", true);
    });

    com.post(api.communion.queryDepartment, {
        "dept.type.dtid": 2
    }, function(res) {

        customerSource.items.department.bindData(res.deptList, "did", "name", true);
    });

    customerSource.items.grade.bindData(customerSource.grade, "key", "value", false);

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        var $arr = [];

        $.each(res.decorationBusitypes, function(intex, value) {

            if (value.status == 0) {
                $arr.push(value);
            }
        });

        customerSource.approveItems.busitype.bindData($arr, 'dbid', 'name');
    });

    function drawInfo() {

        var $widget = $('<div></div>').addClass("widget-container-span col-xs-6 col-md-3").prependTo(com.focusPage("#infolist"));
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("默认规则").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('默认规则: ' + "手动")).appendTo($info);
    }

    drawInfo();

    var searcher = new Searcher();

    searcher.base("csCondList", "csPagenation", "csResultList", api.customer.pageCustomerSource);
    searcher.condition(["customer-customerSource-phone", "customer-customerSource-village", "customer-customerSource-createTime", "customer-customerSource-status"]);

    searcher.button([{
        id: "createCustomerSource",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    searcher.history(customerSource.depage + "customerSourceData");

    var extraParams = {
        "customerSource.creater.uid": null
    };

    if (customerSource.depage == 'user') {
        extraParams["customerSource.creater.userId"] = params.userInfo.user.userId;
    } else if (customerSource.depage == "dept") {
        extraParams["customerSource.creater.dept.no"] = params.userInfo.user.dept.no;
    } else if (customerSource.depage == "region") {
        extraParams["customerSource.creater.dept.fatherDept.no"] = params.userInfo.user.dept.fatherDept.no;
    }

    searcher.param(extraParams);

    var lineprops = [{
        field: "name",
        name: "姓名",
        prop: "name",
        clazz: "grey"
    }, {
        field: "gender",
        name: "性别",
        prop: "gender",
        clazz: "grey"
    }, {
        field: "phone",
        name: "客户电话",
        prop: "phone",
        clazz: "grey"
    }, {
        field: "purpose",
        name: "目的",
        prop: "purpose",
        clazz: "grey"
    }, {
        field: "intention",
        name: "意向",
        prop: "intention",
        clazz: "grey"
    }, {
        field: "price",
        name: "需求价格",
        prop: "price",
        clazz: "blue"
    }, {
        field: "grade",
        name: "等级",
        prop: "grade",
        clazz: "red"
    }, {
        field: "village.name",
        name: "楼盘",
        prop: "village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "houseNumber",
        clazz: "blue"
    }, {
        field: "buildArea",
        name: "建筑面积",
        prop: "buildArea",
        clazz: "blue"
    }, {
        field: "freeArea",
        name: "赠送面积",
        prop: "freeArea",
        clazz: "blue"
    }, {
        field: "innerArea",
        name: "套内面积",
        prop: "innerArea",
        clazz: "blue"
    }, {
        field: "totalArea",
        name: "总面积",
        prop: "totalArea",
        clazz: "blue"
    }, {
        type: "newline"
    }, {
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.orderId);
        }
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
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
        field: "designer.currentName",
        name: "设计师",
        prop: "designer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.designer.userId);
        }
    }, {
        field: "salesman.currentName",
        name: "业务员",
        prop: "salesman.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.salesman.userId);
        }
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerSource.status.keys
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "更新",
        clazz: "btn-info",
        handle: function(v) {

            customerSource.source = v;

            customerSource.items.villageName.val(v.village.name);
            customerSource.items.gender.prop('checked', com.genderType[v.gender]);
            customerSource.items.comment.val(v.comment);
            customerSource.items.price.val(v.price);
            customerSource.items.intention.val(v.intention);
            customerSource.items.phone.val(v.phone);
            customerSource.items.name.val(v.name);
            customerSource.items.buildArea.val(v.innerArea);

            com.focusPage(".rule").show();
            com.focusPage(".villageName").show();
            customerSource.modals.createSourceModal.modal("show");

            return false;
        },
        show: function(v) {

            return v.status == 0 || v.status == 2;
        }
    }, {
        name: "初审",
        clazz: "btn-success",
        handle: function(v) {

            customerSource.currentCustomerSource = v;

            approvalUtils.initqueryApprovalUser('firstApproveMan', 20);

            deleteDate();

            customerSource.modals.commitFirstApprove.modal("show");

            return false;
        },
        show: function(v) {

            return v.status == constant.customer().customerSource.STATUS_INIT_INT;
        }
    }, {
        name: "分配",
        clazz: "btn-yellow",
        handle: function(v) {

            customerSource.source = v;

            var rule = customerSource.customerDeptRule;
            var source = null;

            com.post(api.customer.queryCustomerSource, {
                "customerSource.csid": v.csid
            }, function(res) {

                source = res.customerSource;
            }, null, false);

            if (!source)
                return false;

            com.post(api.customer.queryCustomerDeptRule, {
                "customerDeptRule.department.did": source.creater.dept.did
            }, function(res) {

                customerSource.rule = res.customerDeptRule;
                rule = res.customerDeptRule;
            }, null, false);

            if (rule.atttype == constant.customer().customerDeptRule.ATTTYPE_AUTO_INT) {
                com.focusPage(".belonger").hide();
                com.focusPage(".department").hide();
                com.focusPage(".region").hide();
            }

            if (rule.atttype == constant.customer().customerDeptRule.ATTTYPE_USER_INT) {
                com.focusPage(".belonger").show();
                com.focusPage(".department").hide();
                com.focusPage(".region").hide();
            }

            if (rule.atttype == constant.customer().customerDeptRule.ATTTYPE_DEPT_INT) {
                com.focusPage(".belonger").hide();
                com.focusPage(".region").hide();
                com.focusPage(".department").show();
            }

            if (rule.atttype == constant.customer().customerDeptRule.ATTTYPE_RULE_INT) {
                com.focusPage(".region").show();
                com.focusPage(".belonger").hide();
                com.focusPage(".department").hide();
            }

            customerSource.modals.issueCustomerChanceModal.modal("show");

            return false;
        },
        show: function(v) {

            return v.status == constant.customer().customerSource.STATUS_INIT_INT || v.status == 2 || v.status == 3 || v.status == 4;
        }

    }, {
        name: "记录",
        clazz: "btn-warning",
        handle: function(v) {

            params.customer.customerSource = v;
            com.popup4page("#stockRecordPopUp", "/views/customer/customerSourceRecord.html", "记录", "", function() {

                searcher.doSearch();
            });

            return false;
        }
    }, {
        name: "机会",
        clazz: "btn-inverse",
        handle: function(v) {

            params.customer.customerSource = v;
            
            params['urlLoadParams'].depage = "source";
            
            com.popup4page("#stockRecordPopUp", "/views/customer/customerChance.html?depage=source", "机会", "", function() {

                searcher.doSearch();
            });

            return false;
        }
    }, {
        name: "失效",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.customer.updateCustomerSourceForStatus, {
                "customerSource.csid": v.csid,
                "customerSource.status": constant.customer().customerSource.STATUS_LNVALID_INT
            }, function() {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return v.status == constant.customer().customerSource.STATUS_INIT_INT || v.status == 2 || v.status == 3 || v.status == 4;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#createCustomerSource').on("click", function() {

        deleteDate();
        com.focusPage(".rule").hide();
        com.focusPage(".villageName").hide();
        customerSource.modals.createSourceModal.modal("show");
    });

    function saveDate() {

        if (com.validate("customerSource"))
            return false;

        var cid = checkCustomer();
        var built = customerSource.items.built.val();
        var unit = customerSource.items.unit.val();
        var floor = customerSource.items.floor.val();
        var door = customerSource.items.door.val();

        var options = {
            "customerSource.name": customerSource.items.name.val(),
            "customerSource.gender": com.genderType[customerSource.items.gender.prop("checked")],
            "customerSource.phone": customerSource.items.phone.val(),
            "customerSource.intention": customerSource.items.intention.val(),
            "customerSource.price": customerSource.items.price.val(),
            "customerSource.comment": customerSource.items.comment.val(),
            "customerSource.buildArea": customerSource.items.buildArea.val(),
            "customerSource.innerArea": customerSource.items.buildArea.val(),
            "customerSource.freeArea": 0,
            "customerSource.totalArea": 0,

            "customerSource.customer.cid": cid,
        };

        if (built && unit && floor && door) {

            var hid = checkHouse(customerSource.items);

            options["customerSource.csid"] = customerSource.source.csid;
            options["customerSource.house.hid"] = hid;

            com.post(api.customer.updateCustomerSource, options, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
                deleteDate();
                customerSource.modals.createSourceModal.modal("hide");
            });
        }

        if (!built && !unit && !floor && !door) {
            com.post(api.customer.addCustomerSource, options, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
                deleteDate();
                customerSource.modals.createSourceModal.modal("hide");
            });
        }

    }

    function issueDate() {

        if (com.validate("issueCustomerChance"))
            return false;

        var options = {
            "customerSource.csid": customerSource.source.csid,
            "company": customerSource.items.company.val(),
        };

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_USER_INT) {
            options["customerChance.belonger.userId"] = com.typeahead("belonger");
        }

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_DEPT_INT) {
            options["customerChance.department.did"] = customerSource.items.department.val();
        }

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_RULE_INT) {
            options["customerChance.region.did"] = customerSource.items.region.val();
        }

        com.post(api.customer.issueCustomerSource, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            deleteDate();

            customerSource.modals.issueCustomerChanceModal.modal("hide");
        });
    }

    function deleteDate() {

        com.cleanTypeahead("villageName");
        com.cleanTypeahead("belonger");

        com.cleanItems(customerSource.items);
        com.cleanItems(customerSource.approveItems);
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

    // 检查获取客户
    function checkCustomer() {

        var cid = "";
        var customerOption = {
            "customer.name": customerSource.items.name.val(),
            "customer.phone": customerSource.items.phone.val(),
            "customer.gender": customerSource.items.gender.val(),
            "customer.relationshipType": "普通客户",
            "customer.qq": "",
            "customer.wechat": "",
            "customer.email": "",
            "customer.address": ""
        };

        com.post(api.data.existCustomer, customerOption, function(res) {

            cid = res.customer.cid;
        }, null, false);

        return cid;
    }

    // 提交初审
    function firstApproval() {

        if (com.validate("commitFirstApprove")) {
            return false;
        }

        var approver = com.focusPage("#firstApproveMan").find('input:checked').attr('userid');

        if (approver == null || approver == "") {
            com.showAlert(com.error, "请选择审批人");
            return false;
        }

        var hid = checkHouse(customerSource.approveItems);

        com.showConfirm("是否确认提交审批", function() {

            var option = {
                "approval.receiver.userId": approver,
                "approval.comment": customerSource.items.firstApproveComment.val(),
                "approvalCustomerSource.csid": customerSource.currentCustomerSource.csid,
                "approvalCustomerSource.hid": hid,
                "approvalCustomerSource.dbid": customerSource.approveItems.busitype.val(),
                "approvalCustomerSource.rate": customerSource.approveItems.rate.val(),
            };

            com.post(api.approval.submitApprovalForCustomerSource, option, function(res) {

                com.showAlert(com.info, "操作成功");

                com.clearValidator();
                searcher.doSearch();

                customerSource.modals.commitFirstApprove.modal("hide");
            });
        });
    }

});