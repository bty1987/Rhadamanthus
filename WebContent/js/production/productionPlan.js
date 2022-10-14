$(function(){

    var productionPlan = {

        finishSaveBtn: com.focusPage("#finishSaveBtn"),

        modals: {
            productionPlanFinishModal: com.focusPage("#productionPlanFinishModal"),
            layerImport: com.focusPage("#layerImport"),
        },

        items: {
            num: com.focusPage("#num"),
        },

        ppid: null,
        differentiate: true,
    }

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

    productionPlan.finishSaveBtn.bindClick(finishDate);

    productionPlan.modals.productionPlanFinishModal.on("hide.bs.modal", function () {
        com.cleanItems(productionPlan.items);
        com.closeTip();
    });


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

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnSub = $('<a></a>').addClass('btn btn-minier btn-yellow').html('计划项');
            var $btnPrograss = $('<a></a>').addClass('btn btn-minier btn-success').html('生产进度');
            var $btnUpload = $('<a></a>').addClass('btn btn-minier btn-warning').html('上传');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-inverse').html('完结');

            var remainDate = productionUtils.dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
            var remainDay = "";  //显示剩余工期

            if(v.status == 1){
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
                    case "createTime":
                        propertyArr.push(["创建时间:", v.createTime , "green"]);
                        break;
                    case "finishTime":
                        propertyArr.push(["完结时间:",v.finishTime,"green"]);
                        break;
                    case "status":
                        propertyArr.push(["状态:", v.status == 0 ? "初始" : "完结", "red"]);
                        break;
                    case "timeLimit":
                        propertyArr.push(["工期:", v.timeLimit, "green"]);
                        break;
                    case "remainingTime":
                        propertyArr.push(["订单剩余时间:",remainDay,(remainDate < 5 ? "red":"green")]);
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
                    case "btnPlanItem"://外协项
                        $btnDiv.append($btnSub);
                        break;
                    case "btnProgetass"://生产进度
                        $btnDiv.append($btnPrograss);
                        break;
                    case "btnUpload"://上传
                        $btnDiv.append($btnUpload);
                        break;
                    case "btnFinish"://完结
                        if (v.status == 0) {
                            $btnDiv.append($btnFinish);
                        }
                        break;
                }
                $h3.append($title).append($btnDiv);
            });

           $liLine.append($h3).append($ulProperty);

            $btnSub.click(function () {
                params["productionPlan.ppid"] = v.ppid;
                params["productionPlan.status"] = v.status;
                com.popup4page("#productionPlanPopUp", "views/production/productionPlanItem.html", "计划子项");
            });

            $btnPrograss.click(function () {
                params.differentiate = productionPlan.differentiate;
                params["productionPlan.ppid"] = v.ppid;
                params["productionPlan.status"] = v.status;
                com.switchPage(api.index.productionPlanDetailIndex.url);

            });

            $btnUpload.click(function(){

                //删除createLine画出来的上一个元素防止叠加
                productionPlan.modals.layerImport.modal("show").find('.infobox').remove();
                var $line = com.focusPage('#download');

                if(v.path){
                    productionUtils.createLine(v.path, v.no, $line);
                }

                com.focusPage('#importProductionPlanExcel').removeClass('hide');

                if(v.status == 1||v.status == 2){
                    com.focusPage("#importProductionPlanExcel").addClass('hide');
                }

                com.uploadify("#importProductionPlanExcel", "上传文件", api.common.uploadOther, 'btn btn-success blue ', "*.xlsx", {'uploadType': 2}, 1, function(data){

                    var option = {
                        "productionPlan.ppid": v.ppid,
                        "productionPlan.path": data.resUrl,
                        "productionPlan.filesize": data.filesize
                    };

                    com.post(api.production.updateProductionPlan,option,function(res){
                        com.showAlert(com.info, "操作成功");
                        $line.find(".infobox").remove();
                        productionUtils.createLine(v.path, v.no, $line);
                        searcher.doSearch();
                    });
                });
            });

            $btnFinish.click(function () {
                productionPlan.ppid = v.ppid;
                productionPlan.modals.productionPlanFinishModal.modal("show");
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

    var searcher  = new Searcher();

    searcher.init( pageConfig.condArr,'_condList', pageConfig.apiPage,function (data) {
        displayFunc.init('_resultList', data);
    },"_pagenation",pageConfig.postDataName,null,false,null,null,"_resultList");

    com.focusPage("#confirmBtn").click(function(){
        productionPlan.modals.layerImport.modal("hide");
    });

    function finishDate() {
        if (com.validate('productionPlanFinishModal')) {
            return false;
        }

        var options = {
            "productionPlan.ppid": productionPlan.ppid,
            "productionPlan.num": productionPlan.items.num.val(),
        }

        com.post(api.production.finishProductionPlan, options, function(){
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        productionPlan.modals.productionPlanFinishModal.modal("hide");
    }

});