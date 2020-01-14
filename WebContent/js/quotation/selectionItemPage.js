$(function(){

    var selectionItem = {

        modals: {
            updateSelectionItemModal: com.focusPage('#updateSelectionItemModal'),
            finishSelectionItemModal: com.focusPage('#finishSelectionItemModal'),
            checkSelectionItemModal: com.focusPage('#checkSelectionItemModal')
        },
        btns: {
            updateBtn: com.focusPage('#updateBtn'),
            finishSaveBtn: com.focusPage('#finishSaveBtn'),
            checkSaveBtn: com.focusPage('#checkSaveBtn')
        },
        updateModalsItems: {
            num: com.focusPage("#num")
        },
        finishModalsItems: {
            refnum: com.focusPage('#refnum')
        },
        checkModalsItems: {
            comment: com.focusPage('#comment')
        },
        title: com.focusPage("#myModalLabel"),
        parameters: {
            siid: 0,
            sid: 0,
            status: 0,
            num: 0
        },
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
    }  else if (selectionItem.pageType == "init") {
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

    selectionItem.modals.finishSelectionItemModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(selectionItem.finishModalsItems);
    });

    selectionItem.modals.checkSelectionItemModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(selectionItem.checkModalsItems);
    });

    selectionItem.btns.updateBtn.bindClick(updateData);
    selectionItem.btns.checkSaveBtn.bindClick(checkSelectionItem);
    selectionItem.btns.finishSaveBtn.bindClick(finishSelectionItem);

    var displayFunc  = (function(){

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

        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.goods.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $_ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCompile = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnRran = $('<a></a>').addClass('btn btn-minier btn-success').html('配送');
            var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-warning').html('审核');
            var $btnConfirm = $('<a></a>').addClass('btn btn-minier btn-inverse').html('确认');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-danger').html('完结');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-pink').html('结算');

            var propertyArr = [
                ["品牌:", v.goods.brand, "grey"],
                ["品类:", v.goods.category, "grey"],
                ["商品编号:", v.goods.no, "blue" ],
                ["功能区名称:", v.functionAreaName, "grey"],
                ["类型:", selectionItem.typeList[v.type], "red"],
                ["状态:", selectionItem.statusList[v.status], "red"],
                ["结算价:", v.selling, "blue"],
                ["数量:", v.num, "blue"],
                ["备注:", v.comment, "grey"],
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
            ];

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

            switch (v.status) {
                case 0 : $divBtnWrap.append($btnCompile).append($btnRran).appendTo($h3);
                    break;
                case 1 : $divBtnWrap.append($btnCompile).append($btnCheck).appendTo($h3);
                    break;
                case 2 : $divBtnWrap.append($btnConfirm).appendTo($h3);
                    break;
                case 3 : $divBtnWrap.append($btnFinish).appendTo($h3);
                    break;
                case 4 : $divBtnWrap.append($btnBalance).appendTo($h3);
                    break;
            }

            $liLine.append($h3).append($ulProperty).append($_ulProperty);

            $btnCompile.click(function(e) {
                selectionItem.editFlg = true;
                selectionItem.parameters.siid = v.siid;

                selectionItem.title.text("编辑数量");
                selectionItem.modals.updateSelectionItemModal.modal("show");
            });

            $btnRran.click(function(e){
                selectionItem.editFlg = false;
                selectionItem.parameters.siid = v.siid;
                selectionItem.updateModalsItems.num.val(v.num);

                selectionItem.title.text("配送");
                selectionItem.modals.updateSelectionItemModal.modal("show");
            });

            $btnCheck.click(function(e){
                selectionItem.parameters.siid = v.siid;

                selectionItem.modals.checkSelectionItemModal.modal('show');
            });

            $btnConfirm.click(function(e){
                com.post(api.quotation.confirmSelectionItem, {"selectionItem.siid": v.siid}, function(e){
                    selectionItemSeacher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnFinish.click(function(e){
                selectionItem.parameters.siid = v.siid;
                selectionItem.parameters.num = v.num;
                selectionItem.finishModalsItems.refnum.val(0);

                selectionItem.modals.finishSelectionItemModal.modal('show');
            });

            $btnBalance.click(function(e){
                com.post(api.quotation.balanceSelectionItem, {"selectionItem.siid": v.siid}, function(e){
                    selectionItemSeacher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
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

    selectionItemSeacher.init(selectionItem.query, "condList", selectionItem.url, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", selectionItem.postData, selectionItem.status, false, null, function(){});

    function updateData() {
        if(com.validate('updateSelectionItemModal')) return false;

        var url = selectionItem.editFlg ? api.quotation.updateSelectionItem : api.quotation.tranSelectionItem;

        var options = {
            "selectionItem.num": selectionItem.updateModalsItems.num.val(),
            "selectionItem.siid": selectionItem.parameters.siid
        };

        com.post(url, options, function(res) {
            selectionItemSeacher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.updateSelectionItemModal.modal("hide");
    }

    function checkSelectionItem() {
        if(com.validate('checkSelectionItemModal')) return false;

        var options = {
            "selectionItem.comment": selectionItem.checkModalsItems.comment.val(),
            "selectionItem.siid": selectionItem.parameters.siid
        };

        com.post(api.quotation.checkSelectionItem, options, function(res) {
            selectionItemSeacher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.checkSelectionItemModal.modal("hide");
    }

    function finishSelectionItem() {
        if(com.validate('finishSelectionItemModal')) return false;

        if (selectionItem.finishModalsItems.refnum.val() > selectionItem.parameters.num) {
            com.showAlert(com.warning, '退数量不能大于当前数量');
            return false;
        }

        var options = {
            "selectionItem.refnum": selectionItem.finishModalsItems.refnum.val(),
            "selectionItem.siid": selectionItem.parameters.siid
        };

        com.post(api.quotation.finishSelectionItem, options, function(res) {
            selectionItemSeacher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.finishSelectionItemModal.modal("hide");
    }
});
