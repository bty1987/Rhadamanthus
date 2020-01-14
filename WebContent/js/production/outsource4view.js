$(function(){
    var outsource = {

        tranpackBtn : com.focusPage("#tranpackBtn"),

        modals: {
            tranpackModal : com.focusPage("#tranpackModal"),
            layerImportModal: com.focusPage("#layerImportModal")
        },
        items : {
            num : com.focusPage("#num")
        },
        editFlg : true,
        outsourceStatus : {},
        pid : params["pid"],
        status : params["status"]
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

    outsource.tranpackBtn.bindClick(endStatus);

    outsource.modals.tranpackModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(outsource.items);
    });

    com.post(api.ds.production, {}, function (res) {
        outsource.outsourceStatus = res.outsourceStatus.split("key", "value");
    },null, false);

    var displayFunc = (function(){

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

        var  creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue') .html(v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnChild = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('外协项');
            var $btnimport = $('<a></a>').addClass(' btn btn-minier btn-success').html('图表');
            var $btnReceipt = $('<a></a>').addClass(' btn btn-minier btn-warning').html('审核');
            var $btnConfirm = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('确认');
            var $btnEnd = $('<a></a>').addClass(' btn btn-minier btn-danger').html('完结');
            var $btnaBolition = $('<a></a>').addClass(' btn btn-minier btn-pink').html('废除');

            var remainDate = productionUtils.dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
            var remainDay = 0 ;  //显示剩余工期

            if(v.status == 3 || v.status == 4){
                remainDay = "订单已结束";
            }else if(remainDate < 0){
                remainDay = "已超过期限"+Math.abs(remainDate)+"天";
            }else {
                remainDay = "剩余工期"+Math.abs(remainDate)+"天"
            }

            var propertyArr = [];

            $.each(pageConfig.propertyArr, function (pi, pv) {
                switch (pv) {
                    case "productionNo":
                        propertyArr.push(["生产单号:",v.production.pno,"blue"]);
                        break;
                    case "orderId":
                        propertyArr.push(["装修单号:", v.production.orderId, "blue"]);
                        break;
                    case "address":
                        propertyArr.push(["楼盘地址:", v.production.house.village.name + " " + v.production.house.houseNumber, "grey"]);
                        break;
                    case "creater":
                        propertyArr.push(["创建人:", v.creater.userName, "grey"]);
                        break;
                    case "supplier":
                        propertyArr.push(["厂商:",v.supplier.userName,"grey"]);
                        break;
                    case "createTime":
                        propertyArr.push(["创建时间:", v.createTime , "green"]);
                        break;
                    case "finishTime":
                        propertyArr.push(["结束时间:",v.finishTime,"green"]);
                        break;
                    case "status":
                        propertyArr.push(["状态:", outsource.outsourceStatus[v.status], "red"]);
                        break;
                    case "timeLimit":
                        propertyArr.push(["工期:", v.timeLimit, "green"]);
                        break;
                    case "remainingTime":
                        propertyArr.push(["订单剩余时间:",remainDay,(remainDate < 5 ? "red":"green")]);
                        break;
                    case "comment":
                        propertyArr.push(["说明:",v.comment,"grey"]);
                        break;
                }
            });

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $.each(pageConfig.pageBtn, function (k, b) {
                switch (b) {
                    case "btnOutItem"://外协项
                        $btnDiv.append($btnChild);
                        break;
                    case "btnImport"://图表
                        $btnDiv.append($btnimport);
                        break;
                    case "btnReceipt"://审核
                        if (v.status == 0) {
                            $btnDiv.append($btnReceipt);
                        }
                        break;
                    case "btnConfirm"://确认
                        if (v.status == 1) {
                            $btnDiv.append($btnConfirm);
                        }
                        break;
                    case "btnFinish"://完结
                        if (v.status == 2) {
                            $btnDiv.append($btnEnd);
                        }
                        break;
                    case "btnBolition"://废除
                        if ([0, 1, 2].indexOf(v.status) != -1) {
                            $btnDiv.append($btnaBolition);
                        }
                        break;
                }
                $h3.append($title).append($btnDiv);
            });

            $liLine.append($h3).append($ulProperty);

            $btnReceipt.click(function () {
                com.showConfirm("是否确认", function(){
                    updateStatus(v.oid,"1");
                });
            });

            $btnConfirm.click(function () {
                com.showConfirm("是否确认", function(){
                    updateStatus(v.oid,"2");
                });
            });

            $btnEnd.click(function () {
                com.showConfirm("是否确认完结", function(){
                    outsource.items.oid = v.oid;
                    outsource.modals.tranpackModal.modal("show");
                });
            });

            $btnaBolition.click(function () {
                com.showConfirm("是否确认废除", function(){
                    updateStatus(v.oid,"4");
                });
            });

            $btnimport.click(function () {

                outsource.modals.layerImportModal.modal("show").find(".infobox").remove();
                var $line = com.focusPage('#download');

                if(v.path){
                    productionUtils.createLine(v.path, v.no, $line)//显示文件与下载
                }

                com.focusPage('#importProductionPicture').removeClass('hide');

                if(v.status == 3 || v.status == 4 ){
                    com.focusPage('#importProductionPicture').addClass('hide');
                }

                com.uploadify("#importProductionPicture","添加上传文件",'btn btn-success col-sm-12',"*.xlsx","'uploadType': 2",1,function(data) {
                    var option = {
                        "outsource.oid": v.oid,
                        "outsource.path": data.resUrl
                    };
                    com.post(api.production.updateOutsource,option,function(res){
                        com.showAlert(com.info, "操作成功");
                        $line.find(".infobox").remove();
                        productionUtils.createLine(v.path, v.no, $line);
                        outsourceSearcher.doSearch();
                    });
                });
            });

            $btnChild.click(function () {
                params["oid"] = v.oid;
                params.outsourceStatus = v.status;
                params.productionStatus = outsource.status;
                com.popup4page('#outsourceViewPopUp',"views/production/outsourceItem.html","名称 : "+v.no);
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

    var outsourceSearcher = new Searcher();

    outsourceSearcher.init( pageConfig.condArr, "outsourceCondList", pageConfig.apiPage, function(data){
        displayFunc.init("outsourceResultList",data);
    }, "outsourcePagenation", pageConfig.postDataName, null, false, null,function(){},"outsourceResultList");

    function updateStatus(id,status){

        var url;

        switch (status) {
            case '1':
                url = api.production.passOutsource;
                break;
            case '2':
                url = api.production.confirmOutsource;
                break;
            case '4':
                url = api.production.deleteOutsource;
                break;
        }

        com.post(url, {"outsource.oid":id , "outsource.status": status},function(res){
            com.showAlert(com.info, "操作成功");
            outsourceSearcher.doSearch();
        });
    }

    function endStatus (){

        var options = {
            "outsource.production.pid":outsource.pid,
            "outsource.num" :outsource.items.num.val(),
            "outsource.oid" :  outsource.items.oid,
            "outsource.status" : "3"
        };

        com.post(api.production.finishOutsource,options,function(res){
            com.showAlert(com.info, "操作成功");
            outsourceSearcher.doSearch();
        });

        outsource.modals.tranpackModal.modal("hide");
    }

});