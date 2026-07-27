jQuery(function($) {

    var buildingCustomer = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            cancelBtn: com.focusPage("#cancelBtn"),
            bsaveBtn: com.focusPage("#bsaveBtn")
        },
        modals: {
            buildingCustomerModal: com.focusPage("#buildingCustomerModal"),
            buildingModal: com.focusPage("#buildingModal")
        },
        items: {
            csType: com.focusPage("#csType"),
            purpose: com.focusPage("#purpose"),
            intention: com.focusPage("#intention"),
            priceLow: com.focusPage("#priceLow"),
            priceHigh: com.focusPage("#priceHigh"),
            areaLow: com.focusPage("#areaLow"),
            areaHigh: com.focusPage("#areaHigh"),
            familyType: com.focusPage("#familyType"),
            orientation: com.focusPage("#orientation"),
            conditions: com.focusPage("#conditions"),
            grade: com.focusPage("#grade"),
            comment: com.focusPage("#comment"),
            gender: com.focusPage("#gender")
        },
        customerItems: {
            customerName: com.focusPage("#customerName"),
            cardType: com.focusPage("#cardType"),
            cardNum: com.focusPage("#cardNum"),
            gender: com.focusPage("#gender"),
            qq: com.focusPage("#qq"),
            wechat: com.focusPage("#wechat"),
            email: com.focusPage("#email"),
            relationshipType: com.focusPage("#relationshipType"),
            address: com.focusPage("#address"),
            phone: com.focusPage("#phone")
        },
        buildItems: {
            hsNo: com.focusPage("#hsNo"),
            csNo: com.focusPage("#csNo"),
            hsAUser: com.focusPage("#hsAUser"),
            csAUser: com.focusPage("#csAUser"),
            signingTime: com.focusPage("#signingTime"),
            tradePrice: com.focusPage("#tradePrice"),
            downpayment: com.focusPage("#downpayment"),
            loanPrice: com.focusPage("#loanPrice"),
            payType: com.focusPage("#payType"),
            balanceStatus: com.focusPage("#balanceStatus")
        },

        hsid: null,
        csid: null,
        csStatus: null,
        orientation: [],
        payType: [],
        balanceStatus: [],
        csType: [],
        editFlg: false,
        buildingJson: null,
        priceFlg: false,
        areaFlg: false,
        editFlag: false,
        dataFlag: false
    };

    com.datetime(buildingCustomer.buildItems.signingTime);

    com.initTypeahead('hsAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
    com.initTypeahead('csAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");

    buildingCustomer.items.gender.switchBtn("gender");
    buildingCustomer.btns.saveBtn.on("click", updateBuildingCustomer);
    buildingCustomer.btns.cancelBtn.on("click", deleteDate);
    buildingCustomer.btns.bsaveBtn.on("click", saveBuildingData);

    buildingCustomer.modals.buildingCustomerModal.on("hide.bs.modal", function() {

        com.cleanItems(buildingCustomer.customerItems);
        com.closeTip();
    });

    buildingCustomer.modals.buildingModal.on("hide.bs.modal", function() {

        com.cleanItems(buildingCustomer.buildItems);
        com.cleanTypeahead("hsAUser");
        com.cleanTypeahead("csAUser");
        com.closeTip();
    });

    buildingCustomer.grade = constant.building().buildingCustomer.grade.keys;

    buildingCustomer.items.grade.bindData(constant.building().buildingCustomer.grade.datas, "key", "value", false);

    buildingCustomer.cardType = constant.building().building.cardType.keys;

    buildingCustomer.customerItems.cardType.bindData(constant.building().building.cardType.datas, "key", "value", false);

    buildingCustomer.items.orientation.bindData(constant.building().house.orientation.datas, "key", "value");
    buildingCustomer.items.csType.bindData(constant.building().buildingCustomer.type.datas, "key", "value");
    buildingCustomer.buildItems.payType.bindData(constant.building().building.payType.datas, "key", "value");
    buildingCustomer.buildItems.balanceStatus.bindData(constant.building().building.balanceStatus.datas, "key", "value");

    $.each(constant.building().house.orientation.datas, function(i, v) {

        buildingCustomer.orientation[v.key] = v.value;
    });
    $.each(constant.building().buildingCustomer.type.datas, function(i, v) {

        buildingCustomer.csType[v.key] = v.value;
    });
    $.each(constant.building().building.payType.datas, function(i, v) {

        buildingCustomer.payType[v.key] = v.value;
    });
    $.each(constant.building().building.balanceStatus.datas, function(i, v) {

        buildingCustomer.balanceStatus[v.key] = v.value;
    });

    var relationshipTypes = constant.customer().customer.relationshipType.datas;
    if (relationshipTypes && relationshipTypes.length) {
        $.each(relationshipTypes, function(i, v) {

            $('<option></option>').attr("value", v.key).html(v.value).appendTo(com.focusPage("#relationshipType"));
        });
    }

    com.focusPage("#hsNo").on("blur", function() {

        com.post(api.building.queryBuildingHouseByNo, {
            "buildingHouse.no": buildingCustomer.buildItems.hsNo.val()
        }, function(res) {

            if (res.buildingHouse.status != 3) {
                buildingCustomer.dataFlag = true;
                com.showTip(com.focusPage("#hsNo"), "房源处于待审核、已签约或失效状态, 无法签约", "right");
            } else {
                buildingCustomer.dataFlag = false;
                buildingCustomer.hsid = res.buildingHouse.hsid;
            }
        }, function(data) {

            com.showTip(com.focusPage("#hsNo"), "请正确输入房源编号", "right");
            buildingCustomer.dataFlag = true;
        }, false);
    });

    buildingCustomer.modal = com.focusPage("#buildingCustomerModal");
    buildingCustomer.modal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });

    var lineprops = (function() {

        return [{
            field: "type",
            name: "客户类型",
            prop: function(v) { return buildingCustomer.csType[v.type]; },
            clazz: "red"
        }, {
            field: "customer.name",
            name: "客户名",
            prop: "customer.name",
            clazz: "grey"
        }, {
            field: "customer.phone",
            name: "联系电话",
            prop: "customer.phone",
            clazz: "grey"
        }, {
            field: "purpose",
            name: "目的",
            prop: "purpose",
            clazz: "grey"
        }, {
            field: "price",
            name: "需求总价",
            prop: "price",
            clazz: "blue"
        }, {
            field: "area",
            name: "需求面积",
            prop: "area",
            clazz: "blue"
        }, {
            field: "familyType",
            name: "需求户型",
            prop: function(v) { return v.familyType + "室"; },
            clazz: "grey"
        }, {
            field: "orientation",
            name: "朝向",
            prop: function(v) { return buildingCustomer.orientation[v.orientation]; },
            clazz: "grey"
        }, {
            field: "conditions",
            name: "意向备注",
            prop: "conditions",
            clazz: "grey"
        }, {
            field: "grade",
            name: "客户等级",
            prop: "grade",
            clazz: "grey"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            view: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    buildingCustomer.editFlag = true;
                    buildingCustomer["buildingCustomer.csid"] = v.csid;
                    buildingCustomer.csStatus = v.status;

                    com.focusPage("#cancelBtn").css("display", "none");

                    // 绑定数据
                    com.post(api.building.queryBuildingCustomerByCsid, {
                        "buildingCustomer.csid": v.csid
                    }, function(res) {

                        var buildingCustomers = res.buildingCustomer;
                        buildingCustomer.items.csType.prop("disabled", true);

                        buildingCustomer.items.csType.val(buildingCustomers.type);
                        buildingCustomer.items.purpose.val(buildingCustomers.purpose);
                        var _tagOne = com.focusPage('#intention').data('tag');

                        if (_tagOne) {
                            while (_tagOne.values.length > 0) {
                                _tagOne.remove(0)
                            }
                            if (buildingCustomers.intention && buildingCustomers.intention != "") {
                                var intentionList = buildingCustomers.intention.split(",");
                                if (intentionList.length) {
                                    $.each(intentionList, function(i, v) {

                                        _tagOne.fladd(v, v);
                                    });
                                }
                            }
                        }
                        buildingCustomer.items.priceLow.val(buildingCustomers.price.split(",")[0]);
                        buildingCustomer.items.priceHigh.val(buildingCustomers.price.split(",")[1]);
                        buildingCustomer.items.areaLow.val(buildingCustomers.area.split(",")[0]);
                        buildingCustomer.items.areaHigh.val(buildingCustomers.area.split(",")[1]);
                        buildingCustomer.items.familyType.val(buildingCustomers.familyType);
                        buildingCustomer.items.orientation.val(buildingCustomers.orientation);
                        var _tag = com.focusPage('#conditions').data('tag');

                        if (_tag) {
                            while (_tag.values.length > 0) {
                                _tag.remove(0)
                            }

                            if (buildingCustomers.conditions && buildingCustomers.conditions != "") {
                                var conditionList = buildingCustomers.conditions.split(",");
                                if (conditionList.length) {
                                    $.each(conditionList, function(i, v) {

                                        _tag.fladd(v, v);
                                    });
                                }
                            }
                        }
                        buildingCustomer.items.grade.val(buildingCustomers.grade);
                        buildingCustomer.items.comment.val(buildingCustomers.comment);

                        buildingCustomer.customerItems.customerName.val(buildingCustomers.customer.name);
                        // 证件类型需要判断
                        if (buildingCustomers.customer.identity != null && buildingCustomers.customer.identity != "") {
                            buildingCustomer.customerItems.cardType.val("身份证");
                            buildingCustomer.customerItems.cardNum.val(buildingCustomers.customer.identity);
                        } else if (buildingCustomers.customer.officer != null && buildingCustomers.customer.officer != "") {
                            buildingCustomer.customerItems.cardType.val("军官证");
                            buildingCustomer.customerItems.cardNum.val(buildingCustomers.customer.officer);
                        } else if (buildingCustomers.customer.passport != null && buildingCustomers.customer.passport != "") {
                            buildingCustomer.customerItems.cardType.val("护照");
                            buildingCustomer.customerItems.cardNum.val(buildingCustomers.customer.passport);
                        }

                        if (buildingCustomers.customer.gender == "女") {
                            buildingCustomer.customerItems.gender.prop("checked", true);
                        }

                        if (buildingCustomers.customer.gender == "男") {
                            buildingCustomer.customerItems.gender.prop("checked", false);
                        }

                        buildingCustomer.customerItems.qq.val(buildingCustomers.customer.qq);
                        buildingCustomer.customerItems.wechat.val(buildingCustomers.customer.wechat);
                        buildingCustomer.customerItems.email.val(buildingCustomers.customer.email);
                        buildingCustomer.customerItems.relationshipType.val(buildingCustomers.customer.relationshipType);
                        buildingCustomer.customerItems.address.val(buildingCustomers.customer.address);
                        buildingCustomer.customerItems.phone.val(buildingCustomers.customer.phone);
                    }, null, false);

                    readOnlyCustomerFlag(true);

                    buildingCustomer.modals.buildingCustomerModal.modal("show");
                }
            },
            bind: {
                name: "绑定房源",
                clazz: "btn-success",
                handle: function(v) {
                    if (v.status != 0) {
                        com.showAlert(com.warning, "当前客源已签约或已失效,不能绑定房源");
                        return false;
                    }

                    deleteData();

                    buildingCustomer.buildItems.csNo.val(v.no);
                    buildingCustomer.csid = v.csid;
                    buildingCustomer.buildItems.csNo.prop("readOnly", true);

                    buildingCustomer.modals.buildingModal.modal("show");
                }
            },
            record: {
                name: "跟进记录",
                clazz: "btn-warning",
                handle: function(v) {
                    params.building.buildingCustomer = v;
                    params.building.flag = false;

                    com.popup4page("#stockRecordPopUp", api.index.buildingRecord.url, "跟进记录");
                }
            },
            status: {
                name: "状态",
                type: "switch",
                clazz: "status-lbl",
                init: function(v) {
                    return v.status == constant.data().common.status.STATUS_ENABLE_INT;
                },
                handle: function(v, check) {
                    updateBuildingCustomerStatus(v.csid, check ? constant.data().common.status.STATUS_ENABLE_INT : constant.data().common.status.STATUS_DISABLE_INT);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("CondList", "Pagenation", "Resultlist", api.building.pageBuildingCustomer, null, ["building-customer-no", "building-custumerName"], "buildingCustomerPostData", null, false, null);
    searcher.line("no", lineprops, linebtns).render();

    // 编辑OR添加
    function updateBuildingCustomer() {

        if (buildingCustomer.csStatus != 0) {
            com.showAlert(com.warning, "当前客源已签约或已失效,不能修改客源信息");
            return;
        }
        var priceHigh = buildingCustomer.items.priceHigh.val();
        var priceLow = buildingCustomer.items.priceLow.val();
        var areaHigh = buildingCustomer.items.areaHigh.val();
        var areaLow = buildingCustomer.items.areaLow.val();

        if (parseInt(priceHigh) < parseInt(priceLow) || parseInt(priceHigh) == parseInt(priceLow)) {
            com.focusPage("#priceHigh").removeClass("v_required");
            com.showTip(com.focusPage("#priceHigh"), "请填写可接受的最高价格", "right");
            buildingCustomer.priceFlg = true;
        } else {
            com.focusPage("#priceHigh").addClass("v_required");
            buildingCustomer.priceFlg = false;
        }

        if (parseInt(areaHigh) < parseInt(areaLow) || parseInt(areaHigh) == parseInt(areaLow)) {
            com.focusPage("#areaHigh").removeClass("v_required");
            com.showTip(com.focusPage("#areaHigh"), "请填写需求面积的最大值", "right");
            buildingCustomer.areaFlg = true;
        } else {
            com.focusPage("#areaHigh").addClass("v_required");
            buildingCustomer.areaFlg = false;
        }

        if (com.validate("buildingModal") || buildingCustomer.priceFlg || buildingCustomer.areaFlg) {
            return false;
        }

        var options = {};
        options["buildingCustomer.purpose"] = buildingCustomer.items.purpose.val();
        options["buildingCustomer.intention"] = buildingCustomer.items.intention.val();
        options["buildingCustomer.price"] = buildingCustomer.items.priceLow.val() + "," + buildingCustomer.items.priceHigh.val();
        options["buildingCustomer.area"] = buildingCustomer.items.areaLow.val() + "," + buildingCustomer.items.areaHigh.val();
        options["buildingCustomer.familyType"] = buildingCustomer.items.familyType.val();
        options["buildingCustomer.orientation"] = buildingCustomer.items.orientation.val();
        options["buildingCustomer.conditions"] = buildingCustomer.items.conditions.val();
        options["buildingCustomer.grade"] = buildingCustomer.items.grade.val();
        options["buildingCustomer.comment"] = buildingCustomer.items.comment.val();
        options["buildingCustomer.csid"] = buildingCustomer["buildingCustomer.csid"];

        com.post(api.building.updateBuildingCustomer, options, function(res) {

            searcher.doSearch();
        });

        buildingCustomer.modals.buildingCustomerModal.modal("hide");
    }

    // 清楚数据
    function deleteDate() {

        com.cleanItems(buildingCustomer.items);
        com.cleanItems(buildingCustomer.customerItems);
    }

    function updateBuildingCustomerStatus(csid, cvalue) {

        var options = {};
        options["buildingCustomer.csid"] = csid;
        options["buildingCustomer.status"] = cvalue;

        com.post(api.building.updateBuildingCustomerForStatus, options, function(res) {

            com.focusPage("#" + csid).attr("checked", true);
            searcher.doSearch();
        });
    }

    function readOnlyCustomerFlag(flag) {

        buildingCustomer.customerItems.customerName.prop("readonly", flag);
        buildingCustomer.customerItems.cardType.prop("disabled", flag);
        buildingCustomer.customerItems.cardNum.prop("readonly", flag);
        buildingCustomer.customerItems.gender.prop("disabled", flag);
        buildingCustomer.customerItems.qq.prop("readonly", flag);
        buildingCustomer.customerItems.wechat.prop("readonly", flag);
        buildingCustomer.customerItems.email.prop("readonly", flag);
        buildingCustomer.customerItems.relationshipType.prop("disabled", flag);
        buildingCustomer.customerItems.address.prop("disabled", flag);
        buildingCustomer.customerItems.phone.prop("readonly", flag);
    }

    // 绑定客源,创建房产单
    function saveBuildingData() {

        if (com.validate("buildingModal") || buildingCustomer.dataFlag) {
            return false;
        }

        var options = {
            'building.buildingHouse.hsid': buildingCustomer.hsid,
            'building.buildingCustomer.csid': buildingCustomer.csid,
            'building.buildingHouseAgent.cid': com.typeahead("hsAUser"),
            'building.buildingCustomerAgent.cid': com.typeahead("csAUser"),
            'building.signingTime': buildingCustomer.buildItems.signingTime.val(),
            'building.tradePrice': buildingCustomer.buildItems.tradePrice.val(),
            'building.downpayment': buildingCustomer.buildItems.downpayment.val(),
            'building.loanPrice': buildingCustomer.buildItems.loanPrice.val(),
            'building.payType': buildingCustomer.buildItems.payType.val(),
            'building.balanceStatus': buildingCustomer.buildItems.balanceStatus.val()
        };

        com.post(api.building.bindBuilding, options, function(res) {

            com.showAlert(com.info, "成功绑定房源");
            searcher.doSearch();
        });
        buildingCustomer.modals.buildingModal.modal("show");
    }

    // 删除房产单数据
    function deleteData() {

        com.clearValidator("buildingModal");
        com.cleanTypeahead("hsAUser");
        com.cleanTypeahead("csAUser");
        com.cleanItems(buildingCustomer.buildItems);
    }
});
