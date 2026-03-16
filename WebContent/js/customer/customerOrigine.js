$(function() {

    var customerOrigine = {

        saveDesignerBtn: com.focusPage("#saveDesignerBtn", "#customerOrigine"),
        updateAndApprovalBtn: com.focusPage("#updateAndApprovalBtn", "#customerOrigine"),
        approvalBtn: com.focusPage("#approvalBtn", "#customerOrigine"),
        firstApprovalBtn: com.focusPage("#firstApprovalBtn", "#customerOrigine"),
        belongerBtn: com.focusPage("#belongerBtn", "#customerOrigine"),
        saveBtn: com.focusPage("#saveBtn", "#customerOrigine"),
        cancelBtn1: com.focusPage("#cancelBtn1", "#customerOrigine"),
        directFirstApproveBtn: com.focusPage("#directFirstApproveBtn", "#customerOrigine"),
        directTranBtn: com.focusPage("#directTranBtn", "#customerOrigine"),

        modals: {
            bindAllInfoModal: com.focusPage("#bindAllInfo", "#customerOrigine"),
            sustomerSourceModal: com.focusPage("#sustomersource", "#customerOrigine"),
            commitApproveModal: com.focusPage("#commitApprove", "#customerOrigine"),
            codeModal: com.focusPage("#codeModal", "#customerOrigine"),
            commitFirstApprove: com.focusPage("#commitFirstApprove", "#customerOrigine"),
            customerorigineforbelonger: com.focusPage("#customerorigineforbelonger", "#customerOrigine"),
            createSourceModal: com.focusPage("#createsource", "#customerOrigine"),
            directFirstApproveModal: com.focusPage("#directFirstApproveModal", "#customerOrigine"),
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

            directFirstApproveComment: com.focusPage("#directFirstApproveComment", "#customerOrigine"),
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
    customerOrigine.directFirstApproveBtn.bindClick(directFirstApproveConfirm);
    customerOrigine.directTranBtn.bindClick(directTranConfirm);

    customerOrigine.items.gender.switchBtn("gender");
    customerOrigine.items.grade.bindData(customerOrigine.grade, "key", "value", false);

    customerOrigine.items.gender1.switchBtn("gender1");
    customerOrigine.items.grade1.bindData(customerOrigine.grade1, "key", "value", false);

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        var decorationBusitypes = [];

        $.each(res.decorationBusitypes, function(index, value) {

            if (value.status == 0) {
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

            if (value.status == 0) {
                decorationBusitypes.push(value);
            }
            customerOrigine.decorationBusitypeList[value.dbid] = value.name;
        });

        customerOrigine.items.salesmanType.bindData(decorationBusitypes, 'dbid', 'name');
        customerOrigine.items.decorationBusitype1.bindData(decorationBusitypes, 'dbid', 'name');
    }, null, false);

    com.post(api.ds.building, {}, function(res) {

        customerOrigine.items.builtrule.bindData(res.buildruleOne, "key", "value");
        customerOrigine.items.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerOrigine.items.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerOrigine.items.doorrule.bindData(res.buildruleThr, "key", "value");
    }, null, false);

    customerOrigine.items.houseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerOrigine.items.resourceType.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    com.post(api.data.queryDecorationAtttype, {}, function(res) {

        $.each(res.decorationAtttypes, function(i, v) {

            customerOrigine.decorationTypes[v.key] = v.type;

            if (v.status == 0) {
                customerOrigine.decorationAtttypes.push(v);
            }
        });

        customerOrigine.items.orderType.bindData(customerOrigine.decorationAtttypes, 'key', 'name', "请选择");
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
    customerOrigine.pageConfig = getConfig(params['urlLoadParams'].depage);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix ');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCode = $("<a></a>").addClass("btn btn-minier btn-info").html("二维码");
            var $btnView = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");
            var $btnBind = $("<a></a>").addClass("btn btn-minier btn-success").html("绑定");
            var $release = $("<a></a>").addClass("btn btn-minier btn-warning").html("释放");
            var $record = $("<a></a>").addClass("btn btn-minier btn-pink").html("记录");
            var $firstApprove = $("<a></a>").addClass("btn btn-minier btn-blue").html("初审");
            var $backout = $("<a></a>").addClass("btn btn-minier btn-danger").html("撤销");
            var $confirm = $("<a></a>").addClass("btn btn-minier btn-inverse").html("确认");
            var $btnApproval = $("<a></a>").addClass("btn btn-minier btn-success").html("审批");
            var $directFirst = $("<a></a>").addClass("btn btn-minier btn-primary").html("直接初审");
            var $directTran = $("<a></a>").addClass("btn btn-minier btn-purple").html("直接转单");
            var $belonger = $("<a></a>").addClass("btn btn-minier btn-yellow").html("归属");
            var $btnclaim = $("<a></a>").addClass("btn btn-minier btn-yellow").html("认领");

            var propertyArr = getPropertyArr(v);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            if (v.status == constant.customer().customerOrigine.STATUS_INIT_INT) {
                if (customerOrigine.pageConfig.pageBtn.contains("edit"))
                    $divBtnWrap.append($btnView);
                if (customerOrigine.pageConfig.pageBtn.contains("bind"))
                    $divBtnWrap.append($btnBind);
                if (customerOrigine.pageConfig.pageBtn.contains("firstApprove"))
                    $divBtnWrap.append($firstApprove);
                if (customerOrigine.pageConfig.pageBtn.contains("directFirst"))
                    $divBtnWrap.append($directFirst);
                if (customerOrigine.pageConfig.pageBtn.contains("free"))
                    $divBtnWrap.append($release);
            } else if (v.status == constant.customer().customerOrigine.STATUS_COMMIT_INT) {
                if (customerOrigine.pageConfig.pageBtn.contains("code"))
                    $divBtnWrap.append($btnCode);
                if (customerOrigine.pageConfig.pageBtn.contains("confirm"))
                    $divBtnWrap.append($confirm);
            } else if ([constant.customer().customerOrigine.STATUS_CONFIRM_INT, constant.customer().customerOrigine.STATUS_REFUSE_INT].contains(v.status)) {
                if (customerOrigine.pageConfig.pageBtn.contains("approve"))
                    $divBtnWrap.append($btnApproval);
                if (customerOrigine.pageConfig.pageBtn.contains("directTran"))
                    $divBtnWrap.append($directTran);
            }

            if ([constant.customer().customerOrigine.STATUS_COMMIT_INT, constant.customer().customerOrigine.STATUS_CONFIRM_INT, constant.customer().customerOrigine.STATUS_REFUSE_INT].contains(v.status)) {
                if (customerOrigine.pageConfig.pageBtn.contains("backout"))
                    $divBtnWrap.append($backout);
            }

            if (customerOrigine.pageConfig.pageBtn.contains("record"))
                $divBtnWrap.append($record);
            if (customerOrigine.pageConfig.pageBtn.contains("belonger"))
                $divBtnWrap.append($belonger);
            if (customerOrigine.pageConfig.pageBtn.contains("btnclaim"))
                $divBtnWrap.append($btnclaim);

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            // 二维码
            $btnCode.click(function() {

                com.focusPage('#code').html("");

                com.focusPage('#code').qrcode({
                    render: "canvas",
                    width: 150,
                    height: 150,
                    text: "http://fanglin.vip/wx/origine?csid=" + v.csid
                });

                customerOrigine.modals.codeModal.modal('show');
            });

            // 编辑
            $btnView.click(function() {

                customerOrigine.currentCustomerOrigine = v;

                customerOrigine.items.villageNo.attr("readOnly", "readOnly");
                customerOrigine.items.houseNumber.attr("readOnly", "readOnly");
                customerOrigine.items.name.attr("readOnly", "readOnly");
                customerOrigine.items.phone.attr("readOnly", "readOnly");
                customerOrigine.items.totalArea.attr("readOnly", "readOnly");

                editcustomerOrigin(v);
            });

            $record.click(function() {

                params.customer.csid = v.csid;
                com.popup4page('#customerRecordPopup', api.index.customerOriginRecord.url, "记录内容");
            });

            $release.click(function() {

                if (v.belonger.userId == null) {
                    com.showAlert(com.warning, "无归属人信息!");
                    return false;
                }
                release(v.csid);
            });

            // 绑定信息
            $btnBind.click(function() {

                customerOrigine.currentCustomerOrigine = v;
                v.designer != null ? com.updateTypeahead("designer", v.designer.userId, v.designer.currentName) : com.cleanTypeahead("designer");
                v.salesman != null ? com.updateTypeahead("salesmanBind", v.salesman.userId, v.salesman.currentName) : com.cleanTypeahead("salesmanBind");
                v.decorationBusitype != null ? customerOrigine.items.decorationBusitype.val(v.decorationBusitype.dbid) : "";
                com.updateTypeahead('villageNoBind', v.village.no, v.village.name + "-" + v.village.cityProper.name);
                customerOrigine.items.houseNumberBind.val(v.houseNumber);
                customerOrigine.items.nameBind.val(v.name);
                customerOrigine.items.phoneBind.val(v.phone);
                customerOrigine.modals.bindAllInfoModal.modal("show");
            });

            // 提交客源初审审批
            $firstApprove.click(function() {

                initqueryApprovalUserForCheckbox("firstApproveMan", 17);
                customerOrigine.currentCustomerOrigine = v;
                customerOrigine.modals.commitFirstApprove.modal("show");
            });

            // 直接初审（不走审批流程）
            $directFirst.click(function() {
                customerOrigine.currentCustomerOrigine = v;
                com.clearValidator();
                com.focusPage("#directFirstApproveComment").val("");
                com.focusPage("#directFirstApproveModal").modal("show");
            });

            // 撤销
            $backout.click(function() {

                com.showConfirm("是否确认撤销客源", function() {

                    com.post(api.customer.cancelCustomerOrigin, {
                        "customerOrigin.csid": v.csid
                    }, function(res) {

                        searcher.doSearch();
                        com.showAlert(com.info, "撤销成功!");
                    });
                });
            });

            // 确认
            $confirm.click(function() {

                com.showConfirm("确认客源信息", function() {

                    com.post(api.customer.confirmCustomerOrigin, {
                        "customerOrigin.csid": v.csid
                    }, function(res) {

                        searcher.doSearch();
                        com.showAlert(com.info, "确认成功!");
                    });
                });
            });

            // 审批
            $btnApproval.click(function() {

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
            });

            // 直接转单（不走审批流程）
            $directTran.click(function() {

                customerOrigine.currentCustomerOrigine = v;
                com.clearValidator();

                // 填充表单数据
                com.focusPage("#directVillageNoDesiger").val(com.checkNull(v.villageName, ''));
                com.updateTypeahead("directVillageNoDesiger", v.villageId, com.checkNull(v.villageName, ''));

                if (v.houseNumber != null) {
                    com.focusPage("#directHouseNumberApprove").val(v.houseNumber);
                }
                com.focusPage("#directNameApprove").val(v.name);
                com.focusPage("#directPhoneApprove").val(v.phone);

                if (v.salesman != null) {
                    com.updateTypeahead("directSalesman", v.salesman.userId, com.checkNull(v.salesman.userName, ''));
                }
                if (v.decorationBusitype != null) {
                    com.focusPage("#directSalesmanType").val(v.decorationBusitype.dbid);
                }

                if (v.houseType != null) {
                    com.focusPage("#directHouseType").val(v.houseType);
                }
                if (v.houseClass != null) {
                    com.focusPage("#directHouseClass").val(v.houseClass);
                }

                if (v.decorationBusitype != null) {
                    var typeValue = customerOrigine.getDecorationTypeValue(v.decorationBusitype.dbid);
                    com.focusPage("#directOrderType").val(typeValue);
                }

                if (v.resourceType != null) {
                    com.focusPage("#directResourceType").val(v.resourceType);
                }

                com.focusPage("#directTranModal").modal("show");
            });

            // 编辑归属人
            $belonger.click(function() {

                customerOrigine.csid = v.csid;
                com.updateTypeahead("belonger", v.belonger.userId, com.checkNull(v.belonger.userName, ''));
                customerOrigine.modals.customerorigineforbelonger.modal("show");
            });

            // 认领
            $btnclaim.click(function() {

                btnclaim(v);
            });

            return $liLine;
        };
        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(customerOrigine.pageConfig.condArr, "condList", customerOrigine.pageConfig.apiPage, function(data) {

        displayFunc.init("resultList", data);
    }, "pagenation", customerOrigine.pageConfig.postDataName, {
        "user": params['urlLoadParams'].depage
    }, false, null, function() {

        if (customerOrigine.pageConfig.pageBtn.contains("created")) {
            var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('创建').appendTo($adda);

            return [$adda];
        }

    });

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

    // 直接初审确认
    function directFirstApproveConfirm() {

        var option = {
            "customerOrigin.csid": customerOrigine.currentCustomerOrigine.csid
        };

        com.post(api.customer.approveCustomerOrigin, option, function(res) {

            if (res.errorCode == 0) {
                com.showAlert(com.info, "操作成功");
                com.clearValidator();
                searcher.doSearch();
                customerOrigine.modals.directFirstApproveModal.modal("hide");
            } else {
                com.showAlert(com.error, "操作失败");
            }
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

    function getConfig(page) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "postDataName": page + "PostData",
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subtype) {

            var prop = props.shift();
            if (props.length != 0) {
                if (!o[prop])
                    o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }

            if (subtype == 0) {
                o[prop] = value;
            } else if (subtype == 1 && !o[prop]) {
                o[prop] = [value];
            } else if (subtype == 1 && o[prop]) {
                o[prop].push(value);
            }
        }

        function getApi(o, props) {

            var prop = props.shift();

            if (props.length == 0) {
                return o[prop];
            } else if (o[prop]) {
                return getApi(o[prop], props);
            }
            return "";
        }

        com.post(api.right.queryCustomerOriginFunctionRight, {
            "customerOriginFunctionRight.name": page
        }, function(res) {

            var rights = res.customerOriginFunctionRights.sort(function(a, b) {

                return a.customerOriginFunction.sort - b.customerOriginFunction.sort;
            });

            $.each(rights, function(i, v) {

                var data = v.customerOriginFunction;

                if (data.type == 1)
                    data.value = getApi({
                        "api": api
                    }, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
            });
        }, null, false);

        return pageConfig;
    }

    function getPropertyArr(v) {

        var propertyArr = [];
        $.each(customerOrigine.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "customerPhone":
                    propertyArr.push(["客户电话:", v.phone, "grey"]);
                    break;
                case "gender":
                    propertyArr.push(["性别:", v.gender, "grey"]);
                    break;
                case "purpose":
                    propertyArr.push(["目的: ", v.purpose, "grey"]);
                    break;
                case "intention":
                    propertyArr.push(["风格意向: ", v.intention, "grey"]);
                    break;
                case "price":
                    propertyArr.push(["预计装修价格: ", v.price, "blue"]);
                    break;
                case "grade":
                    propertyArr.push(["客户等级: ", v.grade, "grey"]);
                    break;
                case "creater":
                    propertyArr.push(["创建人: ", v.creater.currentName, "grey", function(btn) {

                        tools.personel.info(btn, v.creater.userId);
                    }]);
                    break;
                case "createTime":
                    propertyArr.push(["创建时间: ", v.createTime, "green"]);
                    break;
                case "belonger":
                    propertyArr.push(["归属人: ", v.belonger.currentName, "grey", function(btn) {

                        tools.personel.info(btn, v.belonger.userId);
                    }]);
                    break;
                case "department":
                    propertyArr.push(["归属部门: ", v.department.name, "grey", function(btn) {

                        tools.department.info(btn, v.department.did);
                    }]);
                    break;
                case "region":
                    propertyArr.push(["归属分区: ", v.region.name, "grey", function(btn) {

                        tools.department.info(btn, v.region.did);
                    }]);
                    break;
                case "designer":
                    propertyArr.push(["归属设计: ", com.checkNull(v.designer.currentName, '无'), "grey", function(btn) {

                        tools.personel.info(btn, v.designer.userId);
                    }]);
                    break;
                case "salesman":
                    propertyArr.push(["归属业务: ", com.checkNull(v.salesman.currentName, '无'), "grey", function(btn) {

                        tools.personel.info(btn, v.salesman.userId);
                    }]);
                    break;
                case "decorationBusitype":
                    propertyArr.push(["业务类型: ", com.checkNull(customerOrigine.decorationBusitypeList[v.decorationBusitype.dbid], '无'), "grey"]);
                    break;
                case "village":
                    propertyArr.push(["楼盘名: ", com.checkNull(v.village.name, '无'), "grey"]);
                    break;
                case "houseNumber":
                    propertyArr.push(["楼牌号: ", v.houseNumber, "blue"]);
                    break;
                case "buildArea":
                    propertyArr.push(["建筑面积: ", v.buildArea, "blue"]);
                    break;
                case "freeArea":
                    propertyArr.push(["赠送面积: ", v.freeArea, "blue"]);
                    break;
                case "totalArea":
                    propertyArr.push(["总面积: ", v.totalArea, "blue"]);
                    break;
                case "innerArea":
                    propertyArr.push(["计价面积: ", v.innerArea, "blue"]);
                    break;
                case "orderId":
                    propertyArr.push(["装修单号: ", com.checkNull(v.orderId, '无'), "blue"]);
                    break;
                case "status":
                    propertyArr.push(["状态: ", constant.customer().customerOrigine.status.keys[v.status], "red"]);
                    break;
                case "source":
                    propertyArr.push(["来源方: ", v.source, "grey"]);
                    break;
                case "contact":
                    propertyArr.push(["对接人: ", v.contact, "grey"]);
                    break;
                case "referOrderId":
                    propertyArr.push(["推荐单号: ", v.referOrderId, "blue"]);
                    break;
                case "comment":
                    propertyArr.push(["备注: ", com.checkNull(v.comment, '无'), "grey"]);
                    break;
            }
        });
        return propertyArr;
    }
});