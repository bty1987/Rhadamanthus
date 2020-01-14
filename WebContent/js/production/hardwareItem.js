$(function () {

    var hardwareItem = {
        btns:{
            saveItemBtn : com.focusPage("#saveItemBtn"),
            canceItemlBtn : com.focusPage("#canceItemlBtn")
        },

        models:{
            addHardwareItemModal:com.focusPage("#addHardwareItemModal")
        },

        items:{
            name : com.focusPage("#name"),
            unitPrice : com.focusPage("#unitPrice"),
            itemNum : com.focusPage("#itemNum"),
            measurementUnit : com.focusPage("#measurementUnit"),
            total : com.focusPage("#total"),
            comment : com.focusPage("#Comment")
        },
        hid: params.hid,
        hardwareStatus : params.hardwareStatus,
        productionStatus : params.productionStatus
    };


    hardwareItem.btns.saveItemBtn.bindClick(addItem);

    hardwareItem.models.addHardwareItemModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(hardwareItem.items);
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('clearfix item-orange');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var total = utils.accMul(v.unitprice,v.num);

            var propertyArr = [
                ["数量:", v.num, "blue"],
                ["单位:", v.measurementunit,"grey"],
                ["单价:", v.unitprice,"blue"],
                ["总价:",total,"blue"],
                ["说明:", v.comment,"grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $h3.append($title).append($btnDiv);
            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($btnDelete);

            hidBtn($btnDelete,hardwareItem.hardwareStatus);

            //删除按钮
            $btnDelete.click(function (e) {
                delectableItem(v.hiid);
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
   
    var hardwareItemSearcher = new Searcher();

    hardwareItemSearcher.init([],"condList",api.production.pageHardwareItemByHid,function(data){
        displayFunc.init("itemResultList",data);
    },"itemPagenation","hardwareItemPostData",{"hardware.hid" : hardwareItem.hid}, false, null, function (){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addHardwareItem').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        hidBtn($adda,hardwareItem.hardwareStatus);
        return [$adda];
    },"itemResultList");

    com.focusPage('#addHardwareItem').click(function() {
        hardwareItem.models.addHardwareItemModal.modal("show");
    });

    com.focusPage('#back').click(function() {
        com.switchPage(api.index.hardwareIndex.url);
    });

    function delectableItem(hiid) {
        com.showConfirm("是否确认删除", function(){
            com.post(api.production.deleteHardwareItem, {"hardwareItem.hiid": hiid}, function () {
                hardwareItemSearcher.doSearch();
                com.showAlert(com.info, "删除成功");
            });
        });
    };

    function addItem(){

        if (com.validate('addHardwareItemModal')) {
            return false;
        };


        var options = {

            "hardware.hid" : hardwareItem.hid,
            "hardwareItems[0].name": hardwareItem.items.name.val(),
            "hardwareItems[0].unitprice": hardwareItem.items.unitPrice.val(),
            "hardwareItems[0].num": hardwareItem.items.itemNum.val(),
            "hardwareItems.measurementunit": hardwareItem.items.measurementUnit.val(),
            "hardwareItems[0].total": hardwareItem.items.total.val(),
            "hardwareItems[0].comment": hardwareItem.items.comment.val(),
    };
        com.post(api.production.addHardwareItem,options,function(res){
            hardwareItemSearcher.doSearch();
            com.showAlert(com.info,"添加成功");
        });
        hardwareItem.models.addHardwareItemModal.modal("hide");
    };

    hardwareItem.items.itemNum.on("change",function(){
        com.clearValidator();
        if(!com.validate('itemNum')){
            calcTotal();
        }
    });

    function calcTotal(){
        var _num =  hardwareItem.items.itemNum.val();
        var _unitPrice =  hardwareItem.items.unitPrice.val();
        var _total = utils.accMul(parseFloat(_num+''),parseFloat(_unitPrice+''));
        hardwareItem.items.total.val(_total);
    };

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if (hardwareItem.productionStatus != null){
           if (hardwareItem.productionStatus == 9 || hardwareItem.productionStatus == 10 ) {
               btnId.addClass('hide');
            }
        }else if(otherStatus == 3|| otherStatus == 4){
            btnId.addClass('hide');
        }

    };

    com.initTypeahead('name', api.production.queryQuoteItemByPinyin,"quoteItem.pinyin","quoteItem.name", "quoteItems", "qiid", "name",function(list,k, v) {
        $.each(list, function (index, val) {

                if (val.qiid == k) {
                    hardwareItem.items.measurementUnit.val(val.measurementunit);
                    hardwareItem.items.unitPrice.val(val.unitprice);
                    hardwareItem.items.itemNum.val(1);
                    hardwareItem.items.total.val(utils.accMul(val.unitprice, hardwareItem.items.itemNum.val()));
                }
            });
        return v;
    });

});