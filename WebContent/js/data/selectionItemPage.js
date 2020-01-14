$(function(){

    var selectionItem = {

        modals: {
            selectionItemModal: com.focusPage("#selectionItemModal")
        },
        btns: {
            btnUpdate: com.focusPage("#updateBtn")
        },
        items: {
            num: com.focusPage("#num")
        },
        param: {},
        selection: {},
        oldNum: null
    };

    selectionItem.btns.btnUpdate.bindClick(updateData);

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑数量');
            var $btnRran = $('<a></a>').addClass('btn btn-minier btn-success').html('配送');
            var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-warning').html('审核');
            var $btnConfirm = $('<a></a>').addClass('btn btn-minier btn-inverse').html('确认');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-danger').html('结算');

            var statusStr = {"0": "初始", "1": "配送", "2": "审核", "3": "确认", "4": "结算"};
            var typeStr = {"0": "报价项", "1": "拓展增", "2": "拓展减", "3": "增减增", "4": "增减减"}

            var propertyArr = [
                ["商品名:", v.goods.name, "grey"],
                ["品牌:", v.goods.brand, "grey"],
                ["类型:", typeStr[v.type], "grey"],
                ["工程量:", v.initNum, "blue" ],
                ["数量:",v.num, "blue"],
                ["售价:", v.selling, "blue"],
                ["状态:", statusStr[v.status], "red"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnUpdate).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            switch (v.status) {
                case 0 : $divBtnWrap.append($btnRran);
                    break;
                case 1 : $divBtnWrap.append($btnCheck);
                    break;
                case 2 : $divBtnWrap.append($btnConfirm);
                    break;
                case 3 : $divBtnWrap.append($btnBalance);
                    break;
            }

            $btnUpdate.click(function(e) {
                selectionItem.param.num = v.num;
                selectionItem.param.initNum = v.initNum;
                selectionItem.param.siid = v.siid;
                selectionItem.param.selling = v.selling;
                selectionItem.param.type = v.type;
                selectionItem.selection = v.selection;

                selectionItem.modals.selectionItemModal.modal('show');
            });

            $btnRran.click(function(e){
                updateStatus(v.status, v.siid);
            });

            $btnCheck.click(function(e){
                updateStatus(v.status, v.siid);
            });

            $btnConfirm.click(function(e){
                updateStatus(v.status, v.siid);
            });

            $btnBalance.click(function(e){
                updateStatus(v.status, v.siid);
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

    selectionItemSeacher.init( ["selectionItemOrderId", "selectionItemStatus"], "condList", api.quotation.pageSelectionItemForSupplier, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", null, null, false, null, function(){});

    function updateData(){
        if (com.validate('selectionItemModal')) {
            return false;
        }

        var newNum = selectionItem.items.num.val();

        var oldPrice = utils.accMul(selectionItem.param.num, selectionItem.param.selling);
        var newPrice = utils.accMul(newNum, selectionItem.param.selling);

        if (newNum > selectionItem.param.initNum) {
            com.showAlert(com.warning, "选材项数量不能大于工程量");
            return false;
        }

        calculateAllDomainTotal(selectionItem.param.type, oldPrice, newPrice);

        var options = {
            "selectionItem.siid": selectionItem.param.siid,
            "selectionItem.num": newNum,
            "selection.sid": selectionItem.selection["sid"],
            "selection.total": selectionItem.selection["total"],
            "selection.quotationTotal": selectionItem.selection["quotationTotal"],
            "selection.extensionAddTotal": selectionItem.selection["extensionAddTotal"],
            "selection.extensionReduceTotal": selectionItem.selection["extensionReduceTotal"],
            "selection.addReduceAddTotal": selectionItem.selection["addReduceAddTotal"],
            "selection.addReduceMinusTotal": selectionItem.selection["addReduceMinusTotal"]
        };

        com.post(api.quotation.updateSelectionItem, options, function(res){
            com.showAlert(com.info, "操作成功");
            selectionItemSeacher.doSearch();
        });

        selectionItem.modals.selectionItemModal.modal('hide');
    }

    function updateStatus(status, siid) {
        var str, url;

        switch (status) {
            case 0 : url = api.quotation.tranSelectionItem, str = "配送";
                break;
            case 1 : url = api.quotation.checkSelectionItem, str = "审核";
                break;
            case 2 : url = api.quotation.confirmSelectionItem, str = "确认";
                break;
            case 3 : url = api.quotation.balanceSelectionItem, str = "结算";
                break;
        }

        com.showConfirm("是否确认进入" + str + "阶段", function(){
            com.post(url, {"selectionItem.siid": siid}, function(e){
                selectionItemSeacher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
        });
    }

    function calculateAllDomainTotal(type, oldPrice, newPrice){

        switch (type) {
            case 0 : selectionItem.selection["quotationTotal"] = utils.accAdd(utils.accSub(selectionItem.selection["quotationTotal"], oldPrice), newPrice);
                break;
            case 1 : selectionItem.selection["extensionAddTotal"] = utils.accAdd(utils.accSub(selectionItem.selection["extensionAddTotal"], oldPrice), newPrice);
                break;
            case 2 : selectionItem.selection["extensionReduceTotal"] = utils.accAdd(utils.accSub(selectionItem.selection["extensionReduceTotal"], oldPrice), newPrice);
                break;
            case 3 : selectionItem.selection["addReduceAddTotal"] = utils.accAdd(utils.accSub(selectionItem.selection["addReduceAddTotal"], oldPrice), newPrice);
                break;
            case 4 : selectionItem.selection["addReduceMinusTotal"] = utils.accAdd(utils.accSub(selectionItem.selection["addReduceMinusTotal"], oldPrice), newPrice);
                break;
        }

        var  addPrice = utils.accAdd(utils.accAdd(selectionItem.selection["quotationTotal"], selectionItem.selection["extensionAddTotal"]), selectionItem.selection["addReduceAddTotal"]);
        var  MinusPrice = utils.accAdd(selectionItem.selection["extensionReduceTotal"], selectionItem.selection["addReduceMinusTotal"]);
        var total = utils.accSub(addPrice, MinusPrice);

        selectionItem.selection["total"] = total;
    }


})();
