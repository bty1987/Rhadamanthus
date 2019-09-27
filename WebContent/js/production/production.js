$(function(){

    var production = {
        saveBtn : com.focusPage("#saveBtn"),
        cancelBtn : com.focusPage("#cancelBtn"),

        modals: {
            productionModal: com.focusPage("#productionModal")
        },

        items: {
            orderId : com.focusPage("#orderId"),
            orderAddr : com.focusPage("#orderAddr"),
            designer : com.focusPage("#designer"),
            timeLimit : com.focusPage("#timeLimit")
        },

        productionStatus: {},
        diliveryStatus: {},
        type: {},

        editFlg : true,
        productionPostData : {},
    };

    production.saveBtn.bindClick(saveData);

    production.modals.productionModal.on("hide.bs.modal", function(){
        com.cleanItems(production.items);
        com.closeTip();
    });

    com.initTypeahead('designer', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name": "设计部", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);

    var displayFunc  = (function() {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    creatLine(v).appendTo($ul);

                });

                $ul.appendTo($tableWrap);
            }
        };

        var  creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('clearfix item-orange');
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.pno);
            var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnsigned = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('签约');
            var $btndeliver = $('<a></a>').addClass(' btn btn-minier btn-success').html('送货');
            var $btnAfter = $('<a></a>').addClass(' btn btn-minier btn-warning').html('售后');
            var $btnconfirm = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('核对');
            var $btnquote = $('<a></a>').addClass(' btn btn-minier btn-danger').html('报价');
            var $btnPlan = $('<a></a>').addClass(' btn btn-minier btn-pink').html('计划');
            var $btnHard = $('<a></a>').addClass(' btn btn-minier btn-purple').html('五金');
            var $btnOut = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('外协');
            var $btnBind = $('<a></a>').addClass(' btn btn-minier btn-success').html('绑定');
            var $btnAbandon = $('<a></a>').addClass(' btn btn-minier btn-warning').html('废弃');
            var $btnPicture = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('图纸');

            com.post(api.ds.production, {}, function (res) {
                production.productionStatus = res.productionStatus.split("key", "value");
                production.diliveryStatus = res.diliveryStatus.split("key", "value");
                production.type = res.productionType.split("key", "value");
            });

            var remainDate = dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
            var remainDay = 0 ;  //显示剩余工期

            if(v.status == 4 || v.status == 5){
                remainDay = "订单已结束";
            }else if(remainDate < 0){
                remainDay = "已超过期限"+Math.abs(remainDate)+"天";
            }else {
                remainDay = "剩余工期"+Math.abs(remainDate)+"天"
            }

            var propertyArr = [
                ["装修单号:", v.orderId, "blue"],
                ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "blue"],
                ["创建人:", v.creater.userName, "grey"],
                ["创建时间:", v.createTime , "green"],
                ["设计师:", v.designer.userName, "grey"],
                ["确认时间:", v.confirmTime , "green"],
                ["拆单时间:", v.diliveryTime , "green"],
                ["订单状态:", production.productionStatus[v.status], "red"],
                ["送货状态:", production.diliveryStatus[v.diliverystatus], "red"],
                ["送货时间:", v.diliveryTime , "green"],
                ["总额:", v.total, "blue"],
                ["工期:", v.timeLimit, "green"],
                ["订单类型:", production.type[v.type], "red"],
                ["父级生产单号:", (v.spid == 0 ? null: v.spid) , "blue"],
                ["订单剩余时间:",remainDay,(remainDate < 5 ? "red":"green")]
            ];

            $.each(propertyArr,function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').addClass(value[2]).html(value[1]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);

            $btnDiv.append($btnBind).append($btnquote).append($btnPlan)
                .append($btnHard).append($btnOut).append($btnPicture);

            if( v.status == 0 ){
                $btnDiv.append($btnsigned).append($btnAbandon);
            }else if( v.status == 1){
                $btnDiv.append($btnconfirm).append($btnAbandon);
            }else if( v.status == 2){
                $btnDiv.append($btnAbandon);
            } else if ( v.status == 3 && v.diliverystatus == 0){
                $btnDiv.append($btndeliver).append($btnAfter).append($btnAbandon);
            }else if ( v.status == 3 && v.diliverystatus == 1){
                $btnDiv.append($btnAfter).append($btnAbandon);
            }

            $h3.append($title).append($btnDiv);

            $btnsigned.click(function(){
                com.showConfirm("是否确认签约", function(){
                    com.post(api.production.updateProductionForStatus, {"production.pid": v.pid, "production.status": 1}, function (res) {
                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnconfirm.click(function(){
                com.showConfirm("是否确认进入流转", function(){
                    com.post(api.production.updateProductionForStatus, {"production.pid": v.pid, "production.status": 2}, function () {
                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnAbandon.click(function(){
                com.showConfirm("是否确认废弃", function(){
                    com.post(api.production.updateProductionForStatus, {"production.pid": v.pid, "production.status": 4}, function () {
                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btndeliver.click(function(){
                com.showConfirm("是否确认送货", function(){
                    com.post(api.production.updateProductionForDeliveryStatus, {"production.pid": v.pid, "production.diliverystatus": 1}, function () {
                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnAfter.click(function(){

                production.editFlg = false;

                production.items.orderId.val(v.orderId);
                production.items.orderAddr.val(v.house.village.name+"  "+v.house.houseNumber);
                production.items.designer.val(v.designer.userName);
                production.items.hid = v.house.hid;
                production.items.designer.userId = v.designer.userId;
                production.items.type = 1;
                production.items.spid = v.pno;
                production.items.total = 0;
                production.items.timeLimit.val();

                production.modals.productionModal.modal("show");
            });

            $btnBind.click(function () {
                transferData = {};
                transferData.pid = v.pid;
                transferData.status = v.status;
                transferData.orderId = v.orderId;
                params["transferData"] = transferData;

                com.switchPage(api.index.productionSalesIndex.url);

            });

            $btnquote.click(function(){
                params["pid"] = v.pid;
                params["status"] = v.status;
                params["address"] = v.house.village.name + " " + v.house.houseNumber;

                com.switchPage(api.index.puotationIndex.url);
            });

            $btnOut.click(function(){
                params["pid"] = v.pid;
                params["status"] = v.status;

                com.switchPage(api.index.outsourceIndex.url);
            });

            $btnHard.click(function(){
                params["pid"] = v.pid;
                params["status"] = v.status;

                com.switchPage(api.index.hardwareIndex.url);
            });

            $btnPlan.click(function(){
                params["pid"] = v.pid;
                params["status"] = v.status;

                com.switchPage(api.index.productionPlanIndex.url);
            });

            $btnPicture.click(function(){
                params["pid"] = v.pid;
                params["status"] = v.status;

                com.switchPage(api.index.productionPictureIndex.url);
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

    var _condArr = ["p_orderId","p_productionPNo","p_productionStatus"];

    var productionSearcher = new Searcher();

    productionSearcher.init( _condArr, "condList", api.production.pageProduction, function(data){
        displayFunc.init('resultList' ,data);
    }, "pagenation", "salesPostData", null, false, null,function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addProduction').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage("#addProduction").click(function() {
        production.editFlg = true;
        production.modals.productionModal.modal("show");
    });

    function saveData(){

        if (com.validate('productionModal')) {
            return false;
        }

        var options = {}
        if(production.editFlg) {
            options = {
                "production.type": 0,
                "production.spid": 0,
                "production.designer.userId": com.typeahead("designer"),
                "production.total": 0,
                "production.timeLimit": production.items.timeLimit.val(),
                "production.orderId": production.items.orderId.val(),
                "production.house.hid": production.productionPostData["production.house.hid"]
            };
        } else {
            options = {
                "production.type": production.items.type,
                "production.spid": production.items.spid,
                "production.designer.userId": production.items.designer.userId,
                "production.total": 0,
                "production.timeLimit": production.items.timeLimit.val(),
                "production.orderId": production.items.orderId.val(),
                "production.house.hid": production.items.hid
            };
        }

        com.post(api.production.addProduction ,options ,function(res){
            com.showAlert(com.info, "操作成功");
            productionSearcher.doSearch();
        });

        production.modals.productionModal.modal("hide");
    }

    com.focusPage("#orderId").on('change',(function () {

        var option = {
            "decoration.orderId" : production.items.orderId.val()
        };

        com.post(api.decoration.queryDecorationForCommonByOrderId,option,function (data) {
            production.items.orderAddr.val(data.decoration.house.village.name+"  "+data.decoration.house.houseNumber);
            production.productionPostData["production.house.hid"] = data.decoration.house.hid;
        });
    }));

    function dateDiffer(createTime,timeLimit){
        var currentDate,createDate,createDateList,unit,workingDate,remainDate;
        unit = utils.accMul(24,utils.accMul(3600,1000));//转换单位
        currentDate = new Date();
        createDateList = createTime.split("-");
        createDate = new Date(createDateList[1]+"-"+createDateList[2]+"-"+createDateList[0]);

        workingDate = parseInt( utils.accDiv(utils.accSub(currentDate,createDate),unit));
        remainDate = utils.accSub(timeLimit,workingDate);

        return remainDate;
    }

});
