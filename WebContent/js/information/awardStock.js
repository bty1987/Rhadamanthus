
$(function(){
    var storeroom = {};
    var subtype = {};
    var type = {};
    var recordSubtype = {};
    var awardStock = {
        awardStockItems : {
            no : com.focusPage("#no"),
            name : com.focusPage("#name"),
            num : com.focusPage("#num"),
            type : com.focusPage("#type"),
            storeroom : com.focusPage("#storeroom"),
            subtype : com.focusPage("#subtype"),
            price : com.focusPage("#price"),
            content : com.focusPage("#content"),
            format : com.focusPage("#format"),
            Warehousing : com.focusPage("#Warehousing"),
            Warehousend : com.focusPage("#Warehousend"),
            no2 : com.focusPage("#no2"),
            name2 : com.focusPage("#name2"),
            nownum : com.focusPage("#nownum"),
            isPrefor  : com.focusPage("#isPrefor"),
            isStock :  com.focusPage("#isStock"),
            isPayment :  com.focusPage("#isPayment"),
            price2 :  com.focusPage("#price2"),
            awardRecordSubtype: com.focusPage("#awardRecordSubtype")
        }
    };

    com.post(api.ds.information, {}, function (res) {
        awardStock.awardStockItems.storeroom.bindData(res.awardStoreRoom, "key", "value", false);
        awardStock.awardStockItems.subtype.bindData(res.awardSubtype, "key", "value", false);
        awardStock.awardStockItems.type.bindData(res.awardStockType, "key", "value", false);
        awardStock.awardStockItems.isPrefor.bindData(res.isPreforType, "key", "value", false);
        awardStock.awardStockItems.isStock.bindData(res.isStockType, "key", "value", false);
        awardStock.awardStockItems.isPayment.bindData(res.isPaymentType, "key", "value", false);
        awardStock.awardStockItems.awardRecordSubtype.bindData(res.awardRecordSubtype, "key", "value", false);

        $.each(res.awardStoreRoom,function(i,v){
            storeroom[v.key]=v.value;
        });
        
        $.each(res.awardSubtype,function(i,v){
        	subtype[v.key]=v.value;
        });
        
        $.each(res.awardStockType,function(i,v){
            type[v.key]=v.value;
        })

        $.each(res.awardRecordSubtype,function(i,v){
            recordSubtype[v.key]=v.value;
        });
    },null,false);

    var displayFunc  = (function(){
        /*表格样式*/
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

        /*表格头*/
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
        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col12');
            var propertyArr = [
                [v.no,'grey'],
                [v.name,'grey'],
                [v.num,'grey'],
                [type[v.type],'grey'],
                [subtype[v.subtype] , "grey"],
                [v.content,'grey'],
                [storeroom[v.storeroom] , "grey"],
                [v.format,'grey'],
                [v.status =="0" ? "启用" : "禁用",'red'],
                [v.isStock=="0" ? "加入库存" : "不加入库存",'red'],
                [v.isPrefor=="0" ? "计算业绩" : "不计算业绩",'red'],
                [v.isPayment=="0" ? "计入金额" : "不计入金额",'red']

            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
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
                startStatus(v.asId, v.status, function(){
                    layer.closeAll();
                    com.showAlert(com.info,"启用成功");
                });
            });

            /*状态禁用*/
            $btnBan.click(function(){
                stopStatus(v.asId, v.status, function(){
                    layer.closeAll();
                    com.showAlert(com.info,"禁用成功");
                });
            });

            $warehousend.click(function(){
                if(v.isStock == 1){
                    com.showAlert(com.warning, "此商品禁止出库!");
                    return
                }
                com.cleanItems(awardStock.awardStockItems);
                editBrand2(v);
                editReadOnly2();
                com.focusPage("#join").hide();
                com.focusPage("#stock").hide();
                com.focusPage("#money").show();
                com.focusPage("#leave").show();
                com.focusPage("[for=awardRecordSubtype]").show();
                awardStock.awardStockItems.awardRecordSubtype.show();
                com.focusPage("#awardRecordSubtype option:eq(0)").attr("selected",false);
                com.focusPage("#awardRecordSubtype option:eq(1)").attr("selected",true);
                com.focusPage("#awardRecordSubtype option:odd").show();
                com.focusPage("#awardRecordSubtype option:even").hide();
                openlayer(function(index, layero){
                    if(com.validate('checkstorer'))
                        return;
                    updateDataEnd(v, function(){
                        layer.closeAll();
                    });
                },2);
            });

            $warehousing.click(function(){
                if(v.isStock == 1){
                    com.showAlert(com.warning, "此商品禁止入库!");
                    return
                }

                com.cleanItems(awardStock.awardStockItems);
                editBrand2(v);
                editReadOnly2();
                com.focusPage("#leave").hide();
                com.focusPage("#stock").hide();
                com.focusPage("#money").show();
                com.focusPage("#join").show();
                com.focusPage("[for=awardRecordSubtype]").show();
                awardStock.awardStockItems.awardRecordSubtype.show();
                com.focusPage("#awardRecordSubtype option:eq(1)").attr("selected",false);
                com.focusPage("#awardRecordSubtype option:eq(0)").attr("selected",true);
                com.focusPage("#awardRecordSubtype option:odd").hide();
                com.focusPage("#awardRecordSubtype option:even").show();
                openlayer(function(index, layero){
                    if(com.validate('checkstorer'))
                        return;
                    updateDataIng(v, function(){
                        layer.closeAll();
                    });
                },2);
            });

            $update.click(function () {
                editBrand1(v);
                openlayer(function(index, layero){
                    if(com.validate('redact'))
                        return;
                    updateAll(v, function(){
                        layer.closeAll();
                    });
                },1);

            });
            $inventory.click(function(){
                if(v.isStock == 1){
                    com.showAlert(com.warning, "此商品禁止盘点!");
                    return
                }
                com.cleanItems(awardStock.awardStockItems);
                editBrand2(v);
                editReadOnly2();
                com.focusPage("[for=awardRecordSubtype]").hide();
                awardStock.awardStockItems.awardRecordSubtype.hide();
                com.focusPage("#join").hide();
                com.focusPage("#leave").hide();
                com.focusPage("#money").hide();
                com.focusPage("#stock").show();
                openlayer(function(index, layero){
                    if(com.validate('checkstorer'))
                        return;
                    updateData(v, function(){
                        layer.closeAll();
                    });
                },2);
            });

            $record.click(function(){
                openView(v.asId)
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

    /*分页*/
    var _condArr = ['prizeName','prizeNo','awardStockType','awardStoreRoom'];
    var awardStockSeacher = new Searcher();
    awardStockSeacher.init( _condArr, "condList", api.information.pageAwardStock, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "pageAwardPostData", null, false, null, function() {
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            com.cleanItems(awardStock.awardStockItems);
            RemoveEditReadOnly1();
            openlayer(function(index, layero) {
                if (com.validate('redact'))
                    return;
                saveData(function () {
                    layer.closeAll();
                });
            },1);
        });
        return [$adda];
    },'resultList');

    function openView (asid) {
        var $popup = $('#stockRecordPopUp');
        $popup.attr({'data-asid': asid});
        $popup.css({'overflow': 'hidden'});
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title:"奖品记录",
            content: $popup,
            area: ["80%", ( $(window).height() * 0.84 < 720 ? $(window).height() * 0.84 : 600) + "px"],
            zIndex: 9999,
            btn: ['确定'],
            success: function (layer, index) {
                $popup.load("views/information/stockRecord.html");
            },
            end: function () {
                $popup.attr({'data-asid': null});
                $popup.empty();
                awardStockSeacher.doSearch();
            }
        });
    }

    function openlayer(callback,variable){
        layer.closeAll();
        layer.open({
            type: 1,
            title:" ",
            content: com.focusPage('#layerAdd'+ variable),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
            },
            btn2: function(index, layero){
                com.clearValidator();
                //按钮【按钮二】的回调
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    /*状态信息验证*/
    function startStatus(id, status, callback){
        if(status == "1"){
            com.post(api.information.updateAwardStockForStatus,{
                "awardStock.asId" : id,
                "awardStock.status" : 0
            },function(){
                callback();
                awardStockSeacher.doSearch();
            });
        }else{
            com.showAlert(com.info,'已经启用');
        }
    }

    function stopStatus(id, status, callback){
        if(status == "0"){
            com.post(api.information.updateAwardStockForStatus,{
                "awardStock.asId" : id,
                "awardStock.status" : 1
            },function(res){
                callback();
                awardStockSeacher.doSearch();
            });
        }else{
            com.showAlert(com.info,'已经禁用');
        }
    }
    /*添加信息*/
    function saveData(callback){

        var no = awardStock.awardStockItems.no.val();
        var name = awardStock.awardStockItems.name.val();
        var type = awardStock.awardStockItems.type.val();
        var storeroom = awardStock.awardStockItems.storeroom.val();
        var subtype = awardStock.awardStockItems.subtype.val();
        var num = awardStock.awardStockItems.num.val();
        var price = awardStock.awardStockItems.price.val();
        var content = awardStock.awardStockItems.content.val();
        var format = awardStock.awardStockItems.format.val();
        var isPrefor  = awardStock.awardStockItems.isPrefor.val();
        var isStock = awardStock.awardStockItems.isStock.val();
        var isPayment  = awardStock.awardStockItems.isPayment.val();
        com.post(api.information.addAwardStock, {
            "awardStock.no": no,
            "awardStock.name":name,
            "awardStock.type":type,
            "awardStock.storeroom":storeroom,
            "awardStock.subtype":subtype,
            "awardStock.num": num,
            "awardStock.price":price,
            "awardStock.content":content,
            "awardStock.format":format,
            "awardStock.isPrefor": isPrefor,
            "awardStock.isStock": isStock,
            "awardStock.isPayment": isPayment,
        }, function(res){
            callback();
            awardStockSeacher.doSearch();
        });
    }
    
    function updateAll(v, callback) {
        var content = awardStock.awardStockItems.content.val();
        var isStock = awardStock.awardStockItems.isStock.val();
        var storeroom = awardStock.awardStockItems.storeroom.val();
        var subtype = awardStock.awardStockItems.subtype.val();
        var format = awardStock.awardStockItems.format.val();
        var isPrefor = awardStock.awardStockItems.isPrefor.val();
        var isPayment = awardStock.awardStockItems.isPayment.val();
        com.post(api.information.updateAwardStock, {
            "awardStock.asId": v.asId,
            "awardStock.content":content,
            "awardStock.isPrefor": isPrefor,
            "awardStock.isStock": isStock,
            "awardStock.isPayment": isPayment,
            "awardStock.storeroom": storeroom,
            "awardStock.subtype": subtype,
            "awardStock.format": format
        }, function(res){
            callback();
            awardStockSeacher.doSearch();
        });
        
    }

    function updateDataEnd(v, callback){
        var warehousend = awardStock.awardStockItems.Warehousend.val();
        var price2 =  awardStock.awardStockItems.price2.val();
        com.post(api.information.updateAwardStockForXG, {
            "awardStock.asId": v.asId,
            "awardStock.num": warehousend,
            "awardStock.price":price2,
            "awardStock.subtype": awardStock.awardStockItems.awardRecordSubtype.val()
        }, function(res){
            callback();
            awardStockSeacher.doSearch();
        });
    }
    function updateDataIng(v, callback){
        var warehousing = awardStock.awardStockItems.Warehousing.val();
        var price2 =  awardStock.awardStockItems.price2.val();
        com.post(api.information.updateAwardStockForCG, {
            "awardStock.asId": v.asId,
            "awardStock.num": warehousing,
            "awardStock.price":price2,
            "awardStock.subtype": awardStock.awardStockItems.awardRecordSubtype.val()
        }, function(res){
            callback();
            awardStockSeacher.doSearch();
        });
    }

    function updateData(v, callback){
        var nownum = awardStock.awardStockItems.nownum.val();
        if(nownum != "" && nownum == v.num){
            layer.closeAll();
            return
        }
        var reg=/^([1-9]\d*|[0]{1,1})$/; //含0正整数
        if(reg.test(nownum)){
            com.post(api.information.checkAwardStock, {
                "awardStock.asId": v.asId,
                "awardStock.num": nownum
            }, function(res){
                callback();
                awardStockSeacher.doSearch();
            });
        }else{
            com.showAlert(com.warning, "请输入正确的盘点数量!");
            return
        }
    }

    function editBrand2(v){
        awardStock.awardStockItems.no2.val(v.no);
        awardStock.awardStockItems.name2.val(v.name);
        awardStock.awardStockItems.nownum.val(v.num)
    }

    function editReadOnly2() {
        var $layerAdd = com.focusPage('#layerAdd2');
        $layerAdd.find("#no2").attr('disabled', 'disabled');
        $layerAdd.find("#name2").attr('disabled', 'disabled');
    }

    function editBrand1(v){
        awardStock.awardStockItems.no.val(v.no);
        awardStock.awardStockItems.name.val(v.name);
        awardStock.awardStockItems.num.val(v.num);
        awardStock.awardStockItems.format.val(v.format);
        awardStock.awardStockItems.content.val(v.content);
        awardStock.awardStockItems.storeroom.val(v.storeroom);
        awardStock.awardStockItems.subtype.val(v.subtype);
        awardStock.awardStockItems.isStock.val(v.isStock);
        var $layerAdd = com.focusPage('#layerAdd1');
        $layerAdd.find("#no").attr('disabled', 'disabled');
        $layerAdd.find("#name").attr('disabled', 'disabled');
        $layerAdd.find("#num").attr('disabled', 'disabled');
        $layerAdd.find("#type").attr('disabled', 'disabled');
        com.focusPage("#moneys").hide();
    }

    function RemoveEditReadOnly1() {
        com.focusPage("#moneys").show();
        var $layerAdd = com.focusPage('#layerAdd1');
        $layerAdd.find('#no').removeAttr('disabled');
        $layerAdd.find('#name').removeAttr('disabled');
        $layerAdd.find('#num').removeAttr('disabled');
        $layerAdd.find('#type').removeAttr('disabled');
        $layerAdd.find('#storeroom').removeAttr('disabled');
        $layerAdd.find('#subtype').removeAttr('subtype');
    }

});
