$(function(){

    var selectionItem = {

        modals: {
            updateSelectionItemModal: com.focusPage('#updateSelectionItemModal'),
        },
        btns: {
            updateBtn: com.focusPage('#updateBtn'),
        },
        updateModalsItems: {
            num: com.focusPage("#num"),
            comment: com.focusPage('#comment'),
        },
        title: com.focusPage("#myModalLabel"),
        dcomment: com.focusPage("#dcomment"),
        parameters: {
            siid: 0,
            sid: 0,
            status: 0,
            num: 0
        },
        showPostprice: false,
        typeList: [],
        statusList: [],
        postData : '',
        editFlg: true,
        url: api.quotation.pageSelectionItem,
        pageType : params['urlLoadParams'].type,
        query: ["selectionItemOrderId", "selectionItemGoodsCategory", "selectionItemGoodsBrand", "selectionItemGoodsName"]
    };

    if (selectionItem.pageType == "supplier") {
        selectionItem.query.push("selectionItemStatus");
        selectionItem.url = api.quotation.pageSelectionItemForSupplier;
        selectionItem.postData = "selectionItemForSupplierPostData";
    } else if (selectionItem.pageType == "escorter") {
        selectionItem.escorter = true;
        selectionItem.url = api.quotation.pageSelectionItemForEscorter;
        selectionItem.postData = "selectionItemForEscorterPostData";
    } else if (selectionItem.pageType == "expert") {
        selectionItem.query.push("selectionItemStatus");
        selectionItem.status = {"selectionItem.status": null};
        selectionItem.postData = "selectionItemForExpertPostData";
    } else if (selectionItem.pageType == "init") {
        selectionItem.status = {"selectionItem.status": 0};
        selectionItem.postData = "selectionItemForInitPostData";
    } else if (selectionItem.pageType == "tran") {
        selectionItem.status = {"selectionItem.status": 1};
        selectionItem.postData = "selectionItemForTranPostData";
    } else if (selectionItem.pageType == "check") {
        selectionItem.status = {"selectionItem.status": 2};
        selectionItem.postData = "selectionItemForCheckPostData";
    } else if (selectionItem.pageType == "confirm") {
        selectionItem.status = {"selectionItem.status": 3};
        selectionItem.postData = "selectionItemForConfirmPostData";
    } else if (selectionItem.pageType == "finish") {
        selectionItem.status = {"selectionItem.status": 4};
        selectionItem.postData = "selectionItemForFinishPostData";
    } else if (selectionItem.pageType == "balance") {
        selectionItem.status = {"selectionItem.status": 5};
        selectionItem.postData = "selectionItemForBalancePostData";
    }

    com.post(api.ds.quotation, {}, function(res){
        selectionItem.statusList = res.selectionItemStatus.split("key", "value");
        selectionItem.typeList = res.selectionItemType.split("key", "value");
    }, null, false);

    selectionItem.modals.updateSelectionItemModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(selectionItem.updateModalsItems);
    });

    selectionItem.btns.updateBtn.bindClick(updateData);

    var displayFunc  = (function(){

        $('input[type=checkbox][name=selectionItem]').prop('checked', false);

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $_ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCompile = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnRran = $('<a></a>').addClass('btn btn-minier btn-success').html('配送');
            var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-warning').html('审核');
            var $btnConfirm = $('<a></a>').addClass('btn btn-minier btn-inverse').html('确认');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-danger').html('完结');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-pink').html('结算');
            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-purple').html('打印');

            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.goods.name);
            var $label = $('<label></label>');
            var $input = $('<input></input>').attr({
                'class': 'ace ace-checkbox-2',
                'name': 'selectionItem',
                'type': 'checkbox',
                'data-status': v.status,
                'data-num': v.num,
            }).val(v.siid);
            $h3.append($label.append($input).append($span));

            var propertyArr = [
                ["品牌:", v.goods.brand, "grey"],
                ["品类:", v.goods.category, "grey"],
                ["商品编号:", v.goods.no, "blue" ],
                ["功能区名称:", v.areaName, "grey"],
                ["类型:", selectionItem.typeList[v.type], "red"],
                ["状态:", selectionItem.statusList[v.status], "red"],
                ["数量:", [2, 4].indexOf(v.type) != -1 ? -v.num : v.num, "blue"],
                ["备注:", v.comment, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["配送人:", v.traner.currentName, "grey"],
                ["配送时间:", v.tranTime, "green"],
                ["审核人:", v.checker.currentName, "grey"],
                ["审核时间:", v.checkTime, "green"],
                ["确认人:", v.confirmer.currentName, "grey"],
                ["确认时间:", v.confirmTime, "green"],
                ["完结人:", v.finish.currentName, "grey"],
                ["完结时间:", v.finishTime, "green"],
                ["结算人:", v.balancer.currentName, "grey"],
                ["结算时间:", v.balanceTime, "green"],
            ];

            var _propertyArr = [
                ["装修单号:", v.decoration.orderId , "blue"],
                ["楼盘:", v.decoration.house.village.name, "grey"],
                ["地址:", v.decoration.house.houseNumber, "grey"],
                ["建筑面积:", v.decoration.house.buildArea, "blue" ],
                ["设计师:", v.decoration.designer.currentName, "grey"],
                ["业务员:", v.decoration.salesman.currentName, "grey" ],
                ["监理人员姓名:", v.decoration.supervisor.currentName != null ? v.decoration.supervisor.currentName : "无", "grey"],
                ["监理人员电话:", v.decoration.supervisor.phone != null ? v.decoration.supervisor.phone : "无", "grey"],
                ["跟单员:", v.decoration.escorter.currentName != null ? v.decoration.escorter.currentName : "无", "grey"],
            ];

            if (v.status <= 2) {// 显示工程量
                var initNumArr = ["报价项工程量:", v.initNum, "blue"];

                propertyArr.splice(7, 0, initNumArr);
            }
            if (selectionItem.pageType == "supplier" || v.status >= 4) {// 显示结算价
                var postpriceArr = ["结算价:", v.postprice, "blue"];
                var prepriceArr = ["预算金额:", v.preprice, "blue"];

                propertyArr.splice(6, 0, postpriceArr, prepriceArr);
            }
            if (selectionItem.pageType == "expert") {
                var prepriceArr = ["报价项单价:", v.preprice, "blue"];
                propertyArr.splice(6, 0, prepriceArr);
            }

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $.each(_propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($_ulProperty);
            });

            if (selectionItem.pageType == "supplier") {
                v.status == 2 ? $divBtnWrap.append($btnConfirm) : null;
            } else {
                switch (v.status) {
                    case 0 : $divBtnWrap.append($btnCompile).append($btnRran);
                        break;
                    case 1 : $divBtnWrap.append($btnCompile).append($btnCheck);
                        break;
                    case 2 : $divBtnWrap.append($btnConfirm);
                        break;
                    case 3 : $divBtnWrap.append($btnFinish);
                        break;
                    case 4 : $divBtnWrap.append($btnBalance);
                        break;
                }
            }

            $divBtnWrap.append($btnPrint).appendTo($h3);
            $liLine.append($h3).append($ulProperty).append($_ulProperty);

            $btnCompile.click(function(e) {
                selectionItem.editFlg = true;
                selectionItem.parameters.siid = v.siid;

                selectionItem.title.text("编辑数量");
                selectionItem.dcomment.show();
                selectionItem.modals.updateSelectionItemModal.modal("show");
            });

            $btnRran.click(function(e) {
                selectionItem.editFlg = false;
                selectionItem.parameters.siid = v.siid;
                selectionItem.updateModalsItems.num.val(v.num);

                selectionItem.title.text("配送");
                selectionItem.dcomment.hide();
                selectionItem.modals.updateSelectionItemModal.modal("show");
            });

            $btnCheck.click(function(e) {

                var option = {
                    "selectionItem.siid": v.siid,
                    "selectionItem.checker": null,
                };

                if (selectionItem.escorter) {
                    option["selectionItem.checker.uid"] = v.decoration.escorter.uid;
                }

                com.post(api.quotation.checkSelectionItem, option, function(e){
                    selectionItemSeacher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnConfirm.click(function(e) {
                com.post(api.quotation.confirmSelectionItem, {"selectionItem.siid": v.siid}, function(e) {
                    selectionItemSeacher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnFinish.click(function(e) {
                com.post(api.quotation.finishSelectionItem, {"selectionItem.siid": v.siid}, function(res) {
                    selectionItemSeacher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnBalance.click(function(e) {
                com.post(api.quotation.balanceSelectionItem, {"selectionItems[0].siid": v.siid}, function(e) {
                    selectionItemSeacher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnPrint.click(function(e) {
                com.post(api.quotation.querySelectionByOrderId, {"selection.orderId": v.decoration.orderId}, function(res) {
                    params.supplierPage = selectionItem.pageType == "supplier" ? true : false;

                    params.selectionOrderId = res.selection.orderId;
                    com.popup("打印选材", api.index.selectionOutputIndex.url, null, null, true);
                }, null, false);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var selectionItemSeacher = new Searcher();

    selectionItemSeacher.init(selectionItem.query, "condList", selectionItem.url, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", selectionItem.postData, selectionItem.status, false, null, function(){

        var btns = [];

        if (selectionItem.pageType == "init" || selectionItem.pageType == "expert") {
            var $a = createbtn("batchDelivery", "批量配送", "btn-success");
            btns.push($a);
        }

        if (selectionItem.pageType == "finish" || selectionItem.pageType == "expert") {
            var $a = createbtn("batchBalance", "批量结算", "btn-pink");
            btns.push($a);
        }

        function createbtn (id, text, color) {

            var $a = $('<a></a>').addClass('btn btn-minier pull-left ' + color).attr({'id': id, 'style': 'margin: 0px 3px;'});
            var $i = $('<i></i>').addClass('icon-plus bigger-110').appendTo($a);
            var $span = $('<span></span>').text(text).appendTo($i);

            return $a;
        }

        return btns;
    });

    com.focusPage('#batchDelivery').click(function() {
        bulkOperation(api.quotation.tranSelectionItem, 'delivery');
    });
    com.focusPage('#batchBalance').click(function() {
        bulkOperation(api.quotation.balanceSelectionItem, 'balance');
    });

    function bulkOperation(url, type) {

        var $items = $('input[type=checkbox][name=selectionItem]:checked');
        var options = {};

        if ($items.length == 0) {
            com.showAlert(com.warning, "请选择项目");
            return false;
        }

        $.each($items, function(i, v) {
            options["selectionItems["+i+"].siid"] = $(this).val();
            // 通过类型设置请求参数
            if (type == 'delivery') {
                options["selectionItems["+i+"].num"] = $(this).attr('data-num');
            }

        });

        com.post(url, options, function(res){
            selectionItemSeacher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }

    function updateData() {
        if(com.validate('updateSelectionItemModal')) return false;

        var url = null, options = {};

        if (selectionItem.editFlg) {
            options = {
                "selectionItem.num": selectionItem.updateModalsItems.num.val(),
                "selectionItem.comment": selectionItem.updateModalsItems.comment.val(),
                "selectionItem.siid": selectionItem.parameters.siid,
            };
            url = api.quotation.updateSelectionItem;
        } else {
            options = {
                "selectionItems[0].num": selectionItem.updateModalsItems.num.val(),
                "selectionItems[0].siid": selectionItem.parameters.siid
            };
            url = api.quotation.tranSelectionItem;
        }

        com.post(url, options, function(res) {
            selectionItemSeacher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.updateSelectionItemModal.modal("hide");
    }

});
