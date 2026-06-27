jQuery(function($) {

    var buildingHouse = {

        btns: {

            deployedBtn: com.focusPage("#deployedBtn"),
            bsaveBtn: com.focusPage("#bsaveBtn"),
            keySaveBtn: com.focusPage("#keySaveBtn"),
            bcancelBtn: com.focusPage("#bcancelBtn")

        },

        modals: {

            houseHouseDrawingPage: com.focusPage("#houseHouseDrawingPage"),
            buildingHouseBelongModal: com.focusPage("#buildingHouseBelongModal"),
            buildingModal: com.focusPage("#buildingModal"),
            buildingHouseKeyerModal: com.focusPage("#buildingHouseKeyerModal")

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

        items: {

            belongUser: com.focusPage("#belongUser"),
            keyer: com.focusPage("#keyer")

        },

        buildingHouses: {},
        hsid: null,
        csid: null,
        buildingHouseId: null,
        houseId: null,
        keyHsid: null,
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

    buildingHouse.btns.deployedBtn.on("click", updateFollowUser);
    buildingHouse.btns.bsaveBtn.on("click", saveBuildingData);
    buildingHouse.btns.keySaveBtn.on("click", updateKeyer);

    buildingHouse.modals.buildingHouseBelongModal.on("hide.bs.modal", function() {

        com.cleanItems(buildingHouse.items);
        com.cleanTypeahead("belongUser");
        com.closeTip();
    });

    buildingHouse.modals.buildingModal.on("hide.bs.modal", function() {

        com.cleanItems(buildingHouse.buildItems);
        com.cleanTypeahead("hsAUser");
        com.cleanTypeahead("csAUser");
        com.closeTip();
    });

    buildingHouse.modals.buildingHouseKeyerModal.on("hide.bs.modal", function() {

        com.cleanItems(buildingHouse.items);
        com.cleanTypeahead("keyer");
        com.closeTip();
    });

    com.initTypeahead("belongUser", api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead("keyer", api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('hsAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
    com.initTypeahead('csAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");

    com.post(api.ds.building, {}, function(res) {

        buildingHouse.buildItems.payType.bindData(res.payType, "key", "value");
        buildingHouse.buildItems.balanceStatus.bindData(res.balanceStatus, "key", "value");

        $.each(res.hsType, function(i, va) {

            buildingHouse.hsType[va.key] = va.value;
        });
        $.each(res.houseType, function(i, va) {

            buildingHouse.houseType[va.key] = va.value;
        });
        $.each(res.discussType, function(i, val) {

            buildingHouse.discussType[val.key] = val.value;
        });
        $.each(res.decorateDegree, function(i, val) {

            buildingHouse.decorateDegree[val.key] = val.value;
        });
        $.each(res.payType, function(i, v) {

            buildingHouse.payType[v.key] = v.value;
        });
        $.each(res.balanceStatus, function(i, v) {

            buildingHouse.balanceStatus[v.key] = v.value;
        });
        $.each(res.orientation, function(i, v) {

            buildingHouse.orientation[v.key] = v.value;
        });
        $.each(res.rentType, function(i, v) {

            buildingHouse.rentType[v.key] = v.value;
        });

    }, null, false);

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

    function buildBuildingHouse4advanceLineprops() {

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
    }

    function buildBuildingHouse4advanceLinebtns() {

        return {
            drawing: {
                name: "图片",
                clazz: "btn-yellow",
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
                clazz: "btn-success",
                handle: function(v) {
                    params.building.buildingHouse = v;
                    params.building.page = "advance";

                    com.popup4page("#stockRecordPopUp", api.index.buildingHouseDetail.url, "查看");
                }
            },
            follow: {
                name: "转移房源",
                clazz: "btn-warning",
                show: function(v) { return v.status == 0 || v.status == 3; },
                handle: function(v) {
                    if (v.status == 1 || v.status == 2 || v.status == 4) {
                        com.showAlert(com.warning, "当前房源已签约或已失效,不能转移房源");
                        return;
                    }

                    buildingHouse.buildingHouseId = v.hsid;

                    if (v.followUser.userId != null) {
                        com.updateTypeahead("belongUser", v.followUser.userId, v.followUser.userName);
                    } else {
                        com.cleanTypeahead("belongUser");
                    }

                    buildingHouse.modals.buildingHouseBelongModal.modal("show");
                }
            },
            bind: {
                name: "绑定客源",
                clazz: "btn-success",
                show: function(v) { return v.status == 3; },
                handle: function(v) {
                    if (v.status == 1 || v.status == 2 || v.status == 4) {
                        com.showAlert(com.warning, "当前房源已签约或已失效,不能绑定客源");
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
                clazz: "btn-inverse",
                show: function(v) { return v.status == 1 || v.status == 3; },
                handle: function(v) {
                    params.building.buildingHouse = v;
                    params.build.flag = true;

                    com.popup4page("#stockRecordPopUp", "/views/building/buildingRecord.html", "跟进记录");
                }
            },
            success: {
                name: "通过",
                clazz: "btn-danger",
                show: function(v) { return v.status == 0; },
                handle: function(v) {
                    if (v.status == 0) {
                        com.post(api.building.updateBuildingHouseForStatus, {
                            "buildingHouse.hsid": v.hsid,
                            "buildingHouse.status": 3
                        }, function(res) {

                            com.showAlert(com.info, "房源信息已通过");
                            searcher.doSearch();
                        });
                    } else {
                        com.showAlert(com.warning, "当前房源信息状态不能操作");
                    }
                }
            },
            fail: {
                name: "驳回",
                clazz: "btn-pink",
                show: function(v) { return v.status == 0; },
                handle: function(v) {
                    if (v.status == 0) {
                        com.post(api.building.updateBuildingHouseForStatus, {
                            "buildingHouse.hsid": v.hsid,
                            "buildingHouse.status": 4
                        }, function(res) {

                            com.showAlert(com.info, "房源信息已驳回");
                            searcher.doSearch();
                        });
                    } else {
                        com.showAlert(com.warning, "当前房源信息状态不能操作");
                    }
                }
            },
            key: {
                name: "收钥匙人",
                clazz: "btn-yellow",
                show: function(v) { return v.status == 0 || v.status == 3 || v.status == 4; },
                handle: function(v) {
                    if (v.status == 1 || v.status == 2) {
                        return false;
                    }

                    if (v.keyer.userId != null) {
                        com.updateTypeahead("keyer", v.keyer.userId, v.keyer.userName);
                    } else {
                        com.cleanTypeahead("keyer");
                    }

                    buildingHouse.keyHsid = v.hsid;
                    buildingHouse.modals.buildingHouseKeyerModal.modal("show");
                }
            },
            status: {
                name: "状态",
                type: "switch",
                clazz: "status-lbl",
                show: function(v) { return v.status == 2 || v.status == 3 || v.status == 4; },
                init: function(v) {
                    return v.status == 0 || v.status == 3 || v.status == 4;
                },
                handle: function(v, check) {
                    if (!check) {
                        updateBuildingHouseStatus(v.hsid, 2);
                    } else {
                        updateBuildingHouseStatus(v.hsid, 0);
                    }
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("CondList", "Pagenation", "ResultList", api.building.pageBuildingHouseForAdvance, null, ["building-buildingHouse-no", "building-houseType", "building-buildingHouse-type", "building-village", "building-Area", "building-totalPrice", "building-roomNum", "building-orientation", "building-decorateDegree", "building-allowLoan", "building-housingGrade", "building-rentType", "building-status"], "buildingHouseAdvancePostData", null, false, null);
    searcher.line("no", buildBuildingHouse4advanceLineprops(), buildBuildingHouse4advanceLinebtns()).render();

    // 更新房源归属
    function updateFollowUser() {

        var options = {
            "buildingHouse.hsid": buildingHouse.buildingHouseId,
            "buildingHouse.followUser.userId": com.typeahead("belongUser")
        };

        com.post(api.building.updateBuildingHouseForBelong, options, function(res) {

            com.showAlert(com.info, "房源转移成功");
        });

        buildingHouse.modals.buildingHouseBelongModal.modal("hide");

        searcher.doSearch();
    }

    // 更新收钥匙人
    function updateKeyer() {

        com.post(api.building.updateBuildingHouseForKeyer, {
            "buildingHouse.hsid": buildingHouse.keyHsid,
            "buildingHouse.keyer.userId": com.typeahead("keyer")
        }, function() {

            com.showAlert(com.info, "收钥匙人已更新");
        });

        buildingHouse.modals.buildingHouseKeyerModal.modal("hide");
        searcher.doSearch();
    }

    // 更新房源状态
    function updateBuildingHouseStatus(hsid, cvalue) {

        var options = {
            "buildingHouse.hsid": hsid,
            "buildingHouse.status": cvalue
        };

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
        }, 1, function(data) {

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

        com.showImg(img, imgUrl, 150, 150, '', null, type);

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
