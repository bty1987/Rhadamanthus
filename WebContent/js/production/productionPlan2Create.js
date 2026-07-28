$(function(){

    var productionPlan = {

        saveBtn: com.focusPage("#saveBtn"),
        finishSaveBtn: com.focusPage("#finishSaveBtn"),

        modals: {
            productionPlanCrateModal: com.focusPage("#productionPlanCrateModal"),
            productionPlanFinishModal: com.focusPage("#productionPlanFinishModal"),
            layerImport: com.focusPage("#layerImport"),
        },

        items: {
            timeLimit: com.focusPage("#timeLimit"),
        },
        _items: {
            num: com.focusPage("#num"),
        },

        editFlg: true,

        productionData : {
            pid: params.pid,
            status: params.status
        },
        ppid: null,
        differentiate: false,
    }

    productionPlan.saveBtn.bindClick(saveData);
    productionPlan.finishSaveBtn.bindClick(finishDate);

    productionPlan.modals.productionPlanCrateModal.on("hide.bs.modal", function () {
        com.cleanItems(productionPlan.items);
        com.closeTip();
    });

    productionPlan.modals.productionPlanFinishModal.on("hide.bs.modal", function () {
        com.cleanItems(productionPlan._items);
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

            var $btnSub = $('<a></a>').addClass('btn btn-minier btn-yellow').html('子项');
            var $btnPrograss = $('<a></a>').addClass('btn btn-minier btn-success').html('生产进度');
            var $btnUpload = $('<a></a>').addClass('btn btn-minier btn-warning').html('上传');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-inverse').html('完结');

            var remainDate = productionUtils.dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
            var remainDay = 0 ;  //显示剩余工期

            if(v.status == constant.production().productionPlan.STATUS_FINISH_INT){
                remainDay = "订单已结束";
            }else if(remainDate < 0){
                remainDay = "已超过期限"+Math.abs(remainDate)+"天";
            }else {
                remainDay = "剩余工期"+Math.abs(remainDate)+"天"
            }

            var propertyArr = [
                ["生产单号:", v.production.pno, "blue"],
                ["装修单号:", v.production.orderId, "blue"],
                ["楼盘地址:", v.production.house.village.name + " " + v.production.house.houseNumber, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["完结时间:", v.finishTime == null ? "订单未完结" : v.finishTime, "green"],
                ["状态:", constant.production().productionPlan.status.keys[v.status], "red"],
                ["工期:", v.timeLimit, "green"],
                ["剩余时间:",remainDay,(remainDate < 5 ? "red":"green")],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            v.status == constant.production().productionPlan.STATUS_CREATE_INT ?
                $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload).append($btnFinish) :
                $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload);
            $h3.append($title).append($btnDiv);

            $liLine.append($h3).append($ulProperty);

            $btnSub.click(function () {
                params["productionPlan.ppid"] = v.ppid;
                params["productionPlan.status"] = v.status;
                params.productionStatus = productionPlan.productionData.status
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
                    com.focusPage('#importProductionPlanExcel').addClass('hide');
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
                        searcher();
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
                if(!listData.length){
                    var $resultList = com.focusPage('#' + tableId).addClass('dz-default dz-message').html('');
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                    return $resultList;
                }else{
                    com.focusPage('#' + tableId).html(null);
                    renderList(tableId,listData);
                }
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    function searcher () {
        com.post(api.production.queryProductionPlanByPid, {"productionPlan.production.pid": productionPlan.productionData.pid}, function(data){
            displayFunc.init('planCreateResultList', data.productionPlans);
        },null ,false);
    }

    searcher();//执行分页

    com.focusPage("#confirmBtn").click(function(){
        productionPlan.modals.layerImport.modal("hide");
    });

    com.focusPage("#back").click(function () {
        com.switchPage(api.index.productionIndex.url);
    });

    com.focusPage("#addPlan").click(function() {
        productionPlan.modals.productionPlanCrateModal.modal("show");
    });

    function finishDate() {
        if (com.validate('productionPlanFinishModal')) {
            return false;
        }

        var options = {
            "productionPlan.ppid": productionPlan.ppid,
            "productionPlan.num": productionPlan._items.num.val(),
        }

        com.post(api.production.finishProductionPlan, options, function(){
            com.showAlert(com.info, "操作成功");
            searcher();
        });

        productionPlan.modals.productionPlanFinishModal.modal("hide");
    }

    function saveData() {

        var status = productionPlan.productionData.status;

        if (com.validate('productionPlanCrateModal')) {
            return false;
        } else if (status == 6 && status == 7) {
            return false;
        }

        var options = {
            "productionPlan.production.pid":  productionPlan.productionData.pid,
            "productionPlan.timeLimit" : productionPlan.items.timeLimit.val(),
        }

        com.post(api.production.addProductionPlan, options, function(){
            com.showAlert(com.info, "操作成功");
            searcher();
        });

        productionPlan.modals.productionPlanCrateModal.modal("hide");
    }

    if (productionPlan.productionData.status != 2) {
        com.focusPage("#addPlan").addClass('hide');
    }
});