jQuery(function($) {

    var buildingHouse = {

        btns: {

            deployedBtn: com.focusPage("#deployedBtn"),
            bsaveBtn: com.focusPage("#bsaveBtn"),
            bcancelBtn: com.focusPage("#bcancelBtn")

        },

        modals: {

            houseHouseDrawingPage: com.focusPage("#houseHouseDrawingPage"),
            buildingModal: com.focusPage("#buildingModal")

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

        buildingHouses: {},
        hsid: null,
        csid: null,
        buildingHouseId: null,
        houseId: null,
        hsType: [],
        houseType: [],
        decorateDegree: [],
        discussType: [],
        orientation: [],
        payType: [],
        balanceStatus: [],
        rentType: [],
        repeatFlg: null
    };

    com.datetime(buildingHouse.buildItems.signingTime);

    buildingHouse.btns.bsaveBtn.on("click", saveBuildingData);

    buildingHouse.modals.houseHouseDrawingPage.on("hide.bs.modal", function() {

        com.cleanItems(buildingHouse.items);
        com.closeTip();
    });

    buildingHouse.modals.buildingModal.on("hide.bs.modal", function() {

        com.cleanItems(buildingHouse.buildItems);
        com.closeTip();
    });

    com.initTypeahead("belongUser", api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('hsAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
    com.initTypeahead('csAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");

    buildingHouse.buildItems.payType.bindData(constant.building().building.payType.datas, "key", "value");
    buildingHouse.buildItems.balanceStatus.bindData(constant.building().building.balanceStatus.datas, "key", "value");

    $.each(constant.building().buildingHouse.type.datas, function(i, va) {

        buildingHouse.hsType[va.key] = va.value;
    });
    $.each(constant.building().house.houseType.datas, function(i, va) {

        buildingHouse.houseType[va.key] = va.value;
    });
    $.each(constant.building().buildingHouse.discussType.datas, function(i, val) {

        buildingHouse.discussType[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.decorateDegree.datas, function(i, val) {

        buildingHouse.decorateDegree[val.key] = val.value;
    });
    $.each(constant.building().building.payType.datas, function(i, v) {

        buildingHouse.payType[v.key] = v.value;
    });
    $.each(constant.building().building.balanceStatus.datas, function(i, v) {

        buildingHouse.balanceStatus[v.key] = v.value;
    });
    $.each(constant.building().house.orientation.datas, function(i, v) {

        buildingHouse.orientation[v.key] = v.value;
    });
    $.each(constant.building().buildingHouse.rentType.datas, function(i, v) {

        buildingHouse.rentType[v.key] = v.value;
    });

    com.focusPage("#csNo").on("blur", function() {

        com.post(api.building.queryBuildingCustomerByNo, {
            "buildingCustomer.no": buildingHouse.buildItems.csNo.val()
        }, function(res) {

            if (res.buildingCustomer.status != 0) {
                buildingHouse.repeatFlg = true;
                com.showTip(com.focusPage("#csNo"), "客源已签约或失效", "right");
            } else {
                buildingHouse.repeatFlg = false;
                buildingHouse.csid = res.buildingCustomer.csid;
            }
        }, function(data) {

            com.showTip(com.focusPage("#csNo"), "请正确输入客源编号", "right");
            buildingHouse.repeatFlg = true;
        }, false);
    });

    var lineprops = (function() {

        return [{
            field: "type",
            name: "房源类型",
            prop: function(v) { return buildingHouse.hsType[v.type]; },
            clazz: "red"
        }, {
            field: "house.type",
            name: "房屋类型",
            prop: function(v) { return buildingHouse.houseType[v.house.type]; },
            clazz: "red"
        }, {
            field: "house.village.name",
            name: "楼盘地址",
            prop: "house.village.name",
            clazz: "grey"
        }, {
            field: "house.buildArea",
            name: "面积",
            prop: function(v) { return v.house.buildArea + "平"; },
            clazz: "blue"
        }, {
            field: "totalPrice",
            name: "总价",
            prop: function(v) { return toMoney(v.totalPrice) + "元"; },
            clazz: "blue"
        }, {
            field: "decorateDegree",
            name: "装修程度",
            prop: function(v) { return buildingHouse.decorateDegree[v.decorateDegree]; },
            clazz: "grey"
        }, {
            field: "house.houseType",
            name: "户型",
            prop: "house.houseType",
            clazz: "grey"
        }, {
            field: "house.orientation",
            name: "房屋朝向",
            prop: function(v) { return buildingHouse.orientation[v.house.orientation]; },
            clazz: "grey"
        }, {
            field: "discussType",
            name: "商议类型",
            prop: function(v) { return buildingHouse.discussType[v.discussType]; },
            clazz: "red"
        }, {
            field: "rentType",
            name: "交租方式",
            prop: function(v) { return buildingHouse.rentType[v.rentType]; },
            clazz: "grey"
        }, {
            field: "housingGrade",
            name: "房源等级",
            prop: "housingGrade",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        // buildingHouse 复用 building.building 状态枚举：
        // 0=待审核 1=签约 2=失效 3=通过 4=驳回（见 communion.constant building.building.status）
        var ST = constant.building().building.status;

        return {
            check: {
                name: "申请审核",
                clazz: "btn-yellow",
                show: function(v) { return v.status == 4; },
                handle: function(v) {
                    if (v.status == 4) {
                        var options = {};
                        options["buildingHouse.hsid"] = v.hsid;
                        options["buildingHouse.status"] = 0;
                        com.post(api.building.updateBuildingHouseForStatus, options, function(res) {

                            com.showAlert(com.info, "申请成功");
                            searcher.doSearch();
                        });
                    } else {
                        com.showAlert(com.warning, "当前房源信息状态不符合");
                    }
                }
            },
            drawing: {
                name: "图片",
                clazz: "btn-success",
                handle: function(v) {
                    com.focusPage("#buildingHouseDrawing").html("");
                    com.post(api.building.queryBuildingDrawing, {
                        "buildingDrawing.sid": v.hsid,
                        "buildingDrawing.type": 0
                    }, function(data) {

                        var buildingHousePics = data.buildingDrawings;
                        if (buildingHousePics && buildingHousePics.length) {
                            $.each(buildingHousePics, function(i, d) {

                                appendGalleryElement("buildingHouseDrawing", d.bdid, d.drawingUrl, d.drawingType, "", api.building.deleteBuildingDrawing, v.hsid, api.building.updateBuildingHouseForPath);
                            });
                            com.popup4photos("#buildingHouseDrawing");
                        }
                    }, null, false);

                    initUploadBtn(v.hsid);
                    buildingHouse.modals.houseHouseDrawingPage.modal("show");
                }
            },
            view: {
                name: "查看",
                clazz: "btn-warning",
                handle: function(v) {
                    params.building.buildingHouse = v;
                    params.building.page = "buildingHouse";

                    com.popup4page("#stockRecordPopUp", api.index.buildingHouseDetail.url, "查看");
                }
            },
            bind: {
                name: "绑定客源",
                clazz: "btn-inverse",
                show: function(v) { return v.status == 3; },
                handle: function(v) {
                    if (v.status != 3) {
                        com.showAlert(com.warning, "当前房源状态不符合,不能绑定客源");
                        return false;
                    }

                    deleteData();

                    buildingHouse.buildItems.hsNo.val(v.no);
                    buildingHouse.hsid = v.hsid;
                    buildingHouse.buildItems.hsNo.prop("readOnly", true);

                    buildingHouse.modals.buildingModal.modal("show");
                }
            },
            record: {
                name: "跟进记录",
                clazz: "btn-danger",
                show: function(v) { return v.status == ST.STATUS_SIGN_INT || v.status == ST.STATUS_PASS_INT; },
                handle: function(v) {
                    params.building.buildingHouse = v;
                    params.building.flag = true;

                    com.popup4page("#stockRecordPopUp", api.index.buildingRecord.url, "跟进记录");
                }
            },
            status: {
                name: "状态",
                type: "switch",
                clazz: "status-lbl",
                show: function(v) { return v.status != ST.STATUS_INIT_INT && v.status != ST.STATUS_SIGN_INT; },
                init: function(v) {
                    return v.status == ST.STATUS_INIT_INT || v.status == ST.STATUS_PASS_INT || v.status == ST.STATUS_REJECT_INT;
                },
                handle: function(v, check) {
                    if (check) {
                        updateBuildingHouseStatus(v.hsid, ST.STATUS_DISABLE_INT);
                    } else {
                        if (v.status != ST.STATUS_SIGN_INT) {
                            updateBuildingHouseStatus(v.hsid, ST.STATUS_INIT_INT);
                        } else {
                            com.showAlert(com.warning, "当前房源已签约不能修改状态");
                        }
                    }
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("CondList", "Pagenation", "ResultList", api.building.pageBuildingHouseForFollower, {
        "filter[0].field": "buildingHouse"
    }, ["building-buildingHouse-no", "building-houseType", "building-buildingHouse-type", "building-village", "building-Area", "building-totalPrice", "building-roomNum", "building-orientation", "building-decorateDegree", "building-allowLoan", "building-housingGrade", "building-rentType", "building-status"], "buildingHousePostData", null, false, null);
    searcher.line("no", lineprops, linebtns).render();

    // 更新房源状态
    function updateBuildingHouseStatus(hsid, cvalue) {

        var options = {};
        options["buildingHouse.hsid"] = hsid;
        options["buildingHouse.status"] = cvalue;

        com.post(api.building.updateBuildingHouseForStatus, options, function(res) {

            com.focusPage("#" + hsid).prop("checked", true);
            searcher.doSearch();
        });
    }

    // 绑定客源,创建房产单
    function saveBuildingData() {

        if (com.validate("buildingModal") || buildingHouse.repeatFlg) {
            return false;
        }

        var options = {
            'building.buildingHouse.hsid': buildingHouse.hsid,
            'building.buildingCustomer.csid': buildingHouse.csid,
            'building.buildingHouseAgent.cid': com.typeahead('hsAUser'),
            'building.buildingCustomerAgent.cid': com.typeahead('csAUser'),
            'building.signingTime': buildingHouse.buildItems.signingTime.val(),
            'building.tradePrice': buildingHouse.buildItems.tradePrice.val(),
            'building.downpayment': buildingHouse.buildItems.downpayment.val(),
            'building.loanPrice': buildingHouse.buildItems.loanPrice.val(),
            'building.payType': buildingHouse.buildItems.payType.val(),
            'building.balanceStatus': buildingHouse.buildItems.balanceStatus.val()
        };

        com.post(api.building.bindBuilding, options, function(res) {

            com.showAlert(com.info, "成功绑定客源");
            searcher.doSearch();
        });

        buildingHouse.modals.buildingModal.modal("hide");
    }

    // 删除房产单数据
    function deleteData() {

        com.clearValidator("buildingModal");
        com.cleanTypeahead('hsAUser');
        com.cleanTypeahead('csAUser');
        com.cleanItems(buildingHouse.buildItems);
    }

    // 转换金额
    function toMoney(num) {

        num = num.toFixed(2);
        num = parseFloat(num);
        num = num.toLocaleString();
        return num;
    }

    function initUploadBtn(hsid) {

        com.uploadify("#buildingHouseUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 2
        }, 10, function(data) {

            var options = {};

            options["buildingDrawing.sid"] = hsid;
            options["buildingDrawing.name"] = "";
            options["buildingDrawing.drawingUrl"] = data.resUrl;
            options["buildingDrawing.drawingType"] = 0;
            options["buildingDrawing.type"] = 0;
            options["buildingDrawing.filesize"] = data.filesize;

            com.post(api.building.addBuildingDrawing, options, function(res) {

                var drawing = res.buildingDrawing;
                appendGalleryElement("buildingHouseDrawing", drawing.bdid, data.resUrl, 0, "", api.building.deleteBuildingDrawing, hsid, api.building.updateBuildingHouseForPath);
                com.popup4photos("#buildingHouseDrawing");
            });
        });
    }

    function appendGalleryElement(galleryId, imgId, imgUrl, type, editUrl, deleteUrl, hsid, defaultUrl) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + imgId).addClass("text-center").css("border-color", "#ddd").appendTo(gallery);
        var img = $('<img />');
        var imgA = $("<a></a>").css("height", "150px").append(img).appendTo(imgLi);

        com.showImg(img, imgUrl, 150, 150, '', null, type)

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            var options = {};
            options["buildingDrawing.bdid"] = imgId;

            com.post(deleteUrl, options, function(res) {

                com.focusPage("#gallery_li" + imgId).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

        var toolsB = $("<a></a>").attr("href", "#").on("click", function() {

            var options = {};
            options["buildingHouse.hsid"] = hsid;
            options["buildingHouse.path"] = imgUrl;

            com.post(defaultUrl, options, function(res) {

                com.showAlert(com.info, "图片设置成功");
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-ok green").appendTo(toolsB);
    }
});
