
$(function(){

    var awardStock = {

        saveBtn: com.focusPage("#saveBtn"),
        updateBtn: com.focusPage("#updateBtn"),

        leave: com.focusPage("#leave"),
        stock: com.focusPage("#stock"),
        money: com.focusPage("#money"),
        join: com.focusPage("#join"),
        subType: com.focusPage("#subType"),
        moneys: com.focusPage("#moneys"),

        items : {
            no : com.focusPage("#no"),
            name : com.focusPage("#name"),
            num : com.focusPage("#num"),
            type : com.focusPage("#type"),
            storeroom : com.focusPage("#storeroom"),
            subtype : com.focusPage("#subtype"),
            price : com.focusPage("#price"),
            content : com.focusPage("#content"),
            format : com.focusPage("#format"),
            warehousing : com.focusPage("#warehousing"),
            warehousend : com.focusPage("#warehousend"),
            
            comment: com.focusPage("#comment"),
            
            no2 : com.focusPage("#no2"),
            name2 : com.focusPage("#name2"),
            nownum : com.focusPage("#nownum"),
            isPrefor  : com.focusPage("#isPrefor"),
            isStock :  com.focusPage("#isStock"),
            isPayment :  com.focusPage("#isPayment"),
            price2 :  com.focusPage("#price2"),
            awardRecordSubtype: com.focusPage("#awardRecordSubtype"),
        },

        asid: null,
        num: null,

        storeroom : {},
        subtype: {},
        subtypeOfWarehousing : [],
        subtypeOfWarehousend: [],
        type : {},
        flag: 0
    };

    awardStock.saveBtn.bindClick(saveData);
    awardStock.updateBtn.bindClick(updateData);

    com.post(api.ds.information, {}, function (res) {
        awardStock.items.storeroom.bindData(res.awardStoreRoom, "key", "value", false);
        awardStock.items.subtype.bindData(res.awardSubtype, "key", "value", false);
        awardStock.items.type.bindData(res.awardStockType, "key", "value", false);
        awardStock.items.isPrefor.bindData(res.isPreforType, "key", "value", false);
        awardStock.items.isStock.bindData(res.isStockType, "key", "value", false);
        awardStock.items.isPayment.bindData(res.isPaymentType, "key", "value", false);

        $.each(res.awardRecordSubtype, function(i,v) {
            if(v.key!=1 && v.key%2==0) {
                awardStock.subtypeOfWarehousing.push(v);
            }else{
                awardStock.subtypeOfWarehousend.push(v);
            }
        });
        
        awardStock.storeroom = res.awardStoreRoom.split("key", "value");
        awardStock.subtype = res.awardSubtype.split("key", "value");
        awardStock.type = res.awardStockType.split("key", "value");
        
    },null,false);

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);

            if(listData && listData.length){
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData,function(i, v){
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function(){
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');
            var titleName ='编号,名称,数量,类型,子类,备注,库房信息,规格,状态,库存标识,业绩标识,金额标识';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {
            
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col12');
            
            var propertyArr = [
                [v.no,'grey'],
                [v.name,'grey'],
                [v.num,'blue'],
                [awardStock.type[v.type],'grey'],
                [awardStock.subtype[v.subtype] , "grey"],
                [v.content,'grey'],
                [awardStock.storeroom[v.storeroom] , "grey"],
                [v.format,'grey'],
                [v.status =="0" ? "启用" : "禁用",'red'],
                [v.isStock=="0" ? "加入库存" : "不加入库存",'red'],
                [v.isPrefor=="0" ? "计算业绩" : "不计算业绩",'red'],
                [v.isPayment=="0" ? "计入金额" : "不计入金额",'red']
            ];

            $.each(propertyArr, function (i, val) {
                var $cell = $('<div></div>').addClass('cell ' + val[1]).html(val[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnBan = $('<li></li>').append($('<a></a>').html('禁用'));
            var $warehousing = $('<li></li>').append($('<a></a>').html('入库'));
            var $warehousend = $('<li></li>').append($('<a></a>').html('出库'));
            var $inventory = $('<li></li>').append($('<a></a>').html('盘点'));
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));
            var $record = $('<li></li>').append($('<a></a>').html('记录'));

            $btnUl.append($btnStart).append($btnBan).append($warehousing).append($warehousend).append($inventory).append($update).append($record)

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            /*状态启用*/
            $btnStart.click(function(){
                
                if(v.status == 0){
                    com.showAlert(com.warning, '已启用');
                    return false;
                }

                changeStatus(v.asId, 0);
            });

            /*状态禁用*/
            $btnBan.click(function(){
                
                if(v.status == 1){
                    com.showAlert(com.warning, '已禁用');
                    return false;
                }

                changeStatus(v.asId, 1);
            });

            $warehousend.click(function(){
                
                if(v.isStock == 1){
                    com.showAlert(com.warning, "此商品禁止出库!");
                    return false;
                }

                com.popup4model('#layerAdd2', '奖品出库' ,function(){
                    com.cleanItems(awardStock.items);

                    awardStock.items.no2.val(v.no).attr('disabled', 'disabled');
                    awardStock.items.name2.val(v.name).attr('disabled', 'disabled');
                    awardStock.items.nownum.val(v.num);

                    awardStock.items.awardRecordSubtype.bindData(awardStock.subtypeOfWarehousend, "key", "value", false);

                    awardStock.join.hide();
                    awardStock.leave.show();
                    awardStock.money.show();
                    awardStock.stock.hide();
                    awardStock.subType.show();

                    awardStock.asid = v.asId;
                    awardStock.flag = 2;
                });
            });

            $warehousing.click(function(){

                if(v.isStock == 1){
                    com.showAlert(com.warning, "此商品禁止入库!");
                    return false;
                }

                com.popup4model('#layerAdd2', '奖品入库', function(){
                    awardStock.asid = v.asId;
                    awardStock.flag = 3;
                }, null, function(){
                    com.cleanItems(awardStock.items);

                    awardStock.items.no2.val(v.no).attr('disabled', 'disabled');
                    awardStock.items.name2.val(v.name).attr('disabled', 'disabled');
                    awardStock.items.nownum.val(v.num);

                    awardStock.items.awardRecordSubtype.bindData(awardStock.subtypeOfWarehousing, "key", "value", false);

                    awardStock.join.show();
                    awardStock.leave.hide();
                    awardStock.money.show();
                    awardStock.stock.hide();
                    awardStock.subType.show();
                });
            });

            $update.click(function () {

                com.popup4model('#layerAdd1', '奖品更新', function () {
                    awardStock.asid = v.asId;
                    awardStock.flag = 4;
                }, null, function(){
                    com.cleanItems(awardStock.items);

                    awardStock.items.no.val(v.no).attr('disabled', 'disabled');
                    awardStock.items.name.val(v.name).attr('disabled', 'disabled');
                    awardStock.items.num.val(v.num).attr('disabled', 'disabled');
                    awardStock.items.format.val(v.format);
                    awardStock.items.content.val(v.content);
                    awardStock.items.storeroom.val(v.storeroom);
                    awardStock.items.type.val(v.type);
                    awardStock.items.subtype.val(v.subtype);
                    awardStock.items.isStock.val(v.isStock);

                    awardStock.items.type.attr('disabled', 'disabled');

                    awardStock.moneys.hide();
                });

            });

            $inventory.click(function(){
                if(v.isStock == 1){
                    com.showAlert(com.warning, "此商品禁止盘点!");
                    return false;
                }

                com.popup4model('#layerAdd2', '盘点', function () {
                    awardStock.asid = v.asId;
                    awardStock.num = v.num;
                    awardStock.flag = 1;
                }, null, function(){
                    com.cleanItems(awardStock.items);

                    awardStock.items.no2.val(v.no).attr('disabled', 'disabled');
                    awardStock.items.name2.val(v.name).attr('disabled', 'disabled');
                    awardStock.items.nownum.val(v.num);

                    awardStock.join.hide();
                    awardStock.leave.hide();
                    awardStock.money.hide();
                    awardStock.stock.show();
                    awardStock.subType.hide();
                });
            });

            $record.click(function(){
                params["asid"] = v.asId;

                com.popup4page('#stockRecordPopUp', "views/information/stockRecord.html", "奖品纪录");
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

    var awardStockSeacher = new Searcher();
    awardStockSeacher.init( ['information-award-no', 'information-award-name', 'information-awardStock-type', 'information-awardStock-subtype', 'information-awardStock-room'], "condList", api.information.pageAwardStock, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "pageAwardPostData", null, false, null, function() {
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addAwardStock').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];

    },'resultList');
    
    com.focusPage("#addAwardStock").click(function(){


        com.popup4model('#layerAdd1', '添加奖品', function(){
            com.cleanItems(awardStock.items);

            awardStock.moneys.show();

            awardStock.items.no.removeAttr('disabled');
            awardStock.items.name.removeAttr('disabled');
            awardStock.items.num.removeAttr('disabled');
            awardStock.items.type.removeAttr('disabled');
            awardStock.items.storeroom.removeAttr('disabled');
            awardStock.items.subtype.removeAttr('disabled');

            awardStock.flag = 0;
        });
    });

    function changeStatus(asid, status){
        
        com.post(api.information.updateAwardStockForStatus, {
            "awardStock.asId": asid,
            "awardStock.status": status
        }, function(){
            
            com.showAlert(com.info, "操作成功");
            com.closePopup();
            awardStockSeacher.doSearch();
        });
    }

    function saveData(){

        if(com.validate('redact')) {
            return false;
        }
        var url = null;
        var options = {
            "awardStock.content": awardStock.items.content.val(),
            "awardStock.isPrefor": awardStock.items.isPrefor.val(),
            "awardStock.isStock": awardStock.items.isStock.val(),
            "awardStock.isPayment": awardStock.items.isPayment.val(),
            "awardStock.storeroom": awardStock.items.storeroom.val(),
            "awardStock.subtype": awardStock.items.subtype.val(),
            "awardStock.format": awardStock.items.format.val()
        };
        switch (awardStock.flag) {
            case 0:
                url = api.information.addAwardStock;
                options["awardStock.no"] = awardStock.items.no.val();
                options["awardStock.name"] = awardStock.items.name.val();
                options["awardStock.type"] = awardStock.items.type.val();
                options["awardStock.num"] = awardStock.items.num.val();
                options["awardStock.price"] = awardStock.items.price.val();
                break;
            case 4:
                url = api.information.updateAwardStock;
                options["awardStock.asId"] = awardStock.asid;
                break;
        }

        com.post(url, options, function(){
            com.closePopup();
            awardStockSeacher.doSearch();
        })

    }

    function updateData(){

        if(com.validate('checkstorer')) {
            return false;
        }

        var url = null;
        var options = {
            "awardStock.asId": awardStock.asid,
            "awardStock.content": awardStock.items.comment.val()
        };

        switch (awardStock.flag) {
            case 1:
                url = api.information.checkAwardStock;
                options["awardStock.num"] = awardStock.items.nownum.val();
                break;
            case 2:
                url = api.information.updateAwardStockForXG;
                options["awardStock.num"] = awardStock.items.warehousend.val();
                options["awardStock.price"] = awardStock.items.price2.val();
                options["awardStock.subtype"] = awardStock.items.awardRecordSubtype.val();
                break;
            case 3:
                url = api.information.updateAwardStockForCG;
                options["awardStock.num"] = awardStock.items.warehousing.val();
                options["awardStock.price"] = awardStock.items.price2.val();
                options["awardStock.subtype"] = awardStock.items.awardRecordSubtype.val();
                break;
        }

        com.post(url, options, function(){
            com.closePopup();
            awardStockSeacher.doSearch();
        })

    }

});
