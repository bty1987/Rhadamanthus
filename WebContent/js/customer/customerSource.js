$(function() {

    var customerSource = {

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#customerSource"),
            issueBtn: com.focusPage("#issueBtn", "#issueCustomerChanceModal"),
            firstApprovalBtn: com.focusPage("#firstApprovalBtn", "#commitFirstApprove"),
            updateHouseBtn: com.focusPage("#updateHouseBtn", "#updateForHouse")
        },

        modals: {
            createSourceModal: com.focusPage("#createsource"),
            issueCustomerChanceModal: com.focusPage("#issueCustomerChanceModal"),
            commitFirstApprove: com.focusPage("#commitFirstApprove"),
            updateForHouse: com.focusPage("#updateForHouse")
        },

        items: {
            name: com.focusPage("#name", "#customerSource"),
            gender: com.focusPage("#gender", "#customerSource"),
            phone: com.focusPage("#phone", "#customerSource"),
            phone1: com.focusPage("#phone1", "#customerSource"),
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
            customerType: com.focusPage("#customerType", "#customerSource"),
            demand: com.focusPage("#demand", "#customerSource"),

            busitype: com.focusPage("#busitype", "#issueCustomerChanceModal"),
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
            phone: com.focusPage("#phone", "#commitFirstApprove")
        },

        updateHouseItems: {
            villageName: com.focusPage("#villageName2", "#updateForHouse"),
            built: com.focusPage("#built2", "#updateForHouse"),
            unit: com.focusPage("#unit2", "#updateForHouse"),
            floor: com.focusPage("#floor2", "#updateForHouse"),
            door: com.focusPage("#door2", "#updateForHouse"),
            builtrule: com.focusPage("#builtrule2", "#updateForHouse"),
            unitrule: com.focusPage("#unitrule2", "#updateForHouse"),
            floorrule: com.focusPage("#floorrule2", "#updateForHouse"),
            doorrule: com.focusPage("#doorrule2", "#updateForHouse"),
            rule: com.focusPage("#rule2", "#updateForHouse")
        },

        source: null,
        btnStatue: "open",
        rule: {
            "atttype": constant.customer().customerDeptRule.ATTTYPE_USER_INT
        },

        type: null,
        grade: ["A", "B", "C", "D"],

        depage: params['urlLoadParams'].depage,
    };

    customerSource.items.customerType.bindData(constant.customer().customerSource.customerType.datas, "key", "value");
    customerSource.items.demand.bindData(constant.customer().customerSource.demand.datas, "key", "value");

    customerSource.btns.saveBtn.bindClick(saveDate);
    customerSource.btns.firstApprovalBtn.bindClick(firstApproval);
    customerSource.btns.updateHouseBtn.bindClick(updateHouse);
    customerSource.btns.issueBtn.bindClick(function() {

        if (customerSource.btnStatue == "open") {
            issueDate();
            customerSource.btns.issueBtn.removeClass('btn btn-primary pull-right').addClass('btn btn-blue pull-right');
        }
    });

    function bindData(e) {

        com.post(api.ds.building, {}, function(res) {

            e.builtrule.bindData(res.buildruleOne, "key", "value");
            e.unitrule.bindData(res.buildruleTwo, "key", "value");
            e.floorrule.bindData(res.buildruleTwo, "key", "value");
            e.doorrule.bindData(res.buildruleThr, "key", "value");
        });
    }

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

    bindData(customerSource.items);
    bindData(customerSource.approveItems);
    bindData(customerSource.updateHouseItems);
    drawInit(customerSource.items);
    drawInit(customerSource.approveItems);
    drawInit(customerSource.updateHouseItems);

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

    com.post(api.system.queryCompany, {
        "company.atttype": "1"
    }, function(res) {

        var $arr = [];

        $.each(res.companys, function(intex, value) {

            if (value.code == "210100") {
                $arr.push(value);
            }
        });

        customerSource.items.company.bindData($arr, 'cid', 'name', true);
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

    // drawInfo();

    var searcher = new Searcher();

    searcher.base("csCondList", "csPagenation", "csResultList", api.customer.pageCustomerSource);
    searcher.condition(["customer-customerSource-phone", "customer-customerSource-village", "customer-customerSource-creater", "customer-customerSource-createTime", "customer-customerSource-status", "customer-customerSource-customerType", "customer-customerSource-demand"]);

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
        clazz: "grey",
        show: function(v) {

            return customerSource.depage == "user";
        }
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
        prop: function(v) {

            return v.village && v.village.name != null ? v.village.name + "-" + v.village.cityProper.name : "";
        },
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
        field: "customerType",
        name: "客户类型",
        prop: "customerType",
        clazz: "red",
        dataset: constant.customer().customerSource.customerType.keys
    }, {
        field: "demand",
        name: "装修需求",
        prop: "demand",
        clazz: "red",
        dataset: constant.customer().customerSource.demand.keys
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
        name: "房产",
        clazz: "btn-blue",
        handle: function(v) {

            customerSource.source = v;

            if (v.village && v.village.vid) {
                com.updateTypeahead(customerSource.updateHouseItems.villageName, v.village.no, v.village.name);
            }

            customerSource.modals.updateForHouse.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == 0 || v.status == 2) && customerSource.depage == "user";
        }
    }, {
        name: "更新",
        clazz: "btn-info",
        handle: function(v) {

            customerSource.type = "update";
            customerSource.source = v;

            if (v.village && v.village.vid) {
                com.updateTypeahead(customerSource.items.villageName, v.village.no, v.village.name);
            }

            customerSource.items.gender.prop('checked', com.genderType[v.gender]);
            customerSource.items.comment.val(v.comment);
            customerSource.items.price.val(v.price);
            customerSource.items.intention.val(v.intention);
            customerSource.items.phone.val(v.phone.substr(0, 3));
            customerSource.items.phone1.val(v.phone.substr(7, 11));
            customerSource.items.name.val(v.name);
            customerSource.items.buildArea.val(v.innerArea);

            customerSource.modals.createSourceModal.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == 0 || v.status == 2) && customerSource.depage == "user";
        }
    }, {
        name: "初审",
        clazz: "btn-success",
        handle: function(v) {

            customerSource.source = v;

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

            com.focusPage(".company", "#issueCustomerChanceModal").hide();
            com.focusPage(".belonger", "#issueCustomerChanceModal").hide();
            com.focusPage(".department", "#issueCustomerChanceModal").hide();
            com.focusPage(".region", "#issueCustomerChanceModal").hide();

            com.cleanItems(customerSource.items);

            com.focusPage(".busitype", "#issueCustomerChanceModal").show();

            com.post(api.customer.queryCustomerDeptRuleByDid, {
                "customerDeptRule.department.did": v.creater.dept.did,
            }, function(res) {

                if (!res.customerDeptRules || res.customerDeptRules.length == 0) {

                    com.focusPage(".busitype", "#issueCustomerChanceModal").hide();
                    com.focusPage(".belonger", "#issueCustomerChanceModal").show();

                    customerSource.rule = {
                        "atttype": constant.customer().customerDeptRule.ATTTYPE_USER_INT
                    };

                    return false;
                }

                if (!res.customerDeptRules || res.customerDeptRules.length == 1) {

                    com.focusPage(".busitype", "#issueCustomerChanceModal").hide();

                    getRules(res.customerDeptRules[0].busitype.dbid);

                    return false;
                }

                var $arr = [];

                $.each(res.customerDeptRules, function(intex, value) {

                    $arr.push({
                        "dbid": value.busitype.dbid,
                        "name": value.busitype.name
                    });
                });

                customerSource.items.busitype.bindData($arr, 'dbid', 'name', '请选择');
            });

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
        },
        show: function(v) {

            return customerSource.depage == "user";
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

        customerSource.type = "create";
        deleteDate();
        customerSource.modals.createSourceModal.modal("show");
    });

    customerSource.items.busitype.change(function() {

        var busitype = $(this).val();

        getRules(busitype);
    });

    function getRules(busitype) {

        com.focusPage(".company", "#issueCustomerChanceModal").hide();
        com.focusPage(".belonger", "#issueCustomerChanceModal").hide();
        com.focusPage(".department", "#issueCustomerChanceModal").hide();
        com.focusPage(".region", "#issueCustomerChanceModal").hide();

        com.post(api.customer.queryCustomerDeptRuleByDbid, {
            "customerDeptRule.department.did": customerSource.source.creater.dept.did,
            "customerDeptRule.busitype.dbid": busitype
        }, function(res) {

            customerSource.rule = res.customerDeptRule;
        }, function() {

        }, false);

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_AUTO_INT) {
            com.focusPage(".company", "#issueCustomerChanceModal").show();
            com.focusPage(".belonger", "#issueCustomerChanceModal").hide();
            com.focusPage(".department", "#issueCustomerChanceModal").hide();
            com.focusPage(".region", "#issueCustomerChanceModal").hide();
        }

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_USER_INT) {
            com.focusPage(".company", "#issueCustomerChanceModal").show();
            com.focusPage(".belonger", "#issueCustomerChanceModal").show();
            com.focusPage(".department", "#issueCustomerChanceModal").hide();
            com.focusPage(".region", "#issueCustomerChanceModal").hide();
        }

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_DEPT_INT) {
            com.focusPage(".company", "#issueCustomerChanceModal").show();
            com.focusPage(".belonger", "#issueCustomerChanceModal").hide();
            com.focusPage(".region", "#issueCustomerChanceModal").hide();
            com.focusPage(".department", "#issueCustomerChanceModal").show();
        }

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_RULE_INT) {
            com.focusPage(".company", "#issueCustomerChanceModal").show();
            com.focusPage(".region", "#issueCustomerChanceModal").show();
            com.focusPage(".belonger", "#issueCustomerChanceModal").hide();
            com.focusPage(".department", "#issueCustomerChanceModal").hide();
        }
    }

    function saveDate() {

        if (com.validate("customerSource"))
            return false;

        var built = customerSource.items.built.val();
        var unit = customerSource.items.unit.val();
        var floor = customerSource.items.floor.val();
        var door = customerSource.items.door.val();
        var villageName = customerSource.items.villageName.val();
        var phone = customerSource.items.phone.val() + "****" + customerSource.items.phone1.val();

        var options = {
            "customerSource.name": customerSource.items.name.val(),
            "customerSource.gender": com.genderType[customerSource.items.gender.prop("checked")],
            "customerSource.phone": phone,
            "customerSource.customerType": customerSource.items.customerType.val(),
            "customerSource.demand": customerSource.items.demand.val(),
            "customerSource.intention": customerSource.items.intention.val(),
            "customerSource.price": customerSource.items.price.val(),
            "customerSource.comment": customerSource.items.comment.val(),
            "customerSource.buildArea": customerSource.items.buildArea.val(),
            "customerSource.innerArea": customerSource.items.buildArea.val(),
            "customerSource.freeArea": 0,
            "customerSource.totalArea": 0
        };

        if (villageName) {

            if (built || unit || floor || door) {

                var hid = checkHouse(customerSource.items);

                options["customerSource.house.hid"] = hid;

            } else {

                options["customerSource.village.no"] = com.typeahead(customerSource.items.villageName);
            }
        }

        if (customerSource.type == "update") {

            options["customerSource.csid"] = customerSource.source.csid;

            com.post(api.customer.updateCustomerSource, options, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
                deleteDate();
                customerSource.modals.createSourceModal.modal("hide");
            });
        }

        if (customerSource.type == "create") {

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
            "customerChance.busitype.dbid": customerSource.items.busitype.val()
        };

        if (customerSource.items.company.val()) {
            options["company"] = customerSource.items.company.val();
        }

        if (customerSource.items.busitype.val()) {
            options["customerChance.busitype.dbid"] = customerSource.items.busitype.val();
        } else if (customerSource.busitype) {
            options["customerChance.busitype.dbid"] = customerSource.busitype.dbid;
        }

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_USER_INT) {
            options["customerChance.belonger.userId"] = com.typeahead("belonger");
        }

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_DEPT_INT) {
            options["customerChance.department.did"] = customerSource.items.department.val();
        }

        if (customerSource.rule.atttype == constant.customer().customerDeptRule.ATTTYPE_RULE_INT) {
            options["customerChance.region.did"] = customerSource.items.region.val();
        }

        customerSource.btnStatue = "close";

        com.post(api.customer.issueCustomerSource, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            deleteDate();

            customerSource.modals.issueCustomerChanceModal.modal("hide");
        });

        setTimeout(function() {

            customerSource.btnStatue = "open";
            customerSource.btns.issueBtn.removeClass('btn btn-blue pull-right').addClass('btn btn-primary pull-right');
        }, 3000);
    }

    function deleteDate() {

        com.cleanTypeahead("villageName");
        com.cleanTypeahead("belonger");

        com.cleanItems(customerSource.items);
        com.cleanItems(customerSource.approveItems);
        com.cleanItems(customerSource.updateHouseItems);
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
    function checkCustomer(items) {

        var cid = "";
        var customerOption = {
            "customer.name": customerSource.source.name,
            "customer.phone": items.phone.val(),
            "customer.gender": customerSource.source.gender,
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
        var cid = checkCustomer(customerSource.approveItems);

        com.showConfirm("是否确认提交审批", function() {

            var option = {
                "approval.receiver.userId": approver,
                "approval.comment": customerSource.items.firstApproveComment.val(),
                "approvalCustomerSource.csid": customerSource.source.csid,
                "approvalCustomerSource.hid": hid,
                "approvalCustomerSource.dbid": customerSource.approveItems.busitype.val(),
                "approvalCustomerSource.rate": customerSource.approveItems.rate.val(),

                "approvalCustomerSource.cid": cid
            };

            com.post(api.approval.submitApprovalForCustomerSource, option, function(res) {

                com.showAlert(com.info, "操作成功");

                com.clearValidator();
                searcher.doSearch();

                customerSource.modals.commitFirstApprove.modal("hide");
            });
        });
    }

    // 房产编辑
    function updateHouse() {

        if (com.validate("updateForHouse")) {
            return false;
        }

        var built = customerSource.updateHouseItems.built.val();
        var unit = customerSource.updateHouseItems.unit.val();
        var floor = customerSource.updateHouseItems.floor.val();
        var door = customerSource.updateHouseItems.door.val();
        var villageName = customerSource.updateHouseItems.villageName.val();

        var options = {
            "customerSource.csid": customerSource.source.csid
        };

        if (villageName) {

            if (built || unit || floor || door) {

                var hid = checkHouse(customerSource.updateHouseItems);

                options["customerSource.house.hid"] = hid;

            } else {

                options["customerSource.village.no"] = com.typeahead(customerSource.updateHouseItems.villageName);
            }
        } else {

            com.showAlert(com.warning, "请输入楼盘名");
            return false;
        }

        com.post(api.customer.updateCustomerSourceForHouse, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            deleteDate();
            customerSource.modals.updateForHouse.modal("hide");
        });
    }
});