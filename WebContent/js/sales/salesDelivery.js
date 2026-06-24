$(function() {

    var salesDelivery = {

        salesItem: null,

        modals: {
            editModal: com.focusPage("#EditModal"),
            decorationInfo: com.focusPage("#decorationInfo"),
            tranModal: com.focusPage("#TranModal"),
        },
        items: {
            protranTime: com.focusPage("#protranTime"),
            comment: com.focusPage("#comment"),
            tranNum: com.focusPage("#tranNum"),
            tranGoodsName: com.focusPage("#tranGoodsName"),
            tranOrderNum: com.focusPage("#tranOrderNum"),
        },
        btns: {
            saveEditBtn: com.focusPage("#saveEditBtn"),
            cancelEditBtn: com.focusPage("#cancelEditBtn"),
        },
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        postData: '',

        statusList: [],
        typenessList: [],
        projectStatus: {},

        pageType: params['urlLoadParams'].pagetype,

        extraParams: {},
    };

    com.datetime(com.focusPage(".date-picker-date"));

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].pagetype);

    salesDelivery.postData = "salesDeliveryFor" + salesDelivery.pageType + "PostData";

    initUploadBtn();
    function deliveryDecoration(v) {

        com.focusPage("text").css("line-height", "27px");
        com.post(api.decoration.queryDecorationByOrderId, {
            "decorationOrderId": v.sales.orderId
        }, function(res) {

            var decorationInfo = res.decoration;
            com.focusPage("#orderId").html(decorationInfo.orderId);
            com.focusPage("#address").html(decorationInfo.house.village.name + '' + decorationInfo.house.houseNumber);
            com.focusPage("#designer").html(decorationInfo.designer.currentName == null ? "无" : decorationInfo.designer.currentName);
            com.focusPage("#escorter").html(decorationInfo.escorter.currentName == null ? "无" : decorationInfo.escorter.currentName);
            com.focusPage("#supervisor").html(decorationInfo.supervisor.currentName == null ? "无" : decorationInfo.supervisor.currentName);
            com.focusPage("#typeness").html(constant.decoration().decoration.typeness.keys[decorationInfo.typeness]);
            com.focusPage("#projectStatus").html(constant.decoration().decoration.projectStatus.keys[decorationInfo.projectStatus]);

            salesDelivery.modals.decorationInfo.modal("show");
        });
    }

    function deliveryTran(v) {

        salesDelivery.items.tranGoodsName.text(v.salesItem.goods.name);
        salesDelivery.items.tranOrderNum.text(v.salesItem.num);
        salesDelivery.items.tranNum.val('');
        salesDelivery.currentSdiid = v.sdiid;
        salesDelivery.modals.tranModal.modal("show");
    }

    function deliveryCheck(v) {

        var option = {};
        option["salesDeliveryItems[0].sdiid"] = v.sdiid;
        com.post(api.sales.checkSalesDeliveryItem, option, function() {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }

    function deliveryConfirm(v) {

        var option = {};
        option["salesDeliveryItems[0].sdiid"] = v.sdiid;
        com.post(api.sales.confirmSalesDeliveryItem, option, function() {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }

    function deliveryFinish(v) {

        var option = {};
        option["salesDeliveryItems[0].sdiid"] = v.sdiid;
        com.showConfirm('确认销售项配送完结?', function() {
            com.post(api.sales.finishSalesDeliveryItem, option, function() {
                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
        });
    }

    function deliveryEdit(v) {

        salesDelivery.items.sdiid = v.sdiid;
        if (v.protranTime != null) {
            salesDelivery.items.protranTime.val(v.protranTime.substring(0, 10));
        }
        if (salesDelivery.pageType != 'init') {
            salesDelivery.items.protranTime.attr("disabled", "disabled");
        }
        salesDelivery.items.comment.val(v.comment);
        salesDelivery.modals.editModal.modal("show");
    }

    function deliveryPicture(v) {

        salesDelivery.salesItem = v.salesItem;
        managedrawing();
    }

    function buildDeliveryLineprops() {

        var propertyMap = {
            salesno: {field: "salesno", name: "销售单号", prop: "sales.no", clazz: "blue"},
            num: {field: "num", name: "数量", prop: "salesItem.num", clazz: "blue"},
            createTime: {field: "createTime", name: "创建时间", prop: "createTime", clazz: "green"},
            tranTime: {field: "tranTime", name: "配送时间", prop: "tranTime", clazz: "green"},
            checkTime: {field: "checkTime", name: "审核时间", prop: "checkTime", clazz: "green"},
            confirmTime: {field: "confirmTime", name: "确认时间", prop: "confirmTime", clazz: "green"},
            finishTime: {field: "finishTime", name: "完结时间", prop: "finishTime", clazz: "green"},
            creater: {field: "creater", name: "创建人", prop: "creater.currentName", clazz: "grey", click: function($this, v) {tools.personel.info($this, v.creater.userId);}},
            traner: {field: "traner", name: "配送人", prop: "traner.currentName", clazz: "grey", click: function($this, v) {tools.personel.info($this, v.traner.userId);}},
            checker: {field: "checker", name: "审核人", prop: "checker.currentName", clazz: "grey", click: function($this, v) {tools.personel.info($this, v.checker.userId);}},
            confirmer: {field: "confirmer", name: "确认人", prop: "confirmer.currentName", clazz: "grey", click: function($this, v) {tools.personel.info($this, v.confirmer.userId);}},
            finisher: {field: "finisher", name: "完结人", prop: "finisher.currentName", clazz: "grey", click: function($this, v) {tools.personel.info($this, v.finisher.userId);}},
            comment: {field: "comment", name: "备注", prop: "comment", clazz: "grey"},
            brand: {field: "brand", name: "品牌", prop: function(v) {return v.salesItem.goods.brand;}, clazz: "grey", click: function($this, v) {tools.brand.info($this, v.sales.brand.bid);}},
            category: {field: "category", name: "品类", prop: "salesItem.goods.category", clazz: "grey"},
            status: {field: "status", name: "配送状态", prop: function(v) {return constant.sales().salesDeliveryItem.status.keys[v.status];}, clazz: "red"},
            refundNum: {field: "refundNum", name: "退货数量", prop: function(v) {return utils.changeThrDecimal(v.salesItem.initnum - v.salesItem.num);}, clazz: "blue"},
            trnum: {field: "trnum", name: "配送数量", prop: "salesItem.trnum", clazz: "blue"},
            address: {field: "address", name: "楼盘地址", prop: function(v) {return v.sales.house.village.name + " " + v.sales.house.houseNumber;}, clazz: "grey"},
            orderId: {field: "orderId", name: "装修单号", prop: "sales.orderId", clazz: "blue", click: function($this, v) {tools.decoration.info($this, v.sales.orderId);}},
            protranTime: {field: "protranTime", name: "预计配送时间", prop: "protranTime", clazz: "green"}
        };

        var props = [{
            type: "checkbox",
            field: "data-sdiid",
            prop: "sdiid",
            name: "salesDelivery",
            value: "sdiid",
            attrs: function(v) {
                return {
                    "data-status": v.status,
                    "data-sdiid": v.sdiid,
                    "data-num": v.num
                };
            },
            lblClazz: "lbl blue bigger-150",
            checked: function(v) {
                return false;
            }
        }];

        $.each(pageConfig.propertyArr, function(i, key) {
            propertyMap[key] && props.push(propertyMap[key]);
        });

        return props;
    }

    function buildDeliveryLinebtns() {

        var buttonMap = {
            tran: {name: "配送", clazz: "btn-success", handle: deliveryTran},
            check: {name: "审核", clazz: "btn-warning", handle: deliveryCheck},
            confirm: {name: "确认", clazz: "btn-inverse", handle: deliveryConfirm},
            finish: {name: "完结", clazz: "btn-danger", handle: deliveryFinish},
            protranTime: {name: "编辑", clazz: "btn-danger", handle: deliveryEdit},
            salesPicture: {name: "图片", clazz: "btn-danger", handle: deliveryPicture}
        };

        var btns = {};

        btns["decoration"] = {name: "装修单", clazz: "btn-purple", handle: deliveryDecoration};

        $.each(pageConfig.pageBtn, function(i, key) {
            buttonMap[key] && (btns[key] = buttonMap[key]);
        });

        return btns;
    }

    function buildDeliveryButtons() {

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        $('<span></span>').text('确认').appendTo($adda);

        var $addp = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($addp);
        $('<span></span>').text('配送').appendTo($addp);

        var $adds = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($adds);
        $('<span></span>').text('审核').appendTo($adds);

        var $addw = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($addw);
        $('<span></span>').text('完结').appendTo($addw);

        $checka.click(function() {
            checkAll();
        });

        $adda.click(function(e) {
            e.stopPropagation();
            var option = {};
            var $inputs = com.focusPage('input[name="salesDelivery"]:checked', '#resultList');
            if (!$inputs.length) {com.showAlert(com.warning, "请选择需要进行确认的配送项"); return false;}
            $.each($inputs, function(i, v) {
                option["salesDeliveryItems[" + i + "].sdiid"] = $(v).attr('data-sdiid');
            });
            com.showConfirm('确定要将选中的配送项进行确认吗?', function() {
                com.post(api.sales.confirmSalesDeliveryItem, option, function() {com.showAlert(com.info, "操作成功"); searcher.doSearch();});
            }, function() {searcher.doSearch();});
        });

        $addp.click(function(e) {
            e.stopPropagation();
            var option = {};
            var $inputs = com.focusPage('input[name="salesDelivery"]:checked', '#resultList');
            if (!$inputs.length) {com.showAlert(com.warning, "请选择需要进行配送的配送项"); return false;}
            $.each($inputs, function(i, v) {
                option["salesDeliveryItems[" + i + "].sdiid"] = $(v).attr('data-sdiid');
            });
            com.showConfirm('确定要将选中的配送项进行配送吗?', function() {
                com.post(api.sales.tranSalesDeliveryItem, option, function() {com.showAlert(com.info, "操作成功"); searcher.doSearch();});
            }, function() {searcher.doSearch();});
        });

        $adds.click(function(e) {
            e.stopPropagation();
            var option = {};
            var $inputs = com.focusPage('input[name="salesDelivery"]:checked', '#resultList');
            if (!$inputs.length) {com.showAlert(com.warning, "请选择需要进行审核的配送项"); return;}
            $.each($inputs, function(i, v) {
                option["salesDeliveryItems[" + i + "].sdiid"] = $(v).attr('data-sdiid');
            });
            com.showConfirm('确定要将选中的配送项进行审核吗?', function() {
                com.post(api.sales.checkSalesDeliveryItem, option, function() {com.showAlert(com.info, "操作成功"); searcher.doSearch();});
            }, function() {searcher.doSearch();});
        });

        $addw.click(function(e) {
            e.stopPropagation();
            var option = {};
            var $inputs = com.focusPage('input[name="salesDelivery"]:checked', '#resultList');
            if (!$inputs.length) {com.showAlert(com.warning, "请选择需要进行完结的配送项"); return;}
            $.each($inputs, function(i, v) {
                option["salesDeliveryItems[" + i + "].sdiid"] = $(v).attr('data-sdiid');
            });
            com.showConfirm('确定要将选中的配送项进行完结吗?', function() {
                com.post(api.sales.finishSalesDeliveryItem, option, function() {com.showAlert(com.info, "操作成功"); searcher.doSearch();});
            }, function() {searcher.doSearch();});
        });

        if (salesDelivery.pageType == "check") {
            return [$checka, $adda];
        } else if (salesDelivery.pageType == "init") {
            return [$checka, $addp];
        } else if (salesDelivery.pageType == "tran") {
            return [$checka, $adds];
        } else if (salesDelivery.pageType == "confirm") {
            return [$checka, $addw];
        }
        return [];
    }

    $.each(pageConfig.extraParam, function(i, v) {

        salesDelivery.extraParams["statuses[" + i + "]"] = v;
    });
    
    if (salesDelivery.pageType == "init") {
        salesDelivery.extraParams["companyType"] = "company";
    } else if (salesDelivery.pageType == "tran") {
        salesDelivery.extraParams["companyType"] = "sales.dompany";
    } else if (salesDelivery.pageType == "check") {
        salesDelivery.extraParams["companyType"] = "sales.dompany";
    } else if (salesDelivery.pageType == "confirm") {
        salesDelivery.extraParams["companyType"] = "company";
    } else if (salesDelivery.pageType == "finish") {
        salesDelivery.extraParams["companyType"] = "company";
    } else {
        salesDelivery.extraParams["companyType"] = "company";
    }

    var searcher = new Searcher();

    var searcher = new Searcher();

    searcher.set('condList', 'pagenation', 'resultList', pageConfig.apiPage, salesDelivery.extraParams, pageConfig.condArr, salesDelivery.postData, null, false, buildDeliveryButtons);
    searcher.line(function(v) {
        return v.salesItem.goods.name;
    }, buildDeliveryLineprops(), buildDeliveryLinebtns()).render();


    salesDelivery.btns.saveEditBtn.on('click', function() {

        if (com.validate('EditModal')) {
            return false;
        }

        var options = {
            "salesDeliveryItem.sdiid": salesDelivery.items.sdiid,
            "salesDeliveryItem.comment": salesDelivery.items.comment.val(),
            "salesDeliveryItem.protranTime": String(salesDelivery.items.protranTime.val()).substring(0, 10) + " 00:00:00"
        };

        com.post(api.sales.updateSalesDeliveryItem, options, function(res) {

            com.showAlert(com.info, "操作成功");
            salesDelivery.items.protranTime.val("");
            salesDelivery.items.comment.val("");
            salesDelivery.modals.editModal.modal("hide");
            searcher.doSearch();
        }, null, false);
    });

    salesDelivery.btns.cancelEditBtn.on('click', function() {

        salesDelivery.items.protranTime.val("");
        salesDelivery.items.comment.val("");
        salesDelivery.modals.editModal.modal("hide");
    });

    // 配送数量确认按钮
    com.focusPage("#confirmTranBtn").on('click', function() {

        // 表单验证
        if (com.validate('TranModal')) {
            return false;
        }

        var tranNum = salesDelivery.items.tranNum.val();

        // 验证配送数量
        if (!tranNum || tranNum <= 0) {
            com.showAlert(com.warning, "请输入有效的配送数量");
            return false;
        }

        var option = {};
        option["salesDeliveryItems[0].sdiid"] = salesDelivery.currentSdiid;
        option["salesDeliveryItems[0].trnum"] = tranNum;

        com.post(api.sales.tranSalesDeliveryItem, option, function(res) {

            com.showAlert(com.info, "配送成功，到货量已更新");
            salesDelivery.items.tranNum.val("");
            salesDelivery.modals.tranModal.modal("hide");
            searcher.doSearch();
        }, function(res) {

            com.showAlert(com.error, res.errorMsg || "配送失败");
        });
    });

    // 配送数量取消按钮
    com.focusPage("#cancelTranBtn").on('click', function() {

        salesDelivery.items.tranNum.val("");
        salesDelivery.modals.tranModal.modal("hide");
    });
    
    function checkAll() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    }

    function managedrawing() {

        com.focusPage('#salesDrawing').html("");

        com.post(api.sales.querySalesPicture, {
            "salesPicture.siid": salesDelivery.salesItem.siid
        }, function(data) {

            var salesPictures = data.salesPictures;
            if (salesPictures && salesPictures.length) {
                $.each(salesPictures, function(i, value) {

                    if (value.status == constant.sales().salesPicture.STATUS_YES_SHORT) {
                        appendGalleryElement("salesDrawing", value);
                    }

                });
                com.popup4photos(com.focusPage("#salesDrawing"));
            }
        }, null, false);

        salesDelivery.drawingModal.modal("show");
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.spid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, value.name, null, value.type);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.sales.deleteSalesPicture, {
                "salesPicture.spid": value.spid
            }, function(res) {

                com.focusPage("#gallery_li" + value.spid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

    }

    // 上传图片
    function initUploadBtn() {

        com.uploadify("#salesUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};
            options["salesPicture.sid"] = salesDelivery.salesItem.sid;
            options["salesPicture.name"] = data.strutsUploadsFileName;
            options["salesPicture.path"] = data.resUrl;
            options["salesPicture.siid"] = salesDelivery.salesItem.siid;
            options["salesPicture.type"] = 0;
            options["salesPicture.filesize"] = data.filesize;

            com.post(api.sales.addSalesPicture, options, function(res) {

                var salesPicture = res.salesPicture;

                appendGalleryElement("salesDrawing", salesPicture);

                com.popup4photos("#salesDrawing");

            });

            searcher.doSearch();
        });
    }

});
