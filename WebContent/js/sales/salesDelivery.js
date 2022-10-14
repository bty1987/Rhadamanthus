$(function() {

    var salesDelivery = {

        salesItem: null,

        modals: {
            editModal: com.focusPage("#EditModal"),
            decorationInfo: com.focusPage("#decorationInfo"),
        },
        items: {
            protranTime: com.focusPage("#protranTime"),
            comment: com.focusPage("#comment"),
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
    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDecoration = $('<a></a>').addClass('btn btn-minier btn-purple').html('装修单');
            var $btnTran = $('<a></a>').addClass('btn btn-minier btn-success').html('配送');
            var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-warning').html('审核');
            var $btnConfirm = $('<a></a>').addClass('btn btn-minier btn-inverse').html('确认');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-danger').html('完结');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-danger').html('编辑');
            var $btnPicture = $('<a></a>').addClass('btn btn-minier btn-danger').html('图片');

            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.salesItem.goods.name);
            var $label = $('<label></label>');
            var $input = $('<input></input>').attr({
                'class': 'ace ace-checkbox-2',
                'name': 'salesDelivery',
                'type': 'checkbox',
                'data-status': v.status,
                'data-sdiid': v.sdiid,
                'data-num': v.num,
            }).val(v.sdiid);

            $h3.append($label.append($input).append($span));

            var propertyArr = [];

            $.each(pageConfig.propertyArr, function(pi, pv) {

                switch (pv) {
                    case "salesno":
                        propertyArr.push(["销售单号:", v.sales.no, "blue"]);
                        break;
                    case "num":
                        propertyArr.push(["数量:", v.salesItem.num, "blue"]);
                        break;
                    case "createTime":
                        propertyArr.push(["创建时间:", v.createTime, "green"]);
                        break;
                    case "tranTime":
                        propertyArr.push(["配送时间:", v.tranTime, "green"]);
                        break;
                    case "checkTime":
                        propertyArr.push(["审核时间:", v.checkTime, "green"]);
                        break;
                    case "confirmTime":
                        propertyArr.push(["确认时间:", v.confirmTime, "green"]);
                        break;
                    case "finishTime":
                        propertyArr.push(["完结时间:", v.finishTime, "green"]);
                        break;
                    case "creater":
                        propertyArr.push(["创建人:", v.creater.currentName, "grey"]);
                        break;
                    case "traner":
                        propertyArr.push(["配送人:", v.traner.currentName, "grey"]);
                        break;
                    case "checker":
                        propertyArr.push(["审核人:", v.checker.currentName, "grey"]);
                        break;
                    case "confirmer":
                        propertyArr.push(["确认人:", v.confirmer.currentName, "grey"]);
                        break;
                    case "finisher":
                        propertyArr.push(["完结人:", v.finisher.currentName, "grey"]);
                        break;
                    case "comment":
                        propertyArr.push(["备注:", v.comment, "grey"]);
                        break;
                    case "brand":
                        propertyArr.push(["品牌:", v.salesItem.goods.brand, "grey"]);
                        break;
                    case "category":
                        propertyArr.push(["品类:", v.salesItem.goods.category, "grey"]);
                        break;
                    case "status":
                        propertyArr.push(["配送状态:", constant.sales().salesDeliveryItem.status.keys[v.status], "red"]);
                        break;
                    case "refundNum":
                        propertyArr.push(["退货数量:", utils.changeThrDecimal(v.salesItem.initnum - v.salesItem.num), "blue"]);
                        break;
                    case "address":
                        propertyArr.push(["楼盘地址:", (v.sales.house.village.name + " " + v.sales.house.houseNumber), "grey"]);
                        break;
                    case "orderId":
                        propertyArr.push(["装修单号:", v.sales.orderId, "blue"]);
                        break;
                    case "protranTime":
                        propertyArr.push(["预计配送时间:", v.protranTime, "green"]);
                        break;
                }
            });

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDecoration);

            $.each(pageConfig.pageBtn, function(k, b) {

                switch (b) {
                    case "tran":
                        $divBtnWrap.append($btnTran);
                        break;
                    case "check":
                        $divBtnWrap.append($btnCheck);
                        break;
                    case "confirm":
                        $divBtnWrap.append($btnConfirm);
                        break;
                    case "finish":
                        $divBtnWrap.append($btnFinish);
                        break;
                    case "protranTime":
                        $divBtnWrap.append($btnEdit);
                        break;
                    case "salesPicture":
                        $divBtnWrap.append($btnPicture);
                        break;
                }
            });

            $divBtnWrap.appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnDecoration.click(function() {

                com.focusPage("text").css("line-height", "27px");

                com.post(api.decoration.queryDecorationByOrderId, {
                    "decorationOrderId": v.sales.orderId
                }, function(res) {

                    var decorationInfo = res.decoration;

                    com.focusPage("#orderId").html(decorationInfo.orderId);// 装修单号
                    com.focusPage("#address").html(decorationInfo.house.village.name + '' + decorationInfo.house.houseNumber);// 装修楼盘地址
                    com.focusPage("#designer").html(decorationInfo.designer.currentName == null ? "无" : decorationInfo.designer.currentName);// 装修设计师
                    com.focusPage("#escorter").html(decorationInfo.escorter.currentName == null ? "无" : decorationInfo.escorter.currentName);// 装修跟单员
                    com.focusPage("#supervisor").html(decorationInfo.supervisor.currentName == null ? "无" : decorationInfo.supervisor.currentName);// 装修监理
                    com.focusPage("#typeness").html(constant.decoration().decoration.typeness.keys[decorationInfo.typeness]);
                    com.focusPage("#projectStatus").html(constant.construction().constructionSchedule.status.keys[decorationInfo.projectStatus]);

                    salesDelivery.modals.decorationInfo.modal("show");
                });
            });

            $btnTran.click(function(e) {

                com.post(api.sales.tranSalesDeliveryItem, {
                    "salesDeliveryItem.sdiid": v.sdiid
                }, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnCheck.click(function(e) {

                com.post(api.sales.checkSalesDeliveryItem, {
                    "salesDeliveryItem.sdiid": v.sdiid
                }, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnConfirm.click(function(e) {

                var option = {};
                option["salesDeliveryItems[0].sdiid"] = v.sdiid;
                com.post(api.sales.confirmSalesDeliveryItem, option, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnFinish.click(function(e) {

                com.showConfirm('确认销售项配送完结?', function() {

                    com.post(api.sales.finishSalesDeliveryItem, {
                        "salesDeliveryItem.sdiid": v.sdiid
                    }, function(e) {

                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnEdit.click(function(e) {

                salesDelivery.items.sdiid = v.sdiid;
                if (v.protranTime != null) {
                    salesDelivery.items.protranTime.val(v.protranTime.substring(0, 10));
                }
                if (salesDelivery.pageType != 'init') {
                    salesDelivery.items.protranTime.attr("disabled", "disabled");
                }
                salesDelivery.items.comment.val(v.comment);
                salesDelivery.modals.editModal.modal("show");
            });

            $btnPicture.click(function(e) {

                salesDelivery.salesItem = v.salesItem;

                managedrawing();
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

    $.each(pageConfig.extraParam, function(i, v) {

        salesDelivery.extraParams["statuses[" + i + "]"] = v;
    });

    var searcher = new Searcher();

    searcher.init(pageConfig.condArr, "condList", pageConfig.apiPage, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", salesDelivery.postData, salesDelivery.extraParams, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('确认').appendTo($adda);

        $adda.click(function(e) {

            e.stopPropagation();

            var option = {};

            var $inputs = com.focusPage('input[name="salesDelivery"]:checked', '#resultList');

            if (!$inputs.length) {

                com.showAlert(com.warning, "请选择需要进行确认的配送项");

                return;

            }

            $.each($inputs, function(i, v) {

                var $this = $(v);

                option["salesDeliveryItems[" + i + "].sdiid"] = $this.attr('data-sdiid');
            });

            com.showConfirm('确定要将选中的配送项进行确认吗?', function(index, layero) {

                com.post(api.sales.confirmSalesDeliveryItem, option, function(res) {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();

                });

            }, function() {

                searcher.doSearch();
            });
        });

        if (salesDelivery.pageType == "check") {
            return [$adda];
        } else {
            return [];
        }

    }, 'resultList');

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
