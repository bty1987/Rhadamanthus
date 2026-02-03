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
            intention: com.focusPage("#intention", "#customerSource"),
            grade: com.focusPage("#grade", "#customerSource"),
            villageName: com.focusPage("#villageName", "#customerSource"),
            villageRule: com.focusPage("#villageRule", "#customerSource"),
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
            houseAttr: com.focusPage("#houseAttr", "#customerSource"),
            demand: com.focusPage("#demand", "#customerSource"),
            businessType: com.focusPage("#businessType", "#customerSource"),
            referCustomer: com.focusPage("#referCustomer", "#customerSource"),
            referPhone: com.focusPage("#referPhone", "#customerSource"),
            referOrderId: com.focusPage("#referOrderId", "#customerSource"),
            referVillage: com.focusPage("#referVillage", "#customerSource"),
            referHouseNumber: com.focusPage("#referHouseNumber", "#customerSource"),
            referContractTime: com.focusPage("#referContractTime", "#customerSource"),
            source: com.focusPage("#source", "#customerSource"),
            contact: com.focusPage("#contact", "#customerSource"),

            busitype: com.focusPage("#busitype", "#issueCustomerChanceModal"),
            busitypeInfo: com.focusPage("#busitypeInfo", "#issueCustomerChanceModal"),
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

        vid: null,
        source: null,
        btnStatue: "open",
        rule: {
            "atttype": constant.customer().customerDeptRule.ATTTYPE_USER_INT
        },

        refer: {
            orderId: null
        },

        type: null,
        grade: ["A", "B", "C", "D"],

        profileTemplate: null,

        depage: params['urlLoadParams'].depage,
    };

    customerSource.items.customerType.bindData(constant.customer().customerSource.customerType.datas, "key", "value");
    customerSource.items.houseAttr.bindData(constant.customer().customerSource.houseAttr.datas, "key", "value");
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

    function initVillage(containId, ruleId, args) {

        com.initTypeahead(containId, api.data.queryVillageForNameByPinyin, "pinyinName", args, "autoFillKeyValue", "key", "value", function(list, k, v) {

            com.post(api.data.queryVillageByVid, {
                "village.no": k

            }, function(res) {

                customerSource.vid = res.village.vid

                if (ruleId)
                    ruleId.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
            }, null, false);

            return v;
        });
    }

    bindData(customerSource.items);
    bindData(customerSource.approveItems);
    bindData(customerSource.updateHouseItems);

    initVillage(com.focusPage("#villageName", "#customerSource"), com.focusPage("#rule", "#customerSource"), null);
    initVillage(com.focusPage("#villageName1", "#commitFirstApprove"), com.focusPage("#rule1", "#commitFirstApprove"), null);
    initVillage(com.focusPage("#villageName2", "#updateForHouse"), com.focusPage("#rule2", "#updateForHouse"), null);
    initVillage(com.focusPage("#referVillage", "#customerSource"), null, null);

    com.post(api.customer.queryCustomerDeptRuleByDid, {

        "customerDeptRule.department.did": params.userInfo.user.dept.did,
    }, function(res) {

        var busitypes = [];

        $.each(res.customerDeptRules, function(i, v) {

            v.busitype.other = v.busitype.outside + "-" + v.busitype.isRefer;

            busitypes.push(v.busitype);
        });

        customerSource.items.businessType.bindData(busitypes, "dbid", "name", '请选择', null, "other").trigger("change");
    });

    customerSource.items.businessType.change(function(e) {

        var other = $("#businessType option:selected").attr("other");

        if (!other)
            return false;

        if (other.indexOf('-') == -1)
            return false;

        var outside = other.split('-')[0];
        var isRefer = other.split('-')[1];

        if (outside == 0) {
            com.focusPage(".source", "#createsource").hide();
            com.focusPage(".contact", "#createsource").hide();
        } else {
            com.focusPage(".source", "#createsource").show();
            com.focusPage(".contact", "#createsource").show();
        }

        if (isRefer == 0) {
            com.focusPage("#referCustomer", "#createsource").prop("checked", "checked").attr("disabled", "disabled");
            com.focusPage(".referCustomerInfo", "#createsource").hide();
        } else {
            com.focusPage("#referCustomer", "#createsource").prop("checked", "checked").attr("disabled", "disabled");
            com.focusPage(".referCustomerInfo", "#createsource").show();
        }
    });

    com.focusPage('#referCustomer').on("click", function() {

        if (customerSource.items.referCustomer.prop("checked")) {
            com.focusPage(".referCustomerInfo", "#createsource").show();
        } else {
            com.focusPage(".referCustomerInfo", "#createsource").hide();
        }
    });

    customerSource.items.villageName.blur(function() {

        com.post(api.data.queryVillageRule, {
            "villageRule.vid": customerSource.vid
        }, function(res) {

            var rules = [];

            $.each(res.villageRules, function(i, v) {

                rules.push(v.rule);
            });

            customerSource.items.villageRule.bindData(rules, "rule", "ruleContent", false).trigger("change");
        });
    });

    customerSource.items.referOrderId.blur(function() {

        var orderId = customerSource.items.referOrderId.val();

        var options = {
            "decoration.orderId": orderId
        }

        com.post(api.decoration.queryDecorationForCommonByOrderId, options, function(res) {

            var decoration = res.decoration;

            if ([2, 3, 7].indexOf(decoration.status) == -1) {
                com.showAlert(com.error, "推荐客户不存在");
                return false;
            }

            if (decoration.orderId) {
                customerSource.items.referOrderId.val(decoration.orderId);
                customerSource.items.referPhone.val((decoration.status == 3 || decoration.status == 7) ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9)) : "客户电话");
                customerSource.items.referVillage.val(decoration.house.village.name);
                customerSource.items.referHouseNumber.val(decoration.house.houseNumber);

                customerSource.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                customerSource.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                customerSource.items.referContractTime.val(decoration.precontractTime);
        }, function(res) {

            com.showAlert(com.error, "推荐客户不存在");
            return false;
        });
    });

    customerSource.items.referPhone.blur(function() {

        customerSource.refer.orderId = null;

        var phone = customerSource.items.referPhone.val();

        var options = {
            "customerPhone": phone,
            "paging.page": 1,
            "paging.rows": 10,
        }

        var decoration = null;

        com.post(api.decoration.pageDecorationForCustomer, options, function(res) {

            if (res.paging.totalRecords == 0) {
                com.showAlert(com.error, "推荐客户不存在");
                return false;
            }

            var decorations = res.paging.data;

            $.each(decorations, function(i, v) {

                decoration = v;

                if ([2, 3, 7].indexOf(decoration.status) == -1) {
                    return true;
                }

                if (decoration.orderId) {
                    customerSource.items.referOrderId.val(decoration.orderId);
                    customerSource.items.referPhone.val((decoration.status == 3 || decoration.status == 7) ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9)) : "客户电话");
                    customerSource.items.referVillage.val(decoration.house.village.name);
                    customerSource.items.referHouseNumber.val(decoration.house.houseNumber);

                    customerSource.refer.orderId = decoration.orderId;
                }

                if (decoration.precontractTime)
                    customerSource.items.referContractTime.val(decoration.precontractTime);

                if (decoration.contractTime)
                    customerSource.items.referContractTime.val(decoration.precontractTime);

                return false;
            });
        }, function(res) {

            com.showAlert(com.error, "推荐客户不存在");
            return false;
        });
    });

    customerSource.items.referVillage.blur(function() {

        customerSource.refer.orderId = null;

        var villageno = com.typeahead(customerSource.items.referVillage);
        var housenumber = customerSource.items.referHouseNumber.val();

        var options = {
            "house.village.no": villageno,
            "house.houseNumber": housenumber,
            "house.status": 0,
        };

        var house = null;
        var decoration = null;

        com.post(api.data.queryHouseByNoAHnum, options, function(res) {

            house = res.house;
        }, null, false);

        if (!house)
            return false;

        var options = {
            "decoration.house.hid": house.hid
        }

        com.post(api.decoration.checkDecoration, options, function(res) {

            var decoration = res.decoration;

            if ([2, 3, 7].indexOf(decoration.status) == -1) {
                com.showAlert(com.error, "推荐客户不存在");
                return false;
            }

            if (decoration.orderId) {
                customerSource.items.referOrderId.val(decoration.orderId);
                customerSource.items.referPhone.val(decoration.customer.phone);

                customerSource.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                customerSource.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                customerSource.items.referContractTime.val(decoration.precontractTime);
        }, function(res) {

            com.showAlert(com.error, "推荐客户不存在");
            return false;
        });
    });

    customerSource.items.referHouseNumber.blur(function() {

        customerSource.refer.orderId = null;

        var villageno = com.typeahead(customerSource.items.referVillage);
        var housenumber = customerSource.items.referHouseNumber.val();

        var options = {
            "house.village.no": villageno,
            "house.houseNumber": housenumber,
            "house.status": 0,
        };

        var house = null;
        var decoration = null;

        com.post(api.data.queryHouseByNoAHnum, options, function(res) {

            house = res.house;
        }, null, false);

        if (!house)
            return false;

        var options = {
            "decoration.house.hid": house.hid
        }

        com.post(api.decoration.checkDecoration, options, function(res) {

            var decoration = res.decoration;

            if ([2, 3, 7].indexOf(decoration.status) == -1) {
                com.showAlert(com.error, "推荐客户不存在");
                return false;
            }

            if (decoration.orderId) {
                customerSource.items.referOrderId.val(decoration.orderId);
                customerSource.items.referPhone.val(decoration.customer.phone);

                customerSource.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                customerSource.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                customerSource.items.referContractTime.val(decoration.precontractTime);
        }, function(res) {

            com.showAlert(com.error, "推荐客户不存在");
            return false;
        });
    });

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": "",
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
    searcher.condition(["customer-customerSource-name", "customer-customerSource-phone", "customer-customerSource-village", "customer-customerSource-contact", "customer-customerSource-source", "customer-customerSource-referOrderId", "customer-customerSource-creater", "customer-customerSource-createTime", "customer-customerSource-status", "customer-customerSource-customerType", "customer-customerSource-demand"]);

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
        field: "no",
        name: "尺源编号",
        prop: "no",
        clazz: "blue"
    }, {
        field: "phone",
        name: "客户电话",
        prop: function(v) {

            if (!v.phone)
                return "";

            // 如果电话号码已经包含*号，直接显示
            if (v.phone.includes('*')) {
                return v.phone;
            }

            // 如果是11位完整号码，显示为前3位+****+后4位
            if (v.phone.length === 11) {
                return v.phone.substr(0, 3) + '****' + v.phone.substr(7);
            }

            // 其他情况直接显示
            return v.phone;
        },
        clazz: "grey",
        show: function(v) {

            return (customerSource.depage == "user");
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
        name: "派尺面积",
        prop: "buildArea",
        clazz: "blue"
    }, {
        field: "busitype",
        name: "业务类型",
        prop: "busitype.name",
        clazz: "red"
    }, {
        field: "outside",
        name: "三方标识",
        prop: "busitype.outside",
        clazz: "red",
        dataset: constant.data().decorationBusitype.outside.keys
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
        field: "houseAttr",
        name: "房屋属性",
        prop: "houseAttr",
        clazz: "red",
        dataset: constant.customer().customerSource.houseAttr.keys
    }, {
        field: "demand",
        name: "装修需求",
        prop: "demand",
        clazz: "red",
        dataset: constant.customer().customerSource.demand.keys
    }, {
        field: "source",
        name: "来源方",
        prop: "source",
        clazz: "grey",
    }, {
        field: "contact",
        name: "对接人",
        prop: "contact",
        clazz: "grey",
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerSource.status.keys
    }, {
        field: "referOrderId",
        name: "推荐单号",
        prop: function(v) {

            return v.referOrderId ? v.referOrderId : "";
        },
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.referOrderId);
        }
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

            com.cleanTypeahead(customerSource.updateHouseItems.villageName);

            if (v.village && v.village.parentVillage && v.village.parentVillage.vid) {
                com.focusPage("#villageName2").typeahead("args", {
                    "village.parentVillage.vid": v.village.parentVillage.vid
                });
            }

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

            deleteDate();

            customerSource.type = "update";
            customerSource.source = v;

            com.cleanTypeahead(customerSource.items.villageName);

            if (v.village && v.village.parentVillage && v.village.parentVillage.vid) {
                com.focusPage("#villageName").typeahead("args", {
                    "village.parentVillage.vid": v.village.parentVillage.vid
                });
            }

            if (v.village && v.village.vid) {
                com.updateTypeahead(customerSource.items.villageName, v.village.no, v.village.name);
            }

            customerSource.items.gender.prop('checked', com.genderType[v.gender]);
            customerSource.items.comment.val(v.comment);
            customerSource.items.price.val(v.price);
            customerSource.items.intention.val(v.intention);
            // 编辑时隐藏电话表单内容
            customerSource.items.phone.closest('.form-group').hide();
            customerSource.items.name.val(v.name);
            customerSource.items.buildArea.val(v.innerArea);
            customerSource.items.businessType.val(v.busitype.dbid);

            com.focusPage(".referCustomerInfo", "#createsource").show();
            com.focusPage("#referCustomer", "#createsource").prop("checked", "checked");

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

            return v.status == -1;
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

            com.post(api.customer.queryCustomerCompanyRule, {
                "customerCompanyRule.uppval": customerSource.source.innerArea,
                "customerCompanyRule.dept.did": customerSource.source.creater.dept.did
            }, function(res) {

                var companys = [];

                $.each(res.customerCompanyRules, function(i, v) {

                    companys.push(v.company);
                });

                customerSource.items.company.bindData(companys, 'cid', 'name', true);
            });

            getRules(v.busitype.dbid);

            customerSource.items.busitypeInfo.val(v.busitype.name);

            customerSource.modals.issueCustomerChanceModal.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == constant.customer().customerSource.STATUS_INIT_INT || v.status == 2 || v.status == 3 || v.status == 4) && (customerSource.depage == "user" || customerSource.depage == null);
        }

    }, {
        name: "记录",
        clazz: "btn-warning",
        handle: function(v) {

            params.customer.customerSource = v;
            com.popup4page("#layerPopUp", "/views/customer/customerSourceRecord.html", "记录", "", function() {

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

            com.popup4page("#layerPopUp", "/views/customer/customerChance.html?depage=source", "机会", "", function() {

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
    }, {
        name: "画像",
        clazz: "btn-yellow",
        handle: function(v) {

            params.customer.source = v;
            // com.switchPage(api.index.profileInfo.url); 跳转新页面

            params.customer.csid = v.csid;
            params.customer.profile = {
                "type": 0,
                "csid": v.csid
            }

            com.popup4page("#layerPopUp", api.index.customerProfile4detailIndex.url, "客户画像: ");

            return false;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#createCustomerSource').on("click", function() {

        customerSource.type = "create";

        deleteDate();

        customerSource.profileTemplate = null;

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "CUSTOMER_PROFILE_TEMPLATE_0"
        }, function(res) {

            customerSource.profileTemplate = res.systemConfig.value;
        }, null, false);

        if (customerSource.profileTemplate) {
            com.post(api.data.querySurveyTemplateByStid, {
                "surveyTemplate.stid": customerSource.profileTemplate
            }, function(res) {

                display(res.surveyTemplate);
            }, null, false);
        }

        com.focusPage("#referCustomer", "#createsource").prop("checked", "checked");
        com.focusPage(".referCustomerInfo", "#createsource").show();

        // 创建时确保电话表单内容显示
        customerSource.items.phone.closest('.form-group').show();

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
            "customerDeptRule.department.did": params.userInfo.user.dept.did,
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
        var phone = customerSource.items.phone.val();

        var options = {
            "customerSource.name": customerSource.items.name.val(),
            "customerSource.gender": com.genderType[customerSource.items.gender.prop("checked")],
            "customerSource.phone": phone,
            "customerSource.customerType": customerSource.items.customerType.val(),
            "customerSource.houseAttr": customerSource.items.houseAttr.val(),
            "customerSource.demand": customerSource.items.demand.val(),
            "customerSource.busitype.dbid": customerSource.items.businessType.val(),
            "customerSource.intention": customerSource.items.intention.val(),
            "customerSource.price": customerSource.items.price.val(),
            "customerSource.comment": customerSource.items.comment.val(),
            "customerSource.buildArea": customerSource.items.buildArea.val(),
            "customerSource.innerArea": customerSource.items.buildArea.val(),
            "customerSource.source": customerSource.items.source.val(),
            "customerSource.contact": customerSource.items.contact.val(),
            "customerSource.freeArea": 0,
            "customerSource.totalArea": 0,
        };

        var isRefer = $("#businessType option:selected").attr("other").split('-')[1];

        if (isRefer == 1 && !customerSource.refer.orderId) {
            com.showAlert(com.error, "请填写推荐客户信息");
            return false;
        }

        if (customerSource.refer.orderId) {
            options["customerSource.referOrderId"] = customerSource.refer.orderId;
        }

        if (villageName) {

            if (built || unit || floor || door) {

                var hid = checkHouse(customerSource.items);

                if (!hid)
                    return false;

                options["customerSource.house.hid"] = hid;

            } else {
                options["customerSource.village.no"] = com.typeahead(customerSource.items.villageName);
            }
        }

        if (phone) {

            var cid = checkCustomer(customerSource.approveItems);

            if (!cid)
                return false;

            options["customerSource.customer.cid"] = hid;
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

                handle(res.customerSource.csid);

                searcher.doSearch();

                deleteDate();

                customerSource.modals.createSourceModal.modal("hide");

            }, null, false);
        }
    }

    function issueDate() {

        if (com.validate("issueCustomerChance"))
            return false;

        var options = {
            "customerSource.csid": customerSource.source.csid,
            "customerChance.busitype.dbid": customerSource.source.busitype.dbid
        };

        if (customerSource.items.company.val()) {
            options["company"] = customerSource.items.company.val();
        }

        if (customerSource.items.busitype.is(':visible')) {
            options["customerChance.busitype.dbid"] = customerSource.items.busitype.val();
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

        // 重置电话表单内容显示
        customerSource.items.phone.closest('.form-group').show();

        com.focusPage(".item", "#from1").remove();
    }

    // 检查获取楼盘
    function checkHouse(items) {

        var hid = null;
        var villageRule = items.villageRule.val().toString();
        var houseNumber = "";

        var rulenum = [items.built.val().trim().toUpperCase(), items.builtrule.val(), items.unit.val().trim().toUpperCase(), items.unitrule.val(), items.floor.val().trim().toUpperCase(), items.floorrule.val(), items.door.val().trim().toUpperCase(), items.doorrule.val()];

        var houseNumber = houseUtils.creatHouseNumber(rulenum);

        var regex = new RegExp(villageRule);

        if (!regex.test(houseNumber)) {

            com.showAlert(com.error, "楼号格式错误");
            return false;
        }

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

    function checkDecoration(orderId, phone, hid) {

        var options = {
            "customerPhone": phone,
            "paging.page": 1,
            "paging.rows": 10,
        }

        var decoration = null;

        com.post(api.decoration.pageDecorationForCustomer, options, function(res) {

            var decorations = res.paging.data;

            $.each(decorations, function(i, v) {

                if (v.orderId == orderId)
                    decoration = v;
            });

        }, null, false);

        if (!decoration) {
            com.showAlert(com.error, "推荐客户不存在");
            return false;
        }

        return true;
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

        if (!hid)
            return false;

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

                if (!hid)
                    return false;

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

    function display(profile) {

        var state = 0;

        $.each(profile.items, function(i, v) {

            if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                var contentDiv = $('<div class="form-group item"></div>').addClass("item").attr("id", v.cpiid).attr("cpiid", v.cpiid).attr("type", v.type).appendTo(com.focusPage("#from1"));
                var titleSpan = $('<label class="col-sm-3 control-label no-padding-right"></span>').html(v.name).appendTo(contentDiv);
                var groupDiv = $('<div class="col-sm-9"></div>').appendTo(contentDiv);

                if (v.require == 0) {
                    titleSpan.addClass("orange");
                    contentDiv.addClass("require");
                }

            }

            var type = v.type;

            if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                customerProfileDetail.items.title.html(v.content);
            } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {

                var textArea = $('<textarea class="col-xs-6 text "></textarea>').prop('id', v.cpiid + "textarea").html(v.content).appendTo(groupDiv);

                if (v.require == 0)
                    textArea.addClass("v_required");

            } else if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {

                var radioDivAll = $('<div></div>').prop('id', 'form-field-checkbox' + v.stiid).appendTo(groupDiv);

                if (v.require == 0)
                    radioDivAll.addClass("v_radio");

                $.each(v.options, function(j, option) {

                    option["cpiid"] = i;
                    elect(radioDivAll, option, type, state);
                });
            } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                var checkDivAll = $('<div></div>').prop('id', 'form-field-checkbox' + v.stiid).appendTo(groupDiv);

                if (v.require == 0)
                    checkDivAll.addClass("v_checkbox");

                $.each(v.options, function(j, option) {

                    option["cpiid"] = i;
                    elect(checkDivAll, option, type, state);
                });
            }
        });
    }

    function handle(csid) {

        var options = {
            "customerProfile.csid": csid,
            "customerProfile.type": 0,
            "customerProfile.tid": customerSource.profileTemplate
        };

        var items = com.focusPage(".item", "#from1");

        if (!items)
            return false;
        if (items.length == 0)
            return false;

        $.each(items, function(i, v) {

            var item = $(v);

            var type = item.attr("type");

            if (type == constant.customer().survey.TYPE_INPUT_INT) {

                options["customerProfile.items[" + i + "].name"] = item.find("label").html();
                options["customerProfile.items[" + i + "].content"] = item.find("textarea").val();
                options["customerProfile.items[" + i + "].type"] = type;
                options["customerProfile.items[" + i + "].require"] = item.hasClass("require") ? 0 : 1;
            }

            if (type == constant.customer().survey.TYPE_SINGLE_INT) {

                var soptions = item.find("input[type='radio']");

                options["customerProfile.items[" + i + "].name"] = item.find("label").html();
                options["customerProfile.items[" + i + "].type"] = type;
                options["customerProfile.items[" + i + "].require"] = item.hasClass("require") ? 0 : 1;

                $.each(soptions, function(k, n) {

                    var subt = $(n);
                    var cpoid = subt.attr("cpoid");

                    options["customerProfile.items[" + i + "].options[" + k + "].title"] = subt.next("span").html();

                    if (subt.prop("checked")) {
                        options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                    } else {
                        options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                    }
                });
            }

            if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                var soptions = item.find("input[type='checkbox']");

                options["customerProfile.items[" + i + "].name"] = item.find("label").html();
                options["customerProfile.items[" + i + "].type"] = type;
                options["customerProfile.items[" + i + "].require"] = item.hasClass("require") ? 0 : 1;

                $.each(soptions, function(k, n) {

                    var subt = $(n);
                    var cpoid = subt.attr("cpoid");

                    options["customerProfile.items[" + i + "].options[" + k + "].title"] = subt.next("span").html();

                    if (subt.prop("checked")) {
                        options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                    } else {
                        options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                    }
                });
            }
        });

        com.post(api.customer.addCustomerProfile, options, null, null, false);
    }

    function elect(contentDiv, option, type, status) {

        var ridioDiv = $('<div class="col-sm-4"></div>').appendTo(contentDiv);
        var div = $('<div></div>').addClass("").appendTo(ridioDiv);
        var label = $('<label  class="label-text"></label>').appendTo(div);

        var input = $('<input class="ace">').attr({
            'name': 'form-field-checkbox' + option.stiid,
            "cpoid": option.cpoid
        }).appendTo(label);

        if (type == constant.customer().survey.TYPE_SINGLE_INT) {
            input.prop({
                'type': 'radio'
            })
        } else if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {
            input.prop({
                'type': 'checkbox'
            })
        }

        var span = $('<span class="lbl blue" style="padding-left: 5px;"></span>').html(option.title).appendTo(label);

        if (option.checked == 0) {
            input.attr('checked', true);
        } else {
            input.attr('checked', false);
        }
    }
});