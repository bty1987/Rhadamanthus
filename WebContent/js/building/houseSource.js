jQuery(function($) {

    var houseSource = {

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

        houseSources: {},
        hsid: null,
        csid: null,
        houseSourceId: null,
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

    com.datetime(houseSource.buildItems.signingTime);

    houseSource.btns.bsaveBtn.on("click", saveBuildingData);

    houseSource.modals.houseHouseDrawingPage.on("hide.bs.modal", function() {

        com.cleanItems(houseSource.items);
        com.closeTip();
    });

    houseSource.modals.buildingModal.on("hide.bs.modal", function() {

        com.cleanItems(houseSource.buildItems);
        com.closeTip();
    });

    com.initTypeahead("belongUser", api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('hsAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
    com.initTypeahead('csAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");

    com.post(api.ds.building, {}, function(res) {

        houseSource.buildItems.payType.bindData(res.payType, "key", "value");
        houseSource.buildItems.balanceStatus.bindData(res.balanceStatus, "key", "value");

        $.each(res.hsType, function(i, va) {

            houseSource.hsType[va.key] = va.value;
        });
        $.each(res.houseType, function(i, va) {

            houseSource.houseType[va.key] = va.value;
        });
        $.each(res.discussType, function(i, val) {

            houseSource.discussType[val.key] = val.value;
        });
        $.each(res.decorateDegree, function(i, val) {

            houseSource.decorateDegree[val.key] = val.value;
        });
        $.each(res.payType, function(i, v) {

            houseSource.payType[v.key] = v.value;
        });
        $.each(res.balanceStatus, function(i, v) {

            houseSource.balanceStatus[v.key] = v.value;
        });
        $.each(res.orientation, function(i, v) {

            houseSource.orientation[v.key] = v.value;
        });
        $.each(res.rentType, function(i, v) {

            houseSource.rentType[v.key] = v.value;
        });

    }, null, false);

    com.focusPage("#csNo").on("blur", function() {

        com.post(api.building.queryCustomerSourceByNo, {
            "customerSource.no": houseSource.buildItems.csNo.val()
        }, function(res) {

            if (res.customerSource.status != 0) {
                houseSource.repeatFlg = true;
                com.showTip(com.focusPage("#csNo"), "客源已签约或失效", "right");
            } else {
                houseSource.repeatFlg = false;
                houseSource.csid = res.customerSource.csid;
            }
        }, function(data) {

            com.showTip(com.focusPage("#csNo"), "请正确输入客源编号", "right");
            houseSource.repeatFlg = true;
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

            var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-yellow').html("申请审核");
            var $btnDrawing = $('<a></a>').addClass('btn btn-minier btn-success').html("图片");
            var $btnAll = $('<a></a>').addClass('btn btn-minier btn-warning').html("查看");
            var $btnBind = $('<a></a>').addClass('btn btn-minier btn-inverse').html("绑定客源");
            var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-danger').html("跟进记录");
            var $btnStatus = $('<input />').attr("type", "checkbox").addClass('ace ace-switch ace-switch-5').prop("id", v.hsid);
            if (v.status == 0 || v.status == 3 || v.status == 4) {
                $btnStatus.attr("checked", true);
            } else if (v.status == 1 || v.status == 2) {
                $btnStatus.attr("checked", false);
            }
            var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

            var propertyArr = [["房源类型:", houseSource.hsType[v.type], "red"], ["房屋类型:", houseSource.houseType[v.house.type], "red"], ["楼盘地址:", v.house.village.name, "grey"], ["面积:", v.house.buildArea + "平", "blue"], ["总价:", toMoney(v.totalPrice) + "元", "blue"], ["装修程度:", houseSource.decorateDegree[v.decorateDegree], "grey"], ["户型:", v.house.houseType, "grey"], ["房屋朝向:", houseSource.orientation[v.house.orientation], "grey"], ["商议类型:", houseSource.discussType[v.discussType], "red"], ["交租方式:", houseSource.rentType[v.rentType], "grey"], ["房源等级:", v.housingGrade, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if (v.status == 4) {
                $divBtnWrap.append($btnCheck);
            }
            $divBtnWrap.append($btnDrawing).append($btnAll);
            if (v.status == 3) {
                $divBtnWrap.append($btnBind);
            }
            if (v.status == 1 || v.status == 3) {
                $divBtnWrap.append($btnRecord);
            }
            if (v.status != 0 && v.status != 1) {
                $divBtnWrap.append($btnStatus).append($btnSpan);
            }
            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            // 申请审核
            $btnCheck.click(function() {

                if (v.status == 4) {
                    var options = {};
                    options["houseSource.hsid"] = v.hsid;
                    options["houseSource.status"] = 0;
                    com.post(api.building.updateHouseSourceForStatus, options, function(res) {

                        com.showAlert(com.info, "申请成功");
                        searcher.doSearch();
                    });
                } else {
                    com.showAlert(com.warning, "当前房源信息状态不符合");
                }
            });

            // 图片
            $btnDrawing.click(function() {

                com.focusPage("#houseSourceDrawing").html("");
                com.post(api.building.queryBuildingDrawing, {
                    "buildingDrawing.sid": v.hsid,
                    "buildingDrawing.type": 0
                }, function(data) {

                    var houseSourcePics = data.buildingDrawings;
                    if (houseSourcePics && houseSourcePics.length) {
                        $.each(houseSourcePics, function(i, d) {

                            appendGalleryElement("houseSourceDrawing", d.bdid, d.drawingUrl, d.drawingType, "", api.building.deleteBuildingDrawing, v.hsid, api.building.updateHouseSourceForPath);
                        });
                        com.popup4photos("#houseSourceDrawing");
                    }
                }, null, false);

                initUploadBtn(v.hsid);
                houseSource.modals.houseHouseDrawingPage.modal("show");
            });

            // 查看 可以看见房源的所有信息 包括图片 和上传图片
            $btnAll.click(function() {

                params.building.houseSource = v;
                params.building.page = "houseSource";

                com.popup4page("#stockRecordPopUp", api.index.houseSourceDetail.url, "查看");
            });

            // 绑定客源
            $btnBind.click(function() {

                if (v.status != 3) {
                    com.showAlert(com.warning, "当前房源状态不符合,不能绑定客源");
                    return false;
                }

                deleteData();

                houseSource.buildItems.hsNo.val(v.no);
                houseSource.hsid = v.hsid;
                houseSource.buildItems.hsNo.prop("readOnly", true);

                houseSource.modals.buildingModal.modal("show");
            });

            // 跟进记录
            $btnRecord.click(function() {

                params.building.houseSource = v;
                params.building.flag = true;

                com.popup4page("#stockRecordPopUp", api.index.buildingRecord.url, "跟进记录");
            });

            // 启用禁用
            $btnStatus.click(function() {

                var checkedFlag = $btnStatus.prop("checked");
                if (checkedFlag) {
                    com.focusPage("#" + v.hsid).prop("checked", false);
                    updateHouseSourceStatus(v.hsid, 2);
                } else {
                    if (v.status != 1) {
                        updateHouseSourceStatus(v.hsid, 0);
                    } else {
                        com.showAlert(com.warning, "当前房源已签约不能修改状态");
                    }
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
    var conditionList = ["building-houseSource-no", "building-houseType", "building-houseSource-type", "building-village", "building-Area", "building-totalPrice", "building-roomNum", "building-orientation", "building-decorateDegree", "building-allowLoan", "building-housingGrade", "building-rentType", "building-status"];

    searcher.init(conditionList, "CondList", api.building.pageHouseSourceForFollower, function(data) {

        displayFunc.init('ResultList', data);
    }, "Pagenation", "houseSourcePostData", {
        "filter[0].field": "houseSource"
    }, false, null, null);

    // 更新房源状态
    function updateHouseSourceStatus(hsid, cvalue) {

        var options = {};
        options["houseSource.hsid"] = hsid;
        options["houseSource.status"] = cvalue;

        com.post(api.building.updateHouseSourceForStatus, options, function(res) {

            com.focusPage("#" + hsid).prop("checked", true);
            searcher.doSearch();
        });
    }

    // 绑定客源,创建房产单
    function saveBuildingData() {

        if (com.validate("buildingModal") || houseSource.repeatFlg) { return false; }

        var options = {
            'building.houseSource.hsid': houseSource.hsid,
            'building.customerSource.csid': houseSource.csid,
            'building.houseSourceAgent.cid': com.typeahead('hsAUser'),
            'building.customerSourceAgent.cid': com.typeahead('csAUser'),
            'building.signingTime': houseSource.buildItems.signingTime.val(),
            'building.tradePrice': houseSource.buildItems.tradePrice.val(),
            'building.downpayment': houseSource.buildItems.downpayment.val(),
            'building.loanPrice': houseSource.buildItems.loanPrice.val(),
            'building.payType': houseSource.buildItems.payType.val(),
            'building.balanceStatus': houseSource.buildItems.balanceStatus.val()
        };

        com.post(api.building.bindBuilding, options, function(res) {

            com.showAlert(com.info, "成功绑定客源");
            searcher.doSearch();
        });

        houseSource.modals.buildingModal.modal("hide");
    }

    // 删除房产单数据
    function deleteData() {

        com.clearValidator("buildingModal");
        com.cleanTypeahead('hsAUser');
        com.cleanTypeahead('csAUser');
        com.cleanItems(houseSource.buildItems);
    }

    // 转换金额
    function toMoney(num) {

        num = num.toFixed(2);
        num = parseFloat(num);
        num = num.toLocaleString();
        return num;
    }

    function initUploadBtn(hsid) {

        com.uploadify("#houseSourceUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
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
                appendGalleryElement("houseSourceDrawing", drawing.bdid, data.resUrl, 0, "", api.building.deleteBuildingDrawing, hsid, api.building.updateHouseSourceForPath);
                com.popup4photos("#houseSourceDrawing");
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
            options["houseSource.hsid"] = hsid;
            options["houseSource.path"] = imgUrl;

            com.post(defaultUrl, options, function(res) {

                com.showAlert(com.info, "图片设置成功");
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-ok green").appendTo(toolsB);
    }
});
