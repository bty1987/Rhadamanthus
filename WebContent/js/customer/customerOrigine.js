$(function() {

    var customerOrigine = {

        saveDesignerBtn: com.focusPage("#saveDesignerBtn", "#customerOrigine"),
        updateAndApprovalBtn: com.focusPage("#updateAndApprovalBtn", "#customerOrigine"),
        approvalBtn: com.focusPage("#approvalBtn", "#customerOrigine"),
        firstApprovalBtn: com.focusPage("#firstApprovalBtn", "#customerOrigine"),
        belongerBtn: com.focusPage("#belongerBtn", "#customerOrigine"),
        saveBtn: com.focusPage("#saveBtn", "#customerOrigine"),
        cancelBtn1: com.focusPage("#cancelBtn1", "#customerOrigine"),
        directTranBtn: com.focusPage("#directTranBtn", "#customerOrigine"),

        modals: {
            bindAllInfoModal: com.focusPage("#bindAllInfo", "#customerOrigine"),
            sustomerSourceModal: com.focusPage("#sustomersource", "#customerOrigine"),
            commitApproveModal: com.focusPage("#commitApprove", "#customerOrigine"),
            codeModal: com.focusPage("#codeModal", "#customerOrigine"),
            commitFirstApprove: com.focusPage("#commitFirstApprove", "#customerOrigine"),
            customerorigineforbelonger: com.focusPage("#customerorigineforbelonger", "#customerOrigine"),
            createSourceModal: com.focusPage("#createsource", "#customerOrigine"),
            directTranModal: com.focusPage("#directTranModal", "#customerOrigine"),
        },

        items: {
            name: com.focusPage("#name", "#customerOrigine"),
            gender: com.focusPage("#gender", "#customerOrigine"),
            phone: com.focusPage("#phone", "#customerOrigine"),
            purpose: com.focusPage("#purpose", "#customerOrigine"),
            intention: com.focusPage("#intention", "#customerOrigine"),
            price: com.focusPage("#price", "#customerOrigine"),
            grade: com.focusPage("#grade", "#customerOrigine"),
            comment: com.focusPage("#comment", "#customerOrigine"),

            villageNo: com.focusPage("#villageNo", "#customerOrigine"),
            houseNumber: com.focusPage("#houseNumber", "#customerOrigine"),
            buildArea: com.focusPage("#buildArea", "#customerOrigine"),
            freeArea: com.focusPage("#freeArea", "#customerOrigine"),
            totalArea: com.focusPage("#totalArea", "#customerOrigine"),
            innerArea: com.focusPage("#innerArea", "#customerOrigine"),
            rule: com.focusPage("#rule", "#customerOrigine"),

            designer: com.focusPage("#designer", "#customerOrigine"),
            salesmanBind: com.focusPage("#salesmanBind", "#customerOrigine"),
            decorationBusitype: com.focusPage("#decorationBusitype", "#customerOrigine"),
            villageNoBind: com.focusPage("#villageNoBind", "#customerOrigine"),
            houseNumberBind: com.focusPage("#houseNumberBind", "#customerOrigine"),
            nameBind: com.focusPage("#nameBind", "#customerOrigine"),
            phoneBind: com.focusPage("#phoneBind", "#customerOrigine"),
            built: com.focusPage("#built", "#customerOrigine"),
            unit: com.focusPage("#unit", "#customerOrigine"),
            floor: com.focusPage("#floor", "#customerOrigine"),
            door: com.focusPage("#door", "#customerOrigine"),
            builtrule: com.focusPage("#builtrule", "#customerOrigine"),
            unitrule: com.focusPage("#unitrule", "#customerOrigine"),
            floorrule: com.focusPage("#floorrule", "#customerOrigine"),
            doorrule: com.focusPage("#doorrule", "#customerOrigine"),
            houseTypeOne: com.focusPage("#houseTypeOne", "#customerOrigine"),
            houseTypeTwo: com.focusPage("#houseTypeTwo", "#customerOrigine"),
            houseTypeThr: com.focusPage("#houseTypeThr", "#customerOrigine"),
            houseTypeFour: com.focusPage("#houseTypeFour", "#customerOrigine"),

            nameApprove: com.focusPage("#nameApprove", "#customerOrigine"),
            phoneApprove: com.focusPage("#phoneApprove", "#customerOrigine"),
            villageNoDesiger: com.focusPage("#villageNoDesiger", "#customerOrigine"),
            houseNumberApprove: com.focusPage("#houseNumberApprove", "#customerOrigine"),
            salesman: com.focusPage("#salesman", "#customerOrigine"),
            salesmanType: com.focusPage("#salesmanType", "#customerOrigine"),
            houseType: com.focusPage("#houseType", "#customerOrigine"),
            houseClass: com.focusPage("#houseClass", "#customerOrigine"),
            orderType: com.focusPage("#orderType", "#customerOrigine"),
            resourceType: com.focusPage("#resourceType", "#customerOrigine"),
            approveComment: com.focusPage("#approveComment", "#customerOrigine"),

            firstApproveComment: com.focusPage("#firstApproveComment", "#customerOrigine"),

            // 直接转单相关字段
            directVillageNoDesiger: com.focusPage("#directVillageNoDesiger", "#customerOrigine"),
            directHouseNumberApprove: com.focusPage("#directHouseNumberApprove", "#customerOrigine"),
            directNameApprove: com.focusPage("#directNameApprove", "#customerOrigine"),
            directPhoneApprove: com.focusPage("#directPhoneApprove", "#customerOrigine"),
            directSalesman: com.focusPage("#directSalesman", "#customerOrigine"),
            directSalesmanType: com.focusPage("#directSalesmanType", "#customerOrigine"),
            directHouseType: com.focusPage("#directHouseType", "#customerOrigine"),
            directHouseClass: com.focusPage("#directHouseClass", "#customerOrigine"),
            directOrderType: com.focusPage("#directOrderType", "#customerOrigine"),
            directResourceType: com.focusPage("#directResourceType", "#customerOrigine"),

            name1: com.focusPage("#name1", "#customerOrigine"),
            gender1: com.focusPage("#gender1", "#customerOrigine"),
            phone1: com.focusPage("#phone1", "#customerOrigine"),
            designer1: com.focusPage("#designer1", "#customerOrigine"),
            salesman1: com.focusPage("#salesman1", "#customerOrigine"),
            decorationBusitype1: com.focusPage("#decorationBusitype1", "#customerOrigine"),
            intention1: com.focusPage("#intention1", "#customerOrigine"),
            grade1: com.focusPage("#grade1", "#customerOrigine"),
            villageNoCreate: com.focusPage("#villageNoCreate", "#customerOrigine"),
            buildArea1: com.focusPage("#buildArea1", "#customerOrigine"),
            freeArea1: com.focusPage("#freeArea1", "#customerOrigine"),
            totalArea1: com.focusPage("#totalArea1", "#customerOrigine"),
            innerArea1: com.focusPage("#innerArea1", "#customerOrigine"),
            comment1: com.focusPage("#comment1", "#customerOrigine"),
            houseNumber1: com.focusPage("#houseNumber1", "#customerOrigine"),
            purpose1: com.focusPage("#purpose1", "#customerOrigine"),
            price1: com.focusPage("#price1", "#customerOrigine")

        },

        bindHouseDiv: com.focusPage("#bindHouseDiv", "#customerOrigine"),
        bindCustomerDiv: com.focusPage("#bindCustomerDiv", "#customerOrigine"),

        csid: null,

        status: {},

        grade: ["A", "B", "C", "D"],
        currentCustomerOrigine: {},
        decorationTypes: [],
        decorationAtttypes: [],
        decorationBusitypeList: {},
        grade1: ["A", "B", "C", "D"]
    };

    customerOrigine.saveDesignerBtn.bindClick(bindAllInfo);
    customerOrigine.updateAndApprovalBtn.bindClick(customerUpdate);
    customerOrigine.approvalBtn.bindClick(customerApproval);
    customerOrigine.firstApprovalBtn.bindClick(firstApproval);
    customerOrigine.belongerBtn.bindClick(editBelonger);
    customerOrigine.saveBtn.bindClick(saveDate);
    customerOrigine.cancelBtn1.bindClick(deleteDate);
    customerOrigine.directTranBtn.bindClick(directTranConfirm);

    customerOrigine.items.gender.switchBtn("gender");
    customerOrigine.items.grade.bindData(customerOrigine.grade, "key", "value", false);

    customerOrigine.items.gender1.switchBtn("gender1");
    customerOrigine.items.grade1.bindData(customerOrigine.grade1, "key", "value", false);

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        var decorationBusitypes = [];

        $.each(res.decorationBusitypes, function(index, value) {

            if (value.status == constant.data().decorationBusitype.status.STATUS_ACTIVATE) {
                decorationBusitypes.push(value);
            }
            customerOrigine.decorationBusitypeList[value.dbid] = value.name;
        });

        customerOrigine.items.salesmanType.bindData(decorationBusitypes, 'dbid', 'name');
        customerOrigine.items.decorationBusitype.bindData(decorationBusitypes, 'dbid', 'name');
    }, null, false);

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        var decorationBusitypes = [];

        $.each(res.decorationBusitypes, function(index, value) {

            if (value.status == constant.data().decorationBusitype.status.STATUS_ACTIVATE) {
                decorationBusitypes.push(value);
            }
            customerOrigine.decorationBusitypeList[value.dbid] = value.name;
        });

        customerOrigine.items.salesmanType.bindData(decorationBusitypes, 'dbid', 'name');
        customerOrigine.items.decorationBusitype1.bindData(decorationBusitypes, 'dbid', 'name');
    }, null, false);

    customerOrigine.items.builtrule.bindData(constant.building().building.buildruleOne.datas, "key", "value");
    customerOrigine.items.unitrule.bindData(constant.building().building.buildruleTwo.datas, "key", "value");
    customerOrigine.items.floorrule.bindData(constant.building().building.buildruleTwo.datas, "key", "value");
    customerOrigine.items.doorrule.bindData(constant.building().building.buildruleThr.datas, "key", "value");

    customerOrigine.items.houseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerOrigine.items.resourceType.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    // 初始化直接转单弹窗的下拉框数据
    customerOrigine.items.directHouseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerOrigine.items.directResourceType.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    com.post(api.data.queryDecorationAtttype, {}, function(res) {

        $.each(res.decorationAtttypes, function(i, v) {

            customerOrigine.decorationTypes[v.key] = v.type;

            if (v.status == constant.decoration().decorationAtttype.status.STATUS_ENABLE_INT) {
                customerOrigine.decorationAtttypes.push(v);
            }
        });

        customerOrigine.items.orderType.bindData(customerOrigine.decorationAtttypes, 'key', 'name', "请选择");
        customerOrigine.items.directOrderType.bindData(customerOrigine.decorationAtttypes, 'key', 'name', "请选择");
    });

    com.initTypeahead('designer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('salesman', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('salesmanBind', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('villageNoBind', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v) {

        com.post(api.data.queryVillageByVid, {
            "village.no": k
        }, function(res) {

            customerOrigine.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);
        return v;
    });
    com.initTypeahead('designer1', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('salesman1', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('villageNoCreate', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v) {

        com.post(api.data.queryVillageByVid, {
            "village.no": k
        }, function(res) {

            customerOrigine.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);
        return v;
    });

    // 初始化直接转单弹窗的 typeahead
    com.initTypeahead('directSalesman', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('directVillageNoDesiger', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", null);

    customerOrigine.modals.sustomerSourceModal.on("hide.bs.modal", function() {

        com.closeTip();
        com.cleanItems(customerOrigine.items);
    });

    customerOrigine.modals.bindAllInfoModal.on("hide.bs.modal", function() {

        com.closeTip();
        com.cleanItems(customerOrigine.items);
        customerOrigine.items.rule.html("");
    });

    customerOrigine.modals.commitApproveModal.on("hide.bs.modal", function() {

        com.closeTip();
        com.cleanItems(customerOrigine.items);
    });

    customerOrigine.modals.directTranModal.on("hide.bs.modal", function() {

        com.closeTip();
        com.cleanItems(customerOrigine.items);
    });

    customerOrigine.modals.commitFirstApprove.on("hide.bs.modal", function() {

        com.cleanItems(customerOrigine.items);
    });

    customerOrigine.modals.customerorigineforbelonger.on("hide.bs.modal", function() {

        com.closeTip();
        com.cleanTypeahead("belonger");
    });

    customerOrigine.items.buildArea.on("change", function(e) {

        getTotalArea();
    });

    customerOrigine.items.freeArea.on("change", function(e) {

        getTotalArea();
    });

    customerOrigine.items.buildArea1.on("change", function(e) {

        getTotalArea1();
    });

    customerOrigine.items.freeArea1.on("change", function(e) {

        getTotalArea1();
    });

    // 不同页面的不同参数
    customerOrigine.pageConfig = customerPage.getConfig(params['urlLoadParams'].depage);

    var lineprops = (function() {

        var props = [];

        $.each(customerOrigine.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "customerPhone":
                    props.push({
                        field: "phone",
                        name: "客户电话",
                        prop: "phone",
                        clazz: "grey"
                    });
                    break;
                case "gender":
                    props.push({
                        field: "gender",
                        name: "性别",
                        prop: "gender",
                        clazz: "grey"
                    });
                    break;
                case "purpose":
                    props.push({
                        field: "purpose",
                        name: "目的",
                        prop: "purpose",
                        clazz: "grey"
                    });
                    break;
                case "intention":
                    props.push({
                        field: "intention",
                        name: "风格意向",
                        prop: "intention",
                        clazz: "grey"
                    });
                    break;
                case "price":
                    props.push({
                        field: "price",
                        name: "预计装修价格",
                        prop: "price",
                        clazz: "blue"
                    });
                    break;
                case "grade":
                    props.push({
                        field: "grade",
                        name: "客户等级",
                        prop: "grade",
                        clazz: "grey"
                    });
                    break;
                case "creater":
                    props.push({
                        field: "creater",
                        name: "创建人",
                        prop: "creater.currentName",
                        clazz: "grey",
                        click: function(btn, v) {

                            tools.personel.info(btn, v.creater.userId);
                        }
                    });
                    break;
                case "createTime":
                    props.push({
                        field: "createTime",
                        name: "创建时间",
                        prop: "createTime",
                        clazz: "green"
                    });
                    break;
                case "belonger":
                    props.push({
                        field: "belonger",
                        name: "归属人",
                        prop: "belonger.currentName",
                        clazz: "grey",
                        click: function(btn, v) {

                            tools.personel.info(btn, v.belonger.userId);
                        }
                    });
                    break;
                case "department":
                    props.push({
                        field: "department",
                        name: "归属部门",
                        prop: "department.name",
                        clazz: "grey",
                        click: function(btn, v) {

                            tools.department.info(btn, v.department.did);
                        }
                    });
                    break;
                case "region":
                    props.push({
                        field: "region",
                        name: "归属分区",
                        prop: "region.name",
                        clazz: "grey",
                        click: function(btn, v) {

                            tools.department.info(btn, v.region.did);
                        }
                    });
                    break;
                case "designer":
                    props.push({
                        field: "designer",
                        name: "归属设计",
                        prop: function(v) { return com.checkNull(v.designer.currentName, '无'); },
                        clazz: "grey",
                        click: function(btn, v) {

                            tools.personel.info(btn, v.designer.userId);
                        }
                    });
                    break;
                case "salesman":
                    props.push({
                        field: "salesman",
                        name: "归属业务",
                        prop: function(v) { return com.checkNull(v.salesman.currentName, '无'); },
                        clazz: "grey",
                        click: function(btn, v) {

                            tools.personel.info(btn, v.salesman.userId);
                        }
                    });
                    break;
                case "decorationBusitype":
                    props.push({
                        field: "decorationBusitype",
                        name: "业务类型",
                        prop: function(v) { return com.checkNull(customerOrigine.decorationBusitypeList[v.decorationBusitype.dbid], '无'); },
                        clazz: "grey"
                    });
                    break;
                case "village":
                    props.push({
                        field: "village",
                        name: "楼盘名",
                        prop: function(v) { return com.checkNull(v.village.name, '无'); },
                        clazz: "grey"
                    });
                    break;
                case "houseNumber":
                    props.push({
                        field: "houseNumber",
                        name: "楼牌号",
                        prop: "houseNumber",
                        clazz: "blue"
                    });
                    break;
                case "buildArea":
                    props.push({
                        field: "buildArea",
                        name: "建筑面积",
                        prop: "buildArea",
                        clazz: "blue"
                    });
                    break;
                case "freeArea":
                    props.push({
                        field: "freeArea",
                        name: "赠送面积",
                        prop: "freeArea",
                        clazz: "blue"
                    });
                    break;
                case "totalArea":
                    props.push({
                        field: "totalArea",
                        name: "总面积",
                        prop: "totalArea",
                        clazz: "blue"
                    });
                    break;
                case "innerArea":
                    props.push({
                        field: "innerArea",
                        name: "计价面积",
                        prop: "innerArea",
                        clazz: "blue"
                    });
                    break;
                case "orderId":
                    props.push({
                        field: "orderId",
                        name: "装修单号",
                        prop: function(v) { return com.checkNull(v.orderId, '无'); },
                        clazz: "blue"
                    });
                    break;
                case "status":
                    props.push({
                        field: "status",
                        name: "状态",
                        prop: function(v) { return constant.customer().customerOrigine.status.keys[v.status]; },
                        clazz: "red"
                    });
                    break;
                case "source":
                    props.push({
                        field: "source",
                        name: "来源方",
                        prop: "source",
                        clazz: "grey"
                    });
                    break;
                case "contact":
                    props.push({
                        field: "contact",
                        name: "对接人",
                        prop: "contact",
                        clazz: "grey"
                    });
                    break;
                case "referOrderId":
                    props.push({
                        field: "referOrderId",
                        name: "推荐单号",
                        prop: "referOrderId",
                        clazz: "blue"
                    });
                    break;
                case "comment":
                    props.push({
                        field: "comment",
                        name: "备注",
                        prop: function(v) { return com.checkNull(v.comment, '无'); },
                        clazz: "grey"
                    });
                    break;
            }
        });

        return props;
    })();

    var linebtns = (function() {

        var btns = {};

        var pageBtn = customerOrigine.pageConfig.pageBtn;

        var showInit = function(v) {
            return pageBtn.contains("edit") || pageBtn.contains("bind") || pageBtn.contains("firstApprove") || pageBtn.contains("directFirst") || pageBtn.contains("free");
        };

        var showCommit = function(v) {
            return pageBtn.contains("code") || pageBtn.contains("confirm");
        };

        var showConfirmRefuse = function(v) {
            return pageBtn.contains("approve") || pageBtn.contains("directTran");
        };

        var showBackoutStatus = function(v) {
            return [constant.customer().customerOrigine.STATUS_COMMIT_INT, constant.customer().customerOrigine.STATUS_CONFIRM_INT, constant.customer().customerOrigine.STATUS_REFUSE_INT].contains(v.status);
        };

        if (pageBtn.contains("edit")) {
            btns.view = {
                name: "编辑",
                clazz: "btn-yellow",
                show: function(v) { return v.status == constant.customer().customerOrigine.STATUS_INIT_INT; },
                handle: function(v) {

                    customerOrigine.currentCustomerOrigine = v;

                    customerOrigine.items.villageNo.attr("readOnly", "readOnly");
                    customerOrigine.items.houseNumber.attr("readOnly", "readOnly");
                    customerOrigine.items.name.attr("readOnly", "readOnly");
                    customerOrigine.items.phone.attr("readOnly", "readOnly");
                    customerOrigine.items.totalArea.attr("readOnly", "readOnly");

                    editcustomerOrigin(v);
                }
            };
        }

        if (pageBtn.contains("bind")) {
            btns.bind = {
                name: "绑定",
                clazz: "btn-success",
                show: function(v) { return v.status == constant.customer().customerOrigine.STATUS_INIT_INT; },
                handle: function(v) {

                    customerOrigine.currentCustomerOrigine = v;
                    v.designer != null ? com.updateTypeahead("designer", v.designer.userId, v.designer.currentName) : com.cleanTypeahead("designer");
                    v.salesman != null ? com.updateTypeahead("salesmanBind", v.salesman.userId, v.salesman.currentName) : com.cleanTypeahead("salesmanBind");
                    v.decorationBusitype != null ? customerOrigine.items.decorationBusitype.val(v.decorationBusitype.dbid) : "";
                    com.updateTypeahead('villageNoBind', v.village.no, v.village.name + "-" + v.village.cityProper.name);
                    customerOrigine.items.houseNumberBind.val(v.houseNumber);
                    customerOrigine.items.nameBind.val(v.name);
                    customerOrigine.items.phoneBind.val(v.phone);
                    customerOrigine.modals.bindAllInfoModal.modal("show");
                }
            };
        }

        if (pageBtn.contains("firstApprove")) {
            btns.firstApprove = {
                name: "初审",
                clazz: "btn-blue",
                show: function(v) { return v.status == constant.customer().customerOrigine.STATUS_INIT_INT; },
                handle: function(v) {

                    initqueryApprovalUserForCheckbox("firstApproveMan", 17);
                    customerOrigine.currentCustomerOrigine = v;
                    customerOrigine.modals.commitFirstApprove.modal("show");
                }
            };
        }

        if (pageBtn.contains("directFirst")) {
            btns.directFirst = {
                name: "直接初审",
                clazz: "btn-primary",
                show: function(v) { return v.status == constant.customer().customerOrigine.STATUS_INIT_INT; },
                handle: function(v) {

                    com.showConfirm("是否确认直接初审该客源？", function() {

                        com.post(api.customer.approveCustomerOrigin, {
                            "customerOrigin.csid": v.csid
                        }, function(res) {

                            if (res.errorCode == 0) {
                                com.showAlert(com.info, "直接初审成功！");
                                searcher.doSearch();
                            } else {
                                com.showAlert(com.error, "直接初审失败：" + res.errorMsg);
                            }
                        });
                    });
                }
            };
        }

        if (pageBtn.contains("free")) {
            btns.release = {
                name: "释放",
                clazz: "btn-warning",
                show: function(v) { return v.status == constant.customer().customerOrigine.STATUS_INIT_INT; },
                handle: function(v) {

                    if (v.belonger.userId == null) {
                        com.showAlert(com.warning, "无归属人信息!");
                        return false;
                    }
                    release(v.csid);
                }
            };
        }

        if (pageBtn.contains("code")) {
            btns.code = {
                name: "二维码",
                clazz: "btn-info",
                show: function(v) { return v.status == constant.customer().customerOrigine.STATUS_COMMIT_INT; },
                handle: function(v) {

                    com.focusPage('#code').html("");

                    com.focusPage('#code').qrcode({
                        render: "canvas",
                        width: 150,
                        height: 150,
                        text: "http://fanglin.vip/wx/origine?csid=" + v.csid
                    });

                    customerOrigine.modals.codeModal.modal('show');
                }
            };
        }

        if (pageBtn.contains("confirm")) {
            btns.confirm = {
                name: "确认",
                clazz: "btn-inverse",
                show: function(v) { return v.status == constant.customer().customerOrigine.STATUS_COMMIT_INT; },
                handle: function(v) {

                    com.showConfirm("确认客源信息", function() {

                        com.post(api.customer.confirmCustomerOrigin, {
                            "customerOrigin.csid": v.csid
                        }, function(res) {

                            searcher.doSearch();
                            com.showAlert(com.info, "确认成功!");
                        });
                    });
                }
            };
        }

        if (pageBtn.contains("approve")) {
            btns.approval = {
                name: "审批",
                clazz: "btn-success",
                show: function(v) {
                    return [constant.customer().customerOrigine.STATUS_CONFIRM_INT, constant.customer().customerOrigine.STATUS_REFUSE_INT].contains(v.status);
                },
                handle: function(v) {

                    initqueryApprovalUserForCheckbox("approveMan", 14);
                    customerOrigine.currentCustomerOrigine = v;
                    customerOrigine.items.villageNoDesiger.prop("disabled", true);
                    customerOrigine.items.houseNumberApprove.attr("disabled", "disabled");
                    customerOrigine.items.nameApprove.attr("disabled", "disabled");
                    customerOrigine.items.phoneApprove.attr("disabled", "disabled");

                    v.salesman != null ? com.updateTypeahead("salesman", v.salesman.userId, v.salesman.currentName) : com.cleanTypeahead("salesman");
                    v.decorationBusitype != null ? customerOrigine.items.salesmanType.val(v.decorationBusitype.dbid) : "";
                    com.updateTypeahead('villageNoDesiger', v.village.no, v.village.name + "-" + v.village.cityProper.name);
                    customerOrigine.items.houseNumberApprove.val(v.houseNumber);
                    customerOrigine.items.nameApprove.val(v.name);
                    customerOrigine.items.phoneApprove.val(v.phone);
                    customerOrigine.modals.commitApproveModal.modal("show");
                }
            };
        }

        if (pageBtn.contains("directTran")) {
            btns.directTran = {
                name: "直接转单",
                clazz: "btn-purple",
                show: function(v) {
                    return [constant.customer().customerOrigine.STATUS_CONFIRM_INT, constant.customer().customerOrigine.STATUS_REFUSE_INT].contains(v.status);
                },
                handle: function(v) {

                    customerOrigine.currentCustomerOrigine = v;
                    com.clearValidator();

                    // 填充楼盘信息
                    if (v.village != null) {
                        com.updateTypeahead('directVillageNoDesiger', v.village.no, v.village.name + "-" + v.village.cityProper.name);
                    } else {
                        com.cleanTypeahead('directVillageNoDesiger');
                    }

                    // 填充楼牌号
                    customerOrigine.items.directHouseNumberApprove.val(v.houseNumber != null ? v.houseNumber : '');

                    // 填充姓名和电话
                    customerOrigine.items.directNameApprove.val(v.name != null ? v.name : '');
                    customerOrigine.items.directPhoneApprove.val(v.phone != null ? v.phone : '');

                    // 填充业务员
                    if (v.salesman != null) {
                        com.updateTypeahead("directSalesman", v.salesman.userId, v.salesman.currentName);
                    } else {
                        com.cleanTypeahead("directSalesman");
                    }

                    // 填充业务类型
                    if (v.decorationBusitype != null) {
                        customerOrigine.items.directSalesmanType.val(v.decorationBusitype.dbid);
                    } else {
                        customerOrigine.items.directSalesmanType.val('');
                    }

                    // 填充房屋类别 (期房/现房)
                    if (v.houseType != null) {
                        customerOrigine.items.directHouseType.val(v.houseType);
                    } else {
                        customerOrigine.items.directHouseType.val('期房'); // 默认值
                    }

                    // 填充房屋类型
                    if (v.houseClass != null) {
                        customerOrigine.items.directHouseClass.val(v.houseClass);
                    } else {
                        customerOrigine.items.directHouseClass.val('');
                    }

                    // 填充订单类型 - 使用 decorationTypes 映射
                    if (v.decorationBusitype != null) {
                        var typeValue = null;
                        $.each(customerOrigine.decorationAtttypes, function(i, attType) {
                            if (attType.dbid == v.decorationBusitype.dbid && attType.status == constant.decoration().decorationAtttype.status.STATUS_ENABLE_INT) {
                                typeValue = attType.key;
                                return false; // 找到后退出循环
                            }
                        });
                        if (typeValue != null) {
                            customerOrigine.items.directOrderType.val(typeValue);
                        } else {
                            customerOrigine.items.directOrderType.val('');
                        }
                    } else {
                        customerOrigine.items.directOrderType.val('');
                    }

                    // 填充订单状态 (资源类型)
                    if (v.resourceType != null) {
                        customerOrigine.items.directResourceType.val(v.resourceType);
                    } else {
                        customerOrigine.items.directResourceType.val('');
                    }

                    customerOrigine.modals.directTranModal.modal("show");
                }
            };
        }

        if (pageBtn.contains("backout")) {
            btns.backout = {
                name: "撤销",
                clazz: "btn-danger",
                show: function(v) {
                    return [constant.customer().customerOrigine.STATUS_COMMIT_INT, constant.customer().customerOrigine.STATUS_CONFIRM_INT, constant.customer().customerOrigine.STATUS_REFUSE_INT].contains(v.status);
                },
                handle: function(v) {

                    com.showConfirm("是否确认撤销客源", function() {

                        com.post(api.customer.cancelCustomerOrigin, {
                            "customerOrigin.csid": v.csid
                        }, function(res) {

                            searcher.doSearch();
                            com.showAlert(com.info, "撤销成功!");
                        });
                    });
                }
            };
        }

        if (pageBtn.contains("record")) {
            btns.record = {
                name: "记录",
                clazz: "btn-pink",
                handle: function(v) {

                    params.customer.csid = v.csid;
                    com.popup4page('#customerRecordPopup', api.index.customerOriginRecord.url, "记录内容");
                }
            };
        }

        if (pageBtn.contains("belonger")) {
            btns.belonger = {
                name: "归属",
                clazz: "btn-yellow",
                handle: function(v) {

                    customerOrigine.csid = v.csid;
                    com.updateTypeahead("belonger", v.belonger.userId, com.checkNull(v.belonger.userName, ''));
                    customerOrigine.modals.customerorigineforbelonger.modal("show");
                }
            };
        }

        if (pageBtn.contains("btnclaim")) {
            btns.claim = {
                name: "认领",
                clazz: "btn-yellow",
                handle: function(v) {

                    btnclaim(v);
                }
            };
        }

        return btns;
    })();

    var buttons = (function() {

        if (customerOrigine.pageConfig.pageBtn.contains("created")) {
            var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('创建').appendTo($adda);

            return [$adda];
        }

        return [];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", customerOrigine.pageConfig.apiPage, {
        "user": params['urlLoadParams'].depage
    }, customerOrigine.pageConfig.condArr, customerOrigine.pageConfig.postDataName, null, false, buttons);
    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#add").click(function() {

        com.cleanItems(customerOrigine.items);
        customerOrigine.items.freeArea1.val(0);
        customerOrigine.items.innerArea1.val(0);
        customerOrigine.modals.createSourceModal.modal("show");
    });

    function editcustomerOrigin(d) {

        customerOrigine.items.name.val(d.name);
        customerOrigine.items.gender.val(d.gender);
        customerOrigine.items.phone.val(d.phone);
        customerOrigine.items.purpose.val(d.purpose);
        customerOrigine.items.intention.val(d.intention);
        customerOrigine.items.price.val(d.price);
        customerOrigine.items.grade.val(d.grade);
        customerOrigine.items.comment.val(d.comment);
        customerOrigine.items.houseNumber.val(d.houseNumber);
        customerOrigine.items.buildArea.val(d.buildArea);
        customerOrigine.items.freeArea.val(d.freeArea);
        customerOrigine.items.totalArea.val(d.totalArea);
        customerOrigine.items.innerArea.val(d.innerArea);

        if (d.gender == "女") {
            customerOrigine.items.gender.prop("checked", true);
        }

        if (d.gender == "男") {
            customerOrigine.items.gender.prop("checked", false);
        }

        if (d.village != null && d.village.name != null) {
            com.updateTypeahead('villageNo', d.village.no, d.village.name + "-" + d.village.cityProper.name);
        } else {
            com.cleanTypeahead('villageNo');
        }
        customerOrigine.modals.sustomerSourceModal.modal("show");
    }

    // 编辑
    function customerUpdate() {

        if (com.validate("sustomersource")) {
            return false;
        }

        var options = {
            "customerOrigin.csid": customerOrigine.currentCustomerOrigine.csid,
            "customerOrigin.name": customerOrigine.items.name.val(),
            "customerOrigin.gender": com.genderType[customerOrigine.items.gender.prop("checked")],
            "customerOrigin.phone": customerOrigine.items.phone.val(),
            "customerOrigin.purpose": customerOrigine.items.purpose.val(),
            "customerOrigin.intention": customerOrigine.items.intention.val(),
            "customerOrigin.price": customerOrigine.items.price.val(),
            "customerOrigin.grade": customerOrigine.items.grade.val(),
            "customerOrigin.comment": customerOrigine.items.comment.val(),
            "customerOrigin.village.no": com.typeahead("villageNo"),
            "customerOrigin.buildArea": customerOrigine.items.buildArea.val(),
            "customerOrigin.freeArea": 0,
            "customerOrigin.totalArea": 0,
            "customerOrigin.innerArea": customerOrigine.items.buildArea.val()
        };

        com.post(api.customer.updateCustomerOrigin, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, '修改成功');
            customerOrigine.modals.sustomerSourceModal.modal("hide");
        });
    }

    // 绑定相关信息
    function bindAllInfo(v) {

        if (com.validate("bindAllInfo")) {
            return false;
        }

        var hid = checkHouse();
        var cid = checkCustomer();

        var options = {
            "customerOrigin.csid": customerOrigine.currentCustomerOrigine.csid,
            "customerOrigin.designer.userId": com.typeahead("designer"),
            "customerOrigin.salesman.userId": com.typeahead("salesmanBind"),
            "customerOrigin.decorationBusitype.dbid": customerOrigine.items.decorationBusitype.val(),
            "customerOrigin.house.hid": hid,
            "customerOrigin.customer.cid": cid,
            "customerOrigin.phone": customerOrigine.items.phoneBind.val()
        // 为了避免编辑时修改电话号, 导致客源中和客户中信息对应不上情况
        };

        com.post(api.customer.bindCustomerOrigin, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, '绑定成功');
            customerOrigine.modals.bindAllInfoModal.modal("hide");
        });
    }

    function release(csid) {

        com.showConfirm("是否确认释放客源", function() {

            com.post(api.customer.freeCustomerOrigin, {
                "customerOrigin.csid": csid
            }, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, '释放成功');
            });
        });
    }

    // 检查获取楼盘
    function checkHouse() {

        var hid = "";
        var rulenum = [customerOrigine.items.built.val().trim().toUpperCase(), customerOrigine.items.builtrule.val(), customerOrigine.items.unit.val().trim().toUpperCase(), customerOrigine.items.unitrule.val(), customerOrigine.items.floor.val().trim().toUpperCase(), customerOrigine.items.floorrule.val(), customerOrigine.items.door.val().trim().toUpperCase(), customerOrigine.items.doorrule.val()];

        var houseNumber = houseUtils.creatHouseNumber(rulenum);

        var houseOption = {
            "house.village.no": com.typeahead("villageNoBind"),
            "house.houseNumber": houseNumber,
            "house.built": customerOrigine.items.built.val(),
            "house.unit": customerOrigine.items.unit.val(),
            "house.floor": customerOrigine.items.floor.val(),
            "house.door": customerOrigine.items.door.val(),
            "house.buildArea": customerOrigine.currentCustomerOrigine.buildArea,
            "house.freeArea": customerOrigine.currentCustomerOrigine.freeArea,
            "house.totalArea": customerOrigine.currentCustomerOrigine.totalArea,
            "house.innerArea": customerOrigine.currentCustomerOrigine.innerArea,
            "house.roomNum": customerOrigine.items.houseTypeOne.val(),
            "house.houseType": customerOrigine.items.houseTypeOne.val() + "室" + customerOrigine.items.houseTypeTwo.val() + "厅" + customerOrigine.items.houseTypeThr.val() + "厨" + customerOrigine.items.houseTypeFour.val() + "卫"
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
            "customer.name": customerOrigine.items.nameBind.val(),
            "customer.phone": customerOrigine.items.phoneBind.val(),
            "customer.gender": customerOrigine.currentCustomerOrigine.gender,
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

    // 审批人员信息
    function initqueryApprovalUserForCheckbox(id, type, checkId) {

        var $approvalDiv = com.focusPage('#' + id);

        $approvalDiv.empty();

        com.post(api.approval.queryApproverByType, {
            "approver.type": type
        }, function(res) {

            $.each(res.approvers, function(i, v) {

                var $approvaler = $('<label></label>');
                var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px");
                var $input = $('<input>').attr({
                    "type": "radio",
                    "name": "form-field-radio",
                    "class": "ace",
                    "id": v.userBase.uid,
                    "userId": v.userBase.userId,
                    "userName": v.userBase.userName
                });
                var $span = $('<span></span>').addClass('lbl').html($('<label></label>').attr('style', 'display:inline-block;width:47px;text-align-last:justify;margin-left:10px;padding:0px').text(v.userBase.currentName));
                var $comment = $('<span></span>').addClass("lbl").text(v.comment == null ? " " : v.comment).attr("style", "margin-left:15px");
                $input.appendTo($approvaler);
                $span.appendTo($approvaler);
                $comment.appendTo($approvaler);
                $approvaler.appendTo($div);
                $div.appendTo($approvalDiv);
            });
        });
    }

    // 提交审批
    function customerApproval() {

        if (com.validate("commitApprove")) {
            return false;
        }

        // 审批创建装修单
        var receiverId = com.focusPage("#approveMan").find('input:checked').attr('userid');
        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return false;
        }

        com.showConfirm("是否确认提交审批", function() {

            var option = {
                "approval.receiver.userId": receiverId,
                "approval.comment": customerOrigine.items.approveComment.val(),
                "approvalCustomerOriginTDecoration.customerOrigin.csid": customerOrigine.currentCustomerOrigine.csid,
                "approvalCustomerOriginTDecoration.type": customerOrigine.decorationTypes[customerOrigine.items.orderType.val()],
                "approvalCustomerOriginTDecoration.typeness": customerOrigine.items.orderType.val(),
                "approvalCustomerOriginTDecoration.salesman.userId": com.typeahead("salesman"),
                "approvalCustomerOriginTDecoration.decorationBusitype.dbid": customerOrigine.items.salesmanType.val(),
                "approvalCustomerOriginTDecoration.houseType": customerOrigine.items.houseType.val(),
                "approvalCustomerOriginTDecoration.houseClass": customerOrigine.items.houseClass.val(),
                "approvalCustomerOriginTDecoration.resourceType": customerOrigine.items.resourceType.val()
            };

            com.post(api.approval.submitApprovalForCustomerOriginTDecoration, option, function(res) {

                if (res.errorCode == 0) {
                    com.showAlert(com.info, "操作成功");
                    com.clearValidator();
                    searcher.doSearch();
                    customerOrigine.modals.commitApproveModal.modal("hide");
                } else {
                    com.showAlert(com.error, "提交失败");
                }
            });
        });
    }

    // 提交初审
    function firstApproval() {

        if (com.validate("commitFirstApprove")) {
            return false;
        }

        var firstApproveUserId = com.focusPage("#firstApproveMan").find('input:checked').attr('userid');
        if (firstApproveUserId == null || firstApproveUserId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return false;
        }

        com.showConfirm("是否确认提交审批", function() {

            var option = {
                "approval.receiver.userId": firstApproveUserId,
                "approval.comment": customerOrigine.items.firstApproveComment.val(),
                "approvalCustomerOrigin.csid": customerOrigine.currentCustomerOrigine.csid
            };

            com.post(api.approval.submitApprovalForCustomerOrigin, option, function(res) {

                if (res.errorCode == 0) {
                    com.showAlert(com.info, "操作成功");
                    com.clearValidator();
                    searcher.doSearch();
                    customerOrigine.modals.commitFirstApprove.modal("hide");
                } else {
                    com.showAlert(com.error, "提交失败");
                }
            });
        });
    }

    // 直接转单确认
    function directTranConfirm() {

        if (com.validate("directTran"))
            return false;

        var option = {
            "customerOrigin.csid": customerOrigine.currentCustomerOrigine.csid,
            "customerOrigin.type": customerOrigine.decorationTypes[customerOrigine.items.directOrderType.val()],
            "customerOrigin.typeness": customerOrigine.items.directOrderType.val(),
            "customerOrigin.salesman.userId": com.typeahead("directSalesman"),
            "customerOrigin.decorationBusitype.dbid": customerOrigine.items.directSalesmanType.val(),
            "customerOrigin.houseType": customerOrigine.items.directHouseType.val(),
            "customerOrigin.houseClass": customerOrigine.items.directHouseClass.val(),
            "customerOrigin.resourceType": customerOrigine.items.directResourceType.val()
        };

        com.post(api.customer.tranCustomerOrigin, option, function(res) {

            if (res.errorCode == 0) {
                com.showAlert(com.info, "操作成功");
                com.clearValidator();
                searcher.doSearch();
                customerOrigine.modals.directTranModal.modal("hide");
            } else {
                com.showAlert(com.error, "操作失败");
            }
        });
    }

    // 编辑归属人
    function editBelonger() {

        if (com.validate("customerorigineforbelonger"))
            return false;

        var option = {
            "customerOrigin.csid": customerOrigine.csid,
            "customerOrigin.belonger.userId": com.typeahead("belonger")
        };

        com.post(api.customer.updateCustomerOriginForBelonger, option, function() {

            searcher.doSearch();
            customerOrigine.modals.customerorigineforbelonger.modal("hide");
            com.showAlert(com.info, '修改成功');
        });
    }

    // 认领
    function btnclaim(v) {

        com.showConfirm("是否确定领取客源", function() {

            com.post(api.customer.takeCustomerOrigin, {
                "customerOrigin.csid": v.csid
            }, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, '领取成功');
            });
        });
    }

    // 创建客源
    function saveDate() {

        if (com.validate("customerOrigine"))
            return false;

        var options = {

            "customerOrigin.name": customerOrigine.items.name1.val(),
            "customerOrigin.gender": com.genderType[customerOrigine.items.gender1.prop("checked")],
            "customerOrigin.phone": customerOrigine.items.phone1.val(),
            "customerOrigin.purpose": customerOrigine.items.purpose1.val(),
            "customerOrigin.intention": customerOrigine.items.intention1.val(),
            "customerOrigin.price": customerOrigine.items.price1.val(),
            "customerOrigin.grade": customerOrigine.items.grade1.val(),
            "customerOrigin.comment": customerOrigine.items.comment1.val(),
            "customerOrigin.village.no": com.typeahead("villageNoCreate"),
            "customerOrigin.houseNumber": customerOrigine.items.houseNumber1.val(),
            "customerOrigin.buildArea": customerOrigine.items.buildArea1.val(),
            "customerOrigin.freeArea": 0,
            "customerOrigin.totalArea": 0,
            "customerOrigin.innerArea": customerOrigine.items.buildArea1.val(),
            "customerOrigin.designer.userId": com.typeahead("designer1"),
            "customerOrigin.salesman.userId": com.typeahead("salesman1"),
            "customerOrigin.decorationBusitype.dbid": customerOrigine.items.decorationBusitype1.val()
        };

        com.post(api.customer.addCustomerOrigin, options, function(res) {

            com.showAlert(com.info, "客源创建成功");
            deleteDate();
            customerOrigine.modals.createSourceModal.modal("hide");
        });
    }

    // 重置客源
    function deleteDate() {

        com.cleanTypeahead("villageNoCreate");
        com.cleanItems(customerOrigine.items);
        com.cleanItems(customerOrigine.customerItems);
        com.focusPage("#rule").html("");
        customerOrigine.items.freeArea1.val(0);
        customerOrigine.items.innerArea1.val(0);
    }

    function getTotalArea() {

        var buildArea = parseFloat(customerOrigine.items.buildArea.val());
        var freeArea = parseFloat(customerOrigine.items.freeArea.val());
        customerOrigine.items.totalArea.val(utils.accAdd(buildArea, freeArea));
    }

    function getTotalArea1() {

        var buildArea1 = parseFloat(customerOrigine.items.buildArea1.val());
        var freeArea1 = parseFloat(customerOrigine.items.freeArea1.val());
        customerOrigine.items.totalArea1.val(utils.accAdd(buildArea1, freeArea1));
    }
});