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

            var that = this;
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDrawing = $('<a></a>').addClass('btn btn-minier btn-yellow').html("图片");
            var $btnAll = $('<a></a>').addClass('btn btn-minier btn-success').html("查看");
            var $btnFollow = $('<a></a>').addClass('btn btn-minier btn-warning').html("转移房源");
            var $btnBind = $('<a></a>').addClass('btn btn-minier btn-success').html("绑定客源");
            var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-inverse').html("跟进记录");
            var $btnSuccess = $('<a></a>').addClass('btn btn-minier btn-danger').html("通过");
            var $btnFail = $('<a></a>').addClass('btn btn-minier btn-pink').html("驳回");
            var $btnKey = $('<a></a>').addClass('btn btn-minier btn-yellow').html("收钥匙人");
            var $btnStatus = $('<input />').attr("type", "checkbox").addClass('ace ace-switch ace-switch-5').prop("id", v.hsid);
            if (v.status == 0 || v.status == 3 || v.status == 4) {
                $btnStatus.prop("checked", true);
            } else if (v.status == 1 || v.status == 2) {
                $btnStatus.prop("checked", false);
            }

            var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

            var propertyArr = [["房源类型:", buildingHouse.hsType[v.type], "red"], ["房屋类型:", buildingHouse.houseType[v.house.type], "red"], ["楼盘地址:", v.house.village.name, "grey"], ["面积:", v.house.buildArea + "平", "blue"], ["总价:", toMoney(v.totalPrice) + "元", "blue"], ["装修程度:", buildingHouse.decorateDegree[v.decorateDegree], "grey"], ["户型:", v.house.houseType, "grey"], ["房屋朝向:", buildingHouse.orientation[v.house.orientation], "grey"], ["商议类型:", buildingHouse.discussType[v.discussType], "red"], ["交租方式:", buildingHouse.rentType[v.rentType], "grey"], ["房源等级:", v.housingGrade, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDrawing).append($btnAll);
            if (v.status == 0) {
                $divBtnWrap.append($btnFollow).append($btnSuccess).append($btnFail).append($btnKey);
            }
            if (v.status == 1) {
                $divBtnWrap.append($btnRecord);
            }
            if (v.status == 2) {
                $divBtnWrap.append($btnStatus).append($btnSpan);
            }
            if (v.status == 3) {
                $divBtnWrap.append($btnFollow).append($btnBind).append($btnRecord).append($btnKey).append($btnStatus).append($btnSpan);
            }
            if (v.status == 4) {
                $divBtnWrap.append($btnKey).append($btnStatus).append($btnSpan);
            }

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            // 图片
            $btnDrawing.click(function() {

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
            });

            // 查看 可以看见房源的所有信息 包括图片 和上传图片
            $btnAll.click(function() {

                params.building.buildingHouse = v;
                params.building.page = "advance";

                com.popup4page("#stockRecordPopUp", api.index.buildingHouseDetail.url, "查看");
            });

            // 转移房源
            $btnFollow.click(function() {

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
            });

            // 绑定客源
            $btnBind.click(function() {

                if (v.status == 1 || v.status == 2 || v.status == 4) {
                    com.showAlert(com.warning, "当前房源已签约或已失效,不能绑定客源");
                    return false;
                }

                deleteData();

                buildingHouse.buildItems.hsNo.val(v.no);
                buildingHouse.hsid = v.hsid;
                buildingHouse.buildItems.hsNo.prop("readOnly", true);

                buildingHouse.modals.buildingModal.modal("show");
            });

            // 跟进记录
            $btnRecord.click(function() {

                params.building.buildingHouse = v;
                params.build.flag = true;

                com.popup4page("#stockRecordPopUp", "/views/building/buildingRecord.html", "跟进记录");
            });

            // 通过
            $btnSuccess.click(function() {

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
            });
            // 拒绝
            $btnFail.click(function() {

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
            });

            // 收钥匙人
            $btnKey.click(function() {

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
            });

            // 启用禁用
            $btnStatus.click(function() {

                var checkedFlag = $btnStatus.prop("checked");
                if (!checkedFlag) {
                    com.focusPage("#" + v.hsid).prop("checked", false);
                    updateBuildingHouseStatus(v.hsid, 2);
                } else {
                    updateBuildingHouseStatus(v.hsid, 0);
                }
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
        }
    })();

    var searcher = new Searcher();
    var conditionList = ["building-buildingHouse-no", "building-houseType", "building-buildingHouse-type", "building-village", "building-Area", "building-totalPrice", "building-roomNum", "building-orientation", "building-decorateDegree", "building-allowLoan", "building-housingGrade", "building-rentType", "building-status"];

    searcher.init(conditionList, "CondList", api.building.pageBuildingHouseForAdvance, function(data) {

        displayFunc.init('ResultList', data);
    }, "Pagenation", "buildingHouseAdvancePostData", null, false, null, null);

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
