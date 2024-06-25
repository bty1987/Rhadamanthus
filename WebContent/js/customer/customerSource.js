$(function() {

    var customerSource = {

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#customerSource"),
            issueBtn: com.focusPage("#issueBtn", "#issueCustomerChanceModal")
        },

        modals: {
            createSourceModal: com.focusPage("#createsource"),
            issueCustomerChanceModal: com.focusPage("#issueCustomerChanceModal"),
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
            belonger: com.focusPage("#belonger", "#issueCustomerChanceModal")
        },

        source: null,
        rule: null,
        grade: ["A", "B", "C", "D"],

        customerDeptRule: {
            "atttype": constant.customer().customerDeptRule.ATTTYPE_USER_INT
        }
    };

    customerSource.btns.saveBtn.bindClick(saveDate);
    customerSource.btns.issueBtn.bindClick(issueDate);

    com.post(api.ds.building, {}, function(res) {

        customerSource.items.builtrule.bindData(res.buildruleOne, "key", "value");
        customerSource.items.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerSource.items.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerSource.items.doorrule.bindData(res.buildruleThr, "key", "value");
    });

    com.initTypeahead('villageName', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v) {

        com.post(api.data.queryVillageByVid, {
            "village.no": k
        }, function(res) {

            customerSource.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);

        return v;
    });

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

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerSource);
    searcher.condition(["customer-customerSource-phone", "customer-customerSource-village", "customer-customerSource-createTime", "customer-customerSource-status"]);

    searcher.button([{
        id: "createCustomerSource",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    searcher.history("customerSourceData");

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

            return (v.status == constant.customer().customerSource.STATUS_INIT_INT);
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#createCustomerSource').on("click", function() {

        customerSource.modals.createSourceModal.modal("show");
    });

    function saveDate() {

        if (com.validate("customerSource"))
            return false;

        var hid = checkHouse();
        var cid = checkCustomer();

        var options = {
            "customerSource.name": customerSource.items.name.val(),
            "customerSource.gender": com.genderType[customerSource.items.gender.prop("checked")],
            "customerSource.phone": customerSource.items.phone.val(),
            "customerSource.purpose": customerSource.items.purpose.val(),
            "customerSource.intention": customerSource.items.intention.val(),
            "customerSource.price": customerSource.items.price.val(),
            "customerSource.grade": customerSource.items.grade.val(),
            "customerSource.comment": customerSource.items.comment.val(),
            "customerSource.village.no": com.typeahead("villageName"),
            "customerSource.houseNumber": customerSource.items.houseNumber.val(),
            "customerSource.buildArea": customerSource.items.buildArea.val(),
            "customerSource.freeArea": customerSource.items.freeArea.val(),
            "customerSource.totalArea": customerSource.items.totalArea.val(),
            "customerSource.innerArea": customerSource.items.innerArea.val(),

            "customerSource.house.hid": hid,
            "customerSource.customer.cid": cid,
        };

        com.post(api.customer.addCustomerSource, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            deleteDate();
            customerSource.modals.createSourceModal.modal("hide");
        });
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
    }

    // 检查获取楼盘
    function checkHouse() {

        var hid = "";
        var rulenum = [customerSource.items.built.val().trim().toUpperCase(), customerSource.items.builtrule.val(), customerSource.items.unit.val().trim().toUpperCase(), customerSource.items.unitrule.val(), customerSource.items.floor.val().trim().toUpperCase(), customerSource.items.floorrule.val(), customerSource.items.door.val().trim().toUpperCase(), customerSource.items.doorrule.val()];

        var houseNumber = houseUtils.creatHouseNumber(rulenum);

        var houseOption = {
            "house.village.no": com.typeahead("villageName"),
            "house.houseNumber": houseNumber,
            "house.built": customerSource.items.built.val(),
            "house.unit": customerSource.items.unit.val(),
            "house.floor": customerSource.items.floor.val(),
            "house.door": customerSource.items.door.val(),
            "house.buildArea": customerSource.items.buildArea.val(),
            "house.freeArea": customerSource.items.freeArea.val(),
            "house.totalArea": customerSource.items.totalArea.val(),
            "house.innerArea": customerSource.items.innerArea.val(),
        };

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

});